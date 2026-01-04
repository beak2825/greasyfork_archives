// ==UserScript==
// @name         Linker SDT
// @namespace    http://tishka.xyz/sdt
// @version      1.1
// @description  updated linker
// @author       Tishka
// @match        https://my.livechatinc.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=livechatinc.com
// @require 	 https://greasyfork.org/scripts/28536-gm-config/code/GM_config.js?version=184529
// @grant       GM.getValue
// @grant       GM_getValue
// @grant       GM.setValue
// @grant       GM_setValue
// @downloadURL https://update.greasyfork.org/scripts/437125/Linker%20SDT.user.js
// @updateURL https://update.greasyfork.org/scripts/437125/Linker%20SDT.meta.js
// ==/UserScript==

// переписано все это чудо
// настройки на ctrl + /

(async function() {
    'use strict';

    GM_config.init(
        {
            'id': 'MyConfig', // The id used for this instance of GM_config
            'title': 'Настройки скрипта',
            'fields': // Fields object
            {
                'colors': // This is the id of the field
                {
                    'label': 'Подсветка чата(верхняя строка)', // Appears next to field
                    'type': 'checkbox', // Makes this setting a text field
                    'default': 'true' // Default value if user doesn't change it
                },
                'emailLinks': // This is the id of the field
                {
                    'label': 'Ссылка вместо почты или телефона в правом меню', // Appears next to field
                    'type': 'checkbox', // Makes this setting a text field
                    'default': '1' // Default value if user doesn't change it
                },
                'emailChatLinks': // This is the id of the field
                {
                    'label': 'Ссылка вместо email адресов в чате ', // Appears next to field
                    'type': 'checkbox', // Makes this setting a text field
                    'default': '1' // Default value if user doesn't change it
                },
            }
        });
    //
    let isColorsEnabled = GM_config.get("colors");
    let isEmailLinksEnabled = GM_config.get("emailLinks");
    let isEmailChatLinksEnabled = GM_config.get("emailChatLinks");

    const handleKeyboard = event => {
        if (event.key === '/' && event.ctrlKey) GM_config.open();
    }
    document.addEventListener('keyup', handleKeyboard);

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    while(true){
        await sleep(100);
        const chatEmailSelector = ".css-1nmshg5.fs-mask"; // селектор почты/телефона
        const chatProjectGroupSelector = ".css-1caczvn.css-1sbvcrk0"; // селектор названия проекта в чатах
        const archiveProjectGroupSelector = ".css-191wvi.css-1xfc7gy2"; // селектор названия проекта в архивах
        const messagesListSelector = ".css-1hdsu9g" // селектор блока, в котором чат
        const chatBgSelector = ".css-103w229"; // селектор верхнего блока, который будет подсвечен

        let projectGroupSelector; // здесь будет селектор из верхних двух в зависимости от текущей страницы

        if(window.location.href.match(/chats/))
        {
            projectGroupSelector = chatProjectGroupSelector; // если мы на странице чатов
        }
        else if(window.location.href.match(/archives/)){
            projectGroupSelector = archiveProjectGroupSelector; // если мы на странице архивов
        }

        let chatEmailElem = document.querySelector(chatEmailSelector);
        let projectNameElem = document.querySelector(projectGroupSelector);
        if(chatEmailElem && projectNameElem && isEmailLinksEnabled){
            // если найден адрес и название проекта
            if(document.getElementById("enhancerLinkElem")){
                console.log(`Найдена ссылка`);
                continue;
            }
            let email = chatEmailElem.innerText;
            let emailLink;
            let currentProjectName = projectNameElem.innerText.split(" ")[0].toLowerCase() == "volna" ? "" : "-" + projectNameElem.innerText.split(" ")[0].toLowerCase();
            if(email.charAt(0) == "+"){
                // если первый символ "+", то это номер
                emailLink = `https://marketing${currentProjectName}.lux-casino.co/backend/players/find_user?filters[phone_number]=${email}&commit=Найти'`
            }
            else
            {
                // если почта
                emailLink = `https://marketing${currentProjectName}.lux-casino.co/backend/players/find_user?filters[id_or_email]=${email}&commit=Найти'`;
            }
            let fullLinkElem = `<a id="enhancerLinkElem" target="_blank" href="${emailLink}">${email}</a>`;
            document.querySelector(chatEmailSelector).innerHTML = fullLinkElem;
        }
        // скипаем, если найден элемент ссылки


        if(projectNameElem && isEmailChatLinksEnabled){
            let currentProjectName = projectNameElem.innerText.split(" ")[0].toLowerCase() == "volna" ? "" : "-" + projectNameElem.innerText.split(" ")[0].toLowerCase();
            // все ссылки mailto заменяем на ссылку в бэ
            let linksMail = document.querySelectorAll(`a[href^="mailto:"]`);
            if(linksMail){
                for(let value of linksMail){
                    value.href = `https://marketing${currentProjectName}.lux-casino.co/backend/players/find_user?filters[id_or_email]=${value.href.split("mailto:")[1]}&commit=Найти'`;
                }
            }
        }
        if(projectNameElem && isColorsEnabled){
            //подсветка в зависимости от проекта
            let colorProjectName = projectNameElem.innerText.split(" ")[0].toLowerCase();
            const colors = {izzi: "rgb(58 145 183 / 50%)", jet :"rgb(89 9 227 / 50%)", sol:"rgb(253 153 10 / 50%)", fresh:"rgb(10 250 110 / 50%)", rox:"rgb(255 29 0 / 50%)", volna:"rgb(27 91 255 / 50%)"};
            let chatBgElem = document.querySelector(chatBgSelector);
            if(chatBgElem){
                chatBgElem.style.backgroundColor = colors[colorProjectName];
            }
        }

    }
})();