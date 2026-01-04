// ==UserScript==
// @name         Force same-tab links (Ctrl to open new tab)
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  强制在当前标签打开原本会新开标签/窗口的链接；按 Ctrl/Meta/Shift 或中键仍允许新标签/新窗口。
// @author       ChatGPT
// @match        *://*/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547456/Force%20same-tab%20links%20%28Ctrl%20to%20open%20new%20tab%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547456/Force%20same-tab%20links%20%28Ctrl%20to%20open%20new%20tab%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 黑名单域（在这些站点禁用脚本，示例）
    const disabledHosts = [
        // 'paypal.com',
        // 'accounts.google.com',
    ];
    if (disabledHosts.some(h => location.host.includes(h))) return;

    // 记录最后一次用户操作（用于判断是否是按住 Ctrl/Meta/Shift/中键）
    let lastUser = { ctrl:false, meta:false, shift:false, button:0, ts:0 };
    function updateLast(e){
        lastUser.ctrl = !!e.ctrlKey;
        lastUser.meta = !!e.metaKey;
        lastUser.shift = !!e.shiftKey;
        if ('button' in e) lastUser.button = e.button;
        lastUser.ts = Date.now();
    }
    document.addEventListener('mousedown', updateLast, true);
    document.addEventListener('keydown', updateLast, true);

    function userRequestedNewTab() {
        // 认为 800ms 内的用户操作有效
        if (Date.now() - lastUser.ts > 800) return false;
        return lastUser.ctrl || lastUser.meta || lastUser.shift || lastUser.button === 1;
    }

    // 拦截 <a> 的点击（优先级高，capture 阶段）
    document.addEventListener('click', function(e) {
        try {
            // 如果用户按住 Ctrl/Meta/Shift 或中键，放行（允许新标签）
            if (e.ctrlKey || e.metaKey || e.shiftKey || e.button === 1) return;

            const a = e.target.closest && e.target.closest('a[href]');
            if (!a) return;

            const href = a.getAttribute('href') || '';
            // 忽略锚点、javascript:、下载链接
            if (!href || href.startsWith('#') || href.startsWith('javascript:') || a.hasAttribute('download')) return;

            const target = (a.getAttribute('target') || '').toLowerCase();
            if (target && target !== '_self') {
                e.preventDefault();
                // 在当前页跳转（保留历史）
                location.assign(a.href);
            }
        } catch(err) {
            // ignore
        }
    }, true);

    // 覆盖 window.open（处理通过 JS 强制打开新窗口的场景）
    (function() {
        const nativeOpen = window.open;
        window.open = function(url, target, features) {
            try {
                if (!url) return nativeOpen.call(window, url, target, features);
                if (userRequestedNewTab()) {
                    return nativeOpen.call(window, url, target || '_blank', features);
                } else {
                    // 在当前窗口打开（替代新窗口）
                    location.assign(String(url));
                    return null;
                }
            } catch (err) {
                return nativeOpen.call(window, url, target, features);
            }
        };
    })();

    // 防止 <base target="_blank"> 导致所有链接新开标签
    const fixBase = () => {
        const bases = document.getElementsByTagName('base');
        for (let b of bases) {
            if (b.target && b.target.toLowerCase() === '_blank') {
                b.target = '_self';
            }
        }
    };
    fixBase();
    const mo = new MutationObserver(fixBase);
    mo.observe(document.documentElement || document, { childList: true, subtree: true });

})();
