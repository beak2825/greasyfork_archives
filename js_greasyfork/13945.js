// ==UserScript==
// @name         Login DSG
// @namespace    https://greasyfork.org/users/4756
// @author       saibotshamtul (Michael Cimino)
// @version      0.2
// @description  add's login info to the login screen
// @match        https://logistics-mip.dcsg.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13945/Login%20DSG.user.js
// @updateURL https://update.greasyfork.org/scripts/13945/Login%20DSG.meta.js
// ==/UserScript==


if (document.location.href.indexOf('login.jsp')>-1){
    a = document.createElement("div")
    a.style.cssText="position:absolute;padding:10px;left:10px;top:10px;display:inline-block; border: 2px solid white; font-family:Arial;color:white;"
    a.innerHTML = (function(){/*<center>VNlbrownc</center>*/}).toString().slice(13,-3)
    document.body.appendChild(a);
    a.style.left = window.screen.width - a.offsetWidth -10 + "px"
}
if (document.location.href.indexOf('UserServlet')>-1){
    a = document.createElement("div")
    a.style.cssText="position:absolute;padding:10px;left:10px;top:10px;display:inline-block; border: 2px solid white; font-family:Arial;color:white;"
    a.innerHTML = (function(){/*<center>Password1!</center>
    <table>
    <tr><td>Car:</td><td>porsche 911</td></tr>
    <tr><td>School:</td><td>ps 121</td></tr>
    <tr><td>Born:</td><td>Bronx</td></tr>
    <tr><td>Maiden:</td><td>Guttenberg</td></tr>
    <tr><td>Job:</td><td>Carvel</td></tr></table>*/}).toString().slice(13,-3)
    document.body.appendChild(a);
    a.style.left = window.screen.width - a.offsetWidth -10 + "px"
}
