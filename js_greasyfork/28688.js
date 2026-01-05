// ==UserScript==
// @name         OGS max vertical board
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  online-go.com vertical max space - click VMax in main menu
// @author       dracflam
// @match        https://online-go.com/*
// @downloadURL https://update.greasyfork.org/scripts/28688/OGS%20max%20vertical%20board.user.js
// @updateURL https://update.greasyfork.org/scripts/28688/OGS%20max%20vertical%20board.meta.js
// ==/UserScript==

(function() {
    setTimeout(function(){
    var t=$('<a>').html('VMax').on('click',function() {
        if ($('#NavBar').parent().hasClass('right-col')) {
            $('.Game').css('top','2.2em');
            $('.action-bar').css('display','block');
            $('#main-content').children().first().prepend($('#NavBar'));
            $('#NavBar').css('height','');
        } else {
            $('.Game').css('top','0');
            $('.action-bar').css('display','none');
            $('.right-col').prepend($('#NavBar'));
            $('#NavBar').css('height','35px');
        }
    });
    $('#NavBar .left').prepend(t);
    }, 3000);
})();