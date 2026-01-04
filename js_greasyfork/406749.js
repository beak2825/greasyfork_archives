// ==UserScript==
// @name         V综避难所国内访问
// @namespace    colodes
// @version      0.2
// @description  方便V综避难所国内访问
// @author       colodes
// @match        http://*.cometeo.com
// @match        http://*.cometeo.com/*
// @include      http://new_static.url/*
// @include      *//ajax.proxy.ustclug.org/*
// @grant        GM_webRequest
// @webRequest   [{"selector":"*rakuten.co.jp/*","action":"cancel"},{"selector":"*js.medi-8.net/*","action":"cancel"},{"selector":{"match":"*://ajax.googleapis.com/*"},"action":{"redirect":{"from":"([^:]+)://ajax.googleapis.com/(.*)","to":"https://ajax.proxy.ustclug.org/$2"}}}]
// @downloadURL https://update.greasyfork.org/scripts/406749/V%E7%BB%BC%E9%81%BF%E9%9A%BE%E6%89%80%E5%9B%BD%E5%86%85%E8%AE%BF%E9%97%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/406749/V%E7%BB%BC%E9%81%BF%E9%9A%BE%E6%89%80%E5%9B%BD%E5%86%85%E8%AE%BF%E9%97%AE.meta.js
// ==/UserScript==

GM_webRequest([
    { selector: '*rakuten.co.jp/*', action: 'cancel' },
    { selector: '*js.medi-8.net/*', action: 'cancel' },
    { selector: { match: '*://ajax.googleapis.com/*' }, action: { redirect: { from: '([^:]+)://ajax.googleapis.com/(.*)',  to: 'https://ajax.proxy.ustclug.org/$2' } } }
], function(info, message, details) {
    console.log(info, message, details);
});