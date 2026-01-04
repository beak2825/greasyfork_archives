// ==UserScript==
// @name         猜盐VIP
// @namespace    https://bobliu.tech/
// @version      1.0
// @description  从现在开始你就是猜盐VIP（跑）
// @author       BobLiu
// @match        https://xiaoce.fun/*
// @icon         https://x24r.static.secure-cdn.top/xiaoce/icon_1.png
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/545714/%E7%8C%9C%E7%9B%90VIP.user.js
// @updateURL https://update.greasyfork.org/scripts/545714/%E7%8C%9C%E7%9B%90VIP.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const moduleUrl = 'https://x24r.static.secure-cdn.top/xiaoce/assets/index-1755053492772-yHKNJiIy.js';

    GM_xmlhttpRequest({
        method: 'GET',
        url: moduleUrl,
        onload: function(response) {
            let code = response.responseText;

            code = code.replace(/async function fg\s*\([^)]*\)\s*{/,
                `async function fg(e) {
                    console.log("Patched!")
                    return { success: true, data: true }
                `
            );

            const blobUrl = URL.createObjectURL(new Blob([code], { type: 'application/javascript' }));

            document.querySelectorAll('script[type=module]').forEach(el => {
                if (el.src === moduleUrl) {
                    el.remove();
                    const newScript = document.createElement('script');
                    newScript.type = 'module';
                    newScript.src = blobUrl;
                    document.head.appendChild(newScript);
                }
            });
        }
    });

})();