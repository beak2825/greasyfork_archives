// ==UserScript==
// @name         downloadMagnet
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  download magnet
// @author       peter
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520270/downloadMagnet.user.js
// @updateURL https://update.greasyfork.org/scripts/520270/downloadMagnet.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.addEventListener('copy',(e)=>{
        let content=window.getSelection()
        //获取复制的text
        const magnetLink = content.toString();
        if(magnetLink.startsWith('magnet:')){
            // 构建新的请求地址
            const redirectUrl = `https://pan.xunlei.com/yc?taskLink=${encodeURIComponent(magnetLink)}`;

            window.open(redirectUrl,'_blank')
        }
    },false);
})();