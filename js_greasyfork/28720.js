// ==UserScript==
// @name         Torn Easter Egg Links
// @namespace    https://www.torn.com/profiles.php?XID=2029670
// @version      1.0
// @description  Easter Egg Links
// @author       Mike Pence
// @match        https://www.torn.com/*
// @match        http://www.torn.com/*
// @requires     https://ajax.googleapis.com/ajax/libs/jquery/3.2.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/28720/Torn%20Easter%20Egg%20Links.user.js
// @updateURL https://update.greasyfork.org/scripts/28720/Torn%20Easter%20Egg%20Links.meta.js
// ==/UserScript==

$(document).ready(function(){
    var randomNum = Math.floor((Math.random() * 10) + 1);
    if(randomNum == 1){
        $("#iconTray").prepend("<li class='iconShow' title='<b>Easter Egg Competition</b>'><a href='/competition.php'><img src='/images/items/475/large.png?v=1491311161899' witdth='34' height='23' style='position:relative;left:-14px;top:-3px'></a></li>");
    }
    else if(randomNum == 2){
        $("#iconTray").prepend("<li class='iconShow' title='<b>Easter Egg Competition</b>'><a href='/competition.php'><img src='/images/items/473/large.png?v=1491311161899' witdth='34' height='23' style='position:relative;left:-14px;top:-3px'></a></li>");
    }
    else if(randomNum == 3){
        $("#iconTray").prepend("<li class='iconShow' title='<b>Easter Egg Competition</b>'><a href='/competition.php'><img src='/images/items/474/large.png?v=1491311161899' witdth='34' height='23' style='position:relative;left:-14px;top:-3px'></a></li>");
    }
    else if(randomNum == 4){
        $("#iconTray").prepend("<li class='iconShow' title='<b>Easter Egg Competition</b>'><a href='/competition.php'><img src='/images/items/477/large.png?v=1491311161899' witdth='34' height='23' style='position:relative;left:-14px;top:-3px'></a></li>");
    }
    else if(randomNum == 5){
        $("#iconTray").prepend("<li class='iconShow' title='<b>Easter Egg Competition</b>'><a href='/competition.php'><img src='/images/items/584/large.png?v=1491311161899' witdth='34' height='23' style='position:relative;left:-14px;top:-3px'></a></li>");
    }
    else if(randomNum == 6){
        $("#iconTray").prepend("<li class='iconShow' title='<b>Easter Egg Competition</b>'><a href='/competition.php'><img src='/images/items/472/large.png?v=1491311161899' witdth='34' height='23' style='position:relative;left:-14px;top:-3px'></a></li>");
    }
    else if(randomNum == 7){
        $("#iconTray").prepend("<li class='iconShow' title='<b>Easter Egg Competition</b>'><a href='/competition.php'><img src='/images/items/585/large.png?v=1491311161899' witdth='34' height='23' style='position:relative;left:-14px;top:-3px'></a></li>");
    }
    else if(randomNum == 8){
        $("#iconTray").prepend("<li class='iconShow' title='<b>Easter Egg Competition</b>'><a href='/competition.php'><img src='/images/items/583/large.png?v=1491311161899' witdth='34' height='23' style='position:relative;left:-14px;top:-3px'></a></li>");
    }
    else if(randomNum == 9){
        $("#iconTray").prepend("<li class='iconShow' title='<b>Easter Egg Competition</b>'><a href='/competition.php'><img src='/images/items/478/large.png?v=1491311161899' witdth='34' height='23' style='position:relative;left:-14px;top:-3px'></a></li>");
    }
    else{
        $("#iconTray").prepend("<li class='iconShow' title='<b>Easter Egg Competition</b>'><a href='/competition.php'><img src='/images/items/476/large.png?v=1491311161899' witdth='34' height='23' style='position:relative;left:-14px;top:-3px'></a></li>");
    }
    $(".areas").prepend("<li><div class='list-link' id='nav-items'><a href='/imarket.php#/p=market&cat=candy'><i class='left'><img src='/images/items/478/large.png?v=1491311161899' witdth='34' height='23'></i><span class='border-l'></span><span class='border-r'></span><span class='list-link-name'>Buy Easter Eggs</span></a></div></li>");
    $(".areas").prepend("<li><div class='list-link' id='nav-items'><a href='/item.php#candy-items'><i class='left'><img src='/images/items/478/large.png?v=1491311161899' witdth='34' height='23'></i><span class='border-l'></span><span class='border-r'></span><span class='list-link-name'>My Easter Eggs</span></a></div></li>");
    $(".areas").prepend("<li><div class='list-link' id='nav-items'><a href='/competition.php'><i class='left'><img src='/images/items/478/large.png?v=1491311161899' witdth='34' height='23'></i><span class='border-l'></span><span class='border-r'></span><span class='list-link-name'>Easter Egg Comp.</span></a></div></li>");
});