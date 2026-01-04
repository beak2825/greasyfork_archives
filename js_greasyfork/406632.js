// ==UserScript==
// @name         sum story-points
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  try to take over the world!
// @author       You
// @match        https://trello.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406632/sum%20story-points.user.js
// @updateURL https://update.greasyfork.org/scripts/406632/sum%20story-points.meta.js
// ==/UserScript==

const FIRST_CALL_DELAY = 500;
const INTERVAL = 4000;
const SP_SEARCH_PREFIX = "Story Points⏰: ";
const SP_PRINT_PREFIX = "⏰";

const main = () => {
    if (document.hidden) return;
    const lists = document.getElementsByClassName('list');
    for(var i = 0; i < lists.length; i++) {
        var list = lists[i];
        const listCards = list.querySelectorAll(".list-card");
        const sum = Array.prototype.reduce.call(listCards, (acc, listCard) => {
            const customFields = listCard.querySelectorAll(".custom-field-front-badges .badge .badge-text");
            const foundElement = Array.prototype.find.call(customFields, f => f.innerText.startsWith(SP_SEARCH_PREFIX));
            var sp = 0;
            if(foundElement) {
                const spText = foundElement.innerText.substr(SP_SEARCH_PREFIX.length);
                sp = Number.parseFloat(spText);
            }
            return acc + sp;
        }, 0);
        const listHeaderTarget = list.querySelector(".list-header");
        var listHeaderSpSum = listHeaderTarget.querySelector(".list-header-spsum");
        if(sum > 0) {
            if(!listHeaderSpSum) {
                listHeaderSpSum = document.createElement("span");
                listHeaderSpSum.classList.add("list-header-spsum");
                listHeaderSpSum.style.opacity = 0.3;
                listHeaderSpSum.style.marginLeft = "8px";
                listHeaderTarget.appendChild(listHeaderSpSum);
            }
            const newSpSum = SP_PRINT_PREFIX + sum;
            if(listHeaderSpSum.innerText !== newSpSum) {
                listHeaderSpSum.innerText = newSpSum;
            }
        } else {
            if(listHeaderSpSum) {
                listHeaderTarget.remove();
            }
        }
    }
};

$(document).ready(() => {
  setTimeout(() => {
	  const interval = setInterval(main, INTERVAL);
  }, FIRST_CALL_DELAY)
});