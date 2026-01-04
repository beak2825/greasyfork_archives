// ==UserScript==
// @name        Telegram Page Prevent URL Scheme First Call
// @namespace   mozl.net
// @match       https://t.me/*
// @match       https://telegram.me/joinchat/*
// @grant       none
// @run-at      document-start
// @version     0.4
// @author      Mozl
// @description Prevent URL Scheme from being called when opening Telegram Page
// @downloadURL https://update.greasyfork.org/scripts/407497/Telegram%20Page%20Prevent%20URL%20Scheme%20First%20Call.user.js
// @updateURL https://update.greasyfork.org/scripts/407497/Telegram%20Page%20Prevent%20URL%20Scheme%20First%20Call.meta.js
// ==/UserScript==
/*jshint esversion: 6 */

!function(){function e(e,t){this.script=e,this.target=t,this._cancel=!1,this._replace=null,this._stop=!1}e.prototype.preventDefault=function(){this._cancel=!0},e.prototype.stopPropagation=function(){this._stop=!0},e.prototype.replacePayload=function(e){this._replace=e};var t=[],n=window.addEventListener.bind(window),o=window.removeEventListener.bind(window);window.addEventListener=function(){"beforescriptexecute"===arguments[0].toLowerCase()?function(e){if(!e instanceof Function)throw new Error("Event handler must be a function.");t.push(e)}(arguments[1]):n.apply(null,arguments)},window.removeEventListener=function(){"beforescriptexecute"===arguments[0].toLowerCase()?function(e){for(var n=t.length;n--;)t[n]===e&&t.splice(n,1)}(arguments[1]):o.apply(null,arguments)};var r=function(n,o){var r=new e(n,o);if(window.onbeforescriptexecute instanceof Function)try{window.onbeforescriptexecute(r)}catch(e){console.error(e)}for(var i=0;i<t.length&&!r._stop;i++)try{t[i](r)}catch(e){console.error(e)}return r};new MutationObserver(e=>{for(var t=0;t<e.length;t++)for(var n=0;n<e[t].addedNodes.length;n++){var o=e[t].addedNodes[n];if("SCRIPT"===o.tagName){var i=r(o,e[t].target);i._cancel?o.remove():"string"==typeof i._replace&&(o.textContent=i._replace)}}}).observe(document,{childList:!0,subtree:!0})}();

(function () { 
	window.addEventListener('beforescriptexecute',e => {
		if (e.script.textContent.includes('protoUrl')) {
      e.preventDefault()
		} 
	})
})()
