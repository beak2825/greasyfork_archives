// ==UserScript==
// @name         Duplicate App Data AppstoreConnect
// @namespace    http://tampermonkey.net/
// @version      2.0.1
// @description  Duplicate Data Appstore Connect
// @author       Yevhenii Sirenko
// @match        https://appstoreconnect.apple.com/*
// @license      All Rights Reserved
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484061/Duplicate%20App%20Data%20AppstoreConnect.user.js
// @updateURL https://update.greasyfork.org/scripts/484061/Duplicate%20App%20Data%20AppstoreConnect.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const delay = ms => new Promise(res => setTimeout(res, ms));

    let changeLanguageButtonClass = "Box-sc-18eybku-0 Link-sc-1tc8rtf-0 eeVlrs";                 //клас кнопки выбора языков
    let listLanguageButtonsClass = "MenuList__ItemInner-sc-rmfrs7-2 hTMwhR sc-dfVpRl fGFLLG";     //клас кнопок списка языков
    let fieldTextClass = "tb-form__input readOnly___E9LZk";                                      //клас поля "Рекламный текст" и "Описание"
    let toCopy = "tb-form__input readOnly___E9LZk";

    function handleKeyPress(e) {
        if (e.ctrlKey && e.shiftKey && (e.key === 'Q' || e.key === 'Й')) {                       //Ctrl + Shift + Q
            if (!document.getElementById('copyDataBtn')) {
                let button = document.createElement('button');
                button.id = 'copyDataBtn';
                button.textContent = 'DUPLICATE DATA';
                button.style.position = 'fixed';
                button.style.top = '5px';
                button.style.right = '25%';
                button.style.zIndex = '10000';
                button.style.padding = '10px 20px';
                button.style.backgroundColor = '#4CAF50';
                button.style.color = 'white';
                button.style.border = 'none';
                button.style.borderRadius = '5px';
                button.style.cursor = 'pointer';
                button.style.boxShadow = '0 4px 8px 0 rgba(0,0,0,0.2)';
                button.style.transitionDuration = '0.4s';
                button.style.fontSize = '18px';
                button.onmouseover = function() { button.style.backgroundColor = '#45a049' };
                button.onmouseout  = function() { button.style.backgroundColor = '#4CAF50' };

                button.onclick = async () => {
                    let targetUrl = prompt('Введите ClientID для отправки данных:', '');
                    var timerWait = 0;

                    if (targetUrl) {
                        var channel = new BroadcastChannel(targetUrl);
                        console.log('Отправка данных на ' + targetUrl);

                        var selectLangBtn = document.getElementsByClassName(changeLanguageButtonClass)[0];

                        for (var i = 0; i < 100; i++) {
                            selectLangBtn.click();
                            await delay(20);

                            while (timerWait < 800) {
                                var listLangsButtons = document.getElementsByClassName(listLanguageButtonsClass);
                                if (listLangsButtons.length > 0) break;
                                timerWait += 20;
                                await delay(20);
                            }
                            timerWait = 0;

                            listLangsButtons = document.getElementsByClassName(listLanguageButtonsClass);
                            if (i >= listLangsButtons.length) {
                                selectLangBtn.click();
                                await delay(800);
                                break;
                            }

                            var elementsFieldsText = document.getElementsByClassName(fieldTextClass);
                            var prew_val = elementsFieldsText[0].innerText;

                            listLangsButtons[i].click();

                            while (timerWait < 800) {
                                elementsFieldsText = document.getElementsByClassName(fieldTextClass);
                                if (prew_val != elementsFieldsText[0].innerText) break;

                                if (listLangsButtons.length > 0) break;
                                timerWait += 20;
                                await delay(20);
                            }
                            timerWait = 0;

                            elementsFieldsText = document.getElementsByClassName(fieldTextClass);
                            var dataArrayDescriptions = [];

                            for (var j = 0; j < elementsFieldsText.length; j++) dataArrayDescriptions.push(elementsFieldsText[j].innerText);

                            var sendData = {
                                langNumber: i,
                                changeLanguageButtonClass: changeLanguageButtonClass,
                                listLanguageButtonsClass : listLanguageButtonsClass,
                                fieldTextClass : fieldTextClass,
                                dataDescription : dataArrayDescriptions,
                            };

                            channel.postMessage(sendData);
                        }
                    }
                };
                document.body.appendChild(button);
            }
        }
    }

    document.addEventListener('keydown', handleKeyPress);

    function generateRandomDigits() {
        let digits = '';
        for (let i = 0; i < 6; i++) {
            digits += Math.floor(Math.random() * 10).toString();
        }
        return digits;
    }

    ////////////////////////////////////////////////////////////////////////////////////////////// Слушатель
    let channel_name = generateRandomDigits();
    let channel = new BroadcastChannel(channel_name);
    var messageQueue = [];

    async function check_btn_exists() {
        if (!document.getElementById('btnCopyClientID_')) {
            var btnCopyClientID = document.createElement('button');
            btnCopyClientID.id = 'btnCopyClientID_';
            btnCopyClientID.textContent = 'Client: ' + channel_name;
            btnCopyClientID.style.position = 'fixed';
            btnCopyClientID.style.top = '5px';
            btnCopyClientID.style.left = '29%';
            btnCopyClientID.style.zIndex = '10000';
            btnCopyClientID.style.padding = '10px 20px';
            btnCopyClientID.style.backgroundColor = '#4CAF50';
            btnCopyClientID.style.color = 'white';
            btnCopyClientID.style.border = 'none';
            btnCopyClientID.style.borderRadius = '5px';
            btnCopyClientID.style.cursor = 'pointer';
            btnCopyClientID.style.boxShadow = '0 4px 8px 0 rgba(0,0,0,0.2)';
            btnCopyClientID.style.transitionDuration = '0.4s';
            btnCopyClientID.style.fontSize = '18px';
            btnCopyClientID.onmouseover = function() { btnCopyClientID.style.backgroundColor = '#45a049' };
            btnCopyClientID.onmouseout  = function() { btnCopyClientID.style.backgroundColor = '#4CAF50' };

            btnCopyClientID.onclick = function() {
                navigator.clipboard.writeText(channel_name)
                    .then(() => {
                    btnCopyClientID.textContent = 'Copied!';
                    setTimeout(() => {
                        btnCopyClientID.textContent = 'Client: ' + channel_name;
                    }, 2000);
                })
                    .catch(err => {
                    console.error('Something went wrong', err);
                });
            };

            document.body.appendChild(btnCopyClientID);
        }

        await delay(5000);
        check_btn_exists();
    }

    check_btn_exists();

    //сообщения собираються в очередь чтобы не потерять данные из за задержек
    async function processMessageQueue() {
        var timerWait = 0;
        while (messageQueue.length > 0) {
            var data = messageQueue[0];
            console.log('Processing message:', data);

            document.getElementsByClassName(data.changeLanguageButtonClass)[0].click();
            await delay(20);

            while (timerWait < 3000) {
                var listLangsButtons = document.getElementsByClassName(listLanguageButtonsClass);
                if (listLangsButtons.length > 0) break;
                timerWait += 20;
                await delay(20);
            }
            timerWait = 0;

            listLangsButtons = document.getElementsByClassName(listLanguageButtonsClass);

            var elementsFieldsText = document.getElementsByClassName(fieldTextClass);
            var prew_val = elementsFieldsText[0].innerText;

            listLangsButtons[data.langNumber].click();

            while (timerWait < 1500) {
                elementsFieldsText = document.getElementsByClassName(toCopy);
                if (prew_val != elementsFieldsText[0].innerText) break;

                if (listLangsButtons.length > 0) break;
                timerWait += 20;
                await delay(20);
            }
            timerWait = 0;

            elementsFieldsText = document.getElementsByClassName(toCopy);
            var dataArrayDescriptions = [];
            for (var j = 0; j < data.dataDescription.length; j++) {
                if (j == 1) continue;
                elementsFieldsText[j].innerText = data.dataDescription[j];
            }

            await delay(20);

            messageQueue.shift();
        }
    }

    channel.onmessage = function(event) {
        console.log('Received data:', event.data);
        messageQueue.push(event.data);

        if (messageQueue.length === 1) {
            processMessageQueue();
        }
    };
    //////////////////////////////////////////////////////////////////////////////////////////////
})();