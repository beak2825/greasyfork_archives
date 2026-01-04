// ==UserScript==
// @name         薪酬管理系统增强插件
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  获取全年数据统计
// @author       luc
// @match        http://it.maxvisioncloud.com:8088/salary/*
// @icon         http://maxvision.eicp.net:52800/maxhome/ui/images/pmi.png
// @grant        GM_xmlhttpRequest
// @grant        GM_setValue
// @grant        GM_getValue
// @run-at       document-idle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/516258/%E8%96%AA%E9%85%AC%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/516258/%E8%96%AA%E9%85%AC%E7%AE%A1%E7%90%86%E7%B3%BB%E7%BB%9F%E5%A2%9E%E5%BC%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const today = new Date();
    const currentYear = today.getFullYear();
    let currentMonth = today.getMonth() + 1;

    if (today.getDate() < 20) {
        currentMonth -= 1;
    }

    let totalSalarySum = 0;
    let realSalarySum = 0;
    let gsStrSum = 0;

    async function fetchDataForMonths() {
        for (let month = 1; month <= currentMonth; month++) {
            const monthStr = `${currentYear}-${month < 10 ? '0' : ''}${month}`;

            const url = `http://it.maxvisioncloud.com:8088/salary/sa/salaryGrant/selectByMonthId?month=${monthStr}`;

            await new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    method: 'GET',
                    url: url,
                    onload: function(response) {
                        try {
                            const data = JSON.parse(response.responseText);
                            totalSalarySum += parseFloat(data.totalSalary || 0);
                            realSalarySum += parseFloat(data.realSalary || 0);
                            gsStrSum += parseFloat(data.gsStr || 0);
                        } catch (error) {
                        } finally {
                            resolve();
                        }
                    },
                    onerror: function() {
                        resolve();
                    }
                });
            });
        }


        // 获取目标父元素
        const parentElement = document.querySelector('.kt-portlet.gz-cont');

        // 你要插入的HTML元素
        const newHtml = `
<div class="kt-portlet gz-cont">
    <div class="kt-portlet__body" style="padding:20px;position: relative;">
        <p class="xz-title">全年工资累计</p>
        <div class="persalary-poas">
        </div>
        <form class="layui-form chakan-modal persalary-list" action="" id="addUser">
            <input type="hidden" id="id2" name="id" value="">
            <div class="layui-tab" style="margin-bottom:0;">
                <div class="layui-tab-content">
                    <div class="table-text-tile" style="margin-top: 10px;">截至目前(${currentYear}/01~${currentYear}/${currentMonth-1 < 10 ? '0' : ''}${currentMonth-1})：</div>
                    <div class="layui-tab-item layui-show">
                        <div class="persalary-ul">
                            <ul>
                                <li>
                                    <span>累计薪酬：</span>
                                    <span class="lispan">${totalSalarySum.toFixed(2)}</span>
                                </li>
                                <li>
                                    <span>累计实发薪资：</span>
                                    <span class="lispan">${realSalarySum.toFixed(2)}</span>
                                </li>
                                <li>
                                    <span>累计缴纳个税：</span>
                                    <span class="lispan">${gsStrSum.toFixed(2)}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </div>
</div>
`;

        if (parentElement) {
            parentElement.insertAdjacentHTML('afterend', newHtml);
        } else {
            console.log('目标元素未找到');
        }
    }

    fetchDataForMonths();
})();
