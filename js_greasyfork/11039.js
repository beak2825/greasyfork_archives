// ==UserScript==
// @name         biggerScreen
// @version      1.0
// @author       Rst00
// @include     http://www.wykop.pl/*
// @namespace https://greasyfork.org/users/13380
// @description Skrypt dla Wykop.pl rozszerzający okno z filmem.
// @downloadURL https://update.greasyfork.org/scripts/11039/biggerScreen.user.js
// @updateURL https://update.greasyfork.org/scripts/11039/biggerScreen.meta.js
// ==/UserScript==

$(function(){

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle('a.fk-button-open { position: absolute; top:0; right:0px; background: #2c2c2c; width: 40px; height: 50px;line-height:50px;text-align:center; z-index: 9999999; display: block !important;}');
    addGlobalStyle('.mainnav {position: relative;}');
    addGlobalStyle('.grid-main {transition: all 0.4s ease-in-out;}');
    addGlobalStyle('.fk-bigger {margin-right: 0;}');
    addGlobalStyle('.fk-left-arrow:before {content: "\\f060"');

    $('.mainnav').append('<a href="#" class="fk-button-open" style=""> <i class="fa fa-arrow-right"></i> </a>');
    $('.fk-button-open').on('click', function(){
        $('.grid-main').toggleClass('fk-bigger');
        $(this).find('i').toggleClass('fk-left-arrow');
    });
    
});