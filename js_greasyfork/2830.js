// ==UserScript==
// @name       Libero Mail forward to ANY address
// @namespace  http://andrealazzarotto.com/
// @version    1.1
// @description  Removes the limitation to forward to @libero.it addresses on the webmail GUI of this provider
// @include      http://*.libero.it/*Filtri*
// @copyright  2014+, Andrea Lazzarotto
// @downloadURL https://update.greasyfork.org/scripts/2830/Libero%20Mail%20forward%20to%20ANY%20address.user.js
// @updateURL https://update.greasyfork.org/scripts/2830/Libero%20Mail%20forward%20to%20ANY%20address.meta.js
// ==/UserScript==

unsafeWindow.checkAllowedDomain = function() { return true; }