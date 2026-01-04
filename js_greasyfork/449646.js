// ==UserScript==
// @name         腾讯文档、QQ、TIM链接自动跳转
// @namespace    http://bkt.moe/
// @version      0.2.2
// @description  忽略“当前网页非官方页面”和“即将离开腾讯文档”的手动复制链接提示，直接自动打开。
// @author       ShadowPower
// @match        https://c.pc.qq.com/middlem.html*
// @match        https://docs.qq.com/scenario/link.html*
// @run-at       document-start
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qq.com
// @license      AGPL
// @downloadURL https://update.greasyfork.org/scripts/449646/%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E3%80%81QQ%E3%80%81TIM%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/449646/%E8%85%BE%E8%AE%AF%E6%96%87%E6%A1%A3%E3%80%81QQ%E3%80%81TIM%E9%93%BE%E6%8E%A5%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==


(function() {
    'use strict';

    stop();
    const queryParams = ['pfurl', 'url'];
    const params = new URLSearchParams(location.search);
    queryParams.forEach(queryParam => {
        if (params.has(queryParam)) {
            const encoded_url = params.get(queryParam);
            let url = decodeURIComponent(encoded_url);
            if (!/^https?:\/\//i.test(url)) {
                url = 'https://' + url;
            }
            location.replace(url);
        }
    });
})();