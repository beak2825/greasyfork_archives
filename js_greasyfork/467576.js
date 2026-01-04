// ==UserScript==
// @name     移除新锦成可见性事件监听
// @version  1.1
// @grant    none
// @match    http://course.njcedu.com/*
// @description Prevents videos from pausing when switching tabs
// @description:zh-cn 阻止观看新锦城视频时，视频不可见时就被暂停
// @namespace https://greasyfork.org/users/1075507
// @downloadURL https://update.greasyfork.org/scripts/467576/%E7%A7%BB%E9%99%A4%E6%96%B0%E9%94%A6%E6%88%90%E5%8F%AF%E8%A7%81%E6%80%A7%E4%BA%8B%E4%BB%B6%E7%9B%91%E5%90%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/467576/%E7%A7%BB%E9%99%A4%E6%96%B0%E9%94%A6%E6%88%90%E5%8F%AF%E8%A7%81%E6%80%A7%E4%BA%8B%E4%BB%B6%E7%9B%91%E5%90%AC.meta.js
// ==/UserScript==

function overridePause() {
    Object.defineProperty(document, 'hidden', {value: false});
    if (window.polyvPlayer && typeof window.polyvPlayer.pause === 'function') {
        window.polyvPlayer.pause = function() {};
    }
}

// 确保在文档加载完成后执行此函数
if (document.readyState === 'complete') {
    overridePause();
} else {
    window.addEventListener('load', overridePause);
}
