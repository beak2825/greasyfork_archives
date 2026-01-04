// ==UserScript==
// @name         Hide "(edited)"
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  hides the text "(edited)" or "Edited" after editing text
// @author       You
// @match        *://*.character.ai/*
// @icon         data:image/png;base64,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
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/480791/Hide%20%22%28edited%29%22.user.js
// @updateURL https://update.greasyfork.org/scripts/480791/Hide%20%22%28edited%29%22.meta.js
// ==/UserScript==

(function() {
    function loop() {
        let elements = document.querySelectorAll("div, p");
        elements.forEach(function(val) {
            if (val.innerText == "(edited)") {
                val.style.display = 'none';
            }
            if (val.innerText == "Edited") {
                val.style.display = 'none';
            }
        });
        requestAnimationFrame(loop);
    }

    loop();
})();
