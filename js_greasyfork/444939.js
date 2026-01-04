// ==UserScript==
// @name         [Neopets] Mysterious Symol Hole Reload Button
// @namespace    https://greasyfork.org/en/scripts/444939
// @version      0.3
// @description  Simple scriptlet that adds a "Try again" button after diving down the hole to reload the page.
// @author       Piotr Kardovsky
// @match        http*://www.neopets.com/medieval/symolhole.phtml
// @match        http*://neopets.com/medieval/symolhole.phtml
// @icon         http://www.neopets.com//favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444939/%5BNeopets%5D%20Mysterious%20Symol%20Hole%20Reload%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/444939/%5BNeopets%5D%20Mysterious%20Symol%20Hole%20Reload%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let smg = document.querySelector('.symolhole_content');
    let enb = document.getElementById('enterhole');
    let btn = document.createElement('button');
    btn.classList.add('button-default__2020', 'button-red__2020', 'btn-single__2020');
    btn.innerText = "TRY AGAIN!";
    btn.style.display = 'none';
    btn.addEventListener('click', () => { window.location.reload(); });
    smg.append(btn)
    enb.addEventListener('click', () => {setTimeout(() => {btn.style.display = 'block'}, 6600)});
})();