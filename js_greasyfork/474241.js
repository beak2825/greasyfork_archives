// ==UserScript==
// @name         URL Redirector
// @namespace    http://your-namespace.com
// @version      1.0
// @description  Redirects specified URLs to new destinations
// @match        http://*/*
// @match        https://*/*
// @grant        GM_setValue
// @grant        GM_getValue
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/474241/URL%20Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/474241/URL%20Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取已保存的重定向规则
    var redirectRules = GM_getValue('redirectRules', []);

    // 显示用户界面
    function showUserInterface() {
        var uiContainer = document.createElement('div');
        uiContainer.style.position = 'fixed';
        uiContainer.style.top = '20px';
        uiContainer.style.right = '20px';
        uiContainer.style.padding = '10px';
        uiContainer.style.backgroundColor = '#f9f9f9';
        uiContainer.style.border = '1px solid #ddd';

        // 添加标题
        var title = document.createElement('h2');
        title.innerHTML = 'URL Redirector';
        uiContainer.appendChild(title);

        // 添加规则列表
        var ruleList = document.createElement('ul');
        uiContainer.appendChild(ruleList);

        // 添加规则输入字段和按钮
        var fromInput = document.createElement('input');
        fromInput.placeholder = 'From URL';
        uiContainer.appendChild(fromInput);

        var toInput = document.createElement('input');
        toInput.placeholder = 'To URL';
        uiContainer.appendChild(toInput);

        var addButton = document.createElement('button');
        addButton.innerHTML = 'Add Rule';
        addButton.addEventListener('click', function() {
            var fromUrl = fromInput.value.trim();
            var toUrl = toInput.value.trim();

            if (fromUrl !== '' && toUrl !== '') {
                // 添加新规则到数组
                redirectRules.push({
                    from: fromUrl,
                    to: toUrl
                });

                // 清空输入字段
                fromInput.value = '';
                toInput.value = '';

                // 更新规则列表
                updateRuleList();
            }
        });
        uiContainer.appendChild(addButton);

        // 更新规则列表
        function updateRuleList() {
            ruleList.innerHTML = '';

            // 创建规则列表项
            for (var i = 0; i < redirectRules.length; i++) {
                var rule = redirectRules[i];

                var listItem = document.createElement('li');
                listItem.innerHTML = rule.from + ' -> ' + rule.to;

                var deleteButton = document.createElement('button');
                deleteButton.innerHTML = 'Delete';
                deleteButton.addEventListener('click', (function(index) {
                    return function() {
                        // 从数组中删除规则
                        redirectRules.splice(index, 1);

                        // 更新规则列表
                        updateRuleList();
                    };
                })(i));

                listItem.appendChild(deleteButton);
                ruleList.appendChild(listItem);
            }

            // 保存更新后的规则数组
            GM_setValue('redirectRules', redirectRules);
        }

        // 初始化规则列表
        updateRuleList();

        // 将用户界面添加到页面
        document.body.appendChild(uiContainer);
    }

    // 检查当前URL是否需要重定向
    function checkForRedirect() {
        var currentUrl = window.location.href;

        // 检查每个规则是否匹配当前URL
        for (var i = 0; i < redirectRules.length; i++) {
            var rule = redirectRules[i];

            if (currentUrl.includes(rule.from)) {
                // 如果匹配，则重定向到新目标URL
                var newUrl = currentUrl.replace(rule.from, rule.to);
                window.location.href = newUrl;
                break;
            }
        }
    }

    // 在页面加载完成后检查重定向
    window.addEventListener('load', function() {
        // 显示用户界面
        showUserInterface();

        // 检查重定向
        checkForRedirect();
    });
})();