// ==UserScript==
// @name         企耳3护眼遮罩
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  企耳3的遮罩。要瞎了OTL
// @author       Haiiro
// @match        https://30.yunerp.vip/*
// @grant        none
// @license      Private Use Only
// @downloadURL https://update.greasyfork.org/scripts/539574/%E4%BC%81%E8%80%B33%E6%8A%A4%E7%9C%BC%E9%81%AE%E7%BD%A9.user.js
// @updateURL https://update.greasyfork.org/scripts/539574/%E4%BC%81%E8%80%B33%E6%8A%A4%E7%9C%BC%E9%81%AE%E7%BD%A9.meta.js
// ==/UserScript==

(function() {


    // 遮罩颜色
    const backgroundValue = 'rgba(0, 128, 0, 0.01)'; // 前3个值是颜色RBG，0~255；最后一个值是不透明度0~1，1是完全显示

    // 组合滤镜效果说明：
    const filterValue =
          "brightness(95%) "    // 亮度，100%为正常，小于100%变暗，大于100%变亮，建议50%~150%
    +  "opacity(95%) "  ;      // 透明度，0%完全透明，100%不透明，建议50%~100%
  
    

























    const mask = document.createElement('div');
    mask.id = 'anti-eye-burn-overlay';
    Object.assign(mask.style, {
        position: 'fixed',
        top: '0',
        left: '0',
        width: '100vw',
        height: '100vh',
        zIndex: '999999', // 足够高，覆盖全屏
        pointerEvents: 'none', // 关键：不阻止鼠标事件
        background:backgroundValue,
        backdropFilter: filterValue,

    });

    document.body.appendChild(mask);
})();