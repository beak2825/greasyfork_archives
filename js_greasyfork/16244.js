// ==UserScript==
// @name         Login TSA
// @namespace    https://greasyfork.org/users/4756
// @version      0.1.1
// @description  add's login info to the login screen
// @author       saibotshamtul (Michael Cimino)
// @match        http://tsa.shipcomm.com/tsa/vendor/vendorLoginScreen.jsp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/16244/Login%20TSA.user.js
// @updateURL https://update.greasyfork.org/scripts/16244/Login%20TSA.meta.js
// ==/UserScript==
/* jshint -W097 */
//'use strict';

a = document.createElement("div")
a.style.cssText="position:absolute;padding:10px;left:10px;top:35px;display:inline-block; border: 2px solid #ccc; font-family:Arial;color:#ccc;"
a.innerHTML = (function(){/*<center>reebo07310</center>*/}).toString().slice(14,-3)
document.body.appendChild(a);
a.style.left = window.screen.width - a.offsetWidth - 20 + "px"
