// ==UserScript==
// @name     Observador nologin
// @namespace darkfm
// @version  4
// @license GPLv3 - https://www.gnu.org/licenses/gpl-3.0.txt
// @author darkfm@vera.com.uy
// @grant    none
// @description Para leer artículos de El Observador sin registrarse. Se activa al hacer click en cualquier parte del artículo tras cargar completamente.
// @include *.elobservador.com.uy/*
// @include *.cromo.com.uy/*
// @downloadURL https://update.greasyfork.org/scripts/38954/Observador%20nologin.user.js
// @updateURL https://update.greasyfork.org/scripts/38954/Observador%20nologin.meta.js
// ==/UserScript==
function replaceArticle () {
    document.getElementsByClassName("fade")[0].classList.remove("fade");
}

document.onclick=replaceArticle;