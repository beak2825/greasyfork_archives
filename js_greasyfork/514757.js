// ==UserScript==
// @name         PaperTube
// @namespace    http://tampermonkey.net/
// @version      0.1.5
// @description  PaperTube is a Userscript that makes YT have a Material Design 1 Look. very much like early Polymer.
// @author       Zodah43
// @match        *://www.youtube.com/*
// @icon         https://i.imgur.com/btgevuz.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/514757/PaperTube.user.js
// @updateURL https://update.greasyfork.org/scripts/514757/PaperTube.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let container = document.querySelector("body");
    let newElem = document.createElement("div");
    newElem.id = "new-css";
    newElem.innerHTML = `
<style>
   .gaiabar {
   display: none;
   }
   #logo {
   background: no-repeat url(https://i.imgur.com/pD9PbKJ.png);
   }

   #appbar-nav .yt-uix-button.yt-uix-button-epic-nav-item{
   filter: opacity(0.5);
   }

   #yt-masthead-container {
   background: #e42626;
   border-bottom: none;
   height: 50px;
   margin: auto;
   padding-top: 3px;
   padding-bottom: 4px;
   }

   #masthead-search-terms{
   background: #fff;
   box-shadow: 0 2px 4px rgba(0,0,0,0.2);
   border-radius: 2px;
   }

   #masthead-search-terms-border{
   border: none;
   box-shadow: none;
   }

   .cardified-page #yt-masthead-container {
   background: #e42626;
   }

   .cardified-page #masthead-appbar-container {
   border-bottom: 0;
   background: #e42626;
   z-index: 1000000000000;
   box-shadow: 0 2px 4px rgba(0,0,0,0.2);
   }

   .cardified-page .yt-card {
   box-shadow: 0 2px 3px rgba(0,0,0,.2);
   }

   #guide-container .guide-item.guide-item-selected, #guide-container .guide-collection-item .guide-item.guide-item-selected, #guide-container .guide-item.guide-item-selected:hover{
   background-color: #f0f0f0;
   color: red;
   }

   #guide-container .guide-item.guide-item-selected{
   font-weight: 500;
   text-shadow: none;
   }


   .exp-top-guide .guide-item, .exp-top-guide .guide-view-more{
   height: 40px;
   }

   #appbar-nav .epic-nav-item-heading, #appbar-nav .yt-uix-button.yt-uix-button-epic-nav-item {
   font-size: 11px;
   text-transform: uppercase;
   color: #fff;
   }

   .yt-lockup-title a, .yt-lockup:hover a, .yt-lockup:hover .yt-lockup-meta a, .yt-lockup:hover .yt-lockup-description a {
   color: #333;
   font-weight: 200;
   }

   #yt-masthead-content {
   overflow: inherit;
   *zoom: 1;
   }

   .yt-lockup {
   color: #999;
   }

   .prominent-upload-button-styling #upload-btn {
   background-color: #fff;
   padding 0 11px;
   border-color: transparent;
   border-radius: 1px;
   box-shadow: 0 2px 4px rgba(0,0,0,.2);
   color: #333;
   text-transform: uppercase;
   }

   .prominent-upload-button-styling:hover #upload-btn:hover {
   background-color: #eee;
   }

   .yt-uix-button-icon-appbar-settings {
   background: no-repeat url(https://i.imgur.com/s7wcaF1.png) 0px 0px;
   background-size: auto;
   width: 10px;
   height: 10px;
   }

   #yt-masthead-content #masthead-upload-button-group, #yt-masthead-signin, #yt-masthead #upload-btn {
   float: right;
   margin-top: 3px;
   margin-left: 25px;
   padding: 0 11px;
   }

   .yt-uix-button-default, .yt-uix-button-default[disabled], .yt-uix-button-default[disabled]:hover, .yt-uix-button-default[disabled]:active, .yt-uix-button-default[disabled]:focus {
   border: none;
   background: transparent;
   color: #333;
   }

   .yt-uix-button-icon-wrapper {
   display: inline-block;
   }

   .run run-text {
   display: none;
   }

   .epic-nav-item.yt-uix-button-toggled, .epic-nav-item-heading {
   border-color: #fff;
   }

   .exp-guide-fusion-topbar #appbar-guide-menu{
   z-index: 888888;
   }

   #appbar-guide-menu {
   z-index: 1;
   padding: 0
   }

   #guide-module-content li {
   height: 32px;
   }

</style>
`;
    container.insertBefore(newElem, container.children[0]);
})();