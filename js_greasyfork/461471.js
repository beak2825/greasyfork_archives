// ==UserScript==
// @name         NI Revert item status icons
// @version      1.1
// @description  xD
// @author       You
// @match        http*://*.margonem.pl/
// @match        http*://*.margonem.com/
// @exclude      http*://margonem.*/*
// @exclude      http*://www.margonem.*/*
// @exclude      http*://new.margonem.*/*
// @exclude      http*://forum.margonem.*/*
// @exclude      http*://commons.margonem.*/*
// @exclude      http*://dev-commons.margonem.*/*
// @run-at       document-body
// @grant        none
// @namespace https://tampermonkey.net/
// @downloadURL https://update.greasyfork.org/scripts/461471/NI%20Revert%20item%20status%20icons.user.js
// @updateURL https://update.greasyfork.org/scripts/461471/NI%20Revert%20item%20status%20icons.meta.js
// ==/UserScript==
(function() {
    let currentCalls = 0;
    const replaceFunction = () => {
        if (!window.MargoTipsParser && currentCalls < 60) {
            currentCalls++;
            return setTimeout(replaceFunction, 50);
        }

        const original = MargoTipsParser.getTip;
        MargoTipsParser.getTip = function(){
            const res = original.apply(this, arguments);

            const { cl, stat, enhancementPoints } = arguments[0];

            const oldIcons = [cl, "binds", "soulbound", "permbound", "artisan_worthless", "noauction", "nodepo", "nodepoclan"];
            const stats = stat.split(";");
            const arr = $(res).toArray().filter(el => !el.classList.contains("s-8"));
            const head = arr[0];
            const oldHeadIcons = oldIcons.map(status =>  !isNaN(status) || stats.includes(status) ? `<div class='cl-icon icon-${status}'></div>` : undefined);

            if (enhancementPoints) {
                const translatedString = window._l() === "pl" ? "Wartość esencji" : "Essence value";
                const itemEnhancmentNode = document.createElement("div");
                itemEnhancmentNode.classList.add("item-type");
                itemEnhancmentNode.style.marginBottom = "2px";
                itemEnhancmentNode.textContent = `${translatedString}: ${enhancementPoints}`;

                head.insertBefore(itemEnhancmentNode, head.lastChild);
            }

            head.lastChild.innerHTML += oldHeadIcons.filter(v => v).join("");

            return arr.map(item => item.outerHTML).join("");
        }
    }

    replaceFunction();
})();