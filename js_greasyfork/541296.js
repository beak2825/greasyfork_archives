// ==UserScript==
// @name         크랙채팅로거
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  crack 캐릭터챗 채팅로그를 JSON으로 복사하거나 txt로 저장합니다
// @author       바보륍부이
// @match        https://crack.wrtn.ai/stories/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541296/%ED%81%AC%EB%9E%99%EC%B1%84%ED%8C%85%EB%A1%9C%EA%B1%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/541296/%ED%81%AC%EB%9E%99%EC%B1%84%ED%8C%85%EB%A1%9C%EA%B1%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const API_BASE = 'https://contents-api.wrtn.ai';

    function getChatroomInfo() {
        const match = location.pathname.match(/\/stories\/([a-f0-9]+)\/episodes\/([a-f0-9]+)/);
        return match ? { characterId: match[1], chatroomId: match[2] } : null;
    }

    function getAccessToken() {
        const match = document.cookie.match(/(?:^|; )access_token=([^;]*)/);
        return match ? decodeURIComponent(match[1]) : null;
    }

    async function fetchChatLogs(chatroomId, limit = 50) {
        const token = getAccessToken();
        if (!token) {
            alert('[Chatlog Copier] 토큰을 찾을 수 없습니다.');
            return null;
        }

        const res = await fetch(`${API_BASE}/character-chat/api/v2/chat-room/${chatroomId}/messages?limit=${limit}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (!res.ok) {
            alert(`[Chatlog Copier] 서버 오류: ${res.status}`);
            return null;
        }

        const json = await res.json();
        if (!json?.data?.list) {
            alert('[Chatlog Copier] 채팅 로그 응답 형식을 인식할 수 없습니다.');
            return null;
        }

        return json.data.list.reverse();
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text).then(() => {
            alert('[Chatlog Copier] 채팅 로그가 JSON 형식으로 복사되었습니다.');
        }).catch(() => {
            alert('[Chatlog Copier] 클립보드 복사에 실패했습니다.');
        });
    }

    function saveToFile(text, filename = "chatlog.txt") {
        const blob = new Blob([text], { type: 'text/plain' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    function createButton() {
        const wrap = document.createElement('div');
        wrap.style.position = 'fixed';
        wrap.style.right = '20px';
        wrap.style.bottom = '20px';
        wrap.style.zIndex = 9999;
        wrap.style.backgroundColor = '#222';
        wrap.style.padding = '12px';
        wrap.style.borderRadius = '12px';
        wrap.style.boxShadow = '0 0 8px rgba(0,0,0,0.3)';
        wrap.style.display = 'flex';
        wrap.style.flexDirection = 'column';
        wrap.style.gap = '6px';

        const countInput = document.createElement('input');
        countInput.type = 'number';
        countInput.min = 1;
        countInput.max = 100;
        countInput.value = 50;
        countInput.placeholder = '채팅 수';
        countInput.style.padding = '4px';
        countInput.style.borderRadius = '6px';
        countInput.style.border = '1px solid #555';
        countInput.style.color = 'white';
        countInput.style.backgroundColor = '#333';

        const nameInput = document.createElement('input');
        nameInput.type = 'text';
        nameInput.placeholder = 'AI 이름 (기본: AI)';
        nameInput.style.padding = '4px';
        nameInput.style.borderRadius = '6px';
        nameInput.style.border = '1px solid #555';
        nameInput.style.color = 'white';
        nameInput.style.backgroundColor = '#333';

        const copyButton = document.createElement('button');
        copyButton.textContent = 'JSON 복사';
        copyButton.style.backgroundColor = '#007bff';
        copyButton.style.color = '#fff';
        copyButton.style.border = 'none';
        copyButton.style.borderRadius = '6px';
        copyButton.style.padding = '6px';
        copyButton.style.cursor = 'pointer';

        const saveButton = document.createElement('button');
        saveButton.textContent = 'txt로 저장';
        saveButton.style.backgroundColor = '#00aa55';
        saveButton.style.color = '#fff';
        saveButton.style.border = 'none';
        saveButton.style.borderRadius = '6px';
        saveButton.style.padding = '6px';
        saveButton.style.cursor = 'pointer';

        async function getFormattedLog() {
            const info = getChatroomInfo();
            if (!info) {
                alert('[Chatlog Copier] 이 페이지에서는 작동하지 않습니다.');
                return null;
            }

            const count = parseInt(countInput.value);
            const aiName = nameInput.value.trim() || 'AI';

            const logs = await fetchChatLogs(info.chatroomId, count);
            if (!logs) return null;

            const result = {
                chatId: info.chatroomId,
                messages: logs.map(item => ({
                    role: item.role,
                    speaker: item.role === 'assistant' ? aiName : '유저',
                    content: item.content
                }))
            };

            return JSON.stringify(result, null, 2);
        }

        copyButton.onclick = async () => {
            const log = await getFormattedLog();
            if (log) copyToClipboard(log);
        };

        saveButton.onclick = async () => {
            const log = await getFormattedLog();
            if (log) saveToFile(log);
        };

        wrap.appendChild(countInput);
        wrap.appendChild(nameInput);
        wrap.appendChild(copyButton);
        wrap.appendChild(saveButton);
        document.body.appendChild(wrap);
    }

    window.addEventListener('load', () => {
        setTimeout(createButton, 1000);
    });
})();