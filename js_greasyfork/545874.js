// ==UserScript==
// @name         去广告1
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  去广告
// @author       You
// @license      MIT
// @grant        GM_addStyle
// @match        https://sharp.nodejs.cn/*
// @match        https://www.zhangxinxu.com/wordpress/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=nodejs.cn
// @downloadURL https://update.greasyfork.org/scripts/545874/%E5%8E%BB%E5%B9%BF%E5%91%8A1.user.js
// @updateURL https://update.greasyfork.org/scripts/545874/%E5%8E%BB%E5%B9%BF%E5%91%8A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const { hostname } = location

    if (hostname === 'sharp.nodejs.cn') {
        GM_addStyle(`
:root:root:root {
body {
overflow: auto !important;
}
.fc-message-root,.adsbygoogle,.mymn-full  {
display:none !important;
transform: scale(0);
pointer-events: none;
}
}
   `)
    }


    if (hostname === 'www.zhangxinxu.com') {
        function isWebComponent(element) {
            return element.tagName.includes('-')
        }
        [...(document.querySelector('#sidebar')?.children ?? [])].forEach(elem => {
            if (isWebComponent(elem)) {
                elem.style.display = 'none'
            }
        })
    }
})();