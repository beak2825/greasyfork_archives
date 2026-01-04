// ==UserScript==
// @name         Unity Asset Store - 96 Items Default
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  automatically switch to 96 items (new default from 24) on all store pages
// @include      https://assetstore.unity.com/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/6.18.2/babel.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/babel-polyfill/6.16.0/polyfill.js
// @author       drhouse
// @license      CC-BY-NC-SA-4.0
// @icon         https://www.google.com/s2/favicons?domain=assetstore.unity.com
// @downloadURL https://update.greasyfork.org/scripts/437284/Unity%20Asset%20Store%20-%2096%20Items%20Default.user.js
// @updateURL https://update.greasyfork.org/scripts/437284/Unity%20Asset%20Store%20-%2096%20Items%20Default.meta.js
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true);
var $ = window.$;
jQuery(function($){

    $("#main-layout-scroller > div > div._2e1KM.-Xmiy > div:nth-child(2) > div > div > div > div > div:nth-child(2) > div._3MUQz._2yjoV._2gOgE._2pY0P._15jtN > div._3QbIX > div._3uUFj > div._3OCKh > div._2R7jo > div > div > div > div > div:nth-child(4)").click()
    $("#main-layout-scroller > div > div._2e1KM.-Xmiy > div:nth-child(2) > div > div._2wdXy > div > div > div > div.NvJBe > div:nth-child(2) > div > div.select-wrapper-v2 > div > div > div > div:nth-child(4)").click()

});