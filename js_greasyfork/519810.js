// ==UserScript==
// @name         长安大学本科教务系统监考安排修复助手
// @namespace    http://changan-university-invigilation-fixer/
// @license MIT
// @version      1.1
// @description  “长安大学本科教务系统监考安排修复助手” 解决了在监考安排功能中，当课程包含来自多个学院的学生时，无法正确查找监考老师的问题。可以通过单选框在所选学院中查找并安排监考老师。
// @author       Leavesflying
// @match        http://bkjw.chd.edu.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519810/%E9%95%BF%E5%AE%89%E5%A4%A7%E5%AD%A6%E6%9C%AC%E7%A7%91%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E7%9B%91%E8%80%83%E5%AE%89%E6%8E%92%E4%BF%AE%E5%A4%8D%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/519810/%E9%95%BF%E5%AE%89%E5%A4%A7%E5%AD%A6%E6%9C%AC%E7%A7%91%E6%95%99%E5%8A%A1%E7%B3%BB%E7%BB%9F%E7%9B%91%E8%80%83%E5%AE%89%E6%8E%92%E4%BF%AE%E5%A4%8D%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 拦截 XMLHttpRequest 请求
    function interceptRequests() {
        const originalOpen = XMLHttpRequest.prototype.open;
        const originalSend = XMLHttpRequest.prototype.send;

        XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
            this._url = url;
            originalOpen.apply(this, arguments);
        };

        XMLHttpRequest.prototype.send = function(body) {
            if (this._url && this._url.includes('getDepartMonitors.action')) {
                if (body) {
                    let params = new URLSearchParams(body);
                    if (params.has('departIds')) {
                        let originalDepartIds = params.get('departIds');
                        console.log('原始 departIds:', originalDepartIds);
                        let departIdsArray = originalDepartIds.split(',');

                        let selectedRadioIndex = document.querySelector('input[name="examiner"]:checked')?.value;
                        if (selectedRadioIndex !== undefined && selectedRadioIndex < departIdsArray.length) {
                            params.set('departIds', departIdsArray[selectedRadioIndex]);
                            body = params.toString();
                        }
                    }
                }
            }
            originalSend.apply(this, [body]);
        };
    }

    // 添加单选按钮到表格
    function addRadioButtonsToTable() {
        setTimeout(function() { 
            let table = document.querySelector('#examinerTable');
            if (table) {
                let rows = table.rows;
                if (rows.length > 1) {
                    let cell = rows[1].cells[1];
                    let lines = cell.innerHTML.split('<br>');
                    if (lines.length > 1) {
                        cell.innerHTML = '';
                        lines.forEach(function(line, index) {
                            let radio = document.createElement('input');
                            radio.type = 'radio';
                            radio.name = 'examiner';
                            radio.value = index;
                            cell.appendChild(radio);
                            cell.appendChild(document.createTextNode(line));
                            cell.appendChild(document.createElement('br'));
                        });
                    }
                }
            }
        }, 500); 
    }

    // 初始化脚本
    interceptRequests();
    document.addEventListener('click', function(event) {
        if (event.target.matches('#monitorBtn')) {
            addRadioButtonsToTable();
        }
    }, false);

})();
