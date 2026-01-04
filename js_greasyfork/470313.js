// ==UserScript==
// @name Expand all on mlmym
// @include https://mlmym.org/*
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require https://greasyfork.org/scripts/383527-wait-for-key-elements/code/Wait_for_key_elements.js?version=701631
// @grant GM_addStyle
// @license MIT
// @description Expand all images/posts on https://mlmym.org
// @version 0.0.1.20230707050243
// @namespace https://greasyfork.org/users/1120674
// @downloadURL https://update.greasyfork.org/scripts/470313/Expand%20all%20on%20mlmym.user.js
// @updateURL https://update.greasyfork.org/scripts/470313/Expand%20all%20on%20mlmym.meta.js
// ==/UserScript==
/*- The @grant directive is needed to work around a design change
    introduced in GM 1.0.   It restores the sandbox.
*/

function clickExpandoBtnWhenItAppears (jNode) {
    var clickEvent  = document.createEvent ('MouseEvents');
    clickEvent.initEvent ('click', true, true);
    jNode[0].dispatchEvent (clickEvent);
}

//-- Value match is case-sensitive
waitForKeyElements (
    ".expando-button",
    clickExpandoBtnWhenItAppears
);
