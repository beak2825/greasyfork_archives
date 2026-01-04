// ==UserScript==
// @name         知乎屏蔽词管理器
// @namespace    http://tampermonkey.net/
// @version      1.0.8
// @description  页面内管理屏蔽词 + 导入/导出 + 累计/本次屏蔽统计 + 可查看屏蔽列表，性能飞起，无需改脚本操作
// @author       You
// @match        https://www.zhihu.com/*
// @grant        GM_getValue
// @grant        GM_setValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/542908/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E8%AF%8D%E7%AE%A1%E7%90%86%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/542908/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E8%AF%8D%E7%AE%A1%E7%90%86%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ITEM_SEL  = '.ContentItem';
    const TITLE_SEL = '.ContentItem-title a';

    let keywords = [];
    let sessionCount = 0;
    let totalCount = 0;
    const blockedItems = [];
    const seen = new WeakSet();

    // 载入词库 & 累计数
    async function loadConfig() {
        const storedList = await GM_getValue('BLOCK_KEYWORDS', []);
        keywords = Array.isArray(storedList) ? storedList : [];
        totalCount = Number(await GM_getValue('BLOCKED_TOTAL', 0));
    }
    // 保存累计数
    async function saveTotal(count) {
        await GM_setValue('BLOCKED_TOTAL', count);
    }
    async function saveKeywords(list) {
        await GM_setValue('BLOCK_KEYWORDS', list);
        keywords = list;
        resetAll();
    }

    function resetAll() {
        sessionCount = 0;
        blockedItems.length = 0;
        document.querySelectorAll(ITEM_SEL).forEach(el => {
            el.style.display = '';
            seen.delete(el);
            io.observe(el);
        });
        updateButtons();
    }

    // UI 按钮区
    const ui = document.createElement('div');
    Object.assign(ui.style, {
        position: 'fixed', bottom: '20px', right: '20px',
        zIndex: 10000, display: 'flex', flexDirection: 'column', gap: '6px',
        fontSize: '12px', fontFamily: 'sans-serif'
    });
    document.body.appendChild(ui);

    // 累计 / 本次 屏蔽按钮
    const countBtn = document.createElement('div');
    Object.assign(countBtn.style, {
        background: 'rgba(0,0,0,0.6)', color: '#fff',
        padding: '6px 10px', borderRadius: '4px',
        cursor: 'pointer', userSelect: 'none',
    });
    countBtn.title = '点击查看本次 & 历史屏蔽列表';
    ui.appendChild(countBtn);
    countBtn.addEventListener('click', showBlockedList);

    // 管理按钮
    const manageBtn = document.createElement('div');
    Object.assign(manageBtn.style, {
        background: 'rgba(0,0,0,0.6)', color: '#fff',
        padding: '6px 10px', borderRadius: '4px',
        cursor: 'pointer', userSelect: 'none'
    });
    manageBtn.textContent = '⚙️ 管理';
    manageBtn.title = '点击管理屏蔽词';
    ui.appendChild(manageBtn);
    manageBtn.addEventListener('click', showKeywordPanel);

    function updateButtons() {
        countBtn.textContent = `累计屏蔽 ${totalCount} 条 ／ 本次 ${sessionCount} 条`;
    }

    // 屏蔽逻辑
    function tryHide(el) {
        if (seen.has(el)) return;
        seen.add(el);
        const a = el.querySelector(TITLE_SEL);
        if (!a) return;
        const txt = a.textContent.trim();
        if (keywords.some(k => txt.includes(k))) {
            el.style.display = 'none';
            sessionCount++;
            totalCount++;
            saveTotal(totalCount);
            blockedItems.push({ title: txt, href: a.href });
            updateButtons();
        }
    }

    // IntersectionObserver 性能方案
    const io = new IntersectionObserver(entries => {
        entries.forEach(ent => {
            if (ent.isIntersecting) {
                tryHide(ent.target);
                io.unobserve(ent.target);
            }
        });
    }, { rootMargin: '200px', threshold: 0.01 });

    // 样式
    const baseCSS = `
    .tm-mask {position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.3);z-index:9998;}
    .tm-dialog {
        position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);
        background:#fff;padding:20px;border-radius:8px;
        box-shadow:0 2px 10px rgba(0,0,0,0.2);
        z-index:9999;max-width:80%;max-height:80%;overflow:auto;
        font-size:14px;font-family:sans-serif;
    }
    .tm-dialog h3 {margin-top:0;font-size:16px;}
    .tm-dialog textarea {width:100%;box-sizing:border-box;margin:10px 0;font-family:monospace;}
    .tm-dialog .btns {text-align:right;margin-top:10px;}
    .tm-dialog button {margin-left:8px;padding:6px 12px;border:none;border-radius:4px;cursor:pointer;}
    .tm-dialog input[type=file] {display:none;}
    `;
    function appendStyle() {
        if (document.getElementById('tm-base-style')) return;
        const style = document.createElement('style');
        style.id = 'tm-base-style';
        style.textContent = baseCSS;
        document.head.appendChild(style);
    }

    // 查看列表（本次+累计）
    function showBlockedList() {
        if (document.getElementById('tm-blocker-list')) return;
        const panel = document.createElement('div');
        panel.id = 'tm-blocker-list';
        panel.innerHTML = `
            <div class="tm-mask"></div>
            <div class="tm-dialog">
                <h3>累计屏蔽 ${totalCount} 条 ／ 本次 ${sessionCount} 条</h3>
                <ul style="list-style:none;padding:0;margin:10px 0;">
                  ${blockedItems.length
                    ? blockedItems.map(item =>
                        `<li style="margin-bottom:6px;">
                           <a href="${item.href}" target="_blank" style="color:#337ab7;text-decoration:none;">
                             ${item.title}
                           </a>
                        </li>`
                      ).join('')
                    : '<li>本次暂无屏蔽记录</li>'}
                </ul>
                <div class="btns">
                  <button id="tm-close-list">关闭</button>
                </div>
            </div>`;
        document.body.appendChild(panel);
        appendStyle();
        panel.querySelector('#tm-close-list').onclick = () => panel.remove();
    }

    // 管理面板（导入/导出/保存/取消）
    function showKeywordPanel() {
        if (document.getElementById('tm-keyword-panel')) return;
        const panel = document.createElement('div');
        panel.id = 'tm-keyword-panel';
        panel.innerHTML = `
            <div class="tm-mask"></div>
            <div class="tm-dialog">
                <h3>🛠 屏蔽词管理</h3>
                <textarea rows="10" placeholder="一行一个词">${keywords.join('\n')}</textarea>
                <div class="btns">
                    <button data-act="import">导入</button>
                    <button data-act="export">导出</button>
                    <button data-act="save">保存</button>
                    <button data-act="cancel">取消</button>
                </div>
                <input type="file" id="tm-import-file" accept=".json,.txt">
            </div>`;
        document.body.appendChild(panel);
        appendStyle();

        const textarea = panel.querySelector('textarea');
        const fileInput = panel.querySelector('#tm-import-file');

        panel.addEventListener('click', e => {
            const act = e.target.getAttribute('data-act');
            if (!act) return;
            if (act === 'save') {
                const arr = textarea.value.trim().split('\n').map(s => s.trim()).filter(Boolean);
                saveKeywords([...new Set(arr)]);
                panel.remove();
            }
            else if (act === 'cancel') {
                panel.remove();
            }
            else if (act === 'export') {
                const blob = new Blob([JSON.stringify(keywords, null, 2)], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a   = document.createElement('a');
                a.href    = url;
                a.download= 'blocked_keywords.json';
                a.click();
                URL.revokeObjectURL(url);
            }
            else if (act === 'import') {
                fileInput.click();
            }
        });

        fileInput.addEventListener('change', e => {
            const file = e.target.files[0];
            if (!file) return;
            const reader = new FileReader();
            reader.onload = evt => {
                let arr;
                try {
                    const obj = JSON.parse(evt.target.result);
                    if (Array.isArray(obj)) arr = obj.map(String);
                } catch {
                    arr = evt.target.result.split('\n').map(s => s.trim()).filter(Boolean);
                }
                if (arr) saveKeywords([...new Set(arr)]);
                panel.remove();
            };
            reader.readAsText(file);
        });
    }

    // 启动
    (async function init() {
        await loadConfig();
        document.querySelectorAll(ITEM_SEL).forEach(el => io.observe(el));
        updateButtons();
        new MutationObserver(muts => {
            muts.forEach(m => {
                m.addedNodes.forEach(node => {
                    if (node.nodeType === 1) {
                        if (node.matches(ITEM_SEL)) io.observe(node);
                        else node.querySelectorAll(ITEM_SEL).forEach(el => io.observe(el));
                    }
                });
            });
        }).observe(document.body, { childList: true, subtree: true });
    })();

})();
