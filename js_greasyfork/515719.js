// ==UserScript==
// @name         Taobao Russian Search
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Автоматический перевод поискового запроса с русского на китайский
// @author       David Nigativ
// @match        https://*.taobao.com/*
// @grant        GM_xmlhttpRequest
// @connect      translate.googleapis.com
// @downloadURL https://update.greasyfork.org/scripts/515719/Taobao%20Russian%20Search.user.js
// @updateURL https://update.greasyfork.org/scripts/515719/Taobao%20Russian%20Search.meta.js
// ==/UserScript==

(function() {
    'use strict';

    async function translateToChinese(text) {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=ru&tl=zh&dt=t&q=${encodeURIComponent(text)}`;

        return new Promise((resolve, reject) => {
            GM_xmlhttpRequest({
                method: 'GET',
                url: url,
                onload: function(response) {
                    try {
                        const data = JSON.parse(response.responseText);
                        const translation = data[0][0][0];
                        resolve(translation);
                    } catch (error) {
                        reject(error);
                    }
                },
                onerror: function(error) {
                    reject(error);
                }
            });
        });
    }

    // Находим форму поиска
    function handleSearch() {
        const searchForm = document.querySelector('form[action*="search"]');
        const searchInput = document.querySelector('input[name="q"]');

        if (searchForm && searchInput) {
            searchForm.addEventListener('submit', async function(e) {
                // Проверяем, что текст на русском
                if (/[а-яА-ЯёЁ]/.test(searchInput.value)) {
                    e.preventDefault();
                    try {
                        // Переводим текст
                        const translatedText = await translateToChinese(searchInput.value);
                        // Подставляем перевод в поле поиска
                        searchInput.value = translatedText;
                        // Отправляем форму
                        searchForm.submit();
                    } catch (error) {
                        console.error('Ошибка перевода:', error);
                        // Если произошла ошибка, все равно выполняем поиск
                        searchForm.submit();
                    }
                }
            });
        }
    }

    // Запускаем после загрузки страницы
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', handleSearch);
    } else {
        handleSearch();
    }
})();