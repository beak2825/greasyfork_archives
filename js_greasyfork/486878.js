// ==UserScript==
// @name         copy clicked text
// @namespace    http://tampermonkey.net/
// @version      2024-02-08
// @description  Hold command and click to copy text to clipboard.
// @author       You
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/486878/copy%20clicked%20text.user.js
// @updateURL https://update.greasyfork.org/scripts/486878/copy%20clicked%20text.meta.js
// ==/UserScript==
var $ = window.jQuery;

(function() {
    'use strict';
    $(document).ready(function() {
        document.addEventListener('click', (e) => {
            const {
                clientX: x,
                clientY: y
            } = e

            if (e.metaKey){
                addBorder(e.target);
                copyText(e.target);
                e.preventDefault();
            }
        });

        function copyText(element_clicked){
            var text = element_clicked.innerText || element_clicked.textContent;
            // Copy the text that was clicked
            navigator.clipboard.writeText(text);
        }

        function addBorder(element_clicked){
            //addborder copied wholesale from: https://github.com/DanKaplanSES/copy-link-with-click/blob/master/menu.js
            var rect = element_clicked.getBoundingClientRect();
            var frame = document.createElement("div");
            Object.assign(frame.style, {
                position: "absolute",
                top: (rect.top + window.scrollY) + "px",
                left: (rect.left + window.scrollX) + "px",
                width: (rect.width - 4) + "px",
                height: (rect.height - 4) + "px",
                border: "solid 2px gold",
                borderRadius: "5px",
                zIndex: "99999",
                pointerEvents: "none"
            });

            document.body.appendChild(frame);

            $(frame).fadeIn(300, "swing").delay(500).fadeOut(500, "swing");
        }

    });
})();
