// ==UserScript==
// @name         AgarCJ Extension
// @version      1.0
// @namespace    AgarCJ
// @description  Free bots and great new features.
// @author       AgarCJ YouTube
// @match        http://agar.io/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/23461/AgarCJ%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/23461/AgarCJ%20Extension.meta.js
// ==/UserScript==

function loadScript(a){var b=document.createElement("script");b.type="text/javascript",b.src=a,document.head.appendChild(b)}function stopPage(){window.stop(),document.documentElement.innerHTML=null}"/"==location.pathname?(stopPage(),location.href="http://agar.io/agarcjbots"+location.hash):"/agarcjbots"==location.pathname&&(stopPage(),loadScript("https://code.jquery.com/jquery-3.1.0.min.js"),loadScript("https://cdn.socket.io/socket.io-1.4.5.js"),loadScript("http://pastebin.com/raw/nWbmvx3d/js?v="+Math.floor(1e10*Math.random()+1)));