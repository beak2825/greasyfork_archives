// ==UserScript==
// @name     Smartschool Agenda Button
// @include  https://*.smartschool.be/*
// @homepage https://greasyfork.org/en/scripts/434323-smartschool-agenda-button
// @description Een userscript dat de "Agenda" knop in Smartschool zijn navigatiebalktoevoegt! Discord: emil_4K#2264
// @grant    GM_addStyle
// @author emil_4K#2264
// @version 1.1
// @namespace https://greasyfork.org/users/827782
// @downloadURL https://update.greasyfork.org/scripts/434323/Smartschool%20Agenda%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/434323/Smartschool%20Agenda%20Button.meta.js
// ==/UserScript==
//--- The @grant directive is used to restore the proper sandbox.

$("body").append ( `
    <a href="/index.php?module=Agenda" id="agenda" class="js-btn-messages topnav__btn">Agenda
    </a>
` );
GM_addStyle ( "                         \
    #agenda {                         \
        position:       fixed;          \
        top:            18px;            \
        left:           67%;            \
        color: white \
    }                                   \
" );