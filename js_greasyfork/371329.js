// ==UserScript==
// @name         Bits 'n' bobs swap
// @namespace    namespace
// @version      0.2
// @description  Swap bits 'n' bobs sell/buy divs
// @author       Kivou
// @match        *.torn.com/shops.php*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/371329/Bits%20%27n%27%20bobs%20swap.user.js
// @updateURL https://update.greasyfork.org/scripts/371329/Bits%20%27n%27%20bobs%20swap.meta.js
// ==/UserScript==

// original idea of tos: https://hastebin.com/bohojibece.js

$( ".buy-items-wrap" ).after( $( ".sell-items-wrap" ) );
$( ".buy-items-wrap" ).after( $( "hr.delimiter-999" )[0] );
