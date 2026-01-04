// ==UserScript==
// @name         Parker's script
// @version      0.1
// @description  Add buttons to copy receive dates to clipboard
// @author       dengpanb
// @match        https://console.harmony.a2z.com/poportal/poallitems/*
// @match        https://paragon-na.amazon.com/ilac/view-ilac-report?shipmentId=*
// @match        https://console.harmony.a2z.com/beacon/ILAC/serenity?poid=*
// @grant        GM_setClipboard
// @namespace https://greasyfork.org/users/1342208
// @downloadURL https://update.greasyfork.org/scripts/502128/Parker%27s%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/502128/Parker%27s%20script.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 获取当前页面的URL
    var currentURL = window.location.href;

    // 功能1：在 https://console.harmony.a2z.com/poportal/poallitems/* 上添加按钮来复制修改后的日期
    if (currentURL.startsWith('https://console.harmony.a2z.com/poportal/poallitems/')) {
        var modifiedButton = document.createElement('button');
        modifiedButton.textContent = 'Date range';
        modifiedButton.style.position = 'fixed';
        modifiedButton.style.top = '10px';
        modifiedButton.style.right = '120px';
        modifiedButton.style.zIndex = '9999';
        modifiedButton.style.marginBottom = '10px';

        document.body.appendChild(modifiedButton);

        modifiedButton.addEventListener('click', function() {
            var spanElements = document.querySelectorAll('[receive-date]');

            if (spanElements.length !== 2) {
                alert('页面上不是两个具有 receive-date 属性的 span 元素');
                return;
            }

            var firstDate = new Date(spanElements[0].getAttribute('receive-date'));
            firstDate.setDate(firstDate.getDate() - 7);

            var secondDate = new Date(spanElements[1].getAttribute('receive-date'));
            secondDate.setDate(secondDate.getDate() + 30);

            var formatDate = function(date) {
                var month = String(date.getMonth() + 1).padStart(2, '0');
                var day = String(date.getDate()).padStart(2, '0');
                var year = date.getFullYear();
                return month + '/' + day + '/' + year;
            };

            var modifiedDates ='Date Range: '+ formatDate(firstDate) + ' to ' + formatDate(secondDate);

            GM_setClipboard(modifiedDates);
            alert('Date range: ' + modifiedDates);
        });
    }

    // 功能2：在 ILAC 上添加返回顶部按钮
    if (currentURL.startsWith('https://paragon-na.amazon.com/ilac/view-ilac-report?shipmentId=')) {
        var topButton = document.createElement("button");
        topButton.innerHTML = "";
        topButton.style.position = "fixed";
        topButton.style.bottom = "20px";
        topButton.style.right = "20px";
        topButton.style.zIndex = "1000";
        topButton.style.backgroundColor = "transparent";  // 背景透明
        topButton.style.border = "none";
        topButton.style.padding = "10px";
        topButton.style.borderRadius = "5px";
        topButton.style.cursor = "pointer";
        topButton.style.boxShadow = "0px 0px 10px rgba(0, 0, 0, 0.5)";
        topButton.style.fontSize = "20px";
        topButton.style.display = "none"; // 默认隐藏
        topButton.style.backgroundImage = "url('https://yourimagehost.com/arrow.png')"; // 这里替换为箭头图像的URL
        topButton.style.backgroundSize = "cover"; // 使背景图像覆盖整个按钮

        window.addEventListener("scroll", function() {
            if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
                topButton.style.display = "block";
            } else {
                topButton.style.display = "none";
            }
        });

        topButton.addEventListener("click", function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });

        document.body.appendChild(topButton);
    }

    // 功能3：在 https://paragon-na.amazon.com/ilac 上添加按钮来复制追踪码
    if (currentURL.startsWith('https://paragon-na.amazon.com/ilac')) {
        window.addEventListener('load', function() {
            // 延迟以确保所有动态内容都加载完毕
            setTimeout(function() {
                // 创建按钮
                var trackingButton = document.createElement("button");
                trackingButton.innerHTML = "Copy Tracking";
                trackingButton.style.position = "fixed";
                trackingButton.style.top = "10px";
                trackingButton.style.right = "10px";
                trackingButton.style.zIndex = 10000;
                trackingButton.style.backgroundColor = "#ffcc00"; // 背景颜色为黄色
                trackingButton.style.border = "1px solid #ffcc00"; // 边框为黑色
                trackingButton.style.padding = "10px"; // 内边距
                trackingButton.style.color = "#000"; // 字体颜色为黑色
                trackingButton.style.borderRadius = "5px"; // 边框圆角
                trackingButton.style.fontWeight = "bold"; // 字体加粗
                trackingButton.style.fontSize = "14px"; // 字体大小
                 trackingButton.style.cursor = "pointer";
                document.body.appendChild(trackingButton);

                // 调试信息
                console.log("按钮已添加到页面");

                // 复制所有追踪码到剪贴板
                trackingButton.addEventListener("click", async function() {
                    try {
                        // 查找所有目标元素
                        var targetElements = document.querySelectorAll("a.a-link-normal[href^='http://www.packagetrackr.com/track/']");
                        if (targetElements.length > 0) {
                            var trackingCodes = Array.from(targetElements).map(function(element) {
                                var hrefValue = element.getAttribute("href");
                                return hrefValue.split('/').pop();
                            });

                            // 去重
                            var uniqueTrackingCodes = [...new Set(trackingCodes)];
                            var trackingCodesString = uniqueTrackingCodes.join('\n');

                            console.log("追踪码: " + trackingCodesString); // 输出追踪码到控制台
                            await navigator.clipboard.writeText(trackingCodesString);
                            alert("所有追踪码已复制到剪贴板:\n" + trackingCodesString);
                        } else {
                            console.error("未找到指定的HTML元素");
                            alert("未找到指定的HTML元素");
                        }
                    } catch (err) {
                        console.error("复制到剪贴板失败: ", err);
                        alert("复制到剪贴板失败");
                    }
                });
            }, 3000); // 延迟3秒
        });
    }
})();