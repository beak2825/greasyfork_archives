// ==UserScript==
// @name         ilab解锁复制粘贴
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  没什么好描述的，但是非要我写
// @author       Yungs
// @match        *.ilab-xMMM.com/*
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/428306/ilab%E8%A7%A3%E9%94%81%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/428306/ilab%E8%A7%A3%E9%94%81%E5%A4%8D%E5%88%B6%E7%B2%98%E8%B4%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    document.onload = Delay();
     function Delay()
    {
        setTimeout(removeContent,100);
    }
    function removeContent()
    {
        document.onselectstart=null;
        document.oncontextmenu=null;

    }
})();