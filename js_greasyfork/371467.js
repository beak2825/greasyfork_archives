// ==UserScript==
// @name         Change icon links
// @namespace    namespace
// @version      0.4
// @description  Change booster and medical icon link to items
// @author       Kivou
// @match        *.torn.com/*
// @require      http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/371467/Change%20icon%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/371467/Change%20icon%20links.meta.js
// ==/UserScript==

// uncomment the line you want to link the booster cooldown icon with and comment the other
var booster_item = "#alcohol-items" // for alcohol
// var booster_item = "#candy-items" // for candy
// var booster_item = "##boosters-items" // for boosters

var side_bar = $( "#sidebar" ).first( ".sidebar-block*" );
side_bar.find( '[href*="item.php?temp=2"]' ).attr( "href", "https://www.torn.com/item.php" + booster_item );
side_bar.find( '[href*="item.php?temp=3"]' ).attr( "href", "https://www.torn.com/item.php#medical-items" );
