// ==UserScript==
// @name         Export Dreamborn Collection
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Extract Dreamborn Colletion as CSV
// @author       Dralliev
// @match        https://dreamborn.ink/*/collection
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dreamborn.ink
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474548/Export%20Dreamborn%20Collection.user.js
// @updateURL https://update.greasyfork.org/scripts/474548/Export%20Dreamborn%20Collection.meta.js
// ==/UserScript==


function addButton() {
    var button = document.createElement('button');
    button.classList.add("btn-primary");
    button.innerText = "Export to CSV";
    button.style.cssText += "margin-left:5px;";
    var buttonInsertNode = document.querySelector("div.p-3 > div > div.grow");
    buttonInsertNode.append(button);
    button.addEventListener ("click", exportToCsv, false);

}

function waitForData() {
    if(document.querySelector("div.p-3 > div:nth-child(4) > div") != null) {
        addButton();
    }else {
        setTimeout(waitForData, 200);
    }
}

function exportToCsv() {
    var cards = document.querySelectorAll("div.p-3 > div:nth-child(4) > div");
    let csv = "";
    cards.forEach((c) => {
        let qt = c.querySelector("input").value;
        let qtFoil = c.querySelector("span > input").value;
        let fullName = c.querySelector("a").text;
        let nameParts = fullName.split(": ");
        let number = nameParts[0];
        let name = nameParts[1];
        let data = {
            'qt': qt,
            'qtFoil': qtFoil,
            'number': number,
            'name': name,
        }
        csv += qt+","+qtFoil+","+number+","+name+"\n";
    });
    console.log(csv);
    navigator.clipboard.writeText(csv);
    window.alert("CSV copied to clipboard, paste it where you want");
}

(function() {
    'use strict';
    waitForData();
})();

