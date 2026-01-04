// ==UserScript==
// @name         巨量素材ID批量复制
// @namespace    https://www.kuiwaiwai.com/
// @version      0.4
// @description  批量复制巨量 素材管理->视频管理 界面中的素材ID
// @author       kuiwaiwai
// @match        https://ad.oceanengine.com/material_center/management/video?aadvid=*
// @license GNU General Public License v3.0
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/501054/%E5%B7%A8%E9%87%8F%E7%B4%A0%E6%9D%90ID%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/501054/%E5%B7%A8%E9%87%8F%E7%B4%A0%E6%9D%90ID%E6%89%B9%E9%87%8F%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 定义设置变量，非1则关闭
    let examine_screen = 1;  // 审核不通过的ID是否被忽略
    let inefficient_screen = 1;  // 低效的ID是否被忽略

    let button = document.createElement('button');
    button.style.backgroundColor = '#1890ff';
    button.style.borderRadius = '5px';
    button.style.color = 'white';
    button.style.width = "6.8rem";
    button.style.height = "2rem";
    button.innerText = 'ID批量复制';
    button.style.position = "fixed";
    button.style.bottom = "0.4rem";
    button.style.right = "0.6rem";
    button.onclick = function() {
        let ids = '';
        let rows = document.querySelectorAll('#materialTable > div > div.ovui-table__container.ovui-table__container--sticky > div.ovui-table__body-wrapper > table > tbody > tr');
        rows.forEach((row, index) => {
            let idElement = row.querySelector(`td:nth-child(2) > div > div.info-wrapper > div:nth-child(2) > span > span.oc-typography-value-int.oc-typography-value-slot`);
            let id = idElement ? idElement.innerText.split('ID:')[1].trim() : '';
            let examine_status = row.querySelector(`td:nth-child(5) > div > div.status-wrapper > div`);
            let inefficient_status = row.querySelector(`td:nth-child(6) > div > div > span > div > div`);

            // 检查是否存在审核不通过或低效的元素
            if ((examine_screen == 1 && examine_status && examine_status.innerText == '审核不通过') ||
                (inefficient_screen == 1 && inefficient_status && inefficient_status.innerText == '低效')) {
                return;
            }

            ids += id + '\n';
        });

        navigator.clipboard.writeText(ids).then(function() {
            button.innerText = '已复制';
            setTimeout(function() {
                button.innerText = 'ID批量复制';
            }, 1000);
        }, function(err) {
            console.error('异步剪贴板写入失败: ', err);
        });
    };

    document.body.appendChild(button);
})();