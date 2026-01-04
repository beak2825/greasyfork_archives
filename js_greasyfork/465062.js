// ==UserScript==
// @name         Shoptet "Schování nechtěných tlačítek v levém menu"
// @namespace    mailto:adam.cerny@eshopia.cz
// @version      0.3
// @description  Odstraní z levého menu v administraci nabídku ShoptetPay a ShoptetCapital
// @author       Adam Černý
// @match        */admin/*
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465062/Shoptet%20%22Schov%C3%A1n%C3%AD%20necht%C4%9Bn%C3%BDch%20tla%C4%8D%C3%ADtek%20v%20lev%C3%A9m%20menu%22.user.js
// @updateURL https://update.greasyfork.org/scripts/465062/Shoptet%20%22Schov%C3%A1n%C3%AD%20necht%C4%9Bn%C3%BDch%20tla%C4%8D%C3%ADtek%20v%20lev%C3%A9m%20menu%22.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(document).ready(function() {
        $('.navigation__link--1218').parent().hide(); //schová ShoptetPay
        $('.navigation__link--1449').parent().hide(); //schová ShoptetCapital
    });
})();