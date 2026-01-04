// ==UserScript==
// @name         Torn Buy-Mug Helper v2
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Enhanced Torn user profile data fetcher with improved organization
// @match        https://www.torn.com/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/523679/Torn%20Buy-Mug%20Helper%20v2.user.js
// @updateURL https://update.greasyfork.org/scripts/523679/Torn%20Buy-Mug%20Helper%20v2.meta.js
// ==/UserScript==

// Config object to store constants and settings
const CONFIG = {
    API_BASE_URL: 'https://torn-scripts.jacobbuckingham.com/api/TornProfile',
    PROCESS_COOLDOWN: 1000,
    MAX_SEARCH_DEPTH: 5,
    ELEMENT_CHECK_ATTEMPTS: 10,
    STYLES: {
        URGENT: {
            color: '#FFD700',
            background: 'rgba(255,215,0,0.1)'
        },
        NORMAL: {
            color: '#FF5722',
            background: 'rgba(255,87,34,0.1)'
        }
    }
};

// Storage Service for handling cookies
class StorageService {
    static getCookie(name) {
        const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'));
        return match ? decodeURIComponent(match[2]) : null;
    }

    static setCookie(name, value, days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        document.cookie = `${name}=${value};expires=${date.toUTCString()};path=/`;
    }

    static getStoredValues() {
        return {
            apiKey: this.getCookie('tornBuyMugApiKey'),
            minAmount: this.getCookie('tornBuyMugMinAmount'),
            subscription: this.getCookie('tornBuyMugSubscription') === 'true'
        };
    }
}

// API Service for handling API requests
class ApiService {
    static async checkSubscription(userId, apiKey) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: `${CONFIG.API_BASE_URL}/CheckSubscription/${userId}`,
                headers: {
                    'accept': '*/*',
                    'X-API-Key': apiKey
                },
                onload: response => {
                    if (response.status === 200) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject(new Error(`API Error: ${response.status}`));
                    }
                },
                onerror: error => reject(error)
            });
        });
    }

    static async getUserDetails(userId, targetUserIds, apiKey) {
        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'POST',
                url: `${CONFIG.API_BASE_URL}/GetUserDetails/${userId}`,
                headers: {
                    'accept': '*/*',
                    'X-API-Key': apiKey,
                    'Content-Type': 'application/json'
                },
                data: JSON.stringify(targetUserIds),
                onload: response => {
                    if (response.status === 200) {
                        resolve(JSON.parse(response.responseText));
                    } else {
                        reject(new Error(`API Error: ${response.status}`));
                    }
                },
                onerror: error => reject(error)
            });
        });
    }
}

// UI Service for handling DOM manipulations
class UiService {
    static addGlobalStyles() {
        const css = `
            .userInfoWrapper___B2a2P { width: 240px !important; }
            .rowWrapper___me3Ox { height: 55px !important; }
            .flexCenter___bV1QP { width: 100%; }
        `;
        const styleElement = document.createElement('style');
        styleElement.textContent = css;
        document.head.appendChild(styleElement);
    }

    static createSubscriptionIcon(isActive) {
        return `<svg width="16px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 244.948 244.948" fill="${isActive ? 'green' : 'red'}">
            <!-- SVG path data -->
        </svg>`;
    }

    static createControlPanel(isSubscriptionActive) {
        const template = `
            <div id="api-key" class="collapsible compact" style="margin:2px 0;">
                <!-- Control panel HTML -->
            </div>
        `;
        return template;
    }

    static highlightPlayer(element, total, stats, minutesRemaining) {
        const style = minutesRemaining <= 10 ? CONFIG.STYLES.URGENT : CONFIG.STYLES.NORMAL;
        const infoBox = element.parentElement.parentElement;
        
        const totalDisplay = document.createElement('div');
        Object.assign(totalDisplay.style, {
            color: style.color,
            fontWeight: 'bold',
            padding: '2px',
            margin: '2px 2px 2px 18px',
            border: `1px solid ${style.color}`,
            borderRadius: '4px',
            backgroundColor: style.background,
            fontSize: '10px'
        });
        
        totalDisplay.textContent = `$${total.toLocaleString()} L: ${stats.level} A:${stats.age} X: ${stats.xan} R: ${stats.refil}`;
        infoBox.appendChild(totalDisplay);

        Object.assign(element.style, {
            backgroundColor: style.background,
            border: `1px solid ${style.color}`,
            borderRadius: '4px',
            padding: '2px 5px'
        });
    }
}

// Market Service for handling market data extraction
class MarketService {
    static extractUserId(href) {
        const match = href.match(/XID=(\d+)|\/profiles\.php\?XID=(\d+)/);
        return match ? (match[1] || match[2]) : null;
    }

    static extractMarketInfo(element) {
        let container = element.closest('[class*="item-market-link"]') || element.parentElement;
        let searchDepth = 0;

        while (container && searchDepth < CONFIG.MAX_SEARCH_DEPTH) {
            const priceElement = container.querySelector('.price___Uwiv2');
            const availableElement = container.querySelector('.available___xegv_');

            if (priceElement || availableElement) {
                const price = priceElement ? 
                    parseInt(priceElement.textContent.replace(/[$,]/g, '')) : null;
                const available = availableElement ?
                    parseInt(availableElement.textContent.replace(' available', '')) : null;

                return { price, available };
            }

            container = container.parentElement;
            searchDepth++;
        }

        return { price: null, available: null };
    }
}

// Main application class
class TornBuyMugHelper {
    constructor() {
        this.lastProcessedTime = 0;
        this.userId = this.getUserId();
        this.storedValues = StorageService.getStoredValues();
    }

    getUserId() {
        const userElement = document.querySelector('#torn-user');
        return userElement ? JSON.parse(userElement.value).id : null;
    }

    async initialize() {
        UiService.addGlobalStyles();
        this.insertControlPanel();
        this.attachEventListeners();
        this.watchBuyButtons();
        await this.processElements();
    }

    insertControlPanel() {
        const firstBlock = document.querySelector('.sidebar___xipSp .sidebar-block___Ef1l1.desktop___aYLqo');
        if (firstBlock) {
            firstBlock.insertAdjacentHTML('afterend', 
                UiService.createControlPanel(this.storedValues.subscription));
        }
    }

    attachEventListeners() {
        // Event listener implementation
    }

    watchBuyButtons() {
        document.addEventListener('click', e => {
            const buyButton = e.target.closest('.actionButton___pb_Da');
            if (buyButton?.querySelector('.title___Zkrpo')?.textContent === 'Buy Item') {
                setTimeout(() => this.waitForElements(), 500);
            }
        });
    }

    async processElements() {
        if (Date.now() - this.lastProcessedTime < CONFIG.PROCESS_COOLDOWN) return;
        this.lastProcessedTime = Date.now();

        const elements = document.querySelectorAll('a.linkWrap___ZS6r9.flexCenter___bV1QP');
        const elementMap = new Map();
        const userIds = [];

        for (const element of elements) {
            const userId = MarketService.extractUserId(element.href);
            const { price, available } = MarketService.extractMarketInfo(element);
            const total = price * available;

            if (total >= this.storedValues.minAmount && userId) {
                userIds.push(userId);
                elementMap.set(userId, { element, total });
            }
        }

        if (userIds.length > 0) {
            try {
                const userDetails = await ApiService.getUserDetails(
                    this.userId, userIds, this.storedValues.apiKey);
                
                userDetails.forEach(stats => {
                    const elementInfo = elementMap.get(stats.tornUserId);
                    if (elementInfo) {
                        UiService.highlightPlayer(
                            elementInfo.element,
                            elementInfo.total,
                            {
                                level: stats.level,
                                age: stats.age,
                                xan: stats.xanax,
                                refil: stats.refills
                            },
                            stats.hospitaltimeremaining
                        );
                    }
                });
            } catch (error) {
                console.error('Failed to process elements:', error);
            }
        }
    }

    waitForElements(attempts = 0) {
        if (attempts >= CONFIG.ELEMENT_CHECK_ATTEMPTS) return;
        
        const elements = document.querySelectorAll('a.linkWrap___ZS6r9.flexCenter___bV1QP');
        if (elements.length > 0) {
            this.processElements();
        } else {
            setTimeout(() => this.waitForElements(attempts + 1), 1000);
        }
    }
}

// Initialize the application
(function() {
    'use strict';
    const app = new TornBuyMugHelper();
    app.initialize().catch(console.error);
})();