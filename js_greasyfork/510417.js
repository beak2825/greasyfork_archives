// ==UserScript==
// @name         Sofascore Chances
// @namespace    https://greasyfork.org/users/21515
// @version      0.2.0
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
        var result = [];
        var selector = "span.textStyle_display\\.micro";
        document.querySelectorAll(selector).forEach(span => {
            for (var el = span.parentElement; el; el = el.parentElement) {
                var matches = el.querySelectorAll(selector);
                if (matches.length == 3) {
                    result.push([...matches]);
                    break;
                }
            }
        });
        result.forEach(i=>{
            const [homeNode, tieNode, awayNode] = i;
            if (homeNode.innerHTML.includes("%")) return;
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