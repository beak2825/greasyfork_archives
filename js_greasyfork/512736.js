// ==UserScript==
// @name         CSGO2.Wiki 特殊模板捡漏大师-BUFF版
// @namespace    https://csgo2.wiki
// @version      1.1
// @description  Monitor specific network requests and perform actions
// @author       You
// @match        *://buff.163.com/*
// @grant        GM_xmlhttpRequest
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/512736/CSGO2Wiki%20%E7%89%B9%E6%AE%8A%E6%A8%A1%E6%9D%BF%E6%8D%A1%E6%BC%8F%E5%A4%A7%E5%B8%88-BUFF%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/512736/CSGO2Wiki%20%E7%89%B9%E6%AE%8A%E6%A8%A1%E6%9D%BF%E6%8D%A1%E6%BC%8F%E5%A4%A7%E5%B8%88-BUFF%E7%89%88.meta.js
// ==/UserScript==

(function () {
    'use strict';

    console.log('脚本已初始化');

    document.addEventListener('DOMContentLoaded', function() {


        const defaultPaintseedList = new Set([]);

        const storedPaintseedList = localStorage.getItem('paintseedList');
        let paintseedList = storedPaintseedList ? new Set(JSON.parse(storedPaintseedList)) : new Set(defaultPaintseedList);
        let refreshIntervalId = null;

        const panel = document.createElement('div');
        panel.style.position = 'fixed';
        panel.style.bottom = '20px';
        panel.style.right = '80px';
        panel.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        panel.style.borderRadius = '8px';
        panel.style.color = '#fff';
        panel.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.2)';
        panel.style.padding = '15px';
        panel.style.zIndex = 10000;
        panel.style.maxHeight = '400px';
        panel.style.overflowY = 'auto';
        panel.style.fontFamily = 'Arial, sans-serif';
        panel.innerHTML = `
            <a href="https://csgo2.wiki?from=jianloudashi-plugin" target="_blank"><strong>【csgo2.wiki特殊模板捡漏大师】</strong></a>
            <br><br>
            <strong>捡漏历史记录:</strong>
            <div id="paintseedList"></div>
            <button id="clearPaintseeds" style="margin-top: 10px; background-color: #ff6b6b; color: #fff; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">清除历史记录</button>
            <br><br>
            <strong>目标捡漏模板id（默认沙鹰热处理）:</strong>
            <br>
            <input type="text" id="paintseedInput" placeholder="输入 paintseed" style="width: 100%; margin-top: 10px; padding: 5px; border-radius: 5px; border: 1px solid #ccc;">
            <button id="updatePaintseeds" style="margin-top: 10px; background-color: #4CAF50; color: #fff; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">更新目标模板</button>
            <br><br>
            <strong>自动操作:</strong>
            <br>
            <button id="toggleRefresh" style="margin-top: 10px; background-color: #3498db; color: #fff; border: none; padding: 5px 10px; border-radius: 5px; cursor: pointer;">刷新直到有漏</button>
        `;
        document.body.appendChild(panel);

        const paintseedDisplay = document.getElementById('paintseedList');
        const clearButton = document.getElementById('clearPaintseeds');
        const updateButton = document.getElementById('updatePaintseeds');
        const paintseedInput = document.getElementById('paintseedInput');
        const toggleRefreshButton = document.getElementById('toggleRefresh');

        let highlightedPaintseeds = new Set(JSON.parse(localStorage.getItem('highlightedPaintseeds') || '[]'));
        updatePanel();

        function extractPaintseed(tr) {

            const dataAssetInfo = tr.getAttribute('data-asset-info');
            if (dataAssetInfo) {
                try {
                    const assetInfo = JSON.parse(dataAssetInfo.replace(/&quot;/g, '"'));
                    if (assetInfo.info && typeof assetInfo.info.paintseed === 'number') {
                        console.log('提取 paintseed 函数结束');
                        return assetInfo.info.paintseed;
                    }
                } catch (e) {
                    console.error('解析 data-asset-info 失败:', e);
                }
            }

            return null;
        }

        function processTRElements() {

            const trElements = document.querySelectorAll('tr');
            let found = false;
            trElements.forEach(tr => {
                const paintseed = extractPaintseed(tr);
                if (paintseed !== null && paintseedList.has(paintseed)) {
                    tr.style.backgroundColor = 'yellow';
                    tr.style.fontWeight = 'bold';
                    highlightedPaintseeds.add(paintseed);
                    found = true;
                }
            });
            updatePanel();

            if (found) {
                playAudioNotification();
            }


            return found;
        }

        function updatePanel() {

            paintseedDisplay.textContent = Array.from(highlightedPaintseeds).join(', ');
            paintseedInput.value = Array.from(paintseedList).join(', ');
            localStorage.setItem('highlightedPaintseeds', JSON.stringify(Array.from(highlightedPaintseeds)));

        }

        clearButton.addEventListener('click', () => {

            highlightedPaintseeds.clear();
            updatePanel();

        });

        updateButton.addEventListener('click', () => {

            const inputValues = paintseedInput.value
            .replace(/，|、|\s+/g, ',')
            .split(',')
            .map(item => item.trim())
            .filter(item => item !== '')
            .map(Number)
            .filter(n => !isNaN(n));

            if (inputValues.length > 0) {
                paintseedList = new Set(inputValues);
                highlightedPaintseeds.clear();
                processTRElements();
                updatePanel();
                localStorage.setItem('paintseedList', JSON.stringify(Array.from(paintseedList)));
            } else {
                console.warn("输入无效，请检查格式。");
            }

        });

        toggleRefreshButton.addEventListener('click', () => {

            if (refreshIntervalId) {
                clearInterval(refreshIntervalId);
                refreshIntervalId = null;
                toggleRefreshButton.textContent = "刷新直到有漏";
                localStorage.setItem('refreshActive', 'false');

            } else {
                refreshIntervalId = setInterval(() => {
                    if (!processTRElements()) {

                        location.reload();
                    } else {
                        clearInterval(refreshIntervalId);
                        refreshIntervalId = null;
                        toggleRefreshButton.textContent = "刷新直到有漏";
                        localStorage.setItem('refreshActive', 'false');

                    }
                }, 5000);
                toggleRefreshButton.textContent = "停止刷新";
                localStorage.setItem('refreshActive', 'true');

            }

        });

        processTRElements();

        const observer = new MutationObserver((mutations) => {

            mutations.forEach((mutation) => {
                if (mutation.type === 'childList') {
                    processTRElements();
                }
            });

        });

        observer.observe(document.body, { childList: true, subtree: true });



        if (localStorage.getItem('refreshActive') === 'true') {
            toggleRefreshButton.click();
        }

        function playAudioNotification() {

            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();

            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(440, audioContext.currentTime);
            gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);

            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 1);

        }
    });
})();
