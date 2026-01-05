// ==UserScript==
// @name         Dark Sankaku Complex
// @namespace    none
// @version      0.201703162053
// @description  Will darken the idol and chan gallary sites of Sankaku Complex
// @author       mysteriousLynx
// @include      *://idol.sankakucomplex.com/*
// @include      *://chan.sankakucomplex.com/*
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/28171/Dark%20Sankaku%20Complex.user.js
// @updateURL https://update.greasyfork.org/scripts/28171/Dark%20Sankaku%20Complex.meta.js
// ==/UserScript==

GM_addStyle("/******************************************** * Made by mysteriousLynx * * Last updated on Wednesday, March 15, 2017 * ********************************************/ /* Main darkener */ body { background-color: #101010; color: white } /* Darkens other things like the tag editor, the status notices, filter menu, and makes the table readable */ table.form tfoot, table.form tbody tr td, table.form th, div.status-notice, #header, .flat-list, #news-ticker, ul.subnav, ul.subnav li:hover, div#advanced_search, table tbody tr:nth-child(even) { background: #101010 !important } table.form label, table.form p, table tbody tr { color: white } /* Darkens the navbar and it's subnavs and subnavbar */ div#header ul#navbar li.current-page { border-bottom: 1px solid #ffffff } ul.flat-list li { border: none } ul.subnav li { border: 1px solid #101010 !important } /* Removes those weird looking ads at the top of the page and adjusts the header height so that it doesn't mess up the page. */ div#headerthumbs { display: none } div#headerlogo { height: 144px } /* Changes the logo to be inverted */ div#headerlogo a img { height: 0 !important; width: 0 !important; padding-left: 392px !important; padding-top: 100px !important; margin-top: 16px; margin-left: 20px; background: url(https://i.imgur.com/PSy0Gb4.png) no-repeat !important } /* Removes ads */ div.content div div#sp1.scad-i { display: none } /* Changes crown to be darkened */ div#popular-preview, div.ranking-top-spot { background-image: url(http://i.imgur.com/mHneFyP.png) } /* Darkens favorite button */ #add-to-favs, #remove-from-favs { background-image: url(http://i.imgur.com/hdElu3C.png) } /* Darkens the rating stars */ .unit-rating, .unit-rating li, .unit-rating li a:hover { background-image: url(http://i.imgur.com/bBp6u4d.png) } ");
if ((new RegExp("https?:\/\/chan\.sankakucomplex\.com\/.*")).test(document.location.href))
    GM_addStyle("/* Fixes the chan side of sankaku complex */ /* Darkens areas which were not darkened */ html, div { background: #101010; color: white } /* Gets rid of the white margin which its color cannot be changed */ div#header { border-bottom: 11.1px solid #101010; margin: 0px } /* Fixes the set avatar page */ div#set-avatar.page, .imgCrop_dragArea, .imgCrop_selArea { background:none } ");