// ==UserScript==
// @name         [Neopets] Lunar Temple Solver
// @namespace    https://greasyfork.org/en/scripts/446046
// @version      0.5
// @description  It does the thing. Takes a few seconds.
// @author       Piotr Kardovsky
// @match        http*://www.neopets.com/shenkuu/lunar/?show=puzzle
// @match        http*://neopets.com/shenkuu/lunar/?show=puzzle
// @icon         https://www.neopets.com//favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446046/%5BNeopets%5D%20Lunar%20Temple%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/446046/%5BNeopets%5D%20Lunar%20Temple%20Solver.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Set to true to autoclick. ~2 second delay to simulate "figuring it out".
    const AUTO = false;

//    window.addEventListener('load', () => {
        if (document.querySelector('input[value="0"]') != undefined) {
            let angle = parseInt(swf.attributes.swf.match(/Kreludor=(\d+)/)[1]);
            let lnt = [11, 33, 56, 78, 101, 123, 146, 168, 191, 213, 236, 258, 281, 303, 326, 348, 360];
            let idx = lnt.findIndex((i) => { return angle <= i; });
            idx = idx == 16 ? 8 : idx < 8 ? idx + 8 : idx - 8;

            let ans = document.querySelector(`.content input[value="${idx}"]`);
            if (AUTO === true) {
                setTimeout(() => {
                    ans.checked = true;
                    document.querySelector('form[action="results.phtml"]').submit();
                }, 1800 + Math.random() * 600);
            } else {
                ans.parentNode.style.background = "#000";
            }
        }
//    });
})();