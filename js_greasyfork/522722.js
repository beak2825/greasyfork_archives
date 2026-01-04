// ==UserScript==
// @name        showcase banner remover
// @namespace   Violentmonkey Scripts
// @match       https://education.yandex.ru/classroom/*
// @grant       GM_addStyle
// @version     1.0
// @author      aaartc
// @description script removes yellow shit on page with courses
// @downloadURL https://update.greasyfork.org/scripts/522722/showcase%20banner%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/522722/showcase%20banner%20remover.meta.js
// ==/UserScript==


GM_addStyle(`

.student-showcase__banner-carousel { display: none !important}

`);