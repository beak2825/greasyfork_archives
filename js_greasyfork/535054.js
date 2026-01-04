// ==UserScript==
// @name         LZT_ScrollTop_Mobile
// @namespace    MeloniuM/LZT
// @version      1.1
// @description  Добавляет кнопку "вверх" в ленту на мобильной версии сайта
// @author       Вы
// @match        https://lolz.live/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535054/LZT_ScrollTop_Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/535054/LZT_ScrollTop_Mobile.meta.js
// ==/UserScript==

(function () {
    'use strict';
    if (!$('#content').is('.forum_list, .forum_view, .member_view')) return;
    $("<style>").prop("type", "text/css").html(`
    .cd-top-touch {
        margin-right: 15px;
        position: fixed;
        bottom: 15px;
        width: 48px;
        height: 48px;
        right: 6px;
        bottom: 20px;
        z-index: 3;
        border-radius: 50%;
        box-shadow: #252525 0 0 5px 3px;
        display: none;
        opacity: 0;
        background: url(data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIGZpbGw9IiMyMjhlNWQiIHZlcnNpb249IjEuMSIgdmlld0JveD0iMCAwIDI0IDI0IiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPjxwYXRoIGlkPSJwYXRoMiIgZD0iTSAzLDIwIDAsMTYuOTQzIDEyLDUgMjQsMTYuOTQzIDIxLDIwIDEyLDExIFoiLz48L3N2Zz4=) center center no-repeat #2d2d2d;
        cursor: pointer;
    }
    
    @media (max-width: 1196px) {
        .cd-top-touch {
            display: block;
        }
    }
    
    @media (min-width: 1197px) {
        .cd-top-touch {
            display: none;
        }
    }
    `).appendTo("head");


    // Создаём кнопку
    const $button = $('<div class="cd-top-touch">');

    $('#content').prepend($button)

    // Показ/скрытие кнопки
    let isVisible = false;

    function handleMobileButton() {
        if ($(window).scrollTop() > 100) {
            if (!isVisible) {
                $button.stop(true, true).css('display', 'block').animate({
                    bottom: '20px',
                    opacity: 1
                }, 400, 'swing');
                isVisible = true;
            }
        } else {
            if (isVisible) {
                $button.stop(true, true).animate({
                    bottom: '0px',
                    opacity: 0
                }, 400, 'swing', () => {
                    $button.css('display', 'none');
                });
                isVisible = false;
            }
        }
    };

    $(window).on('scroll resize', handleMobileButton);

    $button.on('click', (e) => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        e.preventDefault();
        e.stopPropagation();
    });
})();
