// ==UserScript==
// @name        [ARCHIWUM]Napraw leniwe ładowanie wykopu
// @description Naprawia leniwe ładowanie obrazków, awatarów, miniaturek dla wpisów i linków na stronie wykop.pl.
// @version     0.2
// @author      look997
// @include     https://www.wykop.pl/*
// @homepageURL https://www.wykop.pl/ludzie/addons/look997/
// @namespace   https://www.wykop.pl/ludzie/addons/look997/
// @grant       none
// @run-at      document-end
// @icon        https://www.google.com/s2/favicons?domain=wykop.pl
// @icon64      https://www.google.com/s2/favicons?domain=wykop.pl
// @downloadURL https://update.greasyfork.org/scripts/453465/%5BARCHIWUM%5DNapraw%20leniwe%20%C5%82adowanie%20wykopu.user.js
// @updateURL https://update.greasyfork.org/scripts/453465/%5BARCHIWUM%5DNapraw%20leniwe%20%C5%82adowanie%20wykopu.meta.js
// ==/UserScript==

window.addEventListener("scroll", ()=>$("img.lazy").lazyload());