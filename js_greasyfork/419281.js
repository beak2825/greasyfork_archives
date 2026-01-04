// ==UserScript==
// @name         FANDOM thing doer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  converts html-styled plaintext to html.
// @author       Anonymoususer12321 (AU12321)
// @match        https://*.fandom.com/wiki/Message_Wall:*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419281/FANDOM%20thing%20doer.user.js
// @updateURL https://update.greasyfork.org/scripts/419281/FANDOM%20thing%20doer.meta.js
// ==/UserScript==

(function() {
    'use strict';
    setInterval(() => {
        for (let a of document.getElementsByTagName("p")) {
            console.log(a.parentNode.parentNode.parentNode);
            if (a.parentNode.parentNode.parentNode.classList.contains("Reply") && /<.+>/.test(a.innerText)) {
                a.innerHTML = a.innerHTML.replace(/<(\/?)(strong|em)([^>]*)>/gi, "&lt;$1$2$3&gt;");
                a.innerHTML = a.innerText;
            }
        }
    }, 1000)
})();