// ==UserScript==
// @name         Lorwolf Magic Pup Predictor
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Predict Puppies of any two wolves
// @author       trashgaylie
// @match        https://www.lorwolf.com/Play/StartBreed*
// @icon         https://www.lorwolf.com/icon-192x192.png
// @grant        GM_log
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @run-at       document-idle
// @license      GNU AGPLv3
// @downloadURL https://update.greasyfork.org/scripts/468809/Lorwolf%20Magic%20Pup%20Predictor.user.js
// @updateURL https://update.greasyfork.org/scripts/468809/Lorwolf%20Magic%20Pup%20Predictor.meta.js
// ==/UserScript==

(function() {

    // Set up Button
    var button_html = '<button id="magicPupButton" class="btn btn-green btn-sm btn-fill" style="margin-bottom:1rem">Magic Pup Predictor</button>';
    var breedBox = $('#startBreedTop');

    breedBox.before(button_html);
    var button = $('#magicPupButton');

    // Magic Pup Predictor Activate
    button.click(function(){
        // Empty Wolves
        $('.startBreedParentImage').empty();
        $('.startBreedParentName').remove();

        // Remove Stud/Breed Button
        $('#finishStartBreed').remove();

        // Add Form Fields
        var formGroup = '<div class="form-group">'
        var idInputFemale = '<div class="inputContainer" style="float: left; width: 33.3333%; margin-bottom:1rem"><input class="lorwolfId" id="magicFemale" data-sex="Female" type="text" placeholder="Lorwolf-ID"></div>'
        var idInputMale = '<div class="inputContainer" style="float: right; width: 33.3333%; margin-bottom:1rem"><input class="lorwolfId" id="magicMale" data-sex="Male" type="text" placeholder="Lorwolf-ID"></div>'
        var clearfix = '<div style="clear:both">';
        var startBreedButton = $('#startBreedMiddle')

        breedBox.before(formGroup);
        breedBox.before(clearfix);
        $('.form-group').append(idInputFemale);
        $('.form-group').append(idInputMale);

        // Remove Original Button
        button.hide();


        // Enter IDs
        $('.lorwolfId').change( function(){
            var sex = $(this).data('sex');
            var id = $(this).val();

            // check if ID field is empty and add wolf data if not
            $('#startBreed' + sex + ' .startBreedParentName').remove();
            if (id != "") {
                var name = '<div class="startBreedParentName" data-user-wolf-id="' + id + '">' + id + '</div>'
                $('#startBreed' + sex + ' .pageSection .startBreedWolfContainer').prepend(name);
            }

            // If both IDs are set
            if ($('#startBreedFemale .pageSection .startBreedWolfContainer .startBreedParentName').length > 0  && $('#startBreedMale .pageSection .startBreedWolfContainer .startBreedParentName').length > 0) {
                startBreedButton.removeClass('hide');
            } else {
                startBreedButton.addClass('hide');
            }

        });
    });


})();