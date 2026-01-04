// ==UserScript==
// @name         图片锐化矩阵
// @namespace    http://tampermonkey.net/
// @version      2024-05-28
// @description  图片锐化
// @author       AN drew
// @match        https://www.ruankao.org.cn/guide
// @require      https://lib.baomitu.com/jquery/3.5.0/jquery.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/496359/%E5%9B%BE%E7%89%87%E9%94%90%E5%8C%96%E7%9F%A9%E9%98%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/496359/%E5%9B%BE%E7%89%87%E9%94%90%E5%8C%96%E7%9F%A9%E9%98%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let sharp=5;

    $(document.body).append(`
<svg>
    <defs>
        <filter id="sharpy">
            <feConvolveMatrix order="3" kernelMatrix="0 -1 0 -1 `+sharp+` -1 0 -1 0"/>
        </filter>
    </defs>
</svg>`);

    GM_addStyle(`
    .layui-tab-item.t-center.layui-show{filter:url(#sharpy)}
    `)
})();