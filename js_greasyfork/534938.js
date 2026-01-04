// ==UserScript==
// @name 导出拼多多订单
// @namespace win.somereason.web.utils
// @version 1.0.1
// @description 这个脚本帮助你导出拼多多的订单列表页中的订单。基于GPT修改。
// @author Luoshen Seeker
// @match *://mobile.pinduoduo.com/orders.html*
// @icon  https://raw.githubusercontent.com/luoshenseeker/PDD_order_exporter/master/icon.png
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/534938/%E5%AF%BC%E5%87%BA%E6%8B%BC%E5%A4%9A%E5%A4%9A%E8%AE%A2%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/534938/%E5%AF%BC%E5%87%BA%E6%8B%BC%E5%A4%9A%E5%A4%9A%E8%AE%A2%E5%8D%95.meta.js
// ==/UserScript==

(function () {
// ===== 插入按钮和日志浮窗 =====
(function setupUI() {
    const exportDiv = document.createElement("div");
    exportDiv.id = "customExportBtn";
    exportDiv.style = "margin: 10px; text-align: center;";
    exportDiv.innerHTML = `
        <button id="exportOrdersBtn" style="background-color: #e2231a; color: white; border: none; padding: 8px 16px; border-radius: 5px;">
            导出订单CSV（自动滚动）
        </button>`;
    const placeholder = document.querySelector(".place-holder");
    if (placeholder && placeholder.parentNode) {
        placeholder.parentNode.insertBefore(exportDiv, placeholder.nextSibling);
    }

    const logBox = document.createElement("div");
    logBox.id = "floatingLogBox";
    logBox.style = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        width: 320px;
        max-height: 200px;
        overflow-y: auto;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        font-size: 14px;
        border-radius: 8px;
        padding: 10px;
        z-index: 9999;
    `;
    document.body.appendChild(logBox);

    window.logMessage = function (msg) {
        const line = document.createElement("div");
        line.innerText = `[${new Date().toLocaleTimeString()}] ${msg}`;
        logBox.appendChild(line);
        logBox.scrollTop = logBox.scrollHeight;
    };
})();

// ===== 自动滚动到底部后调用 callback =====
function autoScrollUntilDone(callback) {
    const interval = setInterval(() => {
        const doneText = document.querySelector('.loading-text');
        if (doneText && doneText.innerText.includes('您已经没有更多的订单了')) {
            logMessage("✅ 已滚动到底部");
            clearInterval(interval);
            setTimeout(callback, 1000);
        } else {
            window.scrollBy({ top: 1000, behavior: 'smooth' });
            logMessage("⬇️ 正在加载更多订单...");
        }
    }, 400);
}

// ===== 提取订单商品数据为 CSV 字符串 =====
function extractCSV() {
    logMessage("📦 正在提取商品信息...");

    let csv = `店铺名称,商品名称,商品型号,商品价格,订单状态,实付价格\n`;

    const orderItems = document.querySelectorAll(".U6SAh0Eo");
    orderItems.forEach(item => {
        try {
            const shopName = item.querySelector('[data-test="店铺名称"]')?.innerText.trim() || "";
            const productName = item.querySelector('[data-test="商品名称"]')?.innerText.trim() || "";
            const productModel = item.querySelector(".bJrhQPD0")?.innerText.trim() || "";
            const price = item.querySelector('[data-test="商品价格"]')?.innerText.replace("￥", "").trim() || "";
            const status = item.querySelector('[data-test="订单状态"]')?.innerText.trim() || "";
            const paid = item.querySelector(".pdcOje4N")?.innerText.replace("￥", "").trim() || "";

            csv += `${shopName},${productName},${productModel},${price},${status},${paid}\n`;
        } catch (e) {
            logMessage("⚠️ 某订单项提取失败，已跳过");
        }
    });

    logMessage("📄 商品信息提取完成");
    return csv;
}

// ===== 下载 CSV 文件 =====
function downloadCSV(filename, content) {
    const blob = new Blob(['\uFEFF' + content], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }, 100);
}

// ===== 点击事件绑定 =====
document.getElementById("exportOrdersBtn").addEventListener("click", function () {
    logMessage("🚀 开始自动滚动订单列表...");
    autoScrollUntilDone(() => {
        const csv = extractCSV();
        const fileName = `PDD_商品信息_${new Date().toISOString().slice(0,10)}.csv`;
        downloadCSV(fileName, csv);
        logMessage("✅ 已导出 CSV 文件");
    });
});

})();
