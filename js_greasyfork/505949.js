// ==UserScript==
// @name         DatPizdiAvtoruLZT
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  Добавляет кнопку Дать пизды в статьях - при нажатии перекидывает на репорт
// @author       Timka251 & eretly
// @match        https://lolz.live/threads/*
// @match        https://lolz.guru/threads/*
// @match        https://zelenka.guru/threads/*
// @icon         https://nztcdn.com/files/f1a0f660-0e67-41aa-bc44-ad644bf1df88.webp
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/505949/DatPizdiAvtoruLZT.user.js
// @updateURL https://update.greasyfork.org/scripts/505949/DatPizdiAvtoruLZT.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const hostname = window.location.hostname;

    const postElement = document.querySelector('li[id^="post-"]');
    if (!postElement) return;

    const threadId = postElement.id.split('-')[1];

    const thankAuthorBox = document.querySelector('.thankAuthorBox');
    if (!thankAuthorBox) return;

    const verticalSeparatorContainer = document.createElement('div');
    verticalSeparatorContainer.style.display = 'flex';
    verticalSeparatorContainer.style.flexDirection = 'row';
    verticalSeparatorContainer.style.alignItems = 'flex-start';
    verticalSeparatorContainer.style.justifyContent = 'space-between';

    const leftContentContainer = document.createElement('div');
    leftContentContainer.style.flex = '1';
    while (thankAuthorBox.firstChild) {
        leftContentContainer.appendChild(thankAuthorBox.firstChild);
    }

    const rightContentContainer = document.createElement('div');
    rightContentContainer.style.flex = '1';
    rightContentContainer.style.marginLeft = '20px';
    rightContentContainer.style.position = 'relative';
    rightContentContainer.style.padding = '15px 20px';

    const newTextElement = document.createElement('div');
    newTextElement.className = 'thankAuthorTitle';
    newTextElement.style.fontSize = '16px';
    newTextElement.style.fontWeight = '600';
    newTextElement.style.color = '#FFF';
    newTextElement.textContent = 'Эта статья оказалась хуйнёй?';
    newTextElement.style.position = 'absolute';
    newTextElement.style.top = '0px';
    newTextElement.style.left = '20px';

    const newButtonElement = document.createElement('a');
    newButtonElement.href = `https://${hostname}/posts/${threadId}/report`; // Динамический URL
    newButtonElement.style.display = 'inline-flex';
    newButtonElement.style.alignItems = 'center';
    newButtonElement.style.padding = '7.6px';
    newButtonElement.style.backgroundColor = '#333';
    newButtonElement.style.borderRadius = '5px';
    newButtonElement.style.textDecoration = 'none';
    newButtonElement.style.fontSize = '18px';
    newButtonElement.style.marginTop = '10px';
    newButtonElement.style.position = 'absolute';
    newButtonElement.style.top = '22px';
    newButtonElement.style.left = '20px';

    const buttonIcon = document.createElement('img');
    buttonIcon.src = 'https://nztcdn.com/files/f1a0f660-0e67-41aa-bc44-ad644bf1df88.webp';
    buttonIcon.style.width = '20px';
    buttonIcon.style.height = '20px';
    buttonIcon.style.marginRight = '10px';

    const buttonText = document.createElement('span');
    buttonText.textContent = 'Дать пизды автору';
    buttonText.style.fontSize = '13px';
    buttonText.style.color = '#E7F5F5';
    buttonText.style.textDecoration = 'none';

    newButtonElement.appendChild(buttonIcon);
    newButtonElement.appendChild(buttonText);

    rightContentContainer.appendChild(newTextElement);
    rightContentContainer.appendChild(newButtonElement);

    verticalSeparatorContainer.appendChild(leftContentContainer);
    verticalSeparatorContainer.appendChild(rightContentContainer);

    // Добавление вертикального разделителя в thankAuthorBox
    thankAuthorBox.appendChild(verticalSeparatorContainer);
})();
