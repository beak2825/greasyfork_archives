// ==UserScript==
// @name         Azure markdown img resize
// @namespace    http://tampermonkey.net/
// @version      1.0.1
// @description  提供按鈕將 Azure markown 中的圖片限制在一定的高度，以方便閱讀
// @author       darzz.wu@gmail.com.tw
// @match        https://kingnetrd.visualstudio.com/**
// @match        https://dev.azure.com/**
// @icon         https://www.google.com/s2/favicons?sz=64&domain=visualstudio.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/546612/Azure%20markdown%20img%20resize.user.js
// @updateURL https://update.greasyfork.org/scripts/546612/Azure%20markdown%20img%20resize.meta.js
// ==/UserScript==

(function() {
    'use strict';
    (() => {
        const TARGET_HEIGHT = 300;
        const BUTTON_TEXT = `限縮圖片高度`;
        const TEXTAREA_SELECTOR = 'textarea';

        function setNativeValue(el, value) {
            const proto = el instanceof HTMLTextAreaElement
            ? HTMLTextAreaElement.prototype
            : HTMLInputElement.prototype;
            const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set
            || Object.getOwnPropertyDescriptor(HTMLElement.prototype, 'value')?.set;
            if (setter) setter.call(el, value);
            else el.value = value;
        }

        function fireUpdateEvents(el) {
            try {
                el.dispatchEvent(new InputEvent('input', { bubbles: true }));
            } catch {
                el.dispatchEvent(new Event('input', { bubbles: true }));
            }
            el.dispatchEvent(new Event('change', { bubbles: true }));
        }

        function applyText(el, newVal) {
            const { selectionStart, selectionEnd, scrollTop } = el;
            setNativeValue(el, newVal);
            try { el.setSelectionRange(selectionStart, selectionEnd); } catch {}
            el.scrollTop = scrollTop;
            fireUpdateEvents(el);
            requestAnimationFrame(() => {
                if (el.value !== newVal) {
                    setNativeValue(el, newVal);
                    fireUpdateEvents(el);
                }
            });
        }

        function attachButtonForTextarea(ta) {
            // 跳過 aria-hidden="true" 的 textarea
            if (ta.getAttribute('aria-hidden') === 'true') return;

            if (ta.dataset.mdSizerAttached === '1') return;
            ta.dataset.mdSizerAttached = '1';

            const btn = document.createElement('button');
            btn.type = 'button';
            btn.textContent = BUTTON_TEXT;
            btn.style.margin = '6px';
            btn.style.padding = '6px 10px';
            btn.style.fontSize = '14px';
            btn.style.cursor = 'pointer';
            btn.style.background = '#15BEAE';
            btn.style.border = 'none';
            btn.style.color = 'white';
            btn.style['border-radius']= '6px';

            ta.insertAdjacentElement('afterend', btn);

            btn.addEventListener('click', () => {
                const original = ta.value;
                const next = transformMarkdownImages(original, TARGET_HEIGHT);
                if (next !== original) applyText(ta, next);
            });
        }

        function transformMarkdownImages(text, height) {
            if (!text.includes('![') || !text.includes('](')) return text;
            let i = 0, out = '', len = text.length;
            while (i < len) {
                const bang = text.indexOf('![', i);
                if (bang === -1) { out += text.slice(i); break; }
                out += text.slice(i, bang);
                const altEnd = text.indexOf('](', bang + 2);
                if (altEnd === -1) { out += text.slice(bang); break; }
                let j = altEnd + 2, depth = 1;
                while (j < len && depth > 0) {
                    const ch = text[j++];
                    if (ch === '(') depth++;
                    else if (ch === ')') depth--;
                }
                if (depth !== 0) { out += text.slice(bang, j); i = j; continue; }
                const full = text.slice(bang, j);
                const inner = text.slice(altEnd + 2, j - 1);
                const alreadySized = /\s=\s*x\d+\b/.test(inner);
                out += alreadySized ? full : full.replace(/\)\s*$/, ` =x${height})`);
                i = j;
            }
            return out;
        }

        document.querySelectorAll(TEXTAREA_SELECTOR).forEach(attachButtonForTextarea);

        const mo = new MutationObserver((muts) => {
            for (const m of muts) for (const node of m.addedNodes) {
                if (node.nodeType !== 1) continue;
                if (node.matches?.(TEXTAREA_SELECTOR)) attachButtonForTextarea(node);
                node.querySelectorAll?.(TEXTAREA_SELECTOR).forEach(attachButtonForTextarea);
            }
        });
        mo.observe(document.body, { childList: true, subtree: true });
    })();
})();