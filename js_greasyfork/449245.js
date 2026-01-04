// ==UserScript==
// @name youtube redux plus
// @namespace yomama
// @version 0.3.1
// @description makes youtube redux accurate to old youtube
// @author legosavant
// @license gplv3
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.youtube.com/*
// @downloadURL https://update.greasyfork.org/scripts/449245/youtube%20redux%20plus.user.js
// @updateURL https://update.greasyfork.org/scripts/449245/youtube%20redux%20plus.meta.js
// ==/UserScript==

(function() {
let css = `
/*options: disable custom comments and video scalers*/
/*cancer*/
ytd-app, html {
    scrollbar-color:initial;
    --yt-spec-call-to-action:#128ee9;
    background:#f1f1f1
}
:root {
    --globalthumb:196px;
    --globalthumbh:110px
}
ytd-app::-webkit-scrollbar, html::-webkit-scrollbar {
    border-radius:0;
    background:initial;
}
yt-interaction, paper-ripple, paper-ripple.tp-yt-paper-button, .masthead-skeleton-icon {
    display:none!important
}
body.lock-scrollbar {
    position:static
}
#engagement-panel-scrim.ytd-watch-flexy, tp-yt-iron-overlay-backdrop {
    background-color:rgba(255,255,255,.5)
}
yt-formatted-string#text.ytd-channel-name {
    font-size:11px!important;
    line-height:normal
}
.html5-video-player {
    background:#000
}
/*masthead*/
    /*general*/
#masthead-container.ytd-app {
    height:50px
}
#masthead-container.ytd-app #masthead:not([dark]) {
    height:49px
}
#container.ytd-masthead {
    height:49px;
    padding-left:23px
}
#guide-spacer.ytd-app {
    margin-top:50px
}
#page-manager.ytd-app {
    margin-top:50px
}
    /*buttons*/
yt-img-shadow.ytd-topbar-menu-button-renderer, yt-img-shadow.ytd-topbar-menu-button-renderer img {
    width:27px;
    height:27px;
    border-radius:50%
}
button.ytd-topbar-menu-button-renderer {
    padding:0
}
#end.ytd-masthead {
    height:100%;
    padding-right:7px
}
ytd-notification-topbar-button-renderer yt-icon {
    top: -2px;
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflq9QGbD.webp) -98px -20px;
    fill:none;
    height:30px;
    opacity:.55
}
ytd-notification-topbar-button-renderer yt-icon:hover {
    opacity:.85
}
ytd-notification-topbar-button-renderer .yt-spec-icon-badge-shape__icon{
    height:30px
}
#buttons.ytd-masthead > .ytd-masthead:not(:last-child) {
    margin-right:1px
}
ytd-topbar-menu-button-renderer:first-of-type yt-icon-button yt-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflq9QGbD.webp) -11px -406px;
    content:none!important;
    fill:none!important;
    width:24px;
    height:24px;
    filter:none;
    opacity:.5;
}
ytd-topbar-menu-button-renderer:first-of-type yt-icon-button:hover yt-icon {
    opacity:.6
}
ytd-topbar-menu-button-renderer:first-of-type yt-icon-button:active yt-icon {
    opacity:1
}
ytd-topbar-menu-button-renderer:first-of-type {
    padding-right:21px
}
.yt-spec-icon-badge-shape--type-notification .yt-spec-icon-badge-shape__badge {
    border-radius:2px;
    padding:0 1px;
    z-index: 100;
    min-width: 15px;
    border-bottom: 1px solid #fff;
    border-left: 1px solid #fff;
    background: #cb4437;
    color: #fff;
    font-weight:500;
    transform-style: preserve-3d;
    font-size:11px
}
.yt-spec-icon-badge-shape--type-notification .yt-spec-icon-badge-shape__badge:before {
    content:"";
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflEXP50f.png) -35px -244px;
    width: 30px;
    height: 30px;
    display:inline-block;
    position:absolute;
    left:-13px;
    opacity:.55;
    transform: translateZ(-10px)
}
.yt-spec-icon-badge-shape:hover .yt-spec-icon-badge-shape__badge:before {
    opacity:.85
}
.yt-spec-icon-badge-shape > div:nth-last-child(2) {
    opacity:0
}
.badge-style-type-verified-artist.badge.ytd-badge-supported-renderer {
    display:none
}
    /*guide*/
#guide-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflcdq1Wx.png) -285px -276px;
    height:16px;
    width:16px;
    fill:none
}
#masthead:hover #guide-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflcdq1Wx.png) -29px -394px;
}
#guide-icon.ytd-app {
    fill:none
}
#guide-button button {
    padding:0 10px;
    box-sizing:content-box;
    height:28px;
    width:16px;
    border:1px solid transparent
}
yt-icon-button.ytd-masthead, #guide-button.ytd-app {
    padding:0;
    width:auto;
    height:auto
}
#header.ytd-app {
    padding-left:23px
}
.tp-yt-app-drawer {
    transition:none!important;
}
[style="transition-duration: 200ms; touch-action: pan-y;"]  #contentContainer.tp-yt-app-drawer[opened] #guide-inner-content{
    box-shadow:5px 10px 15px 5px rgba(0,0,0,.1);
    clip-path:inset(0 -20px 0 0);
    border-top:1px solid #e8e8e8 
}
#contentContainer.tp-yt-app-drawer[opened] #guide-inner-content {
    border-right:1px solid #e8e8e8
}
tp-yt-app-drawer#guide[position="left"] {
    border:0
}
#header.ytd-app {
    height:49px
}
    /*logo*/
ytd-masthead #logo-icon-container, #contentContainer #logo-icon-container, ytd-topbar-logo-renderer > #logo, #start > #masthead-logo, #masthead > #masthead-logo {
    padding:10px 4px!important
}
#logo.ytd-masthead {
    width:118px
}
    /*searchbox*/
#container.ytd-searchbox {
    margin-left:0;
    height:23px;
    border-right:1px solid var(--ytd-searchbox-legacy-border-color);
    transition: border-color .2s ease;
}
#container.ytd-searchbox:hover {
    border: 1px solid #b9b9b9;
    border-top-color: #a0a0a0;
    box-shadow: inset 0px 1px 2px rgba(0,0,0,0.1);
}
ytd-searchbox.ytd-masthead {
    padding-left:10px;
    max-width:650px
}
#search-input.ytd-searchbox-spt input {
    font-size:16px;
    line-height:normal;
}
ytd-searchbox[has-focus] #search-icon.ytd-searchbox {
    display:none
}
ytd-searchbox[has-focus] #container.ytd-searchbox {
    padding-left:6px
}
#search-input.ytd-searchbox-spt input::placeholder {
    color:#767676
}
#search-form.ytd-searchbox, #search-icon-legacy.ytd-searchbox {
    max-height:29px;
    width:66px;
    border-left:0
}
#search-icon-legacy.ytd-searchbox {
    padding-left:8px!important;
    padding-right:8px
}
ytd-searchbox#search #search-icon-legacy.ytd-searchbox yt-icon.ytd-searchbox {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflcdq1Wx.png) -131px -174px;
    fill:none;
    width:16px!important;
    height:16px!important;
    opacity:.6
}
#search-icon-legacy.ytd-searchbox:focus {
    background:var(--ytd-searchbox-legacy-button-color)
}
#search-icon-legacy.ytd-searchbox:hover {
    border-color: #c6c6c6;
    border-left-color: rgb(198, 198, 198);
    background: #f0f0f0;
    box-shadow: 0 0px 0 rgba(0,0,0,0.10);
}
#search-icon-legacy.ytd-searchbox:active {
    border-color: #c6c6c6;
    border-left-color: rgb(198, 198, 198);
    background: #e9e9e9;
    box-shadow: inset 0 1px 0 #ddd;
}
    /*guesses*/
.sbdd_a {
    margin-top:-2px
}
.sbdd_b {
    border-top:1px solid #ccc
}
.sbpqs_a::before, .sbqs_c::before {
    content:none
}
.sbpqs_a {
    color:#000
}
.gsfs {
    font-size:16px;
    line-height:20px;
    padding:0 6px
}
.sbsb_a {
    padding:0
}
.sbfl_a {
    display:none
}
    /*voice*/
#voice-search-button {
    display:none
}
    /*user menu*/
 
/*new right menu*/
#manage-account.ytd-active-account-header-renderer {
    background-color: #999;
    border-bottom: none;
    color: #fff;
    padding: 6px 15px 7px 15px;
    text-transform: uppercase;
    order:-1;
    margin:0;
    justify-content:initial;
    cursor:pointer;
 
}
#channel-container.ytd-active-account-header-renderer {
    width:100%;
    justify-content:initial
}
ytd-active-account-header-renderer {
    padding:0
}
#manage-account.ytd-active-account-header-renderer a{
    all:unset;
    font:bold 11px roboto
}
#manage-account.ytd-active-account-header-renderer a:hover {
    text-decoration:underline
}
#avatar.ytd-active-account-header-renderer {
    margin:0;
    position:absolute;
    width:64px;
    height:64px;
    margin-left:15px;
    margin-top:38px
}
#avatar.ytd-active-account-header-renderer img {
    margin:0;
    width:64px;
    height:64px
}
#account-name.ytd-active-account-header-renderer, #email.ytd-active-account-header-renderer {
    font:500 13px roboto;
    margin-left:90px
}
#account-name.ytd-active-account-header-renderer {
    margin-top:12px;
}
ytd-active-account-header-renderer {
    border:0;
    min-height:75px
}
tp-yt-paper-item.ytd-compact-link-renderer:before {
    content:none!important
}
ytd-active-account-header-renderer:not([enable-handles-account-menu-switcher]) #account-name.ytd-active-account-header-renderer {
    font-size:13px!important
}
/**************/
/*
ITM     OLD    NEW
channel 1 1     1 1
studio  1 3     1 2
switch  1 4     1 3
sign    1 5     1 4
purchase1 2     2 1
data    2 8     2 2
light
lang
restrict3 X     3 3
location
shortcut2 6     3 5
setting 2 4     4 1
help    2 5     5 X
feedback2 7     5 X
*/
/**************/
    /*general*/
[menu-style="multi-page-menu-style-type-system"] .content-icon, [menu-style="multi-page-menu-style-type-system"] #content-icon {
    display:none
}
[menu-style="multi-page-menu-style-type-system"] ytd-compact-link-renderer:not([has-secondary]) tp-yt-paper-item.ytd-compact-link-renderer {
    padding:0 15px
}
    /*channel*/
[menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(1) ytd-compact-link-renderer:nth-child(1) {
    background:transparent!important;
    max-width:80px;
}
[menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(1) ytd-compact-link-renderer:nth-child(1) #label{
    color:white;
    background-color: rgba(0,0,0,0.4);
    font:500 9px roboto;
    line-height:9px;
    padding:5px 0;
    width:64px;
    margin-bottom:12px;
    text-align:center;
}
    /*switch acc*/
[menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(1) ytd-compact-link-renderer:nth-child(3) {
    border-top: 1px solid rgba(0,0,0,0.1);
}
    /*studio*/
[menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(1) ytd-compact-link-renderer:nth-child(2) {
    position:absolute;
    top:78px;
    left:90px
}
#container yt-multi-page-menu-section-renderer:nth-child(4) ytd-compact-link-renderer:nth-child(1) {
    position:absolute;
    top:78px;
    left:194px
}
[menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(1) ytd-compact-link-renderer:nth-child(2) tp-yt-paper-item, [menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(4) ytd-compact-link-renderer:nth-child(1) tp-yt-paper-item {
    border:1px solid #d3d3d3;
    background: #f8f8f8;
    color: #333;
    border-radius: 2px;
    box-shadow: 0 1px 0 rgb(0 0 0 / 5%);
    padding:0 10px;
    height:22px!important;
}
[menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(1) ytd-compact-link-renderer:nth-child(2) tp-yt-paper-item:hover, [menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(4) ytd-compact-link-renderer:nth-child(1) tp-yt-paper-item:hover {
    border-color: #c6c6c6;
    background: #f0f0f0;
    box-shadow: 0 1px 0 rgb(0 0 0 / 10%);
}
[menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(4) ytd-compact-link-renderer:nth-child(1) tp-yt-paper-item {
    padding:0 4px
}
[menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(1) ytd-compact-link-renderer:nth-child(2) tp-yt-paper-item #label {
    font:400 11px Roboto;
}
[menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(4) ytd-compact-link-renderer:nth-child(1) tp-yt-paper-item #label {
    font:400 0 roboto
}
[menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(4) ytd-compact-link-renderer:nth-child(1) tp-yt-paper-item #label{
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflNlthLq.webp) -626px 0;
    background-size: auto;
    width: 20px;
    height: 20px;
    opacity:.5
}
[menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(2) ytd-compact-link-renderer:nth-child(4) tp-yt-paper-item #label:hover {
    opacity:1
}
[menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(1) ytd-compact-link-renderer:nth-child(2) tp-yt-paper-item #primary-text-container, [menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(4) ytd-compact-link-renderer:nth-child(1) tp-yt-paper-item #primary-text-container, [menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(1) ytd-compact-link-renderer:nth-child(5) tp-yt-paper-item #primary-text-container{
    display:inline-block
}
[menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(2) ytd-compact-link-renderer:nth-child(2), [menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(3) ytd-compact-link-renderer:nth-child(5), [menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(3) ytd-compact-link-renderer:nth-child(3), [menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(5) {
    display:none
}
    /*sign out*/
#sections.ytd-multi-page-menu-renderer > .ytd-multi-page-menu-renderer:not(:last-child) {
    border:0;
    padding-bottom:0;
}
#sections.ytd-multi-page-menu-renderer > .ytd-multi-page-menu-renderer:nth-child(2) {
    padding-top:0;
    padding-bottom:0px;
}
#sections.ytd-multi-page-menu-renderer > .ytd-multi-page-menu-renderer:nth-child(3) {
    padding-top:0
}
[menu-style="multi-page-menu-style-type-system"] #container #sections {
    padding-bottom:48px;
    background:#f5f5f5
}
[menu-style="multi-page-menu-style-type-system"] #container #sections yt-multi-page-menu-section-renderer {
    background:#fff
}
[menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(1) ytd-compact-link-renderer:nth-child(4) {
    position:absolute;
    bottom:10px;
    right:15px
}
[menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(2) ytd-compact-link-renderer:nth-child(1) {
    position:absolute;
    bottom:10px;
    left:15px
}
 
[menu-style="multi-page-menu-style-type-system"] yt-multi-page-menu-section-renderer:nth-child(1) ytd-compact-link-renderer:nth-child(4) tp-yt-paper-item.ytd-compact-link-renderer, [menu-style="multi-page-menu-style-type-system"] yt-multi-page-menu-section-renderer:nth-child(2) ytd-compact-link-renderer:nth-child(1) tp-yt-paper-item.ytd-compact-link-renderer {
    background: #f8f8f8;
    height: 28px!important;
    border: solid 1px #d3d3d3;
    padding: 0 10px;
    outline: 0;
    font-weight: 500;
    font-size: 11px;
    text-decoration: none;
    white-space: nowrap;
    word-wrap: normal;
    line-height: normal;
    vertical-align: middle;
    cursor: pointer;
    *overflow: visible;
    border-radius: 2px;
    box-shadow: 0 1px 0 rgb(0 0 0 / 5%);
}
[menu-style="multi-page-menu-style-type-system"] yt-multi-page-menu-section-renderer:nth-child(1) ytd-compact-link-renderer:nth-child(4) tp-yt-paper-item.ytd-compact-link-renderer #subtitle.ytd-compact-link-renderer, [menu-style="multi-page-menu-style-type-system"] yt-multi-page-menu-section-renderer:nth-child(2) ytd-compact-link-renderer:nth-child(1) tp-yt-paper-item.ytd-compact-link-renderer #subtitle.ytd-compact-link-renderer {
    display:none
}
[menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(1) ytd-compact-link-renderer:nth-child(4) tp-yt-paper-item.ytd-compact-link-renderer #label, [menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(2) ytd-compact-link-renderer:nth-child(1) tp-yt-paper-item.ytd-compact-link-renderer #label {
    color: #333;
    font:500 11px Roboto
}
[menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(1) ytd-compact-link-renderer:nth-child(4) tp-yt-paper-item.ytd-compact-link-renderer:hover, [menu-style="multi-page-menu-style-type-system"] #container yt-multi-page-menu-section-renderer:nth-child(2) ytd-compact-link-renderer:nth-child(1) tp-yt-paper-item.ytd-compact-link-renderer:hover {
    border-color: #c6c6c6;
    background: #f0f0f0;
    box-shadow: 0 1px 0 rgb(0 0 0 / 10%);
}
    /*submenus suck*/
[menu-style="multi-page-menu-style-type-system"] #submenu ytd-compact-link-renderer.yt-multi-page-menu-section-renderer {
    position:static!important;
    background: #f5f5f5!important;
    border-top: 1px solid rgba(0,0,0,0.1);
    min-height:28px
}
[menu-style="multi-page-menu-style-type-system"] #submenu yt-multi-page-menu-section-renderer:nth-child(1) ytd-compact-link-renderer:nth-child(1) {
    border:0!important
}
[menu-style="multi-page-menu-style-type-system"] #submenu tp-yt-paper-item {
    border:0!important;
    padding:0 15px;
    box-shadow:none!important;
    border-radius:0;
    margin:0;
    height:28px!important
}
[menu-style="multi-page-menu-style-type-system"] #submenu yt-multi-page-menu-section-renderer:nth-child(1) ytd-compact-link-renderer:nth-child(2) tp-yt-paper-item {
    height:28px!important
}
[menu-style="multi-page-menu-style-type-system"] #submenu #label {
    font:500 13px roboto!important;
    margin:0!important;
    line-height:28px
}
[menu-style="multi-page-menu-style-type-system"] #submenu yt-multi-page-menu-section-renderer:nth-child(1) ytd-compact-link-renderer:nth-child(1) #label {
    all:unset;
    font:400 13px roboto!important;
    padding-top:10px;
    padding-bottom:10px
}
[menu-style="multi-page-menu-style-type-system"] #submenu #sections {
    padding-bottom:0;
    border:0
}
[menu-style="multi-page-menu-style-type-system"] #submenu #sections.ytd-multi-page-menu-renderer > .ytd-multi-page-menu-renderer {
    padding:0
}
[menu-style="multi-page-menu-style-type-system"] #submenu ytd-simple-menu-header-renderer {
    border:0;
    min-height:0;
    background-color: #999;
    border-bottom: none;
    color: #fff;
    order:-1;
    margin:0;
    justify-content:initial;
}
[menu-style="multi-page-menu-style-type-system"] #submenu ytd-simple-menu-header-renderer yt-formatted-string {
    text-transform: uppercase;
    font:bold 11px roboto;
    line-height:24px
}
[menu-style="multi-page-menu-style-type-system"] #submenu ytd-simple-menu-header-renderer ytd-button-renderer #button.ytd-button-renderer {
    padding:0;
    height:20px;
    width:20px;
    color:#fff
}
h2.ytd-simple-menu-header-renderer {
    height:26px
}
ytd-toggle-theme-compact-link-renderer {
    height:24px;
    min-height:0;
    padding:0 15px
}
.ytd-account-item-section-renderer .content-icon {
    display:inline-block
}
.ytd-account-item-section-renderer ytd-account-item-renderer[enable-ring-for-active-account] yt-img-shadow.ytd-account-item-renderer {
    border-radius:0;
    border:0;
    width:36px;
    height:36px
}
 .ytd-account-item-section-renderer img {
    height:36px;
    width:36px;
}
.ytd-account-item-section-renderer #contentIcon {
    height:36px;
    width:36px;
    padding-right:10px
}
tp-yt-paper-icon-item.ytd-account-item-renderer {
    height:50px;
    min-height:50px;
    border-bottom:1px solid rgba(0,0,0,0.1);
}
tp-yt-paper-icon-item.ytd-account-item-renderer:before {
    content:none!important
}
[menu-style="multi-page-menu-style-type-system"] #submenu #footer tp-yt-paper-item {
    background:#f8f8f8
}
[menu-style="multi-page-menu-style-type-system"] #submenu #footer ytd-compact-link-renderer.yt-multi-page-menu-section-renderer {
    max-width:none!important
}
ytd-google-account-header-renderer.ytd-account-section-list-renderer{
    background:#fff;
    border-bottom:1px solid rgba(0,0,0,0.1);
}
#container.ytd-google-account-header-renderer{
    border-bottom:none
}
#footer.ytd-multi-page-menu-renderer > .ytd-multi-page-menu-renderer {
    padding-top:0
}
[menu-style="multi-page-menu-style-type-system"]#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer, [menu-style="multi-page-menu-style-type-system"] tp-yt-paper-item {
    min-height:auto!important;
    height:auto!important;
}
[menu-style="multi-page-menu-style-type-system"] #header.ytd-multi-page-menu-renderer:after {
    content:"";
    display:inline-block;
    border:12px solid transparent;
    border-top-width:0;
    border-bottom-color:#999;
    position:absolute;
    top:-8px;
    right:10px
}
        /*theater fix*/
html:not([dark]) ytd-masthead[dark] {
    --ytd-searchbox-border-color: hsla(0, 0%, 53.3%, 0.2);
    --ytd-searchbox-legacy-border-color: #ccc;
    --ytd-searchbox-legacy-border-shadow-color: #eee;
    --ytd-searchbox-legacy-button-color: #f8f8f8;
    --ytd-searchbox-legacy-button-border-color: #d3d3d3;
    --ytd-searchbox-legacy-button-focus-color: #e9e9e9;
    --ytd-searchbox-legacy-button-hover-color: #f0f0f0;
    --ytd-searchbox-legacy-button-hover-border-color: #c6c6c6;
    --ytd-searchbox-legacy-button-icon-color: #333;
    --ytd-searchbox-background: hsl(0, 0%, 100%);
    --ytd-searchbox-text-color: hsl(0, 0%, 6.7%);
    background:#fff;
}
html:not([dark]) ytd-masthead[dark] .yt-spec-icon-badge-shape__badge {
    border-color:#fff
}
html:not([dark]) ytd-masthead[dark] ytd-topbar-menu-button-renderer:first-of-type yt-icon-button yt-icon {
    content:none!important;
    width:24px;
    height:24px
}
/*guide*/
    /*general*/
ytd-app[guide-persistent-and-visible] ytd-page-manager.ytd-app {
    margin-left:230px
}
ytd-guide-renderer.ytd-app, tp-yt-app-drawer[persistent] {
    width:230px
}
    /*guide items*/
ytd-guide-entry-renderer.style-scope .title.ytd-guide-entry-renderer, .title.ytd-guide-entry-renderer {
    font-size:13px;
    color:#222
}
ytd-guide-entry-renderer[active] .title.ytd-guide-entry-renderer {
    text-shadow: -1px -1px 0 rgba(0,0,0,0.25);
    color:#fff
}
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover .ytd-guide-entry-renderer {
    color:#fff
}
#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:hover, #endpoint.yt-simple-endpoint.ytd-guide-entry-renderer:active {
    background:none
}
ytd-guide-entry-renderer:hover, #redux-mychannel:hover {
    background-color:#444;
}
#redux-mychannel {
    transition:none!important
}
tp-yt-paper-item:focus::before, .tp-yt-paper-item.tp-yt-paper-item:focus::before {
    content:none
}
ytd-guide-collapsible-section-entry-renderer.ytd-guide-section-renderer:not(:first-child) {
    padding-top:8px;
    margin-top:8px
}
#sections.ytd-guide-renderer > .ytd-guide-renderer:first-child {
    padding-bottom:8px
}
    /*guide icons*/
ytd-app .guide-icon.ytd-guide-entry-renderer {
    fill:none!important;
    margin-right:9.5px!important;
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflq9QGbD.webp) -223px -426px;
}
ytd-app a:hover .guide-icon.ytd-guide-entry-renderer, ytd-app [active] .guide-icon.ytd-guide-entry-renderer {
    background-position:-132px -17px
}
tp-yt-paper-item.ytd-guide-entry-renderer {
    padding:0 9px!important
}
        /*show more*/
ytd-app #expander-item .guide-icon.ytd-guide-entry-renderer {
    visibility:hidden
}
        /*home*/
.ytd-guide-entry-renderer[href="/"] .guide-icon{
    background-position:-67px -241px
}
.ytd-guide-entry-renderer[href="/"]:hover .guide-icon,[active] .ytd-guide-entry-renderer[href="/"] .guide-icon {
    background-position:-283px -229px
}
        /*channel*/
.ytd-guide-entry-renderer[href^="/c"] .guide-icon{
    background-position:-98px -68px
}
.ytd-guide-entry-renderer[href^="/c"]:hover .guide-icon,[active] .ytd-guide-entry-renderer[href^="/c"] .guide-icon {
    background-position:-165px -68px
}
        /*explore*/
.ytd-guide-entry-renderer[href^="/feed/explore"] .guide-icon{
    background-position:-122px -137px
}
.ytd-guide-entry-renderer[href^="/feed/explore"]:hover .guide-icon,[active] .ytd-guide-entry-renderer[href^="/feed/explore"] .guide-icon {
    background-position:-330px -187px
}
        /*subscriptions*/
.ytd-guide-entry-renderer[href^="/feed/subscriptions"] .guide-icon{
    background-position:-358px -458px
}
.ytd-guide-entry-renderer[href^="/feed/subscriptions"]:hover .guide-icon,[active] .ytd-guide-entry-renderer[href^="/feed/subscriptions"] .guide-icon {
    background-position:-283px -482px
}
        /*library*/
#header.ytd-guide-collapsible-section-entry-renderer ytd-guide-entry-renderer {
    background:none!Important;
}
.ytd-guide-entry-renderer[href="/feed/library"] .title.ytd-guide-entry-renderer, #guide-section-title.ytd-guide-section-renderer {
    color:#cc181e!important;
    text-transform:uppercase;
    margin: 0 5px;
    padding: 1px 0 8px!important;
    line-height: 13px;
    font-size: 11px!important;
    font-weight: 500;
}
.ytd-guide-entry-renderer[href="/feed/library"] .title.ytd-guide-entry-renderer:hover, #guide-section-title.ytd-guide-section-renderer:hover {
    text-decoration:underline
}
[href="/feed/library"] .guide-icon.ytd-guide-entry-renderer {
    display:none
}
[href="/feed/library"] tp-yt-paper-item.ytd-guide-entry-renderer,#endpoint.yt-simple-endpoint.ytd-guide-entry-renderer[href="/feed/library"] {
    min-width:0;
    min-height:0!important;
    height:auto!important;
    padding:0!important
}
        /*history*/
.ytd-guide-entry-renderer[href^="/feed/history"] .guide-icon{
    background-position:-237px -229px
}
.ytd-guide-entry-renderer[href^="/feed/history"]:hover .guide-icon,[active] .ytd-guide-entry-renderer[href^="/feed/history"] .guide-icon {
    background-position:-60px -395px
}
        /*your videos*/
.ytd-guide-entry-renderer[href^="https://studio.youtube.com/channel/"] .guide-icon{
    background: no-repeat url(http://s.ytimg.com/yts/imgbin/www-guide-topguide-vflgwVzsz.png) 0 -349px;
}
.ytd-guide-entry-renderer[href^="https://studio.youtube.com/channel/"]:hover .guide-icon,[active] .ytd-guide-entry-renderer[href^="https://studio.youtube.com/channel/"] .guide-icon {
    background-position: 0 -24px;
}
        /*watch later*/
.ytd-guide-entry-renderer[href="/playlist?list=WL"] .guide-icon{
    background-position:-122px -96px
}
.ytd-guide-entry-renderer[href="/playlist?list=WL"]:hover .guide-icon,[active] .ytd-guide-entry-renderer[href="/playlist?list=WL"] .guide-icon {
    background-position:-195px -478px
}
        /*purchases*/
.ytd-guide-entry-renderer[href="/purchases"] .guide-icon{
    background-position:-98px -324px
}
.ytd-guide-entry-renderer[href="/purchases"]:hover .guide-icon,[active] .ytd-guide-entry-renderer[href="/purchases"] .guide-icon {
    background-position:-28px -42px
}
        /*liked videos*/
.ytd-guide-entry-renderer[href="/playlist?list=LL"] .guide-icon{
    background-position:-360px 0
}
.ytd-guide-entry-renderer[href="/playlist?list=LL"]:hover .guide-icon,[active] .ytd-guide-entry-renderer[href="/playlist?list=LL"] .guide-icon {
    background-position:0 -174px;
    filter:contrast(1)!important
}
#endpoint[href="/playlist?list=LL"] yt-icon:first-of-type {
    content:none!important;
    min-width:20px;
    min-height:20px
}
        /*guide builder*/
.ytd-guide-entry-renderer[href="/feed/guide_builder"] .guide-icon{
    background-position:-206px -288px;
}
.ytd-guide-entry-renderer[href="/feed/guide_builder"]:hover .guide-icon,[active] .ytd-guide-entry-renderer[href="/feed/guide_builder"] .guide-icon {
    background-position:-158px -263px;
}
    /*guide subscriptions*/
.guide-entry-badge path{
    display:none
}
#newness-dot.ytd-guide-entry-renderer {
    background:none;
    height:100%
}
#newness-dot.ytd-guide-entry-renderer:before {
    content:"+1";
    font:400 11px 'roboto', 'arial';
    color:#767676;
    line-height:22px
}
.ytd-guide-entry-renderer:hover #newness-dot.ytd-guide-entry-renderer:before {
    color:#fff
}
yt-img-shadow.ytd-guide-entry-renderer, yt-img-shadow.ytd-guide-entry-renderer img {
    max-width:20px;
    max-height:20px
}
#guide yt-img-shadow.ytd-guide-entry-renderer {
    margin-right:9px!important
}
    /*guide bottom*/
        /*setting*/
.ytd-guide-entry-renderer[href="/account"] .guide-icon{
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflq9QGbD.webp) 0 -89px;
    opacity:.5
}
.ytd-guide-entry-renderer[href="/account"]:hover .guide-icon {
    background-position:0 -89px;
    filter:invert(1);
    opacity:1
}
        /*report history*/
.ytd-guide-entry-renderer[href="/reporthistory"] .guide-icon{
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -241px -132px;
    opacity:.5
}
.ytd-guide-entry-renderer[href="/reporthistory"]:hover .guide-icon {
    background-position: -241px -132px;
    filter:invert(1);
    opacity:1
}
        /*help*/
ytd-guide-section-renderer:nth-child(5) .ytd-guide-section-renderer:nth-child(3) .guide-icon{
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflcdq1Wx.png) -95px -381px;
    opacity:.5
}
ytd-guide-section-renderer:nth-child(5) .ytd-guide-section-renderer:nth-child(3):hover .guide-icon {
    filter:invert(1);
    opacity:1
}
    /*guide footer*/
ytd-guide-section-renderer:nth-child(3), ytd-guide-section-renderer:nth-child(4), #footer {
    display:none
}
    /*popup guide*/
#scrim.tp-yt-app-drawer {
    background:transparent
}
#contentContainer.tp-yt-app-drawer {
    width:230px
}
    /*live*/
.guide-entry-badge.ytd-guide-entry-renderer {
    width:12px;
    height:12px
}
/*tooltips*/
html tp-yt-paper-tooltip .tp-yt-paper-tooltip[style-target="tooltip"] {
        position: relative;
    padding: 6px;
    color: #fff;
    background: #000;
    font-size: 11px;
    font-weight: 500;
    white-space: nowrap;
    border-radius: 2px;
    box-shadow: 0 1px 1px rgb(0 0 0 / 25%);
    line-height:normal;
    margin-top:0;
    margin-bottom:0;
}
#masthead tp-yt-paper-tooltip {
    top:45px!important
}
ytd-searchbox tp-yt-paper-tooltip, tp-yt-paper-tooltip.ytd-channel-name {
    display:none!important
}
#masthead .tp-yt-paper-tooltip:before { /*UP ARROW*/
    content:"";
    position: absolute;
    z-index: 2147483647;
    width: 0;
    height: 0;
    vertical-align: top;
    border: 1px solid transparent;
    border-bottom-color: #000;
    opacity: 1;
    top: -5px;
    border-width: 0 5px 5px;
    text-align:center;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
}
.ytd-badge-supported-renderer .tp-yt-paper-tooltip:before, #info .tp-yt-paper-tooltip:before{ /*DOWN ARROW*/
    content:"";
    position: absolute;
    z-index: 2147483647;
    width: 0;
    height: 0;
    vertical-align: top;
    border: 1px solid transparent;
    border-top-color: #000;
    opacity: 1;
    bottom: -5px;
    border-width: 5px 5px 0;
    text-align:center;
    margin-left: auto;
    margin-right: auto;
    left: 0;
    right: 0;
}
tp-yt-paper-tooltip.ytd-badge-supported-renderer {
    bottom:auto;
    top:13px!important;
    margin-left:2px
}
#info tp-yt-paper-tooltip {
    margin-top:-64px
}
#hover-overlays tp-yt-paper-tooltip {
    display:none
}
/*spinner*/
#spinnerContainer.active.tp-yt-paper-spinner {
    background: url(//s.ytimg.com/yts/img/icn_loading_animated-vflff1Mjj.gif) no-repeat center;
    fill:none;
    animation:none;
    display:inline-block;
    margin-left:-20px
}
#spinnerContainer.active .tp-yt-paper-spinner {
    display:none
}
#spinnerContainer.active.tp-yt-paper-spinner:after {
    content:"Loading...";
    font:400 13px arial;
    display:inline-block;
    position:relative;
    left:28px;
    top:6px   
}
/*thumbnail features*/
    /*time*/
ytd-thumbnail-overlay-time-status-renderer {
    margin: 0;
    padding: 0 4px;
    font-weight: 500;
    font-size: 11px;
    background-color: #000;
    color: #fff ;
    height: 14px;
    line-height: 14px;
    opacity: .75;
    bottom:2px;
    right:2px;
    border-radius:0
}
#text.ytd-thumbnail-overlay-time-status-renderer {
    line-height:14px;
    max-height:none
}
    /*watch later*/
ytd-thumbnail-overlay-toggle-button-renderer {
    background:#f8f8f8;
    background-size: auto;
    width: 20px;
    height: 20px;
    border:1px solid #d3d3d3;
    color: #333;
    border-radius:2px;
    margin:2px;
    top:auto;
    bottom:0
}
ytd-thumbnail-overlay-toggle-button-renderer yt-icon {
    background:no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflcdq1Wx.png) -227px -209px;
    height:13px;
    width:13px;
    opacity:.5;
    fill:none
}
/*3 dots*/
ytd-menu-renderer ytd-menu-renderer .ytd-menu-renderer[style-target="button"], .ytd-menu-renderer[style-target="button"] {
    width:24px;
    height:24px
}
.ytd-menu-renderer[style-target="button"] yt-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflq9QGbD.webp) -219px -510px;
    background-size: auto;
    width: 13px;
    height: 13px;
    fill:none;
    opacity:.7
}
ytd-menu-renderer.ytd-rich-grid-media {
    right:0
}
/*badge*/
.badge-style-type-simple.ytd-badge-supported-renderer {
    border:1px solid #ddd;
    background:#fff;
    padding:0px 4px;
    font-size:11px;
    text-transform:uppercase;
    color:#444;
    line-height:13px
}
.title-badge.ytd-rich-grid-media, .video-badge.ytd-rich-grid-media {
    margin:0
}
.badge-style-type-live-now-alternate.ytd-badge-supported-renderer yt-icon.ytd-badge-supported-renderer {
    display:none
}
.badge-style-type-live-now-alternate.ytd-badge-supported-renderer {
    padding: 0;
    color: #b91f1f;
    font-size: 10px;
    background-color: #fff;
    border-radius:0;
    height:15px;
}
.badge-style-type-live-now-alternate.ytd-badge-supported-renderer span.ytd-badge-supported-renderer{
    line-height: 1.5em;
    height: 13px;
    padding:0 4px;
    border: 1px solid #b91f1f;
}
/*checkbox*/
#checkbox.tp-yt-paper-checkbox {
    border:1px solid #c6c6c6;
    border-radius:0;
    box-shadow:inset 0 0 1px rgb(0 0 0 / 5%)
}
#checkbox.checked.tp-yt-paper-checkbox {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflEXP50f.png) 0 -1058px;
    border:1px solid #36649c;
}
#checkbox.checked.tp-yt-paper-checkbox #checkmark {
    display:none
}
#checkboxContainer.tp-yt-paper-checkbox {
    height:16px;
    width:16px;
    min-width:0;
    margin:0
}
#label.checkbox-height.ytd-playlist-add-to-option-renderer {
    font:400 13px 'roboto'
}
tp-yt-paper-checkbox tp-yt-paper-checkbox .tp-yt-paper-checkbox[style-target="label"], .tp-yt-paper-checkbox[style-target="label"] {
    height:auto;
    padding-left:5px;
}
/*button*/
ytd-button-renderer {
    letter-spacing:0
}
ytd-button-renderer #button.ytd-button-renderer yt-formatted-string.ytd-button-renderer {
    font-size:11px;
    margin:0
}
ytd-button-renderer #button.ytd-button-renderer,
.style-blue-text.size-default, .style-primary.size-default {
    text-transform:none;
    padding:0;
    min-width:0
}
#cancel-button, #submit-button,
#label.yt-dropdown-menu,
tp-yt-paper-button#button.style-blue-text.size-default, /*tp-yt-paper-button#button.style-primary.size-default,*/
#buy-button.yt-super-vod-buy-flow-content-renderer,
.ytd-playlist-sidebar-primary-info-renderer button.yt-icon-button{
    border:1px solid #d3d3d3;
    background: #f8f8f8;
    color: #333;
    border-radius: 2px;
    box-shadow: 0 1px 0 rgba(0,0,0,0.05);
}
#cancel-button:hover, #submit-button:hover,
#label.yt-dropdown-menu:hover,
tp-yt-paper-button#button.style-blue-text.size-default:hover, /*tp-yt-paper-button#button.style-primary.size-default:hover,*/
#buy-button.yt-super-vod-buy-flow-content-renderer:hover,
.ytd-playlist-sidebar-primary-info-renderer button.yt-icon-button:hover {
    border-color: #c6c6c6;
    background: #f0f0f0;
    box-shadow: 0 1px 0 rgba(0,0,0,0.10);
}
#cancel-button:active, #submit-button:active,
#label.yt-dropdown-menu:active,
tp-yt-paper-button#button.style-blue-text.size-default:active, /*tp-yt-paper-button#button.style-primary.size-default:active,*/
#buy-button.yt-super-vod-buy-flow-content-renderer:active,
.ytd-playlist-sidebar-primary-info-renderer button.yt-icon-button:active {
    border-color: #c6c6c6;
    background: #e9e9e9;
    box-shadow: inset 0 1px 0 #ddd;
}
/*TODO*/
#cancel-button a, #submit-button a,
#label.yt-dropdown-menu #icon-label.yt-dropdown-menu, .style-blue-text.size-default yt-formatted-string, /*tp-yt-paper-button#button.style-primary.size-default yt-formatted-string,*/ #buy-button.yt-super-vod-buy-flow-content-renderer yt-formatted-string {
    padding:0 10px;
    height:26px;
    font-size:11px;
    border-radius:2px;
    letter-spacing:0;
    text-transform:none;
    line-height:28px
}
#submit-button, /*tp-yt-paper-button#button.style-primary.size-default,*/
#confirm-button #button.style-blue-text.size-default {
    border-color: #167ac6;
    background: #167ac6;
    color:#fff;
}
#submit-button:hover, /*tp-yt-paper-button#button.style-primary.size-default:hover,*/
#confirm-button #button.style-blue-text.size-default:hover {
    background: #126db3;
    border-color: #167ac6;
}
#submit-button:active, /*tp-yt-paper-button#button.style-primary.size-default:active,*/
#confirm-button #button.style-blue-text.size-default:active {
    background: #095b99;
    box-shadow: inset 0 1px 0 rgba(0,0,0,0.5);
    border-color: #167ac6;
}
#submit-button[disabled], #cancel-button[disabled],#submit-button[disabled]:hover, #cancel-button[disabled]:hover/*,
tp-yt-paper-button#button.style-primary.size-default[disabled]*/ {
    opacity:.5
}
#label.yt-dropdown-menu #icon-label.yt-dropdown-menu:after { /*comments and channel dropdown*/
    content:"";
    border: 1px solid transparent;
    border-top-color: #333;
    border-width: 4px 4px 0;
    width: 0;
    height: 0;
    margin-left:8px;
    position:relative;
    display:inline-block;
    top:-3px
}
#label.yt-dropdown-menu[aria-expanded="true"] {
    border-color: #c6c6c6;
    background: #e9e9e9;
    box-shadow: inset 0 1px 0 #ddd;
}
#label.keyboard-focus.yt-dropdown-menu #icon-label.yt-dropdown-menu {
    font-weight:500
}
#cancel-button a tp-yt-paper-button.yt-button-renderer {
    padding:0
}
    /*dialog*/
.buttons.yt-confirm-dialog-renderer, #actions.ytd-add-to-playlist-create-renderer {
    background:#f1f1f1
}
#actions.ytd-add-to-playlist-create-renderer {
    padding:15px 20px;
    margin-top:15px
}
tp-yt-paper-dialog {
    box-shadow:none
}
tp-yt-paper-dialog yt-confirm-dialog-renderer, ytd-pdg-buy-flow-renderer {
    box-shadow: 0 0 15px rgb(0 0 0 / 18%);
    border:1px solid #e2e2e2
}
    /*input time*/
input.yt-clip-creation-scrubber-renderer {
    border-radius:0;
    box-shadow: inset 0 0 1px rgb(0 0 0 / 5%);
    border: 1px solid #d3d3d3;
    color: #333;
    padding:5px 10px 6px 10px;
    font-size:13px;
    line-height:normal;
    min-width:0;
    letter-spacing:0;
    font-family:"roboto";
    font-weight:400
}
/*actual menu popup*/
ytd-menu-popup-renderer {
    box-shadow:none;
    border-radius:0;
}
tp-yt-paper-listbox {
    padding: 8px 0;
    border: 1px solid #ccc;
    overflow: auto;
    background: #fff;
    border-radius: 2px;
}
yt-formatted-string.ytd-menu-service-item-renderer, yt-live-chat-app tp-yt-paper-item.ytd-menu-navigation-item-renderer, tp-yt-paper-item.ytd-toggle-menu-service-item-renderer span {
    display: block;
    margin: 0;
    padding: 0 25px;
    color: #333;
    font-size: 13px;
    text-decoration: none;
    white-space: nowrap;
    word-wrap: normal;
    line-height: 25px;
}
yt-live-chat-app tp-yt-paper-item.ytd-menu-navigation-item-renderer  {
    min-height:0
}
yt-icon.ytd-menu-service-item-renderer, yt-live-chat-app tp-yt-paper-item.ytd-menu-navigation-item-renderer yt-icon {
    display:none
}
tp-yt-paper-item.ytd-menu-service-item-renderer, yt-live-chat-app ytd-menu-navigation-item-renderer a, tp-yt-paper-item.ytd-toggle-menu-service-item-renderer {
    padding:0;
    height:auto;
    min-height:0;
    --paper-item-min-height:0
}
tp-yt-paper-item.ytd-menu-service-item-renderer:hover, yt-live-chat-app ytd-menu-navigation-item-renderer a:hover, tp-yt-paper-item.ytd-toggle-menu-service-item-renderer:hover {
    background:#444
}
tp-yt-paper-item:hover yt-formatted-string.ytd-menu-service-item-renderer, yt-live-chat-app ytd-menu-navigation-item-renderer a:hover yt-formatted-string, tp-yt-paper-item.ytd-toggle-menu-service-item-renderer:hover span {
    color:#fff
}
ytd-menu-service-item-renderer[has-separator]:not(:last-child)::after {
    content:none
}
 
.dropdown-content.tp-yt-paper-menu-button { /*type B dropdown*/
    box-shadow:0 2px 4px rgba(0,0,0,.2);
}
tp-yt-paper-menu-button[vertical-align="top"] .dropdown-content.tp-yt-paper-menu-button {
    top:1px
}
tp-yt-paper-listbox.yt-dropdown-menu {
    border-color:#d3d3d3
}
tp-yt-paper-item.yt-dropdown-menu {
    height:25px!important;
    padding: 0 15px;
}
tp-yt-paper-item.yt-dropdown-menu .item {
    font-size:13px
}
tp-yt-paper-listbox.yt-dropdown-menu .iron-selected.yt-dropdown-menu {
    background:none
}
tp-yt-paper-listbox.yt-dropdown-menu a:hover .yt-dropdown-menu {
    background:#eee;
}
            /*watch (report)*/
#contentWrapper.tp-yt-iron-dropdown > ytd-menu-popup-renderer {
    overflow:visible
}
tp-yt-iron-dropdown ytd-menu-service-item-renderer:first-child:last-child yt-icon {
    display:inline-block;
    margin:0 0 0 15px;
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -243px -134px;
    fill:none;
    width:16px;
    height:16px;
    opacity:.5
}
tp-yt-iron-dropdown ytd-menu-service-item-renderer:first-child:last-child yt-formatted-string.ytd-menu-service-item-renderer {
    padding-left:13px;
    padding-right:15px;
    color:#333
}
tp-yt-iron-dropdown ytd-menu-service-item-renderer:first-child:last-child tp-yt-paper-item.ytd-menu-service-item-renderer:hover {
    background:#eee
}
            /*watch (more)*/
tp-yt-iron-dropdown ytd-menu-popup-renderer[style*="max-height: 7"] ytd-menu-service-item-renderer yt-icon {
    display:inline-block;
    margin:0 0 0 15px;
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -243px -134px;
    fill:none;
    width:16px;
    height:16px;
    opacity:.5
}
tp-yt-iron-dropdown ytd-menu-popup-renderer[style*="max-height: 7"] ytd-menu-service-item-renderer:nth-child(2) yt-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -82px -876px;
}
tp-yt-iron-dropdown ytd-menu-popup-renderer[style*="max-height: 7"] ytd-menu-service-item-renderer yt-formatted-string.ytd-menu-service-item-renderer {
    padding-left:13px;
    padding-right:15px;
    color:#333
}
tp-yt-iron-dropdown ytd-menu-popup-renderer[style*="max-height: 7"] ytd-menu-service-item-renderer tp-yt-paper-item.ytd-menu-service-item-renderer:hover {
    background:#eee
}
/*toast popups*/
yt-notification-action-renderer[ui-refresh] tp-yt-paper-toast.yt-notification-action-renderer {
    border-radius:0;
    background:#167ac6
}
/**********************PAGE SPECIFICS***********************/
/*home*/
    /*some chips*/
ytd-feed-filter-chip-bar-renderer {
    max-width:1052px;
    margin:0 auto
}
#chips-wrapper.ytd-feed-filter-chip-bar-renderer {
    border:0;
    border-bottom:1px solid #e8e8e8;
    height:40px;
    top:50px;
    max-width:1052px
}
yt-chip-cloud-chip-renderer.ytd-feed-filter-chip-bar-renderer {
    min-height:40px!important;
    border-radius:0;
    border:0;
    border-bottom:3px solid transparent;
    background:none!important;
    margin:0 0 0 30px!important;
    padding:0;
    color:#555;
    font-size:13px
}
yt-chip-cloud-chip-renderer[chip-style="STYLE_HOME_FILTER"][selected] {
    border-color:#cc181e;
    background:none;
    color:#333
}
yt-chip-cloud-chip-renderer.ytd-feed-filter-chip-bar-renderer:hover {
    border-color:#cc181e
}
#left-arrow-button.ytd-feed-filter-chip-bar-renderer, #right-arrow-button.ytd-feed-filter-chip-bar-renderer {
    background:none
}
#left-arrow.ytd-feed-filter-chip-bar-renderer::after, #right-arrow.ytd-feed-filter-chip-bar-renderer::before {
    content:none
}
    /*general*/
#grid-title.ytd-rich-grid-renderer {
    display:inline-block!important;
    margin-top:0!important
}
.redux-home-container ytd-rich-item-renderer {
    transition:none;
    width:var(--globalthumb);
    margin-left:5px;
    margin-right:5px
}
.redux-home-container ytd-rich-item-renderer #video-title-link:hover yt-formatted-string {
    text-decoration:underline
}
html ytd-app ytd-video-meta-block.style-scope #metadata-line.ytd-video-meta-block, #metadata-line.ytd-video-meta-block span {
    line-height:14.3px!important;
}
#metadata-line.ytd-video-meta-block, yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string, yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string:visited {
    color:#767676
}
#dismissible:hover yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string {
    color:#167ac6
}
yt-formatted-string[has-link-only_]:not([force-default-style]):hover a.yt-simple-endpoint.yt-formatted-string {
    text-decoration:underline
}
ytd-video-meta-block ytd-channel-name #text.ytd-channel-name:before {
    content:"by ";
    color:#767676
}
#meta.ytd-rich-grid-media {
    padding-right:14px;
    overflow-y:hidden
}
[page-subtype="home"] ytd-rich-grid-renderer .redux-home-container:before {
    content:"Recommended";
    display:block;
    text-align:left;
    width:calc(100% - 30px);
    background:#fff;
    font:500 16px 'Roboto';
    padding:12px 5px;
    padding-top:6px
}
[page-subtype="home"] #contents.ytd-rich-grid-renderer {
    margin-top:0!important
}
#page-manager ytd-browse[page-subtype="home"] ytd-two-column-browse-results-renderer, #page-manager ytd-browse[page-subtype="subscriptions"] ytd-two-column-browse-results-renderer {
    max-width:none!Important
}
.ytd-rich-grid-renderer #video-title.ytd-rich-grid-media {
    font-size:13px!important;
    line-height:16.9px!important
}
@media (max-width:2100px) {
    [page-subtype="home"] #contents.ytd-rich-grid-renderer {
        padding:0 10px;
        max-width:1650px;
    }
}
@media (max-width:1960px) {
    [page-subtype="home"] #contents.ytd-rich-grid-renderer {
        padding:0 10px;
        max-width:1444px;
    }
}
@media (max-width:1750px) {
    [page-subtype="home"] #contents.ytd-rich-grid-renderer {
        padding:0 10px;
        max-width:1238px
    }
}
@media (max-width:1520px) {
    [page-subtype="home"] #contents.ytd-rich-grid-renderer {
        padding:0 10px;
        max-width:1032px
    }
}
@media (max-width:1074px) {
    [page-subtype="home"] #contents.ytd-rich-grid-renderer {
        padding:0 10px;
        max-width:826px
    }
}
/*watch*/
    /*primary*/
        /*general*/
#primary .title.ytd-video-primary-info-renderer {
    line-height:24px
}
html ytd-watch-flexy:not([theater]):not([fullscreen]) #primary.ytd-watch-flexy, html ytd-watch-flexy:not([theater]):not([fullscreen]) #secondary.ytd-watch-flexy {
    padding-top:10px!important
}
        /*player*/
.ytp-chrome-controls .ytp-button.ytp-mute-button {
    padding:3px
}
.ytp-chrome-controls, .ytp-embed:not(.ytp-big-mode) .ytp-chrome-controls, .ytp-chrome-bottom {
    height:36px!important;
    line-height:36px!Important
}
.ytp-progress-bar-container {
    bottom:35px!important
}
        /*watch headng*/
.super-title a.yt-simple-endpoint.yt-formatted-string {
    background-color: #f1f1f1;
    border-radius: 2px;
    color: #000;
    padding: 0 4px;
    margin-right: 6px;
    text-transform: none;
    font-size:11px
}
ytd-app .title.style-scope.ytd-video-primary-info-renderer yt-formatted-string.ytd-video-primary-info-renderer {
    font-family:"Roboto","arial"!important
}
ytd-video-primary-info-renderer {
    padding-left: 15px;
    padding-right: 15px;
    border-bottom: 0;
    padding-top:15px!important;
    padding-bottom:9px!important
}
#sponsor-button.ytd-video-owner-renderer, #analytics-button.ytd-video-owner-renderer {
    margin-right:0
}
#upload-info ytd-channel-name .yt-simple-endpoint.yt-formatted-string {
    color:#333;
    font:500 13px 'roboto', 'arial';
}
#upload-info #text-container.ytd-channel-name {
    line-height:1;
}
#upload-info.ytd-video-owner-renderer {
    justify-content:initial
}
#upload-info #channel-name.ytd-video-owner-renderer {
    padding-bottom:2px
}
#avatar.ytd-video-owner-renderer {
    margin-right:10px
}
#info #top-row.ytd-video-secondary-info-renderer {
    padding-top:8px;
    margin-bottom:6px
}
.more-button.ytd-video-secondary-info-renderer, .less-button.ytd-video-secondary-info-renderer {
    margin-top:4px
}
#meta.ytd-watch-flexy paper-button#more, #meta.ytd-watch-flexy tp-yt-paper-button#more, #meta.ytd-watch-flexy paper-button#less, #meta.ytd-watch-flexy tp-yt-paper-button#less, tp-yt-paper-button#expand, tp-yt-paper-button#collapse {
    margin-top:14px!Important
}
ytd-video-secondary-info-renderer {
    padding-bottom:5px!important
}
#meta-contents > ytd-video-secondary-info-renderer > #container > ytd-expander > #content {
    padding-top:17px!Important;
}
#meta ytd-expander[collapsed] > #content.ytd-expander {
    max-height:61px!important
}
#container > ytd-expander.ytd-video-secondary-info-renderer > #content > #description {
    margin-top:4px!Important
}
ytd-app ytd-expander.ytd-video-secondary-info-renderer {
    line-height:14px!important
}
#description a.yt-simple-endpoint.yt-formatted-string {
    color:var(--yt-spec-text-primary)
}
ytd-video-secondary-info-renderer:hover #description a.yt-simple-endpoint.yt-formatted-string {
    color:#167ac6
}
ytd-video-secondary-info-renderer:hover #description a.yt-simple-endpoint.yt-formatted-string:hover {
    text-decoration:underline
}
        /*sub*/
#subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer {
    padding:0 6px 0 5px;
    border:1px solid transparent;
    background:#e62117;
    box-shadow: 0 1px 0 rgba(0,0,0,0.05);
}
#subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer:hover {
    background:#cc181e
}
#subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer:active {
    background:#b31217
}
#subscribe-button > ytd-subscribe-button-renderer > tp-yt-paper-button > yt-formatted-string, #subscribe-button > ytd-button-renderer > a > tp-yt-paper-button > yt-formatted-string {
    padding-top:0!important;
    line-height:20px
}
#subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer yt-formatted-string:before {
    content:"";
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -48px -775px;
    width: 16px;
    height: 12px;
    display:inline-block;
    margin-right:6px;
    margin-bottom:-2px
}
#subscribe-button > ytd-subscribe-button-renderer:not(.style-primary) > tp-yt-paper-button:not([subscribed]):not([page-subtype="subscriptions"] #subscribe-button tp-yt-paper-button)::before, #subscribe-button > ytd-button-renderer:not(.style-primary) > a > tp-yt-paper-button:not([subscribed]):not([page-subtype="subscriptions"] #subscribe-button tp-yt-paper-button)::before {
    content:none
}
#subscribe-button ~ #redux-trim-span {
    font-size:11px;
    line-height:19px;
    padding-bottom:0;
    border-top: 1px solid #ccc;
    border-right: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    background-color: #fafafa;
}
#subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed], ytd-button-renderer.style-suggestive[is-paper-button] tp-yt-paper-button#button.ytd-button-renderer {
    border: 1px solid #ccc;
    background-color: #f8f8f8;
    color: #666;
    box-shadow: 0 1px 0 rgba(0,0,0,0.05);
}
#subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed]:hover, ytd-button-renderer.style-suggestive[is-paper-button] tp-yt-paper-button#button.ytd-button-renderer:hover {
    border: 1px solid #ccc;
    background-color: #f8f8f8;
    color: #666;
}
#subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed]:active, ytd-button-renderer.style-suggestive[is-paper-button] tp-yt-paper-button#button.ytd-button-renderer:active {
    background-color:#ededed
}
#subscribe-button > ytd-subscribe-button-renderer:not(.style-primary) > tp-yt-paper-button[subscribed]::before, #subscribe-button > ytd-button-renderer:not(.style-primary) > a > tp-yt-paper-button[subscribed]::before {
    content:none
}
#subscribe-button tp-yt-paper-button.ytd-subscribe-button-renderer[subscribed] yt-formatted-string:before {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflq9QGbD.webp) -127px -458px;
}
ytd-subscription-notification-toggle-button-renderer yt-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflq9QGbD.webp) -229px 0;
    fill:none;
    max-width:18px;
    max-height:18px
}
#notification-preference-button > ytd-subscription-notification-toggle-button-renderer > a > yt-icon-button {
    max-width:18px!important;
    max-height:18px!important;
    margin:0!important;
}
#notification-preference-button {
    padding:0 4px;
    margin-left:-2px;
    padding-top:2px;
}
#notification-preference-button {
    border:1px solid #d3d3d3;
    background: #f8f8f8;
    color: #333;
    box-shadow: 0 1px 0 rgba(0,0,0,0.05);
}
#notification-preference-button:hover {
    border-color: #c6c6c6;
    background: #f0f0f0;
    box-shadow: 0 1px 0 rgba(0,0,0,0.10);
}
#notification-preference-button:active {
    border-color: #c6c6c6;
    background: #e9e9e9;
    box-shadow: inset 0 1px 0 #ddd;
}
#reduxSubDiv #notification-preference-button yt-icon-button {
    margin:0!important
}
#reduxSubDiv #notification-preference-button {
    padding-right:4px;
    padding-left:4px
}
#notification-preference-button yt-icon-button {
    opacity:.5
}
#notification-preference-button:hover yt-icon-button {
    opacity:.6
}
#notification-preference-button:active yt-icon-button {
    opacity:1
}
ytd-button-renderer.style-suggestive[is-paper-button] tp-yt-paper-button#button.ytd-button-renderer {
    padding:0 10px
}
#info #sponsor-button {
    display:none
}
            /*compact sub*/
ytd-subscribe-button-renderer[button-style="COMPACT_GRAY"] tp-yt-paper-button.ytd-subscribe-button-renderer {
    font-weight: 500;
    font-size: 11px;
    box-shadow: 0 1px 0 rgba(0,0,0,0.05);
    border: 1px solid #ccc;
    background-color: #f8f8f8;
    color: #666;
    text-transform:none;
    padding:0 8px;
    height:20px
}
            /*action button*/
#info .redux-moved-info:first-of-type yt-icon-button#button,#info ytd-button-renderer #button.ytd-button-renderer {
    padding:0!important;
    content:none;
    width:20px;
    height:20px;
}
#info .redux-moved-info:first-of-type {
    padding-left:0;
    color:#000
}
.redux-moved-info:first-of-type yt-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -151px -725px;
    background-size: auto;
    width: 20px;
    height: 20px;
    content:none!important;
    fill:none;
}
#info .redux-moved-info [aria-label="Report"] yt-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -243px -134px;
}
ytd-video-primary-info-renderer a.yt-simple-endpoint.ytd-button-renderer {
    height:28px;
    align-items:center
}
ytd-video-primary-info-renderer > .ytd-menu-renderer {
    padding-top:5px;
    padding-left:10px;
    padding-right:6px;
}
ytd-video-primary-info-renderer > .ytd-menu-renderer a > :not(tp-yt-paper-tooltip), ytd-toggle-button-renderer.ytd-menu-renderer.style-text a > :not(tp-yt-paper-tooltip), .redux-moved-info:last-of-type + yt-icon-button {
    opacity:.5
}
ytd-video-primary-info-renderer > .ytd-menu-renderer:hover a > :not(tp-yt-paper-tooltip), ytd-toggle-button-renderer.ytd-menu-renderer.style-text:hover a > :not(tp-yt-paper-tooltip), .redux-moved-info:last-of-type + yt-icon-button:hover {
    opacity:.6
}
ytd-video-primary-info-renderer > .ytd-menu-renderer:active a > :not(tp-yt-paper-tooltip), ytd-toggle-button-renderer.ytd-menu-renderer.style-text:active a > :not(tp-yt-paper-tooltip), .redux-moved-info:last-of-type + yt-icon-button:active {
    opacity:1
}
.redux-moved-info:last-of-type + yt-icon-button {
    transform:none!Important;
    height:auto;
    width:auto
}
.redux-moved-info:last-of-type + yt-icon-button button.yt-icon-button {
    height:28px;
    width:auto
}
.redux-moved-info:nth-last-of-type(1) yt-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -267px -824px;
    fill:none
}
.redux-moved-info ~ .ytd-menu-renderer[style-target="button"] yt-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -154px -860px;
    width:20px;
    height:20px;
    opacity:1;
}
.redux-moved-info:nth-last-of-type(2):nth-of-type(3) yt-icon, .redux-moved-info:nth-last-of-type(3):nth-of-type(2) yt-icon {
    fill:#000
}
.redux-moved-info ~ .ytd-menu-renderer[style-target="button"] yt-icon:after {
    content:"More";
    font:500 11px 'roboto';
    color:#000;
    position:relative;
    margin-left:58px;
    margin-top:1px
}
        /*like*/
ytd-video-primary-info-renderer .ytd-menu-renderer yt-icon-button {
    margin-right:6px
}
html:not([dark]) ytd-app ytd-toggle-button-renderer.ytd-menu-renderer[is-icon-button] #text.ytd-toggle-button-renderer, html:not([dark]) ytd-app ytd-button-renderer.style-default[is-icon-button] #text.ytd-button-renderer {
    color:#000!important;
    font:500 11px 'roboto';
    letter-spacing:0
}
#info ytd-button-renderer.style-default[is-icon-button] #text.ytd-button-renderer {
    margin-top:1px;
}
#info ytd-video-primary-info-renderer ytd-button-renderer.ytd-menu-renderer {
    text-transform:none;
    font-size:11px
}
html:not([dark]) ytd-app ytd-toggle-button-renderer.ytd-menu-renderer.style-default-active[is-icon-button]:first-child #text.ytd-toggle-button-renderer, html:not([dark]) ytd-app ytd-toggle-button-renderer.ytd-menu-renderer[is-icon-button]:active:first-child #text.ytd-toggle-button-renderer {
    color:#167ac6!important
}
ytd-video-primary-info-renderer #top-level-buttons-computed > ytd-toggle-button-renderer:last-of-type > a > yt-icon-button > #button[aria-pressed="true"] > yt-icon {
    filter:brightness(0)!important;
}
ytd-video-primary-info-renderer #top-level-buttons-computed > ytd-toggle-button-renderer:first-of-type:active > a > yt-icon-button > #button > yt-icon {
    content: url('moz-extension://483ce42f-7d8f-4c86-a625-585e54d49b01/images/like-pressed.png') !important;
}
#top-level-buttons-computed yt-icon-button.ytd-toggle-button-renderer {
    padding:0;
    height:28px;
    width:33px;
    padding-left:13px
}
ytd-menu-renderer:not([condensed]) .ytd-menu-renderer[button-renderer] + .ytd-menu-renderer[button-renderer] {
    margin:0
}
ytd-toggle-button-renderer.force-icon-button a.ytd-toggle-button-renderer {
    padding-right:0
}
#menu.ytd-video-primary-info-renderer {
    padding-bottom:12px;
    padding-top:4px
}
ytd-video-view-count-renderer[small] {
    padding-bottom:1px
}
html:not([dark]) #container.ytd-sentiment-bar-renderer {
    min-width:160px;
    float:right
}
ytd-video-primary-info-renderer #top-level-buttons-computed > ytd-toggle-button-renderer.ytd-menu-renderer > a > yt-icon-button > #button > yt-icon {
    filter:initial!important
}
#info.ytd-video-primary-info-renderer > #menu-container {
    top:-2px
}
    /*the game info*/
[component-style="RICH_METADATA_RENDERER_STYLE_TOPIC"] {
    display:none
}
ytd-rich-metadata-row-renderer:not([fixie]) #contents.ytd-rich-metadata-row-renderer .ytd-rich-metadata-row-renderer {
    min-width:160px!important;
    min-height:0!important;
    margin:0;
    width:168px
}
ytd-rich-metadata-renderer[component-style="RICH_METADATA_RENDERER_STYLE_BOX_ART"] #thumbnail.ytd-rich-metadata-renderer {
    margin-right:8px;
    height:auto;
    max-width:56px
}
#text-container.ytd-rich-metadata-renderer {
    justify-content:start
}
#call-to-action.ytd-rich-metadata-renderer {
    color:#999;
    text-transform:none;
}
ytd-expander:hover #call-to-action.ytd-rich-metadata-renderer {
    color:#2793e6
}
#call-to-action.ytd-rich-metadata-renderer:hover {
    text-decoration:underline
}
ytd-metadata-row-container-renderer.sticky {
    position:absolute;
    right:10px;
    top:5px;
    width:160px
}
ytd-app ytd-expander.ytd-video-secondary-info-renderer {
    position:relative;
    margin:0
}
a.ytd-rich-metadata-renderer {
    width:100%
}
#meta-contents > ytd-video-secondary-info-renderer > #container > ytd-expander > #content {
    max-width:calc(100% - 180px)
}
        /*merch*/
ytd-merch-shelf-renderer {
    display:none
}
    /*comments*/
        /*post and header*/
ytd-comments#comments {
    padding-right:15px
}
yt-dropdown-menu[icon-label] #label-icon.yt-dropdown-menu {
    display:none
}
#title.ytd-comments-header-renderer {
    margin-bottom:20px;
    color: #555;
}
.count-text.ytd-comments-header-renderer {
    text-transform: uppercase;
    font-size: 13px;
    display:flex;
    flex-direction:row-reverse;
    line-height:1
}
.count-text.ytd-comments-header-renderer .yt-formatted-string {
    color:#555
}
.count-text.ytd-comments-header-renderer .yt-formatted-string:last-child {
    font-weight:500
}
.count-text.ytd-comments-header-renderer .yt-formatted-string:first-child:before {
    content:" • ";
    margin-left:6px;
    cursor:text
}
ytd-comments-header-renderer {
    padding: 0 0 20px;
    margin-bottom: 68px;
    border-bottom: 1px solid #e2e2e2;
    margin-top:15px;
}
#author-thumbnail.ytd-comment-simplebox-renderer, #author-thumbnail.ytd-comment-simplebox-renderer img, #author-thumbnail.ytd-commentbox, #author-thumbnail.ytd-commentbox img, ytd-comment-renderer:not([engagement-panel]) #author-thumbnail.ytd-comment-renderer yt-img-shadow.ytd-comment-renderer {
    width:48px;
    height:48px;
    margin-right:10px
}
#title.ytd-comments-header-renderer #sort-menu {
    position:absolute;
    bottom:-48px
}
.ytd-comments > .ytd-item-section-renderer {
    position:relative
}
.add-on-content.tp-yt-paper-input-container, .underline.tp-yt-paper-input-container, #emoji-button {
    display:none
}
ytd-comment-simplebox-renderer {
    margin-right:0
}
#placeholder-area.ytd-comment-simplebox-renderer, .input-wrapper.tp-yt-paper-input-container {
    border: 1px solid #d5d5d5;
    color: #b8b8b8;
    cursor: pointer;
    margin-left: 11px;
    min-height: 28px;
    border-radius: 2px;
    padding: 10px;
    position:relative;
    align-items:initial;
}
.input-wrapper.tp-yt-paper-input-container {
    cursor:text;
    padding:0
}
.input-wrapper.tp-yt-paper-input-container:focus-within {
    border-color:#1c62b9;
    box-shadow:inset 0 0 1px rgba(0,0,0,.05)
}
.input-wrapper.tp-yt-paper-input-container #labelAndInputContainer #contenteditable-root{
    padding:10px;
    min-height:28px
}
ytd-commentbox:not([is-backstage-post]) yt-formatted-string#contenteditable-textarea.ytd-commentbox {
    margin-bottom:0
}
#placeholder-area.ytd-comment-simplebox-renderer:before, .input-wrapper.tp-yt-paper-input-container:before {
    content:"";
    border:6px solid #d5d5d5;
    position:absolute;
    left:-12px;
    top:-1px;
    border-bottom-color: transparent;
    border-left-color: transparent;
}
.input-wrapper.tp-yt-paper-input-container:focus-within:before {
    border-color:#1c62b9;
    border-bottom-color: transparent;
    border-left-color: transparent;
}
#placeholder-area.ytd-comment-simplebox-renderer:after, .input-wrapper.tp-yt-paper-input-container:after {
    content:"";
    border:7px solid #fff;
    position:absolute;
    left:-10px;
    top:0px;
    border-bottom-color: transparent;
    border-left-color: transparent;
}
#placeholder-area.ytd-comment-simplebox-renderer yt-formatted-string {
    font:400 13px 'roboto';
    color:#b8b8b8
}
ytd-commentbox:not([is-backstage-post]) yt-formatted-string#contenteditable-textarea.ytd-commentbox {
    font:400 13px 'roboto';
    color:#000
}
    /*comments in question*/
        /*pin*/
#pinned-comment-badge.ytd-comment-renderer {
    margin-bottom: 4px;
    line-height:16.9px;
    height:16.9px;
    margin-top:1px
}
#label.ytd-pinned-comment-badge-renderer {
    color: #767676;
    font-size: 11px;
    line-height:16px
}
yt-icon.ytd-pinned-comment-badge-renderer {
    margin-right:2px;
    margin-bottom:0
}
        /*author badge*/
html:not([dark]) ytd-app ytd-author-comment-badge-renderer[creator] {
    background-color: #008bec!important;
    border-radius: 9px;
    padding: 1px 6px;
    vertical-align: middle;
    margin:0;
    height:17px
}
ytd-comments #text.ytd-channel-name {
    font-size:12px!Important;
    line-height:14px;
    padding-top:1px;
    padding-left:1px
}
ytd-comments [creator] #text.ytd-channel-name {
    color:#fff!important
}
ytd-comments #text.ytd-channel-name:hover {
    text-decoration:underline
}
ytd-author-comment-badge-renderer[creator] #icon.ytd-author-comment-badge-renderer {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflfcmdXe.png) -172px -92px;
    fill:none;
    height:10px;
    margin-left:8px
}
        /*time*/
.published-time-text a.yt-simple-endpoint.yt-formatted-string {
    font:400 11px 'roboto', 'arial';
    line-height:13px;
    color:#767676!important
}
.published-time-text.ytd-comment-renderer {
    line-height:13px;
    height:13px;
    margin-left:6px
}
#author-comment-badge ~ .published-time-text {
    height:16px;
    line-height:16px
}
        /*normal name*/
html:not([dark]) #author-text.yt-simple-endpoint.ytd-comment-renderer:hover {
    text-decoration:underline
}
#author-text.yt-simple-endpoint.ytd-comment-renderer {
    margin-bottom:1px
}
#header.ytd-comment-renderer {
    margin:0
}
        /*text content*/
#content-text.ytd-comment-renderer {
    font:400 13px 'roboto','arial';
    line-height:16.9px
}
#content-text.ytd-comment-renderer a:hover {
    text-decoration:underline
}
        /*action buttons*/
#reply-button-end {
    order:-2
}
#reply-button-end ytd-button-renderer #button yt-formatted-string.ytd-button-renderer {
    font-weight:400;
    color:#555;
    font-size:13px;
    padding-top:1px;
    opacity:.75;
    margin-top:0;
    margin-left:0
}
#reply-button-end ytd-button-renderer yt-formatted-string.ytd-button-renderer:after {
    content: "\\002022";
    margin: 0 5px;
}
#main.ytd-comment-renderer:hover #reply-button-end .ytd-button-renderer {
    opacity:1
}
#vote-count-middle.ytd-comment-action-buttons-renderer {
    order:-1;
}
.ytd-comment-action-buttons-renderer yt-icon-button.ytd-toggle-button-renderer {
    padding:0
}
.ytd-comment-action-buttons-renderer yt-icon-button.ytd-toggle-button-renderer, ytd-app #like-button #button[aria-pressed="true"] yt-icon, ytd-app #dislike-button #button[aria-pressed="true"] yt-icon {
    height:auto;
    width:auto;
    content:none!important
}
ytd-comment-action-buttons-renderer #like-button yt-icon, ytd-comment-action-buttons-renderer #dislike-button yt-icon {
    content:none!important;
    fill:none;
    margin-top:3px
}
ytd-comment-action-buttons-renderer #like-button yt-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflfcmdXe.png) -206px 0;
    background-size: auto;
}
ytd-comment-action-buttons-renderer #dislike-button yt-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflfcmdXe.png) -12px 0;
    background-size: auto;
}
#vote-count-left.ytd-comment-action-buttons-renderer[hidden] + #like-button.ytd-comment-action-buttons-renderer {
    margin-left:0;
    margin-right:3px
}
#like-button.ytd-comment-action-buttons-renderer, #dislike-button.ytd-comment-action-buttons-renderer {
    padding-left:2px;
    padding-right:1px
}
ytd-comment-action-buttons-renderer #like-button #button[aria-pressed="true"] yt-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflfcmdXe.png) -12px -74px;
}
ytd-comment-thread-renderer {
    margin-bottom:26px
}
        /*view more replies*/
#more-replies yt-formatted-string,
#less-replies yt-formatted-string {
    text-transform: lowercase;
}
#more-replies #button.ytd-button-renderer yt-formatted-string.ytd-button-renderer, #less-replies #button.ytd-button-renderer yt-formatted-string.ytd-button-renderer, ytd-continuation-item-renderer #button.ytd-button-renderer yt-formatted-string.ytd-button-renderer {
    margin-top:0;
    font-size:12px
}
#more-replies yt-formatted-string::before {
    content: "View ";
    text-transform: none;
}
 
#less-replies yt-formatted-string::before {
    content: "Hide ";
    text-transform: none;
}
.ytd-comment-replies-renderer #more-replies-icon, .ytd-comment-replies-renderer #less-replies-icon, ytd-comment-replies-renderer:not([modern]) #expander.ytd-comment-replies-renderer .dot.ytd-comment-replies-renderer {
    display:none
}
ytd-comment-replies-renderer #creator-thumbnail.ytd-comment-replies-renderer yt-img-shadow.ytd-comment-replies-renderer {
    width:16px;
    height:16px;
    border-radius:0;
    margin-right:4px
}
ytd-comment-replies-renderer #creator-thumbnail.ytd-comment-replies-renderer {
    height:16px;
}
#expander.ytd-comment-replies-renderer .expander-header.ytd-comment-replies-renderer[teaser] { /*THEY BROKE THESE*/
    margin-left:1px
}
#button.ytd-button-renderer  yt-formatted-string.ytd-button-renderer {
    font-size:12px;
    margin-left:2px;
    margin-top:5px
}
#button.ytd-button-renderer yt-icon.ytd-button-renderer + yt-formatted-string.ytd-button-renderer {
    margin-top:0;
    margin-left:2px
}
ytd-comment-replies-renderer [aria-expanded] tp-yt-paper-button.ytd-button-renderer:hover, #button.ytd-button-renderer yt-icon.ytd-button-renderer + yt-formatted-string.ytd-button-renderer:hover {
    text-decoration:underline;
}
ytd-comment-replies-renderer [aria-expanded] tp-yt-paper-button.ytd-button-renderer:after {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflfcmdXe.png) -152px -20px;
    background-size: auto;
    width: 16px;
    height: 16px;
    content: "";
    display: inline-block;
    opacity: .7;
    vertical-align: text-bottom;
    margin-left:3px
}
ytd-comment-replies-renderer #less-replies tp-yt-paper-button.ytd-button-renderer:after {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflfcmdXe.png) -152px -73px;
    opacity:1
}
ytd-comment-replies-renderer tp-yt-paper-button.ytd-button-renderer:hover:after {
    opacity:1
}
ytd-button-renderer[is-paper-button] yt-icon.ytd-button-renderer {
    display:none
}
        /*replies*/
ytd-comment-renderer:not([comment-style="backstage-comment"])[is-reply] #author-thumbnail.ytd-comment-renderer yt-img-shadow.ytd-comment-renderer, ytd-comment-renderer[is-creator-reply] #author-thumbnail.ytd-comment-renderer yt-img-shadow.ytd-comment-renderer {
    width:32px;
    height:32px
}
#contents.ytd-comment-replies-renderer #header.ytd-comment-renderer {
    margin-bottom:1px;
    margin-top:-1px
}
.ytd-comment-replies-renderer ytd-comment-renderer {
    border-radius:0;
    margin-bottom:12px
}
#expander-contents.ytd-comment-replies-renderer {
    margin-top:10px
}
        /*read more*/
.more-button.ytd-comment-renderer, .less-button.ytd-comment-renderer {
    color:#128ee9;
    font-size:12px
}
        /*load more*/
fart {
    background: url(//s.ytimg.com/yts/img/icn_loading_animated-vflff1Mjj.gif) no-repeat center;
}
        /*heart*/
#creator-heart-button.ytd-creator-heart-renderer {
    height:20px;
    width:20px
}
#hearted-thumbnail.ytd-creator-heart-renderer {
    margin:0;
    border-radius:0
}
#hearted-thumbnail.ytd-creator-heart-renderer ~ #hearted {
    right:-4px;
    bottom:-1px
}
#hearted-thumbnail.ytd-creator-heart-renderer ~ #hearted-border {
    display:none
}
        /*continuation*/
#show-more-comments > input{
    margin: 15px 25px!important;
    border: 1px solid #d3d3d3!important;
    padding: 10px 0!important;
    background-color: #f8f8f8!important;
    color: #333!important;
    font-size: 12px!important;
    width: 95%!important;
    text-transform:none!important
}
#show-more-comments > input:hover {
    background-image: linear-gradient(to top,#f0f0f0 0,#f8f8f8 100%)!important;
    border-color: #c6c6c6!important;
}
    /*clip menu*/
#title.yt-clip-creation-renderer {
    display:none
}
#text-inputs.yt-clip-creation-scrubber-renderer {
    min-width:0;
    width:230px;
    align-items:initial;
    margin:0
}
yt-clip-creation-scrubber-renderer {
    align-items:initial
}
tp-yt-paper-textarea.ytd-clip-creation-text-input-renderer #labelAndInputContainer.tp-yt-paper-input-container > label {
    font-size:13px;
    padding:5px 10px
}
textarea.tp-yt-iron-autogrow-textarea {
    padding:5px 10px;
    min-height:30px
}
textarea.tp-yt-iron-autogrow-textarea:-moz-ui-invalid {
    box-shadow:none
}
.fit.tp-yt-iron-autogrow-textarea {
    position:relative;
 
}
.mirror-text.tp-yt-iron-autogrow-textarea {
    display:none
}
tp-yt-paper-textarea.ytd-clip-creation-text-input-renderer .input-content.tp-yt-paper-input-container > .paper-input-input {
    margin:0
}
    /*add to*/
ytd-add-to-playlist-renderer {
    border: 1px solid #c5c5c5;
    box-shadow: 0 0 15px rgba(0,0,0,.18);
    display:block
}
#create-playlist-form #placeholder-area.ytd-comment-simplebox-renderer, #create-playlist-form .input-wrapper.tp-yt-paper-input-container {
    min-height:0;
    margin:0;
    padding:5px 10px 6px 10px;
    color:#333;
    font-size:13px;
    line-height:1
}
#create-playlist-form iron-input.tp-yt-paper-input  {
    line-height:1
}
#create-playlist-form iron-input.tp-yt-paper-input > input.tp-yt-paper-input {
    height:15px
}
#create-playlist-form #placeholder-area.ytd-comment-simplebox-renderer, #create-playlist-form .input-wrapper.tp-yt-paper-input-container:before, #create-playlist-form #placeholder-area.ytd-comment-simplebox-renderer, #create-playlist-form .input-wrapper.tp-yt-paper-input-container:after {
    content:none
}
#create-playlist-form #labelAndInputContainer#labelAndInputContainer.label-is-floating.tp-yt-paper-input-container > label {
    color:#333;
    text-transform:uppercase;
    font-size:11px;
    transform:none;
    bottom:auto;
    top:-22px;
    font-weight:500
}
#title.ytd-add-to-playlist-renderer {
    font-size:11px;
    text-transform:uppercase;
    color:#333;
    font-weight:500
}
tp-yt-iron-icon.tp-yt-paper-dropdown-menu-light {
    display:none
}
#create-playlist-form .label.label-is-floating.tp-yt-paper-dropdown-menu-light {
    display:none
}
ytd-dropdown-renderer tp-yt-paper-dropdown-menu-light .tp-yt-paper-dropdown-menu-light[style-target="input"] {
    width:auto;
    font:500 11px 'roboto';
    border:1px solid transparent;
    height:28px;
    padding:0 10px;
    line-height:28px;
    color:#333
}
ytd-dropdown-renderer tp-yt-paper-dropdown-menu-light .tp-yt-paper-dropdown-menu-light[style-target="input"]:hover {
    border-color: #c6c6c6;
    background: #f0f0f0;
    box-shadow: 0 1px 0 rgb(0 0 0 / 10%);
}
ytd-dropdown-renderer tp-yt-paper-dropdown-menu-light .tp-yt-paper-dropdown-menu-light[style-target="input"]:active, ytd-dropdown-renderer tp-yt-paper-dropdown-menu-light [focused] .tp-yt-paper-dropdown-menu-light[style-target="input"] {
    border-color: #c6c6c6;
    background: #e9e9e9;
    box-shadow: inset 0 1px 0 #ddd;
}
ytd-dropdown-renderer tp-yt-paper-dropdown-menu-light .tp-yt-paper-dropdown-menu-light[style-target="input"]:after {
    content:"";
    margin-top: -3px;
    margin-left: 5px;
    border: 1px solid transparent;
    border-top-color: #333;
    border-width: 4px 4px 0;
    width: 0;
    height: 0;
    display:inline-block;
    vertical-align: middle;
}
.label.tp-yt-paper-dropdown-menu-light::after {
    content:none
}
#create-playlist-form .tp-yt-paper-dropdown-menu-light[slot="dropdown-trigger"] {
    width:auto;
    padding:0
}
yt-text-input-form-field-renderer.ytd-add-to-playlist-create-renderer {
    padding:0 20px
}
ytd-dropdown-renderer.ytd-add-to-playlist-create-renderer {
    padding:0 20px;
    width:max-content;
    position:absolute;
    bottom:15px;
    margin:0
}
#title.ytd-add-to-playlist-renderer {
    padding:0 20px;
    padding-top:6px
}
#header.ytd-add-to-playlist-renderer {
    border:0
}
ytd-add-to-playlist-renderer[dialog] #close-button.ytd-add-to-playlist-renderer {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) 0 -511px;
    width: 11px;
    height: 11px;
    fill:none;
    opacity:.5;
    margin-top:3px;
}
ytd-add-to-playlist-renderer[dialog] #close-button.ytd-add-to-playlist-renderer button {
    vertical-align:initial
}
ytd-add-to-playlist-renderer[dialog] #close-button.ytd-add-to-playlist-renderer yt-icon {
    fill:none
}
#playlists.ytd-add-to-playlist-renderer, ytd-compact-link-renderer:not([has-secondary]) tp-yt-paper-item.ytd-compact-link-renderer {
    padding:0 20px;
    border:0
}
tp-yt-paper-menu-button.tp-yt-paper-dropdown-menu-light {
    position:relative
}
#privacy-input tp-yt-iron-dropdown {
    top:36px!important;
    position:absolute!important;
    left:auto!important;
    right:auto!important;
    bottom:auto!important
}
ytd-add-to-playlist-renderer[dialog] {
    overflow:visible
}
 
#checkbox-label.ytd-playlist-add-to-option-renderer {
    height:15px
}
yt-icon.ytd-playlist-add-to-option-renderer {
    padding:0;
    margin:0
}
ytd-add-to-playlist-renderer[increased-tap-target] #playlists.ytd-add-to-playlist-renderer > .ytd-add-to-playlist-renderer:not(:last-child) {
    margin-bottom:10px
}
#label.ytd-compact-link-renderer {
    font-size:13px
}
#content-icon.ytd-compact-link-renderer {
    margin-right:5px
}
        /*privacy dropdown?*/
#label.ytd-privacy-dropdown-item-renderer {
    font:400 13px 'roboto';
    color:#333
}
#description.ytd-privacy-dropdown-item-renderer {
    display:none
}
ytd-privacy-dropdown-item-renderer #dropdown-icon.ytd-privacy-dropdown-item-renderer {
    width: 16px;
    height: 16px;
    fill:none;
    opacity:.5;
    margin-left:0;
    margin-right:3px
}
ytd-privacy-dropdown-item-renderer:nth-child(1) #dropdown-icon.ytd-privacy-dropdown-item-renderer {
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfliTgLqv.webp) 0 -918px;
}
ytd-privacy-dropdown-item-renderer:nth-child(2) #dropdown-icon.ytd-privacy-dropdown-item-renderer {
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfliTgLqv.webp) -76px -474px;
}
ytd-privacy-dropdown-item-renderer:nth-child(3) #dropdown-icon.ytd-privacy-dropdown-item-renderer {
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfliTgLqv.webp) -211px -122px;
}
ytd-privacy-dropdown-item-renderer tp-yt-paper-item {
    min-height:25px!important;
    padding:0 15px;
    min-width:60px
}
ytd-privacy-dropdown-item-renderer:hover {
    background:#eee
}
ytd-privacy-dropdown-item-renderer:hover #dropdown-icon.ytd-privacy-dropdown-item-renderer {
    opacity:.6
}
ytd-privacy-dropdown-item-renderer[aria-selected="true"] #dropdown-icon.ytd-privacy-dropdown-item-renderer {
    opacity:1
}
    /*share*/
yt-third-party-network-section-renderer iron-input.tp-yt-paper-input > input.tp-yt-paper-input {
    line-height:28px;
    margin-left:6px
}
ytd-unified-share-panel-renderer {
    border: 1px solid #c5c5c5;
    box-shadow: 0 0 15px rgba(0,0,0,.18);
    margin:0!important;
    padding:18px 20px;
}
#close-button.ytd-unified-share-panel-renderer {
    top:3px;
    right:3px;
    width:30px;
    height:28px;
    padding:0 10px;
}
#close-button.ytd-unified-share-panel-renderer yt-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) 0 -511px;
    height:10px;
    fill:none;
    opacity:.5
}
ytd-unified-share-panel-renderer yt-share-panel-header-renderer.ytd-unified-share-panel-renderer {
    display:none
}
#contents.yt-third-party-share-target-section-renderer yt-share-target-renderer.yt-third-party-share-target-section-renderer {
    margin-right:3px
}
yt-share-target-renderer yt-icon.yt-share-target-renderer, #target.yt-share-target-renderer {
    width:32px;
    height:32px;
    border-radius:0;
    margin:0;
    padding:0
}
#title.yt-share-target-renderer {
    min-width:0;
    width:auto
}
#share-url.yt-copy-link-renderer {
    width: 370px;
    margin-right: 15px;
    color: #666;
    font-size: 23px;
    padding: 2px;
    margin-left:0
}
#bar.yt-copy-link-renderer {
    background:none;
    border-radius:0;
    border: 1px solid #d3d3d3;
}
#copy-button #button.yt-button-renderer {
    padding:0 10px
}
    /*secondary*/
#secondary-inner.ytd-watch-flexy #related {
    width:401px
}
#video-title.ytd-compact-video-renderer {
    line-height:16.8px;
}
ytd-watch-next-secondary-results-renderer #contents .ytd-item-section-renderer h3 {
    color:#333
}
ytd-watch-next-secondary-results-renderer #contents .ytd-item-section-renderer:hover h3 {
    color:#167ac6
}
#channel-name.ytd-video-meta-block {
    color:#767676
}
.metadata.ytd-compact-video-renderer {
    padding-right:20px
}
        /*live chat*/
#avatar.yt-live-chat-message-input-renderer, yt-live-chat-author-chip, #picker-buttons.yt-live-chat-message-input-renderer {
    display:none
}
yt-live-chat-message-input-renderer {
    padding:10px 15px
}
#message-buttons.yt-live-chat-message-input-renderer {
    top:0;
    position:absolute;
    right:0;
    opacity:.3
}
#message-buttons.yt-live-chat-message-input-renderer:hover {
    opacity:.8
}
        /*playlist*/
            /*head*/
#secondary-inner #playlist.ytd-watch-flexy {
    margin-top:1px
}
#container.ytd-playlist-panel-renderer {
    border:0
}
ytd-playlist-panel-renderer[collapsible]:not([modern-panels]) .title.ytd-playlist-panel-renderer {
    font-size:15px;
    font-weight:400
}
ytd-playlist-panel-renderer[collapsible] .header.ytd-playlist-panel-renderer {
    padding:14px 10px 0 10px
}
ytd-playlist-panel-renderer[collapsible] #publisher-container.ytd-playlist-panel-renderer {
    margin-top:3px
}
ytd-playlist-panel-renderer[collapsible] .index-message-wrapper.ytd-playlist-panel-renderer, ytd-playlist-panel-renderer[collapsible] .publisher.ytd-playlist-panel-renderer {
    font-size:11px;
    color:#b8b8b8;
    line-height:normal
}
.publisher.ytd-playlist-panel-renderer:not(:empty) + .index-message-wrapper.ytd-playlist-panel-renderer::before {
    content: '\\002022';
    color:#b8b8b8;
    padding:0 2px
}
ytd-playlist-panel-renderer[collapsible] .publisher.ytd-playlist-panel-renderer:before {
    content:"by "
}
#playlist.ytd-watch-flexy .index-message-wrapper.ytd-playlist-panel-renderer {
    color:#b8b8b8!important;
}
#playlist.ytd-watch-flexy .index-message-wrapper.ytd-playlist-panel-renderer span:nth-child(2) {
    margin:0 -2px
}
#playlist.ytd-watch-flexy .index-message-wrapper.ytd-playlist-panel-renderer:after {
    content:" videos"
}
#header-top-row.ytd-playlist-panel-renderer {
    padding:0 5px;
    padding-bottom:6px
}
#playlist-actions.ytd-playlist-panel-renderer {
    border-top: 1px solid #3a3a3a;
    height: 24px;
    padding: 9px 6px 6px;
}
#playlist-actions.ytd-playlist-panel-renderer yt-icon-button.ytd-button-renderer {
    height:24px;
    width:24px
}
ytd-playlist-panel-renderer[has-playlist-buttons] #playlist-action-menu.ytd-playlist-panel-renderer {
    margin:0
}
#playlist-actions #top-level-buttons-computed yt-icon-button.ytd-toggle-button-renderer {
    height:24px;
    padding-left:15px
}
ytd-playlist-loop-button-renderer yt-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -143px -66px;
    fill:none;
    opacity:.5
}
#playlist-action-menu ytd-toggle-button-renderer[is-icon-button] yt-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -101px -918px;
    opacity:.5;
    fill:none;
    min-height:24px
}
#overflow-menu .ytd-playlist-panel-renderer .ytd-menu-renderer[style-target="button"] yt-icon {
    opacity:.5;
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -205px -314px;
    width:24px;
    height:24px
}
ytd-playlist-loop-button-renderer yt-icon:hover, #playlist-action-menu ytd-toggle-button-renderer.style-grey-text[is-icon-button] yt-icon:hover, #overflow-menu .ytd-playlist-panel-renderer .ytd-menu-renderer[style-target="button"] yt-icon:hover {
    opacity:.6
}
ytd-playlist-loop-button-renderer yt-icon:active, #playlist-action-menu ytd-toggle-button-renderer.style-grey-text[is-icon-button] yt-icon:active, #overflow-menu .ytd-playlist-panel-renderer .ytd-menu-renderer[style-target="button"] yt-icon:active, ytd-playlist-loop-button-renderer [aria-label="Turn off loop"] yt-icon, ytd-playlist-loop-button-renderer [aria-label="Loop video"] yt-icon, #playlist-action-menu ytd-toggle-button-renderer[is-icon-button] .style-default-active yt-icon {
    opacity:1
}
#overflow-menu.ytd-playlist-panel-renderer ytd-menu-renderer.ytd-playlist-panel-renderer {
    margin:0;
}
ytd-playlist-panel-renderer[chevron-tap-target-size] #expand-button.ytd-playlist-panel-renderer {
    width:24px;
}
#playlist-action-menu #top-level-buttons-computed > ytd-toggle-button-renderer:first-of-type > a > yt-icon-button > #button > yt-icon:hover{
    filter:none
}
            /*body*/
#thumbnail-container.ytd-playlist-panel-video-renderer > ytd-thumbnail.ytd-playlist-panel-video-renderer {
    height:40.28px
}
#thumbnail-container.ytd-playlist-panel-video-renderer {
    width:72px;
    height:40.28px
}
#video-title.ytd-playlist-panel-video-renderer {
    max-height: 2.6em;
    color: #cacaca;
    font-size: 13px;
    font-weight: normal;
    line-height:16.9px;
    margin-bottom:2px;
    margin-top:-2px
}
#byline.ytd-playlist-panel-video-renderer {
    font-size:11px;
    line-height:13px
}
#index-container.ytd-playlist-panel-video-renderer, #index.ytd-playlist-panel-video-renderer, #reorder.ytd-playlist-panel-video-renderer {
    font-size: 10px;
    line-height: 41px;
    margin: 0 4px 0 0px;
    text-align: center;
    width: 24px;
    color:#b8b8b8
}
[selected] #index.ytd-playlist-panel-video-renderer {
    color:#c03636;
    line-height:40px
}
ytd-playlist-panel-video-renderer, ytd-playlist-panel-video-renderer.ytd-playlist-panel-renderer:first-of-type {
    padding:0
}
a.yt-simple-endpoint.ytd-playlist-panel-video-renderer {
    padding:10px 0
}
#meta.ytd-playlist-panel-video-renderer {
    padding-right:0;
    max-height:41px;
    padding-left:8px
}
ytd-playlist-panel-video-renderer[selected].ytd-playlist-panel-renderer:hover:not(.dragging) {
    background-color: #3a3a3a !important;
}
/*search*/
ytd-search #contents ytd-channel-renderer #avatar-section.ytd-channel-renderer {
    margin-right:10px!important
}
    /*sort*/
ytd-search {
    padding:10px
}
ytd-search #primary.ytd-two-column-search-results-renderer {
    max-width:1056px
}
ytd-search #sub-menu.ytd-section-list-renderer, ytd-ticket-shelf-renderer {
    background:#fff;
    box-shadow: 0 1px 2px rgba(0,0,0,.1);
    padding:5px 15px;
    border-bottom:1px solid #f1f1f1;
    padding-top:8px;
    padding-bottom:7px
}
#filter-menu.ytd-search-sub-menu-renderer {
    border:0
}
.ytd-search-sub-menu-renderer a > .ytd-toggle-button-renderer {
    padding:0;
}
.ytd-search-sub-menu-renderer yt-icon {
    display:none
}
ytd-toggle-button-renderer[is-paper-button][align-by-text]:not(:empty) {
    margin-left:0
}
.ytd-search-sub-menu-renderer #button.ytd-toggle-button-renderer {
    min-width:0;
    padding:0 10px;
    height:20px;
    border-radius: 2px;
    box-shadow: 0 1px 0 rgba(0,0,0,0.05);
    border:1px solid #d3d3d3;
    background: #f8f8f8;
    color: #333;
}
.ytd-search-sub-menu-renderer #button.ytd-toggle-button-renderer:hover {
    border-color: #c6c6c6;
    background: #f0f0f0;
    box-shadow: 0 1px 0 rgba(0,0,0,0.10);
}
.ytd-search-sub-menu-renderer #button.ytd-toggle-button-renderer:active {
    border-color: #c6c6c6;
    background: #e9e9e9;
    box-shadow: inset 0 1px 0 #ddd;
}
.ytd-search-sub-menu-renderer #button.ytd-toggle-button-renderer:after {
    content:"";
    margin-top: -2px;
    margin-left: 5px;
    border: 1px solid transparent;
    border-top-color: #333;
    border-width: 4px 4px 0;
    width: 0;
    vertical-align:middle;
    display:inline-block
}
#button.ytd-toggle-button-renderer yt-icon.ytd-toggle-button-renderer + yt-formatted-string.ytd-toggle-button-renderer {
    margin-left:0;
    text-transform:initial;
    font:400 11px 'roboto', 'arial';
    color:#555;
    height:14px
}
#contents.ytd-section-list-renderer {
    padding-left:15px!important;
    padding-right:15px
}
#items.ytd-vertical-list-renderer > .ytd-vertical-list-renderer {
    padding-top:15px
}
ytd-search #contents.ytd-shelf-renderer {
    margin-top:5px!important
}
    /*channel pfp*/
yt-img-shadow.ytd-channel-renderer, yt-img-shadow.ytd-channel-renderer img {
    width:110px;
    height:110px
}
#avatar.ytd-channel-renderer {
    width:auto
}
#avatar-section.ytd-channel-renderer {
    min-width:0;
    width:var(--globalthumb);
    flex:initial;
    margin-right:10px
}
#channel-title.ytd-channel-renderer {
    font:500 14px 'roboto';
    color:#167ac6;
    line-height:18.2px;
    margin-bottom:2px
}
#channel-title.ytd-channel-renderer yt-formatted-string#text.ytd-channel-name {
    font-size:14px!important
}
#info.ytd-channel-renderer {
    padding:0;
    display:block
}
#purchase-button.ytd-channel-renderer, #subscribe-button.ytd-channel-renderer {
    padding-bottom:0;
    padding-top:2px
}
#metadata.ytd-channel-renderer, #description.ytd-channel-renderer{
    margin-bottom:2px;
    color:#767676;
    font:400 12px 'roboto','arial';
    line-height:15.6px
}
.channel-link.ytd-channel-renderer {
    flex:initial;
    display:block
}
#info-section.ytd-channel-renderer {
    flex-direction:column
}
    /*stupid stuff*/
ytd-exploratory-results-renderer.ytd-item-section-renderer, ytd-horizontal-card-list-renderer.ytd-item-section-renderer:not(:first-child), ytd-reel-shelf-renderer.ytd-item-section-renderer, ytd-shelf-renderer.ytd-item-section-renderer {
    margin-top:8px;
    border:0
}
ytd-search .grid-subheader.ytd-shelf-renderer {
    display:none
}
yt-search-query-correction {
    margin-top:12px
}
ytd-button-renderer.ytd-item-section-renderer, ytd-compact-radio-renderer.ytd-item-section-renderer, ytd-compact-video-renderer.ytd-item-section-renderer, ytd-compact-movie-renderer.ytd-item-section-renderer, ytd-compact-playlist-renderer.ytd-item-section-renderer, ytd-emergency-onebox-renderer.ytd-item-section-renderer, ytd-feed-nudge-renderer.ytd-item-section-renderer, ytd-movie-renderer.ytd-item-section-renderer, ytd-playlist-renderer.ytd-item-section-renderer, ytd-show-renderer.ytd-item-section-renderer, ytd-radio-renderer.ytd-item-section-renderer, yt-search-no-results-renderer.ytd-item-section-renderer, ytd-video-renderer.ytd-item-section-renderer, ytd-channel-renderer.ytd-item-section-renderer, ytd-promoted-sparkles-text-search-renderer.ytd-item-section-renderer, ytd-web-answer-renderer.ytd-item-section-renderer, ytd-clarification-renderer.ytd-item-section-renderer, ytd-fact-check-renderer.ytd-item-section-renderer, ytd-info-panel-container-renderer.ytd-item-section-renderer, ytd-continuation-item-renderer.ytd-item-section-renderer {
    margin-top:10px
}
    /*video*/
ytd-exploratory-results-renderer.ytd-item-section-renderer, ytd-horizontal-card-list-renderer.ytd-item-section-renderer:not(:first-child), ytd-reel-shelf-renderer.ytd-item-section-renderer, ytd-shelf-renderer.ytd-item-section-renderer {
    margin:0
}
.ytd-item-section-renderer[is-search] > :not(div).style-scope, ytd-video-renderer[is-search] ytd-thumbnail.ytd-video-renderer, ytd-app ytd-thumbnail.ytd-radio-renderer {
    min-width:100px;
    width:var(--globalthumb);
    max-width:var(--globalthumb)!important;
    margin-right:10px
}
ytd-search [lockup="true"] #video-title[title] {
    font-size:14px;
    line-height:18.2px;
    font-weight:500;
}
ytd-search #title-wrapper.ytd-video-renderer {
    margin-bottom:2px;
    max-height:18.2px
}
ytd-search [lockup="true"] #video-title[title]:hover, #title-wrapper.ytd-video-renderer yt-formatted-string:hover {
    text-decoration:underline
}
#channel-thumbnail.ytd-video-renderer {
    display:none
}
ytd-video-renderer[is-search] #channel-info.ytd-video-renderer {
    padding:0
}
.metadata-snippet-text.ytd-video-renderer {
    color:#767676
}
ytd-search #channel-name #text.ytd-channel-name a,ytd-search #channel-name #text.ytd-channel-name, #channel-name.ytd-video-renderer, #video-title.ytd-child-video-renderer, #length.ytd-child-video-renderer {
    color:#767676;
    line-height:15.6px!important;
    font-size:12px!important;
    font-weight:400!important
}
ytd-search #channel-name #text.ytd-channel-name a:before {
    content:"by ";
    display:inline-block;
    color:#767676;
    margin-right:3px
}
ytd-search #metadata-line.ytd-video-meta-block span.ytd-video-meta-block {
    font-size:12px!important
}
#list.ytd-playlist-renderer li.ytd-playlist-renderer {
    height:auto;
    padding:1px 0;
    border-bottom:1px solid #e2e2e2
}
#video-title.ytd-child-video-renderer {
    display:block;
    float:left
}
#length.ytd-child-video-renderer {
    float:right
}
#title.ytd-child-video-renderer {
    display:block;
    width:100%
}
[lockup="true"]:hover #channel-name #text.ytd-channel-name a, [lockup="true"]:hover #video-title.ytd-child-video-renderer {
    color:#167ac6 
}
[lockup="true"]:hover a.yt-simple-endpoint, .title-and-badge.ytd-video-renderer {
    width:100%;
    margin:0
}
#list.ytd-playlist-renderer {
    margin:4px 0
}
#length.ytd-child-video-renderer::before {
    content:none
}
yt-formatted-string[ellipsis-truncate] a.yt-formatted-string {
    margin-right:0
}
#view-more.ytd-playlist-renderer {
    text-transform:none;
    font-weight:400
}
yt-icon.ytd-thumbnail-overlay-hover-text-renderer {
    display:none
}
        /*playlist thingy*/
ytd-thumbnail-overlay-side-panel-renderer {
    width: 43.75%!important;
    background: rgba(0,0,0,.8);
}
yt-formatted-string.ytd-thumbnail-overlay-side-panel-renderer {
    color:#cfcfcf;
    font-size:18px
}
yt-icon.ytd-thumbnail-overlay-side-panel-renderer {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -225px -563px;
    width:32px;
    height:32px;
    fill:none
}
        /*moments?*/
#expandable-metadata.ytd-video-renderer:not(:empty), ytd-reel-shelf-renderer {
    margin:0;
    display:none
}
#more.ytd-vertical-list-renderer, #all.ytd-vertical-list-renderer {
    padding:0
}
ytd-vertical-list-renderer {
    padding-bottom:10px
}
/*channels page*/
    /*pageframe*/
#contentContainer.tp-yt-app-header-layout {
    display:none
}
[page-subtype="channels"] #contents.ytd-section-list-renderer {
    margin-right:0!important;
    padding:0!important
}
[page-subtype="channels"] #contents.ytd-section-list-renderer > ytd-item-section-renderer > #contents {
    padding:15px
}
[page-subtype="channels"] [style*="0px, -233px, 0px"] ~ #contentContainer.tp-yt-app-header-layout, [page-subtype="channels"] [style*="0px, -227px, 0px"] ~ #contentContainer.tp-yt-app-header-layout {
    display:block
}
[page-subtype="channels"] #header.ytd-browse, ytd-two-column-browse-results-renderer.grid:not(.grid-disabled) {
    width:1056px!important
}
@media (max-width:1176px) {
    [page-subtype="channels"] #header.ytd-browse, ytd-two-column-browse-results-renderer.grid:not(.grid-disabled) {
        width:850px!important
    }
}
@media (min-width:1565px) {
    [page-subtype="channels"] #header.ytd-browse, ytd-two-column-browse-results-renderer.grid:not(.grid-disabled) {
        width:1262px!important
    }
}
#wrapper.tp-yt-app-header-layout > [slot="header"] {
    position:static;
    margin:0;
    transform:none!important;
}
#backgroundFrontLayer.tp-yt-app-header {
    transform:none!important
}
#wrapper.tp-yt-app-header-layout > [slot="header"][style*="0px, -233px, 0px"], #wrapper.tp-yt-app-header-layout > [slot="header"][style*="0px, -227px, 0px"] {
    transform: translate3d(0px, -200px, 0px)!important;
    position:fixed;
    left:230px!important;
    width:100%;
    border-bottom:1px solid #e8e8e8;
}
[style*="0px, -233px, 0px"] #tabsContent, [style*="0px, -227px, 0px"] #tabsContent {
    text-align:center;
    position:relative
}
html [style*="0px, -233px, 0px"] tp-yt-paper-tab.ytd-c4-tabbed-header-renderer, html [style*="0px, -227px, 0px"] tp-yt-paper-tab.ytd-c4-tabbed-header-renderer {
    margin-right:30px
}
ytd-c4-tabbed-header-renderer.grid-5-columns tp-yt-paper-tabs.ytd-c4-tabbed-header-renderer, ytd-c4-tabbed-header-renderer.grid-4-columns tp-yt-paper-tabs.ytd-c4-tabbed-header-renderer, ytd-c4-tabbed-header-renderer.grid-6-columns tp-yt-paper-tabs.ytd-c4-tabbed-header-renderer {
    margin:0
}
#header.ytd-browse > ytd-c4-tabbed-header-renderer.ytd-browse {
    box-shadow:0 1px 2px rgba(0,0,0,.1)
}
    /*header banner*/
#avatar.ytd-c4-tabbed-header-renderer, #avatar.ytd-c4-tabbed-header-renderer img {
    width:100px;
    height:100px;
    margin:0
}
#avatar.ytd-c4-tabbed-header-renderer {
    position:absolute;
    top:-176px;
    left:15px
}
ytd-c4-tabbed-header-renderer[has-channel-art][guide-persistent-and-visible] .banner-visible-area.ytd-c4-tabbed-header-renderer, ytd-c4-tabbed-header-renderer[has-channel-art] .banner-visible-area.ytd-c4-tabbed-header-renderer {
    height:176px;
    width:100%;
}
#backgroundFrontLayer.tp-yt-app-header {
    background-size:cover!important;
    height:175px;
    background-position:center
}
#links-holder.ytd-c4-tabbed-header-renderer {
    top:-39px
}
@media (min-width:1565px) {
    ytd-c4-tabbed-header-renderer[has-channel-art][guide-persistent-and-visible] .banner-visible-area.ytd-c4-tabbed-header-renderer, ytd-c4-tabbed-header-renderer[has-channel-art] .banner-visible-area.ytd-c4-tabbed-header-renderer {
        height:210px
    }
        #backgroundFrontLayer.tp-yt-app-header {
        background-size:cover!important;
        height:208px;
        background-position:center
    }
    #avatar.ytd-c4-tabbed-header-renderer {
        top:-210px
    }
}
#primary-links.ytd-c4-tabbed-header-renderer, #secondary-links.ytd-c4-tabbed-header-renderer {
    background-color:rgba(102,102,102,0.5)
}
    /*header*/
[page-subtype="channels"] #channel-header-container, #tabs-container.ytd-c4-tabbed-header-renderer #tabs-inner-container{
    padding:0 15px
}
#channel-header.ytd-c4-tabbed-header-renderer {
    padding-top:23px
}
#channel-name.ytd-c4-tabbed-header-renderer #text.ytd-channel-name {
    font-size:20px!important;
    font-weight:500;
}
#channel-name.ytd-c4-tabbed-header-renderer #text.ytd-channel-name:hover {
    text-decoration:underline;
    cursor:pointer
}
#channel-name.ytd-c4-tabbed-header-renderer {
    all:initial;
    font:500 20px 'roboto'
}
.ytd-c4-tabbed-header-renderer .badge-style-type-verified.ytd-badge-supported-renderer {
    position:relative;
    top:-3px;
    padding-left:0px
}
#channel-name.ytd-c4-tabbed-header-renderer ytd-badge-supported-renderer.ytd-channel-name {
    position:relative;
}
#subscriber-count.ytd-c4-tabbed-header-renderer {
    width:40px;
    overflow:hidden;
    height:22px;
    border:1px solid #ccc;
    border-radius:0 2px 2px 0;
    color: #737373;
    font-size: 11px;
    text-align: center;
    line-height:22px;
    position:absolute;
    right:15px;
    margin-top:3px;
    box-shadow: 0 1px 0 rgba(0,0,0,0.05);
    top:20px
}
#buttons.ytd-c4-tabbed-header-renderer {
    margin-top:-1px;
    margin-right:41px
}
#selectionBar.paper-tabs, #selectionBar.tp-yt-paper-tabs {
    display:none
}
ytd-c4-tabbed-header-renderer:not([modern-tabs]) tp-yt-paper-tabs.ytd-c4-tabbed-header-renderer {
    text-transform:none;
    font-weight:400;
}
html tp-yt-paper-tab.ytd-c4-tabbed-header-renderer {
    border-bottom:3px solid transparent;
    vertical-align:top;
    box-sizing:border-box;
    padding:0 3px!important;
    margin-right:20px
}
tp-yt-paper-tab:not(.iron-selected) .tp-yt-paper-tab[style-target="tab-content"] {
    letter-spacing:0
}
tp-yt-paper-tab.ytd-c4-tabbed-header-renderer.iron-selected {
    border-color:#cc181e;
    color:#333;
    font-weight:500
}
tp-yt-paper-tab:focus:not([noBoldOnFocus]) .tp-yt-paper-tab[style-target="tab-content"] {
    font-weight:inherit
}
tp-yt-paper-tab.ytd-c4-tabbed-header-renderer:hover {
    border-color:#cc181e
}
tp-yt-paper-tabs.ytd-c4-tabbed-header-renderer, #tabs-container.ytd-c4-tabbed-header-renderer, tp-yt-app-toolbar.ytd-c4-tabbed-header-renderer {
    height:32px;
    padding:0
}
tp-yt-app-toolbar.ytd-c4-tabbed-header-renderer {
    padding-top:23px;
    background:#fff;
}
ytd-expandable-tab-renderer.ytd-c4-tabbed-header-renderer {
    padding:0;
    width:200px
}
yt-icon-button.ytd-expandable-tab-renderer {
    width:auto;
    height:25px
}
[show-input=""] yt-icon-button.ytd-expandable-tab-renderer {
    display:none
}
yt-icon-button.ytd-expandable-tab-renderer yt-icon {
    opacity: .33;
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -28px -66px;
    background-size: auto;
    width: 15px;
    height: 15px;
    fill:none;
    margin-left:0px;
    margin-top:-3px
}
ytd-expandable-tab-renderer.ytd-c4-tabbed-header-renderer yt-icon-button:hover yt-icon {
    opacity:1
}
.ytd-expandable-tab-renderer .input-wrapper.tp-yt-paper-input-container {
    padding:5px 10px;
    box-shadow:inset 0 0 1px rgba(0,0,0,.05);
}
tp-yt-paper-input.ytd-expandable-tab-renderer .input-content.tp-yt-paper-input-container > input, tp-yt-paper-input.ytd-expandable-tab-renderer .input-content.tp-yt-paper-input-container > iron-input, tp-yt-paper-input.ytd-expandable-tab-renderer .input-content.tp-yt-paper-input-container > textarea, tp-yt-paper-input.ytd-expandable-tab-renderer .input-content.tp-yt-paper-input-container > iron-autogrow-textarea, tp-yt-paper-input.ytd-expandable-tab-renderer .input-content.tp-yt-paper-input-container > .paper-input-input, tp-yt-paper-input.ytd-expandable-tab-renderer #labelAndInputContainer.tp-yt-paper-input-container > label, tp-yt-paper-input.ytd-expandable-tab-renderer #labelAndInputContainer.tp-yt-paper-input-container > .paper-input-label {
    padding:0;
    line-height:16px;
    font-size:13px;
    border-radius:0!important
}
.ytd-c4-tabbed-header-renderer .ytd-expandable-tab-renderer .input-wrapper.tp-yt-paper-input-container {
    min-height:0
}
.ytd-expandable-tab-renderer tp-yt-paper-input-container {
    padding:0
}
tp-yt-paper-input.ytd-expandable-tab-renderer {
    height:auto;
    margin:0;
    display:block!important;
    width:0;
    opacity:0;
    transition: width .3s ease;
}
[show-input=""]  tp-yt-paper-input.ytd-expandable-tab-renderer {
    opacity:1;
    width:198px;
    transition: width .3s ease;
}
ytd-expandable-tab-renderer {
    max-height:30px;
    margin-left:3px
}
    /*channel home*/
.ytd-channel-video-player-renderer yt-formatted-string[has-link-only_]:not([force-default-style]) a.yt-simple-endpoint.yt-formatted-string, #title.ytd-shelf-renderer:hover, ytd-channel-video-player-renderer #description a.yt-simple-endpoint.yt-formatted-string {
    color:#167ac6;
    text-transform:none
}
ytd-menu-renderer.ytd-grid-video-renderer {
    top:0
}
#title.ytd-channel-video-player-renderer {
    margin:0
}
ytd-channel-video-player-renderer {
    padding:0
}
.ytd-channel-video-player-renderer ytd-expander[should-use-number-of-lines][collapsed] > #content.ytd-expander {
    font:400 13px 'roboto';
    line-height:1.3;
    color:#555
}
ytd-channel-video-player-renderer ytd-video-meta-block:not([rich-meta]) #metadata-line.ytd-video-meta-block span {
    font-size:13px!important;
    color:#555
}
ytd-two-column-browse-results-renderer:not([page-subtype="subscriptions"]) ytd-grid-video-renderer {
    min-width:var(--globalthumb);
}
ytd-two-column-browse-results-renderer:not([page-subtype="subscriptions"]) ytd-thumbnail.ytd-grid-video-renderer {
    min-width:var(--globalthumb);
    height:var(--globalthumbh)
}
#right-arrow.yt-horizontal-list-renderer, #left-arrow.yt-horizontal-list-renderer {
    height:var(--globalthumbh)
}
#items.yt-horizontal-list-renderer > .yt-horizontal-list-renderer {
    padding-right:10px
}
.arrow.yt-horizontal-list-renderer, .arrow.yt-horizontal-list-renderer yt-icon-button {
    width:15px;
    border-radius:0;
    height:60px;
    box-shadow:none
}
yt-horizontal-list-renderer:hover .arrow.yt-horizontal-list-renderer yt-icon-button {
    box-shadow: 1px 1px 3px rgba(0,0,0,.1);
    border:1px solid #e3e3e3;
    width:40px;
    height:60px;
    background:#fff!important
}
yt-horizontal-list-renderer .arrow.yt-horizontal-list-renderer yt-icon-button:focus {
    box-shadow:none
}
#right-arrow.yt-horizontal-list-renderer {
    right:-7px
}
yt-horizontal-list-renderer:hover #right-arrow.yt-horizontal-list-renderer {
    right:-16px;
}
#left-arrow.yt-horizontal-list-renderer {
    left:-8px
}
yt-horizontal-list-renderer:hover #left-arrow.yt-horizontal-list-renderer {
    left:-16px
}
.arrow.yt-horizontal-list-renderer yt-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -112px -42px;
    width: 7px;
    height: 10px;
    opacity:.5
}
#left-arrow.yt-horizontal-list-renderer yt-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfllYIUv0.png) -20px -918px;
}
yt-horizontal-list-renderer:hover .yt-horizontal-list-renderer .arrow yt-icon {
    opacity:1
}
#items.yt-horizontal-list-renderer {
    transition:transform .3s ease-in-out;
    margin-bottom:0
}
#contents .grid-subheader.ytd-shelf-renderer {
    margin-top:0!important
}
#contents #contents.ytd-shelf-renderer {
    margin-top:10px!important
}
ytd-grid-video-renderer:not([rich-meta]) #metadata-line.ytd-grid-video-renderer {
    color:#767676
}
#contents ytd-channel-renderer #avatar-section.ytd-channel-renderer {
    flex:initial!important;
}
#play-button #button.ytd-button-renderer yt-icon.ytd-button-renderer + yt-formatted-string.ytd-button-renderer {
    margin:0;
    height:16px;
    border:1px solid #d3d3d3;
    background: #f8f8f8;
    line-height:16px;
    padding:0 10px;
    color:#333
}
#play-button #button.ytd-button-renderer yt-icon.ytd-button-renderer + yt-formatted-string.ytd-button-renderer:hover {
    border-color: #c6c6c6;
    background: #f0f0f0;
    box-shadow: 0 1px 0 rgba(0,0,0,0.10);
    text-decoration:none!Important
}
#play-button  yt-formatted-string.ytd-button-renderer:before { /*todo*/
    content:"";
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfl-Nn88d.png) -751px -156px;
    width: 16px;
    height: 16px;
    display:inline-block;
    opacity:.6;
    vertical-align:middle;
    margin-right:4px
}
.ytd-item-section-renderer #play-button {
    opacity:0
}
.ytd-item-section-renderer:hover #play-button {
    opacity:1
}
#subtitle.ytd-shelf-renderer {
    font-size:13px;
    margin-top:2px
}
  #items.ytd-grid-renderer > ytd-grid-channel-renderer.ytd-grid-renderer {
    width:auto;
    padding:0
}
#items.yt-horizontal-list-renderer > ytd-grid-channel-renderer.yt-horizontal-list-renderer #title.ytd-grid-channel-renderer {
    font-size:13px;
    text-align:left;
    margin:0;
    width:inherit;
    overflow:visible;
    height:auto;
    max-height:none
}
#channel-info.ytd-grid-channel-renderer,  #channel.ytd-grid-channel-renderer {
    align-items:start;
    width:var(--globalthumbh);
    margin-right:10px
}
#subscribe.ytd-grid-channel-renderer {
    margin:0
}
#thumbnail-attribution.ytd-grid-channel-renderer {
    font-size:11px;
    line-height:14px
}
.avatar.ytd-recognition-shelf-renderer {
    border-radius:0
}
#container.ytd-recognition-shelf-renderer {
    margin:0
}
#text-container.ytd-recognition-shelf-renderer, #avatars-container.ytd-recognition-shelf-renderer {
    padding:0
}
        /*videos tab*/
[page-subtype="channels"] :not(.has-items) #primary-items #label.yt-dropdown-menu {
    background:none;
    border:none;
    box-shadow:none;
    font-size:1.6rem;
    padding:0
}
ytd-channel-sub-menu-renderer {
    margin:0;
    background:#fff;
    border-bottom:1px solid #e2e2e2;
    max-height:48px;
    padding:0 15px
}
#primary-items .ytd-channel-sub-menu-renderer #label.yt-dropdown-menu {
    font:500 11px 'roboto';
    padding:0 10px;
    font-weight:500!important;
    color:#333;
    height:28px
}
#primary-items .ytd-channel-sub-menu-renderer #label-icon.yt-dropdown-menu {
    margin-top: -3px;
    margin-left: 5px;
    border: 1px solid transparent;
    border-top-color: #333;
    border-width: 4px 4px 0;
    width: 0;
    height: 0;
}
.ytd-channel-sub-menu-renderer .dropdown-content.tp-yt-paper-menu-button {
    box-shadow:none
}
.ytd-channel-sub-menu-renderer tp-yt-paper-listbox.yt-dropdown-menu a:hover .yt-dropdown-menu {
    background:#444;
    color:#fff
}
[page-subtype="channels"] #items.ytd-grid-renderer > .ytd-grid-renderer {
    margin-right:10px;
    margin-bottom:20px
}
[page-subtype="channels"] #items.ytd-grid-renderer {
    width:calc(
    100% + 10px)
}
        /*playlist tab*/
[page-subtype="channels"] #items.ytd-grid-renderer > ytd-grid-playlist-renderer.ytd-grid-renderer, [page-subtype="channels"] #items.ytd-grid-renderer > ytd-grid-show-renderer.ytd-grid-renderer {
    width:var(--globalthumb)
}
[page-subtype="channels"] ytd-playlist-thumbnail.ytd-grid-playlist-renderer, [page-subtype="channels"] ytd-playlist-thumbnail.ytd-grid-show-renderer {
    width:var(--globalthumb);
    height:var(--globalthumbh)
}
h3.ytd-grid-playlist-renderer, h3.ytd-grid-show-renderer {
    margin-bottom:0;
    margin-top:4px;
    color:#167ac6
}
#video-title.ytd-grid-show-renderer {
    margin:0
}
h3.ytd-grid-playlist-renderer a#video-title, h3.ytd-grid-show-renderer #video-title {
    font-size:13px;
    line-height:16.9px
}
ytd-grid-playlist-renderer a.yt-simple-endpoint.yt-formatted-string, ytd-grid-show-renderer .yt-simple-endpoint.yt-formatted-string {
    font-size:11px;
    text-transform:none;
    font-weight:400
}
#view-more.ytd-grid-playlist-renderer {
    margin:0
}
ytd-grid-playlist-renderer:hover #view-more.ytd-grid-playlist-renderer a.yt-simple-endpoint.yt-formatted-string {
    color:#167ac6
}
h3.ytd-grid-video-renderer:hover a, [page-subtype="channels"] h3.ytd-grid-playlist-renderer:hover a, [page-subtype="channels"] h3.ytd-grid-show-renderer:hover span {
    text-decoration:underline
}
        /*community*/
[page-subtype="channels"] #reply-button-end.ytd-comment-action-buttons-renderer yt-icon-button.ytd-button-renderer, ytd-comments-header-renderer[is-backstage] { /*lol 2nd one breaks post*/
    display:none
}
[page-subtype="channels"] #reply-button-end.ytd-comment-action-buttons-renderer yt-formatted-string:before {
    content:"Reply ";
    text-transform:none;
    color:#555
}
#author-thumbnail.ytd-backstage-post-renderer yt-img-shadow.ytd-backstage-post-renderer {
    border-radius:0;
    width:48px;
    height:48px;
    margin-right:10px
}
#author-text.yt-simple-endpoint.ytd-backstage-post-renderer {
    color:#128ee9;
    margin-bottom:0
}
#content-text.ytd-backstage-post-renderer {
    font-size:13px;
    line-height:16.9px
}
        /*about*/
.subheadline.ytd-channel-about-metadata-renderer {
    color:#555;
    font-size:13px;
    line-height:18px;
    margin:0;
    font-weight:500;
    padding-top:15px;
    padding-bottom:5px
}
#description-container.ytd-channel-about-metadata-renderer, #bio-container.ytd-channel-about-metadata-renderer, #photos-container.ytd-channel-about-metadata-renderer, #details-container.ytd-channel-about-metadata-renderer, #links-container.ytd-channel-about-metadata-renderer {
    padding-bottom:15px
}
ytd-channel-about-metadata-renderer {
    padding:0
}
#details-container.ytd-channel-about-metadata-renderer td.ytd-channel-about-metadata-renderer {
    padding:0;
}
#details-container.ytd-channel-about-metadata-renderer tr.ytd-channel-about-metadata-renderer {
    height:18px
}
#link-list-container.ytd-channel-about-metadata-renderer a.yt-simple-endpoint.ytd-channel-about-metadata-renderer {
    margin-bottom:2px;
    color:#167ac6
}
/*playlist*/
[page-subtype="playlist"] ytd-thumbnail-overlay-side-panel-renderer[bottom-panel] {
    min-width:224px;
    min-height:126px;
    opacity:0
}
[page-subtype="playlist"] ytd-thumbnail-overlay-side-panel-renderer[bottom-panel]:hover {
    opacity:1
}
[top-right-overlay] ~ [top-right-overlay] {
    display:none
}
[page-subtype="playlist"] {
    display:inline-block;
    width:100%
}
ytd-playlist-sidebar-renderer.ytd-browse {
    padding:0;
    position:static;
    display:inline-block;
    height:auto;
    width:100%;
    background:none;
    overflow:visible
}
ytd-playlist-sidebar-renderer.ytd-browse #items {
    width:1056px;
    margin:0 auto;
    background:#fff;
    box-shadow:0 1px 2px rgba(0,0,0,.1);
    padding:15px;
    box-sizing:border-box;
    padding-left:254px;
    margin-top:20px;
    position:relative
}
[page-subtype="playlist"] #privacy-form ytd-dropdown-renderer tp-yt-paper-dropdown-menu-light .tp-yt-paper-dropdown-menu-light[style-target="input"] {
    background:#f8f8f8;
    border:1px solid #ccc;
    font-size:11px;
    color:#333;
    font-weight:500;
    line-height:28px
}
tp-yt-paper-dropdown-menu-light[no-label-float] .label.tp-yt-paper-dropdown-menu-light, tp-yt-paper-dropdown-menu-light[no-label-float] .tp-yt-paper-dropdown-menu-light[style-target="label"] {
    display:none
}
[page-subtype="playlist"] #privacy-form ytd-dropdown-renderer tp-yt-paper-dropdown-menu-light .tp-yt-paper-dropdown-menu-light[style-target="input"]:after {
    position:absolute;
    margin-top:10px
}
            /*a few edit buttons*/
ytd-inline-form-renderer[component-style="INLINE_FORM_STYLE_BODY_TEXT_PLACEHOLDER"] #edit-button.ytd-inline-form-renderer {
    margin:0
}
[page-subtype="playlist"] .input-wrapper.tp-yt-paper-input-container::before, [page-subtype="playlist"] .input-wrapper.tp-yt-paper-input-container::after, .ytd-c4-tabbed-header-renderer .input-wrapper.tp-yt-paper-input-container::before, .ytd-c4-tabbed-header-renderer .input-wrapper.tp-yt-paper-input-container::after, yt-third-party-network-section-renderer .input-wrapper.tp-yt-paper-input-container::before, yt-third-party-network-section-renderer .input-wrapper.tp-yt-paper-input-container::after {
    content:none
}
[page-subtype="playlist"] .input-wrapper.tp-yt-paper-input-container, .ytd-c4-tabbed-header-renderer .input-wrapper.tp-yt-paper-input-container, yt-third-party-network-section-renderer .input-wrapper.tp-yt-paper-input-container {
    margin:0;
}
[page-subtype="playlist"] #labelAndInputContainer.tp-yt-paper-input-container > label {
    padding:5px 10px;
    font-size:13px
}
[page-subtype="playlist"] tp-yt-paper-input-container, .ytd-c4-tabbed-header-renderer tp-yt-paper-input-container {
    padding:0
}
#save-button.ytd-inline-form-renderer {
    margin:0
}
ytd-browse[page-subtype="playlist"][has-sidebar_] ytd-two-column-browse-results-renderer.ytd-browse, ytd-browse[page-subtype="show"][has-sidebar_] ytd-two-column-browse-results-renderer.ytd-browse {
    padding:0;
    display:block;
    position:static;
    width:1056px;
    margin:0 auto;
    margin-top:-2px
}
ytd-playlist-thumbnail.ytd-playlist-sidebar-primary-info-renderer {
    height:126px;
    width:224px;
    margin-bottom:0;
    position:absolute;
    margin-left:-239px
}
#title.ytd-playlist-sidebar-primary-info-renderer, #title.ytd-playlist-sidebar-primary-info-renderer ~ ytd-inline-form-renderer {
    color: #333;
    font-size: 20px;
    font-weight: 500;
    padding: 1px;
    line-height:33px;
    margin-bottom:4px;
    height:33px
}
#title.ytd-playlist-sidebar-primary-info-renderer a.yt-simple-endpoint.yt-formatted-string {
    color:#333
}
#stats.ytd-playlist-sidebar-primary-info-renderer, #description.ytd-playlist-sidebar-primary-info-renderer, [page-subtype="playlist"] ytd-inline-form-renderer[component-style="INLINE_FORM_STYLE_BODY_TEXT_PLACEHOLDER"] #text-displayed.ytd-inline-form-renderer {
    color: #767676;
    line-height: 12px;
    font-size:12px;
    margin:0
}
#stats.ytd-playlist-sidebar-primary-info-renderer {
    padding-left:83px;
    line-height:15.6px
}
        /*stupid buttons*/
.ytd-playlist-sidebar-primary-info-renderer button.yt-icon-button yt-icon{
    display:none
}
.ytd-playlist-sidebar-primary-info-renderer button.yt-icon-button:after {
    content:"Share";
    font-weight:500;
    font-family:"roboto";
    font-size:11px;
    padding:0 10px 0 6px;
    line-height:26px
}
.ytd-playlist-sidebar-primary-info-renderer ytd-toggle-button-renderer button.yt-icon-button:after {
    content:"Save";
    text-transform:none
}
.ytd-playlist-sidebar-primary-info-renderer a[href] button.yt-icon-button:after {
    content:"Shuffle";
}
.ytd-playlist-sidebar-primary-info-renderer button.yt-icon-button:before {
    content:"";
    display:inline-block;
    vertical-align:baseline;
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vflH9NjiG.png) -238px -161px;
    width: 10px;
    height: 10px;
    margin-left:10px;
    opacity:.5;
    margin-bottom:-1px
}
.ytd-playlist-sidebar-primary-info-renderer button.yt-icon-button:hover:before {
    opacity:.6
}
.ytd-playlist-sidebar-primary-info-renderer button.yt-icon-button:active:before {
    opacity:1
}
.ytd-playlist-sidebar-primary-info-renderer ytd-toggle-button-renderer button.yt-icon-button:before {
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfl6oUAlA.webp) -98px -39px;
    width:13px;
    height:13px;
    margin-bottom:-3px
}
.ytd-playlist-sidebar-primary-info-renderer a[href] button.yt-icon-button:before {
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vflKclzgY.webp) -750px -19px;
    width:13px;
    height:13px;
    margin-bottom:-3px
}
#edit-button button.yt-icon-button:before {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-watchedit-vflxUZcSA.png) 0 -140px;
    background-size: auto;
    width: 13px;
    height: 12px;
    padding-right:10px
}
#edit-button button.yt-icon-button:after {
    content:none
}
#menu.ytd-playlist-sidebar-primary-info-renderer {
    margin:0;
    margin-top:6px;
    margin-bottom:10px
}
.ytd-playlist-sidebar-primary-info-renderer yt-icon-button.ytd-button-renderer {
    height:28px;
    width:auto
}
.ytd-playlist-sidebar-primary-info-renderer #top-level-buttons-computed yt-icon-button.ytd-toggle-button-renderer {
    padding:0;
    width:auto;
    opacity:1
}
.ytd-playlist-sidebar-primary-info-renderer #top-level-buttons-computed.ytd-menu-renderer:not(:empty) + #flexible-item-buttons.ytd-menu-renderer + #button.ytd-menu-renderer {
    margin-left:0;
    width:auto;
    height:auto
}
.ytd-playlist-sidebar-primary-info-renderer .top-level-buttons .ytd-menu-renderer {
    margin-right:10px!important
}
        /*name*/
.ytd-playlist-sidebar-secondary-info-renderer .ytd-video-owner-renderer, .ytd-playlist-sidebar-secondary-info-renderer ytd-subscribe-button-renderer {
    display:none
}
#owner-container.ytd-playlist-sidebar-secondary-info-renderer {
    margin:0;
}
ytd-playlist-sidebar-secondary-info-renderer {
    padding:0;
    position:absolute;
    top:54px
}
#owner-container.ytd-playlist-sidebar-secondary-info-renderer ytd-channel-name .yt-simple-endpoint.yt-formatted-string {
    color: #767676;
    line-height: 15.6px;
    font-size:12px;
    margin:0;
    font-weight:400;
    max-width:80px;
    overflow:hidden;
    text-overflow:ellipsis;
    white-space:nowrap
}
#owner-container.ytd-playlist-sidebar-secondary-info-renderer ytd-channel-name .yt-simple-endpoint.yt-formatted-string:after {
    content:"•";
}
#owner-container.ytd-playlist-sidebar-secondary-info-renderer ytd-channel-name .yt-simple-endpoint.yt-formatted-string:after {
    margin:0 4px;
    display:inline-block;
}
#owner-container.ytd-playlist-sidebar-secondary-info-renderer ytd-channel-name .yt-simple-endpoint.yt-formatted-string:hover {
    color:#167ac6;
}
#items.ytd-playlist-sidebar-renderer > .ytd-playlist-sidebar-renderer:not(:last-child) {
    border:0
}
    /*list*/
[page-subtype="playlist"] #contents.ytd-section-list-renderer {
    padding:0!important
}
ytd-playlist-video-list-renderer {
    margin:0
}
#spinner-container.ytd-playlist-video-list-renderer {
    display:none
}
ytd-thumbnail.ytd-playlist-video-renderer {
    width:72px;
    height:40.28px;
    margin-top:15px;
    margin-bottom:15px;
    margin-right:15px
}
#video-title.ytd-playlist-video-renderer {
    color: #333;
    display: inline-block;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.3em;
    margin:0
}
ytd-playlist-video-renderer #content.ytd-playlist-video-renderer {
    padding:0!important
}
ytd-playlist-video-renderer:hover #video-title.ytd-playlist-video-renderer {
    color:#167ac6
}
ytd-playlist-video-renderer:hover #video-title.ytd-playlist-video-renderer:hover, .more-button.ytd-playlist-sidebar-primary-info-renderer:hover {
    text-decoration:underline
}
ytd-playlist-video-renderer #text.ytd-channel-name {
    color: #767676;
    font-size:11px!important;
    line-height:1
}
#meta.ytd-playlist-video-renderer {
    margin:15px 0
}
#content.ytd-playlist-video-renderer {
    border:0!important
}
ytd-playlist-video-renderer:hover:not(.dragging) {
    background:none;
}
ytd-playlist-video-renderer:not(.dragging) {
    border-bottom:1px solid #e2e2e2
}
#index.ytd-playlist-video-renderer {
    color: #767676;
    display: inline-block;
    font-size: 11px;
    width:34px
}
.more-button.ytd-playlist-sidebar-primary-info-renderer {
    color:#167ac6;
    text-transform:none;
    margin:5px 0 0 0;
    font-weight:400
}
/*history*/
    /*nav*/
ytd-two-column-browse-results-renderer[page-subtype="history"][has-secondary-column-data] #primary.ytd-two-column-browse-results-renderer {
    padding:0;
}
ytd-two-column-browse-results-renderer[page-subtype="history"] #secondary.ytd-two-column-browse-results-renderer {
    position:relative;
    right:auto
}
ytd-two-column-browse-results-renderer.ytd-browse[page-subtype="history"] {
    flex-flow:column-reverse
}
[page-subtype="history"] ytd-compact-link-renderer:not([has-secondary]) tp-yt-paper-item.ytd-compact-link-renderer {
    padding:0;
    height:28px!important;
    min-height:0!important
}
ytd-compact-link-renderer[compact-link-style="compact-link-style-type-history-my-activity-link"], ytd-compact-link-renderer[compact-link-style="compact-link-style-type-history-my-activity-link"]:first-of-type, #contents.ytd-browse-feed-actions-renderer > ytd-button-renderer.ytd-browse-feed-actions-renderer, #contents.ytd-browse-feed-actions-renderer > yt-button-renderer.ytd-browse-feed-actions-renderer, #contents.ytd-browse-feed-actions-renderer > ytd-toggle-button-renderer.ytd-browse-feed-actions-renderer {
    margin:0
}
#contents.ytd-browse-feed-actions-renderer {
    flex-direction:row;
    margin-top:32px;
    border-top:1px solid #e2e2e2;
    padding:10px 11px 0 11px
}
ytd-sub-feed-selector-renderer {
    margin:0;
    position:absolute;
    top:10px;
    margin-left:9px
}
ytd-sub-feed-selector-renderer #title.ytd-sub-feed-selector-renderer {
    display:none
}
ytd-sub-feed-selector-renderer #options {
    display:flex
}
ytd-sub-feed-option-renderer.ytd-sub-feed-selector-renderer {
    padding:0;
    border:0
}
ytd-sub-feed-option-renderer #radioContainer {
    display:none
}
ytd-sub-feed-option-renderer tp-yt-paper-radio-button .tp-yt-paper-radio-button[style-target="label"] yt-formatted-string.ytd-sub-feed-option-renderer {
    color: #666;
    font-size: 13px;
    font-weight: normal;
    height: 29px;
    line-height: 29px;
}
ytd-sub-feed-option-renderer tp-yt-paper-radio-button .tp-yt-paper-radio-button[style-target="label"] {
    padding:0 3px;
    border-bottom:3px solid transparent;
    margin-right:20px
}
ytd-sub-feed-option-renderer tp-yt-paper-radio-button[aria-checked="true"] .tp-yt-paper-radio-button[style-target="label"] yt-formatted-string.ytd-sub-feed-option-renderer {
    color:#333;
    font-weight:500
}
ytd-sub-feed-option-renderer tp-yt-paper-radio-button[aria-checked="true"] .tp-yt-paper-radio-button[style-target="label"], ytd-sub-feed-option-renderer tp-yt-paper-radio-button .tp-yt-paper-radio-button[style-target="label"]:hover {
    border-color:#cc181e
}
[page-subtype="history"] .input-wrapper.tp-yt-paper-input-container {
    margin:0;
    background:#fff;
    flex-direction:row-reverse
}
[page-subtype="history"] .input-wrapper.tp-yt-paper-input-container:focus-within {
    border-color:#d5d5d5
}
[page-subtype="history"] .input-wrapper.tp-yt-paper-input-container ytd-button-renderer #button.ytd-button-renderer {
    background:#f8f8f8;
    width:35px;
    height:28px
}
[page-subtype="history"] .input-wrapper.tp-yt-paper-input-container ytd-button-renderer #button.ytd-button-renderer yt-icon {
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfliTgLqv.webp) -28px -66px;
    fill:none;
    width:15px;
    height:15px;
    opacity:.6
}
[page-subtype="history"] .input-wrapper.tp-yt-paper-input-container ytd-button-renderer #button.ytd-button-renderer:hover {
    border-color: #c6c6c6;
    background: #f0f0f0;
    box-shadow: 0 1px 0 rgb(0 0 0 / 10%);
}
[page-subtype="history"] .input-wrapper.tp-yt-paper-input-container ytd-button-renderer #button.ytd-button-renderer:active {
    border-color: #c6c6c6;
    background: #e9e9e9;
    box-shadow: inset 0 1px 0 #ddd;
}
[page-subtype="history"] .input-wrapper.tp-yt-paper-input-container:before, [page-subtype="history"] .input-wrapper.tp-yt-paper-input-container:after {
    content:none
}
[page-subtype="history"] .input-wrapper.tp-yt-paper-input-container #search-button {
    height:28px;
    width:35px;
    margin:0
}
[page-subtype="history"] tp-yt-paper-input.ytd-search-box-renderer #labelAndInputContainer.tp-yt-paper-input-container > label, [page-subtype="history"] tp-yt-paper-input.ytd-search-box-renderer #labelAndInputContainer.tp-yt-paper-input-container > iron-input {
    min-height:28px;
    line-height:28px;
    padding-left:6px;
    width:auto;
    color:#767676;
    font-size:13px;
}
[page-subtype="history"] tp-yt-paper-input.ytd-search-box-renderer[focused] #labelAndInputContainer.tp-yt-paper-input-container > label, [page-subtype="history"] tp-yt-paper-input.ytd-search-box-renderer[focused] #labelAndInputContainer.tp-yt-paper-input-container > .paper-input-label {
    opacity:1;
}
[page-subtype="history"] tp-yt-paper-input-container {
    padding:0
}
[page-subtype="history"] ytd-search-box-renderer {
    margin:0;
    position:absolute;
    right:20px;
    top:6px
}
[page-subtype="history"] #clear-button.ytd-search-box-renderer {
    margin:0
}
[page-subtype="history"] #clear-button.ytd-search-box-renderer yt-icon-button.ytd-button-renderer {
    width:28px;
    height:28px
}
ytd-search-pyv-renderer { /*TH is this?*/
    display:none
}
.ytd-browse-feed-actions-renderer #button.ytd-button-renderer yt-icon.ytd-button-renderer + yt-formatted-string.ytd-button-renderer, ytd-compact-link-renderer[compact-link-style="compact-link-style-type-history-my-activity-link"] #content-icon.ytd-compact-link-renderer[hidden] + #primary-text-container.ytd-compact-link-renderer > #label.ytd-compact-link-renderer {
    font:500 11px 'roboto';
    font-size:11px;
    color:#333;
    border-radius: 2px;
    box-shadow: 0 1px 0 rgb(0 0 0 / 5%);
    border:1px solid #d3d3d3;
    background: #f8f8f8;
    height:26px;
    line-height:26px;
    padding:0 10px;
    margin-top:0;
    margin-left:4px
}
.ytd-browse-feed-actions-renderer #button.ytd-button-renderer yt-icon.ytd-button-renderer + yt-formatted-string.ytd-button-renderer:hover, ytd-compact-link-renderer[compact-link-style="compact-link-style-type-history-my-activity-link"] #content-icon.ytd-compact-link-renderer[hidden] + #primary-text-container.ytd-compact-link-renderer > #label.ytd-compact-link-renderer:hover {
    border-color: #c6c6c6;
    background: #f0f0f0;
    box-shadow: 0 1px 0 rgb(0 0 0 / 10%);
    text-decoration:none
}
.ytd-browse-feed-actions-renderer #button.ytd-button-renderer yt-icon.ytd-button-renderer + yt-formatted-string.ytd-button-renderer:active, ytd-compact-link-renderer[compact-link-style="compact-link-style-type-history-my-activity-link"] #content-icon.ytd-compact-link-renderer[hidden] + #primary-text-container.ytd-compact-link-renderer > #label.ytd-compact-link-renderer:active {
    border-color: #c6c6c6;
    background: #e9e9e9;
    box-shadow: inset 0 1px 0 #ddd;
}
#contents.ytd-browse-feed-actions-renderer > ytd-button-renderer.ytd-browse-feed-actions-renderer {
    display:block;
    border-radius:0
}
.ytd-browse-feed-actions-renderer #subtitle.ytd-compact-link-renderer, [page-subtype="history"] ytd-text-header-renderer[header-style="text-header-renderer-style-bold"] {
    display:none
}
ytd-two-column-browse-results-renderer[page-subtype="history"] ytd-browse-feed-actions-renderer.ytd-two-column-browse-results-renderer {
    background:#fff;
    margin:0;
    padding:10px 0;
    width:auto;
    border-bottom: 1px solid #e2e2e2;
    box-shadow: 0 1px 2px rgba(0,0,0,.1)
}
    /*content*/
ytd-video-renderer:not([is-search]) ytd-thumbnail.ytd-video-renderer {
    width:var(--globalthumb);
    height:var(--globalthumbh);
    margin-right:10px
}
[page-subtype="history"] #video-title.ytd-video-renderer, [page-subtype="history"] #title-wrapper {
    font-size:14px;
    line-height:15.6px;
    height:18.2px;
    margin-bottom:0px;
    font-weight:500
}
[page-subtype="history"] #channel-name #text.ytd-channel-name, [page-subtype="history"] #metadata-line.ytd-video-meta-block span.ytd-video-meta-block {
    font-size:12px!important
}
#description-text.ytd-video-renderer {
    color:#767676;
    padding-top:1px
}
ytd-video-renderer.ytd-item-section-renderer:last-child {
    margin-bottom:0
}
ytd-video-renderer:not([is-search]),.text-wrapper.ytd-video-renderer {
    max-width:none
}
[is-history] #top-level-buttons-computed yt-icon-button {
    max-width:24px;
    max-height:24px
}
/*library*/
ytd-section-list-renderer:not([hide-bottom-separator]):not([page-subtype="history"]):not([page-subtype="memberships-and-purchases"]):not([page-subtype="ypc-offers"]) #contents.ytd-section-list-renderer > .ytd-section-list-renderer:not(:last-child):not(ytd-page-introduction-renderer):not([item-dismissed]).ytd-section-list-renderer:not([has-destination-shelf-renderer]).ytd-section-list-renderer:not(ytd-minor-moment-header-renderer) {
    margin-top:10px
}
ytd-section-list-renderer:not([hide-bottom-separator]):not([page-subtype="history"]):not([page-subtype="memberships-and-purchases"]):not([page-subtype="ypc-offers"]) #icon.ytd-shelf-renderer {
    display:none
}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
