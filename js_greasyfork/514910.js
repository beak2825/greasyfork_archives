// ==UserScript==
// @name         Craig-ifier
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  Ooh, this place is spooky!
// @author       Plopilpy
// @match        https://*.3dmm.com/*
// @icon         https://3dmm.com/favicon_3dmmcom_logo.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514910/Craig-ifier.user.js
// @updateURL https://update.greasyfork.org/scripts/514910/Craig-ifier.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var currentforum = document.querySelectorAll(".navbar")[2].querySelector("a").innerHTML

    if(currentforum === "Testing Forum"){
        for(let i = 0; i < document.querySelectorAll(`[title*="'s Avatar"]`).length; i++){
            // console.log(document.querySelectorAll(`[title*="'s Avatar"]`)[i])
            document.querySelectorAll(`[title*="'s Avatar"]`)[i].src = "http://www.3dmm.com/images/misc/pwn3.jpg";
        }

        for(let i = 0; i < document.querySelectorAll(`.bigusername[href*="member.php?u="]`).length; i++){
            // console.log(document.querySelectorAll(`.bigusername[href*="member.php?u="]`)[i])
            document.querySelectorAll(`.bigusername[href*="member.php?u="]`)[i].innerHTML = "Larry Craig";
        }

    }
})();