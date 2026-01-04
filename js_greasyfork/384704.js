// ==UserScript==
// @name         Stop Reddit Chat Typing
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  stop typing on reddit chat
// @author       rdt
// @match        *://reddit.com/*
// @match        *://*.reddit.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/384704/Stop%20Reddit%20Chat%20Typing.user.js
// @updateURL https://update.greasyfork.org/scripts/384704/Stop%20Reddit%20Chat%20Typing.meta.js
// ==/UserScript==
var wsHook = {};
!function(){function r(e){this.bubbles=e.bubbles||!1,this.cancelBubble=e.cancelBubble||!1,this.cancelable=e.cancelable||!1,this.currentTarget=e.currentTarget||null,this.data=e.data||null,this.defaultPrevented=e.defaultPrevented||!1,this.eventPhase=e.eventPhase||0,this.lastEventId=e.lastEventId||"",this.origin=e.origin||"",this.path=e.path||new Array(0),this.ports=e.parts||new Array(0),this.returnValue=e.returnValue||!0,this.source=e.source||null,this.srcElement=e.srcElement||null,this.target=e.target||null,this.timeStamp=e.timeStamp||null,this.type=e.type||"message",this.__proto__=e.__proto__||MessageEvent.__proto__}var e=wsHook.before=function(e,t,n){return-1!=e.indexOf("TPST")&&(e=e.split("TPST").join("TPNO")),e},t=wsHook.after=function(e,t,n){return e};wsHook.resetHooks=function(){wsHook.before=e,wsHook.after=t};var a=WebSocket;WebSocket=function(e,t){var s;this.url=e,this.protocols=t;var n=(s=this.protocols?new a(e,t):new a(e)).send;return s.send=function(e){e=wsHook.before(e,s.url)||e,n.apply(this,arguments)},s._addEventListener=s.addEventListener,s.addEventListener=function(){var t,n=this;return"message"===arguments[0]&&(arguments[1]=(t=arguments[1],function(e){null!==(e=wsHook.after(new r(e),s.url,s))&&t.apply(n,arguments)})),s._addEventListener.apply(this,arguments)},Object.defineProperty(s,"onmessage",{set:function(){var e=this,t=arguments[0];s._addEventListener.apply(this,["message",function(){arguments[0]=wsHook.after(new r(arguments[0]),s.url,s),null!==arguments[0]&&t.apply(e,arguments)},!1])}}),s}}();