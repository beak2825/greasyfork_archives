// ==UserScript==
// @name         iframe浮动工具按钮
// @namespace    http://tampermonkey.net/
// @version      1.5.1
// @description  在 iframe 页面右下角显示刷新与新标签打开按钮，宽度<500时自动隐藏
// @author       You
// @match        *://*/*
// @run-at       document-end
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546257/iframe%E6%B5%AE%E5%8A%A8%E5%B7%A5%E5%85%B7%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/546257/iframe%E6%B5%AE%E5%8A%A8%E5%B7%A5%E5%85%B7%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (window.self === window.top) return; // 不是 iframe，不执行

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.right = '20px';
    container.style.bottom = '20px';
    container.style.zIndex = '99999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.gap = '12px';

    // 通用按钮工厂
    function createButton(svgPath, onClick) {
        const btn = document.createElement('button');
        btn.style.width = '35px';
        btn.style.height = '35px';
        btn.style.border = 'none';
        btn.style.borderRadius = '50%';
        btn.style.background = 'rgba(0, 0, 0, 0.5)'; // 半透明黑
        btn.style.cursor = 'pointer';
        btn.style.display = 'flex';
        btn.style.alignItems = 'center';
        btn.style.justifyContent = 'center';
        btn.style.boxShadow = '0 3px 8px rgba(0,0,0,0.3)';
        btn.style.transition = 'all 0.2s ease';
        btn.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                 viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2"
                 stroke-linecap="round" stroke-linejoin="round">
                 ${svgPath}
            </svg>`;
        btn.addEventListener('mouseenter', () => {
            btn.style.background = 'rgba(0, 0, 0, 0.8)';
            btn.style.transform = 'scale(1.1)';
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'rgba(0, 0, 0, 0.5)';
            btn.style.transform = 'scale(1)';
        });
        btn.addEventListener('click', onClick);
        return btn;
    }

    // 刷新按钮（Material 风格）
    const refreshBtn = createButton(
        `<polyline points="23 4 23 10 17 10"></polyline>
         <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"></path>`,
        () => location.reload()
    );

    // 新标签页按钮
    const openBtn = createButton(
        `<path d="M14 3h7v7"></path>
         <path d="M21 3l-9 9"></path>
         <rect x="3" y="9" width="13" height="13" rx="2" ry="2"></rect>`,
        () => window.open(location.href, '_blank')
    );

    container.appendChild(refreshBtn);
    container.appendChild(openBtn);
    document.body.appendChild(container);

    // 更新显示状态
    function updateVisibility() {
        if (window.frameElement && window.frameElement.offsetWidth < 500) {
            container.style.display = 'none';
        } else {
            container.style.display = 'flex';
        }
    }

    updateVisibility();
    window.addEventListener('resize', updateVisibility);

    if (window.frameElement) {
        const resizeObserver = new ResizeObserver(updateVisibility);
        resizeObserver.observe(window.frameElement);
    }
})();
