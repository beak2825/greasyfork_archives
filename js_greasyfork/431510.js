// ==UserScript==
// @name         Private Server
// @namespace    -
// @version      -
// @description  Private Server to Enjoy with Friends!!!
// @author       broken4
// @match        *://*.moomoo.io/*
// @match        *://moomoo.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431510/Private%20Server.user.js
// @updateURL https://update.greasyfork.org/scripts/431510/Private%20Server.meta.js
// ==/UserScript==
eval('(function(){\'use\x20strict\';window.onbeforeunload=null;localStorage.moofoll=true;localStorage.native_resolution=true;setInterval(()=>{document.querySelector("#pre-content-container").remove();document.getElementById("moomooio_728x90_home").css({display:"none"});document.getElementById("adCard").remove();},0);setInterval(()=>{document.getElementById("ot-sdk-btn-floating").style.display="none";console.clear();},0);let e=WebSocket;class t extends e{constructor(){super(\'wss://time-storm-fear.glitch.me/moomoo\');};};window.WebSocket=t;window.vultr={value:{scheme:"mm_prod",servers:[{ip:"_",scheme:"mm_prod",region:"vultr:12",index:0,games:[{playerCount:0,isPrivate:true}]}]},writable:false};let n=XMLHttpRequest.prototype.open;XMLHttpRequest.prototype.open=function(){let r=arguments[1];if(r)if(r.endsWith("/serverData"))return n.apply(this,[\'GET\',{scheme:"mm_prod",servers:[{ip:"_",scheme:"mm_prod",region:"vultr:12",index:0,games:[{playerCount:0,isPrivate:true}]}]}]);return n.apply(this,arguments);};if(window.location.href.includes("?server=")&&!window.location.href.includes("?server=12:0:0"))window.location="//"+window.location.host;})();');