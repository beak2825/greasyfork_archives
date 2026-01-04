// ==UserScript==
// @name         Mangalib: Download all chapters
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  download manga from mangalib.me
// @author       DIMA325SK
// @match        *://mangalib.me/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/442711/Mangalib%3A%20Download%20all%20chapters.user.js
// @updateURL https://update.greasyfork.org/scripts/442711/Mangalib%3A%20Download%20all%20chapters.meta.js
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