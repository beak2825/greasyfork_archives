// ==UserScript==
// @name         Neopets Customization Contest Picture Enlarger
// @namespace    https://greasyfork.org/en/users/200321-realisticerror
// @version      1.0
// @description  allows you to actually judge the custom contest!
// @author       RealisticError
// @match        http://www.neopets.com/spotlights/custompet/custom_spotlight_votes.phtml*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/373034/Neopets%20Customization%20Contest%20Picture%20Enlarger.user.js
// @updateURL https://update.greasyfork.org/scripts/373034/Neopets%20Customization%20Contest%20Picture%20Enlarger.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var LENGTH_BEFORE_PET_NAME_CPN = 38; //38 is the length of the image string before the pet name in a CPN folder.
    var LENGTH_BEFORE_PET_NAME_CP = 37; //38 is the length of the image string before the pet name in a CP folder.
   // var imageHTML = $('#content > table > tbody > tr > td.content > p:nth-child(6) > tbody > tr:nth-child(2) > td');
    var imageHTML = $('#content > table > tbody > tr > td.content > p:nth-child(5) > table > tbody > tr:nth-child(2) > td');
    var lengthOfPetName = 0;
    var petName = '';
    var newImageHTML = '';

    //For some reason Neopets uses 2 different hosting folders for their pets, they come under /CPN/ (which uses the pets name as a filename) and /CP/ (which uses a hash string as the file name)
    if(imageHTML.html().indexOf('cp/') === -1){

        lengthOfPetName = imageHTML.html().lastIndexOf('/1') - LENGTH_BEFORE_PET_NAME_CPN;
        petName = imageHTML.html().substr(38, lengthOfPetName);
        console.log(petName);
        newImageHTML = '<img src="http://pets.neopets.com/cpn/' + petName + '/1/4.png">';
        console.log(newImageHTML);

    } else {

        lengthOfPetName = imageHTML.html().lastIndexOf('/1') - LENGTH_BEFORE_PET_NAME_CP;
        petName = imageHTML.html().substr(37, lengthOfPetName);
        console.log(petName);
        newImageHTML = '<img src="http://pets.neopets.com/cp/' + petName + '/1/4.png">';
        console.log(newImageHTML);
        petName = 'None found'

    }

    //Add the image and the pets name (if the pet comes from a CPN folder) to the screen.
    imageHTML.html(newImageHTML + '<br /> <b>Pet Name:</b> '+ petName);
})();