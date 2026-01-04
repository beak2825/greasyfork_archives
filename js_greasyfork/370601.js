// ==UserScript==
// @name         smash ultimate wallpaper machine
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  its free real estate
// @author       You
// @match        https://www.smashbros.com/en_US/fighter/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/370601/smash%20ultimate%20wallpaper%20machine.user.js
// @updateURL https://update.greasyfork.org/scripts/370601/smash%20ultimate%20wallpaper%20machine.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //hide nintendo logo
    document.getElementsByClassName("nintendo-logo")[0].style.visibility = "hidden";

    //hide switch logo
    document.getElementsByClassName("switch-logo")[0].style.visibility = "hidden";

    //hide page title
    document.getElementsByClassName("page-header__title")[0].style.visibility = "hidden";

    //hide bar with logo
    document.getElementsByClassName("page-header-bar page-header-bar--fighter")[0].style.visibility = "hidden";

    //add overflow to character name
    document.getElementsByClassName("fighter-name-frame")[0].style.overflow = "visible";


    //hide general stuff
    document.getElementsByClassName("page-header-bar__link-wrap")[0].style.visibility = "hidden";
    document.getElementsByClassName("page-header-bar__link-wrap")[0].style.visibility = "hidden";
    document.getElementsByClassName("fighter-series")[0].style.visibility = "hidden";
    document.getElementsByClassName("globalsidenav-wrapper")[0].style.visibility = "hidden";
    document.getElementsByClassName("globalheader-util")[0].style.visibility = "hidden";
    document.getElementsByClassName("fighter-slide")[0].style.visibility = "hidden";
    document.getElementsByClassName("fighter-slide-nav")[0].style.visibility = "hidden";
    document.getElementsByClassName("fighter-blog-link-inner")[0].style.visibility = "hidden";
    document.getElementsByClassName("fighter-local-link")[0].style.visibility = "hidden";
    document.getElementsByClassName("fighter-pager")[0].style.visibility = "hidden";
    document.getElementsByClassName("fighter-footer__body")[0].style.visibility = "hidden";
    document.getElementsByClassName("globalfooter")[0].style.visibility = "hidden";
})();