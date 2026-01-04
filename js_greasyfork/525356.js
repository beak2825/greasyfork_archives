// ==UserScript==
// @name         Auto Send to Storage
// @namespace    http://tampermonkey.net/
// @version      2.3.1
// @description  Auto Send to storage
// @author       RenZhijie
// @match        https://dispatch.uniuni.com/main
// @grant        unsafeWindow
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/525356/Auto%20Send%20to%20Storage.user.js
// @updateURL https://update.greasyfork.org/scripts/525356/Auto%20Send%20to%20Storage.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let token = getToken()
    let warehouseId = getWarehouseId()
    let operator = getOperator()
    let hashTable = new Map();
    let storage = null
    hashTable.set("17", "JFK Warehouse");
    hashTable.set("18", "NJ Warehouse");
    hashTable.set("25", "PHL Warehouse");
    hashTable.set("26", "DCA Warehouse");
    hashTable.set("34", "CLT Warehouse");
    hashTable.set("35", "RDU Warehouse");
    hashTable.set("39", "BOS Warehouse");
    hashTable.set("45", "BUF Warehouse");
    hashTable.set("2", "MIA Warehouse");
    hashTable.set("52", "RIC Warehouse");
    hashTable.set("57", "ALB Warehouse");
    hashTable.set("58", "MDT Warehouse");
    hashTable.set("59", "PIT Warehouse");
    hashTable.set("70", "AVP Warehouse");
    hashTable.set("71", "SYR Warehouse");
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    function addCustomButton() {
        // 查找搜索按钮
        const history = document.querySelector('.MuiIconButton-root[aria-label="history"]');

        if (!history) {
            console.log("搜索按钮未找到，等待页面加载...");
            setTimeout(addCustomButton, 1000); // 1秒后重试
            return;
        }

        // 创建新按钮
        const newButton = document.createElement('button');
        newButton.textContent = "一键入库";
        newButton.style.marginRight = "20px"; // 添加一些间距
        newButton.style.padding = "8px 12px";
        newButton.style.border = "none";
        newButton.style.backgroundColor = "#ff9800";
        newButton.style.color = "white";
        newButton.style.borderRadius = "4px";
        newButton.style.cursor = "pointer";
        newButton.type = "button";

        // 按钮点击事件
        newButton.addEventListener('click', async function() {
            const tno = getTNO()
            let warehouse = hashTable.get(warehouseId)
            let order_detail = await getOrderDetail(tno)
            let staff_id = order_detail.data.orders.shipping_staff_id
            let order_id = order_detail.data.orders.order_id
            let order_sn = order_detail.data.orders.order_sn
            let status = getStatus()
            if(tno && warehouse!==undefined){
                switch (status) {
                    case '199: GATEWAY_TRANSIT':
                        await clickNextTransition()
                        await clickDeliverParcelAPT_9()
                        await submit()
                        await clickSubmit()
                        await sleep(4000)
                        //199-200
                        checkStatus200()
                        //200-202
                        await sleep(4000)
                        checkStatus212()
                        //212-211
                        await sleep(4000)
                        checkStatus211()
                        //211-213
                        break;
                    case '195: GATEWAY_TRANSIT_OUT':
                        await clickNextTransition()
                        await clickDeliverParcelAPT_6()
                        await submit()
                        await clickSubmit()
                        await sleep(3500)
                        //199-200
                        checkStatus200()
                        //200-212
                        await sleep(3500)
                        checkStatus212()
                        //212-211
                        await sleep(3500)
                        checkStatus211()
                        //211-213
                        break;
                    case '200: PARCEL_SCANNED':
                        checkStatus200()
                        //200-212
                        await sleep(4000)
                        checkStatus212()
                        //212-211
                        await sleep(4000)
                        checkStatus211()
                        //211-213
                        break;
                    case '218: SCANNED_PARCEL_PROCESSING_DELAY':
                        await updateShippingStatus218_202(order_id, order_sn, token, warehouse, warehouseId)
                        await insertOperationLog218_202(order_id, operator, token)
                        await updateShippingStatus202_206(order_id, order_sn, token, warehouse, warehouseId)
                        await insertOperationLog202_206(order_id, operator, token)
                        storage = await getNewStorageInfo(warehouseId, token)
                        await updateShippingStatusTo213(order_id, order_sn, token, warehouse, warehouseId,storage.data.storage_info,storage.data.storage_code,storage.data.storage_rotation,staff_id)
                        await insertOperationLogTo213(order_id, operator, token)
                        await document.querySelector('[aria-label="search"]').click();
                        break;
                    case '202: IN_TRANSIT':
                        await updateShippingStatus202_206(order_id, order_sn, token, warehouse, warehouseId)
                        await insertOperationLog202_206(order_id, operator, token)
                        storage = await getNewStorageInfo(warehouseId, token)
                        await updateShippingStatusTo213(order_id, order_sn, token, warehouse, warehouseId,storage.data.storage_info,storage.data.storage_code,storage.data.storage_rotation,staff_id)
                        await insertOperationLogTo213(order_id, operator, token)
                        await document.querySelector('[aria-label="search"]').click();
                        break;
                    case '211: RETURN_OFFICE_FROM_TRANSIT':
                        storage = await getNewStorageInfo(warehouseId, token)
                        await updateShippingStatusTo213(order_id, order_sn, token, warehouse, warehouseId,storage.data.storage_info,storage.data.storage_code,storage.data.storage_rotation,staff_id)
                        await insertOperationLogTo213(order_id, operator, token)
                        await document.querySelector('[aria-label="search"]').click();
                        break;

                    case '231: FAILED_DELIVERY_RETRY1':
                        //alert('231/232需要手动操作入库');
                        await clickNextTransition()
                        await clickDeliverParcelAPT_7()
                        await submit()
                        await clickSubmit()
                        await sleep(3500)
                        //231-211
                        checkStatus211()
                        //211-213

                        break;
                    case '232: FAILED_DELIVERY_RETRY2':
                        //alert('231/232需要手动操作入库');
                        await clickNextTransition()
                        await clickDeliverParcelAPT_4();
                        await submit()
                        await clickSubmit()
                        await sleep(3500)
                        //232-211
                        checkStatus211()
                        //211-213

                        break;
                    default:
                        alert("Invalid Status: " + status);
                }

            }else if(warehouse===undefined){
                alert('invalid warehouse')
            }

        });

        history.insertAdjacentElement('afterend', newButton);

    }


    function getTNO(){
        const tnoElement = document.querySelector(
            'body > div.MuiDialog-root > div.MuiDialog-container.MuiDialog-scrollBody > div > div.MuiDialogContent-root.jss41.MuiDialogContent-dividers > form:nth-child(3) > div:nth-child(1) > div > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div > div > div:nth-child(2) > div > div > div:nth-child(3) > p'
        );
        if (!tnoElement) {
            alert("还未进行查询，无法入库");
            return null;
        }
        let fullText = tnoElement.textContent.trim();

        let parts = fullText.split(": ");
        if (parts.length < 2) {
            alert("未找到有效的 Parcel ID");
            return null;
        }
        return parts[1].trim();


    }
    function getStatus() {
        const statusContainer = document.querySelector(
            'body > div.MuiDialog-root > div.MuiDialog-container.MuiDialog-scrollBody > div > div.MuiDialogContent-root.jss41.MuiDialogContent-dividers > form:nth-child(3) > div:nth-child(3) > div.MuiPaper-root.MuiAccordion-root.Mui-expanded.MuiAccordion-rounded.MuiPaper-elevation1.MuiPaper-rounded > div.MuiCollapse-container.MuiCollapse-entered > div > div > div > div > ul'
        );

        if (statusContainer && statusContainer.lastElementChild) {
            const statusElement = statusContainer.lastElementChild.querySelector(
                "div.MuiTimelineContent-root.MuiTimelineItem-content > div > p:nth-child(1)"
            );
            if (statusElement) {
                return statusElement.textContent
            } else {
                console.log("状态元素未找到");
                return null
            }
        } else {
            console.log("状态容器未找到");
            return null
        }
    }

    async function checkStatus211() {
        try{
            const statusContainer = await waitForElement('div.MuiDialog-root ul', 5000);
            const lastLi = await waitForElement('div.MuiDialog-root ul > li:last-child', 10000);
            const statusElement = lastLi.querySelector("p:first-child");
            if (statusElement && statusElement.textContent === '211: RETURN_OFFICE_FROM_TRANSIT') {
                    await clickNextTransition();
                    await clickDeliverParcelAPT_6();
                    await submit();
                    await clickSubmit()
                } else {
                    console.log("状态未达到 211: RETURN_OFFICE_FROM_TRANSIT，重试中...");
                    setTimeout(checkStatus211, 1000);
                }
        } catch (err) {
            console.error(err.message);
        }

    }
    async function checkStatus212(){
        try{
            const statusContainer = await waitForElement('div.MuiDialog-root ul', 5000);
            const lastLi = await waitForElement('div.MuiDialog-root ul > li:last-child', 10000);
            const statusElement = lastLi.querySelector("p:first-child");
            if (statusElement && statusElement.textContent === '212: WRONG_ADDRESS_FROM_RECEIVE') {
                    await clickNextTransition();
                    await clickDeliverParcelAPT_2();
                    await submit();
                    await clickSubmit()
                } else {
                    console.log("状态未达到 212: WRONG_ADDRESS_FROM_RECEIVE，重试中...");
                    setTimeout(checkStatus212, 1000);
                }
        } catch (err) {
            console.error(err.message);
        }
     }
    async function checkStatus200() {
        try {
            const statusContainer = await waitForElement('div.MuiDialog-root ul', 5000);
            const lastLi = await waitForElement('div.MuiDialog-root ul > li:last-child', 10000);
            const statusElement = lastLi.querySelector("p:first-child");
            if (statusElement && statusElement.textContent === '200: PARCEL_SCANNED') {
                await clickNextTransition();
                await clickDeliverParcelAPT_8();
                await submit();
            } else {
                console.log("状态未达到 200: PARCEL_SCANNED，重试中...");
                setTimeout(checkStatus200, 1000);
            }
        } catch (err) {
            console.error(err.message);
        }
    }
    function waitForElement(selector, timeout = 5000) {
        return new Promise((resolve, reject) => {
            const interval = 100;
            let elapsed = 0;

            const timer = setInterval(() => {
                const el = document.querySelector(selector);
                if (el) {
                    clearInterval(timer);
                    resolve(el);
                }
                elapsed += interval;
                if (elapsed >= timeout) {
                    clearInterval(timer);
                    reject(new Error("Timeout: Element not found " + selector));
                }
            }, interval);
        });
    }
    function getWarehouseId(){
        const warehouse_id = localStorage.getItem('user_city');
        //console.log('User city' + warehouse_id);
        if(!warehouse_id){
            setTimeout(getWarehouseId, 1000);
        }
        return warehouse_id

    }
    function getToken() {
        const token = localStorage.getItem('auth_token');
        if(!token){
            setTimeout(getToken, 1000);
        }
        return token
    }
    function getOperator() {
        const operator = localStorage.getItem('username');
        if(!operator){
            setTimeout(getOperator, 1000);
        }
        return operator
    }

    async function updateShippingStatusTo213(order_id, order_sn, token, scan_location, warehouse_id, storage_info, storage_code,storage_rotation,staff_id) {
        const url = 'https://dispatch-api.uniuni.com/driver/updateshippingstatus';

        const payload =
              {
                  "order_id": order_id,
                  "staff_id": staff_id,
                  "shipping_status": 2,
                  "scan_location": scan_location,
                  "send_sms": 0,
                  "storaged_warehouse": 17,
                  "parcel_info": {
                      "order_id": order_id,
                      "extra_order_sn": order_sn,
                      "transition": "SEND_PARCEL_TO_STORAGE",
                      "status": 213,
                      "desc": "",
                      "warehouse": warehouse_id,
                      "storage_info": storage_info,
                      "storage_code": storage_code,
                      "storage_rotation": storage_rotation
                  },
                  "exception": null,
                  "failed_reason": null
              }

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();
            console.log('Response:', responseData);
            return responseData;
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    async function insertOperationLogTo213(order_id, operator, token) {
        var url = 'https://dispatch-api.uniuni.com/driver/insertoperationlog';

        var payload = {
            "order_id":order_id,
            "operator":operator,
            "operation_code":213,
            "operation_type":0,
            "description":"",
            "memo":""
        }

        try {
            var response = await fetch(url,{
                method: 'POST',
                muteHttpExceptions: true,
                contentType: 'application/json',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error('Error:', error.message);
        }



    }

    async function updateShippingStatus202_206(order_id, order_sn, token, scan_location, warehouse_id) {
        const url = 'https://dispatch-api.uniuni.com/driver/updateshippingstatus';

        const payload = {
            "order_id": order_id,
            "staff_id": 666,
            "shipping_status": 1,
            "scan_location": scan_location,
            "send_sms": 0,
            "storaged_warehouse": warehouse_id,
            "parcel_info": {
                "order_id": order_id,
                "extra_order_sn": order_sn,
                "transition": "WRONG_ADDRESS_CFM_IN_TRANSIT",
                "status": 206,
                "desc": "",
                "warehouse": warehouse_id
            },
            "exception": null,
            "failed_reason": null
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();
            console.log('Response:', responseData);
            return responseData;
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    async function getNewStorageInfo(warehouse_id, token) {
        const url = `https://dispatch-api.uniuni.com/business/getnewstorageinfo?warehouse=${warehouse_id}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const responseData = await response.json();
            console.log('Response:', responseData);
            return responseData;
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    async function insertOperationLog202_206(order_id, operator, token) {
        var url = 'https://dispatch-api.uniuni.com/driver/insertoperationlog';

        var payload = {
            "order_id":order_id,
            "operator":operator,
            "operation_code":206,
            "operation_type":0,
            "description":"",
            "memo":""
        }

        try {
            var response = await fetch(url,{
                method: 'POST',
                muteHttpExceptions: true,
                contentType: 'application/json',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error('Error:', error.message);
        }


    }

    async function updateShippingStatus218_202(order_id, order_sn, token, scan_location, warehouse_id) {
        const url = 'https://dispatch-api.uniuni.com/driver/updateshippingstatus';

        const payload = {
            "order_id": order_id,
            "staff_id": 666,
            "shipping_status": 1,
            "scan_location": scan_location,
            "send_sms": 0,
            "storaged_warehouse": warehouse_id,
            "parcel_info": {
                "order_id": order_id,
                "extra_order_sn": order_sn,
                "transition": "SCANNED_PARCEL_FOUND",
                "status": 202,
                "desc": "",
                "warehouse": warehouse_id
            },
            "exception": null,
            "failed_reason": null
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();
            console.log('Response:', responseData);
            return responseData;
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    async function insertOperationLog218_202(order_id, operator, token) {
        var url = 'https://dispatch-api.uniuni.com/driver/insertoperationlog';

        var payload = {
            "order_id":order_id,
            "operator":operator,
            "operation_code":202,
            "operation_type":0,
            "description":"",
            "memo":""
        }

        try {
            var response = await fetch(url,{
                method: 'POST',
                muteHttpExceptions: true,
                contentType: 'application/json',
                headers: {
                    'Authorization': 'Bearer ' + token,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            const responseData = await response.json();
            return responseData;
        } catch (error) {
            console.error('Error:', error.message);
        }


    }

    async function updateShippingStatus231_232(order_id, order_sn, token, scan_location, warehouse_id) {
        const url = 'https://dispatch-api.uniuni.com/driver/updateshippingstatus';

        const payload = {
            "order_id": order_id,
            "staff_id": 666,
            "shipping_status": 1,
            "scan_location": scan_location,
            "send_sms": 0,
            "storaged_warehouse": warehouse_id,
            "parcel_info": {
                "order_id": order_id,
                "extra_order_sn": order_sn,
                "transition": "FAILED_DELIVERY_RETRY2",
                "status": 232,
                "desc": "",
                "warehouse": warehouse_id
            },
            "exception": null,
            "failed_reason": null
        };

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            const responseData = await response.json();
            console.log('Response:', responseData);
            return responseData;
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    async function getOrderDetail(tno){
        const url = `https://dispatch-api.uniuni.com/map/getorderdetail?tno=${tno}`

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const responseData = await response.json();
            console.log('Response:', responseData);
            return responseData
        } catch (error) {
            console.error('Error:', error.message);
        }
    }

    async function clickNextTransition(){
        const nextTransitionElement = document.querySelector('#nextTransition')
        if (nextTransitionElement) {
            const event = new MouseEvent('mousedown', { bubbles: true });
            await nextTransitionElement.dispatchEvent(event);
        }
    }

    async function clickDeliverParcelAPT_7(){
        const deliverParcelAPTElement = document.querySelector('#menu- > div.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul > option:nth-child(7)')
        if (deliverParcelAPTElement) {
            await deliverParcelAPTElement.click()
        }
    }

    async function clickDeliverParcelAPT_4(){
        const deliverParcelAPTElement = document.querySelector('#menu- > div.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul > option:nth-child(4)')
        if (deliverParcelAPTElement) {
            await deliverParcelAPTElement.click()
        }
    }
    async function clickDeliverParcelAPT_5(){
        const deliverParcelAPTElement = document.querySelector('#menu- > div.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul > option:nth-child(5')
        if (deliverParcelAPTElement) {
            await deliverParcelAPTElement.click()
        }
    }
    async function clickDeliverParcelAPT_6(){
        const deliverParcelAPTElement = document.querySelector('#menu- > div.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul > option:nth-child(6)')
        if (deliverParcelAPTElement) {
            await deliverParcelAPTElement.click()
        }
    }
    async function clickDeliverParcelAPT_8(){
        const deliverParcelAPTElement = document.querySelector('#menu- > div.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul > option:nth-child(8)')
        if (deliverParcelAPTElement) {
            await deliverParcelAPTElement.click()
        }
    }
    async function clickDeliverParcelAPT_9(){
        const deliverParcelAPTElement = document.querySelector('#menu- > div.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul > option:nth-child(9)')
        if (deliverParcelAPTElement) {
            await deliverParcelAPTElement.click()
        }
    }
    async function clickDeliverParcelAPT_2(){
        const deliverParcelAPTElement = document.querySelector('#menu- > div.MuiPaper-root.MuiMenu-paper.MuiPopover-paper.MuiPaper-elevation8.MuiPaper-rounded > ul > option:nth-child(2)')
        if (deliverParcelAPTElement) {
            await deliverParcelAPTElement.click()
        }
    }
    async function submit(){
        const submitButton = document.querySelector('#nexttrasition_submit_timeout_button')
        if (submitButton) {
            await submitButton.click()
        }
    }

    async function clickSubmit(){
        const operationElement = document.querySelector('body > div.MuiDialog-root.jss72 > div.MuiDialog-container.MuiDialog-scrollPaper > div > div.MuiDialogActions-root.MuiDialogActions-spacing > div > div > button.MuiButtonBase-root.MuiButton-root.MuiButton-text.MuiButton-textPrimary')
        if(operationElement){
            await operationElement.click()
        }
    }
    // 等待页面加载完成后运行
    window.addEventListener('load', getToken);
    window.addEventListener('load', getWarehouseId);
    window.addEventListener('load', addCustomButton);
})();
