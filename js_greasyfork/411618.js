// ==UserScript==
// @name         SS Adblock Warning Clicker
// @namespace    ultrabenosaurus.Shinsori
// @version      0.4
// @description  Automatically click the button on Shinsori's adblock warning banner.
// @author       Ultrabenosaurus
// @license      GNU AGPLv3
// @source       https://greasyfork.org/en/users/437117-ultrabenosaurus?sort=name
// @match        https://www.shinsori.com/*
// @icon         https://www.google.com/s2/favicons?domain=shinsori.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/411618/SS%20Adblock%20Warning%20Clicker.user.js
// @updateURL https://update.greasyfork.org/scripts/411618/SS%20Adblock%20Warning%20Clicker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var sawInt = setInterval(function(){
        UBclickShinsoriAdblockWarning(sawInt);
    }, 200);
    console.info("sawInt set");

    setTimeout(function(){
        UBclickShinsoriClearInterval(sawInt);
    }, 6000);
})();

function UBclickShinsoriAdblockWarning(interval){
    var sawButton = document.querySelectorAll('div div[onmouseover][onmouseout]');
    if( sawButton.length > 0 && sawButton[0].textContent == "I understand, I have disabled my ad blocker.  Let me in!" ){
        UBclickShinsoriClearInterval(interval);
        console.info("Clicking Shinsori adblock warning button");
        sawButton[0].click();
        sawButton = null;
        return;
    }
    sawButton = null;
    console.warn("sawButton not matched");
}

function UBclickShinsoriClearInterval(interval){
    clearInterval(interval);
    console.info("sawInt cleared");
    interval = null;
}
