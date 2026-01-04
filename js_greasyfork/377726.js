// ==UserScript==
// @name         Case Clicker
// @namespace    https://kingofkfcjamal.github.io/CaseClicker/
// @version      0.51
// @description  Simple cheat for Case Clicker, automatically makes money and buys cases. Automatically closes the annoying box after getting a weapon!
// @author       PixxlMan
// @match        https://kingofkfcjamal.github.io/CaseClicker/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377726/Case%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/377726/Case%20Clicker.meta.js
// ==/UserScript==

setInterval(function () {
    document.getElementById('acceptButton').click();
    removeElementsByClass('modalWindow');
    //document.getElementsByClassName('inventoryItemContainer')[0].children[0].click();
    document.getElementById('case').click();
},1);

function removeElementsByClass(className){
    var elements = document.getElementsByClassName(className);
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
}

//Update: Removed unessesary gunk