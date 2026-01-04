// ==UserScript==
// @name         记录和恢复帖子位置
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在网页中保存和恢复帖子的位置
// @author       静伟
// @match        https://wx.zsxq.com/*   //请将此行替换为您的网站
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/468796/%E8%AE%B0%E5%BD%95%E5%92%8C%E6%81%A2%E5%A4%8D%E5%B8%96%E5%AD%90%E4%BD%8D%E7%BD%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/468796/%E8%AE%B0%E5%BD%95%E5%92%8C%E6%81%A2%E5%A4%8D%E5%B8%96%E5%AD%90%E4%BD%8D%E7%BD%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 在页面添加“保存记录”和“恢复记录”按钮
    var saveBtn = document.createElement('button');
    saveBtn.textContent = '保存记录';
    saveBtn.style.position = 'fixed';
    saveBtn.style.bottom = '50px';
    saveBtn.style.right = '20px';
    document.body.appendChild(saveBtn);

    var restoreBtn = document.createElement('button');
    restoreBtn.textContent = '恢复记录';
    restoreBtn.style.position = 'fixed';
    restoreBtn.style.bottom = '20px';
    restoreBtn.style.right = '20px';
    document.body.appendChild(restoreBtn);

    // 当点击“保存记录”按钮时，保存当前可见的最新帖子的时间和成员名字
    saveBtn.onclick = function () {
        var topics = document.getElementsByClassName('topic-container');
        var lastVisibleDate;
        var lastVisibleMember;
        for (var i = 0; i < topics.length; i++) {
            if (topics[i].getBoundingClientRect().top > window.innerHeight) {
                break;
            }
            var dateElement = topics[i].getElementsByClassName('date')[0];
            var memberElement = topics[i].getElementsByClassName('role member')[0];
            if (dateElement && memberElement) {
                lastVisibleDate = dateElement;
                lastVisibleMember = memberElement;
            }
        }
        if (lastVisibleDate && lastVisibleMember) {
            localStorage.setItem('lastDate', lastVisibleDate.textContent);
            localStorage.setItem('lastMember', lastVisibleMember.textContent);
            alert('记录已保存，帖子时间：' + lastVisibleDate.textContent + ', 发布成员：' + lastVisibleMember.textContent);
        }
    };

    // 当点击“恢复记录”按钮时，滚动页面直到找到保存的帖子
    restoreBtn.onclick = function () {
        var lastDateStr = localStorage.getItem('lastDate');
        var lastMemberStr = localStorage.getItem('lastMember');
        if (lastDateStr && lastMemberStr) {
            var lastDate = new Date(lastDateStr);
            function scrollToLastDate() {
                var topics = document.getElementsByClassName('topic-container');
                for (var i = 0; i < topics.length; i++) {
                    var dateElement = topics[i].getElementsByClassName('date')[0];
                    var memberElement = topics[i].getElementsByClassName('role member')[0];
                    if (dateElement && memberElement) {
                        var currentDate = new Date(dateElement.textContent);
                        var currentMember = memberElement.textContent;
                        if (currentDate.getTime() === lastDate.getTime() && currentMember === lastMemberStr) {
                            // 先执行滚动操作，再显示弹出窗口
                            dateElement.scrollIntoView();
                            setTimeout(function () {
                                alert('已跳转到成员：”' + lastMemberStr + '“在”' + lastDateStr + '“发布的帖子');
                            }, 0);
                            return;
                        } else if (currentDate < lastDate) {
                            alert('找不到' + lastDateStr + '的帖子，发布成员：' + lastMemberStr);
                            return;
                        }
                    }
                }
                window.scrollTo(0, document.body.scrollHeight);
                setTimeout(scrollToLastDate, 1000);
            }

            var menuContainer = document.getElementsByClassName('menu-container')[0];
            var items = menuContainer.getElementsByClassName('item');
            var targetItem;
            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                console.log(item.textContent); // 打印所有的item
                if (item.textContent.includes('风向标')) {
                    targetItem = item;
                    break;
                }
            }

            if (targetItem) {
                targetItem.click(); // 模拟点击操作
                // 延迟1秒后开始查找帖子，给页面足够的时间加载和跳转
                setTimeout(scrollToLastDate, 1000);
            } 

        }
    };

})();
