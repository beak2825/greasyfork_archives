// ==UserScript==
// @name         Hidder
// @version      1.2
// @description  Make "hide" button works
// @author       Rst00
// @match        https://www.wykop.pl/wykopalisko/*
// @namespace WykopHidder
// @downloadURL https://update.greasyfork.org/scripts/393487/Hidder.user.js
// @updateURL https://update.greasyfork.org/scripts/393487/Hidder.meta.js
// ==/UserScript==

const localStorageKey = 'WykopHidder';

(function() {
    'use strict';

    hideAllArticles();

    hideOldButton();
    addNewButton();
    handleNewButtonClick();

    clearOldEnteries();
})();

function hideOldButton() {
    const allButtons = document.querySelectorAll('.fix-tagline a.ajax.affect.create');

    allButtons.forEach(button => button.style.display = 'none');
}

function addNewButton() {
    const allContainers = document.querySelectorAll('.fix-tagline');

    allContainers.forEach(container => {
        const newButton = document.createElement('button');

        newButton.type = 'button';
        newButton.classList = 'rst-hide-button';
        newButton.innerText = 'ukryj';

        container.appendChild(newButton);
    });
}

function handleNewButtonClick() {
    $(document).on('click', '.rst-hide-button', function() {
        const container = $(this).parents('li.link');
        const articleId = container.find('.article').attr('data-id');

        saveDataToLS({
            id: articleId,
            createdAt: getCurrentDate(),
        });
        $(this).closest('li.link').remove();
    });
}

function hideAllArticles() {
    const articlesToHide = getDataFromLS();
    const allIds = articlesToHide.reduce((allIds, currentArticle) => [...allIds, currentArticle.id], []);

    const allArticles = document.querySelectorAll('#itemsStream .article');

    allArticles.forEach((article) => {
        if (allIds.includes(article.getAttribute('data-id'))) {
            article.parentNode.remove();
        }
    });
    wykop.bindLazy();
}

function getDataFromLS() {
    const articles = localStorage.getItem(localStorageKey);

    return articles ? JSON.parse(articles) : [];
}

function saveDataToLS(articleData) {
    const newDataToSave = JSON.stringify([...getDataFromLS(), articleData]);

    localStorage.setItem(localStorageKey, newDataToSave);
}

function clearOldEnteries() {
    const allArticles = getDataFromLS();
    const nowDate = getCurrentDate();
    const filteredArticles = allArticles.filter(article => article.createdAt + 60*60*24*7 > nowDate);

    localStorage.setItem(localStorageKey, JSON.stringify(filteredArticles));
}

function getCurrentDate() {
    return Math.floor(new Date().getTime() / 1000);
}