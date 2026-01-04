// ==UserScript==
// @name         #НетСловуСУЕТА
// @namespace    https://lolz.live/
// @version      1.1
// @description  Возвращаем оффтопик домой
// @author       Абаюдный
// @match        https://lolz.live/forums/8/*
// @match        https://lolz.live/threads/*
// @match        https://zelenka.guru/*
// @match        https://lzt.market/*
// @match        https://lolz.guru/*
// @match        https://lolz.live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/519755/%D0%9D%D0%B5%D1%82%D0%A1%D0%BB%D0%BE%D0%B2%D1%83%D0%A1%D0%A3%D0%95%D0%A2%D0%90.user.js
// @updateURL https://update.greasyfork.org/scripts/519755/%D0%9D%D0%B5%D1%82%D0%A1%D0%BB%D0%BE%D0%B2%D1%83%D0%A1%D0%A3%D0%95%D0%A2%D0%90.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function cleanUp() {
        // Замена в заголовках h1
        const titleElement = document.querySelector('h1[title]');
        if (titleElement && /Осенняя суета/i.test(titleElement.textContent)) {
            titleElement.textContent = titleElement.textContent.replace(/Осенняя суета/gi, "Оффтопик").trim();
            if (titleElement.hasAttribute("title")) {
                titleElement.setAttribute("title", titleElement.getAttribute("title").replace(/Осенняя суета/gi, "Оффтопик").trim());
            }
        }

        // Замена в описании страницы
        const pageDescriptionLink = document.querySelector('#pageDescription a[href="forums/8/"]');
        if (pageDescriptionLink && /Осенняя суета/i.test(pageDescriptionLink.textContent)) {
            pageDescriptionLink.textContent = pageDescriptionLink.textContent.replace(/Осенняя суета/gi, "Оффтопик").trim();
        }

        // Замена в хлебных крошках
        const breadcrumbLink = document.querySelector('fieldset.breadcrumb a[href="https://lolz.live/forums/8/"] span[itemprop="name"]');
        if (breadcrumbLink && /Осенняя суета/i.test(breadcrumbLink.textContent)) {
            breadcrumbLink.textContent = breadcrumbLink.textContent.replace(/Осенняя суета/gi, "Оффтопик").trim();
        }

        // Замена во всех ссылках на форум оффтопика
        const links = document.querySelectorAll('a[href="forums/8/"]');
        links.forEach(link => {
            if (/Осенняя суета/i.test(link.textContent)) {
                link.textContent = link.textContent.replace(/Осенняя суета/gi, "Оффтопик").trim();
            }
        });

        // Дополнительная замена во всех элементах на странице
        document.querySelectorAll('*').forEach(element => {
            element.childNodes.forEach(childNode => {
                if (childNode.nodeType === Node.TEXT_NODE && /Осенняя суета/i.test(childNode.textContent)) {
                    childNode.textContent = childNode.textContent.replace(/Осенняя суета/gi, "Оффтопик");
                }
            });
        });
    }

    cleanUp();

    const targetNodes = [
        document.querySelector('#pageDescription'),
        document.querySelector('.titleBar'),
        document.querySelector('fieldset.breadcrumb'),
        document.body
    ].filter(Boolean);

    targetNodes.forEach((node) => {
        const observer = new MutationObserver(() => {
            clearTimeout(node.debounce);
            node.debounce = setTimeout(cleanUp, 100);
        });

        observer.observe(node, { childList: true, subtree: true });
    });
})();