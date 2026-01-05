// ==UserScript==
// @name         Login RVCF
// @namespace    https://greasyfork.org/users/4756
// @author       saibotshamtul (Michael Cimino)
// @version      0.1
// @description  adds login info to the login screen
// @match        https://www.rvcf.com/Login.aspx
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13946/Login%20RVCF.user.js
// @updateURL https://update.greasyfork.org/scripts/13946/Login%20RVCF.meta.js
// ==/UserScript==

a = document.createElement("div")
a.style.cssText="position:absolute;padding:10px;left:10px;top:10px;display:inline-block; border: 2px solid #ccc; font-family:Arial;color:#ccc;"
a.innerHTML = (function(){/*<center>larry@statcowhse.com<br>statco01</center>*/}).toString().slice(14,-3)
document.body.appendChild(a);
a.style.left = window.screen.width - a.offsetWidth -20 + "px"
