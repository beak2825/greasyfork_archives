// ==UserScript==
// @name         Клавогонки. Тёмная тема
// @version      0.1
// @description  Тёмная тема оформления для сайта https://klavogonki.ru/ в режиме гонки
// @author       sokollondon
// @match        https://klavogonki.ru/gamelist/*
// @match        https://klavogonki.ru/g/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=klavogonki.ru
// @grant        none
// @license      MIT
// @namespace    https://gist.github.com/sokollondon/095293919846ab53d1694f93b61d0182
// @downloadURL https://update.greasyfork.org/scripts/498330/%D0%9A%D0%BB%D0%B0%D0%B2%D0%BE%D0%B3%D0%BE%D0%BD%D0%BA%D0%B8%20%D0%A2%D1%91%D0%BC%D0%BD%D0%B0%D1%8F%20%D1%82%D0%B5%D0%BC%D0%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/498330/%D0%9A%D0%BB%D0%B0%D0%B2%D0%BE%D0%B3%D0%BE%D0%BD%D0%BA%D0%B8%20%D0%A2%D1%91%D0%BC%D0%BD%D0%B0%D1%8F%20%D1%82%D0%B5%D0%BC%D0%B0.meta.js
// ==/UserScript==

(function() {
    let style = `
body{background: #2B2B2B;}
#head, #params, #invite{opacity: 0.1;}
#head:hover, #params:hover, #invite:hover{opacity: 0.3;}
.ng-binding{color: #dadada;}
.gray_timer .ng-binding {color: #999;}
#players-count-lbl span {text-shadow: 1px 1px 5px #fff;}
    `;

    let st = document.createElement("style");
    st.innerText = style;
    document.head.appendChild(st);
})();