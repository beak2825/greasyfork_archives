// ==UserScript==
// @name         Zotac Dark Theme
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Makes Zotac (and Cloudflare on Zotac) easier on the eyes!
// @author       Tylup#7777
// @match        https://www.zotacstore.com/us/*
// @icon         https://www.google.com/s2/favicons?domain=zotac.com
// @run-at       document-start
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/426914/Zotac%20Dark%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/426914/Zotac%20Dark%20Theme.meta.js
// ==/UserScript==

const invertImages = false;

(function() {
    'use strict';

    window.addEventListener('DOMContentLoaded', (event) => {
        setTimeout(function(){

            // Set BG color to black for all children recursively.
            function setBgForChildren(element, color){
                console.log('checking '+element);
                if(!element || element == null || !color) return;
                var elements = element.children;
                if(elements){
                    for (var i = 0; i < elements.length; i++) {
                        console.log('setting bg color of '+elements[i]);
                        elements[i].style.backgroundColor=color;
                        if(elements[i].children) { setBgForChildren(elements[i]) }
                    }
                }
            };
            // Set BG color for all children of the Cloudflare wrapper to black.
            setBgForChildren(document.getElementById('cf-wrapper'), "black");

            function getStyle(x, styleProp) {
                if (x.currentStyle) var y = x.currentStyle[styleProp];
                else if (window.getComputedStyle)
                    var y = document.defaultView.getComputedStyle(x, null).getPropertyValue(styleProp);
                return y;
            }

            // Scrolling text on Zotac pages should be white for visibility.
            var msgBanner = document.getElementsByClassName("view-content")[0];
            if (msgBanner) msgBanner.children[0].style.color = 'rgb(255, 255, 255)';

            // ===========================
            // Invert images for dark mode
            // ===========================
            function setInvert(element, invert){
                if (!element || invert == null || invertImages == false) return;
                element.style.setProperty('filter','invert('+invert+')');
            };

            // Get all elements on the page
            var elements = document.getElementsByTagName('*');

            // iterate over the elements
            for (var i = 0;elements[i];i++) {
                // Don't invert the warning triangle or Zotac logo.
                if(elements[i].className != "cf-no-screenshot"){
                    // get the background-image style property
                    let bgIm = getStyle(elements[i], 'background-image');

                    // if one was found, invert it.
                    if (bgIm && bgIm !== 'none') setInvert(elements[i],1);
                }
            }

            // Apply invert filter to any "img" elements.
            var images = document.querySelectorAll("img");
            if (images) for (var i = 0; i < images.length; i++) setInvert(images[i],1);
            // ==========================================

            // Make the Zotac logo normal again.
            setTimeout(function(){
                setInvert(document.getElementsByTagName("img")[0],0);
            }, 750);

        }, 500);
    });

})();

// Image inverts
if(invertImages){
    GM_addStyle('img {-webkit-filter: invert(1); filter: invert(1);}');
    //GM_addStyle('.zoomWindow {-webkit-filter: invert(1); filter: invert(1);}');
}

// Universal filters
GM_addStyle('html,body {background-color: #000;}');
GM_addStyle('.wrapper {background-color: #111;}');
GM_addStyle('.page {background-color: #222;}');
GM_addStyle('body, button, input, select, table, textarea {color: #DADADA;}');
GM_addStyle('h1 {color: #FFF;}');
GM_addStyle('h2 {color: #FFF;}');
GM_addStyle('#search_mini_form #search {color: #DDD; background: #111;}');
GM_addStyle('#search_mini_form .search-button {background: #111; border: solid 1px #000;}');
GM_addStyle('input[type=email], input[type=search], input[type=number], input[type=password], input[type=tel], input[type=text] {background: black; color: DDD; border: solid 1px #000;}');
GM_addStyle('.sidebar .block-title strong {color: #DDD;}');
GM_addStyle('.grid-full {background-color: #111;}');
GM_addStyle('.grid-full > li > a {color: #DDD;}');
GM_addStyle('.grid-full > li > .level-top {background-color: #111;}');
GM_addStyle('.grid-full .level-top .mm-cat-title {color: #DDD;}');
GM_addStyle('.grid-full .level1.menu-product > li a.mm-product-title .product-name {color: #BBB;}');
GM_addStyle('.skip-content.skip-active {background: #333;}');
GM_addStyle('.top-links .skip-content.skip-active a {color: #DDD;}');
GM_addStyle('.top-links .skip-content.skip-active a:hover {color: #F9B61E;}');
GM_addStyle('.header-minicart .minicart-wrapper {background: #333;}');
GM_addStyle('.page-title h1 {color: #F9B61E;}');
GM_addStyle('.category-image-bg .page-title-top h1 {color: #FFF;}');
GM_addStyle('.category-image-bg {background-color: #000;}');
GM_addStyle('.block-layered-nav .block-content > dl > dt {color: #F9B61E;}');
GM_addStyle('.block-layered-nav dl dd ol > li > a {color: #DDD;}');
GM_addStyle('.product-image {background-color: #111;}');
GM_addStyle('h2.product-name a {color: #CCC;}');
GM_addStyle('h3.product-name a {color: #CCC;}');
GM_addStyle('h4.product-name a {color: #CCC;}');
GM_addStyle('h5.product-name a {color: #CCC;}');
GM_addStyle('p.product-name a {color: #CCC;}');
GM_addStyle('.newsletter-subsribe {background-color: #1A1A1A;}');
GM_addStyle('.footer .footer-col h4 {color: #DDD;}');
GM_addStyle('a {color: #BBB;}');

// Product categories
GM_addStyle('.sort-by .sort-by-switcher {background-color: #0F0F0F;}');
GM_addStyle('.sorter > .view-mode .grid, .sorter > .view-mode .list {background-color: #0F0F0F;}');
GM_addStyle('.sorter > .sort-by .sort-by-switcher {background-color: #0F0F0F;}');
GM_addStyle('.toolbar {background-color: #0F0F0F;}');
GM_addStyle('.toolbar .dropdown {background-color: #0F0F0F;}');
GM_addStyle('.toolbar .dropdown .selected {color: #DADADA; background-color: #111;}');
GM_addStyle('.toolbar .dropdown li {color: #FFF;}');
GM_addStyle('.toolbar .dropdown div {background-color: #111;}');
GM_addStyle('.toolbar .dropdown div ul li.active {background-color: #000;}');
GM_addStyle('.toolbar .dropdown div ul li.focus {color: #000; background-color: #AAA;}');
GM_addStyle('.toolbar label {color: #DADADA;}');
GM_addStyle('.form-control {color: #FFF; background-color: #000;}');
GM_addStyle('select {background-color: #000;}');
GM_addStyle('.products-grid .button.btn-cart {background-color: #F9B61E;}');
GM_addStyle('.products-list .button.btn-cart {background-color: #F9B61E;}');
GM_addStyle('.products-grid .product-image {background-color: #111;}');
GM_addStyle('.products-list .product-image {background-color: #111;}');
GM_addStyle('.products-grid .product-image {border: 1px solid #000;}');
GM_addStyle('.products-list .product-image {border: 1px solid #000;}');
GM_addStyle('.products-grid .availability.out-of-stock span {background-color: #000;}');
GM_addStyle('.products-list .availability.out-of-stock span {background-color: #000;}');
GM_addStyle('.products-grid .add-to-links li a {color: #BBB;}');
GM_addStyle('.products-list .add-to-links li a {color: #BBB;}');

// Individual product pages
GM_addStyle('.product-view .product-shop .additional-info {color: #DDD;}');
GM_addStyle('.product-view .product-shop .additional-info .product-sku .sku-number {background: #111; color: #F9B61E;}');
GM_addStyle('.h1 {color: #FFF;}');
GM_addStyle('.h2 {color: #FFF;}');
GM_addStyle('.product-image-thumbs a {background-color: #111; border: solid 1px #F9B61E;}');
GM_addStyle('#block-related h2, #upsell-product h2 {color: #DDD;}');

// Account screens
GM_addStyle('form .legend {color: #DDD;}');
GM_addStyle('label {color: #DDD;}');
GM_addStyle('.sidebar .block-account li strong {color: #888;}');
GM_addStyle('.sidebar .block-cms-menu li strong {color: #888;}');
GM_addStyle('.sidebar .block-account li a {color: #BBB;}');
GM_addStyle('.sidebar .block-account li a:hover {color: #FFF;}');
GM_addStyle('body.customer-account .my-account .page-title h2 {color: #FFF;}');

// Cloudflare exclusives
GM_addStyle('.no-selection {background-color: #000;}');