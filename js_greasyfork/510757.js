// ==UserScript==
// @name         ParseTimeLZT
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  Кому надо, тут парс времени ласт онлайна юзера
// @author       eretly
// @match        https://lolz.live/*
// @match        https://lolz.guru/*
// @match        https://zelenka.guru/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/510757/ParseTimeLZT.user.js
// @updateURL https://update.greasyfork.org/scripts/510757/ParseTimeLZT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let inputMenu = document.createElement('div');
    inputMenu.style.position = 'fixed';
    inputMenu.style.top = '10px';
    inputMenu.style.right = '10px';
    inputMenu.style.padding = '10px';
    inputMenu.style.borderRadius = "6px";
    inputMenu.style.backgroundColor = '#272727';
    inputMenu.style.zIndex = '10000';

    let inputField = document.createElement('input');
    inputField.classList.add("textCtrl");
    inputField.type = 'text';
    inputField.placeholder = 'айди сюда (через запятую)';
    inputMenu.appendChild(inputField);

    let button = document.createElement('button');
    button.classList.add("button", "primary");
    button.innerHTML = 'Get Data-Time';
    button.style.marginLeft = "5px";
    button.style.marginTop = "2px";
    button.style.height = "26px";
    button.style.lineHeight = "26px";
    inputMenu.appendChild(button);

    document.body.appendChild(inputMenu);

    async function fetchMemberCard(memberId) {
        let profileUrl = `https://lolz.live/members/${memberId}/?card=1`;

        const response = await fetch(profileUrl, {
            method: 'GET',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'text/html'
            }
        });

        const htmlText = await response.text();
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlText, 'text/html');

        const nameElement = doc.querySelector(`#memberCard${memberId} h3 a span`);
        const name = nameElement ? nameElement.innerText : "Имя не найдено";

        const activityContainer = doc.querySelector(`#memberCard${memberId} .activityContainer`);
        let dateOutput = "";

        if (activityContainer) {
            const abbrElement = activityContainer.querySelector('abbr.DateTime');

            if (abbrElement) {
                dateOutput = abbrElement.innerText ? abbrElement.innerText : "Дата не найдена";
            } else {
                const spanElement = activityContainer.querySelector('span.DateTime');

                if (spanElement) {
                    dateOutput = spanElement.getAttribute('title') ? spanElement.getAttribute('title') : "Дата не найдена";
                }
            }
        }

        return { name, date: dateOutput };
    }

    button.addEventListener('click', function() {
        const memberIds = inputField.value.split(',').map(id => id.trim());

        if (memberIds.length > 0) {
            Promise.all(memberIds.map(fetchMemberCard))
                .then(results => {
                    results.forEach(result => {
                        console.log(`Имя: ${result.name}, Дата: ${result.date}`);
                    });
                })
                .catch(error => console.error("Ошибка при получении данных:", error));
        }
    });
})();
