// ==UserScript==
// @name         BangumiCleaner
// @namespace    https://github.com/Adachi-Git/BangumiCleaner
// @version      0.2
// @description  删除页面中所有时间线记录和条目
// @author       Adachi
// @match        *://bangumi.tv/user/*/timeline
// @match        *://bgm.tv/user/*/timeline
// @match        *://chii.in/user/*/timeline
// @match        *://bangumi.tv/*/list/*
// @match        *://bgm.tv/*/list/*
// @match        *://chii.in/*/list/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487292/BangumiCleaner.user.js
// @updateURL https://update.greasyfork.org/scripts/487292/BangumiCleaner.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var delayTime = 1;


    // 定义不同类型的 fetchLinks
    var fetchLinks = {
        timeline: function(button) {
            return button.href + '?gh='+ '&ajax=1';
        },
        game: function(gameId, ghParam) {
            return 'https://bangumi.tv/subject/' + gameId + '/remove?gh=' + ghParam;
        }
    };

    // 创建一个按钮元素
    var deleteItemsButton = document.createElement('button');
    deleteItemsButton.textContent = '删除时间线记录和条目';
    deleteItemsButton.style.position = 'fixed';
    deleteItemsButton.style.top = '10px';
    deleteItemsButton.style.left = '10px';
    deleteItemsButton.style.zIndex = '9999';

    // 将按钮添加到页面上
    document.body.appendChild(deleteItemsButton);

    // 添加点击事件监听器
    deleteItemsButton.addEventListener('click', function() {
        // 弹出确认对话框
        var confirmDelete = confirm('确定要开始删除时间线记录和条目吗？');
        if (confirmDelete) {
            // 删除操作函数
            function deleteItems(deleteButtons, fetchMethod) {
                return new Promise(function(resolve, reject) {
                    var counter = 0;
                    var totalItems = deleteButtons.length;

                    function deleteNextItems() {
                        var batch = [];
                        for (var i = 0; i < 50 && counter < totalItems; i++, counter++) {
                            var button = deleteButtons[counter];
                            var link;

                            // 获取请求链接
                            if (fetchMethod === 'timeline') {
                                link = fetchLinks.timeline(button);
                            } else if (fetchMethod === 'game') {
                                // 获取页面的 gh 和 id 参数值
                                var gameId = button.getAttribute('onclick').match(/\d+/);
                                var ghParam = button.getAttribute('onclick').match(/'([^']+)'/);
                                if (gameId && ghParam) {
                                    link = fetchLinks.game(gameId[0], ghParam[1]);
                                }
                            }

                            // 添加到批量删除请求中
                            if (link) {
                                batch.push(fetch(link, {
                                    method: 'GET',
                                    headers: getHeaders()
                                }));
                            }
                        }

                        // 发送批量删除请求
                        Promise.all(batch)
                            .then(responses => {
                            responses.forEach(response => {
                                if (!response.ok) {
                                    throw new Error('删除请求失败');
                                }
                            });
                            console.log('成功删除了 ' + batch.length + ' 个条目');
                            if (counter < totalItems) {
                                setTimeout(deleteNextItems, 1000); // 等待一秒后继续删除下一批
                            } else {
                                resolve(); // 所有条目都已删除
                            }
                        })
                            .catch(error => {
                            console.error('删除请求错误:', error);
                            deleteNextItems(); // 出错时继续删除下一批
                        });
                    }


                    deleteNextItems();
                });
            }


            // 获取请求头
            function getHeaders() {
                return {
                    'Accept': '*/*',
                    'Accept-Encoding': 'gzip, deflate, br',
                    'Accept-Language': 'zh-CN,zh;q=0.9',
                    'Connection': 'keep-alive',
                    'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
                    'Cookie': document.cookie,
                    'Host': window.location.hostname,
                    'Referer': window.location.href,
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-origin',
                    'User-Agent': navigator.userAgent,
                    'X-Requested-With': 'XMLHttpRequest'
                };
            }

            // 删除时间线记录和游戏条目
            Promise.all([
                deleteItems(document.querySelectorAll('.tml_del'), 'timeline'),
                deleteItems(document.querySelectorAll('.collectModify a:last-child'), 'game')
            ])
                .then(() => console.log('所有记录和条目已成功删除'))
                .catch(error => console.error('删除过程中发生错误:', error));
        }
    });
})();