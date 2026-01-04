// ==UserScript==
// @name         屏蔽自己的抽奖动态
// @namespace    shanmite
// @version      0.3
// @description  移除自己的抽奖动态(只是隐藏)
// @author       Shanmite
// @include      /^https?:\/\/t\.bilibili\.com\/\?/
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/415724/%E5%B1%8F%E8%94%BD%E8%87%AA%E5%B7%B1%E7%9A%84%E6%8A%BD%E5%A5%96%E5%8A%A8%E6%80%81.user.js
// @updateURL https://update.greasyfork.org/scripts/415724/%E5%B1%8F%E8%94%BD%E8%87%AA%E5%B7%B1%E7%9A%84%E6%8A%BD%E5%A5%96%E5%8A%A8%E6%80%81.meta.js
// ==/UserScript==
(async function () {
    'use strict';
    const storage = {
        /**
         * 获取本地值
         * @param {string} key
         * @returns {Promise<string>}
         */
        async get(key) {
            if (typeof GM_getValue === 'undefined') {
                return localStorage.getItem(key)
            } else {
                return await GM_getValue(key)
            }
        },
        /**
         * 存储本地值
         * @param {string} key
         * @param {string} value 
         */
        async set(key, value) {
            if (typeof GM_setValue === 'undefined') {
                localStorage.setItem(key, value);
                return;
            } else {
                await GM_setValue(key, value)
                return;
            }
        }
    }
    let uname = await storage.get('uname') || '';
    const eventBus = (() => {
        const eTarget = new EventTarget()
            , module = {
                /**
                 * 监听事件
                 * @param {string} type
                 * @param {(e: CustomEvent<string>) => void} fn
                 * @example fn:
                 * ({ detail }) => detail;
                 * (e) => e.detail
                 * @param {boolean | AddEventListenerOptions} [opt]
                 */
                on: (type, fn, opt) => {
                    eTarget.addEventListener(type, fn, opt);
                },
                /**
                 * 取消监听事件
                 * @param {string} type
                 * @param {(e: CustomEvent<string>) => void} fn 
                 * @param {boolean | AddEventListenerOptions} [opt]
                 */
                off: (type, fn, opt) => {
                    eTarget.removeEventListener(type, fn, opt);
                },
                /**
                 * 触发事件
                 * @param {string} type
                 * @param {string} [detail]
                 */
                emit: (type, detail) => {
                    const event = new CustomEvent(type, { detail });
                    eTarget.dispatchEvent(event);
                }
            }
        return module;
    })();
    /**
     * 生成一段文档片段
     * @param {
        {
            tagname: string;
            attr?: {
                [index: string]:string
            };
            script?: (el: Element) => void;
            text?: string;
            children?: DocumentFragment[];
        }
    } StructInfo
     * @returns {DocumentFragment}
     */
    function createCompleteElement(StructInfo) {
        const { tagname, attr, script, text, children } = StructInfo;
        let frg = document.createDocumentFragment();
        let el = typeof tagname === 'string' ? document.createElement(tagname) : document.createDocumentFragment();
        if (typeof text === 'string' && text !== '') el.innerHTML = text;
        if (typeof attr === 'object') {
            Object.entries(attr).forEach(([key, value]) => {
                el.setAttribute(key, value);
            })
        }
        if (typeof script === 'function') script(el);
        if (children instanceof Array) {
            children.forEach(child => {
                if (child instanceof DocumentFragment) el.appendChild(child)
            });
        }
        frg.appendChild(el);
        return frg;
    }
    document.body.appendChild(createCompleteElement({
        children: [
            createCompleteElement({
                tagname: 'button',
                attr: {
                    style: "position:fixed;z-index:99999;right:30px;top:65%;"
                },
                script: el => {
                    el.addEventListener('click', () => {
                        uname = window.prompt("请输入要屏蔽的用户名", "");
                        storage.set('uname',uname);
                    })
                },
                text: `点击输入要屏蔽的用户名`
            }),
            createCompleteElement({
                tagname: 'button',
                attr: {
                    style: "position:fixed;z-index:99999;right:30px;top:70%;"
                },
                script: el => {
                    el.innerText = `屏蔽${uname}`;
                    el.addEventListener('click', () => {
                        el.innerText = `屏蔽${uname}`;
                        eventBus.emit('clear', uname);
                    });
                },
                text: `屏蔽`,
            })
        ]
    }));
    eventBus.on('clear', ({ detail }) => {
        if (detail === '') { alert('请输入用户名'); return }
        let cards = document.querySelectorAll('div.card');
        cards.forEach(card => {
            let c_pointer = card.querySelectorAll('a.c-pointer');
            c_pointer.forEach(c => {
                c.innerText === detail ? card.parentNode.removeChild(card) : void 0;
            });
        });
    })
})();