// ==UserScript==
// @name AcFun Player Crack
// @namespace http://www.acfun.tv/
// @version 0.1
// @description A simple userscript to crack AcFun's flash player.
// @match http://*.acfun.tv/v/ac*
// @copyright 2014+, Mimiko
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/5373/AcFun%20Player%20Crack.user.js
// @updateURL https://update.greasyfork.org/scripts/5373/AcFun%20Player%20Crack.meta.js
// ==/UserScript==
(function(){$(function(){return setTimeout(function(){var btn,_base,_ref;btn=window.$$("#area-part-view .btn.active");if((_ref=btn.data().from)==="youku2"||_ref==="qq2"||_ref==="letv2"||_ref==="sohu"||_ref==="pptv"||_ref==="iqiyi"){btn.data().from="";return typeof(_base=system.func).setPlayer==="function"?_base.setPlayer():void 0}},5e3)})}).call(this);