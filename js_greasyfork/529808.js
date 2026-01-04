// ==UserScript==
// @name         Nova Castelijns Periyodik Bakım Scripti
// @namespace    popmundo
// @author       Nova Castelijns (2641094)
// @version      1.0
// @description  Bu script ile 24 saat boyunca HIGH gezebilirsiniz.
// @match        https://*.popmundo.com/World/Popmundo.aspx/Character/Items/*
// @license      MIT
// @icon         https://www.pngmart.com/files/22/Star-Emojis-PNG-HD.png
// @downloadURL https://update.greasyfork.org/scripts/529808/Nova%20Castelijns%20Periyodik%20Bak%C4%B1m%20Scripti.user.js
// @updateURL https://update.greasyfork.org/scripts/529808/Nova%20Castelijns%20Periyodik%20Bak%C4%B1m%20Scripti.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let isRunning = false;
    let lastUseTime = null;
    let nextUseTime = null;
    let isProcessing = false;
    let timerID = null;
    let currentIframe = null;
    let retryCount = 0;
    const MAX_RETRIES = 3;

    const debug = (message) => {
        console.log(`[Sigara Script Debug] ${message}`);
    };

    const saveState = () => {
        try {
            const state = {
                isRunning,
                nextUseTime: nextUseTime ? nextUseTime.getTime() : null,
                lastUseTime: lastUseTime ? lastUseTime.getTime() : null,
                retryCount
            };
            localStorage.setItem('sigaraScriptState', JSON.stringify(state));
            debug('State kaydedildi');
        } catch (error) {
            console.error('State kaydetme hatası:', error);
        }
    };

    const loadState = () => {
        try {
            const stateStr = localStorage.getItem('sigaraScriptState');
            if (!stateStr) return false;

            const state = JSON.parse(stateStr);
            isRunning = state.isRunning;
            nextUseTime = state.nextUseTime ? new Date(state.nextUseTime) : null;
            lastUseTime = state.lastUseTime ? new Date(state.lastUseTime) : null;
            retryCount = state.retryCount || 0;

            debug('State yüklendi');
            return isRunning;
        } catch (error) {
            console.error('State yükleme hatası:', error);
            return false;
        }
    };

    async function createIframe() {
        debug('Iframe oluşturuluyor...');

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
                debug('Iframe yüklendi');
                await new Promise(r => setTimeout(r, 2000));
                resolve(iframe);
            };
        });
    }

    function findUseButton(iframeDoc) {
        debug('Buton aranıyor...');

        const checkedList = iframeDoc.querySelector('#checkedlist');
        if (!checkedList) {
            debug('checkedlist bulunamadı');
            return null;
        }

        const rows = checkedList.querySelectorAll('tr');
        debug(`${rows.length} satır bulundu`);

        for (const row of rows) {
            const rowText = row.textContent.toLowerCase();
            if (rowText.includes('dolu sigara')) {
                const button = row.querySelector('input[type="image"]');
                if (button && !button.disabled) {
                    debug('Kullanılabilir sigara butonu bulundu');
                    return button;
                }
            }
        }

        debug('Kullanılabilir sigara butonu bulunamadı');
        return null;
    }

    async function useItem() {
        if (isProcessing) {
            debug('İşlem zaten devam ediyor');
            return;
        }

        isProcessing = true;
        let successCount = 0;

        try {
            debug('Kullanım işlemi başlıyor');
            const iframe = await createIframe();

            for (let i = 0; i < 3; i++) {
                updateStatus(`${i + 1}. kullanım deneniyor...`);
                debug(`${i + 1}. kullanım denemesi`);

                if (i > 0) {
                    iframe.src = iframe.src;
                    await new Promise(r => setTimeout(r, 3000));
                }

                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                const button = findUseButton(iframeDoc);

                if (!button) {
                    debug(`${i + 1}. denemede buton bulunamadı`);
                    continue;
                }

                try {
                    button.click();
                    successCount++;
                    debug(`${i + 1}. kullanım başarılı`);
                    updateStatus(`${i + 1}. kullanım başarılı! (${successCount}/3)`);
                    await new Promise(r => setTimeout(r, 3000));
                } catch (error) {
                    debug(`Buton tıklama hatası: ${error.message}`);
                }
            }

            if (successCount > 0) {
                lastUseTime = new Date();
                nextUseTime = new Date(lastUseTime.getTime() + 62 * 60 * 1000);
                retryCount = 0;
                debug(`${successCount} başarılı kullanım, sonraki: ${nextUseTime}`);
            } else {
                retryCount++;
                if (retryCount >= MAX_RETRIES) {
                    nextUseTime = new Date(Date.now() + 62 * 60 * 1000);
                    retryCount = 0;
                    debug('Maksimum deneme sayısına ulaşıldı, 62 dakika bekleniyor');
                } else {
                    nextUseTime = new Date(Date.now() + 5 * 60 * 1000);
                    debug('Başarısız deneme, 5 dakika sonra tekrar denenecek');
                }
            }

            updateNextUse(nextUseTime);
            updateStatus(`${successCount} kullanım tamamlandı. Sonraki: ${nextUseTime.toLocaleTimeString()}`);
            saveState();

        } catch (error) {
            console.error('Kullanım hatası:', error);
            nextUseTime = new Date(Date.now() + 5 * 60 * 1000);
            updateNextUse(nextUseTime);
            saveState();
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
                min-width: 250px;
            ">
                <div style="margin-bottom: 10px; font-weight: bold; border-bottom: 1px solid #444; padding-bottom: 5px;">
                    🚬 Otomatik Sigara v3.1
                </div>
                <div id="statusText" style="margin-bottom: 10px; font-size: 14px;">
                    Durum: Beklemede
                </div>
                <div id="nextUseText" style="margin-bottom: 10px; font-size: 14px;">
                    Sonraki: -
                </div>
                <div id="progressContainer" style="margin-bottom: 10px;">
                    <progress id="timeProgress" value="0" max="100" style="width: 100%;"></progress>
                </div>
                <div style="display: flex; gap: 10px;">
                    <button id="toggleButton" style="
                        background: #4CAF50;
                        border: none;
                        color: white;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        flex: 1;
                    ">Başlat</button>
                    <button id="resetButton" style="
                        background: #ff9800;
                        border: none;
                        color: white;
                        padding: 8px 16px;
                        border-radius: 4px;
                        cursor: pointer;
                        width: 80px;
                    ">Sıfırla</button>
                </div>
            </div>
        `;
        document.body.appendChild(container);
    };

    const updateStatus = (text) => {
        const statusElement = document.getElementById('statusText');
        if (statusElement) {
            statusElement.textContent = `Durum: ${text}`;
        }
    };

    const updateNextUse = (time) => {
        const nextUseElement = document.getElementById('nextUseText');
        if (nextUseElement) {
            nextUseElement.textContent = time ?
                `Sonraki: ${time.toLocaleTimeString()}` :
                'Sonraki: -';
        }
    };

    const updateProgress = (percent) => {
        const progressElement = document.getElementById('timeProgress');
        if (progressElement) {
            progressElement.value = percent;
        }
    };

    function updateTimer() {
        if (!isRunning || !nextUseTime) return;

        const now = new Date();
        const timeDiff = nextUseTime - now;

        if (timeDiff <= 0) {
            useItem();
            return;
        }

        const totalTime = 62 * 60 * 1000;
        const progress = 100 - (timeDiff / totalTime * 100);
        updateProgress(Math.max(0, Math.min(100, progress)));
    }

    function resetTimer() {
        debug('Sayaç sıfırlanıyor...');
        nextUseTime = null;
        lastUseTime = null;
        retryCount = 0;
        updateStatus('Sayaç sıfırlandı');
        updateNextUse(null);
        updateProgress(0);
        saveState();
    }

    function toggleScript() {
        isRunning = !isRunning;
        const button = document.getElementById('toggleButton');

        if (isRunning) {
            button.textContent = 'Durdur';
            button.style.background = '#f44336';
            if (!nextUseTime) useItem();
            timerID = setInterval(updateTimer, 1000);
            debug('Script başlatıldı');
        } else {
            button.textContent = 'Başlat';
            button.style.background = '#4CAF50';
            if (timerID) clearInterval(timerID);
            updateStatus('Beklemede');
            debug('Script durduruldu (sayaç korunuyor)');
        }

        saveState();
    }

    window.addEventListener('load', () => {
        debug('Sayfa yüklendi, arayüz oluşturuluyor');
        createInterface();

        const button = document.getElementById('toggleButton');
        const resetBtn = document.getElementById('resetButton');

        button.addEventListener('click', toggleScript);
        resetBtn.addEventListener('click', resetTimer);

        if (loadState()) {
            debug('Önceki state yüklendi, script devam ediyor');
            button.textContent = 'Durdur';
            button.style.background = '#f44336';
            timerID = setInterval(updateTimer, 1000);

            if (nextUseTime) {
                updateNextUse(nextUseTime);
                updateStatus('Script devam ediyor...');
            }
        }
    });
})();
