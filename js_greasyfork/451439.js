// ==UserScript==
// @name     OktobereventWeg
// @description Verwijdert de eventknop en pretzel teller
// @version  1.2
// @author ancoonbar
// @include http://nl12.the-west.*/game.php*
// @include https://nl12.the-west.*/game.php*
// @grant    none
// @namespace https://greasyfork.org/users/959752
// @downloadURL https://update.greasyfork.org/scripts/451439/OktobereventWeg.user.js
// @updateURL https://update.greasyfork.org/scripts/451439/OktobereventWeg.meta.js
// ==/UserScript==
setTimeout(function(){
 var GeenEvent = document.getElementsByClassName("ongoing_entry hasMousePopup")[0].style.display = "none";
 var GeenPretzel = document.getElementsByClassName("custom_unit_counter Octoberfest hasMousePopup with_log")[0].style.display = "none" ; },5000);