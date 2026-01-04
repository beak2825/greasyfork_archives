// ==UserScript==
// @name         Загрузка комментариев при прокрутке
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Загрузка комментариев при прокрутке в посте (автонажатие "загрузить комментарии"). Не раскрывает сами ветки комментариев по умолчанию, если это нужно - раскомментируйте строку с toggle=true.
// @author       resursator
// @match        https://pikabu.ru/story/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pikabu.ru
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/544598/%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B0%20%D0%BA%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B5%D0%B2%20%D0%BF%D1%80%D0%B8%20%D0%BF%D1%80%D0%BE%D0%BA%D1%80%D1%83%D1%82%D0%BA%D0%B5.user.js
// @updateURL https://update.greasyfork.org/scripts/544598/%D0%97%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D0%BA%D0%B0%20%D0%BA%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%B0%D1%80%D0%B8%D0%B5%D0%B2%20%D0%BF%D1%80%D0%B8%20%D0%BF%D1%80%D0%BE%D0%BA%D1%80%D1%83%D1%82%D0%BA%D0%B5.meta.js
// ==/UserScript==

window.addEventListener('scroll', function() {
    var Btn = document.querySelector('.comment__more');
    if (Btn!=undefined||Btn!=null){

        var BtnTop = Btn.getClientRects()[0].top;
        var WH = window.outerHeight/1;
        if (BtnTop < WH){
            Btn.click();
        }
    }
})

var toggle = false;
// toggle=true;

if (toggle=true) {
    window.addEventListener('scroll', function() {
        var Btn = document.querySelector('.comment-toggle-children_collapse');
        if (Btn!=undefined||Btn!=null){

            var BtnTop = Btn.getClientRects()[0].top;
            var WH = window.outerHeight/1.3;
            if (BtnTop < WH){
                Btn.click();
            }
        }
    })
}