// ==UserScript==
// @name         Faction Hospital working v1.4 enhanced(excludes offline)
// @namespace    http://tampermonkey.net/
// @version      1.41
// @description  Shows only faction members that are in the hospital(and online or idle) and hides the rest.
// @author       muffenman and help from Pi77Bull (slightly modifed by CriminalElegant)
// @match        https://www.torn.com/factions.php?step=profile&ID=*
// @grant        none
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/387445/Faction%20Hospital%20working%20v14%20enhanced%28excludes%20offline%29.user.js
// @updateURL https://update.greasyfork.org/scripts/387445/Faction%20Hospital%20working%20v14%20enhanced%28excludes%20offline%29.meta.js
// ==/UserScript==

// What does this script do?
// It hides all members on faction pages that are not in the hospital and displays the hospital time for those who are.

$( ".faction-description" ).css("display", "none", "traveling"); //hides faction description

$('.member-list > li:not(:contains("Hospital"))').css("display", "none"); //hides every member that is not in hospital 
$('.member-list > li:not(:contains("Offline"))').css("display", "none"); //hides every member that is not online
$('.member-list > li:contains("Hospital")').each((i, j) => { //loops through every member that is in hospital
    $(j).find(".days").text($(j).find("#icon15").attr("title").substr(-16, 8)); //displays time that is found in the hospital icon


$(".title .days").text("Time"); //changes Days column title to "Time"
      });
//console.log("Made by muffenman [2002712] and Pi77Bull [2082618] . If you like it, send us a message or a gift either is fine :P \"I love your script!\".");