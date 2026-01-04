// ==UserScript==
// @name         DeepSeek 对话导出器 | DeepSeek Conversation Exporter Plus
// @namespace    http://tampermonkey.net/
// @version      0.0.8
// @description  优雅导出 DeepSeek 对话记录，支持 JSON 和 Markdown 格式。Elegantly export DeepSeek conversation records, supporting JSON and Markdown formats.
// @author       Gao + Gemini + ceyaima
// @license      Custom License
// @match        https://*.deepseek.com/a/chat/s/*
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/523474/DeepSeek%20%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E5%99%A8%20%7C%20DeepSeek%20Conversation%20Exporter%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/523474/DeepSeek%20%E5%AF%B9%E8%AF%9D%E5%AF%BC%E5%87%BA%E5%99%A8%20%7C%20DeepSeek%20Conversation%20Exporter%20Plus.meta.js
// ==/UserScript==

/*
 您可以在个人设备上使用和修改该代码。
 不得将该代码或其修改版本重新分发、再发布或用于其他公众渠道。
 保留所有权利，未经授权不得用于商业用途。
*/

/*
You may use and modify this code on your personal devices.
You may not redistribute, republish, or use this code or its modified versions in other public channels.
All rights reserved. Unauthorized commercial use is prohibited.
*/

(function() {
    'use strict';

    let state = {
        targetResponse: null,
        includeThinking: localStorage.getItem('ds_export_thinking') !== 'false'
    };

    function formatSize(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function convertToMd(data) {
        try {
            const bizData = data.data.biz_data;
            const messages = bizData.chat_messages;
            let md = `# DeepSeek - ${bizData.chat_session.title || 'Untitled'}\n\n`;

            messages.forEach(msg => {
                const role = msg.role === 'USER' ? '👤 Human' : '🤖 Assistant';
                const time = new Date(msg.inserted_at * 1000).toLocaleString();
                md += `### ${role} \n*${time}*\n\n`;

                if (msg.files && msg.files.length > 0) {
                    md += `> **📁 Files:**\n`;
                    msg.files.forEach(f => md += `> - ${f.file_name} (${formatSize(f.file_size)})\n`);
                    md += `\n`;
                }

                let thinking = "", body = "", thinkTime = "", citations = {};
                (msg.fragments || []).forEach(f => {
                    if (f.type === 'THINK') { thinking = f.content || ""; thinkTime = f.elapsed_secs ? `${f.elapsed_secs}s` : ""; }
                    else if (f.type === 'RESPONSE' || f.type === 'REQUEST') { body += (f.content || ""); }
                    else if (f.type === 'SEARCH' && f.results) { f.results.forEach(r => { if(r.cite_index) citations[r.cite_index] = r.url; }); }
                });

                body = body.replace(/\[citation:(\d+)\]/g, (m, id) => citations[id] ? ` [[${id}]](${citations[id]})` : m);
                if (state.includeThinking && thinking) md += `> **💭 Thinking (${thinkTime})**\n> \n> ${thinking.replace(/\n/g, '\n> ')}\n\n`;
                body = body.replace(/\$\$(.*?)\$\$/gs, (m, f) => f.includes('\n') ? `\n$$\n${f.trim()}\n$$\n` : `$$${f}$$`);
                md += body + "\n\n---\n\n";
            });
            return md;
        } catch (e) { return "Export failed: " + e.message; }
    }

    function createUI() {
        if (document.getElementById('ds_export_root')) { updateStatus(); return; }
        const root = document.createElement('div');
        root.id = 'ds_export_root';
        Object.assign(root.style, {
            position: 'fixed', top: '45%', right: '12px', zIndex: '10000',
            display: 'flex', flexDirection: 'column', gap: '10px',
            opacity: '0.4', transition: 'opacity 0.3s'
        });

        const btnStyle = {
            width: '56px', height: '34px', border: 'none', borderRadius: '6px',
            color: 'white', cursor: 'pointer', fontSize: '12px', fontWeight: '600',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            boxShadow: '0 2px 8px rgba(0,0,0,0.15)', transition: 'all 0.2s'
        };

        const jsonBtn = document.createElement('button');
        jsonBtn.id = 'ds_json'; jsonBtn.innerText = 'JSON';
        Object.assign(jsonBtn.style, btnStyle);

        const mdBtn = document.createElement('button');
        mdBtn.id = 'ds_md'; mdBtn.innerText = 'MD';
        Object.assign(mdBtn.style, btnStyle);

        jsonBtn.onclick = () => download(state.targetResponse, 'json');
        mdBtn.onclick = () => download(convertToMd(JSON.parse(state.targetResponse)), 'md');

        root.onmouseenter = () => root.style.opacity = '1';
        root.onmouseleave = () => root.style.opacity = '0.4';

        root.appendChild(jsonBtn); root.appendChild(mdBtn);
        document.body.appendChild(root);
        updateStatus();
    }

    function updateStatus() {
        const hasData = state.targetResponse && JSON.parse(state.targetResponse).data.biz_data.chat_messages.length > 0;
        const j = document.getElementById('ds_json'), m = document.getElementById('ds_md');
        if (j && m) {
            j.style.backgroundColor = hasData ? '#28a745' : '#007bff';
            m.style.backgroundColor = hasData ? '#28a745' : '#007bff';
            j.title = hasData ? 'Data Ready' : 'Waiting for data...';
            m.title = j.title;
        }
    }

    function download(content, ext) {
        if (!content) return;
        const data = JSON.parse(state.targetResponse);
        const title = (data.data.biz_data.chat_session.title || 'DeepSeek').replace(/[\/\\?%*:|"<>]/g, '-');
        const blob = new Blob([typeof content === 'string' ? content : JSON.stringify(content, null, 2)], { type: 'text/plain' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `${title}_${new Date().getTime()}.${ext}`;
        a.click();
    }

    const hook = () => {
        const open = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function(m, url) {
            if (url.includes('history_messages?chat_session_id')) {
                arguments[1] = url.replace(/&cache_version=\d+/, '') + '&v=' + Date.now();
            }
            this.addEventListener('load', () => {
                if (this.responseURL.includes('history_messages')) {
                    const res = JSON.parse(this.responseText);
                    if (res.data?.biz_data?.chat_messages?.length > 0) {
                        state.targetResponse = this.responseText;
                        updateStatus();
                    }
                }
            });
            open.apply(this, arguments);
        };
    };

    hook();
    window.addEventListener('load', () => {
        createUI();
        setInterval(createUI, 2000);
        GM_registerMenuCommand(state.includeThinking ? '✅ Include Thinking' : '❌ Exclude Thinking', () => {
            state.includeThinking = !state.includeThinking;
            localStorage.setItem('ds_export_thinking', state.includeThinking);
            location.reload();
        });
    });
})();