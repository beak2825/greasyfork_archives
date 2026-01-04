// ==UserScript==
// @name         Jellyfin 媒体库标题悬停提示 ai制作（emby未测试）
// @namespace    http://tampermonkey.net/
// @version      12.2
// @description  在【电影、家庭视频】和【照片媒体库】中选择海报、缩略图视图（卡片的也可以），鼠标悬停在图片上会显示完整标题       已修复其他图片不显示问题
// @author       YourName
// @match        *://*/web/index.html*
// @match        *://*/*/web/index.html*
// @grant        GM_addStyle
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/540579/Jellyfin%20%E5%AA%92%E4%BD%93%E5%BA%93%E6%A0%87%E9%A2%98%E6%82%AC%E5%81%9C%E6%8F%90%E7%A4%BA%20ai%E5%88%B6%E4%BD%9C%EF%BC%88emby%E6%9C%AA%E6%B5%8B%E8%AF%95%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/540579/Jellyfin%20%E5%AA%92%E4%BD%93%E5%BA%93%E6%A0%87%E9%A2%98%E6%82%AC%E5%81%9C%E6%8F%90%E7%A4%BA%20ai%E5%88%B6%E4%BD%9C%EF%BC%88emby%E6%9C%AA%E6%B5%8B%E8%AF%95%EF%BC%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 立即添加全局样式
    GM_addStyle(`
        /* 提示框样式 - 只应用于特定卡片 */
        .jf-card .jf-title-tooltip {
            position: absolute;
            background: rgba(0, 0, 0, 0.95);
            color: #fff;
            padding: 12px;
            border-radius: 6px;
            font-size: 14px;
            line-height: 1.5;
            z-index: 100000;
            box-shadow: 0 5px 25px rgba(0,0,0,0.5);
            pointer-events: none;
            word-wrap: break-word;
            white-space: normal;
            display: none;
            opacity: 0;
            transition: opacity 0.3s ease;
            text-align: left;
            box-sizing: border-box;
            width: 100%;
            left: 0;
            top: 0;
            bottom: auto;
            transform: none !important;
            max-height: none !important;
            height: auto !important;
            min-height: auto !important;
            overflow: visible !important;
        }

        .jf-card .jf-title-tooltip.visible {
            display: block;
            opacity: 1;
        }

        /* 卡片基础样式 - 只应用于特定卡片 */
        .jf-card {
            position: relative !important;
            overflow: visible !important;
            z-index: 1000 !important;
            contain: none !important;
        }

        .jf-card:hover {
            z-index: 100001 !important;
        }

        /* 恢复原标题样式 */
        .jf-card .cardText,
        .jf-card .cardTitle,
        .jf-card .cardOverlayContainer,
        .jf-card .cardOverlayBottom,
        .jf-card .cardContent > div,
        .jf-card .cardContent-text,
        .jf-card .cardText-primary,
        .jf-card .cardCaption,
        .jf-card .cardText:last-child,
        .jf-card .cardFooter,
        .jf-card .cardName {
            overflow: hidden !important;
            text-overflow: ellipsis !important;
            white-space: nowrap !important;
            max-height: 1.5em !important;
            height: auto !important;
            min-height: auto !important;
            display: block !important;
            contain: style !important;
        }

        /* 解除容器限制 - 只应用于特定卡片 */
        .jf-card,
        .jf-card .cardBox,
        .jf-card .cardContent,
        .jf-card .cardOverlayContainer,
        .jf-card .cardOverlayBottom {
            overflow: visible !important;
            max-height: none !important;
            height: auto !important;
            min-height: auto !important;
            contain: none !important;
        }

        /* 保护所有非目标卡片 */
        .card:not(.jf-card),
        .portraitCard:not(.jf-card),
        .backdropCard:not(.jf-card),
        .detailImage:not(.jf-card),
        .itemContainer:not(.jf-card),
        /* 显式保护横幅图卡片 */
        .bannerCard,
        /* 修复：保护图片编辑卡片 */
        .imageEditorCard,
        /* 修复：保护刮削元数据窗口卡片 */
        .identificationDialog .card,
        .identificationSearchResultList .card {
            overflow: hidden !important;
            contain: layout style paint !important;
            z-index: auto !important;
        }

        .card:not(.jf-card) .cardBox,
        .card:not(.jf-card) .cardScalable,
        .card:not(.jf-card) .cardImageContainer,
        /* 显式保护横幅图内容 */
        .bannerCard .cardBox,
        .bannerCard .cardScalable,
        .bannerCard .cardImageContainer,
        /* 修复：保护图片编辑卡片内容 */
        .imageEditorCard .cardBox,
        .imageEditorCard .cardScalable,
        .imageEditorCard .cardImageContainer,
        /* 修复：保护刮削元数据窗口卡片内容 */
        .identificationDialog .cardBox,
        .identificationDialog .cardScalable,
        .identificationDialog .cardImageContainer,
        .identificationSearchResultList .cardBox,
        .identificationSearchResultList .cardScalable,
        .identificationSearchResultList .cardImageContainer {
            opacity: 1 !important;
            visibility: visible !important;
            z-index: auto !important;
            transform: none !important;
            transition: none !important;
        }

        /* 详情页面封面图保护 */
        #itemDetailPage .cardPadder,
        #itemDetailPage .cardScalable,
        #itemDetailPage .cardImageContainer {
            opacity: 1 !important;
            visibility: visible !important;
            z-index: 1000 !important;
        }
    `);

    // 精准识别目标卡片类型
    const TARGET_CARD_TYPES = [
        'Movie', 'Series', 'Episode', 'Season', 'BoxSet',
        'Video', 'Photo', 'PhotoAlbum', 'HomeVideo', 'FamilyPhoto'
    ];

    // 精准识别目标容器
    const TARGET_CONTAINERS = [
        'itemsContainer', 'verticalSection', 'vertical-wrap',
        'homePage', 'libraryPage', 'searchResults', 'listPage'
    ];

    // 需要保护的卡片类型（包括横幅图和图片编辑卡片）
    const PROTECTED_CARD_CLASSES = [
        'bannerCard',
        'imageEditorCard' // 修复：添加图片编辑卡片到保护列表
    ];

    // 需要保护的容器类型（刮削元数据窗口）
    const PROTECTED_CONTAINERS = [
        'identificationDialog',
        'identificationSearchResultList'
    ];

    // 主处理函数 - 立即执行
    function processPage() {
        // 尝试多种卡片选择器
        const cardSelectors = [
            '.card',
            '.portraitCard',
            '.backdropCard',
            '.detailImage',
            '.itemContainer'
        ];

        // 处理所有卡片
        cardSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(card => {
                if (card.dataset.jfProcessed) return;
                card.dataset.jfProcessed = 'true';

                // 检查是否是需要保护的卡片类型（横幅图或图片编辑卡片）
                const isProtectedCard = PROTECTED_CARD_CLASSES.some(cls =>
                    card.classList.contains(cls)
                );

                if (isProtectedCard) {
                    protectCard(card);
                    return;
                }

                // 检查是否在需要保护的容器中（刮削元数据窗口）
                const isInProtectedContainer = PROTECTED_CONTAINERS.some(container =>
                    card.closest(`.${container}`) ||
                    card.closest(`#${container}`)
                );

                if (isInProtectedContainer) {
                    protectCard(card);
                    return;
                }

                // 检查是否在目标容器中
                const isInTargetContainer = TARGET_CONTAINERS.some(container =>
                    card.closest(`.${container}`) ||
                    card.closest(`#${container}`)
                );

                // 检查卡片类型
                const cardType = card.getAttribute('data-type') || '';
                const isTargetType = TARGET_CARD_TYPES.includes(cardType);

                // 检查卡片角色
                const cardRole = card.getAttribute('role') || '';
                const isTargetRole = cardRole === 'link' || cardRole === 'button';

                // 检查URL特征
                const isMoviePage = window.location.href.includes('movie');
                const isListPage = window.location.href.includes('list');

                // 精准判断是否应用效果
                const shouldApplyEffect = isInTargetContainer &&
                                        (isTargetType || isTargetRole || isMoviePage || isListPage) &&
                                        !card.closest('#itemDetailPage .card');

                if (shouldApplyEffect) {
                    applyTooltipEffect(card);
                } else {
                    // 确保非目标卡片不受影响
                    protectCard(card);
                }
            });
        });
    }

    // 应用提示框效果
    function applyTooltipEffect(card) {
        card.classList.add('jf-card');

        // 尝试多种标题选择器
        const titleSelectors = [
            '.cardText',
            '.cardTitle',
            '.cardOverlayContainer',
            '.cardOverlayBottom',
            '.cardText:last-child',
            '.cardFooter',
            '.cardName',
            '.cardContent-text'
        ];

        let titleElement = null;
        let titleText = '';

        // 查找标题元素
        for (const sel of titleSelectors) {
            const el = card.querySelector(sel);
            if (el && (el.textContent || el.innerText)) {
                titleElement = el;
                titleText = el.textContent || el.innerText;
                break;
            }
        }

        // 如果找不到标题元素，使用整个卡片的文本内容
        if (!titleElement) {
            titleElement = card;
            titleText = card.textContent || card.innerText;
        }

        // 创建提示框
        const tooltip = document.createElement('div');
        tooltip.className = 'jf-title-tooltip';
        tooltip.textContent = titleText;

        // 计算标题位置并设置提示框位置
        const positionTooltip = () => {
            const rect = titleElement.getBoundingClientRect();
            const cardRect = card.getBoundingClientRect();

            // 计算标题相对于卡片的顶部位置
            const topPosition = rect.top - cardRect.top;

            // 设置提示框位置 - 从原标题顶部开始，向下延伸
            tooltip.style.top = topPosition + 'px';
        };

        // 添加到卡片中
        card.appendChild(tooltip);

        // 初始定位
        positionTooltip();

        // 添加悬停事件
        card.addEventListener('mouseenter', () => {
            positionTooltip();
            tooltip.classList.add('visible');

            // 临时隐藏原标题
            titleElement.style.opacity = '0';
        });

        card.addEventListener('mouseleave', () => {
            tooltip.classList.remove('visible');

            // 恢复原标题显示
            titleElement.style.opacity = '';
        });

        // 窗口大小变化时重新定位
        window.addEventListener('resize', positionTooltip);
    }

    // 保护非目标卡片（包括横幅图和图片编辑卡片）
    function protectCard(card) {
        // 移除任何可能存在的提示框
        const tooltips = card.querySelectorAll('.jf-title-tooltip');
        tooltips.forEach(tooltip => tooltip.remove());

        // 移除效果类
        card.classList.remove('jf-card');

        // 恢复原标题显示
        const titleElements = card.querySelectorAll('.cardText, .cardTitle');
        titleElements.forEach(el => {
            el.style.opacity = '';
        });

        // 确保卡片内容完全可见（特别是图片编辑卡片）
        if (card.classList.contains('imageEditorCard') ||
            card.classList.contains('bannerCard') ||
            card.closest('.identificationDialog') ||
            card.closest('.identificationSearchResultList')) {
            card.style.overflow = 'hidden';
            card.style.contain = 'layout style paint';
            const cardBox = card.querySelector('.cardBox');
            if (cardBox) {
                cardBox.style.opacity = '1';
                cardBox.style.visibility = 'visible';
            }
        }
    }

    // 保护详情页面
    function protectDetailPage() {
        const detailPage = document.getElementById('itemDetailPage');
        if (detailPage) {
            // 确保封面图可见
            const coverImages = detailPage.querySelectorAll('.cardPadder, .cardScalable, .cardImageContainer');
            coverImages.forEach(img => {
                img.style.opacity = '1';
                img.style.visibility = 'visible';
            });

            // 保护详情页面的卡片
            const cards = detailPage.querySelectorAll('.card, .portraitCard');
            cards.forEach(card => protectCard(card));
        }
    }

    // 保护特殊卡片（横幅图和图片编辑卡片）
    function protectSpecialCards() {
        const selectors = PROTECTED_CARD_CLASSES.map(cls => `.${cls}`).join(', ');
        document.querySelectorAll(selectors).forEach(card => {
            protectCard(card);
        });
    }

    // 保护刮削元数据窗口
    function protectIdentifyDialog() {
        const dialogs = document.querySelectorAll('.identificationDialog, .identificationSearchResultList');
        dialogs.forEach(dialog => {
            const cards = dialog.querySelectorAll('.card');
            cards.forEach(card => protectCard(card));
        });
    }

    // 立即开始处理
    processPage();
    protectDetailPage();
    protectSpecialCards();
    protectIdentifyDialog();

    // 监听动态内容变化
    const observer = new MutationObserver((mutations) => {
        mutations.forEach(() => {
            processPage();
            protectDetailPage();
            protectSpecialCards();
            protectIdentifyDialog();
        });
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Jellyfin/Emby页面切换事件
    document.addEventListener('viewshow', () => {
        setTimeout(() => {
            processPage();
            protectDetailPage();
            protectSpecialCards();
            protectIdentifyDialog();
        }, 100);
    });

    // 确保在DOM完全加载后再次处理
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            processPage();
            protectDetailPage();
            protectSpecialCards();
            protectIdentifyDialog();
        });
    } else {
        processPage();
        protectDetailPage();
        protectSpecialCards();
        protectIdentifyDialog();
    }

    // 添加轮询确保所有元素都被处理
    setInterval(() => {
        processPage();
        protectDetailPage();
        protectSpecialCards();
        protectIdentifyDialog();
    }, 1000);
})();