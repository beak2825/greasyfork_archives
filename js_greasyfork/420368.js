// ==UserScript==
// @name           User-Agent Switcher
// @version        1.0
// @namespace      useragent-switcher
// @description    set user-agent
// @include        https://m.chaturbate.com/*
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant          GM_xmlhttpRequest
// @run-at         document-start
// @downloadURL https://update.greasyfork.org/scripts/420368/User-Agent%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/420368/User-Agent%20Switcher.meta.js
// ==/UserScript==




$(function(){

    console.log('=============||||| RUNNING USER-AGENT SWITCHER |||||==============');

    navigator.__defineGetter__("userAgent", function() {return "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0_1 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A402 Safari/604.1"})

});
