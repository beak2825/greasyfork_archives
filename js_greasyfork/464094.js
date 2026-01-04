// ==UserScript==
// @name         Bing URL Decoder
// @namespace    https://github.com/Alistair1231/my-userscripts/
// @version      0.2.8
// @description  Decode the Bing URLs to get the direct result page URL
// @author       Alistair1231
// @icon         https://icons.duckduckgo.com/ip2/bing.com.ico
// @match        https://www.bing.com/*
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/464094/Bing%20URL%20Decoder.user.js
// @updateURL https://update.greasyfork.org/scripts/464094/Bing%20URL%20Decoder.meta.js
// ==/UserScript==
// https://greasyfork.org/en/scripts/464094-bing-url-decoder
// https://openuserjs.org/scripts/Alistair1231/Bing_URL_Decoder
(function () {
    'use strict';
    // https://stackoverflow.com/a/70429872
    function unicodeBase64Decode(text){
        text = text.replace(/\s+/g, '').replace(/\-/g, '+').replace(/\_/g, '/');
        return decodeURIComponent(Array.prototype.map.call(window.atob(text),function(c){return'%'+('00'+c.charCodeAt(0).toString(16)).slice(-2);}).join(''));
    }
    

    function decodeBingUrl(url) {
        const remove_alink = (x) => {
            if (!x.startsWith("https://bing.com/alink/")) {
                return x;
            }
            const urlStartIndex = x.indexOf("url=") + 4;
            const urlEndIndex = x.indexOf("&", urlStartIndex);
            if (urlEndIndex === -1) {
                return x.substring(urlStartIndex);
            }
            return x.substring(urlStartIndex, urlEndIndex);
        };

        // check if has leading "a1" characters, then Remove the leading "a1" characters from the value of the "u" parameter
        var uParamValue;
        // check if url.searchParams.get('u') is null and skip
        if (url.searchParams.get('u') === null) {
            return;
        }

        url.searchParams.get('u').startsWith('a1') ? uParamValue = url.searchParams.get('u').substring(2) : uParamValue = url.searchParams.get('u')

        // Decode the URL-safe Base64-encoded value
        // console.log(url.searchParams.get('u'));
        // console.log(unicodeBase64Decode(uParamValue));
        var base64DecodedValue = unicodeBase64Decode(uParamValue.replace(/_/g, '/').replace(/-/g, '+'));

        try {
            const decodedValue = decodeURIComponent(base64DecodedValue);
            return remove_alink(decodedValue);
        } catch (error) {
            if (error instanceof URIError) {
                return remove_alink(base64DecodedValue);
            }
        }

    }

    function decodeBingUrls(links) {
        links.forEach(link => {
            // test link.href is not undefined
            if (link.href === undefined) {
                return;
            }

            const decodedUrl = decodeBingUrl(new URL(link.href));
            link.href = decodedUrl;
        });
    }

    // Decode all "u" parameters in Bing URLs on the page
    const links = document.querySelectorAll('a[href*="bing.com"][href*="&u="]');
    decodeBingUrls(links);

    // Use MutationObserver to detect new links added to the page
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.type === 'childList') {
                const newLinks = mutation.addedNodes;
                decodeBingUrls(newLinks);
            }
        });
    });

    var mainContent = null; 
    // if mainContent is null, wait for 1 second and try again
    const loadResults = () => {
        mainContent = document.getElementById('b_content');
        if (mainContent === null) {
            setTimeout(loadResults, 1000);
        }
    }
    observer.observe(mainContent, { childList: true, subtree: true });

})();