// ==UserScript==
// @name         Withdraw All Troops of Group in Overview
// @namespace    http://tampermonkey.net/
// @version      0.3.1
// @description  Create a new group consisting of all the villages where the support should be withdrawn. Then go to overviews, troops, support and let the script do its thing.
// @author       You
// @match        https://*/game.php?village=*&screen=overview_villages&mode=units&type=away_detail*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/37032/Withdraw%20All%20Troops%20of%20Group%20in%20Overview.user.js
// @updateURL https://update.greasyfork.org/scripts/37032/Withdraw%20All%20Troops%20of%20Group%20in%20Overview.meta.js
// ==/UserScript==
$("#all")[0].click();
$('[name="submit_units_back"]')[0].click();