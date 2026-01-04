// ==UserScript==
// @name                 randomFor xz.chsi.com
// @name:zh-CN           randomFor xz.chsi.com
// @name:zh-TW           randomFor xz.chsi.com
// @name:pt-BR           randomFor xz.chsi.com
// @name:ru              randomFor xz.chsi.com
// @match        *://xz.chsi.com.cn/cp/*
// @author               AyachiNene
// @description          自动化操作，提高效率
// @description:zh-CN    自动化操作，提高效率
// @description:zh-TW    自动化操作，提高效率
// @description:pt-BR    自动化操作，提高效率
// @description:ru       自动化操作，提高效率
// @version              2023.12.5.5
// @icon                 http://ayachinene.top:11080/assets/favicon.8f3ef3de.ico
// @namespace            http://ayachinene.top:10721
// @homepage             http://ayachinene.top:10721
// @license              MIT
// @run-at               document-body
// @downloadURL https://update.greasyfork.org/scripts/481436/randomFor%20xzchsicom.user.js
// @updateURL https://update.greasyfork.org/scripts/481436/randomFor%20xzchsicom.meta.js
// ==/UserScript==
document.addEventListener('DOMContentLoaded', function () {
    'use strict';
    const cardDesElement = document.querySelector('.bg-white');
    function showMessage(message) {
        let messageElement = document.createElement('div');
        messageElement.innerText = message;
        messageElement.style.position = 'fixed';
        messageElement.style.top = '100px';
        messageElement.style.left = '50%';
        messageElement.style.transform = 'translateX(-50%)';
        messageElement.style.padding = '10px';
        messageElement.style.backgroundColor = '#fff';
        messageElement.style.border = '1px solid #ccc';
        messageElement.style.zIndex = '9999';
        messageElement.style.color = 'red';
        document.body.appendChild(messageElement);

        setTimeout(function () {
            messageElement.remove();
        }, 3000);
    }
    function giveNewClassName() {
        var tbodyElements = document.querySelectorAll('tbody');
        for (let i = 0; i < tbodyElements.length; i++) {
            let trElements = tbodyElements[i].querySelectorAll('tr');
            for (let j = 0; j < trElements.length; j++) {
                trElements[j].classList.add('opxuanze');
            }
        }
    }

    function randomSelectMain() {
        giveNewClassName();
        let trElements = document.querySelectorAll('.opxuanze');
        for (let lm = 0; lm < trElements.length; lm++) {
            let iElements = trElements[lm].querySelectorAll('.ivu-icon');
            if (iElements.length > 0) {
                let randomIndex = Math.floor(Math.random() * iElements.length);
                iElements[randomIndex].className = "ivu-icon ivu-icon-md-radio-button-on";
                iElements[randomIndex].click();
            }
        }
    }

    function randomSelectEmoji() {
        giveNewClassName();
        let trElements = document.querySelectorAll('.opxuanze');
        for (let i = 0; i < trElements.length; i++) {
            trElements[i].classList.remove('opxuanze');
        }

        for (let lm = 0; lm < trElements.length; lm++) {
            let iElements = trElements[lm].querySelectorAll('.emoji');

            if (iElements.length > 0) {
                let randomIndex = Math.floor(Math.random() * iElements.length);
                iElements[randomIndex].click();
            }
        }
    }

    function randomSelectCheckboxes() {
        let checkboxes = document.querySelectorAll('.ivu-checkbox-input');
        if (checkboxes.length === 0) {
            console.warn('没有找到复选框');
            return;
        }

        checkboxes[Math.floor(Math.random() * checkboxes.length)].click();

        var randomCount = Math.max(Math.floor(Math.random() * (checkboxes.length - 1)), 0);

        for (var i = 0; i < randomCount; i++) {
            var uncheckedCheckboxes = Array.from(checkboxes).filter(checkbox => !checkbox.checked);

            if (uncheckedCheckboxes.length > 0) {
                var randomIndex = Math.floor(Math.random() * uncheckedCheckboxes.length);
                uncheckedCheckboxes[randomIndex].click();
            } else {
                console.warn('没有更多未选中的复选框');
                break;
            }
        }
    }

    function radioRadomGet() {
        let pageOpt = document.getElementsByClassName('page-option')
        for (let i = 0; i < pageOpt.length; i++) {
            let ivuRadioInputs = pageOpt[i].getElementsByClassName('ivu-radio-input');

            if (ivuRadioInputs.length > 0) {
                let randomIndex = Math.floor(Math.random() * ivuRadioInputs.length);
                ivuRadioInputs[randomIndex].click();
            } else {
                console.warn('在 pageOpt 元素中没有找到 ivu-radio-input 元素。');
            }
        }

    }


    function initializeScript() {
        if (!cardDesElement) {
            console.error('Unable to find element with class "bg-white". Exiting script.');
            return;
        }

        let selectBtn = document.createElement('button');
        selectBtn.className = 'rbForAzs';
        selectBtn.innerText = '表格Radio';
        cardDesElement.appendChild(selectBtn);

        let emojiBtn = document.createElement('button');
        emojiBtn.className = 'emojiBtn';
        emojiBtn.innerText = '笑脸哭脸';
        cardDesElement.appendChild(emojiBtn);

        let radioBtn = document.createElement('button');
        radioBtn.className = 'radioBtn';
        radioBtn.innerText = '单选题';
        cardDesElement.appendChild(radioBtn);

        let chickBoxRandom = document.createElement('button');
        chickBoxRandom.className = 'chickBoxRandom';
        chickBoxRandom.innerText = '复选框选择';
        cardDesElement.appendChild(chickBoxRandom);
        let randomBtnElementMain = document.querySelector('.rbForAzs');
        randomBtnElementMain.addEventListener('click', function () {
            randomSelectMain();
        });
        let randomBtnElementRadio = document.querySelector('.radioBtn');
        randomBtnElementRadio.addEventListener('click', function () {
            radioRadomGet();
        });

        let randomBtnElementEmoji = document.querySelector('.emojiBtn');
        randomBtnElementEmoji.addEventListener('click', function () {
            randomSelectEmoji();
        });

        let chickBoxBtn = document.querySelector('.chickBoxRandom');
        chickBoxBtn.addEventListener('click', function () {
            randomSelectCheckboxes();
        })

    }



    initializeScript();
    showMessage('如果出现圆形单选框 请重复点击直到出现提交按钮,复选框选择功能还有点问题如果没有选择请多点几次');
});