// ==UserScript==
// @name         Nova Castelijns Zombi İğnesi Hazırlama Otomatı
// @namespace    popmundo
// @author       Nova Castelijns (2641094)
// @version      1.0
// @description  Zombi İğnesi Otomasyonu
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/Items*
// @license      MIT
// @icon         https://www.pngmart.com/files/22/Star-Emojis-PNG-HD.png
// @downloadURL https://update.greasyfork.org/scripts/529817/Nova%20Castelijns%20Zombi%20%C4%B0%C4%9Fnesi%20Haz%C4%B1rlama%20Otomat%C4%B1.user.js
// @updateURL https://update.greasyfork.org/scripts/529817/Nova%20Castelijns%20Zombi%20%C4%B0%C4%9Fnesi%20Haz%C4%B1rlama%20Otomat%C4%B1.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const ITEMS = {
        NEEDLE: {
            name: 'Kan Dolu Tüp',
            interval: 10,
            isRunning: false,
            lastUseTime: null,
            nextUseTime: null,
            retryCount: 0
        },
        SAMPLER: {
            name: 'Kan Örneği Alıcı',
            interval: 10,
            isRunning: false,
            lastUseTime: null,
            nextUseTime: null,
            retryCount: 0
        }
    };

    let isProcessing = false;
    let currentIframe = null;
    const MAX_RETRIES = 3;

    const debug = (itemType, message) => {
        if (itemType === 'SYSTEM') {
            console.log(`[System Debug] ${message}`);
            return;
        }
        const itemName = ITEMS[itemType]?.name || 'Unknown';
        console.log(`[${itemName} Debug] ${message}`);
    };

    const saveState = () => {
        try {
            const state = {
                NEEDLE: {
                    isRunning: ITEMS.NEEDLE.isRunning,
                    nextUseTime: ITEMS.NEEDLE.nextUseTime ? ITEMS.NEEDLE.nextUseTime.getTime() : null,
                    lastUseTime: ITEMS.NEEDLE.lastUseTime ? ITEMS.NEEDLE.lastUseTime.getTime() : null,
                    retryCount: ITEMS.NEEDLE.retryCount
                },
                SAMPLER: {
                    isRunning: ITEMS.SAMPLER.isRunning,
                    nextUseTime: ITEMS.SAMPLER.nextUseTime ? ITEMS.SAMPLER.nextUseTime.getTime() : null,
                    lastUseTime: ITEMS.SAMPLER.lastUseTime ? ITEMS.SAMPLER.lastUseTime.getTime() : null,
                    retryCount: ITEMS.SAMPLER.retryCount
                }
            };
            localStorage.setItem('itemScriptState', JSON.stringify(state));
            debug('SYSTEM', 'State kaydedildi');
        } catch (error) {
            console.error('State kaydetme hatası:', error);
        }
    };

    const loadState = () => {
        try {
            const stateStr = localStorage.getItem('itemScriptState');
            if (!stateStr) return false;

            const state = JSON.parse(stateStr);

            for (const itemType of ['NEEDLE', 'SAMPLER']) {
                if (state[itemType]) {
                    ITEMS[itemType].isRunning = !!state[itemType].isRunning;
                    ITEMS[itemType].nextUseTime = state[itemType].nextUseTime ? new Date(state[itemType].nextUseTime) : null;
                    ITEMS[itemType].lastUseTime = state[itemType].lastUseTime ? new Date(state[itemType].lastUseTime) : null;
                    ITEMS[itemType].retryCount = state[itemType].retryCount || 0;
                }
            }

            debug('SYSTEM', 'State yüklendi');
            return true;
        } catch (error) {
            console.error('State yükleme hatası:', error);
            return false;
        }
    };

    async function createIframe() {
        debug('SYSTEM', 'Iframe oluşturuluyor...');

        if (currentIframe) {
            document.body.removeChild(currentIframe);
        }

        let iframe = document.createElement('iframe');
        iframe.style.display = 'none';
        iframe.src = window.location.href;
        document.body.appendChild(iframe);
        currentIframe = iframe;

        return new Promise((resolve) => {
            iframe.onload = async () => {
                debug('SYSTEM', 'Iframe yüklendi');
                await new Promise(r => setTimeout(r, 2000));
                resolve(iframe);
            };
        });
    }

    function findItemButton(iframeDoc, itemName) {
        debug('SYSTEM', `${itemName} butonu aranıyor...`);
        const rows = iframeDoc.querySelectorAll('tr');
        for (const row of rows) {
            if (row.textContent.includes(itemName)) {
                const button = row.querySelector('input[type="image"][title="Kullan"]');
                if (button && !button.disabled) {
                    debug('SYSTEM', `${itemName} butonu bulundu`);
                    return button;
                }
            }
        }
        debug('SYSTEM', `${itemName} butonu bulunamadı`);
        return null;
    }

    async function useItem(itemType) {
        if (isProcessing) {
            debug(itemType, 'İşlem zaten devam ediyor');
            return;
        }

        isProcessing = true;
        try {
            debug(itemType, 'Kullanım işlemi başlıyor');
            const iframe = await createIframe();
            const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;

            const button = findItemButton(iframeDoc, ITEMS[itemType].name);

            if (button) {
                button.click();
                ITEMS[itemType].lastUseTime = new Date();
                ITEMS[itemType].nextUseTime = new Date(ITEMS[itemType].lastUseTime.getTime() + ITEMS[itemType].interval * 60 * 1000);
                ITEMS[itemType].retryCount = 0;
                debug(itemType, `Eşya kullanıldı, sonraki: ${ITEMS[itemType].nextUseTime}`);
                updateStatus(itemType, 'Eşya kullanıldı');
            } else {
                ITEMS[itemType].retryCount++;
                if (ITEMS[itemType].retryCount >= MAX_RETRIES) {
                    ITEMS[itemType].nextUseTime = new Date(Date.now() + ITEMS[itemType].interval * 60 * 1000);
                    ITEMS[itemType].retryCount = 0;
                    debug(itemType, 'Maksimum deneme sayısına ulaşıldı');
                } else {
                    ITEMS[itemType].nextUseTime = new Date(Date.now() + 1 * 60 * 1000);
                    debug(itemType, 'Başarısız deneme, 1 dakika sonra tekrar denecek');
                }
            }

            updateNextUse(itemType, ITEMS[itemType].nextUseTime);
            saveState();

        } catch (error) {
            console.error('Kullanım hatası:', error);
            ITEMS[itemType].nextUseTime = new Date(Date.now() + 1 * 60 * 1000);
        } finally {
            isProcessing = false;
        }
    }

    const createInterface = () => {
        const container = document.createElement('div');
        container.innerHTML = `
            <div id="autoUseInterface" style="
                position: fixed;
                top: 20px;
                right: 20px;
                background: #2a2a2a;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 0 10px rgba(0,0,0,0.5);
                z-index: 9999;
                color: white;
                font-family: Arial, sans-serif;
                min-width: 300px;
            ">
                <div style="margin-bottom: 10px; font-weight: bold; border-bottom: 1px solid #444; padding-bottom: 5px;">
                   🌟 Nova Castelijns Zombi İğnesi Hazırlama Otomatı
                </div>
                <div style="margin-bottom: 15px;">
                    <div style="font-weight: bold; margin-bottom: 5px;">💉 Kan Dolu Tüp</div>
                    <div id="needleStatusText" class="statusText">Durum: Beklemede</div>
                    <div id="needleNextUseText" class="nextUseText">Sonraki: -</div>
                    <div class="progressContainer">
                        <progress id="needleProgress" value="0" max="100" style="width: 100%;"></progress>
                    </div>
                </div>
                <div style="margin-bottom: 15px;">
                    <div style="font-weight: bold; margin-bottom: 5px;">🔬 Kan Örneği Alıcı</div>
                    <div id="samplerStatusText" class="statusText">Durum: Beklemede</div>
                    <div id="samplerNextUseText" class="nextUseText">Sonraki: -</div>
                    <div class="progressContainer">
                        <progress id="samplerProgress" value="0" max="100" style="width: 100%;"></progress>
                    </div>
                </div>
                <div style="display: flex; gap: 10px; flex-wrap: wrap;">
                    <button id="needleButton" class="actionButton" style="background: #4CAF50;">
                        Kan Dolu Tüp Başlat
                    </button>
                    <button id="samplerButton" class="actionButton" style="background: #4CAF50;">
                        Kan Örneği Alıcı Başlat
                    </button>
                    <button id="resetButton" style="
                        background: #ff9800;
                        border: none;
                        color: white;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        flex: 1;
                    ">Sıfırla</button>
                </div>
            </div>
        `;

        const style = document.createElement('style');
        style.textContent = `
            .actionButton {
                border: none;
                color: white;
                padding: 8px 16px;
                border-radius: 4px;
                cursor: pointer;
                flex: 1;
            }
            .statusText, .nextUseText {
                margin-bottom: 5px;
                font-size: 14px;
            }
            .progressContainer {
                margin-bottom: 10px;
            }
        `;
        document.head.appendChild(style);
        document.body.appendChild(container);
    };

    const updateStatus = (itemType, text) => {
        const statusElement = document.getElementById(`${itemType.toLowerCase()}StatusText`);
        if (statusElement) {
            statusElement.textContent = `Durum: ${text}`;
        }
    };

    const updateNextUse = (itemType, time) => {
        const nextUseElement = document.getElementById(`${itemType.toLowerCase()}NextUseText`);
        if (nextUseElement) {
            nextUseElement.textContent = time ?
                `Sonraki: ${time.toLocaleTimeString()}` :
                'Sonraki: -';
        }
    };

    const updateProgress = (itemType, percent) => {
        const progressElement = document.getElementById(`${itemType.toLowerCase()}Progress`);
        if (progressElement) {
            progressElement.value = percent;
        }
    };

    function updateTimer() {
        const now = new Date();

        for (const [itemType, item] of Object.entries(ITEMS)) {
            if (!item.isRunning || !item.nextUseTime) continue;

            const timeDiff = item.nextUseTime - now;

            if (timeDiff <= 0) {
                useItem(itemType);
                continue;
            }

            const totalTime = item.interval * 60 * 1000;
            const progress = 100 - (timeDiff / totalTime * 100);
            updateProgress(itemType, Math.max(0, Math.min(100, progress)));
        }
    }

    function resetTimer() {
        debug('SYSTEM', 'Sayaçlar sıfırlanıyor...');
        for (const [itemType, item] of Object.entries(ITEMS)) {
            item.nextUseTime = null;
            item.lastUseTime = null;
            item.retryCount = 0;
            item.isRunning = false;

            updateStatus(itemType, 'Beklemede');
            updateNextUse(itemType, null);
            updateProgress(itemType, 0);

            const button = document.getElementById(`${itemType.toLowerCase()}Button`);
            if (button) {
                button.textContent = `${item.name} Başlat`;
                button.style.background = '#4CAF50';
            }
        }
        saveState();
    }

    function toggleItem(itemType) {
        ITEMS[itemType].isRunning = !ITEMS[itemType].isRunning;
        const button = document.getElementById(`${itemType.toLowerCase()}Button`);

        if (ITEMS[itemType].isRunning) {
            button.textContent = `${ITEMS[itemType].name} Durdur`;
            button.style.background = '#f44336';
            if (!ITEMS[itemType].nextUseTime) useItem(itemType);
            debug(itemType, 'Script başlatıldı');
            updateStatus(itemType, 'Çalışıyor...');
        } else {
            button.textContent = `${ITEMS[itemType].name} Başlat`;
            button.style.background = '#4CAF50';
            updateStatus(itemType, 'Beklemede');
            debug(itemType, 'Script durduruldu');
        }

        saveState();
    }

    setInterval(updateTimer, 1000);

    window.addEventListener('load', () => {
        debug('SYSTEM', 'Sayfa yüklendi, arayüz oluşturuluyor');
        createInterface();

        const needleButton = document.getElementById('needleButton');
        const samplerButton = document.getElementById('samplerButton');
        const resetBtn = document.getElementById('resetButton');

        needleButton.addEventListener('click', () => toggleItem('NEEDLE'));
        samplerButton.addEventListener('click', () => toggleItem('SAMPLER'));
        resetBtn.addEventListener('click', resetTimer);

        if (loadState()) {
            debug('SYSTEM', 'Önceki state yüklendi');

            for (const [itemType, item] of Object.entries(ITEMS)) {
                if (item.isRunning) {
                    const button = document.getElementById(`${itemType.toLowerCase()}Button`);
                    if (button) {
                        button.textContent = `${item.name} Durdur`;
                        button.style.background = '#f44336';
                    }

                    if (item.nextUseTime) {
                        updateNextUse(itemType, item.nextUseTime);
                        updateStatus(itemType, 'Script devam ediyor...');
                    }
                }
            }
        }
    });
})();
