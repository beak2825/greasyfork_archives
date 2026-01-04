// ==UserScript==
// @name         youkuGetUrls
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://so.youku.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397593/youkuGetUrls.user.js
// @updateURL https://update.greasyfork.org/scripts/397593/youkuGetUrls.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    setTimeout(()=>{
        let urls = [];
        document.querySelectorAll('.mod-main .tab-panel li:not(.item-last) a[data-spm="dselectbutton"]').forEach( n => urls.push(n.href));
        //urls.unshift('');
        //urls.push('');
        window.zd = urls.join('\r\n');
        console.clear();
        console.info(`************共${urls.length}个文件************`);
        console.info(window.zd);
    },3000);
})();