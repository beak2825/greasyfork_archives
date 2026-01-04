// ==UserScript==
// @name         Kitsu Nightmode
// @namespace    http://tampermonkey.net/
// @version      0.4.1a
// @description  DarkMode for Kitsu
// @author       AnzoDK (Kitsu.io/users/AnzoDK)
// @match        https://kitsu.io/
// @include      https://kitsu.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/372084/Kitsu%20Nightmode.user.js
// @updateURL https://update.greasyfork.org/scripts/372084/Kitsu%20Nightmode.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = function () {
        var css = '#ember8{background-color:#1a1a1a!important;}.feed-aside > div:nth-child(1) > ul:nth-child(1) > li{background-color:#262626!important;border-color: black;}.stream-item--title-block{background-color:#262626;}.text-xs-center{background-color:#262626;}.stream-item{background-color:#262626!important;}{background-color:#262626!important;}#ember392 > div:nth-child(1) > div:nth-child(1){background-color:#262626!important;}.form-control {background-color:#262626!important;}.add-content-header{background-color:#262626!important;border-color: background-color:#262626!important;;}.stream-add-content{background-color:#262626!important;}.stream-item-comments{background-color:#262626;}.comment-box{background-color:#262626;}.comment-box-row{}.user-blotter{background-color: #262626;}.timeline-link.active{background-color:black!important;}.gate--hover{background-color: #262626;}.gate--label{background-color: #262626;}.nsfw-gate{background-color: #262626!important;}.stream-content{background-color: #262626!important;}.media-tag-synopsis{background-color: #262626!important;}.tagged-media{background-color: #262626!important;border-color:#262626!important;}p{color:#595858!important;}.media{background-color: #262626!important}.add-comment{border-color: #262626!important}div.spoiler-gate a{background-color:#262626!important;border-color:#262626!important;}.stream-content-editor{background-color:#262626!important;}.dismiss-blotter{background-color:#262626!important;}body{background-color:#262626!important;}.embed-info{background-color:#262626!important;}.comment-actions{background-color:#262626!important;border-color:#404040!important;}.stream-item-comments li{border-color:#404040!important;}.stream-item-comments{border-color:#404040!important;}.cover-nav navbar{background-color:#262626!important;}.ember-power-select-selected-item{background-color:#262626!important;}.media-grid{background-color:#262626!important;}.card{background-color:#262626!important;}.nav-item.nav-link.active{background-color:black!important;}.ember-power-select-trigger{background-color:#262626!important;border-color:#404040!important;}.nav-item.nav-link{border-color:#404040!important;}.cover-nav{background-color:#262626!important;}.nav-item.nav-link:hover{background-color:black!important;}.tag.tag-default{background-color:#404040!important;}.library-search-input{background-color:#262626!important;border-color:#404040!important;}'
var head = document.head || document.getElementsByTagName('head')[0],
    style = document.createElement('style');

style.type = 'text/css';
if (style.styleSheet){
  // This is required for IE8 and below.
  style.styleSheet.cssText = css;
} else {
  style.appendChild(document.createTextNode(css));
}

head.appendChild(style);
}
})();