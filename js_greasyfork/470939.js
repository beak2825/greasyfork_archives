// ==UserScript==
// @name         GC Quick Rechallenger
// @namespace    http://tampermonkey.net/
// @version      0.1b
// @description  Makes it easier to repeatedly battle the same BD challenger
// @author       macosten
// @match        https://www.grundos.cafe/dome/1p/select/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_log
// @downloadURL https://update.greasyfork.org/scripts/470939/GC%20Quick%20Rechallenger.user.js
// @updateURL https://update.greasyfork.org/scripts/470939/GC%20Quick%20Rechallenger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const challengerMap = {};
    const challengers = document.getElementsByName("1p_challenger");

    const selected = GM_getValue("gcbdSelectedChallenger", 37); // 37 == Punchbag Bob

    const dropdown = document.createElement("select");
    challengers.forEach((node, index) => {
        const option = document.createElement("option");
        option.text = node.textContent;
        option.value = node.value;
        dropdown.add(option, dropdown[index]);
        // Also add to the challenger map
        challengerMap[node.value] = node
    });
    dropdown.style = "height:50px;width:200px;";
    dropdown.value = selected;

    const challengeButton = document.createElement("button");
    challengeButton.style = "height:100px;width:200px;";

    const onDropdownChange = () => {
        const selected = challengerMap[dropdown.value];
        challengeButton.textContent = selected.textContent;
        GM_setValue("gcbdSelectedChallenger", dropdown.value);
    };

    dropdown.onchange = onDropdownChange;
    onDropdownChange();

    const onButtonClick = () => {
        const selected = challengerMap[dropdown.value];
        selected.click();
        challengeButton.disabled = true;
    }
    challengeButton.onclick = onButtonClick;

    const containerDiv = document.createElement("div");
    containerDiv.appendChild(challengeButton);
    containerDiv.appendChild(dropdown);
    containerDiv.style = "display:flex;flex-direction:column;"

    const contentDiv = document.getElementById("page_content");
    contentDiv.insertBefore(containerDiv, contentDiv.children[0]);
})();