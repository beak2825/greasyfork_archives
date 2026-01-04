// ==UserScript==
// @name         南+ 快速资源番号搜索
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  可少量自定义的快速搜索框，搜索并跳转到你要搜索的资源、番号网站！
// @author       CMY
// @license      MIT
// @match        *://*.east-plus.net/*
// @match        *://east-plus.net/*
// @match        *://*.south-plus.net/*
// @match        *://south-plus.net/*
// @match        *://*.south-plus.org/*
// @match        *://south-plus.org/*
// @match        *://*.white-plus.net/*
// @match        *://white-plus.net/*
// @match        *://*.north-plus.net/*
// @match        *://north-plus.net/*
// @match        *://*.level-plus.net/*
// @match        *://level-plus.net/*
// @match        *://*.soul-plus.net/*
// @match        *://soul-plus.net/*
// @match        *://*.snow-plus.net/*
// @match        *://snow-plus.net/*
// @match        *://*.spring-plus.net/*
// @match        *://spring-plus.net/*
// @match        *://*.summer-plus.net/*
// @match        *://summer-plus.net/*
// @match        *://*.blue-plus.net/*
// @match        *://blue-plus.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539783/%E5%8D%97%2B%20%E5%BF%AB%E9%80%9F%E8%B5%84%E6%BA%90%E7%95%AA%E5%8F%B7%E6%90%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/539783/%E5%8D%97%2B%20%E5%BF%AB%E9%80%9F%E8%B5%84%E6%BA%90%E7%95%AA%E5%8F%B7%E6%90%9C%E7%B4%A2.meta.js
// ==/UserScript==

(function () {
    'use strict';

    //////////////////////////
    // 搜索引擎定义
    //////////////////////////
    const SEARCH_ENGINES = [
        { name: 'JavDB', url: 'https://javdb.com/search?q=%s' },
        { name: 'JAVLibrary', url: 'https://www.javlibrary.com/cn/vl_searchbyid.php?keyword=%s' },
        { name: 'JavBus', url: 'https://www.javbus.com/search/%s' },
        { name: 'JAVMENU', url: 'https://javmenu.com/zh/search?wd=%s' },
        { name: 'DMM(需日本IP)', url: 'https://www.dmm.co.jp/mono/dvd/-/search/=/searchstr=%s' },
        { name: 'MissAV', url: 'https://missav.ws/search/%s' },
        { name: 'Dlsite', url: 'https://www.dlsite.com/maniax/fsr/=/language/zh/sex_category%5B0%5D/male/keyword/%s' },
        { name: 'Anix搜种', url: 'https://www.anix.moe/search.php?sort_id=0&keyword=%s' },
        { name: 'BTSOW搜种', url: 'https://btsow.pics/search/%s' }
    ];

    //////////////////////////
    // 默认配置
    //////////////////////////
    const defaultConfig = {
        visibleEngines: SEARCH_ENGINES.map(e => e.name),
        defaultCollapsed: false,
        opacity: 1,
        position: 'top-right',
        rememberPosition: true,
        maxPerRow: 4
    };

    const CONFIG_KEY = '__floatingSearchConfig';

    function loadConfig() {
        const stored = localStorage.getItem(CONFIG_KEY);
        return stored ? { ...defaultConfig, ...JSON.parse(stored) } : defaultConfig;
    }

    function saveConfig(cfg) {
        localStorage.setItem(CONFIG_KEY, JSON.stringify(cfg));
    }

    let config = loadConfig();

    function normalizeSelection(text) {
        const raw = text.trim();

        // 如果是 rj 开头（不区分大小写），直接跳过处理
        if (/^rj/i.test(raw)) {
            return raw;
        }

        const match = raw.match(/^([A-Za-z]+)(\d+)$/);
        if (match) {
            const prefix = match[1].toUpperCase();
            const number = match[2];
            return `${prefix}-${number}`;
        }
        const match2 = raw.match(/^([A-Za-z]+)-(\d+)$/);
        if (match2) {
            return `${match2[1].toUpperCase()}-${match2[2]}`;
        }
        return raw;
    }


    function create(tag, attrs = {}, children = []) {
        const el = document.createElement(tag);
        Object.assign(el, attrs);
        children.forEach(child => el.appendChild(child));
        return el;
    }

    function createButton(text, onClick) {
        const btn = create('button', {
            textContent: text,
            onclick: onClick,
            style: `height:32px; line-height:32px; font-size:14px; padding:0 12px; margin:4px; border-radius:6px; border:1px solid #aaa; cursor:pointer;`
        });
        return btn;
    }

    const box = create('div');
    Object.assign(box.style, {
        position: 'fixed',
        zIndex: '9999',
        padding: '10px',
        background: 'rgba(255,255,255,0.95)',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 0 10px rgba(0,0,0,0.3)',
        fontFamily: 'sans-serif',
        userSelect: 'none',
        opacity: config.opacity
    });
    document.body.appendChild(box);

    function applyInitialPosition() {
        const pos = localStorage.getItem('__floatBoxPos');
        if (config.rememberPosition && pos) {
            const { left, top } = JSON.parse(pos);
            box.style.left = left + 'px';
            box.style.top = top + 'px';
        } else {
            const offset = 20;
            if (config.position.includes('top')) box.style.top = offset + 'px';
            if (config.position.includes('bottom')) box.style.bottom = offset + 'px';
            if (config.position.includes('left')) box.style.left = offset + 'px';
            if (config.position.includes('right')) box.style.left = (window.innerWidth - 300 - offset) + 'px';
        }
    }

    applyInitialPosition();

    let isDragging = false, offsetX = 0, offsetY = 0;
    box.addEventListener('mousedown', e => {
        isDragging = true;
        offsetX = e.clientX - box.offsetLeft;
        offsetY = e.clientY - box.offsetTop;
    });
    document.addEventListener('mousemove', e => {
        if (isDragging) {
            box.style.left = (e.clientX - offsetX) + 'px';
            box.style.top = (e.clientY - offsetY) + 'px';
        }
    });
    document.addEventListener('mouseup', () => {
        if (isDragging && config.rememberPosition) {
            localStorage.setItem('__floatBoxPos', JSON.stringify({
                left: box.offsetLeft,
                top: box.offsetTop
            }));
        }
        isDragging = false;
    });

    let buttonContainer = create('div');
    box.appendChild(buttonContainer);

    function renderButtons() {
        buttonContainer.innerHTML = '';
        const visible = SEARCH_ENGINES.filter(e => config.visibleEngines.includes(e.name));
        visible.forEach((engine, idx) => {
            const btn = createButton(engine.name, () => {
                let text = window.getSelection().toString().trim();
                if (!text) return;
                text = normalizeSelection(text);
                const url = engine.url.replace('%s', encodeURIComponent(text));
                window.open(url, '_blank');
            });
            btn.style.display = 'inline-block';
            buttonContainer.appendChild(btn);
            if ((idx + 1) % config.maxPerRow === 0) buttonContainer.appendChild(create('br'));
        });
    }

    renderButtons();

    const toggleBtn = createButton(config.defaultCollapsed ? '展开' : '收起', () => {
        const isHidden = buttonContainer.style.display === 'none';
        buttonContainer.style.display = isHidden ? 'block' : 'none';
        toggleBtn.textContent = isHidden ? '收起' : '展开';
    });
    box.appendChild(toggleBtn);
    if (config.defaultCollapsed) buttonContainer.style.display = 'none';

    const settingsBtn = createButton('⚙️设置', () => {
        showSettingsPanel();
    });
    box.appendChild(settingsBtn);

    function showSettingsPanel() {
        const panel = create('div');
        Object.assign(panel.style, {
            position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%,-50%)',
            background: '#fff', border: '1px solid #ccc', borderRadius: '8px',
            padding: '20px', zIndex: '10000', fontSize: '14px'
        });

        const chkboxes = SEARCH_ENGINES.map(e => {
            const cb = create('input', { type: 'checkbox', checked: config.visibleEngines.includes(e.name) });
            return { name: e.name, cb };
        });

        const opacityInput = create('input', { type: 'range', min: 0.1, max: 1, step: 0.05, value: config.opacity });
        const positionSel = create('select');
        ['top-left', 'top-right', 'bottom-left', 'bottom-right'].forEach(p => {
            const opt = create('option', { value: p, textContent: p });
            if (config.position === p) opt.selected = true;
            positionSel.appendChild(opt);
        });

        const maxRowInput = create('input', { type: 'number', min: 1, max: 5, value: config.maxPerRow });
        const collapseChk = create('input', { type: 'checkbox', checked: config.defaultCollapsed });
        const rememberChk = create('input', { type: 'checkbox', checked: config.rememberPosition });

        panel.innerHTML = '<h3>设置</h3>';
        panel.appendChild(create('div', { textContent: '选择要显示的搜索按钮：' }));
        chkboxes.forEach(({ name, cb }, idx) => {
            const label = create('label');
            label.style.display = 'inline-block';
            label.style.marginRight = '12px';
            label.style.minWidth = '100px';
            label.appendChild(cb);
            label.appendChild(document.createTextNode(' ' + name + ' '));
            panel.appendChild(label);
            if ((idx + 1) % 5 === 0) panel.appendChild(create('br'));
        });

        panel.appendChild(create('div', { innerHTML: '<br>默认是否收起：' }));
        panel.appendChild(collapseChk);

        panel.appendChild(create('div', { innerHTML: '<br>透明度：' }));
        panel.appendChild(opacityInput);

        panel.appendChild(create('div', { innerHTML: '<br>初始位置：' }));
        panel.appendChild(positionSel);

        panel.appendChild(create('div', { innerHTML: '<br>是否记住拖动位置：' }));
        panel.appendChild(rememberChk);

        panel.appendChild(create('div', { innerHTML: '<br>每行按钮最多数量：' }));
        panel.appendChild(maxRowInput);

        panel.appendChild(create('br'));

        const saveBtn = createButton('保存', () => {
            config.visibleEngines = chkboxes.filter(c => c.cb.checked).map(c => c.name);
            config.defaultCollapsed = collapseChk.checked;
            config.opacity = parseFloat(opacityInput.value);
            config.position = positionSel.value;
            config.rememberPosition = rememberChk.checked;
            config.maxPerRow = parseInt(maxRowInput.value);
            saveConfig(config);
            alert('设置已保存，刷新页面后生效');
            document.body.removeChild(panel);
        });

        const closeBtn = createButton('关闭', () => document.body.removeChild(panel));

        panel.appendChild(saveBtn);
        panel.appendChild(closeBtn);

        document.body.appendChild(panel);
    }
})();