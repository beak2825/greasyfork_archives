// ==UserScript==
// @name        Ikariam AntiNerv
// @namespace   Ikariam
// @include     /https?:\/\/s[0-9]*-[a-z]{2}\.ikariam\.gameforge\.com\/.*/
// @require     http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @version     1.1
// @grant       GM_log
// @description Stopps a few animations and removes distracting objects
// @downloadURL https://update.greasyfork.org/scripts/32653/Ikariam%20AntiNerv.user.js
// @updateURL https://update.greasyfork.org/scripts/32653/Ikariam%20AntiNerv.meta.js
// ==/UserScript==


//@history Anti-Nerv funktioniert in der Inselansicht noch nicht!



//Ballon
document.getElementById("cityFlyingShopContainer").style.display = "none";


//Plus-symbol on advisors
$("#js_GlobalMenu_citiesPremium").css("display", "none");
$("#js_GlobalMenu_militaryPremium").css("display", "none");
$("#js_GlobalMenu_researchPremium").css("display", "none");
$("#js_GlobalMenu_diplomacyPremium").css("display", "none");


//Shop header
$("#GF_toolbar .premium").css("display", "none");


//Ambrosia Happy Hour
document.getElementById("eventDiv").style.display = "none";


//footer
document.getElementById("footer").style.display = "none";


//beachboys
document.getElementById("js_city_feature_beachboys").style.display = "none";


//Bürger-Animationen
$("div:visible[id*='walker']").css("display", "none");


// Amrosia Phiole top left animation
$(js_GlobalMenu_ambrosia).css("-webkit-animation", "none");

// Tägliche Aufgaben-Animation
$(cityDailyTasksAnimation).css("-webkit-animation", "none");

// dolphins bottom
$(dolphinPos1).css("-webkit-animation", "none");
$(dolphinPos2).css("-webkit-animation", "none");
$(dolphinPos3).css("-webkit-animation", "none");
$(dolphinPos4).css("-webkit-animation", "none");

//projection-theatre
$(".animationLight").css("-webkit-animation", "none");

//make advisors golden
$("#js_GlobalMenu_cities").attr('class', 'premium');
$("#js_GlobalMenu_military").attr('class', 'premium');
$("#js_GlobalMenu_research").attr('class', 'premium');
$("#js_GlobalMenu_diplomacy").attr('class', 'premium');


// Skripte ab hier funktionieren noch nicht!
// scripts starting here don't work yet!

//Werbung header (werbung grade nicht da)
$('li > div > ul:first').css("display", "none");

//popup angebot ambrosia (timer fehlt!)
document.getElementById("multiPopup").style.display = "none";


//side menu (keeeeinen Plan wie des gehen soll)
$('#leftMenu .expandable resourceShop').hide();

document.getElementsByClassName("expandable resourceShop").style.display = "none";
  