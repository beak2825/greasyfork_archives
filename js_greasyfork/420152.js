// ==UserScript==
// @name         Jira tag painter
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add color to Jira tag
// @author       Justin Martin <justin.martin@toolpad.fr>
// @match        https://toolpad.atlassian.net/jira/software/projects/*/boards/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/420152/Jira%20tag%20painter.user.js
// @updateURL https://update.greasyfork.org/scripts/420152/Jira%20tag%20painter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const colorCode = [
        {bgColor: "#61bd4f", textColor: "#ffffff", text: "feature"},
        {bgColor: "#0079bf", textColor: "#ffffff", text: "improvment"},
        {bgColor: "#eb5a46", textColor: "#ffffff", text: "bug"},
        {bgColor: "#51e898", textColor: "#ffffff", text: "testing"},
        {bgColor: "#ff9f1a", textColor: "#ffffff", text: "infrastructure"},
        {bgColor: "#00c2e0", textColor: "#ffffff", text: "doc"}
    ];

    document.querySelectorAll('[data-test-id="platform-card.ui.card.focus-container"] > div > div:nth-child(2) > div > div > span > span').forEach((element)=>{
        const colorObject = colorCode.find(colorElement=>colorElement.text===element.innerText)
        element.style.backgroundColor = colorObject.bgColor;
        element.style.color = colorObject.textColor;
    });
})();