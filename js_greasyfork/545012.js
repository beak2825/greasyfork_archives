// ==UserScript==
// @name         Remove ChatGPT GPT-5 Background
// @name:zh-CN   移除 ChatGPT GPT-5 渐变背景图片
// @namespace    kai.tools
// @version      0.1.1
// @description  Remove the background image from ChatGPT webpage
// @description:zh-CN  移除 ChatGPT 页面上的装饰性背景图
// @match        https://chatgpt.com/*
// @match        https://chat.openai.com/*
// @run-at       document-start
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/545012/Remove%20ChatGPT%20GPT-5%20Background.user.js
// @updateURL https://update.greasyfork.org/scripts/545012/Remove%20ChatGPT%20GPT-5%20Background.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const LOG = false;
    const log = (...a) => LOG && console.log('[BG-Remover]', ...a);

    // 提前用 CSS 隐藏，减少闪烁
    const css = `
img[src*="persistent.oaistatic.com/burrito-nux"],
img[srcset*="persistent.oaistatic.com/burrito-nux"],
source[srcset*="persistent.oaistatic.com/burrito-nux"],
picture:has(source[srcset*="persistent.oaistatic.com/burrito-nux"]),
img.absolute.inset-0.h-full.w-full[alt=""][aria-hidden="true"][src*="persistent.oaistatic.com"],
img[class*="blur-2xl"][src*="persistent.oaistatic.com"],
img[class*="opacity-50"][src*="persistent.oaistatic.com"],
img[class*="opacity-30"][src*="persistent.oaistatic.com"] { display: none !important; }
`;
    function injectCSS() {
        if (document.getElementById('bg-remover-style')) return;
        const style = document.createElement('style');
        style.id = 'bg-remover-style';
        style.textContent = css;
        document.documentElement.appendChild(style);
    }

    function removeBackgroundElements(root = document) {
        try {
            root.querySelectorAll('img[src*="persistent.oaistatic.com/burrito-nux"], img[srcset*="persistent.oaistatic.com/burrito-nux"]').forEach(img => {
                log('remove img', img.src || img.srcset);
                img.remove();
            });

            root.querySelectorAll('source[srcset*="persistent.oaistatic.com/burrito-nux"]').forEach(s => {
                log('remove source', s.srcset);
                s.remove();
            });

            root.querySelectorAll('picture').forEach(p => {
                if (p.querySelector('source[srcset*="persistent.oaistatic.com/burrito-nux"]')) {
                    log('remove picture');
                    p.remove();
                }
            });

            root.querySelectorAll('img.absolute.inset-0.h-full.w-full[alt=""][aria-hidden="true"]').forEach(img => {
                if (img.src && img.src.includes('persistent.oaistatic.com')) {
                    log('remove hero bg', img.src);
                    img.remove();
                }
            });

            root.querySelectorAll('img[class*="blur-2xl"], img[class*="opacity-50"], img[class*="opacity-30"]').forEach(img => {
                if (img.src && img.src.includes('persistent.oaistatic.com')) {
                    log('remove blur bg', img.src);
                    img.remove();
                }
            });

            // 清除通过 CSS background-image 引入的背景
            root.querySelectorAll('[style*="background"]').forEach(el => {
                const bg = getComputedStyle(el).backgroundImage;
                if (bg && bg.includes('persistent.oaistatic.com')) {
                    el.style.setProperty('background', 'none', 'important');
                    el.style.setProperty('background-image', 'none', 'important');
                    log('clear css background', bg);
                }
            });
        } catch (e) {
            console.error('BG-Remover error:', e);
        }
    }

    const observer = new MutationObserver(muts => {
        for (const m of muts) {
            if (m.addedNodes && m.addedNodes.length) {
                removeBackgroundElements(document);
                break;
            }
        }
    });

    function start() {
        injectCSS();
        removeBackgroundElements(document);
        observer.observe(document.documentElement, { childList: true, subtree: true });
        setTimeout(removeBackgroundElements, 1000);
        setTimeout(removeBackgroundElements, 3000);

        if (typeof GM_registerMenuCommand === 'function') {
            GM_registerMenuCommand('手动移除背景（ChatGPT）', () => removeBackgroundElements(document));
        }
        log('started');
    }

    if (document.readyState === 'loading') {
        start();
        document.addEventListener('DOMContentLoaded', () => {
            injectCSS();
            removeBackgroundElements(document);
        });
    } else {
        start();
    }
})();
