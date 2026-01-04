// ==UserScript==
// @name         AGSV-Review-Assistant
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  AGSV Review
// @author       7oomy
// @match        *://*.agsvpt.com/torrents.php?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=agsvpt.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/486942/AGSV-Review-Assistant.user.js
// @updateURL https://update.greasyfork.org/scripts/486942/AGSV-Review-Assistant.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var refresh_interval = 10*1000; // 刷新间隔
    var open_page_num = 8; // 一次打开的网页数量
    var right_distance = "6%"; // 按钮拒右侧距离
    var new_window = 0; // 打开新窗口而不是新标签页

    // 创建一个新的按钮元素
    var button = document.createElement("button");
    button.innerHTML = "打开种子";
    button.id = "myButton";
    button.style.position = "fixed";
    button.style.width = "70px";
    button.style.height = "30px";
    button.style.background = "rgb(218, 230, 242)";
    button.style.cursor = "pointer";
    button.style.zIndex = "1";
    button.style.top = "50%";
    button.style.right = right_distance;
    button.style.borderRadius = "8px";
    button.style.display = "block";

    // 添加按钮的点击事件
    button.addEventListener('click', function() {
        // 获取table元素
        var table = document.querySelector('#outer > table.main > tbody > tr > td > table.torrents');

        // 获取表格内的所有超链接
        var links = table.getElementsByTagName('a');

        // 创建一个正则表达式来匹配给定的链接格式，其中 $ 表示字符串的结尾
        var regex = /details\.php\?id=\d+&hit=1$/;

        // 计数器，用于跟踪已找到的链接数
        var count = 0;

        // 遍历链接
        for (var i = 0; i < links.length; i++) {
            // 检查链接的href属性是否符合给定的模式
            if (regex.test(links[i].href)) {
                console.log(links[i].href); // 输出链接
                if(!new_window) {
                    console.log("新标签页");
                    window.open(links[i].href, '_blank'); // 在新标签页中打开链接
                }
                else {
                    console.log("新窗口");
                    window.open(links[i].href, '_blank', 'top=0'); // 在新窗口中打开链接
                }
                count++;
                // 如果已找到五个链接，就停止循环
                if (count >= open_page_num) {
                    break;
                }
            }
        }
    });

    // 将新的按钮元素添加到body元素的末尾
    document.body.appendChild(button);

    // 创建一个新的按钮元素
    var refreshButton = document.createElement("button");
    refreshButton.innerHTML = "刷新页面";
    refreshButton.id = "myRefreshButton";
    refreshButton.style.position = "fixed";
    refreshButton.style.width = "70px";
    refreshButton.style.height = "30px";
    refreshButton.style.background = "rgb(218, 230, 242)";
    refreshButton.style.cursor = "pointer";
    refreshButton.style.zIndex = "1";
    refreshButton.style.top = "43%";
    refreshButton.style.right = right_distance;
    refreshButton.style.borderRadius = "8px";
    refreshButton.style.display = "block";

    // 添加按钮的点击事件
    refreshButton.addEventListener('click', function() {
        localStorage.setItem('autoOpenSeed', true);
        location.reload();
    });

    // 将新的按钮元素添加到body元素的末尾
    document.body.appendChild(refreshButton);

    // add a checkbox to control the auto-refresh
    let checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = 'autoRefreshCheckbox';
    checkbox.style.position = 'fixed';
    checkbox.style.top = '40%';
    checkbox.style.right = right_distance;

    // load the saved setting from localStorage
    checkbox.checked = localStorage.getItem('autoRefresh') === 'true';

    // save the setting to localStorage whenever it changes
    checkbox.addEventListener('change', function() {
        localStorage.setItem('autoRefresh', this.checked);
    });

    // add the container to the body
    document.body.appendChild(checkbox);

    function refreshPage() {
        if (localStorage.getItem('autoRefresh') === 'true') {
            location.reload();
        }
    }

    setInterval(refreshPage, refresh_interval);

    if (localStorage.getItem('autoOpenSeed') === 'true') {
        localStorage.setItem('autoOpenSeed', false);

        var table = document.querySelector('#outer > table.main > tbody > tr > td > table.torrents');

        // 获取表格内的所有超链接
        var links = table.getElementsByTagName('a');

        // 创建一个正则表达式来匹配给定的链接格式，其中 $ 表示字符串的结尾
        var regex = /details\.php\?id=\d+&hit=1$/;

        // 计数器，用于跟踪已找到的链接数
        var count = 0;

        // 遍历链接
        for (var i = 0; i < links.length; i++) {
            // 检查链接的href属性是否符合给定的模式
            if (regex.test(links[i].href)) {
                console.log(links[i].href);  // 输出链接
                if(!new_window) {
                    window.open(links[i].href, '_blank'); // 在新标签页中打开链接
                }
                else {
                    window.open(links[i].href, '_blank', 'top=0'); // 在新窗口中打开链接
                }
                count++;
                // 如果已找到五个链接，就停止循环
                if (count >= open_page_num) {
                    break;
                }
            }
        }
    }
})();