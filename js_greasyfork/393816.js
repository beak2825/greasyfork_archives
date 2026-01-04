// ==UserScript==
// @name     Cookiswap
// @description  Cambia las recetas de cookidoo por localhost
// @version  1.1
// @grant    none
// @match    https://cookidoo.es/recipes/recipe/es-ES/*
// @namespace https://greasyfork.org/users/382541
// @downloadURL https://update.greasyfork.org/scripts/393816/Cookiswap.user.js
// @updateURL https://update.greasyfork.org/scripts/393816/Cookiswap.meta.js
// ==/UserScript==

window.addEventListener('load', function () {
    var jq = document.createElement('script');
    jq.src = "https://code.jquery.com/jquery-latest.min.js";
    document.getElementsByTagName('head')[0].appendChild(jq);
    setTimeout(function () {
        $('#recipe-content-right').load('http://localhost' + document.location.pathname + ' #recipe-content-right');
    }, 1000);
})
