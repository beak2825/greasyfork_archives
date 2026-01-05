// ==UserScript==
// @name        Účastníci na řádcích
// @namespace   cz.biberle
// @description Vypíše každého účastníka na nový řádek
// @include     http://www.barcampbrno.cz/2016/ucastnici.html
// @version     1
// @grant       GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/20200/%C3%9A%C4%8Dastn%C3%ADci%20na%20%C5%99%C3%A1dc%C3%ADch.user.js
// @updateURL https://update.greasyfork.org/scripts/20200/%C3%9A%C4%8Dastn%C3%ADci%20na%20%C5%99%C3%A1dc%C3%ADch.meta.js
// ==/UserScript==

GM_addStyle("#entrants li { display: block !important; }");