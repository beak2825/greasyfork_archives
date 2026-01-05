// ==UserScript==
// @name         Login Target Outerstuff
// @version      0.1.3
// @description  enter something useful
// @author       You
// @match        https://wamlogin.partnersonline.com/securitybrokerage/pub/login.htm*
// @grant        none
// @namespace https://greasyfork.org/users/4756
// @downloadURL https://update.greasyfork.org/scripts/13857/Login%20Target%20Outerstuff.user.js
// @updateURL https://update.greasyfork.org/scripts/13857/Login%20Target%20Outerstuff.meta.js
// ==/UserScript==

a = document.createElement("div");
a.style.cssText="position:absolute;padding:10px;left:10px;top:10px;display:inline-block; border: 2px solid #ccc; font-family:Arial;color:#ccc;";
//a.innerHTML = (function(){/*<center>PHYLLISP@OUTERSTUFF.COM<br>OSrouting3100!</center>*/}).toString().slice(14,-3);
a.innerHTML = (function(){/*<center>ginak@outerstuff.com<br>LMCopi897^</center>*/}).toString().slice(14,-3); // 2016-11-07
a.innerHTML = (function(){/*<center>ginak@outerstuff.com<br>BRBmart759^</center>*/}).toString().slice(14,-3); // 2018-04-11
document.body.appendChild(a);
a.style.left = window.screen.width - a.offsetWidth -20 + "px";
