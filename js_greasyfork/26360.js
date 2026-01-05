// ==UserScript==
// @name         Neopets Active Pet Switcher
// @namespace    shiftasterisk
// @version      0.1
// @description  Adds neopets active pet switcher under active pet name
// @author       You
// @match        http://www.neopets.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26360/Neopets%20Active%20Pet%20Switcher.user.js
// @updateURL https://update.greasyfork.org/scripts/26360/Neopets%20Active%20Pet%20Switcher.meta.js
// ==/UserScript==

$('.sidebarHeader.medText').first().append('<div id="petSelector"><span id="loadPets">Load Pet Switcher</span></div>');
$('#loadPets').css({'cursor':'pointer'});

$('#loadPets').click(function() {
    getPetImages();
});

function getPetImages(){
    $.ajax(
        {url: 'http://www.neopets.com/quickref.phtml',
         async: false,
         success: function(result) {
             $('#petSelector').empty().append('<input type="checkbox" name="reload" id="reload"><label for="reload">Reload After Switch</label><input type="checkbox" name="showOpts" id="showOpts"><label for="showOpts">Show Pet Options</label>');
             $(result).find('.pet_toggler img').each(function() {
                 console.log($(this).attr('title'));
                 $(this).addClass('petImage').css({'margin':'5px'}).appendTo('#petSelector');
             });
             $(result).find('.active_pet .pet_menu_hide').attr('id','activePetOpts').css({'list-style':'none'}).hide().appendTo('#petSelector');
         }
    });
}

$(document).on('click', '.petImage', function() {
    reload = $('#reload').is(':checked');
    console.log("Setting " + $(this).attr('title') + " to active pet");
    $.ajax(
        {url: 'http://www.neopets.com/process_changepet.phtml?new_active_pet=' + $(this).attr('title'),
         async: false,
         success: function(result) {
             getPetImages();
             if(reload)
                 location.reload();
         }
    });
});

$(document).on('change', '#showOpts', function() {
    showOpts = $('#showOpts').is(':checked');
    if(showOpts)
        $('#activePetOpts').show();
    else
        $('#activePetOpts').hide();
});