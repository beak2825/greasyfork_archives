// ==UserScript==
// @name         GetOnline
// @namespace    Getonline
// @version      2.0
// @license Mermer
// @description  Send a buck with a small wakeup call
// @author       Kizozen [2626260] Hemicopter [2780600]
// @match        https://www.torn.com/profiles.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=torn.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473407/GetOnline.user.js
// @updateURL https://update.greasyfork.org/scripts/473407/GetOnline.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let button = document.createElement("button");

    setTimeout(() => {
        let div = document.getElementsByClassName("empty-block")[0];

        button.className = "torn-btn";
        button.innerHTML = "MSG: GET ONLINE!";
        button.style = "margin-top: 3px; margin-left: 3px;";
        button.addEventListener("click", sendMessage);
        div.appendChild(button);
    }, 2000);



   function sendMessage() {
       button.disabled = "true";
       var request = new XMLHttpRequest();
       request.open('POST', 'https://www.torn.com/sendcash.php?rfcv=undefined'); // + window.getCookie('rfc_v'));
       request.setRequestHeader("Content-Type","application/x-www-form-urlencoded; charset=UTF-8");
       request.setRequestHeader("x-requested-with", "XMLHttpRequest");
       request.send("step=cash1&ID=" + getID() + "&money=1&tag=PLEASE GET ONLINE AND CHECK FACTION CHAT!&theanon=false");
   }

    function getID() {
        return document.getElementsByClassName("profile-image-wrapper")[1].href.split("=")[1];
    }

})();