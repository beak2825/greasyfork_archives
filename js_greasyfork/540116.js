// ==UserScript==
// @name         Tech Stack Detector
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Advanced website technology stack analysis with performance metrics, security audit, SEO analysis, and real-time monitoring
// @author       Tech Detector
// @match        *://*/*
// @grant        GM_addStyle
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_notification
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/540116/Tech%20Stack%20Detector.user.js
// @updateURL https://update.greasyfork.org/scripts/540116/Tech%20Stack%20Detector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Add enhanced CSS styles
    GM_addStyle(`
        #tech-stack-detector {
            position: fixed;
            top: 20px;
            right: 20px;
            width: 450px;
            max-height: 85vh;
            background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
            border: 2px solid #444;
            border-radius: 12px;
            color: #fff;
            font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Roboto Mono', monospace;
            font-size: 12px;
            z-index: 10000;
            overflow: hidden;
            box-shadow: 0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.1);
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
        }

        #tech-stack-header {
            background: linear-gradient(90deg, #333 0%, #444 100%);
            padding: 12px 15px;
            border-bottom: 1px solid #555;
            display: flex;
            justify-content: space-between;
            align-items: center;
            box-shadow: 0 2px 10px rgba(0,0,0,0.3);
        }

        #tech-stack-tabs {
            display: flex;
            background: #2a2a2a;
            border-bottom: 1px solid #444;
        }

        .tab {
            flex: 1;
            padding: 8px 12px;
            background: #2a2a2a;
            border: none;
            color: #aaa;
            cursor: pointer;
            font-size: 11px;
            transition: all 0.2s ease;
            position: relative;
        }

        .tab.active {
            background: #3a3a3a;
            color: #4CAF50;
            box-shadow: inset 0 -2px 0 #4CAF50;
        }

        .tab:hover {
            background: #353535;
            color: #fff;
        }

        #tech-stack-content {
            padding: 15px;
            max-height: 55vh;
            overflow-y: auto;
            scrollbar-width: thin;
            scrollbar-color: #555 #2a2a2a;
        }

        #tech-stack-content::-webkit-scrollbar {
            width: 6px;
        }

        #tech-stack-content::-webkit-scrollbar-track {
            background: #2a2a2a;
        }

        #tech-stack-content::-webkit-scrollbar-thumb {
            background: #555;
            border-radius: 3px;
        }

        .tech-category {
            margin-bottom: 20px;
            border-bottom: 1px solid #333;
            padding-bottom: 12px;
        }

        .tech-category h3 {
            color: #4CAF50;
            margin: 0 0 10px 0;
            font-size: 14px;
            display: flex;
            align-items: center;
            gap: 8px;
        }

        .tech-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin: 8px 0;
            padding: 6px 10px;
            background: rgba(255,255,255,0.03);
            border-radius: 6px;
            border-left: 3px solid #4CAF50;
            transition: all 0.2s ease;
        }

        .tech-item:hover {
            background: rgba(255,255,255,0.08);
            transform: translateX(3px);
        }

        .tech-name {
            color: #fff;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .tech-version {
            color: #FFB74D;
            font-weight: 500;
        }

        .tech-confidence {
            color: #81C784;
            font-size: 10px;
            background: rgba(129, 199, 132, 0.2);
            padding: 2px 6px;
            border-radius: 10px;
            margin-left: 6px;
        }

        .security-good { color: #4CAF50; }
        .security-warning { color: #FF9800; }
        .security-bad { color: #F44336; }
        .security-critical { color: #D32F2F; background: rgba(211, 47, 47, 0.1); }

        .metric-score {
            font-weight: bold;
            padding: 2px 6px;
            border-radius: 4px;
            font-size: 11px;
        }

        .score-excellent { background: #4CAF50; color: white; }
        .score-good { background: #8BC34A; color: white; }
        .score-average { background: #FF9800; color: white; }
        .score-poor { background: #F44336; color: white; }

        .toggle-btn, .export-btn {
            background: linear-gradient(45deg, #4CAF50, #45a049);
            border: none;
            color: white;
            padding: 6px 12px;
            border-radius: 6px;
            cursor: pointer;
            font-size: 11px;
            margin-left: 5px;
            transition: all 0.2s ease;
        }

        .export-btn {
            background: linear-gradient(45deg, #2196F3, #1976D2);
        }

        .toggle-btn:hover, .export-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        }

        .close-btn {
            background: linear-gradient(45deg, #f44336, #d32f2f);
            border: none;
            color: white;
            padding: 6px 10px;
            border-radius: 6px;
            cursor: pointer;
            margin-left: 5px;
                : all 0.2s ease;
        }

        .close-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 4px 12px rgba(244, 67, 54, 0.3);
        }

        .loading {
            color: #FFB74D;
            font-style: italic;
            text-align: center;
            padding: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 10px;
        }

        .loading::before {
            content: '';
            width: 20px;
            height: 20px;
            border: 2px solid #FFB74D;
            border-top: 2px solid transparent;
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }

        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }

        .vulnerability {
            background: rgba(244, 67, 54, 0.1);
            border-left-color: #F44336 !important;
            border-left-width: 4px;
        }

        .performance-metric {
            display: grid;
            grid-template-columns: 1fr auto auto;
            gap: 10px;
            align-items: center;
        }

        .api-endpoint {
            font-family: monospace;
            background: rgba(33, 150, 243, 0.1);
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 10px;
            margin: 2px 0;
        }

        .tech-icon {
            width: 16px;
            height: 16px;
            display: inline-block;
        }

        .floating-toggle {
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #4CAF50, #45a049);
            border: none;
            color: white;
            padding: 12px;
            border-radius: 50%;
            cursor: pointer;
            z-index: 10001;
            font-size: 18px;
            box-shadow: 0 4px 20px rgba(76, 175, 80, 0.4);
            transition: all 0.3s ease;
        }

        .floating-toggle:hover {
            transform: scale(1.1);
            box-shadow: 0 6px 25px rgba(76, 175, 80, 0.6);
        }

        .notification {
            position: fixed;
            top: 80px;
            right: 20px;
            background: #333;
            color: white;
            padding: 10px 15px;
            border-radius: 6px;
            z-index: 10002;
            animation: slideIn 0.3s ease;
        }

        @keyframes slideIn {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }

        .tab-content {
            display: none;
        }

        .tab-content.active {
            display: block;
        }

        .progress-bar {
            width: 100%;
            height: 4px;
            background: #333;
            border-radius: 2px;
            overflow: hidden;
            margin: 5px 0;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #4CAF50, #8BC34A);
            transition: width 0.3s ease;
        }
    `);

    class AdvancedTechStackDetector {
        constructor() {
            this.results = {
                frontend: [],
                backend: [],
                database: [],
                cdn: [],
                hosting: [],
                security: [],
                performance: [],
                seo: [],
                analytics: [],
                apis: [],
                buildTools: [],
                thirdParty: [],
                vulnerabilities: []
            };
            this.networkRequests = [];
            this.performanceMetrics = {};
            this.isVisible = false;
            this.activeTab = 'overview';
            this.monitoringEnabled = false;
            this.init();
        }

        init() {
            this.createUI();
            this.startNetworkMonitoring();
            
            // Run detection asynchronously to avoid blocking UI
            setTimeout(() => {
                this.detectTechnologies();
                this.analyzePerformance();
                this.analyzeSEO();
                
                // Update UI after detection is complete
                setTimeout(() => {
                    this.updateUI();
                }, 100);
            }, 100);
        }

        createUI() {
            const container = document.createElement('div');
            container.id = 'tech-stack-detector';
            container.style.display = 'none';

            container.innerHTML = `
                <div id="tech-stack-header">
                    <span>🚀 Advanced Tech Stack Detector Pro</span>
                    <div>
                        <button class="export-btn" id="export-btn">📊 Export</button>
                    </div>
                </div>
                <div id="tech-stack-tabs">
                    <button class="tab active" data-tab="overview">Overview</button>
                    <button class="tab" data-tab="security">Security</button>
                    <button class="tab" data-tab="performance">Performance</button>
                    <button class="tab" data-tab="seo">SEO</button>
                    <button class="tab" data-tab="network">Network</button>
                </div>
                <div id="tech-stack-content">
                    <div class="loading">🔄 Performing deep analysis...</div>
                </div>
            `;

            document.body.appendChild(container);

            // Create enhanced toggle button
            const toggleBtn = document.createElement('button');
            toggleBtn.innerHTML = '🚀';
            toggleBtn.className = 'floating-toggle';
            toggleBtn.onclick = () => this.toggleVisibility();
            document.body.appendChild(toggleBtn);

            window.techDetector = this;
            
            // Add event listeners for all buttons
            this.setupEventListeners();
        }

        setupEventListeners() {
            // Wait a bit to ensure DOM is ready
            setTimeout(() => {
                // Setup tab listeners
                const tabs = document.querySelectorAll('.tab');
                tabs.forEach(tab => {
                    tab.addEventListener('click', (e) => {
                        const tabName = e.target.getAttribute('data-tab');
                        this.switchTab(tabName);
                    });
                });

                // Setup header button listeners
                const exportBtn = document.getElementById('export-btn');

                if (exportBtn) {
                    exportBtn.addEventListener('click', () => this.exportResults());
                }
            }, 100);
        }

        startNetworkMonitoring() {
            // Monitor fetch requests
            const originalFetch = window.fetch;
            window.fetch = (...args) => {
                const startTime = performance.now();
                this.networkRequests.push({
                    url: args[0],
                    method: args[1]?.method || 'GET',
                    timestamp: Date.now(),
                    type: 'fetch'
                });
                
                return originalFetch.apply(this, args).then(response => {
                    const endTime = performance.now();
                    this.networkRequests[this.networkRequests.length - 1].duration = endTime - startTime;
                    this.networkRequests[this.networkRequests.length - 1].status = response.status;
                    return response;
                });
            };

            // Monitor XMLHttpRequest
            const originalXHR = window.XMLHttpRequest;
            window.XMLHttpRequest = function() {
                const xhr = new originalXHR();
                const originalOpen = xhr.open;
                const originalSend = xhr.send;
                
                xhr.open = function(method, url) {
                    this._method = method;
                    this._url = url;
                    this._startTime = performance.now();
                    return originalOpen.apply(this, arguments);
                };
                
                xhr.send = function() {
                    const detector = window.techDetector;
                    if (detector) {
                        detector.networkRequests.push({
                            url: this._url,
                            method: this._method,
                            timestamp: Date.now(),
                            type: 'xhr'
                        });
                    }
                    
                    this.addEventListener('loadend', () => {
                        if (detector && this._startTime) {
                            const duration = performance.now() - this._startTime;
                            const lastRequest = detector.networkRequests[detector.networkRequests.length - 1];
                            if (lastRequest) {
                                lastRequest.duration = duration;
                                lastRequest.status = this.status;
                            }
                        }
                    });
                    
                    return originalSend.apply(this, arguments);
                };
                
                return xhr;
            };
        }

        async detectTechnologies() {
            // Enhanced Frontend Detection
            await this.detectAdvancedFrontend();

            // Enhanced Backend Detection
            await this.detectAdvancedBackend();

            // Build Tools Detection
            await this.detectBuildTools();

            // Third-party Services Detection
            await this.detectThirdPartyServices();

            // CDN & Hosting Detection
            await this.detectCDNAndHosting();

            // API Detection
            await this.detectAPIs();

            // Security Analysis
            await this.analyzeAdvancedSecurity();

            // Database Detection
            this.detectDatabase();

            // Vulnerability Assessment
            await this.assessVulnerabilities();

            // Detection complete - UI will be updated from init()
        }

        async detectAdvancedFrontend() {
            const checks = [
                // React Ecosystem
                {
                    name: 'React',
                    detect: () => {
                        if (window.React) {
                            return { 
                                version: window.React.version || 'Unknown', 
                                confidence: 'High',
                                details: this.getReactDetails()
                            };
                        }
                        if (document.querySelector('[data-reactroot], [data-react-helmet]') || 
                            document.querySelector('div[id="root"], div[id="app"]')) {
                            return { version: 'Unknown', confidence: 'Medium' };
                        }
                        return null;
                    }
                },

                // Next.js
                {
                    name: 'Next.js',
                    detect: () => {
                        if (window.__NEXT_DATA__ || window.__nextjs || 
                            document.querySelector('script[src*="/_next/"]')) {
                            const version = window.__NEXT_DATA__?.buildId ? 'Detected' : 'Unknown';
                            return { version, confidence: 'High' };
                        }
                        return null;
                    }
                },

                // Vue.js Ecosystem
                {
                    name: 'Vue.js',
                    detect: () => {
                        if (window.Vue) {
                            return { 
                                version: window.Vue.version || 'Unknown', 
                                confidence: 'High',
                                details: this.getVueDetails()
                            };
                        }
                        if (document.querySelector('[data-v-]') || document.querySelector('[v-]')) {
                            return { version: 'Unknown', confidence: 'Medium' };
                        }
                        return null;
                    }
                },

                // Nuxt.js
                {
                    name: 'Nuxt.js',
                    detect: () => {
                        if (window.$nuxt || window.__NUXT__ || 
                            document.querySelector('script[src*="/_nuxt/"]')) {
                            return { version: 'Detected', confidence: 'High' };
                        }
                        return null;
                    }
                },

                // Angular Ecosystem
                {
                    name: 'Angular',
                    detect: () => {
                        if (window.ng || window.angular) {
                            const version = window.ng?.version?.full || window.angular?.version?.full || 'Unknown';
                            return { 
                                version, 
                                confidence: 'High',
                                details: this.getAngularDetails()
                            };
                        }
                        if (document.querySelector('[ng-app], [ng-controller], app-root, [ng-version]')) {
                            return { version: 'Unknown', confidence: 'Medium' };
                        }
                        return null;
                    }
                },

                // Svelte/SvelteKit
                {
                    name: 'Svelte',
                    detect: () => {
                        if (window.__SVELTE__ || document.querySelector('[data-svelte]')) {
                            return { version: 'Detected', confidence: 'High' };
                        }
                        return null;
                    }
                },

                // Solid.js
                {
                    name: 'Solid.js',
                    detect: () => {
                        if (window.Solid || document.querySelector('[data-solid]')) {
                            return { version: 'Detected', confidence: 'High' };
                        }
                        return null;
                    }
                },

                // Alpine.js
                {
                    name: 'Alpine.js',
                    detect: () => {
                        if (window.Alpine || document.querySelector('[x-data], [x-show], [x-if]')) {
                            return { version: window.Alpine?.version || 'Unknown', confidence: 'High' };
                        }
                        return null;
                    }
                },

                // Lit
                {
                    name: 'Lit',
                    detect: () => {
                        if (window.lit || document.querySelector('[lit]')) {
                            return { version: 'Detected', confidence: 'High' };
                        }
                        return null;
                    }
                },

                // jQuery and plugins
                {
                    name: 'jQuery',
                    detect: () => {
                        if (window.jQuery || window.$) {
                            const version = (window.jQuery || window.$).fn?.jquery || 'Unknown';
                            return { 
                                version, 
                                confidence: 'High',
                                details: this.getJQueryPlugins()
                            };
                        }
                        return null;
                    }
                },

                // CSS Frameworks
                {
                    name: 'Bootstrap',
                    detect: () => {
                        if (window.bootstrap || document.querySelector('.bootstrap, [class*="bs-"]')) {
                            const version = window.bootstrap?.Tooltip?.VERSION || 'Unknown';
                            return { version, confidence: 'High' };
                        }
                        if (document.querySelector('.container, .row, .col-, [class*="btn-"]')) {
                            return { version: 'Unknown', confidence: 'Medium' };
                        }
                        return null;
                    }
                },

                {
                    name: 'Tailwind CSS',
                    detect: () => {
                        const tailwindClasses = ['tw-', 'text-', 'bg-', 'p-', 'm-', 'flex', 'grid', 'hidden', 'block'];
                        const hasTailwind = tailwindClasses.some(cls => 
                            document.querySelector(`[class*="${cls}"]`)
                        );
                        if (hasTailwind) {
                            return { version: 'Unknown', confidence: 'Medium' };
                        }
                        return null;
                    }
                },

                {
                    name: 'Bulma',
                    detect: () => {
                        if (document.querySelector('.bulma, .column, .hero, [class*="is-"]')) {
                            return { version: 'Unknown', confidence: 'Medium' };
                        }
                        return null;
                    }
                },

                {
                    name: 'Foundation',
                    detect: () => {
                        if (window.Foundation || document.querySelector('[class*="foundation"], .grid-x, .cell')) {
                            return { version: 'Unknown', confidence: 'Medium' };
                        }
                        return null;
                    }
                },

                // State Management
                {
                    name: 'Redux',
                    detect: () => {
                        if (window.__REDUX_DEVTOOLS_EXTENSION__ || window.Redux) {
                            return { version: 'Detected', confidence: 'High' };
                        }
                        return null;
                    }
                },

                {
                    name: 'MobX',
                    detect: () => {
                        if (window.mobx || window.__mobxDidRunLazyInitializers) {
                            return { version: 'Detected', confidence: 'High' };
                        }
                        return null;
                    }
                },

                {
                    name: 'Zustand',
                    detect: () => {
                        if (window.zustand) {
                            return { version: 'Detected', confidence: 'High' };
                        }
                        return null;
                    }
                },

                // UI Libraries
                {
                    name: 'Material-UI',
                    detect: () => {
                        if (document.querySelector('[class*="MuiBox"], [class*="MuiButton"]') || window.mui) {
                            return { version: 'Unknown', confidence: 'Medium' };
                        }
                        return null;
                    }
                },

                {
                    name: 'Ant Design',
                    detect: () => {
                        if (document.querySelector('[class*="ant-"], .antd') || window.antd) {
                            return { version: 'Unknown', confidence: 'Medium' };
                        }
                        return null;
                    }
                },

                {
                    name: 'Chakra UI',
                    detect: () => {
                        if (document.querySelector('[class*="chakra"], [class*="css-"]')) {
                            return { version: 'Unknown', confidence: 'Low' };
                        }
                        return null;
                    }
                },

                // Animation Libraries
                {
                    name: 'GSAP',
                    detect: () => {
                        if (window.gsap || window.TweenMax || window.TweenLite) {
                            return { version: window.gsap?.version || 'Unknown', confidence: 'High' };
                        }
                        return null;
                    }
                },

                {
                    name: 'Framer Motion',
                    detect: () => {
                        if (document.querySelector('[data-framer-motion]') || window.framerMotion) {
                            return { version: 'Detected', confidence: 'High' };
                        }
                        return null;
                    }
                },

                // Testing Libraries (in dev mode)
                {
                    name: 'Jest',
                    detect: () => {
                        if (window.jest || window.__coverage__) {
                            return { version: 'Detected', confidence: 'High' };
                        }
                        return null;
                    }
                },

                // Module Bundlers (runtime detection)
                {
                    name: 'Webpack',
                    detect: () => {
                        if (window.webpackJsonp || window.__webpack_require__ || 
                            document.querySelector('script[src*="webpack"]')) {
                            return { version: 'Detected', confidence: 'High' };
                        }
                        return null;
                    }
                },

                {
                    name: 'Vite',
                    detect: () => {
                        if (window.__vite__ || document.querySelector('script[type="module"][src*="vite"]')) {
                            return { version: 'Detected', confidence: 'High' };
                        }
                        return null;
                    }
                },

                {
                    name: 'Parcel',
                    detect: () => {
                        if (window.parcelRequire || document.querySelector('script[src*="parcel"]')) {
                            return { version: 'Detected', confidence: 'High' };
                        }
                        return null;
                    }
                }
            ];

            checks.forEach(check => {
                const result = check.detect();
                if (result) {
                    this.results.frontend.push({
                        name: check.name,
                        version: result.version,
                        confidence: result.confidence,
                        details: result.details || null
                    });
                }
            });
        }

        detectBackend() {
            const scripts = Array.from(document.querySelectorAll('script[src]'));
            const links = Array.from(document.querySelectorAll('link[href]'));
            const metas = Array.from(document.querySelectorAll('meta'));

            // Check for common backend indicators
            const indicators = [
                { name: 'WordPress', pattern: /wp-content|wp-includes|wordpress/i },
                { name: 'Drupal', pattern: /drupal|sites\/default/i },
                { name: 'Joomla', pattern: /joomla|com_content/i },
                { name: 'Magento', pattern: /magento|mage\/js/i },
                { name: 'Shopify', pattern: /shopify|cdn\.shopify/i },
                { name: 'Django', pattern: /django|__admin/i },
                { name: 'Rails', pattern: /rails|ruby/i },
                { name: 'ASP.NET', pattern: /aspnet|webresource\.axd/i },
                { name: 'PHP', pattern: /\.php/i }
            ];

            const allContent = document.documentElement.outerHTML;
            const allSources = [...scripts.map(s => s.src), ...links.map(l => l.href)].join(' ');

            indicators.forEach(indicator => {
                if (indicator.pattern.test(allContent + allSources)) {
                    this.results.backend.push({
                        name: indicator.name,
                        version: 'Unknown',
                        confidence: 'Medium'
                    });
                }
            });

            // Check generator meta tag
            const generator = metas.find(m => m.name === 'generator');
            if (generator && generator.content) {
                this.results.backend.push({
                    name: generator.content.split(' ')[0],
                    version: generator.content.split(' ')[1] || 'Unknown',
                    confidence: 'High'
                });
            }
        }

        async detectCDNAndHosting() {
            const scripts = Array.from(document.querySelectorAll('script[src]'));
            const links = Array.from(document.querySelectorAll('link[href]'));
            const allSources = [...scripts.map(s => s.src), ...links.map(l => l.href)];

            // Enhanced CDN Detection
            const cdnPatterns = [
                { name: 'Cloudflare', pattern: /cloudflare|cdnjs\.cloudflare|cf-ray/i, confidence: 'High' },
                { name: 'AWS CloudFront', pattern: /cloudfront\.net|amazonaws\.com/i, confidence: 'High' },
                { name: 'Google Cloud CDN', pattern: /googleapis\.com|gstatic\.com|googleusercontent/i, confidence: 'High' },
                { name: 'jsDelivr', pattern: /jsdelivr\.net/i, confidence: 'High' },
                { name: 'unpkg', pattern: /unpkg\.com/i, confidence: 'High' },
                { name: 'MaxCDN', pattern: /maxcdn\.bootstrapcdn|stackpath\.bootstrapcdn/i, confidence: 'High' },
                { name: 'KeyCDN', pattern: /keycdn\.com/i, confidence: 'High' },
                { name: 'BunnyCDN', pattern: /bunnycdn\.com/i, confidence: 'High' },
                { name: 'Fastly', pattern: /fastly\.com|fastlylb/i, confidence: 'High' },
                { name: 'Azure CDN', pattern: /azureedge\.net/i, confidence: 'High' },
                { name: 'Akamai', pattern: /akamai\.net|edgesuite\.net/i, confidence: 'High' },
                { name: 'Cachefly', pattern: /cachefly\.net/i, confidence: 'High' }
            ];

            cdnPatterns.forEach(cdn => {
                if (allSources.some(src => cdn.pattern.test(src))) {
                    this.results.cdn.push({
                        name: cdn.name,
                        version: 'Active',
                        confidence: cdn.confidence
                    });
                }
            });

            const currentUrl = window.location.href;
            const hostname = window.location.hostname;

            // Enhanced hosting platform detection
            const hostingPatterns = [
                { name: 'Vercel', pattern: /vercel\.app|vercel\.com|_vercel/i, confidence: 'High' },
                { name: 'Netlify', pattern: /netlify\.app|netlify\.com|_netlify/i, confidence: 'High' },
                { name: 'GitHub Pages', pattern: /github\.io|githubusercontent/i, confidence: 'High' },
                { name: 'Heroku', pattern: /herokuapp\.com|herokucdn/i, confidence: 'High' },
                { name: 'Firebase Hosting', pattern: /firebase\.com|firebaseapp\.com|web\.app/i, confidence: 'High' },
                { name: 'Cloudflare Pages', pattern: /pages\.dev/i, confidence: 'High' },
                { name: 'AWS S3', pattern: /s3\.amazonaws\.com|s3-website/i, confidence: 'High' },
                { name: 'Surge.sh', pattern: /surge\.sh/i, confidence: 'High' },
                { name: 'Now.sh', pattern: /now\.sh/i, confidence: 'High' },
                { name: 'DigitalOcean', pattern: /digitalocean\.com|digitaloceanspaces/i, confidence: 'Medium' },
                { name: 'Linode', pattern: /linode\.com/i, confidence: 'Medium' },
                { name: 'Railway', pattern: /railway\.app/i, confidence: 'High' },
                { name: 'Render', pattern: /render\.com|onrender\.com/i, confidence: 'High' }
            ];

            hostingPatterns.forEach(hosting => {
                if (hosting.pattern.test(currentUrl + hostname)) {
                    this.results.hosting.push({
                        name: hosting.name,
                        version: 'Active',
                        confidence: hosting.confidence
                    });
                }
            });
        }

        async analyzeAdvancedSecurity() {
            const security = [];

            // HTTPS check
            if (window.location.protocol === 'https:') {
                security.push({
                    name: 'HTTPS',
                    version: '✓ Enabled',
                    confidence: 'High',
                    status: 'good'
                });
            } else {
                security.push({
                    name: 'HTTPS',
                    version: '✗ Disabled',
                    confidence: 'High',
                    status: 'bad'
                });
            }

            // CSP Analysis
            const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            if (cspMeta) {
                const cspValue = cspMeta.content;
                const hasUnsafeInline = cspValue.includes("'unsafe-inline'");
                const hasUnsafeEval = cspValue.includes("'unsafe-eval'");
                
                security.push({
                    name: 'Content Security Policy',
                    version: hasUnsafeInline || hasUnsafeEval ? '⚠ Weak CSP' : '✓ Strong CSP',
                    confidence: 'High',
                    status: hasUnsafeInline || hasUnsafeEval ? 'warning' : 'good'
                });
            } else {
                security.push({
                    name: 'Content Security Policy',
                    version: '✗ Not found',
                    confidence: 'High',
                    status: 'warning'
                });
            }

            // Mixed content detection
            const mixedContent = Array.from(document.querySelectorAll('script[src], link[href], img[src], iframe[src]'))
                .some(el => {
                    const src = el.src || el.href;
                    return src && src.startsWith('http:') && window.location.protocol === 'https:';
                });

            security.push({
                name: 'Mixed Content',
                version: mixedContent ? '⚠ Detected' : '✓ None detected',
                confidence: 'High',
                status: mixedContent ? 'warning' : 'good'
            });

            // Cookie security analysis
            const cookies = document.cookie.split(';');
            const secureFlag = cookies.some(cookie => cookie.includes('Secure'));
            const httpOnlyFlag = cookies.some(cookie => cookie.includes('HttpOnly'));
            const sameSiteFlag = cookies.some(cookie => cookie.includes('SameSite'));

            if (cookies.length > 1) {
                security.push({
                    name: 'Cookie Security',
                    version: `${secureFlag ? '✓' : '✗'} Secure, ${httpOnlyFlag ? '✓' : '✗'} HttpOnly, ${sameSiteFlag ? '✓' : '✗'} SameSite`,
                    confidence: 'Medium',
                    status: secureFlag && sameSiteFlag ? 'good' : 'warning'
                });
            }

            // Check for common vulnerabilities
            await this.checkCommonVulnerabilities(security);

            this.results.security = security;
        }

        async checkCommonVulnerabilities(security) {
            // Check for potential XSS vulnerabilities
            const scripts = Array.from(document.querySelectorAll('script'));
            const inlineScripts = scripts.filter(s => !s.src && s.innerHTML);
            const hasInlineScripts = inlineScripts.length > 0;

            if (hasInlineScripts) {
                security.push({
                    name: 'Inline Scripts',
                    version: `⚠ ${inlineScripts.length} inline scripts detected`,
                    confidence: 'Medium',
                    status: 'warning'
                });
            }

            // Check for eval usage
            const pageContent = document.documentElement.outerHTML;
            if (pageContent.includes('eval(') || pageContent.includes('Function(')) {
                security.push({
                    name: 'Dynamic Code Execution',
                    version: '⚠ eval() or Function() detected',
                    confidence: 'Medium',
                    status: 'warning'
                });
            }

            // Check for document.write usage
            if (pageContent.includes('document.write')) {
                security.push({
                    name: 'Document Write',
                    version: '⚠ document.write() detected',
                    confidence: 'Medium',
                    status: 'warning'
                });
            }

            // Check for iframe security
            const iframes = document.querySelectorAll('iframe');
            const unsafeIframes = Array.from(iframes).filter(iframe => 
                !iframe.hasAttribute('sandbox') || 
                iframe.src.startsWith('http:')
            );

            if (unsafeIframes.length > 0) {
                security.push({
                    name: 'Iframe Security',
                    version: `⚠ ${unsafeIframes.length} potentially unsafe iframes`,
                    confidence: 'Medium',
                    status: 'warning'
                });
            }
        }

        detectDatabase() {
            // Enhanced database inference
            const backendNames = this.results.backend.map(b => b.name.toLowerCase());
            const pageContent = document.documentElement.outerHTML.toLowerCase();

            const dbInferences = [
                { indicators: ['wordpress', 'woocommerce', 'drupal', 'joomla'], db: 'MySQL', confidence: 'High' },
                { indicators: ['django', 'postgresql'], db: 'PostgreSQL', confidence: 'High' },
                { indicators: ['rails', 'ruby'], db: 'PostgreSQL/MySQL', confidence: 'Medium' },
                { indicators: ['asp.net', 'microsoft', 'iis'], db: 'SQL Server', confidence: 'Medium' },
                { indicators: ['mongodb', 'mongoose', 'mongo'], db: 'MongoDB', confidence: 'High' },
                { indicators: ['redis', 'cache'], db: 'Redis', confidence: 'Medium' },
                { indicators: ['firebase', 'firestore'], db: 'Firestore', confidence: 'High' },
                { indicators: ['supabase'], db: 'Supabase (PostgreSQL)', confidence: 'High' },
                { indicators: ['planetscale'], db: 'PlanetScale (MySQL)', confidence: 'High' },
                { indicators: ['fauna', 'faunadb'], db: 'FaunaDB', confidence: 'High' },
                { indicators: ['dynamodb', 'aws'], db: 'DynamoDB', confidence: 'Medium' },
                { indicators: ['sqlite'], db: 'SQLite', confidence: 'Medium' },
                { indicators: ['oracle'], db: 'Oracle Database', confidence: 'Medium' },
                { indicators: ['cassandra'], db: 'Apache Cassandra', confidence: 'Medium' },
                { indicators: ['elasticsearch', 'elastic'], db: 'Elasticsearch', confidence: 'Medium' }
            ];

            dbInferences.forEach(inference => {
                const isDetected = inference.indicators.some(indicator => 
                    backendNames.includes(indicator) || pageContent.includes(indicator)
                );
                
                if (isDetected) {
                    this.results.database.push({
                        name: inference.db,
                        version: 'Inferred',
                        confidence: inference.confidence
                    });
                }
            });
        }

        async assessVulnerabilities() {
            const vulnerabilities = [];

            // Check for known vulnerable libraries
            const knownVulnerabilities = [
                { 
                    library: 'jQuery', 
                    versions: ['1.0.0', '1.1.0', '1.2.0', '1.3.0', '1.4.0', '1.5.0', '1.6.0', '1.7.0', '1.8.0', '1.9.0'],
                    risk: 'High',
                    issue: 'Multiple XSS vulnerabilities'
                },
                {
                    library: 'Angular',
                    versions: ['1.0.0', '1.1.0', '1.2.0', '1.3.0', '1.4.0', '1.5.0'],
                    risk: 'Medium',
                    issue: 'XSS and injection vulnerabilities'
                }
            ];

            this.results.frontend.forEach(tech => {
                const vuln = knownVulnerabilities.find(v => v.library === tech.name);
                if (vuln && vuln.versions.some(v => tech.version.includes(v))) {
                    vulnerabilities.push({
                        name: `${tech.name} Vulnerability`,
                        version: `${vuln.risk} Risk: ${vuln.issue}`,
                        confidence: 'High',
                        status: 'critical'
                    });
                }
            });

            // Check for outdated libraries (basic check)
            const currentYear = new Date().getFullYear();
            this.results.frontend.forEach(tech => {
                if (tech.version.includes('1.') || tech.version.includes('2.')) {
                    vulnerabilities.push({
                        name: `Potentially Outdated: ${tech.name}`,
                        version: `Version ${tech.version} may be outdated`,
                        confidence: 'Low',
                        status: 'warning'
                    });
                }
            });

            this.results.vulnerabilities = vulnerabilities;
        }

        switchTab(tabName) {
            this.activeTab = tabName;
            
            // Update tab buttons
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
                if (tab.getAttribute('data-tab') === tabName) {
                    tab.classList.add('active');
                }
            });
            
            this.updateUI();
        }

        updateUI() {
            try {
                const content = document.getElementById('tech-stack-content');
                if (!content) {
                    console.error('Content container not found');
                    return;
                }
                
                let html = '';

                switch (this.activeTab) {
                    case 'overview':
                        html = this.generateOverviewHTML();
                        break;
                    case 'security':
                        html = this.generateSecurityHTML();
                        break;
                    case 'performance':
                        html = this.generatePerformanceHTML();
                        break;
                    case 'seo':
                        html = this.generateSEOHTML();
                        break;
                    case 'network':
                        html = this.generateNetworkHTML();
                        break;
                    default:    
                        html = this.generateOverviewHTML();
                }

                content.innerHTML = html;
                this.applyStatusColors();
            } catch (error) {
                console.error('Error updating UI:', error);
                const content = document.getElementById('tech-stack-content');
                if (content) {
                    content.innerHTML = `<div class="tech-item" style="color: #f44336;">Error loading content: ${error.message}</div>`;
                }
            }
        }

        generateOverviewHTML() {
            let html = '<div class="tab-content active">';
            
            const categories = [
                { key: 'frontend', title: 'Frontend Technologies', icon: '⚛️' },
                { key: 'backend', title: 'Backend Technologies', icon: '🔧' },
                { key: 'database', title: 'Databases', icon: '🗄️' },
                { key: 'cdn', title: 'CDN & Services', icon: '🌐' },
                { key: 'hosting', title: 'Hosting Platform', icon: '☁️' },
                { key: 'buildTools', title: 'Build Tools', icon: '🔨' },
                { key: 'thirdParty', title: 'Third-party Services', icon: '🔌' },
                { key: 'apis', title: 'APIs & Protocols', icon: '📡' }
            ];

            categories.forEach(category => {
                const items = this.results[category.key];
                if (items && items.length > 0) {
                    html += this.generateCategoryHTML(category.title, category.icon, items);
                }
            });

            // Summary statistics
            const totalTechs = Object.values(this.results).flat().length;
            html += `
                <div class="tech-category">
                    <h3>📊 Summary</h3>
                    <div class="tech-item">
                        <span class="tech-name">Total Technologies Detected</span>
                        <span class="tech-version">${totalTechs}</span>
                    </div>
                    <div class="tech-item">
                        <span class="tech-name">Network Requests Monitored</span>
                        <span class="tech-version">${this.networkRequests.length}</span>
                    </div>
                    <div class="tech-item">
                        <span class="tech-name">Page Load Time</span>
                        <span class="tech-version">${((this.performanceMetrics.loadComplete || 0) / 1000).toFixed(2)}s</span>
                    </div>
                </div>
            `;

            html += '</div>';
            return html;
        }

        generateSecurityHTML() {
            let html = '<div class="tab-content active">';
            
            // Security analysis
            if (this.results.security && this.results.security.length > 0) {
                html += this.generateCategoryHTML('Security Analysis', '🔒', this.results.security);
            } else {
                html += `
                    <div class="tech-category">
                        <h3>🔒 Security Analysis</h3>
                        <div class="tech-item">
                            <span class="tech-name">Running security analysis...</span>
                            <span class="tech-version">Please wait</span>
                        </div>
                    </div>
                `;
            }

            // Vulnerabilities
            if (this.results.vulnerabilities && this.results.vulnerabilities.length > 0) {
                html += this.generateCategoryHTML('Potential Vulnerabilities', '⚠️', this.results.vulnerabilities, true);
            } else {
                html += `
                    <div class="tech-category">
                        <h3>⚠️ Potential Vulnerabilities</h3>
                        <div class="tech-item">
                            <span class="tech-name">No obvious vulnerabilities detected</span>
                            <span class="tech-version security-good">✓ Good</span>
                        </div>
                    </div>
                `;
            }

            // Security recommendations
            html += `
                <div class="tech-category">
                    <h3>💡 Security Recommendations</h3>
                    <div class="tech-item">
                        <span class="tech-name">Enable HTTPS</span>
                        <span class="tech-version">${window.location.protocol === 'https:' ? '✓ Done' : '❌ Required'}</span>
                    </div>
                    <div class="tech-item">
                        <span class="tech-name">Implement CSP</span>
                        <span class="tech-version">${document.querySelector('meta[http-equiv="Content-Security-Policy"]') ? '✓ Done' : '⚠️ Recommended'}</span>
                    </div>
                    <div class="tech-item">
                        <span class="tech-name">Use Secure Cookies</span>
                        <span class="tech-version">${document.cookie.includes('Secure') ? '✓ Done' : '⚠️ Recommended'}</span>
                    </div>
                </div>
            `;

            html += '</div>';
            return html;
        }

        generatePerformanceHTML() {
            let html = '<div class="tab-content active">';
            
            // Performance metrics
            if (this.results.performance && this.results.performance.length > 0) {
                html += `
                    <div class="tech-category">
                        <h3>⚡ Web Vitals</h3>
                        ${this.results.performance.map(metric => `
                            <div class="tech-item performance-metric">
                                <span class="tech-name">${metric.name}</span>
                                <span class="tech-version">${metric.value}</span>
                                <span class="metric-score score-${metric.score}">${metric.score.toUpperCase()}</span>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else {
                html += `
                    <div class="tech-category">
                        <h3>⚡ Web Vitals</h3>
                        <div class="tech-item">
                            <span class="tech-name">Analyzing performance...</span>
                            <span class="tech-version">Please wait</span>
                        </div>
                    </div>
                `;
            }

            // Detailed performance metrics
            if (this.performanceMetrics) {
                html += `
                    <div class="tech-category">
                        <h3>📊 Performance Metrics</h3>
                        <div class="tech-item">
                            <span class="tech-name">DOM Content Loaded</span>
                            <span class="tech-version">${((this.performanceMetrics.domContentLoaded || 0) / 1000).toFixed(2)}s</span>
                        </div>
                        <div class="tech-item">
                            <span class="tech-name">Page Load Complete</span>
                            <span class="tech-version">${((this.performanceMetrics.loadComplete || 0) / 1000).toFixed(2)}s</span>
                        </div>
                        <div class="tech-item">
                            <span class="tech-name">First Paint</span>
                            <span class="tech-version">${((this.performanceMetrics.firstPaint || 0) / 1000).toFixed(2)}s</span>
                        </div>
                        <div class="tech-item">
                            <span class="tech-name">First Contentful Paint</span>
                            <span class="tech-version">${((this.performanceMetrics.firstContentfulPaint || 0) / 1000).toFixed(2)}s</span>
                        </div>
                        <div class="tech-item">
                            <span class="tech-name">Resource Count</span>
                            <span class="tech-version">${this.performanceMetrics.resourceCount || 0}</span>
                        </div>
                        <div class="tech-item">
                            <span class="tech-name">Total Transfer Size</span>
                            <span class="tech-version">${((this.performanceMetrics.totalTransferSize || 0) / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                    </div>
                `;
            }

            // Performance recommendations
            html += `
                <div class="tech-category">
                    <h3>💡 Performance Recommendations</h3>
                    <div class="tech-item">
                        <span class="tech-name">Optimize Images</span>
                        <span class="tech-version">${document.querySelectorAll('img').length} images found</span>
                    </div>
                    <div class="tech-item">
                        <span class="tech-name">Minify Resources</span>
                        <span class="tech-version">${document.querySelectorAll('script:not([src*="min"]), link[href*=".css"]:not([href*="min"])').length} unminified resources</span>
                    </div>
                    <div class="tech-item">
                        <span class="tech-name">Enable Compression</span>
                        <span class="tech-version">Check server configuration</span>
                    </div>
                </div>
            `;

            html += '</div>';
            return html;
        }

        generateSEOHTML() {
            let html = '<div class="tab-content active">';
            
            if (this.results.seo && this.results.seo.length > 0) {
                html += this.generateCategoryHTML('SEO Analysis', '🔍', this.results.seo);
            } else {
                html += `
                    <div class="tech-category">
                        <h3>🔍 SEO Analysis</h3>
                        <div class="tech-item">
                            <span class="tech-name">Analyzing SEO...</span>
                            <span class="tech-version">Please wait</span>
                        </div>
                    </div>
                `;
            }

            // Additional SEO insights
            html += `
                <div class="tech-category">
                    <h3>📈 SEO Insights</h3>
                    <div class="tech-item">
                        <span class="tech-name">Page Load Speed</span>
                        <span class="tech-version ${(this.performanceMetrics?.loadComplete || 0) < 3000 ? 'security-good' : 'security-warning'}">
                            ${(this.performanceMetrics?.loadComplete || 0) < 3000 ? 'Good' : 'Needs Improvement'}
                        </span>
                    </div>
                    <div class="tech-item">
                        <span class="tech-name">Mobile Responsive</span>
                        <span class="tech-version">${document.querySelector('meta[name="viewport"]') ? '✓ Yes' : '❌ No'}</span>
                    </div>
                    <div class="tech-item">
                        <span class="tech-name">Social Media Ready</span>
                        <span class="tech-version">${document.querySelectorAll('meta[property^="og:"], meta[name^="twitter:"]').length > 0 ? '✓ Yes' : '❌ No'}</span>
                    </div>
                </div>
            `;

            html += '</div>';
            return html;
        }

        generateNetworkHTML() {
            let html = '<div class="tab-content active">';
            
            // Network requests summary
            html += `
                <div class="tech-category">
                    <h3>🌐 Network Activity</h3>
                    <div class="tech-item">
                        <span class="tech-name">Total Requests</span>
                        <span class="tech-version">${(this.networkRequests || []).length}</span>
                    </div>
                    <div class="tech-item">
                        <span class="tech-name">Average Response Time</span>
                        <span class="tech-version">${this.calculateAverageResponseTime()}ms</span>
                    </div>
                    <div class="tech-item">
                        <span class="tech-name">Failed Requests</span>
                        <span class="tech-version">${(this.networkRequests || []).filter(r => r.status >= 400).length}</span>
                    </div>
                </div>
            `;

            // Recent API calls
            if (this.networkRequests && this.networkRequests.length > 0) {
                html += `
                    <div class="tech-category">
                        <h3>📡 Recent API Calls</h3>
                        ${this.networkRequests.slice(-10).map(req => `
                            <div class="tech-item">
                                <div class="api-endpoint">${req.method || 'GET'} ${this.truncateUrl(req.url)}</div>
                                <span class="tech-version ${(req.status >= 400) ? 'security-bad' : 'security-good'}">
                                    ${req.status || 'Pending'} ${req.duration ? `(${req.duration.toFixed(0)}ms)` : ''}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                `;
            } else {
                html += `
                    <div class="tech-category">
                        <h3>📡 Network Monitoring</h3>
                        <div class="tech-item">
                            <span class="tech-name">Monitoring network requests...</span>
                            <span class="tech-version">Make some requests to see activity</span>
                        </div>
                    </div>
                `;
            }

            html += '</div>';
            return html;
        }

        generateCategoryHTML(title, icon, items, isVulnerability = false) {
            return `
                <div class="tech-category">
                    <h3>${icon} ${title}</h3>
                    ${items.map(item => `
                        <div class="tech-item ${isVulnerability ? 'vulnerability' : ''}">
                            <span class="tech-name">${item.name}</span>
                            <div>
                                <span class="tech-version ${item.status ? `security-${item.status}` : ''}">${item.version}</span>
                                <span class="tech-confidence">${item.confidence}</span>
                            </div>
                        </div>
                        ${item.details ? `<div class="tech-details">${item.details.join(', ')}</div>` : ''}
                    `).join('')}
                </div>
            `;
        }

        applyStatusColors() {
            // Enhanced status color application
            this.results.security.forEach((item, index) => {
                if (item.status) {
                    const elements = document.querySelectorAll('.tech-version');
                    elements.forEach(el => {
                        if (el.textContent.includes(item.version)) {
                            el.className = `tech-version security-${item.status}`;
                        }
                    });
                }
            });
        }

        calculateAverageResponseTime() {
            if (!this.networkRequests || this.networkRequests.length === 0) return 0;
            
            const validRequests = this.networkRequests.filter(r => r.duration);
            if (validRequests.length === 0) return 0;
            
            const total = validRequests.reduce((sum, req) => sum + req.duration, 0);
            return (total / validRequests.length).toFixed(0);
        }

        truncateUrl(url) {
            if (!url) return 'Unknown';
            if (url.length > 50) {
                return url.substring(0, 47) + '...';
            }
            return url;
        }

        exportResults() {
            const exportData = {
                url: window.location.href,
                timestamp: new Date().toISOString(),
                technologies: this.results,
                performance: this.performanceMetrics,
                networkRequests: this.networkRequests.length,
                summary: {
                    totalTechnologies: Object.values(this.results).flat().length,
                    securityScore: this.calculateSecurityScore(),
                    performanceScore: this.calculatePerformanceScore()
                }
            };

            // Create and download JSON file
            const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `tech-stack-analysis-${new Date().getTime()}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showNotification('📊 Analysis exported successfully!');
        }

        calculateSecurityScore() {
            const securityItems = this.results.security;
            if (securityItems.length === 0) return 0;
            
            const goodItems = securityItems.filter(item => item.status === 'good').length;
            return Math.round((goodItems / securityItems.length) * 100);
        }

        calculatePerformanceScore() {
            const loadTime = this.performanceMetrics.loadComplete || 0;
            if (loadTime < 1000) return 100;
            if (loadTime < 2000) return 80;
            if (loadTime < 3000) return 60;
            if (loadTime < 5000) return 40;
            return 20;
        }

        showNotification(message) {
            const notification = document.createElement('div');
            notification.className = 'notification';
            notification.textContent = message;
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.remove();
            }, 3000);
        }

        close() {
            const container = document.getElementById('tech-stack-detector');
            container.style.display = 'none';
            this.isVisible = false;
        }

        // Helper functions for detailed analysis
        getReactDetails() {
            const details = [];
            if (window.__REACT_DEVTOOLS_GLOBAL_HOOK__) {
                details.push('React DevTools detected');
            }
            if (window.ReactDOM) {
                details.push(`ReactDOM v${window.ReactDOM.version || 'Unknown'}`);
            }
            if (document.querySelector('[data-react-helmet]')) {
                details.push('React Helmet');
            }
            return details;
        }

        getVueDetails() {
            const details = [];
            if (window.__VUE_DEVTOOLS_GLOBAL_HOOK__) {
                details.push('Vue DevTools detected');
            }
            if (window.Vuex) {
                details.push('Vuex State Management');
            }
            if (window.VueRouter) {
                details.push('Vue Router');
            }
            return details;
        }

        getAngularDetails() {
            const details = [];
            if (window.ng) {
                details.push(`Angular CLI: ${window.ng.version?.full || 'Unknown'}`);
            }
            if (document.querySelector('[ng-version]')) {
                const version = document.querySelector('[ng-version]').getAttribute('ng-version');
                details.push(`Version: ${version}`);
            }
            return details;
        }

        getJQueryPlugins() {
            const plugins = [];
            if (window.jQuery) {
                const $ = window.jQuery;
                if ($.fn.modal) plugins.push('Bootstrap Modal');
                if ($.fn.tooltip) plugins.push('Tooltip');
                if ($.fn.carousel) plugins.push('Carousel');
                if ($.fn.datepicker) plugins.push('Datepicker');
                if ($.fn.select2) plugins.push('Select2');
                if ($.fn.slick) plugins.push('Slick Slider');
                if ($.fn.owlCarousel) plugins.push('Owl Carousel');
            }
            return plugins;
        }

        async detectAdvancedBackend() {
            const scripts = Array.from(document.querySelectorAll('script[src]'));
            const links = Array.from(document.querySelectorAll('link[href]'));
            const metas = Array.from(document.querySelectorAll('meta'));
            const headers = await this.analyzeHeaders();

            // Enhanced backend detection patterns
            const indicators = [
                // CMS Systems
                { name: 'WordPress', pattern: /wp-content|wp-includes|wordpress|wp-json/i, confidence: 'High' },
                { name: 'Drupal', pattern: /drupal|sites\/default|misc\/drupal/i, confidence: 'High' },
                { name: 'Joomla', pattern: /joomla|com_content|index\.php\?option=com/i, confidence: 'High' },
                { name: 'Magento', pattern: /magento|mage\/js|checkout\/cart/i, confidence: 'High' },
                { name: 'Shopify', pattern: /shopify|cdn\.shopify|assets\/shopify/i, confidence: 'High' },
                { name: 'Wix', pattern: /wix\.com|wixstatic|wixsite/i, confidence: 'High' },
                { name: 'Squarespace', pattern: /squarespace|static1\.squarespace/i, confidence: 'High' },
                { name: 'Webflow', pattern: /webflow|assets\.website-files/i, confidence: 'High' },
                
                // Frameworks
                { name: 'Django', pattern: /django|__admin|csrfmiddlewaretoken/i, confidence: 'High' },
                { name: 'Flask', pattern: /flask|werkzeug/i, confidence: 'Medium' },
                { name: 'FastAPI', pattern: /fastapi|swagger|openapi\.json/i, confidence: 'Medium' },
                { name: 'Ruby on Rails', pattern: /rails|ruby|authenticity_token/i, confidence: 'High' },
                { name: 'Laravel', pattern: /laravel|laravel_session|_token/i, confidence: 'High' },
                { name: 'Symfony', pattern: /symfony|sf_toolbar/i, confidence: 'Medium' },
                { name: 'CodeIgniter', pattern: /codeigniter|ci_session/i, confidence: 'Medium' },
                { name: 'CakePHP', pattern: /cakephp|cake\/|CAKEPHP/i, confidence: 'Medium' },
                { name: 'ASP.NET', pattern: /aspnet|webresource\.axd|__doPostBack/i, confidence: 'High' },
                { name: 'ASP.NET Core', pattern: /aspnetcore|__RequestVerificationToken/i, confidence: 'High' },
                { name: 'Express.js', pattern: /express|connect\.sid/i, confidence: 'Medium' },
                { name: 'Koa.js', pattern: /koa/i, confidence: 'Low' },
                { name: 'Nest.js', pattern: /nestjs/i, confidence: 'Medium' },
                { name: 'Spring Boot', pattern: /spring|jsessionid|spring-boot/i, confidence: 'Medium' },
                { name: 'Strapi', pattern: /strapi|\/api\/|application\/json/i, confidence: 'Low' },
                
                // Languages
                { name: 'PHP', pattern: /\.php|PHPSESSID/i, confidence: 'High' },
                { name: 'Python', pattern: /\.py|python|django|flask/i, confidence: 'Medium' },
                { name: 'Node.js', pattern: /node|npm|\.js/i, confidence: 'Low' },
                { name: 'Java', pattern: /\.jsp|\.java|jsessionid|struts/i, confidence: 'Medium' },
                { name: 'C#', pattern: /\.aspx|\.ashx|viewstate/i, confidence: 'High' },
                { name: 'Go', pattern: /golang|\.go/i, confidence: 'Low' },
                { name: 'Rust', pattern: /\.rs|rust/i, confidence: 'Low' },
                
                // Servers
                { name: 'Apache', pattern: /apache|httpd/i, confidence: 'Medium' },
                { name: 'Nginx', pattern: /nginx/i, confidence: 'Medium' },
                { name: 'IIS', pattern: /iis|microsoft-iis/i, confidence: 'Medium' },
                { name: 'Cloudflare', pattern: /cloudflare|cf-ray/i, confidence: 'High' }
            ];

            const allContent = document.documentElement.outerHTML;
            const allSources = [...scripts.map(s => s.src), ...links.map(l => l.href)].join(' ');
            const allText = allContent + allSources + JSON.stringify(headers);

            indicators.forEach(indicator => {
                if (indicator.pattern.test(allText)) {
                    this.results.backend.push({
                        name: indicator.name,
                        version: this.extractVersion(allText, indicator.name) || 'Unknown',
                        confidence: indicator.confidence
                    });
                }
            });

            // Check generator meta tag
            const generator = metas.find(m => m.name === 'generator');
            if (generator && generator.content) {
                const parts = generator.content.split(' ');
                this.results.backend.push({
                    name: parts[0],
                    version: parts[1] || 'Unknown',
                    confidence: 'High'
                });
            }

            // Check powered-by headers
            if (headers['x-powered-by']) {
                this.results.backend.push({
                    name: headers['x-powered-by'],
                    version: 'Detected from headers',
                    confidence: 'High'
                });
            }
        }

        async detectBuildTools() {
            const scripts = Array.from(document.querySelectorAll('script[src]'));
            const buildToolPatterns = [
                { name: 'Webpack', pattern: /webpack|chunk|bundle\.js/i },
                { name: 'Vite', pattern: /vite|@vite/i },
                { name: 'Parcel', pattern: /parcel/i },
                { name: 'Rollup', pattern: /rollup/i },
                { name: 'Gulp', pattern: /gulp/i },
                { name: 'Grunt', pattern: /grunt/i },
                { name: 'Browserify', pattern: /browserify/i },
                { name: 'esbuild', pattern: /esbuild/i },
                { name: 'Snowpack', pattern: /snowpack/i },
                { name: 'Turbopack', pattern: /turbopack/i }
            ];

            const allSources = scripts.map(s => s.src).join(' ');
            const pageContent = document.documentElement.outerHTML;

            buildToolPatterns.forEach(tool => {
                if (tool.pattern.test(allSources + pageContent)) {
                    this.results.buildTools.push({
                        name: tool.name,
                        version: 'Detected',
                        confidence: 'Medium'
                    });
                }
            });

            // Check for source maps
            if (scripts.some(s => s.src.includes('.map') || pageContent.includes('sourceMap'))) {
                this.results.buildTools.push({
                    name: 'Source Maps',
                    version: 'Enabled',
                    confidence: 'High'
                });
            }
        }

        async detectThirdPartyServices() {
            const scripts = Array.from(document.querySelectorAll('script[src]'));
            const allSources = scripts.map(s => s.src).join(' ');
            const pageContent = document.documentElement.outerHTML;

            const services = [
                // Analytics
                { name: 'Google Analytics', pattern: /google-analytics|gtag|ga\.js|analytics\.js/i, category: 'analytics' },
                { name: 'Google Tag Manager', pattern: /googletagmanager|gtm\.js/i, category: 'analytics' },
                { name: 'Facebook Pixel', pattern: /facebook|fbevents|connect\.facebook/i, category: 'analytics' },
                { name: 'Hotjar', pattern: /hotjar/i, category: 'analytics' },
                { name: 'Mixpanel', pattern: /mixpanel/i, category: 'analytics' },
                { name: 'Segment', pattern: /segment|analytics\.min\.js/i, category: 'analytics' },
                { name: 'Adobe Analytics', pattern: /adobe|omniture|sitecatalyst/i, category: 'analytics' },
                
                // Payment Processors
                { name: 'Stripe', pattern: /stripe|js\.stripe\.com/i, category: 'payment' },
                { name: 'PayPal', pattern: /paypal|paypalobjects/i, category: 'payment' },
                { name: 'Square', pattern: /square|squareup/i, category: 'payment' },
                { name: 'Klarna', pattern: /klarna/i, category: 'payment' },
                { name: 'Razorpay', pattern: /razorpay/i, category: 'payment' },
                
                // Chat & Support
                { name: 'Intercom', pattern: /intercom|widget\.intercom/i, category: 'support' },
                { name: 'Zendesk', pattern: /zendesk|zdassets/i, category: 'support' },
                { name: 'Crisp', pattern: /crisp\.chat/i, category: 'support' },
                { name: 'Drift', pattern: /drift\.com/i, category: 'support' },
                { name: 'LiveChat', pattern: /livechat|livechatinc/i, category: 'support' },
                
                // CDNs & Services
                { name: 'Cloudinary', pattern: /cloudinary/i, category: 'media' },
                { name: 'Imgix', pattern: /imgix/i, category: 'media' },
                { name: 'Twilio', pattern: /twilio/i, category: 'communication' },
                { name: 'SendGrid', pattern: /sendgrid/i, category: 'email' },
                { name: 'Mailchimp', pattern: /mailchimp/i, category: 'email' },
                
                // Social Media
                { name: 'Twitter Widgets', pattern: /twitter|twimg|platform\.twitter/i, category: 'social' },
                { name: 'LinkedIn Insights', pattern: /linkedin|snap\.licdn/i, category: 'social' },
                { name: 'Instagram', pattern: /instagram|instagramstatic/i, category: 'social' },
                
                // Ad Networks
                { name: 'Google AdSense', pattern: /googlesyndication|adsense|googleadservices/i, category: 'advertising' },
                { name: 'Google Ads', pattern: /googleads|adnxs|doubleclick/i, category: 'advertising' },
                { name: 'Amazon Associates', pattern: /amazon-adsystem/i, category: 'advertising' },
                
                // Performance & Monitoring
                { name: 'Sentry', pattern: /sentry/i, category: 'monitoring' },
                { name: 'LogRocket', pattern: /logrocket/i, category: 'monitoring' },
                { name: 'New Relic', pattern: /newrelic/i, category: 'monitoring' },
                { name: 'Datadog', pattern: /datadog|datadoghq/i, category: 'monitoring' },
                
                // Authentication
                { name: 'Auth0', pattern: /auth0/i, category: 'auth' },
                { name: 'Firebase Auth', pattern: /firebase|firebaseapp/i, category: 'auth' },
                { name: 'Okta', pattern: /okta/i, category: 'auth' },
                
                // Maps
                { name: 'Google Maps', pattern: /maps\.googleapis|maps\.google/i, category: 'maps' },
                { name: 'Mapbox', pattern: /mapbox/i, category: 'maps' },
                { name: 'Leaflet', pattern: /leaflet/i, category: 'maps' }
            ];

            services.forEach(service => {
                if (service.pattern.test(allSources + pageContent)) {
                    const categoryArray = this.results[service.category] || this.results.thirdParty;
                    categoryArray.push({
                        name: service.name,
                        version: 'Active',
                        confidence: 'High',
                        category: service.category
                    });
                }
            });
        }

        async detectAPIs() {
            // Analyze network requests for API patterns
            const apiPatterns = [
                { name: 'REST API', pattern: /\/api\/|\/rest\/|\.json/i },
                { name: 'GraphQL', pattern: /\/graphql|query.*{|mutation.*{/i },
                { name: 'WebSocket', pattern: /websocket|socket\.io|ws:|wss:/i },
                { name: 'gRPC', pattern: /grpc|\.proto/i },
                { name: 'SOAP', pattern: /soap|wsdl|\.asmx/i },
                { name: 'JSON-RPC', pattern: /json-rpc|jsonrpc/i }
            ];

            const allRequests = this.networkRequests.map(req => req.url).join(' ');
            const pageContent = document.documentElement.outerHTML;

            apiPatterns.forEach(api => {
                if (api.pattern.test(allRequests + pageContent)) {
                    this.results.apis.push({
                        name: api.name,
                        version: 'Detected',
                        confidence: 'Medium'
                    });
                }
            });

            // Check for WebSocket connections
            if (window.WebSocket || window.io) {
                this.results.apis.push({
                    name: 'WebSocket',
                    version: 'Active',
                    confidence: 'High'
                });
            }

            // Check for Service Workers (PWA APIs)
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                    if (registrations.length > 0) {
                        this.results.apis.push({
                            name: 'Service Worker',
                            version: 'Active',
                            confidence: 'High'
                        });
                    }
                });
            }
        }

        extractVersion(content, technology) {
            const patterns = {
                'jQuery': /jquery[\/\-](\d+\.\d+\.\d+)/i,
                'Bootstrap': /bootstrap[\/\-](\d+\.\d+\.\d+)/i,
                'React': /react[\/\-](\d+\.\d+\.\d+)/i,
                'Vue': /vue[\/\-](\d+\.\d+\.\d+)/i,
                'Angular': /angular[\/\-](\d+\.\d+\.\d+)/i
            };

            const pattern = patterns[technology];
            if (pattern) {
                const match = content.match(pattern);
                return match ? match[1] : null;
            }
            return null;
        }

        async analyzeHeaders() {
            // Since we can't access headers directly in userscript,
            // we'll use alternative methods to infer server information
            const headers = {};
            
            // Check for CSP headers via meta tags
            const cspMeta = document.querySelector('meta[http-equiv="Content-Security-Policy"]');
            if (cspMeta) {
                headers['content-security-policy'] = cspMeta.content;
            }

            // Check for other security headers via meta tags
            const stsHeader = document.querySelector('meta[http-equiv="Strict-Transport-Security"]');
            if (stsHeader) {
                headers['strict-transport-security'] = stsHeader.content;
            }

            return headers;
        }

        async analyzePerformance() {
            try {
                if ('performance' in window) {
                    const navigation = performance.getEntriesByType('navigation')[0];
                    const paint = performance.getEntriesByType('paint');
                    
                    this.performanceMetrics = {
                        domContentLoaded: (navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart) || 0,
                        loadComplete: (navigation?.loadEventEnd - navigation?.loadEventStart) || 0,
                        firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
                        firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
                        resourceCount: performance.getEntriesByType('resource').length || 0,
                        totalTransferSize: this.calculateTotalTransferSize()
                    };

                    // Web Vitals estimation
                    this.analyzeWebVitals();
                } else {
                    // Fallback when performance API is not available
                    this.performanceMetrics = {
                        domContentLoaded: 0,
                        loadComplete: 0,
                        firstPaint: 0,
                        firstContentfulPaint: 0,
                        resourceCount: document.querySelectorAll('script, link, img').length,
                        totalTransferSize: 0
                    };
                    this.results.performance = [{
                        name: 'Performance API',
                        value: 'Not available',
                        score: 'unknown',
                        confidence: 'High'
                    }];
                }
            } catch (error) {
                console.warn('Performance analysis failed:', error);
                this.performanceMetrics = {
                    domContentLoaded: 0,
                    loadComplete: 0,
                    firstPaint: 0,
                    firstContentfulPaint: 0,
                    resourceCount: 0,
                    totalTransferSize: 0
                };
            }
        }

        analyzeWebVitals() {
            const vitals = [];

            // Largest Contentful Paint (estimated)
            const lcp = this.performanceMetrics.firstContentfulPaint || 0;
            vitals.push({
                name: 'Largest Contentful Paint (est.)',
                value: `${(lcp / 1000).toFixed(2)}s`,
                score: this.getPerformanceScore(lcp, [2500, 4000]),
                confidence: 'Medium'
            });

            // First Input Delay (estimated from load time)
            const fid = this.performanceMetrics.domContentLoaded || 0;
            vitals.push({
                name: 'First Input Delay (est.)',
                value: `${(fid / 1000).toFixed(2)}s`,
                score: this.getPerformanceScore(fid, [100, 300]),
                confidence: 'Low'
            });

            // Cumulative Layout Shift (basic check)
            const hasLayoutShift = document.querySelectorAll('[style*="position: absolute"], [style*="position: fixed"]').length > 10;
            vitals.push({
                name: 'Cumulative Layout Shift',
                value: hasLayoutShift ? 'Potential issues' : 'Good',
                score: hasLayoutShift ? 'poor' : 'good',
                confidence: 'Low'
            });

            this.results.performance = vitals;
        }

        getPerformanceScore(value, thresholds) {
            if (value <= thresholds[0]) return 'excellent';
            if (value <= thresholds[1]) return 'good';
            if (value <= thresholds[1] * 2) return 'average';
            return 'poor';
        }

        calculateTotalTransferSize() {
            try {
                if ('performance' in window) {
                    return performance.getEntriesByType('resource')
                        .reduce((total, resource) => total + (resource.transferSize || 0), 0);
                }
                return 0;
            } catch (error) {
                console.warn('Failed to calculate transfer size:', error);
                return 0;
            }
        }

        async analyzeSEO() {
            const seoMetrics = [];

            // Title tag analysis
            const title = document.querySelector('title');
            if (title) {
                const titleLength = title.textContent.length;
                seoMetrics.push({
                    name: 'Title Tag',
                    value: `${titleLength} characters`,
                    score: titleLength >= 30 && titleLength <= 60 ? 'good' : 'warning',
                    confidence: 'High'
                });
            } else {
                seoMetrics.push({
                    name: 'Title Tag',
                    value: 'Missing',
                    score: 'poor',
                    confidence: 'High'
                });
            }

            // Meta description
            const metaDesc = document.querySelector('meta[name="description"]');
            if (metaDesc) {
                const descLength = metaDesc.content.length;
                seoMetrics.push({
                    name: 'Meta Description',
                    value: `${descLength} characters`,
                    score: descLength >= 120 && descLength <= 160 ? 'good' : 'warning',
                    confidence: 'High'
                });
            } else {
                seoMetrics.push({
                    name: 'Meta Description',
                    value: 'Missing',
                    score: 'poor',
                    confidence: 'High'
                });
            }

            // Heading structure
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            const h1Count = document.querySelectorAll('h1').length;
            seoMetrics.push({
                name: 'Heading Structure',
                value: `${headings.length} headings, ${h1Count} H1`,
                score: h1Count === 1 ? 'good' : 'warning',
                confidence: 'High'
            });

            // Images with alt text
            const images = document.querySelectorAll('img');
            const imagesWithAlt = document.querySelectorAll('img[alt]');
            if (images.length > 0) {
                const altPercentage = (imagesWithAlt.length / images.length * 100).toFixed(0);
                seoMetrics.push({
                    name: 'Image Alt Text',
                    value: `${altPercentage}% of ${images.length} images`,
                    score: altPercentage > 90 ? 'good' : altPercentage > 70 ? 'warning' : 'poor',
                    confidence: 'High'
                });
            }

            // Structured data
            const structuredData = document.querySelectorAll('script[type="application/ld+json"]');
            seoMetrics.push({
                name: 'Structured Data',
                value: structuredData.length > 0 ? `${structuredData.length} schemas` : 'None detected',
                score: structuredData.length > 0 ? 'good' : 'warning',
                confidence: 'High'
            });

            // Open Graph tags
            const ogTags = document.querySelectorAll('meta[property^="og:"]');
            seoMetrics.push({
                name: 'Open Graph Tags',
                value: ogTags.length > 0 ? `${ogTags.length} tags` : 'None detected',
                score: ogTags.length >= 4 ? 'good' : ogTags.length > 0 ? 'warning' : 'poor',
                confidence: 'High'
            });

            // Twitter Card tags
            const twitterTags = document.querySelectorAll('meta[name^="twitter:"]');
            seoMetrics.push({
                name: 'Twitter Cards',
                value: twitterTags.length > 0 ? `${twitterTags.length} tags` : 'None detected',
                score: twitterTags.length >= 3 ? 'good' : twitterTags.length > 0 ? 'warning' : 'poor',
                confidence: 'High'
            });

            // Canonical URL
            const canonical = document.querySelector('link[rel="canonical"]');
            seoMetrics.push({
                name: 'Canonical URL',
                value: canonical ? 'Present' : 'Missing',
                score: canonical ? 'good' : 'warning',
                confidence: 'High'
            });

            this.results.seo = seoMetrics;
        }

        toggleVisibility() {
            const container = document.getElementById('tech-stack-detector');
            this.isVisible = !this.isVisible;
            container.style.display = this.isVisible ? 'block' : 'none';
            
            if (this.isVisible) {
                this.showNotification('🚀 Tech Stack Detector activated!');
            }
        }

    }

    // Initialize the advanced detector
    function initializeDetector() {
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                new AdvancedTechStackDetector();
            });
        } else {
            new AdvancedTechStackDetector();
        }
    }

    // Start initialization with error handling
    try {
        initializeDetector();
    } catch (error) {
        console.error('Advanced Tech Stack Detector failed to initialize:', error);
        
        if (typeof GM_notification !== 'undefined') {
            GM_notification('Tech Stack Detector failed to initialize. Check console for details.', 'Error');
        }
    }

})();