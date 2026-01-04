// ==UserScript==
// @name         AdBlock - TecMundo
// @namespace    https://greasyfork.org/en/users/670188-hacker09?sort=daily_installs
// @version      1
// @description  Remove os ads "Assine já o The BRIEF, a newsletter diária que te deixa por dentro de tudo".
// @author       hacker09
// @include      https://www.tecmundo.com.br/*
// @icon         https://www.tecmundo.com.br/desktop/favicon.ico
// @run-at       document-end
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487907/AdBlock%20-%20TecMundo.user.js
// @updateURL https://update.greasyfork.org/scripts/487907/AdBlock%20-%20TecMundo.meta.js
// ==/UserScript==

document.querySelector("#tec--thebrief__bg").style.display = 'none'; //Hide the widget dd
document.querySelector("#js-widget-thebrief").style.display = 'none'; //Hide the floating add
document.querySelector("#js-widget-thebrief-overlay").style.display = 'none'; //Hide the black overlay