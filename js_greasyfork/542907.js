// ==UserScript==
// @name         知乎屏蔽词管理器
// @namespace    http://tampermonkey.net/
// @version      2025-07-18
// @description  给知乎推荐页加个可视化屏蔽词面板，一行一个词，想加就加，想删就删
// @author       You
// @match        https://www.zhihu.com/
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_registerMenuCommand
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542907/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E8%AF%8D%E7%AE%A1%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/542907/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E8%AF%8D%E7%AE%A1%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 默认词库
    const DEFAULT_KEYWORDS = ['男','女','父亲','小红书','为什么','评价','父母','生活费','母亲'];
    const CONTAINER_SEL = '.ContentItem';
    const TITLE_SEL     = '.ContentItem-title a';

    // debounce 工具
    function debounce(fn, wait = 200) {
        let t;
        return (...args) => {
            clearTimeout(t);
            t = setTimeout(() => fn(...args), wait);
        };
    }

    // 读写 storage
    async function loadKeywords() {
        let list = await GM_getValue('BLOCK_KEYWORDS', DEFAULT_KEYWORDS);
        return Array.isArray(list) ? list : DEFAULT_KEYWORDS;
    }
    async function saveKeywords(list) {
        await GM_setValue('BLOCK_KEYWORDS', list);
        keywords = list;
        processAll();  // 马上重新过滤
    }

    // 初始化词库
    let keywords = [];
    loadKeywords().then(list => { keywords = list });

    // 注册 Tampermonkey 菜单，点击调出面板
    GM_registerMenuCommand('🛠 管理屏蔽词', openSettings);

    // 弹窗面板
    function openSettings() {
        if (document.getElementById('tm-blocker-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'tm-blocker-panel';
        panel.innerHTML = `
            <div class="tm-mask"></div>
            <div class="tm-dialog">
                <h3>🛠 屏蔽词管理</h3>
                <textarea rows="10" placeholder="一行一个词">${keywords.join('\n')}</textarea>
                <div class="btns">
                    <button data-action="save">保存</button>
                    <button data-action="cancel">取消</button>
                </div>
            </div>
        `;
        document.body.appendChild(panel);

        // 样式
        const css = `
        #tm-blocker-panel .tm-mask {
            position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.3);z-index:9998;
        }
        #tm-blocker-panel .tm-dialog {
            position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
            background:#fff;padding:20px;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,0.2);
            z-index:9999;min-width:300px;
        }
        #tm-blocker-panel textarea {width:100%;box-sizing:border-box;margin:10px 0;}
        #tm-blocker-panel .btns {text-align:right;}
        #tm-blocker-panel button {margin-left:8px;padding:6px 12px;border:none;border-radius:4px;cursor:pointer;}
        `;
        const style = document.createElement('style');
        style.textContent = css;
        panel.appendChild(style);

        // 按钮事件
        panel.addEventListener('click', e => {
            const action = e.target.getAttribute('data-action');
            if (!action) return;
            if (action === 'save') {
                const txt = panel.querySelector('textarea').value.trim();
                const arr = txt.split('\n').map(s => s.trim()).filter(Boolean);
                saveKeywords(Array.from(new Set(arr)));
            }
            document.body.removeChild(panel);
        });
    }

    // 单条过滤逻辑
    function processItem(el) {
        const a = el.querySelector(TITLE_SEL);
        if (!a) return;
        const title = a.textContent.trim();
        if (keywords.some(k => title.includes(k))) {
            el.style.display = 'none';
        }
    }

    // 扫描所有
    const processAll = debounce(() => {
        document.querySelectorAll(CONTAINER_SEL).forEach(el => {
            processItem(el);
        });
    }, 300);

    // 首次执行
    window.addEventListener('load', processAll);

    // 观察动态加载
    const observer = new MutationObserver(muts => {
        muts.forEach(m => {
            m.addedNodes.forEach(node => {
                if (node.nodeType !== 1) return;
                if (node.matches(CONTAINER_SEL)) processItem(node);
                else node.querySelectorAll(CONTAINER_SEL).forEach(processItem);
            });
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
