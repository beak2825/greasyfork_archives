// ==UserScript==
// @name         Gokus's Navigation Bar
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  my extended torn menu!
// @author       DirkSwagger
// @match        https://www.torn.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/406168/Gokus%27s%20Navigation%20Bar.user.js
// @updateURL https://update.greasyfork.org/scripts/406168/Gokus%27s%20Navigation%20Bar.meta.js
// ==/UserScript==
//Target Variables Usernames and Ids
var target1_name = "Ellzabeth";//Change the name in the  ""
var target1_ID = 2339829; //Change the ID number
var target2_name = "C0rv0Attan0";//Change the name in the  ""
var target2_ID = 2207974;//Change the ID number
var target3_name = "Stonermind";//Change the name in the  ""
var target3_ID = 2469930;//Change the ID number
var target4_name = "Devil-Master";//Change the name in the  ""
var target4_ID = 2435949;//Change the ID number
var target5_name = "Emiliodk1";//Change the name in the  ""
var target5_ID = 2523656;//Change the ID number
var target6_name = "ThePenguinbeing";//Change the name in the  ""
var target6_ID = 1307640;//Change the ID number
var target7_name = "marcus978";//Change the name in the  ""
var target7_ID = 1437256;//Change the ID number
var target8_name = "Shadowhunter";//Change the name in the  ""
var target8_ID = 2206992 ;//Change the ID number
var target9_name = "megadick";//Change the name in the  ""
var target9_ID = 2519862;//Change the ID number
var target10_name = "shitface";//Change the name in the  ""
var target10_ID = 2439973;//Change the ID number
//end of variables

//Status Light Variables.
var statusOKAY = "https://media2.giphy.com/media/Kf6V9i55c6oJ7tvtvX/source.gif";
var statusHE = 20;
var statusWD = 20;

//Postion Variables
var top =100; //for my res its 100px .. for yours it may be different
var right =1163; //for my res its 1163.. Yours may be different
//end of positioning variables

//height and width variables
var height = "890";
var width = "175";
//end of height and width variables



        (function() {
    'use strict';
 
 document.getElementsByClassName("header-wrapper-bottom")[0].innerHTML = '<div id="content" style="position: absolute; top: ' + top + 'px; right: '+ right +'px; width: ' + width + 'px; height: ' + height + 'px;  border: 3px solid #73AD21; color: white; background-color: black; '
           + 'opacity: 80%; z-index: 99;"><b>Gokus Navigation Bar<br><hr></b><br><br><b>Faction Links</b><br><a href="https://www.torn.com/factions.php?step=your#/tab=crimes"style="color: orange;">Faction Crimes</a><br><a href="https://www.torn.com/factions.php?step=your#/tab=controls" style="color: orange;">Faction Controls</a><br> '
           + '<a href="https://www.torn.com/factions.php?step=your#/tab=armoury&start=0&sub=drugs"style="color: orange;">Faction Drugs</a><br> '
           + '<a href="https://www.torn.com/factions.php?step=your#/tab=armoury&start=0&sub=medical" style="color: orange;">Faction Medical</a><br><a href="https://www.torn.com/factions.php?step=your#/tab=armoury&start=0&sub=donate"style="color: orange;"> '
           + 'Faction Donate</a><br><br><b>Important Links</b><br><hr><br><a href="https://www.tornstats.com" target="_blank" style="color: orange;">Tornstats</a><br><a href="http://travelrun.torncentral.com/" target="_blank"style="color: orange;"> '
           + 'Torn Travel Run</a><br><a href="https://discordapp.com/" target="_blank"style=" color: orange;">Discord</a><br><br><b>Torn Locations</b><br><hr><br><a href="https://www.torn.com/pmarket.php"style="color: orange;">Points Market</a><br> '
           + '<a href="https://www.torn.com/imarket.php"style="color: orange;">Item Market</a><br><a href="https://www.torn.com/shops.php?step=bitsnbobs"style="color: orange;">Bits n Bobs</a><br> '
           + ' <a href="https://www.torn.com/shops.php?step=pharmacy"style="color: orange;">Pharmacy</a><br><a href="https://www.torn.com/travelagency.php"style="color: orange;">Air Port</a><br><a href= "https://www.torn.com/stockexchange.php"style="color: orange;"> '
           + 'Stock Markets</a><br><a href="https://www.torn.com/loader.php?sid=racing"style="color: orange;">Race Track</a><br><br><br><b>Fast Buy Items</b><br><hr><br><a href="https://www.torn.com/imarket.php#/p=shop&step=shop&type=&searchname=Drug%2520Pack" '
           + 'style="color: orange;">DrugPack</a><br><a href="https://www.torn.com/imarket.php#/p=shop&step=shop&type=&searchname=Xanax"style="color: orange;">Xanax</a><br><a href="https://www.torn.com/imarket.php#/p=shop&step=shop&type=&searchname=Feathery Hotel Coupon"style="color: orange;">FHC</a><br><br><b>Attack Targets</b><hr><br><a href="https://www.torn.com/loader2.php?sid=getInAttack&user2ID='+ target1_ID + '" style="color: red;"> '
           + ' ' + target1_name + '</a><b>Status: <img src= " ' + statusOKAY + ' " style="width: ' + statusWD + 'px; height:' + statusHE + 'px;"><a href="hospitalview.php"></a></li><br><a href="https://www.torn.com/loader2.php?sid=getInAttack&user2ID=' + target2_ID + '" style="color: red;">' + target2_name+ '</a><b>Status: <img src= " ' + statusOKAY + ' " style="width: ' + statusWD + 'px; height:' + statusHE + 'px;"><br> '
           + '<a href="https://www.torn.com/profiles.php?XID=' + target3_ID + '" style="color: red;">' + target3_name + '</a><b>Status: <img src= " ' + statusOKAY + ' " style="width: ' + statusWD + 'px; height:' + statusHE + 'px;"><br> '
           + '<a href="https://www.torn.com/loader.php?sid=attack&user2ID=' + target4_ID + '" style="color: red;">' + target4_name + '</a><b>Status: <img src= " ' + statusOKAY + ' " style="width: ' + statusWD + 'px; height:' + statusHE + 'px;"><br> '
           + '<a href="https://www.torn.com/loader2.php?sid=getInAttack&user2ID='+ target5_ID + '" style="color: red;">'+ target5_name + '</a><b>Status: <img src= " ' + statusOKAY + ' " style="width: ' + statusWD + 'px; height:' + statusHE + 'px;"><br> '
           + '<a href="https://www.torn.com/loader2.php?sid=getInAttack&user2ID='+ target6_ID + '" style="color: red;">'+ target6_name + '</a><b>Status: <img src= " ' + statusOKAY + ' " style="width: ' + statusWD + 'px; height:' + statusHE + 'px;"> <br>'
           + '<a href="https://www.torn.com/loader2.php?sid=getInAttack&user2ID='+ target7_ID + '" style="color: red;">'+ target7_name + '</a><b>Status: <img src= " ' + statusOKAY + ' " style="width: ' + statusWD + 'px; height:' + statusHE + 'px;">'
           + '<br><a href="https://www.torn.com/loader2.php?sid=getInAttack&user2ID=' + target8_ID + '" style="color: red;">'+ target8_name + '</a><b>Status: <img src= " ' + statusOKAY + ' " style="width: ' + statusWD + 'px; height:' + statusHE + 'px;"><br>'
           + '<a href="https://www.torn.com/loader2.php?sid=getInAttack&user2ID='+ target9_ID + '" style="color: red;">'+ target9_name + '</a><b>Status: <img src= " ' + statusOKAY + ' " style="width: ' + statusWD + 'px; height:' + statusHE + 'px;"><br> '
           + '<a href="https://www.torn.com/loader2.php?sid=getInAttack&user2ID='+ target10_ID + '" style="color: red;">'+ target10_name + '</a><b>Status: <img src= " ' + statusOKAY + ' " style="width: ' + statusWD + 'px; height:' + statusHE + 'px;"><br><br>'
           + '<img src="https://pa1.narvii.com/6771/453385886fe49b42662279180a905359953d2c84_00.gif" height= "193px" width="174px"><br><b>Server Time</b><br><hr><br></div>'
})();