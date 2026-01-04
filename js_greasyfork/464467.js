// ==UserScript==
// @name         豆瓣读书同步到Notion
// @namespace    https://greasyfork.org/zh-CN/scripts/464467-%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E5%90%8C%E6%AD%A5%E5%88%B0notion
// @version      1.8
// @description  抓取豆瓣读书信息，基于Notion搭建私人图书管理系统
// @author       @Yanwudong
// @match        https://book.douban.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/464467/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E5%90%8C%E6%AD%A5%E5%88%B0Notion.user.js
// @updateURL https://update.greasyfork.org/scripts/464467/%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E5%90%8C%E6%AD%A5%E5%88%B0Notion.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // =========================
    // 样式（修复了若干小 typo）
    // =========================
    GM_addStyle(`
  .toast {
    position: fixed;
    top: 150px;
    right: 50%;
    transform: translateX(50%);
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
  }
  .toast.show { opacity: 1; }
  .toast-body{
    background-color: #f2f8f2;
    color:#4f946e;
    padding: 8px 12px;
    box-shadow: 0 0 10px rgba(0,0,0,0.15);
    border-radius:4px;
  }
  #nlog {
    top: 130px;
    right: 50%;
    transform: translateX(50%);
    z-index: 9999;
    opacity: 0;
    transition: opacity 0.2s ease-in-out;
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
    background: #ffffff;
    overflow: hidden;
    padding: 28px 28px 20px;
    position: fixed;
    display : none; /* 默认隐藏 */
    border-radius:8px;
    width: 360px;
    border: 1px solid #e5e5e5;
  }
  .modal-footer button{
    height: 36px;
    width: auto;
    margin-bottom: 0;
    flex: 1;
  }
  #nlog.show { opacity: 1; }
  .form-group{ margin-bottom: 10px; }
  .form-control{ border: 1px solid #e4e6e5; border-radius: 3px; box-sizing: border-box; font-size: 13px; padding: 8px; width: 100%; }
  #exampleModalLabel{ cursor: default; font-size: 18px; line-height: 1.8; text-align: center; color: #333; font-weight: 600; margin-bottom:18px; border-bottom: 1px solid #e5e5e5; padding-bottom: 6px; }
  #saveBtn{ background-color: #41ac52; border: 1px solid #41ac52; color: #fff; cursor: pointer; font-size: 14px; font-weight: 600; width: 100%; border-radius: 3px; box-shadow: none; text-align:center; }
  #saveBtn:hover{ background-color: #41ac52; border-color:#41ac52; color:#fff; cursor:pointer; }
  #cancelBtn{ border: 1px solid #e5e5e5; background:#fff; color:#666; font-size:13px; border-radius:3px; cursor:pointer; }
  #cancelBtn:hover{ background:#fff; border-color:#e5e5e5; color:#666; cursor:pointer; }
  .modal-footer{ display:flex; justify-content:space-between; align-items:center; margin-top:14px; gap:10px; }
  #resetBtn{ border: 1px solid #e5e5e5; background:#fafafa; color:#666; cursor:pointer; font-size:12px; padding:6px 10px; border-radius:3px; margin-left:8px; }
  .modal-bottom{ margin-top:14px; font-size:12px; text-align:center; color:#999; }
  .modal-bottom a{ color:#41ac52; margin:0 6px; text-decoration:none; cursor:pointer; }
  .modal-bottom a:hover{ text-decoration:underline; color:#41ac52; }
  #twitter{ margin-left:8px; }
  #syncbt { display: inline-block; margin-left: 10px; font-size: 13px; color:#4f946e; background-color: #f2f8f2; padding: 2px 8px; border: 1px solid #b9dcd0; border-radius:3px }
  #syncbt:hover { cursor: pointer; }
  #resetInlineBtn { display:inline-block; margin-left: 6px; font-size: 12px; color:#999; background-color:#f7f7f7; padding: 1px 6px; border: 1px solid #ddd; border-radius:3px; }
  #resetInlineBtn:hover { cursor:pointer; background-color:#f0f0f0; }
`);

    // =========================
    // DOM 模板
    // =========================
    const modalHtml = `
  <div>
    <div id="exampleModalLabel">Notion API 设置</div>
    <div>
      <div class="form-group"><input type="text" class="form-control" id="apiInput" placeholder="密钥 Notion Secret"/></div>
      <div class="form-group"><input type="text" class="form-control" id="databaseIdInput" placeholder="数据库 Database ID"/></div>
      <div class="modal-footer">
        <button type="button" id="saveBtn">保存</button>
        <button type="button" id="cancelBtn">取消</button>
      </div>
      <div class="modal-bottom">
        <a href="https://seemly-pear-9fc.notion.site/Notion-e0ae1a1d391143abb9ff383730649149" id="refBtn" target="_blank">操作说明</a>
        <a href="https://twitter.com/yanwudong" id="twitter" target="_blank">Twitter</a>
      </div>
    </div>
  </div>
`;


    // 创建轻提示框
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.innerHTML = `<div class="toast-body"></div>`;
    document.body.appendChild(toast);

    // 创建设置框（默认隐藏）
    const nlog = document.createElement('div');
    nlog.id = 'nlog';
    nlog.innerHTML = modalHtml;
    document.body.appendChild(nlog);

    // =========================
    // 读取配置
    // =========================
    let nToken = GM_getValue('nToken') || '';
    let databaseId = GM_getValue('databaseId') || '';
    // Notion 数据库当前的 title 字段名（默认期望为“书名”，但会自动适配已有数据库）
    let titlePropertyName = '书名';
    const notionVersion = '2022-06-28';

    // pendingSync 标记：用于在用户保存设置后继续上次触发的同步操作
    let pendingSync = false;

    // =========================
    // 帮助函数：显示提示
    // =========================
    function showToast(text, ms = 3000) {
        toast.querySelector('.toast-body').innerText = text;
        toast.classList.add('show');
        clearTimeout(toast._t);
        toast._t = setTimeout(() => toast.classList.remove('show'), ms);
    }

    // =========================
    // 获取书籍信息（兼容旧版逻辑，确保作者/出版社等抓取正确）
    // =========================
    function getBookInfo() {
        const infos = document.querySelectorAll('#info .pl');
        const book = {};

        const titleEl = document.querySelector('#wrapper > h1 > span');
        if (titleEl) book['书名'] = titleEl.innerText.trim();
        const coverEl = document.querySelector('#mainpic > a > img');
        if (coverEl) book['封面'] = coverEl.src;
        const ratingEl = document.querySelector('.rating_num');
        if (ratingEl) book['豆瓣评分'] = ratingEl.innerText.trim();
        book['豆瓣链接'] = window.location.href;

        for (const info of infos) {
            const label = (info.innerText || '').trim();
            if (label === '作者') {
                const node = info.nextSibling && info.nextSibling.nextSibling;
                book['作者'] = node && node.innerText ? node.innerText.trim() : '';
            } else if (label === '出版社:') {
                const node = info.nextSibling && info.nextSibling.nextSibling;
                book['出版社'] = node && node.innerText ? node.innerText.trim() : '';
            } else if (label === '丛书:') {
                const node = info.nextSibling && info.nextSibling.nextSibling;
                book['丛书'] = node && node.innerText ? node.innerText.trim() : '';
            } else {
                const key = label.substr(0, label.length - 1);
                const valueNode = info.nextSibling;
                const raw = valueNode && (valueNode.data || valueNode.textContent) ? valueNode.data || valueNode.textContent : '';
                book[key] = (raw || '').trim();
            }
        }

        if (book['页数']) {
            book['页数'] = String(book['页数']).replace(/[^0-9]/g, '');
        }

        return book;
    }

    // =========================
    // Notion 请求封装（返回 Promise）
    // =========================
    function notionRequest(url, method = 'GET', body = null) {
        return new Promise((resolve, reject) => {
            const headers = {
                'Notion-Version': notionVersion,
                'Authorization': 'Bearer ' + nToken,
                'Content-Type': 'application/json'
            };
            GM_xmlhttpRequest({
                method: method,
                url: url,
                headers: headers,
                data: body ? JSON.stringify(body) : null,
                onload: function(resp) {
                    try {
                        const json = JSON.parse(resp.responseText);
                        if (json && json.object === 'error') reject(json);
                        else resolve(json);
                    } catch (e) {
                        reject({ message: 'Invalid JSON response', raw: resp.responseText });
                    }
                },
                onerror: function(err) {
                    reject(err);
                }
            });
        });
    }

    // =========================
    // 更新数据库属性：确保字段满足书籍结构
    // 需要用户先在 Notion 中手工创建数据库，并填入 databaseId
    // 会自动检测现有 title / select / multi_select 字段，避免报错
    // =========================
    async function ensureDatabaseSchema() {
        let dbMeta = null;
        // 先获取数据库当前结构，找出现有的 title 字段
        try {
            dbMeta = await notionRequest('https://api.notion.com/v1/databases/' + databaseId, 'GET');
            if (dbMeta && dbMeta.properties) {
                for (const name in dbMeta.properties) {
                    const prop = dbMeta.properties[name];
                    if (prop && prop.type === 'title') {
                        titlePropertyName = name || '书名';
                        break;
                    }
                }
            }
        } catch (e) {
            // 获取失败时保留默认的 titlePropertyName，不中断后续 PATCH
            console.warn('获取数据库结构失败，将继续尝试更新字段', e);
        }

        const existingProps = (dbMeta && dbMeta.properties) || {};
        const properties = {};

        // 只在字段不存在时，才创建带选项的 标签 / 状态 / 评价（原「打分」）
        if (!existingProps['标签'] || existingProps['标签'].type !== 'multi_select') {
            properties['标签'] = {
                multi_select: {
                    options: [
                        { name: '运营', color: 'purple' },
                        { name: '文学', color: 'orange' },
                        { name: '流行', color: 'green' },
                        { name: '生活', color: 'default' },
                        { name: '经管', color: 'yellow' },
                        { name: '科技', color: 'blue' },
                        { name: '文化', color: 'red' }
                    ]
                }
            };
        }
        if (!existingProps['状态'] || existingProps['状态'].type !== 'select') {
            properties['状态'] = {
                select: {
                    options: [
                        { name: '🌑想读', color: 'purple' },
                        { name: '🌒在读', color: 'orange' },
                        { name: '🌕读过', color: 'green' }
                    ]
                }
            };
        }
        if (!existingProps['评价'] || existingProps['评价'].type !== 'select') {
            properties['评价'] = {
                select: {
                    options: [
                        { name: '⭐️⭐️⭐️⭐️⭐️' },
                        { name: '⭐️⭐️⭐️⭐️' },
                        { name: '⭐️⭐️⭐️' },
                        { name: '⭐️⭐️' },
                        { name: '⭐️' }
                    ]
                }
            };
        }

        // 其他字段，如果不存在则补上相应类型（不存在就创建，存在则尊重现有结构）
        if (!existingProps['作者']) properties['作者'] = { rich_text: {} };
        if (!existingProps['豆瓣评分']) properties['豆瓣评分'] = { number: { format: 'number' } };
        if (!existingProps['封面']) properties['封面'] = { files: {} };
        if (!existingProps['备注']) properties['备注'] = { rich_text: {} };
        // 兼容旧字段，必要时仍补上
        if (!existingProps['出版社']) properties['出版社'] = { rich_text: {} };
        if (!existingProps['出版年月']) properties['出版年月'] = { rich_text: {} };
        if (!existingProps['页数']) properties['页数'] = { number: { format: 'number' } };
        if (!existingProps['ISBN']) properties['ISBN'] = { rich_text: {} };
        if (!existingProps['豆瓣链接']) properties['豆瓣链接'] = { url: {} };

        // 只有在数据库本身没有别的 title 字段、且 titlePropertyName 仍为“书名”时，才尝试创建新的 title 字段
        if (titlePropertyName === '书名' && !existingProps['书名']) {
            properties['书名'] = { title: {} };
        }

        // 如果没有需要更新的字段，就不发 PATCH
        if (Object.keys(properties).length === 0) {
            return dbMeta;
        }

        const body = { properties };
        return notionRequest('https://api.notion.com/v1/databases/' + databaseId, 'PATCH', body);
    }

    // =========================
    // 创建条目并提示
    // =========================
    function createItem(book) {
        const properties = {
            // 1. 书名（title）
            [titlePropertyName]: { title: [{ type: 'text', text: { content: book['书名'] || '' } }] },
            // 2. 作者
            '作者': { rich_text: [{ type: 'text', text: { content: book['作者'] || '' } }] },
            // 3. 豆瓣评分（数字）
            '豆瓣评分': { number: book['豆瓣评分'] ? parseFloat(book['豆瓣评分']) : null },
            // 4. 封面
            '封面': { files: [{ type: 'external', name: 'cover', external: { url: book['封面'] || '' } }] },
            // 5. 评价（个人打分，默认五星）
            '评价': { select: { name: '⭐️⭐️⭐️⭐️⭐️' } },
            // 6. 标签（默认 流行 + 文学）
            '标签': {
                multi_select: [
                    { name: '流行' },
                    { name: '文学' }
                ]
            },
            // 7. 状态（默认 想读）
            '状态': { select: { name: '🌑想读' } },
            // 8. 备注
            '备注': { rich_text: [] },
            // 其他保留字段
            'ISBN': { rich_text: [{ type: 'text', text: { content: book['ISBN'] || '' } }] },
            '页数': { number: book['页数'] ? parseInt(book['页数']) : null },
            '出版社': { rich_text: [{ type: 'text', text: { content: book['出版社'] || '' } }] },
            '出版年月': { rich_text: [{ type: 'text', text: { content: book['出版年'] || '' } }] },
            '豆瓣链接': { url: book['豆瓣链接'] }
        };

        const body = {
            parent: { type: 'database_id', database_id: databaseId },
            icon: { type: 'emoji', emoji: '📔' },
            properties
        };
        return notionRequest('https://api.notion.com/v1/pages', 'POST', body)
            .then(res => {
                showToast('同步成功！');
                return res;
            });
    }

    // =========================
    // 同步主流程：如果没有 databaseId，会先要求配置；有的话先更新数据库结构
    // =========================
    async function syncToNotion() {
        if (!nToken || !databaseId) {
            // 如果没有 api 或 database id，展示设置窗口并标记 pending
            pendingSync = true;
            showSettings();
            return;
        }
        try {
            showToast('正在检查/更新 Notion 数据库结构...');
            await ensureDatabaseSchema();
            const book = getBookInfo();
            await createItem(book);
        } catch (err) {
            console.error('notion error', err);
            const msg = (err && err.message) ? err.message : '同步失败，请查看控制台';
            showToast(msg);
        }
    }

    // =========================
    // 显示/隐藏 设置窗口
    // =========================
    function showSettings() {
        // 填充已有值
        const apiInput = document.getElementById('apiInput');
        const databaseIdInput = document.getElementById('databaseIdInput');
        if (apiInput) apiInput.value = nToken || '';
        if (databaseIdInput) databaseIdInput.value = databaseId || '';
        nlog.style.display = 'block';
        setTimeout(() => nlog.classList.add('show'), 10);
    }
    function hideSettings() {
        nlog.classList.remove('show');
        setTimeout(() => nlog.style.display = 'none', 200);
    }

    // =========================
    // 绑定设置窗口事件
    // =========================
    $(document).ready(function() {
        // 保存按钮
        $(document).on('click', '#saveBtn', async function() {
            const apiVal = $('#apiInput').val().trim();
            const dbVal = $('#databaseIdInput').val().trim();
            if (!apiVal || !dbVal) {
                showToast('请填写 Token 和 Database ID');
                return;
            }
            nToken = apiVal;
            GM_setValue('nToken', nToken);
            databaseId = dbVal;
            GM_setValue('databaseId', databaseId);

            hideSettings();
            try {
                // 更新数据库结构并在成功后如果 pendingSync 则继续同步
                await ensureDatabaseSchema();
                showToast('配置已保存并更新数据库字段');
                if (pendingSync) {
                    pendingSync = false;
                    await syncToNotion();
                }
            } catch (err) {
                console.error(err);
                showToast('更新数据库字段失败，请检查 Token 与 Database ID');
            }
        });

        // 取消
        $(document).on('click', '#cancelBtn', function() {
            pendingSync = false;
            hideSettings();
        });

        // 重置配置：清空本地存储的 Token 与 DatabaseId，并清空输入框
        $(document).on('click', '#resetBtn', function() {
            GM_setValue('nToken', '');
            GM_setValue('databaseId', '');
            nToken = '';
            databaseId = '';
            const apiInput = document.getElementById('apiInput');
            const databaseIdInput = document.getElementById('databaseIdInput');
            if (apiInput) apiInput.value = '';
            if (databaseIdInput) databaseIdInput.value = '';
            showToast('已重置配置，请重新填写 Token 和 Database ID');
        });
    });

    // =========================
    // 添加「同步到Notion」按钮（不立即执行）
    // =========================
    function addButton() {
        const titleSpan = document.querySelector('#wrapper > h1 > span');
        if (!titleSpan) return;
        // 如果按钮已存在，不重复添加
        if (document.getElementById('syncbt')) return;
        const button = document.createElement('button');
        button.id = 'syncbt';
        button.innerText = '同步到Notion';
        // 点击时：如果有配置则立即同步；否则打开设置并标记为 pending
        button.addEventListener('click', function(e) {
            if (nToken && databaseId) {
                syncToNotion();
            } else {
                pendingSync = true;
                showSettings();
            }
        });

        // 重置配置的小按钮，放在「同步到Notion」后面
        const resetInlineBtn = document.createElement('button');
        resetInlineBtn.id = 'resetInlineBtn';
        resetInlineBtn.innerText = '重置';
        resetInlineBtn.addEventListener('click', function () {
            GM_setValue('nToken', '');
            GM_setValue('databaseId', '');
            nToken = '';
            databaseId = '';
            showToast('已重置配置，将打开设置重新填写');
            pendingSync = false;
            showSettings();
        });

        titleSpan.insertAdjacentElement('afterend', resetInlineBtn);
        resetInlineBtn.insertAdjacentElement('beforebegin', button);
    }

    // 页面加载后插入按钮
    window.addEventListener('load', function() {
        addButton();
    });

})();
