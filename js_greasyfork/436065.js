// ==UserScript==
// @name         xbox 360 marketplace purchase fixer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  allow xbox 360 free gold game to be redeemed through web site
// @author       mcawesomept, robdangerous
// @match        https://live.xbox.com/*
// @license      MIT
// @grant        none
////allows running user script sooner:
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/436065/xbox%20360%20marketplace%20purchase%20fixer.user.js
// @updateURL https://update.greasyfork.org/scripts/436065/xbox%20360%20marketplace%20purchase%20fixer.meta.js
// ==/UserScript==

/*
Notes:
due to a bug in the xbox 360 marketplace, countries that use a comma, ",", as decimal separator will fail to redeem free xbox 360 games with gold
this is a script to allow google chrome to redeem the free game without any manual requirements for the user
*/

console.log("xbox 360 marketplace purchase fixer has been loaded");
var searchPidl = true;
if(searchPidl === true)
{
    var checkPrerequisites = window.setInterval(function()
    {
        var preReqElement = document.getElementById("pidlContainer");
        if(preReqElement != null)
        {
            console.log("the script has been loaded. fixing amount...");
            var preReqScript = preReqElement.nextSibling.nextElementSibling;
            var preReqScriptHTML = preReqScript.innerHTML.replace(/amount: ([\d]*),([\d]*)/g, "amount: $1.$2");

            //remove existing script and add new one
            preReqScript.remove();

            var liveFixedScript = document.createElement("script");
            liveFixedScript.innerHTML = preReqScriptHTML;
            document.head.appendChild(liveFixedScript);

            console.log("amount fixed");
            clearInterval(checkPrerequisites);
            //debugger;
        }
    }, 1);
}