// ==UserScript==
// @name         Workshop Sub Presser lol
// @namespace    https://steamcommunity.com/workshop/browse/?*
// @version      0.1
// @description  Subs to every steam addon on the current workshop page
// @author       GEGAKE
// @match        https://steamcommunity.com/workshop/browse/?*
// @icon         https://www.google.com/s2/favicons?domain=tampermonkey.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429728/Workshop%20Sub%20Presser%20lol.user.js
// @updateURL https://update.greasyfork.org/scripts/429728/Workshop%20Sub%20Presser%20lol.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var url = location.href
    var splited = url.split("&p=")

    var pageNum = parseInt(splited[1])

    // alert("After this Message the Workshop Sub Presser lol will begin to press da buttons " + splited[0]);

    function sub() {
        var buttons = document.getElementsByClassName("general_btn subscribe");

        for(var i = 0; i < buttons.length; i++) {
            buttons[i].click()
            console.log(buttons[i])
        }
    }

    function nextPage(){
       location.href = splited[0] + "&p=" + Math.floor(pageNum + 1).toString();
    }


    sub();
    setTimeout(nextPage, 2000);

    // alert("next")
})();