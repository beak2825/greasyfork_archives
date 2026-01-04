// ==UserScript==
// @name         Neopets - Random Shops Button
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Makes the "Shops" button on the Neopets nav bar link to a random shop instead of Neopia Central.
// @author       Baffle Blend
// @match        http://www.neopets.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/391919/Neopets%20-%20Random%20Shops%20Button.user.js
// @updateURL https://update.greasyfork.org/scripts/391919/Neopets%20-%20Random%20Shops%20Button.meta.js
// ==/UserScript==

(function() {
    'use strict';

function shopShuffle() {
//Shop IDs that have either never been used or have been removed from the site
var badIDs = [6,11,19,28,29,32,33,52,64,65,99,109,115];
do{
var shopID = Math.ceil(Math.random() * 117);
var checkID = badIDs.indexOf(shopID);
//If the random number is one of the bad IDs, try again
}while(checkID!==-1);
 return shopID;
};

//Grabs the "Shops" button
var navbar = document.getElementById("template_nav");
var navbutton = navbar.getElementsByClassName("nav_image");
var shopbutton = navbutton[6].firstChild;


//Assigns the randomized shop link to the button
var fullurl = "http://www.neopets.com/objects.phtml?type=shop&obj_type=" + shopShuffle();
shopbutton.href = fullurl;
}



)();