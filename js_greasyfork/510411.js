// ==UserScript==
// @name        Adblock - cuberealm.io
// @namespace   https://github.com/Thibb1
// @match       https://cuberealm.io/*
// @grant       none
// @version     1.2
// @author      Thibb1
// @description Remove cuberealm ads :D Works with Ublock Origin / adblocker enabled
// @license     GPL
// @downloadURL https://update.greasyfork.org/scripts/510411/Adblock%20-%20cuberealmio.user.js
// @updateURL https://update.greasyfork.org/scripts/510411/Adblock%20-%20cuberealmio.meta.js
// ==/UserScript==

// Disable ads for cuberealm.io
window.adSDKType = '';
setInterval(() => {
    // Unlock loading when ads are blocked
    try {window.adsLoadedPromiseResolve()} catch {}
    // delete FCCDCF cookie
    document.cookie = 'FCCDCF=;domain=cuberealm.io;path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT';
}, 500);
