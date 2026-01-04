// ==UserScript==
// @name E-Hentai Reader Assistant
// @name:en-US EX-Hentai Reader Assistant
// @name:zh-CN EX-Hentai 助手
// @name:ja-JP EX-Hentai リーダーアシスタント
// @namespace   EX-Hentai Reader Assistant
// @match       https://e-hentai.org/s/*
// @match       https://exhentai.org/s/*
// @grant       none
// @version     1.3
// @author      Assistant
// @description 🌟Add preloading to e-hentai. 🌟Add click zones (left=prev/right=next) to image sections. 🌟Load images without page reload. 🌟Support keyboard shortcuts. 🌟Support i18n.
// @description:en-US 🌟Add preloading to e-hentai. 🌟Add click zones (left=prev/right=next) to image sections. 🌟Load images without page reload. 🌟Support keyboard shortcuts. 🌟Support i18n.
// @description:zh-CN 🌟为 e 站添加预加载。🌟添加图片分区点击左边上一页,右边下一页。🌟让e站可以在不刷新的情况下加载图片。🌟支持键盘操作。🌟支持i18n。
// @description:ja-JP 🌟e-hentai にプリロードを追加。🌟画像セクションのクリックゾーン（左=前/右=次）を追加。🌟ページ遷移なしで画像を読み込む。🌟キーボード操作をサポート。🌟多言語対応。
// @run-at      document-start
// @license     CC-BY-NC-SA-4.0
// @noframes    true
// @downloadURL https://update.greasyfork.org/scripts/546179/E-Hentai%20Reader%20Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/546179/E-Hentai%20Reader%20Assistant.meta.js
// ==/UserScript==


(function() {
    'use strict';

    // 配置
    const CONFIG = {
        preloadCount: 3, // 预加载页面数量
        maxRetries: 3,   // 最大重试次数
        retryDelay: 100, // 重试延迟(ms)
        updateUrl: false, // 是否在不刷新情况下更新地址栏
        // 统一时间/延迟参数
        preloadStepDelay: 120, // 预加载步进小延迟(ms)
        imageTransitionMs: 210, // 图片切换过渡时长(ms)
        resizeThrottleMs: 100,  // 窗口重排节流(ms)
        hintAutoHideMs: 5000,   // 操作提示自动隐藏(ms)
        hintFadeMs: 1000,       // 操作提示淡出时长(ms)
        errorDurationMs: 3000,  // 错误提示显示时长(ms)
        messageDurationMs: 2000 // 普通消息显示时长(ms)
    };

    // 全局变量
    let currentPage = 1;
    let totalPages = 1;
    let imageCache = new Map(); // 图片缓存
    let pageDataCache = new Map(); // 页面数据缓存
    let pageUrlCache = new Map(); // 页码 -> 真实 URL（含 token）
    let isLoading = false;
    let fitMode = localStorage.getItem('ehx_fit_mode') || 'width'; // width | height

    // 新增：预加载状态跟踪
    let preloadStatus = new Map(); // 页码 -> 状态 ('waiting', 'loading', 'completed', 'failed')
    let pendingPreloadRender = false; // rAF 批处理标志
    let scriptEnabled = localStorage.getItem('ehx_script_enabled') !== 'false'; // 脚本开关
    let showPreloadStatus = localStorage.getItem('ehx_show_preload_status') !== 'false'; // 预加载状态显示开关
    let langSetting = localStorage.getItem('ehx_lang') || 'auto'; // 语言设置: auto | en | zh-CN | ja

    // 许可证
    const LICENSE = 'CC-BY-NC-SA-4.0';

    // 国际化字典
    const I18N = {
        'en': {
            fitWidth: 'Fit width',
            fitHeight: 'Fit height',
            settings: 'Settings',
            loading: 'Loading...',
            navHintTitle: 'Keyboard:',
            navHintLeft: '← / A: Prev page',
            navHintRight: '→ / D / Space: Next page',
            navHintClick: 'Click image: Left=Prev, Right=Next',
            menuTitle: 'E-Hentai Reader Settings',
            basicSettings: 'General',
            enableScript: 'Enable script',
            showPreloadStatus: 'Show preload status',
            updateUrl: 'Update address bar',
            preloadSettings: 'Preload',
            preloadCount: 'Preload pages',
            maxRetries: 'Max retries',
            retryDelayMs: 'Retry delay (ms)',
            cacheManagement: 'Cache',
            clearImageCache: 'Clear image cache',
            clearPageCache: 'Clear page cache',
            clearAllCache: 'Clear all cache',
            resetSettings: 'Reset settings',
            statusInfo: 'Status',
            cacheImageCount: 'Image cache',
            cachePageCount: 'Page cache',
            preloadStatus: 'Preload Status',
            close: 'Close',
            language: 'Language',
            lang_auto: 'Follow browser',
            lang_en: 'English',
            lang_zhCN: '简体中文',
            lang_ja: '日本語',
            confirmReset: 'Reset all settings?',
            msgScriptEnabled: 'Enabled. Please refresh the page.',
            msgScriptDisabled: 'Disabled.',
            msgSettingsSaved: 'Settings saved',
            msgImgCacheCleared: 'Image cache cleared',
            msgPageCacheCleared: 'Page cache cleared',
            msgAllCleared: 'All caches cleared',
            msgSettingsReset: 'Settings reset. Please refresh the page',
            loadFailed: 'Load failed, please retry',
            status_waiting: 'waiting',
            status_loading: 'loading',
            status_completed: 'completed',
            status_failed: 'failed',
            status_unknown: 'unknown',
        },
        'zh-CN': {
            fitWidth: '适应宽度',
            fitHeight: '适应高度',
            settings: '脚本设置',
            loading: '正在加载...',
            navHintTitle: '键盘操作:',
            navHintLeft: '← / A: 上一页',
            navHintRight: '→ / D / 空格: 下一页',
            navHintClick: '点击图片左半: 上一页，右半: 下一页',
            menuTitle: 'E-Hentai 助手设置',
            basicSettings: '基础设置',
            enableScript: '启用脚本',
            showPreloadStatus: '显示预加载状态',
            updateUrl: '地址栏同步',
            preloadSettings: '预加载设置',
            preloadCount: '预加载页数',
            maxRetries: '重试次数',
            retryDelayMs: '重试延迟(ms)',
            cacheManagement: '缓存管理',
            clearImageCache: '清除图片缓存',
            clearPageCache: '清除页面缓存',
            clearAllCache: '清除所有缓存',
            resetSettings: '重置设置',
            statusInfo: '状态信息',
            cacheImageCount: '图片缓存',
            cachePageCount: '页面缓存',
            preloadStatus: '预加载状态',
            close: '关闭',
            language: '语言',
            lang_auto: '自动',
            lang_en: 'English',
            lang_zhCN: '简体中文',
            lang_ja: '日本語',
            confirmReset: '确定要重置所有设置吗？',
            msgScriptEnabled: '脚本已启用，请刷新页面生效',
            msgScriptDisabled: '脚本已禁用',
            msgSettingsSaved: '设置已保存',
            msgImgCacheCleared: '图片缓存已清除',
            msgPageCacheCleared: '页面缓存已清除',
            msgAllCleared: '所有缓存已清除',
            msgSettingsReset: '设置已重置，请刷新页面',
            loadFailed: '加载失败，请重试',
            status_waiting: '等待',
            status_loading: '加载中',
            status_completed: '完成',
            status_failed: '失败',
            status_unknown: '未知',
        },
        'ja': {
            fitWidth: '幅に合わせる',
            fitHeight: '高さに合わせる',
            settings: '設定',
            loading: '読み込み中...',
            navHintTitle: 'キーボード:',
            navHintLeft: '← / A: 前のページ',
            navHintRight: '→ / D / Space: 次のページ',
            navHintClick: '画像クリック: 左=前, 右=次',
            menuTitle: 'E-Hentai リーダー設定',
            basicSettings: '基本設定',
            enableScript: 'スクリプトを有効',
            showPreloadStatus: 'プリロード状態を表示',
            updateUrl: 'アドレスバーを更新',
            preloadSettings: 'プリロード',
            preloadCount: 'プリロード枚数',
            maxRetries: '再試行回数',
            retryDelayMs: '再試行遅延(ms)',
            cacheManagement: 'キャッシュ',
            clearImageCache: '画像キャッシュを削除',
            clearPageCache: 'ページキャッシュを削除',
            clearAllCache: 'すべてのキャッシュを削除',
            resetSettings: '設定をリセット',
            statusInfo: 'ステータス',
            cacheImageCount: '画像キャッシュ',
            cachePageCount: 'ページキャッシュ',
            preloadStatus: 'プリロード状態',
            close: '閉じる',
            language: '言語',
            lang_auto: 'ブラウザに従う',
            lang_en: 'English',
            lang_zhCN: '简体中文',
            lang_ja: '日本語',
            confirmReset: 'すべての設定をリセットしますか？',
            msgScriptEnabled: '有効にしました。ページを更新してください。',
            msgScriptDisabled: '無効にしました。',
            msgSettingsSaved: '設定を保存しました',
            msgImgCacheCleared: '画像キャッシュを削除しました',
            msgPageCacheCleared: 'ページキャッシュを削除しました',
            msgAllCleared: 'すべてのキャッシュを削除しました',
            msgSettingsReset: '設定をリセットしました。ページを更新してください',
            loadFailed: '読み込みに失敗しました。再試行してください',
            status_waiting: '待機',
            status_loading: '読み込み中',
            status_completed: '完了',
            status_failed: '失敗',
            status_unknown: '不明',
        }
    };

    function resolveDefaultLang() {
        const n = (navigator.language || navigator.userLanguage || 'en').toLowerCase();
        if (n.startsWith('zh')) return 'zh-CN';
        if (n.startsWith('ja')) return 'ja';
        return 'en';
    }
    function getCurrentLang() {
        return langSetting === 'auto' ? resolveDefaultLang() : langSetting;
    }
    function t(key) {
        const lang = getCurrentLang();
        const dict = I18N[lang] || I18N['en'];
        return (dict && dict[key]) || I18N['en'][key] || key;
    }

    // 保持 document-start，但不在此阶段阻断事件，避免干扰后续绑定

    // 初始化
    function init() {
        // 添加样式（总是需要，包括菜单样式）
        addStyles();

        // 添加管理菜单
        addControlMenu();

        // 如果脚本被禁用，只显示菜单，不执行主要功能
        if (!scriptEnabled) {
            console.log('脚本已禁用，仅显示控制菜单');
            return;
        }

        // 解析当前页面信息
        parseCurrentPage();

        // 用当前 DOM 为当前页建立初始化数据（含 next/prev 实时 URL）
        seedCurrentPageData();

        // 绑定事件
        bindEvents();

        // 开始预加载
        startPreloading();

        // 添加加载指示器
        addLoadingIndicator();

        // 添加预加载状态显示
        if (showPreloadStatus) {
            addPreloadStatusDisplay();
        }
    }

    // 解析当前页面信息
    function parseCurrentPage() {
        const url = window.location.href;
        const match = url.match(/\/s\/([^\/]+)\/(\d+)-(\d+)/);

        if (match) {
            currentPage = parseInt(match[3]);
        }

        // 从 DOM 解析当前/总页
        const spans = document.querySelectorAll('.sn span');
        if (spans && spans.length >= 2) {
            const cur = parseInt(spans[0].textContent.trim());
            const tot = parseInt(spans[1].textContent.trim());
            if (!Number.isNaN(cur)) currentPage = cur;
            if (!Number.isNaN(tot)) totalPages = tot;
        }

        // 建立 URL 映射
        pageUrlCache.set(currentPage, window.location.href);
        const nextA = document.getElementById('next');
        const prevA = document.getElementById('prev');
        if (nextA && nextA.href) pageUrlCache.set(currentPage + 1, nextA.href);
        if (prevA && prevA.href) pageUrlCache.set(currentPage - 1, prevA.href);

        console.log(`当前页: ${currentPage}/${totalPages}`);
    }

    // 用当前 DOM 初始化当前页数据，确保实时 next/prev
    function seedCurrentPageData() {
        const img = document.getElementById('img');
        if (!img) return;
        const nextA = document.getElementById('next');
        const prevA = document.getElementById('prev');
        const imageData = {
            src: img.src,
            width: img.style.width,
            height: img.style.height,
            pageNum: currentPage,
            nextUrl: nextA && nextA.href ? nextA.href : undefined,
            prevUrl: prevA && prevA.href ? prevA.href : undefined,
        };
        pageDataCache.set(currentPage, imageData);
        if (imageData.nextUrl) pageUrlCache.set(currentPage + 1, imageData.nextUrl);
        if (imageData.prevUrl) pageUrlCache.set(currentPage - 1, imageData.prevUrl);
    }

    // 绑定事件
    function bindEvents() {
        const img = document.getElementById('img');
        const imgContainer = document.getElementById('i3');

        if (img && imgContainer) {
            // 用中性容器替换外层 <a>，彻底打断默认跳转与站内 onclick
            const link = imgContainer.querySelector('a');
            if (link && link.contains(img)) {
                const holder = document.createElement('div');
                holder.id = 'img-holder';
                holder.style.cursor = 'pointer';
                holder.style.display = 'inline-block';
                link.parentNode.replaceChild(holder, link);
                holder.appendChild(img);
                // 添加局部加载层
                const loader = document.createElement('div');
                loader.className = 'eh-img-loader';
                loader.innerHTML = '<div class="eh-spinner"></div>';
                holder.appendChild(loader);

                holder.addEventListener('click', function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    const rect = holder.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    if (x < rect.width / 2) {
                        goToPrevPage();
                    } else {
                        goToNextPage();
                    }
                }, { capture: true });
            }
        }

        // 在冒泡阶段拦截，并作为后备触发我们的逻辑
        document.addEventListener('click', function(e) {
            const target = e.target;
            if (!target) return;
            const inNext = target.closest('a#next');
            const inPrev = target.closest('a#prev');
            const inImgArea = target.closest('#i3');
            if (inNext) {
                e.preventDefault();
                e.stopPropagation();
                goToNextPage();
                return;
            }
            if (inPrev) {
                e.preventDefault();
                e.stopPropagation();
                goToPrevPage();
                return;
            }
            if (inImgArea) {
                e.preventDefault();
                e.stopPropagation();
                const rect = inImgArea.getBoundingClientRect();
                const x = e.clientX - rect.left;
                if (x < rect.width / 2) {
                    goToPrevPage();
                } else {
                    goToNextPage();
                }
                return;
            }
        }, false);

        // 绑定导航按钮
        bindNavigationButtons();

        // 绑定键盘事件（捕获阶段，阻止站点快捷键）
        document.addEventListener('keydown', handleKeyboard, true);
    }

    // 绑定导航按钮
    function bindNavigationButtons() {
        const prevBtn = document.getElementById('prev');
        const nextBtn = document.getElementById('next');

        if (prevBtn) {
            // 不再覆盖 href，保留真实链接，仅拦截点击
            prevBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                goToPrevPage();
            }, { capture: true });
        }

        if (nextBtn) {
            // 不再覆盖 href，保留真实链接，仅拦截点击
            nextBtn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                goToNextPage();
            }, { capture: true });
        }
    }

    // 键盘事件处理
    function handleKeyboard(e) {
        // 阻断站点注册的快捷键
        const code = e.code || e.key;
        if (!code) return;
        // 忽略按住不放产生的重复事件，避免一次按键翻多页
        if (e.repeat) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        if (isLoading) {
            e.preventDefault();
            e.stopPropagation();
            return;
        }
        if (code === 'ArrowLeft' || code === 'KeyA') {
            e.preventDefault();
            e.stopPropagation();
            goToPrevPage();
        } else if (code === 'ArrowRight' || code === 'KeyD' || code === 'Space') {
            e.preventDefault();
            e.stopPropagation();
            goToNextPage();
        }
    }

    // 跳转到下一页（优先使用当前页解析得到的 next 实时链接）
    async function goToNextPage() {
        if (isLoading || currentPage >= totalPages) return;

        setLoading(true);

        try {
            let nextPage = currentPage + 1;
            const curData = pageDataCache.get(currentPage);
            if (curData && curData.nextUrl) {
                const p = extractPageNum(curData.nextUrl);
                if (Number.isFinite(p)) nextPage = p;
                pageUrlCache.set(nextPage, curData.nextUrl);
            }

            const imageData = await getPageImage(nextPage);

            if (imageData) {
                updateImage(imageData);
                currentPage = nextPage;
                updatePageInfo();
                updateNavigationButtons();

                // 继续预加载
                preloadPages();

                // 更新状态显示
                updatePreloadStatusDisplay();
            }
        } catch (error) {
            console.error('加载下一页失败:', error);
            showError(t('loadFailed'));
        } finally {
            setLoading(false);
        }
    }

    // 跳转到上一页（优先使用当前页解析得到的 prev 实时链接）
    async function goToPrevPage() {
        if (isLoading || currentPage <= 1) return;

        setLoading(true);

        try {
            let prevPage = currentPage - 1;
            const curData = pageDataCache.get(currentPage);
            if (curData && curData.prevUrl) {
                const p = extractPageNum(curData.prevUrl);
                if (Number.isFinite(p)) prevPage = p;
                pageUrlCache.set(prevPage, curData.prevUrl);
            }

            const imageData = await getPageImage(prevPage);

            if (imageData) {
                updateImage(imageData);
                currentPage = prevPage;
                updatePageInfo();
                updateNavigationButtons();

                // 继续预加载（向前翻页后同样触发）
                preloadPages();

                // 更新状态显示
                updatePreloadStatusDisplay();
            }
        } catch (error) {
            console.error('加载上一页失败:', error);
            showError(t('loadFailed'));
        } finally {
            setLoading(false);
        }
    }

    // 获取指定页面的图片信息
    async function getPageImage(pageNum, retryCount = 0) {
        if (pageDataCache.has(pageNum)) {
            // 如果已缓存，更新状态为完成
            updatePreloadStatus(pageNum, 'completed');
            return pageDataCache.get(pageNum);
        }

        // 设置状态为加载中
        updatePreloadStatus(pageNum, 'loading');

        try {
            const url = getPageUrl(pageNum);
            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const html = await response.text();
            const parser = new DOMParser();
            const doc = parser.parseFromString(html, 'text/html');

            const img = doc.getElementById('img');
            if (!img) {
                throw new Error('未找到图片元素');
            }

            let imageData = {
                src: img.src,
                width: img.style.width,
                height: img.style.height,
                pageNum: pageNum
            };

            // 完善 URL 映射与总页数，并记录当前页的 prev/next 实时链接
            try {
                const nextA2 = doc.getElementById('next');
                const prevA2 = doc.getElementById('prev');
                if (nextA2 && nextA2.href) {
                    pageUrlCache.set(pageNum + 1, nextA2.href);
                    imageData.nextUrl = nextA2.href;
                }
                if (prevA2 && prevA2.href) {
                    pageUrlCache.set(pageNum - 1, prevA2.href);
                    imageData.prevUrl = prevA2.href;
                }
                const spans2 = doc.querySelectorAll('.sn span');
                if (spans2.length >= 2) {
                    const tot2 = parseInt(spans2[1].textContent.trim());
                    if (!Number.isNaN(tot2) && tot2 > totalPages) {
                        totalPages = tot2;
                        // 实时更新页面显示
                        setTimeout(updatePageInfo, 0);
                    }
                }
            } catch (_) {}

            // 缓存数据
            pageDataCache.set(pageNum, imageData);

            // 预加载图片
            preloadImage(imageData.src);

            // 更新状态为完成
            updatePreloadStatus(pageNum, 'completed');

            return imageData;

        } catch (error) {
            console.error(`获取页面 ${pageNum} 失败:`, error);

            if (retryCount < CONFIG.maxRetries) {
                console.log(`重试获取页面 ${pageNum} (${retryCount + 1}/${CONFIG.maxRetries})`);
                await new Promise(resolve => setTimeout(resolve, CONFIG.retryDelay));
                return getPageImage(pageNum, retryCount + 1);
            }

            // 更新状态为失败
            updatePreloadStatus(pageNum, 'failed');
            throw error;
        }
    }

    // 预加载图片
    function preloadImage(src) {
        if (imageCache.has(src)) return;

        const img = new Image();
        img.onload = () => {
            imageCache.set(src, img);
            console.log('图片预加载完成:', src);
        };
        img.onerror = () => {
            console.error('图片预加载失败:', src);
        };
        img.src = src;
    }

    // 获取页面URL
    function getPageUrl(pageNum) {
        if (pageUrlCache.has(pageNum)) return pageUrlCache.get(pageNum);

        // 临近页尝试使用 DOM 中的真实链接
        if (pageNum === currentPage + 1) {
            const nextA = document.getElementById('next');
            if (nextA && nextA.href) {
                pageUrlCache.set(pageNum, nextA.href);
                return nextA.href;
            }
        }
        if (pageNum === currentPage - 1) {
            const prevA = document.getElementById('prev');
            if (prevA && prevA.href) {
                pageUrlCache.set(pageNum, prevA.href);
                return prevA.href;
            }
        }

        // 回退：基于当前 URL 猜测（可能无效）
        const m = window.location.href.match(/^(.*-)(\d+)([^\d]*)$/);
        if (m) {
            const guess = `${m[1]}${pageNum}${m[3] || ''}`;
            return guess;
        }
        return window.location.href;
    }

    // 辅助：从链接中提取页码
    function extractPageNum(url) {
        const m = url && url.match(/\/s\/[^\/]+\/(\d+)-(\d+)/);
        if (m) return parseInt(m[2]);
        const m2 = url && url.match(/-(\d+)(?:[^\d]*)$/);
        return m2 ? parseInt(m2[1]) : NaN;
    }

    // 更新图片
    function updateImage(imageData) {
        const img = document.getElementById('img');
        if (img) {
            // 过渡开始：隐藏旧图，显示局部加载动画
            beginImageTransition();

            const applyNewSrc = () => {
                img.src = imageData.src;
                // 让 CSS 接管尺寸控制，避免因不同页的 inline 宽高导致布局跳变
                img.style.width = '';
                img.style.height = '';
                // 新图加载完成后淡入
                if (img.complete) {
                    endImageTransition();
                } else {
                    img.onload = () => endImageTransition();
                    img.onerror = () => endImageTransition(true);
                }
                // 更新图片信息
                updateImageInfo(imageData);
            };

            // 若已预加载，直接应用
            if (imageCache.has(imageData.src)) {
                const preImg = imageCache.get(imageData.src);
                if (preImg && preImg.complete) {
                    applyNewSrc();
                } else {
                    // 保险：等待预加载完成再应用
                    preImg.onload = () => applyNewSrc();
                    preImg.onerror = () => applyNewSrc();
                }
            } else {
                applyNewSrc();
            }
        }
    }

    // 更新图片信息
    function updateImageInfo(imageData) {
        const infoElements = document.querySelectorAll('#i2 > div:last-child, #i4 > div:first-child');

        // 从图片URL提取文件名和尺寸信息
        const urlParts = imageData.src.split('/');
        const filename = urlParts[urlParts.length - 1].split('?')[0];

        infoElements.forEach(element => {
            if (element.textContent.includes('::')) {
                // 保持原有格式，只更新文件名
                const parts = element.textContent.split('::');
                if (parts.length >= 2) {
                    element.textContent = `${filename} :: ${parts[1].trim()} :: ${parts[2] ? parts[2].trim() : ''}`;
                }
            }
        });
    }

    // 更新页面信息
    function updatePageInfo() {
        // 更新原页面的所有页码显示（顶部和底部）
        const pageSpans = document.querySelectorAll('.sn span');
        for (let i = 0; i < pageSpans.length; i += 2) {
            if (pageSpans[i]) {
                pageSpans[i].textContent = currentPage;
            }
            if (pageSpans[i + 1] && totalPages) {
                pageSpans[i + 1].textContent = totalPages;
            }
        }

        // 更新自定义工具条的页码显示
        const cur = document.getElementById('ehx-cur');
        const tot = document.getElementById('ehx-total');
        if (cur) cur.textContent = currentPage;
        if (tot && totalPages) tot.textContent = totalPages;

        // 是否更新浏览器地址栏（不刷新页面）
        if (CONFIG.updateUrl) {
            const newUrl = pageUrlCache.get(currentPage) || getPageUrl(currentPage);
            window.history.replaceState(null, '', newUrl);
        }
    }

    // 更新导航按钮状态
    function updateNavigationButtons() {
        // 更新原页面的导航按钮
        const prevBtn = document.getElementById('prev');
        const nextBtn = document.getElementById('next');

        if (prevBtn) {
            if (currentPage <= 1) {
                prevBtn.style.opacity = '0.5';
                prevBtn.style.cursor = 'not-allowed';
            } else {
                prevBtn.style.opacity = '1';
                prevBtn.style.cursor = 'pointer';
            }
        }

        if (nextBtn) {
            if (currentPage >= totalPages) {
                nextBtn.style.opacity = '0.5';
                nextBtn.style.cursor = 'not-allowed';
            } else {
                nextBtn.style.opacity = '1';
                nextBtn.style.cursor = 'pointer';
            }
        }
    }

    // 开始预加载
    function startPreloading() {
        preloadPages();
    }

    // 预加载页面
    async function preloadPages() {
        // 顺序向前预加载，以确保 token 链正确
        for (let step = 1; step <= CONFIG.preloadCount; step++) {
            const p = currentPage + step;
            if (p > totalPages) break;
            if (pageDataCache.has(p)) continue;

            // 设置等待状态
            updatePreloadStatus(p, 'waiting');

            try {
                // 小延迟避免阻塞
                // eslint-disable-next-line no-await-in-loop
                await new Promise(r => setTimeout(r, CONFIG.preloadStepDelay));
                // eslint-disable-next-line no-await-in-loop
                await getPageImage(p);
            } catch (e) {
                console.log(`预加载页面 ${p} 失败:`, e && e.message ? e.message : e);
                updatePreloadStatus(p, 'failed');
                break;
            }
        }
        // 回看一页
        const back = currentPage - 1;
        if (back >= 1 && !pageDataCache.has(back)) {
            updatePreloadStatus(back, 'waiting');
            getPageImage(back).catch(() => {
                updatePreloadStatus(back, 'failed');
            });
        }
    }

    // 设置加载状态
    function setLoading(loading) {
        isLoading = loading;
        const indicator = document.getElementById('loading-indicator');
        if (indicator) {
            indicator.style.display = loading ? 'block' : 'none';
        }

        // 禁用/启用导航按钮
        const buttons = document.querySelectorAll('#prev, #next');
        buttons.forEach(btn => {
            if (loading) {
                btn.style.pointerEvents = 'none';
                btn.style.opacity = '0.5';
            } else {
                btn.style.pointerEvents = 'auto';
                updateNavigationButtons();
            }
        });
    }

    // 开始图片切换的过渡，显示局部 loading
    function beginImageTransition() {
        const img = document.getElementById('img');
        if (!img) return;
        const holder = document.getElementById('img-holder');
        const isHeightMode = document.body.classList.contains('ehx-fit-height');

        if (holder && !isHeightMode) {
            // 只在宽度模式下固定高度，避免切换瞬间塌陷/跳变
            const rect = holder.getBoundingClientRect();
            holder.style.height = rect.height + 'px';
        }
        img.style.opacity = '0';
        if (holder) holder.classList.add('loading');

        // 预留图片信息区域高度，避免下方元素跳动
        reserveInfoAreas();
    }

    // 结束图片切换的过渡，隐藏局部 loading
    function endImageTransition(isError = false) {
        const img = document.getElementById('img');
        if (!img) return;
        const holder = document.getElementById('img-holder');
        const isHeightMode = document.body.classList.contains('ehx-fit-height');

        // 根据新图自然高度更新容器高度，再释放
        if (holder) {
            const release = () => {
                requestAnimationFrame(() => {
                    if (!isHeightMode) {
                        holder.style.height = '';
                    }
                    holder.classList.remove('loading');
                    // 延后释放信息区域的 min-height，避免移动端闪烁
                    setTimeout(releaseInfoAreas, 0);
                });
            };

            if (!isHeightMode) {
                // 只在宽度模式下做高度过渡
                const tmpImg = imageCache.get(img.src) || img;
                const naturalH = tmpImg.naturalHeight && tmpImg.naturalWidth ? (holder.clientWidth * tmpImg.naturalHeight / tmpImg.naturalWidth) : holder.clientHeight;
                if (naturalH && Number.isFinite(naturalH)) {
                    holder.style.height = Math.round(naturalH) + 'px';
                    setTimeout(release, CONFIG.imageTransitionMs);
                } else {
                    release();
                }
            } else {
                // 高度模式下直接释放
                release();
            }
        }
        img.style.opacity = '1';
    }

    // 预留信息区域高度
    function reserveInfoAreas() {
        const infoTop = document.querySelector('#i2 > div:last-child');
        const infoBottom = document.querySelector('#i4 > div:first-child');
        freezeElementHeight(infoTop);
        freezeElementHeight(infoBottom);
    }

    // 释放信息区域高度
    function releaseInfoAreas() {
        const infoTop = document.querySelector('#i2 > div:last-child');
        const infoBottom = document.querySelector('#i4 > div:first-child');
        releaseElementHeight(infoTop);
        releaseElementHeight(infoBottom);
    }

    // 冻结元素高度
    function freezeElementHeight(el) {
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const h = Math.round(rect.height);
        if (h > 0) {
            // 仅设置最小高度，避免强制 height/overflow 造成移动端重绘闪烁
            el.style.minHeight = h + 'px';
        }
    }

    // 释放元素高度
    function releaseElementHeight(el) {
        if (!el) return;
        el.style.minHeight = '';
    }

    // 显示错误信息
    function showError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.id = 'error-message';
        errorDiv.textContent = message;
        errorDiv.className = 'stuffbox';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 10px 15px;
            z-index: 10000;
            font-size: 14px;
        `;

        document.body.appendChild(errorDiv);

        setTimeout(() => {
            if (errorDiv.parentNode) {
                errorDiv.parentNode.removeChild(errorDiv);
            }
        }, CONFIG.errorDurationMs);
    }

    // 添加样式（移除自定义配色与文字色，改为继承站点样式）
    function addStyles() {
        const style = document.createElement('style');
        style.textContent = `
            /* 页面框架：仅结构与布局，颜色继承站点 */
            .ehx-reader-bar { position: sticky; top: 0; z-index: 10; display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 6px 8px; backdrop-filter: saturate(120%) blur(3px); }
            .ehx-reader-bar .group { display: inline-flex; align-items: center; gap: 6px; }
            .ehx-btn { appearance: none; border: 1px solid currentColor; background: transparent; color: inherit; padding: 6px 10px; border-radius: 6px; cursor: pointer; }
            .ehx-btn:disabled { opacity: .5; cursor: not-allowed; }
            .ehx-btn:hover { filter: brightness(1.02); }
            .ehx-btn.active { outline: 2px solid currentColor; }
            .ehx-sep { width: 1px; height: 24px; background: currentColor; opacity: .2; }
            .ehx-counter { user-select: none; min-width: 84px; text-align: center; }

            /* 主容器：跟随窗口宽度居中 */
            .ehx-container { margin: 0 auto; padding: 6px 10px; max-width: min(96vw, 1200px); }
            .ehx-image-wrap { display: flex; justify-content: center; align-items: flex-start; }

            /* 适应高度模式：整个显示区域适应浏览器视口 */
            body.ehx-fit-height .ehx-container { height: var(--ehx-available-height, 400px); display: flex; flex-direction: column; }
            body.ehx-fit-height .ehx-image-wrap { flex: 1; align-items: center; min-height: 0; }
            body.ehx-fit-height #img-holder { height: 100%; max-height: 100%; width: auto; display: flex; align-items: center; justify-content: center; }
            body.ehx-fit-height #img { max-height: 100%; max-width: 100%; width: auto; height: auto; object-fit: contain; }

            #loading-indicator {
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                padding: 15px 25px;
                z-index: 10000;
                font-size: 16px;
                display: none;
            }

            .eh-nav-hint {
                position: fixed;
                bottom: 20px;
                right: 20px;
                padding: 10px;
                font-size: 12px;
                z-index: 9999;
            }

            #img { transition: opacity 0.18s ease; max-width: 100%; height: auto; display: block; }
            .loading #img { opacity: 0.7; }

            /* 局部加载遮罩 */
            #img-holder { position: relative; display: inline-block; max-width: 100%; }
            #img-holder .eh-img-loader { position: absolute; inset: 0; display: none; align-items: center; justify-content: center; }
            #img-holder.loading .eh-img-loader { display: flex; }
            .eh-spinner { width: 32px; height: 32px; border-radius: 50%; border: 3px solid currentColor; border-top-color: transparent; animation: spin 0.8s linear infinite; }
            @keyframes spin { to { transform: rotate(360deg); } }

            /* 容器自适应与高度平滑过渡，减少抖动 */
            #i3 { display: flex; justify-content: center; }
            #img-holder { transition: height 0.2s ease; }
            body.ehx-fit-height #img-holder { transition: none; }

            /* 控制菜单样式（定位 + 结构，外观由站点类接管） */
            .ehx-control-menu { position: fixed; top: 10px; right: 10px; padding: 12px; z-index: 10001; font-size: 12px; min-width: 280px; display: none; }
            .ehx-control-menu.show { display: block; }
            .ehx-menu-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px; padding-bottom: 8px; border-bottom: 1px solid currentColor; font-weight: bold; }
            .ehx-menu-close { background: none; border: none; font-size: 16px; cursor: pointer; padding: 0; width: 20px; height: 20px; display: flex; align-items: center; justify-content: center; }
            .ehx-menu-section { margin-bottom: 12px; }
            .ehx-menu-section h4 { margin: 0 0 6px 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; }
            .ehx-menu-item { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; padding: 4px 0; }
            .ehx-menu-item label { font-size: 11px; cursor: pointer; }
            .ehx-toggle { position: relative; width: 40px; height: 20px; border: 1px solid currentColor; border-radius: 10px; cursor: pointer; }
            .ehx-toggle::after { content: ''; position: absolute; top: 2px; left: 2px; width: 16px; height: 16px; background: currentColor; border-radius: 50%; transition: transform 0.3s; }
            .ehx-toggle.active::after { transform: translateX(20px); }
            .ehx-menu-input { padding: 4px 6px; border: 1px solid currentColor; border-radius: 4px; font-size: 11px; width: 120px; min-height: 26px; text-align: center; text-align-last: center; background: transparent; color: inherit; }
            .ehx-menu-btn { padding: 6px 12px; border: 1px solid currentColor; border-radius: 4px; cursor: pointer; font-size: 11px; margin: 2px; background: transparent; color: inherit; }

            /* 预加载状态显示（外观交给站点类） */
            .ehx-preload-status { position: fixed; bottom: 10px; left: 10px; padding: 10px; z-index: 10001; font-size: 11px; max-width: 300px; max-height: 200px; overflow: hidden; display: none; }
            .ehx-preload-status.show { display: block; }
            .ehx-status-header { font-weight: bold; margin-bottom: 8px; text-align: center; padding-bottom: 4px; border-bottom: 1px solid currentColor; }
            .ehx-status-list { max-height: 160px; overflow-y: auto; padding-right: 4px; scrollbar-width: thin; }
            .ehx-status-item { display: flex; justify-content: space-between; align-items: center; padding: 2px 0; border-bottom: 1px solid currentColor; opacity: .6; }
            .ehx-status-item:last-child { border-bottom: none; }
            .ehx-status-page { font-weight: bold; }
            .ehx-status-state { font-size: 10px; font-weight: bold; text-transform: uppercase; }
        `;
        document.head.appendChild(style);
    }

    // 添加加载指示器
    function addLoadingIndicator() {
        // 顶部工具条（简洁，参考结构但不抄配色）
        const topBar = document.createElement('div');
        topBar.className = 'ehx-reader-bar stuffbox';
        topBar.innerHTML = `
            <div class="group">
                <span class="ehx-counter"><span id="ehx-cur">${currentPage}</span> / <span id="ehx-total">${totalPages}</span></span>
            </div>
            <div class="group">
                <button class="ehx-btn" id="ehx-fit-width">${t('fitWidth')}</button>
                <button class="ehx-btn" id="ehx-fit-height">${t('fitHeight')}</button>
                <button class="ehx-btn" id="ehx-menu-open" title="${t('settings')}">⚙️</button>
            </div>
        `;
        document.body.insertBefore(topBar, document.body.firstChild);

        // 容器包裹（居中与内边距）
        const container = document.createElement('div');
        container.className = 'ehx-container';
        const i3 = document.getElementById('i3');
        if (i3 && i3.parentNode) {
            i3.parentNode.insertBefore(container, i3);
            container.appendChild(i3);
            i3.classList.add('ehx-image-wrap');
        }

        // 全局加载指示器
        const indicator = document.createElement('div');
        indicator.id = 'loading-indicator';
        indicator.className = 'stuffbox';
        indicator.textContent = t('loading');
        document.body.appendChild(indicator);

        // 图像局部加载容器
        const img = document.getElementById('img');
        const imgContainer = document.getElementById('i3');
        if (img && imgContainer) {
            // 若尚未包裹，建立 holder
            let holder = document.getElementById('img-holder');
            if (!holder) {
                holder = document.createElement('div');
                holder.id = 'img-holder';
                holder.style.display = 'inline-block';
                img.parentNode.insertBefore(holder, img);
                holder.appendChild(img);
                const loader = document.createElement('div');
                loader.className = 'eh-img-loader';
                loader.innerHTML = '<div class="eh-spinner"></div>';
                holder.appendChild(loader);
            }
        }

        // 添加操作提示
        const hint = document.createElement('div');
        hint.className = 'eh-nav-hint stuffbox';
        hint.innerHTML = `
            <div>${t('navHintTitle')}</div>
            <div>${t('navHintLeft')}</div>
            <div>${t('navHintRight')}</div>
            <div>${t('navHintClick')}</div>
        `;
        document.body.appendChild(hint);

        // N 秒后隐藏提示
        setTimeout(() => {
            hint.style.transition = 'opacity 1s ease';
            hint.style.opacity = '0';
            setTimeout(() => {
                if (hint.parentNode) {
                    hint.parentNode.removeChild(hint);
                }
            }, CONFIG.hintFadeMs);
        }, CONFIG.hintAutoHideMs);

        // 工具条事件
        const btnFitW = document.getElementById('ehx-fit-width');
        const btnFitH = document.getElementById('ehx-fit-height');
        const btnMenu = document.getElementById('ehx-menu-open');
        if (btnFitW) btnFitW.onclick = () => setFitMode('width');
        if (btnFitH) btnFitH.onclick = () => setFitMode('height');
        if (btnMenu) btnMenu.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            const menu = document.querySelector('.ehx-control-menu');
            if (menu) {
                const willShow = !menu.classList.contains('show');
                menu.classList.toggle('show');
                if (willShow) updateMenuInfo();
            }
        };

        // 初始应用适配模式
        applyFitMode();
        updateFitModeButtons();
    }

    // 页面加载完成后初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // 适应模式
    function setFitMode(mode) {
        fitMode = mode === 'height' ? 'height' : 'width';
        localStorage.setItem('ehx_fit_mode', fitMode);
        applyFitMode();
        updateFitModeButtons();
    }

    function updateFitModeButtons() {
        const btnFitW = document.getElementById('ehx-fit-width');
        const btnFitH = document.getElementById('ehx-fit-height');
        if (btnFitW && btnFitH) {
            btnFitW.classList.toggle('active', fitMode === 'width');
            btnFitH.classList.toggle('active', fitMode === 'height');
        }
    }

    function applyFitMode() {
        const holder = document.getElementById('img-holder');
        const img = document.getElementById('img');
        if (!holder || !img) return;

        if (fitMode === 'height') {
            // 高度适应模式：让整个容器适应浏览器高度
            document.body.classList.add('ehx-fit-height');
            const topBar = document.querySelector('.ehx-reader-bar');
            const topH = topBar ? topBar.getBoundingClientRect().height : 0;
            const avail = Math.max(300, window.innerHeight - topH - 12);
            document.documentElement.style.setProperty('--ehx-available-height', avail + 'px');

            // 清除宽度模式的内联样式
            holder.style.maxHeight = '';
            holder.style.width = '';
            holder.style.height = '';
            img.style.maxWidth = '';
            img.style.maxHeight = '';
        } else {
            // 宽度适应模式：图片宽度撑满容器
            document.body.classList.remove('ehx-fit-height');
            document.documentElement.style.removeProperty('--ehx-available-height');

            // 设置宽度模式样式
            holder.style.maxHeight = '';
            holder.style.width = '100%';
            holder.style.height = '';
            img.style.maxWidth = '100%';
            img.style.maxHeight = 'none';
        }
    }
    // 窗口尺寸变化节流，减少高频调用导致的抖动
    let resizeThrottleId = null;
    window.addEventListener('resize', () => {
        if (resizeThrottleId) clearTimeout(resizeThrottleId);
        resizeThrottleId = setTimeout(() => {
            resizeThrottleId = null;
            applyFitMode();
        }, CONFIG.resizeThrottleMs);
    });

    // ==================== 新增功能：控制菜单和预加载状态 ====================

    // 添加控制菜单
    function addControlMenu() {
        // 控制菜单（移除悬浮触发按钮，改由工具条按钮控制）
        const menu = document.createElement('div');
        menu.className = 'ehx-control-menu stuffbox';
        menu.innerHTML = `
            <div class="ehx-menu-header">
                <span>${t('menuTitle')}</span>
                <button class="ehx-menu-close" title="${t('close')}">×</button>
            </div>

            <div class="ehx-menu-section">
                <h4>${t('basicSettings')}</h4>
                <div class="ehx-menu-item">
                    <label>${t('enableScript')}</label>
                    <div class="ehx-toggle ${scriptEnabled ? 'active' : ''}" data-setting="script-enabled"></div>
                </div>
                <div class="ehx-menu-item">
                    <label>${t('showPreloadStatus')}</label>
                    <div class="ehx-toggle ${showPreloadStatus ? 'active' : ''}" data-setting="show-preload-status"></div>
                </div>
                <div class="ehx-menu-item">
                    <label>${t('updateUrl')}</label>
                    <div class="ehx-toggle ${CONFIG.updateUrl ? 'active' : ''}" data-setting="update-url"></div>
                </div>
                <div class="ehx-menu-item">
                    <label>${t('language')}</label>
                    <select class="ehx-menu-input" data-setting="lang">
                        <option value="auto" ${langSetting==='auto' ? 'selected' : ''}>${t('lang_auto')}</option>
                        <option value="en" ${getCurrentLang()==='en' && langSetting!=='auto' ? 'selected' : ''}>${t('lang_en')}</option>
                        <option value="zh-CN" ${getCurrentLang()==='zh-CN' && langSetting!=='auto' ? 'selected' : ''}>${t('lang_zhCN')}</option>
                        <option value="ja" ${getCurrentLang()==='ja' && langSetting!=='auto' ? 'selected' : ''}>${t('lang_ja')}</option>
                    </select>
                </div>
            </div>

            <div class="ehx-menu-section">
                <h4>${t('preloadSettings')}</h4>
                <div class="ehx-menu-item">
                    <label>${t('preloadCount')}</label>
                    <input type="number" class="ehx-menu-input" min="1" max="10" value="${CONFIG.preloadCount}" data-setting="preload-count">
                </div>
                <div class="ehx-menu-item">
                    <label>${t('maxRetries')}</label>
                    <input type="number" class="ehx-menu-input" min="1" max="10" value="${CONFIG.maxRetries}" data-setting="max-retries">
                </div>
                <div class="ehx-menu-item">
                    <label>${t('retryDelayMs')}</label>
                    <input type="number" class="ehx-menu-input" min="500" max="5000" step="500" value="${CONFIG.retryDelay}" data-setting="retry-delay">
                </div>
            </div>

            <div class="ehx-menu-section">
                <h4>${t('cacheManagement')}</h4>
                <div style="display: flex; flex-wrap: wrap; gap: 4px;">
                    <button class="ehx-menu-btn" data-action="clear-cache">${t('clearImageCache')}</button>
                    <button class="ehx-menu-btn" data-action="clear-page-cache">${t('clearPageCache')}</button>
                    <button class="ehx-menu-btn" data-action="clear-all-cache">${t('clearAllCache')}</button>
                    <button class="ehx-menu-btn" data-action="reset-settings">${t('resetSettings')}</button>
                </div>
            </div>

            <div class="ehx-menu-section">
                <h4>${t('statusInfo')}</h4>
                <div style="font-size: 10px; line-height: 1.4;">
                    <div>${t('cacheImageCount')}: <span id="ehx-cache-count">${imageCache.size}</span></div>
                    <div>${t('cachePageCount')}: <span id="ehx-page-cache-count">${pageDataCache.size}</span></div>
                    <div>${t('preloadStatus')}: <span id="ehx-preload-count">${preloadStatus.size}</span></div>
                </div>
            </div>
        `;

        document.body.appendChild(menu);

        menu.querySelector('.ehx-menu-close').addEventListener('click', () => {
            menu.classList.remove('show');
        });

        // 点击菜单外部关闭
        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target)) {
                menu.classList.remove('show');
            }
        });

        // 绑定设置控制事件
        bindMenuControls(menu);
    }

    // 绑定菜单控制事件
    function bindMenuControls(menu) {
        // 开关控制
        menu.querySelectorAll('.ehx-toggle').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const setting = toggle.dataset.setting;
                const isActive = toggle.classList.contains('active');

                toggle.classList.toggle('active');

                switch(setting) {
                    case 'script-enabled':
                        scriptEnabled = !isActive;
                        localStorage.setItem('ehx_script_enabled', scriptEnabled);
                        showMessage(scriptEnabled ? t('msgScriptEnabled') : t('msgScriptDisabled'));
                        break;
                    case 'show-preload-status':
                        showPreloadStatus = !isActive;
                        localStorage.setItem('ehx_show_preload_status', showPreloadStatus);
                        if (showPreloadStatus) {
                            addPreloadStatusDisplay();
                        } else {
                            const statusDisplay = document.querySelector('.ehx-preload-status');
                            if (statusDisplay) statusDisplay.remove();
                        }
                        break;
                    case 'update-url':
                        CONFIG.updateUrl = !isActive;
                        localStorage.setItem('ehx_update_url', CONFIG.updateUrl);
                        break;
                }
            });
        });

        // 输入框控制
        menu.querySelectorAll('.ehx-menu-input').forEach(input => {
            input.addEventListener('change', () => {
                const setting = input.dataset.setting;
                const value = setting === 'lang' ? String(input.value) : (parseInt(input.value) || 1);

                switch(setting) {
                    case 'preload-count':
                        CONFIG.preloadCount = Math.max(1, Math.min(10, value));
                        localStorage.setItem('ehx_preload_count', CONFIG.preloadCount);
                        input.value = CONFIG.preloadCount;
                        break;
                    case 'max-retries':
                        CONFIG.maxRetries = Math.max(1, Math.min(10, value));
                        localStorage.setItem('ehx_max_retries', CONFIG.maxRetries);
                        input.value = CONFIG.maxRetries;
                        break;
                    case 'retry-delay':
                        CONFIG.retryDelay = Math.max(500, Math.min(5000, value));
                        localStorage.setItem('ehx_retry_delay', CONFIG.retryDelay);
                        input.value = CONFIG.retryDelay;
                        break;
                    case 'lang':
                        langSetting = value;
                        localStorage.setItem('ehx_lang', langSetting);
                        showMessage(t('msgSettingsSaved'));
                        applyLanguage();
                        return;
                }
                showMessage(t('msgSettingsSaved'));
            });
        });

        // 按钮控制
        menu.querySelectorAll('.ehx-menu-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const action = btn.dataset.action;

                switch(action) {
                    case 'clear-cache':
                        imageCache.clear();
                        showMessage(t('msgImgCacheCleared'));
                        break;
                    case 'clear-page-cache':
                        pageDataCache.clear();
                        showMessage(t('msgPageCacheCleared'));
                        break;
                    case 'clear-all-cache':
                        imageCache.clear();
                        pageDataCache.clear();
                        pageUrlCache.clear();
                        preloadStatus.clear();
                        showMessage(t('msgAllCleared'));
                        updatePreloadStatusDisplay();
                        break;
                    case 'reset-settings':
                        if (confirm(t('confirmReset'))) {
                            localStorage.removeItem('ehx_script_enabled');
                            localStorage.removeItem('ehx_show_preload_status');
                            localStorage.removeItem('ehx_fit_mode');
                            localStorage.removeItem('ehx_update_url');
                            localStorage.removeItem('ehx_preload_count');
                            localStorage.removeItem('ehx_max_retries');
                            localStorage.removeItem('ehx_retry_delay');
                            localStorage.removeItem('ehx_lang');
                            showMessage(t('msgSettingsReset'));
                        }
                        break;
                }
                updateMenuInfo();
            });
        });
    }

    // 更新菜单信息
    function updateMenuInfo() {
        const cacheCount = document.getElementById('ehx-cache-count');
        const pageCacheCount = document.getElementById('ehx-page-cache-count');
        const preloadCount = document.getElementById('ehx-preload-count');

        if (cacheCount) cacheCount.textContent = imageCache.size;
        if (pageCacheCount) pageCacheCount.textContent = pageDataCache.size;
        if (preloadCount) preloadCount.textContent = preloadStatus.size;
    }

    // 添加预加载状态显示
    function addPreloadStatusDisplay() {
        // 移除已存在的显示
        const existing = document.querySelector('.ehx-preload-status');
        if (existing) existing.remove();

        const statusDisplay = document.createElement('div');
        statusDisplay.className = 'ehx-preload-status show stuffbox';
        statusDisplay.innerHTML = `
            <div class="ehx-status-header">${t('preloadStatus')}</div>
            <div class="ehx-status-list"></div>
        `;

        document.body.appendChild(statusDisplay);

        // 添加点击头部切换显示/隐藏功能
        statusDisplay.querySelector('.ehx-status-header').addEventListener('click', () => {
            const list = statusDisplay.querySelector('.ehx-status-list');
            list.style.display = list.style.display === 'none' ? 'block' : 'none';
        });

        updatePreloadStatusDisplay();
    }

    // 更新预加载状态
    function updatePreloadStatus(pageNum, status) {
        preloadStatus.set(pageNum, status);
        updatePreloadStatusDisplay();
    }

    // 更新预加载状态显示
    function updatePreloadStatusDisplay() {
        if (pendingPreloadRender) return;
        pendingPreloadRender = true;
        requestAnimationFrame(() => {
            pendingPreloadRender = false;
            const statusDisplay = document.querySelector('.ehx-preload-status');
            if (!statusDisplay) return;

            const statusList = statusDisplay.querySelector('.ehx-status-list');
            if (!statusList) return;

            // 获取当前页面附近的状态
            const relevantPages = [];
            for (let i = Math.max(1, currentPage - 2); i <= Math.min(totalPages, currentPage + CONFIG.preloadCount + 2); i++) {
                relevantPages.push(i);
            }

            statusList.innerHTML = relevantPages.map(pageNum => {
                const status = preloadStatus.get(pageNum) || (pageDataCache.has(pageNum) ? 'completed' : 'unknown');
                const isCurrent = pageNum === currentPage;
                const statusText = getStatusText(status);
                const statusClass = `ehx-status-${status}`;

                return `
                    <div class="ehx-status-item ${isCurrent ? 'current' : ''}">
                        <span class="ehx-status-page">${isCurrent ? `► ${pageNum}` : pageNum}</span>
                        <span class="ehx-status-state ${statusClass}">${statusText}</span>
                    </div>
                `;
            }).join('');
        });
    }

    // 获取状态文本
    function getStatusText(status) {
        switch(status) {
            case 'waiting': return t('status_waiting');
            case 'loading': return t('status_loading');
            case 'completed': return t('status_completed');
            case 'failed': return t('status_failed');
            default: return t('status_unknown');
        }
    }

    // 应用当前语言到 UI
    function applyLanguage() {
        // 顶部按钮与标题
        const btnW = document.getElementById('ehx-fit-width');
        const btnH = document.getElementById('ehx-fit-height');
        const btnMenu = document.getElementById('ehx-menu-open');
        const indicator = document.getElementById('loading-indicator');
        if (btnW) btnW.textContent = t('fitWidth');
        if (btnH) btnH.textContent = t('fitHeight');
        if (btnMenu) btnMenu.title = t('settings');
        if (indicator) indicator.textContent = t('loading');
        // 预加载状态标题
        const statusHeader = document.querySelector('.ehx-preload-status .ehx-status-header');
        if (statusHeader) statusHeader.textContent = t('preloadStatus');

        // 重新渲染菜单（保留显示状态）
        const oldMenu = document.querySelector('.ehx-control-menu');
        const wasShown = oldMenu && oldMenu.classList.contains('show');
        if (oldMenu) oldMenu.remove();
        addControlMenu();
        const newMenu = document.querySelector('.ehx-control-menu');
        if (newMenu && wasShown) newMenu.classList.add('show');

        // 刷新预加载状态里的文本
        updatePreloadStatusDisplay();
    }

})();

