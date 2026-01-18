// ==UserScript==
// @name         RomeoEnhancer-BETA
// @version      2.0.3.2
// @author       braveguy (Romeo: braveguy / Gruppe RomeoEnhancer)
// @description  Ergänzungen für die Romeo-Website
// @require      https://code.jquery.com/jquery-3.7.0.min.js
// @match        https://*.romeo.com/*
// @match        https://83.98.143.20/*
// @match        https://www.hunqz.com/*
// @run-at       document-body
// @grant        none
// @copyright    braveguy 12.10.2016 / 19.12.2025
// @namespace    https://greasyfork.org/users/139428
// @downloadURL https://update.greasyfork.org/scripts/430977/RomeoEnhancer-BETA.user.js
// @updateURL https://update.greasyfork.org/scripts/430977/RomeoEnhancer-BETA.meta.js
// ==/UserScript==

// @require      https://code.jquery.com/jquery-4.0.0-rc.1.min.js


/**
 * Copyright(c) braveguy (Romeo: braveguy / Gruppe RomeoEnhancer)
 *
 * Änderungen oder die Wiederverwendung von Code von RomeoEnhancer
 * erfordern meine ausdrückliche Zustimmung. Es ist nicht gestattet,
 * geänderte Versionen von RomeoEnhancer zu veröffentlichen.
 *
 * Das Skript wurde mit Tampermonkey in aktuellen Versionen von Safari, Chrome
 * und Firefox getestet. Dennoch geschieht die Benutzung auf eigenes Risiko.
 *
 * ** Datenschutz **
 * RomeoEnhancer enthält keinerlei Code, um Nutzer zu identifizieren
 * oder Daten auszuspähen. Es besteht keinerlei geschäftliches Interesse.
 *
 * Die aktuelle Version von RomeoEnhancer ist verfügbar unter:
 * https://greasyfork.org/scripts/31282-romeoenhancer
 *
 *
 * ****** English version *****
 *
 * Copyright(c) by braveguy (Romeo: braveguy / group RomeoEnhancer)
 *
 * Modifications and/or reuse of RomeoEnhancer code require my explicit consent.
 * You are NOT allowed to publish any changed version of RomeoEnhancer!
 *
 * All code has been tested with Tampermonkey in a recent Safari, Chrome,
 * and Firefox browser. However, the use of this script is at your own risk.
 *
 * ** Privacy **
 * RomeoEnhancer does NOT and never will include any code to identify you
 * or spy on your data. There is no commercial interest.
 *
 * The latest version of RomeoEnhancer is available on:
 * https://greasyfork.org/scripts/31282-romeoenhancer

*/


// ***** Use RE_addStyle instead of GM_addStyle to work with both Gear Browser and Userscripts *****
if (typeof RE_addStyle == 'undefined') {
  this.RE_addStyle = (aCss) => {
    'use strict';
    let head = document.querySelector('head');
    if (head) {
      let style = document.createElement('style');
      style.setAttribute('type', 'text/css');
      style.textContent = aCss;
      head.appendChild(style);
      return style;
    }
    return null;
  };
}


// ***** CSS *****

//background colors
let color = [];
switch (localStorage.getItem('REcolorScheme')) {
    case 'dark':  // Romeo default - Dark
        break;
    case 'lighterGrey':  // Lighter Grey
        color = ['#171717', '#1f1f1f', '#1f1f1f', '#000000', '#101010', '#1a1a1a', '#f0f0f0', '#cc2d2d', '#2a2a2a', '#2a2a2a'];
        break;
    case 'retroBlue':  // Retro Blue
        color = ['#102c54', '#102c54', '#102c54', '#000000', '#101010', '#122646', '#f0f0f0', '#f0f0f0', 'rgb(255,255,255,.08)', '#30415d'];
        break;
    case 'fineGrey':  // RE default - Fine Grey
    default:
        color = ['#000000', '#171717', '#1a1a1a', '#000000', '#101010', '#232323', '#f0f0f0', '#cc2d2d', '#2a2a2a', '#2a2a2a'];
}


RE_addStyle (

    //*** COLOR DESIGN ***

    //navigation, scrollbar
    `.layer-left-navigation nav, header.js-header, .locationPicker, .ui-navbar, .ui-navbar--app, .js-main-stage header, #cruise main > div, #cruise main > div > nav, #cruise main main, .js-nav-sidebar, .js-navigation nav, section.js-stream, .layer__container {background-color:${color[0]} !important}` +
    `html ::-webkit-scrollbar-track {background-color:rgb(0,0,0,.25)}` +
    // `html ::-webkit-scrollbar {display:none}` +

    //content
    `.js-main-stage, .stream__content, .re-stream-toggle-div, .layer__column--background, .js-social-lg > div > div, .layer__column--detail, #group-preview .layer__container {background-color:${color[1]} !important}` +
    `.filter-container {background-color:${color[2]} !important}` +
    `.listitem--selected > div {background-color:${color[9]} !important}` +
    `li[class^="stat-bar__item--"] {background-color:${color[2]}}` +
    `.listresult {background-color:${color[2]}}` +
    `.listresult:hover, :is(.js-chat, .js-contacts) .reactView > div:hover {background-color:${color[8]} !important}` +
    `.listresult .list-stat-bar__item, .icon-circular.icon-u {background-color:transparent}` +

    //list view
    `:is(.search-results--list-style > div, .grouped-tiles-list .refreshable) > div:nth-child(odd) .reactView > div {background-color:${color[5]}}` +
    `:is(.search-results--list-style > div, .grouped-tiles-list .refreshable) > div:nth-child(even) .reactView > div {background-color:${color[1]}}` +
    `:is(#cruise, #explore-grid, #eyecandy-results) li:nth-child(odd) > div {background-color:${color[5]} !important}` +
    `:is(#cruise, #explore-grid, #eyecandy-results) li:nth-child(even) > div {background-color:${color[1]} !important}` +

    //profile
    `.profile .below-fold {background-color:${color[1]} !important}` +
    `.profile-section header {background-color:${color[9]} !important}` +
    `.profile-section, .profile-section main, .js-profile-contact main div:last-child, .js-report section {background-color:${color[2]} !important}` +
    // `.js-profile-footprints section {background-color:${color[8]}}` +

    //messenger
    `#messenger header {background-color:${color[9]} !important}` +
    `.messages-list__content, .messages-send, #messenger .js-detail main, #messenger .js-detail main div:last-child {background-color:${color[2]}!important}` +
    `.messages-send__form-input {background-color:${color[3]}!important}` +

    //groups
    `section.js-main-stage .js-search > div > div > div {background-color:${color[1]} !important}` +
    `.js-wrapper section[class^="Section"], .js-wrapper div[class^="slider_wrapper-"]:before, .js-wrapper div[class^="slider_wrapper-"]:after {background-color:${color[1]} !important}` +
    `.re-groups-def button {background-color:${color[9]} !important}` +
    `:is(.js-post-edit, .js-post-list, #post, #group-post) textarea {background-color:${color[4]} !important}` +
    `.js-post-edit button[class*="ActionButton"] {background-color:${color[1]}}` +
    `.js-post-edit div[class*="Wrapper-"] {background-color:${color[5]} !important}` +
    `.js-post-list div[class^="Container"], :is(#group-post, #post) :is(.js-post, .js-post div[class^="Container"], div.js-comment) {background-color:${color[5]} !important}` +
    `section.js-main-stage div[class^="Grid-"] div[class*="Wrapper-"], section.js-main-stage div[class^="Grid-"] + div[class^="Wrapper-"] {background-color:${color[5]} !important}` +


    //*** OTHER ***

    //bigger text in messages, groups, profiles; wrap long links
    ':is(#messages-list div.reactView, :is(.js-post-list, .js-post, .js-profile-text, .js-description) div[class^="TruncateBlock__Content-"]) > p[class^="BaseText-sc-"],' +
    '.profile section.profile__stats details > div > p[class^="BaseText-sc-"],' +
    ':is(.stream__content, .js-chat, .js-correspondence, .js-contacts, .js-username, .WGgGs, .js-actions, #manage, .js-profile-reviews) [class^="BodyText-sc-"],' +
    '[class^="ResponsiveBodyText-"] {font-size:.9375rem !important; letter-spacing:normal !important; line-height:1.375 !important; word-break:break-word !important}' +

    //avatar icon
    ':is(.layer-left-navigation, header li) div[class^="OnlineStatus"] svg[viewBox="0 0 10 12"] {width:.75rem; height:.75rem}' +

    //icons, links
	'a.re-icon {font-size:.9em}' +
    ':is(div.LIST, .js-contacts, .js-username) a.re-icon {font-size:.825em}' +
    'a.re-idle, a.re-idle-no-hover, a.re-idle-no-hover:hover {color:inherit !important}' +
	':is(a.re-icon, a.re-idle):hover {color:rgb(102,215,255,.8) !important}' +
    'a.re-link, a.re-link-no-hover {color:#00bdff}' +
    // '[class*="hunqz"] a.re-link {color:#fc193c}' +
	'a.re-link-idle {color:unset !important}' +
    ':is(a.re-link, a.re-link-idle):hover {color:#66d7ff !important}' +
    '[class*="hunqz"] :is(a.re-link, a.re-link-idle, a.re-icon):hover {color:#fd5871 !important}' +

    //emoji zoom on hover
    'span[class^="formatEmoji__"]:hover, .listitem .emoji:hover {line-height:1; font-size:2em; margin:-.35em -.15em; display:inline-block}' +
    '.listitem .emoji {line-height:1; font-size:1.1em; margin:0; vertical-align:top}' +

    //tab menu
    '.js-main-stage header > nav > a {min-width:unset}' +
    '.js-main-stage header > nav {max-width:calc(100% - 18.5rem)}' +
    '.is-stream-opened .js-main-stage header > nav {max-width:unset}' +

    //top right menu
    '.js-top-right-navigation ul {scale:.975; width:17.5rem;left:calc(-17.5rem + 100vw); align-items:flex-end; padding-bottom:.33rem}' +
    '.js-top-right-navigation li {margin-right:1.25rem}' +
    '.js-top-right-navigation div.icon {font-size:1.2rem; line-height:1.5rem}' +

    //visitor icons
    'a.re-icon-visitor, a.re-icon-visited {font-size:1.1em; color:#fff}' +
    'a.re-icon-visited {transform:scaleX(-1)}' +

    //discover page
    ':is(a.re-eyecandy-toggle, a.re-eyecandy-toggle:hover) span {display:none; margin: 0 .25rem 0 .5rem; font-size:.875rem; color:rgb(255,255,255,1) !important; text-transform:none; font-family:Inter; font-weight:normal}' +
    'a.re-eyecandy-toggle.is-selected span:first-child, a.re-eyecandy-toggle:not(.is-selected) span:nth-child(2) {display:inline}' +
    'a.re-eyecandy-toggle svg {margin-bottom:.125rem}' +
    'a.re-eyecandy-toggle svg path {fill:currentcolor}' +

    //filter icon, bookmark name
    //'.re-filter-bookmark-name {position:absolute; right:0}' +
    '.is-filter-collapsed .re-filter-bookmark-name {display:none!important}' +
    '.is-filter-opened .re-filter-options-text, .is-filter-opened div.js-filter-button svg + span + span:not(.re-filter-bookmark-name) {display:none!important}' +

    //hide bookmark name in hunqz filter
    '.js-main-stage:has(.js-navigation a[href^="/hunqz"]) div.js-filter-header p {display:none !important}' +

    //expand truncated location names on hover
    '.typo-small.txt-truncate:hover {white-space:normal; word-break:break-all}' +

    //tiles
    ':is(div.BIG, div.SMALL, div.LIST) > div:first-child [class^="SpecialText"] {text-shadow:rgb(0,0,0,.5) 0 1px 1px, rgb(0,0,0,.5) 1px 1px 1px}' +
    ':is(div.BIG, div.SMALL) p[class^="SpecialText"] {word-break:break-word}' +
    ':is(div.BIG, div.SMALL) p[class^="SpecialText"]:hover {white-space:normal}' +
    'div.BIG span[class^="SpecialText"] {background-color:rgb(38,38,38)}' +
    '.re-nsfw-placeholder > div {background-color: rgb(31,31,31,.75) !important; background-image:none !important; backdrop-filter: blur(1px)}' +
    'section:has(.re-selected) :is(.BIG, .SMALL, .LIST) svg + p::before {content:"+"; font-size:.8125rem}' +
    // 'div[class^="Dropdown__ClickOutsideContainer"]:has(.re-selected) :is(.BIG, .SMALL, .LIST) svg + p::before {content:"+"; font-size:.8125rem}' +
    'div[class^="List-"]:has(.js-members-header):has(.re-selected) :is(.BIG, .SMALL, .LIST) svg + p::before {content:"+"; font-size:.8125rem}' +

    //FIX jumping fade in tiles during load
    'div.BIG::before, div.SMALL::before {inset:60% 0 0 !important}' +

    //tile TEST
    // ':is(div.BIG, div.SMALL, div.LIST) > div {display:none}' +
    // ':is(div.BIG, div.SMALL, div.LIST):hover > div:first-child {display:flex}' +
    // ':is(div.BIG, div.SMALL, div.LIST):hover > div:last-child {display:block}' +

    //list view
    // 'div:has(> .LIST) + div {margin-top:.5rem}' +
    // 'button:has(.LIST) {align-items:end}' +

    //messenger
    '.message:not(.message--sent) .message__content {background:hsla(0,0%,100%,.125)}' +
    '.message:not(.message--sent) .message__content:before {border-color: transparent transparent hsla(0,0%,100%,.125); left:-9px}' +
    '.message:not(.message--sent) .message__attachments {background-color:transparent}' +
    '.message__status {color:rgb(255,255,255,.5)!important}' +
    ':is(.js-chat, #manage) div[class^="OnlineStatus"] > div > svg {height:13px; width:13px}' +
    ':is(.js-chat, #manage) div[class^="OnlineStatus"] > div > svg[viewBox="0 0 10 12"] {height:15px; width:15px}' +
    'p[class*="OnlineStatus__TimeString"] {line-height:1}' +
    '.js-chat .js-scrollable {max-height:1270px !important}' +
    '.js-chat .typo-headline-small {font-size:inherit}' +
    '.fQIYNa {font-weight:550}' +
    '.online-favourites__item {margin:0 .475rem !important}' +
    '.online-favourites__itemName {width:4rem; margin:0 -.125rem}' +
    'section.emoji-mart button.emoji-mart-anchor:hover {color:rgb(255,255,255,.5)}' +
    '.js-chat p[class^="BodyText-sc-"] {opacity:.87; column-gap:.25rem}' +
    '.js-chat a[href^="/messenger"] > div > span {opacity:.87}' +
    '.js-chat a > span > span svg[viewBox="0 0 9 7"] {height:9px; width:11px; opacity:.66}' +
    '.js-chat a > span > span svg[viewBox="0 0 12 12"] {height:15px; width:15px}' +
    '#messenger .js-header-region header > h1 {padding-top:.8rem}' +
    '#messenger .js-header-region header > h1 a:has(span) {padding-bottom:.85rem}' +
    '#messenger .js-header-region .reactView > div > div > :is(div, a) {position:absolute; top:-1.2rem}' +
    '#messenger .re-login-location {position:absolute; top:0; width:100%}' +
    '#messenger .re-login-location > div {position:absolute; font-size:.75rem; font-weight:500; opacity:.8; background-color:transparent}' +
    '#messenger .re-msg-location {top:0; width:100%; padding:.25rem 0 0 3rem}' +
    '#messenger .re-msg-location a {padding-top:3px}' +
    '#messenger .re-msg-login {top:2.7rem; left:4rem; line-height:.85rem; min-width:10rem; padding-left:3rem; margin-right:5rem}' +
    '#messenger .re-msg-offline {top:2.7rem; left:3rem; line-height:.85rem}' +
    '.messages-send__form textarea.input--chat {padding-right:.5rem}' +
    '.js-contacts div > div > button > svg {height:21px; width:21px}' +
    'ul[class^="TagCloud__UnstyledList"] button {font-size:.875rem; line-height:1.25}' +
    ':is(.js-detail, .js-profile-contact) p[class^="ResponsiveBodyText-"] + :is(span, p) {font-size:.875rem !important; padding-bottom:.25rem}' +
    '.js-chat .listitem--selected {border-right:5px solid #fff}' +
    '.js-chat .refreshable .reactView {min-height:6rem}' +
    '.js-contacts .listitem--selected > div {border-left:5px solid #fff}' +

    //cruise

    //stream
    'div.stream__content {top:calc(5.25rem + 1px)}' +
    'div.stream__content div.tile {margin:0}' +
    'div.stream__content div.tile div[class^="OnlineStatus"] {position:absolute; left:-8px; top:-8px}' +
    'div.stream__content div.tile div[class^="OnlineStatus"] > div {display:flex; justify-content:center; align-items:center; background-color:#1f1f1f; border-radius:50%; height:20px; width:20px; margin-top:0!important}' +
    'div.stream__content div.tile div[class^="OnlineStatus"] svg {height:12px; width:12px}' +
    'div.stream__content div.tile div[class^="OnlineStatus"] svg:has(path[d^="M7.463"]) {height:14px; width:14px; margin-top:2px}' +
    '.stream__content .listitem {min-height:4.8rem}' +
    'div.stream__content .re-group-item:has(path[d^="M8.039"]) {display:none}' +

    //stream toggle
    '.re-stream-toggle-div {position:absolute; top:3.5rem; width:100%; padding:0 1rem; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #2e2e2e}' +
    ':is(a.re-stream-toggle, a.re-stream-toggle:hover) span {display:none; margin-right:.25rem; font-size:.875rem; color:rgb(255,255,255,.875); font-family:Inter; font-weight:normal}' +
    'a.re-stream-toggle.re-selected span:first-child, a.re-stream-toggle:not(.re-selected) span:nth-child(2) {display:inline}' +
    'a.re-stream-toggle svg {margin-bottom:.125rem}' +
    'a.re-stream-toggle svg path {fill:currentcolor}' +
    '.stream__content .re-group-item {display:none}' +
    '.stream__content.re-selected .re-group-item {display:flex}' +

	//profile view
    '.re-hide-visit, .re-profile-new {position:absolute !important; top:.5rem; left:3rem; font-size:1rem; font-weight:500; font-family:Inter; color:transparent}' +
    '.re-hide-visit {z-index:2}' +
    '.re-profile-new span {color:rgb(0 209 0); background-color:rgb(46 46 46); margin-left:1.75rem; padding:0 .25rem; border-radius:.25rem; font-size:.875rem}' +
    '.profile__info p {word-break:break-word}' +
    '.profile div[aria-label] > div[role="figure"] {border-color:rgb(255,255,255,.33)}' +
    '.profile .re-profile-stats {font-size:.825rem; color:rgb(255 255 255/.6)}' +
    '.re-img-count {position:absolute; bottom:0; left:0; padding:.5rem}' +
    '.re-img-count div {color:rgb(255 255 255/.87); background-color:rgb(18 18 18); border-radius:.125rem; padding:0 .25rem; height:1.125rem; line-height:1rem}' +
    '.js-profile-footprints main {overflow-x:hidden}' +
    // '.js-profile-footprints header {grid-template-columns:2.5rem auto 3rem}' +
    // '.js-profile-footprints h1 a {font-size:1rem !important}' +
    // '.js-profile-footprints section:last-child {padding-top:7.5rem}' +
    // '.js-profile-footprints section + section:last-child {padding-top:0}' +
    // '.js-profile-footprints.re-zoom section:last-child {grid-template-columns:repeat(3,33%)}' +
    // '.js-profile-footprints.re-zoom section:last-child button {background-size:72px 72px; height:77px; width:72px; border-bottom-width:5px}' +
    // '.js-profile-footprints.re-zoom section:last-child label p {max-width:14ch}' +

    //media viewer
    '.ReactModal__Content ul:has(img[src^="/img/usr/original/"]) {padding-bottom:2rem}' +
    '.ReactModal__Content li:has(img[src^="/img/usr/original/"]) {max-height:85vh; min-height:unset; padding-bottom:2rem !important}' +
    '.ReactModal__Content li:has(img[src^="/img/usr/original/"]) svg:has(path[d^="M17.939"], path[d^="m3.911"]) {transform:scale(75%)}' +
    // '.ReactModal__Content li:has(img[src^="/img/usr/original/"]) button:has(path[d^="M17.939"], path[d^="m3.911"]) {position:relative; top:.375rem}' +
    '.ReactModal__Content li:has(img[src^="/img/usr/original/"]) p {font-size:.875rem}' +
    '.re-img-info {position:absolute; bottom:.75rem; right:3rem; width:100%; display:flex; justify-content:end}' +
    '.re-img-single {bottom:1rem; right:0; justify-content:center}' +
    '.re-img-info a {font-size:.8125rem; color:rgb(255,255,255,.5); text-shadow:rgb(0,0,0,.32) 0 1px 1px, rgb(0,0,0,.42) 1px 1px 1px; cursor:default; z-index:2}' +
    '.ReactModal__Content li:has(img[src^="/img/usr/original/"]) > div:has(path[d^="M17.939"], path[d^="m3.911"]) {background-image:linear-gradient(rgb(0,0,0,0) 10%, rgb(0,0,0,.66) 63%, rgb(0,0,0,.88) 90%)}' +
    '.ReactModal__Content li img[src^="/img/usr/original/"] {position:relative; object-fit:contain; cursor:pointer}' +

    //group tiles
    'div[class*="Tile__BaseTile-"] > p + div {position:absolute; bottom:2rem; left:.475rem}' +
    'div[class*="Tile__BaseTile-"] > p + div > p {background-color:#121212 !important}' +
    'div[class*="Tile__BaseTile-"] > p {margin:0 0 -.125rem}' +
    '.profile div[class*="Tile__BaseTile-"] > p {margin:0; font-size:.925rem}' +
    '.re-common-group p:last-child {color:#6ddc00}' +

	//groups
	'nav.re-groups-def, nav.re-groups-enh {position:relative; padding:0 1rem 1rem; height:calc(100% - 3rem); overflow-y:auto}' +
	'nav.re-groups-def {display:none}' +
	'.js-date .reactView span {font-size:.85em}' +
    '.js-post-list button[class*="ShowMoreButton"].is-hidden {display:block!important}' +
    '.js-post-list p[class^="BaseText"] > button {margin-top:.25rem}' +
    // 'div.js-post-list p.js-detail div[class^="TruncateBlock__Content"] {-webkit-line-clamp:8}' +
    'div[class^="CommentsArea"] div[class^="TruncateBlock__Content"] {-webkit-line-clamp:unset}' +
    'div[class^="CommentsArea"] div[class^="TruncateBlock__Container"] p button {display:none}' +
    // '.js-main .js-sidebar {max-height:inherit !important}' +
    // '.js-main .js-sidebar .re-groups-def {padding-bottom:1rem}' +
    '.js-blurred-image > div {z-index:0}' +
    'div[class^="NameAndOfficialBadgeWrapper-"] {white-space:unset}' +

    //groups list
	'span.re-posts-view {font-family: "Gibson Bold"; font-weight:500; text-transform:uppercase; background-color:transparent; color:#fff; height:auto; cursor:pointer; padding-left:2rem;}' +
	'span.re-list-head, span.re-list-view, span.re-list-load {font-family:Inter,Helvetica,Arial,"Open Sans",sans-serif; text-transform:uppercase; user-select:none; color:rgb(255,255,255,.5); height:auto}' +
	'span.re-list-view, span.re-list-load {font-family: "Gibson Bold"; font-weight:500; color:rgb(250,250,250); cursor:pointer;}' +
	'span.re-list-load:before {display:inline-block; transform:scaleX(-1)}' +
    '.re-groups-listitem {font-family:Inter,Helvetica,Arial,"Open Sans",sans-serif; display:flex; align-items:center; border-bottom: 1px solid #2e2e2e; padding:.66em .5em; width:100%}' +
    `.re-groups-listitem:hover {background-color:${color[8]}}` +
    '.re-groups-tile {display:flex; flex-shrink:0; margin-right:1em; background-size:cover; border-radius:50%; height:3em; width:3em}' +
    '.re-groups-entry {flex-grow:1; flex-shrink:1; min-width:0; display:flex; flex-direction:column}' +
    '.re-groups-top-row, .re-groups-bottom-row {display:flex; flex-direction:row; align-items:center; justify-content:space-between}' +
    '.re-groups-name {font-size:.9375rem; color:rgb(0,163,228); font-weight:500; display:-webkit-box; -webkit-box-orient:vertical; -webkit-line-clamp:1; overflow:hidden; word-break:break-all}' +
    '.re-groups-time {font-size:.825em; color:rgb(250,250,250,.625)}' +
    '.re-groups-activity {display:flex; flex-direction:row; position:relative; top:-.1rem}' +
    '.re-groups-new {display:flex; align-items:center; margin-left:.5rem; color:rgb(250,250,250,.8); font-size:0.8em}' +
    '.re-groups-new svg {display:inline-block; height:1em; width:1.125em; vertical-align:middle}' +
    '.re-groups-new svg path {fill:currentcolor}' +
    '.re-groups-admin {color:rgb(0,0,0,.8); background-color:rgb(0,189,255); padding:0 .25rem; border-radius:.25rem; font-size:0.625rem}' +
    `.re-groups-selected {background-color:${color[9]}}` +
    '.re-groups-selected .re-groups-name {color:rgb(255,255,255,.925)}' +
    '.re-groups-selected .re-groups-new {color:rgb(250,250,250,.425)}' +
    '.re-groups-selected .re-groups-admin {background-color:rgb(255,255,255,.87)}' +
    '.re-groups-visited :is(.re-groups-name, .re-groups-new) {color:rgb(250,250,250,.425)}' +
    '.re-groups-visited .re-groups-time {color:rgb(250,250,250,.375)}' +
    '.re-groups-visited .re-groups-admin {background-color:rgb(250,250,250,.425)}' +

    //travel
    '.re-member-travel, .re-radar-travel, .re-edit-travel {color:#00bdff; font-family:Inter; font-size:.925em; white-space:nowrap; text-transform:initial; vertical-align: middle; line-height:inherit !important; cursor:pointer}' +
    'div[class^="Dropdown__Container"] :is(.re-member-travel, .re-edit-travel) {padding-top:.66rem}' +
    '.re-member-travel:hover, .re-radar-travel:hover, .re-edit-travel:hover {color:#66d7ff}' +
    '.re-member-travel.re-selected, .re-radar-travel.re-selected {color:#fff}' +
    ':is(.js-location-list, .travel-list) label {background-color:#ccc}' +

    //picture rating
    '.re-rating-date {position:absolute; top:2.5rem; font-size:.85em; cursor:default}' +
    // '.re-rating-skip:focus {outline-color:transparent !important}' +
    // 'button[class^="TertiaryButton__Element-"]:focus {outline-color:transparent !important}' +

    //relogin
    '.re-relogin-frame {background-color:transparent !important}' +
    '.re-relogin-frame:before {border:none !important}' +

    //more big tiles per page
	'@media screen and (min-width:55rem) {' +
	'.search-results--big-tiles .search-results__item:not(.search-results__banner) {padding-bottom:calc(25% - 1px) !important; width:calc(25% - 1px) !important}' +
	':is(.is-filter-opened, .is-stream-opened) .search-results--big-tiles .search-results__item:not(.search-results__banner) {padding-bottom:calc(33.33333% - 1px) !important; width:calc(33.33333% - 1px) !important}' +
	'.is-stream-opened.is-filter-opened #profiles div.search-results--big-tiles div.search-results__item:not(.search-results__banner) {padding-bottom:calc(50% - 1px) !important; width:calc(50% - 1px) !important}' +
    '#cruise main > ul, #eyecandy-results > ul {grid-template-columns:repeat(4,1fr)}' +
    '.is-stream-opened #cruise main > ul, .is-stream-opened #eyecandy-results > ul, #explore-grid > ul {grid-template-columns:repeat(3,1fr)}' +
    '.is-stream-opened #explore-grid > ul {grid-template-columns:repeat(2,1fr)}' +
    '}' +
	'@media screen and (min-width:75rem) {' +
	'.search-results--big-tiles .search-results__item:not(.search-results__banner) {padding-bottom:calc(20% - 1px) !important; width:calc(20% - 1px) !important}' +
	':is(.is-filter-opened, .is-stream-opened) .search-results--big-tiles .search-results__item:not(.search-results__banner) {padding-bottom:calc(25% - 1px) !important; width:calc(25% - 1px) !important}' +
	'.is-stream-opened.is-filter-opened #profiles div.search-results--big-tiles div.search-results__item:not(.search-results__banner) {padding-bottom:calc(33.33333% - 1px) !important; width:calc(33.33333% - 1px) !important}' +
    '#cruise main > ul, #eyecandy-results > ul {grid-template-columns: repeat(5,1fr)}' +
    '.is-stream-opened #cruise main > ul, .is-stream-opened #eyecandy-results > ul, #explore-grid > ul {grid-template-columns:repeat(4,1fr)}' +
    '.is-stream-opened #explore-grid > ul {grid-template-columns:repeat(3,1fr)}' +
    '}' +
	'@media screen and (min-width:95rem) {' +
	'.search-results--big-tiles .search-results__item:not(.search-results__banner) {padding-bottom:calc(16.66666% - 1px) !important; width:calc(16.66666% - 1px) !important}' +
	':is(.is-filter-opened, .is-stream-opened) .search-results--big-tiles .search-results__item:not(.search-results__banner) {padding-bottom:calc(20% - 1px) !important; width:calc(20% - 1px) !important}' +
	'.is-stream-opened.is-filter-opened #profiles div.search-results--big-tiles div.search-results__item:not(.search-results__banner) {padding-bottom:calc(25%  - 1px) !important; width:calc(25% - 1px) !important}' +
    '#cruise main > ul, #eyecandy-results > ul {grid-template-columns:repeat(6,1fr)}' +
    '.is-stream-opened #cruise main > ul, .is-stream-opened #eyecandy-results > ul, #explore-grid > ul {grid-template-columns:repeat(5,1fr)}' +
    '.is-stream-opened #explore-grid > ul {grid-template-columns:repeat(4,1fr)}' +
    '}' +
	'@media screen and (min-width:120rem) {' +
	'.search-results--big-tiles .search-results__item:not(.search-results__banner) {padding-bottom:calc(12.5% - 1px) !important; width:calc(12.5% - 1px) !important}' +
	':is(.is-filter-opened, .is-stream-opened) .search-results--big-tiles .search-results__item:not(.search-results__banner) {padding-bottom:calc(16.66666% - 1px) !important; width:calc(16.66666% - 1px) !important}' +
	'.is-stream-opened.is-filter-opened #profiles div.search-results--big-tiles div.search-results__item:not(.search-results__banner) {padding-bottom:calc(20% - 1px) !important; width:calc(20% - 1px) !important}' +
    '#cruise main > ul, #eyecandy-results > ul {grid-template-columns:repeat(7,1fr)}' +
    '.is-stream-opened #cruise main > ul, .is-stream-opened #eyecandy-results > ul, #explore-grid > ul {grid-template-columns:repeat(6,1fr)}' +
    '.is-stream-opened #explore-grid > ul {grid-template-columns:repeat(5,1fr)}' +
    '}' +
	'@media screen and (min-width:140rem) {' +
	'.search-results--big-tiles .search-results__item:not(.search-results__banner) {padding-bottom:calc(12.5% - 1px) !important; width:calc(12.5% - 1px) !important}' +
	':is(.is-filter-opened, .is-stream-opened) .search-results--big-tiles .search-results__item:not(.search-results__banner) {padding-bottom:calc(12.5% - 1px) !important; width:calc(12.5% - 1px) !important}' +
	'.is-stream-opened.is-filter-opened #profiles div.search-results--big-tiles div.search-results__item:not(.search-results__banner) {padding-bottom:calc(16.66666% - 1px) !important; width:calc(16.66666% - 1px) !important}' +
    '#cruise main > ul, #eyecandy-results > ul {grid-template-columns:repeat(8,1fr)}' +
    '.is-stream-opened #cruise main > ul, .is-stream-opened #eyecandy-results > ul, #explore-grid > ul {grid-template-columns:repeat(7,1fr)}' +
    '.is-stream-opened #explore-grid > ul {grid-template-columns:repeat(6,1fr)}' +
    '}' +


    //*** DESKTOP ***
	'@media screen and (min-width:768px) {' +

    //general
    '.re-mobi {display:none!important}' +
    '.re-touch {visibility:hidden!important}' +

    //FIX for group member tiles and posting likes
    // '.grouped-tiles-small .tile {width:calc(33.33333% - 1px)}' +
    // '.grouped-tiles-big .tile {width:calc(50% - 1px)}' +
    'div.Container--XPRsa .tile {width: calc(25% - 1px)}' +

    //hunqz
    'div.locationPicker {right:.5rem}' +
    '.is-stream-opened div.locationPicker {right:0}' +

    '}' +


    //*** DESKTOP >= 1024px ***
    '@media screen and (min-width:1024px) {' +

    //stream
    '.stream {width:18.5rem!important}'+
    '.is-stream-opened .layer--nav-primary {right:18.5rem}' +

    //hunqz
    'div.locationPicker {right:19rem}' +
    '.is-stream-opened div.locationPicker {right:.5rem}' +

    '}' +


    //*** TABLET  ***
    '@media screen and (max-width:1023px) {' +

    //tab menu
    '.js-navigation nav > a, #cruise nav > a, .js-main-stage header > nav > a {font-size:1.05rem}' +
    '.js-main-stage header > nav {max-width:unset}' +

    //top right navigation
    'nav.js-top-right-navigation{display:none}' +

    //FIX for group member tiles and posting likes
    '.grouped-tiles-small .tile {width:calc(33.33333% - 1px)}' +
    '.grouped-tiles-big .tile {width:calc(50% - 1px)}' +
    'div.Container--XPRsa .tile {width: calc(33.33333% - 1px)}' +

    '}' +


	//*** MOBILE ***
	'@media screen and (max-width:767px) {' +

    //general
    '.re-desk {display:none!important}' +
    '.re-touch {visibility:hidden!important}' +

    //tweak dark design
    // `.ui-navbar--app, .ui-navbar.content-nav ul {background-color:#000 !important}` +
    'div.content-nav--animated {height:3rem}' +

    //main page
    // '.header-visible div[class^="MainContainer-"] {bottom: 3.5rem}' +
    // 'header.js-header {height:3.75rem}' +

    //tab menu
    '.js-navigation nav > a, #cruise nav > a, .js-main-stage header > nav > a {font-size:.875rem}' +
    // '.js-navigation nav {height:3.25rem}' +

    //stream
    '.re-stream-toggle-div {top:calc(3.25rem - 2px); padding:.5rem 1rem 0}' +
    'div.stream__content {top:calc(5.5rem + 1px)}' +
    `.layer-header--primary {background-color:${color[2]} !important}` +

    //messages
    '#messenger .js-header-region header > h1 {padding-top:1.3rem}' +
    '#messenger .js-header-region header > h1 a:has(span) {padding-bottom:1.2rem}' +
    '#messenger .re-msg-location {padding-top:.75rem}' +
    '#messenger .re-msg-login {top:3.2rem}' +
    '#messenger .re-msg-offline {top:3.2rem}' +
    '.messages-send__form textarea.input--chat {font-size:.9375rem; letter-spacing:normal}' +

    //group tiles
    'div[class*="Tile__BaseTile-"] > p {margin:0; font-size:.925rem}' +

    //picture rating
    '.re-rating-date {top:3rem}' +

    //hide groups list when group selected, wrap long group names
    'div[class*="withNav-"] > div[class*="ReactContainer-"]:not(:has(.re-groups-def)) {flex:0; width:0}' +
    'div[class*="withNav-"] > div[class*="ReactContainer-"]:not(:has(.re-groups-def)) > :is(div, nav) {display:none}' +
    'div[class*="withNav-"] > div[class*="ReactContainer-"]:has(.re-groups-def) + div.js-main {display:none}' +
    // 'div[class^="NameAndOfficialBadgeWrapper-"] {white-space:unset}' +

    //groups header
    '.js-header-container p[class*="HeadlineL"] {font-size:1.375rem; text-wrap-mode:wrap}' +
    '.js-header-container a span[class*="ResponsiveBodyText-"] {word-break:normal !important}' +

    //back arrow in group post
    '#group-post .js-post button.js-back {margin:1rem 1rem 0 -.5rem}' +

    //FIX for flickering top right navigation
    // 'nav.js-top-right-navigation {display:none}' +

    //show distance slide in hunqz nearby filter
    '.js-main-stage:has(.js-navigation a[href^="/hunqz"]) div.js-distance-radius.filter__group {display:block !important}' +

    '}' +


    //*** TOUCH SCREEN ***
	'@media screen and (hover:none) {' +

    //general
    '.re-touch {visibility:visible!important}' +

    //icons, links
    'a.re-icon {padding:.25em 0 .25rem .5em; font-size:1em}' +
    'div.stream__content a.re-icon {padding:.25em .5em .25em 0}' +
    'a.re-eyecandy-toggle {padding:.25em .5em}' +

    '}'

);


// ***** Clean up old settings *****
localStorage.removeItem('contactsSelection');
localStorage.removeItem('REgroupPostsView');
localStorage.removeItem('reRatingMax');


// ***** Test if mobile or touch device *****
// usage: if (mobile.matches) ...; if (touch.matches) ...
let mobile = window.matchMedia("(max-width:767px)");
let touch = window.matchMedia("(hover:none)");


// **************************************************************
// ***** The following function is taken from:
// ***** https://gist.github.com/BrockA
// ***** https://gist.github.com/raw/2625891/waitForKeyElements.js


/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (
selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
 actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
 bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
 iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
	var targetNodes, btargetsFound;

	if (typeof iframeSelector == "undefined")
		targetNodes     = $(selectorTxt);
	else
		targetNodes     = $(iframeSelector).contents ()
			.find (selectorTxt);

	if (targetNodes  &&  targetNodes.length > 0) {
		btargetsFound   = true;
		/*--- Found target node(s).  Go through each and act if they
            are new.
        */
		targetNodes.each ( function () {
			var jThis        = $(this);
			var alreadyFound = jThis.data ('alreadyFound')  ||  false;

			if (!alreadyFound) {
				//--- Call the payload function.
				var cancelFound     = actionFunction (jThis);
				if (cancelFound)
					btargetsFound   = false;
				else
					jThis.data ('alreadyFound', true);
			}
		} );
	}
	else {
		btargetsFound   = false;
	}

	//--- Get the timer-control variable for this selector.
	var controlObj      = waitForKeyElements.controlObj  ||  {};
	var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
	var timeControl     = controlObj [controlKey];
    var timerInterval   = (document.visibilityState === "visible" ? 750 : 1500);

	//--- Now set or clear the timer as appropriate.
	if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
		//--- The only condition where we need to clear the timer.
		clearInterval (timeControl);
		delete controlObj [controlKey];
	}
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl ) {
            timeControl = setInterval ( function () {
                waitForKeyElements (selectorTxt,
                                    actionFunction,
                                    bWaitOnce,
                                    iframeSelector
                                   );
            },
                                       timerInterval
                                      );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}

// ***** end
// **************************************************************


// ***** Set AJAX headers *****
let key0 = window.atob('WC1TZXNzaW9uLUlk');
let key1 = window.atob('WC1BcGktS2V5');
let val1 = window.atob('anY4ZXdCRjh6MWw1UzFsaTdhNHBJcWZIcmRmMDRHUU0=');
function ajaxHead(){
	return {[key0]: JSON.parse(localStorage.getItem('PR_SETTINGS:SESSION_ID')), [key1]: val1};
}


// ***** Replace URLs with links *****
// ***** Adopted from https://stackoverflow.com/questions/37684/how-to-replace-plain-urls-with-links/37687#37687 *****
function linkify(text) {

	//Email addresses
	let pattern1 = /(^|\s|<br>)(([-\w\.\+])+@[-\w]+?(\.[A-Z]{2,6})+)/gim;
	text = text.replace(pattern1, '$1<a href="mailto:$2" class="plain-text-link">$2</a>');

	//URLs starting with http:// or https://
	let pattern2 = /(^|\s|<br>)(https?:\/\/[-\w+&@#\/\(\)%?=~|!:,.;]*[-\w+&@#\/\(\)%=~|])/gim;
	text = text.replace(pattern2, '$1<a target="_blank" href="$2" rel="noreferrer noopener" class="plain-text-link">$2</a>');

	//URLs without http:// or https://
	let pattern3 = /(^|\s|<br>)([-\w]+\.[a-z][-\w+&#\/\(\)%?=~|!:,.;]*[-\w+&#\/\(\)%=~|])/gm;
	text = text.replace(pattern3, '$1<a target="_blank" href="http://$2" rel="noreferrer noopener" class="plain-text-link re-link-idle">$2</a>');

	//keep internal links in same window
	let pattern4 = /(target="_blank" )(href="https?:\/\/(www\.)?((planet)?romeo|hunqz)\.com)/gim;
	text = text.replace(pattern4, '$2');

	return text;
}


// ***** Format date/time *****
function dateTime(timeStamp, dateOnly, noYesterday) {
    // 1s...59s; 1min...59min; hh:mm; gestern hh:mm; Mo...So, hh:mm; tt.mm.jjjj, hh:mm
    let timeNow = new Date();
    let timeNow1 = new Date (timeNow - 1000*60*60*24);
    let timeNow7 = new Date (timeNow - 1000*60*60*24*7);
    let hhmm = {hour: "numeric", minute: "numeric"};
    // console.log('dateTime');
    if (timeStamp) {
        if (timeStamp.toDateString() == timeNow.toDateString()) {  // today
            return timeStamp.toLocaleString('de-DE', hhmm);
        } else if (!noYesterday && timeStamp.toDateString() == timeNow1.toDateString()) {  // yesterday
            return `gestern ${timeStamp.toLocaleString('de-DE', hhmm)}`;
        } else if (timeStamp > timeNow7 && timeStamp.getDay() != timeNow.getDay()) {  // last 6 days of week
            return timeStamp.toLocaleString('de-DE', {weekday: 'short', hour: "numeric", minute: "numeric"});
        } else {
            return `${timeStamp.toLocaleDateString('de-DE')}${dateOnly ? `` : `, ${timeStamp.toLocaleString('de-DE', hhmm)}`}`;
        }
    }
}


// ***** Format weekday/time *****
function weekTime(timeStamp, dateOnly) {
    // console.log('weekTime');
    return dateTime(timeStamp, dateOnly, true);
}


// ***** Change URL without reloading the page *****
function changeUrl(url) {
	history.pushState({}, document.title, url);
	history.pushState({}, document.title, url);
	history.back();
}


// ***** Change object property in sessionStorage *****
function setSessionStorageItem(storageItem, key, value) {
    let storageValue = JSON.parse(sessionStorage.getItem(storageItem));
    (storageValue) ? storageValue[key] = value : storageValue = JSON.parse(`{"${key}":"${value}"}`);
    sessionStorage.setItem(storageItem, JSON.stringify(storageValue));
}


// ***** Change object property in localStorage *****
function setLocalStorageItem(storageItem, key, value) {
    let storageValue = JSON.parse(localStorage.getItem(storageItem));
    (storageValue) ? storageValue[key] = value : storageValue = JSON.parse(`{"${key}":"${value}"}`);
    localStorage.setItem(storageItem, JSON.stringify(storageValue));
}


// ***** Add title and aria-label *****
jQuery.fn.titleLabel = function(text) {
    return $(this).attr({'title': text, 'aria-label': text});
};


// ***** Open message thread or contact info by profile name *****
// (not working for blocked, blocking, or paused profiles)
function openByName(baseUrl, profileLink, profileName) {
	let profileType = (profileLink.match(/^\/hunq\//)) ? 'hunqz/profiles' : 'profiles';
	$.ajax({url: `/api/v4/${profileType}?pick=items.*.(id,name)&lang=de&length=1&filter[fulltext_search_mode]=EXACT&filter[fulltext]=@${profileName}`,
	// $.ajax({url: `/api/v4/${profileType}?lang=de&length=1&filter[fulltext_search_mode]=EXACT&filter[fulltext]=@${profileName}`,
			headers: ajaxHead()
		   })
	.done(function (data) {
		if (data.items[0]?.name == profileName) {
            directMsg = data.items[0].id;
			changeUrl(baseUrl + data.items[0].id);
/*         } else {
            $.ajax({headers: ajaxHead(), url: `/api/v4/${profileType}/${profileName}/full?lang=de&lookup_type=NAME`})
            .done(function (data) {
                if (data.id) {
                    changeUrl(baseUrl + data.id);
                }
            }); */
        }
	});
}


// ***** Hide visit *****
function hideVisit(profileId) {
	if (profileId > 0) {
		$.ajax({url: `/api/v4/visits/${profileId}`,
				headers: ajaxHead(),
				method: 'DELETE'
			   })
		.done(function () {
			$('ul.profile-nav__list button[data-cta="hide_visit"]').attr('style', 'visibility:hidden');
            $('.profile .top-info-header button').attr('style', 'color:rgb(168,168,168)');
		})
	}
}


// ***** Search profile id, open profile name directly *****
function handleSearch(jNode) {
    $('#search a.re-add').off('click').remove();
    $(jNode).attr('autocomplete', 'off').attr('autocorrect', 'off').attr('autocapitalize', 'off').attr('spellcheck', 'false');

    //workaround for iOS
    $(jNode).trigger('blur');
    $(jNode).after(`<input class="re-input-tmp" style="width:0; height:0; margin:0; padding:0; border:0; opacity:0" />`).trigger('focus');
    setTimeout(() => {
        $(jNode).trigger('focus');
        $('.re-input-tmp').remove();
    }, 0);

    $(jNode).on('input click', () => {
        let inputValue = $(jNode).val().trim();
        $('#search a.re-add').off('click').remove();
        if (inputValue.match(/^[1-9]\d{2,}$/)) {
            $('#search div[class^="InputBase__EndIcon-"]').after(
                `<a style="font-size:1rem; white-space:nowrap" class="re-add re-link-no-hover mh--"><span class="re-desk">Profil-ID ${inputValue} anzeigen</span><span class="re-mobi">ID anzeigen</span></a>`
            ).next('.re-add').on('click', () => {
                openById(inputValue);
                return false;
            });
        } else if (inputValue.match(/^@?[-\w\/\?&=]{3,}$/)) {
            inputValue = inputValue.replace(/^@/, '');
/*             $('#search div[class^="InputBase__EndIcon-"]').after(
                `<a href="${((inputValue.match(/^\//)) ? '' : '/profile/') + inputValue}" style="font-size:1rem; white-space:nowrap" class="re-add re-link-no-hover mh--"><span>${inputValue}</span><span class="re-desk"> anzeigen</span></a>`
            ); */
            $('#search div[class^="InputBase__EndIcon-"]').after(
                `<a style="font-size:1rem; white-space:nowrap" class="re-add re-link-no-hover mh--"><span>${inputValue}</span><span class="re-desk"> anzeigen</span></a>`
            ).next('.re-add').on('click', () => {
                changeUrl(((inputValue.match(/^\//)) ? '' : '/profile/') + inputValue);
                return false;
            });
        }
    });
}


// ***** Open profile by ID *****
function openById(id) {
    $.ajax({headers: ajaxHead(), url: `/api/v4/profiles/${id}?expand=partner&lang=de`})

	.done(function (data) {
		let type = (data.type) ? data.type : '';
		let name = (data.name) ? data.name : '';
        let profileType = 'profile';
        if (type == 'ESCORT') {
            profileType = 'hunq';
        } else if (type == 'CLUB') {
            profileType = 'group';
        }
        changeUrl(`/${profileType}/${name}`);
    })

   	.fail(function (data) {
		changeUrl('/profile/-');
	});
}


// ***** Picture upload month/year *****

//init
const imgTable = [
    0x00000000,0x00000000,0x000076f1,0x0000c0c2,0x000113ac,0x000193c7,0x00022adb,0x0002e59b,0x0003c274,0x0004bdda,0x0005cb8f,0x0006f792, //2003
    0x00083008,0x0009e166,0x000bc399,0x000dc70d,0x000fcad1,0x001219f5,0x0014e794,0x00180a61,0x001b7a83,0x001eeaaa,0x0022a968,0x0026aaf2, //2004
    0x002b6a0f,0x00313036,0x00367804,0x003c4ae9,0x00421a3c,0x0048a2b6,0x004f0ba9,0x00563a9c,0x005d4ff9,0x00642120,0x006bc702,0x0072df38, //2005
    0x007a2553,0x008262a7,0x0089c5c3,0x0091feff,0x009ae5e4,0x00a3f682,0x00ad0f09,0x00b727f9,0x00c1e7a3,0x00cb8e0b,0x00d5c02c,0x00df62f9, //2006
    0x00e9061d,0x00f428f1,0x00fe1c56,0x0108f832,0x01141330,0x011ffb48,0x012b9597,0x0137a3d7,0x01436c46,0x014eba63,0x015ae49b,0x01665b6d, //2007
    0x01721df4,0x017ecdd9,0x018a872f,0x0197cf93,0x01a3fca7,0x01b1bb65,0x01bf4e25,0x01ce3307,0x01dd339e,0x01eb4eb3,0x01fa2a2a,0x02086e83, //2008
    0x0216e01e,0x0226de08,0x0234eda5,0x02552d86,0x02677f82,0x027aa2a8,0x028d8ba1,0x02a14649,0x02b605b4,0x02c9ad68,0x02dd8ad9,0x02f0dfe7, //2009
    0x0304f671,0x031b4142,0x032e6143,0x0342c960,0x0356cd19,0x036cb4d8,0x0381a103,0x03986cc1,0x03b0829f,0x03c679e3,0x03dd820b,0x03f4381e, //2010
    0x040af127,0x0423f461,0x0439c102,0x045248d4,0x046b187c,0x048570e5,0x04a09a51,0x04bcc8a2,0x04d9b4fa,0x04f52906,0x051201a6,0x052df05d, //2011
    0x054a17b7,0x0568a266,0x0584c8a7,0x05a2542c,0x05c0b41b,0x05df82b9,0x05fe3605,0x061e5f48,0x063f4240,0x065e2c95,0x067e22b7,0x069db396, //2012
    0x06c04502,0x06e62970,0x0707d372,0x072dff1a,0x0751ca91,0x077860fb,0x079c0f3e,0x07c1e771,0x07e86366,0x080da8ce,0x0831ee79,0x08558fc5, //2013
    0x087b94b3,0x08a21c54,0x08c4f55c,0x08eac6fe,0x09119caa,0x09397aed,0x0960b60a,0x098a9925,0x09b76f87,0x09e01456,0x0a0906c0,0x0a305fc4, //2014
    0x0a810424,0x0adaf553,0x0b2947ce,0x0b7d01e6,0x0bcf1e76,0x0c24958c,0x0c755b5b,0x0ccd15d3,0x0d23c304,0x0d7376dc,0x0dc56afa,0x0e140d38, //2015
    0x0e6631a2,0x0ebdf2c6,0x0f0ce2ec,0x0f607bf5,0x0fb35a28,0x100ae86a,0x105e79ed,0x10b8bbbf,0x1115caa8,0x116ae5ac,0x11beb400,0x1211f832, //2016
    0x1267b822,0x12c42272,0x1315847b,0x136e4be0,0x13c5fdbd,0x141f2328,0x147b222a,0x14dde3b3,0x1541cb7a,0x159e4a36,0x1601fff2,0x16657140, //2017
    0x16cb8a49,0x1734ece1,0x1792be94,0x17fa7afa,0x185ec78c,0x18c964a2,0x193230d2,0x19a225bd,0x1a12bd1e,0x1a79217a,0x1ae1e760,0x1b4790fd, //2018
    0x1bb4f607,0x1c23ce64,0x1c84b186,0x1cf2f646,0x1d61d7f8,0x1ddb56d8,0x1e59a281,0x1edf03d3,0x1f66d25f,0x1fe26f82,0x205ec456,0x20d2bded, //2019
    0x21484431,0x21c24ba6,0x2230c76f,0x22a6c5d6,0x23131b17,0x23844c83,0x23f45e75,0x246d38c1,0x24eb9338,0x255dc81a,0x25d30c39,0x2643606d, //2020
    0x26b9cb56,0x2730f2c2,0x279824a7,0x28072e59,0x2870b46c,0x28e20cee,0x294ea8da,0x29bdf4f9,0x2a2f2276,0x2a9872c3,0x2b026453,0x2b6628b7, //2021
    0x2bcd3a33,0x2c3819a3,0x2c95d422,0x2cf66474,0x2d57afa7,0x2dc0df59,0x2e283458,0x2e94df63,0x2f014662,0x2f63074e,0x2fc3e3be,0x301fada4, //2022
    0x307f54f1,0x30e474f9,0x313bdc54,0x3199d68a,0x31f91ccb,0x32595812,0x32b90f74,0x3320eb2e,0x3386b446,0x33e585da,0x34462941,0x34a0e6fc, //2023
    0x34ffeb7e,0x3560247b,0x35b6684b,0x36101e12,0x3669ef96,0x36ca6fdd,0x37297144,0x378e7a59,0x37f5221b,0x3851c0a0,0x38ae410d,0x390700f4, //2024
    0x3960ad24,0x39b9d4b0,0x3a02562a,0x3a596510,0x3ab187ce,0x3b0d229b,0x3b6a0515,0x3bcae8dd,0x3c2cf881,0x3c8528fd,0x3cdda838,0x3d30e811, //2025
    0x3d8774ee,0x3dde7304,0x3e2d05f0,0x3e83e618,0x3ed815cb,0x3f2f13e1,0x3f834394,0x3fda41ab,0x40313fc2,0x40856f75,0x40dc8b7a,0x4130bb2d, //2026
    0x4187b944,0x41deb75a,0x422d4a46,0x42842a6e,0x42d85a20,0x432f5837,0x438387ea,0x43da8601,0x44318418,0x4485b3ca,0x44dccfd0,0x4530ff83, //2027
    0xffffffff];

function uploadDate(imgName) {
    const monthYearIndex = (element) => element >= parseInt(imgName, 16);
    let index = imgTable.findIndex(monthYearIndex) - 1;
    let year = 2003 + Math.trunc(index / 12);
    let month = 1 + index % 12;
    if (imgTable[index] == 0x00000000) {
        return '';
    } else {
        return `≈ ${month}.${year}${imgTable[index + 1] == 0xffffffff ? '+' : ''}`;
    }
}


// ***** Copy message thread to clipboard *****
function copyMessageThread(profileId, profileName) {
    let loadTime = new Date().toLocaleString('de-DE').slice(0,-3);
    let ownName = 'unknown';
    let msgThread = '- keine Nachrichten -';
    let msgCount = '', header = '', msgTime = '', name = '';
    $.ajax({headers: ajaxHead(), url: `/api/v4/session?lang=de`}).done(function (data) {
        if (data.username) {
            ownName = data.username;
        }
        let jsonParam = `lang=de&length=10000&filter[folders][]=SENT&filter[folders][]=RECEIVED&filter[partner_id]=${profileId}`;
        $.ajax({headers: ajaxHead(), url: `/api/v4/messages?${jsonParam}`})

            .done(function (data) {

            //gather data
            header = 'Nachrichtenverlauf von ' + ownName + ' mit ' + profileName + ' (Profil-ID ' + profileId + ') vom ' + loadTime + '\n\n\n';
            if (data.items_total) {
                msgThread = '';
                msgCount = data.items_total;
                for (let i = msgCount-1; i >= 0; i--) {
                    msgTime = new Date(data.items[i].date.slice(0,-5)+'.000Z');
                    name = (data.items[i].folder == 'SENT') ? ownName : profileName;
                    msgThread += msgCount-i + '. ' + name + '  •  ' + msgTime.toLocaleString('de-DE').slice(0,-3);
                    msgThread += (data.items[i].unread == true) ? ' [ungelesen]' : '';
                    msgThread += (data.items[i].locked == true) ? ' [gespeichert]' : '';
                    msgThread += (data.items[i].spam == true) ? ' [Spam]' : '';
                    msgThread += '\n-------------------------------------------------------------------';
                    msgThread += '\n' + data.items[i].text.trim() + '\n\n\n';

                    //handle links
                    if (data.items[i].attachments) {
                        for (let item of data.items[i].attachments) {
                            if (item.type == 'COMMAND') {
                                msgThread += `[${item.index + 1}] ${item.params?.url?.match(/^\//) ? 'https://www.romeo.com' : ''}${item.params?.url}\n`;
                                msgThread = msgThread.replace(`[[${item.index}]]`, `${item.params?.text} [${item.index + 1}]`);
                            }
                        }
                        msgThread += '\n\n'
                    }
                }
                msgThread += '\n====================\n\n';
            }

            //confirm copy
            $('div.js-correspondence').after(
                `<div class="re-bubble layout layout--h-center">
<div class="ui-bubble ui-bubble--dark" style="width:auto; top:72px">
<div class="ui-bubble__content [ js-content ] [ js-scrollable ] scrollable">
<div class="confirm-box">
<div class="txt-right" style="margin:-.5rem -.5rem -.75rem">
<a class="re-copy-cancel re-link icon icon-larger icon-cross"></a>
</div>
<div class="confirm-box__label" style="margin-bottom:1.125rem">
<p>Nachrichtenverlauf kopieren</p>
</div>
<div class="confirm-box__actions">
<button class="re-copy-email ui-button ui-button--transparent">E-Mail-Entwurf</button>
<button class="re-copy-confirm ui-button ui-button--primary">Zwischenablage</button>
</div>
</div>
</div>
</div>
</div>
<div class="layer ui-bubble__overlay l-fancy"></div>`
            );
            $('button.re-copy-confirm').focus().on('click', function() {
                navigator.clipboard.writeText(header + msgThread);
                $('div.re-bubble, div.ui-bubble__overlay').hide();
            });
            $('button.re-copy-email').on('click', function() {
                location.href = `mailto:?subject=${encodeURIComponent(header)}&body=${encodeURIComponent(msgThread)}`;
                $('div.re-bubble, div.ui-bubble__overlay').hide();
            });
            $('a.re-copy-cancel, div.ui-bubble__overlay').on('click', function() {
                $('div.re-bubble, div.ui-bubble__overlay').hide();
            });
        });
    });
}


// ***** Fix scrolling on larger screens for messages list *****
function fixScroll (jNode) {
    $(jNode).parents('.js-chat .js-scrollable').attr('style', 'max-height:inherit !important');
}


// ***** Add double tap to menu items, change behavior for mobile *****
function handleMainMenu (jNode) {
    if (!mobile.matches) {
        // $(jNode).has('path[d^="M13.493"]').off().has('p[class^="SpecialText"]').on('click', function() { changeUrl('/messenger/chat'); return false; });
        // $(jNode).filter('a[href^="/messenger"]').attr('style', 'pointer-events:auto').filter('a[isactive="true"]').off().on('click', function() { $('#messenger').addClass('is-hidden'); return false; });
        // $(jNode).has('path[d^="M6.99 10"]').off().on('click', function() { changeUrl('/groups/discover'); return false; });
        $(jNode).has('path[d^="M6.99 10"]').find('button').off('click').on('click', function() {
            if (lastGroupName && sessionStorage.getItem('PR_SETTINGS:cachedNavTab')?.match('"groups":"member"')) {
                changeUrl(`/groups/member/${lastGroupName}`);
                return false;
            }
        });
    } else {
        $(jNode).has('path[d^="M20.3943"], path[d^="m20.507"]').off('dblclick').on('dblclick', function() { changeUrl('/stream'); return false; });
        $(jNode).has('path[d^="M23.102"]').off('dblclick').on('dblclick', function() {
            changeUrl('/visitors/me');
            setSessionStorageItem('PR_SETTINGS:cachedNavTab', 'visitors', 'me');
            return false;
        });
        $(jNode).has('path[d^="M13.493"]').off('dblclick').on('dblclick', function() {
            changeUrl('/messenger/contacts');
            setSessionStorageItem('PR_SETTINGS:cachedNavTab', 'messenger', 'contacts');
            return false;
        });
        $(jNode).has('path[d^="M6.99 10"]').off('click').on('click', function() { changeUrl('/groups/member'); return false; });
    }
}


// ***** Add travel etc. to tab navigation *****

//init
let radarTabMenuLoaded = false;

function handleTabMenu (jNode) {

    //workaround for tab navigation on NEW page
    if ($('.js-navigation nav').has('a[href^="/radar/"]').length) {
        radarTabMenuLoaded = true;
    }

    //radar
    $('.js-navigation nav').has('a[href^="/radar/"]').not(':has(a.re-add)').prepend(
        '<a class="vBddB re-add" title="Reiseziel"><span class="re-add re-radar-travel icon icon-airplane" title="Reiseziel"><span></span></span></a>'
    );

    //eyecandy
    $('section.js-main-stage').has('#eyecandy-results').not(':has(a.re-add)').find('header nav').prepend(
        '<a class="vBddB re-add" title="Reiseziel"><span class="re-add re-radar-travel icon icon-airplane" title="Reiseziel"><span></span></span></a>'
    );

    //add NEW to discover page menu
    if (testMode) console.log('DISCOVER page');
    $('.js-navigation nav').has('a[href^="/radar/"]').not(':has(a[href="/radar/new"])').append(
        '<a class="vBddB re-add" href="/radar/new"><span class="fdnxUW">Neu</span></a>'
    ).children().last().off('click').on('click', function() {
        setSessionStorageItem('PR_SETTINGS:cachedNavTab', 'radar', mobile.matches ? 'home' : 'new');
        return true;
    });

    //travel
    if ($('main nav.js-navigation ul, section.js-main-stage').has('a[href^="/radar/"], a[href^="/eyecandy/"], #eyecandy-results').length) {
    	let viewMode = localStorage.getItem('REradarTravelLocation');
    	let toggleTravel = 'span.re-radar-travel';
        let refreshClick = location.pathname.match(/\/eyecandy\//) ? 'header + div > button' : '';
        handleTravelLocation(viewMode, toggleTravel, refreshClick);
    	$('span.re-radar-travel').parent().off().on('click', function() {
			let viewMode = localStorage.getItem('REradarTravelLocation');
	  	    let toggleTravel = 'span.re-radar-travel';
	   	    let refreshClick = '.js-navigation a[aria-current="page"], header + div > button';
			viewMode = (viewMode == 'travel') ? 'default' : 'travel';
			localStorage.setItem('REradarTravelLocation', viewMode);
			handleTravelLocation(viewMode, toggleTravel, refreshClick);
		});
    }

    //groups
    $('.js-navigation nav > a[href="/groups/member"]').titleLabel(`${commonGroupsList.length.toLocaleString('de-DE')} Gruppen abonniert`);
}


// ***** Add tab navigation to NEW page *****
function handleTabMenuNew (jNode) {
    if (location.pathname.match(/^\/radar\/new/) && ! mobile.matches && radarTabMenuLoaded) {
        const jNodeNew = $(jNode).parent().parent();
        $(jNode).parent().remove();
        $(jNodeNew).append(
            '<nav class="gHPgrZ">'+
            '<a class="vBddB re-add" title="Reiseziel"><span class="re-add re-radar-travel icon icon-airplane" title="Reiseziel"><span></span></span></a>' +
            '<a class="vBddB re-add" href="/radar/home"><span class="fdnxUW">Entdecken</span></a>' +
            '<a class="vBddB re-add" href="/radar/distance"><span class="fdnxUW">Entfernung</span></a>' +
            '<a class="vBddB re-add" href="/radar/login"><span class="fdnxUW">Aktivität</span></a>' +
            '<a aria-current="page" class="vBddB re-add" href="/radar/new"><span class="fdnxUW">Neu</span></a>' +
            '</nav>'
        ).children('nav').off('click').on('click', 'a[href^="/radar"]', function() {
            let cachedTab = $(this).attr('href').replace(/(^\/radar\/)(\w+)/, '$2');
            setSessionStorageItem('PR_SETTINGS:cachedNavTab', 'radar', cachedTab);
            if (location.pathname.match(/^\/radar\/new/)) $('.layer-left-navigation li button:has(path[d^="m20.507"])')[0].click();
            return true;
        });
    }
}


// ***** Add contacts and my groups to top right menu *****
function handleTopRightMenu (jNode) {
    $(jNode).addClass('re-done');
    if (testMode) console.log('handleTopRightMenu');

    //contacts
    $(jNode).closest('li').clone().insertBefore($(jNode).closest('li')).addClass('re-contacts');
    $('.re-contacts').find('a').attr('href', '/messenger/contacts').off('click').on('click', function() {
        setSessionStorageItem('PR_SETTINGS:cachedNavTab', 'messenger', 'contacts');
        return true;
    });
    $('.re-contacts').find('p').text('Kontakte');
    $('.re-contacts').find('svg').replaceWith('<div class="icon icon-save-contact"></div>');

    //my groups
    if(location.hostname != 'www.hunqz.com') {
        $(jNode).closest('li').clone().insertBefore($(jNode).closest('li')).addClass('re-my-groups');
        $('.re-my-groups').find('a').attr('href', '/groups/member').off('click').on('click', function() {
            (async() => {
                while (!lastGroupName) await new Promise(resolve => setTimeout(resolve, 300));
                changeUrl(`${(lastGroupName) ? `/groups/member/${lastGroupName}` : `/groups/member`}`);
                setSessionStorageItem('PR_SETTINGS:cachedNavTab', 'groups', 'member');
            })();
            return false;
        });
        $('.re-my-groups').find('p').text('Gruppen');
        $('.re-my-groups').find('svg').replaceWith('<div class="icon icon-group-members"></div>');
    }
}


// ***** Show versions and users online in main menu *****
function handleVersion (jNode) {
    $(jNode).addClass('re-done');
    let reVersion = `${(typeof GM_info !== 'undefined') ? `${GM_info.script.name} ${GM_info.script.version}` : 'RomeoEnhancer'}`;
    let onlineAll = '';
    $.ajax({url: `/api/services/landing/online-count`})
        .done((data) => {
        onlineAll = `${data.online_count?.toLocaleString('de-DE')} Profile online`;
        $(jNode).find('.re-add').remove();
        $(jNode).append(`<div class="txt-preserve re-add">${reVersion}\n${onlineAll}</div>`);
        let profileType = $('.js-navigation nav > a[href^="/hunqz"]').length ? '/hunqz/profiles' : '/profiles';
        let users = '', online = '';
        $.ajax({headers: ajaxHead(), url: `/api/v4${profileType}?pick=items,items_total&lang=de&length=1`}).done((data) => {
            users = `${data.items_total?.toLocaleString('de-DE')} User`;
            $.ajax({headers: ajaxHead(), url: `/api/v4${profileType}?pick=items,items_total&lang=de&length=1&filter[online_status][]=ONLINE&filter[online_status][]=DATE&filter[online_status][]=SEX`}).done(function (data) {
                online = `${data.items_total?.toLocaleString('de-DE')} online`;
                $(jNode).off().on('dblclick', () => {
                    $(jNode).find('div').replaceWith(`<div class="txt-preserve re-add">${reVersion}\n${onlineAll}\n${users} • ${online}</div>`);
                });
            });
        });
    });
}


// ***** Hide softcore in tiles *****
function handleSettingsDisplay (jNode) {
    $(jNode).addClass('re-done');
    $(jNode).closest('div.settings__key').clone().insertAfter($(jNode).closest('div.settings__key')).addClass('re-hide-nsfw-switch');
    $('.re-hide-nsfw-switch').find('span.re-done').text('Softcore ausblenden');
    $('.re-hide-nsfw-switch').find('a.ui-hint').attr('data-hint', 'Softcore-Inhalte in Kacheln werden durch neutrale Platzhalter ersetzt.');
    $('.re-hide-nsfw-switch').find('.js-plus-always, .js-plus').removeClass('js-plus-always js-plus is-disabled-clickable');
    $('.re-hide-nsfw-switch').find('.ui-toggle__label').attr('for', 'uid-re-100');
    $('.re-hide-nsfw-switch').find('.ui-toggle__input').attr('id', 'uid-re-100').prop('checked', hideNSFW).off().on('change', function() {
        hideNSFW = !hideNSFW;
        localStorage.setItem('REhideNSFW', hideNSFW);
        $('.re-hide-nsfw-switch').find('.ui-toggle__input').prop('checked', hideNSFW);
        setTimeout(() => {location.reload()}, 200);
    });

    //text for headline switch
    $('span[data-cta="showHeadline"]').text('Überschrift in großen Kacheln anzeigen');
}


// ***** Switch color schemes *****
function handleColorSwitch (jNode) {
    $(jNode).addClass('re-done');

    //init
    let colorSchemes = ['dark', 'fineGrey', 'lighterGrey', 'retroBlue'];
    let colorSchemeNames = ['Dark (Romeo)', 'Fine Grey (RomeoEnhancer)', 'Lighter Grey', 'Retro Blue'];
    let selectedIndex = colorSchemes.indexOf(localStorage.getItem('REcolorScheme'));
    if (selectedIndex == -1) selectedIndex = 1;
    let newIndex = selectedIndex;
    $('.js-grid-style-selector').clone().insertBefore($('.js-grid-style-selector').siblings().first()).removeClass('js-grid-style-selector').addClass('re-color-scheme-switch');
    $('.re-color-scheme-switch').find('summary > div > span').text('Design').append(`<strong><a class="re-color-accept ml+"></a></strong> `);
    $('.re-color-scheme-switch').find('summary > div + span').text(colorSchemeNames[selectedIndex]);
    $('.re-color-scheme-switch').find('input').prop('checked', false).removeAttr('checked').each(function(index) {
        $(this).attr('name', 'color-scheme').attr('id', `re-color-${index}`).attr('value', colorSchemes[index]);
        $(this).siblings('label').attr('for', `re-color-${index}`).find('span').text(colorSchemeNames[index]);
        if (index == selectedIndex) {
            $(this).siblings('div').removeClass('hidden');
        } else {
            $(this).siblings('div').addClass('hidden');
        }
    });

    //toggle list
    $('.re-color-scheme-switch').find('summary').off().on('click', () => {
        $('.re-color-scheme-switch').find('summary > div + span').toggle();
        localStorage.setItem('REcolorScheme', colorSchemes[newIndex]);
        if (newIndex != selectedIndex) {
            location.reload();
        }
    });

    //change selection
    $('.re-color-scheme-switch').find('fieldset').off().on('change', 'input', function() {
        $('.re-color-scheme-switch').find('input').siblings('div').addClass('hidden');
        $(this).siblings('div').removeClass('hidden');
        newIndex = colorSchemes.indexOf($(this).val());
        $('.re-color-accept').text(newIndex != selectedIndex ? 'Auswahl übernehmen' : '');
        $('.re-color-scheme-switch').find('summary > div + span').text(colorSchemeNames[newIndex]);
    });
}


// ***** Show selected bookmark in filter icon title and text *****
function handleBookmark (jNode) {
    // console.log('handleBookmark');

    let selectedBookmark = $('div[class^="js-bookmarks-list"] div[class*="item__is-selected"] a').text().trim();
    if (selectedBookmark) {
        $('div.js-filter-button button').attr('style', 'color:rgb(250,250,250); background-color:transparent');
        $('div.js-filter-button button title').text(`Lesezeichen: ${selectedBookmark}`);
        $('div.js-filter-button button span').not('.re-add').addClass('re-filter-options-text');
        $('div.js-filter-button button').not(':has(.re-add)').append(`<span class="re-add re-filter-bookmark-name mr">${selectedBookmark}</span>`);
        $('div.js-filter-button button span').attr('title', `Lesezeichen: ${selectedBookmark}`);
        //$('nav.js-navigation li.js-filter-button div.js-filter-button button').attr('title', `Lesezeichen: ${selectedBookmark}`);
        $('button.ui-navbar__button--bookmarks').attr('title', 'Lesezeichen auswählen');
    } else {
        $('div.js-filter-button button span.re-filter-options-text').removeClass('re-filter-options-text');
        $('div.js-filter-button button span.re-add').remove();
    }
}


// ***** Preview unread messages in title tag, delete by clicking blue badge *****
function previewMessage (jNode) {
    $(jNode).addClass('re-done');
	let profileId = $(jNode).closest('a').attr('href').match(/\d{3,}/);
    if (profileId) {
	    $(jNode).closest('a').addClass('re-id' + profileId);
	    let msgCount = parseInt($(jNode).text());
	    let jsonParam = 'lang=de&length=' + msgCount + '&filter[folders][]=RECEIVED&filter[partner_id]=' + profileId;
	    let msgText = '';
	    let thisId = '.re-id' + profileId;
	    $.ajax({headers: ajaxHead(), url: '/api/v4/messages?' + jsonParam}).done(function (data) {

    		//preview
	    	for (let i = msgCount-1; i >= 0; i--) {
		    	msgText += '\r' + data.items[i].text + '\r';

                //handle links
                if (data.items[i].attachments) {
                    for (let item of data.items[i].attachments) {
                        if (item.type == 'COMMAND') {
                            // console.log('attachments COMMAND');
                            msgText = msgText.replace(`[[${item.index}]]`, `[${item.params?.text}]`);
                        }
                    }
                }

    		}
	    	$(thisId).attr('title', msgText);
            $(thisId).find('img').parent('div').attr('title', msgText);

            //delete unread
            $(jNode).parent('div').wrap(`<div style="margin:-.5rem; padding:.5rem; ${(touch.matches) ? 'margin:0 0 -.5rem -.5rem' : ''}"></div>`).parent().attr('title', 'Löschen').off().on('click', function () {
                if (confirm(msgCount + ' Nachrichten ungelesen löschen?')) {
                    for (let i = msgCount-1; i >= 0; i--) {
                        $.ajax({url: '/api/v4/messages/' + data.items[i].id + '?expand=from',
                                headers: ajaxHead(),
                                method: 'DELETE'
                               })
                        .done(function (data) {
                            $(jNode).closest('a[href^="/messenger/chat"]').attr('title', 'Liste aktualisieren').off().on('click', function() {
                                $('#messenger .js-navigation a.is-selected')[0].click();
                                return false;
                            }).children('div').replaceWith(
                                `<div style="font-size:.925rem;color:rgb(255,255,255,.8)">– ungelesen gelöscht –</div>`
                            );
                        })
                    }
                }
                return false;
            })
        });

        //highlight profile name
        $(jNode).closest('a').find('p[class^="BodyText"]').attr('style', 'color:rgb(255,255,255,1); opacity:1');
    }
}


// ***** Show last login and location in message thread *****
function showLoginLocation (jNode) {

    //placeholder for login and location
    $('section.js-detail > div').not(':has(.re-login-location)').append(
        `<div class="re-login-location re-add"></div>`
    );

    if ($('.js-correspondence > div').filter('.re-add').length) return;

    let profileId = location.pathname.match(/\d{3,}$/);
	let name = '', country = '', distance = '', sensor = '';
    let loginTime = '', loginLocalTime = '', timeTag = '', lastSince = '', offlineSince = '';
	$.ajax({headers: ajaxHead(), url: `/api/v4/profiles/${profileId}?expand=partner&lang=de`})

	.done(function (data) {
        $('.js-correspondence > div').addClass('re-add');

		//last login
		if (data.last_login && data.online_status) {
			loginTime = new Date(data.last_login.slice(0,-5)+'.000Z');
            loginLocalTime = dateTime(loginTime);
			timeTag = dateTime(loginTime, !mobile.matches);
            lastSince = `${data.online_status == 'OFFLINE' ? 'Zuletzt online:' : 'Online seit:'}`;

            if (($(jNode).closest('div').parent().find('[class*="OnlineStatus"]')).length == 0) {
                offlineSince = `<span class="icon icon-last-login-hours mr-- re-add" style="font-size:.75rem; color:rgb(250,250,250,.75)" title="${lastSince} ${loginLocalTime}"> ${touch.matches ? '' : timeTag}</span>`;
            };

		}

		//location, distance
		if (data.location?.name) {
			name = `<a class="re-link-idle" target="_blank" href="https://google.com/maps/place/${data.location.name}" rel="noreferrer noopener" title="Ort in Google Maps anzeigen">${data.location.name.trim()}</a>`;
		}
        if (data.location?.country && (data.location?.distance > 50000 || data.location?.distance == null)) {
            country = `, ${data.location.country}`;
        }
        if (data.location?.distance >= 0) {
            if (data.location.distance < 1000) {
                distance = ' • ' + data.location.distance + 'm';
            } else if (data.location.distance < 50000) {
                distance = ' • ' + (Math.round(data.location.distance/100)/10).toLocaleString('de-DE') + ' km';
            } else {
                distance = ' • ' + (Math.round(data.location.distance/1000)) + ' km';
            }
        }
        if (data.location?.sensor) {
            sensor = '<span class="icon icon-gps-needle icon-badge mr-" style="font-size:.85em"></span>';
		}
	})

	.always(function (data) {
        $('section.js-detail div.re-login-location').html(`
            <div class="re-msg-location">${sensor}${name}${country}${distance}</div>
            <div class="re-msg-login" title="${lastSince} ${loginLocalTime}">
            <span class="re-touch">${lastSince} ${loginLocalTime}</span></div>
            <div class="re-msg-offline">${offlineSince}</div>`
        );
    });
}


// ***** Add copy to message thread options menu *****
function threadOptionsMenu (jNode) {
	$(jNode).find('li').first().not('.re-done').addClass('re-done').clone().appendTo($(jNode)).on('click', function() {
        let profileId = '', profileName = '';
        if ($(this).closest('#messenger').length) {
            profileId = location.pathname.match(/\d{3,}/);
            profileName = $('#messenger div.js-correspondence').find('a > p[class^="BodyText"]').first().text().trim();
        } else {
            profileId = xhrFull.id;
            profileName = xhrFull.name;
        }
        copyMessageThread(profileId, profileName);
		return false;
	}).attr('id', 'options_copy').find('span').text('Kopieren');
}


// ***** Zoom footprints list *****

//init
let setFootprintZoom = (localStorage.getItem('REfootprintZoom') === 'true');

function handleFootprints (jNode) {
    setFootprintZoom ? $('.js-profile-footprints').addClass('re-zoom') : $('.js-profile-footprints').removeClass('re-zoom');
    $('.js-profile-footprints header span').last().not(':has(.re-add)').wrapInner(
        `<a class="re-link mr re-add" style="font-size:1.2rem" title="Vergrößern" href="">- +</a>`
    ).on('click', function() {
        setFootprintZoom = !setFootprintZoom;
        localStorage.setItem('REfootprintZoom', setFootprintZoom);
        $('.js-profile-footprints').toggleClass('re-zoom');
        return false;
    });
}


// ***** Filter by "no entry" *****
function handleFilterNoEntry (jNode) {

    //insert button
    $(jNode).addClass('re-done').children('div').first().after(`
        <div class="re-add layout mt mh++">
        <a class="re-button-no-entry ui-tag ui-tag--center" href="">＋ keine Angabe
        <span class="icon icon-small icon-info ml-" title="Zeigt auch Profile, die zu den ausgewählten Filterkategorien keine Angabe enthalten"
        aria-label="Zeigt auch Profile, die zu den ausgewählten Filterkategorien keine Angabe enthalten"></span>
        </a>
        </div>`
    ).next('div.re-add').off().on('click', function() {
        filterNoEntry = !filterNoEntry;
        localStorage.setItem('REfilterNoEntry', filterNoEntry);

        //toggle button
        $('.re-button-no-entry').toggleClass('ui-tag--selected');

        //reload radar tab
        if ($('button.cjTnhw, button.jWDQmN').length) $('button.cjTnhw, button.jWDQmN').get(0).click();
        return false;
    });
    if (filterNoEntry) $('.re-button-no-entry').addClass('ui-tag--selected');
}


// ***** Link contact icons in messages list entries *****
function handleMessage (jNode) {
    // console.log('handleMessage');
	let profileId = new Array;
    profileId = $(jNode).attr('href').match(/\d{3,}/);
	if (! profileId) profileId = location.pathname.match(/\d{3,}/);
    $(jNode).not(':has(a.re-add)').find('svg').has('path[d^="M4 8a4"]').wrap(
		`<a href="/messenger/contacts/all/${profileId}" class="re-add"></a>`
	);
	$(jNode).not(':has(a.re-add)').find('svg').has('path[d^="M8.039"]').wrap(
		`<a href="/messenger/contacts/blocked/${profileId}" class="re-add"></a>`
	);
    $(jNode).find('span > div > p[class^="SpecialText"]:contains("Gelesen")').text('Gelesen ✓');

    //only for last item in list
    if (!$(jNode).closest('.reactView').next('.reactView').length) {
        //...
        // console.log('message list complete');
    };
/*     if (! $('#messenger a[href="/messenger/chat"][aria-current="page"]').length) {
        $('#messenger a[href="/messenger/contacts"]').removeAttr('aria-current');
        $('#messenger a[href="/messenger/chat"]').attr('aria-current', 'page');
    }
    console.log('chat'); */
}


// ***** Open links in messages without opening flyout menu *****
function handleMessageLink (jNode) {
    $(jNode).off().on('click', function() {
        (this.target) ? window.open(this.href, this.target, this.rel) : changeUrl(this.href);
        return false;
    });
}


// ***** Scroll to last message in thread *****
function handleMessageScroll (jNode) {
    // console.log('scrollIntoView');
    $(jNode).addClass('re-done').closest('.message__content').addClass('re-done');
    $('#messages-list .message__content').last().not('.re-done')[0]?.scrollIntoView({block: 'start'});
    // $(jNode).addClass('re-done');
    // $('#messages-list .message__content').last()[0]?.scrollIntoView({block: 'start'});
}


// ***** Add message icons to contact list entries *****
function handleContacts (jNode) {
	let profileId = new Array;
    profileId = $(jNode).attr('href').match(/\d{3,}$/);
	if (! profileId) profileId = location.pathname.match(/\d{3,}$/);
	$(jNode).find('p[class^="BodyText-"] > span, span > span').last().not(':has(a)').prepend(
		`<a class="icon icon-chat re-icon re-idle ml-- mr-" title="Messages" href="/messenger/chat/${profileId}"></a>`
	);
/*     if (! $('#messenger a[href="/messenger/contacts"][aria-current="page"]').length) {
        $('#messenger a[href="/messenger/chat"]').removeAttr('aria-current');
        $('#messenger a[href="/messenger/contacts"]').attr('aria-current', 'page');
    }
    console.log('contacts'); */
}


// ***** Prompt for removing contacts tags *****
function handleTagRemove (jNode) {
    $(jNode).titleLabel('Löschen').off().on('click', function() {
        return confirm(`»${$(this).prev().text().trim()}« löschen? \rAlle Zuweisungen zu Kontakten gehen verloren.`);
    });
}


// ***** Click to refresh tab *****
function handleTabRefresh (jNode) {
    if (testMode) console.log('handleTabRefresh');
    $(jNode).off().on('click', function() {
        if (testMode) console.log('doTabRefresh');
        // $('#messenger .js-scrollable').not('.is-hidden')[0].scrollTo({top:-1000, behavior: "smooth"});
        const e = jQuery.Event( "DOMMouseScroll",{delta: -650} );
        $('#messenger .pulltorefresh').trigger(e);
        $('#messenger .pulltorefresh').show()[0].style.height = '300px';
    });
}


// ***** Link user names on discover page to messages *****
function handleContactStrip (jNode) {
	let replacePattern = /(.*\/(profile|hunq|group)\/)([-\w]*)(.*)/;
	let profileLink = $(jNode).attr('href');
    $(jNode).attr('href', profileLink.replace(/\/group\//, '/profile/'));
	let profileName = profileLink.replace(replacePattern, '$3');
	let baseUrl = '/messenger/chat/';
	$(jNode).find('div[class^="Name-"]').attr('title', profileName)/*.wrapInner(
		`<a class="re-link-idle" title="${profileName}  |  Messages" href="${baseUrl}${profileName}"></a>`
	).children()*/.off().on('click', function() {
		openByName(baseUrl, profileLink, profileName);
		return false;
	}).attr('style', `${profileLink.match(/^\/hunq\//) ? 'color:#fc193c' : ''}`);
}


// ***** Mark common groups *****
function handleGroupTiles (jNode) {
    $(jNode).addClass('re-done');
    (async() => {
        while (! commonGroupsLoaded) await new Promise(resolve => setTimeout(resolve, 300));
        // console.log('handleGroupTiles');
        let jNodeGroupTiles = $(jNode).closest('a');
        if (jNodeGroupTiles.attr('href')?.match(/^\/group\//)) {
            const profileName = jNodeGroupTiles.attr('href').match(/[-\w]+$/);
            const nameIndex = (item) => item.name == profileName;
            if (commonGroupsList.findIndex(nameIndex) > -1) {
                jNodeGroupTiles.addClass('re-common-group');
                jNodeGroupTiles.find('p').last().attr('title', 'Du bist Mitglied in dieser Gruppe');
            }

            //show full group name in title
            jNodeGroupTiles.find('p').first().attr('title', $(jNode).find('p').first().text().trim());
        }

        //blur nsfw placeholder
/*         if (jNodeGroupTiles.has(`div[style*="${nsfwPlaceholder}"]`).length) {
            let tilePicture = jNodeGroupTiles.children('div').attr('style');
            jNodeGroupTiles.addClass('re-nsfw-placeholder').attr('style', `display:block; ${tilePicture} background-size:cover`).attr('title', 'Softcore-Bild');
        } */
    })();
}


// ***** Sort EyeCandy on startpage by Nearby or Activity *****
function handleDiscoverEyecandy (jNode) {
    $(jNode).not('.re-done').addClass('re-done').append(`
        <a class="re-link re-eyecandy-toggle ml" title="Umschalten" href="">
        <!--<span>${$('a[href^="/radar/distance"] span').first().text().trim()}</span>
        <span>${$('a[href^="/radar/login"] span').first().text().trim()}</span>-->
        <span>Entfernung</span>
        <span>Aktivität</span>
        <svg aria-hidden="true" viewBox="0 0 10 6" height="6" width="10">
        <path fill-rule="evenodd" d="M5.707 5.707a1 1 0 0 1-1.414 0l-4-4A1 1 0 0 1 1.707.293L5 3.586 8.293.293a1 1 0 0 1 1.414 1.414l-4 4Z" clip-rule="evenodd"></path>
        </svg>
        </a>`
    ).children().off().on('click', function() {
        eyecandyActive = !eyecandyActive;
        localStorage.setItem('REeyecandyActive', eyecandyActive);
        $('.re-eyecandy-toggle').toggleClass('is-selected');
        $('.js-navigation a[aria-current="page"]')[0].click();
        return false;
    });
    if (eyecandyActive) $('.re-eyecandy-toggle').addClass('is-selected');
}


// ***** Localize link to blogs *****
function handleBlogLinks (jNode) {
    $(jNode).off().on('click', function(jNode) {
        let lang = $('html').attr('lang');
        let defaultUrl = $(this).attr('href');
        let localeUrl = defaultUrl.replace(/(\/)(\w\w)(\/blog\/.*)/, `$1${lang}$3`);
        if (localeUrl.match(/\/blog\//) && ! localeUrl.endsWith('/')) localeUrl += '/';
        let url = '';
        $.ajax({ headers: {Range: 'bytes=0-0'}, url: localeUrl })
            .done(() => {
            url = localeUrl;
        })
            .fail(() => {
            url = defaultUrl;
        });
        (async() => {
            while (! url) await new Promise(resolve => setTimeout(resolve, 300));
            window.open(url, '_blank');
        })();
        return false;
    });
}


// ***** Add edit icon to travel location item *****
function handleTravelLocationList (jNode) {
    $(jNode).addClass('re-done');
    $(jNode).closest('svg').after(
        `<a href="/explore/edit" class="re-edit-travel icon icon-pen pv-- ph-" style="line-height:1rem !important; font-size:1.1rem" title="Reiseziel ändern"></a>`
    );
}


// ***** Add message icons to discover, radar, visitor list, search results, and group member list, link contact icons *****
function handleTiles (jNode) {
    let jNodeTiles = $(jNode).closest('a, button');
    let profileName = $(jNode).text().trim();
    let profileLink = `/${(jNodeTiles.attr('href')?.match(/^\/hunq\//) ? 'hunq' : 'profile')}/${profileName}`;

    //add visit icons
    let visitReceivedTime = '', visitMadeTime = '', index = -1;
    const nameIndex = (item) => item.name == profileName;
    (async() => {
        while (! (visitorsLoaded && visitsLoaded)) await new Promise(resolve => setTimeout(resolve, 300));
        // console.log('visitors await');
        index = visitorsList.findIndex(nameIndex);
        if (index >= 0) visitReceivedTime = new Date(visitorsList[index].date_visited);
        index = visitsList.findIndex(nameIndex);
        if (index >= 0) visitMadeTime = new Date(visitsList[index].date_visited);

        //visits made page
        if ($(jNode).closest('#visited-grid').length) {
            if (visitReceivedTime) {
                $(jNode).parent().parent().children().first().not(':has(.icon-visitor)').append(
                    `<a class="icon icon-visitor re-icon re-icon-visitor ml-" title="Hat mich besucht: ${weekTime(visitReceivedTime)}" href="/visitors"></a>`
                ).children().last().off().on('click', function() {
                    changeUrl(`/visitors`);
                    return false;
                });
            }
            if ($(jNodeTiles).find('time').length) $(jNodeTiles).find('time').text(weekTime(visitMadeTime)).attr('title', weekTime(visitMadeTime));

        //other
        } else {
            if (visitMadeTime) {
                $(jNode).parent().parent().children().first().not(':has(.icon-visitor)').append(
                    `<a class="icon icon-visitor re-icon re-icon-visited ml-" title="Von mir besucht: ${weekTime(visitMadeTime)}" href="/visitors/me"></a>`
                ).children().last().off().on('click', function() {
                    changeUrl(`/visitors/me`);
                    return false;
                });
            }
            if ($(jNodeTiles).find('time').length) $(jNodeTiles).find('time').text(weekTime(visitReceivedTime)).attr('title', weekTime(visitReceivedTime));
        }
    })();

    //link username in list view
    if ($(jNode).closest('button').length) {
        $(jNode).not(':has(.re-link-idle)').wrapInner(
            `<a class="re-link-idle" title="${profileName}" href="${profileLink}"></a>`
        ).off().on('click', function() {
            changeUrl(`${profileLink}`);
            return false;
        });
    }

	//add message icon
    if (! location.pathname.match(/\/radar\/home|\/hunqz\/home|\/visitors|\/explore|\/eyecandy|\/messenger/)) {
        let baseUrl = '/messenger/chat/';
        $(jNode).parent().not(':has(.icon-chat)').append(
            `<a class="icon icon-chat re-icon re-idle ml-" title="Messages" href="${baseUrl}${profileName}"></a>`
        ).children().last().on('click', function() {
            openByName(baseUrl, profileLink, profileName);
            return false;
        });
    }

    //link contact icon
	jNodeTiles.find('svg').has('path[d^="M4 8a4"]').not('.re-contact').addClass('re-contact').wrap(
		`<a class="re-idle-no-hover re-contact" title="Kontakt bearbeiten" href="/messenger/contacts/all/${profileName}"></a>`
	);
	jNodeTiles.find('a.re-contact').off().on('click', function() {
		openByName('/messenger/contacts/all/', profileLink, profileName);
        // console.log(profileLink, profileName);
		return false;
	});
	jNodeTiles.find('svg').has('path[d^="M8.039"]').not('.re-contact-blocked').addClass('re-contact-blocked').wrap(
		`<a class="re-idle-no-hover re-contact-blocked" title="Kontakt bearbeiten" href="/messenger/contacts/blocked/${profileName}"></a>`
	);
	jNodeTiles.find('a.re-contact-blocked').off().on('click', function() {
		openByName('/messenger/contacts/blocked/', profileLink, profileName);
		return false;
	});

    //blur nsfw placeholder
    if (jNodeTiles.has(`div[style*="${nsfwPlaceholder}"]`).not(':has(.LIST)').length) {
        let tilePicture = jNodeTiles.children('div').attr('style');
        jNodeTiles.addClass('re-nsfw-placeholder').attr('style', `display:block; ${tilePicture} background-size:cover`).attr('title', 'Softcore-Bild');
    }

    //add + to distance if travel (if not made via CSS)
        // if ((travelMode && location.pathname.match(/^\/(radar|groups|eyecandy)\//)) || location.pathname.match(/^\/explore\//) || (location.pathname.match(/^\/hunqz\//) && $('.ui-navbar').has('path[d^="M6 8c-1"]').length)) {
        if (location.pathname.match(/^\/explore\//) || (location.pathname.match(/^\/hunqz\//) && $('.ui-navbar').has('path[d^="M6 8c-1"]').length)) {
        // if ((travelMode && location.pathname.match(/^\/(radar\/(distance|login|new)|groups\/)/)) || location.pathname.match(/^\/explore\//) || (location.pathname.match(/^\/hunqz\//) && $('.ui-navbar').has('path[d^="M6 8c-1"]').length)) {
            if (jNodeTiles.find('svg + p[class^="SpecialText"]').not('.re-add').text().match(/(\d[\d\.,]*\s?(km|m|mi|ft))/)) {
                let distance = `+${jNodeTiles.find('svg + p[class^="SpecialText"]').html()}`;
                jNodeTiles.find('svg + p[class^="SpecialText"]').html(distance).addClass('re-add');
            }
        }

    //only in radar, hunqz, eyecandy
    if ($(jNode).closest('#profiles, #eyecandy-results').length) {
        // console.log('radar');

        //link username to preview
        $(jNode).not(':has(.re-link-idle)').wrapInner(
            `<a class="re-link-idle" title="${profileName}  |  Vorschau" href="${profileLink}"></a>`
        ).off().on('click', function() {
            changeUrl(`${profileLink}/preview`);
            return false;
        });
    }

    //only for last tile in radar, travel, hunqz, eyecandy
    if ($(jNode).closest('#profiles, #explore-grid, #eyecandy-results').length && !$(jNode).closest('div.search-results__item').next('div.search-results__item').length && !$(jNode).closest('li').next('li').length) {
        if (testMode) console.log('tile stats');

        //show count of profiles, Plus, travelling, and GPS in title tag of selected tab
        let loadTime = new Date().toLocaleTimeString('de-DE') + ' aktualisiert';
        let profiles = $(':is(#profiles, #explore-grid, #eyecandy-results) :is(div.BIG, div.SMALL, div.LIST)').length;
        let profilesPlus = '', percentPlus = '';
        if ($('#profiles .search-results--mixed-tiles, #explore-grid > ul > ul, #eyecandy-results > ul > ul').length) {
            profilesPlus = $(':is(#profiles, #explore-grid, #eyecandy-results) div.BIG').length;
            percentPlus = (profiles > 0 ? ' (' + (Math.round(profilesPlus/profiles*1000)/10).toLocaleString('de-DE') + ' %)' : '');
            profilesPlus =  ' • ' + profilesPlus + ' Plus' + percentPlus;
        }
        let profilesTravel = '', percentTravel = '';
        profilesTravel = $(':is(#profiles, #explore-grid, #eyecandy-results) svg > path[d^="M10.0452"]').length;
        percentTravel = (profiles > 0 ? ' (' + (Math.round(profilesTravel/profiles*1000)/10).toLocaleString('de-DE') + ' %)' : '');
        profilesTravel =  `${profilesTravel} ${(profilesTravel == 1 ? 'Reisender' : 'Reisende')}${percentTravel}`;
        let profilesGPS = '', percentGPS = '';
        profilesGPS = $(':is(#profiles, #explore-grid, #eyecandy-results) svg > path[d^="M11.94"]').length;
        percentGPS = (profiles > 0 ? ' (' + (Math.round(profilesGPS/profiles*1000)/10).toLocaleString('de-DE') + ' %)' : '');
        profilesGPS =  ' • ' + profilesGPS + ' GPS' + percentGPS;
        profiles += ` ${(profiles == 1 ? 'Profil' : 'Profile')} geladen`;
        $('.js-main-stage .js-navigation nav a[aria-current="page"], .js-main-stage header > nav > a[aria-current="page"], div.js-nav-item, .ui-navbar header > h1').attr(
            'title', `${loadTime}\r${profiles}${profilesPlus}\r${profilesTravel}${profilesGPS}`
        );
    }
}


// ***** Add message icons to non-message Activity Stream entries; handle group related entries; add settings icon *****

//init
let streamShowAll = (localStorage.getItem('REstreamShowAll') === 'true');

function handleStream (jNode) {
    let jNodeStream = $(jNode).closest('a');
	let bodyLink = jNodeStream.attr('href');
    let profileLink = '', profileName = '';
    let baseUrl = '/messenger/chat/';
    let itemText = jNodeStream.find('span.listitem__text').not('.thumbnail__info');
    if (bodyLink != undefined) {
        let replacePattern = /(.*\/(profile|hunq|groups)\/)([-\w]*)(.*)/;
        profileLink = jNodeStream.parent().find('a').attr('href');
        profileName = profileLink.replace(replacePattern, '$3');

        //link contact icon
        jNodeStream.find('svg').has('path[d^="M4 8a4"]').not('.re-contact').addClass('re-contact').wrap(
            `<a class="re-idle-no-hover re-contact" title="Kontakt bearbeiten" href="/messenger/contacts/all/${profileName}"></a>`
        );
        jNodeStream.find('a.re-contact').off().on('click', function() {
            openByName('/messenger/contacts/all/', profileLink, profileName);
            return false;
        });
        jNodeStream.find('svg').has('path[d^="M8.039"]').not('.re-contact-blocked').addClass('re-contact-blocked').wrap(
            `<a class="re-idle-no-hover re-contact-blocked" title="Kontakt bearbeiten" href="/messenger/contacts/blocked/${profileName}"></a>`
        );
        jNodeStream.find('a.re-contact-blocked').off().on('click', function() {
            openByName('/messenger/contacts/blocked/', profileLink, profileName);
            return false;
        });
    }
    if (bodyLink != undefined && ! bodyLink.match('/messenger/chat/')) {

        //add message icon
        if (profileName) {
            jNodeStream.find('p[class^="BodyText-"]').not(':has(a,img)').prepend(
                `<a class="icon icon-chat re-icon mr-" title="Messages" href="${baseUrl}${profileName}"></a>`
            ).children().last().on('click', function() {
                openByName(baseUrl, profileLink, profileName);
                return false;
            });
        }

        //italic if system text
        itemText.attr('style', 'font-style:italic');

        //decode html entities in group names
        itemText.html(itemText.text().trim());

        //add icon if group picture, add class for toggle
        let jNodeGroupPicture = jNodeStream.has('img.thumbnail').not(':has(span.icon-heart, span.icon-camera-icon, .re-add)');
        jNodeGroupPicture.find('span.listitem__timestamp').after(
            `<span class="clr-ui-text listitem__highlight--expanded re-add"><span class="icon icon-group-members"></span></span>`
        );
        $(jNodeGroupPicture).parent().addClass('re-group-item');

        //move text to title on non-touch devices if group picture
        if (! touch.matches) {
            // jNodeGroupPicture.attr('title', jNodeGroupPicture.find('span.listitem__text').first().text().trim());
            // jNodeGroupPicture.find('span.listitem__text').first().remove();
        }

        //hide group pictures of blocked users
        // $(jNodeGroupPicture).has('path[d^="M8.039"]').parent().addClass('re-group-item').hide();
    }

    //add toggle and settings
    // $('div.stream__content div.js-list').not(':has(div.re-add)').prepend(`
    $('div.stream__content').not('.re-done').addClass('re-done').before(`
        <div class="re-stream-toggle-div">
            <a class="re-link re-stream-toggle" title="Umschalten" href="">
                <span>MIT Gruppenbildern<em></em></span>
                <span>OHNE Gruppenbilder<em></em></span>
                    <svg aria-hidden="true" viewBox="0 0 10 6" height="6" width="10">
                        <path fill-rule="evenodd" d="M5.707 5.707a1 1 0 0 1-1.414 0l-4-4A1 1 0 0 1 1.707.293L5 3.586 8.293.293a1 1 0 0 1 1.414 1.414l-4 4Z" clip-rule="evenodd"></path>
                    </svg>
                </a>
            <a href="/me/notifications" class="icon icon-settings re-icon re-link p-" title="Activity Stream anpassen"></span></a>
        </div>`
    );
    $('.re-stream-toggle').off().on('click', function() {
        streamShowAll = !streamShowAll;
        localStorage.setItem('REstreamShowAll', streamShowAll);
        $('.re-stream-toggle, .stream__content').toggleClass('re-selected');
        return false;
    });
    if (streamShowAll) $('.re-stream-toggle, .stream__content').addClass('re-selected');

    //insert number of group items
    let groupItems = $('.stream__content .re-group-item').not(':has(path[d^="M8.039"])').length;
    if (groupItems) {
        $('.re-stream-toggle em').html(` (${groupItems})`).parent().attr('title', `Neue Bilder in ${groupItems} Gruppe${(groupItems == 1) ? `` : `n`}`);
    } else {
        $('.re-stream-toggle em').html(` (0)`).parent().attr('title', `Keine neuen Gruppenbilder`);
    }
}


// ***** Profiles: show profile id, visits since; link URLs *****
function handleProfile (jNode) {
    let profileName = $('div.top-info-header p[class^="BodyText"]').first().text().trim();
    let profileType = ($('div.is-profile-loaded').hasClass('profile--hunqz')) ? '/hunqz/profiles' : '/profiles';
    let profilePath = ($('div.is-profile-loaded').hasClass('profile--hunqz')) ? 'hunq' : 'profile';
	let profileId = '', profileIdInfo = '', visits = '', since = '', known = '', known1st = '', known2nd = '', verified = '';
	let albums = 0, profilePictures = 0, albumPictures = 0, quickSharePictures = 0;
    let name = '', country = '', distance = '';
    let loginTime = '', loginLocalTime = '', timeTag = '', lastSince ='';
    let sinceMonthYear = $('section.profile__stats section > p').last().contents().filter(function(){ return this.TEXT_NODE; }).first().text();
    let galleryPath = `/${profilePath}/${profileName}/gallery`;

    let data = xhrFull;
    if (data.id) {
        profileId = data.id;
        profileIdInfo = `Profil-ID: ${data.id}`;
    }
    if (data.visits_count) { //  not 0 or undefined
        visits = `<br>Besucher: ${data.visits_count.toLocaleString('de-DE')}`;
    }
    if (data.creation_date) {
        since = new Date(data.creation_date.slice(0,-5)+'.000Z').toLocaleDateString('de-DE');
        since = 'Mitglied seit: ' + since;
    } else {
        since = sinceMonthYear;
    }

    //known by
    if (data.known_by?.first_degree > 0) {
        known1st = data.known_by.first_degree;
        known2nd = data.known_by.second_degree;
        known = `Bekannt bei ${known1st.toLocaleString('de-DE')} ${known1st == 1 ? 'Nutzer (dieser' : 'Nutzern (diese'} bekannt bei ${known2nd.toLocaleString('de-DE')})`;
    } else {
        known = `Noch nicht bei anderen bekannt`;
    }

    //online time
    if (data.last_login && data.online_status) {
        loginTime = new Date(data.last_login.slice(0,-5)+'.000Z');
        loginLocalTime = dateTime(loginTime);
        timeTag = dateTime(loginTime, 'dateOnly');
        lastSince = `${data.online_status == 'OFFLINE' ? 'Zuletzt online:' : 'Online seit:'}`;
    }

    //show pictures count
    if (data.albumsV2.items_total) {
        for (let item of data.albumsV2.items) {
            if (item.id == 'PROFILE') {
                if (item.pictures) {
                    profilePictures += item.pictures.items_total;
                }
            } else if (item.access_policy == 'SHARED') {
                quickSharePictures += item.items_total;
            } else {
                if (item.pictures) {
                    albumPictures += item.pictures.items_total;
                    //albums += (item.items_total) ? 1 : 0;
                }
            }
        }
        if (profilePictures > 1) {
            $('section.profile__image-strip').not(':has(.re-add)').append(
                `<div class="re-add re-img-count"><div><p>${profilePictures}</p></div></div>`
            ).children().last().on('click', function(){
                changeUrl(`${galleryPath}`);
            }).attr('style', 'cursor:pointer').titleLabel('Alle Alben anzeigen');
        }
        if (quickSharePictures) {
            $('section.js-profile-stats section > div > a > div > div').first().has('svg').not(':has(.re-add)').append(
                `<div class="re-add re-img-count"><div><p>${quickSharePictures}</p></div></div>`
            );
        }
        if (quickSharePictures || albumPictures) {
            $(`section.profile__stats section a[href^="${galleryPath}"] span`).not(':has(.re-add)').append(
                `<span class="re-add" style="font-size:.925em; color:rgb(255,255,255,.6)"> • ${quickSharePictures + albumPictures} Bilder</span>`
            );
        }
    }

    //link location name to maps
    if (data.location.name) {
        name = `<a target="_blank" href="https://google.com/maps/place/${data.location.name}" rel="noreferrer noopener" class="re-link-idle" title="Ort in Google Maps anzeigen">${data.location.name.trim()}</a>`;
    }
    if (data.location.country && (data.location.distance > 50000 || data.location.distance == null)) {
        country = `, ${data.location.country}`;
    }
    if (data.location.distance != null) {
        if (data.location.distance < 1000) {
            distance = ' • ' + data.location.distance + 'm';
        } else if (data.location.distance < 50000) {
            distance = ' • ' + (Math.round(data.location.distance/100)/10).toLocaleString('de-DE') + ' km';
        } else {
            distance = ' • ' + (Math.round(data.location.distance/1000)) + ' km';
        }
    }

    //location, country, distance
    $('div.profile__info svg + p[class^="BodyText"]').first().html(name + country + distance);

    //since, id, known by, visits, online
    $('section.profile__stats section > p').last().addClass('re-profile-stats mb-').html(`${since}<br>${profileIdInfo}<br>${known}${visits}<br>${lastSince} ${timeTag}`);

    //authenticity
    let title = $('.top-info-header p + div > button').attr('title');
    $('.top-info-header p + div > button').not('.re-add').addClass('re-add').find('title').text(`${title}${(known1st) ? ` (${(known1st <= 30) ? known1st : '30+'})` : ''}\n${sinceMonthYear}\n${lastSince} ${timeTag}`);

    //hide visit
    let hideVisitSpacer = $('.profile .top-info-header p[class^="BodyText"]').first().text().trim();
    $('.profile--romeo .top-info-header').prepend(`<span class="re-hide-visit">${hideVisitSpacer}</span>`);
    $('.re-hide-visit').attr('title', 'Profilbesuch verstecken').off().on('click', () => {
        hideVisit(profileId);
    });

    //new
    if (data.is_new) $('.profile .top-info-header').prepend(`<span class="re-profile-new">${hideVisitSpacer}<span>Neu</span></span>`);

    //complete headline
    if (data.headline?.length > 50) {
        $('div.profile__info p[class^="BodyText"]').last().text(data.headline);
    }

    //URLs in headline and profile text
    $('div.profile__info div.reactView > div > p[class^="BodyText"], section.profile__stats details > div > p[class^="BaseText-sc-"]').each(function() {
        let replacedText = linkify($(this).html());
        $(this).html(replacedText);
    });

    //link travel locations to maps
    $('section.profile__stats details').has('#travel-list').find('div:not([role="heading"]) > p:first-child').not(':has(.re-add)').each(function() {
        $(this).wrapInner(
            `<a target="_blank" href="https://google.com/maps/place/${$(this).text().trim()}" rel="noreferrer noopener" class="re-link-idle re-add" title="Ort in Google Maps anzeigen"></a>`
        )
    });

    //move Travel Date and Looking For to top, keeping Albums and B&B at top
    let sectionContainer = 'section.profile__stats > div > div.reactView:last-child > div';
    // $('section.profile__stats details').not('.re-add').has('summary :contains("Ich suche"), summary :contains("Looking For"), summary :contains("Recherche")').prependTo(sectionContainer);
    $('section.profile__stats details').not('.re-add').has('summary :contains("Ich suche"), summary :contains("Looking For"), summary :contains("Recherche")').prependTo(sectionContainer);
    $('section.profile__stats details').has('#travel-list').not('.re-done').addClass('re-done').prependTo(sectionContainer);
    $('section.profile__stats section').not('.re-done').has('img + div > p').addClass('re-done').prependTo(sectionContainer);
    $('section.profile__stats section').not('.re-done').has(`a[href^="${galleryPath}"]`).addClass('re-done').prependTo(sectionContainer);
}


// ***** Handle error page *****
function linksError (jNode) {
    //...
	$(jNode).append(
		`<div style="font-size:0.9em"><br/>...</div>`
	);
}


// ***** Sort groups list by active posts *****

//init
let groupsList = [];
let viewMode = '';
let counter = 0;
let groupsCount = 0;
let groupsRefreshed = false;
let groupsListloadTime = 0;
let lastGroupName = '';
let atoz = false;
let linkTextActive = 'Aktive Beiträge', linkTextDefault = 'Standard';

function recentPosts (jNode) {
    // console.log('recentPosts');

    //insert empty list
    if (! $('nav.re-groups-enh').length) {
        $(jNode).not('.re-groups-def').addClass('re-groups-def').after(
            `<nav class="re-groups-enh is-hidden"></nav>`
        );
    }

	//insert menu
	viewMode = localStorage.getItem('REgroupsListView');
	let linkText = (viewMode == 'active') ? linkTextActive : linkTextDefault;
	$('nav.re-groups-def').closest('div[class*="ReactContainer"]').not(':has(span.re-list-head)').prepend(`
<div class="mh mt- pv-" style="font-size:.85rem; border-bottom:1px solid rgb(255,255,255,.125)">
<span class="re-list-head">Sortierung</span>
<span class="re-list-view ml-" title="Umschalten" role="button" aria-label="Sortierung ändern">${linkText}</span>
<span class="re-list-load icon icon-stathistory pl- pr-" title="Aktualisieren">
<span class="re-list-head ml--"></span>
</span>
</div>`
    );

    //toggle sort mode (recent posts <-> a-z)
    $('.re-list-head').off().on('dblclick', function() {
        if (viewMode == 'active') {
            atoz = !atoz;
            linkText = linkTextActive = (atoz) ? 'A - Z' : 'Aktive Beiträge';
            $('.re-list-view').text(linkText);
            insertPostsList (groupsList);
        }
    });

    if (mobile.matches) {
		$('div.js-header').removeClass('l-hidden-sm');
		$('div.Container--xbtQn').hide();
	}
	if (viewMode !== 'active') {
		$('span.re-list-load').hide();
	}

	//register toggle menu click
	$('span.re-list-view').on('click', function() {
        if (counter == groupsCount) {  //not while building groupsList
            let oldViewMode = localStorage.getItem('REgroupsListView');
            if (oldViewMode == 'active') {
                linkText = linkTextDefault;
                viewMode = 'default';
                $('span.re-list-load').hide();
            } else {
                linkText = linkTextActive;
                viewMode = 'active';
                $('span.re-list-load').show();
            }
            localStorage.setItem('REgroupsListView', viewMode);
            $('span.re-list-view').text(linkText);
            handlePostsList(viewMode);
        }
    });

	//register refresh list click
	$('span.re-list-load').on('click', function() {
        if (counter == groupsCount) {  //not while building groupsList
            groupsList.length = 0;
            counter = 0;
            groupsRefreshed = true;
            groupsListloadTime = new Date().toLocaleTimeString('de-DE');
            $('nav.re-groups-enh').find('a.re-add, button, h4').remove();
            $('nav.re-groups-def').hide();
            handlePostsList(viewMode);
        }
    });
    handlePostsList(viewMode);
}


// ***** Handle posts list *****
function handlePostsList (viewMode) {

	if (viewMode !== 'active') {
		$('nav.re-groups-enh').addClass('is-hidden');
        $('nav.re-groups-def').show();
        let highlighted = 'nav.re-groups-def button';
        if ($(highlighted).length) {
            $(highlighted)[0].scrollIntoView({block: 'center'});
        }
    } else {
		$('nav.re-groups-def').hide();
		$('nav.re-groups-enh').removeClass('is-hidden');
		if (groupsList.length > 0) {
			insertPostsList(groupsList);
		} else {
            if (commonGroupsList[0]?.name == location.href.replace(/(.*\/groups\/member\/)([-\w]+)$/, '$2')) {
                // groupsRefreshed = true;
            }
            groupsListloadTime = new Date().toLocaleTimeString('de-DE');
			$('nav.re-groups-enh').not(':has(.re-add)').prepend(
				'<div class="spinner-container re-add"><div class="spinner"></div></div>'
			);

            $.ajax({headers: ajaxHead(), url: '/api/v4/profiles/me/groups?expand=items.*.(membership,activity)&lang=de&length=1000&pick=items.*.(id,name,display_name,membership.is_admin,is_forum_enabled,activity.posts.*,activity.photos.*,preview_pic.url_token),items_total'})

			.done(function (data) {
				groupsList = [];
				counter = 0;
				groupsCount = data.items_total;
				let ajaxUrl = '', name = '', displayName = '', isAdmin = false, picToken = '', actPosts = 0, countPosts = 0, actPhotos = 0, countPhotos = 0;

				for (let item of data.items) {

                    // loop "posts" for all groups
                    if (item) {
                        name = item.name;
                        displayName = item.display_name;
                        isAdmin = item.membership.is_admin;
                        picToken = (item.preview_pic) ? item.preview_pic.url_token : '';
                        if (item.activity) {
                            actPosts = (item.activity.posts) ? item.activity.posts.last_accessed : 0;
                            countPosts = (item.activity.posts) ? item.activity.posts.count : 0;
                            actPhotos = (item.activity.photos) ? item.activity.photos.last_accessed : 0;
                            countPhotos = (item.activity.photos) ? item.activity.photos.count : 0;
                        } else {
                            actPosts = 0;
                            countPosts = 0;
                            actPhotos = 0;
                            countPhotos = 0;
                        }
                        if (item.is_forum_enabled) {
                            ajaxUrl = `/api/v4/groups/${item.id}/posts?pick=items.*.(date_created,comments.items.*.(date_created))&expand=items.*.(comments)&lang=de&length=5&sort_criteria=COMMENTED_AT_DESC`;
                        } else {
                            ajaxUrl = `/api/v4/groups/${item.id}/posts?pick=items.*.(date_created)&lang=de&length=5&sort_criteria=COMMENTED_AT_DESC`;
                        }

                        $.ajax({headers: ajaxHead(),
                                url: ajaxUrl,
                                custom: {name: name, displayName: displayName, isAdmin: isAdmin, picToken: picToken, actPosts: actPosts, countPosts: countPosts, actPhotos: actPhotos, countPhotos: countPhotos} })

                        .done(function (data) {

                            //save name, timestamp, etc. to array (most recent post or comment)
                            let timeList = [], name = '', displayName = '', time = 0, isComment = false, picToken = '', actPosts = 0, countPosts = 0, actPhotos = 0, countPhotos = 0;
                            for (let item of data.items) {
                                if (item.comments?.items[0]) {
                                    time = item.comments.items[0].date_created;
                                    isComment = true;
                                } else {
                                    time = item.date_created;
                                    isComment = false;
                                }
                                if (time != 0) time = new Date(time.slice(0,-2) + ':00');
                                timeList.push({time: time, isComment: isComment});
                            }

                            //sort by most recent post or comment
                            timeList.sort(function (a,b) {
                                return b.time - a.time;
                            });

                            if (timeList[0]) time = timeList[0].time;
                            if (timeList[0]) isComment = timeList[0].isComment;
                            name = this.custom.name;
                            displayName = this.custom.displayName.trim();
                            isAdmin = this.custom.isAdmin;
                            picToken = this.custom.picToken;
                            actPosts = this.custom.actPosts;
                            countPosts = this.custom.countPosts;
                            actPhotos = this.custom.actPhotos;
                            countPhotos = this.custom.countPhotos;
                            if (actPosts != 0) actPosts = new Date(actPosts);
                            if (actPhotos != 0) actPhotos = new Date(actPhotos);
                            // console.log(displayName, timeList);

                            //add to array
                            groupsList.push({time: time, name: name, displayName: displayName, isAdmin: isAdmin, picToken: picToken, isComment: isComment, actPosts: actPosts, countPosts: countPosts, actPhotos: actPhotos, countPhotos: countPhotos, visited: false});
                        })

                        .always(function (data) {
                            counter++;
                            if (counter >= groupsCount) {
                                insertPostsList(groupsList);
                                return;
                            }
                        });

                    } else {
                        counter++;
                        if (counter >= groupsCount) {
                            insertPostsList(groupsList);
                            return;
                        }
                    }
                }
            });
        }
        $('span.re-list-load span').text(groupsListloadTime.slice(0,-3));
        $('ul.Container--1I9Gx button').click();
	}
}


// ***** Handle groups list after group is loaded *****
function refreshPostsList () {
    if (groupsRefreshed == false || lastGroupName != location.pathname.replace(/^(\/groups\/member\/)([-\w]+)(.*)/, '$2')) {
        lastGroupName = location.pathname.replace(/^(\/groups\/member\/)([-\w]+)(.*)/, '$2');
        groupsRefreshed = false;
    } else {
        groupsRefreshed = true;
    }
    if (viewMode == 'active') insertPostsList (groupsList);
}


// ***** Insert posts list *****
function insertPostsList (groupsList) {

	//sort by a-z or most recent
	groupsList.sort(function (a,b) {
        if (atoz) {
            return b.isAdmin - a.isAdmin || a.displayName.localeCompare(b.displayName);
        } else {
            return b.time - a.time;
        }
    });
	// console.log(groupsList);

	//insert list elements on top of MY GROUPS
	$('nav.re-groups-enh').find('a.re-add, button, div, h4').remove();
	$('nav.re-groups-def').hide();
    let thumbnail = '';
	for (let item of groupsList) {
		thumbnail = (item.picToken) ? `/img/usr/squarish/212x212/${item.picToken}.jpg` : '/assets/76d319082f701e66be89.svg';
		$('nav.re-groups-enh').append(`
<a href="/groups/member/${item.name}" class="re-add re-groups-listitem">
<div class="re-groups-tile" style="background-image:url(${thumbnail})"></div>
<div class="re-groups-entry">
<div class="re-groups-top-row">
<div class="re-groups-name" title="${item.displayName}">${item.displayName}</div>
</div>
<div class="re-groups-bottom-row">
<div class="re-groups-time" title="${(item.isComment) ? 'Letzter Kommentar' : 'Letzter Beitrag'} vom ${item.time.toLocaleString('de-DE').slice(0,-3)}">${dateTime(item.time, !touch.matches)}</div>
<div class="re-groups-activity"></div>
</div>
</div>
</a>`
        );
        if (item.isComment) {
            $('nav.re-groups-enh a.re-add .re-groups-activity').last().append(`
<div class="re-groups-new" style="margin-right:.1em" title="Aktueller Kommentar vom ${item.time.toLocaleString('de-DE').slice(0,-3)}">
<svg label="Aktueller Kommentar" role="img" aria-hidden="false" viewBox="0 0 1024 1024">
<path d="M943.3 408.7c-49.9-49.9-118.9-80.7-195-80.7H222.7l.1-183.5L0 367.4l222.8 222.8.1-183.5h525.4c54.4 0 103.6 22.1 139.3 57.7 35.6 35.7 57.6 84.9 57.6 139.3 0 54.4-22 103.6-57.7 139.3-35.7 35.7-84.9 57.7-139.3 57.7H616.3c-14.2 0-25.7 11.5-25.7 25.7v27.5c0 14.2 11.5 25.7 25.7 25.7h131.9c76.2 0 145.1-30.9 195-80.7 49.9-49.9 80.7-118.9 80.7-195 .1-76.3-30.8-145.3-80.6-195.2z"></path>
</svg>
</div>`
             );
        }
        if (item.actPosts) {
            $('nav.re-groups-enh a.re-add .re-groups-activity').last().append(`
<div class="re-groups-new" title="${item.countPosts} ${(item.countPosts == 1) ? 'neuer Beitrag' : 'neue Beiträge'} seit ${item.actPosts.toLocaleString('de-DE').slice(0,-3)}">
<span style="margin-right:.25em">${item.countPosts}</span>
<svg label="Neue Beiträge" style="font-size:.675em" role="img" aria-hidden="false" viewBox="0 0 100 100">
<path d="M50 0a50 50 0 100 100A50 50 0 1050 0z"></path>
</svg>
</div>`
            );
        }
        if (item.actPhotos) {
            $('nav.re-groups-enh a.re-add .re-groups-activity').last().append(`
<div class="re-groups-new" title="${item.countPhotos} ${(item.countPhotos == 1) ? 'neues Bild' : 'neue Bilder'} seit ${item.actPhotos.toLocaleString('de-DE').slice(0,-3)}">
<span style="margin-right:.25em">${item.countPhotos}</span>
<svg label="Neue Bilder" role="img" aria-hidden="false" viewBox="0 0 1024 1024">
<path d="M656 579c0 80-64 145-144 145s-144-65-144-145 64-145 144-145 144 65 144 145zM512 808c-63 0-120-26-161-68s-67-98-67-162c0-63 26-120 67-162s98-67 161-67 120 25 161 67 67 99 67 162c0 64-26 120-67 162s-98 68-161 68zm449-589H762L644 107c-7-7-16-11-27-11H407c-11 0-20 4-27 11L262 219H63c-35 0-63 28-63 63v583c0 35 28 63 63 63h898c35 0 63-28 63-63V282c0-35-28-63-63-63z"></path>
</svg>
</div>`
            );
        }
        if (item.isAdmin) {
            $('nav.re-groups-enh a.re-add .re-groups-top-row').last().append(`
<div class="re-groups-admin ml-" title="Du verwaltest diese Gruppe" aria-label="Du verwaltest diese Gruppe">
<span>ADMIN</span>
</div>`
            );
        }
        if (item.visited && !groupsRefreshed) {  // dim visited groups
            $('nav.re-groups-enh a.re-add').last().addClass('re-groups-visited');
        }
	}

    //highlight selected item
    $('nav.re-groups-enh a.re-add').each(function(index) {
        if ((!mobile.matches && location.href.match(`${this.href}($|\\/)`)) || (this.href.match(`/groups/member/${lastGroupName}($|\\/)`) && !groupsRefreshed)) {
            if (!groupsRefreshed) $(this)[0].scrollIntoView({block: 'center'});
            $(this).removeClass('re-groups-visited').addClass('re-groups-selected');
            groupsList[index].visited = true;
        }
    });

    //refresh content on re-click
    $('nav.re-groups-enh').off('click').on('click', 'a.re-add', function() {
        groupsRefreshed = false;
        if (location.href.match(`${this.href}($|\\/)`)) {
            $('ul.Container--ZCCAM button').get(0).click();
            if (testMode) console.log ('group refreshed');
            return false;
        }
    });

    //insert separators admin/member if needed
    if (atoz && $('nav.re-groups-enh a.re-add').not(':has(.re-groups-admin)').length) {
        $('nav.re-groups-enh a.re-add').has('.re-groups-admin').first().before(
            `<h4 class="gzwUHp ml- mt- mb--">Admin</h4>`
        );
        $('nav.re-groups-enh a.re-add').has('.re-groups-admin').last().after(
            `<h4 class="gzwUHp ml- mt- mb--">Mitglied</h4>`
        );
    }
}


// ***** Toggle group manage mode *****
function groupManageMode (jNode) {
    if (resigned) $(jNode).not(':has(.re-add)').prepend('<span class="re-add">!</span>');
    $(jNode).off().on('dblclick', function() {
        $(this).find('.re-add').remove();
        resigned = !resigned;
        if (resigned) $(this).prepend('<span class="re-add">!</span>');
    });
}


// ***** Compact view for group posts *****
function groupPostsViewMode (jNode) {
	let viewMode = localStorage.getItem('REgroupPostsView');
	let linkTextCompact = 'Kompakt', linkTextDefault = 'Mit Kommentaren';
	let linkText = (viewMode == 'compact') ? linkTextCompact : linkTextDefault;
	$('div.Container--1cJVr').append(
		'<span class="re-posts-view" title="Umschalten">' + linkText + '</span>' +
		'<span class="layout-item icon icon-dropdown dropdown__arrow"></span>'
	);
	$('span.re-posts-view').on('click', function() {
		let oldViewMode = localStorage.getItem('REgroupPostsView');
		let linkText = linkTextCompact, viewMode = 'compact';
		if (oldViewMode == 'compact') {
			linkText = linkTextDefault;
			viewMode = 'default';
		}
		localStorage.setItem('REgroupPostsView', viewMode);
		$('span.re-posts-view').text(linkText);
		$('span.CommentCount--3uCNR').each(function() {
			handleGroupComment(this);
		});
	});
}


// ***** Show/hide group comments *****
function refreshGroupComments (jNode) {
	let thisNode = $(jNode).find('span.CommentCount--3uCNR');  // span.CommentCount--1Eef2
	handleGroupComment(thisNode);
}


// ***** Handle a single group post *****
function handleGroupComment (thisNode) {
	let viewMode = localStorage.getItem('REgroupPostsView');
	let timestamp = $(thisNode).parent().parent().nextAll().find('span.PostDate--2LVzF').last().text();
	if (viewMode == 'compact') {
		$(thisNode).parent().parent().nextAll().hide();
		if (timestamp == '') {
			$(thisNode).text('Kommentar schreiben');
		} else {
			$(thisNode).after(
				'<span class="ml--"> • ' + timestamp + '</span>'
			);
		}
		$(thisNode).not(':has(a)').wrapInner('<a></a>').off('click').on('click', function() {
			$(thisNode).parent().parent().nextAll().toggle();
		});
	} else {
		$('div.CommentsArea--3iSoQ, div.js-add-comment').show();
		$(thisNode).find('a').contents().unwrap('a');
		$(thisNode).off('click');
		$(thisNode).next('span').remove();
		if (timestamp == '') {
			$(thisNode).text('0 Kommentare');
		}
	}
}


// ***** Localize group post date *****
function handleGroupPostDate (jNode) {
    $(jNode).addClass('re-done');
    let date = $(jNode).text().trim();
    let localeDate = new Date(date).toLocaleDateString('de-DE');
    if (localeDate != 'Invalid Date' && date.length > 4) $(jNode).text(`${localeDate}`).attr('title', `${date}`);
}


// ***** Group posts *****
function handleGroupPosts (jNode) {
    //...
}


// ***** Sort group members by distance from travel location, save sorting permanently *****

//init
let travelName = '';
if (localStorage.getItem('PR_SETTINGS:groups:members:sorting')?.match(/GROUP_JOIN_DATE_DESC|LAST_LOGIN_DESC|NEARBY_ASC/)) {
    sessionStorage.setItem('PR_SETTINGS:groups:members:sorting', localStorage.getItem('PR_SETTINGS:groups:members:sorting'));
} else {
    sessionStorage.setItem('PR_SETTINGS:groups:members:sorting', 'LAST_LOGIN_DESC');
}

function groupTravelLocation (jNode) {
	let viewMode = localStorage.getItem('REgroupTravelLocation');
    let toggleTravel = 'span.re-member-travel';
	$('div.js-members-header div.js-dropdown button').not('.re-done').addClass('re-done').has('div:contains("Entf"), div:contains("In der"), div:contains("Nearby"), div:contains("Cercanos"), div:contains("À prox"), div:contains("Vicini"), div:contains("Por perto")').parent().append(
        `<span class="re-add re-member-travel icon icon-airplane ml- pl" title="Reiseziel" role="img" aria-label="Reiseziel"><span class="pl-"></span></span>`
	);
    handleTravelLocation(viewMode, toggleTravel);
    $('span.re-member-travel').off().on('click', function() {
		let viewMode = localStorage.getItem('REgroupTravelLocation');
        let toggleTravel = 'span.re-member-travel';
        let refreshClick = 'ul.Container--ZCCAM button';
		viewMode = (viewMode == 'travel') ? 'default' : 'travel';
		localStorage.setItem('REgroupTravelLocation', viewMode);
		handleTravelLocation(viewMode, toggleTravel, refreshClick);
	});

    //save sorting permanently
    setTimeout(() => {
        if (sessionStorage.getItem('PR_SETTINGS:groups:members:sorting')?.match(/GROUP_JOIN_DATE_DESC|LAST_LOGIN_DESC|NEARBY_ASC/)) {
            localStorage.setItem('PR_SETTINGS:groups:members:sorting', sessionStorage.getItem('PR_SETTINGS:groups:members:sorting'));
        }
    }, 300);
}


function handleTravelLocation (viewMode, toggleTravel, refreshClick) {
    if (testMode) console.log('refreshClick');
    if (viewMode == 'travel') {
        setTimeout(() => {
            $(toggleTravel).addClass('re-selected');
        }, 300);
        if (xhrTravelLat && xhrTravelLong) {
            $.ajax({headers: ajaxHead(), url: `/api/geocoder/private/name?lat=${xhrTravelLat}&lon=${xhrTravelLong}&lang=de`})

            .done(function (data) {
                if (data[0].name) {
                    travelName = data[0].name;
                }
                let travelEdit = '<a href="/explore/edit" class="re-edit-travel icon icon-pen pl-" style="line-height:inherit" title="Reiseziel ändern"></a>';
                $(toggleTravel).find('span').html(travelName).attr('title', travelName).addClass('pl-');
                $(toggleTravel).next('a.re-edit-travel').remove();
                $(toggleTravel).after(travelEdit);
                travelMode = true;
                if (refreshClick) $(refreshClick).get(0).click();
            });

        } else {
            $.ajax({headers: ajaxHead(), url: `/api/v4/locations/travel`})

            .done(function (data) {
                let travelEdit = '';
                if (data.length) {
                    let last = data.length -1;
                    xhrTravelLat = data[last].lat;
                    xhrTravelLong = data[last].long;
                    localStorage.setItem('REtravelLat', xhrTravelLat);
                    localStorage.setItem('REtravelLong', xhrTravelLong);
                    travelName = data[last].name;
                    travelMode = true;
                    travelEdit = '<a href="/explore/edit" class="re-edit-travel icon icon-pen pl-" title="Reiseziel ändern"></a>';
                } else {
                    travelMode = false;
                    travelEdit = '<a href="/explore/new" class="re-edit-travel">Klicken, um ein Reiseziel hinzuzufügen!</a>';
                }
                $(toggleTravel).find('span').html(travelName).attr('title', travelName).addClass('pl-');
                $(toggleTravel).next('a.re-edit-travel').remove();
                $(toggleTravel).after(travelEdit);
                if (refreshClick) $(refreshClick).get(0).click();
            });

        }

    } else {
        setTimeout(() => {
            $(toggleTravel).removeClass('re-selected');
        }, 200);
        $(toggleTravel).find('span').text('').removeAttr('title').removeClass('pl-');
        $(toggleTravel).next('a.re-edit-travel').remove();
        travelMode = false;
        if (refreshClick) $(refreshClick).get(0).click();
   }
}


// ***** Show upload date in photo viewer, link URLs *****
function handleImg (jNode) {
    $(jNode).addClass('re-done');
    // console.log('handleImg');

    //upload date
    let imgName = $(jNode).attr('src');
    let imgNameTxt = uploadDate(`${imgName.substr(imgName.lastIndexOf('/') + 1, 8)}`);
    let info = `<div class="re-add re-img-info"><a title="Upload-Datum" href="${imgName}">${imgNameTxt}</a></div>`;
    $(jNode).closest('li').not(':has(.re-add)').prepend(info);

    //URLs in picture caption
    setTimeout(() => {
        $('.ReactModal__Content li').has('img[src^="/img/usr/original/"]').find('p').not(':has(button)').each(function() {
            let replacedText = linkify($(this).text());
            $(this).html(replacedText);
        });
    }, 0);
}


// ***** Show upload date for single image, click to close *****
function handleSingleImg (jNode) {
    $(jNode).addClass('re-done');

    //upload date
    let imgName = $(jNode).attr('src');
    let imgNameTxt = uploadDate(`${imgName.substr(imgName.lastIndexOf('/') + 1, 8)}`);
    let info = `<div class="re-add re-img-info re-img-single"><a title="Upload-Datum" href="${imgName}">${imgNameTxt}</a></div>`;
    $(jNode).closest('div').after(info);

    //click to close
    $(jNode).closest('div').off().on('click', function() {
        if ($(this).attr('style').match(/scale\(1\)/)) {
            $(this).closest('main').find('button').focus()[0].click();
            return false;
        }
    });
}


// ***** Remove refresh for slide show likes list *****
function handleSlideshowLikes (jNode) {
    $(jNode).closest('div').children('button + div, button').remove();
}


// ***** Show picture info in picture rating *****
function ratingInfo (jNode) {
    $('#picture-rating .re-add').remove();
    $('#picture-rating button').blur();
	let imgName = $('#picture-rating img').attr('src');
    if (imgName) {
        let imgNameTxt = `${imgName.substr(imgName.lastIndexOf('/') + 1, 5)}...`;
        let imgDate = uploadDate(`${imgName.substr(imgName.lastIndexOf('/') + 1, 8)}`);
        let imgNameMax = sessionStorage.getItem('REratingMax');
        imgNameMax = (imgNameMax ? imgNameMax : imgNameTxt);
        if (imgNameTxt >= imgNameMax) {
            sessionStorage.setItem('REratingMax', imgNameTxt);
        }
        let color = (parseInt(imgNameTxt,16) + 1 < parseInt(imgNameMax,16)) ? 'rgb(255,0,0,.8)' : 'rgb(255,255,255,.375)';
        $('#picture-rating button').has('p').after(
            `<a class="re-rating-date re-add" style="color:${color}" title="Upload-Datum" href="${imgName}">${imgDate}</a>`
        );
    }

    //set focus on reload/skip button
    // if (!touch.matches) {
        // $('#picture-rating button[class^="SecondaryButton__Element-"]').focus(); // Aktualisieren
        // $('#picture-rating button[class^="TertiaryButton__Element-"]').addClass('re-rating-skip').focus(); // Überspringen
        // $('#picture-rating button[class^="TertiaryButton__Element-"]').off('keydown').on('keydown', (e) => {
/*         $('#picture-rating').next('div').next('div').trigger('focus').off('keyUp').on('keyUp', (e) => {
            if (testMode) console.log('key: ', e.key);
            if (e.key == '0') {
                // $('#picture-rating button[class^="TertiaryButton__Element-"]')[0].focus().click();
                $('#picture-rating button[class^="TertiaryButton__Element-"]').trigger('focus').trigger('click');
            }
        }); */
    // }
}


// ***** Relogin after timeout *****
function reLogin (jNode) {
    if (testMode) console.log('reLogin');
    if ($(jNode).not('.re-add').addClass('re-add').children('span').filter(':contains("Erneut einloggen"), :contains("Log in again"), :contains("Reconnexion")').length) {
        $(jNode).closest('section').parent('div').addClass('re-relogin-frame');
        $(jNode).closest('section').find('div > button').hide();
        $(jNode).closest('section').find('h1').text('');
        $(jNode).closest('section').find('div > img').replaceWith('<div class="spinner-container"><div class="spinner"></div></div>');
        $(jNode).closest('section').children('p').text('Erneut einloggen ...');
        setTimeout(() => {
            if (testMode) console.log('do reLogin');
            location.reload();
        }, 600);
    } else {
        $(jNode).closest('div[class^="Modal__StyledModal"]').find('section p').off().on('dblclick', function() {
            $(this).closest('div[class^="Modal__StyledModal"]').remove();
            $('body').attr('class', '');
        });
    }
}


// ***** Fetch/XHR *****

//switch test mode
if (typeof GM_info !== 'undefined') {
    localStorage.setItem('REpostFromDeleted', `${(GM_info?.script?.name.match(/-DEV|-BETA/)) ? true : false}`);
    localStorage.setItem('REtestMode', `${(GM_info?.script?.name.match(/-DEV|-BETA/)) ? true : false}`);
}

//init
let xhrTravelLat = localStorage.getItem('REtravelLat');
let xhrTravelLong = localStorage.getItem('REtravelLong');
let travelMode = (localStorage.getItem('REradarTravelLocation') === 'travel');
let directMsg = 0;
let resigned = false;
let xhrFull = '';
let eyecandyActive = (localStorage.getItem('REeyecandyActive') === 'true');
let filterNoEntry = (localStorage.getItem('REfilterNoEntry') === 'true');
let postFromDeleted = (localStorage.getItem('REpostFromDeleted') === 'true');
let hideNSFW = (localStorage.getItem('REhideNSFW') === 'true');
let testMode = (localStorage.getItem('REtestMode') === 'true');
const nsfwPlaceholder = '3646b0e5af396e593c723abdd3';  // '38830464d7d57357ddc67716bc'
const nsfwPlaceholderBig = '363b566fbda3af7de7f863585e';


// ***** Requests to modify *****
const modifyRequest = (url) => {
    // console.log(url);

    //profile view: 32 instead of 4 groups per scroll
    if (url.match(/\/groups\?length=4/)) {
        if (testMode) console.log('groups match');
        url = url.replace('length=4', 'length=32');
    }

    //sort eyecandy
    if (url.match(/v4\/profiles\/popular/)) {

        //radar
        if (travelMode && ! url.match(/&scrollable=false/)) {
            url = url.replace('sort_criteria=LAST_LOGIN_DESC', 'sort_criteria=NEARBY_ASC');
            url = url.replace(/filter%5Blocation%5D%5Blat%5D\=[-0-9\.]+/, `filter[location][lat]=${xhrTravelLat}`);
            url = url.replace(/filter%5Blocation%5D%5Blong%5D\=[-0-9\.]+/, `filter[location][long]=${xhrTravelLong}`);
        }

        //discover
        else if (! eyecandyActive && url.match(/&scrollable=false/)) {
            url = url.replace('sort_criteria=NEARBY_ASC', 'sort_criteria=LAST_LOGIN_DESC');
        }
    }

    //travel mode
    if (travelMode) {
        if (location.pathname.match(/^\/radar\//)) {
            url = url.replace(/filter%5Blocation%5D%5Blat%5D\=[-0-9\.]+/, `filter[location][lat]=${xhrTravelLat}`);
            url = url.replace(/filter%5Blocation%5D%5Blong%5D\=[-0-9\.]+/, `filter[location][long]=${xhrTravelLong}`);
        }
    }

    //get travel coordinates
    if (location.pathname.match(/^\/explore\//) && url.match(/v4\/profiles\?/)) {
        let loc = location.pathname.match(/[-0-9\.]+/g);
        xhrTravelLat = loc[0];
        xhrTravelLong = loc[1];
        if (testMode) console.log(loc);
        localStorage.setItem('REtravelLat', xhrTravelLat);
        localStorage.setItem('REtravelLong', xhrTravelLong);
    }

    //include "no entry" to filter
    if (filterNoEntry) {
        if (url.match(/\/profiles\?/)) {
            const categories = [
                '&filter%5Bpersonal%5D%5Bgender_orientation%5D%5Bgender%5D%5B0%5D=',
                '&filter%5Bpersonal%5D%5Bgender_orientation%5D%5Borientation%5D%5B0%5D=',
                '&filter%5Bpersonal%5D%5Blooking_for%5D%5B0%5D=',
                '&filter%5Bpersonal%5D%5Bbody_type%5D%5B0%5D=',
                '&filter%5Bpersonal%5D%5Bbody_hair%5D%5B0%5D=',
                '&filter%5Bpersonal%5D%5Bhair_color%5D%5B0%5D=',
                '&filter%5Bpersonal%5D%5Bhair_length%5D%5B0%5D=',
                '&filter%5Bpersonal%5D%5Bethnicity%5D%5B0%5D=',
                '&filter%5Bsexual%5D%5Banal_position%5D%5B0%5D=',
                '&filter%5Bsexual%5D%5Bdick_size%5D%5B0%5D=',
                '&filter%5Bsexual%5D%5Bconcision%5D%5B0%5D=',
                '&filter%5Bsexual%5D%5Bsafer_sex%5D%5B0%5D=',
                '&filter%5Bsexual%5D%5Bfetish%5D%5B0%5D=',
                '&filter%5Bsexual%5D%5Bsm%5D%5B0%5D=',
                '&filter%5Bsexual%5D%5Bfisting%5D%5B0%5D='
            ]
            for (let item of categories) {
                // url = url.replace(item, item + 'NO_ENTRY' + item)
                url = url.replace(item, item.slice(0, -5) + '9%5D=NO_ENTRY' + item)
            }
        }
    }

    //more ...

    return url;
}


// ***** Responces to modify *****
const modifyResponse = (url, data) => {
    // console.log(data);

    //hide nsfw pictures in visitors/visits etc.
    if (hideNSFW) {
        if (url.match(/\/(profiles|popular|visitors|visits|conversations|contacts)\?/) && ! url.match(/v4\/hunqz/)) {  // ...|groups|...
            try {
                if (testMode) console.log('check for nsfw');
                // if (testMode) console.log(data);
                // let index = 0;
                for (let item of data.items) {
                    if (item?.preview_pic?.rating == 'EROTIC') {
                        if (testMode) console.log(`preview pic hidden`);
                        item.preview_pic.url_token = nsfwPlaceholder;
                        // item.preview_pic.url_token = (item.display?.large_tile) ? nsfwPlaceholderBig : nsfwPlaceholder;
                    }
                    if (item?.profile?.preview_pic?.rating == 'EROTIC') {
                        // if (testMode) console.log(`profile preview pic hidden`);
                        item.profile.preview_pic.url_token = nsfwPlaceholder;
                    }
                    if (item?.chat_partner?.preview_pic?.rating == 'EROTIC') {
                        // if (testMode) console.log(`profile preview pic hidden`);
                        item.chat_partner.preview_pic.url_token = nsfwPlaceholder;
                    }
                // index++;
                // if (testMode) console.log(index);
                }
                data = JSON.stringify(data)
            } catch(e) {
                console.log(`fetch: nsfw filter error (profiles): ${e}`);
            }
        }
    }

    //more ...

    return
}


// ***** Handle Fetch *****

// handle response part
const realFetch = window.fetch;
window.fetch = async (url, options) => {

    let newUrl = url;

    // *** modify request ***
    // (not for now; see handle request part below)

    // *** send request & get response ***
    let response = await realFetch(newUrl, options);
    try {
        void await response.clone().json();
    } catch(e) {
        if (testMode) console.log(`not JSON or empty reply: ${e}`);
        return response;
    }

    // *** modify JSON response ***
    let content = await response.text();
    let data = JSON.parse(content);
    modifyResponse(url, data);
    content = JSON.stringify(data)

    return new Response(content, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
    });
}

// handle request part
const firstFetch = window.fetch;
window.fetch = async (url, options) => {
    let newUrl = url;
    let response = {};
    if (typeof url === 'string') {
        newUrl = modifyRequest(url);
        // if (testMode) console.log('fetch string: ' + newUrl);
        response = await firstFetch(newUrl, options);
        // if (testMode) console.log('response string: ', JSON.parse(JSON.stringify(response)));
        // return response;
    }
    if (typeof url === 'object') {
        let request = url;
        const blob = await request.blob();
        const body = blob.size > 0 ? blob : undefined;
        options = {
            body,
            cache: request.cache,
            credentials: request.credentials,
            headers: request.headers,
            integrity: request.integrity,
            keepalive: request.keepalive,
            method: request.method,
            mode: request.mode,
            redirect: request.redirect,
            referrer: request.referrer,
            referrerPolicy: request.referrerPolicy,
            signal: request.signal,
        }
        newUrl = modifyRequest(request.url);
        // if (testMode) console.log('fetch object: ' + newUrl);
        response = await firstFetch(newUrl, options);
        // return response;
    }
    return response;
}


// ***** Handle XHR *****

(function() {
    let oldXHROpen = window.XMLHttpRequest.prototype.open;
    window.XMLHttpRequest.prototype.open = function(method, url, async, user, password) {

        if (url.match(/v4\/messages\//)) {
            //...
        }

        if (url.match(/v4\/messages\/conversations\?/)) {
            //url = url.replace('&length=15', '&length=120');
        }

        if (url.match(/v4\/contacts\?/)) {
            if ($('#contacts-custom-tags a.ui-tag--selected span.ui-tag__label').text().trim() == '[ A-Z ]') {
                url += '&sort_criteria=NAME_ASC';
                url = url.replace(/&filter%5Btags%5D%5B%5D\=\d+/, ``);
            }
            if ($('#contacts-custom-tags a.ui-tag--selected span.ui-tag__label').text().trim() == '[ Login ]') {
                url += '&sort_criteria=LAST_LOGIN_DESC';
                url = url.replace(/&filter%5Btags%5D%5B%5D\=\d+/, ``);
            }
            if ($('#contacts-custom-tags a.ui-tag--selected span.ui-tag__label').text().trim() == '[ Online ]') {
                url += '&filter[online]=true';
                url = url.replace(/&filter%5Btags%5D%5B%5D\=\d+/, ``);
            }
            //url += '&sort_criteria=LAST_LOGIN_DESC';
            //url += '&sort_criteria=NAME_ASC';
            //url += '&filter[online]=true';
            url = url.replace('/contacts?length=100&pick=items.*.profile&lang=de', '/contacts?length=999&pick=items.*.profile&lang=de');
        }

        if (location.pathname.match(/^\/messenger\/contacts\/name/)) {
            if (url.match(/filter%5Busername%5D\=/)) {
                url += '&sort_criteria=NAME_ASC';
                url = url.replace(/filter%5Busername%5D\=\*/, '');
            }
        }

        if (travelMode) {
            if (location.pathname.match(/^\/radar\//)) {
                url = url.replace(/filter%5Blocation%5D%5Blat%5D\=[-0-9\.]+/, `filter[location][lat]=${xhrTravelLat}`);
                url = url.replace(/filter%5Blocation%5D%5Blong%5D\=[-0-9\.]+/, `filter[location][long]=${xhrTravelLong}`);
            }
            //url = url.replace(/filter%5Btravellers_filter%5D\=EXCLUDED/, '');
            //url = url.replace(/filter%5Btravellers_filter%5D\=INCLUDED/, 'filter%5Btravellers_filter%5D=EXCLUDED');
            //url = url.replace(/sort_criteria\=NEARBY_ASC/, 'sort_criteria=NEARBY_DESC');
        }

        if (location.pathname.match(/^\/(radar|hunqz)\//) && url.match(/filter%5Blocation%5D/)) {
            let radius = $('.js-distance-radius .noUi-handle').attr('aria-valuenow');
            if (radius >= 94500 && radius < 95500) {  //95
                url = url.replace(/filter%5Blocation%5D%5Bradius%5D\=[0-9\.]+/, `filter[location][radius]=${250000}`);
            }
            if (radius >= 95500 && radius < 96500) {  //96
                url = url.replace(/filter%5Blocation%5D%5Bradius%5D\=[0-9\.]+/, `filter[location][radius]=${500000}`);
            }
            if (radius >= 96500 && radius < 97500) {  //97
                url = url.replace(/filter%5Blocation%5D%5Bradius%5D\=[0-9\.]+/, `filter[location][radius]=${1000000}`);
            }
            if (radius >= 97500 && radius < 98500) {  //98
                url = url.replace(/filter%5Blocation%5D%5Bradius%5D\=[0-9\.]+/, `filter[location][radius]=${2000000}`);
            }
            if (radius >= 98500 && radius < 99500) {  //99
                url = url.replace(/filter%5Blocation%5D%5Bradius%5D\=[0-9\.]+/, `filter[location][radius]=${4000000}`);
            }
        }

        if (url.match(/v4\/groups\//)) {
            if (travelMode) {
                url = url.replace(/filter%5Blocation%5D%5Blat%5D\=[-0-9\.]+/, `filter[location][lat]=${xhrTravelLat}`);
                url = url.replace(/filter%5Blocation%5D%5Blong%5D\=[-0-9\.]+/, `filter[location][long]=${xhrTravelLong}`);
            }
            if (resigned) {
                url = url.replace('statuses[]=REJECTED', 'statuses[]=NONE');
            }
        }

        if (url.match(/v4\/profiles\/popular/)) {
            if (travelMode && !url.match(/&scrollable=false/)) {
                url = url.replace('sort_criteria=LAST_LOGIN_DESC', 'sort_criteria=NEARBY_ASC');
                url = url.replace(/filter%5Blocation%5D%5Blat%5D\=[-0-9\.]+/, `filter[location][lat]=${xhrTravelLat}`);
                url = url.replace(/filter%5Blocation%5D%5Blong%5D\=[-0-9\.]+/, `filter[location][long]=${xhrTravelLong}`);
            }
            else if (!eyecandyActive && url.match(/&scrollable=false/)) {
                url = url.replace('sort_criteria=NEARBY_ASC', 'sort_criteria=LAST_LOGIN_DESC');
            }
            //url = url.replace('sort_criteria=LAST_LOGIN_DESC', 'sort_criteria=SIGNUP_DESC');
        }

/*         if (location.pathname.match(/^\/explore\//) && url.match(/v4\/profiles\?lang/)) {
            let loc = location.pathname.match(/[-0-9\.]+/g);
            xhrTravelLat = loc[0];
            xhrTravelLong = loc[1];
            localStorage.setItem('REtravelLat', xhrTravelLat);
            localStorage.setItem('REtravelLong', xhrTravelLong);

            //let radius = $('.js-distance-radius .noUi-handle').attr('aria-valuenow');
            //url = url.replace('sort_criteria=NEARBY_ASC', `sort_criteria=LAST_LOGIN_DESC&filter[location][radius]=${radius}`);
            //url = url.replace('sort_criteria=NEARBY_ASC', `sort_criteria=SIGNUP_DESC&filter[location][radius]=${radius}`);
        } */

        //FIX for hunqz activity and new
        if (location.pathname.match(/^\/hunqz\/activity/) && url.match(/v4\/hunqz\/profiles\?lang/)) {
            let radiusActivity = $('.js-distance-radius .noUi-handle').attr('aria-valuenow');
            if (radiusActivity == '100000.0') radiusActivity = '100000000';
            url = url.replace('sort_criteria=NEARBY_ASC', `sort_criteria=LAST_LOGIN_DESC&filter[location][radius]=${radiusActivity}`);
        }
        if (location.pathname.match(/^\/hunqz\/new/) && url.match(/v4\/hunqz\/profiles\?lang/)) {
            let radiusNew = $('.js-distance-radius .noUi-handle').attr('aria-valuenow');
            if (radiusNew == '100000.0') radiusNew = '100000000';
            url = url.replace('sort_criteria=NEARBY_ASC', `sort_criteria=SIGNUP_DESC&filter[location][radius]=${radiusNew}`);
        }

        //include "no entry" to filter
        if (filterNoEntry) {
            if (url.match(/\/profiles\?/)) {
                const categories = [
                    '&filter%5Bpersonal%5D%5Bgender_orientation%5D%5Bgender%5D%5B%5D=',
                    '&filter%5Bpersonal%5D%5Bgender_orientation%5D%5Borientation%5D%5B%5D=',
                    '&filter%5Bpersonal%5D%5Blooking_for%5D%5B%5D=',
                    '&filter%5Bpersonal%5D%5Bbody_type%5D%5B%5D=',
                    '&filter%5Bpersonal%5D%5Bbody_hair%5D%5B%5D=',
                    '&filter%5Bpersonal%5D%5Bhair_color%5D%5B%5D=',
                    '&filter%5Bpersonal%5D%5Bhair_length%5D%5B%5D=',
                    '&filter%5Bpersonal%5D%5Bethnicity%5D%5B%5D=',
                    '&filter%5Bsexual%5D%5Banal_position%5D%5B%5D=',
                    '&filter%5Bsexual%5D%5Bdick_size%5D%5B%5D=',
                    '&filter%5Bsexual%5D%5Bconcision%5D%5B%5D=',
                    '&filter%5Bsexual%5D%5Bsafer_sex%5D%5B%5D=',
                    '&filter%5Bsexual%5D%5Bfetish%5D%5B%5D=',
                    '&filter%5Bsexual%5D%5Bsm%5D%5B%5D=',
                    '&filter%5Bsexual%5D%5Bfisting%5D%5B%5D='
                ]
                for (let item of categories) {
                    url = url.replace(item, item + 'NO_ENTRY' + item)
                }
            }
        }

        //full profile
        if (url.match(/v4\/(hunqz\/)?profiles\/[-\w]+\/full\?/)) {
            this.addEventListener('load', function() {
                xhrFull = JSON.parse(this.response)
                if (testMode) console.log('xhrFull');
            });
        }

        //show group posts of deleted users
        if (postFromDeleted) {
            if (url.match(/v4\/groups\/\d+\/posts\?/)) {
                this.addEventListener('load', function() {
                    try {
                        this.xhr = JSON.parse(this.response)
                        for (let item of this.xhr.items) {
                            if (item.deleted) {
                                if (testMode) console.log(`deleted`);
                                delete item.deleted;
                                //item.edit_status = 'NO_EDIT';
                                item.content = `[Gelöschter Beitrag]\n${item.content}`;
                            }
                            if (item.owner.deletion_date) {
                                if (testMode) console.log(`deletion_date`);
                                delete item.owner.deletion_date;
                                item.content = `[Profil gelöscht]\n\n${item.content}`;
                            }
                        }
                        Object.defineProperty(this, 'responseText', {
                            writable: true
                        });
                        this.responseText = JSON.stringify(this.xhr)
                    } catch(e) {
                    }
                    if (testMode) console.log('postFromDeleted');
                });
            }
        }

        //hide nsfw pictures in radar etc.
        if (hideNSFW) {
            if (url.match(/\/(profiles|popular|conversations|contacts)\?/) && ! url.match(/v4\/hunqz/)) {
                this.addEventListener('load', function() {
                    try {
                        this.xhr = JSON.parse(this.response);
                        // if (testMode) console.log(this.xhr);
                        for (let item of this.xhr?.items) {
                            if (item?.preview_pic?.rating == 'EROTIC') {
                                // console.log(`preview pic hidden`);
                                item.preview_pic.url_token = nsfwPlaceholder;
                                // console.log(item.preview_pic.url_token);
                                // item.personal.age = -item.personal.age;
                                // item.preview_pic.url_token = (item.display?.large_tile) ? nsfwPlaceholderBig : nsfwPlaceholder;
                            }
                            if (item?.profile?.preview_pic?.rating == 'EROTIC') {
                                // console.log(`profile preview pic hidden`);
                                item.profile.preview_pic.url_token = nsfwPlaceholder;
                            }
                            if (item?.chat_partner?.preview_pic?.rating == 'EROTIC') {
                                // console.log(`chat partner profile preview pic hidden`);
                                item.chat_partner.preview_pic.url_token = nsfwPlaceholder;
                            }
                        }
                        Object.defineProperty(this, 'responseText', {
                            writable: true
                        });
                        this.responseText = JSON.stringify(this.xhr);
                        if (this.responseText === undefined) console.log('xhr response undefined');
                    } catch(e) {
                        console.log(`XHR: nsfw filter error (profiles, conversations, contacts): ${e}`);
                    }
                    if (testMode) console.log('hideNSFW');
                });
            }
            if (url.match(/\/((profiles)\/\d+|activity-stream|list)\?/)) {
                this.addEventListener('load', function() {
                    try {
                        this.xhr = JSON.parse(this.response);
                        // console.log(this.xhr);
                        if (this.xhr?.id) {
                            // console.log(`1 profile item at top`);
                            if (this.xhr?.preview_pic?.rating == 'EROTIC') {
                                // console.log(`1 profile preview pic hidden`);
                                this.xhr.preview_pic.url_token = nsfwPlaceholder;
                            }
                        } else {
                            for (let item of this.xhr) {
                                if (item?.preview_pic?.rating == 'EROTIC') {
                                    // console.log(`no item preview pic hidden`);
                                    item.preview_pic.url_token = nsfwPlaceholder;
                                }
                                if (item?.partner?.preview_pic?.rating == 'EROTIC') {
                                    // console.log(`no item preview pic hidden`);
                                    item.partner.preview_pic.url_token = nsfwPlaceholder;
                                }
                            }
                        }
                        Object.defineProperty(this, 'responseText', {
                            writable: true
                        });
                        this.responseText = JSON.stringify(this.xhr)
                    } catch(e) {
                        console.log(`XHR: nsfw filter error (single profile, stream, list): ${e}`);
                    }
                });
            }
        }

        return oldXHROpen.apply(this, arguments);
    }
})();


// ***** Run at login *****

//init
let commonGroupsList = [], commonGroupsLoaded = false, visitorsList = [], visitsList = [], visitorsLoaded = false, visitsLoaded = false;

function runAtLogin (jNode) {

    //init common groups
    groupsRefreshed = true;
    commonGroupsList = [];
    $.ajax({headers: ajaxHead(), url: '/api/v4/profiles/me/groups?lang=de&length=10000&pick=items.*.(id,name,display_name)'})
    // $.ajax({headers: ajaxHead(), url: '/api/v4/profiles/me/groups?lang=de&length=10000&expand=items.*.(membership.*)'})
    .done(function (data) {
        for (let item of data.items) {
            commonGroupsList.push(item);
        }
        commonGroupsLoaded = true;
        if (testMode) console.log(commonGroupsList);

        //get initial group name
        const nameIndex = (item) => item.name == lastGroupName;
        if (commonGroupsList.findIndex(nameIndex) == -1) {
            if (commonGroupsList.length > 0) {
                lastGroupName = commonGroupsList[0].name;
            } else {
                lastGroupName = '';
            }
        }
    });

    //visitors, visits
    $.ajax({headers: ajaxHead(), url: '/api/v4/visitors?lang=de&length=10000&pick=items_limited,items.*.(name,date_visited)'})
    .done(function (data) {
        for (let item of data.items) {
            if (data.items_limited == undefined || visitorsList.length < data.items_limited) {
                visitorsList.push(item);
            }
        }
        visitorsLoaded = true;
        if (testMode) console.log(visitorsList, data.items_limited);
    });
    $.ajax({headers: ajaxHead(), url: '/api/v4/visits?lang=de&length=10000&pick=items_limited,items.*.(name,date_visited)'})
    .done(function (data) {
        for (let item of data.items) {
            if (data.items_limited == undefined || visitsList.length < data.items_limited) {
                visitsList.push(item);
            }
        }
        visitsLoaded = true;
        if (testMode) console.log(visitsList, data.items_limited);
    });
}



// ***** MutationObserver *****

/*** Functions for accessibility tweaks ***/

function makeHeading(el, level) {
    el.setAttribute("role", "heading");
    el.setAttribute("aria-level", level);
}

function makeRegion(el, label) {
    el.setAttribute("role", "main");
    el.setAttribute("aria-label", label);
}

function makeButton(el, label) {
    el.setAttribute("role", "button");
    if (label) el.setAttribute("aria-label", label);
}

function makeButtonFromText(el, label) {
    el.setAttribute("role", "button");
    if (!label) label = '';
    el.setAttribute("aria-label", `${label}${el.textContent.trim()}`);
}

function makeIcon(el, label) {
    el.setAttribute("role", "img");
    el.setAttribute("aria-label", label);
}

function makePresentational(el) {
    el.setAttribute("role", "presentation");
}

function setLabel(el, label) {
    el.setAttribute("aria-label", label);
}

function setLabelFromTitle(el, label) {
    if (!label) label = '';
    el.setAttribute("aria-label", `${label}${el.getAttribute('title')}`);
}

function setLabelFromText(el) {
    el.setAttribute("aria-label", el.textContent.trim());
}

function setLabelFromChildText(el) {
    el.parentNode.setAttribute("aria-label", el.textContent.trim());
}

function makeRadio(el) {
    el.setAttribute("role", "radio");
    el.setAttribute("aria-checked", "false");
}

function makeRadioChecked(el) {
    el.setAttribute("role", "radio");
    el.setAttribute("aria-checked", "true");
}


/*** Code to apply the tweaks when appropriate ***/

function applyTweaks(root, tweaks) {
    for (let tweak of tweaks) {
        for (let el of root.querySelectorAll(tweak.selector)) {
            if (Array.isArray(tweak.tweak)) {
                let [func, ...args] = tweak.tweak;
                func(el, ...args);
            } else {
                tweak.tweak(el);
            }
        }
    }
}

function initMutationObserver() {
    applyTweaks(document, LOAD_TWEAKS);
    applyTweaks(document, DYNAMIC_ELEMENT_ADDED_TWEAKS);
}

let observer = new MutationObserver(function(mutations) {
    for (let mutation of mutations) {
        try {
            if (mutation.type === "childList") {
                for (let node of mutation.addedNodes) {
                    if (node.nodeType != Node.ELEMENT_NODE) {
                        continue;
                    }
                    applyTweaks(node, DYNAMIC_ELEMENT_ADDED_TWEAKS);
                    // console.log('MO element node added');
                }
                /*for (let node of mutation.removedNodes) {
                    if (node.nodeType != Node.ELEMENT_NODE) {
                        continue;
                    }
                    applyTweaks(node, DYNAMIC_TWEAKS);
                }*/
/*             } else if (mutation.type === "attributes") {
                if (mutation.attributeName == "class") {
                    applyTweaks(mutation.target, DYNAMIC_ATTR_ONLY_TWEAKS);
                } */
            }
        } catch (e) {
            // Catch exceptions for individual mutations so other mutations are still handled
            console.log(`Exception while handling mutation: ${e}`);
        }
    }
});
observer.observe(document, {childList: true, subtree: true});

let observerAttr = new MutationObserver(function(mutations) {
    for (let mutation of mutations) {
        try {
            if (mutation.type === "attributes") {
                if (mutation.attributeName == "class") {
                    applyTweaks(mutation.target, DYNAMIC_ATTR_ONLY_TWEAKS);
                    // console.log('MO attr only');
                }
            }
            if (mutation.type === "childList") {
                applyTweaks(mutation.target, DYNAMIC_ANY_NODE_TWEAKS);
                // console.log('MO any node');
            }
        } catch (e) {
            // Catch exceptions for individual mutations so other mutations are still handled
            console.log(`Exception while handling mutation: ${e}`);
        }
    }
});
observerAttr.observe(document, {childList: true, subtree: true, attributes: true, attributeFilter: ["class"]});


/*** Define the actual tweaks ***/

// Tweaks to be applied on load
const LOAD_TWEAKS = [
]

// Tweaks to be applied whenever an element node is added
const DYNAMIC_ELEMENT_ADDED_TWEAKS = [

    //RomeoEnhancer (see also waitForKeyElements below)
    {selector: '#search input[value]', tweak: handleSearch},
    {selector: ':is(.layer-left-navigation, header) li', tweak: handleMainMenu},
    {selector: 'section.js-main-stage ul[class^="Tabbed-nav-"] li.is-selected, .js-navigation nav > a, #eyecandy-results', tweak: handleTabMenu},
    {selector: '.js-top-right-navigation a:not(.re-done)', tweak: handleTopRightMenu},
    // {selector: 'div.js-filter-button button', tweak: handleBookmark},
    {selector: '#offcanvas-nav span[data-cta="hidePlus"]:not(.re-done)', tweak: handleSettingsDisplay},
    {selector: '#offcanvas-nav input[value="TILES_SMALL"]:not(.re-done)', tweak: handleColorSwitch},
    {selector: '#messenger div:is(.js-correspondence, .js-header) div.reactView div > a > p', tweak: showLoginLocation},
    // {selector: '.js-profile-footprints h1', tweak: handleFootprints},
    {selector: '.js-quick-filter .filter__group--last:has(ul):not(.re-done)', tweak: handleFilterNoEntry},
    {selector: '#messenger div.js-chat .reactView a[href^="/messenger/chat"]', tweak: handleMessage},
    {selector: '#messages-list p a', tweak: handleMessageLink},
    {selector: '#messenger div.js-contacts .reactView a[href^="/messenger/contacts"]', tweak: handleContacts},
    {selector: '#contacts-custom-tags .js-remove', tweak: handleTagRemove},
    // {selector: '#messenger a[aria-current="page"]', tweak: handleTabRefresh},
    {selector: '#blog-posts .swiper-slide a:not(.re-done)', tweak: handleBlogLinks},
    {selector: ':is(div.js-wrapper, div.js-admins, #group-preview) a.js-contact', tweak: handleContactStrip},
    {selector: 'a[href^="/group/"] div[class*="Tile__BaseTile-"]:not(.re-done)', tweak: handleGroupTiles},
    {selector: '.js-wrapper a[href^="/eyecandy"] h1', tweak: handleDiscoverEyecandy},
    {selector: ':is(.BIG, .SMALL, .LIST) div > span[class^="sc-"]', tweak: handleTiles},
    // {selector: ':is(.BIG, .SMALL, .LIST) svg + p', tweak: handleTiles},
    {selector: 'div.stream__content a.listitem__body .js-username p, div.stream__content div.js-list', tweak: handleStream},
    {selector: 'section.profile__stats section > p[class^="BaseText"], section.profile__stats ol', tweak: handleProfile},
    {selector: 'div[class*="SidebarContentContainer-"] div[class*="Main-"] > div', tweak: refreshPostsList},
    {selector: '#manage div[class^="FilterBar__Container"] > div > div', tweak: groupManageMode},
    {selector: 'div.js-members-header div.js-dropdown button', tweak: groupTravelLocation},
    {selector: 'label path[d^="M6 8c-1"]:not(.re-done)', tweak: handleTravelLocationList},
    // {selector: '#liked-by-grid', tweak: handleSlideshowLikes},
    // {selector: '#picture-rating img, #picture-rating p[class^="Text-sc-"]', tweak: ratingInfo},
    {selector: '#picture-rating img, #picture-rating button[class^="TertiaryButton__Element-"], #picture-rating p[class^="Text-sc-"]', tweak: ratingInfo},
    {selector: 'section[class^="PopupWindow__Content"] button[class^="PrimaryButton__"]', tweak: reLogin},

    //accessibility: navigation items with badges
    {selector: '.icon-search', tweak: [makeIcon, "Suchen"]},
    {selector: '.icon-visitor', tweak: [makeIcon, "Besucher"]},
    {selector: '.icon-chat', tweak: [makeIcon, "Messages"]},
    {selector: '.icon-notification-bell', tweak: [makeIcon, "Activity Stream"]},
    {selector: '.ui-status--online', tweak: [makeIcon, "Online"]},
    {selector: '.ui-status--date', tweak: [makeIcon, "Date"]},
    {selector: '.ui-status--sex', tweak: [makeIcon, "Now"]},
    {selector: '.icon-airplane', tweak: [makeIcon, "Travel"]},
    {selector: '.icon-save-contact', tweak: [makeIcon, "Kontakte"]},
    {selector: '.js-nav-item .icon-group-members', tweak: [makeIcon, "Meine Gruppen"]},

    //accessibility: profile screen
    {selector: '.profile--romeo', tweak: [makeRegion, "Romeo-Profil"]},
    {selector: '.profile--hunqz', tweak: [makeRegion, "Hunqz-Profil"]},
    {selector: '.icon-add-footprint', tweak: [makeButton, "Fußtaps vergeben"]},
    {selector: '.js-remove-footprint', tweak: [setLabelFromTitle]},
    {selector: '.js-quickshare-trigger', tweak: [setLabel, "QuickShare-Album teilen"]},
    {selector: '.icon-default-contact', tweak: [makeIcon, "Nutzer speichern"]},
    {selector: '[id^="profile-"] .icon-save-contact', tweak: [makeIcon, "Nutzer speichern"]},
    {selector: '#visits > div', tweak: [makeRegion, "Besucher"]},
    {selector: '.icon-back', tweak: [makeIcon, "Zurück"]},
    {selector: '.icon-next', tweak: [makeIcon, "Weiter"]},
    {selector: '.icon-open-menu-ver', tweak: [makeIcon, "Menü öffnen"]},
    {selector: '.icon-open-stats', tweak: [makeIcon, "Profildetails"]},
    {selector: '.js-attach-pictures', tweak: [setLabel, "Bilder anhängen"]},
    {selector: '.js-submit', tweak: [setLabel, "Abschicken"]},
    {selector: 'button[class^="Close--"], button.js-close-button, .js-close-icon button', tweak: [setLabel, "Schließen"]},
    {selector: '.js-close-spotlight', tweak: [makeButton, "Schließen"]},
    {selector: '.js-hide.js-plus', tweak: [setLabel, "Profilbesuch verstecken"]},
    {selector: '.profile-section .reactView p[class^="BodyText"]', tweak: [makeHeading, "3"]},
    {selector: '.top-info-header p[class^="BodyText"]', tweak: [makeHeading, "1"]},
    {selector: 'button[class^="CollapsibleSection"] > p', tweak: [setLabelFromChildText]},

    //accessibility: other
    {selector: '.messages-send__select-button.messages-button-react-view', tweak: [setLabel, "Templates, Standort, Bilder senden"]},
    {selector: ':not(.js-nav-item) > .icon-group-members', tweak: [makeIcon, "Gruppe"]},
    {selector: '.js-settings-privacy div[class*="Radio-"]', tweak: [makeRadio]},
    {selector: '.js-settings-privacy div[class*="Selected-"] div[class*="Radio-"]', tweak: [makeRadioChecked]},
]

// Tweaks to be applied on any node changes
const DYNAMIC_ANY_NODE_TWEAKS = [

    //RomeoEnhancer
    {selector: '#offcanvas-nav main div > p[class^="MiniText"]:not(.re-done)', tweak: handleVersion},
    {selector: 'nav.js-navigation header', tweak: handleTabMenuNew},
    {selector: '.js-chat div[class^="Box"] + div > p[class^="SpecialText"]:not(.re-done)', tweak: previewMessage},
    {selector: '#messages-list p[class^="SpecialText"]:not(.re-done)', tweak: handleMessageScroll},
    // {selector: '#messenger a[aria-current="page"]', tweak: handleTabRefresh},
    {selector: 'div.js-correspondence div.js-header-region div[class*="ContextMenu__"] ul', tweak: threadOptionsMenu},
    {selector: 'nav:has(#my-groups-list):not(.re-groups-def)', tweak: recentPosts},
    {selector: ':is(.js-post-list, .js-post) .js-date span:not(.re-done)', tweak: handleGroupPostDate},
    {selector: 'main > ul > li > img[src^="/img/usr/original/"]:not(.re-done)', tweak: handleImg},
    {selector: '.ReactModal__Content main div > img[src^="/img/usr/original/"]:not(.re-done)', tweak: handleSingleImg},
]

// Tweaks to be applied on attribute changes
const DYNAMIC_ATTR_ONLY_TWEAKS = [

    //RomeoEnhancer
    // {selector: 'div.swiper-slide.swiper-slide-active div.swiper-zoom-container, #metadata-bar p', tweak: imgInfo},
]

initMutationObserver();



// ***** waitForKeyElements (for nodes not handled by MutationObserver) *****

waitForKeyElements ('div#marionette.is-logged-in', runAtLogin, true);
waitForKeyElements ('div.js-chat .js-scrollable div[class="js-paging-spinner spinner-container l-fancy"]', fixScroll, true);