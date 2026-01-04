// ==UserScript==
// @name         Grundos Cafe BD Pet Warner
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Warns you if you're trying to complete a kitchen or faerie quest when your specified pet is not active.
// @author       Dij
// @match        https://www.grundos.cafe/island/kitchen/
// @match        https://www.grundos.cafe/faerieland/quests/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=grundos.cafe
// @grant        none
// @license      GPL 3.0
// @downloadURL https://update.greasyfork.org/scripts/500760/Grundos%20Cafe%20BD%20Pet%20Warner.user.js
// @updateURL https://update.greasyfork.org/scripts/500760/Grundos%20Cafe%20BD%20Pet%20Warner.meta.js
// ==/UserScript==
let BDpetName="HiImAGrub";

let submit = null;

function displayWarning(msg) {
    const warningBox = document.createElement("div");
    const button = document.createElement("button");
    warningBox.innerHTML = msg;
    warningBox.style.cssText = `font-size:2em; font-weight:bold; background-color: rgba(225, 10, 0, 0.2);padding:20px;`;
    button.addEventListener("click",dismiss);
    button.innerHTML="Dismiss";
    button.style.cssText = "font-size:1rem; font-weight:normal; width:auto;display:block; margin:20px auto 0;";
    warningBox.appendChild(button);
    submit.parentNode.parentNode.insertBefore(warningBox, submit.parentNode);
}

function dismiss() {
    submit.disabled=false;
    this.parentNode.remove();
}

(function() {
    'use strict';
    try {
        if (location.pathname.match("faerieland/quests/")) {
            submit = document.getElementById("page_content").querySelector("input[name=\"accept\"]");
        } else {
            submit = document.getElementById("page_content").querySelector("input[onclick$=\"complete/'\"]");
        }
        if(!submit){return;}
        let petName = document.getElementById("userinfo").querySelector("a[href=\"/quickref/\"").text;
        if (petName != BDpetName) {
            displayWarning(`${BDpetName} is not the active pet right now!`, submit);
            submit.disabled = true;
        }
    } catch (error) {
        alert(`BD pet warner error: ${error}`);
    }
})();