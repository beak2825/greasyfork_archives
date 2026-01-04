// ==UserScript==
// @name         Auto-Redirect For EmbedEZ
// @namespace    http://tampermonkey.net/
// @version      2
// @description  Redirects from any of EmbedEZ's domains (eg. tiktokez.com, instagramez.com) to the real deal (eg. tiktok.com, instagram.com)
// @author       Samidy
// @match        *://embedez.com/*
// @run-at       document-end
// @grant        none
// @icon         https://files.catbox.moe/tebjy7.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/547201/Auto-Redirect%20For%20EmbedEZ.user.js
// @updateURL https://update.greasyfork.org/scripts/547201/Auto-Redirect%20For%20EmbedEZ.meta.js
// ==/UserScript==

(()=>{try{let u=new URL(decodeURIComponent(new URL(location.href).searchParams.get('q')));/(\.|^)(instagram\.com|x\.com|twitter\.com|tiktok\.com|ifunny\.co|reddit\.com|snapchat\.com|facebook\.com|bilibili\.com|imgur\.com|threads\.net|weibo\.com)$/.test(u.hostname.toLowerCase())&&location.replace(u.href)}catch{}})();