// ==UserScript==
// @name         SKU填充
// @version      0.1.8
// @description  将剪切板内容拆分多行并快速填充到SKU当中哟~
// @author       鹿秋夏
// @include      https://sell.publish.tmall.com/tmall/publish.htm?*
// @namespace none
// @downloadURL https://update.greasyfork.org/scripts/480987/SKU%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/480987/SKU%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(() => {
    "use strict";
    const injectSkuButton = () => {
        const STYLE_PROPS = [
            'width', 'height', 'margin', 'padding', 'border', 'borderRadius',
            'font', 'color', 'background', 'cursor', 'boxSizing', 'lineHeight',
            'display', 'alignItems', 'justifyContent', 'flexDirection'
        ];

        const copyStyles = (s, t) => {
            const style = getComputedStyle(s);
            STYLE_PROPS.forEach(p => t.style[p] = style[p]);
            Object.assign(t.style, {
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                lineHeight: 'normal',
                verticalAlign: 'middle',
                whiteSpace: 'nowrap'
            });
        };

        let cachedRefButton = null;

        const createActionHandlers = () => {
            const waiter = (x, t = 5e3) => new Promise((rs, rj) => {
                const check = (s = Date.now()) => setTimeout(() => {
                    const el = document.evaluate(x, document, null, 9).singleNodeValue;
                    el ? rs(el) : Date.now() - s > t ? rj(Error(`Element not found: ${x}`)) : check(s);
                }, 50);
                check();
            });

            const fillField = async (input, t) => {
                input.focus();
                input.select();
                document.execCommand('insertText', false, t);
                ['input', 'change', 'blur'].forEach(e => input.dispatchEvent(new Event(e, { bubbles: 1 })));
                Object.getOwnPropertyDescriptor(input.constructor.prototype, 'value')?.set?.call(input, t);
                await new Promise(r => setTimeout(r, 0));
            };

            return {
                fillHandler: async () => {
                    try {
                        const texts = (await navigator.clipboard.readText()).split('\n').map(l => l.trim()).filter(Boolean);
                        for (const text of texts) {
                            (await waiter('//div[@id="struct-p-1627207"]//button[contains(@class, "add")]')).click();
                            await fillField(await waiter('//input[@placeholder="主色(必选)" and @value=""]'), text);
                        }
                    } catch(e) {
                        console.error('填充操作失败:', e?.message || '未知错误');
                    }
                },
                replaceHandler: async () => {
                    try {
                        const texts = (await navigator.clipboard.readText()).split('\n').map(l => l.trim()).filter(Boolean);
                        const xpathResult = document.evaluate(
                            '//input[@placeholder="主色(必选)" and @value != ""]',
                            document,
                            null,
                            XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
                            null
                        );

                        for (let i = 0; i < Math.min(texts.length, xpathResult.snapshotLength); i++) {
                            const input = xpathResult.snapshotItem(i);
                            await fillField(input, texts[i]);
                            await new Promise(r => setTimeout(r, 50));
                        }
                    } catch(e) {
                        console.error('替换操作失败:', e?.message || '未知错误');
                    }
                }
            };
        };

        const createButton = (text, handler, refBtn) => {
            const b = document.createElement('button');
            let pressed = false;

            b.textContent = text;
            b.dataset.sku = 'true';
            copyStyles(refBtn, b);
            b.style.marginRight = getComputedStyle(refBtn).marginRight;

            const states = {
                base: {
                    backgroundColor: '#FFEBF1',
                    color: '#FF335E',
                    transition: 'all 0.3s',
                    minWidth: `${refBtn.offsetWidth}px`,
                    flexShrink: '0',
                    position: 'relative'
                },
                hover: { background: '#FFD1E0' },
                active: { background: '#FFB5C7', boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.1)' }
            };

            Object.assign(b.style, states.base);

            const isInside = (el, { clientX: x, clientY: y }) => {
                const rect = el.getBoundingClientRect();
                return x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;
            };

            const handleUp = e => {
                if (!pressed) return;
                pressed = false;
                const inside = isInside(b, e);
                inside && handler().catch(e => console.error(`${text}失败:`, e?.message || '未知错误'));
                Object.assign(b.style, inside ? states.hover : states.base);
                b.style.boxShadow = '';
            };

            Object.entries({
                mouseover: () => b.style.background = states.hover.background,
                mouseout: () => !pressed && (b.style.background = states.base.backgroundColor),
                mousedown: () => {
                    pressed = true;
                    Object.assign(b.style, states.active);
                    document.addEventListener('mouseup', handleUp, { once: true });
                }
            }).forEach(([e, f]) => b.addEventListener(e, f));

            return b;
        };

        const createSkuButtons = (c, r) => {
            if (c.querySelectorAll('[data-sku]').length >= 2) return;

            cachedRefButton = r;
            const handlers = createActionHandlers();

            const fillBtn = createButton('SKU填充', handlers.fillHandler, r);
            const replaceBtn = createButton('SKU替换', handlers.replaceHandler, r);

            const buttonsContainer = r.parentNode;
            buttonsContainer.append(fillBtn, replaceBtn);

            console.log('SKU功能已加载');
        };

        const createDialogSkuButtons = (dialog) => {
            const footer = document.evaluate(
                '//div[@class="sku-decouple-drawer-footer"]',
                dialog,
                null,
                9
            ).singleNodeValue;

            if (!footer) return;

            if (footer.querySelectorAll('[data-sku-dialog]').length >= 2) return;

            const refBtn = cachedRefButton || document.evaluate(
                '//div[@class="front"]//button[not(@data-sku)]',
                document,
                null,
                9
            ).singleNodeValue;

            if (!refBtn) return;

            const handlers = createActionHandlers();
            const refBtnMarginRight = getComputedStyle(refBtn).marginRight;

            const createDialogButton = (text, handler) => {
                const b = createButton(text, handler, refBtn);
                b.dataset.skuDialog = 'true';
                b.style.marginRight = refBtnMarginRight;
                return b;
            };

            const fillBtn = createDialogButton('SKU填充', handlers.fillHandler);
            const replaceBtn = createDialogButton('SKU替换', handlers.replaceHandler);

            let leftContainer = footer.querySelector('[data-sku-left-container]');
            if (!leftContainer) {
                leftContainer = document.createElement('div');
                leftContainer.dataset.skuLeftContainer = 'true';
                Object.assign(leftContainer.style, {
                    display: 'flex',
                    alignItems: 'center'
                });

                Object.assign(footer.style, {
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                });

                footer.insertBefore(leftContainer, footer.firstChild);
            }

            leftContainer.appendChild(fillBtn);
            leftContainer.appendChild(replaceBtn);

            console.log('Dialog SKU功能已加载');
        };

        const init = () => {
            const c = document.evaluate('//div[@class="front"]', document, null, 9).singleNodeValue;
            const r = c?.querySelector('button:not([data-sku])');
            c && r && createSkuButtons(c, r);
        };

        const initDialogObserver = () => {
            const dialogObserver = new MutationObserver(() => {
                const dialog = document.evaluate('//div[@role="dialog"]', document, null, 9).singleNodeValue;
                if (dialog) {
                    const checkFooter = setInterval(() => {
                        const footer = document.evaluate(
                            '//div[@class="sku-decouple-drawer-footer"]',
                            dialog,
                            null,
                            9
                        ).singleNodeValue;

                        if (footer) {
                            clearInterval(checkFooter);
                            createDialogSkuButtons(dialog);
                        }
                    }, 100);

                    setTimeout(() => clearInterval(checkFooter), 5000);
                }
            });

            dialogObserver.observe(document.body, { childList: true, subtree: true });

            return dialogObserver;
        };

        const start = () => {
            init();
            const timer = setInterval(() => {
                const existingButtons = document.querySelectorAll('[data-sku]');
                if (existingButtons.length < 2) init();
            }, 1e3);

            const c = document.evaluate('//div[@class="front"]', document, null, 9).singleNodeValue;

            c && (c._observer = new MutationObserver(() => {
                const existingButtons = c.querySelectorAll('[data-sku]');
                if (existingButtons.length < 2) init();
            })).observe(c, { childList: true, subtree: true });

            const dialogObserver = initDialogObserver();

            window.addEventListener('unload', () => {
                clearInterval(timer);
                c?._observer?.disconnect();
                dialogObserver?.disconnect();
            });
        };

        (function checkContainer() {
            document.evaluate('//div[@class="front"]', document, null, 9).singleNodeValue
                ? start()
                : setTimeout(checkContainer, 100);
        })();
    };

    injectSkuButton();
})();