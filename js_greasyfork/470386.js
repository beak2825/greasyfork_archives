// ==UserScript==
// @name         ixbt.com - remove Ai images
// @name:ru      ixbt.com - скрытие AI картинок
// @version      0.1
// @description  ixbt.com site - remove Ai images
// @description:ru ixbt.com сайт - скрытие AI картинок
// @match        https://www.ixbt.com/news/*
// @grant        none
// @namespace https://greasyfork.org/users/1121309
// @downloadURL https://update.greasyfork.org/scripts/470386/ixbtcom%20-%20remove%20Ai%20images.user.js
// @updateURL https://update.greasyfork.org/scripts/470386/ixbtcom%20-%20remove%20Ai%20images.meta.js
// ==/UserScript==
(function() {
    window.$('figure:contains("Сгенерировано нейросетью")').hide();
    window.$('figure:contains("Midjourney")').hide();
})();