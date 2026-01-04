// ==UserScript==
// @name         显示公网IP和相关信息test
// @namespace    http://tampermonkey.net/
// @version      3.0
// @description  在页面上显示您的公网IP地址和相关信息，以及访问统计信息、停留时间和周报总结功能，IP变化时发出提醒
// @author       dshboom
// @match        *://*/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/470732/%E6%98%BE%E7%A4%BA%E5%85%AC%E7%BD%91IP%E5%92%8C%E7%9B%B8%E5%85%B3%E4%BF%A1%E6%81%AFtest.user.js
// @updateURL https://update.greasyfork.org/scripts/470732/%E6%98%BE%E7%A4%BA%E5%85%AC%E7%BD%91IP%E5%92%8C%E7%9B%B8%E5%85%B3%E4%BF%A1%E6%81%AFtest.meta.js
// ==/UserScript==
(function() {
    'use strict';

    // 创建一个用于显示公网IP和相关信息的DOM元素
    var infoElement = document.createElement('div');
    infoElement.id = 'ip-info-element';

    // DOM元素中显示“正在加载”效果
    var loadingElement = document.createElement('p');
    loadingElement.id = 'ip-info-loading';
    loadingElement.innerHTML = '<h4>欢迎使用IP助手</h4><br>相关信息正在加载<br><p>由dshboom开发</p>';
    infoElement.appendChild(loadingElement);

    // 将信息元素添加到页面中
    document.body.appendChild(infoElement);

    // 添加自定义样式
    GM_addStyle(`
        #ip-info-element {
            position: fixed;
            top: 10px;
            left: 10px;
            padding: 10px;
            background-color: rgba(0, 0, 0, 0.5);
            color: #fff;
            font-family: Arial, sans-serif;
            font-size: 12px;
            border-radius: 5px;
            box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
            z-index: 9999;
            visibility: visible;
        }

        #ip-info-loading {
            margin: 0;
            padding: 0;
        }

        #ip-info-element p {
            margin: 5px 0;
        }
    `);

    // 发送请求获取公网IP信息
    GM_xmlhttpRequest({
        // 发送请求获取公网IP的相关信息
            method: 'GET',
            url: 'http://ip-api.com/json/',
            onload: function(response) {
                var ipInfo = JSON.parse(response.responseText);
                var ip = ipInfo.query;
                
                if((localStorage.getItem('last_ip') != null) && (ip != localStorage.last_ip))
                {
                    var ipwarning = document.createElement('p');
                    ipwarning.innerText = '你的IP与上一次进入时不同';
                    ipwarning.style.fontWeight = 'bold';
                    ipwarning.style.color = 'red';
                    infoElement.appendChild(ipwarning);
                }
                localStorage.setItem('last_ip',ip);
                // 在DOM元素中显示公网IP地址
                loadingElement.innerText = '我的IP: ' + ip;
                // 在DOM元素中显示公网IP的相关信息
                var infoElement1 = document.createElement('p');
                infoElement1.innerText = '地区: ' + ipInfo.country + '-' + ipInfo.city;
                infoElement.appendChild(infoElement1);
                // 获取当前网页的域名
                var domain = document.domain;
                // 在DOM元素中显示正在访问的网站的域名
                var domainElement = document.createElement('p');
                domainElement.innerText = '网站域名: ' + domain;
                infoElement.appendChild(domainElement);
                // 获取访问统计信息
                var totalVisits = parseInt(localStorage.getItem('totalVisits')) || 0;
                var todayVisits = parseInt(localStorage.getItem('todayVisits')) || 0;
                // 显示访问统计信息
                var totalVisitsElement = document.createElement('p');
                totalVisitsElement.innerText = '总访问次数: ' + totalVisits;
                infoElement.appendChild(totalVisitsElement);

                var todayVisitsElement = document.createElement('p');
                todayVisitsElement.innerText = '今天的访问次数: ' + todayVisits;
                infoElement.appendChild(todayVisitsElement);

                // 更新访问统计信息
                totalVisits++;
                todayVisits++;
                localStorage.setItem('totalVisits', totalVisits);
                localStorage.setItem('todayVisits', todayVisits);

                // 记录用户进入页面的时间戳
                var enterTime = new Date().getTime();

                var currentDateElement = document.createElement('p');
                    currentDateElement.innerText = '当前日期: ' + new Date().toLocaleDateString();
                    infoElement.appendChild(currentDateElement);
                // 计算用户停留时间
                var stayTime = Math.round((new Date().getTime() - enterTime) / 1000); // 转换为秒
                var stayMinutes = Math.round(stayTime / 60); // 转换为分钟

                // 存储用户停留时间
                var totalStayTime = parseInt(localStorage.getItem('totalStayTime')) || 0;
                totalStayTime += stayMinutes;
                localStorage.setItem('totalStayTime', totalStayTime);

                // 存储今日停留时间
                var todayStayTime = parseInt(localStorage.getItem('todayStayTime')) || 0;
                todayStayTime += stayMinutes;
                localStorage.setItem('todayStayTime', todayStayTime);

                // 生成周报总结
                if (new Date().getDay() === 0) { // 如果是周日
                    var weeklySummary = '本周总停留时间: ' + totalStayTime + '分钟';
                    localStorage.setItem('weeklySummary', weeklySummary);
                }

                // 显示今日停留时间和当前日期
                var todayStayTimeElement = document.createElement('p');
                todayStayTimeElement.innerText = '今日停留时间: ' + (parseInt(localStorage.getItem('todayStayTime')) || 0) + '分钟';
                infoElement.appendChild(todayStayTimeElement);
            },
            onerror: function(error) {
                loadingElement.innerText = 'IP信息获取失败';
            }
    });

    // 添加鼠标移动事件，隐藏/显示窗口
    document.addEventListener('mousemove', function(event) {
        var mouseX = event.clientX;
        var mouseY = event.clientY;
        var infoElementRect = infoElement.getBoundingClientRect();

        // 如果鼠标在窗口内，则隐藏窗口；否则显示窗口
        if (
            mouseX >= infoElementRect.left &&
            mouseX <= infoElementRect.right &&
            mouseY >= infoElementRect.top &&
            mouseY <= infoElementRect.bottom
        ) {
            infoElement.style.visibility = 'hidden';
        } else {
            infoElement.style.visibility = 'visible';
        }
    });
})();