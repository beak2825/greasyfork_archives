// ==UserScript==
// @name         u9c9.com 链接屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  在网页上添加一个按钮，用于隐藏特定的URL，并可以编辑黑名单。
// @author       
// @match        *://*.u9a9.com/*
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491464/u9c9com%20%E9%93%BE%E6%8E%A5%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/491464/u9c9com%20%E9%93%BE%E6%8E%A5%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建一个按钮用于编辑黑名单
    var $editButton = $('<button style="position: fixed; bottom: 20px; left: 20px; z-index: 9999;">编辑黑名单</button>');
    $editButton.on('click', function() {
        var blockedUrls = JSON.parse(localStorage.getItem('blockedUrls')) || [];
        var urlList = blockedUrls.join("\n");

        // 创建一个弹出窗口
        var $popup = $('<div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); background-color: #fff; padding: 20px; border: 1px solid #ccc; box-shadow: 0 2px 4px rgba(0,0,0,0.2); z-index: 99999;">'+
                       '<div style="text-align: right;"><button id="closeButton" style="cursor: pointer;">关闭</button></div>'+ // 添加关闭按钮
                       '<h3>编辑黑名单列表</h3>'+
                       '<textarea id="blacklistTextarea" style="width: 300px; height: 200px;"></textarea>'+
                       '<br>'+
                       '<button id="saveButton">保存</button>'+
                       '</div>');

        // 将黑名单列表加载到文本框中
        $popup.find('#blacklistTextarea').val(urlList);

        // 保存按钮点击事件
        $popup.find('#saveButton').on('click', function() {
            var newUrlList = $popup.find('#blacklistTextarea').val();
            blockedUrls = newUrlList.split("\n").filter(url => url.trim() !== "");
            localStorage.setItem('blockedUrls', JSON.stringify(blockedUrls));
            $popup.remove(); // 移除弹出窗口
        });

        // 关闭按钮点击事件
        $popup.find('#closeButton').on('click', function() {
            $popup.remove(); // 移除弹出窗口
        });

        // 将弹出窗口添加到页面
        $('body').append($popup);
    });

    // 将编辑黑名单按钮添加到页面
    $('body').append($editButton);

    // 隐藏已经在黑名单中的链接
    hideBlockedUrls();

    // 在每行的最后新增一个按钮
    $('div.container div.table-responsive table.table tbody tr.default').each(function() {
        var $row = $(this);
        var url = $row.find('td:eq(1) a').attr('href'); // 获取链接地址
        var title = $row.find('td:eq(1) a').text().trim(); // 获取链接标题

        // 创建一个按钮
        var $button = $('<button>屏蔽</button>');
        $button.on('click', function() {
            // 将链接地址和标题添加到 localStorage，表示需要屏蔽的 URL
            var blockedUrls = JSON.parse(localStorage.getItem('blockedUrls')) || [];
            blockedUrls.push(title + ': ' + url);
            localStorage.setItem('blockedUrls', JSON.stringify(blockedUrls));

            // 隐藏被屏蔽按钮所在的行
            $row.hide();
        });

        // 将按钮添加到当前行的最后一个单元格
        $row.find('td:last-child').append($button);
    });

    // 隐藏已经在黑名单中的链接
    function hideBlockedUrls() {
        var blockedUrls = JSON.parse(localStorage.getItem('blockedUrls')) || [];

        $('div.container div.table-responsive table.table tbody tr.default').each(function() {
            var $row = $(this);
            var url = $row.find('td:eq(1) a').attr('href'); // 获取链接地址
            var title = $row.find('td:eq(1) a').text().trim(); // 获取链接标题

            // 检查当前链接是否在黑名单中
            if (blockedUrls.includes(title + ': ' + url)) {
                // 如果在黑名单中，则隐藏按钮所在的行
                $row.hide();
            }
        });
    }

})();
