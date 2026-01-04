// ==UserScript==
// @name         Дубль парсера
// @namespace    Uamy__
// @version      5.0
// @description  просто
// @author       ZV
// @match        *://*/Admin/CompareBag/EditBag/*
// @match        *://*//Admin/CompareBag/EditBag/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=triplenext.net
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496676/%D0%94%D1%83%D0%B1%D0%BB%D1%8C%20%D0%BF%D0%B0%D1%80%D1%81%D0%B5%D1%80%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/496676/%D0%94%D1%83%D0%B1%D0%BB%D1%8C%20%D0%BF%D0%B0%D1%80%D1%81%D0%B5%D1%80%D0%B0.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // 1. Функции для работы с размерами (системные и пользовательские поля)

    function getDimensionsFromSystem() {
        const systemDimensions = [
            parseFloat(document.getElementById('Depth').textContent.trim()),
            parseFloat(document.getElementById('Width').textContent.trim()),
            parseFloat(document.getElementById('Height').textContent.trim()),
            parseFloat(document.getElementById('CurveLength').textContent.trim())
        ];
        console.log('System Dimensions:', systemDimensions);
        return systemDimensions;
    }

    function getDimensionsFromUser() {
        const userDimensions = [
            parseFloat(document.querySelector('input[name="CurrentDepth"]').value),
            parseFloat(document.querySelector('input[name="CurrentWidth"]').value),
            parseFloat(document.querySelector('input[name="CurrentHeight"]').value),
            parseFloat(document.querySelector('input[name="CurrentCurveLength"]').value)
        ];
        console.log('User Dimensions:', userDimensions);
        return userDimensions;
    }

    function compareDimensions(systemDims, userDims) {
        const matchingDims = [];
        systemDims.forEach((sysDim, i) => {
            if (sysDim !== 0) {
                userDims.forEach(userDim => {
                    if (sysDim === userDim || sysDim === userDim / 10 || sysDim === userDim * 10) {
                        matchingDims.push(i);
                    }
                });
            }
        });
        console.log('Matching Indices:', matchingDims);
        return matchingDims;
    }

    function highlightMatchingDimensions(matchingIndices) {
        const green = '#008000';
        const ids = ['Depth', 'Width', 'Height', 'CurveLength'];
        ids.forEach((id, index) => {
            const element = document.getElementById(id);
            if (matchingIndices.includes(index)) {
                element.style.color = green;
            } else {
                element.style.color = '';
            }
        });
    }

    function init() {
        console.log('init called');
        const systemDims = getDimensionsFromSystem();
        const userDims = getDimensionsFromUser();
        const matchingIndices = compareDimensions(systemDims, userDims);
        highlightMatchingDimensions(matchingIndices);
    }

    function setupPolling() {
        let lastUserDims = [];
        setInterval(() => {
            const userDims = getDimensionsFromUser();
            if (JSON.stringify(userDims) !== JSON.stringify(lastUserDims)) {
                console.log('User dimensions changed');
                lastUserDims = userDims;
                init();
            }
        }, 500);
    }

    // 2. Функции для работы с текстом и именами пользователей

    function findTargetText() {
        const textNodes = [];
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null, false);
        let node;
        while (node = walker.nextNode()) {
            textNodes.push(node);
        }

        for (let i = 0; i < textNodes.length - 2; i++) {
            const text1 = textNodes[i].nodeValue.trim();
            const text2 = textNodes[i + 1].nodeValue.trim();
            const text3 = textNodes[i + 2].nodeValue.trim();

            if (text1 === '--------------- Initial data from parser ---------------' &&
                text2.startsWith('Category:') &&
                text3.startsWith('Gender:')) {
                const cleanedText1 = 'Initial data from PARCER:';
                return {
                    cleanedText1,
                    text2: text2.substring(9),
                    text3: text3.substring(8)
                };
            }
        }
        return null;
    }

    function getLastUserName() {
        const userNames = document.querySelectorAll('[id^="user_name_"]');
        console.log("User names found:", userNames);

        if (userNames.length === 0) {
            console.log("No user names found");
            return null;
        }

        const lastUserNameElement = userNames[userNames.length - 1];
        const lastUserName = lastUserNameElement.textContent.trim();
        return lastUserName;
    }

    function displayLastUserName() {
        const lastUserName = getLastUserName();
        if (!lastUserName) {
            console.log("Last user name is null");
            return;
        }

        const newDiv = document.createElement('div');
        newDiv.innerHTML = `<span style="color: Grey;">Last user:</span> <span style="color: red; font-style: italic;">${lastUserName}</span>`;
        newDiv.style.fontWeight = 'bold';
        newDiv.style.marginLeft = '10px';
        newDiv.style.backgroundColor = '#f2f2f2';
        newDiv.style.borderRadius = '10px';
        newDiv.style.padding = '2px 10px';
        newDiv.style.display = 'inline-block';

        const targetRow = document.querySelector('#edit-bag-header > table:nth-child(3) > tbody > tr:nth-child(4) > td:nth-child(2)');
        if (targetRow) {
            targetRow.appendChild(newDiv);
            console.log("Last user name inserted");
        } else {
            console.log("Target row not found");
        }
    }

    function displayTextInfo() {
        const targetText = findTargetText();
        if (targetText) {
            const targetElement = document.querySelector('td#StrapDropError[colspan="2"]');
            if (targetElement) {
                const newElement = document.createElement('span');
                newElement.style.backgroundColor = '#f2f2f2';
                newElement.style.borderRadius = '10px';
                newElement.style.padding = '5px 10px';
                newElement.innerHTML = `
                    ${targetText.cleanedText1} Gender: <span style="color: red; font-style: italic;">${targetText.text3}</span> Category: <span style="color: red; font-style: italic;">${targetText.text2}</span>
                `;
                targetElement.appendChild(newElement);
            }
        }
    }

    // 3. Инициализация при загрузке страницы
    window.addEventListener('load', () => {
        console.log('Page loaded');
        init();
        setupPolling();
        displayLastUserName();
        displayTextInfo();
    });

})();