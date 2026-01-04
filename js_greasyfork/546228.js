// ==UserScript==
// @name         阿里巴巴国际站询盘聊天记录导出
// @namespace    http://tampermonkey.net/
// @version      2.0
// @license      MPL
// @description  导出阿里巴巴国际站聊天记录为Excel,接收定制和询盘导出明细一起,把聊天记录也一起放在单元格,或者帮你自动从聊天记录筛选出WhatsApp,WeChat,邮箱等联系方式到询盘导出明细的表格
// @author       YourName
// @match        https://message.alibaba.com/message/maDetail.htm*
// @require      https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/546228/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%9B%BD%E9%99%85%E7%AB%99%E8%AF%A2%E7%9B%98%E8%81%8A%E5%A4%A9%E8%AE%B0%E5%BD%95%E5%AF%BC%E5%87%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/546228/%E9%98%BF%E9%87%8C%E5%B7%B4%E5%B7%B4%E5%9B%BD%E9%99%85%E7%AB%99%E8%AF%A2%E7%9B%98%E8%81%8A%E5%A4%A9%E8%AE%B0%E5%BD%95%E5%AF%BC%E5%87%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 自动捕获 getOpMessages.htm 参数
    let cachedPageVars = null;
    (function() {
        const origFetch = window.fetch;
        window.fetch = async function() {
            const url = arguments[0];
            const options = arguments[1] || {};
            let bodyStr = options.body;
            if (bodyStr instanceof FormData) {
                const obj = {};
                for (let pair of bodyStr.entries()) {
                    obj[pair[0]] = pair[1];
                }
                bodyStr = obj;
            } else if (bodyStr instanceof URLSearchParams) {
                bodyStr = bodyStr.toString();
            }
            if (typeof url === 'string' && url.includes('getOpMessages.htm') && bodyStr) {
                let paramsStr = '';
                if (typeof bodyStr === 'string') {
                    const match = bodyStr.match(/params=([^&]+)/);
                    if (match) paramsStr = decodeURIComponent(match[1]);
                } else if (bodyStr.params) {
                    paramsStr = decodeURIComponent(bodyStr.params);
                }
                if (paramsStr) {
                    try {
                        const paramsObj = JSON.parse(paramsStr);
                        cachedPageVars = {
                            secOwnerAccountId: paramsObj.secOwnerAccountId || '',
                            secTradeId: paramsObj.secTradeId || '',
                            secTargetAccountId: paramsObj.secTargetAccountId || '',
                            targetAliId: paramsObj.targetAliId || paramsObj.contactAccountIdEncrypt || '',
                        };
                    } catch (e) {}
                }
            }
            return origFetch.apply(this, arguments);
        };
    })();

    // 页面右上角插入按钮
    function addExportButton() {
        if (document.getElementById('alibaba-export-btn')) return;
        // 导出带翻译按钮
        const btn1 = document.createElement('button');
        btn1.id = 'alibaba-export-btn';
        btn1.innerText = '导出聊天记录（含翻译）';
        btn1.style.position = 'fixed';
        btn1.style.top = '20px';
        btn1.style.right = '20px';
        btn1.style.zIndex = 9999;
        btn1.style.background = '#4CAF50';
        btn1.style.color = '#fff';
        btn1.style.border = 'none';
        btn1.style.padding = '10px 20px';
        btn1.style.borderRadius = '5px';
        btn1.style.cursor = 'pointer';
        btn1.onclick = function() { exportMessages(true); };
        document.body.appendChild(btn1);
        // 导出不带翻译按钮
        const btn2 = document.createElement('button');
        btn2.id = 'alibaba-export-btn-no-translate';
        btn2.innerText = '导出聊天记录（无翻译）';
        btn2.style.position = 'fixed';
        btn2.style.top = '60px';
        btn2.style.right = '20px';
        btn2.style.zIndex = 9999;
        btn2.style.background = '#2196F3';
        btn2.style.color = '#fff';
        btn2.style.border = 'none';
        btn2.style.padding = '10px 20px';
        btn2.style.borderRadius = '5px';
        btn2.style.cursor = 'pointer';
        btn2.onclick = function() { exportMessages(false); };
        document.body.appendChild(btn2);
    }

    // 获取cookie
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }

    // 获取页面变量
    function getPageVars() {
        if (cachedPageVars) return cachedPageVars;
        let secOwnerAccountId = '';
        let secTradeId = '';
        let secTargetAccountId = '';
        let targetAliId = '';
        const urlParams = new URLSearchParams(window.location.search);
        secOwnerAccountId = urlParams.get('secOwnerAccountId') || '';
        secTradeId = urlParams.get('secTradeId') || '';
        secTargetAccountId = urlParams.get('secTargetAccountId') || '';
        targetAliId = urlParams.get('targetAliId') || '';
        return { secOwnerAccountId, secTradeId, secTargetAccountId, targetAliId };
    }

    // 清洗内容
    function cleanContent(content) {
        if (!content) return '';
        content = content.replace(/<img[^>]*>/g, '');
        content = content.replace(/https?:\/\/\S+\.(?:gif|png|jpg|jpeg)/gi, '[图片]');
        content = content.replace(/https:\/\/clouddisk\.alibaba\.com\/file\/redirectFileUrl\.htm\?[^"\s>]+/g, '[图片]');
        content = content.replace(/&#39;/g, "'");
        content = content.replace(/&nbsp;/g, ' ');
        return content;
    }

    // 主导出逻辑
    async function exportMessages(withTranslate) {
        // 采集进度显示
        let progressDiv = document.getElementById('alibaba-export-progress');
        if (!progressDiv) {
            progressDiv = document.createElement('div');
            progressDiv.id = 'alibaba-export-progress';
            progressDiv.style.position = 'fixed';
            progressDiv.style.top = '60px';
            progressDiv.style.right = '20px';
            progressDiv.style.zIndex = 9999;
            progressDiv.style.background = '#fff';
            progressDiv.style.color = '#333';
            progressDiv.style.border = '1px solid #4CAF50';
            progressDiv.style.padding = '8px 16px';
            progressDiv.style.borderRadius = '5px';
            progressDiv.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
            progressDiv.innerText = '采集进度...';
            document.body.appendChild(progressDiv);
        }
        function updateProgress(text) {
            progressDiv.innerText = text;
        }

        const { secOwnerAccountId, secTradeId, secTargetAccountId, targetAliId } = getPageVars();
        if (!secOwnerAccountId || !secTradeId || !secTargetAccountId || !targetAliId) {
            alert('未能自动获取必要参数，请检查页面或手动补充代码！');
            return;
        }
        const _csrf = getCookie('XSRF-TOKEN');
        let all_msgs = [];
        let has_more = true;
        let page_size = 100;
        let time_stamp = null;
        let page_count = 0;

        while (has_more) {
            const params = {
                scene: "",
                timeSlide: {
                    forward: true,
                    pageSize: page_size
                },
                secOwnerAccountId,
                secTradeId,
                secTargetAccountId,
                openRealTimeTranslation: true,
                targetAliId
            };
            if (time_stamp) params.timeSlide.timeStamp = time_stamp;

            const data = new URLSearchParams();
            data.append('_csrf', _csrf);
            data.append('params', JSON.stringify(params));

            // 用 XMLHttpRequest 替代 fetch
            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://onetalk.alibaba.com/message/getOpMessages.htm', false); // 同步请求
            xhr.setRequestHeader('accept', '*/*');
            xhr.setRequestHeader('content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
            xhr.setRequestHeader('referer', 'https://message.alibaba.com/');
            xhr.withCredentials = true;
            xhr.send(data.toString());
            let res_json = {};
            try {
                res_json = JSON.parse(xhr.responseText);
            } catch (e) {
                res_json = {};
            }
            page_count++;
            updateProgress(`采集第${page_count}页，已采集${all_msgs.length}条...`);
            const msg_list = res_json?.data?.list || [];
            if (!msg_list.length) break;
            all_msgs = all_msgs.concat(msg_list);
            time_stamp = msg_list[msg_list.length - 1].sendTime;
            if (msg_list.length < page_size) break;
            await new Promise(r => setTimeout(r, 500));
        }
        updateProgress(`采集完成，共${all_msgs.length}条。正在处理...`);

        // 去重
        const unique = new Set();
        const deduped = [];
        for (const msg of all_msgs) {
            const msg_id = msg.messageId || (msg.sendTime + '_' + msg.content);
            if (!unique.has(msg_id)) {
                unique.add(msg_id);
                deduped.push(msg);
            }
        }

        // 排序
        deduped.sort((a, b) => Number(a.sendTime) - Number(b.sendTime));

        // 组装Excel数据
        let ws_data;
        if (withTranslate) {
            ws_data = [
                ['sendTime（时间）', 'role（买家/卖家）', 'name（姓名）', 'content（原文）', 'content（中文翻译）']
            ];
        } else {
            ws_data = [
                ['sendTime（时间）', 'role（买家/卖家）', 'name（姓名）', 'content（原文）']
            ];
        }
        const contents = deduped.map(msg => cleanContent(msg.content || ''));
        let translations = [];
        if (withTranslate) {
            async function batchTranslate(texts, targetLang = 'zh-CN') {
                const results = [];
                for (const text of texts) {
                    if (/^[\u4e00-\u9fa5\s\p{P}]+$/u.test(text)) {
                        results.push(text);
                        continue;
                    }
                    try {
                        const res = await fetch(`https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`);
                        const data = await res.json();
                        results.push(data[0]?.map(i => i[0]).join('') || text);
                    } catch {
                        results.push(text);
                    }
                    await new Promise(r => setTimeout(r, 200));
                }
                return results;
            }
            translations = await batchTranslate(contents);
        }
        for (let i = 0; i < deduped.length; i++) {
            const msg = deduped[i];
            const role = msg.messageType === 'send' ? '卖家' : '买家';
            const name = msg.messageType === 'send' ? (msg.owner?.name || '') : (msg.contact?.name || '');
            let ts_str = '';
            if (msg.sendTime) {
                try {
                    const dt = new Date(Number(msg.sendTime));
                    ts_str = dt.toLocaleString();
                } catch {
                    ts_str = msg.sendTime;
                }
            }
            const content = contents[i];
            if (withTranslate) {
                const translation = translations[i];
                ws_data.push([ts_str, role, name, content, translation]);
            } else {
                ws_data.push([ts_str, role, name, content]);
            }
        }
        const ws = XLSX.utils.aoa_to_sheet(ws_data);
        const wb = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(wb, ws, 'Messages');
        let buyerName = '';
        for (let i = 0; i < deduped.length; i++) {
            const msg = deduped[i];
            if (msg.messageType !== 'send' && (msg.contact?.name || '')) {
                buyerName = msg.contact.name;
                break;
            }
        }
        if (!buyerName) buyerName = '买家';
        function pad(n) { return n < 10 ? '0' + n : n; }
        const now = new Date();
        const timeStr = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;
        const fileName = `${buyerName}_${timeStr}.xlsx`;
        XLSX.writeFile(wb, fileName);
        updateProgress('导出完成！');
        setTimeout(() => progressDiv.remove(), 3000);
    }

    setTimeout(addExportButton, 2000);
})();