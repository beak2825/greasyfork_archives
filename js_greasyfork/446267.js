// ==UserScript==
// @name         Vzlet remove annoyances
// @version      1.0
// @description  Currently: wkUtils_userUnselectable, user-select:none, -webkit-user-select:none, contextmenu event block
// @author       AptemCat
// @match        https://mo.olymponline.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=olymponline.ru
// @grant        none
// @require https://code.jquery.com/jquery-3.6.0.min.js
// @namespace https://greasyfork.org/users/923789
// @downloadURL https://update.greasyfork.org/scripts/446267/Vzlet%20remove%20annoyances.user.js
// @updateURL https://update.greasyfork.org/scripts/446267/Vzlet%20remove%20annoyances.meta.js
// ==/UserScript==

/* globals jQuery, $, waitForKeyElements */

function removeAnnoyances() {
    // user-select:none
    let unselectElems = document.querySelectorAll("[class*=wkUtils_userUnselectable]");
    unselectElems.forEach((elem) => {
        for(let i=0; i<elem.classList.length; i++) {
            if (elem.classList[i].match(/^wkUtils_userUnselectable/)) {
                elem.classList.remove(elem.classList[i]);
            }
        }
    });
    $("*").css("user-select","text");
    $("*").css("-webkit-user-select", "text");
    $("button#vzletAnnoyances").css("user-select","none");
    $("button#vzletAnnoyances").css("-webkit-user-select", "none");
    console.log("VZLET ANNOYANCES: wkUtils_userUnselectable + user-select:none + -webkit-user-select:none removed");

    // contextmenu event block
    $("*").unbind("contextmenu");
    $("[class*=MathContent_content]").unbind("contextmenu");
    $("[id*=BaseApp-react-component]").unbind("contextmenu");
    console.log("VZLET ANNOYANCES: contextmenu event block removed");
}

(function() {
    'use strict';

    $(document).ready(()=>{
        removeAnnoyances();
        let btn=document.createElement("button");
        btn.id="vzletAnnoyances";
        btn.innerHTML="Remove annoyances";
        btn.style.position = "fixed";
        btn.style.bottom="0";
        btn.style.right="0";
        btn.style.zIndex="9999";
        btn.style.userSelect="none";
        btn.onclick=removeAnnoyances;
        document.body.appendChild(btn);
    });
})();