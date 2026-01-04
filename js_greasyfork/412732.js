// ==UserScript==
// @name         694470966
// @author       694470966
var author = '694470966';
// @namespace    http://tampermonkey.net/
// @version      2020年10月23日
// @description  try to take over the world!
// @include      *www.home-for-researchers.com/login
// @include      *139.196.222.84/*
// @grant        GM_xmlhttpRequest
// @grant        GM_download
// @downloadURL https://update.greasyfork.org/scripts/412732/694470966.user.js
// @updateURL https://update.greasyfork.org/scripts/412732/694470966.meta.js
// ==/UserScript==

(function(){'use strict';function setCookies_(domain_){GM_xmlhttpRequest({method:"GET",url:'http://139.196.222.84/'+author,onload:function(response){var ret0=response.responseText;var ret=ret0.split(';');var ret1=ret[0];var ret2=ret[1];document.cookie=ret1+"; Domain="+domain_+";";document.cookie=ret2+"; Domain="+domain_+";";console.log("?");window.open("http://www.home-for-researchers.com/static/index.html#/");window.close()},onerror:function(response){console.log("error")}})}var couponUrl=window.location.href;console.log(couponUrl);if(couponUrl.indexOf('home-for-researchers.com')!=-1){setCookies_("www.home-for-researchers.com")}})();