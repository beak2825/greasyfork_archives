// ==UserScript==
// @name         Myth-Weavers Sheet Ajustments
// @namespace    lander_scripts
// @version      0.11
// @description  Ajusts the Myth-Weavers sheets with custom information suitable for my games.
// @match        https://www.myth-weavers.com/sheet.html
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js
// @require https://greasyfork.org/scripts/5392-waitforkeyelements/code/WaitForKeyElements.js?version=115012
// @grant        GM_addStyle
// @icon         https://www.myth-weavers.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/422173/Myth-Weavers%20Sheet%20Ajustments.user.js
// @updateURL https://update.greasyfork.org/scripts/422173/Myth-Weavers%20Sheet%20Ajustments.meta.js
// ==/UserScript==

window.jQuery310 = $.noConflict(true);

waitForKeyElements("input[name=Alignment]", actionFunction);
waitForKeyElements(".show-loggedin.mwadcontainer", actionFunction2);


function actionFunction (jNode) {
    'use strict';

    //changes names for certain fields
    document.querySelectorAll("input[name=Alignment]")[0].parentElement.lastChild.replaceWith("Honor");
    document.querySelectorAll("input[name=XPCurrent]")[0].parentElement.lastChild.replaceWith("Status");
    document.querySelectorAll("input[name=XPNext]")[0].parentElement.lastChild.replaceWith("Glory");
    document.querySelectorAll("input[name=XPChange]")[0].parentElement.lastChild.replaceWith("Shadowlands Taint");

    //hides spells
    document.querySelectorAll(".page")[2].style.display = "none";

    //changes pic size and centers
    document.querySelectorAll("#pic")[0].setAttribute("style", "display: block;width: auto;margin: 0;height: 170px;text-align: center;margin-left: auto;margin-right: auto;");

    //hides skill buttons
    document.querySelectorAll("#skillcontext")[0].style.display = "none";
}

function actionFunction2 (jNode) {
    'use strict';

    //changes logo
    var img = document.createElement('img');
    img.src = 'https://1d4chan.org/images/thumb/f/f7/L5R_logo_new.png/400px-L5R_logo_new.png';
    img.setAttribute("style", "display: inline-block;float: left;height: 44px;margin: 2px 20px 2px 10px;");
    document.querySelectorAll(".brand")[0].replaceWith(img);

}
console.info('Myth-Weavers Sheet Ajustments: on');

function clearEvents (){
}

