// ==UserScript==
// @name         豆瓣电影同步到Notion
// @namespace    https://greasyfork.org/zh-CN/scripts/464467-%E8%B1%86%E7%93%A3%E8%AF%BB%E4%B9%A6%E5%90%8C%E6%AD%A5%E5%88%B0notion
// @version      1.8
// @description  抓取豆瓣电影信息，基于Notion搭建私人电影管理系统
// @author       @Yanwudong
// @match        https://movie.douban.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=douban.com
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @license      GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/477513/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E5%90%8C%E6%AD%A5%E5%88%B0Notion.user.js
// @updateURL https://update.greasyfork.org/scripts/477513/%E8%B1%86%E7%93%A3%E7%94%B5%E5%BD%B1%E5%90%8C%E6%AD%A5%E5%88%B0Notion.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // =========================
    // 样式：对齐图书脚本 + 豆瓣风格
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
  #syncbt {
    display: inline-block;
    margin-left: 10px;
    font-size: 13px;
    color:#4f946e;
    background-color: #f2f8f2;
    padding: 2px 8px;
    border: 1px solid #b9dcd0;
    border-radius:3px
  }
  #syncbt:hover { cursor: pointer; }
  #resetInlineBtn { display:inline-block; margin-left: 6px; font-size: 12px; color:#999; background-color:#f7f7f7; padding: 1px 6px; border: 1px solid #ddd; border-radius:3px; }
  #resetInlineBtn:hover { cursor:pointer; background-color:#f0f0f0; }
`);

    // =========================
    // 设置弹窗 DOM 模板
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

    // =========================
    // 轻提示与设置框
    // =========================
    const toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    toast.innerHTML = `<div class="toast-body"></div>`;
    document.body.appendChild(toast);

    const nlog = document.createElement('div');
    nlog.id = 'nlog';
    nlog.innerHTML = modalHtml;
    document.body.appendChild(nlog);

    // =========================
    // 配置与 Notion 通用参数
    // =========================
    let nToken = GM_getValue('nToken') || '';
    // 单独为电影使用一个键，避免与图书数据库冲突
    let databaseId = GM_getValue('movieDatabaseId') || '';
    const notionVersion = '2022-06-28';
    // 当前数据库中实际用于标题的属性名（默认期望为“电影名”，但会自动适配已有数据库）
    let titlePropertyName = '电影名';
    let pendingSync = false;

    function showToast(text, ms = 3000) {
        toast.querySelector('.toast-body').innerText = text;
        toast.classList.add('show');
        clearTimeout(toast._t);
        toast._t = setTimeout(() => toast.classList.remove('show'), ms);
    }

    // =========================
    // Notion 请求封装
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
    // 获取电影信息
    // =========================
    function getMovieInfo(){
        const infos = document.querySelectorAll('#info .pl');
        let movie = {};

        // 创建类型数组
        let type = '';
        let typeList = [];

        debugger
        movie['电影名'] = document.querySelector('#content > h1 > span').innerText;
        movie['封面'] = document.querySelector('#mainpic > a > img').src;
        const grade = document.querySelector('.rating_num');
        if(grade != null){
            movie['评分'] = document.querySelector('.rating_num').innerText;
        }
        movie['豆瓣链接']=window.location.href;
        movie['简介']=document.querySelector('#link-report-intra').innerText;
        debugger
        //循环遍历infos，并把每个元素赋值给info
        for(const info of infos){
            if(info.innerText === '导演'){
                movie['导演'] = info.nextSibling.nextSibling.innerText
            }else if(info.innerText === '编剧'){
                movie['编剧'] = info.nextSibling.nextSibling.innerText
            }else if(info.innerText === '主演'){
                movie['主演'] = info.nextSibling.nextSibling.innerText
            }else if(info.innerText === '上映日期:'){
                movie['上映日期'] = info.nextSibling.nextSibling.innerText
            }else if(info.innerText === '片长:'){
                movie['片长'] = info.nextSibling.nextSibling.innerText
            }else if(info.innerText === '类型:'){
                // 找到所有具有属性 "property" 且属性值为 "v:genre" 的元素
                const genreElements = document.querySelectorAll('span[property="v:genre"]');
                // 遍历每个元素，将其内容添加到数组中
                genreElements.forEach(function(element) {
                typeList.push(element.textContent.trim());
                });
                movie['类型'] = typeList
            }else{
               let prop = info.innerText.substr(0,info.innerText.length-1)
                movie[prop] = info.nextSibling.data
            }
        }
        return movie
    }

    // =========================
    // 数据库结构补全（标签 / 状态 / 评价 等）
    // =========================
    async function ensureDatabaseSchema() {
        let dbMeta = null;
        try {
            dbMeta = await notionRequest('https://api.notion.com/v1/databases/' + databaseId, 'GET');
            // 识别已有的 title 字段，避免重复创建导致 “Cannot create new title property”
            if (dbMeta && dbMeta.properties) {
                for (const name in dbMeta.properties) {
                    const prop = dbMeta.properties[name];
                    if (prop && prop.type === 'title') {
                        titlePropertyName = name || '电影名';
                        break;
                    }
                }
            }
        } catch (e) {
            console.warn('获取电影数据库结构失败，将继续尝试更新字段', e);
        }
        const existingProps = (dbMeta && dbMeta.properties) || {};
        const properties = {};

        // 状态：select
        if (!existingProps['状态'] || existingProps['状态'].type !== 'select') {
            properties['状态'] = {
                select: {
                    options: [
                        { name: '🌑想看', color: 'purple' },
                        { name: '🌒在看', color: 'orange' },
                        { name: '🌕看过', color: 'green' }
                    ]
                }
            };
        }
        // 评价：select
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

        // 其他字段若不存在则补齐
        // 只有在数据库本身没有别的 title 字段、且 titlePropertyName 仍为“电影名”时，才尝试创建新的 title 字段
        if (titlePropertyName === '电影名' && !existingProps['电影名']) {
            properties['电影名'] = { title: {} };
        }
        if (!existingProps['导演']) properties['导演'] = { rich_text: {} };
        if (!existingProps['主演']) properties['主演'] = { rich_text: {} };
        if (!existingProps['简介']) properties['简介'] = { rich_text: {} };
        if (!existingProps['上映日期']) properties['上映日期'] = { rich_text: {} };
        if (!existingProps['片长']) properties['片长'] = { number: { format: 'number' } };
        if (!existingProps['豆瓣评分']) properties['豆瓣评分'] = { number: { format: 'number' } };
        if (!existingProps['IMDb']) properties['IMDb'] = { rich_text: {} };
        if (!existingProps['封面']) properties['封面'] = { files: {} };
        if (!existingProps['豆瓣链接']) properties['豆瓣链接'] = { url: {} };
        if (!existingProps['地区']) properties['地区'] = { select: {} };
        if (!existingProps['类型']) properties['类型'] = { multi_select: {} };

        if (Object.keys(properties).length === 0) {
            return dbMeta;
        }
        const body = { properties };
        return notionRequest('https://api.notion.com/v1/databases/' + databaseId, 'PATCH', body);
    }

    // =========================
    // 创建电影条目
    // =========================
    function createMovieItem(movie) {
        const body = {
            parent: { type: 'database_id', database_id: databaseId },
            icon: { type: 'emoji', emoji: '🎞️' },
            properties: {
                [titlePropertyName]: {
                    title: [{ type: 'text', text: { content: movie['电影名'] || '' } }]
                },
                '封面': {
                    files: movie['封面']
                        ? [{
                            type: 'external',
                            name: 'cover',
                            external: { url: movie['封面'] }
                        }]
                        : []
                },
                'IMDb': {
                    rich_text: [{ type: 'text', text: { content: movie['IMDb'] || '' } }]
                },
                '片长': {
                    number: movie['片长'] ? parseInt(movie['片长']) : null
                },
                '状态': {
                    select: { name: '🌑想看' }
                },
                '评价': {
                    select: { name: '⭐️⭐️⭐️⭐️⭐️' }
                },
                '上映日期': {
                    rich_text: [{ type: 'text', text: { content: movie['上映日期'] || '' } }]
                },
                '豆瓣评分': {
                    number: movie['评分'] ? parseFloat(movie['评分']) : null
                },
                '导演': {
                    rich_text: [{ type: 'text', text: { content: movie['导演'] || '' } }]
                },
                '主演': {
                    rich_text: [{ type: 'text', text: { content: movie['主演'] || '' } }]
                },
                '简介': {
                    rich_text: [{ type: 'text', text: { content: movie['简介'] || '' } }]
                },
                '地区': {
                    select: { name: movie['制片国家/地区'] || '' }
                },
                '类型': {
                    multi_select: (movie['类型'] || []).map(tag => ({ name: tag }))
                },
                '豆瓣链接': {
                    url: movie['豆瓣链接'] || ''
                }
            }
        };

        return notionRequest('https://api.notion.com/v1/pages', 'POST', body)
            .then(res => {
                showToast('同步成功！');
                return res;
            });
    }

    // =========================
    // 同步主流程
    // =========================
    async function syncToNotion() {
        if (!nToken || !databaseId) {
            pendingSync = true;
            showSettings();
            return;
        }
        try {
            showToast('正在检查/更新 Notion 数据库结构...');
            await ensureDatabaseSchema();
            const movie = getMovieInfo();
            await createMovieItem(movie);
        } catch (err) {
            console.error('notion movie error', err);
            const msg = (err && err.message) ? err.message : '同步失败，请查看控制台';
            showToast(msg);
        }
    }

    // =========================
    // 设置窗口显示/隐藏 & 事件
    // =========================
    function showSettings() {
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

    $(document).ready(function() {
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
            GM_setValue('movieDatabaseId', databaseId);

            hideSettings();
            try {
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

        $(document).on('click', '#cancelBtn', function() {
            pendingSync = false;
            hideSettings();
        });
    });

    // =========================
    // 添加同步按钮
    // =========================
    function addButton(){
        const button = document.createElement('button');
        button.innerText = '同步到Notion';
        button.id = 'syncbt';
        button.addEventListener('click', function() {
            if (nToken && databaseId) {
                syncToNotion();
            } else {
                pendingSync = true;
                showSettings();
            }
        });

        const resetInlineBtn = document.createElement('button');
        resetInlineBtn.id = 'resetInlineBtn';
        resetInlineBtn.innerText = '重置';
        resetInlineBtn.addEventListener('click', function () {
            GM_setValue('nToken', '');
            GM_setValue('movieDatabaseId', '');
            nToken = '';
            databaseId = '';
            showToast('已重置配置，将打开设置重新填写');
            pendingSync = false;
            showSettings();
        });

        const actions = document.querySelector('#content > h1 > .year ');
        if (actions) {
            actions.insertAdjacentElement('afterend', resetInlineBtn);
            resetInlineBtn.insertAdjacentElement('beforebegin', button);
        }
    }

    addButton();
})();
