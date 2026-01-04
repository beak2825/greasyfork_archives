// ==UserScript==
// @name         GigaB2B Package Size Extractor with Volume Calculation
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  提取并复制Package Size信息，自动计算体积（长*宽*高）并换行显示体积结果
// @author       lin lin
// @match        https://www.gigab2b.com/index.php?route=product/product&product_id=*
// @grant        GM_setClipboard
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/543735/GigaB2B%20Package%20Size%20Extractor%20with%20Volume%20Calculation.user.js
// @updateURL https://update.greasyfork.org/scripts/543735/GigaB2B%20Package%20Size%20Extractor%20with%20Volume%20Calculation.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function createUI(content = 'Loading...') {
        const panel = document.createElement('div');
        panel.id = 'pkg-size-panel';
        panel.innerHTML = `
            <div style="position:fixed;bottom:60px;right:20px;z-index:9999;background:#fff;border:2px solid #4CAF50;border-radius:8px;padding:10px;box-shadow:0 2px 10px rgba(0,0,0,0.2);width:360px;font-family:sans-serif;">
                <div style="font-weight:bold;font-size:16px;margin-bottom:8px;color:#4CAF50;">📦 Package Size Info</div>
                <pre id="pkg-content" style="white-space:pre-wrap;font-size:13px;max-height:300px;overflow:auto;margin-bottom:10px;">${content}</pre>
                <button id="pkg-copy-btn" style="background:#4CAF50;color:#fff;padding:6px 12px;border:none;border-radius:4px;cursor:pointer;">📋 Copy</button>
            </div>
        `;
        document.body.appendChild(panel);

        document.getElementById('pkg-copy-btn').onclick = () => {
            const text = document.getElementById('pkg-content').innerText;
            GM_setClipboard(text);
            document.getElementById('pkg-copy-btn').innerText = "✅ Copied!";
            setTimeout(() => {
                document.getElementById('pkg-copy-btn').innerText = "📋 Copy";
            }, 1500);
        };
    }

    // 计算体积函数，传入尺寸字符串，返回体积字符串（无括号）
    function calculateVolume(sizeStr) {
        const regex = /([\d.]+)\s*\*\s*([\d.]+)\s*\*\s*([\d.]+)/;
        const match = sizeStr.match(regex);
        if (!match) return '';

        const [_, l, w, h] = match;
        const volume = (parseFloat(l) * parseFloat(w) * parseFloat(h));
        if (isNaN(volume)) return '';
        return `Volume: ${volume.toFixed(2)}`;
    }

    function extractPackageSize() {
        const pkgRoot = Array.from(document.querySelectorAll("span"))
            .find(span => span.textContent.trim() === "Package Size")
            ?.closest("div.mt-16px");

        if (!pkgRoot) return "Package Size section not found.";

        const entries = pkgRoot.querySelectorAll("div.color-\\#333333");
        const result = [];

        entries.forEach(entry => {
            const spans = entry.querySelectorAll("span");
            if (spans.length < 3) return;

            const subItem = spans[0].innerText.trim();
            const quantity = spans[1].innerText.trim();
            const sizeRaw = spans[2].innerText.trim().replace(/\s+/g, ' ');

            const volumeStr = calculateVolume(sizeRaw);

            const line = `${subItem}\n${quantity}\n${sizeRaw}\n(${volumeStr})`;
            result.push(line);
        });

        return result.join("\n\n");
    }

    function waitForData(retries = 20) {
        const check = () => {
            const data = extractPackageSize();
            if (!data || data.includes("not found")) {
                if (retries > 0) setTimeout(() => waitForData(retries - 1), 500);
                return;
            }
            createUI(data);
        };
        check();
    }

    waitForData();
})();
