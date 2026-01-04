// ==UserScript==
// @name         GC - Pet + Petpet Lab Ray - Safety First
// @version      1.1
// @description  Hide specific pets and petpets from the lab ray page so no accidental zapping!
// @author       Mandi (mandanarchi)(pet safety), converted to gc and for petpets by dani
// @match        https://www.grundos.cafe/petpetlab/
// @match        https://www.grundos.cafe/lab2/
// @grant        none
// @namespace https://greasyfork.org/users/748951
// @downloadURL https://update.greasyfork.org/scripts/479108/GC%20-%20Pet%20%2B%20Petpet%20Lab%20Ray%20-%20Safety%20First.user.js
// @updateURL https://update.greasyfork.org/scripts/479108/GC%20-%20Pet%20%2B%20Petpet%20Lab%20Ray%20-%20Safety%20First.meta.js
// ==/UserScript==


    //TO SET YOUR LAB PET
    //Enter the pet you want to zap's name (surrounded by 'single quotes') in the PET_NAME section below

(function() {
    'use strict';

    const PET_NAME = [
'Chucky'
];

    $('form[action="/lab/process/"] img').each( function() {
        if ($.inArray( $(this).attr('alt'), PET_NAME) === -1 ) {
            $(this).parent().parent().remove();
        }
    });


})();


(function() {
    'use strict';

    //TO SET YOUR LAB PETPET
    //Enter the petpet you want to zap's PETPET ID (surrounded by 'single quotes') in the PETPET_ID section below

    //TO FIND YOUR PETPET ID
    //1. go to https://www.grundos.cafe/petpetlab/
    //2. right click on the petpet you want to zap
    //3. hit inspect
    //4. it should bring you to some code that looks like this:
    //   <label for="petpet_cb851875-d091-46a6-9a91-e008f7653e32" class="bold flex-column">
    //     <img src="" class="med-image"> == $0
    //     " YOUR PETPETS NAME HERE"
    //     </label>
    //5. the part that looks like 'petpet_cb851875-d091-46a6-9a91-e008f7653e32' is your Petpet ID
    //6. to copy either double click it and ctrl+c, or right click and select edit attribute and ctrl+c
    //7. paste (ctrl+v) that code (surrounded by 'single quotes') in the PETPET_ID section below
    //
    // NOTE: if you remove your petpet and re-attach (ie: when it turns to soot) this will need to be repeated,
    //       to see all your petpets again you must turn off the script.

    const PETPET_ID = [
'petpet_5447189d-8acb-4683-b77f-51a13e0029f4'
];

    $('input[name="petpet"]').each( function() {
        if ($.inArray( $(this).attr('id'), PETPET_ID) === -1 ) {
            $(this).parent().remove();
        }
    });


})();


