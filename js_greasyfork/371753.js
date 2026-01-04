// ==UserScript==
// @name         Neopets Quality of Life Improvements.
// @namespace    http://tampermonkey.net/
// @version      .5
// @description  A bunch of QOL improvements you can enable at will.
// @author       RealisticError
// @match        http://www.neopets.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371753/Neopets%20Quality%20of%20Life%20Improvements.user.js
// @updateURL https://update.greasyfork.org/scripts/371753/Neopets%20Quality%20of%20Life%20Improvements.meta.js
// ==/UserScript==

(function() {
    'use strict';


    //Enable or Disable improvements
    var enablePinTyper = true;
    var enableLoginPetImage = true;



    //=== Pin Typer ===
    //Description: Types your pin into any screen which has pin entry.

    //Pin Typer Variables
    var pin = ""; //Type pin in here
    var disableAutoTypeUCPet = true; //set this to false to allow the program to autotype your pin on the pet conversion page (you monster!)

    if(enablePinTyper) {

        if($("#pin_field").val() !== 'undefined'){
            if(window.location.href.startsWith("http://www.neopets.com/convert_pet.phtml") && disableAutoTypeUCPet){}
            else{
                $("#pin_field").val(pin);
            }
        }
    }


    //Login Pet Image
    //Description: This shows your active pets image when you get to the login screen.

    //Login Pet Image Variables
    var petImageToFind = "http://pets.neopets.com/cpn/" + $("#active-pet-box").children('strong.petname').text() + "/1/2.png"
    if(enableLoginPetImage) {

        $("#active-pet-box").children("img").attr("src", petImageToFind);

    }
})();