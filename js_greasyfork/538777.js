// ==UserScript==
// @name         Akso配置工具
// @namespace    Akso配置工具
// @version      2025-06-06
// @description  tAkso配置工具
// @author       You
// @icon         https://ycosd-config.aksoegmp.com/favicon.ico
// @grant        none
// @match        http://*/*
// @match        https://*/*
// @license      12312
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/538777/Akso%E9%85%8D%E7%BD%AE%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/538777/Akso%E9%85%8D%E7%BD%AE%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function getCookie(name) {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) return parts.pop().split(';').shift();
    }
    function changeState(element){
        fetch(window.location.origin+`/api/openapi/v1.0/Object/status/${element.dataset.id}/${element.dataset.code}`, {
            "headers": headers,
            "method": "POST"
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // 解析JSON响应
        })
            .then(data => {
            if(data.data==true){
                location.reload()
            }
        })
            .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    };


    var urlParams = new URLSearchParams(window.location.search);
    let instanceId = urlParams.get('id');
    let objectId = urlParams.get('bid');
    let objectTypeId = urlParams.get('otid');
    let lifecycleId = "";

    let headers= {
        "authorization": "Bearer "+ getCookie('__auth_token__'),
        "content-type": "application/json"
    };

    fetch(window.location.origin+"/api/platform/Layout/GetFormInstance", {
        "body": `{\"objectId\":\"${objectId}\",\"instanceId\":\"${instanceId}\",\"isCopy\":false}`,
        "headers":headers,
        "method": "POST"
    }).then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json(); // 解析JSON响应
    }).then(data => {
        lifecycleId = data.data.lifecycle.id
        fetch(window.location.origin+"/api/config/lifecycle/Status/GetListByBasicId?&basicId="+lifecycleId, {
            "headers": headers,
            "method": "GET"
        }).then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json(); // 解析JSON响应
        })
            .then(data => {
            document.body.insertAdjacentHTML('afterbegin', `<div class="menu-container"><ul class="menu"><li><a href="#">李海林</a></li><li class="has-submenu"><a href="#">进入状态设置</a><ul class="submenu" id="sub-list1"></ul></li><li class="has-submenu"><a href="#">修改流程状态</a><ul class="submenu" id="sub-list2"></ul></li></ul></div>`);
            for (const item in data.data) {
                const info = `/admin/config/lifecycle/${lifecycleId}/status/${data.data[item].id}?__edit=2`;

                document.getElementById('sub-list1').insertAdjacentHTML('afterbegin','<li type=\'button\' onclick=window.open(\''+info+'\')>'+data.data[item].name+'</li>');
            }
            for (const item in data.data) {
                document.getElementById('sub-list2').insertAdjacentHTML('afterbegin',`<li type="button" data-id="${instanceId}"  data-code="${data.data[item].code}">${data.data[item].name}</li>`);
            }
        })
            .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });
    })
        .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });


    function addSpecificEvents() {
        document.querySelectorAll('#sub-list2 li').forEach(li => {
            if( li._hasListener==undefined){
                li.addEventListener('click', function() {
                    changeState(this);
                });
                li._hasListener = true;
            }
        });
    }

    new MutationObserver(addSpecificEvents).observe(document.body, {
        childList: true,
        subtree: false
    });
})();