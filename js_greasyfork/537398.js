// ==UserScript==
// @name         一键导出Cookies
// @namespace    http://tampermonkey.net/
// @version      1.2.0
// @description  获取当前网页的Cookies，一键复制到剪贴板
// @author       zskfree
// @match        http://*/*
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_setClipboard
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/537398/%E4%B8%80%E9%94%AE%E5%AF%BC%E5%87%BACookies.user.js
// @updateURL https://update.greasyfork.org/scripts/537398/%E4%B8%80%E9%94%AE%E5%AF%BC%E5%87%BACookies.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 显示临时提示
    function showTip(message, success = true) {
        const tip = document.createElement('div');
        Object.assign(tip.style, {
            position: 'fixed',
            bottom: '60px',
            right: '15px',
            zIndex: '10001',
            padding: '8px 12px',
            backgroundColor: success ? '#4CAF50' : '#f44336',
            color: 'white',
            borderRadius: '4px',
            fontSize: '14px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
            opacity: '0',
            transition: 'opacity 0.3s'
        });
        tip.textContent = message;
        document.body.appendChild(tip);

        setTimeout(() => tip.style.opacity = '1', 10);
        setTimeout(() => {
            tip.style.opacity = '0';
            setTimeout(() => tip.remove(), 300);
        }, 2000);
    }

    // 创建导出按钮
    const btn = document.createElement('button');
    Object.assign(btn.style, {
        position: 'fixed',
        bottom: '15px',
        right: '15px',
        zIndex: '10000',
        width: '35px',
        height: '35px',
        borderRadius: '50%',
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        color: 'white',
        border: 'none',
        fontSize: '20px',
        cursor: 'pointer',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '0 2px 5px rgba(0,0,0,0.2)',
        transition: 'background-color 0.3s'
    });
    btn.textContent = '🍪';
    btn.title = '导出并复制Cookies';

    btn.onmouseenter = () => btn.style.backgroundColor = 'rgba(0, 0, 0, 0.6)';
    btn.onmouseleave = () => btn.style.backgroundColor = 'rgba(0, 0, 0, 0.4)';

    btn.onclick = () => {
        const cookies = document.cookie;
        if (cookies) {
            try {
                GM_setClipboard(cookies);
                showTip('✓ 已复制 Cookies');
            } catch (err) {
                showTip('✗ 复制失败', false);
            }
        } else {
            showTip('✗ 当前页面无 Cookies', false);
        }
    };

    document.body.appendChild(btn);
})();