// ==UserScript==
// @name         ConfluenceAutoFillLabels
// @namespace    http://www.akuvox.com/
// @version      1.0.0
// @description  auto list all labels
// @author       bink
// @match        http://192.168.10.2:83/pages/*
// @grant        GM_xmlhttpRequest
// @grant        GM_addStyle
// @license      11
// @downloadURL https://update.greasyfork.org/scripts/467388/ConfluenceAutoFillLabels.user.js
// @updateURL https://update.greasyfork.org/scripts/467388/ConfluenceAutoFillLabels.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const TIME_OUT = 200;
    const LABEL_ENDPOINTS = {
        "A功能预研": "72417294",
        "A系统库": "72417286",
        "A自定义库": "72417307",
        "A日常技巧": "72417287",
        "A踩坑记录": "72417293",
        "A适配指南": "72417295",
        "I功能预研": "72417308",
        "I系统库": "72417290",
        "I自定义库": "72417291",
        "I日常技巧": "72417289",
        "I踩坑记录": "72417292",
        "I适配指南": "72417309"
    }
    window.onload = function() {
        console.log("load completed");
        window.setTimeout(addModified, TIME_OUT);
    };
    function addModified() {
        const likesTag = document.getElementById("likes-and-labels-container");
        const list = document.createElement('ul');
        list.style.display = 'flex';
        list.style.flexWrap = 'wrap';
        for (const [key, value] of Object.entries(LABEL_ENDPOINTS)) {
            const listItem = document.createElement('li');
            listItem.className = 'list-item';
            listItem.style.width = '40%';
            listItem.style.margin = '8px 16px';


            // 添加
            const itemName = document.createTextNode(key);
            const addBtn = document.createElement('button');
            addBtn.style.backgroundColor = '#50E3C2';
            addBtn.style.color = '#fff';
            addBtn.style.padding = '4px 8px';
            addBtn.style.border = 'none';
            addBtn.style.borderRadius = '4px';
            addBtn.style.cursor = 'pointer';
            addBtn.textContent = '添加';
            addBtn.addEventListener('click', () => {
                const endpointID = LABEL_ENDPOINTS[key];
                onAddButtonClick(endpointID, key);
            });
            listItem.appendChild(addBtn);

            // 删除
            const deleteBtn = document.createElement('button');
            deleteBtn.style.backgroundColor = '#d4601f';
            deleteBtn.style.color = '#fff';
            deleteBtn.style.padding = '4px 8px';
            deleteBtn.style.border = 'none';
            deleteBtn.style.borderRadius = '4px';
            deleteBtn.style.cursor = 'pointer';
            deleteBtn.style.marginLeft = '8px';
            deleteBtn.style.marginRight = '8px';
            deleteBtn.textContent = '删除';
            deleteBtn.addEventListener('click', () => {
                const endpointID = LABEL_ENDPOINTS[key];
                onDeleteButtonClick(endpointID, key);
            });
            listItem.appendChild(deleteBtn);

            // 标签名称
            listItem.appendChild(itemName);
            list.appendChild(listItem);
        }

        // 添加到页面
        const itemDiv = document.createElement('div');
        itemDiv.style.display = 'flex';
        itemDiv.style.flexWrap = 'center';
        itemDiv.appendChild(list);
        likesTag.appendChild(itemDiv);
        likesTag.style.display = 'flex';
        likesTag.style.flexWrap = 'wrap';
    }

    function onAddButtonClick(endpointID, key) {
        console.log(`要添加的值为：${key}`);

        const paramValue = getParamValueFromUrl();
        const timestamp = new Date().getTime();

        if (!paramValue) {
            console.error("Parameter value not found in URL.");
            alert(`无法添加标签${key}。`);
            return;
        }

        const url = `http://192.168.10.2:83/rest/ui/1.0/content/${paramValue}/labels/`;
        const data = [{
            "name": key,
            "id": Number(`${timestamp}`)
        }];

        GM_xmlhttpRequest({
            method: "POST",
            url: url,
            data: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Accept-Encoding": "gzip, deflate",
                "X-Requested-With": "XMLHttpRequest",
                "Referer": window.location.href,
                "Cookie": document.cookie
            },
            onload: function(response) {
                console.log(response.responseText);
                let responseObject = JSON.parse(response.responseText);
                let status = responseObject.success;
                if(status) {
                    alert(`添加标签${key}成功`);
                    location.reload();
                }else {
                    alert(`无法添加标签${key}。`);
                }
                console.log(status);
            },
            onerror: function(response) {
                console.error(response);
                alert(`无法添加标签${key}。`);
            }
        });
    }

    function onDeleteButtonClick(endpointID, key) {
        console.log(`要删除的值为：${key}`);

        const paramValue = getParamValueFromUrl();
        const timestamp = new Date().getTime();

        if (!paramValue) {
            console.error("Parameter value not found in URL.");
            alert(`无法删除标签${key}。`);
            return;
        }

        const url = `http://192.168.10.2:83/rest/ui/1.0/content/${paramValue}/label/${endpointID}`;

        GM_xmlhttpRequest({
            method: "DELETE",
            url: url,
            headers: {
                "Content-Type": "application/json",
                "Accept": "application/json, text/javascript, */*; q=0.01",
                "Accept-Encoding": "gzip, deflate",
                "X-Requested-With": "XMLHttpRequest",
                "Referer": window.location.href,
                "Cookie": document.cookie
            },
            onload: function(response) {
                console.log(response.responseText);
                alert(`删除标签${key}成功`);
                location.reload();
            },
            onerror: function(response) {
                console.error(response);
                alert(`无法删除标签${key}。`);
            }
        });
    }

    function getParamValueFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get("pageId");
    }
})();