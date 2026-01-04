// ==UserScript==
// @name         Расширить zendesk
// @namespace    https://greasyfork.org/ru/scripts/390120
// @version      0.2
// @description  Оптимизация процесса проверки
// @author       М
// @run-at       document-body
// @include      https://edadealhelp.zendesk.com/*
// @downloadURL https://update.greasyfork.org/scripts/390120/%D0%A0%D0%B0%D1%81%D1%88%D0%B8%D1%80%D0%B8%D1%82%D1%8C%20zendesk.user.js
// @updateURL https://update.greasyfork.org/scripts/390120/%D0%A0%D0%B0%D1%81%D1%88%D0%B8%D1%80%D0%B8%D1%82%D1%8C%20zendesk.meta.js
// ==/UserScript==
function timerMethod() {
    [].forEach.call( document.querySelectorAll('.ember-view.ember-text-area.autoresize'), function(el) {
        2
        el.style.height = "625px";
        3
        el.classList.add('max');
        4
    });
}
var timerId = setInterval(timerMethod, 2 * 1000);