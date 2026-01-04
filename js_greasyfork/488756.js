// ==UserScript==
// @name         techtudo - Ilimitado
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      1
// @description  Automaticamente clica no botao "Veja Mais" e carrega todas as noticias e artigos por completo.
// @author       hacker09
// @include      https://www.techtudo.com.br/*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://techtudo.com.br&size=64
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/488756/techtudo%20-%20Ilimitado.user.js
// @updateURL https://update.greasyfork.org/scripts/488756/techtudo%20-%20Ilimitado.meta.js
// ==/UserScript==

document.querySelector("#mc-read-more-btn").click(); //Click on veja mais