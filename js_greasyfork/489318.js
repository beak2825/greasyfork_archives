// ==UserScript==
// @name     Removes button blocking IT Glue tooltips
// @description     Removes content button blocking IT Glue tooltips in the password dialog and all tooltips but I'm unaware of any others in IT Glue. YMMV
// @include  https://YOURITGLUEINSTANCE.itglue.com/*
// @require  http://ajax.googleapis.com/ajax/libs/jquery/2.1.0/jquery.min.js
// @grant    GM_addStyle
// @version 1.1
// @namespace https://greasyfork.org/users/908886
// @downloadURL https://update.greasyfork.org/scripts/489318/Removes%20button%20blocking%20IT%20Glue%20tooltips.user.js
// @updateURL https://update.greasyfork.org/scripts/489318/Removes%20button%20blocking%20IT%20Glue%20tooltips.meta.js
// ==/UserScript==
//- The @grant directive is needed to restore the proper sandbox.
GM_addStyle ( `
    .itg-popover {
        display: none;
    }
` );
function GM_addStyle (cssStr) {
    var D = document;
    var newNode = D.createElement ('style');
    newNode.textContent = cssStr;
    var targ = D.getElementsByTagName ('head')[0] || D.body || D.documentElement;
    targ.appendChild (newNode);
}