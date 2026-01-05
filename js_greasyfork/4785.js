// ==UserScript==
// @name        CH Remaining HITs Replicator
// @author      clickhappier
// @namespace   clickhappier
// @description Replicates the 'HITs Available' number underneath the HIT work area for ease of reference.
// @include     https://www.mturk.com/mturk/*
// @require     http://code.jquery.com/jquery-latest.min.js
// @version     1.0c
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/4785/CH%20Remaining%20HITs%20Replicator.user.js
// @updateURL https://update.greasyfork.org/scripts/4785/CH%20Remaining%20HITs%20Replicator.meta.js
// ==/UserScript==


if ( $(document.body).find('td:contains("Finished with this HIT?")').text() !== "" )   // check for being on a HIT-in-progress page
{

// get the HITs Available number from HIT header info
var hitsRem = $(document.body).find('td[class="capsule_field_title"]:contains("HITs Available:")').next().text().trim();

// console.log( "hitsRem=" + hitsRem );

// get second (bottom) buttons area div on a HIT-in-progress page: parent0=tr, parent1=tbody, parent2=table, parent3=div
var bottomButtons = $(document.body).find('td:contains("Finished with this HIT?")').eq(2).parents().eq(3);

// console.log( "bottomButtons=" + $(bottomButtons)[0].outerHTML );

// insert the replicated HITs number html above the bottom buttons area (at the top of the div containing the table containing the buttons)
$(bottomButtons).prepend( "<span align=center>Remaining HITs Available: <b>" + hitsRem + "</b></span>" );


}