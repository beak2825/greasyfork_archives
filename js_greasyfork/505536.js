// ==UserScript==
// @name         打卡申诉自动填充
// @namespace    http://tampermonkey.net/
// @version      2024-05-27
// @description  博彦打卡申诉自动填充
// @author       Zhounan
// @match        https://e-cology.beyondsoft.com/spa/workflow/static4form/index.html*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505536/%E6%89%93%E5%8D%A1%E7%94%B3%E8%AF%89%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.user.js
// @updateURL https://update.greasyfork.org/scripts/505536/%E6%89%93%E5%8D%A1%E7%94%B3%E8%AF%89%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%85%85.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function addButton(){
        var targetElement = document.querySelector('.mainTd_3_9');
        if (targetElement) {
            const input = document.createElement('input');
            input.type = 'text';
            input.placeholder = '填写自动填充的文本';
            input.classList.add('autofill-input');

            const button = document.createElement('button');
            button.textContent = '自动填充';
            button.classList.add('ant-btn', 'ant-btn-primary');
            button.addEventListener('click', () => {
                const autofillText = input.value;
                const inputElements = document.querySelectorAll('.wf-input.wf-input-1.wf-input-detail.wf-input-field90859');
                inputElements.forEach((element) => {
                    element.focus();
                    element.value = autofillText;
                    element.blur();
                });
            });


            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.justifyContent = 'flex-end';
            container.appendChild(input);
            container.appendChild(button);
            targetElement.insertAdjacentElement('afterend', container);

            targetElement.appendChild(container);
        }
    }

    function addWorkTimeButton(){

        const targetElement = document.getElementById('addbutton0');

        if (targetElement) {
            const newButton = document.createElement('button');
            newButton.textContent = '自动填充8小时';
            newButton.className = 'ant-btn ant-btn-primary'; // 可选：为新按钮添加类名
            newButton.addEventListener('click', addWorkTime);
            const parentElement = targetElement.parentNode;
            parentElement.insertBefore(newButton, targetElement);
        }
    }



    function addWorkTime(){

        for (let i = 1; i <= 31; i++) {
            const fieldName = `d${i}`;
            const div = document.querySelector(`div[data-fieldname="${fieldName}"]`);
            if (div) {
                const input = div.querySelector('input');
                if (input) {
                    input.focus(); // 聚焦到input上
                    if (!input.readOnly) { // 判断是否为只读
                        input.value = 8; // 填充数据
                    }
                }
            }
        }

    }


    function getParameterByName(name, url) {
        if (!url) url = window.location.href;
        name = name.replace(/[\[\]]/g, '\\$&');
        var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
            results = regex.exec(url);
        if (!results) return null;
        if (!results[2]) return '';
        return decodeURIComponent(results[2].replace(/\+/g, ' '));
    }

    function checkAndFillInput() {
        var inputElements = document.getElementsByClassName("wf-input wf-input-1 wf-input-detail wf-input-field90859");
        if (inputElements.length > 0) {
            clearInterval(intervalId);

            addButton();

        }
    }

    function workTimeFillCheck() {
        const iframeElement = document.getElementById('leav');
        if (iframeElement) {
            addWorkTimeButton();

            clearInterval(intervalId2);
        }
    }

    var workflowid = getParameterByName('workflowid');

    if (workflowid === '445') {

        var intervalId = setInterval(checkAndFillInput, 5000);

    }

    if (workflowid === '5') {

        var intervalId2 = setInterval(workTimeFillCheck, 5000);

    }

    setTimeout(() => {
        clearInterval(intervalId);
        clearInterval(intervalId2);
    }, 50000);


})();