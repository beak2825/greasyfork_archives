// ==UserScript==
// @name         Miniflux订阅源管理
// @namespace    http://tampermonkey.net/
// @version      0.8
// @description  为每个订阅源添加勾选框，并在页面上方生成“删除”“全部标为已读”“编辑”“全选”“一键勾选错误订阅源”五个点击栏。删除时自动点击确认按钮，并美化按钮样式。同时删除指定的元素，并在订阅页面自动展开高级选项并勾选“Fetch Full Content”。
// @author       Luofengyuan
// @match        http://域名/feeds
// @match        http://域名/category/*/feeds
// @match        http://域名/subscribe
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/500722/Miniflux%E8%AE%A2%E9%98%85%E6%BA%90%E7%AE%A1%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/500722/Miniflux%E8%AE%A2%E9%98%85%E6%BA%90%E7%AE%A1%E7%90%86.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 处理订阅源页面
    function handleFeedsPage() {
        // 删除指定的元素
        var elementToRemove = document.querySelector('a.skip-to-content-link[href="#main"]');
        if (elementToRemove) {
            elementToRemove.remove();
        }

        // 创建操作按钮
        function createActionButton(text, className, onClick) {
            var button = document.createElement('button');
            button.textContent = text;
            button.className = className;
            button.style.marginRight = '10px';
            button.style.padding = '10px 15px';
            button.style.border = 'none';
            button.style.borderRadius = '5px';
            button.style.backgroundColor = '#007BFF';
            button.style.color = '#fff';
            button.style.cursor = 'pointer';
            button.style.fontSize = '14px';
            button.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
            button.onmouseover = function() {
                button.style.backgroundColor = '#0056b3';
            };
            button.onmouseout = function() {
                button.style.backgroundColor = '#007BFF';
            };
            button.onclick = onClick;
            return button;
        }

        // 在页面上方生成“删除”“全部标为已读”“编辑”“全选”“一键勾选错误订阅源”五个点击栏
        var actionContainer = document.createElement('div');
        actionContainer.style.marginBottom = '20px';
        actionContainer.style.textAlign = 'center';
        actionContainer.style.padding = '10px';
        actionContainer.style.backgroundColor = '#f8f9fa';
        actionContainer.style.borderBottom = '1px solid #e9ecef';

        var deleteButton = createActionButton('删除', 'delete-button', function() {
            document.querySelectorAll('input.feed-item-checkbox:checked').forEach(function(checkbox) {
                var item = checkbox.parentNode;
                var deleteButton = item.querySelector('.item-meta-icons-remove button');
                deleteButton.click();

                // 自动点击确认按钮
                setTimeout(function() {
                    var confirmButton = item.querySelector('.item-meta-icons-remove .confirm button:first-child');
                    if (confirmButton) {
                        confirmButton.click();
                    }
                }, 500); // 延迟500毫秒以确保确认按钮加载
            });
        });

        var markAsReadButton = createActionButton('全部标为已读', 'mark-as-read-button', function() {
            document.querySelectorAll('input.feed-item-checkbox:checked').forEach(function(checkbox) {
                var item = checkbox.parentNode;
                var markAsReadButton = item.querySelector('.item-meta-icons-mark-as-read button');
                markAsReadButton.click();
            });
        });

        var editButton = createActionButton('编辑', 'edit-button', function() {
            document.querySelectorAll('input.feed-item-checkbox:checked').forEach(function(checkbox) {
                var item = checkbox.parentNode;
                var editButton = item.querySelector('.item-meta-icons-edit a');
                editButton.click();
            });
        });

        var selectAllButton = createActionButton('全选', 'select-all-button', function() {
            document.querySelectorAll('input.feed-item-checkbox').forEach(function(checkbox) {
                checkbox.checked = true;
            });
        });

        var selectErrorFeedsButton = createActionButton('一键勾选错误订阅源', 'select-error-feeds-button', function() {
            document.querySelectorAll('article.item.feed-item.feed-parsing-error input.feed-item-checkbox').forEach(function(checkbox) {
                checkbox.checked = true;
            });
        });

        actionContainer.appendChild(deleteButton);
        actionContainer.appendChild(markAsReadButton);
        actionContainer.appendChild(editButton);
        actionContainer.appendChild(selectAllButton);
        actionContainer.appendChild(selectErrorFeedsButton);

        document.body.insertBefore(actionContainer, document.body.firstChild);

        // 为每个订阅源添加勾选框
        document.querySelectorAll('article.item.feed-item').forEach(function(item) {
            var checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'feed-item-checkbox';
            checkbox.style.marginRight = '10px';
            item.insertBefore(checkbox, item.firstChild);
        });
    }

    // 处理订阅页面
    function handleSubscribePage() {
        // 等待页面加载完成
        window.addEventListener('load', function() {
            // 找到“高级选项”details元素
            const advancedOptionsDetails = document.querySelector('details');

            // 如果details元素存在，展开它
            if (advancedOptionsDetails) {
                advancedOptionsDetails.open = true;
            }

            // 找到“Fetch Full Content”复选框
            const fetchFullContentCheckbox = document.querySelector('input[name="crawler"]');

            // 如果复选框存在，勾选它
            if (fetchFullContentCheckbox) {
                fetchFullContentCheckbox.checked = true;

                // 勾选复选框后，收起“高级选项”部分
                advancedOptionsDetails.open = false;
            }
        });
    }

    // 根据当前页面URL选择处理函数
    if (window.location.href.includes('/feeds')) {
        handleFeedsPage();
    } else if (window.location.href.includes('/subscribe')) {
        handleSubscribePage();
    }

})();