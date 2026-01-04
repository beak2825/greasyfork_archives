// ==UserScript==
// @name         图片悬停缩略图预览
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  鼠标悬停图片显示缩略图跟随鼠标，自适应位置，点击后关闭
// @author       YOU
// @match        *://*/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538510/%E5%9B%BE%E7%89%87%E6%82%AC%E5%81%9C%E7%BC%A9%E7%95%A5%E5%9B%BE%E9%A2%84%E8%A7%88.user.js
// @updateURL https://update.greasyfork.org/scripts/538510/%E5%9B%BE%E7%89%87%E6%82%AC%E5%81%9C%E7%BC%A9%E7%95%A5%E5%9B%BE%E9%A2%84%E8%A7%88.meta.js
// ==/UserScript==

(function () {
    'use strict';
    let previewImg = true;
    const btn = Object.assign(document.createElement('div'), {
        textContent: '预览图: 开',
        style: 'position:fixed;left:10px;bottom:10px;padding:5px 10px;background:#000;color:#fff;font-size:12px;cursor:pointer;z-index:10000;border-radius:4px;',
        onclick: () => { previewImg = !previewImg; btn.textContent = '预览图: ' + (previewImg ? '开' : '关'); }
    });
    document.body.appendChild(btn);

    function initPreview() {
        let preview = null, timer = null, target = null;
        const move = e => {
            if (!preview) return;
            const p = 15, w = preview.offsetWidth, h = preview.offsetHeight, sw = window.innerWidth, sh = window.innerHeight;
            let x = e.clientX + p, y = e.clientY + p;
            if (x + w > sw) x = e.clientX - w - p;
            if (y + h > sh) y = e.clientY - h - p;
            if (x < 0) x = 0;
            if (y < 0) y = 0;
            preview.style.left = x + 'px';
            preview.style.top = y + 'px';
        };
        const remove = () => { clearTimeout(timer); if (preview) preview.remove(); preview = null; document.removeEventListener('mousemove', move); };
        document.addEventListener('mouseover', e => {
            if (!previewImg || e.target.tagName !== 'IMG') return;
            target = e.target;
            timer = setTimeout(() => {
                if (preview) return;
                preview = Object.assign(document.createElement('img'), {
                    src: target.src,
                    style: 'position:fixed;width:600px;max-height:600px;z-index:9999;pointer-events:none;border:2px solid #ccc;border-radius:6px;box-shadow:0 0 8px rgba(0,0,0,0.5);'
                });
                document.body.appendChild(preview);
                document.addEventListener('mousemove', move);
            }, 100);
        });
        document.addEventListener('mouseout', e => { if (e.target === target || e.target === preview) remove(); });
        document.addEventListener('click', remove);
    }

    initPreview(); // 启动预览功能
})();
