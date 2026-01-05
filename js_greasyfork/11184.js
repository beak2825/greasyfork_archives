// ==UserScript==
// @name         FastPic direct image
// @namespace    http://your.homepage/
// @version      0.1
// @description  Открывает изображение напрямую, миную страницу с рекламой. Хотя возможна и задержка.
// @author       You
// @match        http://fastpic.ru/view/*
// @grant        none
// @run-at document-body
// @downloadURL https://update.greasyfork.org/scripts/11184/FastPic%20direct%20image.user.js
// @updateURL https://update.greasyfork.org/scripts/11184/FastPic%20direct%20image.meta.js
// ==/UserScript==

var image = $('#image')[0];
if(!!image){
window.location.href = image.src;
}