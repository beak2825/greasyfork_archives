// ==UserScript==
// @name         YouTube（油管）添加到稍后观看加强版
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  在后台将 YouTube 视频添加到"稍后观看"列表，按钮贴边半隐藏，可上下拖动，添加设置按钮和自定义快捷键功能
// @author       特比欧炸
// @match        https://www.youtube.com/*
// @grant        none
// @charset      UTF-8
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/511577/YouTube%EF%BC%88%E6%B2%B9%E7%AE%A1%EF%BC%89%E6%B7%BB%E5%8A%A0%E5%88%B0%E7%A8%8D%E5%90%8E%E8%A7%82%E7%9C%8B%E5%8A%A0%E5%BC%BA%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/511577/YouTube%EF%BC%88%E6%B2%B9%E7%AE%A1%EF%BC%89%E6%B7%BB%E5%8A%A0%E5%88%B0%E7%A8%8D%E5%90%8E%E8%A7%82%E7%9C%8B%E5%8A%A0%E5%BC%BA%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const i18n = {
        en: {
            watchLater: 'Watch Later',
            settings: 'Settings',
            promptShortcut: 'Enter a new shortcut key (current is "{key}")',
            invalidShortcut: 'Invalid shortcut, please enter a single character.',
            updatedShortcut: 'Shortcut updated to "{key}".'
        },
        'en-GB': {
            watchLater: 'Watch Later',
            settings: 'Settings',
            promptShortcut: 'Enter a new shortcut key (current is "{key}")',
            invalidShortcut: 'Invalid shortcut, please enter a single character.',
            updatedShortcut: 'Shortcut updated to "{key}".'
        },
        zh: {
            watchLater: '稍后观看',
            settings: '设置',
            promptShortcut: '请输入一个新的快捷键（当前快捷键为 "{key}"）',
            invalidShortcut: '无效的快捷键，请输入单个字符。',
            updatedShortcut: '快捷键已更新为 "{key}"'
        },
        'zh-TW': {
            watchLater: '稍後觀看',
            settings: '設定',
            promptShortcut: '請輸入一個新的快捷鍵（當前快捷鍵為 "{key}"）',
            invalidShortcut: '無效的快捷鍵，請輸入單個字符。',
            updatedShortcut: '快捷鍵已更新為 "{key}"'
        },
        'zh-HK': {
            watchLater: '稍後觀看',
            settings: '設定',
            promptShortcut: '請輸入一個新的快捷鍵（當前快捷鍵為 "{key}"）',
            invalidShortcut: '無效的快捷鍵，請輸入單個字符。',
            updatedShortcut: '快捷鍵已更新為 "{key}"'
        },
         th: {
            watchLater: 'ดูภายหลัง',
            settings: 'การตั้งค่า',
            promptShortcut: 'กรุณาป้อนปุ่มลัดใหม่ (ปัจจุบันคือ "{key}")',
            invalidShortcut: 'ปุ่มลัดไม่ถูกต้อง โปรดป้อนตัวอักษรตัวเดียว',
            updatedShortcut: 'อัปเดตปุ่มลัดเป็น "{key}".'
        },
        ur: {
            watchLater: 'بعد میں دیکھیں',
            settings: 'ترتیبات',
            promptShortcut: 'نیا شارٹ کٹ کلید درج کریں (موجودہ "{key}" ہے)',
            invalidShortcut: 'غلط شارٹ کٹ، براہ کرم ایک حرف درج کریں۔',
            updatedShortcut: 'شارٹ کٹ کو "{key}" میں اپ ڈیٹ کیا گیا ہے۔'
        },
        fa: {
            watchLater: 'تماشا بعداً',
            settings: 'تنظیمات',
            promptShortcut: 'کلید میانبر جدید را وارد کنید (کلید فعلی "{key}" است)',
            invalidShortcut: 'کلید میانبر نامعتبر است، لطفاً یک حرف وارد کنید.',
            updatedShortcut: 'میانبر به "{key}" به روز شد.'
        },
        ja: {
            watchLater: '後で見る',
            settings: '設定',
            promptShortcut: '新しいショートカットキーを入力してください（現在のキーは "{key}"）',
            invalidShortcut: '無効なショートカットです。1文字を入力してください。',
            updatedShortcut: 'ショートカットが "{key}" に更新されました。'
        },
        ko: {
            watchLater: '나중에 보기',
            settings: '설정',
            promptShortcut: '새로운 단축키를 입력하세요 (현재 단축키: "{key}")',
            invalidShortcut: '잘못된 단축키입니다. 한 글자를 입력해주세요.',
            updatedShortcut: '단축키가 "{key}"로 업데이트되었습니다.'
        },
        ru: {
            watchLater: 'Смотреть позже',
            settings: 'Настройки',
            promptShortcut: 'Введите новую клавишу быстрого доступа (текущая: "{key}")',
            invalidShortcut: 'Недопустимая клавиша быстрого доступа, введите один символ.',
            updatedShortcut: 'Клавиша быстрого доступа обновлена на "{key}".'
        },
        hi: {
            watchLater: 'बाद में देखें',
            settings: 'सेटिंग्स',
            promptShortcut: 'नया शॉर्टकट कुंजी दर्ज करें (वर्तमान "{key}")',
            invalidShortcut: 'अमान्य शॉर्टकट, कृपया एक अक्षर दर्ज करें।',
            updatedShortcut: 'शॉर्टकट "{key}" पर अपडेट किया गया है।'
        },
        es: {
            watchLater: 'Ver más tarde',
            settings: 'Configuraciones',
            promptShortcut: 'Ingrese una nueva tecla de acceso rápido (actualmente "{key}")',
            invalidShortcut: 'Acceso rápido no válido, ingrese un solo carácter.',
            updatedShortcut: 'Tecla de acceso rápido actualizada a "{key}".'
        },
        pt: {
            watchLater: 'Assistir mais tarde',
            settings: 'Configurações',
            promptShortcut: 'Insira una nova tecla de atalho (atual: "{key}")',
            invalidShortcut: 'Tecla de atalho inválida, insira um único caractere.',
            updatedShortcut: 'Tecla de atalho atualizada para "{key}".'
        }
    };

    // 获取用户语言，处理不同地区的语言代码
    let language = (navigator.language || navigator.userLanguage).toLowerCase();
    if (language.includes('-')) {
        const [baseLang] = language.split('-');
        language = i18n[baseLang] ? baseLang : language;
    }
    const translations = i18n[language] || i18n['en']; // 默认使用英文

    let isCustomButtonClicked = false;
    let isCoolingDown = false;
    let isDragging = false;
    let dragStartTime = 0;
    let dragThreshold = 200; // 拖动阈值时间(ms)
    let panelOpen = false;
    let offsetY = 0;
    let watchLaterKey = 'w'; // 默认快捷键是"W"
    let playlistKeys = {};    // 存储每个收藏夹对应的快捷键
    let isPreloading = false;
    let buttonContainer = null; // 存储按钮容器引用
    let savedPosition = null; // 保存的位置信息

    // 添加CSS来隐藏.opened元素，隐藏弹出窗口
    const style = document.createElement('style');
    style.textContent = `
        .opened {
            display: none !important;
        }
    `;
    document.head.appendChild(style);

    // 隐藏tp-yt-paper-dialog元素的函数
    function hideDialogElements() {
        const dialogElements = document.querySelectorAll('tp-yt-paper-dialog.ytd-popup-container.style-scope > .ytd-popup-container.style-scope');
        dialogElements.forEach(element => {
            element.style.display = 'none'; // 直接设置display为none
        });
    }

    // 显示tp-yt-paper-dialog元素的函数
    function showDialogElements() {
        const dialogElements = document.querySelectorAll('tp-yt-paper-dialog.ytd-popup-container.style-scope > .ytd-popup-container.style-scope');
        dialogElements.forEach(element => {
            element.style.display = ''; // 恢复默认显示
        });
    }

    // 保存位置到localStorage
    function savePosition(top) {
        try {
            localStorage.setItem('youtube_button_position', top.toString());
        } catch (e) {
            console.error('保存位置失败:', e);
        }
    }

    // 从localStorage获取位置
    function getSavedPosition() {
        try {
            const saved = localStorage.getItem('youtube_button_position');
            return saved ? parseInt(saved) : null;
        } catch (e) {
            console.error('获取保存位置失败:', e);
            return null;
        }
    }

    // 创建悬浮按钮
    function createFloatingButton() {
        if (window.location.pathname !== '/watch') return; // 仅在 /watch 页面时创建按钮

        // 如果已存在按钮，先移除
        if (buttonContainer) {
            buttonContainer.remove();
        }

        const container = document.createElement('div');
        container.style.position = 'fixed';
        container.style.zIndex = 9999;
        container.style.display = 'flex';
        container.style.flexDirection = 'column';
        container.style.transition = 'right 0.3s';
        container.style.right = '0';

        // 设置初始位置
        const savedTop = getSavedPosition();
        if (savedTop !== null) {
            container.style.top = `${savedTop}px`;
        } else {
            container.style.top = '50%';
            container.style.transform = 'translateY(-50%)';
        }

        // 稍后观看按钮
        const watchLaterButton = document.createElement('button');
        watchLaterButton.innerText = translations.watchLater;
        watchLaterButton.style.backgroundColor = '#FF0000';
        watchLaterButton.style.color = '#FFFFFF';
        watchLaterButton.style.padding = '10px';
        watchLaterButton.style.border = 'none';
        watchLaterButton.style.borderRadius = '5px';
        watchLaterButton.style.cursor = 'pointer';
        watchLaterButton.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
        watchLaterButton.style.width = '80px';
        watchLaterButton.style.height = '40px';
        watchLaterButton.style.position = 'relative';
        watchLaterButton.style.right = '-60px';  // 半隐藏
        watchLaterButton.style.transition = 'right 0.3s';
        watchLaterButton.setAttribute('id', 'customWatchLaterButton');

        // 鼠标悬停效果
        watchLaterButton.onmouseenter = function() {
            if (!isDragging) {
                watchLaterButton.style.right = '0';
                settingsButton.style.right = '0';
            }
        };
        watchLaterButton.onmouseleave = function() {
            if (!isDragging && !panelOpen) {
                watchLaterButton.style.right = '-60px';
                settingsButton.style.right = '-80px';
            }
        };

        // 设置按钮
        const settingsButton = document.createElement('button');
        settingsButton.innerText = translations.settings;
        settingsButton.style.backgroundColor = '#000000';
        settingsButton.style.color = '#FFFFFF';
        settingsButton.style.padding = '8px';
        settingsButton.style.border = 'none';
        settingsButton.style.borderRadius = '5px';
        settingsButton.style.cursor = 'pointer';
        settingsButton.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.5)';
        settingsButton.style.width = '80px';
        settingsButton.style.height = '35px';
        settingsButton.style.position = 'relative';
        settingsButton.style.right = '-80px';  // 完全隐藏
        settingsButton.style.transition = 'right 0.3s';

        settingsButton.onmouseenter = function() {
            if (!isDragging) {
                settingsButton.style.right = '0';
                watchLaterButton.style.right = '0';
            }
        };
        settingsButton.onmouseleave = function() {
            if (!isDragging && !panelOpen) {
                settingsButton.style.right = '-80px';
                watchLaterButton.style.right = '-60px';
            }
        };

        // 拖动相关变量
        let dragStartX = 0;
        let dragStartY = 0;
        let hasMovedSignificantly = false;

        // 拖动逻辑
        function startDragging(e) {
            dragStartTime = Date.now();
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            hasMovedSignificantly = false;
            isDragging = true;

            // 移除transform以使用像素坐标
            if (container.style.transform) {
                const rect = container.getBoundingClientRect();
                container.style.top = `${rect.top}px`;
                container.style.transform = '';
            }

            offsetY = e.clientY - container.getBoundingClientRect().top;
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDragging);

            // 防止文字选择
            e.preventDefault();
        }

        function drag(e) {
            const deltaX = Math.abs(e.clientX - dragStartX);
            const deltaY = Math.abs(e.clientY - dragStartY);

            // 如果移动距离超过阈值，标记为显著移动
            if (deltaX > 5 || deltaY > 5) {
                hasMovedSignificantly = true;
            }

            if (hasMovedSignificantly) {
                const containerHeight = container.offsetHeight;
                const windowHeight = window.innerHeight;
                let newY = e.clientY - offsetY;

                // 限制拖动范围
                newY = Math.max(0, Math.min(newY, windowHeight - containerHeight));
                container.style.top = `${newY}px`;

                // 如果面板打开，也跟着移动
                if (panelOpen && settingsPanel) {
                    settingsPanel.style.top = `${newY}px`;
                }
            }
        }

        function stopDragging(e) {
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('mouseup', stopDragging);

            const dragDuration = Date.now() - dragStartTime;

            // 如果拖动时间短且移动距离小，视为点击
            if (dragDuration < dragThreshold && !hasMovedSignificantly) {
                // 不阻止点击事件
                isDragging = false;
                return;
            }

            // 保存位置
            if (hasMovedSignificantly) {
                const rect = container.getBoundingClientRect();
                savePosition(rect.top);
            }

            // 延迟重置拖动状态，防止立即触发点击
            setTimeout(() => {
                isDragging = false;
            }, 50);
        }

        // 为容器添加拖动事件
        container.addEventListener('mousedown', startDragging);

        // 稍后观看按钮点击事件
        watchLaterButton.addEventListener('click', function(e) {
            // 如果正在拖动或刚完成拖动，不处理点击
            if (isDragging || hasMovedSignificantly) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }

            if (isCoolingDown) {
                return;
            }

            isCustomButtonClicked = true;
            isCoolingDown = true;
            watchLaterButton.style.backgroundColor = '#AAAAAA';

            setTimeout(() => {
                isCoolingDown = false;
                watchLaterButton.style.backgroundColor = '#FF0000';
            }, 3500);

            const videoId = getVideoId();
            if (videoId) {
                addWatchLater();
            }
        });

        // 设置按钮点击事件
        settingsButton.addEventListener('click', function(e) {
            if (isDragging || hasMovedSignificantly) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
            toggleSettingsPanel();
        });

        container.appendChild(watchLaterButton);
        container.appendChild(settingsButton);
        document.body.appendChild(container);

        // 保存容器引用
        buttonContainer = container;

        // 创建并附加设置面板
        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'customSettingsPanel';
        settingsPanel.style.position = 'fixed';
        settingsPanel.style.backgroundColor = '#FFFFFF';
        settingsPanel.style.border = '1px solid #888';
        settingsPanel.style.borderRadius = '5px';
        settingsPanel.style.boxShadow = '0 0 10px rgba(0,0,0,0.5)';
        settingsPanel.style.zIndex = 10000;
        settingsPanel.style.padding = '15px';
        settingsPanel.style.width = '320px';
        settingsPanel.style.maxHeight = '400px';
        settingsPanel.style.overflowY = 'auto';
        settingsPanel.style.display = 'none';
        settingsPanel.style.fontSize = '14px';
        // 初始位置，与按钮对齐
        const rect = container.getBoundingClientRect();
        settingsPanel.style.top = `${rect.top}px`;
        settingsPanel.style.right = '90px';

        // 面板标题和关闭按钮
        const panelHeader = document.createElement('div');
        panelHeader.style.display = 'flex';
        panelHeader.style.justifyContent = 'space-between';
        panelHeader.style.alignItems = 'center';
        panelHeader.style.marginBottom = '15px';
        panelHeader.style.fontWeight = 'bold';
        panelHeader.style.fontSize = '16px';
        panelHeader.innerText = '快捷键设置';
        const closeBtn = document.createElement('button');
        closeBtn.innerText = '×';
        closeBtn.style.background = 'none';
        closeBtn.style.border = 'none';
        closeBtn.style.fontSize = '20px';
        closeBtn.style.cursor = 'pointer';
        closeBtn.style.padding = '0';
        closeBtn.style.width = '20px';
        closeBtn.style.height = '20px';
        closeBtn.onclick = function() {
            settingsPanel.style.display = 'none';
            panelOpen = false;
            if (!isDragging) {
                watchLaterButton.style.right = '-60px';
                settingsButton.style.right = '-80px';
            }
        };
        panelHeader.appendChild(closeBtn);
        settingsPanel.appendChild(panelHeader);

        // 稍后观看快捷键设置区域
        const watchLaterSection = document.createElement('div');
        watchLaterSection.style.marginBottom = '20px';
        watchLaterSection.style.padding = '10px';
        watchLaterSection.style.border = '1px solid #ddd';
        watchLaterSection.style.borderRadius = '5px';
        watchLaterSection.style.backgroundColor = '#f9f9f9';

        const watchLaterTitle = document.createElement('div');
        watchLaterTitle.innerText = '稍后观看快捷键';
        watchLaterTitle.style.fontWeight = 'bold';
        watchLaterTitle.style.marginBottom = '10px';
        watchLaterSection.appendChild(watchLaterTitle);

        const watchLaterKeyDiv = document.createElement('div');
        watchLaterKeyDiv.style.display = 'flex';
        watchLaterKeyDiv.style.alignItems = 'center';
        watchLaterKeyDiv.style.gap = '10px';

        const watchLaterKeyInput = document.createElement('input');
        watchLaterKeyInput.type = 'text';
        watchLaterKeyInput.style.width = '150px';
        watchLaterKeyInput.style.padding = '5px';
        watchLaterKeyInput.style.border = '1px solid #ccc';
        watchLaterKeyInput.style.borderRadius = '3px';
        watchLaterKeyInput.placeholder = '按下组合键...';
        watchLaterKeyInput.readOnly = true;
        watchLaterKeyInput.value = formatShortcut(getStoredWatchLaterKey());

        const watchLaterResetBtn = document.createElement('button');
        watchLaterResetBtn.innerText = '重置';
        watchLaterResetBtn.style.padding = '5px 10px';
        watchLaterResetBtn.style.border = '1px solid #ccc';
        watchLaterResetBtn.style.borderRadius = '3px';
        watchLaterResetBtn.style.cursor = 'pointer';
        watchLaterResetBtn.onclick = function() {
            watchLaterKey = { ctrl: false, alt: false, shift: false, key: 'w' };
            watchLaterKeyInput.value = formatShortcut(watchLaterKey);
            saveWatchLaterKey();
        };

        watchLaterKeyDiv.appendChild(watchLaterKeyInput);
        watchLaterKeyDiv.appendChild(watchLaterResetBtn);
        watchLaterSection.appendChild(watchLaterKeyDiv);

        // 为稍后观看快捷键输入框添加键盘事件监听
        watchLaterKeyInput.addEventListener('keydown', function(e) {
            e.preventDefault();
            if (e.key === 'Escape') {
                watchLaterKeyInput.blur();
                return;
            }
            if (e.key === 'Tab' || e.key === 'Enter') return;

            const newKey = {
                ctrl: e.ctrlKey,
                alt: e.altKey,
                shift: e.shiftKey,
                key: e.key.toLowerCase()
            };

            // 至少需要一个修饰键
            if (!newKey.ctrl && !newKey.alt && !newKey.shift) {
                alert('请使用组合键（Ctrl/Alt/Shift + 字母/数字）');
                return;
            }

            watchLaterKey = newKey;
            watchLaterKeyInput.value = formatShortcut(watchLaterKey);
            saveWatchLaterKey();
        });

        settingsPanel.appendChild(watchLaterSection);

        // 收藏夹快捷键设置区域
        const playlistSection = document.createElement('div');
        playlistSection.style.marginBottom = '15px';

        const playlistTitle = document.createElement('div');
        playlistTitle.innerText = '收藏夹快捷键';
        playlistTitle.style.fontWeight = 'bold';
        playlistTitle.style.marginBottom = '10px';
        playlistSection.appendChild(playlistTitle);

        // 刷新收藏夹按钮
        const refreshBtn = document.createElement('button');
        refreshBtn.innerText = '刷新收藏夹列表';
        refreshBtn.style.padding = '5px 10px';
        refreshBtn.style.border = '1px solid #ccc';
        refreshBtn.style.borderRadius = '3px';
        refreshBtn.style.cursor = 'pointer';
        refreshBtn.style.marginBottom = '10px';
        refreshBtn.onclick = function() {
            updatePlaylistList();
        };
        playlistSection.appendChild(refreshBtn);

        // 列表容器
        const panelList = document.createElement('div');
        panelList.style.maxHeight = '200px';
        panelList.style.overflowY = 'auto';
        panelList.style.border = '1px solid #ddd';
        panelList.style.borderRadius = '5px';
        panelList.style.padding = '5px';
        playlistSection.appendChild(panelList);

        settingsPanel.appendChild(playlistSection);

        // 添加至所选按钮
        const addSelectedBtn = document.createElement('button');
        addSelectedBtn.innerText = '添加到选中收藏夹';
        addSelectedBtn.style.padding = '8px';
        addSelectedBtn.style.width = '100%';
        addSelectedBtn.style.border = 'none';
        addSelectedBtn.style.backgroundColor = '#FF0000';
        addSelectedBtn.style.color = '#FFFFFF';
        addSelectedBtn.style.borderRadius = '5px';
        addSelectedBtn.style.cursor = 'pointer';
        addSelectedBtn.onclick = function() {
            addToSelectedPlaylists();
        };
        settingsPanel.appendChild(addSelectedBtn);

        document.body.appendChild(settingsPanel);

        // 切换设置面板显示隐藏
        function toggleSettingsPanel() {
            if (settingsPanel.style.display === 'none') {
                updatePlaylistList();
                settingsPanel.style.display = 'block';
                panelOpen = true;
                // Position panel near container
                const rect = container.getBoundingClientRect();
                settingsPanel.style.top = `${rect.top}px`;
                settingsPanel.style.right = '90px';
                // 保持按钮可见
                watchLaterButton.style.right = '0';
                settingsButton.style.right = '0';
            } else {
                settingsPanel.style.display = 'none';
                panelOpen = false;
                // 隐藏按钮
                if (!isDragging) {
                    watchLaterButton.style.right = '-60px';
                    settingsButton.style.right = '-80px';
                }
            }
        }

        // 更新收藏夹列表
        function updatePlaylistList() {
            // 清空旧列表
            panelList.replaceChildren();

            // 获取存储的收藏夹数据
            const storedPlaylists = getStoredPlaylists();

            // 获取当前页面的收藏夹
            const currentPlaylistElems = document.querySelectorAll('#playlists yt-formatted-string[title]');
            const currentPlaylists = new Set();

            currentPlaylistElems.forEach(elem => {
                const name = elem.textContent || elem.getAttribute('title');
                if (name && !name.match(/稍后观看|Watch later|历史记录|History/)) {
                    currentPlaylists.add(name);
                }
            });

            // 合并存储的和当前的收藏夹
            const allPlaylists = new Set([...Object.keys(storedPlaylists), ...currentPlaylists]);

            // 为每个收藏夹创建列表项
            Array.from(allPlaylists).sort().forEach(name => {
                const itemDiv = document.createElement('div');
                itemDiv.style.display = 'flex';
                itemDiv.style.alignItems = 'center';
                itemDiv.style.marginBottom = '8px';
                itemDiv.style.padding = '5px';
                itemDiv.style.border = '1px solid #eee';
                itemDiv.style.borderRadius = '3px';
                itemDiv.style.backgroundColor = '#fff';

                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.style.marginRight = '8px';
                itemDiv.appendChild(checkbox);

                const label = document.createElement('span');
                label.className = 'playlistName';
                label.innerText = name;
                label.style.flexGrow = '1';
                label.style.fontSize = '12px';
                // 如果不在当前页面，显示为灰色
                if (!currentPlaylists.has(name)) {
                    label.style.color = '#888';
                    label.title = '此收藏夹不在当前页面';
                }
                itemDiv.appendChild(label);

                const keyInput = document.createElement('input');
                keyInput.type = 'text';
                keyInput.className = 'playlistKey';
                keyInput.style.width = '100px';
                keyInput.style.padding = '2px 5px';
                keyInput.style.border = '1px solid #ccc';
                keyInput.style.borderRadius = '3px';
                keyInput.style.fontSize = '12px';
                keyInput.placeholder = '组合键...';
                keyInput.readOnly = true;

                // 如果已有设置的快捷键，显示
                if (storedPlaylists[name]) {
                    keyInput.value = formatShortcut(storedPlaylists[name]);
                }

                // 为快捷键输入框添加键盘事件监听
                keyInput.addEventListener('keydown', function(e) {
                    e.preventDefault();
                    if (e.key === 'Escape') {
                        keyInput.blur();
                        return;
                    }
                    if (e.key === 'Tab' || e.key === 'Enter') return;

                    const newKey = {
                        ctrl: e.ctrlKey,
                        alt: e.altKey,
                        shift: e.shiftKey,
                        key: e.key.toLowerCase()
                    };

                    // 至少需要一个修饰键
                    if (!newKey.ctrl && !newKey.alt && !newKey.shift) {
                        alert('请使用组合键（Ctrl/Alt/Shift + 字母/数字）');
                        return;
                    }

                    // 检查是否与稍后观看快捷键冲突
                    if (isShortcutEqual(newKey, watchLaterKey)) {
                        alert('快捷键与稍后观看快捷键冲突！');
                        return;
                    }

                    // 检查是否与其他收藏夹快捷键冲突
                    let conflict = false;
                    for (const [pl, key] of Object.entries(storedPlaylists)) {
                        if (pl !== name && isShortcutEqual(key, newKey)) {
                            conflict = true;
                            break;
                        }
                    }

                    if (conflict) {
                        alert('快捷键与其他收藏夹冲突！');
                        return;
                    }

                    // 保存快捷键
                    const playlists = getStoredPlaylists();
                    playlists[name] = newKey;
                    savePlaylists(playlists);
                    keyInput.value = formatShortcut(newKey);
                    playlistKeys[name] = newKey;
                });

                // 重置按钮
                const resetBtn = document.createElement('button');
                resetBtn.innerText = '×';
                resetBtn.style.marginLeft = '5px';
                resetBtn.style.padding = '2px 5px';
                resetBtn.style.border = '1px solid #ccc';
                resetBtn.style.borderRadius = '3px';
                resetBtn.style.cursor = 'pointer';
                resetBtn.style.fontSize = '12px';
                resetBtn.onclick = function() {
                    const playlists = getStoredPlaylists();
                    delete playlists[name];
                    delete playlistKeys[name];
                    savePlaylists(playlists);
                    keyInput.value = '';
                };

                itemDiv.appendChild(keyInput);
                itemDiv.appendChild(resetBtn);
                panelList.appendChild(itemDiv);
            });
        }

        // 将当前视频添加到所选收藏夹
        function addToSelectedPlaylists() {
            const checkedPlaylists = [];
            panelList.querySelectorAll('div').forEach(itemDiv => {
                const chk = itemDiv.querySelector('input[type="checkbox"]');
                const nameSpan = itemDiv.querySelector('.playlistName');
                if (chk.checked && nameSpan) {
                    checkedPlaylists.push(nameSpan.innerText);
                }
            });
            if (checkedPlaylists.length === 0) {
                alert('未选择任何收藏夹');
                return;
            }
            // 关闭面板
            settingsPanel.style.display = 'none';
            panelOpen = false;
            if (!isDragging) {
                watchLaterButton.style.right = '-60px';
                settingsButton.style.right = '-80px';
            }

            // 点击保存按钮，预加载对话框
            const saveButton = document.querySelector('button[aria-label*="保存"], button[aria-label*="Save"]');
            if (saveButton) {
                isPreloading = true;
                document.body.classList.add('preloading');
                saveButton.click();
                // 等待对话框加载后点击每个选中的收藏夹
                setTimeout(() => {
                    checkedPlaylists.forEach(name => {
                        const item = Array.from(document.querySelectorAll('yt-formatted-string')).find(el => el.textContent === name);
                        if (item) {
                            item.click();
                        }
                    });
                    finishPreloadAndHideDialog();
                }, 500);
            }
        }
    }

    // 数据持久化相关函数
    function getStoredPlaylists() {
        try {
            const stored = localStorage.getItem('youtube_playlists_shortcuts');
            return stored ? JSON.parse(stored) : {};
        } catch (e) {
            console.error('获取收藏夹数据失败:', e);
            return {};
        }
    }

    function savePlaylists(playlists) {
        try {
            localStorage.setItem('youtube_playlists_shortcuts', JSON.stringify(playlists));
        } catch (e) {
            console.error('保存收藏夹数据失败:', e);
        }
    }

    function getStoredWatchLaterKey() {
        try {
            const stored = localStorage.getItem('youtube_watch_later_key');
            return stored ? JSON.parse(stored) : { ctrl: false, alt: false, shift: false, key: 'w' };
        } catch (e) {
            console.error('获取稍后观看快捷键失败:', e);
            return { ctrl: false, alt: false, shift: false, key: 'w' };
        }
    }

    function saveWatchLaterKey() {
        try {
            localStorage.setItem('youtube_watch_later_key', JSON.stringify(watchLaterKey));
        } catch (e) {
            console.error('保存稍后观看快捷键失败:', e);
        }
    }

    // 快捷键相关工具函数
    function formatShortcut(shortcut) {
        if (!shortcut) return '';
        const parts = [];
        if (shortcut.ctrl) parts.push('Ctrl');
        if (shortcut.alt) parts.push('Alt');
        if (shortcut.shift) parts.push('Shift');
        if (shortcut.key) parts.push(shortcut.key.toUpperCase());
        return parts.join(' + ');
    }

    function isShortcutEqual(key1, key2) {
        if (!key1 || !key2) return false;
        return key1.ctrl === key2.ctrl &&
               key1.alt === key2.alt &&
               key1.shift === key2.shift &&
               key1.key === key2.key;
    }

    // 初始化快捷键数据
    watchLaterKey = getStoredWatchLaterKey();
    playlistKeys = getStoredPlaylists();

    // 保留其他逻辑
    function getVideoId() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('v');
    }

    // 添加视频到稍后观看
    function addWatchLater() {
        const saveButton = document.querySelector('button[aria-label*="保存"], button[aria-label*="Save"]');
        if (saveButton) {
            isPreloading = true;
            document.body.classList.add('preloading');
            saveButton.click();
            const observer = new MutationObserver(() => {
                const watchLaterButton = document.querySelector('yt-formatted-string[title="稍后观看"], yt-formatted-string[title="Watch later"]');
                if (watchLaterButton) {
                    observer.disconnect();
                    watchLaterButton.click();
                    console.log('视频已添加到稍后观看');
                    finishPreloadAndHideDialog();
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
        } else {
            console.log('未找到保存按钮');
            finishPreloadAndHideDialog();
        }
    }

    // 在预加载完成后移除 'preloading' 类并隐藏对话框
    function finishPreloadAndHideDialog() {
        isPreloading = false;
        document.body.classList.remove('preloading');
        hideDialogElements();
    }

    function setupOriginalSaveButtonListener() {
        const observer = new MutationObserver(() => {
            const originalSaveButton = document.querySelector('ytd-menu-renderer');
            if (originalSaveButton) {
                originalSaveButton.addEventListener('click', () => {
                    isCustomButtonClicked = false;
                    showDialogElements();
                });
                observer.disconnect();
            }
        });
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // 监听键盘事件 - 修改为支持组合键
    document.addEventListener('keydown', (event) => {
        if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
            return;
        }

        const currentKey = {
            ctrl: event.ctrlKey,
            alt: event.altKey,
            shift: event.shiftKey,
            key: event.key.toLowerCase()
        };

        // 检查稍后观看快捷键
        if (isShortcutEqual(currentKey, watchLaterKey)) {
            event.preventDefault();
            const button = document.getElementById('customWatchLaterButton');
            if (button) {
                button.click();
            }
            return;
        }

        // 检查收藏夹快捷键
        for (const [playlistName, shortcut] of Object.entries(playlistKeys)) {
            if (isShortcutEqual(currentKey, shortcut)) {
                event.preventDefault();
                const saveButton = document.querySelector('button[aria-label*="保存"], button[aria-label*="Save"]');
                if (saveButton) {
                    isPreloading = true;
                    document.body.classList.add('preloading');
                    saveButton.click();
                    const observer = new MutationObserver(() => {
                        const item = Array.from(document.querySelectorAll('yt-formatted-string')).find(el => el.textContent === playlistName);
                        if (item) {
                            observer.disconnect();
                            item.click();
                            console.log(`视频已添加到收藏夹: ${playlistName}`);
                            finishPreloadAndHideDialog();
                        }
                    });
                    observer.observe(document.body, { childList: true, subtree: true });
                }
                return;
            }
        }
    });

    // 隐藏按钮在主页、迷你播放器和全屏时
    function checkVisibility() {
        const isHomepage = window.location.href === 'https://www.youtube.com/';
        const isMiniPlayer = document.querySelector('.mini-player');
        const isFullscreen = document.fullscreenElement !== null;

        const button = document.getElementById('customWatchLaterButton');
        const settingsButton = document.querySelector('button#customWatchLaterButton + button');

        if (button) {
            button.style.display = (isHomepage || isMiniPlayer || isFullscreen) ? 'none' : 'block';
            settingsButton.style.display = (isHomepage || isMiniPlayer || isFullscreen) ? 'none' : 'block';
        }
    }

    // 页面加载完成后创建按钮
    function onPreloadFinish() {
        // 延迟创建按钮，等待页面完全加载
        setTimeout(() => {
            createFloatingButton();
            setupOriginalSaveButtonListener();
            checkVisibility();
        }, 500);
    }

    // 监听预加载完成事件
    const preloadObserver = new MutationObserver(() => {
        if (!isPreloading) {
            preloadObserver.disconnect();
            onPreloadFinish();
        }
    });
    preloadObserver.observe(document.body, { attributes: true, childList: true, subtree: true });

    // 监控URL变化
    const observer = new MutationObserver(() => {
        checkVisibility();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    })();