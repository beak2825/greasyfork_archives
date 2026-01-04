// ==UserScript==
// @name        olx.pl dark mode
// @namespace   Violentmonkey Scripts
// @match       https://www.olx.pl/*
// @grant       none
// @version     1.01
// @author      lumity addict
// @description 15/12/2021, 17:56:23
// @license MIT 
// @downloadURL https://update.greasyfork.org/scripts/437110/olxpl%20dark%20mode.user.js
// @updateURL https://update.greasyfork.org/scripts/437110/olxpl%20dark%20mode.meta.js
// ==/UserScript==
function add(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

add(".maincategories {background: #282a36};"); // main screen part background
add(".link {color: #f8f8f2 !important;}") //main page nav text color
add(".h1, h2, h3, h4, h5, h6 {color: #f8f8f2 !important;}") // text color for titles
add("#body-container {background-color: #282a36;}") // background 
add("#searchmain-container {background-color: #282a36;}") //back ground of search div
add(".gallerywide > li {background: #44475a;}") // color of reccomended on main page
add(".gallerywide .date-location {color: #f8f8f2;}") // location color
add(".gallerywide .price {color: #ffb86c;}") // price color
add("#searchbox {background: #282a36;}") // color of search box bg
add("table.offers.redesigned .offer .bottom-cell .breadcrumb span, table.offers.redesigned.userobserved-list .offer .bottom-cell .breadcrumb span, listHandler table.offers.redesigned .offer .bottom-cell .breadcrumb span {color: #f8f8f2;}")// location color and text
add("table.offers.redesigned .price strong, table.offers.redesigned.userobserved-list .price strong, listHandler table.offers.redesigned .price strong {color: #ffb86c;}") // price color
add(".olx-delivery-icon {background: url(https://i.imgur.com/UjcIiyD.png) 100% 50% no-repeat;}")
add("#locationLinks {background-color: #282a36 !important;}")
add("#categoryLinksHeader {background-color: #282a36 !important;}")
add("#footer-container {background-color: #282a36 !important;}")
add(".link.gray > * {color: #f8f8f2 !important;}")
add(".popular-searches {background-color: #282a36 !important;}")
add("#categoryLinksSuggestions {color: #f8f8f2;}")
add("#listContainer {background-color: #282a36;}")
add(".offersview div.section p {color: #f8f8f2;}")
add("form.search .paramsList__title {color: #f8f8f2 !important;}")
add(".filter-headline {color: #f8f8f2;}")
add("ul.tabs .tab.selected {color: #50fa7b;}")
add("* {background-color: #282a36 !important; color: #f8f8f2 !important;}")
add(".swiper-pagination-bullets {background-color: transparent !important;}")
add("button {color: #f8f8f2 !important; background: transparent}")
add("p {color: #f8f8f2 !important;}")
add("h1 {color: #f8f8f2 !important;}")
//add(".offer-wrapper {background: #44475a !important;}") // item background search
//add("table {background: #44475a !important;}")
//add("tbody {background: #44475a !important;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
// add(".link {color: #f8f8f2;}")
