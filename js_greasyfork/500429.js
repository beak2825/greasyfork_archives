// ==UserScript==
// @name         bilibili分组助手
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  增加分组按钮
// @author       Kalicyh
// @match        https://space.bilibili.com/*/fans/follow*
// @grant        none
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bilibili.com
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500429/bilibili%E5%88%86%E7%BB%84%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/500429/bilibili%E5%88%86%E7%BB%84%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取分组列表
    function getGroupArray() {
        var listItems = document.querySelectorAll('div > div.follow-sidenav > div.nav-container.follow-container > div.be-scrollbar.follow-list-container.ps > ul > li');
        var groupArray = [];
        groupArray.push({ name: listItems[3].querySelector('a').textContent.trim(), index: 2 });

        // 遍历每个 li 元素，从第六个开始，建立分组数组
        for (var i = 5; i < listItems.length; i++) {
            var item = listItems[i];
            var index = i - 2; // 标序号从1开始
            var groupName = item.querySelector('a').textContent.trim();
            groupArray.push({ name: groupName, index: index });
        }
        return groupArray;
    }

    // 插入设置分组按钮
    function insertSetGroupButton() {
        var addButton = createSetGroupButton();

        // 尝试多次将按钮插入到页面中的特定位置
        function tryInsertButton() {
            var actionContainer = document.querySelector('div > div.follow-main > div.follow-header.follow-header-info > div > div');
            if (actionContainer) {
                actionContainer.insertBefore(addButton, actionContainer.firstChild);
                console.log('按钮成功添加到页面中');
            } else {
                console.log('未找到添加位置，稍后重试...');
                setTimeout(tryInsertButton, 1000); // 等待1秒后重新尝试插入按钮
            }
        }

        // 开始尝试插入按钮
        tryInsertButton();
    }

    // 创建设置分组按钮
    function createSetGroupButton() {
        var addButton = document.createElement('button');
        addButton.className = 'fans-action-btn follow';
        addButton.style.marginRight = '10px';

        var buttonText = document.createElement('span');
        buttonText.textContent = '设置分组';
        buttonText.className = 'fans-action-text';

        addButton.appendChild(buttonText);

        addButton.addEventListener('click', function() {
            var groupArray = getGroupArray();

            // 找到所有的 li 元素
            var listItems = document.querySelectorAll('#page-follows > div > div.follow-main > div.follow-content.section > div.content > ul.relation-list > li');

            // 遍历每个 li 元素
            listItems.forEach(function(item, index) {
                groupArray.forEach(function(group) {
                    var button = createGroupButton(group.name);

                    var actionContainer = item.querySelector('div:nth-child(3) > div');
                    if (actionContainer) {
                        actionContainer.insertBefore(button, actionContainer.firstChild);
                    } else {
                        console.log('未找到 li 元素的 action 容器');
                        return;
                    }

                    button.addEventListener('click', function() {
                      console.log(item)
                      console.log(group.index)
                        clickSetGroupOption(item, group.index);
                    });
                });
            });
        });

        return addButton;
    }

    // 创建分组按钮
    function createGroupButton(groupName) {
        var button = document.createElement('button');
        button.className = 'fans-action-btn fans-action-follow';
        button.style.marginRight = '10px';

        var buttonSpan = document.createElement('span');
        buttonSpan.textContent = groupName;
        buttonSpan.className = 'fans-action-text';

        button.appendChild(buttonSpan);

        return button;
    }

    // 点击设置分组选项
    function clickSetGroupOption(item, index) {
        var setGroupOption = item.querySelector('.be-dropdown-menu .be-dropdown-item:nth-child(1)');
        if (setGroupOption) {
            setGroupOption.click();

            setTimeout(function() {
                var selector = `body > div.follow-dialog-wrap > div > div.content > div.group-list > ul > li:nth-child(${index}) > label`;
                var setGroup = document.querySelector(selector);
                if (setGroup) {
                    setGroup.click();

                    setTimeout(function() {
                        var saveOption = document.querySelector('body > div.follow-dialog-wrap > div > div.bottom > button');
                        if (saveOption) {
                            saveOption.click();
                        } else {
                            console.log('未找到保存选项');
                        }
                    }, 100);
                } else {
                    console.log('未找到分组选项');
                }
            }, 500);
        } else {
            console.log('未找到设置分组选项');
        }
    }

    // 初始化插入按钮
    insertSetGroupButton();

})();
