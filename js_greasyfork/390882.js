// ==UserScript==
// @name         Google Bean
// @namespace    http://tampermonkey.net/
// @version      834|\|5
// @description  Anything on any of Google's websites is now bean. Oh yeah you also get an annoying notification
// @author       Cobalt
// @match        https://*.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390882/Google%20Bean.user.js
// @updateURL https://update.greasyfork.org/scripts/390882/Google%20Bean.meta.js
// ==/UserScript==
document.write('beans');
setTimeout(()=>{while(1){alert('bean')}},1);