// ==UserScript==
// @name         Paginacja
// @description  Paginacja for Pepper
// @match        https://www.pepper.pl/*
// @version      0.1
// @grant        none
// @namespace https://greasyfork.org/users/697301
// @downloadURL https://update.greasyfork.org/scripts/414226/Paginacja.user.js
// @updateURL https://update.greasyfork.org/scripts/414226/Paginacja.meta.js
// ==/UserScript==
(function() {
var currentpage=JSON.parse(document.querySelector(".cept-next-page>button").dataset.pagination).page;
document.querySelector(".cept-next-page>button").dataset.pagination=document.querySelector(".cept-next-page>button").dataset.pagination.replace(currentpage, currentpage+9);
})();