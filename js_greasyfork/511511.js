// ==UserScript==
// @name         Rearrange Links on animestars.org
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  Располагает ссылки в заданном порядке на странице animestars.org и заменяет ссылку на "Моя коллекция" на "Ответы на вопросы" и "Сообщения" на "Промокоды" с новой иконкой. Меняет расположение оставленных комментариев по клику на div ваших комментов. Кнопка коллекций на главной странице перекидывает на коллекции. Добавлены специфические размеры для ПК и телефонов.
// @author       eretly
// @icon         https://animestars.org/favicon.ico
// @match        https://animestars.org/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/511511/Rearrange%20Links%20on%20animestarsorg.user.js
// @updateURL https://update.greasyfork.org/scripts/511511/Rearrange%20Links%20on%20animestarsorg.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getElementByXpath(path) {
        return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
    }

    function generateLinkXPath(number) {
        return `/html/body/div[2]/ul/li[${number}]/a`;
    }

    let linksToSwap = [3, 2, 5, 6, 7, 10, 9, 8, 4, 1, 11];
    let originalLinks = [];

    for (let i = 1; i <= 11; i++) {
        let linkXPath = generateLinkXPath(i);
        let linkElement = getElementByXpath(linkXPath);
        if (linkElement) {
            originalLinks.push(linkElement);
        }
    }

    const headerElement = document.querySelector('header');

    const linkElement = Array.from(headerElement.querySelectorAll('a')).find(link => link.href.match(/https:\/\/animestars\.org\/user\/(.+)\/$/));

    if (linkElement) {
        const oldHref = linkElement.href;

        const usernameMatch = oldHref.match(/https:\/\/animestars\.org\/user\/(.+)\/$/);

        if (usernameMatch) {
            const username = usernameMatch[1];
            linkElement.href = `https://animestars.org/user/${username}/watchlist/`;
        }
    }


    const myListsLinkXPath = '/html/body/div[2]/ul/li[6]/a';
    const myListsLink = getElementByXpath(myListsLinkXPath);

    if (myListsLink) {
        myListsLink.childNodes[1].textContent = "Мои списки";
    }

    const promoLinkXPath = generateLinkXPath(8);
    const promoLink = getElementByXpath(promoLinkXPath);

    if (promoLink) {
        promoLink.outerHTML = `
    <a href="https://animestars.org/promo_codes" style="display: flex; flex-direction: column; justify-content: center; align-items: center; border-radius: 6px; padding: 8.3px; text-align: center; white-space: nowrap; background-color: var(--ui-bg-darker); box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1); font-size: 13px; color: var(--tt); text-decoration: none; transition: all .3s; height: 100%; position: relative;">
        <svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="-5.0 -10.0 110.0 135.0" class="fal" style="width: 40px; height: 40px; opacity: 0.34; position: absolute; top: 8px; fill: currentColor; transition: fill 0.3s;">
            <path d="m92.879 30.051-8.1328-8.1328c-0.78125-0.78125-2.0469-0.78125-2.8281 0-1.0273 1.0234-2.8125 1.0234-3.8398 0-0.51172-0.51172-0.79297-1.1953-0.79297-1.918 0-0.72656 0.28125-1.4062 0.79297-1.918 0.375-0.375 0.58594-0.88281 0.58594-1.4141s-0.21094-1.0391-0.58594-1.4141l-8.1328-8.1328c-1.3203-1.3242-3.0781-2.0508-4.9492-2.0508s-3.6289 0.72656-4.9492 2.0508l-52.926 52.93c-2.7266 2.7305-2.7266 7.168 0 9.8984l8.1328 8.1328c0.78125 0.78125 2.0469 0.78125 2.8281 0 1.0273-1.0234 2.8125-1.0234 3.8398 0 1.0586 1.0586 1.0586 2.7812 0 3.8398-0.78125 0.78125-0.78125 2.0469 0 2.8281l8.1328 8.1328c1.3203 1.3242 3.0781 2.0508 4.9492 2.0508s3.6289-0.72656 4.9492-2.0508l52.93-52.93c2.7266-2.7305 2.7266-7.168 0-9.8984zm-55.758 60c-1.1328 1.1328-3.1094 1.1328-4.2422 0l-6.9336-6.9336c1.3281-2.5312 0.92578-5.7383-1.1992-7.8672-2.125-2.125-5.332-2.5234-7.8633-1.1992l-6.9336-6.9297c-1.168-1.168-1.168-3.0742 0-4.2422l13.051-13.051 27.172 27.172zm52.93-52.93-37.051 37.051-27.172-27.172 37.051-37.051c1.1328-1.1328 3.1094-1.1328 4.2422 0l6.9297 6.9297c-0.5 0.95312-0.76562 2.0156-0.76562 3.1211 0 1.793 0.69922 3.4805 1.9688 4.7461 2.125 2.125 5.3359 2.5273 7.8633 1.1992l6.9336 6.9297c1.168 1.168 1.168 3.0742 0 4.2422z"/>
            <path d="m74.277 42.195-6.8867-4.5039 0.40625-8.2188c0.039063-0.78516-0.39062-1.5234-1.0898-1.8789-0.70312-0.35547-1.5469-0.26953-2.1602 0.22266l-6.4102 5.1562-7.6914-2.9258c-0.73437-0.28125-1.5703-0.10156-2.125 0.45703-0.55469 0.55469-0.73437 1.3906-0.45703 2.125l2.9258 7.6914-5.1602 6.4102c-0.49219 0.61328-0.58203 1.4609-0.22266 2.1602 0.35547 0.69922 1.0703 1.1211 1.8828 1.0898l8.2188-0.40625 4.5039 6.8867c0.37109 0.57031 1.0078 0.90625 1.6719 0.90625 0.10156 0 0.20703-0.007813 0.3125-0.023438 0.77734-0.125 1.4102-0.69141 1.6172-1.4531l2.1562-7.9414 7.9414-2.1562c0.76172-0.20703 1.3281-0.83984 1.4531-1.6172 0.12109-0.77734-0.22266-1.5547-0.88281-1.9883zm-10.668 2.1992c-0.68359 0.1875-1.2188 0.72266-1.4062 1.4062l-1.2891 4.75-2.6953-4.1172c-0.37109-0.56641-1-0.90625-1.6719-0.90625-0.03125 0-0.066406 0-0.097656 0.003906l-4.9141 0.24219 3.0859-3.8359c0.44531-0.55078 0.5625-1.3008 0.30859-1.9648l-1.75-4.6016 4.6016 1.75c0.66406 0.25 1.4102 0.13281 1.9648-0.3125l3.8359-3.0859-0.24219 4.9141c-0.035156 0.71094 0.30859 1.3828 0.90234 1.7734l4.1172 2.6953z"/>
            <path d="m39.961 77.719-17.676-17.676c-0.78125-0.78125-2.0469-0.78125-2.8281 0s-0.78125 2.0469 0 2.8281l17.676 17.676c0.39063 0.39062 0.90234 0.58594 1.4141 0.58594s1.0234-0.19531 1.4141-0.58594c0.78125-0.78125 0.78125-2.0469 0-2.8281z"/>
        </svg>
        <span style="margin-top: 30px;">Промокоды</span>
    </a>`;
    }

    const collectionLinkXPath = generateLinkXPath(10);
    const collectionLink = getElementByXpath(collectionLinkXPath);

    if (collectionLink) {
        collectionLink.outerHTML = `
    <a href="https://animestars.org/faq/" style="display: flex; flex-direction: column; justify-content: center; align-items: center; border-radius: 6px; padding: 8.3px; text-align: center; white-space: nowrap; background-color: var(--ui-bg-darker); box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.1); font-size: 13px; color: var(--tt); text-decoration: none; transition: all .3s; height: 100%; position: relative;">
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 14 14" class="fal" style="opacity: 0.27; position: absolute; top: 8px;">
            <circle cx="7" cy="7" r="6.5" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
            <path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" d="M5.5 5.5A1.5 1.5 0 1 1 7 7v1"/>
            <path fill="currentColor" d="M7 9.5a.75.75 0 1 0 .75.75A.76.76 0 0 0 7 9.5Z"/>
        </svg>
        <span style="margin-top: 30px;">Ответы на вопросы</span>
    </a>`;
    }

    const noLabelElements = document.querySelectorAll('.usp__list .no-label');
    noLabelElements.forEach(element => {
        element.style.display = 'none';
    });

    const commentsLinkXPath = '//*[@id="userinfo"]/div[1]/div/ul[2]/li/a';
    const commentsLink = getElementByXpath(commentsLinkXPath);

    const commentsContainerUserinfoXPath = '//*[@id="userinfo"]/div[1]/div[1]/div[2]/div/div[2]';
    const commentsContainerUserinfo = getElementByXpath(commentsContainerUserinfoXPath);

    const commentsContainerDleContentXPath = '//*[@id="dle-content"]/div[1]/div[1]/div[2]/div/div[2]';
    const commentsContainerDleContent = getElementByXpath(commentsContainerDleContentXPath);

    const commentsLinkDleContentXPath = '//*[@id="dle-content"]/div[1]/div/ul[2]/li/a';
    const commentsLinkDleContent = getElementByXpath(commentsLinkDleContentXPath);

    function addLinkToContainer(container, link) {
        if (container && link) {
            const commentsLinkWrapper = document.createElement('a');
            commentsLinkWrapper.href = link.href;
            commentsLinkWrapper.style.position = "absolute";
            commentsLinkWrapper.style.width = "100%";
            commentsLinkWrapper.style.height = "100%";
            commentsLinkWrapper.style.top = "0";
            commentsLinkWrapper.style.left = "0";
            commentsLinkWrapper.style.cursor = "pointer";
            commentsLinkWrapper.style.borderRadius = "5px";
            commentsLinkWrapper.style.backgroundColor = "transparent";
            commentsLinkWrapper.style.display = "flex";
            commentsLinkWrapper.style.justifyContent = "center";
            commentsLinkWrapper.style.alignItems = "center";

            container.style.position = "relative";

            if (!container.querySelector('a[href*="lastcomments"]')) {
                container.appendChild(commentsLinkWrapper);
            }
        }
    }

    addLinkToContainer(commentsContainerUserinfo, commentsLink);
    addLinkToContainer(commentsContainerDleContent, commentsLinkDleContent);

    const style = document.createElement('style');
    style.textContent = `
    .login__menu a {
        min-width: 105px;
    }

    @media (max-width: 768px) {
        .login__menu {
            display: flex;
            flex-wrap: wrap;
            gap: 0px;
        }
        .login__menu a {
            flex-basis: calc(50% - 1px);
            justify-content: center;
            box-sizing: border-box;
        }
        .login__menu a:last-child:nth-child(odd) {
            flex-basis: 100%;
        }
    }

    a:hover, a:focus {
        color: #9e294f !important;
        text-decoration: none !important;
    }

    a[style*="Ответы на вопросы"]:hover {
        color: #9e294f !important;
        text-decoration: none !important;
    }
`;
    document.head.appendChild(style);

    linksToSwap.forEach((newPosition, index) => {
        let parent = originalLinks[index].parentNode;
        if (originalLinks[newPosition - 1] && parent) {
            parent.replaceChild(originalLinks[newPosition - 1].cloneNode(true), originalLinks[index]);
        }
    });

})();
