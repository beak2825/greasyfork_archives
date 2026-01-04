// ==UserScript==
// @name         Silkroad TRSRO Compact
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Optimize edilmiş sunucu izleme paneli
// @author       inos
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @connect      silkroad.gamegami.com
// @downloadURL https://update.greasyfork.org/scripts/530115/Silkroad%20TRSRO%20Compact.user.js
// @updateURL https://update.greasyfork.org/scripts/530115/Silkroad%20TRSRO%20Compact.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const serverStatusUrl = 'https://silkroad.gamegami.com/stats.php';
    let statusBox;

    // 1. ARAYÜZ OLUŞTURMA
    function initUI() {
        statusBox = document.createElement('div');
        statusBox.id = 'serverStatusBox';
        statusBox.innerHTML = `
            <div class="header">TRSRO SUNUCU DURUMU</div>
            <div class="status-list"></div>
            <div class="button-container"></div>
        `;

        createButtons();
        document.body.appendChild(statusBox);
    }

    // 2. STİL TANIMLAMALARI
    GM_addStyle(`
        #serverStatusBox {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: rgba(0,0,0,0.95);
            color: #fff;
            padding: 12px;
            border-radius: 8px;
            font-family: 'Segoe UI', Arial;
            min-width: 200px;
            max-width: 240px;
            box-shadow: 0 4px 15px rgba(0,0,0,0.3);
            z-index: 9999;
        }

        .header {
            font-size: 14px;
            font-weight: bold;
            margin-bottom: 8px;
            padding-bottom: 4px;
            border-bottom: 1px solid rgba(255,255,255,0.2);
        }

        .status-list {
            max-height: 300px;
            overflow-y: auto;
            margin: 8px 0;
        }

        .server-entry {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 6px 0;
            font-size: 12px;
            border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .server-name {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .server-status {
            display: flex;
            align-items: center;
            gap: 8px;
            margin-left: 10px;
        }

        .button-container {
            display: flex;
            justify-content: space-between;
            gap: 6px;
            margin-top: 12px;
        }

        .sro-btn {
            width: 24px;
            height: 24px;
            background: rgba(255,255,255,0.1);
            border-radius: 4px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            position: relative;
            transition: all 0.2s;
            font-size: 14px;
        }

        .sro-btn:hover {
            background: rgba(255,255,255,0.2);
        }

        .tooltip {
            position: absolute;
            bottom: 30px;
            left: 50%;
            transform: translateX(-50%);
            background: #000;
            color: #fff;
            padding: 4px 8px;
            border-radius: 3px;
            font-size: 11px;
            white-space: nowrap;
            opacity: 0;
            visibility: hidden;
            transition: opacity 0.2s;
            pointer-events: none;
        }

        .sro-btn:hover .tooltip {
            opacity: 1;
            visibility: visible;
        }
    `);

    // 3. BUTON SİSTEMİ
    function createButtons() {
        const container = statusBox.querySelector('.button-container');
        const buttons = [
            { icon: '🔄', tip: 'Yenile', action: fetchData },
            { icon: '👤', tip: 'Profil', action: () => window.open('https://silkroad.gamegami.com/character.php?shardid=18&char=inos') },
            { icon: '📝', tip: 'Kayıt Ol', action: () => window.open('https://silkroad.gamegami.com/register.php') },
            { icon: '⬇️', tip: 'İndir', action: () => window.open('https://silkroad.gamegami.com/download.php') },
            { icon: '🎨', tip: 'Tema', action: changeTheme }
        ];

        buttons.forEach(config => {
            const btn = document.createElement('div');
            btn.className = 'sro-btn';
            btn.innerHTML = `
                ${config.icon}
                <div class="tooltip">${config.tip}</div>
            `;
            btn.onclick = config.action;
            container.appendChild(btn);
        });
    }

    // 4. VERİ İŞLEME
    function fetchData() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: serverStatusUrl,
            onload: processData,
            onerror: handleError
        });
    }

    function processData(response) {
        try {
            const parser = new DOMParser();
            const doc = parser.parseFromString(response.responseText, 'text/html');
            const rows = doc.querySelectorAll('tbody tr');
            const entries = Array.from(rows)
                .map(row => createServerEntry(row))
                .filter(entry => entry !== null);

            statusBox.querySelector('.status-list').innerHTML = entries.join('');
        } catch(e) {
            showError('Veri işleme hatası!');
        }
    }

    function createServerEntry(row) {
        const name = getSafeText(row, '.td1');
        const capacity = parseInt(getSafeText(row, '.td2').replace('%', ''), 10) || 0;
        const status = getSafeText(row, '.td4 div:last-child');

        if (!name || name.toLowerCase().includes('bilinmeyen')) return null;

        const statusIndicator = capacity >= 75 ? '🔴' :
                              capacity >= 50 ? '🟠' :
                              capacity >= 25 ? '🟡' : '🟢';

        return `
            <div class="server-entry">
                <span class="server-name">${name}</span>
                <span class="server-status">
                    <span>${capacity}%</span>
                    ${statusIndicator}
                    <span>${status}</span>
                </span>
            </div>
        `;
    }

    function getSafeText(element, selector) {
        return element.querySelector(selector)?.textContent?.trim() || '';
    }

    // 5. HATA YÖNETİMİ
    function handleError() {
        showError('Sunucuya bağlanılamadı');
        setTimeout(fetchData, 10000);
    }

    function showError(message) {
        statusBox.querySelector('.status-list').innerHTML = `
            <div style="color: #ff5555; padding: 8px; text-align: center; font-size: 12px;">
                ${message}
            </div>
        `;
    }

    // 6. TEMA DEĞİŞTİRME
    function changeTheme() {
        const themes = [
            { bg: '#1a1a1a', text: '#ffffff' },
            { bg: '#2d3848', text: '#a8c7fa' },
            { bg: '#003366', text: '#99ccff' }
        ];
        const theme = themes[Math.floor(Math.random() * themes.length)];
        statusBox.style.background = theme.bg;
        statusBox.style.color = theme.text;
    }

    // BAŞLAT
    initUI();
    fetchData();
    setInterval(fetchData, 30000);
})();