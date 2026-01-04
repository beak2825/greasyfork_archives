// ==UserScript==
// @name         [Photoagent] Сортировка фото
// @namespace    tuxuuman:photoagent:sort-photo
// @version      0.1
// @description  Сортировка фото
// @author       tuxuuman<tuxuuman@gmail.com>
// @match        https://www.shutterstock.com/*
// @match        https://shutterstock.com/*
// @grant        unsafeWindow
// @grant        GM_registerMenuCommand
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/372628/%5BPhotoagent%5D%20%D0%A1%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D1%84%D0%BE%D1%82%D0%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/372628/%5BPhotoagent%5D%20%D0%A1%D0%BE%D1%80%D1%82%D0%B8%D1%80%D0%BE%D0%B2%D0%BA%D0%B0%20%D1%84%D0%BE%D1%82%D0%BE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = unsafeWindow.jQuery;
    GM_registerMenuCommand("Сортировать", function (i, e) {
        var photos = [];
        $('li.js_item').each(function (i, li) {
            var imgSrc = $(li).find('.img-wrap > img').attr('src');
            var photoId = $(li).find('.actions-row > button[data-id]').data('id');

            photos.push({
                img: imgSrc,
                id: photoId,
                li: li.cloneNode(true)
            });
        });

        console.log(photos);
        var searchContent = $('.search-content');
        searchContent.html("");
        photos.sort(function (a, b) {
            return a.id - b.id;
        }).forEach(function (photo) {
            searchContent.append('<a target="_blank" href="https://www.shutterstock.com/ru/image-photo/' + photo.id + '"><img src="' + photo.img + '"></a>');
        });
    });
})();