// ==UserScript==
// @name         嗨皮漫畫 - 收起、展開評論區
// @name:zh-TW   嗨皮漫畫 - 收起、展開評論區
// @name:zh-CN   嗨皮漫画 - 收起、展开评论区
// @name:ja      ハッピーコミック - コメントエリアの折りたたみと展開
// @name:en      Happy Comics - Collapse and Expand Comments Section
// @version      2.8
// @description  收起或展開嗨皮漫畫評論區，並隱藏所有彈窗、公告元素，保證滑動順暢。
// @description:zh-TW  收起或展開嗨皮漫畫評論區，並隱藏所有彈窗、公告元素，保證滑動順暢。
// @description:zh-CN  收起或展开嗨皮漫画评论区，并隐藏所有弹窗、公告元素，保证滑动顺畅。
// @description:ja      Happy Comicsのコメントエリアを折りたたみ、展開し、全てのモーダルや告知を非表示にし、スクロールをスムーズにします。
// @description:en      Collapse or expand the comments section of Happy Comics, hide all modals and notices, and keep scrolling smooth.
// @author       Scott
// @match        *://m.happymh.com/reads/*
// @match        *://m.happymh.com/*
// @grant        GM_addStyle
// @license      MIT
// @namespace    https://www.youtube.com/c/ScottDoha
// @downloadURL https://update.greasyfork.org/scripts/494534/%E5%97%A8%E7%9A%AE%E6%BC%AB%E7%95%AB%20-%20%E6%94%B6%E8%B5%B7%E3%80%81%E5%B1%95%E9%96%8B%E8%A9%95%E8%AB%96%E5%8D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/494534/%E5%97%A8%E7%9A%AE%E6%BC%AB%E7%95%AB%20-%20%E6%94%B6%E8%B5%B7%E3%80%81%E5%B1%95%E9%96%8B%E8%A9%95%E8%AB%96%E5%8D%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var isCollapsed = true; // 默認收起

    // 從 localStorage 讀取狀態
    if (localStorage.getItem('isCollapsed') !== null) {
        isCollapsed = localStorage.getItem('isCollapsed') === 'true';
    }

    // 監控新增文章區塊，插入收起/展開按鈕
    var observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
            var addedNodes = mutation.addedNodes;
            for (var i = 0; i < addedNodes.length; i++) {
                var node = addedNodes[i];
                if (node.classList && node.classList.contains('jss30')) {
                    addToggleButton(node);
                }
            }
            hideUnrelatedElements();
            updateCommentSectionDisplay();
        });
    });
    observer.observe(document.body, { childList: true, subtree: true });

    function addToggleButton(article) {
        var container = document.createElement('div');
        container.className = 'jss102';
        container.style.paddingLeft = '1rem';
        container.appendChild(createLabel());

        var attempts = 0;
        function insert() {
            if (article.firstChild) {
                article.insertBefore(container, article.firstChild);
            } else {
                attempts++;
                if (attempts < 5) setTimeout(insert, 500);
            }
        }
        insert();
    }

    function createLabel() {
        var label = document.createElement('label');
        label.className = 'MuiFormControlLabel-root jss31';
        label.innerHTML = `
            <span class="MuiSwitch-root">
                <span class="MuiButtonBase-root MuiIconButton-root jss51 MuiSwitch-switchBase MuiSwitch-colorSecondary ${isCollapsed ? '' : 'Mui-checked'}" aria-disabled="false">
                    <span class="MuiIconButton-label">
                        <input class="jss54 MuiSwitch-input" name="checkedA" type="checkbox" ${isCollapsed ? '' : 'checked'}>
                        <span class="MuiSwitch-thumb"></span>
                    </span>
                    <span class="MuiTouchRipple-root"></span>
                </span>
                <span class="MuiSwitch-track"></span>
            </span>
            <span class="MuiTypography-root MuiFormControlLabel-label MuiTypography-body1">${getLabelText()}</span>
        `;
        label.querySelector('.MuiIconButton-root').addEventListener('click', function() {
            isCollapsed = !isCollapsed;
            localStorage.setItem('isCollapsed', isCollapsed);
            updateButton(label);
            updateCommentSectionDisplay();
            hideUnrelatedElements();
            showTooltip(isCollapsed ? '評論區已隱藏' : '評論區已顯示');
        });
        return label;
    }

    function updateButton(label) {
        var button = label.querySelector('.MuiButtonBase-root');
        var iconButton = label.querySelector('.MuiIconButton-root');
        if (isCollapsed) {
            button.classList.remove('Mui-checked');
            iconButton.classList.remove('Mui-checked');
        } else {
            button.classList.add('Mui-checked');
            iconButton.classList.add('Mui-checked');
        }
        label.querySelector('.MuiTypography-root').textContent = getLabelText();
    }

    function getLabelText() {
        return isCollapsed ? '吐槽已收起' : '吐槽已展开';
    }

    function updateCommentSectionDisplay() {
        var commentBox = document.querySelector('.MuiPaper-root.MuiCard-root.jss31.jss49.MuiPaper-elevation3.MuiPaper-rounded');
        if (commentBox) commentBox.style.display = isCollapsed ? 'none' : 'block';
    }

    // ===================== 隱藏彈窗、公告、廣告 =====================
    function hideUnrelatedElements() {
        // 一般廣告/公告
        var selectors = [
            '.jss7', '.jss79', '.jss80', '#google_pedestal_container',
            '.css-17565wx-noticeAlert', '.css-1ebtadi-noticeAlert', '.css-uf377q-root'
        ];
        selectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => el.style.display = 'none');
        });

        // 移動端彈窗
        var modalSelectors = [
            '.MuiDialog-root', '.MuiModal-root', '.MuiDialog-container', 
            '.MuiDialog-scrollPaper', '.MuiBackdrop-root', '.MuiModal-backdrop'
        ];
        modalSelectors.forEach(sel => {
            document.querySelectorAll(sel).forEach(el => el.style.display = 'none');
        });

        // 滾動恢復
        document.body.style.overflow = 'auto';
        document.documentElement.style.overflow = 'auto';
    }

    function showTooltip(text) {
        var tooltip = document.createElement('div');
        tooltip.textContent = text;
        tooltip.classList.add('pagetual_tipsWords');
        document.body.appendChild(tooltip);
        tooltip.style.opacity = '0.6';
        setTimeout(() => { tooltip.style.opacity = '0'; setTimeout(() => tooltip.remove(), 500); }, 2000);
    }

    GM_addStyle(`
        .pagetual_tipsWords {
            font-size: 20px;
            font-weight: bold;
            font-family: "黑体", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
            color: #ffffff;
            min-height: 50px;
            max-width: 80%;
            line-height: 1.5;
            position: fixed;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            z-index: 2147483647;
            background-color: rgba(0, 0, 0, 0.8);
            border: 1px solid #303030;
            border-radius: 10px;
            padding: 10px;
            opacity: 0;
            pointer-events: none;
            text-align: center;
            word-break: break-all;
            transition: opacity 0.8s ease-in-out;
            white-space: nowrap;
        }
    `);

})();
