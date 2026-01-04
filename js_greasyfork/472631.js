// ==UserScript==
// @name         HDrezka авто-раскрытие
// @name:en      HDrezka auto-deployment
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description:en This code automatically clicks the <<Show FULL GRAPHIC>> button when the page loads to show the remaining seasons + automatically hides the list of episodes.
// @description  Этот код автоматически нажимает кнопку <<ПОКАЗАТЬ ПОЛНЫЙ ГРАФИК>> при загрузке страницы, чтобы показать остальные сезоны + автоматически скрывает список серий. При наличии только одного сезона: Автоматическое нажатие на кнопку "Показать полный график" или "загрузить еще серии"
// @author       TheTime
// @match         http*://hdrezka*/*
// @match         http*://rezka*/*
// @match         http*://hdrezka.me/*
// @match         http*://hdrezka.co/*
// @match         http*://rezka.ag/*
// @match         http*://rezkify.com/*
// @match         http*://rezkery.com/*
// @match         http*://kinopub.me/*
// @icon            https://static.hdrezka.ac/templates/hdrezka/images/favicon.ico
// @grant           GM_info
// @grant           GM_addStyle
// @grant           GM_xmlhttpRequest
// @run-at          document-body
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472631/HDrezka%20%D0%B0%D0%B2%D1%82%D0%BE-%D1%80%D0%B0%D1%81%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/472631/HDrezka%20%D0%B0%D0%B2%D1%82%D0%BE-%D1%80%D0%B0%D1%81%D0%BA%D1%80%D1%8B%D1%82%D0%B8%D0%B5.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.addEventListener('DOMContentLoaded', function() {
        setTimeout(function() {
            const showFullGraphButton = document.querySelector('.b-post__schedule_more');
            const loadMoreSeries = document.querySelector('.load-more');
            const toggleButton = document.querySelector('.act');
            const scheduleBlocks = document.querySelectorAll('.b-post__schedule_block');
            const hiddenRows = document.querySelectorAll('tr[style="display: none;"]');

            console.log("Show Full Graph Button:", showFullGraphButton);
            console.log("Load More Series Button:", loadMoreSeries);
            console.log("Toggle Button:", toggleButton);
            console.log("Schedule Blocks:", scheduleBlocks);
            console.log("Hidden Rows:", hiddenRows);

            if (showFullGraphButton) {
                showFullGraphButton.click();
            } else if (loadMoreSeries) {
                loadMoreSeries.click();
            }

            if (toggleButton) {
                toggleButton.click();
            }

            if (scheduleBlocks.length === 1) {
                const scheduleBlock = scheduleBlocks[0];
                const toggleButtonInBlock = scheduleBlock.querySelector('.act');
                if (toggleButtonInBlock) {
                    toggleButtonInBlock.click();
                }
            }

            hiddenRows.forEach(row => {
                row.style.display = '';
            });
        }, 2000);  // 2-second delay
    });

})();
