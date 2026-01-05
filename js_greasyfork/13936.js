// ==UserScript==
// @name         Easier DSG Routing
// @namespace    https://greasyfork.org/users/4756
// @version      0.1.3
// @description  adds the correct location id to the page for reference
// @author       saibotshamtul (Michael Cimino)
// @match        https://logistics.dcsg.com/manh/index.html
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13936/Easier%20DSG%20Routing.user.js
// @updateURL https://update.greasyfork.org/scripts/13936/Easier%20DSG%20Routing.meta.js
// ==/UserScript==

a = document.createElement("div")
a.style.cssText="position:absolute;padding:10px;left:10px;top:40px;display:inline-block; border: 2px solid white; font-family:Arial;color:white;"
a.innerHTML = (function(){/*<center>v8359_1</center>*/}).toString().slice(13,-3)
document.body.appendChild(a);

a.style.left = window.screen.width - a.offsetWidth -10 + "px"