// ==UserScript==
// @name         MRIA内部版
// @namespace    http://tampermonkey.net/
// @version      2025-01-17
// @description  mria-mo
// @author       Zero
// @match        https://192.168.10.92/*
// @match        https://192.168.10.189/*
// @match        https://192.168.10.182/*
// @match        https://192.168.10.186/*
// @icon         https://192.168.10.145/favicon.ico
// @run-at       document-end
// @require      https://update.greasyfork.org/scripts/523085/1517064/waitForKeyElements3.js
// @grant        GM_log
// @grant        GM_registerMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_deleteValue
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522672/MRIA%E5%86%85%E9%83%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/522672/MRIA%E5%86%85%E9%83%A8%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log(SETTING);
    SETTING.name='MRIA内部版';
    SETTING.screenHospitalName='MRIA内部版';
    SETTING.title='MRIA内部版';
    waitForKeyElements('#app > div > div.login-main > h3',element=>{
        element.style.color="#"+Math.random().toString(16).slice(2,8);
        element.innerHTML='MRIA内部版';
    });
    waitForKeyElements("#app > div > div.navbar > div.navbar-name",element=>{
        element.style.color="#"+Math.random().toString(16).slice(2,8);
    });

    waitForKeyElements("#app > div > div.login-main > form",element=>{
        element.__vue__.$props.model.username='mpadmin';
        element.__vue__.$props.model.password='admin123';
    });

    waitForKeyElements("tbody > tr",element=>{
        try{
            let targetEle = element.querySelector('em');
            targetEle.classList.add('navbar-name-logo');
            targetEle.innerHTML=document.querySelector("div.navbar-name-logo > img").outerHTML;
        }
        catch(error){
            console.error(error)
        }
    });

    function removeDisabled(element) {
        //console.log(element);
        if (element.childNodes && element.childNodes.length > 0) {
            element.childNodes.forEach(e => {
                if (e.nodeName !== "#comment") e.disabled = false
            });
        }
        element.classList.remove('is-disabled');
        element.classList.remove('disabled');
        element.disabled = false;
    }
    waitForKeyElements("div.is-disabled", removeDisabled);
    waitForKeyElements("button.is-disabled",removeDisabled);

    function addButton(element) {
        var delayButton = document.createElement('button');
        delayButton.textContent = '手动顺延'; // 设置按钮文本
        delayButton.type = 'button'; // 设置按钮类型
        delayButton.className = 'el-button mt-button blue-btn el-button--submain mt-button--submain';
        delayButton.style.height='30px';
        delayButton.style.width='auto';
        delayButton.setAttribute('data-v-3c5225b8',"");

        delayButton.addEventListener('click', function () {
            var myHeaders = new Headers();
            myHeaders.append("Content-Type", "application/json");
            const contentStorage = JSON.parse(window.localStorage['Manteia-UserInfo']);

            fetch("/mriaapi/patient_apply_auto_delay", {
                method: 'POST',
                headers: myHeaders,
                body: {
                    "action_client_code": "PC",
                    "hospital_code": contentStorage.hospital_code,
                    "access_token": /Manteia-token=(.*);?/.exec(document.cookie)[1],
                    "action_user_code": contentStorage.user_code,
                    "action_user_name":contentStorage.realname
                },
                redirect: 'follow'
            })
                .then(res => res.json())
                .then(res => console.log(unescape(res.msg)))
                .catch(error => console.log('error', error));
            location.reload();
        });
        element.parentNode.insertBefore(delayButton, element.nextSibling);
        element.parentNode.querySelectorAll('button').forEach(btn=>btn.style["white-space"]="normal");
    };
    location.hash=='#/flow-system/treat-manage/list' && waitForKeyElements("#appMain > section > div.app-main-container-page > div > div > div.mt-list-head.tools > div > div.tools-header__search.not-time-range-search > div.tools-right > div.input-button-divider", addButton);

    (function () {
        // 页面不是被其它页面 iframe 嵌入时才进行添加
        if (self == top) {
            var menus=[
                {
                    name:"页面内容替换",
                    func:null
                },
            ];
            menus.forEach(m=>GM_registerMenuCommand(m.name,m.func));
        }
    })();
})();