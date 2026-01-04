// ==UserScript==
// @name         Twitch Midway Gateway
// @namespace    http://devinfra.internal.justin.tv/
// @version      0.1
// @description  Auto-renew token from Midway Gateway on XHR requests and perform background fetches every 5 minutes to avoid token timeout issues
// @author       hvr
// @match        https://git.xarth.tv/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433553/Twitch%20Midway%20Gateway.user.js
// @updateURL https://update.greasyfork.org/scripts/433553/Twitch%20Midway%20Gateway.meta.js
// ==/UserScript==

(function() {
    var method;
    var noop = function () {};
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

(function(window, undefined) {
    var $ = window.jQuery;
    var namespace = function() {
        window.Amazon = window.Amazon || {};
        window.Amazon.IDP = window.Amazon.IDP || {};
        window.Amazon.IDP.config = window.Amazon.IDP.config || {};
        window.Amazon.IDP.internal = window.Amazon.IDP.internal || {};
        return window.Amazon.IDP;
    }();

    // A factory for the browser's native XHR. Initialize to a plain-old function returning a new XHR.
    // We'll overwrite appropriately later on in this function if we override the XHR.prototype (we usually do).
    var nativeXhrFactory = function() {
        return new XMLHttpRequest();
    };

    // A place to hold a user-defined blacklist that specifies domains that should be omitted from authentication checks.
    // If an Ajax call is being made to a domain in this blacklist, then performAuthenticationSteps should not be called.
    // This is useful in situations where you want to use OpenID for the most part, but there's one domain or two that you call
    // that doesn't use OpenID authentication, and for your purposes you want to avoid 404s to /sso/login of that domain.
    // Properties:
    // -domains: an array of domains the client has elected to omit from authentication. Of the form "foo.amazon.com[:port]".
    // -matchesUrl: function(url) -> true/false. Check if the domain for the given URL is in the blacklist.
    var domainBlacklist = function() {
        var self = {domains: []};
        var cfg = Amazon.IDP.config.excludeDomains;
        if (cfg && (cfg instanceof Array)) {
            self.domains = cfg;
        }
        self.matchesUrl = function(url) {
            if (self.domains.length == 0) { return false; }
            var domain = getUrlProperties(url).host; //.host returns the hostname + port
            for (var i = 0; i < self.domains.length; i++) { // Looping through instead of using indexOf since IE8 does not support it.
                                                            // List should be small enough that doing this does cause a performance problem.
                if (domain == self.domains[i]) {
                    return true;
                }
            }
            return false;
        };
        return self;
    }();

    // A placeholder for a user-defined function that decides whether a call should be authenticated or not.
    // This is meant to be a catch-all for any esoteric cases where a client needs to exclude certain paths/urls/calls/etc
    // from authentication, but defaultOff and domainBlacklist won't satisfy their use case. So they can hook in here and
    // decide if they want to cancel authentication given the arguments provided to XMLHttpRequest.open().
    // Amazon.IDP.config.shouldAuthenticate = function(xhrArgs) : return true/false, where xhrArgs is an array of arguments
    // passed into xhr.open();
    var shouldAuthenticateHook = function() {
        var cfg = Amazon.IDP.config.shouldAuthenticate;
        if (cfg && typeof(cfg) == "function") {
            return cfg;
        }
        return function() { return true; };
    }();

    // A cache to store the authentication result and TTL, keyed by domain.
    // The idea is that the /sso/login endpoint can include the validity period
    // of the token/rfp cookies within an is_authenticated = true response.
    // By storing that result we won't need to call /sso/login for subsequent
    // calls during the validity period. This should save us a round-trip for
    // most of the time, meaning that the vast majority of Ajax calls should
    // consist of a single round-trip. Cache is cleared on every page load.
    var authCache = createCache(5*60*1000); // Use a 5 minute padding (expressed in millis)

    // Create a new cache.
    // If paddingMillis is provided, then the TTL stored in the cache
    // will be paddingMillis milliseconds less than the actual expiryTime.
    // This is intended to avoid race-conditions between the time the cache is checked and the time
    // the request is received on the server.
    function createCache(paddingMillis) {
        var self = {};
        var cache = {}; // Map associating endpoints and their cookie expiry times (unix epoch)

        if (!paddingMillis) {
            paddingMillis = 0;
        }

        // Return true if the stored TTL for the given endpoint is later than the current time.
        // Return false otherwise, or if there is no such TTL.
        self.isAuthenticated = function(endpoint) {
            var expiryTime = cache[endpoint];
            if (!expiryTime) {
                return false;
            }
            var now = new Date().getTime();
            return now < expiryTime;
        };

        // Put a TTL for a given endpoint.
        self.put = function(endpoint, expiryTime) {
            if (typeof(expiryTime) != "number") {
                expiryTime = parseInt(expiryTime);
                if (isNaN(expiryTime)) {
                    throw "expiryTime must be a valid unix epoch";
                }
            }

            cache[endpoint] = expiryTime - paddingMillis;
        };

        return self;
    }

    // Utility method to make an AJAX call via the browser's native XHR.
    // Accepts the following options:
    // url: string (required),
    // success(token, textStatus, xhr): callback - Called when the XHR response is 200. Default handler does nothing.
    // error(xhr, textStatus, errorThrown): callback - Called when the XHR response is not 200. Default handler throws an exception.
    function nativeXhrCall(options) {
        var url = options.url;
        // Need to use XHR directly, since jQuery.ajax adds headers that cause preflighting,
        // which fails in some browsers, i.e., IE (see what I did there?)
        var xhr = nativeXhrFactory();
        var DONE = xhr.DONE || 4;

        // Set up the callback
        var cbSuccess = options.success || function() {}; // No-op if no success callback
        var cbError = options.error || defaultXhrErrback; // Default error function bubbles up the exception
        var complete = false;
        xhr.onreadystatechange = function() {
            if (complete) {
                return;
            }
            // Wait until done.
            if (xhr.readyState != DONE) {
                return;
            }
            complete = true;
            if (xhr.status == 200) {
                // Success, and the response body is the token, so pass it to the callback.
                cbSuccess(xhr.responseText, xhr.statusText, xhr);
            } else {
                // Something went wrong, so call the error handler
                cbError(xhr, xhr.statusText, null);
            }
        };

        // Make the request
        try {
            xhr.open("GET", url);
            xhr.withCredentials = true;
            xhr.send();
        } catch (e) {
            cbError(xhr, xhr.statusText, e);
        }

    }

    // A handy utility method that can act as the default error handler
    // for an XHR if none was provided by the user
    function defaultXhrErrback(xhr, textStatus, errorThrown) {
        if (errorThrown) {
            throw errorThrown;
        }
        throw {message: "XHR call returned with non-200 status code", xhr: xhr};
    }

    // Calls the RFP API in the Relying Party to populate amzn_sso_rfp token and validate id_token.
    // Options:
    // -url: string (required)
    // -success(payload): callback (required) - payload is the response from the RFP call
    // -error(xhr, textStatus, errorThrown) - thrown on non-200 response. Expect this to be triggered since we
    //                                      - may be calling servers that are not using OpenID and will
    //                                      - respond with 404. We want to handle this gracefully.
    function callRfpEndpoint(options) {
        var url = options.endpoint + "/sso/login";
        if (options.token) {
            url = url + "?id_token=" + options.token;
        }

        debouncedXhrCall({
            url: url,
            success: function(data, status, jqXHR) {
                    // if response is a JSON string, parse into an object
                    // Otherwise assume it's an object
                    if (typeof(data) == "string") {
                        options.success(JSON.parse(data));
                    } else {
                        options.success(data);
                    }
                },
            error: options.error
        });
    }

    // Delegates to nativeXhrCall, but will piggyback on the result of
    // an already outstanding duplicate request if one exists. Note that
    // this supports a very limited number of options compared to the
    // native XHR)
    // url: string (required),
    // success(token, textStatus, xhr): callback - Called when the XHR response is 200. Default handler does nothing.
    // error(xhr, textStatus, errorThrown): callback - Called when the XHR response is not 200. Default handler throws an exception.
    // debounceKey: string (optional) the key used to club requests together. Defaults to url if not provided.
    function debouncedXhrCall(options) {
        var debounceKey = options.url;
        if (options.debounceKey) {
            debounceKey = options.debounceKey;
        }

        var inflightRequest = debounceableRequests[debounceKey];

        var cbSuccess = options.success || function() {};
        var cbError = options.error || defaultXhrErrback;

        // If there is an existing in-flight request, debounce to it
        if (inflightRequest) {
            inflightRequest.successCallbacks.push(cbSuccess);
            inflightRequest.errorCallbacks.push(cbError);
            return;
        }

        // There is no pre-existing request, so bootstrap the in-flight bookkeeping
        inflightRequest = {
            successCallbacks: [cbSuccess],
            errorCallbacks: [cbError]
        };
        debounceableRequests[debounceKey] = inflightRequest;

        // Helper to create a master callback that safely fans out to multiple child
        // callbacks. It also de-registers the request's in-flight bookkeeping. If a
        // child callback throws an error, it will defer throwing the error until
        // all other child callbacks have been called. If multiple child callbacks
        // throw an error, the resulting thrown error object is the array of deferred
        // errors, rather than just one error.
        var createFanoutCallback = function(callbacks) {
            return function() {
                // Success or fail, the request is done
                delete debounceableRequests[debounceKey];

                var callbackErrors = [];
                for (var i = 0; i < callbacks.length; i++) {
                    var callback = callbacks[i];
                    try {
                        callback.apply(this, arguments);
                    }
                    catch (e) {
                        callbackErrors.push(e);
                    }
                }
                if (callbackErrors.length === 1) {
                    throw callbackErrors[0];
                } else if (callbackErrors.length > 1) {
                    throw callbackErrors;
                }
            };
        };

        nativeXhrCall({
            url: options.url,
            success: createFanoutCallback(inflightRequest.successCallbacks),
            error: createFanoutCallback(inflightRequest.errorCallbacks)
        });
    }
    var debounceableRequests = {};

    // Utility function for calling the IDP and retrieving the token
    // Accepts the following options:
    // idpUrl: string (required),
    // redirectUri: string (required) used for validation, doesn't actually redirect,
    // endpoint: string (required)
    // success(token, textStatus, xhr): callback,
    // error(xhr, textStatus, errorThrown): callback
    function callIdp(options) {
        // Make sure the idpUrl doesn't already have a redirect_uri parameter.
        // If it does, get rid of it, and replace it with the actual redirectUri
        var idpUrl = removeQueryParam(options.idpUrl, "redirect_uri");
        var encodedRedirectUri = encodeURIComponent(options.redirectUri);

        idpUrl = appendQueryParam(idpUrl, "redirect_uri", encodedRedirectUri);

        // Debounce based on the customer endpoint, since tokens are issued per
        // endpoint, not per something as specific as redirect_uri
        debouncedXhrCall({
            url: idpUrl,
            debounceKey: options.endpoint,
            success: options.success,
            error: options.error
        });
    }

    // Utility function for deconstructing a URL.
    // Need the client ID, which is the hostname[:port] of the url, and need absolute url.
    function getUrlProperties(url) {
        // Use the DOM to avoid having to use regex.
        var a = document.createElement('a');
        a.href = url;
        a.href = a.href; // I'm not kidding.
                         // a.href automatically expands out to the full URL, but in IE the other fields are not automatically updated
                         // so you get hostname="", protocol = ":", etc for a relative URL. But setting href to the full URL updates all
                         // the fields. Hence, this *ridiculous* statement bandages the IE issue.
        var host = (a.hostname + (a.port ? ":" + a.port : "")); // Can't just use a.host because IE sneaks in a :443 if there is no port number.
        var endpoint = a.protocol + "//" + host;
        var pathname = a.pathname || "";
        if (pathname && pathname[0] != "/") {
            // IE9.0 and below do not include the leading slash
            pathname = "/" + pathname;
        }
        return {
            absoluteUrl: a.href, // Turns a relative URL into an absolute one.
            host: host,
            endpoint: endpoint,
            base: endpoint + pathname,
            query: a.search,
            fragment: a.hash
        };
    }

    // Given a url and query parameter, return the url with all occurrences of the query parameter removed, if it is present.
    // Otherwise return the url unaltered.
    function removeQueryParam(url, paramName) {
        var urlProps = getUrlProperties(url);
        if (!urlProps.query) {
            return url;
        }
        var parts = urlProps.query.split('&');
        if (parts[0].charAt(0) == "?") {
            parts[0] = parts[0].substring(1);
        }
        var remainingParts = new Array();
        for (var i = 0; i < parts.length; i++) {
            var p = parts[i];
            if (!p) {
                // Can happen with extraneous leading/trailing '&'s, or double ampersands
                continue;
            }
            var keyVal = p.split('=');
            if (keyVal[0] == paramName) {
                // Found the param we want to remove
                continue;
            }
            remainingParts.push(p);
        }

        var newQuery = "?" + remainingParts.join('&');
        return overwriteQueryStr(urlProps, newQuery);
    }

    // Return a url with the new query string. urlProps is unchanged.
    function overwriteQueryStr(urlProps, newQueryStr) {
        return urlProps.base + newQueryStr + urlProps.fragment;
    }

    // Append a query string parameter to a given query string. Return the resulting query string.
    function appendQueryParam(queryStr, queryParameter, queryValue) {
        var queryArg = queryParameter + "=" + queryValue;
        if (queryStr.indexOf("?") == -1) {
            return "?" + queryArg;
        } else {
            return queryStr + "&" + queryArg;
        }
    }

    // Append the query parameter to the URL defined by the output of getUrlProperties
    function appendQueryString(urlProps, queryParameter, queryValue) {
        var queryStr = appendQueryParam(urlProps.query, queryParameter, queryValue);
        return overwriteQueryStr(urlProps, queryStr);
    }

    // Take into account the case where T/F was return as a string in a JSON response, for example
    function isTrue(arg) {
        return arg == true || arg == "true";
    }

    // Return true if an XHR call, represented by "xhrArgs", should be authenticated via performAuthenticationSteps.
    // Return false otherwise.
    // params: xhrArgs - an array representing the input parameters to an XHR.open() call.
    // Currently a call should not be authenticated iff it is synchronous, since authentication may require a cross-domain
    // call to the IDP, which is forbidden for some browsers. Customers who use synchronous calls should turn on Amazon.IDP.config.periodicRefresh.
    function shouldAuthenticateCall(xhrArgs) {
        var isAsync = xhrArgs[2] == false ? false : true;
        var isBlacklisted = domainBlacklist.matchesUrl(xhrArgs[1]);
        var hookResult = shouldAuthenticateHook(xhrArgs) == false ? false : true;

        return isAsync && !isBlacklisted && hookResult;
    }

    // Function to encapsulate the steps in ensuring that the user will be successfully
    // authenticated to the RP, in other words
    // -Check the TTL cache to see if we already have a valid authentication against the given endpoint. If so, complete the original request.
    // -Otherwise, check the validity of the token cookie against /sso/login in the RP (+ get rfp cookie)
    // -If token cookie is not valid,
    // --Fetch a new token from the IDP
    // --Call /sso/login?id_token=token to have it added as a cookie. Update the cache with the returned TTL, if it is provided.
    // -Complete the original request
    // Params:
    // -url: string - the url of the RP where the request is being made
    // -success: function(String requestUrl) - called after all authN steps are completed successfully, where requestUrl
    //     is the new url where the request should be made.
    // -error: function(XMLHttpRequest xhr, String textStatus, String errorThrown) - called if there
    //     is an error while trying to call the IdP, where xhr is the XMLHttpRequest used,
    //     textStatus is the textStatus in the xhr, and errorThrown is the corresponding HTTP
    //     error text (or null)
    // Any unrecoverable errors will be thrown from this function. Otherwise, authentication failures
    // will just simply carry through to the request where a standard 401 would be returned from the RP.
    function performAuthenticationSteps(options, retrynum) {
        var MAX_RETRIES = 3;
        if (!retrynum) { retrynum = 0; }

        var url = options.url;
        var success = options.success;
        var error = options.error;

        var urlProps = getUrlProperties(url);

        // Check the cache to see if the authentication is still valid for the domain in question.
        if (authCache.isAuthenticated(urlProps.endpoint)) {
            // Short-circuit and make the call to the RP
            makeRequestToRP();
            return;
        }

        callRfpEndpoint({
          endpoint: urlProps.endpoint,
          success: function(payload) {
            if (!payload || !payload.hasOwnProperty("is_authenticated")) {
                // Got a 200 but response was absent or malformed. Log to console and make request to RP
                // This shouldn't happen, but handle just in case?
                console.warn("Received 200 response but no payload from /sso/login");
                makeRequestToRP();
            } else if (isTrue(payload.is_authenticated)) {
                // If isAuthenticated == true, then bypass calling the IDP and directly make the request
                authenticationSuccess(payload);
            } else {
                // Otherwise, isAuthenticated == false, so call the IDP as usual then make the request
                var idpUrl = payload.authn_endpoint;
                if (!idpUrl) {
                    // Error condition. authn_endpoint must be provided. Throw an exception to the browser.
                    throw {message: "OpenID: Received instructions to fetch token, but no authn_endpoint provided", payload: payload};
                }
                var cookiesDisabled = isTrue(payload.no_cookie_token);
                fetchTokenAndContinue(idpUrl, cookiesDisabled);
            }
          },
          error: function(jqXHR) {
            // Treating this as "this is not an openID endpoint" so just make the original request and forget
            // all the OpenID semantics.
            makeRequestToRP();
          }
        });

        // Call the IDP to get the token
        var fetchTokenAndContinue = function(idpUrl, cookiesDisabled) {
            callIdp({
                idpUrl: idpUrl,
                redirectUri: urlProps.absoluteUrl,
                endpoint: urlProps.endpoint,
                success: function(token, textStatus, jqXHR) {
                    if (cookiesDisabled) {
                        // Cookies disabled in the handler. No need for
                        // second call to RFP endpoint. Just call the RP.
                        makeRequestToRP(token);

                    } else {
                        // Make the second call to the RFP endpoint, this time with the id_token
                        // as the query param
                        callRfpEndpoint({
                            endpoint: urlProps.endpoint,
                            token: token,
                            success: function(payload) {
                                if (!payload.is_authenticated) {
                                    console.warn({message: "OpenID: did not receive 'true' for is_authenticated from second call to /sso/login", payload: payload});
                                    doRetry(makeRequestToRP);
                                } else {
                                    authenticationSuccess(payload);
                                }
                            },
                            error: function(jqXHR) {
                                console.warn({message: "OpenID: received non-200 response from second call to /sso/login", xhr: jqXHR});
                                doRetry(makeRequestToRP);
                            }
                        });
                    }
                },
                error: error
            });
        }

        // Retry performAuthenticationSteps if we haven't yet reached the maximum number of retries.
        // Param: onRetryLimitReached - the function to run when the max number of retries has been reached.
        var doRetry = function(onRetryLimitReached) {
            if (retrynum < MAX_RETRIES) {
                console.log("OpenID: Retrying performAuthenticationSteps");
                performAuthenticationSteps(options, retrynum + 1);
            } else {
                onRetryLimitReached();
            }
        };

        // Put the expiration time in the cache, if present, then call the RP
        var authenticationSuccess = function(payload) {
            // Feature detection here. Cache is ignored if the client handlers don't vend expiry times in the response.
            if (payload.expires_at) {
                authCache.put(urlProps.endpoint, payload.expires_at);
            }
            makeRequestToRP();
        };

        // Supply the callback with the new url, which, if "token" is not provided, will be the original target url
        // Otherwise it will be the target url with the token added as a query param.
        function makeRequestToRP(token) {
            var requestUrl = urlProps.absoluteUrl;
            if (token) {
                requestUrl = appendQueryString(urlProps, "id_token", token);
            }
            success(requestUrl);
        };
    }

    // The OpenID implementation of xhr factory method.
    // Idea: Interfere as little as possible with the default implementation. Override any methods
    // we need in order to perform the auth work, and delegate to the original xhr methods
    // for doing the actual calls. Avoid rewriting the fundamental XHR logic.
    function overrideXhr(xhr, callback) {
        // Save the original send function
        var origSendFunc = xhr.send;
        // Save the original open function
        var origOpenFunc = xhr.open;
        // Save the original requestHeader function
        var origSetRequestHeaderFunc = xhr.setRequestHeader;
        // And the original abort function
        var origAbortFunc = xhr.abort;

        // override the open(), setRequestHeaders(), and send() methods in the prototype.
        xhr.open = function(method, url, async, user, pass) {
            this._Sentry_openArgs = arguments;

            // Call the original open here to put the xhr in the opened state
            // Need this to mimic a real xhr since some methods/properties can only be set
            // if it is in opened state.
            origOpenFunc.apply(this, arguments);
        };

        xhr.setRequestHeader = function(header, value) {
            if (!this._Sentry_headers) {
                this._Sentry_headers = {};
            }
            this._Sentry_headers[header] = value;
        };

        // Provide the new send function.
        // -Start by performing any necessary authentication steps (see performAuthenticationSteps())
        // -Open request to the destination url.
        // -Make the original request as intended.
        xhr.send = function(data) {
            var xhrInstance = this;
            var args = this._Sentry_openArgs;
            var headers = this._Sentry_headers || {};

            var url = args[1];

            this._Sentry_abortCalled = false; // If it's true at this point, then that means abort was called before send(),
                                        // so we're going to ignore it.

            var makeCall = function(requestUrl) {
                args[1] = requestUrl;

                // Call the original open, with the originally provided args (+ modified url)
                origOpenFunc.apply(xhrInstance, args);
                // Set any request headers we received
                for (var header in headers) {
                    if (headers.hasOwnProperty(header)) {
                        origSetRequestHeaderFunc.call(xhrInstance, header, headers[header]);
                    }
                }
                // Call original send to make the request.
                origSendFunc.call(xhrInstance, data);
                if (xhrInstance._Sentry_abortCalled) {
                    origAbortFunc.call(xhrInstance);
                }
            };

            if (shouldAuthenticateCall(args)) {
                performAuthenticationSteps({
                    url: url,
                    success: makeCall
                });
            } else {
                makeCall(url);
            }
        };

        // The abort function is slightly complicated by the additional Ajax calls in performAuthenticationSteps().
        // Behavior of a normal xhr.abort():
        // 1) before calling open(): no effect. When open() and subsequently send() are called, the request is made as usual.
        // 2) after calling open() but before calling send(): InvalidStateError is thrown when send() is called, because the state
        //  has been reset to UNOPENED
        // 3) after calling open() and send(): the request in-flight is cancelled and the error/success callbacks are not engaged.
        //  --However, jQuery "complete" callbacks are engaged. (i.e. onreadystatechange still fires)
        // With our implementation:
        // -item 2) behaves the same as item 1) since we call xhr.open() again when the client calls send().
        //  -- This isn't a big deal since at worst we are more forgiving. If we really want to we could fake the state ourselves
        //     but that doesn't seem warranted right now.
        // -item 3) cancels an in-flight xhr.send() request (the one visible to the user), and the success/error callbacks are not engaged.
        //  -- If abort() is called after we have already called xhr.send(), then the experience is exactly the same as with a normal XHR.
        //  -- Otherwise, if abort() is called after our send() is called but before we call xhr.send(), we simulate the abort by just calling
        //     it immediately after calling xhr.send() so that onreadystatechange still fires.
        //  -- For simplicity, we don't cancel any in-flight authentication requests. This is OK since they are hidden from the client anyway.
        xhr.abort = function() {
            this._Sentry_abortCalled = true;
            origAbortFunc.call(this);
        };

        // Call the callback if provided, and pass it the original methods.
        if (callback) {
            callback({
                origOpenFunc: origOpenFunc,
                origSendFunc: origSendFunc,
                origSetRequestHeaderFunc: origSetRequestHeaderFunc,
                origAbortFunc: origAbortFunc
            });
        }

    }

    if (namespace.config.periodicRefresh) {
        // This is to support the use case where client code wants to make sychronous Ajax calls.
        // Under normal operation we may call the IDP to fetch a new token. Since this call is
        // cross-domain and authenticated, some browsers will require that it be asynchronous.
        // So the only way to support sync calls in the general case is to make sure that the end-user's cookies
        // are always valid. To do that we will periodically refresh the tokens by calling
        // performAuthenticationSteps.
        // Note that this is only relevant for calls to the current server, not calls to CORS endpoints,
        // as those will run into the same browser issue if executed synchronously.
        var noop = function() {};
        var INTERVAL_MILLIS = 30*1000; // Refresh every 60 seconds.
        var endpoint = getUrlProperties(window.location.href).endpoint;

        setInterval(function() {
            performAuthenticationSteps({url: endpoint, success: noop});
        }, INTERVAL_MILLIS);

        // Perform the first one immediately.
        performAuthenticationSteps({url: endpoint, success: noop});
    }

    if (namespace.config.defaultOff) {
        // Client has indicated that they don't want the XHR object to be monkey-patched
        // nor do they want form POSTs to be overridden.

        nativeXhrFactory = function() {
            // Since we're not doing any funny business with the XHR, just return a plain old XHR
            return new XMLHttpRequest();
        };

        // Assign the native xhr factory to the namespace in case client code specifically wants to use it.
        namespace.nativeXhr = nativeXhrFactory;
        namespace.xhr = function() {
            // Create a new XHR, override the necessary methods, and return.
            var xhr = nativeXhrFactory();
            overrideXhr(xhr);
            return xhr;
        };

        // Exit early since the rest of the function does automagic default-on stuff.
        return;
    }

    // Monkey-patch the XHR prototype so that any invocation of new XMLHttpRequest() in client code
    // will automatically use our implementation, making for a seamless transition.
    overrideXhr(XMLHttpRequest.prototype, function(params) {
        // In the callback, set the native xhr factory by creating a new
        // xhr with the original methods.
        nativeXhrFactory = function() {
            var xhr = new XMLHttpRequest();
            // Reset overridden methods to the originals.
            xhr.open = function() {
                params.origOpenFunc.apply(xhr, arguments);
            };
            xhr.send = function() {
                params.origSendFunc.apply(xhr, arguments);
            };
            xhr.setRequestHeader = function() {
                params.origSetRequestHeaderFunc.apply(xhr, arguments);
            };
            xhr.abort = function() {
                params.origAbortFunc.apply(xhr);
            };
            return xhr;
        };
    });
    namespace.nativeXhr = nativeXhrFactory;
    namespace.xhr = function() {
        // Since we've overridden the prototype, just use the normal constructor.
        return new XMLHttpRequest();
    };
    namespace.internal.performAuthenticationSteps = performAuthenticationSteps;

    // jQuery's default XHR factory should just call the constructor, but explicitly override it in case
    // it does something wonky.
    if ($) {
        $.ajaxSetup({
            xhr: namespace.xhr
        });
    }

    // ---Form handling section---

    function isFormElement(element) {
        return (element && element.nodeName == "FORM");
    }

    // Elementary Map implementation with key = form and value = button clicked
    // Assume here that delete is not necessary, and that overwrite will do.
    // The click handler will store relevant click data (form, button) here, and the submit handler will
    // use it to add a hidden field to the form before submitting.
    var formSubmitClicks = function() {
        var self = {};
        var clicks = [];

        function indexOf(form) {
            for (var i = 0; i < clicks.length; i++) {
                if (clicks[i].form == form) { return i; }
            }
            return -1;
        }

        self.contains = function(form) {
            return indexOf(form) != -1;
        };

        self.get = function(form) {
            var index = indexOf(form);
            if (index == -1) { return null; }
            return clicks[index].button;
        };

        self.put = function(form, button) {
            var obj = {form: form, button: button};
            var index = indexOf(form);
            if (index == -1) {
                clicks.push(obj);
            } else {
                clicks[index] = obj;
            }
        };

        return self;
    }();

    // Intercept form submissions to fetch the token from the IdP.
    // This method should be compatible with both jQuery events and normal events.
    // The two APIs are nearly the same, but take care to make sure this is the case
    // when using new event methods.
    // "target" is added if we need to call this function directly... some browsers don't
    // allow you to directly set the event.target, so we emulate it by passing it as a parameter
    var formSubmissionCallback = function(event, target) {
        var form = event.target || target;
        if (!isFormElement(form)) {
            return;
        }

        var url = form.getAttribute("action");
        if (!url) {
            // By http://www.whatwg.org/specs/web-apps/current-work/multipage/forms.html#form-submission-algorithm
            // use the document URL as the action if it is not provided by the form.
            url = document.URL;
        }
        // Use this to determine whether we should submit the form later. jQuery vends isDefaultPrevented(), so check for that too.
        var defaultPrevented = event.isDefaultPrevented ? event.isDefaultPrevented() : event.defaultPrevented;
        if (defaultPrevented === undefined) {
            // Can happen with older versions of IE (<= 8)
            defaultPrevented = (event.returnValue === undefined) ? false : !event.returnValue;
        }

        if (defaultPrevented) {
            // Form submit has been aborted by the application, so just exit and do nothing
            return;
        }

        // Prevent the form from submitting on its own (the default action for form submissions).
        // Form will be manually submitted after the ID token is retrieved from the IdP.
        if (event.preventDefault) {
            event.preventDefault();
        } else {
            event.returnValue = false;
        }

        performAuthenticationSteps({
            url: url,
            success: function(requestUrl) {
                form.setAttribute("action", requestUrl);

                var inputElement = null;
                if (formSubmitClicks.contains(form)) {
                    // We arrived here by way of a click from an important button.
                    // Create a hidden element and copy button name and value over
                    var submitButton = formSubmitClicks.get(form);
                    inputElement = document.createElement("input");
                    inputElement.type = "hidden";
                    inputElement.name = submitButton.getAttribute("name");
                    inputElement.value = submitButton.getAttribute("value");

                    // Add to the parent form
                    form.appendChild(inputElement);
                }

                try {
                    if (HTMLFormElement) {
                        // IE8 does not honor this check and fails on "HTMLFormElement.prototype.submit"
                        // The only way to detect it is by catching the exception. Its ugly but so is IE8!!
                        var no_error = false;
                        try {
                            var x = HTMLFormElement.prototype.submit;
                            no_error = true;
                        }catch (e) {
                            form.submit();
                        }
                        // Make a best-effort attempt to submit the form without using form.submit(), since
                        // it will be overridden if the form has an element named "submit"
                        if(no_error == true) {
                             HTMLFormElement.prototype.submit.apply(form);
                        }
                    } else {
                        // If HTMLFormElement is not exposed by the browser (Internet Explorer + webpage is not in standards mode)
                        // Then use form.submit().
                        form.submit();
                    }
                } finally {
                    // Revert the value of form.action.
                    form.setAttribute("action", url);
                    if (inputElement) {
                        // Shouldn't be necessary, but do it just in case
                        form.removeChild(inputElement);
                    }
                }
            }
        });

        // Do not call event.stopPropagation() since we do want the event to bubble up afterwards.
        return false;
    };

    // If the element is a submit button with a name we need to add a hidden element to the form before its submitted
    // so that the value is not lost
    var clickCallback = function(event) {
        var element = event.target;

        if (!(element && element.getAttribute("type") == "submit" && element.getAttribute("name") && element.getAttribute("name") != "")) {
            // Not a form input that contributes a value, so don't care.
            return;
        }

        var submitButton = element;
        var parentForm = submitButton.form;
        if (!parentForm) {
            // This button was not placed within a form. Ignore.
            return;
        }

        // Register the form and the button that was clicked.
        // It will be picked up and used by the submit event handler.
        // Reasoning: We don't immediately add a hidden field to the DOM until we know that it actually
        // results in a submission -- there are various false positives, like right-click,
        // and there's the possibility that another handler after this one kills the event, cancelling the submssion.
        // So we want to avoid potentially polluting the form and causing other problems.
        //
        // But if the click turns out to not be a submission, aren't we erroneously loading it into the map?
        // No, since the real submission will overwrite the value.
        // There is the possibility that we register a click for a relevant form button (type=submit and name=something)
        // AND it doesn't submit AND the real submission is by the application's form.submit() or something
        // AND the extra value that we end up consequently submitting with the form causes a problem on the server.
        // But for now let's just assume that this is remote enough that we don't need to worry about it.
        formSubmitClicks.put(parentForm, submitButton);
    };

    if ($) {
        // If we have access to jQuery, then use it -- it provides what we need for Chrome, FF, and IE >= 8,
        // and we can hook into direct jQuery(form).submit() calls, which we cannot do with normal document.forms["form_id"].submit() calls.
        if ($(document).on) {
            $(document).on("submit", formSubmissionCallback);
            $(document).on("click", clickCallback);
        } else { // Pre-1.7
            $(document).bind("submit", formSubmissionCallback);
            $(document).bind("click", clickCallback);
        }
    } else if (document.addEventListener) {
        // Perform this in the bubble phase and give other handlers a chance to execute first.
        document.addEventListener("submit", formSubmissionCallback, false);
        document.addEventListener("click", clickCallback, false);
    } else if (document.attachEvent) {
        // Required for IE8 and below.
        document.attachEvent("onreadystatechange", function() {
            if ( document.readyState === "complete") {
                document.detachEvent("onreadystatechange", arguments.callee);

                // The submit event will not bubble up to the document, so we must attach the callback to each form.
                // TODO: This will not account for forms added afterwards.
                var forms = document.getElementsByTagName("form");
                for (var i = 0; i < forms.length; i++) {
                    (function(){
                        var form = forms[i];
                        form.attachEvent("onsubmit", function(event) {
                            event.target = form;
                            formSubmissionCallback(event);
                        });
                        var inputs = form.getElementsByTagName("input");
                        for (var j = 0; j < inputs.length; j++) {
                            var input = inputs[j];
                            if (input.getAttribute("type") == "submit") {
                                input.attachEvent("onclick", function(e) {
                                    e.target = input;
                                    clickCallback(e);
                                });
                            }
                        }
                    })();
                }
            }
        });
    }

    // Use this instead of form.submit(), where "form" is a plain DOM form object.
    // We do this because an HTML form.submit() does not fire events, so we're taken out of the loop.
    // Code that does jQuery(form).submit() does not need to be changed -- it is automatically handled.
    // Note: We directly invoke the event handler; we don't call dispatchEvent or fireEvent because
    // we don't want to fundamentally change the behavior of form.submit(). All we want to do is
    // inject our handling code.
    namespace.submitForm = function(form) {
        var e = document.createEvent("Event");
        e.initEvent("submit", true, true);
        formSubmissionCallback(e, form);
    };

})(window);

(function() {
    window.setInterval(function() {
        console.log("Background fetch")
        var req = new window.XMLHttpRequest()
        req.open("GET","https://git.xarth.tv")
        req.send()
    }, 180 * 1000);
})()
