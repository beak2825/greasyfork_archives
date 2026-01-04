// ==UserScript==
// @name         Sofascore Chances
// @namespace    https://greasyfork.org/users/21515
// @version      0.1.3
// @description  Replace betting odds with chances calculated by the odds
// @author       CennoxX
// @homepage     https://twitter.com/CennoxX
// @match        https://www.sofascore.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=sofascore.com
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/510417/Sofascore%20Chances.user.js
// @updateURL https://update.greasyfork.org/scripts/510417/Sofascore%20Chances.meta.js
// ==/UserScript==
/* jshint esversion: 11 */

(function() {
    "use strict";
    var getChance = (odds, all) => Math.round((1 / odds) / all * 100 ) + " %";
    var getNodeValue = (node) => Number(node.innerHTML);
    setInterval(()=>{
        [...document.querySelectorAll(".odds-card, .d_flex.gap_sm:nth-child(2)")].forEach(i=>{
            var homeNode = i.querySelector("div:nth-child(1) > div > .textStyle_display\\.micro");
            var tieNode = i.querySelector("div:nth-child(2) > div > .textStyle_display\\.micro");
            var awayNode = i.querySelector("div:nth-child(3) > div > .textStyle_display\\.micro");
            if (!homeNode || !tieNode || !awayNode || homeNode.innerHTML.includes("%")) return;
            var home = getNodeValue(homeNode);
            var tie = getNodeValue(tieNode);
            var away = getNodeValue(awayNode);
            var all = 1 / home + 1 / tie + 1 / away;
            requestAnimationFrame(() => {
                homeNode.textContent = getChance(home, all);
                tieNode.textContent = getChance(tie, all);
                awayNode.textContent = getChance(away, all);
            });
        });
    },500);
})();