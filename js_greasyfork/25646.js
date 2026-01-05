// ==UserScript==
// @name         Desprotetor de links
// @namespace    https://www.facebook.com/felipperenan.albano
// @version      1.0
// @description  Burla a página do desprotetor de links
// @author       Felippe
// @include      http://desproteger.com.br/*
// @grant        unsafeWindow
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/25646/Desprotetor%20de%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/25646/Desprotetor%20de%20links.meta.js
// ==/UserScript==

window.location.replace(document.getElementsByClassName('link_encontrado')[0].href);