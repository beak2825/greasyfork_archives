// ==UserScript==
// @name         设置devops的缺陷提示
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  缺陷提示
// @author       lulu
// @match        https://devops.inshopline.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539940/%E8%AE%BE%E7%BD%AEdevops%E7%9A%84%E7%BC%BA%E9%99%B7%E6%8F%90%E7%A4%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/539940/%E8%AE%BE%E7%BD%AEdevops%E7%9A%84%E7%BC%BA%E9%99%B7%E6%8F%90%E7%A4%BA.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 设置默认的 bdInfo
    //     const bdInfo = "SmartPush";
    //     localStorage.setItem('bdInfo', `{"14907":"${bdInfo}"}`);
    //     console.log('设置默认项目成功：', `{"14907":"${bdInfo}"}`);



    // 点击事件处理函数
    function handleClick() {
        //         const bdInfoArr = ['14907', bdInfo];
        //         console.log('设置bdInfoArr成功：', bdInfoArr);

        // 获取相关的 DOM 元素
        const inputElement = document.querySelector('#新建缺陷_summary');
        const spanElement = document.querySelector("#新建缺陷_requirementVersion");
        const headerElement = document.querySelector("#add-defect-modal > div > div.ant-modal-wrap > div > div.ant-modal-content > div.ant-modal-header");
        const linkIssueIdElement = document.querySelector("#新建缺陷_linkIssueId");
        const new_button_Element = document.querySelector("body > div:nth-child(13) > div > div.ant-drawer-content-wrapper > div > div.ant-drawer-body > div > div > div > div.operation-line___3taWv > div.ant-space.css-1kuana8.ant-space-horizontal.ant-space-align-center.ant-space-gap-row-middle.ant-space-gap-col-middle > div:nth-child(3) > button")

        const textElement = document.querySelector("#新建缺陷 > div:nth-child(2) > div > div.ant-col.ant-col-21.ant-form-item-control.css-1kuana8 > div > div > div > div.for-editor > div.for-editor-edit.for-panel > div > div > textarea")

        if (textElement){
            const result_text=textElement.value.replace(/\s+/g, '')
            console.log("textElement",textElement);
            if(result_text == "[步骤][问题][预期结果]"){
                textElement.value = '[店铺数据]\n\n' +textElement.value;
            }
        }

        console.log('linkIssueId：', linkIssueIdElement);

        // 如果输入框和内容为空直接返回
        if (!inputElement ||!spanElement) {
            return;
        }


        // 获取版本字符串
        const versionStr = getVersionStr(spanElement);
        console.log('versionStr：', versionStr);



        // 如果输入框不为空则直接返回
        if (inputElement.value.length!== 0) {
            return;
        }

        // 如果输入框不包含版本字符串，则添加版本字符串
        if (inputElement.value.indexOf(versionStr) === -1) {
            inputElement.value = versionStr;
        }

        // 监听输入框的点击事件
        inputElement.addEventListener('click', function () {
            if (inputElement.value.length === 0 || inputElement.value === '') {
                inputElement.value = versionStr;
            } else {
                console.log('不初始化');
            }
        });

        const spBdElement = document.querySelector("#新建缺陷_bdInfo");
        spBdElement.addEventListener('click', function () {
            simulateKeyPress(spBdElement, 'SmartPush');
        });
    }

    // 获取版本字符串的函数
    function getVersionStr(spanElement) {
        return `【${spanElement.parentElement.nextSibling.getAttribute('title').split('(')[0]}】`;
    }

    // 模拟按键输入的函数
    function simulateKeyPress(element, text) {
        const keys = text.split('');
        let i = 0;

        function pressKey() {
            if (i < keys.length) {
                const event = new KeyboardEvent('keydown', {
                    key: keys[i],
                    code: `Key${keys[i]}`,
                    which: keys[i].charCodeAt(0),
                    keyCode: keys[i].charCodeAt(0),
                    bubbles: true
                });
                element.dispatchEvent(event);
                i++;
                setTimeout(pressKey, 100);
                console.log("keys[i]：", keys[i]);
            }
        }

        pressKey();
    }

    // 监听点击事件
    window.addEventListener('click', handleClick);

    function sleep(time) {
        setTimeout(function () {
            console.log("n秒钟后执行此函数");
        }, time);
    }

    function showToast(message) {
        const toast = document.createElement('div');
        toast.textContent = message;
        toast.style.position = 'fixed';
        toast.style.top = '50%';
        toast.style.left = '50%';
        toast.style.transform = 'translate(-50%, -50%) scale(0.8)';
        toast.style.backgroundColor = '#333';
        toast.style.color = 'white';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '5px';
        toast.style.zIndex = '10001';
        toast.style.textAlign = 'center';
        document.body.appendChild(toast);
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
})();