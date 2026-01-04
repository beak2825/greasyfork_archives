// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match         *://www.baidu.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380947/New%20Userscript.user.js
// @updateURL https://update.greasyfork.org/scripts/380947/New%20Userscript.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var baidubotton=document.getElementById("su");
    baidubotton.style.width="80px";
    baidubotton.value="百度";
    var googlebotton=document.createElement("span");
    googlebotton.className=baidubotton.className;
    googlebotton.style = "width:80px;margin:0px 0px 0px 2px";
    googlebotton.innerHTML = "<input type='button' id='google' value='Google' class='btn bg s_btn' style='width:80px;'>";
    var form = document.getElementsByClassName("fm")[0];
    form.appendChild(googlebotton);
    googlebotton.addEventListener('click',function () {
        var input=document.getElementById("kw");
        var keyword = input.value.replace(/(^\s*)|(\s*$)/g, "");
        if(keyword != "")
        {
            googleSearch(keyword);
        }
    });
    function googleSearch(keyword) {
        var link = "https://www.google.com/search?q=" + encodeURIComponent(keyword);
        window.open(link);
    }
    document.getElementById("form").style.width = "705px";
    document.getElementsByClassName("s_btn_wr")[0].style.width = "80px";
    // Your code here...
})();