// ==UserScript==
// @name         预览链接中的图片
// @namespace    http://tampermonkey
// @version      1
// @description  在本页浏览其他网页链接中的图片
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/478179/%E9%A2%84%E8%A7%88%E9%93%BE%E6%8E%A5%E4%B8%AD%E7%9A%84%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/478179/%E9%A2%84%E8%A7%88%E9%93%BE%E6%8E%A5%E4%B8%AD%E7%9A%84%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的域名
    const currentDomain = window.location.hostname;

    // 检查用户是否已经选择了禁用脚本
    let isScriptDisabled = GM_getValue(`disableScript_${currentDomain}`, false);

    // 添加启用/禁用功能的按钮
    GM_registerMenuCommand(isScriptDisabled ? '启用预览链接中的图片' : '禁用预览链接中的图片', function() {
        isScriptDisabled = !isScriptDisabled;
        GM_setValue(`disableScript_${currentDomain}`, isScriptDisabled);
        location.reload(); // 刷新页面使设置生效
    });

    // 如果脚本被禁用，直接返回，不执行脚本代码
    if (isScriptDisabled) {
        return;
    }

    const links = document.getElementsByTagName('a');
    for (let i = 0; i < links.length; i++) {
        const link = links[i];
        if (link.href.match(/\.(jpg|jpeg|png|gif)$/i)) {
            const img = document.createElement('img');
            img.src = link.href;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '100%';
            img.style.display = 'block';
            img.style.margin = '0 auto';
            link.parentNode.insertBefore(img, link.nextSibling);
        }
    }
})();

// 注册一个菜单命令，让用户可以禁用脚本
GM_registerMenuCommand('禁用预览链接中的图片', () => {
    // 获取当前页面的域名
    const currentDomain = window.location.hostname;

    // 将禁用标志设置为true，同时考虑域名
    GM_setValue(`disableScript_${currentDomain}`, true);
    alert('脚本已禁用，请刷新页面以生效。');
});
