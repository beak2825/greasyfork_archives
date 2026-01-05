// ==UserScript==
// @name         Login Burlington 2016
// @namespace    https://greasyfork.org/users/4756
// @author       saibotshamtul (Michael Cimino)
// @version      0.1.2
// @description  add's login info to the login screen
// @author       You
// @match        https://mip.logistics.com/login.jsp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/30136/Login%20Burlington%202016.user.js
// @updateURL https://update.greasyfork.org/scripts/30136/Login%20Burlington%202016.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //if (document.location.href.indexOf('login.jsp')>-1){
        var a = document.createElement("div");
        a.style.cssText="position:absolute;padding:10px;left:10px;top:10px;display:inline-block; border: 2px solid white; font-family:Arial;color:white;";
        a.innerHTML = (function(){/*
        <center>
        MAddamato!outerstuff<br/>Outerstuff60!
        <br/><button onclick='(function(){document.querySelector("#textfield-1019-inputEl").value="MAddamato!outerstuff";document.querySelector("#textfield-1020-inputEl").value = "Outerstuff60!";})()'>easy</button>
        </center>*/}).toString().slice(14,-3);
        document.body.appendChild(a);
        a.style.left = window.screen.width - a.offsetWidth -10 + "px";
    //}

})();