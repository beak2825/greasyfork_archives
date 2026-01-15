// ==UserScript==
// @name         komica記憶發文自訂名稱跟類別
// @namespace    http://tampermonkey.net/
// @version      2.2.4
// @description  修復BUG
// @author       Grok
// @match        *://*.komica1.org/*
// @exclude      *://*.komica1.org/*/src/*
// @exclude      *://*.komica1.org/*/thumb/*
// @exclude      *://*.komica1.org/*/pixmicat.php?mode=module*
// @icon https://www.google.com/s2/favicons?sz=64&domain=komica1.org
// @grant        none
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @require      https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/533951/komica%E8%A8%98%E6%86%B6%E7%99%BC%E6%96%87%E8%87%AA%E8%A8%82%E5%90%8D%E7%A8%B1%E8%B7%9F%E9%A1%9E%E5%88%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/533951/komica%E8%A8%98%E6%86%B6%E7%99%BC%E6%96%87%E8%87%AA%E8%A8%82%E5%90%8D%E7%A8%B1%E8%B7%9F%E9%A1%9E%E5%88%A5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 避免 jQuery 衝突
    const $ = window.jQuery.noConflict(true);

    // 檢查當前網址，排除線程列表頁
    if (/mode=module/.test(window.location.search) && /load=mod_threadlist/.test(window.location.search)) {
        console.log('檢測到線程列表頁（mode=module&load=mod_threadlist），腳本已退出');
        return;
    }

    // 修補 $.isMobile 以避免 script.js 錯誤
    $.isMobile = function() {
        return /Mobi|Android/i.test(navigator.userAgent);
    };

    // 等待 DOM 加載完成
    $(document).ready(function() {
        // 使用 MutationObserver 監聽動態載入的元素，增加穩定性
        const observer = new MutationObserver((mutations, obs) => {
            initScript();
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // 立即執行初始化
        initScript();

        function initScript() {
            // 主題切換兼容邏輯
            const $themeSelector = $('#theme-selector');
            if ($themeSelector.length) {
                // 初始化：優先從 localStorage 讀取主題
                const savedTheme = localStorage.getItem('theme') || '';
                if (savedTheme && $themeSelector.find(`option[value="${savedTheme}"]`).length) {
                    $themeSelector.val(savedTheme);
                    applyTheme(savedTheme);
                }

                // 監聽主題選擇器變化，保存到 localStorage
                $themeSelector.off('change.custom').on('change.custom', function() {
                    const selectedTheme = $(this).val();
                    localStorage.setItem('theme', selectedTheme);
                    applyTheme(selectedTheme);
                });

                // 應用主題函數
                function applyTheme(theme) {
                    const $themeLink = $('link.second-style');
                    if ($themeLink.length) {
                        if (theme === 'dark.css') {
                            $themeLink.attr('href', '/common/css/' + theme);
                        } else {
                            $themeLink.attr('href', ''); // 或 '/common/css/default.css'
                        }
                    }
                }
            }

            // 檢查 quickreply 表單並啟用拖拽
            const $quickReply = $('#quickreply');
            if ($quickReply.length) {
                $quickReply.draggable({
                    handle: '.quickreply-head',
                    containment: 'window'
                });
            }

            // 使用前綴避免 localStorage 衝突
            const prefix = 'komica-custom-';

            // 處理名稱輸入框
            const $nameInputFname = $('#fname');
            const $nameInputPlaceholder = $("input[placeholder='名稱']:not(.hide)");
            const $nameInputs = $().add($nameInputFname).add($nameInputPlaceholder);

            if ($nameInputs.length) {
                $nameInputs.each(function() {
                    const $input = $(this);
                    // 避免重複添加按鈕
                    if ($input.next('.set-name-btn').length) return;

                    const $setNameBtn = $('<button type="button" class="set-name-btn" style="font-family: Arial; margin-left: 5px;">設置名稱</button>');
                    $input.after($setNameBtn);

                    $setNameBtn.on('click', function() {
                        const customName = prompt('請輸入自訂名稱：', $input.val() || '');
                        if (customName !== null && customName.trim() !== '') {
                            const maxLength = $input.attr('id') === 'fname' ? 100 : Infinity;
                            const trimmedName = customName.substring(0, maxLength);
                            $input.val(trimmedName);
                            localStorage.setItem(prefix + 'input-name-' + ($input.attr('id') || 'placeholder'), trimmedName);
                        }
                    });

                    const savedName = localStorage.getItem(prefix + 'input-name-' + ($input.attr('id') || 'placeholder'));
                    if (savedName) {
                        $input.val(savedName);
                    }
                });
            }

            // 處理類別輸入框
            const $categoryInputs = $("input[name='category']");
            if ($categoryInputs.length) {
                $categoryInputs.each(function() {
                    const $input = $(this);
                    // 避免重複添加按鈕
                    if ($input.next('.set-category-btn').length) return;

                    const $setCategoryBtn = $('<button type="button" class="set-category-btn" style="font-family: Arial; margin-left: 5px;">設置類別</button>');
                    $input.after($setCategoryBtn);

                    $setCategoryBtn.on('click', function() {
                        const customCategory = prompt('請輸入類別標籤（以逗號分隔）：', $input.val() || '');
                        if (customCategory !== null && customCategory.trim() !== '') {
                            const tags = customCategory.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
                            if (tags.length > 0) {
                                const categoryValue = tags.join(', ');
                                $input.val(categoryValue);
                                localStorage.setItem(prefix + 'input-category-' + ($input.attr('name') || 'category'), categoryValue);
                            } else {
                                alert('請輸入至少一個有效的標籤！');
                            }
                        }
                    });

                    const savedCategory = localStorage.getItem(prefix + 'input-category-' + ($input.attr('name') || 'category'));
                    if (savedCategory) {
                        $input.val(savedCategory);
                    }
                });
            }
        }
    });
})();