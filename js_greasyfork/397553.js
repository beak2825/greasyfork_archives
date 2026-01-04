// ==UserScript==
// @name         KidOYO Dark Theme
// @namespace    www.com
// @version      0.1
// @description  Adds a dark theme to the KidOYO homepage. Finally
// @author       Ashley
// @match        https://*.oyoclass.com/*
// @match        https://kidoyo.com/*
// @grant        none
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/397553/KidOYO%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/397553/KidOYO%20Dark%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';
    addGlobalStyle(".col-xs-1, .col-sm-1, .col-md-1, .col-lg-1, .col-xs-2, .col-sm-2, .col-md-2, .col-lg-2, .col-xs-3, .col-sm-3, .col-md-3, .col-lg-3, .col-xs-4, .col-sm-4, .col-md-4, .col-lg-4, .col-xs-5, .col-sm-5, .col-md-5, .col-lg-5, .col-xs-6, .col-sm-6, .col-md-6, .col-lg-6, .col-xs-7, .col-sm-7, .col-md-7, .col-lg-7, .col-xs-8, .col-sm-8, .col-md-8, .col-lg-8, .col-xs-9, .col-sm-9, .col-md-9, .col-lg-9, .col-xs-10, .col-sm-10, .col-md-10, .col-lg-10, .col-xs-11, .col-sm-11, .col-md-11, .col-lg-11, .col-xs-12, .col-sm-12, .col-md-12, .col-lg-12 { {background-color:#2c2f33 color:#ffffff;}");



    addGlobalStyle(".list-group-item.active, .list-group-item.active:hover, .list-group-item.active:focus, .list-group-item:hover, .list-group-item:focus {background-color:#99aab5;border-color:#99aab5} .list-group-item {background-color:#2c2f33} a.list-group-item {color:#ffffff} .fa {color:#ffffff} ");
    addGlobalStyle(".form-control {background-color:#2c2f33;color:#ffffff}");
    addGlobalStyle(".buzz_comment_list_container, .table, .table-bordered {background-color:#2c2f33}");
    addGlobalStyle(".panel-body {background-color:#2c2f33; color:#ffffff}");
    addGlobalStyle(".navbar, .navbar-default, .navbar-collapse, .navbar-fixed-top, .navbar-nav, .nav {background-color:#23272a;border-color:#23272a;color:#ffffff}");
    addGlobalStyle(".container-fluid {background-color:#23272a}");

    addGlobalStyle("");

    addGlobalStyle(".c-portfolio-block legend span {font-size:.8em; color:#ffffff}");

    addGlobalStyle("span {color:#ffffff;}");
    addGlobalStyle(".dropdown-menu {background-color:#2c2f33;color:#ffffff}");
    addGlobalStyle("li,li:hover,.dropdown,.dropdown-toggle,.container {color:#ffffff}");

    addGlobalStyle(".event_ticket_info_item {background-color: #2c2f33} .event_ticket_desc {background-color: #2c2f33}");
    addGlobalStyle(".c-mb-md {color:#ffffff}");
    addGlobalStyle(".event_card_header {background-color: #23272a;color:#ffffff} .event_card,.event_name {color:#ffffff}");
    addGlobalStyle(".event_card .event_day {color:#ffffff}");

    addGlobalStyle(".sub_section .sub_section_left {background-color:#23272a}");

    addGlobalStyle("#c-notify-list blockquote {padding:5px; margin:0px; font-size: 1em; border-left:0px solid #EEE; background:#23272a}");

    addGlobalStyle("body {background-color:#2c2f33; color:ffffff;} div, p,.section_title, .buzz_content, .info_display {color:#ffffff;} a,a:hover {color:#ff3b30;}");

    addGlobalStyle(".btn,.btn-default,.btn-sm {color:#ffffff;background-color:#23272a;border-color:#23272a}");

    addGlobalStyle(".c-mt-sm, .learnpath_desc {background-color:#23272a;color:#ffffff}");
    addGlobalStyle(".learnpath_card {border: 2px solid #2c2f33;border-radius: .5em;margin-bottom: 35px;padding: 10px 5px;margin-left: 0px;margin-right: 0px;height: 200px;box-shadow: 0 2px 0 rgba(153,170,181,0.09);border-bottom: none;background: #23272a;}");
    addGlobalStyle(".learnpath_card::before, .learnpath_card::after {content: \"\";background: #23272a;box-shadow: 0 2px 0 rgba(153,170,181,0.08) inset, 0 2px 0 rgba(153,170,181,0.08);border-radius: 0 0 4px 4px;display: block;height: 4px;position: absolute;top: 100%;right: 10px;left: 10px;}");

    addGlobalStyle(".path_clg_name {color:#ffffff}");


    addGlobalStyle(".slogan {color:#000000}");
    addGlobalStyle(".landing_page_section_dark {background-color:#23272a}");
    addGlobalStyle(".quote_card_title {color:#99aab5}");

    addGlobalStyle(".landing_page_background {}");

    addGlobalStyle(".div_dark {background-color:#23272a}");
    addGlobalStyle("#div_price_container, .div_price {background-color:#2c2f33}");

    addGlobalStyle(".table-striped>tbody>tr:nth-of-type(odd){background-color:#23272a}");

    var elems = document.getElementsByTagName('a');

    for (var i = 0; i<elems.length; i++) {
        elems[i].style.color = "#ffffff";
        elems[i].style["background-color"] = "#23272a";
    }
    elems = document.getElementsByTagName('p');

    for (var i = 0; i<elems.length; i++) {
        elems[i].style.color = "#ffffff";
        //elems[i].style["background-color"] = "#23272a";
    }




    var elem = document.getElementById('slogan');
    if(elem) {
        elem.style.color = "#000000";
    }

    elem = document.getElementById("school_section");
    if(elem) {
        elem.style.color = "#ffffff";
        elem.style["background-color"] = "#23272a";
    }
    elem = document.getElementById("parent_section");
    if(elem) {
        elem.style.color = "#ffffff";
        elem.style["background-color"] = "#23272a";
    }
    elem = document.getElementById("mentor_section");
    if(elem) {
        elem.style.color = "#ffffff";
        elem.style["background-color"] = "#23272a";
    }
    elem = document.getElementById("subscribe_section");
    if(elem) {
        elem.style.color = "#ffffff";
        elem.style["background-color"] = "#23272a";
    }


})();
function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}