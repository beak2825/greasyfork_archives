// ==UserScript==
// @name         Vaqu's Script
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Take over Agarpowers easily with this script!
// @author       You
// @match        https://flarex.fun/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=180.92
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/443595/Vaqu%27s%20Script.user.js
// @updateURL https://update.greasyfork.org/scripts/443595/Vaqu%27s%20Script.meta.js
// ==/UserScript==

(function() {
    'use strict';
        /*if (document.getElementById('overlays').style.display != 'none' || document.getElementById('advert').style.display != 'none') {
            return;
        }*/
    //var shieldKey = document.getElementById("shield").val()
    if (document.activeElement.type == 'text' || document.activeElement.type == 'password') {
            return;
    }
    setInterval(function(){
        $("#canvas").trigger($.Event("keydown", { keyCode: 72}));
        $("#canvas").trigger($.Event("keyup", { keyCode: 72}));
    }, 1600)


    var startGoldNick = setInterval(function(){
        document.getElementById('setGoldNickname').dispatchEvent(new MouseEvent("click"));
    }, 100)
})();