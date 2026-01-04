// ==UserScript==
// @name         Replace 404 Image
// @namespace    https://shikimori.one/
// @version      1.1
// @description  Заменяет изображение и текст 404 на кастомное
// @author       LifeH
// @match        *://shikimori.org/*
// @match        *://shikimori.one/*
// @match        *://shikimori.me/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/512444/Replace%20404%20Image.user.js
// @updateURL https://update.greasyfork.org/scripts/512444/Replace%20404%20Image.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const imgURL = "https://i.ibb.co/QXgRz6p/rkn-2x.jpg";
    const targetIMG = "/images/static/404.jpg";

    function replaceImage() {
        const img = document.querySelector(`img.image[src="${targetIMG}"]`);
        if (img) {
            img.src = imgURL;
            img.srcset = `${imgURL} 2x`;
        }
    }

    function replaceText() {
        const errorText = document.querySelector('.dialog');
        if (errorText) {
            errorText.innerHTML = `
                <p class="error-404">Заблокировано \n Роскомнадзором</p>
                <h1>Эта страница содержала запрещённый контент.</h1>
                <p><a href="/">на главную</a></p>
                <img class="image" src="${imgURL}" srcset="${imgURL} 2x">
            `;
        }
    }

    function main() {
        replaceImage();
        replaceText();
    }

    function ready(fn) {
        window.addEventListener("load", fn);
        document.addEventListener("page:load", fn);
        document.addEventListener("turbolinks:load", fn);
        if (document.attachEvent ? document.readyState === "complete" : document.readyState !== "loading") {
            fn();
        } else {
            document.addEventListener("DOMContentLoaded", fn);
        }
    }

    ready(main);
})();
