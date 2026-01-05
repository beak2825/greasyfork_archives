// ==UserScript==
// @name         Clean cybersport.ru
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  try to take over the world!
// @author       You
// @match        http://cybersport.ru/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18576/Clean%20cybersportru.user.js
// @updateURL https://update.greasyfork.org/scripts/18576/Clean%20cybersportru.meta.js
// ==/UserScript==

(function() {
    var headerMenu = $('.header-holder-main-nav > .pure-menu > ul > li.nav-item:last-child');
    var btn = $('<li><li class="nav-item nav-link button pure-menu-item "><a href="#">Магия</a></li></li>').insertAfter(headerMenu);
    // = $('.header-holder-main-nav > .pure-menu > ul > li.nav-item:last-child > a');

    var SUPER_CLEAN_CYBERSPORT = 'superCleanCybersport';

    $('#main-background').css('padding-top', 0);
    $('.header-top').css('display', 'none');

    function clearCybersport(display) {
        if (localStorage.getItem(SUPER_CLEAN_CYBERSPORT) === null) {
            display = 'none';
        }
        $('main .col-md-12 > .row').css('display', display);
        $('.col-sm-12.col-md-6.small-12.medium-6.columns.page-content-right > div').css('display', display);
        $('.col-sm-12.col-md-6.small-12.medium-6.columns.page-content-right > div:nth-child(1)').css('display', 'block'); 

    }

    if(localStorage.getItem(SUPER_CLEAN_CYBERSPORT) === "false" ) {
        clearCybersport('block');
    } else {
        clearCybersport('none');
    }    



    btn.click(function() {
        console.log(localStorage.getItem(SUPER_CLEAN_CYBERSPORT));
        //      $('main .col-md-12 > .row').css('display', 'block');
        if(localStorage.getItem(SUPER_CLEAN_CYBERSPORT) === "false" ) {
            localStorage.setItem(SUPER_CLEAN_CYBERSPORT, true);
            clearCybersport('none');
        } else {
            localStorage.setItem(SUPER_CLEAN_CYBERSPORT, false);
            clearCybersport('block');
        }
    });

})();