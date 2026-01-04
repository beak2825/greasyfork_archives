// ==UserScript==
// @name         AGSV banner美化-by原作者IITII
// @name:en      功能缺失，完善中。AGSV Banner Modifier By原作者@IITII
// @namespace    smilenet-202502250555
// @version      0.1.2
// @description 个人觉得这个banner太大了，稍微调整下样式。想直接隐藏就把下面的 100px 改成 0px
// @description:en  This script modifies the banner size on AGSV website. Change the height to 0px to hide it completely.
// @author       原作者IITII
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @match        https://www.agsvpt.com/*
// @include      https://www.agsvpt.com/*
// @icon         https://avatars.githubusercontent.com/u/33705067?v=4
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527979/AGSV%20banner%E7%BE%8E%E5%8C%96-by%E5%8E%9F%E4%BD%9C%E8%80%85IITII.user.js
// @updateURL https://update.greasyfork.org/scripts/527979/AGSV%20banner%E7%BE%8E%E5%8C%96-by%E5%8E%9F%E4%BD%9C%E8%80%85IITII.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 检查 jQuery 是否加载成功
    if (typeof jQuery === 'undefined') {
        console.error('jQuery 加载失败，脚本无法运行！');
        return;
    }

    // 设置 banner 高度
    const bannerHeight = '100px'; // 用户可以修改此值，例如改为 0px 隐藏 banner

    // 使用更精确的选择器
    const $banner = jQuery("div[class*='banner']").first(); // 只匹配第一个 banner
    if ($banner.length) {
        $banner.height(bannerHeight);
        console.log('Banner 高度已修改为：', bannerHeight);
    } else {
        console.warn('未找到 banner 元素，请检查选择器！');
    }
})();