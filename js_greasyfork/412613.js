// ==UserScript==
// @name         iframe src copy from any site
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Press Shift + C to cpy
// @author       Talha Habib
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/412613/iframe%20src%20copy%20from%20any%20site.user.js
// @updateURL https://update.greasyfork.org/scripts/412613/iframe%20src%20copy%20from%20any%20site.meta.js
// ==/UserScript==
(function() {
    'use strict';

    function copyToClipboard(text) {
        if (window.clipboardData && window.clipboardData.setData) {
            // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
            return clipboardData.setData("Text", text);

        } else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in Microsoft Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy"); // Security exception may be thrown by some browsers.
            } catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return false;
            } finally {
                document.body.removeChild(textarea);
            }
        }
    }
    document.addEventListener("keydown", function(zEvent) {
        if (zEvent.shiftKey && zEvent.code === "KeyC") {
            const iframes = document.querySelectorAll("iframe")
            if (iframes && iframes.length > 0) {
                const links = Array.from(iframes).map(e => e.getAttribute("src")).filter(e => e && typeof e == "string" && e.trim() != "").join(",");
                copyToClipboard(links);
                alert("copied links, now you can paste and send");
            }
        }
    });
})();