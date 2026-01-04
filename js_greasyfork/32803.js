// ==UserScript==
// @name         John Doe script
// @namespace    https://greasyfork.org/users/144229
// @version      1.4
// @description  Makes Money
// @author       MasterNyborg
// @icon         http://i.imgur.com/wS1IQwd.jpg
// @include      *google.com/evaluation/endor*
// @include     https://www.youtube.com/embed?*
// @include     https://www.youtube.com/embed/*
// @exclude     *turkerhub.com*
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/32803/John%20Doe%20script.user.js
// @updateURL https://update.greasyfork.org/scripts/32803/John%20Doe%20script.meta.js
// ==/UserScript==

$(document).ready(function() {
    $('#yes-playable').click();
    $('input[name=visual-sensitivity][value=NOT_SENSITIVE]').click();
    $('input[name=audio-sensitivity][value=NOT_SENSITIVE_BUT_CONTAINS_FOREIGN_LANGUAGE]').click();
    $(document).keyup(function(event){
        if (event.which == 49 || event.which == 103){ //1 or keypad 7
            if ($('#yes-playable').is(':checked')){
                $('input[value=NOT_PLAYABLE]').click();
            }
            else{
                $('#yes-playable').click();
                $('input[name=visual-sensitivity][value=NOT_SENSITIVE]').click();
                $('input[name=audio-sensitivity][value=NOT_SENSITIVE_BUT_CONTAINS_FOREIGN_LANGUAGE]').click();
            }
        }else if (event.which == 50 || event.which == 104){ //2 or keypad 8
            if ($('input[name=visual-sensitivity][value=NOT_SENSITIVE]').is(':checked')){
                $('input[value=NOT_SENSITIVE_BUT_CONTAINS_FOREIGN_LANGUAGE][name=visual-sensitivity]').click();
            }else if ($('input[value=NOT_SENSITIVE_BUT_CONTAINS_FOREIGN_LANGUAGE][name=visual-sensitivity]').is(':checked')){
                $('input[value=SENSITIVE][name=visual-sensitivity]').click();
            }else if ($('input[value=SENSITIVE][name=visual-sensitivity]').is(':checked')){
                $('input[name=visual-sensitivity][value=NOT_SENSITIVE]').click();
            }
        }else if (event.which == 51 || event.which == 105){ //3 or keypad 9
            if ($('input[name=audio-sensitivity][value=NOT_SENSITIVE_BUT_CONTAINS_FOREIGN_LANGUAGE]').is(':checked')){
                $('input[value=NOT_SENSITIVE][name=audio-sensitivity]').click();
            }else if ($('input[value=NOT_SENSITIVE][name=audio-sensitivity]').is(':checked')){
                $('input[value=SENSITIVE][name=audio-sensitivity]').click();
            }else if ($('input[value=SENSITIVE][name=audio-sensitivity]').is(':checked')){
                $('input[name=audio-sensitivity][value=NOT_SENSITIVE_BUT_CONTAINS_FOREIGN_LANGUAGE]').click();
            }
        }else if (event.which == 13){
            document.querySelector(`[type="submit"]`).click();
        }
    });
    $('input[type=checkbox]').mouseenter(function() {
        if($(this).prop('checked')) {
            $(this).prop('checked', false);
            $(this).removeAttr('checked');
        }
        else{
            $(this).prop('checked', true);
            $(this).attr('checked',true);
        }
    });
    if (!(/[?&]autoplay=1/).test(location.search)) {
        document.querySelector(".ytp-large-play-button").click();
    }
});