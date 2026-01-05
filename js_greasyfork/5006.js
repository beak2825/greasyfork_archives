// ==UserScript==
// @name            Apple Trailer Download HD+
// @namespace       http://www.digitaledgestudios.nl/
// @author          mhu
// @description     Download movie trailers from the Apple iTunes Movie Trailers site
// @include         https://trailers.apple.com/trailers/*/*
// @exclude         https://trailers.apple.com/trailers/*/*/gallery/*
// @version         2.0.28
// @grant           GM.addStyle
// @grant           GM_addStyle
// @grant           GM.xmlHttpRequest
// @grant           GM_xmlhttpRequest
// @grant           GM.registerMenuCommand
// @grant           GM_registerMenuCommand
// @grant           GM.setClipboard
// @grant           GM_setClipboard
// @require         https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require         https://openuserjs.org/src/libs/sizzle/GM_config.js
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/5006/Apple%20Trailer%20Download%20HD%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/5006/Apple%20Trailer%20Download%20HD%2B.meta.js
// ==/UserScript==


// based on jQuery.browser
browserInfo = function () {
    var browser = {},
        uaMatch = function (ua) {
            ua = ua.toLowerCase();

            var match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                /(msie) ([\w.]+)/.exec(ua) ||
                /(trident)[ \/](?:.*? rv:([\w.]+))/.exec(ua) ||
                ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) ||
                [];

            return {
                browser: match[1] || "",
                version: match[2] || "0"
            };
        },
        matched = uaMatch(navigator.userAgent);

    browser.version = 0;
    if (matched.browser) {
        browser[matched.browser] = true;
        browser.version = parseFloat(matched.version);

        if (browser.trident) {
            // IE11+
            browser.msie = true;
        }

        // Chrome is Webkit, but Webkit is also Safari.
        if (browser.chrome) {
            browser.webkit = true;
        } else if (browser.webkit) {
            browser.safari = true;
        }
    }

    return browser;
}();

(function() {
    "use strict";

    // constants
    var TITLE = 'Apple Trailer Download HD+',
        ERROR_MSG = 'No downloadable trailers found',
        CLICK_MSG = 'Please click the Watch the trailer link',
        APPLEERRORINDICATORS = /(class="page-errors"|pageType="errorPage")/i,
        APPLEERRORINDICATOR_OLD = /pageType="errorPage"/i,
        SIZES = [ 'Small (480p)', 'Normal (720p)', 'Large (1080p)' ],
        reBackToTrailers = new RegExp('<div class="[^"]*back-to-trailers[^"]*">[^<]*<a\b', 'img'),

    // globals
        g_allLinks = {"480p": [], "720p": [], "1080p": []},
        g_atdcontainer,
        g_baseUrl;

    /**
    * This is where we start. Inject styles.
    * Will run automatically after the load event has fired.
    */
    function initScript() {
        var css = '#atdContainer {background-color: rgba(0,0,0, 0.9); background-image:-moz-linear-gradient(right, #B5B5B5, #7D7D7D); background-image:-webkit-linear-gradient(right, #B5B5B5, #7D7D7D); background-image:linear-gradient(right, #B5B5B5, #7D7D7D); border:2px solid white; border-radius:5px; bottom:10px; box-shadow:0 -1px 5px rgba(0, 0, 0, 0.75); color:#333; display:table; font-family:Arial,sans-serif; height:35px; max-width:200px; min-width:120px; opacity:.9; padding:0 5px; position:fixed; right:10px; text-align:left; z-index:900;} ' +
            '#atdHeader { background-color: rgba(0,0,0, 1); background-image: -moz-linear-gradient(right, rgba(120, 120, 120, 0.55), rgba(75, 75, 75, 0.75)); background-image: -webkit-linear-gradient(right, rgba(120, 120, 120, 0.55), rgba(75, 75, 75, 0.75)); background-image: linear-gradient(right, rgba(120, 120, 120, 0.55), rgba(75, 75, 75, 0.75)); border-top-left-radius: 5px; border-top-right-radius: 5px; box-shadow:-1px -1px 2px black inset; margin: 0 -5px; padding: 2px 3px 5px; text-align: center; } ' +
            '#atdHeaderLink { color: #FFFFFF; font: small-caps bold 0.9em/1.1em helvetica,arial,sans-serif; text-shadow: 1px 0 rgba(0, 0, 0, 0.9); } ' +
            '#atdContainer li {display: list-item; font-size:1em; line-height:1.4em; padding-left:17px; background:url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAABGdBTUEAALGPC/xhBQAAABl0RVh0U29mdHdhcmUAUGFpbnQuTkVUIHYzLjUuODc7gF0AAAGgSURBVDhPhZM7SwNBEMddc/EJooVgJzYWEcFKRFCwEJtgIX6Ha+y0tbaSkMs7IYQQkiYISaGSQjvFBzZ+ABFBfFRpBOWQ+JuQC3e58/Jrlpnd+c/s7Kwa6CGTyShd11uWG3vWNM1JpVRT07QQe+e2vfHeeIedTqeHU6nUxiWcQiKRmEdQk0OsAUnmCBCH5ZQDBITuoQXXEIvFJsTfEZjuCtiVksmkMgxjPRKJLBaLxf1feAUqWUZASVWemUWVjKpSqeg3Hc7gER7gDhqNxgnBq4is2bOPYAQluFarHX6BlCzQPNNui+8WOLvgqAJFuXvgDaxgr1XEqtXqLteRpEPdBuJQpVJpSjL6CUhD6U/76Vx9KJfLoX4CVxCNRtvP5xCQCuh4+Bv8KviAbDa75Tk89OHgBfwEZO8ZEJlzicTj8fAF9BN4B2sauyI4BqlghvVIhuY/ERmqer1+zDO6+yBqTGGQQTI+4QeeQAapCWLLOBM8Zb2C6yU6ImO5XG67UCjs0Fydq+3l8/kV7CXsTZkZm0BA3nNUJtH3W3p8eetH/gFubA10E1qWsgAAAABJRU5ErkJggg==") no-repeat scroll -2px 1px transparent;} ' +
            '#atdContainer li > a {color:#0F0F1F; font-weight:normal; font-size:0.9em; text-decoration:none;vertical-align: middle;cursor:pointer; } ' +
            '#atdContainer li.error {color:#D90000; font-weight:normal; font-size:0.9em; text-decoration:none;} ' +
            '#atd480p, #atd720p, #atd1080p, #atdLoader {box-shadow:-1px -1px 3px #000000 inset;} ' +
            '#atd1080p {padding-bottom:4px; } ' +
            '#atdContainer > div:not(.toggle) {margin:0 -5px; padding:3px 5px;} ' +
            '#atdContainer .toggle {cursor:pointer;border: thin solid black; box-shadow: 0px -1px 3px rgba(255, 255, 255, 0.25) inset; color: white; font-size: 1em; font-weight: bold; margin: 0 -5px; padding: 0 5px 0 0; text-align: right;} ' +
            '#atdContainer .toggle:hover {margin: 0 -6px; box-shadow:0 2px 5px rgba(0, 0, 0, 0.75);} ' +
            '#atdContainer .toggle:last-of-type {margin-bottom:1px;} ' +
            '#atdLoader {background:url("data:image/gif;base64,R0lGODlhKwALAPEAAP///wAAAIKCggAAACH/C05FVFNDQVBFMi4wAwEAAAAh/hpDcmVhdGVkIHdpdGggYWpheGxvYWQuaW5mbwAh+QQJCgAAACwAAAAAKwALAAACMoSOCMuW2diD88UKG95W88uF4DaGWFmhZid93pq+pwxnLUnXh8ou+sSz+T64oCAyTBUAACH5BAkKAAAALAAAAAArAAsAAAI9xI4IyyAPYWOxmoTHrHzzmGHe94xkmJifyqFKQ0pwLLgHa82xrekkDrIBZRQab1jyfY7KTtPimixiUsevAAAh+QQJCgAAACwAAAAAKwALAAACPYSOCMswD2FjqZpqW9xv4g8KE7d54XmMpNSgqLoOpgvC60xjNonnyc7p+VKamKw1zDCMR8rp8pksYlKorgAAIfkECQoAAAAsAAAAACsACwAAAkCEjgjLltnYmJS6Bxt+sfq5ZUyoNJ9HHlEqdCfFrqn7DrE2m7Wdj/2y45FkQ13t5itKdshFExC8YCLOEBX6AhQAADsAAAAAAAAAAAA=") center 15px no-repeat;} ' +
            '#atdLoaderText {font-size:0.9em; margin:0; padding:30px 0 5px; text-align:center;} ' +
            '#atdError {background-image:-moz-linear-gradient(top, rgba(255, 0, 0, 0.2), rgba(255, 0, 0, 0.6));-webkit-linear-gradient(top, rgba(255, 0, 0, 0.2), rgba(255, 0, 0, 0.6));linear-gradient(top, rgba(255, 0, 0, 0.2), rgba(255, 0, 0, 0.6));color:black;} ' +
            '.atdListing {margin-bottom:0}' +
            '.errorMsg {font-weight:bold; font-size:0.8em;}' +
            '.roundBottomCorners {border-bottom-left-radius:5px; border-bottom-right-radius:5px;} ' +
            '.hidden {display:none;}';

        writeLog(TITLE + " script started");

        //  update the style (repeat after awhile, to detect background changes)
        addNewStyle(css);
        getTrailerListingColor(addNewStyle);
        setTimeout(function() {getTrailerListingColor(addNewStyle);}, 500);
        setInterval(function() {getTrailerListingColor(addNewStyle);}, 1500);

        // add header
        g_atdcontainer.appendChild(createAtdHeader());

        // Show loading animation until fetching necessary data has finished.
        g_atdcontainer.appendChild(createLoader());
        document.body.insertBefore(g_atdcontainer, document.body.firstChild);
    }

    /**
    * Loads the backbone collection containing the download links (async)
    */
    function getBackboneTrailerPage(useMeta) {
        var meta, id, url = null;

        if (useMeta) {
            // check for met tag with movie details
            // <meta name="apple-itunes-app" content="app-id=471966214, app-argument=movietrailers://movie/detail/18206">
            meta = document.head.querySelector("[name=apple-itunes-app]");
            if (meta && meta.content) {
                id = meta.content.replace(/.*?\/([0-9]*)$/, '$1');
                if (id !== "") {
                    url = "https://trailers.apple.com/trailers/feeds/data/"+id+".json";
                }
            }
        }
        if (!url) {
            url = g_baseUrl + "data/page.json";
        }

        writeLog(TITLE + ": Downloading '" + url + "'...");
        GM.xmlHttpRequest({
            "url": url,
            "method": "GET",
            "synchronous": false,
            "timeout": 60*1000,
            "onload": function(xhr) {
                // analyse the contents
                if (!xhr.responseText || APPLEERRORINDICATORS.test(xhr.responseText)) {
                    // retry with standard url
                    if (useMeta) {
                        getBackboneTrailerPage(false);
                        return
                    }

                    if (xhr.responseText && APPLEERRORINDICATOR_OLD.test(xhr.responseText))
                    {
                        parseOldTrailerPage(); // try old page type
                    }
                    else
                    {
                        getTrailerPage(); // try trailer page
                    }
                }
                else {
                    parseBackboneTrailerPage(xhr.responseText);
                }
            },
            "ontimeout": function() {
                showError("Timeout occurred");
            },
            "onerror": function() {
                showError("Could not download '"+url+"'");
            }
        });
    }

    function parseBackboneTrailerPage(page) {
        var collection, i, clip, src_title, sizes;

        writeLog(TITLE + ": Analyzing downloaded data...");

        try {
            // convert to json
            collection = JSON.parse(page.replace(/\\r\\n/g," "));

            // get all the HD links from the json collection
            if (collection.clips && collection.clips.length) {
                for(i = 0; i < collection.clips.length; i++) {
                    clip = collection.clips[i];
                    src_title = clip.title || "Trailer";

                    if (clip.versions && clip.versions.enus && clip.versions.enus.sizes) {
                        sizes = clip.versions.enus.sizes;
                        if (sizes.sd) {
                            addDownloadLink(sizes.sd.src, src_title, "480p");
                        }
                        if (sizes.hd720) {
                            addDownloadLink(sizes.hd720.src, src_title, "720p");
                        }
                        if (sizes.hd1080) {
                            addDownloadLink(sizes.hd1080.src, src_title, "1080p");
                        }
                    }
                }

                showAdtContainer();
            } else {
                showError('');
            }
        }
        catch (err) {
            showError("Could not parse page.json: " + (err.description || err.message));
        }
    }

    // start getting the links
    function getTrailerPage() {
        writeLog(TITLE + ": Downloading '" + g_baseUrl + "includes/large.html'...");
        GM.xmlHttpRequest({
            "method": "GET",
            "synchronous": false,
            "url": g_baseUrl + "includes/large.html",
            "timeout": 60*1000,
            "onload": function(xhr, status) {
                // analyse the contents
                if (!xhr.responseText || APPLEERRORINDICATORS.test(xhr.responseText)) {
                    // check if a "watch the trailer" link exists
                    if ($('#showtimesmain').getElementsByClassName('back-to-trailers')) {
                        showMessage(CLICK_MSG);
                    }
                    else {
                        showError("Could not find a valid trailer page");
                    }
                }
                else {
                    getTrailerSubPages(xhr.responseText);
                }
            },
            "ontimeout": function() {
                showError("Timeout occurred");
            },
            "onerror": function() {
                showError("Could not download includes/large.html");
            }
        });
    }

    /**
    * Loads the trailer subpage containing the download links (async)
    */
    function getDownloadlinks(url, title, cb) {
        GM.xmlHttpRequest({
            "url": g_baseUrl + url,
            "method": "GET",
            "synchronous": false,
            "timeout": 60*1000,
            "onload": function(xhr) {
                // analyse the contents
                if (!xhr.responseText || APPLEERRORINDICATORS.test(xhr.responseText)) {
                    showError("Could not download includes/large.html");
                }
                else {
                    insertDownloadLink(xhr.responseText, title);
                }
                if (cb) { cb(); }
            },
            "ontimeout": function() {
                showError("Timeout occurred");
                if (cb) { cb(); }
            },
            "onerror": function() {
                showError("Could not download trailer subpage");
                if (cb) { cb(); }
            }
        });
    }

    /**
    * Adds the trailer links to the respective arrays
    */
    function insertDownloadLink(page, title) {
        var reLink = new RegExp('<a class="movieLink" href="([^\\?"]+).mov', 'img'),
            result;

        // get all the HD links from the trailer page
        reLink.lastIndex = 0;
        if ((result = reLink.exec(page))) {
            if (result.length >= 2) {
                addDownloadLink(result[1], title);
            }
        }
    }

    function addDownloadLink(url, title, curSize)
    {
        var size, i, size_url, size_links, duplicate;

        try
        {
            for(size in g_allLinks) {
                if (!g_allLinks.hasOwnProperty(size)) {
                    continue;
                }
                if (curSize && curSize != size) {
                    continue;
                }

                size_url = normalizeTrailerLink(url, size);
                size_links = g_allLinks[size];

                // avoid duplicates
                duplicate = false;
                for (i = 0; i < size_links.length; i++) {
                    if (size_links[i] && size_links[i].href == url) {
                        duplicate = true;
                        break;
                    }
                }

                if (!duplicate) {
                    writeLog(TITLE + ": - Trailer link found: '" + size_url + "' (" + url + ")");
                    size_links.push(createElem('a', { 'textContent': title, 'href': size_url, 'title': 'Download ' + size }));
                }
            }
        }
        catch (err)
        {
            writeLog(TITLE + ": " + (err.message || err.description));
        }
    }

    function normalizeTrailerLink(url, size) {
        // url = url.toLowerCase();  don't change the case!!!

        // remove size
        url = url.replace(/_h?([0-9]+p?)(.mov)?$/, '');

        // switch to https
        url = url.replace("http://", "https://");

        // workaround some incorrect links
        url = url.replace("https://movietrailers.apple.com", "https://trailers.apple.com");
        url = url.replace("https://trailers.apple.com/movies//trailers/independent", "https://trailers.apple.com/movies/independent");

        // add requested size
        url = url + "_h" + size + ".mov";

        return url;
    }

    /**
    * Scan the page for HD quicktime movies. Get all <a> tags with specific href's
    */
    function getTrailerSubPages(page) {
        var src_url, src_title,
        reLink = new RegExp('<a href="includes/([^#"]+)#?.[^"]*"', 'img'),
        reTitle_old = new RegExp('<h4>([^<]+)</h4>', 'img'),
        reTitle_new = new RegExp('<h3 title="[^"]+">([^<]+)</h3>', 'img'),
        result = null, requests, j,
        links = [],
        titles = [];

        writeLog(TITLE + ": Analyzing downloaded page...");

        // get all the HD links from the trailer page
        reLink.lastIndex = 0;
        while ((result = reLink.exec(page))) {
            if (result.length >= 2 && links.indexOfCI(result[1]) < 0) {
                writeLog(TITLE + ": - Trailer page found: '" + result[1] + "'");
                links.push(result[1]);
            }
        }

        // get all the titles from the trailer page
        reTitle_old.lastIndex = 0;
        while ((result = reTitle_old.exec(page))) {
            if (result.length >= 2) {
                writeLog(TITLE + ": - Trailer title found: '" + result[1] + "'");
                titles.push(result[1]);
            }
        }

        if (titles.length === 0) {
            reTitle_new.lastIndex = 0;
            while ((result = reTitle_new.exec(page))) {
                if (result.length >= 2) {
                    writeLog(TITLE + ": - Trailer title found: '" + result[1] + "'");
                    titles.push(result[1]);
                }
            }
        }

        if (links.length > 0) {
            requests = links.length;
            for (j = 0; j < links.length; j++) {
                src_url = "includes/" + links[j];
                src_title = (links.length == titles.length ? titles[j] : ("Trailer " + (j + 1)));

                getDownloadlinks(src_url, src_title, function() { requests--; });
            }

            showAdtContainer(function() {return requests});
        } else {
            // check if a "watch the trailer" link exists
            if (reBackToTrailers.test(page)) {
                showMessage(CLICK_MSG);
            }
            else {
                showError('');
            }
        }
    }

    /**
    * Scan the old style page for HD quicktime movies. Get all <a> tags with specific href's
    * (eg: https://trailers.apple.com/trailers/disney/ponyo/)
    */
    function parseOldTrailerPage() {
        var src_url, src_title, links, titles, j;

        writeLog(TITLE + ": Analyzing current page...");

        try {
            links = Array.filter($('#content').getElementsByClassName('hd'), function(elem) {
                // we're only interested in links with a href pointing to a .mov
                if (elem.nodeName !== 'A' || !elem.hasAttribute('href')) {
                    return false;
                }
                return (elem.getAttribute('href').endsWith('1080p.mov'));
            });

            titles = Array.filter($('.trailer-nav').getElementsByClassName('text'), function(elem) {
                // we're only interested in spans with class text
                return (elem.nodeName === 'SPAN');
            });
        }
        catch (err) {
            links = [];
        }

        if (links.length > 0) {
            for (j = 0; j < links.length; j++) {
                src_url = links[j].getAttribute('href').replace(".mov", "");
                src_title = (links.length == titles.length ? titles[j].textContent || titles[j].innerText : ("Trailer " + (j + 1)));

                addDownloadLink(src_url, src_title);
            }

            showAdtContainer();
        } else {
            // check if a "watch the trailer" link exists
            if ($('.back-to-trailers')) {
                showMessage(CLICK_MSG);
            }
            else {
                showError('');
            }
        }
    }

    /**
    * Try to fill the container
    */
    function showAdtContainer(checkPendingRequests)
    {
        var retryCount = 0;
        var si = setInterval(function() {
            if (!checkPendingRequests || checkPendingRequests() === 0) {
                clearInterval(si);
                fillAdtContainer();
                return;
            }

            retryCount++;
            if (retryCount > 10) {
                clearInterval(si);
                showError("Timeout occurred");
            }
        }, 500);
    }

    /**
    * Fill the already prepared container with all the trailer listings and
    * the respective toggles.
    */
    function fillAdtContainer() {
        var cont = null, i, size, size_links,
            ul = null, len, li;

        for(size in g_allLinks) {
            if (!g_allLinks.hasOwnProperty(size)) {
                continue;
            }
            size_links = g_allLinks[size];

            cont = prepContainer('atd' + size);
            ul = createElem('ul', { 'className': 'atdListing' });
            g_atdcontainer.appendChild(createToggle(size));
            li = null;
            for (i = 0; i < size_links.length; i++) {
                if (!size_links[i]) {
                    continue;
                }

                if (typeof (size_links[i]) == "string") {
                    li = createElem('li', { 'textContent': size_links[i], 'className': 'error' });
                }
                else {
                    li = createElem('li');
                    li.appendChild(size_links[i]);
                }
                ul.appendChild(li);
            }
            cont.appendChild(ul);
            g_atdcontainer.appendChild(cont);
            if (g_atdcontainer.style.display != 'table') { g_atdcontainer.style.display = 'table'; }
        }
        removeNode($('#atdLoader'));
    }

    function copyToClipboard(e) {
        if (typeof GM.setClipboard === 'undefined') {
            return;
        }

        var s = "", size, size_links,
            count = 0, i, len,
            elem = e.target,
            caption = elem.id;

        if (caption.endsWith('480p')) {
            size = "480p";
        } else if (caption.endsWith('720p')) {
            size = "720p";
        } else {
            size = "1080p";
        }

        size_links = g_allLinks[size];
        for (i = 0; i < size_links.length; i++) {
            if (typeof (size_links[i]) != "string" && size_links[i].href) {
                s += size_links[i].href + "\n";
                count++;
            }
        }

        if (s !== "") {
            GM.setClipboard(s);
            writeLog(TITLE + ": " + count + " movie link(s) copied to clipboard");
        }

        if (e.stopPropagation) {
            e.stopPropagation();
        }
        if (e.preventDefault) {
            e.preventDefault();
        }
        e.cancelBubble = true;
        e.returnValue = false;
        return false;
    }

    function showError(msg) {
        var omg = createElem('div', { 'id': 'atdError', 'textContent': ERROR_MSG, 'className': 'roundBottomCorners' });
        if (msg !== '') {
            omg.appendChild(createElem('br'));
            omg.appendChild(createElem('span', { 'textContent': msg, 'className': 'errorMsg' }));
        }
        g_atdcontainer.appendChild(omg);
        removeNode($('#atdLoader'));
    }

    function showMessage(msg) {
        var omg = createElem('div', { 'id': 'atdError', 'textContent': msg, 'className': 'roundBottomCorners' });
        g_atdcontainer.appendChild(omg);
        removeNode($('#atdLoader'));
    }

    // Prototypes ---------------------------------
    /**
    * Determine whether a string starts with a certain string.
    */
    String.prototype.startsWith = function(str) { return (this.indexOf(str) === 0); };

    /**
    * Determine whether a string ends with a certain string.
    */
    String.prototype.endsWith = function(str) { return this.indexOf(str, this.length - str.length) !== -1; };

    // case-insensitive indexOf function for arrays
    if (typeof Array.prototype.indexOfCI == 'undefined') {
        Array.prototype.indexOfCI = function(s) {
            if (s === null || (typeof s == "undefined")) {
                return -1;
            }
            for (var i = 0; i < this.length; i++) {
                if (this[i].toLowerCase() == s.toLowerCase()) {
                    return i;
                }
            }
            return -1;
        };
    }

    // Helper functions ---------------------------
    /**
    * Creates a new element.
    * @param {String} elem The element to create
    * @param {Object} attrs The new element's attributes
    * @returns {HtmlElement} The created element
    */
    function createElem(elem, attrs) {
        var newElem = document.createElement(elem), a;
        for (a in attrs) {
            if (attrs.hasOwnProperty(a)) {
                if (a === 'textContent') {
                    newElem.appendChild(document.createTextNode(attrs[a]));
                } else {
                    newElem[a] = attrs[a];
                }
            }
        }
        return newElem;
    }

    /**
    * Create the side panel header. Create a P element and add an A element to
    * quickly access this script's preferences.
    * @returns {HtmlElement}
    */
    function createAtdHeader() {
        var atdHeader = createElem('p', { 'id': 'atdHeader' }),
            atdHeaderLink = createElem('a', { 'id': 'atdHeaderLink', 'textContent': 'Apple Trailers' }),
            canvas = createElem('canvas', { 'id': 'tempCanvas', 'width': '10', height: '10', 'className': 'hidden' });

        atdHeaderLink.addEventListener('click', function() { GM_config.open(); }, false);
        atdHeader.appendChild(atdHeaderLink);
        atdHeader.appendChild(canvas);
        return atdHeader;
    }

    /**
    * Create and return the busy animation container. Processing all the
    * links can take a while if there are a lot of trailers.
    * @returns {HtmlElement}
    */
    function createLoader() {
        var ldr = createElem('div', { 'id': 'atdLoader', 'className': 'roundBottomCorners' });
        ldr.appendChild(createElem('p', { 'id': 'atdLoaderText', 'textContent': 'Gathering ...' }));
        return ldr;
    }

    /**
    * Create a DIV element which will serve as a toggle as well as
    * an indicator for the three sections (480p, 720p, 1080p).
    * Also adds an event listener (click) to the DIV element to control
    * the toggling.
    */
    function createToggle(caption) {
        var div = createElem('div', { 'id': 'atdTgl' + caption, 'textContent': caption, 'className': 'toggle', 'title': caption + ' trailers' });
        if (caption == '1080p' && GM_config.get('defaultSize') != 'Large (1080p)') { addClass(div, 'roundBottomCorners'); }
        div.addEventListener('click', toggleVisibility, false);
        div.addEventListener('contextmenu', copyToClipboard, false);
        return div;
    }

    /**
    * Prepare a container (DIV element) for the trailer listings (UL).
    * @param {String} newId The id of the container element
    * @returns {HtmlElement} The created DIV element
    */
    function prepContainer(newId) {
        var elem = createElem('div', { 'id': newId });
        if (GM_config.get('defaultSize').indexOf(newId.substr(3)) < 0) { elem.className = 'hidden'; }
        if (newId.endsWith('1080p')) { addClass(elem, 'roundBottomCorners'); }
        return elem;
    }

    /**
    * Return the final computed value of an element's CSS property.
    * @param {HtmlElement} elem The element
    * @param {String} prop The property
    * @returns {String} The final computed value
    */
    function getCssProp(elem, prop) {
        var cssProp;

        try {
            cssProp = window.getComputedStyle(elem, null).getPropertyValue(prop);
            if (cssProp) {
                cssProp.replace(/\\s+!important/gi, '');
            }
        } catch (err) {
            cssProp = null;
        }

        return cssProp;
    }

    /**
    * Return an element matching the specified selector.
    * @param {String} selector The selector
    * @param {Node} root Start looking here
    * @returns {HtmlElement|null} Search result
    */
    function $(selector, root) {
        var e = null;
        root = root || document;
        if (/^#(?!(?:[\w]+)?[ \.,\+\[~>#])/.test(selector)) {
            e = root.getElementById(selector.substring(1));
        } else {
            e = root.querySelector(selector);
        }
        return e;
    }

    /**
    * Removes a node from the DOM.
    * @param {HTMLElement} nod The node to remove
    */
    function removeNode(nod) { if (nod) { nod.parentNode.removeChild(nod); } }

    /**
    * Add a class to the className attribute.
    * @param {HtmlElement} elem The element to check
    * @param {String} cls The class to add
    */
    function addClass(elem, cls) {
        if (elem.nodeType === 1) {
            if (!elem.className) {
                elem.className = cls;
            } else {
                if (!hasClass(elem, cls)) { elem.className += " " + cls; }
            }
        }
    }

    /**
    * Remove a class from the className attribute. If it is the last attribute or
    * if cls isn't specified, the class attribute will be removed.
    * @param {HtmlElement} elem The element to change
    * @param {String} cls The class to remove
    */
    function remClass(elem, cls) {
        if (elem.nodeType === 1) {
            if (cls) {
                if (elem.className === cls) {
                    elem.removeAttribute('class');
                } else {
                    if (hasClass(elem, cls)) {
                        var cn = ' ' + elem.className + ' ';
                        cn = cn.replace(' ' + cls + ' ', '');
                        elem.className = cn.trim();
                    }
                }
            } else {
                elem.removeAttribute('class');
            }
        }
    }

    /**
    * Determine whether a className attribute has a specific class attached.
    * @param {HtmlElement} elem The element to check
    * @param {String} cls The class to look for
    * @returns {Boolean} Does the element have the class?
    */
    function hasClass(elem, cls) {
        if (!elem.className) {
            return false;
        }

        var cn = ' ' + elem.className + ' ';
        return cn.indexOf(' ' + cls + ' ') > -1;
    }

    /**
    * Event listener for showing/hiding the respective trailer listings.
    * In case of the 1080p section, create rounded bottom borders if closed.
    * @param {Event} e The event
    */
    function toggleVisibility(e) {
        var elem = e.target,
        toggleElem = $('#' + elem.id + ' + div');

        if (!hasClass(toggleElem, 'hidden')) {
            addClass(toggleElem, 'hidden');
            if (elem.id.endsWith('1080p')) { addClass(elem, 'roundBottomCorners'); }
        } else {
            remClass(toggleElem, 'hidden');
            if (elem.id.endsWith('1080p')) { remClass(elem, 'roundBottomCorners'); }
        }
    }

    /**
    * Adds a new CSS ruleset to the page. Uses GM.addStyle API; fallback in place.
    * @param {String} style Contains the CSS rules to add to the page
    */
    function addNewStyle(newStyle) {
        var node, heads;

        if (typeof GM.addStyle !== 'undefined') {
            GM.addStyle(newStyle);
        } else {
            heads = document.getElementsByTagName('head');
            if (heads.length > 0) {
                node = document.createElement('style');
                node.type = 'text/css';
                node.appendChild(document.createTextNode(newStyle));
                heads[0].appendChild(node);
            }
        }
    }

    /**
    * Travel up the DOM until the parent has the specified class and return the node.
    * @param {HtmlElement} elm The starting element
    * @param {String} cls The targeted parent has this class
    * @returns {HtmlElement} The targeted parent element
    */
    function parentUntilClassIs(elm, cls) {
        var p = elm;
        while (p.parentNode) {
            p = p.parentNode;
            if (hasClass(p, cls)) {
                break;
            }
        }
        return p;
    }

    /**
    * Determine whether n is a number or not.
    * @param {String|Number} n The string/number to check
    * @returns {Boolean} n can be interpreted as number
    */
    function isNumber(n) { return !isNaN(parseFloat(n)) && isFinite(n); }

    function writeLog(s) {
        if (window.console) {
            console.log(s);
        }
    }

    /**
    * Return the color used in Apple's trailer listing. If that's not
    * possible, assume Apple's default blue color scheme.
    * @returns {String} A CSS rule containing the trailer listing color
    */
    function getTrailerListingColor(cb) {
        var heading = $('h2', $('#trailers')), cssProp, css, m, url, img,
            validColor = function(css) {
                var valid = false, r, g, b;
                if (css && css.indexOf("rgb(") === 0) {
                    css = css.substr(4, css.length - 2);
                    css = css.split(",");
                    if (css.length == 3) {
                        r = parseInt(css[0], 10);
                        g = parseInt(css[1], 10);
                        b = parseInt(css[2], 10);
                        return !((r < 30 && g < 30 && b < 30) || (r > 230 && g > 230 && b > 230));
                    }
                }
                return false;
            };

        if (!cb) { return; }

        if (heading) {
            cssProp = getCssProp(heading, 'background-color');
        }
        if (!validColor(cssProp)) {
            heading = $('.top-wrapper');
            if (heading) {
                cssProp = getCssProp(heading, 'background-color');
            }
        }
        if (!validColor(cssProp)) {
            heading = $('.hero', $('#backgrounds')) || $('.top-wrapper');
            if (heading) {
                try {
                    m = getCssProp(heading, 'background-image').match(/url\(([^)]+)\)/i);
                    url = m[1].replace(/"/g, "");
                    url = url.replace("http://", "https://");
                    img = new Image();
                    img.onload = function(e) {
                        var rgb = new ColorFinder(function favorHue(r, g, b) {
                            return ((r < 30 && g < 30 && b < 30) || (r > 230 && g > 230 && b > 230)) ? 0 : ((Math.abs(r - g) * Math.abs(r - g) + Math.abs(r - b) * Math.abs(r - b) + Math.abs(g - b) * Math.abs(g - b)) / 65535 * 50 + 1);
                        }).getMostProminentColor(img);
                        cssProp = 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
                        css = '#atdContainer > div.toggle {background:-moz-linear-gradient(left, ' + cssProp + ' 5%, rgba(0,0,0,.75) 85%) repeat scroll 0 0 transparent;background:-webkit-linear-gradient(left, ' + cssProp + ' 5%, rgba(0,0,0,.75) 85%) repeat scroll 0 0 transparent;background:linear-gradient(left, ' + cssProp + ' 5%, rgba(0,0,0,.75) 85%) repeat scroll 0 0 transparent;';
                        cb(css);
                    };
                    img.crossOrigin = '';
                    img.src = url;
                    return;
                }
                catch (err) {
                    writeLog(TITLE + ": Unable to determine background color: " + (err.description || err.message));
                    cssProp = getCssProp(heading, 'background-color');
                }
            }
        }
        if (!validColor(cssProp)) {
            cssProp = 'rgb(40, 60, 60)'; //cssProp = 'rgb(2, 131, 224)';
        }

        css = '#atdContainer > div.toggle {background:-moz-linear-gradient(left, ' + cssProp + ' 5%, rgba(0,0,0,.75) 85%) repeat scroll 0 0 transparent;background:-webkit-linear-gradient(left, ' + cssProp + ' 5%, rgba(0,0,0,.75) 85%) repeat scroll 0 0 transparent;background:linear-gradient(left, ' + cssProp + ' 5%, rgba(0,0,0,.75) 85%) repeat scroll 0 0 transparent;';
        cb(css);
    }

    function getAverageRGB(imgEl) {
        var blockSize = 5, // only visit every 5 pixels
            defaultRGB = 'rgb(2, 131, 224)', // for non-supporting envs
            canvas = document.getElementById("tempCanvas"),
            context = canvas.getContext && canvas.getContext('2d'),
            data, width, height,
            i = -4,
            length,
            rgb = { r: 0, g: 0, b: 0 },
            count = 0;

        if (!context) {
            return defaultRGB;
        }

        height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
        width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;
        context.drawImage(imgEl, 0, 0);

        try {
            data = context.getImageData(0, 0, width, height);
        }
        catch (e) {
            return defaultRGB;
        }

        length = data.data.length;
        while ((i += blockSize * 4) < length) {
            ++count;
            rgb.r += data.data[i];
            rgb.g += data.data[i + 1];
            rgb.b += data.data[i + 2];
        }

        // ~~ used to floor values
        rgb.r = ~~(rgb.r / count);
        rgb.g = ~~(rgb.g / count);
        rgb.b = ~~(rgb.b / count);

        return 'rgb(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ')';
    }

    function removeHash(s) {
        if (!s) { return s; }
        var i = s.lastIndexOf("#");
        return (i >= 0 ? s.substr(0, i) : s);
    }

    // Scriptish users don't need this line because of @noframes
    if (window.unsafeWindow && window.unsafeWindow.top !== window.unsafeWindow.self) { return; }

    // Init
    g_atdcontainer = createElem('div', { 'id': 'atdContainer' });
    g_baseUrl = removeHash(window.location.href);

    // Config
    GM_config.init({
        'id': 'GM_config',
        'title': TITLE,
        'fields': {
            'defaultSize': {
                'section': 'Created by JC2k8, Zatic, Mirzmaster and MHU',
                'type': 'select',
                'label': 'Default trailer size (open panel)',
                'default': 'Large (1080p)',
                'options': SIZES
            }
        },
        css: "#GM_config * { font-family: helvetica,arial,tahoma,myriad pro,sans-serif;}" +
             "#GM_config { background-color: rgba(0,0,0, 0.9); margin: 10% }" +
             "#GM_config_wrapper { background: #eee; padding: 1em;}" +
             "#GM_config .indent40 { margin-left: 40%;}" +
             "#GM_config .field_label { font-weight: bold; font-size: 12px; margin-right: 6px; float: left;}" +
             "#GM_config .block { display: block;}" +
             "#GM_config .saveclose_buttons { margin: 16px 10px 10px; padding: 2px 12px;}" +
             "#GM_config .reset, #GM_config .reset a, #GM_config_buttons_holder { text-align: right; color: #000;}" +
             "#GM_config .config_header { font-size: 20pt; margin: 0; padding: 0; font-weight: bold;}" +
             "#GM_config .config_desc, #GM_config .section_desc, #GM_config .reset { font-size: 9pt;}" +
             "#GM_config .center { text-align: center;}" +
             "#GM_config .section_header_holder { margin-top: 4px;}" +
             "#GM_config .config_var { margin: 0 0 4px; line-height: 22px; }" +
             "#GM_config .section_header { font-size: 13pt; background: #414141; color: #FFF; border: 1px solid #000; margin: 0 0 16px; }" +
             "#GM_config .section_desc { font-size: 9pt; background: #EFEFEF; color: #575757; border: 1px solid #CCC; margin: 0 0 6px; }"
    });

    // register menu command to access preferences
    GM.registerMenuCommand(TITLE +' Preferences...', function() { GM_config.open(); });

    // wait for the document to be fully loaded
    window.addEventListener("load", function() {
        initScript();

        setTimeout(function() {
            try {
                getBackboneTrailerPage(true);
            }
            catch(err) {
                writeLog(TITLE + ": ERROR: " + (err.description || err.message));
            }
        }, 250);
    }, false);
}());


// Copyright (c) 2013 Pieroxy <pieroxy@pieroxy.net>
// This work is free. You can redistribute it and/or modify it
// under the terms of the WTFPL, Version 2
// For more information see LICENSE.txt or http://www.wtfpl.net/
//
// For more information, the home page:
// http://pieroxy.net/blog/pages/color-finder/index.html
//
// Detection of the most prominent color in an image
// version 1.1.1

function ColorFinder(colorFactorCallback) {
    "use strict";

    this.callback = colorFactorCallback;
    this.getMostProminentColor = function(imgEl) {
        var rgb = null, data;
        if (!this.callback) {
            this.callback = function() { return 1; };
        }
        data = this.getImageData(imgEl);
        rgb = this.getMostProminentRGBImpl(data, 6, rgb, this.callback);
        rgb = this.getMostProminentRGBImpl(data, 4, rgb, this.callback);
        rgb = this.getMostProminentRGBImpl(data, 2, rgb, this.callback);
        rgb = this.getMostProminentRGBImpl(data, 0, rgb, this.callback);
        return rgb;
    };

    this.getImageData = function(imgEl, degrade, rgbMatch, colorFactorCallback) {

        var rgb,
            canvas = document.createElement('canvas'),
            defaultRGB = 'rgb(2, 131, 224)', // for non-supporting envs
            context = canvas.getContext && canvas.getContext('2d'),
            data, width, height, key, factor, result,
            i = -4,
            db = {},
            length, r, g, b,
            count = 0;

        if (!context) {
            return defaultRGB;
        }

        height = canvas.height = imgEl.naturalHeight || imgEl.offsetHeight || imgEl.height;
        width = canvas.width = imgEl.naturalWidth || imgEl.offsetWidth || imgEl.width;

        context.drawImage(imgEl, 0, 0);

        try {
            data = context.getImageData(0, 0, width, height);
        } catch (e) {
            /* security error, img on diff domain */
            return null;
        }

        length = data.data.length;
        factor = Math.max(1, Math.round(length / 5000));
        result = {};
        while ((i += 4 * factor) < length) {
            if (data.data[i + 3] > 32) {
                key = (data.data[i] >> degrade) + "," + (data.data[i + 1] >> degrade) + "," + (data.data[i + 2] >> degrade);
                if (!result.hasOwnProperty(key)) {
                    rgb = { r: data.data[i], g: data.data[i + 1], b: data.data[i + 2], count: 1 };
                    rgb.weight = this.callback(rgb.r, rgb.g, rgb.b);
                    if (rgb.weight <= 0) {
                        rgb.weight = 1e-10;
                    }
                    result[key] = rgb;
                } else {
                    rgb = result[key];
                    rgb.count++;
                }
            }
        }

        return result;

    };

    this.getMostProminentRGBImpl = function(pixels, degrade, rgbMatch, colorFactorCallback) {

        var rgb = { r: 0, g: 0, b: 0, count: 0, d: degrade },
            db = {}, data, i,
            pixel, pixelKey, pixelGroupKey,
            length, r, g, b, totalWeight,
            count = 0;


        for (pixelKey in pixels) {
            if (pixels.hasOwnProperty(pixelKey)) {
                pixel = pixels[pixelKey];
                totalWeight = pixel.weight * pixel.count;
                ++count;
                if (this.doesRgbMatch(rgbMatch, pixel.r, pixel.g, pixel.b)) {
                    pixelGroupKey = (pixel.r >> degrade) + "," + (pixel.g >> degrade) + "," + (pixel.b >> degrade);
                    if (db.hasOwnProperty(pixelGroupKey)) {
                        db[pixelGroupKey] += totalWeight;
                    }
                    else {
                        db[pixelGroupKey] = totalWeight;
                    }
                }
            }
        }

        for (i in db) {
            if (db.hasOwnProperty(i)) {
                data = i.split(",");
                r = data[0];
                g = data[1];
                b = data[2];
                count = db[i];

                if (count > rgb.count) {
                    rgb.count = count;
                    data = i.split(",");
                    rgb.r = r;
                    rgb.g = g;
                    rgb.b = b;
                }
            }
        }

        return rgb;

    };

    this.doesRgbMatch = function(rgb, r, g, b) {
        if (rgb === null) { return true; }
        r = r >> rgb.d;
        g = g >> rgb.d;
        b = b >> rgb.d;
        return rgb.r == r && rgb.g == g && rgb.b == b;
    };
}
