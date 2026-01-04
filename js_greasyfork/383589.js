// ==UserScript==
// @name SDPusherX
// @namespace Violentmonkey Scripts
// @match *://hd/*
// @match http://webadmin.mango.local:8088/wa/*
// @grant none
// @description Script adds support SDPusherX to SD
// @version 1.5
// @downloadURL https://update.greasyfork.org/scripts/383589/SDPusherX.user.js
// @updateURL https://update.greasyfork.org/scripts/383589/SDPusherX.meta.js
// ==/UserScript==

var strGET = window.location.search.replace('?', ''); 
if (strGET.split('=')[0] == 'ls') {
  window.onload = function() {
    var ics=new SSWA.IcsRunner();
    ics.runByAccountId(strGET.split('=')[1],false);
  }
} else {
  (_doc=document).body.appendChild(_doc.createElement("script")).src = "http://192.168.2.153/sdpusher/X/assets/script_violentmonkey.js?nocache="+Math.floor(Math.random() * 100)+window.location.search.replace('?', '').split('&')[3];void 0;
}