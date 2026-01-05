// ==UserScript==
// @name         Login Footlocker
// @namespace    https://greasyfork.org/users/4756
// @version      0.1.10
// @description  try to take over the world!
// @author       saibotshamtul (Michael Cimino)
// @match        https://routing.footlocker.com/my.policy
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30138/Login%20Footlocker.user.js
// @updateURL https://update.greasyfork.org/scripts/30138/Login%20Footlocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    var a = document.createElement("div");
    //if (window.location.href.match("http.*://.")!==null){
    a.style.cssText="position:absolute;padding:10px;left:10px;top:10px;display:inline-block; border: 2px solid #888; font-family:Arial;color:#888;font-size:10pt";
    //}
    a.innerHTML = (function(){/*<center>reeb02<br><!--R33bj04-->Outerstatco315<!--123456789 101234-->
    <br/><button id='easybutton' style='color:#aaa;background-color:#fff;border:0px;' onclick='(function(){document.querySelector("[name=username]").value="reeb02"; document.querySelector("[name=password]").value="Outerstatco315";submit_row.children[0].children[0].click();})()'>easy</button>
    </center>*/}).toString().slice(13,-3);
    document.body.appendChild(a);
    a.style.left = window.screen.width - a.offsetWidth - 20 + "px";

})();


