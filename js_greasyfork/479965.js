// ==UserScript==
// @name         [LZT] User Win Contests
// @namespace    [LZT] User Win Contests
// @version      0.5
// @description  Zelenka Guru - User Win Contests
// @author       el9in
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @match        https://lolz.guru/*
// @match        https://lolz.live/*
// @match        https://zelenka.guru
// @match        https://lzt.market
// @match        https://lolz.guru
// @match        https://lolz.live
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zelenka.guru
// @grant        none
// @license      el9in
// @downloadURL https://update.greasyfork.org/scripts/479965/%5BLZT%5D%20User%20Win%20Contests.user.js
// @updateURL https://update.greasyfork.org/scripts/479965/%5BLZT%5D%20User%20Win%20Contests.meta.js
// ==/UserScript==



(function() {
    'use strict';
    const inputElement = document.querySelector('input[type="hidden"][name="_xfToken"]');
    const followContainer = document.querySelector('div.followContainer') || document.querySelector('a.button.full.followContainer.OverlayTrigger');
    if(followContainer && inputElement) {
        const xfTokenValue = inputElement.value;
        const idContainer = document.createElement('div');
        idContainer.className = 'idContainer';
        const idButton = document.createElement('a');
        idButton.className = 'idButton button block OverlayTrigger';
        idButton.setAttribute('title', '');
        idButton.setAttribute('win_contests', '');
        idButton.setAttribute('data-cacheoverlay', 'false');
        idButton.textContent = 'Выигранные розыгрыши';
        idContainer.appendChild(idButton);
        followContainer.insertAdjacentElement('afterend', idContainer);
        idButton.addEventListener('click', async function() {
            const userContentLinks = document.querySelector('div.userContentLinks');
            const firstLink = userContentLinks.querySelector('a.button:nth-child(2)');
            const href = firstLink.getAttribute('href');
            const hrefText = href.match(/\/(\d+)\//)[1];
            if((hrefText | 0) != 0) {
                const userId = hrefText | 0;
                const formData = new FormData();
                formData.append('keywords', `@${userId}`);
                formData.append('users', 'root');
                formData.append('date', '');
                formData.append('nodes[]', '771');
                formData.append('child_nodes', `1`);
                formData.append('order', 'relevance');
                formData.append('_xfToken', xfTokenValue);
                formData.append('_xfNoRedirect', 'json');
                formData.append('_xfResponseType', 'json');
                try {
                    const response = await fetch("/search/search", {
                        "body": formData,
                        "method": "POST",
                        "mode": "cors",
                        "credentials": "include"
                    });
                    const result = await response.json();
                    if(result) {
                        XenForo.alert('Выполняем переход', "Оповещение", 2000);
                        window.location.href = result._redirectTarget;
                    }
                } catch(error) {
                    XenForo.alert('Не удалось создать поисковый запрос, подробности в консоли', "Оповещение", 2000);
                    console.log(error);
                }
            }
        });
    }
})();