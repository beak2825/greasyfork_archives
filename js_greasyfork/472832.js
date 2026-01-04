// ==UserScript==
// @name         Resale ATC
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  遍历 class="table_container" 的 div 下的 table 的 tbody 中的特定 tr，并获取特定类的内容
// @author       You
// @match        https://resale-aus.fwwc23.tickets.fifa.com/secured/selection/resale/*
// @match        https://resale-aus.fwwc23.tickets.fifa.com/selection/resale/*
// @match        https://resale-aus.fwwc23.tickets.fifa.com/cart/reservation/*
// @match        https://resale-aus.fwwc23.tickets.fifa.com/error*

// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472832/Resale%20ATC.user.js
// @updateURL https://update.greasyfork.org/scripts/472832/Resale%20ATC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var targetURL = 'https://resale-aus.fwwc23.tickets.fifa.com/cart/reservation/0';
    var oosURL = 'https://resale-aus.fwwc23.tickets.fifa.com/error/noAvailability';
    var returnURL = 'https://resale-aus.fwwc23.tickets.fifa.com/secured/selection/resale/item?performanceId=10228543141433&productId=101397765775&lang=en'
    const delay = 3000;
    const quatity = 1;

    if (window.location.href.startsWith(targetURL)) {
        // 如果当前页面的URL以目标前缀开头，则弹出提醒窗口
        alert('购物车添加成功！');}

    if (window.location.href === oosURL) {
    window.location.replace(returnURL);}


    // 等待文档完全加载
    window.addEventListener('load', function() {
        try {
            // 检查是否存在id="no_ticket_on_sale"的section
            let noTicketSection = document.getElementById('no_ticket_on_sale');
            if (noTicketSection.style.display === 'block') {
                console.log("未发现门票销售，等待刷新页面");
                return setTimeout(function() {
                    location.reload();
                }, delay);
            }

            // 获取 class 为 "table_container" 的 div
            let tableContainer = document.querySelector('.table_container');
            let showAlert = false; // 用于跟踪是否显示了警告

            // 确保容器存在
            if (tableContainer) {
                // 获取 table 的 tbody
                let tbody = tableContainer.querySelector('table tbody');
                let buttonClickCount = 0; // 用于跟踪按钮点击次数


                // 确保 tbody 存在
                if (tbody) {
                    // 只遍历 class 同时为 "group_start" 和 "group_end" 的 tr
                    let rows = tbody.querySelectorAll('tr.group_start');
                    for (let row of rows) {
                        // 获取特定类的内容
                        let seatPath = row.querySelector('.resale-item-seatPath.seatPath')?.innerText;
                        let tariff = row.querySelector('.resale-item-subCategory.tariff')?.innerText || "";


                        // 在控制台中显示结果
                        //console.log(`座位路径: ${seatPath}`);
                        //console.log(`票价类别: ${tariff}`);

                        // 如果第三个 td 等于 "Adult"，则显示弹窗提醒并退出循环
                        //console.log(`发现门票 ${tariff}`)
                        if (tariff.includes("Adult")) {
                            console.log('发现成人门票')
                            let link = row.querySelector('.resale-item-action .button a');
                            if (link) {
                                console.log('选取门票')
                                link.click(); // 点击链接
                                buttonClickCount++; // 增加点击计数
                                console.log(`勾选第 ${buttonClickCount} 张票`)
                            }
                            // 如果链接被点击两次，则点击具有id="controls"的div中的a标签
                                if (buttonClickCount === quatity) {
                                    let bookLink = document.getElementById('book');
                                    if (bookLink && bookLink.onclick) {
                                        bookLink.onclick(); // 执行onclick中的代码
                                    }
                                    // 退出循环
                                    console.log('break')
                                    break;
                                }

                        }
                        else{console.log('None Adult')}
                    }
                }
                else{console.log('CP')}

            }
            console.log(`Error ${delay}s 后刷新`)
            setTimeout(function() {
                location.reload();
            }, delay); // 延迟后刷新



        } catch (error) {
            // 如果发生错误，记录到控制台并在10秒后刷新页面
            console.error(error);
            console.log(`Error ${delay}s 后刷新`)
            setTimeout(function() {
                location.reload();
            }, delay); // 延迟后刷新
        }
    }, false);
})();