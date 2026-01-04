// ==UserScript==
// @name         Amazon ASIN 市场价标记（List Price2025年7月29日）
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  自动跳转 ASIN 页面，提取市场价 List Price（避免重复显示）+ 当前价 + Excel 导入 + 智能跳转 + 导出结果 CSV
// @author       Hayln
// @match        https://www.amazon.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/534052/Amazon%20ASIN%20%E5%B8%82%E5%9C%BA%E4%BB%B7%E6%A0%87%E8%AE%B0%EF%BC%88List%20Price2025%E5%B9%B47%E6%9C%8829%E6%97%A5%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/534052/Amazon%20ASIN%20%E5%B8%82%E5%9C%BA%E4%BB%B7%E6%A0%87%E8%AE%B0%EF%BC%88List%20Price2025%E5%B9%B47%E6%9C%8829%E6%97%A5%EF%BC%89.meta.js
// ==/UserScript==

(function () {
    'use strict';

    let asinList = [];
    let currentIndex = 0;
    let results = [];
    let isPaused = false;

    function saveCsv() {
        const csvContent = "ASIN,市场价,可售价\n" + results.map(row => row.join(",")).join("\n");
        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `asin_price_result_${new Date().toISOString().slice(0,10)}.csv`;
        link.click();
    }

    function createPanel() {
        if (document.getElementById('asin-checker-panel')) return;

        const panel = document.createElement('div');
        panel.innerHTML = `
            <div id="asin-checker-panel" style="position:fixed; top:100px; right:20px; z-index:99999; background:#fff; border:1px solid #ccc; padding:15px; width:300px; font-size:14px;">
                <h3 style="margin:0 0 10px;">ASIN 市场价检查</h3>
                <textarea id="asin-input" style="width:100%; height:100px;" placeholder="一行一个 ASIN"></textarea>
                <br>
                <input type="file" id="file-input" accept=".xlsx,.xls" style="margin-top:10px;">
                <br><br>
                <button id="start-check" style="padding:6px 12px;">开始检查</button>
                <button id="pause-check" style="padding:6px 12px; margin-top:5px;">暂停检测</button>
                <div id="progress-bar" style="margin-top:10px; background:#eee; height:15px; border-radius:5px;">
                    <div id="progress-fill" style="height:15px; background:#4caf50; width:0%; border-radius:5px;"></div>
                </div>
                <pre id="result-box" style="max-height:200px; overflow:auto; margin-top:10px;"></pre>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('start-check').onclick = function () {
            asinList = document.getElementById('asin-input').value.trim().split(/\r?\n/).map(x => x.trim()).filter(x => x);
            if(asinList.length === 0){
                alert('请输入至少一个ASIN');
                return;
            }
            currentIndex = 0;
            results = [];
            isPaused = false;
            sessionStorage.setItem('asinList', JSON.stringify(asinList));
            sessionStorage.setItem('currentIndex', '0');
            sessionStorage.setItem('results', JSON.stringify([]));
            jumpToAsin();
        };

        document.getElementById('pause-check').onclick = function () {
            isPaused = !isPaused;
            this.textContent = isPaused ? '继续检测' : '暂停检测';
            if (!isPaused && currentIndex < asinList.length) {
                jumpToAsin();
            }
        };

        document.getElementById('file-input').addEventListener('change', function (e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function (evt) {
                    const data = evt.target.result;
                    const workbook = XLSX.read(data, { type: 'binary' });
                    const sheetName = workbook.SheetNames[0];
                    const worksheet = workbook.Sheets[sheetName];
                    const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                    const extracted = json.map(row => row[0]).filter(x => typeof x === 'string' && x.trim());
                    document.getElementById('asin-input').value = extracted.join('\n');
                };
                reader.readAsBinaryString(file);
            }
        });
    }

    function jumpToAsin() {
        if (isPaused) return;
        if (currentIndex < asinList.length) {
            const asin = asinList[currentIndex];
            const url = `https://www.amazon.com/dp/${asin}`;
            window.location.href = url;
        } else {
            alert('全部完成，自动导出结果！');
            saveCsv();
            sessionStorage.clear();
        }
    }

    function updateProgress() {
        const progressFill = document.getElementById('progress-fill');
        if (progressFill) {
            progressFill.style.width = `${(currentIndex / asinList.length) * 100}%`;
        }
        const resultBox = document.getElementById('result-box');
        if (resultBox) {
            resultBox.textContent += `完成 ${currentIndex} / ${asinList.length}\n`;
            resultBox.scrollTop = resultBox.scrollHeight;
        }
    }

    function checkPageWhenReady() {
        asinList = JSON.parse(sessionStorage.getItem('asinList') || '[]');
        currentIndex = parseInt(sessionStorage.getItem('currentIndex') || '0', 10);
        results = JSON.parse(sessionStorage.getItem('results') || '[]');

        if (asinList.length === 0 || currentIndex >= asinList.length) return;

        const asin = asinList[currentIndex];
        console.log(`检查 ASIN: ${asin}`);

        const maxWait = 5000;
        const interval = 200;
        let waited = 0;

        const timer = setInterval(() => {
            if (document.readyState !== "complete") {
                waited += interval;
                if (waited >= maxWait) {
                    clearInterval(timer);
                    console.warn("页面加载超时，刷新重试");
                    location.reload();
                }
                return;
            }

            let pageNotFound = false;
            try {
                pageNotFound = document.querySelector("h1.a-spacing-small.a-spacing-top-small")?.innerText.includes('Sorry') ||
                              !!document.querySelector("img[src*='g-404']");
            } catch(e) {}

            if (pageNotFound) {
                clearInterval(timer);
                results.push([asin, "页面不存在/404", ""]);
                sessionStorage.setItem("results", JSON.stringify(results));
                currentIndex += 1;
                sessionStorage.setItem("currentIndex", currentIndex.toString());
                updateProgress();
                setTimeout(jumpToAsin, 200);
                return;
            }

            let listPrice = "没有市场价";
            try {
                const priceElement = document.querySelector("span.a-price.a-text-price");
                if (priceElement) {
                    const parentText = (priceElement.closest("span.basisPrice, div.basisPrice, div") || priceElement.parentElement)?.innerText || "";
                    if (parentText.includes("List Price")) {
                        const rawText = priceElement.innerText.trim().replace(/\n/g, " ");
                        const match = rawText.match(/\$\d+(\.\d{2})?/);
                        listPrice = match ? match[0] : rawText;
                    }
                }
            } catch (e) {
                listPrice = `出错: ${e.message}`;
            }

            const currentEl = document.querySelector("#priceblock_dealprice") ||
                              document.querySelector("#priceblock_ourprice") ||
                              document.querySelector("#corePrice_feature_div span.a-offscreen");
            const currentPrice = currentEl?.textContent.trim() || "无可售价";

            if (listPrice || currentPrice) {
                clearInterval(timer);
                results.push([asin, listPrice, currentPrice]);
                sessionStorage.setItem("results", JSON.stringify(results));
                currentIndex += 1;
                sessionStorage.setItem("currentIndex", currentIndex.toString());
                updateProgress();
                setTimeout(jumpToAsin, 200);
            }

            waited += interval;
            if (waited >= maxWait) {
                clearInterval(timer);
                console.warn("页面加载超时，刷新重试");
                location.reload();
            }
        }, interval);
    }

    function loadXlsxLibrary() {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js';
        script.onload = () => {
            console.log('XLSX库已加载');
            createPanel(); // ✅ 始终创建控制面板
            if (window.location.href.includes('/dp/')) {
                checkPageWhenReady();
            }
        };
        document.body.appendChild(script);
    }

    window.addEventListener('load', loadXlsxLibrary);
})();
