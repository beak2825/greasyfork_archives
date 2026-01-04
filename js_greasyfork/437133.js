// ==UserScript==
// @name         Gladiatus Tricks
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Gladiatus script with small game improvements
// @author       Aveneid
// @match        *://*.gladiatus.gameforge.com/game/index.php*
// @icon         https://www.google.com/s2/favicons?domain=gameforge.com
// @grant        none
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js
// @license MIT

// @downloadURL https://update.greasyfork.org/scripts/437133/Gladiatus%20Tricks.user.js
// @updateURL https://update.greasyfork.org/scripts/437133/Gladiatus%20Tricks.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getElementByXpath(path) {
  return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}

    $( document ).ready(function() {

       if(window.location.href.contains("mod=market")){
           //set 24h listing as default
           document.querySelector("#dauer").value = 3;
       }
        $("#banner_top").css("display","none");
        $("#banner_event").css("display","none");
        $("#banner_event_link").css("display","none");
        $("#cooldown_bar_event").css("display","none");



    });
})();