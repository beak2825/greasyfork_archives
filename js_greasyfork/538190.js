// ==UserScript==
// @name    Neopets Usershop Auto Confirm on buying items + Neggery
// @license MIT
// @author  God
// @description  Usershop Auto Confirm on buying items
// @include     https://www.neopets.com/browseshop.phtml?owner*
// @include     https://www.neopets.com/browseshop.phtml?lower=*
// @include     https://www.neopets.com/winter/neggery.phtml*
// @version 0.0.1.20250603105425
// @namespace https://greasyfork.org/users/1090050
// @downloadURL https://update.greasyfork.org/scripts/538190/Neopets%20Usershop%20Auto%20Confirm%20on%20buying%20items%20%2B%20Neggery.user.js
// @updateURL https://update.greasyfork.org/scripts/538190/Neopets%20Usershop%20Auto%20Confirm%20on%20buying%20items%20%2B%20Neggery.meta.js
// ==/UserScript==

unsafeWindow.confirm = function() {
    return true;
};