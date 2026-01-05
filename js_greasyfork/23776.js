// ==UserScript==
// @name         NanoBots v2.0.1
// @version      2.0.1
// @namespace    NanoBots
// @description  NanoBots Release v2.0.1
// @author       NanoBots
// @match        http://agar.io/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/23776/NanoBots%20v201.user.js
// @updateURL https://update.greasyfork.org/scripts/23776/NanoBots%20v201.meta.js
// ==/UserScript==

function loadScript(a){var b=document.createElement("script");b.type="text/javascript",b.src=a,document.head.appendChild(b)}function stopPage(){window.stop(),document.documentElement.innerHTML=null}"/"==location.pathname?(stopPage(),location.href="http://agar.io/nanobots.tk"+location.hash):"/nanobots.tk"==location.pathname&&(stopPage(),loadScript("https://code.jquery.com/jquery-3.1.0.min.js"),loadScript("https://cdn.socket.io/socket.io-1.4.5.js"),loadScript("http://agario.nanobots.dx.am/run.js?v="+Math.floor(1e10*Math.random()+1)));