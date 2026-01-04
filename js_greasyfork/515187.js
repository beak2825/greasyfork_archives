// ==UserScript==
// @name         Steam Fix RU
// @namespace    Steam Fix RU
// @version      1.1
// @author		Danzo
// @description  Убирает параметр `l=russian` из URL для CSS и JS
// @match        *://store.steampowered.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/515187/Steam%20Fix%20RU.user.js
// @updateURL https://update.greasyfork.org/scripts/515187/Steam%20Fix%20RU.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function removeLanguageParam() {
        // Находим все CSS и JavaScript ресурсы
        document.querySelectorAll('link[rel="stylesheet"], script[src]').forEach(resource => {
            // Определяем нужный атрибут (href для link и src для script)
            const urlAttr = resource.tagName === 'LINK' ? 'href' : 'src';
            
            // Проверяем, что атрибут существует и начинается с 'http'
            if (resource[urlAttr] && resource[urlAttr].startsWith('http')) {
                try {
                    let url = new URL(resource[urlAttr]);

                    // Удаляем параметр l=russian, если он присутствует
                    if (url.searchParams.get('l') === 'russian') {
						// Логируем исходный URL
						// console.log("Detected resource:", url.toString());
						
                        url.searchParams.delete('l');
                        resource[urlAttr] = url.toString();

                        // Логируем новый URL после удаления параметра
                        // console.log("Updated resource:", resource[urlAttr]);
                    }
                } catch (e) {
                    console.error("Invalid URL detected:", resource[urlAttr], e);
                }
            }
        });
    }

    // Запускаем функцию сразу при загрузке страницы
    removeLanguageParam();

    // Используем MutationObserver для обработки новых ресурсов, добавленных динамически
    const observer = new MutationObserver(removeLanguageParam);
    observer.observe(document.head || document.documentElement, { childList: true, subtree: true });
})();
