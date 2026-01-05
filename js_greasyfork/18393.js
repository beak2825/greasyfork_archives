// ==UserScript==
// @name         Login Academy TMS
// @namespace    https://greasyfork.org/users/4756
// @version      0.1
// @author       saibotshamtul (Michael Cimino)
// @description  adds login info to the login screen
// @match        https://academysystem2015-usacademyltd70536.otm.oraclecloud.com/GC3/glog.webserver.servlet.umt.Login*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18393/Login%20Academy%20TMS.user.js
// @updateURL https://update.greasyfork.org/scripts/18393/Login%20Academy%20TMS.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...

var a = document.createElement("div")
a.style.cssText="position:absolute;padding:10px;left:10px;top:10px;display:inline-block; border: 2px solid #ccc; font-family:Arial;color:#ccc;font-size:10pt"
a.innerHTML = (function(){/*<center>3633<br>OUT2016</center>*/}).toString().slice(14,-3)
document.body.appendChild(a);
a.style.left = window.screen.width - a.offsetWidth - 10 + "px"
