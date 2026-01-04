// ==UserScript==
// @name         Clean YT Interface
// @version      1
// @description  Remove the texts to some youtube buttons
// @author       ChristiamRz
// @match        https://www.youtube.com/watch*v=*
// @run-at       document-end
// @grant        none
// @namespace https://greasyfork.org/users/915995
// @downloadURL https://update.greasyfork.org/scripts/449799/Clean%20YT%20Interface.user.js
// @updateURL https://update.greasyfork.org/scripts/449799/Clean%20YT%20Interface.meta.js
// ==/UserScript==

(
    window.addEventListener("load", setTimeout(function() {
        var textos = document.querySelectorAll('#text');
        // console.log(textos)
        for (var i = 2; i <= 6; i++) {
            textos[i].innerHTML = '';
        }
    }, 3500))
)();
