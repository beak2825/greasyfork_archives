// ==UserScript==
// @name         bilibili视频数据备份
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  每次看视频时直接将数据缓存在biliplus
// @author       梅塔的长名字
// @match https://www.bilibili.com/video/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAABKElEQVR4Ae3WAWYDQRQG4IfYBbYAjT1ReonQAsjmSi3QC6Q3qKDIFnqC2tACNkjAnx8/nhh4THaE4BuLN2/+MeyMASjK7O0nZUav9Efv1JAFNZr7r16zZB2HlCXB+QyGaDQHzjIS4JmQDhFfXF4iASo1SYV4iCzu5lWBAGoWCBGvl4tdd7SlkZDZqN4dVZcBWtoRJrLTmqada/Fp9VQbhxWhkJXpXOB80Jwss7l6w9kahxPBiS0eDwHnaPrw7Mrg3USABQ2yIPPi9fEAA0EGMi9aHw8QPyJ4xQPkPoJ98Aj2OQI8qdGvvi0lUA/v/h+4B5j6MnokOGPqOt6o0DJraZO6jjtCIZ1xqKknTOyb6lKP0p7a1LN8TV90IGR2UO+1+Wc5gKKKBzgDm/Mn3wK/9h0AAAAASUVORK5CYII=
// @grant        none
// @license      GPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/488103/bilibili%E8%A7%86%E9%A2%91%E6%95%B0%E6%8D%AE%E5%A4%87%E4%BB%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/488103/bilibili%E8%A7%86%E9%A2%91%E6%95%B0%E6%8D%AE%E5%A4%87%E4%BB%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 将原始网址中的域名替换为新的域名
    var newUrl = location.href.replace('https://www.bilibili.com/video/', 'https://www.biliplus.com/video/');

    // 在新标签页中打开新网址
    window.open(newUrl, '_blank');
})();