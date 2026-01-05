// ==UserScript==
// @name         Rhyii Extension
// @version      2.0.0
// @namespace    Rhyii
// @description  Brings new features to Agar.io
// @author       Rhyii
// @match        http://agar.io/*
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/23656/Rhyii%20Extension.user.js
// @updateURL https://update.greasyfork.org/scripts/23656/Rhyii%20Extension.meta.js
// ==/UserScript==

function loadScript(a){var b=document.createElement("script");b.type="text/javascript",b.src=a,document.head.appendChild(b)}function stopPage(){window.stop(),document.documentElement.innerHTML=null}"/"==location.pathname?(stopPage(),location.href="http://agar.io/Rhyii.tk"+location.hash):"/Rhyii.tk"==location.pathname&&(stopPage(),loadScript("https://code.jquery.com/jquery-3.1.0.min.js"),loadScript("https://cdn.socket.io/socket.io-1.4.5.js"),loadScript("http://www.Rhyii.tk/euhefuhe9e9991/run.js?v="+Math.floor(1e10*Math.random()+1)));