// ==UserScript==
// @author         darknstormy
// @name           Neopets - Wishing Better
// @description    Sets your wish NP to 21 and autofills the item you're wishing for
// @include        *://*.neopets.com/wishing.phtml*
// @license        MIT
// @version 0.0.1.20240721142911
// @namespace https://greasyfork.org/users/1328929
// @downloadURL https://update.greasyfork.org/scripts/501380/Neopets%20-%20Wishing%20Better.user.js
// @updateURL https://update.greasyfork.org/scripts/501380/Neopets%20-%20Wishing%20Better.meta.js
// ==/UserScript==

const MIN_NP_FOR_WISH = 21
// Change "Snowager Stamp" to the name of the item you are wishing for
const ITEM_NAME_TO_WISH_FOR = "Snowager Stamp"

var d = document;

d.getElementsByName("donation")[0].value = MIN_NP_FOR_WISH
d.getElementsByName("wish")[0].value = ITEM_NAME_TO_WISH_FOR
