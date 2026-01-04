// ==UserScript==
// @name               Auto Scroll with Dynamic Loading
// @name:zh-CN         自动滚动与动态加载
// @name:en            Auto Scroll with Dynamic Loading
// @name:es            Desplazamiento Automático con Carga Dinámica
// @name:ja            自動スクロール（動的読み込み対応）
// @namespace          https://github.com/strangeZombies/PractiseCode
// @version            2025.12.16.0
// @description        Automatically scrolls up or down with customizable settings for speed, interval, and behavior (smooth, auto, instant, linear). Supports dynamic content loading with configurable timeout at page boundaries, panel positioning (top-left, top-right, bottom-left, bottom-right), and hide/show panel with saved state. Multilingual UI (English, Chinese, Spanish, Japanese) for enhanced usability and SEO. Ideal for web scraping, content browsing, and automation. / 自动向上或向下滚动，支持动态内容加载，带可配置的页面边界超时。可自定义滚动速度、间隔和行为（平滑、自动、立即、线性），面板位置（左上、右上、左下、右下），以及隐藏/显示功能（状态持久保存）。支持多语言界面（英文、中文、西班牙语、日语），提升使用体验和SEO。适合网页抓取、内容浏览和自动化。
// @description:zh-CN  自动向上或向下滚动，支持动态内容加载，带可配置的页面边界超时。可自定义滚动速度、间隔和行为（平滑、自动、立即、线性），面板位置（左上、右上、左下、右下），以及隐藏/显示功能（状态持久保存）。支持多语言界面（英文、中文、西班牙语、日语），提升使用体验和SEO。适合网页抓取、内容浏览和自动化。
// @description:en     Automatically scrolls up or down with customizable settings for speed, interval, and behavior (smooth, auto, instant, linear). Supports dynamic content loading with configurable timeout at page boundaries, panel positioning (top-left, top-right, bottom-left, bottom-right), and hide/show panel with saved state. Multilingual UI (English, Chinese, Spanish, Japanese) for enhanced usability and SEO. Ideal for web scraping, content browsing, and automation.
// @description:es     Desplaza automáticamente hacia arriba o abajo con configuraciones personalizables para velocidad, intervalo y comportamiento (suave, automático, instantáneo, lineal). Soporta carga de contenido dinámico con tiempo de espera configurable en los límites de la página, posicionamiento del panel (arriba-izquierda, arriba-derecha, abajo-izquierda, abajo-derecha) y función de ocultar/mostrar panel con estado guardado. Interfaz multilingüe (inglés, chino, español, japonés) para mejor usabilidad y SEO. Ideal para web scraping, navegación de contenido y automatización.
// @description:ja     上下に自動スクロールし、動的コンテンツ読み込みをサポート。ページ境界でのタイムアウト設定、スクロール速度、間隔、動作（スムーズ、自動、即時、リニア）のカスタマイズが可能。パネル位置（左上、右上、左下、右下）、パネルの表示/非表示機能（状態保存付き）を提供。多言語UI（英語、中国語、スペイン語、日本語）で使いやすさとSEOを向上。ウェブスクレイピング、コンテンツ閲覧、自動化に最適。
// @author             strangezombies
// @match              *://*/*
// @grant              GM_setValue
// @grant              GM_getValue
// @grant              GM_addStyle
// @license            MIT
// @downloadURL https://update.greasyfork.org/scripts/533375/Auto%20Scroll%20with%20Dynamic%20Loading.user.js
// @updateURL https://update.greasyfork.org/scripts/533375/Auto%20Scroll%20with%20Dynamic%20Loading.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 防止在 iframe 中运行
    if (window.self !== window.top) {
        console.log('Script running in iframe, exiting.');
        return;
    }

    // 语言检测和 UI 文本
    const userLang = navigator.language || navigator.userLanguage || 'en';
    const langPack = {
        'en': {
            start: 'Start Scroll',
            stop: 'Stop Scroll',
            config: 'Open Config',
            hide: 'Hide',
            show: 'Show',
            settings: 'Scroll Settings',
            step: 'Scroll Step (px)',
            interval: 'Scroll Interval (ms)',
            behavior: 'Scroll Behavior',
            position: 'Panel Position',
            maxScroll: 'Max Scroll Times (0 for unlimited)',
            timeout: 'Timeout at Boundary (seconds)',
            save: 'Save',
            close: 'Close',
            smooth: 'Smooth',
            auto: 'Auto',
            instant: 'Instant',
            linear: 'Linear',
            topRight: 'Top Right',
            topLeft: 'Top Left',
            bottomRight: 'Bottom Right',
            bottomLeft: 'Bottom Left',
            direction: 'Scroll Direction',
            down: 'Down 👇🏻',
            up: 'Up 👆🏻',
            language: 'Language',
            'zh-CN': 'Chinese (Simplified)',
            en: 'English',
            es: 'Spanish',
            ja: 'Japanese',
            errorStep: 'Scroll Step must be at least 1.',
            errorInterval: 'Scroll Interval must be at least 10ms.',
            errorBehavior: 'Invalid Scroll Behavior.',
            errorPosition: 'Invalid Panel Position.',
            errorMaxScroll: 'Max Scroll Times must be 0 or greater.',
            errorTimeout: 'Timeout must be at least 1 second.',
            errorDirection: 'Invalid Scroll Direction.',
            errorLanguage: 'Invalid Language.',
            saved: 'Configuration saved successfully!'
        },
        'zh-CN': {
            start: '开始滚动',
            stop: '停止滚动',
            config: '打开配置',
            hide: '隐藏',
            show: '显示',
            settings: '滚动设置',
            step: '滚动步长 (像素)',
            interval: '滚动间隔 (毫秒)',
            behavior: '滚动行为',
            position: '面板位置',
            maxScroll: '最大滚动次数 (0为无限制)',
            timeout: '边界超时 (秒)',
            save: '保存',
            close: '关闭',
            smooth: '平滑',
            auto: '自动',
            instant: '立即',
            linear: '线性',
            topRight: '右上',
            topLeft: '左上',
            bottomRight: '右下',
            bottomLeft: '左下',
            direction: '滚动方向',
            down: '向下 👇🏻',
            up: '向上 👆🏻',
            language: '语言',
            'zh-CN': '中文（简体）',
            en: '英文',
            es: '西班牙语',
            ja: '日语',
            errorStep: '滚动步长至少为1。',
            errorInterval: '滚动间隔至少为10毫秒。',
            errorBehavior: '无效的滚动行为。',
            errorPosition: '无效的面板位置。',
            errorMaxScroll: '最大滚动次数必须为0或更大。',
            errorTimeout: '超时时间至少为1秒。',
            errorDirection: '无效的滚动方向。',
            errorLanguage: '无效的语言。',
            saved: '配置保存成功！'
        },
        'es': {
            start: 'Iniciar Desplazamiento',
            stop: 'Detener Desplazamiento',
            config: 'Abrir Configuración',
            hide: 'Ocultar',
            show: 'Mostrar',
            settings: 'Configuración de Desplazamiento',
            step: 'Paso de Desplazamiento (px)',
            interval: 'Intervalo de Desplazamiento (ms)',
            behavior: 'Comportamiento de Desplazamiento',
            position: 'Posición del Panel',
            maxScroll: 'Máximo de Desplazamientos (0 para ilimitado)',
            timeout: 'Tiempo de Espera en el Límite (segundos)',
            save: 'Guardar',
            close: 'Cerrar',
            smooth: 'Suave',
            auto: 'Automático',
            instant: 'Instantáneo',
            linear: 'Lineal',
            topRight: 'Arriba Derecha',
            topLeft: 'Arriba Izquierda',
            bottomRight: 'Abajo Derecha',
            bottomLeft: 'Abajo Izquierda',
            direction: 'Dirección de Desplazamiento',
            down: 'Abajo 👇🏻',
            up: 'Arriba 👆🏻',
            language: 'Idioma',
            'zh-CN': 'Chino (Simplificado)',
            en: 'Inglés',
            es: 'Español',
            ja: 'Japonés',
            errorStep: 'El paso de desplazamiento debe ser al menos 1.',
            errorInterval: 'El intervalo de desplazamiento debe ser al menos 10 ms.',
            errorBehavior: 'Comportamiento de desplazamiento inválido.',
            errorPosition: 'Posición del panel inválida.',
            errorMaxScroll: 'El máximo de desplazamientos debe ser 0 o mayor.',
            errorTimeout: 'El tiempo de espera debe ser al menos 1 segundo.',
            errorDirection: 'Dirección de desplazamiento inválida.',
            errorLanguage: 'Idioma inválido.',
            saved: '¡Configuración guardada con éxito!'
        },
        'ja': {
            start: 'スクロール開始',
            stop: 'スクロール停止',
            config: '設定を開く',
            hide: '非表示',
            show: '表示',
            settings: 'スクロール設定',
            step: 'スクロールステップ（ピクセル）',
            interval: 'スクロール間隔（ミリ秒）',
            behavior: 'スクロール動作',
            position: 'パネル位置',
            maxScroll: '最大スクロール回数（0で無制限）',
            timeout: '境界でのタイムアウト（秒）',
            save: '保存',
            close: '閉じる',
            smooth: 'スムーズ',
            auto: '自動',
            instant: '即時',
            linear: 'リニア',
            topRight: '右上',
            topLeft: '左上',
            bottomRight: '右下',
            bottomLeft: '左下',
            direction: 'スクロール方向',
            down: '下 👇🏻',
            up: '上 👆🏻',
            language: '言語',
            'zh-CN': '中国語（簡体）',
            en: '英語',
            es: 'スペイン語',
            ja: '日本語',
            errorStep: 'スクロールステップは1以上でなければなりません。',
            errorInterval: 'スクロール間隔は10ミリ秒以上でなければなりません。',
            errorBehavior: '無効なスクロール動作です。',
            errorPosition: '無効なパネル位置です。',
            errorMaxScroll: '最大スクロール回数は0以上でなければなりません。',
            errorTimeout: 'タイムアウトは1秒以上でなければなりません。',
            errorDirection: '無効なスクロール方向です。',
            errorLanguage: '無効な言語です。',
            saved: '設定が正常に保存されました！'
        }
    };

    // 默认配置
    const defaultConfig = {
        scrollStep: 100,
        scrollInterval: 50,
        scrollBehavior: 'smooth',
        panelPosition: 'top-right',
        maxScrollTimes: 0,
        timeoutSeconds: 10,
        scrollDirection: 'down',
        isPanelHidden: false,
        language: userLang.startsWith('zh') ? 'zh-CN' : userLang.startsWith('es') ? 'es' : userLang.startsWith('ja') ? 'ja' : 'en'
    };

    // 加载保存的配置或使用默认值
    let config = {
        scrollStep: GM_getValue('scrollStep', defaultConfig.scrollStep),
        scrollInterval: GM_getValue('scrollInterval', defaultConfig.scrollInterval),
        scrollBehavior: GM_getValue('scrollBehavior', defaultConfig.scrollBehavior),
        panelPosition: GM_getValue('panelPosition', defaultConfig.panelPosition),
        maxScrollTimes: GM_getValue('maxScrollTimes', defaultConfig.maxScrollTimes),
        timeoutSeconds: GM_getValue('timeoutSeconds', defaultConfig.timeoutSeconds),
        scrollDirection: GM_getValue('scrollDirection', defaultConfig.scrollDirection),
        isPanelHidden: GM_getValue('isPanelHidden', defaultConfig.isPanelHidden),
        language: GM_getValue('language', defaultConfig.language)
    };

    let isScrolling = false;
    let scrollTimer = null;
    let scrollCount = 0;
    let lastScrollTime = 0;
    let atBoundarySince = null;
    let lastScrollHeight = 0;
    let isPanelHidden = config.isPanelHidden;
    let shadowRoot = null;

    // 创建 Shadow DOM，仅调用一次
    function createShadowDOM() {
        // 检查是否已存在 Shadow DOM
        if (shadowRoot) {
            console.log('Shadow DOM already exists, skipping creation.');
            return;
        }
        const container = document.createElement('div');
        container.id = 'scroll-control-container';
        shadowRoot = container.attachShadow({ mode: 'open' });
        document.body.appendChild(container);

        const style = document.createElement('style');
        style.textContent = `
            #scrollControlPanel {
                position: fixed;
                background: #fff;
                border: 1px solid #ccc;
                padding: 10px;
                z-index: 10000;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                border-radius: 5px;
                transition: opacity 0.3s ease;
            }
            #scrollControlPanel.hidden {
                opacity: 0;
                pointer-events: none;
            }
            #scrollControlPanel.show {
                opacity: 1;
                pointer-events: auto;
            }
            #scrollShowBtn {
                position: fixed;
                background: #007bff;
                color: #fff;
                border: none;
                padding: 5px 10px;
                border-radius: 3px;
                cursor: pointer;
                z-index: 10001;
                display: none;
            }
            #scrollShowBtn.show {
                display: block;
            }
            #scrollConfigPanel {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: #fff;
                border: 1px solid #ccc;
                padding: 20px;
                z-index: 10002;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                border-radius: 5px;
                display: none;
                width: 300px;
                color: #333;
                font-family: Arial, sans-serif;
            }
            #scrollControlPanel button, #scrollConfigPanel button, #scrollShowBtn {
                margin: 5px;
                padding: 5px 10px;
                cursor: pointer;
                background: #007bff;
                color: #fff;
                border: none;
                border-radius: 3px;
                font-size: 14px;
            }
            #scrollControlPanel button:hover, #scrollConfigPanel button:hover, #scrollShowBtn:hover {
                background: #0056b3;
            }
            #scrollControlPanel .toggle-btn {
                background: #28a745;
            }
            #scrollControlPanel .toggle-btn.stop {
                background: #dc3545;
            }
            #scrollConfigPanel .close-btn {
                background: #6c757d;
            }
            #scrollConfigPanel label {
                display: block;
                margin: 10px 0;
                font-size: 14px;
                color: #333;
            }
            #scrollConfigPanel input, #scrollConfigPanel select {
                width: 100px;
                padding: 3px;
                margin-left: 5px;
                border: 1px solid #ccc;
                border-radius: 3px;
                color: #333;
                background: #f9f9f9;
            }
            #scrollConfigPanel input:hover, #scrollConfigPanel select:hover {
                background: #e0e0e0;
            }
            #scrollConfigPanel h3 {
                margin: 0 0 10px;
                font-size: 16px;
                color: #333;
            }
        `;
        shadowRoot.appendChild(style);
    }

    // 获取面板位置样式
    function getPanelPositionStyles(position, isShowButton = false) {
        const baseOffset = '20px';
        const showButtonOffset = isShowButton ? '80px' : baseOffset;
        switch (position) {
            case 'top-left':
                return `top: ${showButtonOffset}; left: ${baseOffset}; right: auto; bottom: auto;`;
            case 'top-right':
                return `top: ${showButtonOffset}; right: ${baseOffset}; left: auto; bottom: auto;`;
            case 'bottom-left':
                return `bottom: ${showButtonOffset}; left: ${baseOffset}; right: auto; top: auto;`;
            case 'bottom-right':
                return `bottom: ${showButtonOffset}; right: ${baseOffset}; left: auto; top: auto;`;
            default:
                return `top: ${showButtonOffset}; right: ${baseOffset}; left: auto; bottom: auto;`;
        }
    }

    // 获取当前语言的翻译
    function t(key) {
        const lang = langPack[config.language] || langPack['en'];
        return lang[key] || langPack['en'][key] || key; // 回退到英文或键名本身
    }

    // 创建控制面板
    function createControlPanel() {
        // 移除现有面板（如果存在）
        const existingPanel = shadowRoot.querySelector('#scrollControlPanel');
        if (existingPanel) existingPanel.remove();
        const existingShowBtn = shadowRoot.querySelector('#scrollShowBtn');
        if (existingShowBtn) existingShowBtn.remove();

        const panel = document.createElement('div');
        panel.id = 'scrollControlPanel';
        panel.className = isPanelHidden ? 'hidden' : 'show';
        panel.innerHTML = `
            <button id="toggleScrollBtn" class="toggle-btn">${t('start')}</button>
            <button id="openConfigBtn">${t('config')}</button>
            <button id="hidePanelBtn">${t('hide')}</button>
        `;
        shadowRoot.appendChild(panel);

        const showBtn = document.createElement('button');
        showBtn.id = 'scrollShowBtn';
        showBtn.className = isPanelHidden ? 'show' : '';
        showBtn.textContent = t('show');
        shadowRoot.appendChild(showBtn);

        // 绑定事件
        panel.querySelector('#toggleScrollBtn').addEventListener('click', toggleScroll);
        panel.querySelector('#openConfigBtn').addEventListener('click', openConfigPanel);
        panel.querySelector('#hidePanelBtn').addEventListener('click', togglePanelVisibility);
        showBtn.addEventListener('click', togglePanelVisibility);

        updatePanelPosition();
    }

    // 创建配置面板
    function createConfigPanel() {
        // 移除现有配置面板（如果存在）
        const existingConfigPanel = shadowRoot.querySelector('#scrollConfigPanel');
        if (existingConfigPanel) existingConfigPanel.remove();

        const configPanel = document.createElement('div');
        configPanel.id = 'scrollConfigPanel';
        configPanel.innerHTML = `
            <h3>${t('settings')}</h3>
            <label>${t('step')}: <input type="number" id="scrollStepInput" value="${config.scrollStep}" min="1"></label>
            <label>${t('interval')}: <input type="number" id="scrollIntervalInput" value="${config.scrollInterval}" min="10"></label>
            <label>${t('behavior')}: 
                <select id="scrollBehaviorSelect">
                    <option value="smooth" ${config.scrollBehavior === 'smooth' ? 'selected' : ''}>${t('smooth')}</option>
                    <option value="auto" ${config.scrollBehavior === 'auto' ? 'selected' : ''}>${t('auto')}</option>
                    <option value="instant" ${config.scrollBehavior === 'instant' ? 'selected' : ''}>${t('instant')}</option>
                    <option value="linear" ${config.scrollBehavior === 'linear' ? 'selected' : ''}>${t('linear')}</option>
                </select>
            </label>
            <label>${t('position')}: 
                <select id="panelPositionSelect">
                    <option value="top-right" ${config.panelPosition === 'top-right' ? 'selected' : ''}>${t('topRight')}</option>
                    <option value="top-left" ${config.panelPosition === 'top-left' ? 'selected' : ''}>${t('topLeft')}</option>
                    <option value="bottom-right" ${config.panelPosition === 'bottom-right' ? 'selected' : ''}>${t('bottomRight')}</option>
                    <option value="bottom-left" ${config.panelPosition === 'bottom-left' ? 'selected' : ''}>${t('bottomLeft')}</option>
                </select>
            </label>
            <label>${t('maxScroll')}: <input type="number" id="maxScrollTimesInput" value="${config.maxScrollTimes}" min="0"></label>
            <label>${t('timeout')}: <input type="number" id="timeoutSecondsInput" value="${config.timeoutSeconds}" min="1"></label>
            <label>${t('direction')}: 
                <select id="scrollDirectionSelect">
                    <option value="down" ${config.scrollDirection === 'down' ? 'selected' : ''}>${t('down')}</option>
                    <option value="up" ${config.scrollDirection === 'up' ? 'selected' : ''}>${t('up')}</option>
                </select>
            </label>
            <label>${t('language')}: 
                <select id="languageSelect">
                    <option value="zh-CN" ${config.language === 'zh-CN' ? 'selected' : ''}>${t('zh-CN')}</option>
                    <option value="en" ${config.language === 'en' ? 'selected' : ''}>${t('en')}</option>
                    <option value="es" ${config.language === 'es' ? 'selected' : ''}>${t('es')}</option>
                    <option value="ja" ${config.language === 'ja' ? 'selected' : ''}>${t('ja')}</option>
                </select>
            </label>
            <button id="saveConfigBtn">${t('save')}</button>
            <button id="closeConfigBtn" class="close-btn">${t('close')}</button>
        `;
        shadowRoot.appendChild(configPanel);

        // 绑定事件
        configPanel.querySelector('#saveConfigBtn').addEventListener('click', saveConfig);
        configPanel.querySelector('#closeConfigBtn').addEventListener('click', closeConfigPanel);
    }

    // 切换面板显示/隐藏
    function togglePanelVisibility() {
        isPanelHidden = !isPanelHidden;
        GM_setValue('isPanelHidden', isPanelHidden);
        const panel = shadowRoot.querySelector('#scrollControlPanel');
        const showBtn = shadowRoot.querySelector('#scrollShowBtn');
        if (panel) panel.className = isPanelHidden ? 'hidden' : 'show';
        if (showBtn) showBtn.className = isPanelHidden ? 'show' : '';
        updatePanelPosition();
    }

    // 打开配置面板
    function openConfigPanel() {
        const configPanel = shadowRoot.querySelector('#scrollConfigPanel');
        if (configPanel) configPanel.style.display = 'block';
    }

    // 关闭配置面板
    function closeConfigPanel() {
        const configPanel = shadowRoot.querySelector('#scrollConfigPanel');
        if (configPanel) configPanel.style.display = 'none';
    }

    // 切换滚动
    function toggleScroll() {
        const toggleBtn = shadowRoot.querySelector('#toggleScrollBtn');
        if (isScrolling) {
            clearInterval(scrollTimer);
            isScrolling = false;
            atBoundarySince = null;
            if (toggleBtn) {
                toggleBtn.textContent = t('start');
                toggleBtn.classList.remove('stop');
            }
        } else {
            scrollCount = 0;
            lastScrollHeight = document.documentElement.scrollHeight;
            atBoundarySince = null;
            startScroll();
            isScrolling = true;
            if (toggleBtn) {
                toggleBtn.textContent = t('stop');
                toggleBtn.classList.add('stop');
            }
        }
    }

    // 开始滚动
    function startScroll() {
        if (scrollTimer) clearInterval(scrollTimer);

        scrollTimer = setInterval(() => {
            const now = Date.now();
            if (now - lastScrollTime < config.scrollInterval) return;

            lastScrollTime = now;
            const scrollAmount = config.scrollDirection === 'down' ? config.scrollStep : -config.scrollStep;
            if (config.scrollBehavior === 'linear' || config.scrollBehavior === 'instant') {
                window.scrollBy({ top: scrollAmount });
            } else {
                window.scrollBy({ top: scrollAmount, behavior: config.scrollBehavior });
            }
            scrollCount++;

            // 检查是否达到最大滚动次数
            if (config.maxScrollTimes > 0 && scrollCount >= config.maxScrollTimes) {
                clearInterval(scrollTimer);
                isScrolling = false;
                atBoundarySince = null;
                const toggleBtn = shadowRoot.querySelector('#toggleScrollBtn');
                if (toggleBtn) {
                    toggleBtn.textContent = t('start');
                    toggleBtn.classList.remove('stop');
                }
                console.log('达到最大滚动次数');
                return;
            }

            // 检查是否到达页面边界
            const isAtBottom = config.scrollDirection === 'down' && window.innerHeight + Math.ceil(window.scrollY) >= document.documentElement.scrollHeight;
            const isAtTop = config.scrollDirection === 'up' && window.scrollY <= 0;

            if (isAtBottom || isAtTop) {
                const currentScrollHeight = document.documentElement.scrollHeight;
                if (currentScrollHeight !== lastScrollHeight) {
                    lastScrollHeight = currentScrollHeight;
                    atBoundarySince = null;
                    console.log('检测到新内容，继续滚动');
                } else {
                    if (!atBoundarySince) atBoundarySince = now;

                    if (atBoundarySince && now - atBoundarySince >= config.timeoutSeconds * 1000) {
                        clearInterval(scrollTimer);
                        isScrolling = false;
                        atBoundarySince = null;
                        const toggleBtn = shadowRoot.querySelector('#toggleScrollBtn');
                        if (toggleBtn) {
                            toggleBtn.textContent = t('start');
                            toggleBtn.classList.remove('stop');
                        }
                        console.log('达到超时，无新内容，停止滚动');
                        return;
                    }
                    console.log(`到达${isAtBottom ? '底部' : '顶部'}，尝试触发更多内容`);
                }
            } else {
                atBoundarySince = null;
            }
        }, config.scrollInterval / 2);
    }

    // 检测手动滚动以暂停自动滚动
    let manualScrollTimeout = null;
    window.addEventListener('scroll', () => {
        if (isScrolling && Date.now() - lastScrollTime > config.scrollInterval * 2) {
            clearInterval(scrollTimer);
            clearTimeout(manualScrollTimeout);
            manualScrollTimeout = setTimeout(() => {
                if (isScrolling) startScroll();
            }, 1000);
        }
    });

    // 更新面板位置
    function updatePanelPosition() {
        const controlPanel = shadowRoot.querySelector('#scrollControlPanel');
        const showBtn = shadowRoot.querySelector('#scrollShowBtn');
        if (controlPanel) {
            controlPanel.style.top = '';
            controlPanel.style.right = '';
            controlPanel.style.bottom = '';
            controlPanel.style.left = '';
            controlPanel.style.cssText = `
                position: fixed !important;
                ${getPanelPositionStyles(config.panelPosition)}
                background: #fff;
                border: 1px solid #ccc;
                padding: 10px;
                z-index: 10000;
                box-shadow: 0 2px 5px rgba(0,0,0,0.2);
                border-radius: 5px;
                transition: opacity 0.3s ease;
                ${isPanelHidden ? 'opacity: 0; pointer-events: none;' : 'opacity: 1; pointer-events: auto;'}
            `;
        }
        if (showBtn) {
            showBtn.style.top = '';
            showBtn.style.right = '';
            showBtn.style.bottom = '';
            showBtn.style.left = '';
            showBtn.style.cssText = `
                position: fixed !important;
                ${getPanelPositionStyles(config.panelPosition, true)}
                background: #007bff;
                color: #fff;
                border: none;
                padding: 5px 10px;
                border-radius: 3px;
                cursor: pointer;
                z-index: 10001;
                display: ${isPanelHidden ? 'block' : 'none'};
            `;
        }
    }

    // 保存配置
    function saveConfig() {
        const scrollStep = parseInt(shadowRoot.querySelector('#scrollStepInput').value);
        const scrollInterval = parseInt(shadowRoot.querySelector('#scrollIntervalInput').value);
        const scrollBehavior = shadowRoot.querySelector('#scrollBehaviorSelect').value;
        const panelPosition = shadowRoot.querySelector('#panelPositionSelect').value;
        const maxScrollTimes = parseInt(shadowRoot.querySelector('#maxScrollTimesInput').value);
        const timeoutSeconds = parseInt(shadowRoot.querySelector('#timeoutSecondsInput').value);
        const scrollDirection = shadowRoot.querySelector('#scrollDirectionSelect').value;
        const language = shadowRoot.querySelector('#languageSelect').value;

        // 验证输入
        if (isNaN(scrollStep) || scrollStep < 1) {
            alert(t('errorStep'));
            return;
        }
        if (isNaN(scrollInterval) || scrollInterval < 10) {
            alert(t('errorInterval'));
            return;
        }
        if (!['smooth', 'auto', 'instant', 'linear'].includes(scrollBehavior)) {
            alert(t('errorBehavior'));
            return;
        }
        if (!['top-right', 'top-left', 'bottom-right', 'bottom-left'].includes(panelPosition)) {
            alert(t('errorPosition'));
            return;
        }
        if (isNaN(maxScrollTimes) || maxScrollTimes < 0) {
            alert(t('errorMaxScroll'));
            return;
        }
        if (isNaN(timeoutSeconds) || timeoutSeconds < 1) {
            alert(t('errorTimeout'));
            return;
        }
        if (!['down', 'up'].includes(scrollDirection)) {
            alert(t('errorDirection'));
            return;
        }
        if (!['zh-CN', 'en', 'es', 'ja'].includes(language)) {
            alert(t('errorLanguage'));
            return;
        }

        // 更新配置
        config.scrollStep = scrollStep;
        config.scrollInterval = scrollInterval;
        config.scrollBehavior = scrollBehavior;
        config.panelPosition = panelPosition;
        config.maxScrollTimes = maxScrollTimes;
        config.timeoutSeconds = timeoutSeconds;
        config.scrollDirection = scrollDirection;
        config.language = language;

        // 保存到存储
        GM_setValue('scrollStep', config.scrollStep);
        GM_setValue('scrollInterval', config.scrollInterval);
        GM_setValue('scrollBehavior', config.scrollBehavior);
        GM_setValue('panelPosition', config.panelPosition);
        GM_setValue('maxScrollTimes', config.maxScrollTimes);
        GM_setValue('timeoutSeconds', config.timeoutSeconds);
        GM_setValue('scrollDirection', config.scrollDirection);
        GM_setValue('language', config.language);

        // 更新面板和语言
        createControlPanel();
        createConfigPanel();
        updatePanelPosition();

        // 关闭配置面板
        closeConfigPanel();

        // 通知用户
        alert(t('saved'));

        // 如果正在滚动，重新开始
        if (isScrolling) {
            clearInterval(scrollTimer);
            scrollCount = 0;
            lastScrollHeight = document.documentElement.scrollHeight;
            atBoundarySince = null;
            startScroll();
        }
    }

    // 初始化
    createShadowDOM();
    createControlPanel();
    createConfigPanel();
    updatePanelPosition();
})();
