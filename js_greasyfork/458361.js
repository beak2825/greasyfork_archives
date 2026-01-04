// ==UserScript==
// @name        futapo fixed
// @namespace   futapo_fixed
// @description futapo fixed ok 
// @description:ja  futapo fixed ok
// @match        https://futapo.futakuro.com/?server*
// @version     1.0
// @author      aporiz
// @license     Mozilla Public License 2.0; http://www.mozilla.org/MPL/2.0/
// @grant    GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/458361/futapo%20fixed.user.js
// @updateURL https://update.greasyfork.org/scripts/458361/futapo%20fixed.meta.js
// ==/UserScript==


GM_addStyle ( `
@media (max-height:660px) {

.thread-text {
    font-size: 17px !important;
}

}

` );


