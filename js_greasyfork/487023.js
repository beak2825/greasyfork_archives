// ==UserScript==
// @name         AO3: Disable Hover in Main Menu
// @description  Ao3 menu dropdowns are no longer visible at hover, you have to click the main menu entry instead
// @version      1.2
// @author       escctrl
// @namespace    https://greasyfork.org/en/users/906106-escctrl
// @match        https://archiveofourown.org/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.7.0/jquery.min.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/487023/AO3%3A%20Disable%20Hover%20in%20Main%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/487023/AO3%3A%20Disable%20Hover%20in%20Main%20Menu.meta.js
// ==/UserScript==

(function($) {
    'use strict';

    // AO3 menu seems to be built with Bootstrap JS, based on existance of data-* attributes
    // AO3 has CSS (#header .dropdown:hover .menu {display: block}) to make dropdown-on-hover work, but CSS override meant clicking wouldn't show menu anymore either ¯\_(ツ)_/¯
    // hack inspired by this comment: https://stackoverflow.com/a/19191435/22187458
    // this combo (mouse-in and mouse-out both hide the dropdown and reset the Bootstrap class) gives the most predictable experience if the pointer moves back and forth across all menu entries without clicking anywhere
    
    //// when a li.dropdown is being hovered over
    $('#header ul.navigation.actions li.dropdown').hover(function() {
        // Ao3 CSS tries to show its ul.dropdown-menu entries -> we force-hide it again with JS
        $(this).find('.dropdown-menu').hide();
        // when mouse away, dropdown still closes -> reset the Bootstrap class so next click opens dropdown again
        $(this).removeClass('open');
    });

})(jQuery);