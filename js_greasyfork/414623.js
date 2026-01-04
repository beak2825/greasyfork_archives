// ==UserScript==
// @name         מצב ניב
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  להסתיר גישות פיקוח
// @author       You
// @match        https://www.fxp.co.il/member.php?u=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/414623/%D7%9E%D7%A6%D7%91%20%D7%A0%D7%99%D7%91.user.js
// @updateURL https://update.greasyfork.org/scripts/414623/%D7%9E%D7%A6%D7%91%20%D7%A0%D7%99%D7%91.meta.js
// ==/UserScript==

        alert("אתה במצב ניב – הגישות שלך מוסתרות, שים לב.");
function hm() {
let a = document.getElementById("usermenu").getElementsByTagName("li");
    for (var x of a) {
        console.log(x.children[0].innerText)
        if (x.children[0].innerText.includes("הערות משתמש")) x.remove()
    }
} hm();
(function() {
    'use strict';
    document.getElementsByClassName("user_panel_m gu")[0].hidden = true;
    document.querySelector("#sidebar_container > div.block.mainblock.moduleinactive_bg > h1 > a > img").remove();
        document.querySelector("#tab_container > dl > dd:nth-child(5)").remove();
    document.querySelector("#view-stats > div.blockbody.subsection.userprof_content.userprof_content_border > h5:nth-child(10)").innerHTML = "";
    document.querySelector("#view-stats > div.blockbody.subsection.userprof_content.userprof_content_border > dl:nth-child(11)").innerHTML = "";
    document.querySelector("#view-stats > div.blockbody.subsection.userprof_content.userprof_content_border > dl:nth-child(12)").innerHTML = "";
    document.querySelector("#view-stats > div.blockbody.subsection.userprof_content.userprof_content_border > ul:nth-child(13)").remove();
})();