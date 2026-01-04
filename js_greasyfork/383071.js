// ==UserScript==
// @name         HWM_ReplaceBlogLink
// @namespace    Принц Алексей
// @version      1.0
// @description  Заменяет ссылку "Блоги" в шапке сайта со списка блогов, на которые подписан, на ссылку "Список всех блогов" на "Daily"
// @author       Принц Алексей
// @include      *daily.heroeswm.ru/*
// @downloadURL https://update.greasyfork.org/scripts/383071/HWM_ReplaceBlogLink.user.js
// @updateURL https://update.greasyfork.org/scripts/383071/HWM_ReplaceBlogLink.meta.js
// ==/UserScript==

(function() {
    "use strict";

    document.querySelector("a[href='http://daily.heroeswm.ru/bu.php']").setAttribute("href", "http://daily.heroeswm.ru/bu.php?list");
})();