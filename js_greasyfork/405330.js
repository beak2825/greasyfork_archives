// ==UserScript==
// @name         Flight Rising: Select All (Hoard/Vault)
// @author       https://greasyfork.org/en/users/547396
// @description  Select ALL checkboxes in hoard / vault for ease moving between the two
// @namespace    https://greasyfork.org/users/547396
// @match        https://*.flightrising.com/main.php?p=hoard*
// @match        https://*.flightrising.com/main.php?p=vault*
// @grant        none
// @version      0.13
// @downloadURL https://update.greasyfork.org/scripts/405330/Flight%20Rising%3A%20Select%20All%20%28HoardVault%29.user.js
// @updateURL https://update.greasyfork.org/scripts/405330/Flight%20Rising%3A%20Select%20All%20%28HoardVault%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let checkboxes,
        index,
        main = document.getElementsByClassName( 'main' )[0],
        checkContainer = document.createElement( 'div' ),
        checkAll = document.createElement( 'button' ),
        checkNone = document.createElement( 'button' );

    // Create / Append
    checkContainer.classList.add( 'checkContainer' );
    checkAll.innerHTML = '<img src="../images/layout/vault/select_all.png">';
    checkNone.innerHTML = '<img src="../images/layout/vault/select_none.png">';
    main.appendChild( checkContainer );
    checkContainer.appendChild( checkAll );
    checkContainer.appendChild( checkNone );

    // Styles
    checkContainer.style.margin = '0 0 0 2rem';
    checkAll.style.background = 'none';
    checkAll.style.border = 'none';
    checkAll.style.outline = 'none';
    checkNone.style.background = 'none';
    checkNone.style.border = 'none';
    checkNone.style.outline = 'none';

    // Event Listeners
    checkAll.addEventListener( "click", onCheck );
    checkNone.addEventListener( "click", unCheck );

    function onCheck() {
        getCheckboxes( 'selectAll' );
    }

    function unCheck() {
        getCheckboxes( 'deselectAll' );
    }

    function getCheckboxes( method ) {
        var checkboxes = document.querySelectorAll( 'input[type=checkbox]' );

        for ( index = 0; index < checkboxes.length; index++ ) {
            if ( method === 'selectAll' ) {
                checkboxes[index].checked = true;
            } else {
                checkboxes[index].checked = false;
            }
        }
    }
})();