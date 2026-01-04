// ==UserScript==
// @name         Der ultimative Festplatten-Deal-Finder für Kleinanzeigen 🚀
// @namespace    http://tampermonkey.net/
// @version      9.4
// @description  SVG-Filter, Tooltips, Hover-Effekte, DB-Reset mit Countdown - Polierte UI
// @author       Assistant & User
// @match        https://www.kleinanzeigen.de/s-pc-zubehoer-software/*
// @license MIT
// @icon         https://t1.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=http://kleinanzeigen.de&size=64
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/538590/Der%20ultimative%20Festplatten-Deal-Finder%20f%C3%BCr%20Kleinanzeigen%20%F0%9F%9A%80.user.js
// @updateURL https://update.greasyfork.org/scripts/538590/Der%20ultimative%20Festplatten-Deal-Finder%20f%C3%BCr%20Kleinanzeigen%20%F0%9F%9A%80.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // --- EINSTELLUNGEN ---
    const MEDIAN_YELLOW_ZONE_PERCENT = 0.15;
    const IQR_MULTIPLIER = 1.5;
    const DB_KEY = 'festplatten_preis_db';
    const FILTER_STATE_KEY = 'ka_analyzer_filter_state';
    const SSD_HDD_STATS_KEY = 'ssd_hdd_statistics';
 
    // --- HELFER-FUNKTIONEN ---
    function getQuantile(sortedValues, q) { 
        const pos = (sortedValues.length - 1) * q; 
        const base = Math.floor(pos); 
        const rest = pos - base; 
        if (sortedValues[base + 1] !== undefined) { 
            return sortedValues[base] + rest * (sortedValues[base + 1] - sortedValues[base]); 
        } else { 
            return sortedValues[base]; 
        } 
    }
    
    function calculateMedian(values) { 
        if (values.length === 0) return 0; 
        const sorted = [...values].sort((a, b) => a - b); 
        const mid = Math.floor(sorted.length / 2); 
        return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2; 
    }

    // --- HELFER-OBJEKTE ---
    const dateHelper = { 
        getCurrentQuarterKey: function() { 
            const now = new Date(); 
            const year = now.getFullYear(); 
            const quarter = Math.floor(now.getMonth() / 3) + 1; 
            return `${year}-Q${quarter}`; 
        } 
    };
    
    // SSD/HDD Statistik-Manager
    const ssdHddStatsManager = {
        getStats: function() {
            try {
                return JSON.parse(GM_getValue(SSD_HDD_STATS_KEY, '{"ssd": {"prices": [], "sizes": []}, "hdd": {"prices": [], "sizes": []}}'));
            } catch (e) {
                return {"ssd": {"prices": [], "sizes": []}, "hdd": {"prices": [], "sizes": []}};
            }
        },
        saveStats: function(stats) {
            GM_setValue(SSD_HDD_STATS_KEY, JSON.stringify(stats));
        },
        addData: function(type, pricePerTB, sizeTB) {
            const stats = this.getStats();
            if (!stats[type]) stats[type] = {"prices": [], "sizes": []};
            
            stats[type].prices.push(Math.round(pricePerTB));
            stats[type].sizes.push(Math.round(sizeTB * 1000));
            
            if (stats[type].prices.length > 500) {
                stats[type].prices = stats[type].prices.slice(-500);
                stats[type].sizes = stats[type].sizes.slice(-500);
            }
            
            this.saveStats(stats);
        },
        getMedians: function() {
            const stats = this.getStats();
            return {
                ssd: {
                    priceMedian: stats.ssd.prices.length > 0 ? calculateMedian(stats.ssd.prices) : 70,
                    sizeMedian: stats.ssd.sizes.length > 0 ? calculateMedian(stats.ssd.sizes) : 500,
                    count: stats.ssd.prices.length
                },
                hdd: {
                    priceMedian: stats.hdd.prices.length > 0 ? calculateMedian(stats.hdd.prices) : 30,
                    sizeMedian: stats.hdd.sizes.length > 0 ? calculateMedian(stats.hdd.sizes) : 2000,
                    count: stats.hdd.prices.length
                }
            };
        },
        reset: function() {
            GM_setValue(SSD_HDD_STATS_KEY, '{"ssd": {"prices": [], "sizes": []}, "hdd": {"prices": [], "sizes": []}}');
        }
    };

    const storageManager = { 
        getDb: function() { 
            try { 
                return JSON.parse(GM_getValue(DB_KEY, '{}')); 
            } catch (e) { 
                return {}; 
            } 
        }, 
        saveDb: function(db) { 
            GM_setValue(DB_KEY, JSON.stringify(db)); 
        }, 
        addPrice: function(adId, pricePerTB) { 
            const db = this.getDb(); 
            const key = dateHelper.getCurrentQuarterKey(); 
            if (!db[key]) { 
                db[key] = { prices: {}, finalMedian: null }; 
            } 
            db[key].prices[adId] = Math.round(pricePerTB); 
            this.saveDb(db); 
        }, 
        getCurrentQuarterStats: function() { 
            const db = this.getDb(); 
            const key = dateHelper.getCurrentQuarterKey(); 
            if (!db[key] || !db[key].prices) { 
                return { count: 0, median: 0 }; 
            } 
            const prices = Object.values(db[key].prices); 
            return { count: prices.length, median: prices.length > 0 ? calculateMedian(prices) : 0 }; 
        }, 
        getHistoricalMedian: function() { 
            const db = this.getDb(); 
            const currentKey = dateHelper.getCurrentQuarterKey(); 
            const lastQuarterKey = Object.keys(db).sort().reverse().find(k => k !== currentKey && db[k].finalMedian); 
            return lastQuarterKey ? { key: lastQuarterKey, median: db[lastQuarterKey].finalMedian } : null; 
        }, 
        finalizeQuarters: function() { 
            const db = this.getDb(); 
            const currentKey = dateHelper.getCurrentQuarterKey(); 
            let changed = false; 
            for (const key in db) { 
                if (key !== currentKey && db[key].finalMedian === null) { 
                    const prices = Object.values(db[key].prices); 
                    if (prices.length > 10) { 
                        db[key].finalMedian = calculateMedian(prices); 
                        changed = true; 
                    } 
                } 
            } 
            if (changed) this.saveDb(db); 
        },
        reset: function() { 
            GM_setValue(DB_KEY, '{}'); 
        }
    };
 
    // --- FILTER-MODUL ---
    const filterManager = {
        activeFilters: new Set(),
        resetCountdown: null,
        resetStartTime: null,
        
        init: function() {
            this.loadState();
        },
        
        loadState: function() {
            const savedState = GM_getValue(FILTER_STATE_KEY, '[]');
            try {
                this.activeFilters = new Set(JSON.parse(savedState));
            } catch (e) {
                this.activeFilters = new Set();
            }
        },
        
        saveState: function() {
            GM_setValue(FILTER_STATE_KEY, JSON.stringify(Array.from(this.activeFilters)));
        },
        
        createFilterUI: function() {
            let containerDiv = document.getElementById('dashboard-container');
            if (!containerDiv) return;

            let container = document.getElementById('filter-button-container');
            if (!container) {
                container = document.createElement('div');
                container.id = 'filter-button-container';
                // Container direkt ins dashboard-inner einfügen
                const innerDiv = document.getElementById('dashboard-inner');
                if (innerDiv) {
                    innerDiv.appendChild(container);
                }
            }

            container.innerHTML = '';
            const filters = [
                { name: 'Grün', tooltip: 'Günstige Deals anzeigen', classes: ['tb-price-low', 'tb-price-low-ssd', 'tb-price-low-hdd'], svg: this.createCircleSVG('#90EE90') },
                { name: 'Gelb', tooltip: 'Faire Preise anzeigen', classes: ['tb-price-medium', 'tb-price-medium-ssd', 'tb-price-medium-hdd'], svg: this.createCircleSVG('#FFD264') },
                { name: 'Rot', tooltip: 'Teure Angebote anzeigen', classes: ['tb-price-high', 'tb-price-high-ssd', 'tb-price-high-hdd'], svg: this.createCircleSVG('#FF7F7F') },
                { name: 'Grau', tooltip: 'Zubehör & Ausreißer anzeigen', classes: ['tb-price-accessory', 'tb-price-outlier'], svg: this.createCircleSVG('#C8C8C8') },
                { name: 'SSD', tooltip: 'Nur SSDs anzeigen', classes: ['storage-type-ssd'], svg: this.createSSDSVG() },
                { name: 'HDD', tooltip: 'Nur HDDs anzeigen', classes: ['storage-type-hdd'], svg: this.createHDDSVG() },
                { name: 'Reset', tooltip: 'Kurz: Filter reset | Lang: Datenbank reset', classes: ['reset'], svg: this.createResetSVG() }
            ];
            
            const self = this;
            filters.forEach(filter => {
                const button = document.createElement('button');
                button.className = 'filter-btn';
                
                if (self.activeFilters.has(filter.classes[0])) { 
                    button.classList.add('active'); 
                }
                
                button.dataset.filterClasses = JSON.stringify(filter.classes);
                button.innerHTML = filter.svg;
                
                self.createCustomTooltip(button, filter.tooltip);
                
                if (filter.name === 'Reset') {
                    self.setupResetButton(button);
                } else {
                    button.addEventListener('click', () => {
                        button.classList.toggle('active');
                        filter.classes.forEach(cls => {
                            if (self.activeFilters.has(cls)) { 
                                self.activeFilters.delete(cls); 
                            } else { 
                                self.activeFilters.add(cls); 
                            }
                        });
                        self.saveState();
                        self.applyFilters();
                    });
                }
                
                container.appendChild(button);
            });
        },
        
        createCustomTooltip: function(element, text) {
            let tooltip = null;
            
            const showTooltip = (e) => {
                document.querySelectorAll('.custom-tooltip').forEach(t => t.remove());
                
                tooltip = document.createElement('div');
                tooltip.className = 'custom-tooltip';
                tooltip.textContent = text;
                document.body.appendChild(tooltip);
                
                const rect = element.getBoundingClientRect();
                const tooltipRect = tooltip.getBoundingClientRect();
                
                let left = rect.left + (rect.width / 2) - (tooltipRect.width / 2);
                let top = rect.top - tooltipRect.height - 12;
                
                if (left < 10) left = 10;
                if (left + tooltipRect.width > window.innerWidth - 10) {
                    left = window.innerWidth - tooltipRect.width - 10;
                }
                if (top < 10) {
                    top = rect.bottom + 12;
                    tooltip.classList.add('below');
                }
                
                tooltip.style.left = left + 'px';
                tooltip.style.top = top + 'px';
                
                setTimeout(() => tooltip.classList.add('show'), 10);
            };
            
            const hideTooltip = () => {
                if (tooltip) {
                    tooltip.classList.remove('show');
                    setTimeout(() => {
                        if (tooltip && tooltip.parentNode) {
                            tooltip.remove();
                        }
                        tooltip = null;
                    }, 200);
                }
            };
            
            element.addEventListener('mouseenter', showTooltip);
            element.addEventListener('mouseleave', hideTooltip);
            element.addEventListener('click', hideTooltip);
        },
        
        setupResetButton: function(button) {
            let pressTimer = null;
            let countdownInterval = null;
            const self = this;
            
            const startReset = () => {
                self.resetStartTime = Date.now();
                let countdown = 5;
                
                button.innerHTML = self.createCountdownSVG(countdown);
                button.style.backgroundColor = '#ff4444';
                
                countdownInterval = setInterval(() => {
                    countdown--;
                    if (countdown <= 0) {
                        storageManager.reset();
                        ssdHddStatsManager.reset();
                        button.innerHTML = self.createResetSVG();
                        button.style.backgroundColor = '';
                        clearInterval(countdownInterval);
                        updateStatusDashboard();
                        console.log('Datenbank wurde zurückgesetzt!');
                    } else {
                        button.innerHTML = self.createCountdownSVG(countdown);
                    }
                }, 1000);
            };
            
            const cancelReset = () => {
                if (countdownInterval) {
                    clearInterval(countdownInterval);
                    countdownInterval = null;
                }
                button.innerHTML = self.createResetSVG();
                button.style.backgroundColor = '';
            };
            
            button.addEventListener('mousedown', () => {
                pressTimer = setTimeout(startReset, 500);
            });
            
            button.addEventListener('mouseup', () => {
                if (pressTimer) {
                    clearTimeout(pressTimer);
                    if (!countdownInterval) {
                        self.activeFilters.clear();
                        document.querySelectorAll('.filter-btn.active').forEach(btn => btn.classList.remove('active'));
                        self.saveState();
                        self.applyFilters();
                    }
                }
            });
            
            button.addEventListener('mouseleave', cancelReset);
        },
        
        createCircleSVG: function(color) {
            return `<svg width="24" height="24" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="${color}" stroke="#fff" stroke-width="2"/>
            </svg>`;
        },
        
        createSSDSVG: function() {
            return `<svg width="24" height="24" viewBox="0 0 24 24" fill="#0066CC">
                <rect x="3" y="8" width="18" height="8" rx="1" fill="#0066CC" stroke="#fff" stroke-width="1"/>
                <rect x="5" y="10" width="2" height="4" fill="#fff"/>
                <rect x="8" y="10" width="2" height="4" fill="#fff"/>
                <rect x="11" y="10" width="2" height="4" fill="#fff"/>
                <rect x="14" y="10" width="2" height="4" fill="#fff"/>
                <rect x="17" y="10" width="2" height="4" fill="#fff"/>
            </svg>`;
        },
        
        createHDDSVG: function() {
            return `<svg width="24" height="24" viewBox="0 0 24 24" fill="#CC6600">
                <circle cx="12" cy="12" r="10" fill="#CC6600" stroke="#fff" stroke-width="2"/>
                <circle cx="12" cy="12" r="7" fill="none" stroke="#fff" stroke-width="1"/>
                <circle cx="12" cy="12" r="4" fill="none" stroke="#fff" stroke-width="1"/>
                <circle cx="12" cy="12" r="1.5" fill="#fff"/>
            </svg>`;
        },
        
        createResetSVG: function() {
            return `<svg width="24" height="24" viewBox="0 0 24 24" fill="#666">
                <circle cx="12" cy="12" r="3" fill="#666"/>
                <path d="M20.817 11.186a8.94 8.94 0 0 0-1.355-3.219 9.053 9.053 0 0 0-2.43-2.43 8.95 8.95 0 0 0-3.219-1.355 9.028 9.028 0 0 0-1.838-.18V2L8 5l3.975 3V6.002c.484-.002.968.044 1.435.14a6.961 6.961 0 0 1 2.502 1.053 7.005 7.005 0 0 1 1.892 1.892A6.967 6.967 0 0 1 19 13a7.032 7.032 0 0 1-.55 2.725 7.11 7.11 0 0 1-.644 1.188 7.2 7.2 0 0 1-.858 1.039 7.028 7.028 0 0 1-3.536 1.907 7.13 7.13 0 0 1-2.822 0 6.961 6.961 0 0 1-2.503-1.054 7.002 7.002 0 0 1-1.89-1.89A6.996 6.996 0 0 1 5 13H3a9.02 9.02 0 0 0 1.539 5.034 9.096 9.096 0 0 0 2.428 2.428A8.95 8.95 0 0 0 12 22a9.09 9.09 0 0 0 1.814-.183 9.014 9.014 0 0 0 3.218-1.355 8.886 8.886 0 0 0 1.331-1.099 9.228 9.228 0 0 0 1.1-1.332A8.952 8.952 0 0 0 21 13a9.09 9.09 0 0 0-.183-1.814z" fill="#666"/>
            </svg>`;
        },
        
        createCountdownSVG: function(count) {
            return `<svg width="24" height="24" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" fill="#ff4444" stroke="#fff" stroke-width="2"/>
                <text x="12" y="16" text-anchor="middle" fill="#fff" font-size="12" font-weight="bold">${count}</text>
            </svg>`;
        },
        
        applyFilters: function() {
            const adItems = document.querySelectorAll('article.aditem');
            if (this.activeFilters.size === 0) { 
                adItems.forEach(item => item.style.display = ''); 
                return; 
            }
            adItems.forEach(item => {
                let isVisible = false;
                for (const filterClass of this.activeFilters) {
                    if (item.classList.contains(filterClass)) { 
                        isVisible = true; 
                        break; 
                    }
                }
                item.style.display = isVisible ? '' : 'none';
            });
        }
    };
    
    // --- STYLES ---
    GM_addStyle(`
        .tb-price-display { font-size: 1.4em; color: #20242C; font-weight: bold; white-space: nowrap; }
        .highlighted-disk-size { background-color: #ffffcc !important; color: #d73502 !important; font-weight: bold !important; padding: 2px 4px !important; border-radius: 3px !important; border: 1px solid #d73502 !important; }
        
        article.aditem.tb-price-low-ssd { background-color: rgba(144, 238, 144, 0.4) !important; border-left: 4px solid #0066cc !important; }
        article.aditem.tb-price-medium-ssd { background-color: rgba(255, 210, 100, 0.4) !important; border-left: 4px solid #0066cc !important; }
        article.aditem.tb-price-high-ssd { background-color: rgba(255, 127, 127, 0.4) !important; border-left: 4px solid #0066cc !important; }
        
        article.aditem.tb-price-low-hdd { background-color: rgba(144, 238, 144, 0.4) !important; border-left: 4px solid #cc6600 !important; }
        article.aditem.tb-price-medium-hdd { background-color: rgba(255, 210, 100, 0.4) !important; border-left: 4px solid #cc6600 !important; }
        article.aditem.tb-price-high-hdd { background-color: rgba(255, 127, 127, 0.4) !important; border-left: 4px solid #cc6600 !important; }
        
        article.aditem.tb-price-low { background-color: rgba(144, 238, 144, 0.35) !important; }
        article.aditem.tb-price-medium { background-color: rgba(255, 210, 100, 0.35) !important; }
        article.aditem.tb-price-high { background-color: rgba(255, 127, 127, 0.35) !important; }
        article.aditem.tb-price-outlier { border: 2px dashed #888 !important; background-color: #f0f0f0 !important; opacity: 0.6; }
        article.aditem.tb-price-accessory { background-color: #f8f9fa !important; border-left: 4px solid #adb5bd !important; opacity: 0.7; }
        .aditem-main--middle--price-shipping { display: flex !important; justify-content: space-between !important; align-items: center !important; }
        
        #dashboard-container {
            margin: 0px 0px 12px;
            padding: 12px;
            border: 0px none;
            border-radius: 2px;
            background-color: rgb(255, 255, 255);
            box-shadow: rgba(0, 0, 0, 0.1) 0px 1px 3px 0px;
            font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
            font-size: 14px;
            color: rgb(51, 50, 46);
            min-height: 10px;
            box-sizing: border-box;
        }

        #dashboard-inner {
            background-color: rgb(255, 255, 255);
            border-radius: 2px;
            padding: 12px;
        }

        #dashboard-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 12px;
        }

        #dashboard-title {
            display: flex;
            align-items: center;
            gap: 8px;
            flex: 1;
        }

        #dashboard-icon {
            width: 48px;
            height: 48px;
            background-color: #0054E0;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
            font-size: 12px;
            line-height: 1;
            flex-shrink: 0;
        }

        #dashboard-info {
            line-height: 1.4;
            font-size: 16px;
        }

        #status-dashboard-display {
            font-size: 16px !important;
            line-height: 1.4 !important;
            text-align: left !important;
            color: rgb(51, 50, 46) !important;
            margin: 0 !important;
            padding: 0 !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            position: static !important;
        }

        #status-dashboard-display b {
            color: #0054E0 !important;
            font-weight: 700;
        }

        .storage-stats {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 8px;
        }

        .storage-stat-item {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            border-radius: 6px;
            transition: all 0.2s ease;
            cursor: pointer;
            font-size: 15px;
            font-weight: 500;
        }

        .storage-stat-item.ssd-stat {
            background-color: rgba(0, 102, 204, 0.1);
            border: 1px solid rgba(0, 102, 204, 0.3);
        }

        .storage-stat-item.hdd-stat {
            background-color: rgba(204, 102, 0, 0.1);
            border: 1px solid rgba(204, 102, 0, 0.3);
        }

        .storage-stat-item:hover {
            border: 1px solid;
        }

        .storage-stat-item.ssd-stat:hover {
            border-color: #0066CC;
        }

        .storage-stat-item.hdd-stat:hover {
            border-color: #CC6600;
        }

        .storage-stat-icon {
            width: 20px;
            height: 20px;
            flex-shrink: 0;
        }

        .storage-stat-text {
            flex: 1;
        }

        .storage-stat-text .type {
            font-weight: bold;
            color: #333;
        }

        .storage-stat-text.ssd .type {
            color: #0066CC;
        }

        .storage-stat-text.hdd .type {
            color: #CC6600;
        }

        /* FILTER-BUTTONS KOMPLETT UNTER DEM DASHBOARD */
        #filter-button-container {
            display: flex !important;
            gap: 12px;
            align-items: center;
            justify-content: center;
            margin: 16px 0 0 0 !important;
            padding: 16px 0 0 0 !important;
            background: transparent !important;
            border: none !important;
            box-shadow: none !important;
            position: static !important;
            backdrop-filter: none !important;
            border-top: 1px solid rgba(0,0,0,0.08);
            width: 100%;
            flex-wrap: wrap;
        }

        .filter-btn {
            width: 56px !important;
            height: 56px !important;
            padding: 10px !important;
            border-radius: 12px !important;
            border: 3px solid transparent;
            cursor: pointer;
            transition: all 0.2s ease;
            box-shadow: 0 3px 6px rgba(0,0,0,0.15);
            flex-shrink: 0;
            background: white;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .filter-btn:hover {
            transform: translateY(-3px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.25);
        }

        .filter-btn[data-filter-classes*="storage-type-ssd"]:hover {
            background-color: rgba(0, 102, 204, 0.1);
        }

        .filter-btn[data-filter-classes*="storage-type-hdd"]:hover {
            background-color: rgba(204, 102, 0, 0.1);
        }

        .filter-btn[data-filter-classes*="tb-price-low"]:hover {
            background-color: rgba(144, 238, 144, 0.2);
        }

        .filter-btn[data-filter-classes*="tb-price-medium"]:hover {
            background-color: rgba(255, 210, 100, 0.2);
        }

        .filter-btn[data-filter-classes*="tb-price-high"]:hover {
            background-color: rgba(255, 127, 127, 0.2);
        }

        .filter-btn[data-filter-classes*="tb-price-accessory"]:hover {
            background-color: rgba(200, 200, 200, 0.2);
        }

        .filter-btn.active {
            transform: translateY(-3px);
            box-shadow: 0 6px 12px rgba(0,0,0,0.25);
            border-color: #0054E0 !important;
        }

        .filter-btn[data-filter-classes*="storage-type-ssd"].active {
            background-color: rgba(0, 102, 204, 0.1);
        }

        .filter-btn[data-filter-classes*="storage-type-hdd"].active {
            background-color: rgba(204, 102, 0, 0.1);
        }

        .filter-btn[data-filter-classes*="tb-price-low"].active {
            background-color: rgba(144, 238, 144, 0.2);
        }

        .filter-btn[data-filter-classes*="tb-price-medium"].active {
            background-color: rgba(255, 210, 100, 0.2);
        }

        .filter-btn[data-filter-classes*="tb-price-high"].active {
            background-color: rgba(255, 127, 127, 0.2);
        }

        .filter-btn[data-filter-classes*="tb-price-accessory"].active {
            background-color: rgba(200, 200, 200, 0.2);
        }

        .filter-btn svg {
            width: 32px;
            height: 32px;
            transition: transform 0.1s ease;
        }

        .filter-btn:hover svg {
            transform: scale(1.1);
        }

        .custom-tooltip {
            position: fixed;
            background: rgba(0, 0, 0, 0.9);
            color: white;
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            white-space: nowrap;
            z-index: 10000;
            pointer-events: none;
            opacity: 0;
            transform: translateY(5px);
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 1px solid rgba(255,255,255,0.1);
        }

        .custom-tooltip::before {
            content: '';
            position: absolute;
            top: 100%;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 8px solid rgba(0, 0, 0, 0.9);
        }

        .custom-tooltip.below::before {
            top: -8px;
            border-top: none;
            border-bottom: 8px solid rgba(0, 0, 0, 0.9);
        }

        .custom-tooltip.show {
            opacity: 1;
            transform: translateY(0);
        }

        .storage-stat-item.highlight-from-button {
            border: 1px solid;
        }

        .storage-stat-item.ssd-stat.highlight-from-button {
            border-color: #0066CC;
        }

        .storage-stat-item.hdd-stat.highlight-from-button {
            border-color: #CC6600;
        }

        .filter-btn.highlight-from-stat {
            transform: translateY(-3px) !important;
            box-shadow: 0 6px 12px rgba(0,0,0,0.25) !important;
        }

        .filter-btn[data-filter-classes*="storage-type-ssd"].highlight-from-stat {
            background-color: rgba(0, 102, 204, 0.1) !important;
        }

        .filter-btn[data-filter-classes*="storage-type-hdd"].highlight-from-stat {
            background-color: rgba(204, 102, 0, 0.1) !important;
        }
    `);
 
    // Erweiterte Zubehör-Erkennung
    const ZUBEHOER_KEYWORDS = ['gehäuse', 'case', 'caddy', 'rahmen', 'halterung', 'kabel', 'stromkabel', 'datenkabel', 'anschlusskabel', 'dock', 'station', 'kühler', 'lüfter', 'mount', 'bracket', 'schrauben', 'zubehör', 'accessory', 'netzteil', 'ladestation', 'hub', 'verbindungskabel', 'adapter', 'nas', 'server', 'qnap', 'synology', 'drobo', 'buffalo', 'netgear', 'zyxel', 'asustor', 'terramaster', 'konvolut', 'sammlung', 'paket', 'set', 'bundle', 'lot'];
    const RAM_KEYWORDS = ['arbeitsspeicher', 'ram', 'memory', 'ddr', 'sodimm', 'dimm'];
    const STORAGE_KEYWORDS = ['festplatte', 'hdd', 'ssd', 'nvme', 'platte', 'drive', 'storage', 'disk', 'harddisk', 'solid state', 'speichermedium', 'speicherlaufwerk', 'western digital', 'wd', 'seagate', 'samsung', 'crucial', 'sandisk', 'toshiba', 'hitachi', 'maxtor', 'kingston', 'transcend', 'fikwot', 'corsair', 'intel', 'adata', 'patriot', 'mushkin', 'ocz', 'pny', 'teamgroup', 'gigabyte', 'msi', 'hynix', 'sk hynix', 'micron', 'portable', 'extern', 'external', 'intern', 'internal', 'm.2', 'msata', 'sata', 'pcie', 'gen4', 'gen3', 'gen2', '2280', '2260', '2242', 'firecuda', 'barracuda', 'ironwolf', 'blue', 'black', 'red', 'green', 'evo', 'pro', 'plus', 'ultra', 'extreme', 'gaming', 'heatsink', 'kc600', 'kc3000', 'mp600', 'mp510', 'mp500', 'bx500', 'mx500', 'p3', 'p5', 'sn850', 'sn750', '980', '970', '960', '990'];
    const SSD_KEYWORDS = ['ssd', 'solid state', 'nvme', 'm.2', 'msata', 'pcie', 'gen4', 'gen3', 'gen2', '2280', '2260', '2242', 'evo', 'pro', 'plus', 'ultra', 'extreme', 'gaming', 'heatsink', 'kc600', 'kc3000', 'mp600', 'mp510', 'mp500', 'bx500', 'mx500', 'p3', 'p5', 'sn850', 'sn750', '980', '970', '960', '990'];
    const HDD_KEYWORDS = ['hdd', 'hard disk', 'harddisk', 'festplatte', 'firecuda', 'barracuda', 'ironwolf', 'blue', 'black', 'red', 'green', 'rpm', '5400', '7200', '10000', 'upm', 'u/min', 'umdrehungen'];
    
    // --- FUNKTIONEN ---
    function detectStorageType(title, description, sizeTB, pricePerTB) {
        const fullText = `${title} ${description}`.toLowerCase();
        
        const hasSsdKeywords = SSD_KEYWORDS.some(keyword => fullText.includes(keyword));
        const hasHddKeywords = HDD_KEYWORDS.some(keyword => fullText.includes(keyword));
        
        if (hasSsdKeywords && !hasHddKeywords) return 'ssd';
        if (hasHddKeywords && !hasSsdKeywords) return 'hdd';
        if (hasSsdKeywords && hasHddKeywords) {
            if (fullText.includes('nvme') || fullText.includes('m.2') || fullText.includes('pcie')) return 'ssd';
            if (fullText.includes('rpm') || fullText.includes('upm') || fullText.includes('barracuda')) return 'hdd';
        }
        
        const medians = ssdHddStatsManager.getMedians();
        
        if (medians.ssd.count >= 10 && medians.hdd.count >= 10) {
            const sizeGB = sizeTB * 1000;
            
            const ssdSizeScore = sizeGB <= 4000 ? 1 : (sizeGB <= 8000 ? 0.5 : 0.1);
            const ssdPriceScore = pricePerTB >= medians.ssd.priceMedian * 0.4 ? 1 : 0.3;
            
            const hddSizeScore = sizeGB >= 500 ? 1 : 0.2;
            const hddPriceScore = pricePerTB <= medians.hdd.priceMedian * 2.5 ? 1 : 0.2;
            
            const ssdProbability = (ssdSizeScore + ssdPriceScore) / 2;
            const hddProbability = (hddSizeScore + hddPriceScore) / 2;
            
            if (ssdProbability > hddProbability && ssdProbability > 0.6) return 'ssd';
            if (hddProbability > ssdProbability && hddProbability > 0.6) return 'hdd';
        }
        
        const sizeGB = sizeTB * 1000;
        if (sizeGB <= 2000 && pricePerTB >= 40) return 'ssd';
        if (sizeGB >= 3000 && pricePerTB <= 50) return 'hdd';
        
        return 'unknown';
    }
    
    function extractSizeDetails(title, description) { 
        const fullText = `${title} ${description}`.toLowerCase(); 
        
        // Erweiterte Zubehör-Erkennung
        const isStorageDevice = STORAGE_KEYWORDS.some(keyword => fullText.includes(keyword)); 
        if (RAM_KEYWORDS.some(keyword => fullText.includes(keyword))) return { isAccessory: true }; 
        if (!isStorageDevice && ZUBEHOER_KEYWORDS.some(keyword => fullText.includes(keyword))) return { isAccessory: true }; 
        
        // Spezielle Fälle für Mehrfach-Systeme
        if (fullText.includes('bay') || fullText.includes('slot') || fullText.includes('konvolut') || 
            fullText.includes('sammlung') || fullText.includes('paket') || fullText.includes('set') ||
            fullText.includes('bundle') || fullText.includes('lot') || /\d+x\s*\d+/.test(fullText)) {
            return { isAccessory: true };
        }
        
        // Enterprise/Spezial-Hardware ausschließen
        if (fullText.includes('optane') || fullText.includes('3dxpoint') || 
            fullText.includes('enterprise') || fullText.includes('datacenter')) {
            return { isAccessory: true };
        }
        
        const sizePatterns = [ 
            /(\d+(?:[.,]\d+)?)\s*tb(?!ps)/gi, 
            /(\d+(?:[.,]\d+)?)\s*terabyte/gi, 
            /(\d+)\s*gb(?!ps|\/s|it\s|yte\s)(?!\s*ram)(?!\s*arbeitsspeicher)/gi, 
            /(\d+)\s*gigabyte(?!\s*ram)/gi, 
        ]; 
        let maxSize = 0, foundUnit = '', matchedText = ''; 
        for (const pattern of sizePatterns) { 
            for (const match of fullText.matchAll(pattern)) { 
                let size = parseFloat(match[1].replace(',', '.')); 
                const unit = match[0].toLowerCase(); 
                let currentSizeInGB = 0; 
                if (unit.includes('tb') || unit.includes('tera')) currentSizeInGB = size * 1000; 
                else if ((unit.includes('gb') || unit.includes('giga')) && size >= 8) currentSizeInGB = size; 
                if (currentSizeInGB > maxSize) { 
                    maxSize = currentSizeInGB; 
                    foundUnit = unit.includes('tb') ? 'TB' : 'GB'; 
                    matchedText = match[0]; 
                } 
            } 
        } 
        if (maxSize === 0) return { isAccessory: true }; 
        return { sizeTB: maxSize / 1000, displayText: foundUnit === 'TB' ? `${maxSize / 1000}TB` : `${Math.round(maxSize)}GB`, matchedText: matchedText.trim() }; 
    }
    
    function extractPrice(priceText) { 
        if (!priceText) return null; 
        const cleanText = priceText.replace(/vb/gi, '').replace(/[^\d,.-]/g, ''); 
        const match = cleanText.match(/(\d{1,3}(?:[.,]\d{3})*(?:[.,]\d{2})?)/); 
        if (match) return parseFloat(match[1].replace(/[,.](?=\d{3})/g, '').replace(',', '.')); 
        return null; 
    }
    
    function highlightSizeInTitle(titleElement, sizeDetails) { 
        if (!sizeDetails || sizeDetails.isAccessory || !titleElement) return; 
        if (titleElement.querySelector('.highlighted-disk-size')) return; 
        const textToHighlight = sizeDetails.matchedText.replace(/[.*+?^${}()|[\]\\]/g, '\\        .custom-'); 
        const highlightPattern = new RegExp(`(${textToHighlight})`, 'i'); 
        const originalHTML = titleElement.innerHTML; 
        const newHTML = originalHTML.replace(highlightPattern, '<span class="highlighted-disk-size">$1</span>'); 
        if (originalHTML !== newHTML) titleElement.innerHTML = newHTML; 
    }
    
    function resetItemStyling(item) { 
        item.classList.remove('tb-price-low', 'tb-price-medium', 'tb-price-high', 'tb-price-outlier', 'tb-price-accessory'); 
        item.classList.remove('tb-price-low-ssd', 'tb-price-medium-ssd', 'tb-price-high-ssd');
        item.classList.remove('tb-price-low-hdd', 'tb-price-medium-hdd', 'tb-price-high-hdd');
        item.classList.remove('storage-type-ssd', 'storage-type-hdd', 'storage-type-unknown');
        const priceDisplay = item.querySelector('.tb-price-display'); 
        if (priceDisplay) priceDisplay.remove(); 
        const titleElement = item.querySelector('h2.text-module-begin a, h2.text-module-begin .ref-not-linked'); 
        if (titleElement) { 
            const highlighted = titleElement.querySelector('.highlighted-disk-size'); 
            if (highlighted) titleElement.innerHTML = titleElement.textContent; 
        } 
    }
    
    function activateKeyboardShortcuts() { 
        document.addEventListener('keydown', function(event) { 
            const targetTagName = event.target.tagName.toLowerCase(); 
            if (targetTagName === 'input' || targetTagName === 'textarea' || event.target.isContentEditable) return; 
            const key = event.key.toLowerCase(); 
            if (key === 'a') { 
                const prevButton = document.querySelector('.pagination-prev'); 
                if (prevButton) prevButton.click(); 
            } else if (key === 'd') { 
                const nextButton = document.querySelector('.pagination-next'); 
                if (nextButton) nextButton.click(); 
            } 
        }); 
    }
    
    // --- HAUPTFUNKTION ---
    function processAdItems() { 
        const adItems = document.querySelectorAll('article.aditem'); 
        if (adItems.length === 0) return; 
        const allItemsData = [];
        const ssdItems = [];
        const hddItems = [];
        
        adItems.forEach(item => { 
            resetItemStyling(item); 
            const adId = item.getAttribute('data-adid'); 
            const titleElement = item.querySelector('h2.text-module-begin a, h2.text-module-begin .ref-not-linked'); 
            const priceElement = item.querySelector('.aditem-main--middle--price-shipping--price'); 
            if (!adId || !titleElement || !priceElement) return; 
            const sizeDetails = extractSizeDetails(titleElement.textContent, item.querySelector('.aditem-main--middle--description')?.textContent || ''); 
            if (sizeDetails.isAccessory) { 
                item.classList.add('tb-price-accessory'); 
                return; 
            } 
            const price = extractPrice(priceElement.textContent); 
            if (!price || price <= 0 || sizeDetails.sizeTB <= 0) { 
                item.classList.add('tb-price-accessory'); 
                return; 
            } 
            const pricePerTB = price / sizeDetails.sizeTB; 
            
            const storageType = detectStorageType(
                titleElement.textContent, 
                item.querySelector('.aditem-main--middle--description')?.textContent || '', 
                sizeDetails.sizeTB, 
                pricePerTB
            );
            
            highlightSizeInTitle(titleElement, sizeDetails); 
            
            const priceContainer = item.querySelector('.aditem-main--middle--price-shipping');
            const existing = priceContainer.querySelector('.tb-price-display');
            if (existing) existing.remove();
            const priceDisplay = document.createElement('span');
            priceDisplay.className = 'tb-price-display';
            
            if (storageType === 'ssd') {
                priceDisplay.innerHTML = `${Math.round(pricePerTB)} €/TB <small style="color: #0066cc;">SSD</small>`;
                item.classList.add('storage-type-ssd');
            } else if (storageType === 'hdd') {
                priceDisplay.innerHTML = `${Math.round(pricePerTB)} €/TB <small style="color: #cc6600;">HDD</small>`;
                item.classList.add('storage-type-hdd');
            } else {
                priceDisplay.textContent = `${Math.round(pricePerTB)} €/TB`;
                item.classList.add('storage-type-unknown');
            }
            
            priceContainer.appendChild(priceDisplay);
            
            const itemData = { item, pricePerTB, adId, storageType, sizeTB: sizeDetails.sizeTB };
            allItemsData.push(itemData);
            
            if (storageType === 'ssd') {
                ssdItems.push(itemData);
            } else if (storageType === 'hdd') {
                hddItems.push(itemData);
            }
        }); 
        
        function analyzeStorageType(items, typeName) {
            if (items.length < 3) return [];
            
            const sortedPrices = items.map(d => d.pricePerTB).sort((a, b) => a - b);
            const q1 = getQuantile(sortedPrices, 0.25);
            const q3 = getQuantile(sortedPrices, 0.75);
            const iqr = q3 - q1;
            const lowerBound = q1 - IQR_MULTIPLIER * iqr;
            const upperBound = q3 + IQR_MULTIPLIER * iqr;
            
            const plausibleItems = [];
            items.forEach(data => {
                if (data.pricePerTB >= lowerBound && data.pricePerTB <= upperBound) {
                    plausibleItems.push(data);
                    storageManager.addPrice(data.adId, data.pricePerTB);
                    ssdHddStatsManager.addData(typeName, data.pricePerTB, data.sizeTB);
                } else {
                    data.item.classList.add('tb-price-outlier');
                }
            });
            
            if (plausibleItems.length < 2) return [];
            
            const plausiblePrices = plausibleItems.map(i => i.pricePerTB);
            const medianPrice = calculateMedian(plausiblePrices);
            const yellowZoneLowerBound = medianPrice * (1 - MEDIAN_YELLOW_ZONE_PERCENT);
            const yellowZoneUpperBound = medianPrice * (1 + MEDIAN_YELLOW_ZONE_PERCENT);
            
            plausibleItems.forEach(data => {
                if (data.item.classList.contains('tb-price-outlier')) return;
                const price = data.pricePerTB;
                const typeClass = typeName === 'ssd' ? 'ssd' : 'hdd';
                
                if (price < yellowZoneLowerBound) {
                    data.item.classList.add(`tb-price-low-${typeClass}`);
                } else if (price <= yellowZoneUpperBound) {
                    data.item.classList.add(`tb-price-medium-${typeClass}`);
                } else {
                    data.item.classList.add(`tb-price-high-${typeClass}`);
                }
            });
            
            return plausibleItems;
        }
        
        const analyzedSSD = analyzeStorageType(ssdItems, 'ssd');
        const analyzedHDD = analyzeStorageType(hddItems, 'hdd');
        
        if (analyzedSSD.length < 3 && analyzedHDD.length < 3 && allItemsData.length >= 5) {
            const sortedPrices = allItemsData.map(d => d.pricePerTB).sort((a, b) => a - b);
            const q1 = getQuantile(sortedPrices, 0.25);
            const q3 = getQuantile(sortedPrices, 0.75);
            const iqr = q3 - q1;
            const lowerBound = q1 - IQR_MULTIPLIER * iqr;
            const upperBound = q3 + IQR_MULTIPLIER * iqr;
            
            const plausibleItems = [];
            allItemsData.forEach(data => {
                if (data.pricePerTB >= lowerBound && data.pricePerTB <= upperBound) {
                    plausibleItems.push(data);
                    storageManager.addPrice(data.adId, data.pricePerTB);
                    if (data.storageType !== 'unknown') {
                        ssdHddStatsManager.addData(data.storageType, data.pricePerTB, data.sizeTB);
                    }
                } else {
                    data.item.classList.add('tb-price-outlier');
                }
            });
            
            if (plausibleItems.length >= 3) {
                const plausiblePrices = plausibleItems.map(i => i.pricePerTB);
                const medianPrice = calculateMedian(plausiblePrices);
                const yellowZoneLowerBound = medianPrice * (1 - MEDIAN_YELLOW_ZONE_PERCENT);
                const yellowZoneUpperBound = medianPrice * (1 + MEDIAN_YELLOW_ZONE_PERCENT);
                
                plausibleItems.forEach(data => {
                    if (data.item.classList.contains('tb-price-outlier')) return;
                    const price = data.pricePerTB;
                    if (price < yellowZoneLowerBound) {
                        data.item.classList.add('tb-price-low');
                    } else if (price <= yellowZoneUpperBound) {
                        data.item.classList.add('tb-price-medium');
                    } else {
                        data.item.classList.add('tb-price-high');
                    }
                });
            }
        }
        
        updateStatusDashboard();
        filterManager.applyFilters();
    }

    // --- CROSS-HOVER FUNKTIONEN ---
    function setupCrossHoverEffects() {
        const ssdButton = document.querySelector('.filter-btn[data-filter-classes*="storage-type-ssd"]');
        const hddButton = document.querySelector('.filter-btn[data-filter-classes*="storage-type-hdd"]');
        const ssdStat = document.querySelector('.storage-stat-item.ssd-stat');
        const hddStat = document.querySelector('.storage-stat-item.hdd-stat');
        
        if (ssdButton && ssdStat) {
            ssdButton.addEventListener('mouseenter', () => {
                ssdStat.classList.add('highlight-from-button');
            });
            ssdButton.addEventListener('mouseleave', () => {
                ssdStat.classList.remove('highlight-from-button');
            });
            
            ssdStat.addEventListener('mouseenter', () => {
                ssdButton.classList.add('highlight-from-stat');
            });
            ssdStat.addEventListener('mouseleave', () => {
                ssdButton.classList.remove('highlight-from-stat');
            });
        }
        
        if (hddButton && hddStat) {
            hddButton.addEventListener('mouseenter', () => {
                hddStat.classList.add('highlight-from-button');
            });
            hddButton.addEventListener('mouseleave', () => {
                hddStat.classList.remove('highlight-from-button');
            });
            
            hddStat.addEventListener('mouseenter', () => {
                hddButton.classList.add('highlight-from-stat');
            });
            hddStat.addEventListener('mouseleave', () => {
                hddButton.classList.remove('highlight-from-stat');
            });
        }
    }
 
    // --- DASHBOARD FUNKTION ---
    function updateStatusDashboard() {
        let containerDiv = document.getElementById('dashboard-container');
        if (!containerDiv) {
            containerDiv = document.createElement('div');
            containerDiv.id = 'dashboard-container';
            containerDiv.className = 'srp-header a-padded l-container-row contentbox surface';
            
            const srpHeader = document.querySelector('.srp-header.a-padded.l-container-row.contentbox.surface');
            if (srpHeader) {
                srpHeader.insertAdjacentElement('afterend', containerDiv);
            } else {
                const mainContent = document.querySelector('#srchrslt-content');
                if (mainContent) {
                    mainContent.insertBefore(containerDiv, mainContent.firstChild);
                }
            }
        }

        let innerDiv = document.getElementById('dashboard-inner');
        if (!innerDiv) {
            innerDiv = document.createElement('div');
            innerDiv.id = 'dashboard-inner';
            innerDiv.className = 'l-container-row contentbox';
            containerDiv.appendChild(innerDiv);
        }

        let headerDiv = document.getElementById('dashboard-header');
        if (!headerDiv) {
            headerDiv = document.createElement('header');
            headerDiv.id = 'dashboard-header';
            headerDiv.className = 'splitheader-centered';
            innerDiv.appendChild(headerDiv);
        }

        let titleDiv = document.getElementById('dashboard-title');
        if (!titleDiv) {
            titleDiv = document.createElement('div');
            titleDiv.id = 'dashboard-title';
            titleDiv.className = 'splitheader--title icon-headline-medium box-iconbox';
            
            // Icon erstellen
            const iconWrapper = document.createElement('div');
            const icon = document.createElement('div');
            icon.id = 'dashboard-icon';
            icon.textContent = '€/TB';
            iconWrapper.appendChild(icon);
            titleDiv.appendChild(iconWrapper);

            // Info-Bereich erstellen
            const infoDiv = document.createElement('div');
            infoDiv.id = 'dashboard-info';
            titleDiv.appendChild(infoDiv);
            
            headerDiv.appendChild(titleDiv);
        }

        // Dashboard-Display in Info-Bereich verschieben
        let displayDiv = document.getElementById('status-dashboard-display');
        if (!displayDiv) {
            displayDiv = document.createElement('div');
            displayDiv.id = 'status-dashboard-display';
        }
        
        const infoDiv = document.getElementById('dashboard-info');
        if (displayDiv.parentNode !== infoDiv) {
            infoDiv.appendChild(displayDiv);
        }

        const ssdHddMedians = ssdHddStatsManager.getMedians();
        let html = '';
        
        html += `<strong>Festplatten-Marktanalyse (${dateHelper.getCurrentQuarterKey()})</strong>`;
        
        if (ssdHddMedians.ssd.count > 0 || ssdHddMedians.hdd.count > 0) {
            html += '<div class="storage-stats">';
            
            if (ssdHddMedians.ssd.count > 0) {
                html += `
                    <div class="storage-stat-item ssd-stat">
                        <div class="storage-stat-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#0066CC">
                                <rect x="3" y="8" width="18" height="8" rx="1" fill="#0066CC" stroke="#fff" stroke-width="1"/>
                                <rect x="5" y="10" width="2" height="4" fill="#fff"/>
                                <rect x="8" y="10" width="2" height="4" fill="#fff"/>
                                <rect x="11" y="10" width="2" height="4" fill="#fff"/>
                                <rect x="14" y="10" width="2" height="4" fill="#fff"/>
                                <rect x="17" y="10" width="2" height="4" fill="#fff"/>
                            </svg>
                        </div>
                        <div class="storage-stat-text ssd">
                            <span class="type">SSD:</span> <b>${Math.round(ssdHddMedians.ssd.priceMedian)} €/TB</b> (${ssdHddMedians.ssd.count}x)
                        </div>
                    </div>
                `;
            }
            
            if (ssdHddMedians.hdd.count > 0) {
                html += `
                    <div class="storage-stat-item hdd-stat">
                        <div class="storage-stat-icon">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="#CC6600">
                                <circle cx="12" cy="12" r="10" fill="#CC6600" stroke="#fff" stroke-width="2"/>
                                <circle cx="12" cy="12" r="7" fill="none" stroke="#fff" stroke-width="1"/>
                                <circle cx="12" cy="12" r="4" fill="none" stroke="#fff" stroke-width="1"/>
                                <circle cx="12" cy="12" r="1.5" fill="#fff"/>
                            </svg>
                        </div>
                        <div class="storage-stat-text hdd">
                            <span class="type">HDD:</span> <b>${Math.round(ssdHddMedians.hdd.priceMedian)} €/TB</b> (${ssdHddMedians.hdd.count}x)
                        </div>
                    </div>
                `;
            }
            
            html += '</div>';
        } else {
            html += `<br>Sammle Daten für Quartal ${dateHelper.getCurrentQuarterKey()}...`;
        }
        
        displayDiv.innerHTML = html;
        filterManager.createFilterUI();
        
        setTimeout(setupCrossHoverEffects, 100);
    }
    
    // --- INITIALISIERUNG ---
    function init() {
        console.log('Kleinanzeigen Festplatten-Analyzer v9.4 (Polierte UI) gestartet.');
        storageManager.finalizeQuarters();
        filterManager.init();
        activateKeyboardShortcuts();
        processAdItems();
        
        const observer = new MutationObserver(() => setTimeout(processAdItems, 400));
        const container = document.querySelector('#srchrslt-adtable');
        if (container) { 
            observer.observe(container, { childList: true, subtree: true }); 
        }
    }
    
    if (document.readyState === 'loading') { 
        document.addEventListener('DOMContentLoaded', init); 
    } else { 
        init(); 
    }
})();