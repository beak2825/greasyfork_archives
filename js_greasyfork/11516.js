// ==UserScript==
// @name        root.cz - skryti reklamy na foru
// @description:cs Skryti reklamy na foru. Pozor, nejde o blokovani - obsah se nacte, ale nezobrazi se.
// @namespace   monnef.tk
// @include     /https?:\/\/forum\.root\.cz\/.*/
// @version     1
// @grant       none
// @require     http://cdn.jsdelivr.net/jquery/2.1.4/jquery.min.js
// @description Skryti reklamy na foru. Pozor, nejde o blokovani - obsah se nacte, ale nezobrazi se.
// @downloadURL https://update.greasyfork.org/scripts/11516/rootcz%20-%20skryti%20reklamy%20na%20foru.user.js
// @updateURL https://update.greasyfork.org/scripts/11516/rootcz%20-%20skryti%20reklamy%20na%20foru.meta.js
// ==/UserScript==

this.$ = this.jQuery = jQuery.noConflict(true);

$("div.poster a[href='http://www.root.cz/']:contains('Reklama')").closest(".windowbg2").hide();
