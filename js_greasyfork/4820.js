// ==UserScript==
// @name           fl.ru prefer_sbr unchecked
// @namespace      http://userscripts.org/
// @description    Убирает галочку по умолчанию с чекбокса "Предпочитаю оплату работы через Безопасную Сделку" на странице проекта на www.fl.ru
// @include        http://www.free-lance.ru/projects/*/*.html
// @include        https://www.free-lance.ru/projects/*/*.html
// @include        http://free-lance.ru/projects/*/*.html
// @include        https://free-lance.ru/projects/*/*.html
// @include        http://www.fl.ru/projects/*/*.html
// @include        https://www.fl.ru/projects/*/*.html
// @include        http://fl.ru/projects/*/*.html
// @include        https://fl.ru/projects/*/*.html
// @include        http://old.fl.ru/projects/*/*.html
// @include        https://old.fl.ru/projects/*/*.html
// @version 0.0.1.20150113114428
// @downloadURL https://update.greasyfork.org/scripts/4820/flru%20prefer_sbr%20unchecked.user.js
// @updateURL https://update.greasyfork.org/scripts/4820/flru%20prefer_sbr%20unchecked.meta.js
// ==/UserScript==

document.getElementById("prefer_sbr").checked = false;
document.getElementById("prefer_sbr").value = 1;