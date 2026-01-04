// ==UserScript==
// @name         Alma Hotkeys
// @namespace    https://greasyfork.org/en/users/8332-sreyemnayr
// @version      2019.8.12.1
// @description  Add some hotkeys
// @author       Ryan Meyers
// @match        https://*.getalma.com/*
// @grant        GM_addStyle
// @require      https://code.jquery.com/jquery-3.4.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/388461/Alma%20Hotkeys.user.js
// @updateURL https://update.greasyfork.org/scripts/388461/Alma%20Hotkeys.meta.js
// ==/UserScript==

GM_addStyle(`
form#header-search {
    display: inline-block !important;
}
`);

function doc_keyUp(e) {
    console.log(e.keyCode);
    console.log(e.target.tagName.toUpperCase());
    if (e.target.tagName.toUpperCase() != 'INPUT')
    {
        console.log(e.keyCode);
        switch(e.keyCode)
        {
            case 65: // a add to process
                $('a[data-alma-modal=WorkflowsAddStudentSisModal]')[0].click();
                break;
            case 69: // e fix email addreess
                document.getElementsByName("EmailAddresses[]")[0].value = document.getElementsByName("EmailAddresses[]")[0].value.replace(/([a-z])[a-z]+\.([a-z]+)@.+/gi, "$2$1@students.stgnola.org");
                break;

            /**case 67: // c goes to completed orders
                window.location.href = 'https://mlb19.theshownation.com/community_market/orders/completed';
                break;
            case 77: // m goes to market
                window.location.href = 'https://mlb19.theshownation.com/community_market';
                break;
            case 84: // t goes to choice packs
                window.location.href = 'https://mlb19.theshownation.com/choice_packs';
                break;
            case 73: // i goes to inventory
                window.location.href = 'https://mlb19.theshownation.com/inventory?type=players';
                break;
            case 80: // p goes to packs
                window.location.href = 'https://mlb19.theshownation.com/packs';
                break;
            case 82: // r refreshes
                window.location.reload();
                break; **/

            default:
                break;
        }
  }
}
(function() {
    'use strict';
    document.addEventListener('keyup', doc_keyUp, false);

})();