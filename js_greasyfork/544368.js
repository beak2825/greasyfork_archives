// ==UserScript==
// @name         Bangumi排行榜条目屏蔽器
// @namespace    https://greasyfork.org/zh-CN/scripts/544368
// @version      1.3
// @description  在排行页面右上角增加按钮，可开启屏蔽模式进行条目屏蔽或管理已屏蔽条目，支持本地持久保存。
// @author       forary
// @license      MIT
// @match        https://bgm.tv/*/browser*sort=rank*
// @match        https://bangumi.tv/*/browser*sort=rank*
// @match        https://chii.in/*/browser*sort=rank*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/544368/Bangumi%E6%8E%92%E8%A1%8C%E6%A6%9C%E6%9D%A1%E7%9B%AE%E5%B1%8F%E8%94%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/544368/Bangumi%E6%8E%92%E8%A1%8C%E6%A6%9C%E6%9D%A1%E7%9B%AE%E5%B1%8F%E8%94%BD%E5%99%A8.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const CURRENT_VERSION = 1.3;
    const category = (function () {
        const path = location.pathname;
        if (path.startsWith('/anime/')) return 'anime';
        if (path.startsWith('/book/')) return 'book';
        if (path.startsWith('/music/')) return 'music';
        if (path.startsWith('/game/')) return 'game';
        if (path.startsWith('/real/')) return 'real';
        return 'wrong';
    })();
    const VERSION_KEY = 'bangumi_rank_version';
    const STORAGE_KEY = `bangumi_rank_blocked_items_${category}`;
    const SETTINGS_KEY = 'bangumi_rank_user_settings';

    function getLocalStorageVersion() {
        const raw = localStorage.getItem(VERSION_KEY);
        return raw ? parseFloat(raw) : 1.2;
    }

    function updateLocalStorageVersion() {
        localStorage.setItem(VERSION_KEY, CURRENT_VERSION);
    }

    function getUserSettings() {
        if (getLocalStorageVersion() < 1.3) {
            localStorage.removeItem(SETTINGS_KEY);
            updateLocalStorageVersion();
        }
        try {
            const raw = localStorage.getItem(SETTINGS_KEY);
            const parsed = raw ? JSON.parse(raw) : {};
            return {
                enableBlocking: parsed.enableBlocking ?? true,
                renumberRanks: parsed.renumberRanks ?? {},
            };
        } catch (e) {
            return { enableBlocking: true, renumberRanks: {} };
        }
    }

    function setUserSettings(settings) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    }

    function getBlockedMap() {
        const raw = localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : {};
    }

    function setBlockedMap(map) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
    }

    function addToBlockedMap(id, name) {
        const map = getBlockedMap();
        if (!(id in map)) {
            map[id] = name;
            setBlockedMap(map);
        }
    }

    function removeFromBlockedMap(id) {
        const map = getBlockedMap();
        if (id in map) {
            delete map[id];
            setBlockedMap(map);
        }
    }
    // v1.1 判断排行榜是否开启筛选
    function isFiltered() {
        const pathname = location.pathname;
        const searchParams = new URLSearchParams(location.search);
        // 未筛选时 pathname 是 /category/browser 或 /category/browser/
        const cleanPaths = [`/${category}/browser`, `/${category}/browser/`];
        const isCleanPath = cleanPaths.includes(pathname);
        // 判断是否包含额外的 pathname 参数，如分类、时间
        const isPathFiltered = !isCleanPath;
        // 判断是否含有筛选用的 query，如 orderby
        const hasFilterParams = searchParams.has('orderby');

        return isPathFiltered || hasFilterParams;
    }

    // 更改界面，隐藏当前页面中的已屏蔽条目
    function blockExistingItems() {
        const settings = getUserSettings();
        if (settings.enableBlocking === false) {
            return;
        }
        const blockedMap = getBlockedMap();
        const items = document.querySelectorAll('li[id^="item_"]'); // 页面中存在的条目列表
        items.forEach(item => {
            const idMatch = item.id.match(/^item_(\d+)$/); // 提取出数值ID
            if (!idMatch) return; // 失败则跳过
            const id = idMatch[1];
            if (id in blockedMap) {
                item.remove();
            }
        });
        const renum_setting = settings.renumberRanks?.[category] ?? false
        if (!isFiltered() && renum_setting) {
            renumberRanks();
        }
    }
    // v1.1 更改Rank数值，避免页内数字间隔
    function renumberRanks() {
        const items = Array.from(document.querySelectorAll('li[id^="item_"]'));
        let rankOffset = (function () {
            // 从 URL 中读取 page 参数，未指定时为第一页
            const pageMatch = location.search.match(/[?&]page=(\d+)/);
            const page = pageMatch ? parseInt(pageMatch[1], 10) : 1;
            return (page - 1) * 24;
        })();
        items.forEach((item, index) => {
            const rankElem = item.querySelector('.rank small');
            if (rankElem && rankElem.nextSibling?.nodeType === Node.TEXT_NODE) {
                rankElem.nextSibling.textContent = (rankOffset + index + 1).toString();
            }
        });
    }

    // 显示每个条目的 “屏蔽” 按钮
    function showBlockButtons() {
        const items = document.querySelectorAll('li[id^="item_"]');
        items.forEach(item => {
            const idMatch = item.id.match(/^item_(\d+)$/);
            if (!idMatch) return;
            const id = idMatch[1];
            const btn = document.createElement('button');
            btn.textContent = '×';
            btn.className = 'bangumi-block-btn';
            Object.assign(btn.style, {
                position: 'absolute',
                bottom: '8px',
                right: '10px',
                width: '18px',
                height: '18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
                padding: '0',
                background: '#f66',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
            });
            btn.onclick = () => {
                const nameElem = item.querySelector('.inner h3 a');
                const name = nameElem?.textContent?.trim() || '未知标题';
                addToBlockedMap(id, name);
                item.remove();
            };
            item.style.position = 'relative';
            item.appendChild(btn);
        });
    }
    // 隐藏每个条目的 “屏蔽” 按钮
    function hideBlockButtons() {
        const buttons = document.querySelectorAll('.bangumi-block-btn');
        buttons.forEach(btn => {
            btn.parentElement?.removeChild(btn);
        });
    }
    // 两个控制按键
    function createControlButtons() {
        const toggleBtn = document.createElement('button');
        toggleBtn.textContent = '添加屏蔽';
        Object.assign(toggleBtn.style, {
            position: 'absolute',
            right: '90px',
            padding: '8px 8px',
            background: '#F09199',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '12px',
            lineHeight: '1',
        });
        toggleBtn.onclick = () => {
            if (toggleBtn.textContent === '添加屏蔽') {
                showBlockButtons();
                toggleBtn.textContent = '退出';
            } else {
                hideBlockButtons();
                toggleBtn.textContent = '添加屏蔽';
            }
        };

        const showListBtn = document.createElement('button');
        showListBtn.textContent = '管理屏蔽';
        Object.assign(showListBtn.style, {
            position: 'absolute',
            right: '20px',
            padding: '8px 8px',
            background: '#F09199',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            cursor: 'pointer',
            fontSize: '12px',
            lineHeight: '1',
        });
        showListBtn.onclick = showControlModal;

        const header = document.querySelector('#header');
        if (header) {
            header.style.position = 'relative';
            header.appendChild(toggleBtn);
            header.appendChild(showListBtn);
        }
    }

    // 打开管理界面
    function showControlModal() {
        // v1.2 禁止主页面滚动
        const scrollBarWidth = window.innerWidth - document.documentElement.clientWidth;
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        document.body.style.position = 'fixed';
        document.body.style.top = `-${scrollTop}px`;
        document.body.style.left = '0';
        document.body.style.right = '0';
        document.body.style.overflow = 'hidden';
        document.body.style.paddingRight = `${scrollBarWidth}px`; // 补偿滚动条宽度

        const blocked = getBlockedMap();
        const settings = getUserSettings();
        // 遮罩层
        const overlay = document.createElement('div');
        Object.assign(overlay.style, {
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.6)',
            zIndex: 10000,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
        });
        // v1.2 点击遮罩层关闭
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) {
                closeControlModal(overlay, scrollTop);
            }
        });

        // 粉色主体
        // 外层 modal
        const modalW = document.createElement('div');
        Object.assign(modalW.style, {
            position: 'relative',
            background: '#F09199',
            padding: '8px 0px',
            borderRadius: '10px',
            width: '300px',
            maxHeight: '400px',
            overflow: 'hidden', // 让内部滚动条被裁剪
        });

        // 内层内容容器
        const modal = document.createElement('div');
        Object.assign(modal.style, {
            position: 'relative',
            padding: '8px 20px',
            maxHeight: '400px',
            overflowY: 'auto', // 滚动在内部
            boxSizing: 'border-box',
            scrollbarWidth: 'thin', 
            scrollbarColor: '#ffb6c1 #f09199' // 滑块颜色 背景颜色
        });

        // 关闭按键
        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        Object.assign(closeBtn.style, {
            width: '22px',
            height: '22px',
            lineHeight: '22px',
            textAlign: 'center',
            fontSize: '16px',
            background: '#ffb6c1',
            color: '#fff',
            borderRadius: '50%',
            border: 'none',
            cursor: 'pointer',
            position: 'absolute',
            top: '13px',
            right: '14px',
            transition: 'transform 0.2s ease',
        });
        closeBtn.onmouseover = () => closeBtn.style.transform = 'scale(1.1)';
        closeBtn.onmouseout = () => closeBtn.style.transform = 'scale(1)';
        closeBtn.onclick = () => closeControlModal(overlay, scrollTop);

        // ===== 控制区域 设置选项 =====
        const title1 = document.createElement('h3');
        title1.textContent = `设置选项`;
        title1.style.marginBottom = '10px';

        // v1.2 屏蔽开关
        const globalToggleContainer = document.createElement('div');
        Object.assign(globalToggleContainer.style, {
            marginBottom: '10px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
        });
        const globalCheckbox = document.createElement('input');
        globalCheckbox.type = 'checkbox';
        globalCheckbox.checked = settings.enableBlocking ?? true;
        globalCheckbox.id = 'enable-blocking-toggle';
        globalCheckbox.style.cursor = 'pointer';

        const globalLabel = document.createElement('label');
        globalLabel.textContent = '启用屏蔽功能';
        globalLabel.htmlFor = 'enable-blocking-toggle';

        globalCheckbox.onchange = () => {
            settings.enableBlocking = globalCheckbox.checked;
            setUserSettings(settings);
        };
        globalToggleContainer.appendChild(globalCheckbox);
        globalToggleContainer.appendChild(globalLabel);

        // v1.1 重新编号开关
        const renumberContainer = document.createElement('div');
        Object.assign(renumberContainer.style, {
            marginBottom: '15px',
            fontSize: '13px',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
        });

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = settings.renumberRanks?.[category] ?? false;
        checkbox.id = 'renumber-toggle';
        checkbox.style.cursor = 'pointer';

        const label = document.createElement('label');
        label.textContent = `重新编号 ${category} 排名`;
        label.htmlFor = 'renumber-toggle'; // label 绑定 input

        checkbox.onchange = () => {
            settings.renumberRanks[category] = checkbox.checked;
            setUserSettings(settings);
        };
        renumberContainer.appendChild(checkbox);
        renumberContainer.appendChild(label);

        // ===== 内容区域 屏蔽条目列表  =====
        const title2 = document.createElement('h3');
        title2.textContent = `已屏蔽${category}条目`;
        title2.style.marginBottom = '10px';
        const list = document.createElement('ul');

        // 列表
        for (const [id, name] of Object.entries(blocked)) {
            const li = document.createElement('li');
            Object.assign(li.style, {
                display: 'flex',
                alignItems: 'center',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                width: '100%',
                marginBottom: '5px',
            });
            // 创建文本节点（会自动省略过长文本）
            const textSpan = document.createElement('a');
            textSpan.textContent = `${id} - ${name}`;
            textSpan.title = `${name}`;
            textSpan.href = `${location.origin}/subject/${id}`;
            Object.assign(textSpan.style, {
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                flexGrow: 1,
            });
            textSpan.target = '_blank';
            textSpan.rel = 'noopener noreferrer';

            const unhideBtn = document.createElement('button');
            unhideBtn.textContent = '取消屏蔽';
            Object.assign(unhideBtn.style, {
                marginRight: '8px',
                padding: '2px 6px',
                fontSize: '12px',
                background: '#4CAF50',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
            });
            unhideBtn.onclick = () => {
                removeFromBlockedMap(id);
                li.remove();
            };
            li.appendChild(unhideBtn);
            li.appendChild(textSpan);
            list.appendChild(li);
        }
        // v1.2 清空屏蔽
        const clearBtn = document.createElement('button');
        clearBtn.textContent = '清空全部屏蔽';
        Object.assign(clearBtn.style, {
            marginTop: '5px',
            padding: '3px 5px',
            fontSize: '12px',
            background: '#d9534f',
            color: '#fff',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
        });
        clearBtn.onclick = () => {
            if (confirm(`确定清空所有已屏蔽${category}条目吗？`)) {
                setBlockedMap({});
                list.innerHTML = '';
            }
        };

        modal.appendChild(title1);
        modal.appendChild(globalToggleContainer);
        modal.appendChild(renumberContainer);
        modal.appendChild(title2);
        modal.appendChild(list);
        modal.appendChild(clearBtn);
        modalW.appendChild(modal);
        modalW.appendChild(closeBtn);
        overlay.appendChild(modalW);
        document.body.appendChild(overlay);
    }
    // 关闭管理界面 v1.2
    function closeControlModal(overlay, scrollTop) {
        overlay.remove();
        document.body.style.position = '';
        document.body.style.top = '';
        document.body.style.left = '';
        document.body.style.right = '';
        document.body.style.overflow = '';
        document.body.style.paddingRight = '';
        if (scrollTop !== undefined) {
            window.scrollTo(0, scrollTop);
        }
    }

    function init() {
        blockExistingItems();
        createControlButtons();
    }
    window.addEventListener('load', init);
    const observer = new MutationObserver(() => {
        blockExistingItems();
    });
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
})();