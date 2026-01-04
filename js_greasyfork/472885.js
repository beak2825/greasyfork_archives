// ==UserScript==
// @name         webhd.cc磁力批量解析
// @namespace    http://tampermonkey.net/
// @version      0.4
// @license MIT
// @description  webhd.cc磁力批量解析!
// @author       dsqh
// @match        https://webhd.cc/d/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=webhd.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472885/webhdcc%E7%A3%81%E5%8A%9B%E6%89%B9%E9%87%8F%E8%A7%A3%E6%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/472885/webhdcc%E7%A3%81%E5%8A%9B%E6%89%B9%E9%87%8F%E8%A7%A3%E6%9E%90.meta.js
// ==/UserScript==

(function() {
    'use strict';
        window.onload = function() {
 // 查找所有的.bg-white元素
            var bgWhiteElements = document.querySelectorAll(".bg-white");
            var dowloadEl = document.querySelector("body > div.container > div > div > div > div.col-lg-9 > div.pt-2 > div > div > div:nth-child(6) > div")

            if(dowloadEl){
            // 创建一个新的按钮元素
            var button1 = document.createElement('button');
            button1.innerHTML = '获取当前文件磁力链'; // 设置按钮的文本内容
            button1.style.display = "block";
            button1.style.marginTop = "20px";
            button1.style.padding = "10px";
            button1.style.backgroundColor = "#007bff";
            button1.style.color = "white";
            button1.style.border = "none";
            button1.style.cursor = "pointer";
            // 将按钮元素插入到父元素的首位
            dowloadEl.insertBefore(button1, dowloadEl.firstChild);
            button1.addEventListener('click', function() {
                var currentURL = window.location.href
                console.log("currentURL",currentURL)
                var pattern = /\/([^\/]+)$/;
                var matches = currentURL.match(pattern);
                var querUrl = ""
                if (matches) {
                    var data = matches[1];
                    console.log(data);
                    querUrl = "https://webhd.cc/ajax/down?duid="+data+"&type=magnet"
                    fetch(querUrl)
                        .then(response => response.json())
                        .then(data => {
                        // 处理返回的数据
                        console.log(data);
                        navigator.clipboard.writeText(data.msg).then(function() {
                            alert('磁力链接已复制到剪贴板，by:淡水千痕');
                        }, function(err) {
                            alert('复制到剪贴板失败: ' + err);
                        });
                    })
                        .catch(error => {
                        // 处理请求错误
                        console.log(error);
                    });
                } else {
                    console.log("未找到匹配的数据");
                }
            })
            }

            bgWhiteElements.forEach(function(bgWhiteElement) {
                // 在每个.bg-white元素中查找.bg-light元素
                var bgLightElements = bgWhiteElement.querySelectorAll(".bg-light");
                var rowAElements = bgWhiteElement.querySelectorAll(".row a.ps-2.f14");
                var hrefs = []
                rowAElements.forEach(function(rowAElement) {
                    // 获取每个元素的href属性
                    var href = rowAElement.getAttribute('href');
                    var match = href.match(/\/(\d+)$/);
                    if (match) {
                        console.log(match[1]);
                        hrefs.push("https://webhd.cc/ajax/down?duid="+match[1]+"&type=magnet");
                    }
                });
                console.log("hrefs",hrefs);
                bgLightElements.forEach(function(bgLightElement) {
                    // 创建一个新的按钮元素
                    var newButton = document.createElement("button");
                    newButton.innerHTML = "获取下面列表全部磁力链接"; // 设置按钮的文字

                    // 使用JavaScript添加样式
                    newButton.style.display = "block";
                    newButton.style.marginTop = "20px";
                    newButton.style.padding = "10px";
                    newButton.style.backgroundColor = "#007bff";
                    newButton.style.color = "white";
                    newButton.style.border = "none";
                    newButton.style.cursor = "pointer";

                    // 添加点击事件
                    newButton.addEventListener('click', function() {
                        var promises = []; // 用于存储所有的请求

                        // 对于每个href，发起一个GET请求
                        hrefs.forEach(function(href) {
                            var promise = fetch(href)
                            .then(response => response.json())
                            .then(data => {
                                return data; // 返回请求的结果
                            });

                            promises.push(promise); // 将请求添加到数组中
                        });

                        // 当所有请求都完成后
                        Promise.all(promises).then(function(results) {

                            // 将所有的结果连接成一个字符串
                            var allData = results.map(obj => obj.msg).join('\n');
                            console.log('allData',allData)
                            // 将结果复制到剪贴板
                            navigator.clipboard.writeText(allData).then(function() {
                                alert('所有磁力链接已复制到剪贴板，by:淡水千痕');
                            }, function(err) {
                                alert('复制到剪贴板失败: ' + err);
                            });
                        });
                    });

                    // 将新的按钮添加到.bg-light元素的子节点
                    bgLightElement.appendChild(newButton);
                });
            });
        }
    // Your code here...
})();