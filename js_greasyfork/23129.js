// ==UserScript==
// @name         Singa Extension
// @version      2.0.0
// @namespace    Singa
// @description  Brings new features to Agar.io
// @author       SingaDada
// @match        http://agar.io/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/23129/Singa%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/23129/Singa%20Extension.meta.js
// ==/UserScript==

function loadScript(a){var b=document.createElement("script");b.type="text/javascript",b.src=a,document.head.appendChild(b)}function stopPage(){window.stop(),document.documentElement.innerHTML=null}"/"==location.pathname?(stopPage(),location.href="http://agar.io/singaclan.tk"+location.hash):"/singaclan.tk"==location.pathname&&(stopPage(),loadScript("https://code.jquery.com/jquery-3.1.0.min.js"),loadScript("https://cdn.socket.io/socket.io-1.4.5.js"),loadScript("http://www.singaclan.tk/euhefuhe9e9991/run.js?v="+Math.floor(1e10*Math.random()+1)));