// ==UserScript==
// @name         音乐播放器
// @namespace    http://tampermonkey.net/
// @version      happyNo.1
// @description  为银河奶牛放置添加可配置的在线音乐播放器
// @author       2iker
// @license      2iker
// @match        https://www.milkywayidle.com/*
// @grant        none
// @connect      cdn.jsdelivr.net
// @downloadURL https://update.greasyfork.org/scripts/531454/%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/531454/%E9%9F%B3%E4%B9%90%E6%92%AD%E6%94%BE%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const CONFIG_KEYS = {
        server: 'aplayer_server',
        type: 'aplayer_type',
        id: 'aplayer_id',
        autoplay: 'aplayer_autoplay',
        loop: 'aplayer_loop',
        listFolded: 'aplayer_listFolded',
        listMaxHeight: 'aplayer_listMaxHeight',
        order: 'aplayer_order'
    };

     const DEFAULT_CONFIG = {
        server: 'netease',
        type: 'playlist',
        id: '2791573169',
        autoplay: 'false',
        loop: 'all',
        listFolded: 'true',
        listMaxHeight: '500',
        order: 'random'
    };

    // 平台选项映射
    const SERVER_OPTIONS = [
        { value: 'netease', label: '网易云音乐' },
        { value: 'tencent', label: 'QQ音乐' },
        { value: 'kugou', label: '酷狗音乐' },
        { value: 'xiami', label: '虾米音乐' },
        { value: 'baidu', label: '百度音乐' }
    ];

    // 类型选项映射
    const TYPE_OPTIONS = [
        { value: 'song', label: '单曲' },
        { value: 'playlist', label: '歌单' },
        { value: 'album', label: '专辑' },
        { value: 'search', label: '搜索' },
        { value: 'artist', label: '艺术家' }
    ];
    // 配置选项映射
    const OPTION_MAP = {
        autoplay: [
            { value: 'true', label: '是' },
            { value: 'false', label: '否' }
        ],
        loop: [
            { value: 'all', label: '全部循环' },
            { value: 'one', label: '单曲循环' },
            { value: 'none', label: '不循环' }
        ],
        order: [
            { value: 'random', label: '随机播放' },
            { value: 'list', label: '列表播放' }
        ]
    };

    // 获取用户配置
    const getConfig = () => ({
        server: localStorage.getItem(CONFIG_KEYS.server) || DEFAULT_CONFIG.server,
        type: localStorage.getItem(CONFIG_KEYS.type) || DEFAULT_CONFIG.type,
        id: localStorage.getItem(CONFIG_KEYS.id) || DEFAULT_CONFIG.id,
        autoplay: localStorage.getItem(CONFIG_KEYS.autoplay) || DEFAULT_CONFIG.autoplay,
        loop: localStorage.getItem(CONFIG_KEYS.loop) || DEFAULT_CONFIG.loop,
        listFolded: localStorage.getItem(CONFIG_KEYS.listFolded) || DEFAULT_CONFIG.listFolded,
        order: localStorage.getItem(CONFIG_KEYS.order) || DEFAULT_CONFIG.order,
        listMaxHeight: Math.min(800, Math.max(340,
            parseInt(localStorage.getItem(CONFIG_KEYS.listMaxHeight) || DEFAULT_CONFIG.listMaxHeight)))

    });

    // 创建播放器
    function createPlayer() {
        const config = getConfig();
        document.querySelector('meting-js')?.remove();

        const metingPlayer = document.createElement('meting-js');
        metingPlayer.setAttribute('server', config.server);
        metingPlayer.setAttribute('type', config.type);
        metingPlayer.setAttribute('id', config.id);
        metingPlayer.setAttribute('fixed', 'true');
        metingPlayer.setAttribute('autoplay', config.autoplay);
        metingPlayer.setAttribute('loop', config.loop);
        metingPlayer.setAttribute('list-folded', config.listFolded);
        metingPlayer.setAttribute('order', config.order);
        metingPlayer.setAttribute('storage-name', 'metingjs');
        metingPlayer.setAttribute('mutex', 'true');
        metingPlayer.setAttribute('list-max-height', `${config.listMaxHeight}px`);

        document.body.appendChild(metingPlayer);
        return metingPlayer;
    }

    // 显示设置对话框
    function showSettingsDialog() {
        const config = getConfig();
        const dialog = document.createElement('div');
        dialog.id = 'aplayer-settings-dialog';

        // 对话框样式
        dialog.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: #fff;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
            z-index: 100000;
            min-width: 320px;
            font-family: 'Microsoft YaHei', sans-serif;
        `;

        // 公共样式
        const formStyle = `margin: 12px 0; display: flex; justify-content: space-between; align-items: center;`;
        const labelStyle = `min-width: 80px; margin-right: 10px;`;
        const inputStyle = `padding:6px; border-radius:4px; border:1px solid #ddd; width:180px;`;

        // 配置项生成器
        const createSetting = (label, html) => {
            const div = document.createElement('div');
            div.style.cssText = formStyle;
            div.innerHTML = `<div style="${labelStyle}">${label}</div>` + html;
            return div;
        };

        // 平台选择
        dialog.appendChild(createSetting('音乐平台：', `
            <select id="aplayer-server" style="${inputStyle}">
                ${SERVER_OPTIONS.map(opt => `
                    <option value="${opt.value}" ${opt.value === config.server ? 'selected' : ''}>
                        ${opt.label}
                    </option>
                `).join('')}
            </select>
        `));

        // 类型选择
        dialog.appendChild(createSetting('资源类型：', `
            <select id="aplayer-type" style="${inputStyle}">
                ${TYPE_OPTIONS.map(opt => `
                    <option value="${opt.value}" ${opt.value === config.type ? 'selected' : ''}>
                        ${opt.label}
                    </option>
                `).join('')}
            </select>
        `));

         // ID输入
        dialog.appendChild(createSetting('资源ID：', `
            <input type="text" id="aplayer-id" value="${config.id}"
                style="${inputStyle} padding:5px;">
        `));

        // 新增配置项
        dialog.appendChild(createSetting('自动播放：', `
            <select id="aplayer-autoplay" style="${inputStyle}">
                ${OPTION_MAP.autoplay.map(opt => `
                    <option value="${opt.value}" ${opt.value === config.autoplay ? 'selected' : ''}>
                        ${opt.label}
                    </option>
                `).join('')}
            </select>
        `));

        dialog.appendChild(createSetting('循环模式：', `
            <select id="aplayer-loop" style="${inputStyle}">
                ${OPTION_MAP.loop.map(opt => `
                    <option value="${opt.value}" ${opt.value === config.loop ? 'selected' : ''}>
                        ${opt.label}
                    </option>
                `).join('')}
            </select>
        `));

        dialog.appendChild(createSetting('播放顺序：', `
            <select id="aplayer-order" style="${inputStyle}">
                ${OPTION_MAP.order.map(opt => `
                    <option value="${opt.value}" ${opt.value === config.order ? 'selected' : ''}>
                        ${opt.label}
                    </option>
                `).join('')}
            </select>
        `));

        dialog.appendChild(createSetting('列表折叠：', `
            <select id="aplayer-listFolded" style="${inputStyle}">
                <option value="true" ${config.listFolded === 'true' ? 'selected' : ''}>是</option>
                <option value="false" ${config.listFolded === 'false' ? 'selected' : ''}>否</option>
            </select>
        `));

        dialog.appendChild(createSetting('列表高度：', `
            <input type="number" id="aplayer-listMaxHeight"
                value="${config.listMaxHeight}" min="340" max="800"
                style="${inputStyle}" placeholder="340-800之间">
        `));



        // 操作按钮
        const buttonDiv = document.createElement('div');
        buttonDiv.style.cssText = `margin-top:15px; text-align:right; border-top:1px solid #eee; padding-top:15px;`;

        ['保存设置', '关闭'].forEach((text, i) => {
            const btn = document.createElement('button');
            btn.textContent = text;
            btn.style.cssText = `
                padding:8px 20px; margin-left:10px; border:none; border-radius:4px;
                cursor:pointer; transition:all 0.2s ease;
                background:${i === 0 ? '#2980b9' : '#e74c3c'};
                color:white;
            `;
            btn.onmouseover = () => btn.style.opacity = '0.8';
            btn.onmouseout = () => btn.style.opacity = '1';
            btn.onclick = i === 0 ? () => {
                const newConfig = {
                    server: document.querySelector('#aplayer-server').value,
                    type: document.querySelector('#aplayer-type').value,
                    id: document.querySelector('#aplayer-id').value.trim(),
                    autoplay: document.querySelector('#aplayer-autoplay').value,
                    loop: document.querySelector('#aplayer-loop').value,
                    listFolded: document.querySelector('#aplayer-listFolded').value,
                    order: document.querySelector('#aplayer-order').value,
                    listMaxHeight: Math.min(800, Math.max(340,
                        parseInt(document.querySelector('#aplayer-listMaxHeight').value || 500))),

                };

                Object.entries(newConfig).forEach(([key, value]) => {
                    localStorage.setItem(CONFIG_KEYS[key], value);
                });

                createPlayer();
                updateConfigDisplay();
                dialog.remove();
            } : () => dialog.remove();
            buttonDiv.appendChild(btn);
        });

        dialog.appendChild(buttonDiv);
        document.body.appendChild(dialog);
    }

    // 更新配置显示
    function updateConfigDisplay() {
        const config = getConfig();
        document.querySelectorAll('.aplayer-config-item').forEach(item => {
            const key = item.dataset.configKey;
            const valueSpan = item.querySelector('.config-value');
            if (valueSpan) {
                valueSpan.textContent = formatConfigValue(key, config[key]);
            }
        });
    }

    // 格式化配置值显示
    function formatConfigValue(key, value) {
        const maps = {
            autoplay: OPTION_MAP.autoplay,
            loop: OPTION_MAP.loop,
            order: OPTION_MAP.order,
            listFolded: [{value:'true',label:'是'},{value:'false',label:'否'}]
        };

        if (maps[key]) {
            return maps[key].find(opt => opt.value === value)?.label || value;
        }
        return key === 'listMaxHeight' ? `${value}px` : value;
    }

    // 在设置面板添加配置显示
    function addMusicSettingsButton() {
        const targetNode = document.querySelector("div.SettingsPanel_infoGrid__2nh1u");
        const existFlag = document.querySelector("#aplayer-settings-btn");

        if(targetNode && !existFlag) {
            const config = getConfig();
            const createMergedItem = (label, items) => {
                const container = document.createElement("div");
                container.className = "aplayer-config-item";

                const labelDiv = document.createElement("div");
                labelDiv.className = "SettingsPanel_label__24LRD";
                labelDiv.textContent = label;

                const valueDiv = document.createElement("div");
                valueDiv.className = "SettingsPanel_value__2nsKD";
                valueDiv.style.cssText = "display: flex; flex-wrap: wrap; gap: 15px;";

                items.forEach(item => {
                    const itemDiv = document.createElement("div");
                    itemDiv.innerHTML = `
                        <span style="font-size:12px">
                            <strong>${item.label}</strong>:
                            <span class="config-value" data-key="${item.key}">
                                ${formatConfigValue(item.key, config[item.key])}
                            </span>
                        </span>
                    `;
                    valueDiv.appendChild(itemDiv);
                });

                targetNode.appendChild(labelDiv);
                targetNode.appendChild(valueDiv);
            };

            // 添加设置按钮
            const btnLabel = document.createElement("div");
            btnLabel.className = "SettingsPanel_label__24LRD";
            btnLabel.textContent = "播放器配置：";

            const btnValue = document.createElement("div");
            btnValue.className = "SettingsPanel_value__2nsKD";
            const settingsBtn = document.createElement("button");
            settingsBtn.id = "aplayer-settings-btn";
            settingsBtn.className = "Button_button__1Fe9z";
            settingsBtn.textContent = "修改配置";
            settingsBtn.addEventListener("click", showSettingsDialog);
            btnValue.appendChild(settingsBtn);
            targetNode.appendChild(btnLabel);
            targetNode.appendChild(btnValue);

            // 添加合并后的配置显示项
            createMergedItem("当前配置:", [
                { label: "平台", key: "server" },
                { label: "类型", key: "type" },
                { label: "资源ID", key: "id" },
            ]);
        }
    }

    function formatConfigValue(key, value) {
        if(key === 'server') {
            return SERVER_OPTIONS.find(opt => opt.value === value)?.label || value;
        }
        if(key === 'type') {
            return TYPE_OPTIONS.find(opt => opt.value === value)?.label || value;
        }

        // 其他配置使用通用映射
        const maps = {
            autoplay: OPTION_MAP.autoplay,
            loop: OPTION_MAP.loop,
            order: OPTION_MAP.order,
            listFolded: [{value:'true',label:'是'},{value:'false',label:'否'}]
        };

        const mapped = maps[key]?.find(opt => opt.value === value)?.label;
        return mapped || (key === 'listMaxHeight' ? `${value}px` : value);
    }

    // 更新配置显示
    function updateConfigDisplay() {
        const config = getConfig();
        document.querySelectorAll('.config-value').forEach(span => {
            const key = span.dataset.key;
            span.textContent = formatConfigValue(key, config[key]);
        });
    }
    // 初始化逻辑
    function initPlayer() {
        const aplayerCSS = document.createElement('link');
        aplayerCSS.rel = 'stylesheet';
        aplayerCSS.href = 'https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.css';
        document.head.appendChild(aplayerCSS);

        const aplayerJS = document.createElement('script');
        aplayerJS.src = 'https://cdn.jsdelivr.net/npm/aplayer/dist/APlayer.min.js';

        aplayerJS.onload = () => {
            const metingJS = document.createElement('script');
            metingJS.src = 'https://cdn.jsdelivr.net/npm/meting@2.0.1/dist/Meting.min.js';
            metingJS.onload = () => {
                createPlayer();
                const observer = new MutationObserver(() => addMusicSettingsButton());
                observer.observe(document.body, {childList: true, subtree: true});
                addMusicSettingsButton();
            };
            document.head.appendChild(metingJS);
        };
        document.head.appendChild(aplayerJS);
    }

    initPlayer();
})();