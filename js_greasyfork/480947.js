// ==UserScript==
// @name         hyperchromatism - Color test cheat
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Cheat in a color test game. Just have fun :D
// @author       firetree
// @match        https://www.webhek.com/post/color-test/
// @icon         https://www.webhek.com/favicon.ico
// @grant        none
// @license      GPL3
// @downloadURL https://update.greasyfork.org/scripts/480947/hyperchromatism%20-%20Color%20test%20cheat.user.js
// @updateURL https://update.greasyfork.org/scripts/480947/hyperchromatism%20-%20Color%20test%20cheat.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function findUniqueIndex(list) {
        for (let i = 1; i < list.length; i++) {
            if (list[i] !== list[i - 1]) {
                if (i === 1) {
                    if (list[1] === list[2]) {
                        return 0
                    } else {
                        return 1
                    }
                } else {
                    return i
                }
            }
        }
    }

    const box = document.getElementById('box')

    function solve() {
        box.children[findUniqueIndex([...box.children].map(el => el.style.backgroundColor))].click()
    }

    const observer = new MutationObserver(() => setTimeout(() =>solve(), 10))
    const config = {childList: true}
    observer.observe(box, config)

})();