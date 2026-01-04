/* jshint esversion: 6 */
// ==UserScript==
// @name         Splitwise sort
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Sort splitwise users in groups ascending by amount.
// @author       myklosbotond
// @match        https://secure.splitwise.com/
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/390821/Splitwise%20sort.user.js
// @updateURL https://update.greasyfork.org/scripts/390821/Splitwise%20sort.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = () => setTimeout(runScript, 3000);
})();

function runScript() {
    // Uncomment once to set list
    // setInactives()
    setupStyles();
    doSort();
}

function setupStyles() {
    GM_addStyle(`
.full_group.summary a:first-child {
margin: 10px 0;
border: 1.5px solid #5bc5a7;
border-radius: 5px;
background-color: #eee;
}

.inactive {
opacity: 0.2;
}
`);
}

function doSort() {
    const list = [...document.querySelectorAll(".full_group.summary a:not(.details)")];

    list.sort((a,b) => {
        const aVal = getValue(a);
        const bVal = getValue(b);

        return aVal - bVal;
    });

    for (let i = 0; i < list.length; i++) {
        appendToParent(list[i]);
    }

    const detailsLink = document.querySelector(".full_group.summary a.details");
    appendToParent(detailsLink);

    const inactiveUsers = getInactivesList();
    const inactives = list.filter(node => inactiveUsers.includes(getUser(node)));

    for (let i = 0; i < inactives.length; i++) {
        const node = inactives[i];
        node.classList.add("inactive")
        appendToParent(node);
    }
}

function getValue(node) {
    const balance = node.querySelector(".balance");
    const isNeg = balance.classList.contains("i_owe");
    const amount = parseFloat(balance.querySelector(".amount").textContent.replace("RON", ""));
    return (isNeg ? -1 : 1) * amount;
}

function getUser(node) {
    const balance = node.querySelector(".name");
    return balance.textContent;
}

const INACTIVES_KEY = "sws_inactives";

function getInactivesList() {
    try {
        const savedInactives = GM_getValue(INACTIVES_KEY, "[]");
        return JSON.parse(savedInactives);
    }
    catch (err) {
        return [];
    }
}

function setInactives(list) {
    GM_setValue(INACTIVES_KEY, JSON.stringify(list))
}

function appendToParent(node) {
    node.parentNode.appendChild(node);
}