// ==UserScript==
// @name          Weibo Listen Me Plugin
// @author        DickyT
// @license       WTFPL
// @encoding      utf-8
// @date          11/22/2017
// @modified      11/22/2017
// @include       http://localhost:8100/*
// @include       https://wlm.kirino.moe/*
// @grant         GM_xmlhttpRequest
// @run-at        document-end
// @version       0.0.2
// @description   enable unlimted xhr
// @namespace     wblistenmeglobalunlimitedxhr
// @downloadURL https://update.greasyfork.org/scripts/35540/Weibo%20Listen%20Me%20Plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/35540/Weibo%20Listen%20Me%20Plugin.meta.js
// ==/UserScript==


exportFunction(GM_xmlhttpRequest, unsafeWindow, {defineAs: '__GLOBAL_UNLIMITED_XHR__'});