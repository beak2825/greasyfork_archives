// ==UserScript==
// @name         скрыть propaganda DTF
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Скрытие propaganda банера на DTF
// @author       Kudmi
// @match        https://dtf.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dtf.ru
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/488607/%D1%81%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20propaganda%20DTF.user.js
// @updateURL https://update.greasyfork.org/scripts/488607/%D1%81%D0%BA%D1%80%D1%8B%D1%82%D1%8C%20propaganda%20DTF.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const divToHide = document.querySelector(".propaganda");
    if (divToHide) {
    divToHide.style.display = "none";
  }
})();