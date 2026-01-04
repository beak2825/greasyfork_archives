// ==UserScript==
// @name        Piktochart Downloader
// @namespace   https://github.com/Enchoseon/enchos-assorted-userscripts/raw/main/piktochart-downloader.user.js
// @version     1.0.2
// @description Download Piktochart projects as PNGs as many times as you want at any resolution you want. Doesn't get around CORs yet, so some elements may be missing.
// @author      Enchoseon
// @include     *create.piktochart.com*
// @run-at      document-start
// @grant       none
// @require     https://unpkg.com/html2canvas@1.3.2/dist/html2canvas.min.js
// @downloadURL https://update.greasyfork.org/scripts/435206/Piktochart%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/435206/Piktochart%20Downloader.meta.js
// ==/UserScript==

(function() {
    "use strict";
    // ======
    // Config
    // ======
    const config = {
        scale: 4,
    }
    // ========================================
    // Replace Download Button With Html2Canvas
    // ========================================
    window.addEventListener("click", function (event) {
        if (event.target.id === "editor-download" || event.target.innerHTML === "Download") {
            event.stopPropagation();
            enableCSS();
            html2canvas(document.getElementsByClassName("pikto-canvas")[0], {scale: 4}).then(function(canvas) {
                var link = document.createElement("a");
                link.download = "piktochart.png";
                link.href = canvas.toDataURL()
                link.click();
                disableCSS();
            });
        }
    }, true);
    // ==========
    // CSS Tweaks
    // ==========
    var toggleCSSTag;
    function enableCSS() {
        const css = `
            .pikto-block-height-handle {
                display: none;
            }
        `;
        console.log("Enabling CSS Tweaks");
        var s = document.createElement("style");
        s.setAttribute("type", "text/css");
        s.appendChild(document.createTextNode(css));
        toggleCSSTag = document.getElementsByTagName("head")[0].appendChild(s);
    }
    function disableCSS() {
        console.log("Disabling CSS Tweaks");
        toggleCSSTag.remove();
        toggleCSSTag = null;
    }
})();
