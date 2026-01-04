// ==UserScript==
// @name Qwertee Tee name title
// @version 1.0
// @description Change page title to tee design name
// @namespace Violentmonkey Scripts
// @match *://www.qwertee.com/product/*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/32880/Qwertee%20Tee%20name%20title.user.js
// @updateURL https://update.greasyfork.org/scripts/32880/Qwertee%20Tee%20name%20title.meta.js
// ==/UserScript==

document.title = $('.title-wrap .name').text() + ' - Qwertee';
