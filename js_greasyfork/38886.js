// ==UserScript==
// @name         BTS2 - Rýchle menu
// @namespace    BTS2, amazon, quick, shortcut, rychle, menu, skratka
// @version      0.2
// @description  Menu s vlastnými linkami (skratkami)
// @author       AA z BTS2
// @require      https://cdn.jsdelivr.net/gh/jquery/jquery@3.3.1/dist/jquery.min.js
// @require      https://cdn.jsdelivr.net/gh/eumatheusgomes/menu@0.1.3/dist/menu.min.js
// @include      https://rodeo-dub.amazon.com/BTS2/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/38886/BTS2%20-%20R%C3%BDchle%20menu.user.js
// @updateURL https://update.greasyfork.org/scripts/38886/BTS2%20-%20R%C3%BDchle%20menu.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('head').append(
        '<link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" type="text/css">'+
        '<link href="https://cdn.jsdelivr.net/gh/eumatheusgomes/menu@0.1.3/dist/menu.min.css" rel="stylesheet" type="text/css">'+
        '<style type="text/css">'+
        '*, *:before, *:after {box-sizing: border-box;}'+
        '.menu {z-index: 1800!important}'+
        '.qm-toggle {color: #b95f00!important; display: block; float: right; width: 32px; height: 32px; text-align: center; position: fixed; top: 15px; right: 5px; z-index: 2000; text-shadow: 0px 0px 9px red}'+
        '.qm-toggle > i {font-size: 32px!important}'+
        '</style>'
    );

    var qmHTML = '<a href="#" class="qm-toggle" id="quickmenu-toggle"><i class="material-icons">flash_on</i></a>'+
        '<ul id="quickmenu" class="menu" data-menu data-menu-toggle="#quickmenu-toggle">'+
        '<li><a target="_blank" href="https://rodeo-dub.amazon.com/BTS2/ItemList?_enabledColumns=on&WorkPool=PickingPicked&enabledColumns=LPN&ExSDRange.RangeStartMillis=1517331599999&ExSDRange.RangeEndMillis=1520528460000&ProcessPath=PPFracsXDSimplePT&shipmentType=CUSTOMER_SHIPMENTS">Rodeo ItemList</a></li>'+
        '<li class="menu-separator"></li>'+
        '<li><a target="_blank" href="http://fcresearch-eu.aka.amazon.com/BTS2/results?s=">FC Research</a></li>'+
        '</ul>';

    $('body').append('afterbegin', qmHTML);
    $('#quickmenu').menu();
})();