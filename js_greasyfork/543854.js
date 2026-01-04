// ==UserScript==
// @name         微信公众号文章&粉丝导出
// @namespace    http://tampermonkey.net/
// @version      5.4
// @description  【最终版】兼容所有发布类型（群发、单发、转载等），修复了因错误跳过记录而导致导出失败的终极BUG。
// @author       Gemini & Pz (A Collaborative Debugging Masterpiece)
// @match        https://mp.weixin.qq.com/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @connect      mp.weixin.qq.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543854/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E7%B2%89%E4%B8%9D%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/543854/%E5%BE%AE%E4%BF%A1%E5%85%AC%E4%BC%97%E5%8F%B7%E6%96%87%E7%AB%A0%E7%B2%89%E4%B8%9D%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 1. 样式定义 ---
    GM_addStyle(`
        .gemini-export-btn {
            margin-left: 20px; padding: 6px 16px; font-size: 14px;
            font-weight: 400; vertical-align: middle; background-color: #07c160;
            color: white; border: none; border-radius: 5px; cursor: pointer;
            transition: all 0.3s;
        }
        .gemini-export-btn:hover { background-color: #06ad56; }
        .gemini-export-btn:disabled { background-color: #ccc; cursor: not-allowed; }
        .gemini-page-input {
            width: 54px; /* 适配“全部”两字 */
            margin-left: 8px;
            padding: 3px 6px;
            border: 1px solid #ccc;
            border-radius: 4px;
            text-align: center;
            vertical-align: middle;
            font-size: 14px;
            height: 28px;
            box-sizing: border-box;
        }
        .gemini-page-label {
            margin-left: 2px; /* 更贴合input */
            font-size: 13px;
            vertical-align: middle;
            color: #888;
            padding-right: 4px;
        }
    `);

    // --- 2. 核心功能函数 ---
    function getToken() {
        try {
            const token = new URL(window.location.href).searchParams.get('token');
            if (token) return token;
            if (window.wx && window.wx.commonData && window.wx.commonData.data && window.wx.commonData.data.t) {
                return window.wx.commonData.data.t;
            }
            return null;
        } catch (e) { return null; }
    }

    function fetchArticlePage(token, pageIndex) {
        return new Promise((resolve, reject) => {
            const begin = pageIndex * 10;
            const url = `/cgi-bin/appmsgpublish?sub=list&begin=${begin}&count=10&token=${token}&lang=zh_CN`;
            GM_xmlhttpRequest({ method: "GET", url: url, onload: r => resolve(r.responseText), onerror: reject });
        });
    }

    function extractDataFromScript(htmlText) {
        console.log('extractDataFromScript htmlText:', htmlText);
        const articles = [];
        // 1. 优先尝试 window.publish_page
        let publishPageObj = null;
        if (typeof window !== 'undefined' && window.publish_page && window.publish_page.publish_list) {
            publishPageObj = window.publish_page;
        } else {
            // 2. 退而求其次：用正则从htmlText中提取publish_page变量
            const match = htmlText.match(/publish_page\s*=\s*(\{[\s\S]*?\});/);
            if (match && match[1]) {
                try {
                    publishPageObj = JSON.parse(match[1]);
                } catch (e) {
                    // console.error('【错误】publish_page JSON解析失败', e, match[1].slice(0, 500));
                    return [];
                }
            } else {
                // console.error('【错误】未找到publish_page变量');
                return [];
            }
        }
        // 3. 遍历publish_list
        function decodeHtmlEntities(str) {
            const txt = document.createElement('textarea');
            txt.innerHTML = str;
            return txt.value;
        }
        function pad(n) { return n.toString().padStart(2, '0'); }
        (publishPageObj.publish_list || []).forEach(item => {
            // 4. 还原publish_info的HTML实体并解析
            let infoObj = null;
            try {
                let infoStr = item.publish_info;
                if (typeof infoStr === 'string') {
                    infoStr = decodeHtmlEntities(infoStr);
                    infoObj = JSON.parse(infoStr);
                } else if (typeof infoStr === 'object' && infoStr !== null) {
                    infoObj = infoStr;
                }
            } catch (e) {
                // console.error('【错误】publish_info解析失败', item.publish_info, e);
                return;
            }
            if (!infoObj || !Array.isArray(infoObj.appmsg_info) || infoObj.appmsg_info.length === 0) {
                // console.warn('appmsg_info 不是数组或为空', infoObj);
                return;
            }
            // 5. 群发时间（备用）
            let masssendTimestamp = null;
            if (infoObj.sent_info && infoObj.sent_info.time) {
                masssendTimestamp = infoObj.sent_info.time;
            } else if (infoObj.create_time) {
                masssendTimestamp = infoObj.create_time;
            }
            // 6. 导出appmsg_info中的所有文章，优先用每篇文章自己的line_info.send_time
            infoObj.appmsg_info.forEach(appmsg => {
                // console.log('【调试】appmsg:', appmsg);
                let articleTimestamp = masssendTimestamp;
                if (appmsg.line_info && typeof appmsg.line_info === 'object') {
                    let st = appmsg.line_info.send_time;
                    if (st && !isNaN(Number(st))) {
                        articleTimestamp = Number(st);
                    } else {
                        // console.warn('【调试】appmsg.line_info.send_time 无效:', st, appmsg.line_info);
                    }
                } else {
                    // console.warn('【调试】appmsg.line_info 不存在或不是对象:', appmsg.line_info);
                }
                const date = articleTimestamp ? new Date(articleTimestamp * 1000) : null;
                const formattedTime = date
                    ? `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
                    : '';
                if (!formattedTime) {
                    // console.warn('【调试】未能生成发布时间，articleTimestamp:', articleTimestamp, appmsg);
                }
                const articleObj = {
                    type: infoObj.type || '',
                    title: appmsg.title || 'N/A',
                    link: appmsg.content_url || '',
                    time: formattedTime,
                    itemidx: appmsg.itemidx || '', // 群发位置
                    album: (appmsg.appmsg_album_info && appmsg.appmsg_album_info.title) ? appmsg.appmsg_album_info.title : '', // 合集名称
                    cover: appmsg.cover || appmsg.pic_cdn_url_1_1 || '', // 封面
                    digest: appmsg.digest || '', // 摘要
                    read: appmsg.read_num || 0,
                    like: appmsg.like_num || 0,
                    comment: appmsg.comment_num || 0,
                    recommend: appmsg.old_like_num || 0,
                    share: appmsg.share_num || 0,
                    is_original: (
                        (typeof appmsg.copyright_type !== 'undefined' && appmsg.copyright_type == 1) ||
                        (typeof appmsg.copyright_status !== 'undefined' && appmsg.copyright_status == 11)
                        ? '是' : '否'
                    ) // 是否原创
                };
                articles.push(articleObj);
                // console.log('【调试】已加入articles的article对象:', articleObj);
            });
        });
        return articles;
    }

    function generateAndDownloadCSV(data) {
        if (data.length === 0) { alert('没有提取到任何文章数据！请按F12查看控制台中的【错误】信息。'); return; }
        const header = ['标题', '链接', '发布时间', '群发位置', '合集名称', '封面', '摘要', '是否原创', '阅读量', '点赞数', '评论数', '在看数', '分享数'];
        const rows = data.map(a => [
            `"${a.title.replace(/"/g, '""')}"`,
            `"${a.link}"`,
            `"${a.time}"`,
            a.itemidx,
            `"${a.album}"`,
            `"${a.cover}"`,
            `"${a.digest.replace(/"/g, '""')}"`,
            a.is_original,
            a.read,
            a.like,
            a.comment,
            a.recommend,
            a.share
        ].join(','));
        const csvContent = [header.join(','), ...rows].join('\n');
        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        const accountName = document.querySelector('.weui-desktop-account-nickname')?.textContent.trim() || '公众号';
        link.download = `${accountName}_文章数据_${new Date().toLocaleDateString()}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    // --- 新增：粉丝导出功能 ---

    // 自动分页接口获取所有粉丝数据
    async function fetchAllFollowers(token, groupid = -2, limit = 20, maxCount = Infinity) {
        let allUsers = [];
        let begin_openid = '';
        let begin_create_time = '';
        let hasMore = true;
        let groupMap = {};
        let firstGroupInfo = null;
        let totalFetched = 0;
        while (hasMore && totalFetched < maxCount) {
            const url = `https://mp.weixin.qq.com/cgi-bin/user_tag?action=get_user_list&groupid=${groupid}&begin_openid=${begin_openid}&begin_create_time=${begin_create_time}&limit=${limit}&offset=0&backfoward=1&token=${token}&lang=zh_CN&f=json&ajax=1&random=${Math.random()}`;
            const resp = await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url,
                    onload: resolve,
                    onerror: reject
                });
            });
            let data;
            try {
                data = JSON.parse(resp.responseText);
            } catch (e) {
                alert('粉丝数据解析失败！');
                break;
            }
            if (!firstGroupInfo && data.group_info && data.group_info.group_info_list) {
                firstGroupInfo = data.group_info.group_info_list;
                for (const g of firstGroupInfo) {
                    groupMap[g.group_id] = g.group_name;
                }
            }
            const users = (data.user_list && data.user_list.user_info_list) ? data.user_list.user_info_list : [];
            if (users.length === 0) break;
            allUsers.push(...users);
            totalFetched += users.length;
            const last = users[users.length - 1];
            begin_openid = last.user_openid;
            begin_create_time = last.user_create_time;
            hasMore = users.length === limit && totalFetched < maxCount;
        }
        return {allUsers, groupMap};
    }

    // 获取单个粉丝详细信息
    async function fetchFanDetail(token, openid) {
        const fingerprint = Math.random().toString(36).slice(2) + Date.now();
        const url = 'https://mp.weixin.qq.com/cgi-bin/user_tag?action=get_fans_info';
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Referer': window.location.href
                },
                data: `token=${token}&lang=zh_CN&f=json&ajax=1&fingerprint=${fingerprint}&user_openid=${encodeURIComponent(openid)}&identity_open_id=`,
                onload: r => {
                    // console.log('【详情接口返回】', r.responseText);
                    try {
                        const data = JSON.parse(r.responseText);
                        if (data && data.user_list && data.user_list.user_info_list && data.user_list.user_info_list.length > 0) {
                            resolve(data.user_list.user_info_list[0]);
                        } else {
                            resolve(null);
                        }
                    } catch (e) {
                        // console.error('【详情接口解析失败】', e, r.responseText);
                        resolve(null);
                    }
                },
                onerror: e => {
                    // console.error('【详情接口请求失败】', e);
                    reject(e);
                }
            });
        });
    }

    function formatTime(ts) {
        if (!ts) return '';
        const d = new Date(Number(ts) * 1000);
        return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0') + ' ' + String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0') + ':' + String(d.getSeconds()).padStart(2, '0');
    }

    function fenToYuan(fen) {
        if (!fen) return '0.00';
        return (Number(fen) / 100).toFixed(2);
    }

    function generateAndDownloadFollowerCSV(users, groupMap) {
        if (!users.length) { alert('没有提取到任何粉丝数据！'); return; }
        const header = ['头像URL', '昵称', '备注', '标签', '签名', '城市', '省份', '国家', '消息数', '留言数', '精选留言数', '赞赏数', '赞赏金额', '付费数', '付费金额', '关注时间', '黑名单'];
        const rows = users.map(u => [
            u.user_head_img,
            u.user_name,
            u.user_remark,
            (Array.isArray(u.user_group_id) ? u.user_group_id.map(id => groupMap[id] || id).join(';') : (groupMap[u.user_group_id] || u.user_group_id || '')),
            u.user_signature || '',
            u.user_city || '',
            u.user_province || '',
            u.user_country || '',
            u.user_msg_cnt || 0,
            u.user_comment_cnt || 0,
            u.user_selected_comment_cnt || 0,
            u.user_reward_cnt || 0,
            fenToYuan(u.user_reward_money),
            u.user_paysubscribe_count || 0,
            fenToYuan(u.user_paysubscribe_money),
            formatTime(u.user_create_time),
            u.user_in_blacklist ? '是' : '否'
        ]);
        const csv = [header, ...rows].map(row => row.map(cell => '"' + String(cell).replace(/"/g, '""') + '"').join(',')).join('\r\n');
        const blob = new Blob(['\uFEFF' + csv], {type: 'text/csv'});
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        const accountName = document.querySelector('.weui-desktop-account-nickname')?.textContent.trim() || '公众号';
        a.download = `${accountName}_粉丝数据_${new Date().toLocaleDateString()}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }

    // 恢复文章导出分页通用函数
    async function processExport(token, maxPages, type, fetchFunc, extractFunc, generateFunc) {
        let allData = [];
        let currentPage = 0;
        try {
            while (currentPage < maxPages) {
                const htmlText = await fetchFunc(token, currentPage);
                const parsedData = extractFunc(htmlText);
                if (parsedData.length === 0 && currentPage > 0) break;
                allData.push(...parsedData);
                currentPage++;
                await new Promise(res => setTimeout(res, 250));
            }
            generateFunc(allData);
        } catch (error) {
            alert(`导出${type}失败，请按 F12 查看错误信息。`);
        }
    }

    // --- 3. 主函数 ---
    function main() {
        const path = window.location.pathname;
        let titleElement, buttonText, exportFunction;

        if (path.includes('/cgi-bin/appmsgpublish')) {
            titleElement = document.querySelector('.publish_listory_title');
            buttonText = '导出文章数据';
            exportFunction = async (token, maxPages) => {
                await processExport(token, maxPages, '文章', fetchArticlePage, extractDataFromScript, generateAndDownloadCSV);
            };
        } else if (path.includes('/cgi-bin/user_tag')) {
            titleElement = document.querySelector('.weui-desktop-layout__main__hd h2');
            buttonText = '导出粉丝';
            exportFunction = async (token, maxCount, countInput) => {
                const btn = document.querySelector('.gemini-export-btn');
                btn.disabled = true;
                btn.textContent = '正在请求用户信息...';
                try {
                    const {allUsers, groupMap} = await fetchAllFollowers(token, -2, 20, maxCount);
                    if (!allUsers.length) {
                        alert('没有获取到任何粉丝数据！');
                        btn.disabled = false;
                        btn.textContent = '导出粉丝';
                        return;
                    }
                    let detailedUsers = [];
                    for (let i = 0; i < allUsers.length; i++) {
                        btn.textContent = `正在请求第${i + 1}个用户信息...`;
                        const detail = await fetchFanDetail(token, allUsers[i].user_openid);
                        const merged = detail ? {...allUsers[i], ...detail} : allUsers[i];
                        // console.log('【合并后用户数据】', JSON.stringify(merged));
                        detailedUsers.push(merged);
                        await new Promise(res => setTimeout(res, 200));
                    }
                    generateAndDownloadFollowerCSV(detailedUsers, groupMap);
                } catch (e) {
                    alert('导出失败：' + e.message);
                }
                btn.disabled = false;
                btn.textContent = '导出粉丝';
            };
        } else {
            return;
        }

        if (!titleElement || document.querySelector('.gemini-export-btn')) return;

        const container = document.createElement('span');
        titleElement.appendChild(container);

        const exportButton = document.createElement('button');
        exportButton.textContent = buttonText;
        exportButton.className = 'gemini-export-btn';

        if (path.includes('/cgi-bin/appmsgpublish')) {
            const pageInput = document.createElement('input');
            pageInput.className = 'gemini-page-input';
            pageInput.type = 'number';
            pageInput.placeholder = '全部';
            pageInput.min = '1';
            const pageLabel = document.createElement('span');
            pageLabel.className = 'gemini-page-label';
            pageLabel.textContent = '页';
            container.appendChild(exportButton);
            container.appendChild(pageInput);
            container.appendChild(pageLabel);
            exportButton.addEventListener('click', async () => {
                const token = getToken();
                if (!token) { alert('无法获取Token，请刷新页面后重试。'); return; }
                const maxPages = pageInput.value ? parseInt(pageInput.value, 10) : Infinity;
                exportButton.disabled = true;
                let currentPage = 0;
                try {
                    await processExport(token, maxPages, '文章', async (token, pageIdx) => {
                        exportButton.textContent = `正在请求第${pageIdx + 1}页文章...`;
                        return await fetchArticlePage(token, pageIdx);
                    }, extractDataFromScript, (data) => {
                        exportButton.textContent = '正在生成CSV...';
                        generateAndDownloadCSV(data);
                    });
                } catch (e) {
                    exportButton.textContent = '导出文章数据';
                    exportButton.disabled = false;
                    throw e;
                }
                exportButton.textContent = '导出文章数据';
                exportButton.disabled = false;
            });
        } else {
            // 只保留导出数量输入框
            const countInput = document.createElement('input');
            countInput.className = 'gemini-page-input';
            countInput.type = 'number';
            countInput.placeholder = '导出数量(留空为全部)';
            countInput.min = '1';
            countInput.style.width = '150px';
            countInput.style.marginLeft = '8px';
            container.appendChild(exportButton);
            container.appendChild(countInput);
            exportButton.addEventListener('click', async () => {
                const token = getToken();
                if (!token) { alert('无法获取Token，请刷新页面后重试。'); return; }
                const maxCount = countInput.value ? parseInt(countInput.value, 10) : Infinity;
                await exportFunction(token, maxCount, countInput);
            });
        }
    }

    // --- 4. 启动脚本 ---
    const observer = new MutationObserver(() => {
        const targetNode = document.querySelector('.publish_listory_title') || document.querySelector('.weui-desktop-layout__main__hd h2');
        if (targetNode) {
            main();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });

})();
