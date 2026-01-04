// ==UserScript==
// @name         币安盯盘助手
// @namespace    http://tampermonkey.net/
// @version      1.8.6
// @description  使用WebSocket实时显示多个币安交易对价格及24小时涨跌幅。
// @author       Grok
// @match        *://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @licens       MII
// @downloadURL https://update.greasyfork.org/scripts/529171/%E5%B8%81%E5%AE%89%E7%9B%AF%E7%9B%98%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/529171/%E5%B8%81%E5%AE%89%E7%9B%AF%E7%9B%98%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(() => {
    'use strict';

    const CONFIG = {
        WS_URL: 'wss://stream.binance.com:9443/ws',
        RECONNECT_DELAY: 2000,
        INITIAL_TOP: 15,
        INITIAL_RIGHT: 15,
        WIDTH: 200,
        PADDING: 12,
        DEFAULT_PAIRS: ['ethusdt'],
        MAX_PAIRS: 10,
        STORAGE_KEY: 'binance_tracker_pairs'
    };

    if (document.getElementById('price-tracker')) return;

    const utils = {
        savePairs: pairs => GM_setValue(CONFIG.STORAGE_KEY, JSON.stringify(pairs)),
        loadPairs: () => JSON.parse(GM_getValue(CONFIG.STORAGE_KEY) || JSON.stringify(CONFIG.DEFAULT_PAIRS))
    };

    const ui = {
        wsSubscriptions: new Map(),
        isDragging: false,
        offsetX: 0,
        offsetY: 0,

        init() {
            this.container = Object.assign(document.createElement('div'), {
                id: 'price-tracker',
                style: `top:${CONFIG.INITIAL_TOP}px;right:${CONFIG.INITIAL_RIGHT}px;min-width:${CONFIG.WIDTH}px;padding:${CONFIG.PADDING}px`
            });
            this.container.innerHTML = `
                <div class="header">
                    <span class="title">币安助手</span>
                    <span class="settings-btn">⚙️</span>
                </div>
                <div class="pairs-container"></div>
                <div class="settings-panel" style="display:none">
                    <input type="text" class="pair-input" placeholder="输入交易对 (如 btcusdt)">
                    <button class="add-pair-btn">添加</button>
                </div>
            `;

            this.settingsBtn = this.container.querySelector('.settings-btn');
            this.settingsPanel = this.container.querySelector('.settings-panel');
            this.pairsContainer = this.container.querySelector('.pairs-container');
            this.pairInput = this.settingsPanel.querySelector('.pair-input');
            this.addPairBtn = this.settingsPanel.querySelector('.add-pair-btn');

            document.body.appendChild(this.container);
            this.injectStyles();
            this.addEventListeners();
            utils.loadPairs().forEach(pair => this.addPair(pair));
        },

        injectStyles() {
            document.head.appendChild(Object.assign(document.createElement('style'), {
                textContent: `
                    #price-tracker{position:fixed;background:linear-gradient(145deg,#2d3236,#202529);border:1px solid rgba(255,255,255,0.05);border-radius:14px;box-shadow:0 10px 28px rgba(0,0,0,0.4),0 1px 4px rgba(0,0,0,0.3);z-index:9999;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;cursor:grab;user-select:none;overflow:hidden;backdrop-filter:blur(10px);animation:fadeIn 0.3s ease-out}
                    #price-tracker:hover{box-shadow:0 14px 36px rgba(0,0,0,0.45),0 2px 6px rgba(0,0,0,0.35);transition:box-shadow 0.2s ease}
                    .header{display:flex;justify-content:space-between;align-items:center;margin-bottom:10px}
                    .title{color:#f0b90b;font-size:20px;font-weight:600;letter-spacing:0.5px;text-shadow:0 1px 1px rgba(0,0,0,0.2)}
                    .settings-btn{font-size:px;color:#f0b90b;cursor:pointer;padding:4px;border-radius:50%;background:rgba(255,255,255,0.06);transition:all 0.25s cubic-bezier(0.4,0,0.2,1);box-shadow:0 1px 3px rgba(0,0,0,0.2)}
                    .settings-btn:hover{transform:rotate(90deg) scale(1.2);background:rgba(255,255,255,0.14);box-shadow:0 2px 5px rgba(0,0,0,0.25)}
                    .pairs-container{max-height:240px;overflow:hidden}
                    .pair-item{margin-bottom:12px;padding:8px;border-radius:10px;background:rgba(255,255,255,0.05);position:relative;transition:all 0.25s cubic-bezier(0.4,0,0.2,1);animation:slideIn 0.3s ease-out;box-shadow:0 1px 3px rgba(0,0,0,0.15)}
                    .pair-item:hover{background:rgba(255,255,255,0.08);box-shadow:0 3px 6px rgba(0,0,0,0.2)}
                    .remove-btn{position:absolute;top:6px;right:6px;font-size:12px;color:#ff6666;cursor:pointer;opacity:0;transition:all 0.25s cubic-bezier(0.4,0,0.2,1);background:rgba(255,102,102,0.12);border-radius:50%;width:18px;height:18px;display:flex;align-items:center;justify-content:center;box-shadow:0 1px 1px rgba(0,0,0,0.2)}
                    .pair-item:hover .remove-btn{opacity:1;transform:rotate(90deg)}
                    .remove-btn:hover{background:rgba(255,102,102,0.25);color:#ff8888;transform:rotate(180deg) scale(1.15)}
                    .price-header{display:flex;align-items:center;gap:8px;margin-bottom:6px}
                    .symbol{color:#f0b90b;font-size:14px;font-weight:700;text-transform:uppercase;letter-spacing:0.5px;text-shadow:0 1px 1px rgba(0,0,0,0.2)}
                    .price-container{display:flex;align-items:center;justify-content:space-between;gap:12px}
                    .price-value{color:#fff;font-weight:700;font-size:20px;letter-spacing:-0.5px;text-shadow:0 1px 3px rgba(0,0,0,0.3);transition:color 0.4s ease}
                    .price-value.updated-up{animation:pricePulseUp 0.4s ease-in-out}
                    .price-value.updated-down{animation:pricePulseDown 0.4s ease-in-out}
                    .change-24h{font-weight:600;font-size:13px;padding:4px 8px;border-radius:8px;background:rgba(255,255,255,0.08);box-shadow:inset 0 1px 2px rgba(0,0,0,0.15),0 1px 1px rgba(0,0,0,0.1);transition:all 0.25s cubic-bezier(0.4,0,0.2,1)}
                    .change-24h:hover{transform:scale(1.1);box-shadow:inset 0 1px 2px rgba(0,0,0,0.2),0 2px 3px rgba(0,0,0,0.15)}
                    .positive{color:#00ee00}.negative{color:#ff6666}
                    .price-time{color:#c0c8d0;font-size:11px;margin-top:6px;opacity:0.9;letter-spacing:0.3px;text-shadow:0 1px 1px rgba(0,0,0,0.15)}
                    .status-dot{background:#00ee00;border-radius:50%;width:8px;height:8px;box-shadow:0 0 4px rgba(0,238,0,0.7);animation:dotPulse 2s infinite cubic-bezier(0.4,0,0.6,1);flex-shrink:0}
                    .settings-panel{position:absolute;top:36px;right:${CONFIG.PADDING}px;background:#2d3236;border:1px solid rgba(255,255,255,0.07);border-radius:12px;padding:10px;box-shadow:0 6px 16px rgba(0,0,0,0.4);z-index:10000;backdrop-filter:blur(8px);opacity:0;transform:translateY(-8px);transition:all 0.3s cubic-bezier(0.4,0,0.2,1)}
                    .settings-panel.active{opacity:1;transform:translateY(0)}
                    .pair-input{padding:6px 10px;border:none;border-radius:8px;background:rgba(255,255,255,0.1);color:#fff;font-size:13px;margin-right:8px;outline:none;width:100px;transition:all 0.2s ease;box-shadow:0 1px 1px rgba(0,0,0,0.2)}
                    .pair-input:focus{background:rgba(255,255,255,0.16);transform:scale(1.03);box-shadow:0 2px 3px rgba(0,0,0,0.25)}
                    .pair-input::placeholder{color:#c0c8d0;opacity:0.75}
                    .add-pair-btn{padding:6px 12px;border:none;border-radius:8px;background:#f0b90b;color:#202529;font-weight:600;font-size:13px;cursor:pointer;transition:all 0.25s cubic-bezier(0.4,0,0.2,1);box-shadow:0 1px 4px rgba(240,185,11,0.35)}
                    .add-pair-btn:hover{background:#ffc107;transform:translateY(-2px) scale(1.06);box-shadow:0 3px 8px rgba(240,185,11,0.5)}
                    @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
                    @keyframes slideIn{from{opacity:0;transform:translateX(-8px)}to{opacity:1;transform:translateX(0)}}
                    @keyframes slideOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(-8px)}}
                    @keyframes pricePulseUp{0%{transform:scale(1);color:#fff}50%{transform:scale(1.06);color:#00ee00}100%{transform:scale(1);color:#fff}}
                    @keyframes pricePulseDown{0%{transform:scale(1);color:#fff}50%{transform:scale(1.06);color:#ff6666}100%{transform:scale(1);color:#fff}}
                    @keyframes dotPulse{0%{transform:scale(1);opacity:1;box-shadow:0 0 4px rgba(0,238,0,0.7)}50%{transform:scale(1.25);opacity:0.7;box-shadow:0 0 8px rgba(0,238,0,0.9)}100%{transform:scale(1);opacity:1;box-shadow:0 0 4px rgba(0,238,0,0.7)}}
                `
            }));
        },

        addEventListeners() {
            const handleDragStart = (e) => {
                if (!this.settingsPanel.contains(e.target) && e.button === 0) {
                    this.isDragging = true;
                    const rect = this.container.getBoundingClientRect();
                    this.offsetX = e.clientX - rect.left;
                    this.offsetY = e.clientY - rect.top;
                    this.container.style.cursor = 'grabbing';
                    e.preventDefault();
                }
            };

            const handleDragMove = (e) => {
                if (this.isDragging) {
                    const newLeft = Math.max(0, Math.min(e.clientX - this.offsetX, window.innerWidth - this.container.offsetWidth));
                    const newTop = Math.max(0, Math.min(e.clientY - this.offsetY, window.innerHeight - this.container.offsetHeight));
                    requestAnimationFrame(() => {
                        this.container.style.left = `${newLeft}px`;
                        this.container.style.top = `${newTop}px`;
                        this.container.style.right = 'auto';
                    });
                }
            };

            const handleDragEnd = () => {
                if (this.isDragging) {
                    this.isDragging = false;
                    this.container.style.cursor = 'grab';
                }
            };

            this.container.addEventListener('mousedown', handleDragStart);
            document.addEventListener('mousemove', handleDragMove);
            document.addEventListener('mouseup', handleDragEnd);

            this.settingsBtn.addEventListener('click', (e) => (e.stopPropagation(), this.toggleSettings()));
            this.addPairBtn.addEventListener('click', () => this.handleAddPair());
            this.pairInput.addEventListener('keypress', (e) => e.key === 'Enter' && this.handleAddPair());
            this.container.addEventListener('click', (e) => this.settingsPanel.contains(e.target) && e.stopPropagation());
        },

        addPair(pair) {
            if (this.wsSubscriptions.size >= CONFIG.MAX_PAIRS) return alert(`最多支持 ${CONFIG.MAX_PAIRS} 个交易对`);
            if (this.wsSubscriptions.has(pair)) return;

            const pairDiv = Object.assign(document.createElement('div'), { className: 'pair-item' });
            pairDiv.innerHTML = `
                <span class="remove-btn">✕</span>
                <div class="price-header"><span class="status-dot"></span><span class="symbol">${pair.toUpperCase()}</span></div>
                <div class="price-container"><span class="price-value">$--.--</span><span class="change-24h">--.--%</span></div>
                <div class="price-time">更新时间: --:--:--</div>
            `;

            pairDiv.querySelector('.remove-btn').addEventListener('click', (e) => (e.stopPropagation(), this.removePair(pair)));
            this.pairsContainer.appendChild(pairDiv);

            const elements = {
                priceValue: pairDiv.querySelector('.price-value'),
                change24h: pairDiv.querySelector('.change-24h'),
                priceTime: pairDiv.querySelector('.price-time'),
                statusDot: pairDiv.querySelector('.status-dot'),
                element: pairDiv,
                lastPrice: null
            };
            this.wsSubscriptions.set(pair, elements);

            priceTracker.subscribePair();
            this.savePairs();
        },

        removePair(pair) {
            const sub = this.wsSubscriptions.get(pair);
            if (sub) {
                sub.element.style.animation = 'slideOut 0.3s ease-in forwards';
                sub.element.addEventListener('animationend', () => {
                    sub.element.remove();
                    this.wsSubscriptions.delete(pair);
                    priceTracker.subscribePair();
                    this.savePairs();
                }, { once: true });
            }
        },

        handleAddPair() {
            const pair = this.pairInput.value.trim().toLowerCase();
            if (pair && !this.wsSubscriptions.has(pair)) {
                this.addPair(pair);
                this.pairInput.value = '';
            }
        },

        savePairs: () => utils.savePairs([...ui.wsSubscriptions.keys()]),

        updateDisplay(pair, price, change, time, status) {
            const sub = this.wsSubscriptions.get(pair);
            if (!sub) return;

            const currentPrice = parseFloat(price.replace('$', ''));
            if (sub.lastPrice !== null && currentPrice !== sub.lastPrice) {
                sub.priceValue.textContent = price;
                sub.priceValue.classList.remove('updated-up', 'updated-down');
                sub.priceValue.classList.add(currentPrice > sub.lastPrice ? 'updated-up' : 'updated-down');
                sub.priceValue.addEventListener('animationend', () => sub.priceValue.classList.remove('updated-up', 'updated-down'), { once: true });
            } else {
                sub.priceValue.textContent = price;
            }
            sub.lastPrice = currentPrice;

            sub.change24h.textContent = change;
            sub.change24h.classList.remove('positive', 'negative');
            if (change !== '--.--%') sub.change24h.classList.add(parseFloat(change) >= 0 ? 'positive' : 'negative');
            sub.priceTime.textContent = `更新时间: ${time}`;
            sub.statusDot.style.background = status === 'success' ? '#00ee00' : '#ff6666';
            sub.statusDot.style.boxShadow = status === 'success' ? '0 0 4px rgba(0,238,0,0.7)' : '0 0 4px rgba(255,102,102,0.7)';
        },

        toggleSettings() {
            const isVisible = this.settingsPanel.style.display !== 'none';
            this.settingsPanel.style.display = isVisible ? 'none' : 'block';
            this.settingsPanel.classList.toggle('active', !isVisible);
        }
    };

    const priceTracker = {
        ws: null,
        reconnectTimeout: null,

        connect() {
            if (this.ws) this.ws.close();
            const pairs = [...ui.wsSubscriptions.keys()];
            if (!pairs.length) return;

            this.ws = new WebSocket(`${CONFIG.WS_URL}/${pairs.join('@ticker/')}@ticker`);
            this.ws.onopen = () => ui.wsSubscriptions.forEach((_, pair) => ui.updateDisplay(pair, '$--.--', '--.--%', '已连接', 'success'));
            this.ws.onmessage = (event) => {
                try {
                    const data = JSON.parse(event.data);
                    ui.updateDisplay(data.s.toLowerCase(), `$${parseFloat(data.c).toFixed(2)}`, `${parseFloat(data.P).toFixed(2)}%`, new Date().toLocaleTimeString(), 'success');
                } catch (e) {
                    console.error('WebSocket data error:', e);
                }
            };
            this.ws.onerror = () => {
                ui.wsSubscriptions.forEach((_, pair) => ui.updateDisplay(pair, '错误', '--.--%', '连接失败', 'error'));
                this.reconnect();
            };
            this.ws.onclose = () => {
                ui.wsSubscriptions.forEach((_, pair) => ui.updateDisplay(pair, '断开', '--.--%', '等待重连', 'error'));
                this.reconnect();
            };
        },

        subscribePair: () => priceTracker.connect(),
        reconnect() {
            clearTimeout(this.reconnectTimeout);
            this.reconnectTimeout = setTimeout(() => !this.ws || this.ws.readyState !== WebSocket.OPEN && this.connect(), CONFIG.RECONNECT_DELAY);
        },
        start: () => ui.init(),
        stop: () => { if (this.ws) this.ws.close(); clearTimeout(this.reconnectTimeout); }
    };

    priceTracker.start();
    window.addEventListener('unload', priceTracker.stop);
})();