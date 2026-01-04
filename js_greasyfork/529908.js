// ==UserScript==
// @name         视频音频图片下载脚本整合器，手机可用，免键盘，免油猴菜单
// @namespace    https://facaikotei.github.io/
// @version      12.1.985
// @description  把[图片下载器]的开关添加到[媒体资源嗅探及下载(支持下载m3u8和mp4视频和音频)]的功能列里面
// @author       (c)2025 facaikotei
// @match        *://*/*
// @grant        GM_getValue
// @grant        GM_setValue
// @require      https://mirrors.sustech.edu.cn/cdnjs/ajax/libs/jwerty/0.3.2/jwerty.min.js
// @require      https://update.greasyfork.org/scripts/12228/setMutationHandler.js
// @license      MIT
// @website      https://greasyfork.org/users/1305953
// @downloadURL https://update.greasyfork.org/scripts/529908/%E8%A7%86%E9%A2%91%E9%9F%B3%E9%A2%91%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC%E6%95%B4%E5%90%88%E5%99%A8%EF%BC%8C%E6%89%8B%E6%9C%BA%E5%8F%AF%E7%94%A8%EF%BC%8C%E5%85%8D%E9%94%AE%E7%9B%98%EF%BC%8C%E5%85%8D%E6%B2%B9%E7%8C%B4%E8%8F%9C%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/529908/%E8%A7%86%E9%A2%91%E9%9F%B3%E9%A2%91%E5%9B%BE%E7%89%87%E4%B8%8B%E8%BD%BD%E8%84%9A%E6%9C%AC%E6%95%B4%E5%90%88%E5%99%A8%EF%BC%8C%E6%89%8B%E6%9C%BA%E5%8F%AF%E7%94%A8%EF%BC%8C%E5%85%8D%E9%94%AE%E7%9B%98%EF%BC%8C%E5%85%8D%E6%B2%B9%E7%8C%B4%E8%8F%9C%E5%8D%95.meta.js
// ==/UserScript==

(function () {
    'use strict';

    setMutationHandler(document.body, '#MyUrls', (els) => {
        const el = els[0];
        if (el.querySelector('#MyImage')) return false;
        el.querySelector('#MyAudio').insertAdjacentHTML('afterend', '<div id="MyImage" class="my-tab" style="user-select: auto;">🖼️图片</div>');
        el.querySelector('#MyImage').addEventListener('click', () => {
            jwerty.fire(GM_getValue('shortCutString', 'alt+W'));
        });
        return false;
    }, { childList: true, subtree: false, processExisting: true });

    setMutationHandler(document.body, '.tyc-image-container', (els) => {
        const el = els[0].querySelector('.shortCutString');
        GM_setValue('shortCutString', el.value);
        el.addEventListener('change', () => {
            GM_setValue('shortCutString', el.value);
        });
    }, { childList: true, subtree: false });
})();