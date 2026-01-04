// ==UserScript==
// @name         JetLend Helper
// @namespace https://greasyfork.org/users/1256967
// @version      1.1.2
// @description  Расширенный функционал для работы с платформой JetLend
// @author       Your Name
// @match        *://jetlend.ru/*
// @icon         https://jetlend.ru/static/favicon.ico
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_notification
// @connect      jetlend.ru
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486399/JetLend%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/486399/JetLend%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG = {
        UPDATE_INTERVAL: 10000,
        DEFAULT_FILTERS: {
            minInterest: 18,
            minYTM: 30,
            maxTerm: 720,
            maxDebt: 200000,
            minDiscipline: 0.8
        },
        STYLES: `
            .jl-helper-container {
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 9999;
                background: white;
                padding: 15px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                max-width: 800px;
                font-family: Arial, sans-serif;
            }
            .jl-section {
                margin: 10px 0;
                padding: 10px;
                border: 1px solid #eee;
                border-radius: 5px;
            }
            .jl-table {
                width: 100%;
                border-collapse: collapse;
                margin: 10px 0;
            }
            .jl-table th, .jl-table td {
                padding: 8px;
                border: 1px solid #ddd;
                text-align: center;
            }
            .jl-highlight {
                background-color: #e6ffe6 !important;
            }
            .jl-warning {
                background-color: #ffe6e6 !important;
            }
            .jl-controls {
                display: grid;
                grid-template-columns: repeat(3, 1fr);
                gap: 10px;
                margin: 10px 0;
            }
            .jl-filter-input {
                width: 100%;
                padding: 5px;
            }
        `
    };

    class JetLendHelper {
        constructor() {
            this.state = {
                userData: null,
                primaryMarket: [],
                secondaryMarket: [],
                filters: JSON.parse(JSON.stringify(CONFIG.DEFAULT_FILTERS)),
                notifications: []
            };
        }

        init() {
            this.loadFilters();
            this.injectStyles();
            this.createUI();
            this.loadData();
            this.setupEventListeners();
            this.startAutoUpdate();
        }

        loadFilters() {
            const savedFilters = GM_getValue('filters');
            if (savedFilters) {
                this.state.filters = savedFilters;
            }
        }

        injectStyles() {
            GM_addStyle(CONFIG.STYLES);
        }

        createUI() {
            const container = document.createElement('div');
            container.className = 'jl-helper-container';
            container.innerHTML = `
                <h2>JetLend Helper</h2>
                <div class="jl-controls">
                    <button id="jl-refresh">Обновить данные</button>
                    <button id="jl-settings">Настройки</button>
                    <button id="jl-toggle-view">Свернуть</button>
                </div>
                <div id="jl-content">
                    ${this.renderUserInfo()}
                    ${this.renderFilters()}
                    ${this.renderPrimaryMarket()}
                    ${this.renderSecondaryMarket()}
                </div>
            `;
            document.body.appendChild(container);
        }

        // Остальные методы остаются без изменений, за исключением:
        
        fetchData(endpoint) {
            return new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: `https://jetlend.ru${endpoint}`,
                    onload: (response) => {
                        if (response.status >= 200 && response.status < 300) {
                            resolve(JSON.parse(response.responseText));
                        } else {
                            reject(new Error(`HTTP error ${response.status}`));
                        }
                    },
                    onerror: (error) => {
                        reject(new Error(`Ошибка сети: ${error.statusText}`));
                    }
                });
            });
        }

        showNotification(message) {
            if (typeof GM_notification !== 'undefined') {
                GM_notification({
                    text: message,
                    title: 'JetLend Helper',
                    image: 'https://jetlend.ru/static/logo.png'
                });
            } else if (Notification.permission === 'granted') {
                new Notification('JetLend Helper', { body: message });
            }
        }

        handleFilterChange(e) {
            const filter = e.target.dataset.filter;
            const value = parseFloat(e.target.value);
            this.state.filters[filter] = value;
            GM_setValue('filters', this.state.filters);
            this.updateUI();
        }
    }

    const helper = new JetLendHelper();
    helper.init();
})();