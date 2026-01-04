// ==UserScript==
// @name         TradingView Alert Log Sender + Trade + Copy + Parse
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  Gửi alert từ TradingView và thêm nút gửi lệnh, copy alert cụ thể + cải thiện UI
// @match        https://in.tradingview.com/chart/HXwLtsLc/*
// @grant        GM_xmlhttpRequest
// @license huytq1976@gmail.com
// @downloadURL https://update.greasyfork.org/scripts/545246/TradingView%20Alert%20Log%20Sender%20%2B%20Trade%20%2B%20Copy%20%2B%20Parse.user.js
// @updateURL https://update.greasyfork.org/scripts/545246/TradingView%20Alert%20Log%20Sender%20%2B%20Trade%20%2B%20Copy%20%2B%20Parse.meta.js
// ==/UserScript==


(function () {
    'use strict';

    const CHECK_INTERVAL = 1000;

    function getAlertItems() {
        return document.querySelectorAll('[data-name="alert-log-item"]');
    }

    function injectMainSendButton() {
        if (document.getElementById('send-all-alerts-btn')) return; // tránh trùng

        const btn = document.createElement("button");
        btn.id = 'send-all-alerts-btn';
        btn.innerText = "📤";
        btn.title = "Gửi tất cả alert logs";
        Object.assign(btn.style, {
            position: "fixed",
            bottom: "80px",
            right: "10px",
            zIndex: 9999,
            padding: "6px 8px",
            backgroundColor: "#28a745",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            fontSize: "12px",
            cursor: "pointer",
        });

        btn.onclick = () => {
            const items = getAlertItems();
            const logs = Array.from(items).map(item => {
                const msg = item.querySelector(".message-PQUvhamm");
                return msg?.innerText.trim() || "EMPTY";
            });

            GM_xmlhttpRequest({
                method: "POST",
                url: "http://localhost:8080/alert",
                headers: { "Content-Type": "application/json" },
                data: JSON.stringify({ logs }),
                onload: () => alert("✅ Gửi toàn bộ logs thành công!"),
                onerror: () => alert("❌ Gửi thất bại (GM error)")
            });
        };

        document.body.appendChild(btn);
    }

    function parseAlertToJSON(text) {
        try {
            if (text.trim().startsWith("{")) return JSON.parse(text);

            if (text.includes("ACTION:") && text.includes("SYMBOL:")) {
                const parts = text.split(/\s+(?=\w+:)/);
                const obj = {};
                parts.forEach(pair => {
                    const [k, ...rest] = pair.split(":");
                    let v = rest.join(":").trim();
                    if (!isNaN(v)) v = parseFloat(v);
                    obj[k.toLowerCase()] = v;
                });
                return obj;
            }

            if (text.match(/Close Position .*\|.*@\[.*\]/)) {
                const match = text.match(/\|\s*(\w+)@\[(\d+\.?\d*)\]/);
                return {
                    action: "close",
                    symbol: match?.[1] || null,
                    price: match?.[2] ? parseFloat(match[2]) : null
                };
            }

            if (text.includes("Market:") && text.includes("Symbol:")) {
                const obj = {};
                text.split("|").forEach(part => {
                    const [k, v] = part.split(":");
                    if (k && v) obj[k.trim().toLowerCase()] = v.trim();
                });
                return obj;
            }

            return { raw: text };
        } catch (e) {
            return { raw: text, error: e.message };
        }
    }

    function copyToClipboard(text) {
        navigator.clipboard.writeText(text)
            .then(() => alert("📋 Copied!"))
            .catch(() => alert("❌ Cannot copy."));
    }

    function injectPerAlertButtons() {
        const alerts = getAlertItems();
        const buttonStyle = {
            marginLeft: "6px",
            cursor: "pointer",
            background: "transparent",
            border: "none",
            fontSize: "16px",
            color: "#007bff"
        };

        alerts.forEach(item => {
            if (item.querySelector('.sendTradeButton')) return;

            const buttonZone = item.querySelector('.overlayButtons-ucBqatk5') || item;
            const msg = item.querySelector(".message-PQUvhamm")?.innerText.trim();
            if (!msg) return;

            const parsed = parseAlertToJSON(msg);

            const tradeBtn = document.createElement("button");
            tradeBtn.innerText = "🚀";
            tradeBtn.className = "sendTradeButton";
            Object.assign(tradeBtn.style, buttonStyle);
            tradeBtn.title = "Gửi alert này (trade)";
            tradeBtn.onclick = () => {
                const symbol = parsed.symbol || parsed.market || 'unknown';
                const direction = parsed.action || 'unknown';
                if (!confirm(`Gửi lệnh \"${direction}\" cho \"${symbol}\"?`)) return;

                GM_xmlhttpRequest({
                    method: "POST",
                    url: "http://localhost:8080/alert",
                    headers: { "Content-Type": "application/json" },
                    data: JSON.stringify({ logs: [msg], parsed }),
                    onload: () => alert(`✅ Đã gửi lệnh \"${direction}\" cho \"${symbol}\"`),
                    onerror: () => alert("❌ Gửi thất bại")
                });
            };

            const copyBtn = document.createElement("button");
            copyBtn.innerText = "📋";
            Object.assign(copyBtn.style, buttonStyle);
            copyBtn.title = "Copy alert gốc";
            copyBtn.onclick = () => copyToClipboard(msg);

            const copyParsedBtn = document.createElement("button");
            copyParsedBtn.innerText = "🔐";
            Object.assign(copyParsedBtn.style, buttonStyle);
            copyParsedBtn.title = "Copy alert JSON";
            copyParsedBtn.onclick = () => copyToClipboard(JSON.stringify(parsed, null, 2));

            buttonZone.appendChild(tradeBtn);
            buttonZone.appendChild(copyBtn);
            buttonZone.appendChild(copyParsedBtn);
        });
    }

    const initInterval = setInterval(() => {
        const alerts = getAlertItems();
        if (alerts.length > 0) {
            clearInterval(initInterval);
            injectMainSendButton();
        }
    }, CHECK_INTERVAL);

    setInterval(injectPerAlertButtons, CHECK_INTERVAL);
})();
