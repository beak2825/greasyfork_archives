// ==UserScript==
// @name     koszykPGG
// @namespace
// @description Skrypt odblokowuje ikonki koszyka na stronie PGG
// @license MIT
// @version  1.00
// @grant    none
// @include  *sklep.pgg.pl*
// @namespace https://greasyfork.org/users/952625
// @downloadURL https://update.greasyfork.org/scripts/450485/koszykPGG.user.js
// @updateURL https://update.greasyfork.org/scripts/450485/koszykPGG.meta.js
// ==/UserScript==
(function(){'use strict';document.body.innerHTML = document.body.innerHTML.replace(/disabled/g, 'enabled')})()
