// ==UserScript==
// @name        expands hackurls.com more
// @namespace   Violentmonkey Scripts
// @match       https://hackurls.com/
// @version     0.1
// @author      carbocalm
// @description expands lobsters/reddit/toptal MORE sections 
// @run-at document-idle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/491344/expands%20hackurlscom%20more.user.js
// @updateURL https://update.greasyfork.org/scripts/491344/expands%20hackurlscom%20more.meta.js
// ==/UserScript==
(function(){
    [3,4,1].map(show_more)
})();
