// ==UserScript==
// @name         MangaLibDownload
// @version      1.1
// @description  Скачивает Все главы со страницы манги на MangaLib.me
// @author       Ivanchenko. D.
// @match        https://mangalib.me/*
// @license      MIT
// @grant        none
// @namespace https://greasyfork.org/users/934023
// @downloadURL https://update.greasyfork.org/scripts/447634/MangaLibDownload.user.js
// @updateURL https://update.greasyfork.org/scripts/447634/MangaLibDownload.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var header = document.querySelector('#main-page .media-tabs .tabs__list');
    if (header != undefined) {
        const button = document.createElement('span');
        var timer = null, px = 30, list = [];
        button.classList.add('volume-anchor__trigger');
        button.innerText = 'Скачать все главы';
        button.style.marginLeft = '12px';
        header.append(button);
        button.addEventListener('click', function() {
            timer = setInterval(function(){
                window.scrollTo(0,px);
                const chapters = document.querySelectorAll('.media-chapter');
                chapters.forEach(function(node) {
                    var id = node.getAttribute('data-id'),
                        element = list.find(function(value, index) {return value === id;});
                    if (element == undefined) {
                        list.push(id);
                        node.querySelector('.media-chapter__icon_download').click();
                    }
                });
                px+=300;
        }, 500);
        });
        window.onscroll = function(e){
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
            clearInterval(timer);
            console.log(list);
        }
    }
}
})();