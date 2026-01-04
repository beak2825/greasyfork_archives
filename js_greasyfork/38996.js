// ==UserScript==
// @name         Faris Handy Webdev JavaScript functions
// @namespace    http://tampermonkey.net/
// @version      0.3.3
// @description  A bunch of useful JavaScript functions
// @description  This is not a regular script for you to run! Only use this via the @require keyword.
// @author       Faris Hijazi
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_setClipboard
// @grant        unsafeWindow
// @grant        window.close
// @grant        window.focus
// @run-at       document-start
// @require      https://code.jquery.com/jquery-3.4.0.min.js
// @include      *
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/38996/Faris%20Handy%20Webdev%20JavaScript%20functions.user.js
// @updateURL https://update.greasyfork.org/scripts/38996/Faris%20Handy%20Webdev%20JavaScript%20functions.meta.js
// ==/UserScript==


// adding Element.before() and Element.after() (since some brwosers like MS Edge don't already have them)
if (Element.prototype.before === undefined) Element.prototype.before = function (newNode) {
    if (this.parentNode) {
        return this.parentNode.insertBefore(newNode, this);
    }
};
if (Element.prototype.after === undefined) Element.prototype.after = function (newNode) {
    if (this.parentNode) {
        return this.parentNode.insertBefore(newNode, this.nextSibling);
    }
};

/**/
if (typeof unsafeWindow === 'undefined') unsafeWindow = window;

unsafeWindow.URL_REGEX_STR = `(//|http(s?:))[\\d\\w?%\\-_/\\\\=.]+?`;
unsafeWindow.IMAGE_URL_REGEX = new RegExp(`(//|http(s?:))[\\d\\w?%\\-_/\\\\=.]+?\\.(jpg|png|jpeg|gif|tiff|&f=1)`, 'gim');
// /(\/\/|http(s?:))[\d\w?%\-_\/\\=.]+?\.(jpg|png|jpeg|gif|tiff|&f=1)/gim;
unsafeWindow.VID_URL_REGEX = /(\/\/|http(s?:))[\d\w?%\-_\/\\=.]+?\.(mov|webm|mp4|wmv|&f=1)/gim;


const GoogleUtils = (function () {
    const url = {};

    url.isOnEncryptedGoogle = /encrypted.google.com/.test(location.hostname);
    url.googleBaseURL = `https://${/google\./.test(location.hostname) ? location.hostname :
        ((url.isOnEncryptedGoogle ? 'encrypted' : 'www') + '.google.com')}`;
    url.gImgSearchURL = `${url.googleBaseURL}/search?&hl=en&tbm=isch&q=`;
    url.reverseImageSearchUrl = `${url.googleBaseURL}/searchbyimage?&image_url=`;
    url.getGImgReverseSearchURL = _url => _url ? url.reverseImageSearchUrl + encodeURIComponent(_url.trim()) : '';

    return {url: url};
})();


if (typeof GM_setClipboard !== 'undefined') {
    unsafeWindow.setClipboard = GM_setClipboard;
    unsafeWindow.GM_setClipboard = GM_setClipboard;
}
if (typeof GM_xmlhttpRequest !== 'undefined') {
    /**
     * Response callback
     * @callback scriptish_response_callback
     * @param {number} responseCode
     * @param {string} responseMessage
     */

    /**
     * @typedef GMResponse - This is the response object passed to the `onload`, `onerror`, and `onreadystatechange` callbacks described for the details object above.G
     *
     * @property {String} finalUrl - the final URL after all redirects from where the data was loaded
     * @property {int} readyState - the ready state
     * @property {int} status - the request status
     * @property {String} statusText - the request status text
     * @property {String} responseHeaders - the request response headers
     * @property {String} response - the response data as object if details.responseType was set
     * @property {String} responseXML - the response data as XML document
     * @property {String} responseText - the response data as plain string
     */


    /**
     * https://tampermonkey.net/documentation.php#GM_xmlhttpRequest
     *
     * Arguments
     * Object details
     * A single object with properties defining the request behavior.
     *
     * @param {Object} details - the main details object
     *
     * @param {String=} details.method - Optional. The HTTP method to utilize. Currently only "GET" and "POST" are supported. Defaults to "GET".
     * @param {String} details.url - The URL to which the request will be sent. This value may be relative to the page the user script is running on.
     * @param {scriptish_response_callback=} [details.onload] - A function called if the request finishes successfully. Passed a Scriptish response object (see below).
     * @param {scriptish_response_callback=} [details.onerror] - A function called if the request fails. Passed a Scriptish response object (see below).
     * @param {scriptish_response_callback=} [details.onreadystatechange] - A function called whenever the request's readyState changes. Passed a Scriptish response object (see below).
     * @param {String=} [details.data] - Content to send as the body of the request.
     * @param {Object=} [details.headers] - An object containing headers to be sent as part of the request.
     * @param {Boolean=} [details.binary] - Forces the request to send data as binary. Defaults to false.
     * @param {Boolean=} [details.makePrivate] - Forces the request to be a private request (same as initiated from a private window). (0.1.9+)
     * @param {Boolean=} [details.mozBackgroundRequest] - If true security dialogs will not be shown, and the request will fail. Defaults to true.
     * @param {String=} [details.user] - The user name to use for authentication purposes. Defaults to the empty string "".
     * @param {String=} [details.password] - The password to use for authentication purposes. Defaults to the empty string "".
     * @param {String=} [details.overrideMimeType] - Overrides the MIME type returned by the server.
     * @param {Boolean=} [details.ignoreCache] - Forces a request to the server, bypassing the cache. Defaults to false.
     * @param {Boolean=} [details.ignoreRedirect] - Forces the request to ignore both temporary and permanent redirects.
     * @param {Boolean=} [details.ignoreTempRedirect] - Forces the request to ignore only temporary redirects.
     * @param {Boolean=} [details.ignorePermanentRedirect] - Forces the request to ignore only permanent redirects.
     * @param {Boolean=} [details.failOnRedirect] - Forces the request to fail if a redirect occurs.
     * @param {int=} redirectionLimit: Optional - Range allowed: 0-10. Forces the request to fail if a certain number of redirects occur.
     * Note: A redirectionLimit of 0 is equivalent to setting failOnRedirect to true.
     * Note: If both are set, redirectionLimit will take priority over failOnRedirect.
     *
     * Note: When ignore*Redirect is set and a redirect is encountered the request will still succeed, and subsequently call onload. failOnRedirect or redirectionLimit exhaustion, however, will produce an error when encountering a redirect, and subsequently call onerror.
     *
     * For "onprogress" only:
     *
     * @param {Boolean} lengthComputable: Whether it is currently possible to know the total size of the response.
     * @param {int} loaded: The number of bytes loaded thus far.
     * @param {int} total: The total size of the response.
     *
     * @return {"abort": Function}
     */
    /**
     * @param url
     * @param {Object} opts - {
      method: String,
      url: String,
      params: String | Object,
      headers: Object
    }
     * @returns {Promise<any>}
     * @constructor
     */
    function GM_fetch(url, opts = {}) {
        var xhr;

        // // this alows for calling it like this: fetch({ url:..., onload=...})
        // if (typeof url === 'object' && !opts) {
        //     url.url = url;
        //     opts = url;
        //     url = opts.url;
        //     console.log('swapping url and opts: url, opts =', url, opts);
        // }

        const promise = new Promise(function (resolve, reject) {
            const details = $.extend(opts, {
                url: opts.url || url,
            });

            /** @param {GMResponse} res */
            details.onload = function (res) {
                if (res.status >= 200 && res.status < 300) {
                    resolve(this.response);
                } else {
                    reject(res);
                }
            };
            /** @param {GMResponse} res */
            details.onerror = function (res) {
                reject(res);
            };

            xhr = GM_xmlhttpRequest(details);
        });

        promise.abort = () => xhr.abort();
        return promise;
    }

    // GM_xmlhttpRequest.prototype.fetch = GM_fetch;
    GM_xmlhttpRequest.fetch = GM_fetch;
    unsafeWindow.GM_xmlhttpRequest = GM_xmlhttpRequest;
    unsafeWindow.GM_fetch = GM_fetch;

}

unsafeWindow.log = console.debug;
unsafeWindow.setLog = newDebugState => (typeof newDebugState === 'boolean') ? newDebugState : function (arguments) {
    console.log(arguments);
};
unsafeWindow.unsafeWindow = unsafeWindow;
unsafeWindow.matchSite = matchSite;
unsafeWindow.createElement = createElement;
unsafeWindow.loadScript = loadScript;
unsafeWindow.PProxy = (function () {
    function isDdgUrl(url) {
        return /^https:\/\/proxy\.duckduckgo\.com/.test(url);
    }

    /**Returns the href wrapped with proxy.DuckDuckGo.com */
    function reverseDdgProxy(href) {
        // if (isZscalarUrl(href)) s = getOGZscalarUrl(href); // extra functionality:
        if (!isDdgUrl(href)) {
            return href;
        }
        return new URL(location.href).searchParams.get('u');
    }

    /**Returns a DuckDuckGo proxy url (attempts to unblock the url)*/
    var ddgProxy = function (url) {
        return isDdgUrl(url) || /^(javascript)/i.test(url) ? url : (`https://proxy.duckduckgo.com/iu/?u=${encodeURIComponent(url)}&f=1`);
    };

    ddgProxy.isDdgUrl = isDdgUrl;
    ddgProxy.reverseDdgProxy = reverseDdgProxy;

    return {
        FileStack: url => ('https://process.filestackapi.com/AhTgLagciQByzXpFGRI0Az/' + encodeURIComponent(url.trim())),
        SteemitImages: url => /\.(jpg|jpeg|tiff|png|gif)($|\?)/i.test(url) ? ('https://steemitimages.com/0x0/' + url.trim()) : url,
        DDG: ddgProxy,
    };
})();


unsafeWindow.ddgProxy = PProxy.DDG;
unsafeWindow.getOGZscalarUrl = getOGZscalarUrl;
unsafeWindow.reverseDdgProxy = PProxy.DDG.reverseDdgProxy;
unsafeWindow.isDdgUrl = PProxy.DDG.isDdgUrl;
unsafeWindow.targetIsInput = targetIsInput;
unsafeWindow.createAndAddAttribute = createAndAddAttribute;
unsafeWindow.getGImgReverseSearchURL = GoogleUtils.url.getGImgReverseSearchURL;

unsafeWindow.ImgUtils = {
    uriToImageData: function uriToImageData(uri) {
        return new Promise(function (resolve, reject) {
            if (uri == null) return reject();
            var canvas = document.createElement('canvas'),
                context = canvas.getContext('2d'),
                image = new Image();
            image.addEventListener('load', function () {
                canvas.width = image.width;
                canvas.height = image.height;
                context.drawImage(image, 0, 0, canvas.width, canvas.height);
                resolve(context.getImageData(0, 0, canvas.width, canvas.height));
            }, false);
            image.src = uri;
        });
    },
    getBase64Image: function getBase64Image(img, excludeUrlProtocol = false) {
        // Create an empty canvas element
        var canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;

        // Copy the image contents to the canvas
        var ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL('image/png');

        return excludeUrlProtocol && dataURL.replace(/^data:image\/(png|jpg);base64,/, '') || dataURL;
    },
    imageToImageData: function imageToImageData(srcImg) {
        var img = $(srcImg);
        var context = document.createElement('canvas').getContext('2d');
        context.drawImage(img[0], 0, 0);

        return context.getImageData(0, 0, img.width(), img.height());
    },
    imageDataToImage: function imageDataToImage(imagedata) {
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        canvas.width = imagedata.width;
        canvas.height = imagedata.height;
        ctx.putImageData(imagedata, 0, 0);

        var image = new Image();
        image.src = canvas.toDataURL();
        return image;
    }
};

unsafeWindow.toDdgProxy = () => location.href = ddgProxy(location.href);
unsafeWindow.isIterable = obj => obj != null && typeof obj[Symbol.iterator] == 'function';
unsafeWindow.GM_setValue = typeof (GM_setValue) !== 'undefined' ? GM_setValue : function () {
    console.error('GM_setValue is not defined, you may need to import it or include it in the @grants meta block');
};
unsafeWindow.GM_getValue = typeof (GM_getValue) !== 'undefined' ? GM_getValue : function () {
    console.error('GM_getValue is not defined, you may need to import it or include it in the @grants meta block');
};
unsafeWindow.GM_setClipboard = typeof (GM_setClipboard) !== 'undefined' ? GM_setClipboard : function () {
    console.error('GM_setClipboard is not defined, you may need to import it or include it in the @grants meta block');
};

// unsafeWindow.q = q;
// unsafeWindow.qa = qa;
unsafeWindow.siteSearchUrl = siteSearchUrl;
unsafeWindow.getAbsoluteURI = getAbsoluteURI;

/**Returns the HOSTNAME of a website url*/
unsafeWindow.getHostname = getHostname;
/***/
unsafeWindow.openAllLinks = function () {
    Array.from(document.links).forEach(function (link) {
        if (link.hasAttribute('href')) {
            window.open(link.href);
        }
    });
};


unsafeWindow.getElementsByXPath = function getElementsByXPath(xpath, parent) {
    let results = [];
    let query = document.evaluate(xpath,
        parent || document,
        null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);
    for (let i = 0, length = query.snapshotLength; i < length; ++i) {
        results.push(query.snapshotItem(i));
    }
    return results;
};

/**Opens the url via fetch(), then performs a callback giving it the document element*/
unsafeWindow.fetchElement = fetchElement;
/**Opens the url via xmlhttpRequest, then performs a callback giving it the document element*/
unsafeWindow.xmlRequestElement = xmlRequestElement;
unsafeWindow.onLoadDim = onLoadDim;
unsafeWindow.addCss = addCss;

/**
 *    @author    https://codepen.io/frosas/
 *    Also works with scripts from other sites if they have CORS enabled (look for the header Access-Control-Allow-Origin: *).
 *
 *    // Usage
 *    var url = 'https://raw.githubusercontent.com/buzamahmooza/Helpful-Web-Userscripts/master/GM_dummy_functions.js?token=AZoN2Rl0UPDtcrOIgaESbGp_tuHy51Hmks5bpijqwA%3D%3D';
 *    loadGitHubScript(url).then((event) => {    });
 */
function loadGitHubScript(url) {
    return fetch(url).then(res => res.blob()).then(body => loadScript(URL.createObjectURL(body)));

    function loadScript(url) {
        return new Promise(function (resolve, reject) {
            var script = document.createElement('script');
            script.src = url;
            script.onload = resolve;
            script.onerror = function () {
                console.warn('couldn\'t load script: ', url);
                if (typeof reject === 'function')
                    reject();
            }; // TODO Not sure it really works
            document.head.appendChild(script);
        });
    }
}


/**@deprecated doesn't actually succeed*/
unsafeWindow.addJs = function addJs(js, id) {
    const jsScript = document.createElement('script');
    jsScript.appendChild(document.createTextNode(js));
    if (!!id) jsScript.id = id;
    jsScript.classList.add('addJs');
    return document.getElementsByTagName('head')[0].appendChild(jsScript);
};
unsafeWindow.observe = observe;
unsafeWindow.gfycatPage2GifUrl = function (gfycatPageUrl) {
    if (!/https:\/\/gfycat\.com\/gifs\/detail\/.+/.test(gfycatPageUrl)) {
        throw error('Not a gfycat home url:' + gfycatPageUrl);
    }
    return `https://thumbs.gfycat.com/${gfycatPageUrl.split('/').pop()}-size_restricted.gif`;
};
unsafeWindow.preloader = preloader;
unsafeWindow.waitForElement = waitForElement;
unsafeWindow.includeJs = includeJs;
/**
 * Appends a style element to the head of the document containing the given cssStr text
 * @param cssStr
 * @param id
 * @return {HTMLStyleElement}
 */
function addCss(cssStr, id = '') {
    // check if already exists
    const style = document.getElementById(id) || document.createElement('style');

    if (style.styleSheet) {
        style.styleSheet.cssText = cssStr;
    } else {
        style.innerText = cssStr;
    }
    if (!!id) style.id = id;
    style.classList.add('addCss');
    return document.getElementsByTagName('head')[0].appendChild(style);
}
unsafeWindow.disableStyles = disableStyles;
function disableStyles(enable) {
    console.log('Disabling styles');
    for (const styleEl of document.querySelectorAll('style, link')) {
        styleEl.disabled = !enable
    }
}

unsafeWindow.createAndGetNavbar = createAndGetNavbar;
/**
 * Creates a static navbar at the top of the page.
 * Useful for adding buttons and controls to it
 * @param callback  this callback should be used when instantly adding content to the navbar,
 *  do NOT just take the returned value and start adding elements.
 *  @return {HTMLDivElement} returns the parent navbar element
 */
function createAndGetNavbar(callback) {
    // Settings up the navbar
    // language=CSS
    addCss(`
        div#topnav {
            position: fixed;
            z-index: 1000;
            min-height: 50px;
            top: 0;
            right: 0;
            left: 0;
            background: #525252;
            font-size: 14px;
        }

        div#topnav-content {
            margin-left: 5px;
            padding: 10px;
            font-family: inherit;
            font-stretch: extra-condensed;
            font-size: 20px;
        }`, 'navbar-css');

    function adjustTopMargin() {
        document.body.style.top = `${q('#topnav').offsetHeight}px`;
    }

    const navbar = document.createElement(`div`);
    navbar.id = 'topnav';
    const navbarContentDiv = document.createElement('div');
    navbarContentDiv.id = 'topnav-content';

    navbar.appendChild(navbarContentDiv);

    document.body.firstElementChild.before(navbar);

    window.addEventListener('resize', adjustTopMargin);

    document.body.style.position = 'relative';

    // keep trying to use the callback, works when the navbarContentDiv is finally added
    var interval = setInterval(function () {
        const topnavContentDiv = q('#topnav-content');
        if (topnavContentDiv) {
            clearInterval(interval);
            if (callback)
                callback(topnavContentDiv);
            adjustTopMargin();
        }
    }, 100);
    return navbar;
}


unsafeWindow.setStyleInHTML = setStyleInHTML;
/**
 * This will set the style of an element by force, by manipulating the style HTML attribute.
 * This gives you more control, you can set the exact text you want in the HTML element (like giving a style priority via "!important").
 * Example calls:
 *  setStyleByHTML(el, "background-image", "url(http://www.example.com/cool.png)")
 *  setStyleByHTML(el, "{ background-image : url(http://www.example.com/cool.png) }")
 * @param {HTMLElement} el
 * @param {String} styleProperty
 * @param {String} [styleValue='']
 * @return {HTMLElement} el
 */
function setStyleInHTML(el, styleProperty, styleValue = '') {
    styleProperty = styleProperty.trim().replace(/^.*{|}.*$/g, '');

    const split = styleProperty.split(':');
    if (!styleValue && split.length > 1) {
        styleValue = split.pop();
        styleProperty = split.pop();
    }

    if (el.hasAttribute('style')) {
        const styleText = el.getAttribute('style');
        const styleArgument = `${styleProperty}: ${styleValue};`;

        let newStyle = new RegExp(styleProperty, 'i').test(styleText) ?
            styleText.replace(new RegExp(`${styleProperty}:.+?;`, 'im'), styleArgument) :
            `${styleText} ${styleArgument}`;

        el.setAttribute('style', newStyle);
    }
    return el;
}
Math.clamp = function (a, min, max) {
    return a < min ? min :
        a > max ? max : a;
};

/**
 * @param targetElement
 * @param callback
 * @param options   mutationObserver options{ childList: boolean, subtree: boolean, attributes: boolean, characterData: boolean }
 * @returns the mutationObserver object
 */
function observe(targetElement, callback, options) {
    if (!targetElement) targetElement = document.body;
    if (!options) {
        options = {
            childList: true, subtree: true,
            attributes: false, characterData: false
        };
    }
    const mutationsHandler = function (mutations) {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                callback(mutation.target);
            }
            callback();
        }
    };
    callback(targetElement);
    const mutationObserver = new MutationObserver(mutationsHandler);
    mutationObserver.observe(targetElement, options);
    return mutationObserver;
}


unsafeWindow.nodeDepth = nodeDepth;
/**
 * returns the number of nodes between the child and parent
 * @param child
 * @param parent    the parent (direct or indirect) of the child element
 * @param currentDepth used for recursion only, do NOT modify it's value
 * @return {number}
 */
function nodeDepth(child, parent = document, currentDepth = 0) {
    if (!child || !parent) throw 'Both the child and parent must non-null.';
    if (!parent.contains(child)) throw 'The given parent does not contain the child.';

    currentDepth++;
    return child.parentNode == parent ?
        currentDepth :
        nodeDepth(child.parentNode, parent, currentDepth);
}

unsafeWindow.regexBetween = function (precedingRegEx, betweenRegEx, proceedingRegEx, regexOptions) {
    return new RegExp(`(?<=(${precedingRegEx}))(${!betweenRegEx ? '.+?' : betweenRegEx})(?=(${proceedingRegEx}))`, regexOptions);
};

// if(typeof ($) !== 'undefined') {
//     unsafeWindow.$ = $;
//     unsafeWindow.extend = $.extend;
// }

function preloader(imgUrls) {
    console.log('imgs passed:', imgUrls);
    let imgObjs = [];
    // start preloading
    for (const url of imgUrls) {
        // create object
        let imageObj = new Image();
        imageObj.src = url;
        imageObj.onload = function () {
            console.log('ImageLoaded:', this.src, this);
        };
        imgObjs.push(imageObj);
    }
}

// http://code.jquery.com/jquery.js
function includeJs(src) {
    const script = document.createElement('script');
    script.setAttribute('src', src);
    document.getElementsByTagName('head')[0].appendChild(script);
    return script;
}

/**@WIP
 * @param {function|string} elementGetter - a function to get the wanted element (or event a condition function)
 * that will be called to test if the element has appeared yet. (should return true only when the element appears)
 * @param callback - the result of elementGetter will be passed as the first argument
 * @return {MutationObserver|null}
 */
function waitForElement(elementGetter, callback) {
    var getter = (typeof (elementGetter) === 'function') ?
        () => elementGetter() :
        (typeof (elementGetter) === 'string') ? () => document.querySelectorAll(elementGetter) :
            elementGetter;


    const hasElementAppeared = function (mutations, me) {
        function handleSuccess(el) {
            callback(el);
            if (me) me.disconnect();
        }


        var element = getter();

        try {
            if (element instanceof Element || element === true) {
                handleSuccess(element);
            } else if (element && element.length) {
                for (const el of element) {
                    handleSuccess(el);
                }
            } else {
                console.warn('element is not an instance of Element, neither is it iterable :( ', element);
            }
        } catch (e) {
            console.warn('element:', element, e);
        }
        return element;
    };

    if (!hasElementAppeared(null)) { // if element didn't already appear
        const observer = new MutationObserver(hasElementAppeared);
        observer.observe(document.body, {
            childList: true,
            subtree: true,
            attributes: false,
            characterData: false
        });
        return observer;
    }
}

function elementReady(selector, timeoutInMs = -1) {
    return new Promise((resolve, reject) => {
        var getter = typeof selector === 'function' ?
            () => selector() :
            () => document.querySelectorAll(selector)
        ;
        var els = getter();
        if (els && els.length) {
            resolve(els[0]);
        }
        if (timeoutInMs > 0)
            var timeout = setTimeout(() => {
                reject(`elementReady(${selector}) timed out at ${timeoutInMs}ms`);
                console.debug(`elementReady(${selector}) timed out at ${timeoutInMs}ms`);
            }, timeoutInMs);


        new MutationObserver((mutationRecords, observer) => {
            Array.from(getter() || []).forEach((element) => {
                clearTimeout(timeout);
                resolve(element);
                observer.disconnect();
            });
        }).observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    });
}
/**
 * cross-browser wheel delta
 * Returns the mousewheel scroll delta as -1 (wheelUp) or 1 (wheelDown) (cross-browser support)
 * @param {MouseWheelEvent} wheelEvent
 * @return {number} -1 or 1
 */
unsafeWindow.getWheelDelta = function getWheelDelta(wheelEvent) {
    // cross-browser wheel delta
    wheelEvent = window.event || wheelEvent; // old IE support
    return Math.max(-1, Math.min(1, (wheelEvent.wheelDelta || -wheelEvent.detail)));
};
unsafeWindow.elementUnderMouse = function elementUnderMouse(wheelEvent) {
    return document.elementFromPoint(wheelEvent.clientX, wheelEvent.clientY);
};

/** Create an element by typing it's inner HTML.
 For example:   var myAnchor = createElement('<a href="https://example.com">Go to example.com</a>');
 * @param html
 * @param callback optional callback, invoked once the element is created, the element is passed.
 * @return {HTMLElement}
 */
function createElement(html, callback) {
    const div = document.createElement('div');
    div.innerHTML = (html).trim();
    const element = div.firstElementChild;
    if (!!callback && callback.call)
        callback.call(null, element);

    return element;
}
unsafeWindow.htmlToElements = function htmlToElements(html) {
    return new DOMParser().parseFromString(html, 'text/html').body.childNodes
};
/* todo: remove, this thing is terrible and has no point */
function matchSite(siteRegex) {
    let result = location.href.match(siteRegex);
    if (!!result) console.debug('Site matched regex: ' + siteRegex);
    return result;
}
function siteSearchUrl(query) {
    if (query) {
        return GoogleUtils.gImgSearchURL + 'site:' + encodeURIComponent(query.trim());
    }
}

/**
 * removes all coded functionality to the element by removing it and reappending it's outerHTML
 */
function clearElementFunctions(element) {
    const outerHTML = element.outerHTML;
    element.after(createElement(outerHTML));
    element.remove();
}
unsafeWindow.clearElementFunctions = clearElementFunctions;

/**abbreviation for querySelectorAll()
 * @param selector
 * @param node
 * @return {set<HTMLElement>} */
function qa(selector, node = document) {
    return node.querySelectorAll(selector);
}
/**abbreviation for querySelector()
 * @param selector
 * @param node
 * @return {HTMLElement} */
function q(selector, node = document) {
    return node.querySelector(selector);
}

unsafeWindow.incrementUrl = incrementUrl;
/** Returns a modified url as a string, either incremented(++) or decremented(--)
 * @param {string} href  the input url you want to modify
 * @param {number} incrAmount (optional) the amount to increment.
 *  Default:  increment by 1 (++).
 *  If the result in the url becomes negative, it will be overridden to 0.
 * @return {string} incremented/decremented url string */
function incrementUrl(href, incrAmount) {
    var e, s;
    let IB = incrAmount ? incrAmount : 1;

    function isDigit(c) {
        return ('0' <= c && c <= '9')
    }
    const tip = location.href.match(/([&?]|$).*$/)[0];
    let L = href.replace(tip, '');
    let LL = L.length;
    for (e = LL - 1; e >= 0; --e) if (isDigit(L.charAt(e))) {
        for (s = e - 1; s >= 0; --s) if (!isDigit(L.charAt(s))) break;
        break;
    }
    ++s;
    if (e < 0) return;
    let oldNum = L.substring(s, e + 1);
    let newNum = (parseInt(oldNum, 10) + IB);
    if (newNum < 0) newNum = 0;
    let newNumStr = '' + newNum;
    while (newNumStr.length < oldNum.length)
        newNumStr = '0' + newNumStr;

    return (L.substring(0, s) + '' + newNumStr + '' + L.slice(e + 1) + '' + tip);
}

unsafeWindow.printElementTextAttributes = printElementTextAttributes;
function printElementTextAttributes(el) {
    console.log(
        'innerText:', el.innerText,
        '\nOuterText:', el.outerHTML,
        '\nInnerHTML:', el.innerHTML,
        '\nouterHTML:', el.outerHTML
    );
}
function isZscalarUrl(zscalarUrl) {
    return /https:\/\/zscaler\.kfupm\.edu\.sa\/Default\.aspx\?url=/.test(zscalarUrl);
}
/**
 * @param zscalarUrl {string}
 * @returns {string} the original link that ZScalar is blocking
 */
function getOGZscalarUrl(zscalarUrl) {
    if (!isZscalarUrl(zscalarUrl)) {
        return zscalarUrl;
    } // not a zscalar url
    zscalarUrl = zscalarUrl.trim();
    let x = decodeURIComponent(('' + zscalarUrl).substring(46, zscalarUrl.indexOf('&referer')));
    // let x = decodeURIComponent(('' + zscalarUrl).substring(46, zscalarUrl.indexOf('&referer')));
    console.debug('Extracted ZScalar original link:', x);
    return x;
}

/*function loadScript(url, callback) {
    let script = document.createElement("script");
    script.type = "text/javascript";
    if (script.readyState) { //IE
        script.onreadystatechange = function () {
            if (script.readyState === "loaded" ||
                script.readyState === "complete") {
                script.onreadystatechange = null;
                callback();
            }
        };
    } else { //Others
        script.onload = function () {
            callback();
        };
    }
    script.src = url;
    document.getElementsByTagName("head")[0].appendChild(script);
}*/
function loadScript(url, callback, type) {
    if (!callback) callback = () => console.log('Script laoded:', url);
    // Adding the script tag to the head as suggested before
    var head = document.getElementsByTagName('head')[0];
    var script = document.createElement('script');
    if (!type) type = 'text/javascript';
    script.type = type;
    script.src = url;

    // Then bind the event to the callback function.
    // There are several events for cross browser compatibility.
    script.onreadystatechange = callback;
    script.onload = callback;

    // Fire the loading
    head.appendChild(script);
    return script;
}

unsafeWindow.loadModule = loadModule;
unsafeWindow.getElementsWithText = getElementsWithText;
window.document.getElementsWithText = getElementsWithText;
/**
 * Iterates through all HTMLElements and returns the ones that contains innerText matching the given regex/substr
 * @param textRegex
 * @param preliminarySelector   a node selector to narrow down the search from the start
 * @return {[]}
 */
function getElementsWithText(textRegex, preliminarySelector) {
    if (!textRegex) {
        console.error('must have an input value');
        return;
    }
    const matchingEls = [];
    const useSubstring = (typeof textRegex === 'string');
    function elementContainsText(element, regex) {
        return !(regex && element && element.innerText) ? false :
            (useSubstring ? element.innerText.indexOf(regex) > -1 : element.innerText.match(textRegex));
    }

    for (const el of document.querySelectorAll(preliminarySelector || '*')) {
        if (elementContainsText(el, textRegex)) {
            var nothingContainsEl = true;
            for (var i = 0; i < matchingEls.length; i++)
                if (matchingEls[i] && matchingEls[i].contains(el) && !Object.is(matchingEls[i], el)) {
                    matchingEls[i] = null; // that old parentEl is now gone, we only want the deepest node
                    nothingContainsEl = false;
                }
            matchingEls.push(el);
        }
    }
    return matchingEls.filter(el => el != null);
}

function loadModule(url, callback) {
    return loadScript(url, callback, 'module');
}
/**
 * Creates and adds an attributeNode to the element (if the element doesn't have that attribute)
 * sets the attribute value
 * @param node
 * @param attributeName
 * @param attributeValue
 */
function createAndAddAttribute(node, attributeName, attributeValue) {
    if (!node) {
        console.error('Node is null, cannot add attribute.');
        return;
    }

    if (!node.hasAttribute(attributeName)) {
        var attr = document.createAttribute(attributeName);
        attr.value = attributeValue;
        node.setAttributeNode(attr);
    }
    if (!!attributeValue) {
        node.setAttribute(attributeName, attributeValue);
    }
}

/** Deal with relative URIs (URIs starting with "/" or "//") */
function getAbsoluteURI(inputUrl) {
    let reconstructedUri = inputUrl
        .replace(new RegExp(`^//`), `${location.protocol}//`)        // If string starts with "//", replace with protocol
        .replace(new RegExp(`^/`), `${getHostname(location.href)}/`);// convert relative uri (precede with hostname if URI starts with "/")

    // add protocol if one is not found
    if (!/^https?/.test(reconstructedUri))
        reconstructedUri = `https://${reconstructedUri}`;

    return reconstructedUri;
}

/**
 * Returns true if the event target is an input element (such as a textfield).
 * This is useful when you want to remap letter keys only when you are not typing in a text field :)
 * @param event
 * @return {boolean}
 */
function targetIsInput(event) {
    const ignores = document.getElementsByTagName('input');
    const target = event.target;
    for (let ignore of ignores)
        if (target === ignore || ignore.contains(target)) {
            // console.log('The target recieving the keycode is of type "input", so it will not recieve your keystroke', target);
            return true;
        }
    return false;
}

/** Calls the callback function, passing to it the width and height: "callback(w, h)"
 * @param url
 * @param callback  callback(width, height, url, imgNode, args)
 * @param imgNode
 * @param args  gets passed to the callback
 */
function onLoadDim(url, callback, imgNode, args) {
    var img = new Image();
    if (!url) {
        console.warn('Url is invalid');
        return;
    }
    if (typeof url !== 'string') {
        url = !!url.src ? url.src : url.href;
    }

    if (typeof callback === 'function') {
        img.addEventListener('load', function () {
            callback(this.naturalWidth, this.naturalHeight, url, imgNode, args);
        });
    } else {
        console.error('onLoad() callback passed should be of type "function".');
    }
    img.src = url;
}

/**@deprecated Opens the url via xmlhttpRequest, then performs a callback giving it the document element*/
function xmlRequestElement(url, callback) {
    if (typeof callback !== 'function') console.error('The callback is not a function', callback);
    const req = new XMLHttpRequest();
    req.open('GET', url);
    req.send();
    req.onreadystatechange = function () {
        if (req.readyState === req.DONE) {
            const pageHTML = req.responseText;
            const doc = document.createElement('html');
            doc.innerHTML = pageHTML;

            console.log('Recieved document for page ', url + ':', doc);

            callback(doc, url);
        }
    };
}
unsafeWindow.fetchDoc = fetchDoc;
function fetchDoc(url, callback) {
    fetch(url, {
            mode: 'no-cors',
            method: 'get'
        }
    ).then((res) => res.text())
        .then((text) => {
            var doc = document.createElement('html');
            doc.innerHTML = text;
            if (callback && typeof callback === 'function')
                callback(doc);
        });
}
function testUrls(urls, successUrls) {
    successUrls = successUrls || new Set();
    for (const url of urls) fetch(url, {
        mode: 'no-cors',
        method: 'get'
    }).then((text) => {
        console.log('Sucessfully fetched url:', url);
        successUrls.add(url);
    }).catch((res) => {
        console.error('Failed to fetch url:', url);
    });
}
/**Opens the url, then performs a callback giving it the document element
 * @param {string} url
 * @param {function} callback   passes: (doc, url, args) to the callback function when the response is complete
 * @param {object} args  Options object.
 *                  "args":   Arguments to pass to the callback (Array or Object type)
 * @returns returns the callback result
 */
function fetchElement(url, callback, args) {
    if (typeof callback !== 'function') console.error('Callback is not a function.!');
    fetch(url).then(
        response => response.text() // .json(), etc.
        // same as function(response) {return response.text();}
    ).then(function (html) {
            var doc = document.implementation.createHTMLDocument('');
            doc.open();
            doc.write(html);
            doc.close();
            try {
                return callback(doc, url, args);
            } catch (e) {
                console.error(e);
                return (html);
            }
        }
    );
}


function unicodeToChar(text) {
    return text.replace(/\\u[\dA-F]{4}/gim,
        match => String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16)));
}


// don't make public because it conflicts with DDGP Unblocker script

/** A class containing static functions to manipulate the srcset attribute */
unsafeWindow.SrcSet = class SrcSet {
    /**
     * @author https://github.com/sindresorhus/srcset/
     * @param arr
     * @return {*}
     */
    static deepUnique(arr) {
        return arr.sort().filter(function (el, i) {
            return JSON.stringify(el) !== JSON.stringify(arr[i - 1]);
        });
    }
    /**
     * @author https://github.com/sindresorhus/srcset/
     * @param str
     * @return {*}
     */
    static parse(str) {
        return this.deepUnique(str.split(',').map(function (el) {
            var ret = {};

            el.trim().split(/\s+/).forEach(function (el, i) {
                if (i === 0) {
                    return ret.url = el;
                }

                var value = el.substring(0, el.length - 1);
                var postfix = el[el.length - 1];
                var intVal = parseInt(value, 10);
                var floatVal = parseFloat(value);

                if (postfix === 'w' && /^[\d]+$/.test(value)) {
                    ret.width = intVal;
                } else if (postfix === 'h' && /^[\d]+$/.test(value)) {
                    ret.height = intVal;
                } else if (postfix === 'x' && !isNaN(floatVal)) {
                    ret.density = floatVal;
                } else {
                    throw new Error('Invalid srcset descriptor: ' + el + '.');
                }
            });

            return ret;
        }));
    }
    static stringify(arr) {
        return (arr.map(function (el) {
            if (!el.url) {
                throw new Error('URL is required.');
            }

            var ret = [el.url];

            if (el.width) {
                ret.push(el.width + 'w');
            }

            if (el.height) {
                ret.push(el.height + 'h');
            }

            if (el.density) {
                ret.push(el.density + 'x');
            }

            return ret.join(' ');
        })).join(', ');
    }
};

unsafeWindow.cookieUtils = {
    setCookie: function setCookie(name, value, days) {
        var expires = '';
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = '; expires=' + date.toUTCString();
        }
        document.cookie = name + '=' + (value || '') + expires + '; path=/';
        return document.cookie;
    },
    getCookie: function getCookie(name) {
        var nameEQ = name + '=';
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    },
    eraseCookie: function eraseCookie(name) {
        document.cookie = name + '=; Max-Age=-99999999;';
        return document.cookie;
    }
};

unsafeWindow.url2location = url2location;
/**
 * Retrieves an object with parsed URL data
 * @param url
 * @return  {
 * {port: string,
 * protocol: string,
 * href: string,
 * origin: string,
 * pathname: string,
 * hash: string,
 * search: string}
 * }
 */
function url2location(url) {
    const a = document.createElement('a');
    a.href = url;
    return {
        port: a.port,
        protocol: a.protocol,
        href: a.href,
        origin: a.origin,
        pathname: a.pathname,
        hash: a.hash,
        search: a.search
    }
}
/** @param href
 * @param keepPrefix    defaults to false
 *        www.example.com
 *        if true:      example.com
 *        if false:     www.example.com
 * @returns {string} Returns the hostname of the site URL */
function getHostname(href, keepPrefix) {
    const a = document.createElement('a');
    a.href = href;
    // if (keepPrefix) console.debug("getHostname href =", href);
    return a.hostname;
}
/** Inclomplete
 * @type {boolean} */
unsafeWindow.freezeGif = freezeGif;
function freezeGif(img, unfreeze) {
    function createElementAndCallback(type, callback) {
        const element = document.createElement(type);
        callback(element);
        return element;
    }
    var width = img.width,
        height = img.height,
        canvas = createElementAndCallback('canvas', function (clone) {
            clone.width = width;
            clone.height = height;
        }),
        attr,
        i = 0;

    var freeze = function () {
        canvas.getContext('2d').drawImage(img, 0, 0, width, height);

        for (i = 0; i < img.attributes.length; i++) {
            attr = img.attributes[i];

            if (attr.name !== '"') { // test for invalid attributes
                canvas.setAttribute(attr.name, attr.value);
            }
        }
        canvas.classList.add('freeze-gif');
        canvas.style.position = 'absolute';

        img.parentNode.insertBefore(canvas, img);
        img.style.visibility = 'hidden';
        // img.style.opacity = 0;
    };

    var unfreezeGif = function () {
        console.log('unfreezing', img);
        const freezeCanvas = img.closest('.freeze-gif');

        if (!freezeCanvas) {
            console.error('Couldn\'t find freezeCanvas while unfreezing this gif:', img);
        } else {
            freezeCanvas.style.visibility = 'hidden';
        }
        // img.style.opacity = 100;
        img.style.visibility = 'visible';
    };

    if (unfreeze) {
        unfreezeGif();
    } else {
        if (img.complete) {
            freeze();
        } else {
            img.addEventListener('load', freeze, true);
        }
    }
}
function getIframeDoc(iframe) {
    return iframe.contentDocument || iframe.contentWindow ? iframe.contentWindow.document : null;
}

unsafeWindow.removeClickListeners = removeClickListeners;
function removeClickListeners(selector) {
    if (!!$) {
        $(!selector ? '*' : selector)
            .unbind('click')
            .off('click')
            .removeAttr('onclick');
    } else {
        console.warn('unsafeWindow.$ is not defined');
    }
}
/**
 * @WIP TODO: Complete this function
 */
function removeEventListeners(eventTarget) {
    var eventType = 'click';
    eventTarget = window;

    for (const eventType in window.getEventListeners(eventTarget)) {
        const eventListeners = getEventListeners(eventTarget);
        if (eventListeners.hasOwnProperty(eventType))
            for (const o of eventListeners[eventType]) {
                console.log('before:', o);
                o.listener = null;
                console.log('after:', o);
            }
    }


    // noinspection JSUnresolvedFunction
    let listeners = eventTarget.getEventListeners(eventTarget);
    listeners.forEach(function (listener) {
        console.log('removing listener:', listener);
        eventTarget.removeEventListener('click', listener, false);
    });
}

unsafeWindow.removeDoubleSpaces = removeDoubleSpaces;
unsafeWindow.cleanGibberish = cleanGibberish;
unsafeWindow.isBase64ImageData = isBase64ImageData;
unsafeWindow.cleanDates = cleanDates;

unsafeWindow.downloadScripts = function downloadScripts() {
    var scriptUrls = Array.from(document.querySelectorAll('script'))
        .map(script => script.src ? script.src : window.URL.createObjectURL(new Blob([script.innerHTML], {type: 'text/plain'}))
        );
    zipFiles(scriptUrls);
};

unsafeWindow.escapeEncodedChars = escapeEncodedChars;
/** Escapes Unicode chars, and anything starting with \x, \u,
 * @param text
 * @return {*} */
function escapeEncodedChars(text) {
    return text
        .replace(/\\[u][\dA-F]{4}/gim, match => String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16)))
        .replace(/\\[x][\dA-F]{2}/gim, match => String.fromCharCode(parseInt(match.replace(/\\x/g, ''), 16)));
}
/**
 * Returns true if the string is an image data string
 * @param str
 * @returns {boolean}
 */
function isBase64ImageData(str) {
    return /^data:image\/.{1,5};base64/.test(str);
}
function removeDoubleSpaces(str) {
    return !!str ? str.replace(/(\s{2,})/g, ' ') : str;
}

function cleanDates(str) {
    return !!str ? removeDoubleSpaces(str.replace(/\d*\.([^.]+)\.\d*/g, ' ')) : str;
}
function cleanGibberish(str, minWgr, debug = false) {
    if (str) {
        const gibberishRegex = /(\W{2,})|(\d{3,})|(\d+\w{1,5}\d+){2,}/g;
        let noGibberish = removeDoubleSpaces(str.replace(gibberishRegex, ' '));
        /**
         * The minimum word2gibberish ratio to exit the loop
         * @type {number|*}
         */
        minWgr = 0.4 || minWgr;
        if (noGibberish.length < 3) return str;
        /**
         * WGR: Word to Gibberish Ratio (between 0 and 1)
         * 0:   No gibberish    (Good)
         * 1:   100% Gibberish  (Bad)
         * @type {number}
         */
        let wgr = (str.length - noGibberish.length) / str.length;
        if (debug) console.debug(
            'cleanGibberish(' + str + ')' +
            '\nOriginal:', str,
            '\nNoGibberish:', noGibberish,
            '\nRatio:', wgr
        );

        return wgr > minWgr ?
            cleanGibberish(noGibberish, minWgr) :
            (str.length > 3 ? str : '');
    }
    return '';
}
var getCssImage = (element) => !element ? null : element.style['background-image'].replace(/(['"]?\)$)|(^url\(["']?)/g, '');
unsafeWindow.getCssImages = () => Array.from(document.querySelectorAll('[style*="background-image"]')).map(getCssImage);


/**
 * @param {function} callback -
 * @param {Object} options
 * @param {boolean} [options.singleCallbackPerMutation=false]
 *
 * @param {string[]} [options.attributeFilter=[]] Optional - An array of specific attribute names to be monitored. If this property isn't included, changes to all attributes cause mutation notifications. No default value.
 * @param {boolean} [options.attributeOldValue=false] Optional - Set to true to record the previous value of any attribute that changes when monitoring the node or nodes for attribute changes; see Monitoring attribute values in MutationObserver for details on watching for attribute changes and value recording. No default value.
 * @param {boolean} [options.attributes=false] Optional - Set to true to watch for changes to the value of attributes on the node or nodes being monitored. The default value is false.
 * @param {boolean} [options.characterData=false] Optional - Set to true to monitor the specified target node or subtree for changes to the character data contained within the node or nodes. No default value.
 * @param {boolean} [options.characterDataOldValue=false] Optional - Set to true to record the previous value of a node's text whenever the text changes on nodes being monitored. For details and an example, see Monitoring text content changes in MutationObserver. No default value.
 * @param {boolean} [options.childList=false] Optional - Set to true to monitor the target node (and, if subtree is true, its descendants) for the addition or removal of new child nodes. The default is false.
 * @param {boolean} [options.subtree=false] Optional -
 */

/**
 * @param {function} callback -
 * @param {Object=} options
 * @param {boolean} [options.singleCallbackPerMutation=false]
 *
 * @param {string[]} [options.attributeFilter=[]] Optional - An array of specific attribute names to be monitored. If this property isn't included, changes to all attributes cause mutation notifications. No default value.
 * @param {boolean} [options.attributeOldValue=false] Optional - Set to true to record the previous value of any attribute that changes when monitoring the node or nodes for attribute changes; see Monitoring attribute values in MutationObserver for details on watching for attribute changes and value recording. No default value.
 * @param {boolean} [options.attributes=false] Optional - Set to true to watch for changes to the value of attributes on the node or nodes being monitored. The default value is false.
 * @param {boolean} [options.characterData=false] Optional - Set to true to monitor the specified target node or subtree for changes to the character data contained within the node or nodes. No default value.
 * @param {boolean} [options.characterDataOldValue=false] Optional - Set to true to record the previous value of a node's text whenever the text changes on nodes being monitored. For details and an example, see Monitoring text content changes in MutationObserver. No default value.
 * @param {boolean} [options.childList=false] Optional - Set to true to monitor the target node (and, if subtree is true, its descendants) for the addition or removal of new child nodes. The default is false.
 * @param {boolean} [options.subtree=false] Optional -
 */
function observeDocument(callback, options={}) {
    if ($ && typeof ($.extend) === 'function') {
        options = $.extend({
            singleCallbackPerMutation: false,

            attributeFilter: [],
            attributeOldValue: true,
            attributes: true,
            characterData: false,
            characterDataOldValue: false,
            childList: true,
            subtree: true,
        }, options);
    }

    elementReady('body').then((body)=> {
        callback(document.body);

        var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        if (MutationObserver) {
            var observer = new MutationObserver(
                function mutationCallback(mutations) {
                    for (const mutation of mutations) {
                        if (!mutation.addedNodes.length)
                            continue;
                        callback(mutation.target);
                        if (options.singleCallbackPerMutation === true) {
                            break;
                        }
                    }
                }
            );
            return observer.observe(document.body, options);
        } else {
            document.addEventListener('DOMAttrModified', callback, false);
            document.addEventListener('DOMNodeInserted', callback, false);
        }
    });
}

unsafeWindow.observeDocument = observeDocument;
unsafeWindow.observeIframe = function observeIframe(iframe, observerInit, observerOptions, args) {
    // older browsers don't get responsive iframe height, for now
    if (!window.MutationObserver) return;
    console.debug('Attaching an iframe observer...', iframe, '\n\n');
    var iframeObserver = new MutationObserver(function (mutations, observer) {
        console.debug(
            'Observed mutation in iframe:', iframe,
            '\nmutations:', mutations
        );
        observerInit(mutations, observer, args);
    });

    var interval = setInterval(function () {
        if (iframe.contentWindow && iframe.contentWindow.document) {
            iframeObserver.observe(iframe.contentWindow.document, observerOptions || {
                attributes: true,
                subtree: true,
                childList: true,
                characterData: true
            });
            console.log('Successfully added observer to iframe!', iframe);

            clearInterval(interval);
        }
    }, 100);
};

unsafeWindow.observeAllFrames = function observeAllFrames(callback) {
    callback(document.body);
    callback(document);
    let mutationObserver = new MutationObserver(function (mutations) {
        for (const mutation of mutations) {
            if (mutation.addedNodes.length) {
                callback(mutation.target);
            }
        }
    });
    const mutationOptions = {
        childList: true, subtree: true,
        attributes: true, characterData: true
    };
    mutationObserver.observe(document, mutationOptions);
    for (const iframe of document.querySelectorAll('iframe')) {
        callback(iframe.body);
        mutationObserver.observe(iframe, mutationOptions);
    }
};

/**
 * @param {function} condition
 * @param {function} action
 * @param {number} interval
 */
function waitFor(condition, action, interval) {
    if (typeof condition === 'undefined') {
        console.error('"condition" should be a function type:', condition);
        return false;
    }
    if (typeof action === 'undefined') {
        console.error('"condition" should be a function type:', action);
        return false;
    }
    if (!interval) interval = 50;

    var checkExist = setInterval(function () {
        if (condition) {
            console.log('Exists!');
            clearInterval(checkExist);
            action();
        }
    }, interval);
}

function downloadUsingXmlhttpRequest(url, opts) {
    var imgUrl = url || 'http://static.jsbin.com/images/dave.min.svg?4.1.4';
    GM_xmlhttpRequest({
        method: 'GET',
        url: imgUrl,
        onload: function (respDetails) {
            var binResp = customBase64Encode(respDetails.responseText);

            /*-- Here, we just demo that we have a valid base64 encoding
                by inserting the image into the page.
                We could just as easily AJAX-off the data instead.
            */
            var zImgPara = document.createElement('p');
            var zTargetNode = document.querySelector('body *'); //1st child

            zImgPara.innerHTML = 'Image: <img src="data:image/png;base64,'
                + binResp + '">';
            zTargetNode.parentNode.insertBefore(zImgPara, zTargetNode);
        },
        overrideMimeType: 'text/plain; charset=x-user-defined'
    });


    function customBase64Encode(inputStr) {
        var
            bbLen = 3,
            enCharLen = 4,
            inpLen = inputStr.length,
            inx = 0,
            jnx,
            keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'
                + '0123456789+/=',
            output = '',
            paddingBytes = 0;
        var
            bytebuffer = new Array(bbLen),
            encodedCharIndexes = new Array(enCharLen);

        while (inx < inpLen) {
            for (jnx = 0; jnx < bbLen; ++jnx) {
                /*--- Throw away high-order byte, as documented at:
                  https://developer.mozilla.org/En/Using_XMLHttpRequest#Handling_binary_data
                */
                if (inx < inpLen) {
                    bytebuffer[jnx] = inputStr.charCodeAt(inx++) & 0xff;
                } else {
                    bytebuffer[jnx] = 0;
                }
            }

            /*--- Get each encoded character, 6 bits at a time.
                index 0: first  6 bits
                index 1: second 6 bits
                            (2 least significant bits from inputStr byte 1
                             + 4 most significant bits from byte 2)
                index 2: third  6 bits
                            (4 least significant bits from inputStr byte 2
                             + 2 most significant bits from byte 3)
                index 3: forth  6 bits (6 least significant bits from inputStr byte 3)
            */
            encodedCharIndexes[0] = bytebuffer[0] >> 2;
            encodedCharIndexes[1] = ((bytebuffer[0] & 0x3) << 4) | (bytebuffer[1] >> 4);
            encodedCharIndexes[2] = ((bytebuffer[1] & 0x0f) << 2) | (bytebuffer[2] >> 6);
            encodedCharIndexes[3] = bytebuffer[2] & 0x3f;

            //--- Determine whether padding happened, and adjust accordingly.
            paddingBytes = inx - (inpLen - 1);
            switch (paddingBytes) {
                case 1:
                    // Set last character to padding char
                    encodedCharIndexes[3] = 64;
                    break;
                case 2:
                    // Set last 2 characters to padding char
                    encodedCharIndexes[3] = 64;
                    encodedCharIndexes[2] = 64;
                    break;
                default:
                    break; // No padding - proceed
            }

            /*--- Now grab each appropriate character out of our keystring,
                based on our index array and append it to the output string.
            */
            for (jnx = 0; jnx < enCharLen; ++jnx)
                output += keyStr.charAt(encodedCharIndexes[jnx]);
        }
        return output;
    }
}

unsafeWindow.iterateOverURLPattern = function iterateOverURLPattern(inputURL) {
    inputURL = inputURL || '';

    var bracketsContent = inputURL.match(/\[.+]/);
    if (bracketsContent.length)
        var [start, end] = bracketsContent[0].replace(/[\[\]]/g, '').split('-');

    console.debug(
        'text in brackets:', bracketsContent,
        '\nstart, end:', `["${start}", "${end}"]`
    );

    let urls = [];
    for (var i = start; i <= end; i++) {
        var newNum = '' + i;
        while (newNum.length < start.length) newNum = '0' + newNum;
        urls.push(inputURL.replace(/\[.+]/, newNum));
    }
    return urls;
};

/** removes all coded functionality to the element by removing it and reappending it's outerHTML */
function sanitizeElement(element) {
    const outerHTML = element.outerHTML;
    element.after(createElement(outerHTML));
    element.remove();
}

/*
    CSS for top navbars:

.fixed-position {
    position: fixed;
    top: 0px;
    z-index: 16777271;
}

*/


/*global self */

/*jslint bitwise: true, indent: 4, laxbreak: true, laxcomma: true, smarttabs: true, plusplus: true */
/*! @source http://purl.eligrey.com/github/FileSaver.js/blob/master/src/FileSaver.js */
/* FileSaver.js
 * A saveAs() FileSaver implementation.
 * 1.3.8
 * 2018-03-22 14:03:47
 *
 * By Eli Grey, https://eligrey.com
 * License: MIT
 *   See https://github.com/eligrey/FileSaver.js/blob/master/LICENSE.md
 *
 */
// noinspection ThisExpressionReferencesGlobalObjectJS
var saveAs = saveAs || (function (view) {
    'use strict';
    // IE <10 is explicitly unsupported
    if (typeof view === 'undefined' || typeof navigator !== 'undefined' && /MSIE [1-9]\./.test(navigator.userAgent)) {
        return;
    }
    var
        doc = view.document
        // only get URL when necessary in case Blob.js hasn't overridden it yet
        ,
        get_URL = function () {
            return view.URL || view.webkitURL || view;
        },
        save_link = doc.createElementNS('http://www.w3.org/1999/xhtml', 'a'),
        can_use_save_link = 'download' in save_link,
        click = function (node) {
            var event = new MouseEvent('click');
            node.dispatchEvent(event);
        },
        is_safari = /constructor/i.test(view.HTMLElement) || view.safari,
        is_chrome_ios = /CriOS\/[\d]+/.test(navigator.userAgent),
        setImmediate = view.setImmediate || view.setTimeout,
        throw_outside = function (ex) {
            setImmediate(function () {
                throw ex;
            }, 0);
        },
        force_saveable_type = 'application/octet-stream'
        // the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
        ,
        arbitrary_revoke_timeout = 1000 * 40 // in ms
        ,
        revoke = function (file) {
            var revoker = function () {
                if (typeof file === 'string') { // file is an object URL
                    get_URL().revokeObjectURL(file);
                } else { // file is a File
                    file.remove();
                }
            };
            setTimeout(revoker, arbitrary_revoke_timeout);
        },
        dispatch = function (filesaver, event_types, event) {
            event_types = [].concat(event_types);
            var i = event_types.length;
            while (i--) {
                var listener = filesaver['on' + event_types[i]];
                if (typeof listener === 'function') {
                    try {
                        listener.call(filesaver, event || filesaver);
                    } catch (ex) {
                        throw_outside(ex);
                    }
                }
            }
        },
        auto_bom = function (blob) {
            // prepend BOM for UTF-8 XML and text/* types (including HTML)
            // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
            if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
                return new Blob([String.fromCharCode(0xFEFF), blob], {
                    type: blob.type
                });
            }
            return blob;
        },
        FileSaver = function (blob, name, no_auto_bom) {
            if (!no_auto_bom) {
                blob = auto_bom(blob);
            }
            // First try a.download, then web filesystem, then object URLs
            var
                filesaver = this,
                type = blob.type,
                force = type === force_saveable_type,
                object_url, dispatch_all = function () {
                    dispatch(filesaver, 'writestart progress write writeend'.split(' '));
                }
                // on any filesys errors revert to saving with object URLs
                ,
                fs_error = function () {
                    if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
                        // Safari doesn't allow downloading of blob urls
                        var reader = new FileReader();
                        reader.onloadend = function () {
                            var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
                            var popup = view.open(url, '_blank');
                            if (!popup) view.location.href = url;
                            url = undefined; // release reference before dispatching
                            filesaver.readyState = filesaver.DONE;
                            dispatch_all();
                        };
                        reader.readAsDataURL(blob);
                        filesaver.readyState = filesaver.INIT;
                        return;
                    }
                    // don't create more object URLs than needed
                    if (!object_url) {
                        object_url = get_URL().createObjectURL(blob);
                    }
                    if (force) {
                        view.location.href = object_url;
                    } else {
                        var opened = view.open(object_url, '_blank');
                        if (!opened) {
                            // Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
                            view.location.href = object_url;
                        }
                    }
                    filesaver.readyState = filesaver.DONE;
                    dispatch_all();
                    revoke(object_url);
                };
            filesaver.readyState = filesaver.INIT;

            if (can_use_save_link) {
                object_url = get_URL().createObjectURL(blob);
                setImmediate(function () {
                    save_link.href = object_url;
                    save_link.download = name;
                    click(save_link);
                    dispatch_all();
                    revoke(object_url);
                    filesaver.readyState = filesaver.DONE;
                }, 0);
                return;
            }

            fs_error();
        },
        FS_proto = FileSaver.prototype,
        saveAs = function (blob, name, no_auto_bom) {
            return new FileSaver(blob, name || blob.name || 'download', no_auto_bom);
        };

    // IE 10+ (native saveAs)
    if (typeof navigator !== 'undefined' && navigator.msSaveOrOpenBlob) {
        return function (blob, name, no_auto_bom) {
            name = name || blob.name || 'download';

            if (!no_auto_bom) {
                blob = auto_bom(blob);
            }
            return navigator.msSaveOrOpenBlob(blob, name);
        };
    }

    // todo: detect chrome extensions & packaged apps
    //save_link.target = "_blank";

    FS_proto.abort = function () {
    };
    FS_proto.readyState = FS_proto.INIT = 0;
    FS_proto.WRITING = 1;
    FS_proto.DONE = 2;

    FS_proto.error =
        FS_proto.onwritestart =
            FS_proto.onprogress =
                FS_proto.onwrite =
                    FS_proto.onabort =
                        FS_proto.onerror =
                            FS_proto.onwriteend =
                                null;

    return saveAs;
}(typeof self !== 'undefined' && self || typeof window !== 'undefined' && window || this));
/*`self` is undefined in Firefox for Android content script context
while `this` is nsIContentFrameMessageManager
with an attribute `content` that corresponds to the window*/
if (typeof module !== 'undefined' && module.exports) {
    module.exports.saveAs = saveAs;
} else if ((typeof define !== 'undefined' && define !== null) && (define.amd !== null)) {
    define([], function () {
        return saveAs;
    });
}
/*   Example:
 *   var blob = new Blob(["Hello, world!"], {type: "text/plain;charset=utf-8"});
 *   saveAs(blob, "hello world.txt");
 */
unsafeWindow.saveAs = saveAs;


unsafeWindow.fetchSimilarHeaders = fetchSimilarHeaders;
function fetchSimilarHeaders(callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState === 4) {
            //
            // The following headers may often be similar
            // to those of the original page request...
            //
            if (callback && typeof callback === 'function') {
                callback(request.getAllResponseHeaders());
            }
        }
    };

    //
    // Re-request the same page (document.location)
    // We hope to get the same or similar response headers to those which 
    // came with the current page, but we have no guarantee.
    // Since we are only after the headers, a HEAD request may be sufficient.
    //
    request.open('HEAD', document.location, true);
    request.send(null);
}

String.prototype.escapeSpecialChars = function () {
    return this.replace(/\\n/g, '\\n')
        .replace(/\\'/g, '\\\'')
        .replace(/\\"/g, '\\"')
        .replace(/\\&/g, '\\&')
        .replace(/\\r/g, '\\r')
        .replace(/\\t/g, '\\t')
        .replace(/\\b/g, '\\b')
        .replace(/\\f/g, '\\f');
};
function headers2Object(headers) {
    if (!headers) return {};
    const jsonParseEscape = function (str) {
        return str.replace(/\n/g, '\\n')
            .replace(/'/g, '\\\'')
            .replace(/"/g, '\\"')
            .replace(/&/g, '\\&')
            .replace(/\r/g, '\\r')
            .replace(/\t/g, '\\t')
            .replace(/\f/g, '\\f');
    };
    var jsonStr = '{\n' +
        headers.trim().split('\n').filter(line => line.length > 2)
            .map(
                line => '   ' + [line.slice(0, line.indexOf(':')), line.slice(line.indexOf(':') + 1)]
                    .map(part => '"' + jsonParseEscape(part.trim()) + '"').join(':')
            )
            .join(',\n') +
        '\n}';
    console.log('jsonStr:', jsonStr);
    return JSON.parse(jsonStr);
}


unsafeWindow.fetchUsingProxy = fetchUsingProxy;
/**
 * @param url
 * Found from:    https://stackoverflow.com/questions/43871637/no-access-control-allow-origin-header-is-present-on-the-requested-resource-whe
 * @param callback
 * @see     https://cors-anywhere.herokuapp.com/
 */
function fetchUsingProxy(url, callback) {
    const proxyurl = 'https://cors-anywhere.herokuapp.com/';
    callback = callback || (contents => console.log(contents));
    fetch(proxyurl + url) // https://cors-anywhere.herokuapp.com/https://example.com
        .then(response => response.text())
        .then(callback)
        .catch(() => console.error(`Can’t access ${url} response. Blocked by browser?`))
}


unsafeWindow.getUnusualWindowObjects = function getUnusualWindowObjects(compareWindow = window) {
    const plainWindowKeylist = ['postMessage', 'blur', 'focus', 'close', 'frames', 'self', 'window', 'parent', 'opener', 'top', 'length', 'closed', 'location', 'document', 'origin', 'name', 'history', 'locationbar', 'menubar', 'personalbar', 'scrollbars', 'statusbar', 'toolbar', 'status', 'frameElement', 'navigator', 'customElements', 'external', 'screen', 'innerWidth', 'innerHeight', 'scrollX', 'pageXOffset', 'scrollY', 'pageYOffset', 'screenX', 'screenY', 'outerWidth', 'outerHeight', 'devicePixelRatio', 'clientInformation', 'screenLeft', 'screenTop', 'defaultStatus', 'defaultstatus', 'styleMedia', 'onanimationend', 'onanimationiteration', 'onanimationstart', 'onsearch', 'ontransitionend', 'onwebkitanimationend', 'onwebkitanimationiteration', 'onwebkitanimationstart', 'onwebkittransitionend', 'isSecureContext', 'onabort', 'onblur', 'oncancel', 'oncanplay', 'oncanplaythrough', 'onchange', 'onclick', 'onclose', 'oncontextmenu', 'oncuechange', 'ondblclick', 'ondrag', 'ondragend', 'ondragenter', 'ondragleave', 'ondragover', 'ondragstart', 'ondrop', 'ondurationchange', 'onemptied', 'onended', 'onerror', 'onfocus', 'oninput', 'oninvalid', 'onkeydown', 'onkeypress', 'onkeyup', 'onload', 'onloadeddata', 'onloadedmetadata', 'onloadstart', 'onmousedown', 'onmouseenter', 'onmouseleave', 'onmousemove', 'onmouseout', 'onmouseover', 'onmouseup', 'onmousewheel', 'onpause', 'onplay', 'onplaying', 'onprogress', 'onratechange', 'onreset', 'onresize', 'onscroll', 'onseeked', 'onseeking', 'onselect', 'onstalled', 'onsubmit', 'onsuspend', 'ontimeupdate', 'ontoggle', 'onvolumechange', 'onwaiting', 'onwheel', 'onauxclick', 'ongotpointercapture', 'onlostpointercapture', 'onpointerdown', 'onpointermove', 'onpointerup', 'onpointercancel', 'onpointerover', 'onpointerout', 'onpointerenter', 'onpointerleave', 'onafterprint', 'onbeforeprint', 'onbeforeunload', 'onhashchange', 'onlanguagechange', 'onmessage', 'onmessageerror', 'onoffline', 'ononline', 'onpagehide', 'onpageshow', 'onpopstate', 'onrejectionhandled', 'onstorage', 'onunhandledrejection', 'onunload', 'performance', 'stop', 'open', 'alert', 'confirm', 'prompt', 'print', 'requestAnimationFrame', 'cancelAnimationFrame', 'requestIdleCallback', 'cancelIdleCallback', 'captureEvents', 'releaseEvents', 'getComputedStyle', 'matchMedia', 'moveTo', 'moveBy', 'resizeTo', 'resizeBy', 'getSelection', 'find', 'webkitRequestAnimationFrame', 'webkitCancelAnimationFrame', 'fetch', 'btoa', 'atob', 'setTimeout', 'clearTimeout', 'setInterval', 'clearInterval', 'createImageBitmap', 'scroll', 'scrollTo', 'scrollBy', 'onappinstalled', 'onbeforeinstallprompt', 'crypto', 'ondevicemotion', 'ondeviceorientation', 'ondeviceorientationabsolute', 'indexedDB', 'webkitStorageInfo', 'sessionStorage', 'localStorage', 'chrome', 'visualViewport', 'speechSynthesis', 'webkitRequestFileSystem', 'webkitResolveLocalFileSystemURL', 'openDatabase', 'applicationCache', 'caches', 'global', 'WebUIListener', 'cr', 'assert', 'assertNotReached', 'assertInstanceof', '$', 'getSVGElement', 'announceAccessibleMessage', 'getUrlForCss', 'parseQueryParams', 'setQueryParam', 'findAncestorByClass', 'findAncestor', 'swapDomNodes', 'disableTextSelectAndDrag', 'isRTL', 'getRequiredElement', 'queryRequiredElement', 'appendParam', 'createElementWithClassName', 'ensureTransitionEndEvent', 'scrollTopForDocument', 'setScrollTopForDocument', 'scrollLeftForDocument', 'setScrollLeftForDocument', 'HTMLEscape', 'elide', 'quoteString', 'listenOnce', 'hasKeyModifiers', 'recomputeLayoutWidth', 'ntp'];
    const farisScriptKeylist = ['log', 'JSZip', 'URL_REGEX_STR', 'IMAGE_URL_REGEX', 'VID_URL_REGEX', 'gImgSearchURL', 'GIMG_REVERSE_SEARCH_URL', 'setClipboard', 'GM_setClipboard', 'GM_xmlhttpRequest', 'setLog', 'matchSite', 'createElement', 'loadScript', 'ddgProxy', 'getOGZscalarUrl', 'reverseDdgProxy', 'isDdgUrl', 'targetIsInput', 'createAndAddAttribute', 'getGImgReverseSearchURL', 'toDdgProxy', 'isIterable', 'GM_setValue', 'GM_getValue', 'q', 'qa', 'siteSearchUrl', 'getAbsoluteURI', 'getHostname', 'openAllLinks', 'fetchElement', 'xmlRequestElement', 'onLoadDim', 'addCss', 'addJs', 'observe', 'gfycatPage2GifUrl', 'preloader', 'waitForElement', 'includeJs', 'disableStyles', 'createAndGetNavbar', 'setStyleInHTML', 'nodeDepth', 'regexBetween', 'extend', 'getWheelDelta', 'elementUnderMouse', 'clearElementFunctions', 'getIncrementedUrl', 'printElementTextAttributes', 'loadModule', 'getElementsWithText', 'fetchDoc', 'SrcSet', 'cookieUtils', 'url2location', 'freezeGif', 'removeClickListeners', 'removeDoubleSpaces', 'cleanGibberish', 'isBase64ImageData', 'cleanDates', 'downloadScripts', 'escapeEncodedChars', 'getCssImages', 'observeDocument', 'observeIframe', 'observeAllFrames', 'iterateOverURLPattern', 'saveAs', 'Mousetrap', 'fetchSimilarHeaders', 'fetchUsingProxy', 'getModKeys', 'KeyEvent', 'downloadSet', 'storeDownloadHistory', 'MAIN_DIRECTORY', 'getDownloadCount', 'setNameFilesByNumber', 'download', 'GM_download', 'downloadBatch', 'downloadImageBatch', 'downloadImageWithCondition', 'getFileExtension', 'nameFile', 'makeTextFile', 'anchorClick', 'saveByAnchor', 'zipFiles', 'zipImages', 'vidkeysScriptLoaded'];
    const referenceKeylist = new Set(plainWindowKeylist.concat(farisScriptKeylist)); // combine both lists

    const unusualObjects = {};
    // iterate over window keys, if this key isn't in the plainWindowKeylist, then add it to the unusuals list
    for (const key of Object.keys(compareWindow)) {
        if (!referenceKeylist.has(key)) {
            unusualObjects[key] = compareWindow[key]; // add to the unusualObjects
        }
    }
    return unusualObjects;
};

unsafeWindow.getModKeys = getModifierKeys;
unsafeWindow.KeyEvent = {
    DOM_VK_BACKSPACE: 8,
    DOM_VK_TAB: 9,
    DOM_VK_ENTER: 13,
    DOM_VK_SHIFT: 16,
    DOM_VK_CTRL: 17,
    DOM_VK_ALT: 18,
    DOM_VK_PAUSE_BREAK: 19,
    DOM_VK_CAPS_LOCK: 20,
    DOM_VK_ESCAPE: 27,
    DOM_VK_PGUP: 33, DOM_VK_PAGE_UP: 33,
    DOM_VK_PGDN: 34, DOM_VK_PAGE_DOWN: 34,
    DOM_VK_END: 35,
    DOM_VK_HOME: 36,
    DOM_VK_LEFT: 37, DOM_VK_LEFT_ARROW: 37,
    DOM_VK_UP: 38, DOM_VK_UP_ARROW: 38,
    DOM_VK_RIGHT: 39, DOM_VK_RIGHT_ARROW: 39,
    DOM_VK_DOWN: 40, DOM_VK_DOWN_ARROW: 40,
    DOM_VK_INSERT: 45,
    DOM_VK_DEL: 46, DOM_VK_DELETE: 46,
    DOM_VK_0: 48, DOM_VK_ALPHA0: 48,
    DOM_VK_1: 49, DOM_VK_ALPHA1: 49,
    DOM_VK_2: 50, DOM_VK_ALPHA2: 50,
    DOM_VK_3: 51, DOM_VK_ALPHA3: 51,
    DOM_VK_4: 52, DOM_VK_ALPHA4: 52,
    DOM_VK_5: 53, DOM_VK_ALPHA5: 53,
    DOM_VK_6: 54, DOM_VK_ALPHA6: 54,
    DOM_VK_7: 55, DOM_VK_ALPHA7: 55,
    DOM_VK_8: 56, DOM_VK_ALPHA8: 56,
    DOM_VK_9: 57, DOM_VK_ALPHA9: 57,
    DOM_VK_A: 65,
    DOM_VK_B: 66,
    DOM_VK_C: 67,
    DOM_VK_D: 68,
    DOM_VK_E: 69,
    DOM_VK_F: 70,
    DOM_VK_G: 71,
    DOM_VK_H: 72,
    DOM_VK_I: 73,
    DOM_VK_J: 74,
    DOM_VK_K: 75,
    DOM_VK_L: 76,
    DOM_VK_M: 77,
    DOM_VK_N: 78,
    DOM_VK_O: 79,
    DOM_VK_P: 80,
    DOM_VK_Q: 81,
    DOM_VK_R: 82,
    DOM_VK_S: 83,
    DOM_VK_T: 84,
    DOM_VK_U: 85,
    DOM_VK_V: 86,
    DOM_VK_W: 87,
    DOM_VK_X: 88,
    DOM_VK_Y: 89,
    DOM_VK_Z: 90,
    DOM_VK_LWIN: 91, DOM_VK_LEFT_WINDOW: 91,
    DOM_VK_RWIN: 92, DOM_VK_RIGHT_WINDOW: 92,
    DOM_VK_SELECT: 93,

    DOM_VK_NUMPAD0: 96,
    DOM_VK_NUMPAD1: 97,
    DOM_VK_NUMPAD2: 98,
    DOM_VK_NUMPAD3: 99,
    DOM_VK_NUMPAD4: 100,
    DOM_VK_NUMPAD5: 101,
    DOM_VK_NUMPAD6: 102,
    DOM_VK_NUMPAD7: 103,
    DOM_VK_NUMPAD8: 104,
    DOM_VK_NUMPAD9: 105,
    DOM_VK_MULTIPLY: 106,

    DOM_VK_ADD: 107,
    DOM_VK_SUBTRACT: 109,
    DOM_VK_DECIMAL_POINT: 110,
    DOM_VK_DIVIDE: 111,
    DOM_VK_F1: 112,
    DOM_VK_F2: 113,
    DOM_VK_F3: 114,
    DOM_VK_F4: 115,
    DOM_VK_F5: 116,
    DOM_VK_F6: 117,
    DOM_VK_F7: 118,
    DOM_VK_F8: 119,
    DOM_VK_F9: 120,
    DOM_VK_F10: 121,
    DOM_VK_F11: 122,
    DOM_VK_F12: 123,
    DOM_VK_NUM_LOCK: 144,
    DOM_VK_SCROLL_LOCK: 145,
    DOM_VK_SEMICOLON: 186,
    DOM_VK_EQUALS: 187, DOM_VK_EQUAL_SIGN: 187,
    DOM_VK_COMMA: 188,
    DOM_VK_DASH: 189,
    DOM_VK_PERIOD: 190,
    DOM_VK_FORWARD_SLASH: 191,
    DOM_VK_GRAVE_ACCENT: 192,
    DOM_VK_OPEN_BRACKET: 219,
    DOM_VK_BACK_SLASH: 220,
    DOM_VK_CLOSE_BRACKET: 221,
    DOM_VK_SINGLE_QUOTE: 222
};
/**
 * Order of key strokes in naming convention:   Ctrl > Shift > Alt >  Meta
 * @param keyEvent
 * @returns {{CTRL_ONLY: boolean, SHIFT_ONLY: boolean, ALT_ONLY: boolean, META_ONLY: boolean, NONE: boolean}}
 */
function getModifierKeys(keyEvent) {
    /** @type {{CTRL_ONLY: boolean, SHIFT_ONLY: boolean, ALT_ONLY: boolean, NONE: boolean}} */
    return {
        CTRL_SHIFT: keyEvent.ctrlKey && !keyEvent.altKey && keyEvent.shiftKey && !keyEvent.metaKey,
        CTRL_ALT: keyEvent.ctrlKey && keyEvent.altKey && !keyEvent.shiftKey && !keyEvent.metaKey,
        ALT_SHIFT: !keyEvent.ctrlKey && keyEvent.altKey && keyEvent.shiftKey && !keyEvent.metaKey,
        CTRL_ONLY: keyEvent.ctrlKey && !keyEvent.altKey && !keyEvent.shiftKey && !keyEvent.metaKey,
        CTRL_ALT_SHIFT: keyEvent.ctrlKey && keyEvent.altKey && keyEvent.shiftKey && !keyEvent.metaKey,

        SHIFT_ONLY: !keyEvent.ctrlKey && !keyEvent.altKey && keyEvent.shiftKey && !keyEvent.metaKey,
        ALT_ONLY: !keyEvent.ctrlKey && keyEvent.altKey && !keyEvent.shiftKey && !keyEvent.metaKey,
        META_ONLY: !keyEvent.ctrlKey && !keyEvent.altKey && !keyEvent.shiftKey && keyEvent.metaKey,

        NONE: !keyEvent.ctrlKey && !keyEvent.shiftKey && !keyEvent.altKey && !keyEvent.metaKey,

        targetIsInput: (function targetIsInput() {
            const ignores = document.getElementsByTagName('input');
            const target = keyEvent.target;
            for (let ignore of ignores)
                if (target === ignore || ignore.contains(target)) {
                    // console.log('The target recieving the keycode is of type "input", so it will not recieve your keystroke', target);
                    return true;
                }
            return false;
        })()
    };
}

function publicizeSymbols(...parameters) {
    for (const parameter of parameters) {
        unsafeWindow[parameter] = parameter;
    }
}

function mapObject(o) {
    var map = new Map();
    for (const key in (o)) {
        if (o.hasOwnProperty(key))
            map.set(key, o[key]);
    }
    return map;
}
function object2Map(obj) {
    const map = new Map();
    for (const key in obj) {
        map.set(key, obj[key]);
    }
    return map;
}

function getObjOfType(targetInstance, parentObj) {
    var list = [];
    for (const o in parentObj) if (o instanceof targetInstance) {
        return o;
    }
    return list;
}

function getNestedMembers(parentObject, targetType, list) {
    if (!parentObject) {
        console.error('parentObject is not defined:', parent);
        return;
    }
    list = list || [];
    for (const member in parentObject) {

        const typeofObj = typeof member;

        if (typeofObj === 'object') {
            getNestedMembers(member, targetType, list);
        } else if (typeofObj !== 'undefined') {
            if (targetType && typeofObj !== targetType)
                continue;
            list.push(member);
        }
    }
    return list;
}

/** https://stackoverflow.com/a/3579651/7771202 */
function sortByFrequencyAndRemoveDuplicates(array) {
    var frequency = {}, value;

    // compute frequencies of each value
    for (var i = 0; i < array.length; i++) {
        value = array[i];
        if (value in frequency) {
            frequency[value]++;
        } else {
            frequency[value] = 1;
        }
    }

    // make array from the frequency object to de-duplicate
    var uniques = [];
    for (value in frequency) {
        uniques.push(value);
    }

    // sort the uniques array in descending order by frequency
    function compareFrequency(a, b) {
        return frequency[b] - frequency[a];
    }

    return uniques.sort(compareFrequency);
}

/**
 * Snoops on an object, monitors all attempts to access and set properties
 * @param {Object} obj - the object to monitor
 * @param {string[]=} props - list of properties to watch, watches all properties by default
 * @param {Function=} onset - callback when the property is set (newValue is passed)
 * @param {Function=} onget - callback when the property is accessed
 */
function snoopProperty(obj, props = [], onset = (val) => null, onget = () => null) {
    if (props.length === 0) { // default to all properties
        props = Object.keys(obj);
    }

    for (const prop of props) {
        obj['__' + prop] = obj[prop]; // actual property

        obj.__defineSetter__(prop, function (newValue) {
            console.debug('someone just set the property:', prop, 'to value:', newValue, '\non:', obj);
            onset.call(obj, newValue);
            obj['__' + prop] = newValue;
        });
        obj.__defineGetter__(prop, function () {
            console.debug('someone just accessed', prop, '\non:', obj);
            onget.call(obj);
            return obj['__' + prop];
        });
    }
}

// copied external libs


/* mousetrap v1.6.2 craig.is/killing/mice */
/*global define:false */
/**
 * Copyright 2012-2017 Craig Campbell
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * Mousetrap is a simple keyboard shortcut library for Javascript with
 * no external dependencies
 *
 * @version 1.6.2
 * @url craig.is/killing/mice
 */
(function (window, document, undefined) {

    // Check if mousetrap is used inside browser, if not, return
    if (!window) {
        return;
    }

    /**
     * mapping of special keycodes to their corresponding keys
     *
     * everything in this dictionary cannot use keypress events
     * so it has to be here to map to the correct keycodes for
     * keyup/keydown events
     *
     * @type {Object}
     */
    var _MAP = {
        8: 'backspace',
        9: 'tab',
        13: 'enter',
        16: 'shift',
        17: 'ctrl',
        18: 'alt',
        20: 'capslock',
        27: 'esc',
        32: 'space',
        33: 'pageup',
        34: 'pagedown',
        35: 'end',
        36: 'home',
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        45: 'ins',
        46: 'del',
        91: 'meta',
        93: 'meta',
        224: 'meta'
    };

    /**
     * mapping for special characters so they can support
     *
     * this dictionary is only used incase you want to bind a
     * keyup or keydown event to one of these keys
     *
     * @type {Object}
     */
    var _KEYCODE_MAP = {
        106: '*',
        107: '+',
        109: '-',
        110: '.',
        111: '/',
        186: ';',
        187: '=',
        188: ',',
        189: '-',
        190: '.',
        191: '/',
        192: '`',
        219: '[',
        220: '\\',
        221: ']',
        222: '\''
    };

    /**
     * this is a mapping of keys that require shift on a US keypad
     * back to the non shift equivelents
     *
     * this is so you can use keyup events with these keys
     *
     * note that this will only work reliably on US keyboards
     *
     * @type {Object}
     */
    var _SHIFT_MAP = {
        '~': '`',
        '!': '1',
        '@': '2',
        '#': '3',
        '$': '4',
        '%': '5',
        '^': '6',
        '&': '7',
        '*': '8',
        '(': '9',
        ')': '0',
        '_': '-',
        '+': '=',
        ':': ';',
        '\"': '\'',
        '<': ',',
        '>': '.',
        '?': '/',
        '|': '\\'
    };

    /**
     * this is a list of special strings you can use to map
     * to modifier keys when you specify your keyboard shortcuts
     *
     * @type {Object}
     */
    var _SPECIAL_ALIASES = {
        'option': 'alt',
        'command': 'meta',
        'return': 'enter',
        'escape': 'esc',
        'plus': '+',
        'mod': /Mac|iPod|iPhone|iPad/.test(navigator.platform) ? 'meta' : 'ctrl'
    };

    /**
     * variable to store the flipped version of _MAP from above
     * needed to check if we should use keypress or not when no action
     * is specified
     *
     * @type {Object|undefined}
     */
    var _REVERSE_MAP;

    /**
     * loop through the f keys, f1 to f19 and add them to the map
     * programatically
     */
    for (var i = 1; i < 20; ++i) {
        _MAP[111 + i] = 'f' + i;
    }

    /**
     * loop through to map numbers on the numeric keypad
     */
    for (i = 0; i <= 9; ++i) {

        // This needs to use a string cause otherwise since 0 is falsey
        // mousetrap will never fire for numpad 0 pressed as part of a keydown
        // event.
        //
        // @see https://github.com/ccampbell/mousetrap/pull/258
        _MAP[i + 96] = i.toString();
    }

    /**
     * cross browser add event method
     *
     * @param {Element|HTMLDocument} object
     * @param {string} type
     * @param {Function} callback
     * @returns void
     */
    function _addEvent(object, type, callback) {
        if (object.addEventListener) {
            object.addEventListener(type, callback, false);
            return;
        }

        try {
            object.attachEvent('on' + type, callback);
        } catch (e) {
            console.error(e);
        }
    }

    /**
     * takes the event and returns the key character
     *
     * @param {Event} e
     * @return {string}
     */
    function _characterFromEvent(e) {

        // for keypress events we should return the character as is
        if (e.type == 'keypress') {
            var character = String.fromCharCode(e.which);

            // if the shift key is not pressed then it is safe to assume
            // that we want the character to be lowercase.  this means if
            // you accidentally have caps lock on then your key bindings
            // will continue to work
            //
            // the only side effect that might not be desired is if you
            // bind something like 'A' cause you want to trigger an
            // event when capital A is pressed caps lock will no longer
            // trigger the event.  shift+a will though.
            if (!e.shiftKey) {
                character = character.toLowerCase();
            }

            return character;
        }

        // for non keypress events the special maps are needed
        if (_MAP[e.which]) {
            return _MAP[e.which];
        }

        if (_KEYCODE_MAP[e.which]) {
            return _KEYCODE_MAP[e.which];
        }

        // if it is not in the special map

        // with keydown and keyup events the character seems to always
        // come in as an uppercase character whether you are pressing shift
        // or not.  we should make sure it is always lowercase for comparisons
        return String.fromCharCode(e.which).toLowerCase();
    }

    /**
     * checks if two arrays are equal
     *
     * @param {Array} modifiers1
     * @param {Array} modifiers2
     * @returns {boolean}
     */
    function _modifiersMatch(modifiers1, modifiers2) {
        return modifiers1.sort().join(',') === modifiers2.sort().join(',');
    }

    /**
     * takes a key event and figures out what the modifiers are
     *
     * @param {Event} e
     * @returns {Array}
     */
    function _eventModifiers(e) {
        var modifiers = [];

        if (e.shiftKey) {
            modifiers.push('shift');
        }

        if (e.altKey) {
            modifiers.push('alt');
        }

        if (e.ctrlKey) {
            modifiers.push('ctrl');
        }

        if (e.metaKey) {
            modifiers.push('meta');
        }

        return modifiers;
    }

    /**
     * prevents default for this event
     *
     * @param {Event} e
     * @returns void
     */
    function _preventDefault(e) {
        if (e.preventDefault) {
            e.preventDefault();
            return;
        }

        e.returnValue = false;
    }

    /**
     * stops propogation for this event
     *
     * @param {Event} e
     * @returns void
     */
    function _stopPropagation(e) {
        if (e.stopPropagation) {
            e.stopPropagation();
            return;
        }

        e.cancelBubble = true;
    }

    /**
     * determines if the keycode specified is a modifier key or not
     *
     * @param {string} key
     * @returns {boolean}
     */
    function _isModifier(key) {
        return key == 'shift' || key == 'ctrl' || key == 'alt' || key == 'meta';
    }

    /**
     * reverses the map lookup so that we can look for specific keys
     * to see what can and can't use keypress
     *
     * @return {Object}
     */
    function _getReverseMap() {
        if (!_REVERSE_MAP) {
            _REVERSE_MAP = {};
            for (var key in _MAP) {

                // pull out the numeric keypad from here cause keypress should
                // be able to detect the keys from the character
                if (key > 95 && key < 112) {
                    continue;
                }

                if (_MAP.hasOwnProperty(key)) {
                    _REVERSE_MAP[_MAP[key]] = key;
                }
            }
        }
        return _REVERSE_MAP;
    }

    /**
     * picks the best action based on the key combination
     *
     * @param {string} key - character for key
     * @param {Array} modifiers
     * @param {string=} action passed in
     */
    function _pickBestAction(key, modifiers, action) {

        // if no action was picked in we should try to pick the one
        // that we think would work best for this key
        if (!action) {
            action = _getReverseMap()[key] ? 'keydown' : 'keypress';
        }

        // modifier keys don't work as expected with keypress,
        // switch to keydown
        if (action == 'keypress' && modifiers.length) {
            action = 'keydown';
        }

        return action;
    }

    /**
     * Converts from a string key combination to an array
     *
     * @param  {string} combination like "command+shift+l"
     * @return {Array}
     */
    function _keysFromString(combination) {
        if (combination === '+') {
            return ['+'];
        }

        combination = combination.replace(/\+{2}/g, '+plus');
        return combination.split('+');
    }

    /**
     * Gets info for a specific key combination
     *
     * @param  {string} combination key combination ("command+s" or "a" or "*")
     * @param  {string=} action
     * @returns {Object}
     */
    function _getKeyInfo(combination, action) {
        var keys;
        var key;
        var i;
        var modifiers = [];

        // take the keys from this pattern and figure out what the actual
        // pattern is all about
        keys = _keysFromString(combination);

        for (i = 0; i < keys.length; ++i) {
            key = keys[i];

            // normalize key names
            if (_SPECIAL_ALIASES[key]) {
                key = _SPECIAL_ALIASES[key];
            }

            // if this is not a keypress event then we should
            // be smart about using shift keys
            // this will only work for US keyboards however
            if (action && action != 'keypress' && _SHIFT_MAP[key]) {
                key = _SHIFT_MAP[key];
                modifiers.push('shift');
            }

            // if this key is a modifier then add it to the list of modifiers
            if (_isModifier(key)) {
                modifiers.push(key);
            }
        }

        // depending on what the key combination is
        // we will try to pick the best event for it
        action = _pickBestAction(key, modifiers, action);

        return {
            key: key,
            modifiers: modifiers,
            action: action
        };
    }

    function _belongsTo(element, ancestor) {
        if (element === null || element === document) {
            return false;
        }

        if (element === ancestor) {
            return true;
        }

        return _belongsTo(element.parentNode, ancestor);
    }

    function Mousetrap(targetElement) {
        var self = this;

        targetElement = targetElement || document;

        if (!(self instanceof Mousetrap)) {
            return new Mousetrap(targetElement);
        }

        /**
         * element to attach key events to
         *
         * @type {Element}
         */
        self.target = targetElement;

        /**
         * a list of all the callbacks setup via Mousetrap.bind()
         *
         * @type {Object}
         */
        self._callbacks = {};

        /**
         * direct map of string combinations to callbacks used for trigger()
         *
         * @type {Object}
         */
        self._directMap = {};

        /**
         * keeps track of what level each sequence is at since multiple
         * sequences can start out with the same sequence
         *
         * @type {Object}
         */
        var _sequenceLevels = {};

        /**
         * variable to store the setTimeout call
         *
         * @type {null|number}
         */
        var _resetTimer;

        /**
         * temporary state where we will ignore the next keyup
         *
         * @type {boolean|string}
         */
        var _ignoreNextKeyup = false;

        /**
         * temporary state where we will ignore the next keypress
         *
         * @type {boolean}
         */
        var _ignoreNextKeypress = false;

        /**
         * are we currently inside of a sequence?
         * type of action ("keyup" or "keydown" or "keypress") or false
         *
         * @type {boolean|string}
         */
        var _nextExpectedAction = false;

        /**
         * resets all sequence counters except for the ones passed in
         *
         * @param {Object} doNotReset
         * @returns void
         */
        function _resetSequences(doNotReset) {
            doNotReset = doNotReset || {};

            var activeSequences = false,
                key;

            for (key in _sequenceLevels) {
                if (doNotReset[key]) {
                    activeSequences = true;
                    continue;
                }
                _sequenceLevels[key] = 0;
            }

            if (!activeSequences) {
                _nextExpectedAction = false;
            }
        }

        /**
         * finds all callbacks that match based on the keycode, modifiers,
         * and action
         *
         * @param {string} character
         * @param {Array} modifiers
         * @param {Event|Object} e
         * @param {string=} sequenceName - name of the sequence we are looking for
         * @param {string=} combination
         * @param {number=} level
         * @returns {Array}
         */
        function _getMatches(character, modifiers, e, sequenceName, combination, level) {
            var i;
            var callback;
            var matches = [];
            var action = e.type;

            // if there are no events related to this keycode
            if (!self._callbacks[character]) {
                return [];
            }

            // if a modifier key is coming up on its own we should allow it
            if (action == 'keyup' && _isModifier(character)) {
                modifiers = [character];
            }

            // loop through all callbacks for the key that was pressed
            // and see if any of them match
            for (i = 0; i < self._callbacks[character].length; ++i) {
                callback = self._callbacks[character][i];

                // if a sequence name is not specified, but this is a sequence at
                // the wrong level then move onto the next match
                if (!sequenceName && callback.seq && _sequenceLevels[callback.seq] != callback.level) {
                    continue;
                }

                // if the action we are looking for doesn't match the action we got
                // then we should keep going
                if (action != callback.action) {
                    continue;
                }

                // if this is a keypress event and the meta key and control key
                // are not pressed that means that we need to only look at the
                // character, otherwise check the modifiers as well
                //
                // chrome will not fire a keypress if meta or control is down
                // safari will fire a keypress if meta or meta+shift is down
                // firefox will fire a keypress if meta or control is down
                if ((action == 'keypress' && !e.metaKey && !e.ctrlKey) || _modifiersMatch(modifiers, callback.modifiers)) {

                    // when you bind a combination or sequence a second time it
                    // should overwrite the first one.  if a sequenceName or
                    // combination is specified in this call it does just that
                    //
                    // @todo make deleting its own method?
                    var deleteCombo = !sequenceName && callback.combo == combination;
                    var deleteSequence = sequenceName && callback.seq == sequenceName && callback.level == level;
                    if (deleteCombo || deleteSequence) {
                        self._callbacks[character].splice(i, 1);
                    }

                    matches.push(callback);
                }
            }

            return matches;
        }

        /**
         * actually calls the callback function
         *
         * if your callback function returns false this will use the jquery
         * convention - prevent default and stop propogation on the event
         *
         * @param {Function} callback
         * @param {Event} e
         * @param combo
         * @param sequence
         * @param combo
         * @param sequence
         * @returns void
         */
        function _fireCallback(callback, e, combo, sequence) {

            // if this event should not happen stop here
            if (self.stopCallback(e, e.target || e.srcElement, combo, sequence)) {
                return;
            }

            if (callback(e, combo) === false) {
                _preventDefault(e);
                _stopPropagation(e);
            }
        }

        /**
         * handles a character key event
         *
         * @param {string} character
         * @param {Array} modifiers
         * @param {Event} e
         * @returns void
         */
        self._handleKey = function (character, modifiers, e) {
            var callbacks = _getMatches(character, modifiers, e);
            var i;
            var doNotReset = {};
            var maxLevel = 0;
            var processedSequenceCallback = false;

            // Calculate the maxLevel for sequences so we can only execute the longest callback sequence
            for (i = 0; i < callbacks.length; ++i) {
                if (callbacks[i].seq) {
                    maxLevel = Math.max(maxLevel, callbacks[i].level);
                }
            }

            // loop through matching callbacks for this key event
            for (i = 0; i < callbacks.length; ++i) {

                // fire for all sequence callbacks
                // this is because if for example you have multiple sequences
                // bound such as "g i" and "g t" they both need to fire the
                // callback for matching g cause otherwise you can only ever
                // match the first one
                if (callbacks[i].seq) {

                    // only fire callbacks for the maxLevel to prevent
                    // subsequences from also firing
                    //
                    // for example 'a option b' should not cause 'option b' to fire
                    // even though 'option b' is part of the other sequence
                    //
                    // any sequences that do not match here will be discarded
                    // below by the _resetSequences call
                    if (callbacks[i].level != maxLevel) {
                        continue;
                    }

                    processedSequenceCallback = true;

                    // keep a list of which sequences were matches for later
                    doNotReset[callbacks[i].seq] = 1;
                    _fireCallback(callbacks[i].callback, e, callbacks[i].combo, callbacks[i].seq);
                    continue;
                }

                // if there were no sequence matches but we are still here
                // that means this is a regular match so we should fire that
                if (!processedSequenceCallback) {
                    _fireCallback(callbacks[i].callback, e, callbacks[i].combo);
                }
            }

            // if the key you pressed matches the type of sequence without
            // being a modifier (ie "keyup" or "keypress") then we should
            // reset all sequences that were not matched by this event
            //
            // this is so, for example, if you have the sequence "h a t" and you
            // type "h e a r t" it does not match.  in this case the "e" will
            // cause the sequence to reset
            //
            // modifier keys are ignored because you can have a sequence
            // that contains modifiers such as "enter ctrl+space" and in most
            // cases the modifier key will be pressed before the next key
            //
            // also if you have a sequence such as "ctrl+b a" then pressing the
            // "b" key will trigger a "keypress" and a "keydown"
            //
            // the "keydown" is expected when there is a modifier, but the
            // "keypress" ends up matching the _nextExpectedAction since it occurs
            // after and that causes the sequence to reset
            //
            // we ignore keypresses in a sequence that directly follow a keydown
            // for the same character
            var ignoreThisKeypress = e.type == 'keypress' && _ignoreNextKeypress;
            if (e.type == _nextExpectedAction && !_isModifier(character) && !ignoreThisKeypress) {
                _resetSequences(doNotReset);
            }

            _ignoreNextKeypress = processedSequenceCallback && e.type == 'keydown';
        };

        /**
         * handles a keydown event
         *
         * @param {Event} e
         * @returns void
         */
        function _handleKeyEvent(e) {

            // normalize e.which for key events
            // @see http://stackoverflow.com/questions/4285627/javascript-keycode-vs-charcode-utter-confusion
            if (typeof e.which !== 'number') {
                e.which = e.keyCode;
            }

            var character = _characterFromEvent(e);

            // no character found then stop
            if (!character) {
                return;
            }

            // need to use === for the character check because the character can be 0
            if (e.type == 'keyup' && _ignoreNextKeyup === character) {
                _ignoreNextKeyup = false;
                return;
            }

            self.handleKey(character, _eventModifiers(e), e);
        }

        /**
         * called to set a 1 second timeout on the specified sequence
         *
         * this is so after each key press in the sequence you have 1 second
         * to press the next key before you have to start over
         *
         * @returns void
         */
        function _resetSequenceTimer() {
            clearTimeout(_resetTimer);
            _resetTimer = setTimeout(_resetSequences, 1000);
        }

        /**
         * binds a key sequence to an event
         *
         * @param {string} combo - combo specified in bind call
         * @param {Array} keys
         * @param {Function} callback
         * @param {string=} action
         * @returns void
         */
        function _bindSequence(combo, keys, callback, action) {

            // start off by adding a sequence level record for this combination
            // and setting the level to 0
            _sequenceLevels[combo] = 0;

            /**
             * callback to increase the sequence level for this sequence and reset
             * all other sequences that were active
             *
             * @param {string} nextAction
             * @returns {Function}
             */
            function _increaseSequence(nextAction) {
                return function () {
                    _nextExpectedAction = nextAction;
                    ++_sequenceLevels[combo];
                    _resetSequenceTimer();
                };
            }

            /**
             * wraps the specified callback inside of another function in order
             * to reset all sequence counters as soon as this sequence is done
             *
             * @param {Event} e
             * @returns void
             */
            function _callbackAndReset(e) {
                _fireCallback(callback, e, combo);

                // we should ignore the next key up if the action is key down
                // or keypress.  this is so if you finish a sequence and
                // release the key the final key will not trigger a keyup
                if (action !== 'keyup') {
                    _ignoreNextKeyup = _characterFromEvent(e);
                }

                // weird race condition if a sequence ends with the key
                // another sequence begins with
                setTimeout(_resetSequences, 10);
            }

            // loop through keys one at a time and bind the appropriate callback
            // function.  for any key leading up to the final one it should
            // increase the sequence. after the final, it should reset all sequences
            //
            // if an action is specified in the original bind call then that will
            // be used throughout.  otherwise we will pass the action that the
            // next key in the sequence should match.  this allows a sequence
            // to mix and match keypress and keydown events depending on which
            // ones are better suited to the key provided
            for (var i = 0; i < keys.length; ++i) {
                var isFinal = i + 1 === keys.length;
                var wrappedCallback = isFinal ? _callbackAndReset : _increaseSequence(action || _getKeyInfo(keys[i + 1]).action);
                _bindSingle(keys[i], wrappedCallback, action, combo, i);
            }
        }

        /**
         * binds a single keyboard combination
         *
         * @param {string} combination
         * @param {Function} callback
         * @param {string=} action
         * @param {string=} sequenceName - name of sequence if part of sequence
         * @param {number=} level - what part of the sequence the command is
         * @returns void
         */
        function _bindSingle(combination, callback, action, sequenceName, level) {

            // store a direct mapped reference for use with Mousetrap.trigger
            self._directMap[combination + ':' + action] = callback;

            // make sure multiple spaces in a row become a single space
            combination = combination.replace(/\s+/g, ' ');

            var sequence = combination.split(' ');
            var info;

            // if this pattern is a sequence of keys then run through this method
            // to reprocess each pattern one key at a time
            if (sequence.length > 1) {
                _bindSequence(combination, sequence, callback, action);
                return;
            }

            info = _getKeyInfo(combination, action);

            // make sure to initialize array if this is the first time
            // a callback is added for this key
            self._callbacks[info.key] = self._callbacks[info.key] || [];

            // remove an existing match if there is one
            _getMatches(info.key, info.modifiers, {type: info.action}, sequenceName, combination, level);

            // add this call back to the array
            // if it is a sequence put it at the beginning
            // if not put it at the end
            //
            // this is important because the way these are processed expects
            // the sequence ones to come first
            self._callbacks[info.key][sequenceName ? 'unshift' : 'push']({
                callback: callback,
                modifiers: info.modifiers,
                action: info.action,
                seq: sequenceName,
                level: level,
                combo: combination
            });
        }

        /**
         * binds multiple combinations to the same callback
         *
         * @param {Array} combinations
         * @param {Function} callback
         * @param {string|undefined} action
         * @returns void
         */
        self._bindMultiple = function (combinations, callback, action) {
            for (var i = 0; i < combinations.length; ++i) {
                _bindSingle(combinations[i], callback, action);
            }
        };

        // start!
        _addEvent(targetElement, 'keypress', _handleKeyEvent);
        _addEvent(targetElement, 'keydown', _handleKeyEvent);
        _addEvent(targetElement, 'keyup', _handleKeyEvent);
    }

    /**
     * binds an event to mousetrap
     *
     * can be a single key, a combination of keys separated with +,
     * an array of keys, or a sequence of keys separated by spaces
     *
     * be sure to list the modifier keys first to make sure that the
     * correct key ends up getting bound (the last key in the pattern)
     *
     * @param {string|Array} keys
     * @param {Function} callback
     * @param {string=} action - 'keypress', 'keydown', or 'keyup'
     * @returns void
     */
    Mousetrap.prototype.bind = function (keys, callback, action) {
        var self = this;
        keys = keys instanceof Array ? keys : [keys];
        self._bindMultiple.call(self, keys, callback, action);
        return self;
    };

    /**
     * unbinds an event to mousetrap
     *
     * the unbinding sets the callback function of the specified key combo
     * to an empty function and deletes the corresponding key in the
     * _directMap dict.
     *
     * TODO: actually remove this from the _callbacks dictionary instead
     * of binding an empty function
     *
     * the keycombo+action has to be exactly the same as
     * it was defined in the bind method
     *
     * @param {string|Array} keys
     * @param {string} action
     * @returns void
     */
    Mousetrap.prototype.unbind = function (keys, action) {
        var self = this;
        return self.bind.call(self, keys, function () {
        }, action);
    };

    /**
     * triggers an event that has already been bound
     *
     * @param {string} keys
     * @param {string=} action
     * @returns void
     */
    Mousetrap.prototype.trigger = function (keys, action) {
        var self = this;
        if (self._directMap[keys + ':' + action]) {
            self._directMap[keys + ':' + action]({}, keys);
        }
        return self;
    };

    /**
     * resets the library back to its initial state.  this is useful
     * if you want to clear out the current keyboard shortcuts and bind
     * new ones - for example if you switch to another page
     *
     * @returns void
     */
    Mousetrap.prototype.reset = function () {
        var self = this;
        self._callbacks = {};
        self._directMap = {};
        return self;
    };

    /**
     * should we stop this event before firing off callbacks
     *
     * @param {Event} e
     * @param {Element} element
     * @return {boolean}
     */
    Mousetrap.prototype.stopCallback = function (e, element) {
        var self = this;

        // if the element has the class "mousetrap" then no need to stop
        if ((' ' + element.className + ' ').indexOf(' mousetrap ') > -1) {
            return false;
        }

        if (_belongsTo(element, self.target)) {
            return false;
        }

        // stop for input, select, and textarea
        return element.tagName == 'INPUT' || element.tagName == 'SELECT' || element.tagName == 'TEXTAREA' || element.isContentEditable;
    };

    /**
     * exposes _handleKey publicly so it can be overwritten by extensions
     */
    Mousetrap.prototype.handleKey = function () {
        var self = this;
        return self._handleKey.apply(self, arguments);
    };

    /**
     * allow custom key mappings
     */
    Mousetrap.addKeycodes = function (object) {
        for (var key in object) {
            if (object.hasOwnProperty(key)) {
                _MAP[key] = object[key];
            }
        }
        _REVERSE_MAP = null;
    };

    /**
     * Init the global mousetrap functions
     *
     * This method is needed to allow the global mousetrap functions to work
     * now that mousetrap is a constructor function.
     */
    Mousetrap.init = function () {
        var documentMousetrap = Mousetrap(document);
        for (var method in documentMousetrap) {
            if (method.charAt(0) !== '_') {
                Mousetrap[method] = (function (method) {
                    return function () {
                        return documentMousetrap[method].apply(documentMousetrap, arguments);
                    };
                }(method));
            }
        }
    };

    Mousetrap.init();

    // expose mousetrap to the global object
    window.Mousetrap = Mousetrap;

    // expose as a common js module
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = Mousetrap;
    }

    // expose mousetrap as an AMD module
    if (typeof define === 'function' && define.amd) {
        define(function () {
            return Mousetrap;
        });
    }
})(typeof window !== 'undefined' ? window : null, typeof window !== 'undefined' ? document : null);
unsafeWindow.Mousetrap = Mousetrap;

