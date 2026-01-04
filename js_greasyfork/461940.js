// ==UserScript==
// @name         「美团」根据文件路径打开预览地址
// @namespace    https://djzhao.js.org
// @version      0.4.3
// @icon         https://s3plus.meituan.net/v1/mss_e2821d7f0cfe4ac1bf9202ecf9590e67/cdn-prod/file:1040877d/favicon-mt.ico
// @description  删除手动复制的文件路径前缀和添加后缀
// @author       djzhao
// @include      /[a-zA-z]+://[^\s]*/
// @run-at       document_start
// @grant        unsafeWindow
// @grant        GM_setClipboard
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/461940/%E3%80%8C%E7%BE%8E%E5%9B%A2%E3%80%8D%E6%A0%B9%E6%8D%AE%E6%96%87%E4%BB%B6%E8%B7%AF%E5%BE%84%E6%89%93%E5%BC%80%E9%A2%84%E8%A7%88%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/461940/%E3%80%8C%E7%BE%8E%E5%9B%A2%E3%80%8D%E6%A0%B9%E6%8D%AE%E6%96%87%E4%BB%B6%E8%B7%AF%E5%BE%84%E6%89%93%E5%BC%80%E9%A2%84%E8%A7%88%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // 以renxiao或者supplier开头的url
    const regPrefix = /^\/(renxiao|supplier|lsrm|base|materials|depot|process|processNew)(-alias)?(\/?packages\/(admin|base-auth|base-offline|base-org))?\/?src\/pages/;
    const regSuffix = /index\.vue$/;
    let resultPath = window.location.pathname;
    let needReload = false;
    if(regPrefix.test(resultPath)) {
        // 前缀替换
        resultPath = resultPath.replace(/(\/?packages\/(admin|base-auth|base-offline|base-org))?\/?src\/pages/, '');
        needReload = true;
    }
    if (regSuffix.test(resultPath)) {
        // 后缀替换
        resultPath = resultPath.replace('/index.vue', '.html');
        needReload = true;
    }
    if (needReload) {
        window.location.pathname = resultPath;
    }

    // 处理线下和线上路径不一致的问题
    const url = window.location.href;
    if (/.*localhost.*depot-alias/.test(url)) {
        window.location.href = url.replace('depot-alias', 'materials-alias');
    }
    if (/.*localhost.*materials\//.test(url)) {
        window.location.href = url.replace('materials/', 'materials-alias/');
    }
})();