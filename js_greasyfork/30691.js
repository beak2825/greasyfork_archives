// ==UserScript==
// @name    StopMultipleMessageForumOnly
// @namespace Forum
// @author    Kmaschta, MockingJay
// @date    19/09/2015
// @version   1.2.1
// @description Block spam on over-clicking
// @match   https://www.dreadcast.net/Forum*
// @match   https://www.dreadcast.net/FAQ*
// @require   http://code.jquery.com/jquery-latest.min.js
// @grant   none
// @downloadURL https://update.greasyfork.org/scripts/30691/StopMultipleMessageForumOnly.user.js
// @updateURL https://update.greasyfork.org/scripts/30691/StopMultipleMessageForumOnly.meta.js
// ==/UserScript==

// CHANGELOG
// 1.1: Set cursor to 'wait' when locked

jQuery.noConflict();

function unlock_button(elem, onclick, content) {
    elem.attr('onclick', onclick);
    elem.removeAttr('style');
    elem.html(content);
    elem.removeClass('locked');
}

function lock_button(elem) {
    // Save event action
    var onclick = elem.attr('onclick');
    var content = elem.html();

    // Lock button
    elem.removeAttr('onclick');
    elem.unbind('click');
    elem.html('Verrouillé');
    elem.attr('style', 'cursor: wait;');
    elem.addClass('locked');

    // Still unlock after 5s
    var tid = setTimeout(function() {
        if(elem.hasClass('locked')) {
            unlock_button(elem, onclick, content);
            elem.unbind('dblclick');
        }
    }, 5000);

    // Unlock button on dbl click
    elem.dblclick(function() {
        clearTimeout(tid);
        unlock_button(elem, onclick, content);
        // Rebind lock on click
        elem.click(function() { lock_button(elem); });
    });
}

$(document).ready( function() {
    // Forum "Poster" button
    $('#zone_reponse .bouton.poster').not('.locked').click(function() {
        lock_button($(this));
    });

    // IG "Envoyer" response message
    /*$(document).ajaxComplete(function() {
        $('.zone_reponse .btnTxt').not('.locked').unbind('click').click(function() {
            lock_button($(this));
        });
    });*/

    console.log('StopMultipleMessage on');
});