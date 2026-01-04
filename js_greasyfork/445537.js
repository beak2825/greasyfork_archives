// ==UserScript==
// @name         Better EdPuzzle
// @namespace    https://github.com/Enchoseon/better-edpuzzle-userscript/raw/main/better-edpuzzle-userscript.user.js
// @version      0.7.2
// @description  Speed up, allow skipping, and stop auto-pausing on EdPuzzle.com.
// @author       Enchoseon
// @include      *edpuzzle.com/lti/*
// @include      *edpuzzle.com/assignments/*
// @include      *edpuzzle.com/media/*
// @include      *youtube.com/embed*
// @include      *youtube-nocookie.com/embed*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435201/Better%20EdPuzzle.user.js
// @updateURL https://update.greasyfork.org/scripts/435201/Better%20EdPuzzle.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const config = { // Edit this variable to set your own settings!
        "speed": 2,
    }
    // =========
    // Speedhack
    // =========
    function speedhack(mediaSource) {
        console.log("Media Source: " + mediaSource);
        switch(mediaSource) {
            case "youtube":
                break;
            case "vimeo":
                break;
            case "vimeo_with_controls":
                break;
            case "edpuzzle":
                break;
            case "file":
                break;
            default:
        }
    }
    if (window != window.top && (window.location.href.includes("youtube.com/embed/") || window.location.href.includes("youtube-nocookie.com/embed/")) && window.location.href.includes("origin=https://edpuzzle.com")) { // YouTube speedhack (sticking this in the speedhack function would require a bunch of postMessage BS to get around CORs. Wish I could just grant myself the permission to access the iframe (e.g. document.getElementsByTagName("iframe")[0].contentWindow.document.getElementsByTagName("video")[0].playbackRate = config.speed;))
        window.addEventListener("click", function() {
            console.log(window.location.href);
            document.getElementsByTagName("video")[0].playbackRate = config.speed;
        });
    }
    // ===============
    // Anti Auto-Pause
    // ===============
    window.addEventListener("load", function() { // Make some properties always return a value of false
        const propArr = ["hidden", "mozHidden", "msHidden", "webkitHidden"];
        for (var i = 0; i < propArr.length; i++) {
            Object.defineProperty(document, propArr[i], function() {
                value : false
            });
        }
    });
    // =========
    // API Stuff
    // =========
    function interceptAPICall(responseText) { // Read the API call for speedhacking (& debugging).
        responseText = JSON.parse(responseText);
        console.log("API Call Intercepted:");
        console.log(responseText);
        var mediaSource = null;
        if (responseText.medias) {
            mediaSource = responseText.medias[0].source;
        } else if (responseText.source) {
            mediaSource = responseText.source;
        }
        window.addEventListener("load", speedhack(mediaSource));
    }
    function modifyAPICall(responseText) { // Modify the API call to allow skipping.
        // Occasionally the API returns a responses w/ stuff in different locations—since there isn't actual documentation, it's kind of hard to understand—so we're going to inefficiently brute force it instead
        return responseText.replace(`"allowSkipAhead":false`, `"allowSkipAhead":true`);
    }
    function getAPIPath() { // Get the API path
        var urlPath = window.location.pathname;
        var apiPath;
        if (urlPath.startsWith("/assignments/")) {
            var id = urlPath.replace("/assignments/", "")
                            .replace("/watch", "");
            apiPath = "/api/v3/assignments/" + id;
        } else if (urlPath.startsWith("/media/")) {
            var id = urlPath.replace("/media/", "");
            apiPath = "/api/v3/media/" + id;
        }
        return apiPath;
    }
    if (window.location.hostname === "edpuzzle.com") { // Intercept XMLHttpRequests (https://stackoverflow.com/a/41899308) (gets around one-time token for LMS & lets us modify the response)
        (function(window) {
            var OriginalXHR = XMLHttpRequest;
            var XHRProxy = function() {
                this.xhr = new OriginalXHR();
                function delegate(prop) {
                    Object.defineProperty(this, prop, {
                        get: function() {
                            return this.xhr[prop];
                        },
                        set: function(value) {
                            this.xhr.timeout = value;
                        }
                    });
                }
                delegate.call(this, "timeout");
                delegate.call(this, "responseType");
                delegate.call(this, "withCredentials");
                delegate.call(this, "onerror");
                delegate.call(this, "onabort");
                delegate.call(this, "onloadstart");
                delegate.call(this, "onloadend");
                delegate.call(this, "onprogress");
            };
            XHRProxy.prototype.open = function(method, url, async, username, password) {
                var ctx = this;
                function applyInterceptors(src) {
                    ctx.responseText = ctx.xhr.responseText;
                    for (var i = 0; i < XHRProxy.interceptors.length; i++) {
                        var applied = XHRProxy.interceptors[i](method, url, ctx.responseText, ctx.xhr.status);
                        if (applied !== undefined) {
                            ctx.responseText = applied;
                        }
                    }
                }
                function setProps() {
                    ctx.readyState = ctx.xhr.readyState;
                    ctx.responseText = ctx.xhr.responseText;
                    ctx.responseURL = ctx.xhr.responseURL;
                    ctx.responseXML = ctx.xhr.responseXML;
                    ctx.status = ctx.xhr.status;
                    ctx.statusText = ctx.xhr.statusText;
                }
                this.xhr.open(method, url, async, username, password);
                this.xhr.onload = function(evt) {
                    if (ctx.onload) {
                        setProps();

                        if (ctx.xhr.readyState === 4) {
                            applyInterceptors();
                        }
                        return ctx.onload(evt);
                    }
                };
                this.xhr.onreadystatechange = function (evt) {
                    if (ctx.onreadystatechange) {
                        setProps();

                        if (ctx.xhr.readyState === 4) {
                            applyInterceptors();
                        }
                        return ctx.onreadystatechange(evt);
                    }
                };
            };
            XHRProxy.prototype.addEventListener = function(event, fn) {
                return this.xhr.addEventListener(event, fn);
            };
            XHRProxy.prototype.send = function(data) {
                return this.xhr.send(data);
            };
            XHRProxy.prototype.abort = function() {
                return this.xhr.abort();
            };
            XHRProxy.prototype.getAllResponseHeaders = function() {
                return this.xhr.getAllResponseHeaders();
            };
            XHRProxy.prototype.getResponseHeader = function(header) {
                return this.xhr.getResponseHeader(header);
            };
            XHRProxy.prototype.setRequestHeader = function(header, value) {
                return this.xhr.setRequestHeader(header, value);
            };
            XHRProxy.prototype.overrideMimeType = function(mimetype) {
                return this.xhr.overrideMimeType(mimetype);
            };

            XHRProxy.interceptors = [];
            XHRProxy.addInterceptor = function(fn) {
                this.interceptors.push(fn);
            };

            window.XMLHttpRequest = XHRProxy;
            XHRProxy.addInterceptor(function(method, url, responseText, status) {
                if (url === getAPIPath()) {
                    interceptAPICall(responseText);
                    return modifyAPICall(responseText);
                }
            });
        })(window);
    }
})();
