// ==UserScript==
// @name         Workaround for Deepl desktop site on mobile phones
// @namespace    DeeplDesktopMobile
// @author       Benau
// @license      MIT
// @version      1.0
// @description  Fix Deepl lmt stylesheets so that mobile phones can use the desktop Deepl site at any size.
// @icon         https://static.deepl.com/img/favicon/favicon_32.png
// @match        https://www.deepl.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/469130/Workaround%20for%20Deepl%20desktop%20site%20on%20mobile%20phones.user.js
// @updateURL https://update.greasyfork.org/scripts/469130/Workaround%20for%20Deepl%20desktop%20site%20on%20mobile%20phones.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var stylesheetPattern = /https:\/\/static.deepl.com\/css\/lmt.*/i;

    function addFixedCSS(url) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: "GET",
                url: url,
                onload: function(response) {
                    var fixed_css = response.responseText.replace(/\(max-device-width:\s*650px\)/gi, '(max-device-width: 10px)');
                    fixed_css = fixed_css.replace(/\(max-device-height:\s*650px\)/gi, '(max-device-height: 10px)');
                    GM_addStyle(fixed_css);
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    function removeStylesheets() {
        var stylesheets = document.styleSheets;
        for (var i = 0; i < stylesheets.length; i++) {
            var stylesheet = stylesheets[i];
            if (stylesheet.href && stylesheet.href.match(stylesheetPattern)) {
                addFixedCSS(stylesheet.href)
                stylesheet.ownerNode.remove();
            }
        }
    }

    removeStylesheets();


})();
