// ==UserScript==
// @name         B split for smiley
// @description  so smiley can split
// @namespace    http://tampermonkey.net/
// @author       Havoc
// @match        http://alis.io/*
// @match        http://*.alis.io/*
// @run-at       document-end
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_getResourceURL
// @grant        GM_xmlhttpRequest
// @version 0.0.1.40180413235653
// @downloadURL https://update.greasyfork.org/scripts/40612/B%20split%20for%20smiley.user.js
// @updateURL https://update.greasyfork.org/scripts/40612/B%20split%20for%20smiley.meta.js
// ==/UserScript==

setInterval(()=>{$("#input_box2").is(":focus")&&console.log(1)},500);var split=()=>{var e=new DataView(new ArrayBuffer(1));e.setUint8(0,17);for(var o=0;o<1;o++)setTimeout(()=>{webSocket.send(e.buffer)},50*o)};$("body").on("keydown",function(e){66!==e.keyCode||$("#input_box2").is(":focus")||split()});;