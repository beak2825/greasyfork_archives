// ==UserScript==
// @name         Snowlord7 Dev Console
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  dev console by snowlord7, but i added a button to open it.
// @author       twarped
// @match        http*://*/*
// @exclude      https://docs.google.com/*/*
// @exclude      https://sites.google.com/*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390184/Snowlord7%20Dev%20Console.user.js
// @updateURL https://update.greasyfork.org/scripts/390184/Snowlord7%20Dev%20Console.meta.js
// ==/UserScript==
var on = document.createElement('button');
on.innerHTML = "Dev Console";
on.addEventListener("click",function(){
    var x = document.createElement("script");
    x.src = "https://cdn.jsdelivr.net/gh/SnowLord7/devconsole@master/main.js";
    x.onload = alert("Loaded Developer Console!")+alert('this is Snowlord7s thing...');
    document.head.appendChild(x);
});
document.body.appendChild(on);
