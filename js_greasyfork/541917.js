// ==UserScript==
// @name         M-Team 封面增強PRO (網格佈局、點擊放大、高級自定義)
// @namespace    https://github.com/Sam5440/mteam_next_beautification
// @version      1.6
// @description  徹底革新M-Team種子列表為高度自定義卡片網格佈局。功能涵蓋點擊放大、按鈕同步、字體/顏色調節、大種子高亮、靈活佈局與多語言支持。最新版新增「Free」種子綠色高亮、下載新分頁、刷新延遲自定義、下載進度顯示等，所有設置均可持久化保存。
// @author       ChatGPT & Sam5440
// @match        https://next.m-team.cc/*
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @grant        GM_xmlhttpRequest
// @connect      raw.githubusercontent.com
// @homepageURL  https://github.com/Sam5440/mteam_next_beautification
// @supportURL   https://github.com/Sam5440/mteam_next_beautification/issues
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/541917/M-Team%20%E5%B0%81%E9%9D%A2%E5%A2%9E%E5%BC%B7PRO%20%28%E7%B6%B2%E6%A0%BC%E4%BD%88%E5%B1%80%E3%80%81%E9%BB%9E%E6%93%8A%E6%94%BE%E5%A4%A7%E3%80%81%E9%AB%98%E7%B4%9A%E8%87%AA%E5%AE%9A%E7%BE%A9%29.user.js
// @updateURL https://update.greasyfork.org/scripts/541917/M-Team%20%E5%B0%81%E9%9D%A2%E5%A2%9E%E5%BC%B7PRO%20%28%E7%B6%B2%E6%A0%BC%E4%BD%88%E5%B1%80%E3%80%81%E9%BB%9E%E6%93%8A%E6%94%BE%E5%A4%A7%E3%80%81%E9%AB%98%E7%B4%9A%E8%87%AA%E5%AE%9A%E7%BE%A9%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // --- 版本控制 ---
    const SCRIPT_VERSION = '1.6'; // 版本號更新到 1.6
    let latestVersion = '檢查中...';

    // --- 配置和存儲鍵 ---
    const STORAGE_PREFIX = 'mteam_pro_';
    const KEYS = {
        cardLayout: 'cardLayoutEnabled',
        scale: 'imageEnlargementScale',
        tagPosition: 'tagPosition',
        statsFontSize: 'statsFontSize',
        statsFontColor: 'statsFontColor',
        sizeFontSize: 'sizeFontSize',
        sizeFontColor: 'sizeFontColor',
        relativeTimeFontSize: 'relativeTimeFontSize',
        relativeTimeFontColor: 'relativeTimeFontColor',
        absoluteTimeFontSize: 'absoluteTimeFontSize',
        absoluteTimeFontColor: 'absoluteTimeFontColor',
        actionButtonScale: 'actionButtonScale',
        largeTorrentThreshold: 'largeTorrentThresholdGB',
        contentWidthMode: 'contentWidthMode',
        contentMaxWidthValue: 'contentMaxWidthValue',
        contentFixedViewWidthValue: 'contentFixedViewWidthValue',
        contentMaxWidthMarginLeft: 'contentMaxWidthMarginLeft',
        contentFixedViewWidthMarginLeft: 'contentFixedViewWidthMarginLeft',
        settingsVisible: 'settingsPanelVisible',
        showStatsOnNewLine: 'showStatsOnNewLine',
        timeGapPx: 'timeGapPx',
        statsPosition: 'statsPosition',
        timeLayout: 'timeLayout',
        relativeTimePrefix: 'relativeTimePrefix',
        usePreciseRelativeTime: 'usePreciseRelativeTime',
        lastRunVersion: 'lastRunVersion',
        showCounter: 'showCounter',
        refreshDelay: 'refreshDelay',
        language: 'language',
        downloadInNewTab: 'downloadInNewTab'
    };

    // --- 默認值 ---
    const DEFAULTS = {
        [KEYS.cardLayout]: true,
        [KEYS.scale]: 2.5,
        [KEYS.tagPosition]: 'cover',
        [KEYS.statsFontSize]: 14,
        [KEYS.statsFontColor]: '#333333',
        [KEYS.sizeFontSize]: 16,
        [KEYS.sizeFontColor]: '#333333',
        [KEYS.relativeTimeFontSize]: 16,
        [KEYS.relativeTimeFontColor]: '#888888',
        [KEYS.absoluteTimeFontSize]: 12,
        [KEYS.absoluteTimeFontColor]: '#AAAAAA',
        [KEYS.actionButtonScale]: 1.2,
        [KEYS.largeTorrentThreshold]: 20,
        [KEYS.contentWidthMode]: 'max-width',
        [KEYS.contentMaxWidthValue]: '1400px',
        [KEYS.contentFixedViewWidthValue]: '1200px',
        [KEYS.contentMaxWidthMarginLeft]: 'auto',
        [KEYS.contentFixedViewWidthMarginLeft]: 'auto',
        [KEYS.settingsVisible]: false,
        [KEYS.showStatsOnNewLine]: false,
        [KEYS.timeGapPx]: 4,
        [KEYS.statsPosition]: 'left',
        [KEYS.timeLayout]: 'inline',
        [KEYS.relativeTimePrefix]: '发布于 ',
        [KEYS.usePreciseRelativeTime]: false,
        [KEYS.lastRunVersion]: '0',
        [KEYS.showCounter]: true,
        [KEYS.refreshDelay]: 500,
        [KEYS.language]: 'zh-TW',
        [KEYS.downloadInNewTab]: false,
    };

    // --- 多語言支持 ---
    const translations = {
        'zh-TW': {
            'scriptSettings': '腳本設置',
            'displayMode': '顯示模式:',
            'enableCardGrid': '啟用卡片網格佈局',
            'coverSize': '封面大小:',
            'tagPosition': '標籤位置:',
            'tagPosCover': '封面左上角',
            'tagPosTitle': '標題前方',
            'sizeFont': '體積字體大小:',
            'statsFont': '信息字體大小:',
            'relativeTimeFont': '相對時間字體:',
            'absoluteTimeFont': '絕對時間字體:',
            'buttonSize': '操作按鈕大小:',
            'largeTorrentThreshold': '大種子閾值:',
            'timeGap': '時間間隔:',
            'dataDisplay': '數據顯示:',
            'statsOnNewLine': '體積與數據分行顯示',
            'statsPosition': '上/下載數位置:',
            'posLeft': '左側',
            'posRight': '右側',
            'timeLayout': '時間佈局:',
            'layoutInline': '同行顯示',
            'layoutNewline': '換行顯示',
            'timePrefix': '時間前綴:',
            'timeCalculation': '時間計算:',
            'preciseTime': '精確到天 (如: 10 天前)',
            'contentLayout': '內容區佈局:',
            'layoutMaxWidth': '最大寬度',
            'layoutFixedWidth': '固定寬度',
            'contentMargin': '向右移動距離:',
            'layoutWarning': '提示：若種子排版異常或未佔滿空間，請調整此處的佈局與寬度值。例如向右移动距离在固定宽度的模式下一般为-300px,注意负号和px单位都是必需的',
            'refreshDelay': '刷新延遲:',
            'downloadSettings': '下載設置:',
            'downloadInNewTab': '攔截API並在新分頁下載',
            'showCounter': '顯示計數器:',
            'enableCounter': '在頁腳顯示腳本使用次數統計',
            'language': '語言 (Language):',
            'projectHomepage': '項目主頁:',
            'versionInfo': '版本資訊:',
            'updateAvailable': '發現新版本!',
            'resetAllSettings': '重置全部設置',
            'resetConfirmation': '您確定要重置所有腳本設置嗎？此操作將恢復所有默認值並刷新頁面。',
            'downloadProgress': '下載進度'
        },
        'zh-CN': {
            'scriptSettings': '脚本设置',
            'displayMode': '显示模式:',
            'enableCardGrid': '启用卡片网格布局',
            'coverSize': '封面大小:',
            'tagPosition': '标签位置:',
            'tagPosCover': '封面左上角',
            'tagPosTitle': '标题前方',
            'sizeFont': '体积字体大小:',
            'statsFont': '信息字体大小:',
            'relativeTimeFont': '相对时间字体:',
            'absoluteTimeFont': '绝对时间字体:',
            'buttonSize': '操作按钮大小:',
            'largeTorrentThreshold': '大种子阈值:',
            'timeGap': '时间间隔:',
            'dataDisplay': '数据显示:',
            'statsOnNewLine': '体积与数据分行显示',
            'statsPosition': '上/下载数位置:',
            'posLeft': '左侧',
            'posRight': '右侧',
            'timeLayout': '时间布局:',
            'layoutInline': '同行显示',
            'layoutNewline': '换行显示',
            'timePrefix': '时间前缀:',
            'timeCalculation': '时间计算:',
            'preciseTime': '精确到天 (如: 10 天前)',
            'contentLayout': '内容区布局:',
            'layoutMaxWidth': '最大宽度',
            'layoutFixedWidth': '固定宽度',
            'contentMargin': '向右移动距离:',
            'layoutWarning': '提示：若种子排版异常或未占满空间，请调整此处的布局与宽度值。例如向右移动距离在固定宽度的模式下一般为-300px,注意负号和px单位都是必需的',
            'refreshDelay': '刷新延迟:',
            'downloadSettings': '下载设置:',
            'downloadInNewTab': '拦截API并在新分页下载',
            'showCounter': '显示计数器:',
            'enableCounter': '在页脚显示脚本使用次数统计',
            'language': '语言 (Language):',
            'projectHomepage': '项目主页:',
            'versionInfo': '版本信息:',
            'updateAvailable': '发现新版本!',
            'resetAllSettings': '重置全部设置',
            'resetConfirmation': '您确定要重置所有脚本设置吗？此操作将恢复所有默认值并刷新页面。',
            'downloadProgress': '下载进度'
        },
        'en': {
            'scriptSettings': 'Script Settings',
            'displayMode': 'Display Mode:',
            'enableCardGrid': 'Enable Card Grid Layout',
            'coverSize': 'Cover Size:',
            'tagPosition': 'Tag Position:',
            'tagPosCover': 'Top-left of cover',
            'tagPosTitle': 'Before title',
            'sizeFont': 'Size Font Size:',
            'statsFont': 'Stats Font Size:',
            'relativeTimeFont': 'Relative Time Font:',
            'absoluteTimeFont': 'Absolute Time Font:',
            'buttonSize': 'Action Button Size:',
            'largeTorrentThreshold': 'Large Torrent Threshold:',
            'timeGap': 'Time Spacing:',
            'dataDisplay': 'Data Display:',
            'statsOnNewLine': 'Show size and stats on new lines',
            'statsPosition': 'Up/Down Stats Position:',
            'posLeft': 'Left',
            'posRight': 'Right',
            'timeLayout': 'Time Layout:',
            'layoutInline': 'Inline',
            'layoutNewline': 'Newline',
            'timePrefix': 'Time Prefix:',
            'timeCalculation': 'Time Calculation:',
            'preciseTime': 'Precise to day (e.g., 10 days ago)',
            'contentLayout': 'Content Area Layout:',
            'layoutMaxWidth': 'Max Width',
            'layoutFixedWidth': 'Fixed Width',
            'contentMargin': 'Move Right Distance:',
            'layoutWarning': 'Hint: If the layout is abnormal or doesn\'t fill the space, adjust layout and width values here.',
            'refreshDelay': 'Refresh Delay:',
            'downloadSettings': 'Download Settings:',
            'downloadInNewTab': 'Intercept API and download in new tab',
            'showCounter': 'Show Counter:',
            'enableCounter': 'Show script usage stats in footer',
            'language': 'Language (语言):',
            'projectHomepage': 'Project Homepage:',
            'versionInfo': 'Version Info:',
            'updateAvailable': 'Update Available!',
            'resetAllSettings': 'Reset All Settings',
            'resetConfirmation': 'Are you sure you want to reset all script settings? This will restore all defaults and reload the page.',
            'downloadProgress': 'Download Progress'
        }
    };

    // --- 從本地存儲加載用戶偏好 ---
    const settings = {};
    for (const key in KEYS) {
        settings[key] = GM_getValue(STORAGE_PREFIX + KEYS[key], DEFAULTS[key]);
    }

    const ORIGINAL_IMAGE_BASE_DIMENSION = 60;
    const CARD_ASPECT_RATIO = '16 / 9';

    // --- 攔截網絡請求 ---
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        const url = (typeof args[0] === 'string') ? args[0] : args[0].url;

        if (settings.downloadInNewTab && url && url.includes('/api/torrent/genDlToken')) {
            return new Promise((resolve, reject) => {
                originalFetch.apply(this, args).then(response => {
                    if (response.ok) {
                        response.clone().json().then(data => {
                            if (data && data.code === "0" && data.data) {
                                console.log('M-Team Pro: 攔截到下載連結，正在新分頁中打開:', data.data);
                                window.open(data.data, '_blank');
                            }
                        }).catch(e => console.error('M-Team Pro: 解析下載令牌JSON時出錯。', e));
                    }
                    resolve(new Response(null, { status: 204, statusText: "No Content" }));
                }).catch(err => {
                    console.error("M-Team Pro: Fetch攔截失敗:", err);
                    reject(err);
                });
            });
        }
        return originalFetch.apply(this, args);
    };


    function t(key) {
        return translations[settings.language]?.[key] || translations['en'][key];
    }

    function applyUserPreferences() {
        if (settings.cardLayout) {
            transformToCardLayout();
        } else {
            revertToTableLayout();
        }
        applyContentWidth();
        manageMainCounter();
    }

    // ===================================================================
    //  佈局轉換核心函數
    // ===================================================================

    function transformToCardLayout() {
        const table = document.querySelector('table.w-full.table-fixed');
        if (!table) return;
        table.style.display = 'none';

        let cardContainer = document.getElementById('tm-card-container');
        if (!cardContainer) {
            cardContainer = document.createElement('div');
            cardContainer.id = 'tm-card-container';
            table.parentNode.insertBefore(cardContainer, table);
        }

        const baseCardWidth = ORIGINAL_IMAGE_BASE_DIMENSION * settings.scale * 2.5;
        cardContainer.style.cssText = `
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(${Math.max(baseCardWidth, 280)}px, 1fr));
            gap: 20px;
        `;
        cardContainer.innerHTML = '';

        const rows = table.querySelectorAll('tbody > tr');
        rows.forEach(row => {
            const card = createCardFromRow(row);
            if (card) cardContainer.appendChild(card);
        });
    }

    function calculateRelativeTime(dateString) {
        if (!dateString) return '';
        const pastDate = new Date(dateString);
        if (isNaN(pastDate.getTime())) return '';
        const now = new Date();
        const diffMs = now - pastDate;
        const diffSeconds = Math.floor(diffMs / 1000);
        const diffMinutes = Math.floor(diffSeconds / 60);
        const diffHours = Math.floor(diffMinutes / 60);
        const diffDays = Math.floor(diffHours / 24);
        if (diffDays > 0) return `${diffDays} 天前`;
        if (diffHours > 0) return `${diffHours} 小時前`;
        if (diffMinutes > 0) return `${diffMinutes} 分鐘前`;
        return '剛剛';
    }

    function createCardFromRow(row) {
        const imageEl = row.querySelector('img.torrent-list__thumbnail');
        const titleLink = row.querySelector('a[href^="/detail/"]');
        if (!titleLink) return null;

        const detailUrl = titleLink.href;
        const torrentIdMatch = detailUrl.match(/\/detail\/(\d+)/);
        const torrentId = torrentIdMatch ? torrentIdMatch[1] : null;

        const titleText = titleLink.querySelector('strong')?.textContent.trim() || '';
        const subtitleEl = row.querySelector('span.ant-typography.ant-typography-ellipsis.ant-typography-ellipsis-single-line.text-\\[\\#464646\\]');
        const subtitleText = subtitleEl ? subtitleEl.textContent.trim() : '';
        const titleContainer = titleLink.parentNode;
        const allTags = Array.from(titleContainer.querySelectorAll('.ant-tag, img.box_img'));
        const categoryTag = titleContainer.querySelector('a[href*="?cat="] > .ant-tag');
        const otherTags = allTags.filter(tag => tag !== categoryTag);
        const comments = row.cells[1]?.textContent.trim();
        const timeEl = row.cells[2]?.querySelector('span');
        const originalRelativeTime = timeEl ? timeEl.textContent.trim() : '';
        const absoluteTime = timeEl ? timeEl.getAttribute('title') || '' : '';
        const size = row.cells[3]?.textContent.trim();
        const seeders = row.cells[4]?.textContent.trim();
        const leechers = row.cells[5]?.textContent.trim();
        const actionsCell = row.cells[6];
        const originalStarButton = actionsCell?.querySelector('button:has([aria-label="star"])');
        const originalDownloadButton = actionsCell?.querySelector('button:has(svg path[d*="M8 11.575C7.86667 11.575 7.74167 11.554 7.625 11.512C7.50833 11.4707 7.4 11.4 7.3 11.3L3.7 7.7C3.51667 7.51667 3.425 7.28333 3.425 7C3.425 6.71667 3.51667 6.48333 3.7 6.3C3.88333 6.11667 4.12067 6.02067 4.412 6.012C4.704 6.004 4.94167 6.09167 5.125 6.275L7 8.15V1C7 0.716667 7.096 0.479 7.288 0.287C7.47933 0.0956668 7.71667 0 8 0C8.28333 0 8.521 0.0956668 8.713 0.287C8.90433 0.479 9 0.716667 9 1V8.15L10.875 6.275C11.0583 6.09167 11.296 6.004 11.588 6.012C11.8793 6.02067 12.1167 6.11667 12.3 6.3C12.4833 6.48333 12.575 6.71667 12.575 7C12.575 7.28333 12.4833 7.51667 12.3 7.7L8.7 11.3C8.6 11.4 8.49167 11.4707 8.375 11.512C8.25833 11.554 8.13333 11.575 8 11.575ZM2 16C1.45 16 0.979333 15.8043 0.588 15.413C0.196 15.021 0 14.55 0 14V12C0 11.7167 0.0956668 11.479 0.287 11.287C0.479 11.0957 0.716667 11 1 11C1.28333 11 1.521 11.0957 1.713 11.287C1.90433 11.479 2 11.7167 2 12V14H14V12C14 11.7167 14.096 11.479 14.288 11.287C14.4793 11.0957 14.7167 11 15 11C15.2833 11 15.5207 11.0957 15.712 11.287C15.904 11.479 16 11.7167 16 12V14C16 14.55 15.8043 15.021 15.413 15.413C15.021 15.8043 14.55 16 14 16H2Z"])');
        const progressEl = row.cells[0]?.querySelector('.ant-progress');

        let isFreeTorrent = false;
        const freeKeywords = ['free', '免費'];
        for (const tag of otherTags) {
            const tagText = tag.textContent.toLowerCase();
            if (freeKeywords.some(keyword => tagText.includes(keyword))) {
                isFreeTorrent = true;
                break;
            }
        }

        const card = document.createElement('div');
        card.className = 'tm-torrent-card';
        const defaultBorder = '#f0f0f0';
        const defaultShadow = '0 2px 8px rgba(0,0,0,0.09)';
        const defaultHoverShadow = '0 4px 12px rgba(0,0,0,0.12)';
        const freeGreen = '#28a745';
        const freeGreenBorder = `1px solid ${freeGreen}`;
        const freeGreenShadow = `0 2px 8px rgba(40, 167, 69, 0.2)`;
        const freeGreenHoverShadow = `0 4px 12px rgba(40, 167, 69, 0.3)`;

        card.style.cssText = `
            display: flex; flex-direction: column; background: #fff; border-radius: 8px; overflow: hidden;
            box-shadow: ${isFreeTorrent ? freeGreenShadow : defaultShadow};
            border: ${isFreeTorrent ? freeGreenBorder : `1px solid ${defaultBorder}`};
            transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease; height: 100%;
        `;

        const imageWrapper = document.createElement('div');
        const imageAspectRatio = parseFloat(CARD_ASPECT_RATIO.split('/')[0]) / parseFloat(CARD_ASPECT_RATIO.split('/')[1]);
        imageWrapper.style.cssText = `position: relative; width: 100%; padding-top: ${100 / imageAspectRatio}%; overflow: hidden; background-color: #f0f2f5; cursor: pointer;`;

        if (imageEl) {
            const newImg = imageEl.cloneNode(true);
            newImg.style.cssText = `position: absolute; top: 0; left: 0; width: 100%; height: 100%; object-fit: cover; object-position: center; transition: transform 0.3s ease;`;
            imageWrapper.appendChild(newImg);
            card.onmouseover = () => {
                newImg.style.transform = 'scale(1.05)';
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = isFreeTorrent ? freeGreenHoverShadow : defaultHoverShadow;
                if (!isFreeTorrent) card.style.borderColor = '#d9d9d9';
            };
            card.onmouseout = () => {
                newImg.style.transform = 'scale(1)';
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = isFreeTorrent ? freeGreenShadow : defaultShadow;
                card.style.borderColor = isFreeTorrent ? freeGreen : defaultBorder;
            };
            imageWrapper.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); createLightbox(newImg.src); });
        } else {
             imageWrapper.textContent = "無圖片";
             imageWrapper.style.cssText += 'display: flex; align-items: center; justify-content: center; color: #ccc;';
             card.onmouseover = () => {
                card.style.transform = 'translateY(-5px)';
                card.style.boxShadow = isFreeTorrent ? freeGreenHoverShadow : defaultHoverShadow;
                if (!isFreeTorrent) card.style.borderColor = '#d9d9d9';
            };
            card.onmouseout = () => {
                card.style.transform = 'translateY(0)';
                card.style.boxShadow = isFreeTorrent ? freeGreenShadow : defaultShadow;
                card.style.borderColor = isFreeTorrent ? freeGreen : defaultBorder;
            };
        }

        if (settings.tagPosition === 'cover' && otherTags.length > 0) {
            const tagsOverlay = document.createElement('div');
            tagsOverlay.style.cssText = `position: absolute; top: 8px; left: 8px; display: flex; flex-wrap: wrap; gap: 4px; z-index: 1;`;
            otherTags.forEach(tag => tagsOverlay.appendChild(tag.cloneNode(true)));
            imageWrapper.appendChild(tagsOverlay);
        }
        if (comments && comments !== '0') {
             const commentsOverlay = document.createElement('div');
             commentsOverlay.style.cssText = `position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.6); color: white; padding: 2px 6px; border-radius: 4px; font-size: 12px; display: inline-flex; align-items: center; gap: 4px; z-index: 1;`;
             commentsOverlay.innerHTML = `<svg viewBox="0 0 20 20" fill="currentColor" width="1em" height="1em"><path d="M18.6667 3.66667C18.6667 2.75 17.9167 2 17 2H3.66667C2.75 2 2 2.75 2 3.66667V13.6667C2 14.5833 2.75 15.3333 3.66667 15.3333H15.3333L18.6667 18.6667V3.66667Z"></path></svg> ${comments}`;
             imageWrapper.appendChild(commentsOverlay);
        }

        const mainClickableArea = document.createElement('a');
        mainClickableArea.href = titleLink.href;
        mainClickableArea.target = '_blank';
        mainClickableArea.style.cssText = 'text-decoration: none; color: inherit;';
        mainClickableArea.appendChild(imageWrapper);

        const contentWrapper = document.createElement('div');
        contentWrapper.style.cssText = `padding: 12px; display: flex; flex-direction: column; flex-grow: 1;`;

        const titleWrapper = document.createElement('div');
        if (settings.tagPosition === 'title' && otherTags.length > 0) {
             const tagsInline = document.createElement('span');
             tagsInline.style.marginRight = '8px';
             otherTags.forEach(tag => tagsInline.appendChild(tag.cloneNode(true)));
             titleWrapper.appendChild(tagsInline);
        }
        const titleEl = document.createElement('h3');
        titleEl.textContent = titleText;
        titleEl.style.cssText = `font-size: 16px; font-weight: 600; margin: 0 0 4px; color: #333; line-height: 1.4; max-height: 2.8em; overflow: hidden; text-overflow: ellipsis; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical;`;
        if (settings.tagPosition === 'title') titleEl.style.display = 'inline';
        titleWrapper.appendChild(titleEl);

        const subtitleElProcessed = document.createElement('p');
        subtitleElProcessed.textContent = subtitleText;
        subtitleElProcessed.style.cssText = `font-size: 13px; color: #666; margin: 4px 0 10px; flex-grow: 1; line-height: 1.4; max-height: 4.2em; overflow: hidden;`;
        contentWrapper.appendChild(titleWrapper);

        if (categoryTag) {
             const clonedCategoryTag = categoryTag.cloneNode(true);
             clonedCategoryTag.style.marginTop = '4px';
             contentWrapper.appendChild(clonedCategoryTag);
        }
        contentWrapper.appendChild(subtitleElProcessed);

        if (progressEl) {
            const clonedProgressEl = progressEl.cloneNode(true);
            if (clonedProgressEl.querySelector('.ant-progress-text')) clonedProgressEl.querySelector('.ant-progress-text').remove();
            const percent = progressEl.getAttribute('aria-valuenow');
            if (percent) {
                const customProgressBarWrapper = document.createElement('div');
                customProgressBarWrapper.style.cssText = `display: flex; flex-direction: column; gap: 4px; margin-top: 10px; width: 100%; box-sizing: border-box;`;
                const customProgressLabel = document.createElement('div');
                customProgressLabel.textContent = `${t('downloadProgress')}: ${percent}%`;
                customProgressLabel.style.cssText = `font-size: 12px; color: #666; text-align: left; padding-left: 2px;`;
                customProgressBarWrapper.appendChild(customProgressLabel);
                clonedProgressEl.style.cssText = `position: relative; width: 100%; height: 5px; margin-bottom: 0;`;
                const innerProgress = clonedProgressEl.querySelector('.ant-progress-inner');
                if(innerProgress) innerProgress.style.height = '5px';
                const progressBg = clonedProgressEl.querySelector('.ant-progress-bg');
                if(progressBg) progressBg.style.height = '5px';
                customProgressBarWrapper.appendChild(clonedProgressEl);
                contentWrapper.appendChild(customProgressBarWrapper);
            }
        }
        mainClickableArea.appendChild(contentWrapper);

        const footer = document.createElement('div');
        footer.style.cssText = `display: flex; justify-content: space-between; align-items: flex-end; padding: 0 12px 10px; border-top: 1px solid #f0f0f0; padding-top: 10px; margin-top: auto;`;

        const leftSide = document.createElement('div');
        leftSide.style.cssText = 'display: flex; flex-direction: column; gap: 4px; align-items: flex-start; flex-grow: 1; min-width: 0;';

        const rightSide = document.createElement('div');
        rightSide.style.cssText = 'display: flex; flex-direction: column; align-items: flex-end; gap: 4px; flex-shrink: 0; padding-left: 10px;';

        const sizeInGB = parseSizeToGB(size);
        const sizeColor = sizeInGB >= settings.largeTorrentThreshold ? 'red' : settings.sizeFontColor;
        const sizeContainer = document.createElement('div');
        sizeContainer.style.cssText = `display: flex; align-items: center; gap: 4px; font-size: ${settings.sizeFontSize}px; color: ${sizeColor}; font-weight: 500;`;
        sizeContainer.innerHTML = `<svg width="1em" height="1em" viewBox="0 0 21 20" fill="currentColor"><path d="M13.7917 2.99167C13.475 2.675 13.05 2.5 12.6084 2.5H4.96672C4.05005 2.5 3.30838 3.25 3.30838 4.16667L3.30005 15.8333C3.30005 16.75 4.04172 17.5 4.95838 17.5H16.6334C17.55 17.5 18.3 16.75 18.3 15.8333V8.19167C18.3 7.75 18.125 7.325 17.8084 7.01667L13.7917 2.99167ZM12.4667 7.5V3.75L17.05 8.33333H13.3C12.8417 8.33333 12.4667 7.95833 12.4667 7.5Z"></path></svg><span>${size}</span>`;

        const otherStatsContainer = document.createElement('div');
        otherStatsContainer.style.cssText = `display: flex; align-items: center; gap: 12px; font-size: ${settings.statsFontSize}px; color: ${settings.statsFontColor}; font-weight: 500;`;
        otherStatsContainer.innerHTML = `
            <div style="display: flex; align-items: center; gap: 4px;" title="做種數"><svg width="0.9em" height="0.9em" viewBox="0 0 8 6" fill="#00BA1B"><path d="M0.296477 3.58611L2.88648 0.996113C3.27648 0.606113 3.90648 0.606113 4.29648 0.996113L6.88648 3.58611C7.51648 4.21611 7.06648 5.29611 6.17648 5.29611H0.996477C0.106477 5.29611 -0.333523 4.21611 0.296477 3.58611Z"></path></svg><span>${seeders}</span></div>
            <div style="display: flex; align-items: center; gap: 4px;" title="下載數"><svg width="0.9em" height="0.9em" viewBox="0 0 8 6" fill="#FE2C55"><path d="M7.06436 2.41389L4.47436 5.00389C4.08436 5.39389 3.45436 5.39389 3.06436 5.00389L0.474362 2.41389C-0.155638 1.78389 0.294363 0.703887 1.18436 0.703887L6.36436 0.703887C7.25436 0.703887 7.69436 1.78389 7.06436 2.41389Z"></path></svg><span>${leechers}</span></div>`;
        if (settings.showStatsOnNewLine) {
            leftSide.appendChild(sizeContainer);
            if (settings.statsPosition === 'left') leftSide.appendChild(otherStatsContainer);
        } else {
            const combinedStatsRow = document.createElement('div');
            combinedStatsRow.style.cssText = `display: flex; align-items: center; gap: 12px; flex-wrap: wrap;`;
            combinedStatsRow.appendChild(sizeContainer);
            if (settings.statsPosition === 'left') combinedStatsRow.appendChild(otherStatsContainer);
            leftSide.appendChild(combinedStatsRow);
        }

        let finalRelativeTime = settings.usePreciseRelativeTime ? (calculateRelativeTime(absoluteTime) || originalRelativeTime) : originalRelativeTime;
        const timeRow = document.createElement('div');
        if (settings.timeLayout === 'newline') timeRow.style.cssText = 'display: flex; flex-direction: column; align-items: flex-start;';
        const relativeTimeSpan = document.createElement('span');
        relativeTimeSpan.textContent = (settings.relativeTimePrefix || '') + finalRelativeTime;
        relativeTimeSpan.style.cssText = `font-size: ${settings.relativeTimeFontSize}px; color: ${settings.relativeTimeFontColor};`;
        timeRow.appendChild(relativeTimeSpan);

        if (absoluteTime) {
            const absoluteTimeSpan = document.createElement('span');
            absoluteTimeSpan.textContent = `(${absoluteTime})`;
            absoluteTimeSpan.style.cssText = `font-size: ${settings.absoluteTimeFontSize}px; color: ${settings.absoluteTimeFontColor};`;
            if (settings.timeLayout === 'inline') absoluteTimeSpan.style.marginLeft = `${settings.timeGapPx}px`;
            timeRow.appendChild(absoluteTimeSpan);
        }
        leftSide.appendChild(timeRow);

        const actionsWrapper = document.createElement('div');
        actionsWrapper.style.cssText = 'display: flex; align-items: center; gap: 5px;';
        if (originalDownloadButton) {
            const clonedDownloadBtn = originalDownloadButton.cloneNode(true);
            clonedDownloadBtn.style.transform = `scale(${settings.actionButtonScale})`;
            clonedDownloadBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); originalDownloadButton.click(); });
            actionsWrapper.appendChild(clonedDownloadBtn);
        }
        if (originalStarButton) {
            const clonedStarBtn = originalStarButton.cloneNode(true);
            clonedStarBtn.style.transform = `scale(${settings.actionButtonScale})`;
            clonedStarBtn.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); originalStarButton.click(); });
            const starSvg = originalStarButton.querySelector('svg');
            const clonedSvg = clonedStarBtn.querySelector('svg');
            if (starSvg && clonedSvg) {
                clonedSvg.style.color = starSvg.style.color;
                new MutationObserver(() => { clonedSvg.style.color = starSvg.style.color; }).observe(starSvg, { attributes: true, attributeFilter: ['style'] });
            }
            actionsWrapper.appendChild(clonedStarBtn);
        }

        if (settings.statsPosition === 'right') rightSide.appendChild(otherStatsContainer);
        rightSide.appendChild(actionsWrapper);

        footer.appendChild(leftSide);
        footer.appendChild(rightSide);
        card.appendChild(mainClickableArea);
        card.appendChild(footer);
        return card;
    }

    function revertToTableLayout() {
        const cardContainer = document.getElementById('tm-card-container');
        if (cardContainer) cardContainer.remove();
        const table = document.querySelector('table.w-full.table-fixed');
        if (table) table.style.display = 'table';
        document.querySelectorAll('img.torrent-list__thumbnail').forEach(img => {
            img.style.cssText = `width: ${ORIGINAL_IMAGE_BASE_DIMENSION}px; height: ${ORIGINAL_IMAGE_BASE_DIMENSION}px; object-fit: cover;`;
        });
    }

    // ===================================================================
    //  輔助函數
    // ===================================================================
    function applyContentWidth() {
        const innerContentArea = document.querySelector('div.app-content__inner > div.mx-auto.w-full');
        if (!innerContentArea) return;
        let widthToApply = '100%', maxWidthToApply = 'none', marginLeftToApply = 'auto';
        if (settings.contentWidthMode === 'max-width') {
            maxWidthToApply = settings.contentMaxWidthValue;
            marginLeftToApply = settings.contentMaxWidthMarginLeft;
        } else {
            widthToApply = settings.contentFixedViewWidthValue;
            marginLeftToApply = settings.contentFixedViewWidthMarginLeft;
        }
        innerContentArea.style.cssText = `max-width: ${maxWidthToApply}; width: ${widthToApply}; margin-left: ${marginLeftToApply}; margin-right: ${marginLeftToApply === 'auto' ? 'auto' : ''};`;
    }

    function createLightbox(src) {
        const lightbox = document.createElement('div');
        lightbox.style.cssText = `position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0,0,0,0.8); z-index: 10000; display: flex; align-items: center; justify-content: center; cursor: pointer;`;
        const img = document.createElement('img');
        img.src = src;
        img.style.cssText = `max-width: 90%; max-height: 90%; object-fit: contain; border-radius: 8px; box-shadow: 0 0 30px rgba(0,0,0,0.5);`;
        lightbox.appendChild(img);
        document.body.appendChild(lightbox);
        lightbox.addEventListener('click', () => lightbox.remove());
    }

    function parseSizeToGB(sizeStr) {
        if (!sizeStr) return 0;
        const sizeMatch = sizeStr.match(/([\d.]+)\s*(GB|TB)/i);
        if (!sizeMatch) return 0;
        let size = parseFloat(sizeMatch[1]);
        if (sizeMatch[2].toUpperCase() === 'TB') size *= 1024;
        return size;
    }

    function manageMainCounter() {
        let counterImg = document.getElementById('tm-main-counter');
        const footer = document.querySelector('div[style*="text-align: center; padding: 0px 0px 20px;"]');
        if (settings.showCounter) {
            if (!counterImg && footer) {
                counterImg = document.createElement('img');
                counterImg.id = 'tm-main-counter';
                counterImg.src = 'https://profile-counter.glitch.me/Sam5440_mteam_plugin/count.svg';
                counterImg.style.cssText = 'display: block; margin: 20px auto 0;';
                footer.appendChild(counterImg);
            }
            if(counterImg) counterImg.style.display = 'block';
        } else {
            if (counterImg) counterImg.style.display = 'none';
        }
    }

    // ===================================================================
    //  UI 和事件監聽
    // ===================================================================
    function createUI() {
        if (document.getElementById('tm-settings-wrapper')) return; // 如果UI已存在，則不重複創建

        // --- 創建懸浮設置按鈕和面板 ---
        const settingsWrapper = document.createElement('div');
        settingsWrapper.id = 'tm-settings-wrapper';
        settingsWrapper.style.cssText = 'position: fixed; top: 80px; right: 25px; z-index: 9999;';

        const settingsButton = document.createElement('button');
        settingsButton.style.cssText = `width: 44px; height: 44px; border-radius: 50%; background: rgba(240, 240, 240, 0.9); border: 1px solid rgba(0, 0, 0, 0.1); opacity: 0.5; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 24px; color: #333; transition: opacity 0.3s ease, box-shadow 0.3s ease, transform 0.3s ease; box-shadow: 0 2px 8px rgba(0,0,0,0.15); padding: 0;`;
        settingsButton.onmouseover = () => { settingsButton.style.opacity = '1'; settingsButton.style.transform = 'scale(1.1)'; settingsButton.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)'; };
        settingsButton.onmouseout = () => { settingsButton.style.opacity = '0.5'; settingsButton.style.transform = 'scale(1)'; settingsButton.style.boxShadow = '0 2px 8px rgba(0,0,0,0.15)'; };

        const settingsPanel = document.createElement('div');
        settingsPanel.id = 'tm-settings-panel';
        const toggleSettingsPanel = (e) => {
            if(e) e.preventDefault();
            const isVisible = settingsPanel.style.display === 'flex';
            settingsPanel.style.display = isVisible ? 'none' : 'flex';
            settings.settingsVisible = !isVisible;
            GM_setValue(STORAGE_PREFIX + KEYS.settingsVisible, settings.settingsVisible);
        };
        settingsButton.addEventListener('click', toggleSettingsPanel);
        settingsButton.innerHTML = `⚙️`;
        settingsPanel.style.cssText = `position: absolute; top: 110%; right: 0; background: #fff; border: 1px solid #ccc; border-radius: 8px; padding: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.15); z-index: 1000; display: ${settings.settingsVisible ? 'flex' : 'none'}; flex-direction: column; gap: 15px; width: 480px; max-height: 80vh; overflow-y: auto;`;

        // --- NEW: 在頂部導航欄新增設置按鈕 ---
        const navMenu = document.querySelector('ul.ant-menu-overflow.ant-menu-root');
        if (navMenu) {
            const menuItem = document.createElement('li');
            menuItem.className = 'ant-menu-overflow-item ant-menu-item ant-menu-item-only-child';
            menuItem.style.cssText = 'opacity: 1; order: 99;'; // 使用高 order 確保在末尾
            const contentSpan = document.createElement('span');
            contentSpan.className = 'ant-menu-title-content';
            const menuLink = document.createElement('a');
            menuLink.className = 'text-inherit';
            menuLink.href = '#';
            menuLink.innerHTML = `⚙️ ${t('scriptSettings')}`;
            menuLink.addEventListener('click', toggleSettingsPanel); // 綁定相同的切換函數
            contentSpan.appendChild(menuLink);
            menuItem.appendChild(contentSpan);
            navMenu.appendChild(menuItem);
        }

        // --- Panel Header ---
        const panelHeader = document.createElement('div');
        panelHeader.style.cssText = 'padding-bottom: 10px; border-bottom: 1px solid #eee; margin-bottom: 10px; text-align: center;';
        const homepageLink = document.createElement('a');
        homepageLink.href = 'https://github.com/Sam5440/mteam_next_beautification';
        homepageLink.target = '_blank';
        homepageLink.textContent = 'Sam5440/mteam_next_beautification';
        homepageLink.style.cssText = 'font-size: 14px; font-weight: bold; color: #1677ff; text-decoration: none;';
        const homepageLabel = document.createElement('label');
        homepageLabel.textContent = t('projectHomepage') + ' ';
        homepageLabel.style.cssText = 'font-size: 14px; color: #413D38;';
        const homepageWrapper = document.createElement('div');
        homepageWrapper.appendChild(homepageLabel);
        homepageWrapper.appendChild(homepageLink);
        panelHeader.appendChild(homepageWrapper);
        const versionDiv = document.createElement('div');
        versionDiv.style.cssText = 'font-size: 12px; color: #666; margin-top: 5px;';
        versionDiv.innerHTML = `<span>Current: v${SCRIPT_VERSION}</span> &nbsp;&nbsp; <span>Latest: <span id="tm-latest-version">${latestVersion}</span></span>`;
        panelHeader.appendChild(versionDiv);
        settingsPanel.appendChild(panelHeader);

        // --- Panel Body (使用工廠函數簡化代碼) ---
        const createSettingRow = (labelText, ...children) => {
            const wrapper = document.createElement('div');
            wrapper.style.cssText = 'display: flex; align-items: center;';
            const label = document.createElement('label');
            label.textContent = labelText;
            label.style.cssText = 'font-size: 14px; color: #413D38; margin-right: 8px; width: 120px; text-align: right; flex-shrink: 0;';
            wrapper.appendChild(label);
            children.forEach(child => wrapper.appendChild(child));
            return wrapper;
        };
        const commonInputStyle = 'border: 1px solid #d9d9d9; padding: 4px 8px; border-radius: 6px; font-size: 14px;';
        // ... (省略所有設置項的創建代碼，因為它們未改變)
        const langSelect = document.createElement('select');
        langSelect.style.cssText = commonInputStyle;
        Object.keys(translations).forEach(langCode => langSelect.add(new Option({ 'zh-TW': '繁體中文', 'zh-CN': '简体中文', 'en': 'English' }[langCode], langCode)));
        langSelect.value = settings.language;
        langSelect.addEventListener('change', e => { settings.language = e.target.value; GM_setValue(STORAGE_PREFIX + KEYS.language, settings.language); location.reload(); });
        settingsPanel.appendChild(createSettingRow(t('language'), langSelect));

        // ... (複製之前的創建設置項的代碼)
        const createNumberInput = (key, min, max, step, unit) => {
            const input = document.createElement('input'); input.type = 'number';
            if (min !== undefined) input.min = min; if (max !== undefined) input.max = max; if (step !== undefined) input.step = step;
            input.value = settings[key]; input.style.cssText = `${commonInputStyle} width: 60px;`;
            input.addEventListener('input', e => {
                const value = e.target.type === 'number' ? parseFloat(e.target.value) : e.target.value;
                settings[key] = value; GM_setValue(STORAGE_PREFIX + KEYS[key], value);
                if (key === KEYS.refreshDelay) { addForcedRefreshListeners(); } else { applyUserPreferences(); }
            });
            return unit ? [input, document.createTextNode(` ${unit}`)] : [input];
        };
        const createColorInput = (key) => {
            const input = document.createElement('input'); input.type = 'color'; input.value = settings[key];
            input.style.cssText = 'border: 1px solid #d9d9d9; padding: 0; border-radius: 6px; width: 30px; height: 26px; margin-left: 8px; cursor: pointer; background-color: transparent;';
            input.addEventListener('input', e => { settings[key] = e.target.value; GM_setValue(STORAGE_PREFIX + KEYS[key], e.target.value); applyUserPreferences(); });
            return input;
        };
        const createCheckbox = (key, labelText) => {
            const checkbox = document.createElement('input'); checkbox.type = 'checkbox'; checkbox.checked = settings[key];
            checkbox.addEventListener('change', e => { settings[key] = e.target.checked; GM_setValue(STORAGE_PREFIX + KEYS[key], e.target.checked); applyUserPreferences(); });
            return [checkbox, document.createTextNode(` ${labelText}`)];
        };
        const createSelect = (key, options) => {
            const select = document.createElement('select'); select.style.cssText = commonInputStyle;
            options.forEach(o => select.add(new Option(o.t, o.v))); select.value = settings[key];
            select.addEventListener('change', e => { settings[key] = e.target.value; GM_setValue(STORAGE_PREFIX + KEYS[key], e.target.value); applyUserPreferences(); });
            return select;
        };

        settingsPanel.appendChild(createSettingRow(t('displayMode'), ...createCheckbox('cardLayout', t('enableCardGrid'))));
        settingsPanel.appendChild(createSettingRow(t('coverSize'), createSelect('scale', [1, 1.5, 2, 2.5, 3, 3.5, 4].map(s => ({v: s, t: `${s}x`})))));
        settingsPanel.appendChild(createSettingRow(t('tagPosition'), createSelect('tagPosition', [{v: 'cover', t: t('tagPosCover')}, {v: 'title', t: t('tagPosTitle')}])));
        settingsPanel.appendChild(createSettingRow(t('sizeFont'), ...createNumberInput('sizeFontSize', 10, 24, 1, 'px'), createColorInput('sizeFontColor')));
        settingsPanel.appendChild(createSettingRow(t('statsFont'), ...createNumberInput('statsFontSize', 10, 20, 1, 'px'), createColorInput('statsFontColor')));
        settingsPanel.appendChild(createSettingRow(t('relativeTimeFont'), ...createNumberInput('relativeTimeFontSize', 10, 20, 1, 'px'), createColorInput('relativeTimeFontColor')));
        settingsPanel.appendChild(createSettingRow(t('absoluteTimeFont'), ...createNumberInput('absoluteTimeFontSize', 10, 20, 1, 'px'), createColorInput('absoluteTimeFontColor')));
        settingsPanel.appendChild(createSettingRow(t('buttonSize'), ...createNumberInput('actionButtonScale', 0.8, 2, 0.1, 'x')));
        settingsPanel.appendChild(createSettingRow(t('largeTorrentThreshold'), ...createNumberInput('largeTorrentThreshold', 1, 100, 1, 'GB')));
        settingsPanel.appendChild(createSettingRow(t('timeGap'), ...createNumberInput('timeGapPx', 0, 20, 1, 'px')));
        settingsPanel.appendChild(createSettingRow(t('dataDisplay'), ...createCheckbox('showStatsOnNewLine', t('statsOnNewLine'))));
        settingsPanel.appendChild(createSettingRow(t('statsPosition'), createSelect('statsPosition', [{v: 'left', t: t('posLeft')}, {v: 'right', t: t('posRight')}])));
        settingsPanel.appendChild(createSettingRow(t('timeLayout'), createSelect('timeLayout', [{v: 'inline', t: t('layoutInline')}, {v: 'newline', t: t('layoutNewline')}])));
        const prefixInput = document.createElement('input'); prefixInput.type = 'text'; prefixInput.value = settings.relativeTimePrefix; prefixInput.style.cssText = `${commonInputStyle} width: 100px;`;
        prefixInput.addEventListener('input', e => { settings.relativeTimePrefix = e.target.value; GM_setValue(STORAGE_PREFIX + KEYS.relativeTimePrefix, e.target.value); applyUserPreferences(); });
        settingsPanel.appendChild(createSettingRow(t('timePrefix'), prefixInput));
        settingsPanel.appendChild(createSettingRow(t('timeCalculation'), ...createCheckbox('usePreciseRelativeTime', t('preciseTime'))));
        const widthModeSelect = createSelect('contentWidthMode', [{v: 'max-width', t: t('layoutMaxWidth')}, {v: 'width', t: t('layoutFixedWidth')}]);
        const widthValueInput = document.createElement('input'); widthValueInput.type = 'text'; widthValueInput.style.cssText = `${commonInputStyle} width: 80px; margin: 0 10px;`;
        const marginLeftInput = document.createElement('input'); marginLeftInput.type = 'text'; marginLeftInput.style.cssText = `${commonInputStyle} width: 80px;`;
        const updateContentLayoutInputs = () => { widthValueInput.value = settings.contentWidthMode === 'max-width' ? settings.contentMaxWidthValue : settings.contentFixedViewWidthValue; marginLeftInput.value = settings.contentWidthMode === 'max-width' ? settings.contentMaxWidthMarginLeft : settings.contentFixedViewWidthMarginLeft; };
        updateContentLayoutInputs();
        widthModeSelect.addEventListener('change', e => { settings.contentWidthMode = e.target.value; GM_setValue(STORAGE_PREFIX + KEYS.contentWidthMode, e.target.value); updateContentLayoutInputs(); applyContentWidth(); });
        widthValueInput.addEventListener('input', () => { const key = settings.contentWidthMode === 'max-width' ? 'contentMaxWidthValue' : 'contentFixedViewWidthValue'; settings[key] = widthValueInput.value; GM_setValue(STORAGE_PREFIX + KEYS[key], widthValueInput.value); applyContentWidth(); });
        marginLeftInput.addEventListener('input', () => { const key = settings.contentWidthMode === 'max-width' ? 'contentMaxWidthMarginLeft' : 'contentFixedViewWidthMarginLeft'; settings[key] = marginLeftInput.value; GM_setValue(STORAGE_PREFIX + KEYS[key], marginLeftInput.value); applyContentWidth(); });
        settingsPanel.appendChild(createSettingRow(t('contentLayout'), widthModeSelect, widthValueInput));
        settingsPanel.appendChild(createSettingRow(t('contentMargin'), marginLeftInput));
        const layoutWarning = document.createElement('p'); layoutWarning.textContent = t('layoutWarning'); layoutWarning.style.cssText = 'color: red; font-size: 12px; margin: -5px auto 0 auto; max-width: 320px; text-align: center; padding: 0 10px;';
        settingsPanel.appendChild(layoutWarning);
        settingsPanel.appendChild(createSettingRow(t('refreshDelay'), ...createNumberInput('refreshDelay', 100, 2000, 50, 'ms')));
        settingsPanel.appendChild(createSettingRow(t('downloadSettings'), ...createCheckbox('downloadInNewTab', t('downloadInNewTab'))));
        const counterCheckboxRow = createCheckbox('showCounter', t('enableCounter'));
        counterCheckboxRow[0].addEventListener('change', e => { settings.showCounter = e.target.checked; GM_setValue(STORAGE_PREFIX + KEYS.showCounter, e.target.checked); manageMainCounter(); });
        settingsPanel.appendChild(createSettingRow(t('showCounter'), ...counterCheckboxRow));
        const settingsCounterImg = document.createElement('img');
        settingsCounterImg.src = 'https://profile-counter.glitch.me/Sam5440_mteam_plugin_set/count.svg';
        settingsCounterImg.style.cssText = 'display: block; margin: 10px auto 0;';
        settingsPanel.appendChild(settingsCounterImg);

        // --- Panel Footer ---
        const panelFooter = document.createElement('div');
        panelFooter.style.cssText = 'padding-top: 10px; border-top: 1px solid #eee; margin-top: 10px;';
        const resetButton = document.createElement('button');
        resetButton.textContent = t('resetAllSettings');
        resetButton.style.cssText = 'width: 100%; padding: 8px; border: 1px solid #ff4d4f; color: #ff4d4f; background-color: #fff2f0; border-radius: 6px; cursor: pointer; font-weight: bold; transition: background-color 0.3s;';
        resetButton.onmouseover = () => { resetButton.style.backgroundColor = '#ffccc7'; };
        resetButton.onmouseout = () => { resetButton.style.backgroundColor = '#fff2f0'; };
        resetButton.addEventListener('click', () => {
            if (confirm(t('resetConfirmation'))) {
                Object.values(KEYS).forEach(key => GM_deleteValue(STORAGE_PREFIX + key));
                alert('設置已重置，頁面將刷新。\nSettings have been reset, the page will now reload.');
                location.reload();
            }
        });
        panelFooter.appendChild(resetButton);
        settingsPanel.appendChild(panelFooter);

        settingsWrapper.appendChild(settingsButton);
        settingsWrapper.appendChild(settingsPanel);
        document.body.appendChild(settingsWrapper);
    }

    function checkForUpdates() {
        GM_xmlhttpRequest({
            method: 'GET',
            url: 'https://raw.githubusercontent.com/Sam5440/mteam_next_beautification/main/version',
            onload: function(response) {
                if (response.status === 200) {
                    const fetchedVersion = response.responseText.trim();
                    if(fetchedVersion) latestVersion = fetchedVersion;

                    if (latestVersion && latestVersion !== SCRIPT_VERSION) {
                        const versionDiv = document.querySelector('#tm-settings-panel div > div');
                        if(versionDiv && !document.getElementById('tm-update-indicator')) {
                             const updateIndicator = document.createElement('a');
                             updateIndicator.id = 'tm-update-indicator';
                             updateIndicator.href = 'https://github.com/Sam5440/mteam_next_beautification';
                             updateIndicator.target = '_blank';
                             updateIndicator.title = `點擊前往項目主頁查看更新\n(v${latestVersion} is available)`;
                             updateIndicator.textContent = ` ${t('updateAvailable')}`;
                             updateIndicator.style.cssText = 'color: red; font-weight: bold; text-decoration: none; animation: tm-blink 1.5s linear infinite; font-size: 12px;';
                             versionDiv.appendChild(updateIndicator);
                        }
                    }
                } else {
                    latestVersion = '檢查失敗';
                }
                const latestVersionSpan = document.getElementById('tm-latest-version');
                if (latestVersionSpan) latestVersionSpan.textContent = latestVersion;
            },
            onerror: function(error) {
                console.error('M-Team Pro: Update check failed.', error);
                latestVersion = '檢查失敗';
                const latestVersionSpan = document.getElementById('tm-latest-version');
                if (latestVersionSpan) latestVersionSpan.textContent = latestVersion;
            }
        });
    }

    // ===================================================================
    //  初始化與監聽器
    // ===================================================================
    function observeDOMChanges() {
        const table = document.querySelector('table.w-full.table-fixed');
        if (!table) return;
        const observerCallback = () => {
            setTimeout(applyUserPreferences, settings.refreshDelay);
        };
        const observer = new MutationObserver(observerCallback);
        const targetNode = table.querySelector('tbody') || table;
        observer.observe(targetNode, { childList: true });

        const advancedSearchPanel = document.querySelector('form.torrent-search-panel + div');
        if(advancedSearchPanel) {
            new MutationObserver((mutations) => {
                mutations.forEach(mutation => {
                    if (mutation.attributeName === 'class') {
                        setTimeout(applyUserPreferences, settings.refreshDelay);
                    }
                });
            }).observe(advancedSearchPanel, { attributes: true, attributeFilter: ['class'] });
        }
    }

    function addForcedRefreshListeners() {
        const forceRefresh = () => setTimeout(applyUserPreferences, settings.refreshDelay);
        document.body.addEventListener('click', (event) => {
            if (event.target.closest('.ant-input-search-button, .ant-pagination-item, .ant-pagination-prev, .ant-pagination-next, .ant-tag-checkable, .ant-select-item')) {
                forceRefresh();
            }
        }, true);
    }

    function init() {
        const styleSheet = document.createElement("style");
        styleSheet.type = "text/css";
        styleSheet.innerText = `@keyframes tm-blink { 50% { opacity: 0.5; } }`;
        document.head.appendChild(styleSheet);

        const lastVersion = GM_getValue(STORAGE_PREFIX + KEYS.lastRunVersion, '0');
        if (lastVersion !== SCRIPT_VERSION) {
            new Image().src = 'https://profile-counter.glitch.me/Sam5440_mteam_plugin_install_v1/count.svg';
            GM_setValue(STORAGE_PREFIX + KEYS.lastRunVersion, SCRIPT_VERSION);
        }

        const checkReady = setInterval(() => {
            if (document.querySelector('table.w-full.table-fixed tbody tr') && document.querySelector('ul.ant-menu-overflow.ant-menu-root')) {
                clearInterval(checkReady);
                createUI();
                checkForUpdates();
                applyUserPreferences();
                observeDOMChanges();
                addForcedRefreshListeners();
            }
        }, 100);
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
