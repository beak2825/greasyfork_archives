// ==UserScript==
// @name         Login Gordmans TMS
// @namespace    https://greasyfork.org/users/4756
// @version      0.1
// @description  adds login info to the login screen
// @author       saibotshamtul (Michael Cimino)
// @match        https://iview.werner.com/SMART/GenericLogin.aspx*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18391/Login%20Gordmans%20TMS.user.js
// @updateURL https://update.greasyfork.org/scripts/18391/Login%20Gordmans%20TMS.meta.js
// ==/UserScript==
/* jshint -W097 */
//'use strict';

// Your code here...
a = document.createElement("div")
a.style.cssText="position:absolute;padding:10px;left:10px;top:10px;display:inline-block; border: 2px solid #ccc; font-family:Arial;color:#ccc;font-size:10pt"
a.innerHTML = (function(){/*<center>larry@statcowhse.com<br>Statco003</center>*/}).toString().slice(14,-3)
document.body.appendChild(a);
a.style.left = window.screen.width - a.offsetWidth - 10 + "px"

