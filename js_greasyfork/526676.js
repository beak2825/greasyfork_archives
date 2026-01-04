// ==UserScript==
// @name         GetCurrentTimeVideo
// @namespace    http://tampermonkey.net/
// @version      2025-02-12
// @description  Текущее время в ролике
// @author       romg_gnom
// @match        https://www.youtube.com/watch*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/526676/GetCurrentTimeVideo.user.js
// @updateURL https://update.greasyfork.org/scripts/526676/GetCurrentTimeVideo.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('load', () => {
        addButton('Время', GetTime);
    })

    if (window.trustedTypes && window.trustedTypes.createPolicy) {
        window.trustedTypes.createPolicy('default', {
            createHTML: (string, sink) => string
    });
}
    function addButton(text, onclick, cssObj) {
        let button = document.createElement('button'), btnStyle = button.style;
        button.style.cssText = "position: absolute;top: 20px;left: 200px;z-index: 9999;";
        document.body.appendChild(button);
        button.innerHTML = window.trustedTypes.defaultPolicy.createHTML(text);
        button.onclick = onclick;
        return button;
    }

    function copyToClipboard(text) {
        if (window.clipboardData && window.clipboardData.setData) {
            // Internet Explorer-specific code path to prevent textarea being shown while dialog is visible.
            return window.clipboardData.setData("Text", text);
        }
        else if (document.queryCommandSupported && document.queryCommandSupported("copy")) {
            var textarea = document.createElement("textarea");
            textarea.textContent = text;
            textarea.style.position = "fixed"; // Prevent scrolling to bottom of page in Microsoft Edge.
            document.body.appendChild(textarea);
            textarea.select();
            try {
                return document.execCommand("copy"); //Security exception may be thrown by some browsers.
            }
            catch (ex) {
                console.warn("Copy to clipboard failed.", ex);
                return prompt("Copy to clipboard: Ctrl+C, Enter", text);
            }
            finally {
                document.body.removeChild(textarea);
            }
        }
    }

    function GetTime() {
        var sec = document.querySelector('video').currentTime;
        var time = new Date(0,0,0,0,0,0);
        time.setSeconds(Math.floor(sec));
        var text = time.getHours().toString().padStart(2,"0") + ":" + time.getMinutes().toString().padStart(2,"0") + ":" + time.getSeconds().toString().padStart(2,"0");
        copyToClipboard(text);
    }

})();