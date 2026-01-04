// ==UserScript==
// @name         SonicHackingContest Navbar Scroll
// @version      2024.10.02
// @description  Avoids navbar dropdown menus from being cut-off and inaccessible by adding scrolling.
// @author       Obsidian
// @namespace    https://greasyfork.org/en/users/318252-obsidian
// @include      /^https?://(www\.)?sonichacking\.org//
// @include      /^https?://(www\.)?shc\.zone//
// @match        http*://*.sonichacking.org/*
// @match        http*://*.shc.zone/*
// @exclude      /^https?://(www\.)?(shc\.zone|sonichacking\.org)/vault//
// @grant        none
// @run-at       document-end
// @icon         data:image/png;base64, iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAwUExURUdwTKfH4uzz+dfl8+70+nWn0hpqswpfrfD1+glfrXeo0v///wBbqxpstHCj0EWHwjcCEG0AAAALdFJOUwD49/Oay6syPmGDWhDOJgAABMNJREFUeNrtWtu2oyAMbUgVNRL+/28PoLa1AoRael7cD3NbM7O3uRO43S5cuHDhwoULFyQYhvsTw/Breq3oHQqdkN8pmEhZM3sYY6xlBlSrjB+p6AgXAU94IRBU3O8/UQBzDMYyBhHNLQHEcwKLiOYaMK3Ai/AacGicCmbOwQKRGpqmAuYVzIZVUwmpQHyT0NARkA2DTQLR/d/CYJEA7fwwlZ3gwYruzZxgJQraGWFUyswiI5C6N8oEFgmYDbZxg5aaILjhX00Q3DC0iAKQCpjtNxSEYQw93M/TpDWQESsw5/LRUavHBLb+Sikly8TToTgEcmC2ZvtiYywDFlvSVxQMSIRc8ak5BfVxcFek2MzfQb2CQRF+jT5EoqrzPdE36UM2VoSBo4fv0juA2AlDZYzLw0DIT/I628IJ9yafL3cCNvB+RSYMinhuBy6ZYCCyc0ugKvCrtvwz0z3Pb+bGyKXiL/hzqahVY/+XogB/wp9OBGiaf6+1ABP1D+bfIFEOFSEAsG0fhnM8DOExbwI0VgHpTJymCcLODVuKKNbjaerCKNwsKRJhuD/5TECkGvVF4Wg0dkhtWrN4OtTeDC0kSHywScDaBgmoFBZUA8nnY90pkhvBwHaK5LwPag4pI4iHRPtyo5AtrHWLG90J3WB3lxn8JR949LLN4NuNis0ORsvtT9g3lBfsA1K5VRl8v89Jizbvf3X4wkENDjdKGSdYtsaYbeHA2XF9kKWBOfATVrSH7OezrL4eYb4gQHpQixig4oiZzgrxQY1jAqRDliE4fVCDMwKAphS/uA/E+KVRaAn0LT4nivmjIUBKusccz/KfEgDUJeK/4qBgj+Y3s0Ehv46fFGsOCgcLhBUbi/ghwV+3qInGv+B2LcV/Q6obxTBWgYo1xCDF7e8MUHlShDf/L3OHKQ4wCf6bql0VcKQHmIIVmSjFP1UflU2kBXBeAJDqUy1A1e9K8DCImHwhAYIxfTVavyvgiAGOAszz3iPDX50Cu4nwxQAHAaxI8SZvSo/BHy0reN8Cw4jIB/5NlFFKn70aTkQBv+jhyLHBZBvAsi7DT/i3RDAv9oCjwrVGpgrgpyH40pHgpS7BgX+JECY15i7nPz0Q83outBiZSOB5WslVgE9D8CXK4nOxfQSIQcI++z4iE4LGWHawNrFDej8ewT5AeHnm0/X55xHR/9swAL49pYPIxRrv/xJY5kcCcBAI/Zg9C0c84MjVsjzrPPrwI4Q/i8SrsQygdn542B+py9NHPGAYiQgdbz+Oo35gHPu+S5f78OBv0x0MZkP2j+UHKjuzepcRePJY3uq+1LYeLWLhhyK/3r1MYCRKsi+rg9Lywj5nFAn/rgr51pFlX2xQqFu8roz8+FXmv3UPp670umSyvnR8h7A08+OXgP+G9Eo/askCBwpLsa34SfjXEGAk1Yn+wbJTVYSFSGBmkOzGQhWwVfTBDR0JXhsA0SCIQYtEVfTBCL4kEMSee7zIsuX785HUB/TeCE4CLPUZ2PoN1FKJYBei5T25/ox+dYQrjfDeDxGfa38reMbRf0q/GNCVZy9jg/9NWPsjMAOS6sufcf6hm28TK7ReA2SZhrpTX3fq6Vm/4L/4V8Po24ULFy5cuHDhQhp/KJVML/pyu60AAAAASUVORK5CYII=
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/416300/SonicHackingContest%20Navbar%20Scroll.user.js
// @updateURL https://update.greasyfork.org/scripts/416300/SonicHackingContest%20Navbar%20Scroll.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

(function(){
'use strict';

// Greasemonkey or Web Storage APIs:
//  To use Greasemonkey functions instead of localStorage, add @grant GM_getValue and @grant GM_setValue to
//  the Metadata block in place of @grant none.

// Using the synchronous GM_getValue or localStorage.getItem
if(typeof GM_getValue !== "function"){
  var GM_getValue;
  GM_getValue = function(aKey, aDefault){
    var val = null;
    try{
      val = localStorage.getItem(aKey, aDefault);
    }catch(e){}
    if(val === null && typeof aDefault != "undefined"){return aDefault;}
    return val;
  };
}

// Using the synchronous GM_setValue or localStorage.setItem
if(typeof GM_setValue !== "function"){
  var GM_setValue;
  GM_setValue = function(aKey, aVal){
    try{
      localStorage.setItem(aKey, aVal);
    }catch(e){}
  };
}

function GM_addStyle(aCss){
  var head = document.getElementsByTagName('head')[0];
  if(head){
    var style = document.createElement('style');
    style.setAttribute('type', 'text/css');
    style.textContent = aCss;
    head.appendChild(style);
    return style;
  }
  return null;
}

var strCss = `
@media (min-width: 992px) {
  .navbar-nav .dropdown-menu {
    max-height: calc(100vh - 100% - 2px);
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.38) rgba(32,32,32,0.35);
    overscroll-behavior: contain;
  }
  .navbar-dark .nav-link {
    height: 100%;
  }
}
/* mobile style (max-width: 991.999) */
@media not all and (min-width: 992px) {
  .navbar-collapse {
    padding-top: 0.7px;
  }
  .navbar-collapse .navbar-nav {
    max-height: calc(100vh - 52px);
    overflow-y: auto;
    scrollbar-width: thin;
    scrollbar-color: rgba(255,255,255,0.38) rgba(32,32,32,0.35);
    overscroll-behavior: contain;
    min-width: 24em;
    max-width: 100vw;
    width: -moz-max-content;
    width: max-content;
  }
  .navbar {
    max-height: 50.6px;
    /*max-height: calc(3rem + 2px);*/
  }
  #entry_banner_image {
    width: 100%;
    max-width: 352px;
  }
  .shc-news-body iframe {
    max-width: 100%;
    max-height: calc((100vw - 4rem - 2px) * 0.5625); /* assume this is a 16x9 video */
  }
  .shc-news-body img {
    max-width: 100%;
    height: auto;
  }
}
/* constrain size of news post avatars on narrow screens */
@media only screen and (max-width: 480px) {
  .shc-news-header h2 {
    margin-right: 0px !important;
    font-size: 1.5rem;
  }
  .shc-news-header h2 a {
    font-size: 1.5rem;
  }
  .shc-news-header img {
    top: auto;
    bottom: -0.5em;
    right: 0.4rem;
    height: auto !important;
    width: 64px;
    width: 4.1rem;
  }
  /* trick for padding end of last-line */
  .shc-news-header h2::after {
    content: "\\00a0";
    display: inline;
    visibility: hidden;
    margin-left: -0.25em;
    padding-right: 58px;
    padding-right: calc(3.7rem - 1px);
  }
}
/* avoid entry list items from overflowing screen */
.shc-entry-list-item.m-4 {
  max-width: calc(100% - 3rem);
}
@media only screen and (max-width: 414px) {
  .shc-entry-list-item.m-4 {
    margin-left: auto !important;
    margin-right: auto !important;
    max-width: 100%;
  }
}
/* styles for all */
.navbar-nav > .nav-divider {
  flex-shrink: 0;
}
.navbar-nav > .nav-divider:first-child {
  display: none;
}
.navbar-backdrop {
  top: 50.4px !important;
  /*top: calc(3rem + 1px) !important;*/
}
.container-fluid #shc_schedule th {
  border-bottom: 1px solid #e3e3e3;  /*rgba(255,255,255,.75)*/
  border-right: 1px solid #e3e3e3;   /*rgba(255,255,255,.75)*/
}
:root {
  --shc-tails-light: #edd090;
  --shc-knuckles-light: #e0c0c6;
}
.bg-shc-tails-light {
  background-color: #edd090 !important;
  background-color: var(--shc-tails-light, #edd090) !important;
}
.bg-shc-knuckles-light {
  background-color: #e0c0c6 !important;
  background-color: var(--shc-knuckles-light, #e0c0c6) !important;
}
/* tint contest logo image */
.bg-shc-tails-light img.d-block.ml-auto.mr-auto.mb-3 {
  filter: hue-rotate(calc(39deg - 207deg)) brightness(1.6);
}
.bg-shc-knuckles-light img.d-block.ml-auto.mr-auto.mb-3 {
  filter: hue-rotate(calc(349deg - 207deg)) contrast(1.08);
}

.btn-shc-tails0:not(.btn-shc-grey) {
  color: #fff;
  background-color: #e08000;
  border-color: #e08000;
}
.btn-shc-tails0:not(.btn-shc-grey):hover {
  color: #fff;
  background-color: #ba6a00;
  border-color: #ad6300;
}
.btn-shc-tails0:not(.btn-shc-grey):not(:disabled):not(.disabled).active, .btn-shc-tails0:not(.btn-shc-grey):not(:disabled):not(.disabled):active, .show>.btn-shc-tails0.dropdown-toggle {
  color: #fff;
  background-color: #ad6300;
  border-color: #a05c00;
}
.btn-shc-tails0:not(.btn-shc-grey).disabled, .btn-shc-tails0:not(.btn-shc-grey):disabled {
  color: #fff;
  background-color: #e08000;
  border-color: #e08000;
}
.btn-shc-knuckles0:not(.btn-shc-grey) {
  color: #fff;
  background-color: #c00020;
  border-color: #c00020;
}
.btn-shc-knuckles0:not(.btn-shc-grey):hover {
  color: #fff;
  background-color: #9a001a;
  border-color: #8d0018;
}
.btn-shc-knuckles0:not(.btn-shc-grey):not(:disabled):not(.disabled).active, .btn-shc-knuckles0:not(.btn-shc-grey):not(:disabled):not(.disabled):active, .show>.btn-shc-knuckles0.dropdown-toggle {
  color: #fff;
  background-color: #8d0018;
  border-color: #800015;
}
.btn-shc-knuckles0:not(.btn-shc-grey).disabled, .btn-shc-knuckles0:not(.btn-shc-grey):disabled {
  color: #fff;
  background-color: #c00020;
  border-color: #c00020;
}

/* non-standard thin scrollbar style */
.navbar-nav .dropdown-menu::-webkit-scrollbar,
.navbar-collapse .navbar-nav::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.navbar-nav .dropdown-menu::-webkit-scrollbar-track,
.navbar-collapse .navbar-nav::-webkit-scrollbar-track {
  background: rgba(32,32,32,0.35);
}
.navbar-nav .dropdown-menu::-webkit-scrollbar-track {
  margin: 0 1px 1px 1px; /* push away from menu border */
}
.navbar-nav .dropdown-menu::-webkit-scrollbar-thumb,
.navbar-collapse .navbar-nav::-webkit-scrollbar-thumb {
  background: transparent linear-gradient(to right, rgba(248,248,248,0.35) 0%, rgba(248,248,248,0.35) 100%) 1.1px 0px/6.2px repeat-y;
}
.navbar-nav .dropdown-menu::-webkit-scrollbar-thumb:hover,
.navbar-collapse .navbar-nav::-webkit-scrollbar-thumb:hover {
  background-image: linear-gradient(to right, rgba(208,208,208,0.35) 0%, rgba(208,208,208,0.35) 100%);
}
.navbar-nav .dropdown-menu::-webkit-scrollbar-thumb:active,
.navbar-collapse .navbar-nav::-webkit-scrollbar-thumb:active {
  background-image: linear-gradient(to right, rgba(152,152,152,0.35) 0%, rgba(152,152,152,0.35) 100%);
}
.navbar-nav .dropdown-menu::-webkit-scrollbar-thumb:horizontal,
.navbar-collapse .navbar-nav::-webkit-scrollbar-thumb:horizontal {
  background-repeat: repeat-x;
  background-position: 0px 1.1px;
  background-size: auto 6.15px;
}
.navbar-nav .dropdown-menu::-webkit-scrollbar-corner,
.navbar-collapse .navbar-nav::-webkit-scrollbar-corner {
  background: transparent;
}`;

var strCssEx = `
/* EXTRA custom theme: shc-blaze */
:root {
  --shc-blaze: #7053bc;
  --shc-blaze-light: #d6c4f0;
}
.bg-shc-blaze {
  background-color: var(--shc-blaze, #7053bc) !important;
}
.border-shc-blaze {
  border-color: var(--shc-blaze, #7053bc) !important;
}
.bg-shc-blaze-light {
  background-color: #d6c4f0 !important;
  background-color: var(--shc-blaze-light, #d6c4f0) !important;
}
.bg-shc-blaze-75 {
  background-color: rgba(102,72,175,0.75) !important;
}
.btn-shc-blaze:not(.btn-shc-grey) {
  color: #fff;
  background-color: var(--shc-blaze, #7053bc);
  border-color: var(--shc-blaze, #7053bc);
}
.btn-shc-blaze:not(.btn-shc-grey):hover {
  color: #fff;
  background-color: #553a92;
  border-color: #54329c;
}
.btn-shc-blaze:not(.btn-shc-grey):not(:disabled):not(.disabled).active,
.btn-shc-blaze:not(.btn-shc-grey):not(:disabled):not(.disabled):active,
.show > .btn-shc-blaze.dropdown-toggle {
  color: #fff;
  background-color: #4c367d;
  border-color: #492a80;
}
.btn-shc-blaze:not(.btn-shc-grey).disabled, .btn-shc-blaze:disabled:not(.btn-shc-grey){
  color: #fff;
  background-color: var(--shc-blaze, #7053bc);
  border-color: var(--shc-blaze, #7053bc);
}
.bg-shc-blaze-light img.d-block.ml-auto.mr-auto.mb-3 {
  filter: hue-rotate(calc(260deg - 207deg)) brightness(1.14) saturate(0.6);
}
.bg-shc-blaze + .shc-entry-body, .bg-shc-blaze + .shc-news-body, .shc-entry-list-item .bg-shc-blaze + p {
  box-shadow: 0 4px 0 #d7b8f2 inset;
}
.shc-entry-body .bg-shc-blaze.shc-entry-banner, .bg-shc-blaze.shc-news-header img {
  box-shadow: 0 4px 0 #d7b8f2;
}


/* EXTRA custom theme: shc-amy */
:root {
  --shc-amy: #c84489;
  --shc-amy-light: #f0c4e1;
}
.bg-shc-amy {
  background-color: var(--shc-amy, #c84489) !important;
}
.border-shc-amy {
  border-color: var(--shc-amy, #c84489) !important;
}
.bg-shc-amy-light {
  background-color: #f0c4e1 !important;
  background-color: var(--shc-amy-light, #f0c4e1) !important;
}
.bg-shc-amy-75 {
  background-color: rgba(174,72,120,0.75) !important;
}
.btn-shc-amy:not(.btn-shc-grey) {
  color: #fff;
  background-color: var(--shc-amy, #c84489);
  border-color: var(--shc-amy, #c84489);
}
.btn-shc-amy:not(.btn-shc-grey):hover {
  color: #fff;
  background-color: #9a426f;
  border-color: #943a62;
}
.btn-shc-amy:not(.btn-shc-grey):not(:disabled):not(.disabled).active,
.btn-shc-amy:not(.btn-shc-grey):not(:disabled):not(.disabled):active,
.show > .btn-shc-amy.dropdown-toggle {
  color: #fff;
  background-color: #8d3e61;
  border-color: #873258;
}
.btn-shc-amy:not(.btn-shc-grey).disabled, .btn-shc-amy:disabled:not(.btn-shc-grey){
  color: #fff;
  background-color: var(--shc-amy, #c84489);
  border-color: var(--shc-amy, #c84489);
}
.bg-shc-amy-light img.d-block.ml-auto.mr-auto.mb-3 {
  filter: hue-rotate(112deg) brightness(1.1) saturate(0.95) contrast(0.9);
}
.bg-shc-amy + .shc-entry-body, .bg-shc-amy + .shc-news-body, .shc-entry-list-item .bg-shc-amy + p {
  box-shadow: 0 4px 0 #e3c1e6 inset;
}
.shc-entry-body .bg-shc-amy.shc-entry-banner, .bg-shc-amy.shc-news-header img {
  box-shadow: 0 4px 0 #e3c1e6;
}
.dropdown > .bg-shc-amy.dropdown-menu, .dropup > .bg-shc-amy.dropdown-menu, .navbar-collapse .bg-shc-amy.navbar-nav {
  scrollbar-color: rgba(255,175,235,0.68) rgba(42,32,42,0.45);
}
.bg-shc-amy-light.schedule-expanded #shc_schedule-wrapper {
  scrollbar-color: rgba(255,175,235,0.68) rgba(42,32,42,0.45) !important;
}

.bg-shc-amy-light .navbar-nav .dropdown-menu::-webkit-scrollbar-track,
.bg-shc-amy-light .navbar-collapse .navbar-nav::-webkit-scrollbar-track {
  background: rgba(42,32,38,0.35);
}
.bg-shc-amy-light .navbar-nav .dropdown-menu::-webkit-scrollbar-thumb,
.bg-shc-amy-light .navbar-collapse .navbar-nav::-webkit-scrollbar-thumb {
  background: transparent linear-gradient(to right, rgba(255,208,220,0.45) 0%, rgba(255,208,220,0.45) 100%) 1.1px 0px/6.2px repeat-y;
}
.bg-shc-amy-light .navbar-nav .dropdown-menu::-webkit-scrollbar-thumb:hover,
.bg-shc-amy-light .navbar-collapse .navbar-nav::-webkit-scrollbar-thumb:hover {
  background-image: linear-gradient(to right, rgba(218,208,210,0.35) 0%, rgba(218,208,210,0.35) 100%);
}
.bg-shc-amy-light .navbar-nav .dropdown-menu::-webkit-scrollbar-thumb:active,
.bg-shc-amy-light .navbar-collapse .navbar-nav::-webkit-scrollbar-thumb:active {
  background-image: linear-gradient(to right, rgba(162,152,158,0.35) 0%, rgba(162,152,158,0.35) 100%);
}


/* EXTRA custom dark theme: shc-shadow */
:root {
  --shc-shadow: #940010;
  --shc-shadow-dark: #0d0f12;
}
body.bg-shc-shadow-light {
  /* dark rather, but named light for convenience sake */
  /* bg-shc-shadow-light reused to also signify dark theme, instead of better class like theme-dark */
  color: #f0f8f3;
  background-color: #0d0f12 !important;
  background-color: var(--shc-shadow-dark, #0d0f12) !important;
  background-blend-mode: soft-light;
}
body.bg-shc-shadow-light .modal {
  color: #212529;
}
.bg-shc-shadow-75 {
  background-color: rgba(148,6,8,0.75) !important;
}
.bg-shc-shadow {
  background-color: var(--shc-shadow, #940010) !important;
}
.border-shc-shadow {
  border-color: var(--shc-shadow, #940010) !important;
}
.bg-shc-shadow-light a:not(.btn):not(.navbar-brand) {
  color: #03a9f4;
}
.bg-shc-shadow-light a:not(.btn):not(.navbar-brand):hover {
  color: #00709f;
}
/* tiny fix to avoid muted text */
.bg-shc-shadow-light .container-fluid > div.bg-white.text-black {
  color: #fff !important;
  background-color: #1f2327 !important;
}
/* dark:entries */
.bg-shc-shadow-light .shc-news-body,
.bg-shc-shadow-light .shc-entry-body,
.bg-shc-shadow-light .shc-entry-list-item p {
  color: #fff !important;
  background-color: #1f2327 !important;
  border-color: #383e3e !important;
  box-shadow: inset 0 4px 0 #2f3236;
}
.bg-shc-shadow-light .border-shc-grey {
  border-color: #383e3e !important;
}
.bg-shc-shadow-light .shc-news-header img,
.bg-shc-shadow-light .shc-entry-body .shc-entry-banner {
  box-shadow: 0 4px 0 #2f3236;
}
.bg-shc-shadow-light .bg-shc-shadow + .shc-news-body,
.bg-shc-shadow-light .bg-shc-shadow + .shc-entry-body,
.bg-shc-shadow-light .shc-entry-list-item .bg-shc-shadow + p {
  box-shadow: inset 0 4px 0 #121618;
}
.bg-shc-shadow-light .bg-shc-shadow.shc-news-header img,
.bg-shc-shadow-light .bg-shc-shadow + .shc-entry-body .shc-entry-banner {
  box-shadow: 0 4px 0 #121618;
}
/* dark:comments */
.bg-shc-shadow-light .shc-comment-body {
  background-color: #23292e !important;
  border-color: #424848 !important;
  border-bottom-color: #383e3e !important;
}
.bg-shc-shadow-light .shc-comment-body, .bg-shc-shadow-light .shc-comment-reply > div:first-child {
  box-shadow: inset 0 -4px 0 #0f1418;
}
.bg-shc-shadow-light .shc-comment-body::before {
  background: linear-gradient(45deg,#22282d 0%,#22282d 55%,transparent 55.1%,transparent 100%) transparent;
  border-left-color: #626868;
  border-bottom-color: #525858;
  margin-left: 0.2px;
}
.bg-shc-shadow-light .shc-comment-avatar {
  filter: drop-shadow(0px 0px 1px #fff);
}
/* dark:schedule */
.bg-shc-shadow-light #shc_schedule th {
  border-color: var(--shc-shadow-dark, #101010);
}
.bg-shc-shadow-light #shc_schedule td {
  background-color: #16191e;
}
.bg-shc-shadow-light #shc_schedule td.now a::after {
  border-width: 2px;
  border-style: solid;
  background-color: rgba(255, 255, 255, 0.5);
  box-shadow: 0 0 8px rgba(255, 255, 255, 0.5);
}
.bg-shc-shadow-light #shc_schedule td.now {
  background-color: #42484d;
}
/* shadow:buttons */
.btn-shc-shadow:not(.btn-shc-grey) {
  color: #fff;
  background-color: var(--shc-shadow, #940010);
  border-color: var(--shc-shadow, #940010);
}
.btn-shc-shadow:not(.btn-shc-grey):hover {
  color: #fff;
  background-color: #72080a;
  border-color: #760c0e;
}
.btn-shc-shadow:not(.btn-shc-grey):not(:disabled):not(.disabled).active,
.btn-shc-shadow:not(.btn-shc-grey):not(:disabled):not(.disabled):active,
.show > .btn-shc-shadow.dropdown-toggle {
  color: #fff;
  background-color: #680608;
  border-color: #6c0a0c;
}
.btn-shc-shadow:not(.btn-shc-grey).disabled, .btn-shc-shadow:disabled:not(.btn-shc-grey){
  color: #fff;
  background-color: var(--shc-shadow, #940010);
  border-color: var(--shc-shadow, #940010);
}
.bg-shc-shadow-light .shc-entry-body .btn-shc-grey {
  color: #fff;
  background-color: #3e4449;
  border-color: #3e4449;
}
.bg-shc-shadow-light .shc-entry-body .btn-shc-grey:hover {
  color: #fff;
  background-color: #30363b;
  border-color: #343a3f;
}
.bg-shc-shadow-light .shc-entry-body .btn-shc-grey:not(:disabled):not(.disabled).active,
.bg-shc-shadow-light .shc-entry-body .btn-shc-grey:not(:disabled):not(.disabled):active {
  color: #fff;
  background-color: #2b3034;
  border-color: #2f3438;
}
/* shadow:menus (main red, dropdown black) */
.bg-shc-shadow.navbar-dark .navbar-nav.navbar-pills:not(.navbar-not-pills) .nav-link:focus,
.bg-shc-shadow.navbar-dark .navbar-nav.navbar-pills:not(.navbar-not-pills) .nav-link:hover {
  background-color: rgba(255,220,100,0.17);
}
.bg-shc-shadow.navbar-dark .navbar-nav.navbar-pills:not(.navbar-not-pills) .active > .nav-link,
.bg-shc-shadow.navbar-dark .navbar-nav.navbar-pills:not(.navbar-not-pills) .nav-link.active,
.bg-shc-shadow.navbar-dark .navbar-nav.navbar-pills:not(.navbar-not-pills) .nav-link.show,
.bg-shc-shadow.navbar-dark .navbar-nav.navbar-pills:not(.navbar-not-pills) .show > .nav-link {
  background-color: rgba(255,200,120,0.32);
}
.bg-shc-shadow .dropdown-dark .dropdown-header {
  background-color: var(--shc-shadow);
}
@media (min-width: 992px) {
  .dropdown > .bg-shc-shadow.dropdown-menu, .dropup > .bg-shc-shadow.dropdown-menu {
    background-color: #1c2024 !important;
    scrollbar-color: rgba(255,255,255,0.38) rgba(4,4,4,0.35);
  }
}
@media not all and (min-width: 992px) {
  .dropdown > .bg-shc-shadow.dropdown-menu, .dropup > .bg-shc-shadow.dropdown-menu {
    background-color: #1c2024 !important;
  }
}
.shc-gallery-thumbnail:not(.shc-gallery-thumbnail-active) {
  border-color: transparent !important;
}`;

var strCssSticky = `
/* schedule always visible headers */

body.schedule-expanded {
  overflow: hidden;
}
body.schedule-expanded::after {
  content: "";
  background: rgba(0,0,0,0.7);
  position: fixed;
  top:0;
  left:0;
  bottom:0;
  right: 0;
  width: 100%;
  height: 100%;
  z-index: 1048;
}

table#shc_schedule {
  border-width: 0px !important;
}
table#shc_schedule thead th:last-child {
  border-right: 1px solid var(--shc-sonic, transparent) !important;
}
table#shc_schedule tbody tr:last-child th:first-of-type {
  border-bottom: 1px solid var(--shc-sonic, transparent) !important;
}

/* column headers  */
.schedule-expanded #shc_schedule thead, .schedule-expanded #shc_schedule thead th {
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  z-index: 3;
}
/* row headers */
.schedule-expanded #shc_schedule tbody th:first-child {
  position: -webkit-sticky;
  position: sticky;
  left: 0;
  z-index: 2;
}
/* corner header */
.schedule-expanded #shc_schedule thead th:first-child {
  z-index: 4;
  position: -webkit-sticky;
  position: sticky;
  top: 0;
  left: 0;
}

/* grid on headers */
.schedule-expanded #shc_schedule tbody tr th:first-of-type::after,
.schedule-expanded #shc_schedule thead th::after {
  content: "";
  z-index: -1;
  position: absolute;
  height: calc(100% + 0.5px);
  width: calc(100% + 0.5px);
  top: 0;
  left: 0;
  border-right: 1.15px solid #f0f0f0;
  border-bottom: 1.15px solid #f0f0f0;
  background-color: var(--shc-sonic);
}
.schedule-expanded #shc_schedule tbody tr:last-child th:first-of-type::after {
  border-bottom: none;
}
.schedule-expanded #shc_schedule thead th:last-child::after {
  border-right: none;
}
.bg-shc-shadow-light #shc_schedule thead th::after,
.bg-shc-shadow-light #shc_schedule tbody tr th:first-of-type::after {
  border-color: var(--shc-shadow-dark, #101010);
}

body:not(.schedule-expanded) #shc_schedule-wrapper {
  position: relative;
  margin-left: -1rem;
  padding: 0 1rem;
  overflow: visible;
  scrollbar-width: thin;
}

.schedule-expanded #shc_schedule-wrapper {
  position: fixed;
  top: 0.65rem;
  bottom: 0.65rem;
  left: 0.5rem;
  right: 0.5rem;
  max-height: 100vh;
  max-width:  100vw;
  overflow: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.38) rgba(32,32,32,0.35);
  background-color: var(--shc-sonic);
  z-index: 1049;
}
`;

var strCssFilm = `
/* filmstrip effect */

.filmstrip {
  position: relative;
}
.filmstrip img {
  height: 96px !important;
  padding: 0 4px;
  box-sizing: border-box;
}
.filmstrip:before,
.filmstrip:after {
  content: "";
  position: absolute;
  top: calc(.5rem + 3.8px);
  height: calc(100% - 1rem - 7.8px);
  width: 14px;
  background-repeat: repeat-y;
  background-size: 100% 11px;
  background-position-y: -9px;
}
.filmstrip:before {
  background-image: linear-gradient(to bottom,
      #353535 6px,
      rgba(0,0,0,0) 7px),
    linear-gradient(to left,
      #353535 4px,
      #fff 4px,
      #fff 10px,
      #353535 10px);
  left: calc(.5rem + 4px);
}
.filmstrip:after {
  background-image: linear-gradient(to bottom,
      #353535 6px,
      rgba(0,0,0,0) 7px),
    linear-gradient(to right,
      #353535 4px,
      #fff 4px,
      #fff 10px,
      #353535 10px);
  right: calc(.5rem + 4px);
}`;

// Insert CSS styles
GM_addStyle(strCss + strCssEx + strCssFilm);
// Add background color to menus
var bgTheme = document.querySelector(".navbar").className.match(/(bg-shc-[a-z]+)|$/)[1] || "bg-shc-sonic";
[].forEach.call(document.querySelectorAll(".navbar .navbar-nav"), function(navnode){navnode.classList.add(bgTheme);});
// Trigger backdrop event when clicking empty menu area
[].forEach.call(document.querySelectorAll(".navbar .navbar-collapse"), function(navnode){
  navnode.addEventListener("click", function(event){if(event.target===navnode){document.querySelector(".navbar-backdrop").click();}});
});
// Reset menu scroll position back to top
[].forEach.call(document.querySelectorAll(".navbar .nav-link.dropdown-toggle"), function(ddnode){
  ddnode.addEventListener("click", function(){setTimeout(function(){ddnode.parentElement.querySelector(".dropdown-menu").scrollTop=0;},100);});
});
// Reset mobile-view menu scroll position back to top
[].forEach.call(document.querySelectorAll(".navbar-toggler"), function(hbnode){
  hbnode.addEventListener("click", function(event){
    var n = document.querySelector(event.currentTarget.dataset.target);
    setTimeout(function(){n.scrollTop=0; if(!!n.firstElementChild){n.firstElementChild.scrollTop=0;}},80);
  });
});


// Apply a filmstrip effect to GIF and youtube video thumbnails
var filmstrip = function(){
  var filmExp = new RegExp("(\\.gif\\'\\)$|youtube.*\\.com/embed/)");
  [].forEach.call(document.querySelectorAll(".shc-entry-gallery-choice .shc-gallery-item"), function(node){
    if(filmExp.test(node.querySelector(".shc-gallery-thumbnail").getAttribute("onclick"))){
      node.classList.toggle("filmstrip");
    }
  });
};
if(/\/entries\/(?:expo.+|contest.+)\/[0-9]+$/.test(location.pathname)){filmstrip();}


// Add toggle to expand stream schedule table and make the headers always visible
if(/^\/streams(\/)?$/.test(location.pathname)){
  GM_addStyle(strCssSticky);
  var tbl = document.getElementById("shc_schedule");
  if(tbl){
    var strExpandBtn = `<div data-toggle="button" class="btn btn-lg fa fas btn-shc-sonic fa-expand-arrows-alt p-2" style="min-width: 2.1rem; border: 1px solid #fff"></div>`;
    var wrapper = window.document.createElement("div");
    wrapper.setAttribute("id", "shc_schedule-wrapper");
    tbl.parentNode.insertBefore(wrapper, tbl);
    wrapper.appendChild(tbl);
    document.querySelector("#shc_schedule thead th:first-of-type").innerHTML = strExpandBtn;
    document.querySelector("#shc_schedule thead th:first-of-type .btn").addEventListener("click", function(event){
      if((' '+this.className+' ').indexOf(' active ') > -1){
        document.body.classList.remove('schedule-expanded');
        this.classList.remove('fa-compress-arrows-alt');
        this.classList.add('fa-expand-arrows-alt');
      }else{
        document.body.classList.add('schedule-expanded');
        this.classList.remove('fa-expand-arrows-alt');
        this.classList.add('fa-compress-arrows-alt');
      }
    }, false);
  }
}


// Periodically update highlight in stream schedule to be on current timeblock
function dynamicSchedule(){
  function getRow(table,index,rowStart){
    if(rowStart==null){rowStart=1;}
    return [].slice.call(table.rows[index].cells, rowStart);
  }
  function getColumn(table,index,colStart){
    if(colStart==null){colStart=1;}
    return [].slice.call(table.rows, colStart).map(function(a){return a.cells[index];});
  }
  function cellFromIndex(table,indexPair){
    var rowIndex = indexPair[0];
    var colIndex = indexPair[1];
    return table.rows[rowIndex].cells[colIndex];
  }
  var dateReg = new RegExp("(\\w+)\\s(\\d+).*\\s(\\w+)");
  var schedTable = document.querySelector("#shc_schedule");
  if(!schedTable){return;}
  var schedTopHdrs = getRow(schedTable,0,1);
  var schedSideHdrs = getColumn(schedTable,0,1);
  var dateNow = new Date();
  var year = dateNow.getFullYear();
  
  for(var i=0;i<schedTopHdrs.length;i++){
    var res = schedTopHdrs[i].textContent.match(dateReg);
    schedTopHdrs[i].dataset.date = Date.UTC(year, new Date(res[3]+" 1, 2020").getMonth(),res[2],(1*schedSideHdrs[0].dataset.hour)+7);
  }
  
  var dateNext = new Date();
  dateNext.setUTCHours(dateNext.getUTCHours()+1,0,0,80); // next check at the top of the hour
  var timeDiff = (dateNext.getTime() - dateNow.getTime());
  
  var schedTimer = setTimeout(updateSelCell, timeDiff);
  
  function updateSelCell(){
    var dateHere = new Date();
    var column = -1, row = -1, sel = null;
    for(var i=0;i<schedTopHdrs.length;i++){
      if(dateHere.getTime()>=1*schedTopHdrs[i].dataset.date && dateHere.getTime()<1*schedTopHdrs[i].dataset.date+86400000){
        column = i+1;
        for(var j=0;j<schedSideHdrs.length;j++){
          var hour = ((dateHere.getUTCHours()-7) + 24) % 24;
          if(hour==1*schedSideHdrs[j].dataset.hour){
            row = j+1;
            break;
          }
        }
        break;
      }
    }
    if(row>=0 && column>=0){
      sel = schedTable.querySelector("td.now");
      if(sel){sel.classList.remove("now");}
      sel = cellFromIndex(schedTable, [row,column]);
      sel.classList.add("now");
      console.log("Schedule selection updated \n"+ dateHere.toISOString());
      console.log("row: "+row+" column: "+column);
    }else{
      sel = schedTable.querySelector("td.now");
      if(sel){sel.classList.remove("now");}
    }
    dateNext = new Date();
    dateNext.setUTCHours(dateNext.getUTCHours()+1,0,0,0);
    timeDiff = (dateNext.getTime() - dateHere.getTime());
  
    schedTimer = setTimeout(updateSelCell, timeDiff);
  }
}
if(/^\/streams(\/)?$/.test(location.pathname)){dynamicSchedule();}


// BONUS: Switching Color Themes

// Function for applying a theme
var cycleThemes = function(newTheme){
  var themes = ["shc-sonic","shc-tails","shc-knuckles"];
  var theme = document.querySelector(".navbar").className.match(/bg-(shc-[a-z]+)(?!\S)|$/)[1];
  var themeIndex = themes.indexOf(theme);
  var themeNext = newTheme || themes[(themeIndex+1)%themes.length];
  if(!theme){theme = themes[0];}
  var themeBtn = theme + ((/^shc-(?:tails|knuckles)$/.test(theme)) ? "0":"");
  var themeBtnNext = themeNext + ((/^shc-(?:tails|knuckles)$/.test(themeNext)) ? "0":"");
  if(theme===themeNext || !(/^shc-[a-z]+$/).test(themeNext)){return theme;}
  var themeExp1 = new RegExp("(bg-|border-)("+theme+")","g");
  var themeExp2 = new RegExp("(btn-)("+themeBtn+")","g");
  [].forEach.call(document.querySelectorAll(".bg-"+theme+", .border-"+theme+", .btn-"+themeBtn), function(node){
    node.className = node.className.replace(themeExp1, "$1"+themeNext).replace(themeExp2, "$1"+themeBtnNext);
    if(node.classList.contains("btn-shc-sonic")){
      node.classList.remove("btn-shc-sonic");
      node.classList.add("btn-"+themeBtnNext);
    }
  });
  [].forEach.call(document.querySelectorAll(".shc-entry-body .btn-shc-grey"), function(node){
    node.classList.add("btn-"+themeNext);
  });
  if(!!window.hapi_c){window.hapi_c.MODAL_THEME = window.hapi_c.MODAL_THEME.replace(/bg-shc-[a-z]+/, "bg-"+themeNext);}

  // Some elements (footer, schedule, shc-entry-tags) are using CSS Var for color rather than class name.
  // Modify CSS Var "--shc-sonic" to match new theme:
  var cloneCssVar = function(fromVar, toVar, newOnly){
    if(!!getComputedStyle(document.documentElement).getPropertyValue("--"+fromVar)){
      if(!newOnly || !getComputedStyle(document.documentElement).getPropertyValue("--"+toVar)){
        document.documentElement.style.setProperty("--"+toVar, getComputedStyle(document.documentElement).getPropertyValue("--"+fromVar));
        return true;
      }
    }
    return false;
  };
  cloneCssVar("shc-sonic","shc-sonic-backup",true);
  if(themeNext==="shc-sonic"){
    cloneCssVar("shc-sonic-backup","shc-sonic");
  }else{
    cloneCssVar(themeNext,"shc-sonic");
  }

  // Set body background tint
  document.body.className = document.body.className.replace(/(?:^|\s)bg-(shc-[a-z]+)-light(?!\S)/g, "").replace(/^\s/, "");
  document.body.classList.add("bg-"+themeNext+"-light");

  return themeNext;
};
window.cycleThemes = cycleThemes;

// Insert a button for selecting theme
var strHtml = `<div id="theme-selector" class="dropup" style="position:absolute;display:inline-block;right:1em;margin-top:-2px;">
  <a id="theme-button" class="dropdown-toggle btn btn-shc-sonic" href="#" role="button" data-toggle="dropdown" style="display:block;padding:0 4px;font-size:1.1em;border:1px solid rgba(255,255,255,.4);">Theme</a>
  <ul role="menu" class="dropdown-menu dropdown-menu-right dropdown-pills dropdown-dark bg-shc-sonic" style="min-width:auto;">
    <li><a class="dropdown-item" role="menuitem" href="#" data-value="shc-sonic">SHC-Sonic</a></li>
    <li><a class="dropdown-item" role="menuitem" href="#" data-value="shc-tails">SHC-Tails</a></li>
    <li><a class="dropdown-item" role="menuitem" href="#" data-value="shc-knuckles">SHC-Knuckles</a></li>
    <li><a class="dropdown-item" role="menuitem" href="#" data-value="shc-amy">SHC-Amy</a></li>
    <li><a class="dropdown-item" role="menuitem" href="#" data-value="shc-blaze">SHC-Blaze</a></li>
    <li><a class="dropdown-item" role="menuitem" href="#" data-value="shc-shadow">SHC-Shadow</a></li>
  </ul>
</div>`;
var footer = document.getElementsByTagName("footer")[0];
footer.insertAdjacentHTML("afterbegin", strHtml);
[].forEach.call(footer.querySelectorAll("#theme-selector a.dropdown-item"), function(node){
  node.addEventListener("click", function(event){
    var res=cycleThemes(event.currentTarget.getAttribute("data-value")); event.preventDefault(); GM_setValue("GM_theme",res); return false;
  }, false);
});

// Restore last theme
var savedTheme = GM_getValue("GM_theme");
if(!!savedTheme){cycleThemes(savedTheme);}

})();