// ==UserScript==
// @name         Recommendation
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Recommendation1
// @author       RenZhijie
// @match        https://dispatch.uniuni.com/main
// @icon         https://www.google.com/s2/favicons?sz=64&domain=uniuni.com
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/529652/Recommendation.user.js
// @updateURL https://update.greasyfork.org/scripts/529652/Recommendation.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let token = localStorage.auth_token
    let username = localStorage.username
    function addCustomButton() {
        const history = document.querySelector('.MuiIconButton-root[aria-label="history"]');

        if (!history) {
            console.log("搜索按钮未找到，等待页面加载...");
            setTimeout(addCustomButton, 1000); // 1秒后重试
            return;
        }
        const newButton = document.createElement('button');
        newButton.textContent = "建议";
        newButton.style.marginRight = "20px"; // 添加一些间距
        newButton.style.padding = "8px 12px";
        newButton.style.border = "none";
        newButton.style.backgroundColor = "#ff9800";
        newButton.style.color = "white";
        newButton.style.borderRadius = "4px";
        newButton.style.cursor = "pointer";
        newButton.type = "button";
        newButton.addEventListener('click', async function() {
            document.querySelector('.MuiIconButton-root[aria-label="search"]').click()
            const tno = document.querySelector('#searchSN').value
            const data = await getOrderDetail(tno, token);
            const order_id = data.data.orders.order_id
            const record = await getScanRecord(order_id);
            const biz_data = record?.biz_data;
            const count = await countScannedTimes(biz_data);
            if(count >= 2){
                showCustomMessage("入库", "#4CAF50");  // Green for "入库"
            }else{
                showCustomMessage("继续配送", "#FF9800");  // Orange for "继续配送"
            }
        });
        history.insertAdjacentElement('afterend', newButton);
    }
    async function countScannedTimes(record) {
        let count = 0;
        // Fix the loop to use `record[i].status` instead of `record.i.status`
        for (var i = 0; i < record.length; i++) {
            if (record[i].status === 0) {
                count++;
            }
        }
        return count;
    }
    async function getOrderDetail(tno,token) {
        if(!tno){
            alert("缺少单号")
            return
        }
        const url = `https://dispatch-api.uniuni.com/map/getorderdetail?tno=${tno}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
            });

            const responseData = await response.json();
            if(responseData.status === "FAIL"){
                alert("System cannot find this Order")
                return
            }
            console.log('Response:', responseData);
            return responseData
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
    async function getScanRecord(order_id) {
        if(!order_id){
            alert("缺少order_id")
            return
        }
        const url = `https://delivery-service-api.uniuni.com/delivery/parcels/scan-journals/${order_id}`;
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
            });

            const responseData = await response.json();
            if(responseData.status === "FAIL"){
                alert("System cannot find this Order")
                return
            }
            console.log('Response:', responseData);
            return responseData
        } catch (error) {
            console.error('Error:', error.message);
        }
    }
    function showCustomMessage(message, bgColor) {
        const modal = document.createElement('div');
        modal.style.position = 'fixed';
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        modal.style.padding = '20px';
        modal.style.backgroundColor = bgColor;
        modal.style.color = 'white';
        modal.style.borderRadius = '10px';
        modal.style.boxShadow = '0 0 15px rgba(0, 0, 0, 0.3)';
        modal.style.fontSize = '18px';
        modal.style.zIndex = '9999';
        modal.style.textAlign = 'center';
        modal.textContent = message;

        document.body.appendChild(modal);

        // Auto-remove the modal after 3 seconds
        setTimeout(() => {
            modal.style.transition = 'opacity 0.5s ease';
            modal.style.opacity = '0';
            setTimeout(() => {
                document.body.removeChild(modal);
            }, 500);
        }, 3000);
    }
    window.addEventListener('load', addCustomButton);
})();