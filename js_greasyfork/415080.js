// ==UserScript==
// @name         A Dark Room [Speed Cheat]
// @version      0.1
// @description  Minor, non game-breaking speed cheat for A Dark Room.
// @author       Luke
// @match        https://adarkroom.doublespeakgames.com/
// @namespace https://greasyfork.org/users/684752
// @downloadURL https://update.greasyfork.org/scripts/415080/A%20Dark%20Room%20%5BSpeed%20Cheat%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/415080/A%20Dark%20Room%20%5BSpeed%20Cheat%5D.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        setInterval(function(){
            $(".disabled") //finds all disabled classes, EXCEPT those that have IDs matching...
                .not( '[id^="build"]' ) //building things on the home screen
                .not( '[id^="learn"]' ) //learning new perks
                .not( '[id^="buy"]' )   //buy from traveler
                .not( '[id^="wood"]' )  //giving x wood
                .not( '[id^="fur"]' )   //giving x fur
                .not( '[id^="agree"]' ) //agree to traveler
                .not( '[id^="enter"]' ) //mine / cave
                .not( '[id^="continue"]' ) //cave
                .not( '[id^="talk"]' )  //swamp
                .not( '[id^="all_take"]' )  //if you can't take all
                .not( '[id^="loot_take"]' )  //if you can't take all
                .not( '[class^="up"]' ) //up arrows
                .not( '[class^="dn"]' ) //down arrows
                .not( '[id^="heal"]' )  //healing plague
                .not( '[id^="help"]' )  //sick man
                .not( '[id^="evasion"]' )   //evasion perk (if you alreadly learned it)
                .not( '[id^="precision"]' ) //precision perk (if you alreadly learned it)
                .not( '[id^="force"]' )     //force perk (if you alreadly learned it)

                .removeClass("disabled"); //remove all disabled classes that don't have IDs matching the cases above
        }, 100);
    });
})();

// This is kind of a brain-dead way to do this, but I considered it to be the safest way while still relatively computationally inexpensive
//    (i.e., if I had targeted the specific buttons I DO need, I might have missed one, but it's not
//     the end of the world if I take the disabled class off of something that doesn't really need it)