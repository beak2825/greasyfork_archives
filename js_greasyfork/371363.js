// ==UserScript==
// @name         User Identity Protector
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Protect your identity from those nosey snitches.
// @author       RealisticError
// @match        http://www.neopets.com/*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/371363/User%20Identity%20Protector.user.js
// @updateURL https://update.greasyfork.org/scripts/371363/User%20Identity%20Protector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //If these are set as false all values will either be erased entirely or replaced by a default string.
    var replaceNameBool = false;
    var replacePetNameBool = false;
    var replacePetPictureBool = false;
    var replaceAllInPageBool = false; // not currently implemented. Held here for later.


    var keepPetPictureVisible = false; //set to true if you're looking to show off your pets ie. selling a pet.

    //Names to replace the original values with.
    var replaceNameWith = "TNTFrozeMyChia"
    var replacePetNameWith = "A"
    var replacePetPictureWith = "http://pets.neopets.com/cp/gwg5gjds/2/2.png"


    //Username in menu bar
    if(replaceNameBool) {
        $(".user > a")[0].innerHTML = replaceNameWith;
    } else {
        $(".user > a")[0].innerHTML = "Username";
    }

    //Pet Sidebar information
    if(replacePetNameBool) {
        $(".sidebarHeader")[0].innerHTML = replacePetNameWith;
    } else {
        $(".sidebarHeader")[0].innerHTML = "No Pet Selected";
    }

    $("#content > table > tbody > tr > td.sidebar > div:nth-child(1) > table > tbody > tr:nth-child(4) > td")[0].innerHTML = "";

    if(!keepPetPictureVisible) {
        if(replacePetPictureBool) {
            $(".activePet")[0].innerHTML = "<img src=" + replacePetPictureWith + " width='150' height='150' border='0' style=''>"
        } else {
            $(".activePet")[0].innerHTML = ""
        }
    }


    //Neofriend Bar
    if(typeof $(".neofriend")[2] !== "undefined") {
        $(".neofriend")[2].innerHTML = "";
    } else {
        $(".neofriend")[1].innerHTML = "";
    }



})();