// ==UserScript==
// @name           「繁簡自由切換」用語整合器
// @description    為「繁簡自由切換」（24300）不同來源的自訂簡繁用語列表提供更方便的整合方式
// @name:zh-Hans   “简繁自由切换”用语集成器
// @description:zh-Hans 为「简繁自由切换」（24300）不同来源的自定义简繁术语列表提供更便捷的整合方式
// @name:en        "Switch Traditional Chinese and Simplified Chinese" Terminology Integrator
// @description:en Provides a more convenient way to integrate customized Traditional-Simplified terminology lists from different sources for "Switch Traditional Chinese and Simplified Chinese" (24300)
// @name:ja        「簡繁切替」用語統合ツール
// @description:ja 「簡繁切替」（24300）の異なるソースからのカスタム繁簡用語リストをより便利に統合する方法を提供します

// @author      Max
// @namespace   https://github.com/Max46656
// @license     MPL2.0

// @match       https://greasyfork.org/zh-TW/scripts/24300-%E7%B9%81%E7%B0%A1%E8%87%AA%E7%94%B1%E5%88%87%E6%8F%9B*
// @version     1.0.0
// @grant       GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/536953/%E3%80%8C%E7%B9%81%E7%B0%A1%E8%87%AA%E7%94%B1%E5%88%87%E6%8F%9B%E3%80%8D%E7%94%A8%E8%AA%9E%E6%95%B4%E5%90%88%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/536953/%E3%80%8C%E7%B9%81%E7%B0%A1%E8%87%AA%E7%94%B1%E5%88%87%E6%8F%9B%E3%80%8D%E7%94%A8%E8%AA%9E%E6%95%B4%E5%90%88%E5%99%A8.meta.js
// ==/UserScript==

class JsonMerger {
    constructor() {
        this.windowDiv = null;
        this.init();
    }

    init() {
        this.createFloatingWindow();
        this.bindEvents();
    }

    createFloatingWindow() {
        this.windowDiv = document.createElement('div');
        this.windowDiv.id = 'mergeJson';
        const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        Object.assign(this.windowDiv.style, {
            position: 'fixed',
            top: '2px',
            right: '2px',
            zIndex: '9999',
            background: isDarkMode ? '#333' : '#eee',
            color: isDarkMode ? '#eee' : '#333',
            border: `1px solid ${isDarkMode ? '#333' : '#eee'}`,
            padding: '10px'
        });
        this.windowDiv.innerHTML = `
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin: 0;">簡繁用語整合器</h3>
                        <button id="closeBtn" style="cursor: pointer;">✕</button>
                    </div>
                    <textarea id="json1" placeholder="輸入第一個 JSON" rows="2" cols="30"></textarea><br><br>
                    <textarea id="json2" placeholder="輸入第二個 JSON" rows="2" cols="30"></textarea><br><br>
                    <button id="mergeBtn">融合並複製</button>
                    <strong id="status"></strong>
                `;
                document.body.appendChild(this.windowDiv);
            }

        mergeJsonArrays(json1, json2) {
            try {
                const obj1 = JSON.parse(json1);
                const obj2 = JSON.parse(json2);
                const merged = {};

                for (const key in obj1) {
                    if (obj1.hasOwnProperty(key)) {
                        merged[key] = { ...obj1[key] };
                    }
                }

                for (const key in obj2) {
                    if (obj2.hasOwnProperty(key)) {
                        merged[key] = merged[key]
                            ? { ...merged[key], ...obj2[key] }
                        : { ...obj2[key] };
                    }
                }

                return JSON.stringify(merged, null, 2);
            } catch (e) {
                return '錯誤：無效的 JSON 格式';
            }
        }

        bindEvents() {
            const closeBtn = this.windowDiv.querySelector('#closeBtn');
            const mergeBtn = this.windowDiv.querySelector('#mergeBtn');

            closeBtn.addEventListener('click', () => {
                this.windowDiv.remove();
            });

            mergeBtn.addEventListener('click', () => {
                const json1 = this.windowDiv.querySelector('#json1').value;
                const json2 = this.windowDiv.querySelector('#json2').value;
                const status = this.windowDiv.querySelector('#status');

                if (!json1 || !json2) {
                    status.textContent = '請輸入兩個 JSON 陣列';
                    return;
                }

                const result = this.mergeJsonArrays(json1, json2);

                if (result.startsWith('錯誤')) {
                    status.textContent = result;
                } else {
                    GM_setClipboard(result);
                    status.textContent = '已複製到剪貼版！';
                }
            });
        }
    }

new JsonMerger();
