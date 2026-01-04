// ==UserScript==
// @name         Copy Magnet URL
// @name:uk      Copy Magnet URL
// @version      2.0
// @description  Adds "Copy Magnet URL" button next to magnet links and trims extra info from magnet links
// @description:ru  Добавляет кнопку «Копировать магнитный URL» рядом с магнитными ссылками и удаляет дополнительную информацию из магнитных ссылок.
// @description:uk  Додає кнопку «Копіювати URL-адресу магніту» поруч із магнітними посиланнями та обрізає додаткову інформацію з магнітних посилань
// @author       Sitego
// @match        *://rutor.info/*
// @match        *://nnmclub.to/*
// @match        *://rutracker.org/*
// @match        *://kinozal.tv/*
// @icon         https://ide.onl/img/script/magnet48.png
// @homepageURL  https://ide.onl/
// @supportURL   https://ide.onl/contact.html
// @namespace    https://greasyfork.org/users/1221433
// @grant        GM_setClipboard
// @license      MIT
// @require      https://cdnjs.cloudflare.com/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/491901/Copy%20Magnet%20URL.user.js
// @updateURL https://update.greasyfork.org/scripts/491901/Copy%20Magnet%20URL.meta.js
// ==/UserScript==

(function () {
    'use strict';
    function copyToClipboard(text) {
        const input = document.createElement('textarea');
        input.innerHTML = text;
        document.body.appendChild(input);
        input.select();
        document.execCommand('copy');
        document.body.removeChild(input);
    }
    function showTooltip(element, message) {
        var tooltip = $('<div class="tooltip"></div>').text(message).css({
            'position': 'absolute',
            'background-color': '#108A34',
            'color': '#fff',
            'padding': '5px 10px',
            'border-radius': '5px',
            'top': element.offset().top - 30,
            'left': element.offset().left,
            'z-index': 1000,
            'white-space': 'nowrap'
        }).appendTo('body');
        setTimeout(function () {
            tooltip.remove();
        }, 1500);
    }
    function addCopyMagnetButton(link) {
        var magnetLink = link.split('&')[0];
        var copyButton = $('<button>Копировать Magnet</button>').css({
            'background-color': '#ff0000',
            'color': '#ffffff',
            'font-weight': 'bold',
            'margin-bottom': '7px',
            'border': 'none',
            'padding': '5px 10px',
            'margin-left': '10px',
            'cursor': 'pointer',
            'border-radius': '5px',
        }).click(function () {
            $(this).css({
                'background-color': '#cc0000',
            });
            copyToClipboard(magnetLink);
            showTooltip($(this), 'Скопировано!');
            setTimeout(function () {
                copyButton.css({
                    'background-color': '#ff0000',
                });
            }, 200);
        });
        if (window.location.hostname === 'kinozal.tv') {
            $('#containerdata').append(copyButton);
        } else {
            $(this).after(copyButton);
        }
    }
    if (window.location.hostname === 'kinozal.tv') {
        $(document).on('click', 'a[onclick^="get_torm"]', function () {
            setTimeout(function () {
                var hashText = $('li:contains("Инфо хеш:")').text().replace('Инфо хеш:', '').trim();
                var magnetLink = 'magnet:?xt=urn:btih:' + hashText;
                addCopyMagnetButton(magnetLink);
            }, 1000);
        });
    } else {
        $('a[href^="magnet:"]').each(function () {
            addCopyMagnetButton.call(this, $(this).attr('href'));
        });
    }
})();
