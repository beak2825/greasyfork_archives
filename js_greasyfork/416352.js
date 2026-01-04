// ==UserScript==
// @name         Free Rice
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       Adrian Wowk
// @match        https://freerice.com/categories/english-vocabulary
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/416352/Free%20Rice.user.js
// @updateURL https://update.greasyfork.org/scripts/416352/Free%20Rice.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    window.setInterval(() => {

        document.querySelector("#root > section > div > div:nth-child(1) > div > div > div.game-block > div.question.question--single-option > div > div > div > div > div > div:nth-child(2)").children[0].click();

    }, 1000);


})();