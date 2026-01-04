// ==UserScript==
// @name 2015 Youtube Studio UI
// @namespace userstyles.world
// @version 2023.8
// @description Changes the Youtube Studio frontend to resemble the 2015 version.
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/499475/2015%20Youtube%20Studio%20UI.user.js
// @updateURL https://update.greasyfork.org/scripts/499475/2015%20Youtube%20Studio%20UI.meta.js
// ==/UserScript==

(function() {
let css = "";
css += `@-moz-document domain("studio.youtube.com") {



/*general*/
html ::-webkit-scrollbar, html ::-webkit-scrollbar-thumb {
    border-radius:0;
    height:initial;
}
paper-ripple {
    display:none!important
}
* {
    letter-spacing:0!important
}
#progressContainer.tp-yt-paper-progress {
    background:transparent
}
.indeterminate.tp-yt-paper-progress::after, #primaryProgress.tp-yt-paper-progress {
    background:#cc181e
}
tp-yt-paper-progress.ytcp-header {
    top:0
}
/*overlay*/
tp-yt-iron-overlay-backdrop, .popup-host-behavior-backdrop {
    background:rgba(255,255,255.2)!important;
}
/*tooltip*/
ytcp-paper-tooltip-placeholder[type=truncation] #tooltip.ytcp-paper-tooltip-placeholder, ytcp-paper-tooltip-placeholder[type=label] #tooltip.ytcp-paper-tooltip-placeholder {
    border-radius:2px;
    background:#000;
    color:#fff;
    box-shadow:0 1px 1px rgba(0,0,0,.25);
    font-size:11px;
    padding:6px;
    line-height:1
}
        /*general*/
ytcp-paper-tooltip-placeholder[type=explanatory] #tooltip.ytcp-paper-tooltip-placeholder {
    border-radius:2px;
    background:#000;
    color:#fff;
    box-shadow:0 1px 1px rgba(0,0,0,.25);
    font-size:11px;
    padding:6px;
    line-height:1
}
ytcp-paper-tooltip-placeholder[type=explanatory] #tooltip.ytcp-paper-tooltip-placeholder > * * {
    padding:0;
    color:#fff;
    line-height:1;
}
        /*copyright tt*/
.title.ytcp-video-restrictions-tooltip-body, .description.ytcp-video-restrictions-tooltip-body {
    display:none
}
.content.ytcp-video-restrictions-tooltip-body {
    position:relative;
    top:06px;
    left:0px;
    background:#fff;
    padding:6px;
    box-shadow:0 1px 1px rgba(0,0,0,.25);
    line-height:1;
    border:1px solid #ebebeb
}
.content.ytcp-video-restrictions-tooltip-body .label.ytcp-button {
    text-transform:none;
    padding:0!important;
    line-height:1
}
ytcp-button.ytcp-video-restrictions-tooltip-body {
    min-height:0;
    height:auto;
    padding:0;
    margin:0
}
/*alert*/
ytcp-banner[color-theme] .banner-icon.ytcp-banner {
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vflZyP8dK.webp) -243px -799px;
    background-size: auto;
    width: 20px;
    height: 21px;
}
ytcp-banner[color-theme] .banner-icon.ytcp-banner svg {
    fill:none
}
ytcp-banner[color-theme]:not([hide-border]) .container.ytcp-banner {
    border:0;
    background:#167ac6;
    max-height:36px
}
ytcp-banner {
    max-height:36px
}
ytcp-banner[color-theme] *, .pagination-text.ytcp-banner {
    --ytcp-themed-blue:#fff;
    color:#fff;
    font:500 13px roboto, arial;
    text-transform:none
}
ytcp-banner[color-theme] #message.ytcp-banner {
    line-height:16px
}
/*callout*/
#callout.ytcp-feature-discovery-callout, #divot.ytcp-feature-discovery-callout {
    background:#167ac6;
    border-color:#167ac6;
    color:#fff;
    fill:#fff
}
#next-button.ytcp-feature-discovery-callout {
    color:#fff
}
/*button*/
html {
    --ytcp-call-to-action-raised-background:#167ac6;
    --ytcp-call-to-action:#167ac6
}
ytcp-button[type=filled][disabled] {
    background:var(--ytcp-call-to-action-raised-background);
    opacity:.5
}
[studio-theme="DEFAULT"] ytcp-button[type="primary"][disabled] {
    opacity:.5
}
ytcp-button[type=filled], .suggestion.ytcp-suggestions, #hover-items.ytcp-playlist-row a.ytcp-playlist-row ytcp-icon-button, #create-playlist-buttons > ytcp-button, [studio-theme="DEFAULT"] ytcp-button[type="primary"], #cancel-button, #submit-button, .ytcp-video-metadata-editor .container.ytcp-dropdown-trigger, ytcp-video-list-cell-video[show-hover-items] .hover-item.ytcp-video-list-cell-video > ytcp-icon-button, .borderless.container.ytcp-dropdown-trigger, #save-button, ytcp-button.ytcp-video-list-cell-video-edit-dialog, [icon="icons:feedback"], #video-details[track-click].hover-item, #watch-on-yt[track-click].hover-item, .hover-item.ytcp-video-list-cell-video[icon="more-vert"], #dialog-buttons.ytcp-confirmation-dialog ytcp-button.ytcp-confirmation-dialog#confirm-button, [menu-style=multi-page-menu-style-type-account] yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(2) > a, ytd-toggle-theme-compact-link-renderer, ytls-user-experience-dialog[dialog-type=SELECT_SOURCE] #bottom-button.ytls-user-experience-dialog {
    display: inline-block;
    height: 28px;
    border: solid 1px transparent;
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
    text-transform:none;
    min-width:0;
    margin:0;
    transition:none;
    animation:initial;
    align-items:center;
}
ytcp-button[type=filled]:focus, #hover-items.ytcp-playlist-row a.ytcp-playlist-row ytcp-icon-button:focus, [studio-theme="DEFAULT"] ytcp-button[type="primary"]:focus, #cancel-button:focus, .ytcp-video-metadata-editor .container.ytcp-dropdown-trigger:focus, ytcp-video-list-cell-video[show-hover-items] .hover-item.ytcp-video-list-cell-video ytcp-icon-button:focus, .borderless.container.ytcp-dropdown-trigger:focus, #save-button:focus, ytcp-button.ytcp-video-list-cell-video-edit-dialog:focus, #video-details[track-click].hover-item:focus, .hover-item.ytcp-video-list-cell-video[icon="more-vert"]:focus, #watch-on-yt[track-click].hover-item:focus, [menu-style=multi-page-menu-style-type-account] yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(2) > a:focus, ytd-toggle-theme-compact-link-renderer:focus, ytls-user-experience-dialog[dialog-type=SELECT_SOURCE] #bottom-button.ytls-user-experience-dialog:focus {
    box-shadow: 0 0 0 2px rgb(27 127 204 / 40%);
}
#create-icon.ytcp-header, .suggestion.ytcp-suggestions, #hover-items.ytcp-playlist-row a.ytcp-playlist-row ytcp-icon-button, #create-playlist-buttons > ytcp-button, [studio-theme="DEFAULT"] ytcp-button[type="primary"], #cancel-button, .ytcp-video-metadata-editor .container.ytcp-dropdown-trigger, ytcp-video-list-cell-video[show-hover-items] .hover-item.ytcp-video-list-cell-video > ytcp-icon-button, ytcp-dropdown-trigger[dark] .container.ytcp-dropdown-trigger, ytcp-button.ytcp-video-list-cell-video-edit-dialog, #select-files-button.ytcp-uploads-file-picker, #video-details[track-click].hover-item, .hover-item.ytcp-video-list-cell-video[icon="more-vert"], #watch-on-yt[track-click].hover-item, [menu-style=multi-page-menu-style-type-account] yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(2) > a, ytd-toggle-theme-compact-link-renderer, ytls-user-experience-dialog[dialog-type=SELECT_SOURCE] #bottom-button.ytls-user-experience-dialog { /*uix default*/
    border-color: #d3d3d3;
    background: #f8f8f8;
    color: #333;
    border-radius:2px
}
#create-icon.ytcp-header:hover, .suggestion.ytcp-suggestions:hover, #hover-items.ytcp-playlist-row a.ytcp-playlist-row ytcp-icon-button:hover, #create-playlist-buttons > ytcp-button:hover, [studio-theme="DEFAULT"] ytcp-button[type="primary"]:hover, #cancel-button:hover, .ytcp-video-metadata-editor .container.ytcp-dropdown-trigger:hover,  ytcp-video-list-cell-video[show-hover-items] .hover-item.ytcp-video-list-cell-video > ytcp-icon-button:hover, ytcp-dropdown-trigger[dark] .container.ytcp-dropdown-trigger:hover, ytcp-button.ytcp-video-list-cell-video-edit-dialog:hover, #select-files-button.ytcp-uploads-file-picker:hover, #video-details[track-click].hover-item:hover, .hover-item.ytcp-video-list-cell-video[icon="more-vert"]:hover, #watch-on-yt[track-click].hover-item:hover, [menu-style=multi-page-menu-style-type-account] yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(2) > a:hover, ytd-toggle-theme-compact-link-renderer:hover, ytls-user-experience-dialog[dialog-type=SELECT_SOURCE] #bottom-button.ytls-user-experience-dialog:hover { /*uix default*/
    border-color: #c6c6c6;
    background: #f0f0f0;
    box-shadow: 0 1px 0 rgb(0 0 0 / 10%);
}
#create-icon.ytcp-header:active, .suggestion.ytcp-suggestions:active,  #hover-items.ytcp-playlist-row a.ytcp-playlist-row ytcp-icon-button:active, #create-playlist-buttons > ytcp-button:active, [studio-theme="DEFAULT"] ytcp-button[type="primary"]:active, #cancel-button:active, .ytcp-video-metadata-editor .container.ytcp-dropdown-trigger:active,  ytcp-video-list-cell-video[show-hover-items] .hover-item.ytcp-video-list-cell-video > ytcp-icon-button:active, ytcp-dropdown-trigger[dark] .container.ytcp-dropdown-trigger:active, ytcp-button.ytcp-video-list-cell-video-edit-dialog:active, #select-files-button.ytcp-uploads-file-picker:active, #video-details[track-click].hover-item:active, .hover-item.ytcp-video-list-cell-video[icon="more-vert"]:active, #watch-on-yt[track-click].hover-item:active, [menu-style=multi-page-menu-style-type-account] yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(2) > a:active, ytd-toggle-theme-compact-link-renderer:active, ytls-user-experience-dialog[dialog-type=SELECT_SOURCE] #bottom-button.ytls-user-experience-dialog:active { /*uix default*/
    border-color: #c6c6c6;
    background: #e9e9e9;
    box-shadow: inset 0 1px 0 #ddd;
}
#create-playlist-buttons > ytcp-button#create-button, #submit-button, #save-button, #dialog-buttons.ytcp-confirmation-dialog ytcp-button.ytcp-confirmation-dialog#confirm-button {
    border-color: #167ac6;
    background: #167ac6;
    box-shadow:none;
    color:#fff
}
#create-playlist-buttons > ytcp-button#create-button:hover, #submit-button:hover, #save-button:hover, #dialog-buttons.ytcp-confirmation-dialog ytcp-button.ytcp-confirmation-dialog#confirm-button:hover {
    background: #126db3;
    border-color:#167ac6;
    box-shadow:none
}
#create-playlist-buttons > ytcp-button#create-button:active, #submit-button:active, #save-button:active, #dialog-buttons.ytcp-confirmation-dialog ytcp-button.ytcp-confirmation-dialog#confirm-button:active {
    background: #095b99;
    border-color:#167ac6;
    box-shadow: inset 0 1px 0 rgb(0 0 0 / 50%);
}
ytcp-button.ytcp-video-visibility-edit-popup, ytcp-button.ytcp-video-list-cell-video-edit-dialog, #dialog-buttons.ytcp-confirmation-dialog ytcp-button.ytcp-confirmation-dialog {
    margin-right:8px!important
}
/*player*/
 #playhead.ytcp-video-player-timeline {
    transform:scale(0);
    border: 5px solid #eaeaea;
    background: #aeaeae;
    height: 6px;
    width: 6px;
    border-radius:50%;
    transition:all 500ms, left 0ms;
    transform-origin:center;
    margin-top:0;
    margin-left:-7px;
}
ytcp-video-player-timeline:hover #playhead.ytcp-video-player-timeline, ytcp-video-player-timeline.locked #playhead.ytcp-video-player-timeline {
    border: 5px solid #eaeaea;
    background: #aeaeae;
    height: 6px;
    width: 6px;
    border-radius:50%;
    transform:scale(1)
}
ytcp-video-player-timeline:hover #playhead.ytcp-video-player-timeline:hover {
    background:#cc181e
}
[name="video.edit"] #toolbar-container.ytcp-video-player-controls {
    height:35px;
    bottom:-26px;
}
#toolbar-container.ytcp-video-player-controls {
    height:35px
}
[name="video.edit"] #video-container:not([style="width: 480px; height: 270px;"]) #toolbar-container.ytcp-video-player-controls {
    bottom:0
}
#timeline-container.ytcp-video-player-timeline, ytcp-video-player-timeline {
    width:100%;
    left:0;
    right:0
}
ytcp-video-player-timeline {
    padding-left:0;
    padding-right:0;
    padding-bottom:0;
}
.timeline-slice.ytcp-video-player-timeline {
    background:#444
}
.buffer-progress-slice.ytcp-video-player-timeline, .hover-progress-slice.ytcp-video-player-timeline {
    background:#777
}
.progress-slice.ytcp-video-player-timeline {
    background:#cc181e
}
ytcp-video-player-timeline .slice.ytcp-video-player-timeline,ytcp-video-player-timeline.locked .slice.ytcp-video-player-timeline {
    height:8px;
    transform:scaley(0.375);
    transition: transform .5s ease-in,background .15s;
    transform-origin: bottom;
}
#highlight-container.ytcp-video-player-timeline {
    height:8px;
    bottom:0
}
ytcp-video-player-timeline:hover .slice.ytcp-video-player-timeline, ytcp-video-player-timeline.locked .slice.ytcp-video-player-timeline {
    height:8px;
    transform:scaley(1);
    transition: transform .5s ease-in,background .15s;
}
#timeline-container.ytcp-video-player-timeline {
    height:8px
}
 #toolbar.ytcp-video-player-controls {
    height:37px;
    z-index:2;
    top:0
}
#button-bar.ytcp-video-player-controls {
    background:#1b1b1b
}
#toolbar.ytcp-video-player-controls ytcp-icon-button, .volume-control.ytcp-video-player-controls {
    padding:0;
    height:27px
}
ytcp-video-player-timestamp {
    height:27px;
    font-size:11px;
    line-height:27px;
    white-space:nowrap;
    overflow:hidden
}
#settings-button.ytcp-video-player-settings-menu {
    margin:0;
    height:24px
}
#toolbar.ytcp-video-player-controls ytcp-icon-button#settings-button {
    height:24px;
    margin-top:1px;
    width:30px
}
#settings-button svg {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) -39px -1298px;
    fill:none
}
#settings-button:hover svg {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) -48px -1645px;
}
.right-button.ytcp-video-player-controls {
    width:30px;
    margin-right:4px
}
.right-button.ytcp-video-player-controls svg {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) 0 -1079px;
    fill:none;
    width:35px
}
.right-button.ytcp-video-player-controls:hover svg {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) -13px -1953px;
}
.volume-control.ytcp-video-player-controls {
    width:30px
}
.volume-control.ytcp-video-player-controls svg {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) 0 -735px;
    fill:none
}
.volume-control.ytcp-video-player-controls:hover svg {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) -34px -1984px;
}
.volume-control.ytcp-video-player-controls ytcp-icon-button {
    margin-left:0!important;
    width:30px
}
.volume-control.ytcp-video-player-controls .low svg {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) 0 -1298px;
}
.volume-control.ytcp-video-player-controls:hover .low svg {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) -39px -316px;
}
.volume-control.ytcp-video-player-controls .muted svg {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) 0 -316px;
}
.volume-control.ytcp-video-player-controls:hover .muted svg {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) -34px -371px;
}
#pause-button {
    width:55px;
    margin:0
}
.ytcp-uploads-dialog #pause-button, .ytcp-uploads-dialog #play-button {
    width:38px;
    margin-left:-14px
}
#pause-button svg {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) 0 -2182px;
    fill:none
}
#pause-button:hover svg {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) 0 -161px;
}
#play-button {
    width:55px;
    margin:0
}
#play-button svg {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) 0 -1172px;
    fill:none
}
#play-button:hover svg {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) -17px -1492px;
}
#progressContainer.tp-yt-paper-progress {
    height:4px
}
.slider-knob.tp-yt-paper-slider {
    top:1px
}
/*header*/
header.ytcp-header {
    padding:7px 30px 8px 30px;
    border-bottom:1px solid #e8e8e8;
    box-shadow:none;
    height:34px
}
ytcp-header {
    box-shadow:none
}
    /*guide*/
#collapse-expand-icon.ytcp-header > tp-yt-iron-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-2x-vflAoq8p7.png) -280px -123px;
    background-size: 571px 360px;
    width: 16px;
    height: 16px;
}
#collapse-expand-icon.ytcp-header {
    height:28px;
    width:auto;
    padding:0 10px;
    border:1px solid transparent;
    align-items:center;
    margin:0;
    margin-top:3px
}
    /*logo*/
ytcp-home-button {
    background: no-repeat url(://s.ytimg.com/yts/imgbin/www-hitchhiker-vflbk2Y8_.png) -493px -324px;
    background-size: 571px 360px;
    width: 73.5px;
    height: 30px;
    padding:0;
    margin:0;
    margin-top:3px
}
ytcp-home-button a {
    opacity:0
}
    /*search*/
#backdrop.ytcp-omnisearch {
    opacity:0
}
ytcp-omnisearch.ytcp-header {
    height: 29px;
    padding:0;
    margin-top:3px;
    margin-left:224px
}
form.ytcp-omnisearch {
    border:1px solid #d3d3d3;
    box-shadow: inset 0 1px 2px #eee;
}
input.ytcp-omnisearch {
    font:400 16px roboto, arial;
    height:auto;
    border:0;
    padding: 2px 6px;
    align-items:center;
    vertical-align:middle;
    line-height:23px;
    color:#000
}
input.ytcp-omnisearch::placeholder {
    color:#767676;
}
.search-icon.ytcp-omnisearch {
    right:0;
    left:auto;
    border:1px solid #d3d3d3;
    background: #f8f8f8;
    height:27px;
    top:0px;
    width:60px;
    box-shadow: 0 1px 0 rgb(0 0 0 / 5%);
    bottom:initial;
    padding:0;
    cursor:pointer
}
.search-icon.ytcp-omnisearch:hover {
    border-color: #c6c6c6;
    background: #f0f0f0;
    box-shadow: 0 1px 0 rgb(0 0 0 / 10%);
}
.search-icon.ytcp-omnisearch:active {
    border-color: #c6c6c6;
    background: #e9e9e9;
    box-shadow: inset 0 1px 0 #ddd;
}
.search-icon.ytcp-omnisearch svg {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-2x-vflAoq8p7.png) -447px -145px;
    background-size: 571px 360px;
    max-width: 15px;
    max-height: 15px;
    opacity:.6;
    fill:none
}
#results.results-ready.ytcp-omnisearch {
    padding:0;
    border:1px solid #d3d3d3;
    border-top:0;
    box-sizing:border-box;
    border-radius:0
}
#clear-icon.ytcp-omnisearch {
    right:60px;
    padding:3px;
    width:22px;
    height:22px;
    align-items:center;
    top:0
}
#clear-icon.ytcp-omnisearch tp-yt-iron-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflKclzgY.webp) -90px -190px;
    width: 20px;
    height: 10px;
    font-size: 8px;
    color: transparent;
    opacity:.5
}
    /*others*/
#search-icon.ytcp-header, #help-icon {
    padding:0 10px;
}
.avatar.ytcp-header {
    height:28px;
    width:29px
}
yt-img-shadow.ytd-topbar-menu-button-renderer, yt-img-shadow.ytd-topbar-menu-button-renderer img {
    height:28px;
    width:29px;
}
    /*create*/
tp-yt-iron-icon.inline.ytcp-button {
    display:none
}
#create-icon.ytcp-header {
    padding-left:10px
}
ytcp-button[icon][icon-alignment=start] .label.ytcp-button {
    padding-left:0;
    padding-top:7px;
    padding-bottom:6px
}
#create-icon.ytcp-header:not([keyboard-focus]):focus {
    box-shadow: 0 0 0 2px rgb(27 127 204 / 40%);
}
    /*user menu*/
ytd-multi-page-menu-renderer[menu-style=multi-page-menu-style-type-account] {
    border: 1px solid #c5c5c5;
    box-shadow: 0 0 15px rgb(0 0 0 / 18%);
}
#avatar.ytd-active-account-header-renderer {
    border-radius:0;
    width:60px;
    height:60px;
    margin-right:10px
}
#avatar.ytd-active-account-header-renderer img {
    width:100%;
    height:100%;
    border-radius:0
}
#channel-container.ytd-active-account-header-renderer {
    justify-content:start
}
ytd-active-account-header-renderer:not([enable-handles-account-menu-switcher]) #account-name.ytd-active-account-header-renderer {
    font-size:13px;
    line-height:1.3em;
    margin-bottom:1px
}
#email.ytd-active-account-header-renderer {
    font-size:13px;
    line-height:1.3em;
    font-weight:400
}
#channel-handle.ytd-active-account-header-renderer {
    display:none
}
ytd-active-account-header-renderer {
    padding:15px;
    border-color:rgba(0,0,0,0.1)
}
    /*channel link*/
[menu-style=multi-page-menu-style-type-account][slot="dropdown-content"] > #container yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(1) {
    position:absolute;
    top:15px;
    left:15px;
    opacity:0
}
[menu-style=multi-page-menu-style-type-account][slot="dropdown-content"] > #container yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(1) tp-yt-paper-item {
    padding:0
}
[menu-style=multi-page-menu-style-type-account][slot="dropdown-content"] > #container yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(1) #primary-text-container {
    display:none
}
[menu-style=multi-page-menu-style-type-account][slot="dropdown-content"] > #container yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(1) a {
    width:60px;
    height:60px;
}
    /*youtube.com redirect*/
[menu-style=multi-page-menu-style-type-account][slot="dropdown-content"] > #container yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(2) {
    position:absolute;
    top:55px;
    background:none!Important;
    left:85px
}
[menu-style=multi-page-menu-style-type-account][slot="dropdown-content"] > #container yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(2) > a#endpoint {
    height:auto;
    line-height:1
}
[menu-style=multi-page-menu-style-type-account][slot="dropdown-content"] > #container yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(2) > a#endpoint > tp-yt-paper-item {
    padding:0;
    height:20px;
    min-height:0;
    font:400 11px roboto,arial;
}
[menu-style=multi-page-menu-style-type-account][slot="dropdown-content"] > #container yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(2) #content-icon {
    display:none
}
[menu-style=multi-page-menu-style-type-account][slot="dropdown-content"] > #container yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(2) > a#endpoint > tp-yt-paper-item:before {
    content:none
}
[menu-style=multi-page-menu-style-type-account][slot="dropdown-content"] > #container yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(2) #label.ytd-compact-link-renderer {
    font-size:inherit;
    font-weight:500
}
    /*switch account*/
[menu-style=multi-page-menu-style-type-account] #container yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(3) {
    
}
    /*switch account inner*/
[menu-style=multi-page-menu-style-type-account] #subtitle.ytd-compact-link-renderer {
    padding:0
}
#submenu.ytd-multi-page-menu-renderer, #container.ytd-multi-page-menu-renderer, #header.ytd-multi-page-menu-renderer {
    display:block!Important
}
    /*appearance*/
ytd-toggle-theme-compact-link-renderer {
    position:absolute;
    top:55px;
    left:160px;
    height:20px;
    min-height:0;
    min-width:0;
    padding:0 5px 0 1px
}
ytd-toggle-theme-compact-link-renderer yt-icon {
    width:18px;
    height:18px
}
ytd-toggle-theme-compact-link-renderer #label, ytd-toggle-theme-compact-link-renderer #secondary-icon {
    display:none
}
.content-icon.ytd-toggle-theme-compact-link-renderer {
    margin:0;
}
    /*feedback*/
#sections.ytd-multi-page-menu-renderer>*.ytd-multi-page-menu-renderer:nth-child(2) {
    background:#eee
}
/*guide*/
img.image-thumbnail.ytcp-navigation-drawer {
    display:none
}
.image-thumbnail.ytcp-navigation-drawer, .icon-thumbnail.ytcp-navigation-drawer, .square-image-thumbnail.ytcp-navigation-drawer {
    height:24px;
    width:100%;
    left:0;
    top:17px;
    padding-top:3px;
    padding-bottom:6px
}
.thumbnail-wrapper.ytcp-navigation-drawer {
    height:50px;
}
div ytcp-navigation-drawer[layout] #entity-label-container.ytcp-navigation-drawer {
    display:none
}
.grey-overlay.ytcp-overlay-with-link {
    display:none
}
.overlay-with-link.ytcp-overlay-with-link:before {
    content:"Creator studio";
    background: none;
    color: #444;
    font-size: 13px;
    text-transform: uppercase;
    font-weight: 500;
    padding: 4px 0 5px 17px;
    display:inline-block;
}
.overlay-container.ytcp-overlay-with-link:hover .overlay-with-link.ytcp-overlay-with-link:before {
    text-decoration:underline
}
ytcp-navigation-drawer[collapsed-nav] .thumbnail-wrapper.ytcp-navigation-drawer {
    height:0
}
[collapsed-nav] #bottom-section {
    display:none
}
.overlay-link.ytcp-overlay-with-link {
    top:0;
    opacity:0
}
.overlay-with-link.ytcp-overlay-with-link[hidden] {
    display:block!important;
}
.image-thumbnail.ytcp-navigation-drawer {
    border-radius:0
}
ytcp-navigation-drawer {
    --navigation-drawer-expanded-width:215px;
    --navigation-drawer-collapsed-width:57px
}
    /*body*/
ytcp-navigation-drawer.ytcp-entity-page {
    box-shadow: 0 1px 2px rgb(0 0 0 / 10%);
    background:#fff;
    flex:initial;
    height:min-content;
    margin-top:10px
}
nav.ytcp-navigation-drawer {
    border:0;
    flex:initial
}
.top-section.ytcp-navigation-drawer {
    display:inline;
    flex:initial
}
    /*icons*/
.menu-right-icon.ytcp-navigation-drawer {
    display:none!important
}
tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-videomanager-2x-vflLIGSP6.png) 0 -46px;
    background-size: 50px 1018px;
    width: 24px;
    height: 24px;
    fill:none;
    vertical-align: middle;
    display: inline-block;
}
.ytcp-navigation-drawer .content-icon.tp-yt-paper-icon-item {
    margin:0 7px 0 0
}
tp-yt-paper-icon-item.ytcp-navigation-drawer {
    padding:13px 14px;
    height:auto;
    margin:0;
    min-height:0
}
tp-yt-paper-icon-item.iron-selected.ytcp-navigation-drawer {
    background:none
}
tp-yt-paper-icon-item.ytcp-navigation-drawer:hover {
    background:#f6f6f6
}
tp-yt-paper-icon-item.iron-selected.ytcp-navigation-drawer:after {
    content:none
}
.nav-item-text.ytcp-navigation-drawer {
    font:500 11px roboto,arial;
    text-transform:uppercase
}
#menu-item-0 tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer { /*dash*/
    background-position:0 -46px;
}
#menu-item-0 tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected tp-yt-iron-icon.ytcp-navigation-drawer {
    background-position:0 -392px
}
[href*="videos/upload"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
    background-position: 0 -724px
}
[href*="videos/upload"] tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected tp-yt-iron-icon.ytcp-navigation-drawer {
    background-position: 0 -20px
}
[href*="playlists"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
    background-position: 0 -724px;
    transform:rotate(90deg)
}
[href*="playlists"] tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected tp-yt-iron-icon.ytcp-navigation-drawer {
    background-position: 0 -20px
}
[href*="analytics"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
    background-position:-26px -509px;
}
[href*="analytics"] tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected tp-yt-iron-icon.ytcp-navigation-drawer {
    background-position:-26px -429px;
}
[href*="comments/inbox"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer { /*comments*/
    background-position:-0px -966px;
}
[href*="comments/inbox"] tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected tp-yt-iron-icon.ytcp-navigation-drawer {
    background-position:-26px -619px;
}
[href*="comments/inbox"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer:before {
    content:"";
    width:14px;
    height:13px;
    position:absolute;
    background:#343434;
    top:5px;
    left:5px
}
[href*="comments/inbox"] tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected tp-yt-iron-icon.ytcp-navigation-drawer:before {
    background:#CC181F
}
[href*="translations"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
    background-position:-26px -20px;
}
[href*="translations"] tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected tp-yt-iron-icon.ytcp-navigation-drawer {
    background-position:-0px -213px;
}
[href*="copyright"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
    background-position:-0px -994px;
}
[href*="copyright"] tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected tp-yt-iron-icon.ytcp-navigation-drawer {
    background-position:-26px -968px;
}
[href*="monetization"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
    background-position:-0px -240px;
}
[href*="monetization"] tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected tp-yt-iron-icon.ytcp-navigation-drawer {
    background-position:-26px -204px;
}
[href*="music"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
    background-position:-26px -230px;
}
[href*="music"] tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected tp-yt-iron-icon.ytcp-navigation-drawer {
    background-position:-0px -857px;
}
[href*="editing"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
    background-position: 0 -429px;
}
[href*="editing"] tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected tp-yt-iron-icon.ytcp-navigation-drawer {
    background-position:0px -621px;
}
#bottom-section #contentIcon {
    display:none
}
#bottom-section tp-yt-paper-icon-item.ytcp-navigation-drawer {
    padding:0 10px;
    height:29px;
    background:#333!important;
    border:1px solid #333;
    margin-left:17px;
    width:auto;
    display:inline-block;
    margin-bottom:10px
}
#bottom-section tp-yt-paper-icon-item.ytcp-navigation-drawer:hover {
    background:#3c3c3c!important
}
#bottom-section .nav-item-text.ytcp-navigation-drawer {
    color:#fff;
    text-transform:none;
    line-height:29px
}
/***************************BODY**************************/
/*very annoying fix*/
.header.ytcp-content-section, ytcp-primary-action-bar, ytcp-video-section-content, #stuck-to-left-header.ytcp-video-section-content {
    width:auto!important
}

/*fix end*/
.page > .ytcp-app:not(#channel-dashboard-section) {
    background:#fff
}
#main-container.ytcp-entity-page #main.ytcp-entity-page[studio-theme] {
    background:none;
}
.nav-and-main-content.ytcp-entity-page {
    background:#f1f1f1
}
ytcd-channel-dashboard {
    --card-margin:10px
}
.card.ytcd-card {
    border:0;
    border-radius:0;
}
ytcd-card {
    box-shadow: 0 1px 2px rgb(0 0 0 / 10%);
}
ytcp-entity-page-header.page-header, #page-title-container {
    padding:18px 25px;
    background:#fff;
    height:auto;
    min-height:0
}
#page-title-container {
    border:0
}
ytcp-entity-page-header.page-header .page-title.ytcp-entity-page-header, ytcp-app[enable-page-title] .page-title.ytcp-app {
    padding:0;
    height:30px;
    vertical-align: middle;
    line-height: 30px;
    color: #333;
    font-size: 18px;
    font-weight: 500;
    font-family:"youtube noto",roboto,arial
}
[studio-theme="DEFAULT"] .all-pages.ytcp-app ytcp-activity-section { /*main card*/;
    height: calc(100vh - 100px);
}
[studio-theme="DEFAULT"] .all-pages.ytcp-app {
    margin-top:10px;
    margin-left:10px
}
        /*tab*/
.selection-bar.tp-yt-paper-tabs {
    display:none
}
ytcp-primary-action-bar {
    padding:0 15px;
    max-width:100%
}
ytcp-primary-action-bar tp-yt-paper-tab[style-target=host] {
    border-top: 1px solid #ddd;
    border-right: 1px solid #ddd;
    border-bottom: 1px solid #ddd;
    padding: 10px 15px;
    min-width: 150px;
    max-width: 160px;
    background-color: #fbfbfb;
    color: #666;
    text-decoration: none;
    margin:0;
    height:initial!important;
    min-height:34px!important;
    display:inline-block
}
ytcp-primary-action-bar tp-yt-paper-tab.iron-selected[style-target=host] {
    border-top: 3px solid #cc181e;
    border-bottom: 1px solid #fff;
    background-color: #fff;
    color: #333;
    padding-top:8px
}
ytcp-primary-action-bar tp-yt-paper-tab .tp-yt-paper-tab[style-target=tab-content] {
    display: block;
    margin-right: 20px;
    font:500 13px "YouTube Noto",Roboto,arial,sans-serif;
    line-height: 1.2em;
    min-height:0;
    height:auto;
    color:inherit
}
.tabs-content.tp-yt-paper-tabs {
    border-left:1px solid #ddd
}
tp-yt-paper-tabs {
    height:56px;
    margin-bottom:-1px;
    background:none
}
        /*chip*/
ytcp-chip {
    border-radius:0;
    height:auto;
    min-height:0;
    line-height:1
}
.chip.ytcp-chip-bar {
    height:26px;
    border:1px solid #d3d3d3;
    background:#f8f8f8;
    margin:0 4px!important
}
.chip.ytcp-chip-bar:hover {
    border-color: #c6c6c6;
    background: #f0f0f0;
    box-shadow: 0 1px 0 rgb(0 0 0 / 10%);
}
.chip.ytcp-chip-bar:active {
    border-color: #c6c6c6;
    background: #e9e9e9;
    box-shadow: inset 0 1px 0 #ddd;
}
.chip.ytcp-chip-bar svg {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflKclzgY.webp) -90px -190px;
    margin-top:10px;
    margin-right:-5px;
    font-size: 8px;
    color: transparent;
    opacity: .5;
    margin-left:3px
}
        /*filter dropdown*/
#filter-icon.ytcp-filter-bar {
    margin:0;
    padding:0 12px 0 13px;
    border:1px solid transparent;
    height:26px;
    margin-top:15px;
    margin-left:8px;
    margin-right:8px
}
#filter-icon.ytcp-filter-bar:hover {
    border-color: #c6c6c6;
    background: #f0f0f0;
    box-shadow: 0 1px 0 rgb(0 0 0 / 10%);
} 
#filter-icon.ytcp-filter-bar:active {
    border-color: #c6c6c6;
    background: #e9e9e9;
    box-shadow: inset 0 1px 0 #ddd;
}
#filter-icon.ytcp-filter-bar:before {
    content:"Filter";
    display:inline-block;
    font:500 11px roboto,arial;
    color:#000;
}
#filter-icon.ytcp-filter-bar:after {
    content:"";
    margin-top: -3px;
    margin-left: 5px;
    border: 1px solid transparent;
    border-top-color: #333;
    border-width: 4px 4px 0;
    width: 0;
    height: 0;
    display: inline-block;
    vertical-align: middle;
}
    /*filter bar*/
.chip-and-bar.ytcp-chip-bar {
    align-items:center;
    margin:0;
    padding:15px 0px;
    cursor:default
}
.text-input.ytcp-chip-bar {
    padding: 5px 10px 6px;
    margin:0!important;
    font-size: 13px;
    box-shadow: inset 0 0 1px rgb(0 0 0 / 5%);
    border: 1px solid #d3d3d3;
    color: #333;
    height:auto;
    width:auto;
    min-width:250px;
    line-height:15px;
    flex:initial;
}
    /*pop up dialog*/
tp-yt-paper-dialog.ytcp-text-menu {
    border: 1px solid #ccc;
    border-radius:2px;
    box-shadow:none
}
tp-yt-paper-item.tp-yt-paper-item.ytcp-text-menu {
    display: block;
    margin: 0;
    padding: 0 25px;
    color: #333;
    font-size: 13px;
    text-decoration: none;
    white-space: nowrap;
    word-wrap: normal;
    line-height: 25px;
    cursor: pointer;
    min-height:0;
}
yt-formatted-string.ytcp-text-menu {
    padding:0;
    color:inherit
}
.menu-item-selected {
    font-weight: 500;
}
tp-yt-paper-item:focus, .tp-yt-paper-item.tp-yt-paper-item:focus {
    background:none;
    color:#333
}
tp-yt-paper-item.ytcp-text-menu:hover, tp-yt-paper-item.ytcp-text-menu:hover:focus {
    background-color: #333;
    color: #fff;
}
tp-yt-paper-item.ytcp-text-menu:before {
    content:none!important
}
.menu-icon.ytcp-text-menu {
    display:none
}
.menu-right-icon.second-icon.ytcp-text-menu, tp-yt-paper-item.ytcp-text-menu[has-anchor] a.ytcp-text-menu {
    padding:0;
}
        /*small modals and popups*/
#dialog.ytcp-dialog {
    border: 1px solid #c5c5c5;
    box-shadow: 0 0 15px rgb(0 0 0 / 18%);
    border-radius:0!important
}
.text-container.ytcp-form-textarea {
    border:0;
    border-radius:0
}
#section-label.ytcp-form-textarea, h2.section-label[class] { /*section labels and section titles*/
    margin: 10px 0!important;
    font-size: 11px;
    font-weight: 500;
    color: #333;
    text-transform: uppercase;
    padding:0;
    letter-spacing:0;
    line-height:normal
}
textarea.ytcp-form-textarea, div#outer.ytcp-form-input-container.style-scope, ytcp-video-metadata-editor-basics ytcp-social-suggestion-input.fill-height.ytcp-social-suggestions-textbox, .ytcp-channel-editing-section div#outer.ytcp-form-input-container.style-scope {
    border: 1px solid #d3d3d3;
    color: #333;
    box-shadow: inset 0 0 1px rgb(0 0 0 / 5%);
    padding: 5px 10px 6px;
    margin-top: 0;
    margin-bottom: 0;
    font-size: 13px;
    min-height:0;
    line-height:normal;
    border-radius:0
}
textarea.ytcp-form-textarea:hover, #outer.ytcp-form-input-container:hover, ytcp-video-metadata-editor-basics ytcp-social-suggestion-input.fill-height.ytcp-social-suggestions-textbox:hover, .ytcp-channel-editing-section div#outer.ytcp-form-input-container.style-scope:hover {
    border-color:#b9b9b9
}
textarea.ytcp-form-textarea:focus, .focused #outer.ytcp-form-input-container, ytcp-video-metadata-editor-basics ytcp-form-input-container.focused ytcp-social-suggestion-input.fill-height.ytcp-social-suggestions-textbox, .ytcp-channel-editing-section div#outer.ytcp-form-input-container.style-scope:focus-within {
    border-color: #167ac6!important;
    box-shadow: inset 0 0 1px rgb(0 0 0 / 10%);
}
div#outer.ytcp-form-input-container.style-scope > #label.ytcp-form-input-container {
    margin:0
}
ytcp-form-input-container.ytcp-channel-editing-channel-handle .handle-input-container.ytcp-channel-editing-channel-handle {
    line-height:24px; /*handle fix*/
}
#description-section-label.ytcp-channel-editing-details-tab {
    padding:0
}
#dialog-content-confirm-checkboxes.ytcp-confirmation-dialog { /*video delete*/
    padding:0 15px
}
        /*more*/
.open-menu-button tp-yt-iron-icon, #overflow-menu-button tp-yt-iron-icon, #more-menu-button tp-yt-iron-icon {
    opacity: .8;
    background: url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflNlthLq.webp) -460px -138px no-repeat;
    width: 13px;
    height: 13px;
    color:transparent;
}

.open-menu-button {
    width:13px;
    height:13px;
    color:transparent
}
        /*visibility popup*/
#first-container.ytcp-video-visibility-select, #second-container.ytcp-video-visibility-select {
    border:0;
    padding:0
}
ytcp-video-visibility-select.ytcp-video-visibility-edit-popup {
    padding:15px
}
#dialog.ytcp-video-visibility-edit-popup {
    border: 1px solid #d3d3d3;
    box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
    border-radius:0;
    min-width:0!important;
    margin-left:-15px
}
.container-radios.ytcp-video-visibility-select, #visibility-title.ytcp-video-visibility-select {
    margin:0
}
tp-yt-paper-radio-group.ytcp-video-visibility-select {
    margin-left:16px!important
}
#datepicker-trigger .right-container {
    display:none
}
/*UPLOAD*/
tp-yt-paper-dialog.ytcp-uploads-dialog {
    border: 1px solid #c5c5c5;
    box-shadow: 0 0 15px rgb(0 0 0 / 18%);
    border-radius:0;
    width:1003px;
    overflow-y:scroll
}
html ::-webkit-scrollbar-thumb {
    border-radius:0;
    border:1px solid transparent;
}
html ::-webkit-scrollbar {
    width:14px
}
#textbox.ytcp-social-suggestions-textbox {
    line-height:normal;
    font-size:13px;
    min-height:0;
    height:auto
}
#description-textarea #textbox.ytcp-social-suggestions-textbox {
    height:73px;
}
#description-textarea #child-input.ytcp-form-input-container{
    height:auto
}
.title #child-input.ytcp-form-input-container {
    height:auto;
    line-height:normal
}
.container-bottom.ytcp-social-suggestions-textbox {
    display:none
}
.mfk-infobox-container.ytkc-made-for-kids-select .infobox.ytkc-made-for-kids-select {
    display:none
}
#circle.ytcp-uploads-file-picker-animation {
    width: 118px;
    height: 80px;
    background-image: url(https://s.ytimg.com/yts/img/upload/large-upload-resting-icon-vflM6eC13.png);
    border-radius:0;
}
#circle.ytcp-uploads-file-picker-animation:hover {
    background:url(https://s.ytimg.com/yts/img/upload/large-upload-hover-icon-vflcwlQhZ.png)
}
#arrow-group.ytcp-uploads-file-picker-animation {
    display:none
}
.step.ytcp-stepper:not([disabled]).ytcp-stepper:hover, ytcp-stepper[keyboard-focus] .step.ytcp-stepper:not([disabled]).ytcp-stepper:focus {
    background:transparent
}
.metadata-fade-in-section.ytcp-uploads-dialog {
    opacity:1;
    transition:0ms
}

yt-share-target-renderer yt-icon.yt-share-target-renderer {
    height:40px;
    width:60px
}
#contents.yt-third-party-share-target-section-renderer yt-share-target-renderer.yt-third-party-share-target-section-renderer {
    width:60px
}
.ytcp-video-share-dialog, .ytcp-video-share-dialog #dialog.ytcp-dialog {
    max-width:800px!important;
    width:800px!important;
    
}
.ytcp-video-share-dialog #dialog.ytcp-dialog {
    margin-left:-200px
}
.ytcp-video-share-dialog .content.ytcp-dialog > [slot=content]:not([no-padding]) {
    padding:0!important;
}
.ytcp-video-share-dialog ytcp-video-thumbnail-with-info.ytcp-video-share-dialog {
    width:766px!important
}
.url-container.ytcp-video-share-dialog {
    width:750px!important
}
#scroll-button-forward.yt-third-party-share-target-section-renderer {
    right:0;
    border-radius:0;
    width:20px
}
#scroll-button-back.yt-third-party-share-target-section-renderer {
    right:0;
    border-radius:0;
    width:20px;
    left:0
}
.mfk-infobox-container.ytcp-audience-picker {
    display:none
}
.input-container.ytcp-video-metadata-editor-advanced {
    margin-bottom:4px;
}
.sublabel.ytcp-thumbnails-compact-editor, .section-description.ytcp-video-metadata-editor-basics, .description.ytcp-audience-picker, .section-description.ytcp-video-metadata-editor-advanced {
    height:0;
    font-size:0;
    order:5
}
ytcp-thumbnails-compact-editor:active .sublabel.ytcp-thumbnails-compact-editor {
    height:auto!important;
    font-size:13px!important;
}
#ytcp-uploads-dialog-file-picker.ytcp-uploads-dialog {
    align-self:center;
    justify-self:center
}

[workflow-step="SELECT_FILES"] .header.ytcp-uploads-dialog {
    width:calc(100% - 30px);
    margin:0;
    padding-left:15px;
    padding-right:15px
}
[workflow-step="SELECT_FILES"] .ytcp-uploads-dialog #close-button {
    right:25px
}
[workflow-step="SELECT_FILES"] .title-row.ytcp-uploads-dialog {
    width:100%
}
        /*details and header*/
.progress-label.ytcp-video-upload-progress /*text in bar*/ {
    text-transform:uppercase;
    color:#222
}

#processing-badge.ytcp-video-upload-progress, ytcp-video-upload-progress:not([checks-can-start]) #checks-badge.ytcp-video-upload-progress /*regular "button"*/ {
    
}

[progress-type="UPLOADING"] /*progress*/ {
    
}
ytcp-video-upload-progress-hover[progress-type] {
    max-width:none!important;
    min-width:0!important;
    overflow:visible!important;
    width:622px;
}

ytcp-video-metadata-editor.ytcp-uploads-dialog {
    padding:15px
}
.processing-shimmer.ytcp-still-cell:after {
    content:none
}
#uploading-badge, #processing-badge.ytcp-video-upload-progress {
    margin:0;
    position:absolute;
    width:1000px;
    height:800px;
    transition:all 999999999999999999999999999999999999s;
    left:0;
    top:0;
    opacity:0
}
#uploading-badge:hover, #processing-badge.ytcp-video-upload-progress:hover {
    width:0;
    height:0;
    transition:all .0001s
}
#checks-badge {
    display:none
}
#uploading-tooltip, #processing-tooltip {
    z-index:-1;
    margin-top:-2px
}
tp-yt-paper-progress.ytcp-video-upload-progress-hover,
#uploading-tooltip, #uploading-tooltip > ytcp-paper-tooltip-placeholder, #uploading-tooltip, #uploading-tooltip > ytcp-paper-tooltip-placeholder > #tooltip,
#processing-tooltip, #processing-tooltip > ytcp-paper-tooltip-placeholder, #processing-tooltip, #processing-tooltip > ytcp-paper-tooltip-placeholder > #tooltip {
    display:block!important;
    inset:initial!important;
}
#processing-tooltip > ytcp-paper-tooltip-placeholder, #uploading-tooltip > ytcp-paper-tooltip-placeholder {
    position:absolute!important
}
.content.ytcp-video-upload-progress-hover {
    display:none
}
tp-yt-paper-progress.ytcp-video-upload-progress-hover {
    margin:0;
    height:26px;
    overflow:visible;
}
#uploading-tooltip #tooltip.ytcp-paper-tooltip-placeholder, #processing-tooltip #tooltip.ytcp-paper-tooltip-placeholder {
    border:1px solid #E7E7E7;
    background:#fff;
    padding:0;
    box-shadow:none;
    width:622px;
    max-width:none;
    overflow:visible;
}
#processing-tooltip #tooltip.ytcp-paper-tooltip-placeholder {
    background:none;
    border:none;
    box-shadow:none;
    overflow:visible;
    width:622px;
    padding:0;
    max-width:none
}
.title.ytcp-video-upload-progress-hover {
    display:none
}
#uploading-tooltip #primaryProgress.tp-yt-paper-progress {
    background: linear-gradient(-45deg, #BBE0FC 0px, #BBE0FC 1px, #fff 1px, #fff 5px, #BBE0FC 5px, #BBE0FC 6px, #fff 6px, #fff 10px) repeat;
    background-size: 7px 7px;
    background-position: 28px top;
    box-shadow:none;
    border:1px solid #BBE0FC;
    height:26px;
    position:relative;
    margin:-1px;
    margin-top:0;
    margin-top:-1.2px
}
#processing-tooltip #primaryProgress.tp-yt-paper-progress {
    background:#D2E7FC;
    border:1px solid #D2E7FC;
    height:26px;
    margin:-1px;
    margin-top:0
}
 #processing-tooltip [value="100"] #primaryProgress.tp-yt-paper-progress {
    background:#4883BD;
     border-color:#4883BD
}
.ytcp-uploads-dialog ytcp-video-info {
    --player-width:205px;
    --player-height:140px
}
.ytcp-uploads-dialog ytcp-video-metadata-editor-sidepanel.ytcp-video-metadata-editor {
    width:205px;
    padding:0 15px 0 0;
    order:-1;
    margin-top:-120px;
    position:relative!important;
    top:0!Important;
}
.ytcp-uploads-dialog .input-container.ytcp-video-metadata-editor-sidepanel {
    margin:0;
}
.ytcp-uploads-dialog .container.ytcp-video-info {
    background:none;
    border-radius:0
}
.ytcp-uploads-dialog ytcp-thumbnails-compact-editor-old {
    position:absolute;
    left:15px;
}
.ytcp-uploads-dialog ytcp-video-metadata-editor-advanced {
        grid-template-columns: 345px 345px;
}
.ytcp-uploads-dialog .compact-row.ytcp-video-metadata-editor-basics {
    position:relative;
    left:454px;
    top:0;
    margin-top:-94px
}
.ytcp-uploads-dialog #scrollable-content {
    max-height:none!important
}
.details-header-wrapper.ytcp-uploads-dialog {
    margin:0;
    width:auto;
}
.details-header-wrapper.ytcp-uploads-dialog h1 {
    display:none
}
#scrollable-content.ytcp-uploads-dialog {
    overflow-y:auto;
    height:max-content;
    max-height:none;
    overflow:visible;
}
.dialog-content.ytcp-uploads-dialog {
    height:auto;
    overflow-x:hidden;
    min-height:100%
}
.stepper-animatable.ytcp-uploads-dialog {
    margin:0;
    height:auto;
    margin-top:30px;
    z-index:2
}
.header.ytcp-uploads-dialog {
    position:absolute;
    margin-left:235px;
    width:calc(100% - 235px)
}
.button-area.ytcp-uploads-dialog {
    height:118px;
    margin-left:235px;
    padding-left:0;
    padding-bottom:0;
}
.stepper.ytcp-stepper {
    padding:0;
    justify-content:initial;
    border-bottom:1px solid #e2e2e2;
}
ytcp-stepper:not([vertical]) .step-and-separator.ytcp-stepper {
    min-width:0;
    flex:initial;
    margin:0;
    margin-right:20px;
    justify-content:initial
}
ytcp-stepper:not([vertical]) .step.ytcp-stepper {
    min-width:0;
    padding:0 16px;
    height:32px;
    justify-content:center;
    border-bottom:3px solid transparent
}
ytcp-stepper:not([vertical]) .separator.ytcp-stepper, .step-badge.ytcp-stepper {
    display:none
}
ytcp-stepper:not([vertical]) .step.ytcp-stepper[active], ytcp-stepper:not([vertical]) .step.ytcp-stepper:hover {
    border-bottom:3px solid #cc181e;
    border-radius:0
}
[state="completed"] .step-title.ytcp-stepper:after {
    content:"";
    display:inline-block;
    width:16px;
    height:11px;
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflbQfoQG.webp) -416px -51px;
    margin-left:6px
}
.step-title.ytcp-stepper {
    font:400 13px roboto,arial;
    color:#666
}
.step.ytcp-stepper[active] .step-title.ytcp-stepper {
    font-weight:500;
    color:#333
}
#scrollable-content.ytcp-uploads-dialog {
    order:2
}
.title-row.ytcp-uploads-dialog {
    padding:0;
    border:0;
    width:calc(100% - 15px);
    margin-top:15px;
    z-index:2;
    height:40px
}
.ytcp-uploads-dialog #close-button {
    padding:4px;
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflKclzgY.webp) -90px -186px;
    fill:none;
    width:10px;
    height:10px;
    position:absolute;
    top:59px;
    opacity:.6;
    right:140px
}
.inner-button-area.ytcp-uploads-dialog ytcp-button.ytcp-uploads-dialog+ytcp-button.ytcp-uploads-dialog {
    line-height:12px;
    width:110px
}
.ytcp-uploads-dialog #close-button svg {
    display:none!important
}
.ytcp-uploads-dialog .container.ytcp-badge {
    background:none
}
#reuse-details-button.ytcp-uploads-dialog {
    right:226px;
    margin-top:12px;
    text-transform:none;
    font-size:13px
}
.ytcp-uploads-dialog #back-button {
    display:none
}
[icon="icons:feedback"] {
    width:auto;
    vertical-align:middle;
    line-height:29px;
    box-shadow:none;
    color: var(--ytcp-call-to-action)!important;
}
[icon="icons:feedback"]:hover {
    text-decoration:underline
}
[icon="icons:feedback"]:after {
    content:attr(tooltip-label);
}
[icon="icons:feedback"] tp-yt-iron-icon {
    display:none
}
        /*visibility*/
.left-col.ytcp-uploads-review {
    order:2
}
.right-col.ytcp-uploads-review>*.ytcp-uploads-review {
    margin-left:-25px;
    margin-top:-170px;
    top:0
}
.left-col.ytcp-uploads-review {
    margin-right:0;
    margin-left:10px
}
.top-row.ytcp-uploads-review {
    margin-left:195px
}
/*DASHBOARD*/
[studio-theme="DASHBOARD"] #page-title-container {
    display:none
}
[studio-theme="DASHBOARD"] .ytcd-card ytcp-button {
    color:#167ac6;
    font-size:11px;
    text-align:center;
    text-transform:none;
    font-family:roboto,arial;
    letter-spacing:0;
    line-height:13px;
    padding:15px;
    min-height:0;
    height:auto;
    margin:auto;
    display:block
}
[studio-theme="DASHBOARD"] a.remove-default-style.ytcd-basic-item-large-image:hover, [studio-theme="DASHBOARD"] .analytics-button.ytcd-channel-facts-item:hover, [studio-theme="DASHBOARD"] .link-button-ve-container.ytcd-entity-snapshot-item>a.ytcd-entity-snapshot-item:hover, [studio-theme="DASHBOARD"] .ytcd-card-button-action-item:hover, [studio-theme="DASHBOARD"] .action-link.ytcd-recent-activity-subscribers:hover {
    background:#eee;
}
a.remove-default-style.ytcd-basic-item-large-image, .analytics-button.ytcd-channel-facts-item, .link-button-ve-container.ytcd-entity-snapshot-item>a.ytcd-entity-snapshot-item, .ytcd-card-button-action-item, .action-link.ytcd-recent-activity-subscribers {
    padding:0
}
[studio-theme="DASHBOARD"] .link-button-ve-container.ytcd-entity-snapshot-item>a.ytcd-entity-snapshot-item {
    display:flex;
    width:100%;
}
[studio-theme="DASHBOARD"] .ytcd-card ytcp-button .label {
    padding:0;
    text-align:center;
    justify-content:center
}
[studio-theme="DASHBOARD"] div > .title:not(.ytcd-basic-item-large-image), [studio-theme="DASHBOARD"] .item-title, [studio-theme="DASHBOARD"] .card-title, [studio-theme="DASHBOARD"] .title.ytcd-recent-activity-item {
    padding-top: 12px;
    line-height: 1.3em;
    text-transform: uppercase;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 0;
    margin-top: 0;
    color: #555;
    padding-bottom:0;
    height:25px;
    border-bottom:1px solid transparent
}
[studio-theme="DASHBOARD"] div > .title:not(.ytcd-basic-item-large-image):hover, [studio-theme="DASHBOARD"] .item-title:hover, [studio-theme="DASHBOARD"] .card-title:hover, [studio-theme="DASHBOARD"] .title.ytcd-recent-activity-item:hover {
    background-color: #fbfbfb;
    border-bottom: 1px solid #dcdcdc;
    color:#167ac6
}
[studio-theme="DASHBOARD"] .body.ytcd-basic-item-large-image  .item-title {
    border:0!important;
    background:none!important
}
[studio-theme="DASHBOARD"] .simple-banner.ytcd-list-card, [studio-theme="DASHBOARD"] #link-button-container.ytcd-entity-snapshot-item, ytcd-channel-facts-item {
    padding:0
}
        /*comms*/
ytcd-item.ytcd-list-card:first-child {
    margin:0
}
[studio-theme="DASHBOARD"] #author-thumbnail-container.ytcd-comments-snapshot-item {
    border-radius:0;
    width:28px;
    height:28px
}
[studio-theme="DASHBOARD"] #author-comment-badge.ytcd-comments-snapshot-item {
    border-radius:0;
    margin-left:6px;
    color: #333;
    font-weight: 500;
    font-size: 12px;
    line-height:14px;
    height:auto
}
[studio-theme="DASHBOARD"] #author-comment-badge.ytcd-comments-snapshot-item:hover {
    color:#0e7dcf
}
[studio-theme="DASHBOARD"] #timestamp.ytcd-comments-snapshot-item {
    color: #666;
    font-size: 11px;
    line-height:14px;
    height:auto;
    padding-left:6px
}
[studio-theme="DASHBOARD"] #author-divider {
    display:none
}
[studio-theme="DASHBOARD"] #comment-text-container.ytcd-comments-snapshot-item {
    margin:0 0 0 10px;
    font-size:12px;
    line-height:1.3em
}
[studio-theme="DASHBOARD"] #comment-text-container.ytcd-comments-snapshot-item #content-text.ytcd-comments-snapshot-item{
    color: #333;
    font-size: 12px;
    line-height: 1.3em;
    max-height: 2.6em;
    overflow: hidden;
    margin-bottom: 5px;
}
[studio-theme="DASHBOARD"] #header.ytcd-comments-snapshot-item {
    margin:0
}
[studio-theme="DASHBOARD"] .navigation-buttons.ytcd-carousel-card {
    padding-top:0
}
        /*subscribers*/
.subscriber-avatar.ytcd-recent-activity-subscribers {
    border-radius:0
}
h1 span.ytcd-subscriber-list-dialog {
    display: inline;
    vertical-align: middle;
    line-height: 30px;
    color: #333;
    font-size: 18px;
    font-weight: 500;   
}
.header-content.ytcp-dialog > h1[slot=primary-header].ytcd-subscriber-list-dialog {
    padding:18px 25px;
    margin:0
}
.ytcd-subscriber-list-dialog .container.has-label.ytcp-dropdown-trigger {
    height:auto
}
.ytcd-subscriber-list-dialog .container.has-label.ytcp-dropdown-trigger .left-container {
    height:auto;
    display:flex;
    flex-direction:row-reverse;
    font:500 11px roboto,arial;
    vertical-align:middle;
    line-height:14px
}
.ytcd-subscriber-list-dialog .container.borderless.ytcp-dropdown-trigger .label-text.ytcp-dropdown-trigger {
    margin-top:0px;
    line-height:28px;
    margin-left:6px
}
.ytcd-subscriber-list-dialog .container.borderless.ytcp-dropdown-trigger .label-text.ytcp-dropdown-trigger:before {
    content:"("
}
.ytcd-subscriber-list-dialog .container.borderless.ytcp-dropdown-trigger .label-text.ytcp-dropdown-trigger:after {
    content:")"
}
#header.ytcp-subscribers-table {
    line-height:27px;
    min-height:27px;
    border-color:#f1f1f1;
    background:none
}
#header.ytcp-subscribers-table .cell-header.sortable.ytcp-table-header {
    margin-left:0
}
#date-select.ytcd-subscriber-list-dialog .right-container {
    display:none
}
#date-select.ytcd-subscriber-list-dialog {
    min-width:72px
}
.divider.ytcp-subscribers-table {
    border-color:#f1f1f1
}
.header-name.ytcp-table-header span.ytcp-table-header {
    font-size:11px;
    font-weight:500
}
.cell-header.sortable.ytcp-table-header:hover, .cell-header.column-sorted.ytcp-table-header {
    font-weight:500;
}
.subscriber-info-name.ytcp-subscribers-table-row {
    font:500 13px roboto,arial
}
.subscriber-info-avatar.ytcp-subscribers-table-row, .subscriber-info-avatar.ytcp-subscribers-table-row yt-img-shadow {
    border-radius:0;
    width:60px;
    height:60px;
    padding-right:10px
}
.subscriber-info.ytcp-subscribers-table-row {
    max-height:60px
}
.ytcp-subscribe-button {
    border-radius: 2px;
    box-shadow: 0 1px 0 rgb(0 0 0 / 5%);
    border: 1px solid #ccc;
    background-color: #f8f8f8;
    color: #666;
    padding: 0 8px;
    height: 20px;
    font:500 11px roboto,arial;
    text-transform:none
}
.ytcp-subscribe-button .label {
    padding:0;
    line-height:20px;
    margin:0
}
/*VIDEO MANAGER*/
[name="channel.videos"] #header.ytcp-video-section-content {
    top:56px;
    z-index:333
}
[name="channel.videos"] ytcp-primary-action-bar {
    min-height:56px;
}
.description.ytcp-video-list-cell-video {
    display:none
}
.video-title-wrapper.ytcp-video-list-cell-video, .video-under-title-wrapper.ytcp-video-list-cell-video, #video-info-edit.ytcp-video-list-cell-video {
    margin:0!important
}
ytcp-video-list-cell-video[show-hover-items] .open-menu-button.ytcp-video-list-cell-video, ytcp-video-list-cell-video[show-hover-items] #hover-items.ytcp-video-list-cell-video, ytcp-video-list-cell-video[show-hover-items][is-highlighted] .video-under-title-wrapper.ytcp-video-list-cell-video, ytcp-video-list-cell-video[show-hover-items][is-highlighted] #hover-items.ytcp-video-list-cell-video {
    display:flex;
    align-items:center;
    max-height:20px;
    align-self:initial;
    margin-top:16px;
    visibility:visible
}
ytcp-video-list-cell-video[show-hover-items] .hover-item.ytcp-video-list-cell-video {
    margin:0
}
 ytcp-video-list-cell-video[class] .hover-item.ytcp-video-list-cell-video > ytcp-icon-button, #video-details[track-click].hover-item, .hover-item.ytcp-video-list-cell-video[icon="more-vert"], #watch-on-yt[track-click].hover-item {
     border-radius:0!important;
     margin-right:-1px;
     width:auto;
     line-height:18px;
     height:18px;
}
.hover-item.ytcp-video-list-cell-video[icon="more-vert"] {
    padding:0 7px
}
.hover-item.ytcp-video-list-cell-video[icon="more-vert"] tp-yt-iron-icon {
    fill:none;
    background:none!Important;
    width: 0;
    height: 0;
    border: 1px solid transparent;
    border-width: 4px 4px 0;
    border-top-color: #666;
}
ytcp-video-list-cell-video[show-hover-items] .hover-item.ytcp-video-list-cell-video:first-of-type > ytcp-icon-button {
     border-radius:2px 0 0 2px!important;
}
ytcp-video-list-cell-video[show-hover-items] .hover-item.ytcp-video-list-cell-video > ytcp-icon-button:before, #watch-on-yt[track-click].hover-item:before, #video-details[track-click].hover-item:before {
    content:attr(aria-label)
}
ytcp-video-list-cell-video[show-hover-items] .hover-item.ytcp-video-list-cell-video > ytcp-icon-button tp-yt-iron-icon, #watch-on-yt[track-click].hover-item tp-yt-iron-icon, #video-details[track-click].hover-item tp-yt-iron-icon {
    display:none
}
ytcp-video-row .floating-column.ytcp-video-row {
    padding:0!important
}
.tablecell-video {
    left:56px!important
}
.tablecell-selection {
    max-width:16px!important;
    flex:initial!important;
    min-width:0!important;
    margin-left:15px;
    align-items:center   
}
.cell-header.tablecell-selection.ytcp-table-header {
    padding:0!important;
    height:16px
}
#video-thumbnail.ytcp-video-list-cell-video {
    padding-right:15px
}
.video-title-wrapper.ytcp-video-list-cell-video {
    margin:0;
    padding:0
}
.video-title-wrapper.ytcp-video-list-cell-video #video-title.ytcp-video-list-cell-video {
    margin:0;
    padding:0;
    color: #333;
    font-size: 13px;
    font-weight: 500;
    line-height: 17px;
    margin-right: 4px;
    vertical-align: middle;
    white-space: normal;
}
.video-title-wrapper.ytcp-video-list-cell-video:hover #video-title.ytcp-video-list-cell-video {
    color:#167ac6;
    text-decoration:underline
}
.tablecell-date.cell-body.ytcp-video-row { /*date*/
    position:absolute;
    left:179px;
    z-index:2;
    padding:0;
    line-height:15px;
    color:#767676;
    font-size:12px;
    flex-direction:row;
    margin-top:26px
}
.tablecell-date.cell-body.ytcp-video-row .cell-description.ytcp-video-row {
    order:-1;
    margin:0;
    line-height:15px;
    color:#767676;
    font-size:12px;
    margin-right:4px
}
.tablecell-comments.cell-body.ytcp-video-row { /*comms*/
    position:absolute;
    right:100px;
    color:#666!important;
    min-width:0px!important;
    padding:0!important;
    flex:initial!important;
    flex-direction:row;
    margin-top:8px
}
.tablecell-comments.cell-body.ytcp-video-row a.row-highlighted.ytcp-video-row {
    color:#666
}
.tablecell-comments.cell-body.ytcp-video-row a.ytcp-video-row {
    padding:0;
    font:400 12px roboto;
    line-height:18px
}
.tablecell-comments.cell-body.ytcp-video-row:before {
    content:"";
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-videomanager-vfl2kHqv0.webp) 0 -670px;
    background-size: auto;
    width: 18px;
    height: 18px;
    display:inline-block;
    min-width:18px;
    margin-right:20px;
    opacity:.6
}
.likes-container.ytcp-video-row .progress.ytcp-video-row, .likes-container.ytcp-video-row .progress-fill.ytcp-video-row { /*like*/
    height:2px;
    border-radius:0;
    background:#ccc
}
.likes-container.ytcp-video-row .progress-fill.ytcp-video-row {
    background:#167ac6
}
.likes-container.ytcp-video-row .primary-label.ytcp-video-row, .likes-container.ytcp-video-row .percent-label.ytcp-video-row {
    font:400 11px roboto;
    line-height:12px;
    color:#999;
    padding:0;
    display:inline-block;
    padding-top:3px;
}
.likes-container.ytcp-video-row .likes-label.ytcp-video-row {
    padding-bottom:0;
    display:inline-block;
    font:400 12px roboto;
    line-height:17px;
    margin-right:6px;
    margin-left:42px;
    text-overflow:clip;
    word-spacing:60px
}
.likes-container.ytcp-video-row {
    flex-direction:row-reverse;
    align-items:center;
    position:relative;
    max-width:130px;
    justify-content:flex-end;
}
.likes-container.ytcp-video-row .progress.ytcp-video-row {
    position:absolute;
    bottom:0;
    left:4px
}
.likes-container.ytcp-video-row:after {
    content:"";
    display:inline-block;
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-videomanager-vfl2kHqv0.webp) 0 -542px;
    background-size: auto;
    width: 18px;
    height: 18px;
    opacity: .6;
    position:absolute;
    right:108px;
    bottom:34px
}
.likes-container.ytcp-video-row:before {
    content:"";
    display:inline-block;
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-videomanager-vfl2kHqv0.webp) -28px -1088px;
    background-size: auto;
    width: 18px;
    height: 18px;
    opacity: .6;
    position:absolute;
    right:108px;
    bottom:10px
}
.cell-body.ytcp-video-row:last-of-type {
    padding-right:18px!important;
    flex: 1 0 70px!important;
    min-width:0!important;
    max-width:192px
}
ytcp-paper-tooltip-placeholder[type=custom-content] #tooltip.ytcp-paper-tooltip-placeholder {/*like tooltip*/
    border:0;
    border-radius:0;
    box-shadow:none;
    padding:0;
    background:none
}
ytcp-video-list-cell-likes-tooltip-body {
    height:auto
}
ytcp-video-list-cell-likes-tooltip-body > * {
    display:none
}
.label.ytcp-video-list-cell-likes-tooltip-body:last-of-type { /*dislike*/
    display:inline-block;
    position:absolute;
    right:61px;
    font:400 12px roboto;
    color:#666;
    top:45px
}
.likes-container.ytcp-video-row .percent-label.ytcp-video-row:last-child {
    margin-left:42px;
    font-size:0;
    margin-top:-1px
}
.likes-container.ytcp-video-row .percent-label.ytcp-video-row:last-child:after {
    content:"0";
    font-size:12px;
    line-height:normal;
    color:#666;
    cursor:text;
}
.tablecell-views.cell-body.ytcp-video-row { /*views*/
    align-items:center;
    padding-top:0;
    min-width:0!important;
    font-weight:500
}
.tablecell-views.cell-body.ytcp-video-row:after {
    content:" views";
    margin-left:4px
}
.icon-text-edit-triangle-wrap.ytcp-video-row .icon-grey.ytcp-video-row[icon="yt-sys-icons:visibility_off"] {
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-videomanager-vflpg9nMX.webp) 0 -1141px;
    background-size: auto;
    width: 18px;
    height: 18px;
    fill:none;
    margin:0;
    padding:0
}
.icon-text-edit-triangle-wrap.ytcp-video-row .icon-grey.ytcp-video-row[icon="yt-sys-icons:visibility"], .icon-text-edit-triangle-wrap.ytcp-video-row .icon-grey.ytcp-video-row {
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-videomanager-vflpg9nMX.webp) -33px -441px;
    background-size: auto;
    width: 18px;
    height: 18px;
    fill:none;
    margin:0;
    padding:0
}
.icon-text-edit-triangle-wrap.ytcp-video-row .icon-green.ytcp-video-row {
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-videomanager-vflpg9nMX.webp)-10px -631px;
    background-size: auto;
    width: 18px;
    height: 18px;
    fill:none;
    margin:0;
    padding:0
}
.icon-text-edit-triangle-wrap.ytcp-video-row .icon-yellow.ytcp-video-row {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-videomanager-vflsrtxCf.webp) 0 -28px;
    width: 18px;
    height: 18px;
    fill:none;
    margin:0;
    padding:0
}
.icon-text-edit-triangle-wrap.ytcp-video-row .label-span.ytcp-video-row {
    display:none
}
.last-floating-column.ytcp-video-row+.cell-body.ytcp-video-row {
    min-width:52px!important;
    flex:initial!important;
    position:absolute;
    right:192px;
    margin-top:-4px;
    z-index:2;
    padding-left:0!important
}
.restrictions-list.ytcp-video-row>div.ytcp-video-row {
    font-size:12px;
    color:#666
}
ytcp-video-row[horizontal-scroll] .last-floating-column.ytcp-video-row:after {
    content:none
}
.cell-body.ytcp-video-row:nth-of-type(4) {
    position:absolute;
    right:260px;
    z-index:2;
    text-align:right;
    min-width:0!important;
    flex:initial!important;
    padding:0!important;
    line-height:1
}
.restrictions-list.ytcp-video-row {
    padding-top:8px
}
/*silly select*/
ytcp-text-dropdown-trigger[dark] .dropdown-trigger-text.ytcp-text-dropdown-trigger {
    font:inherit;
    color:inherit;
    line-height:26px
}
ytcp-text-dropdown-trigger[dark] .dropdown-trigger-text.ytcp-text-dropdown-trigger:after {
    content:"";
        width: 0;
    height: 0;
    border: 1px solid transparent;
    border-width: 4px 4px 0;
    border-top-color: #555;
    display:inline-block;
    position:relative;
}
ytcp-text-dropdown-trigger[dark] .right-container {
    display:none
}
ytcp-select.top-dropdown.ytcp-bulk-actions, ytcp-bulk-add-playlists.ytcp-video-bulk-actions, ytcp-select.ytcp-video-bulk-actions, ytcms-csv-export-menu.ytcp-video-bulk-actions {
    margin:0;
    margin-right:8px
}
.toolbar-wrapper.ytcp-bulk-actions {
    display:flex!important
}
.label.ytcp-bulk-actions {
    display:none
}
.toolbar.ytcp-bulk-actions {
    margin:0
}
#header.opened.ytcp-bulk-actions, #header.ytcp-bulk-actions {
    background:none;
    border:0;
    height:30px!important;
    min-height:0;
    position:absolute;
    left:38px;
    margin-top:9px
}
#header.ytcp-bulk-actions {
    opacity:.5
}
#header.ytcp-bulk-actions.opened {
    opacity:1
}
.divider.ytcp-bulk-actions {
    display:none
}
.cell-header.sortable.ytcp-table-header:hover, .cell-header.sortable.ytcp-table-header {
    margin-left:300px
}
.close-button.ytcp-bulk-actions, .selection-label.ytcp-bulk-actions {
    display:none
}
.ytcp-video-section-content [role="columnheader"]:not(.sortable), .tablecell-comments[role="columnheader"], .tablecell-visibility[role="columnheader"] {
    display:none
}
.cell-header.tablecell-selection.ytcp-table-header {
    display:flex
}
/*PLAYLIST*/
ytcp-playlist-section-content {
    border:0
}
ytcp-playlist-section.ytcp-app {
    margin:0
}
#new-playlist-button .ytcp-button {
    padding:7px 0
}
#new-playlist-button .label.ytcp-button:before {
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfliTgLqv.webp) -130px -862px;
    background-size: auto;
    width: 16px;
    height: 16px;
    content:"";
    margin-right: 6px;
    opacity:.5;
    display:inline-block;
    vertical-align:middle;
    margin-top:-2px
}
#hover-items.ytcp-playlist-row a.ytcp-playlist-row ytcp-icon-button:before {
    content:attr(aria-label)
}
#hover-items.ytcp-playlist-row a.ytcp-playlist-row ytcp-icon-button {
    width:auto
}
#hover-items.ytcp-playlist-row {
    display:inline-block!important;
    position:absolute;
    right:24px;
    top:28px
}
#hover-items.ytcp-playlist-row tp-yt-iron-icon {
    display:none
}
#hover-items.ytcp-playlist-row a.ytcp-playlist-row ytcp-icon-button {
    line-height:27px;
    max-height:26px
}
.playlist-right-section.ytcp-playlist-row > .ytcp-playlist-row {
    display:block!important
}
.playlist-icon.ytcp-playlist-thumbnail {
    display:none
}
.playlist-size.ytcp-playlist-thumbnail:after {
    content:" videos"
}
.playlist-size.ytcp-playlist-thumbnail {
    font-size:13px;
    letter-spacing:0;
    font-weight:400;
    color: #fff;
    text-align: center;
    border-radius: 3px;
    width:auto;
    padding:0;
    display:block;
    line-height:1
}
.playlist-thumbnail-half-scrim.ytcp-playlist-thumbnail {
    background: rgba(0,0,0,0.7);
    color: #fff;
    text-align: center;
    border-radius: 3px;
    right: 5px;
    top: 6px;
    padding: 3px 7px;
    width:auto;
    height:min-content
}
ytcp-table-header.ytcp-playlist-section-content {
    display:none
}
#row-container.ytcp-playlist-row > div:nth-child(2) { /*visibility*/
    position:absolute;
    left:177px;
    margin-top:24px;
    flex:initial!important;
    min-width:0!important;
    padding:0!important
}
.description.ytcp-playlist-row {
    padding-left:20px;
    margin-right:300px
}
.visibility-cell.ytcp-playlist-row, .visibility-cell.ytcp-playlist-row tp-yt-iron-icon.ytcp-playlist-row {
    padding:0;
    margin:0
}
.visibility-cell.ytcp-playlist-row span {
    display:none
}
#row-container.ytcp-playlist-row > div:nth-child(3) { /*date*/
    position:absolute;
    left:166px;
    margin-top:58px
}
#row-container.ytcp-playlist-row > div:nth-child(4) {
    display:none
}
.playlist-title.ytcp-playlist-row {
    margin-top:7px;
    color:#167ac6;
    font-weight:500
}
.last-time-updated-cell.ytcp-playlist-row {
    color:#999;
    font-size:12px;
    padding:0
}
.last-time-updated-cell.ytcp-playlist-row:before {
    content:"Updated ";
    cursor:text
}
.icon-grey.visibility-off-icon.ytcp-playlist-row {
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-videomanager-vflpg9nMX.webp) -33px -441px;
    background-size: auto;
    width: 18px;
    height: 18px;
    fill:none
}
.icon-green.visibility-icon.ytcp-playlist-row {
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-videomanager-vflpg9nMX.webp) -10px -631px;
    background-size: auto;
    width: 18px;
    height: 18px;
    fill:none
}
#row-container.row-highlighted.ytcp-playlist-row {
    background:none
}
ytcp-playlist-row {
    border:0
}
        /*create playlist*/
#create-playlist-form textarea.ytcp-form-textarea {
    max-height:15px;
    white-space:nowrap;
}
#create-playlist-form textarea.ytcp-form-textarea::-webkit-scrollbar {
    display:none!important
}
.char-counter.ytcp-form-textarea {
    padding-top:3px;
    padding-bottom:0
}
#create-playlist-buttons.ytcp-playlist-creation-dialog-old {
    background-color: #f6f6f6;
    padding:15px;
    min-height:32px
}
#create-playlist-buttons.ytcp-playlist-creation-dialog-old > ytcp-button {
    margin-left:13px
}
#create-playlist-buttons.ytcp-playlist-creation-dialog-old > ytcp-button .label {
    padding-top:7px
}
#create-playlist-form.ytcp-playlist-creation-dialog-old {
    padding:15px;
    min-height:0
}
.content.ytcp-dialog > [slot=content]:not([no-padding]) {
    padding:0
}
.input-container.title.ytcp-playlist-creation-dialog-old, .input-container.visibility.ytcp-playlist-creation-dialog-old {
    margin:0
}
.ytcp-playlist-creation-dialog-old.ytcp-playlist-creation-dialog-old > #dialog { /*ugly dialog*/
    background: #fff;
    border: 1px solid #d3d3d3;
    box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
    margin-top:27px
}
.ytcp-playlist-creation-dialog-old.ytcp-playlist-creation-dialog-old tp-yt-paper-item.tp-yt-paper-item.ytcp-text-menu {
    padding:0 15px
}
.ytcp-playlist-creation-dialog-old.ytcp-playlist-creation-dialog-old tp-yt-paper-item.tp-yt-paper-item.ytcp-text-menu:hover {
    color:#333;
    background:#eee
}
.ytcp-playlist-creation-dialog-old.ytcp-playlist-creation-dialog-old tp-yt-paper-item.tp-yt-paper-item.ytcp-text-menu yt-formatted-string:before {
    content:"";
    display: inline-block;
    vertical-align: middle;
    margin-right: 6px;
    padding-bottom: 1px;
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfliTgLqv.webp) 0 -918px;
    width: 16px;
    height: 16px;
    opacity:.5
}
.ytcp-playlist-creation-dialog-old.ytcp-playlist-creation-dialog-old tp-yt-paper-item.tp-yt-paper-item.ytcp-text-menu:hover yt-formatted-string:before {
    opacity:.6
}
.ytcp-playlist-creation-dialog-old.ytcp-playlist-creation-dialog-old tp-yt-paper-item.tp-yt-paper-item.ytcp-text-menu:active yt-formatted-string:before {
    opacity:1
}
.ytcp-playlist-creation-dialog-old.ytcp-playlist-creation-dialog-old tp-yt-paper-item.tp-yt-paper-item.ytcp-text-menu[aria-selected="true"] yt-formatted-string:before {
    opacity:1
}
.ytcp-playlist-creation-dialog-old.ytcp-playlist-creation-dialog-old tp-yt-paper-item.tp-yt-paper-item.ytcp-text-menu#text-item-2 yt-formatted-string:before {
    background-position:-76px -474px;
}
.ytcp-playlist-creation-dialog-old.ytcp-playlist-creation-dialog-old tp-yt-paper-item.tp-yt-paper-item.ytcp-text-menu#text-item-1 yt-formatted-string:before {
    background-position:-211px -122px;
}
.input-container.visibility .container.ytcp-dropdown-trigger { /*visibility*/
    border-color:transparent;
    border-radius:2px;
    padding:0 10px;
    height:28px;
    align-items:center;
    flex:initial
}
.input-container.visibility .container.ytcp-dropdown-trigger:hover {
    border-color: #c6c6c6;
    background: #f0f0f0;
    box-shadow: 0 1px 0 rgb(0 0 0 / 10%);
}
.input-container.visibility .container.ytcp-dropdown-trigger:active, .input-container.visibility .container.ytcp-dropdown-trigger:focus {
    border-color: #c6c6c6;
    background: #e9e9e9;
    box-shadow: inset 0 1px 0 #ddd;
}
.input-container.visibility .container.ytcp-dropdown-trigger:before {
    content: '';
    display: inline-block;
    vertical-align: middle;
    margin-right: 6px;
    background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfliTgLqv.webp) 0 -918px;
    background-size: auto;
    width: 16px;
    height: 16px;
}
.input-container.visibility .container.ytcp-dropdown-trigger:after {
    content:"";
    display: inline-block;
    vertical-align: middle;
        margin-top: -3px;
    margin-left: 5px;
    border: 1px solid transparent;
    border-top-color: #333;
    border-width: 4px 4px 0;
    width: 0;
    height: 0;
}
.left-container.ytcp-dropdown-trigger {
    flex:initial
}
ytcp-text-dropdown-trigger.ytcp-playlist-creation-dialog-old.ytcp-playlist-creation-dialog-old {
    position:absolute;
    bottom:20px;
    background:none
}
.input-container.visibility .container.ytcp-dropdown-trigger .label-area.ytcp-dropdown-trigger, .input-container.visibility .container.ytcp-dropdown-trigger .right-container {
    display:none
}
.input-container.visibility .dropdown-trigger-text.ytcp-text-dropdown-trigger {
    font-size:11px;
    font-family:roboto,arial;
    font-weight:500;
    line-height:normal
}
/*comments*/
    /*chips*/
#comments-content #chip-text {
    font:400 13px "YouTube Noto",Roboto,arial,sans-serif;
    line-height: 1.2em;
    min-height:0;
    height:auto;
    color:#333;
    margin-right:0px;
}
.chip.ytcp-comments-section {
    background:none!important;
    border:0!important;
    height:auto;
    width:auto;
    min-width:0;
    padding:0;
    margin:0;
    border-radius:0
}
.chip.ytcp-comments-section:hover #chip-text {
    text-decoration:underline
}
.chip.ytcp-comments-section[selected] #chip-text {
    font-weight:500!important
}
.chips-container.ytcp-comments-section {
    width:auto;
    border:0;
    position:absolute;
    z-index:42;
    top:-20px;
    padding-left:19px
}
#sticky-header.ytcp-comments-section {
    z-index:3
}
        /*main*/
#contents.ytcp-comments-section {
    background:#fff;
    box-shadow: 0 1px 2px rgb(0 0 0 / 10%);
}
.metadata-divider.ytcp-comment {
    display:none
}
#author-thumbnail.ytcp-comment yt-img-shadow.ytcp-comment {
    border-radius:0;
    margin-top:0;
    margin-right:10px;
    height:48px;
    width:48px;
}
#author-thumbnail.ytcp-comment yt-img-shadow.ytcp-comment img.yt-img-shadow {
    width:48px;
    height:48px
}
.ytcp-comment-replies img.yt-img-shadow{
    max-width:32px;
    max-height:32px
}
#comment.ytcp-comment-thread {
    padding:0;
    padding-bottom:0px!important;
    min-height:61px
}
ytcp-comment-thread {
    border:0;
    padding-bottom:26px
}
ytcp-comment {
    background:none!Important
}
tp-yt-iron-list.ytcp-comments-section {
    padding:25px 15px
}
#metadata.ytcp-comment {
    font:400 11px 'roboto',arial;
    line-height:17px;
    display:inline;
    vertical-align:top;
    margin:0;
    color:#767676
}
#content-text.ytcp-comment {
    font:400 12px 'roboto', arial;
    color:#000;
    line-height:17px
}
#name.ytcp-comment, #reply-endpoint.ytcp-comment {
    color:#167ac6;
    font:500 12px 'roboto',arial;
}
.published-time-text.ytcp-comment {
    vertical-align:top;
    margin-left:5px
}
.comments .comment-text .comment-text-content {
    font:400 13px 'roboto'
}
body ytcp-comment-button[is-paper-button] yt-formatted-string.ytcp-comment-button {
    color: #555;
    cursor: pointer;
    font-size: 11px;
    font-weight: 500;
    line-height:1.1;
    opacity: .75;
    vertical-align: sub;
    text-transform:none;
}
body ytcp-comment-button[is-paper-button]:hover yt-formatted-string.ytcp-comment-button {
    opacity:1;
    color:#555
}
#reply-button.ytcp-comment-action-buttons, tp-yt-paper-button.ytcp-comment-button {
    min-width:0;
    min-height:0;
    height:auto;
}
#reply-button.ytcp-comment-action-buttons {
    margin:0
}
#reply-button.ytcp-comment-action-buttons yt-formatted-string:after {
    content:"·";
    display:inline-block;
    margin:0 8px;
    color:#000;
    opacity:1
}
ytcp-comment-button #button.ytcp-comment-button {
    padding:5px 0 0 0
}
#comment-actions.ytcp-comment, #moderations.ytcp-comment {
    margin:0
}
#comment-actions ytcp-icon-button[compact] {
    position:absolute;
    right:120px;
    top:0px;
    border:1px solid transparent;
    padding: 6px 12px 4px;
    width:auto;
    height:auto
}
#comment-actions ytcp-icon-button[compact] tp-yt-iron-icon {
    display: inline-block;
    background:transparent no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -74px -74px;
    background-size: auto;
    width: 14px;
    height: 14px;
    fill:none;
    opacity:0.5
}
#comment-actions ytcp-icon-button[compact]:after {
    content:"▼";
    display: inline-block;
    margin: 2px -3px 0 5px;
    vertical-align: top;
    font-size: 9px;
    
}
ytcp-comment-thread:hover #comment-actions ytcp-icon-button[compact] {
    border-color:#eee
}
ytcp-comment-thread #comment-actions ytcp-icon-button[compact]:hover {
    background-color:#f0f0f0
}
#show-replies-button.ytcp-comment-action-buttons[disabled] {
    display:none
}
#dislike-button.ytcp-comment-action-buttons, #like-button.ytcp-comment-action-buttons, #creator-heart.ytcp-comment-action-buttons {
    width:14px;
    height:17px;
    margin-right:12px;
    order:2
}
#creator-heart.ytcp-comment-action-buttons {
    width:16px;
    height:19px
}
a.yt-simple-endpoint.ytcp-comment-toggle-button, ytcp-comment-toggle-button #button.ytcp-comment-toggle-button, ytcp-comment-toggle-button #button.ytcp-comment-toggle-button yt-icon,#creator-heart-button.ytcp-comment-creator-heart,#creator-heart-button .ytcp-comment-creator-heart {
    height:inherit;
    width:inherit;
    padding:0;
    margin:0;
}
#vote-count.ytcp-comment-action-buttons[hidden]~#dislike-button.ytcp-comment-action-buttons,#vote-count.ytcp-comment-action-buttons~#dislike-button.ytcp-comment-action-buttons {
    margin-left:0
}
yt-interaction#interaction {
    display:none!important
}
.ytcp-comment-action-buttons~.ytcp-comment-action-buttons yt-icon {
    opacity:.2
}
ytcp-comment:hover .ytcp-comment-action-buttons~.ytcp-comment-action-buttons yt-icon, ytcp-comment:hover #creator-heart-button yt-icon#unhearted {
    opacity:.4
}
ytcp-comment .ytcp-comment-action-buttons~.ytcp-comment-action-buttons .ytcp-comment-toggle-button:hover yt-icon,ytcp-comment #creator-heart-button:hover yt-icon#unhearted {
    opacity:.6
}
.ytcp-comment-action-buttons~#like-button.ytcp-comment-action-buttons yt-icon {
    display: inline-block;
    vertical-align: top;
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -206px 0;
    background-size: auto;
    width: 14px;
    height: 14px;
    fill:none
}
.ytcp-comment-action-buttons~#like-button.ytcp-comment-action-buttons.style-default-active yt-icon {
    background-position:-12px -74px;;
    opacity:1
}
.ytcp-comment-action-buttons~#dislike-button.ytcp-comment-action-buttons yt-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -12px 0;
    width: 14px;
    height: 14px;
    fill:none
}
.ytcp-comment-action-buttons~#dislike-button.ytcp-comment-action-buttons.style-default-active yt-icon {
    background-position:-30px 0;
    opacity:1
}
yt-icon#unhearted {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -112px -90px;
    fill:none;
    width: 16px;
    height: 16px;
    display: inline-block;
    opacity:.2
}
#creator-heart-button yt-icon#hearted {
    opacity:1!important;
    fill:none;
    background:#f00;
    transform: rotate(-45deg);
    width: 6px;
    height: 10px;
    border-radius: 6px 6px 0 0;
}
#creator-heart-button yt-icon#hearted:after {
    content:"";
    background:#f00;
    width:6px;
    height:10px;
    border-radius:6px 6px 0 0;
    display:inline-block;
    transform:rotate(90deg);
    position:absolute;
    right:-2px;
    bottom:-3px
}
yt-icon#hearted svg,#hearted-border {
    display:none!important
}
#hearted-thumbnail.ytcp-comment-creator-heart {
    border-radius:0;
    border:0
}
#vote-count.ytcp-comment-action-buttons {
    margin-right: 10px;
    color: #128ee9;
    order:0;
    margin-bottom:-2px;
}
#show-replies-button.ytcp-comment-action-buttons tp-yt-paper-button[style-target=host] {
    height:auto;
    width:auto;
    min-width:0
}
#show-replies-button.ytcp-comment-action-buttons tp-yt-paper-button[style-target=host] yt-formatted-string {
    font:400 12px 'roboto',arial;
    color:#128ee9;
    line-height:15px
}
#show-replies-button.ytcp-comment-action-buttons tp-yt-paper-button[style-target=host] yt-icon {
    display:none
}
#show-replies-button.ytcp-comment-action-buttons {
    margin-right:8px;
    margin-top:3px
}
ytcp-comment[is-reply] #author-thumbnail.ytcp-comment yt-img-shadow.ytcp-comment {
    margin-left:60px
}
ytcp-comment.ytcp-comment-replies {
    padding:15px 0 12px 0
}
ytcp-comment.ytcp-comment-replies:last-of-type {
    padding-bottom:5px;
}
ytcp-author-comment-badge.creator {
    background:#dbe4eb;
    border-radius:0;
    padding:0;
    margin:0;
    height:auto;
}
#badge-name.ytcp-author-comment-badge {
    height:auto;
    line-height:15px;
    color:#167ac6!important;
    font-weight:500
}
#content.ytcp-comment,#author-thumbnail {
    height:max-content
}
#body.ytcp-comment {
    height:max-content;

}
#video-thumbnail.ytcp-comment-video-thumbnail {
    width:96px;
    height:54px;
    margin:0
}
#video-thumbnail.ytcp-comment-video-thumbnail img {
    height:54px;
}
#body.ytcp-comment-video-thumbnail {
    flex-direction:column;
    position:absolute
}
#video-title.ytcp-comment-video-thumbnail {
    display: block;
    margin-left: auto;
    margin-right: auto;
    max-width: 100px;
    color: #888;
    text-align: center;
    overflow: hidden;
    white-space: nowrap;
    word-wrap: normal;
    -o-text-overflow: ellipsis;
    text-overflow: ellipsis;
}
#video-title.ytcp-comment-video-thumbnail yt-formatted-string[split-lines] {
    white-space:nowrap;
    height:21px
}
#view-comment-button.ytcp-comment-video-thumbnail {
    display:none
}
ytcp-comment-action-menu #action-menu-dialog {
    box-shadow:none;
    padding:8px 0;
    border: 1px solid #ccc;
    border-radius:2px;
    margin-top:19px;
}
tp-yt-paper-item.ytcp-menu-service-item-renderer, tp-yt-paper-item.ytcp-toggle-menu-service-item-renderer {
    min-height:0;
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
yt-formatted-string.ytcp-menu-service-item-renderer, tp-yt-paper-item.ytcp-toggle-menu-service-item-renderer span{
    font-size:13px
}
yt-formatted-string.ytcp-menu-service-item-renderer:before,tp-yt-paper-item.ytcp-toggle-menu-service-item-renderer:before {
    content:none
}
tp-yt-paper-item.ytcp-menu-service-item-renderer:hover,tp-yt-paper-item.ytcp-toggle-menu-service-item-renderer:hover {
    background:#444;
    color:#fff;
}
tp-yt-paper-item.ytcp-menu-service-item-renderer:hover yt-icon,tp-yt-paper-item.ytcp-toggle-menu-service-item-renderer:hover yt-icon {
    fill:#fff
}
yt-icon.ytcp-menu-service-item-renderer, yt-icon.ytcp-toggle-menu-service-item-renderer {
    margin-right:8px;
    height:16px;
    width:16px;
    margin-top:0px;
    margin-bottom:3px
}
ytcp-sticky-header {
    max-width:none
}
/*suggest*/
#label.ytcp-suggestions {
    font:inherit
}
/*comment end*/



/*customization*/
iron-pages > :not(slot):not(.iron-selected).ytcp-channel-editing-section {
    display:block!important
}
iron-pages > .ytcp-channel-editing-section.iron-selected ~ :not(slot):not(.iron-selected).ytcp-channel-editing-section ~ :not(slot):not(.iron-selected).ytcp-channel-editing-section section > *,
iron-pages > .ytcp-channel-editing-section.iron-selected ~ :not(slot):not(.iron-selected).ytcp-channel-editing-section ~ :not(slot):not(.iron-selected).ytcp-channel-editing-section ytcp-channel-links,
iron-pages > .ytcp-channel-editing-section.iron-selected ~ :not(slot):not(.iron-selected).ytcp-channel-editing-section ~ :not(slot):not(.iron-selected).ytcp-channel-editing-section ytcp-channel-url,
.description.ytcp-channel-editing-channel-name { /*hide about*/
    display:none
}
iron-pages > .ytcp-channel-editing-section.iron-selected ~ :not(slot):not(.iron-selected).ytcp-channel-editing-section ~ :not(slot):not(.iron-selected).ytcp-channel-editing-section section > ytcp-channel-editing-channel-name { /*about name*/
    display:block
}
iron-pages > :not(slot):not(.iron-selected).ytcp-channel-editing-section:nth-child(1) {  /*hide main*/
    display:none!important
}
iron-pages > :not(slot):not(.iron-selected).ytcp-channel-editing-section ~ :not(slot):not(.iron-selected).ytcp-channel-editing-section ytcp-video-watermark-upload {
    display:none
}
.ytcp-channel-editing-section:nth-of-type(2) ytcp-channel-editing-images-tab {
    padding-top:0;
    padding-bottom:0
}
        /*layout*/
.left.ytcp-spotlight-section-item, .description.ytcp-spotlight-section {
    display:none
}
.container.ytcp-spotlight-section-item {
    border:0;
    margin:0;
    padding:8px 0
}
#add-section-button.ytcp-shelves-section {
    margin-right:0;
    margin-bottom:5px
}
.container.ytcp-shelf-list-item {
    margin:0;
    padding:0;
    border:0;
    border-radius:0;
    border-bottom: 1px solid #e2e2e2;
}
.container.ytcp-shelf-list-item .drag-handle-container.ytcp-shelf-list-item tp-yt-iron-icon {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl-Nn88d.png) -412px -116px;
    background-size: auto;
    width: 2px;
    height: 10px;
    opacity:0
}
.container.ytcp-shelf-list-item:hover .drag-handle-container.ytcp-shelf-list-item tp-yt-iron-icon {
    opacity:1
}
.drag-handle-container.ytcp-shelf-list-item {
    border-left:1px solid transparent;
    border-right:1px solid transparent;
}
.ytcp-shelf-list-item:hover .drag-handle-container.ytcp-shelf-list-item {
    background: #fbfbfb;
    border-left: 1px solid #e2e2e2;
    border-right: 1px solid #e2e2e2;
}
.shelf-container.ytcp-shelf-list-item {
    padding:5px 0 15px 0
}
#shelf-items-container.ytcp-shelves-section {
    border:1px solid #e2e2e2;
    border-bottom:0
}
.video-length.ytcp-channel-editing-thumbnail {
    padding:0 4px;
    font-size:11px;
    line-height:normal;
    bottom:2px;
    right:2px;
    font-weight:500;
    background:#000;
    opacity:.75
}
            /*choose specific video popup*/
ytcp-entity-card.card, ytcp-entity-card.ytcp-playlist-pick-dialog {
    border:0;
    border-radius:0;
    padding:10px;
    margin-left:0;
    min-height:0;
    width:160px
}
ytcp-entity-card.card:hover, ytcp-entity-card.ytcp-playlist-pick-dialog:hover {
    background:#D9D8DA;
    box-shadow:1px 0px 1px rgba(0,0,0,.1)
}
.title.ytcp-entity-card {
    padding:0;
    font-weight:500;
    margin-top:1px
}
.thumbnail.ytcp-entity-card {
    width:160px;
    height:90px
}
.ytcp-video-pick-dialog > tp-yt-paper-tabs, .ytcp-playlist-pick-dialog > tp-yt-paper-tabs { /*search*/
    height:32px
}
.ytcp-video-pick-dialog > tp-yt-paper-tabs tp-yt-iron-icon, .ytcp-playlist-pick-dialog > tp-yt-paper-tabs tp-yt-iron-icon {
    display:none
}
tp-yt-paper-tab.ytcp-video-pick-dialog input.ytcp-video-pick-dialog, tp-yt-paper-tab.ytcp-playlist-pick-dialog input.ytcp-playlist-pick-dialog {
    height:32px;
    padding:0
}
.search.ytcp-playlist-pick-dialog {
    min-height:0
}
        /*basic info*/
ytcp-form-input-container.ytcp-channel-editing-channel-name input.ytcp-channel-editing-channel-name {
    font-size:20px;
    font-weight:500;
    line-height:33px!important;
}
#handle-input.ytcp-channel-editing-channel-handle, ytcp-form-input-container.ytcp-channel-editing-channel-handle .handle-input-container.ytcp-channel-editing-channel-handle, #textbox.ytcp-social-suggestions-textbox {
    font-size:13px;
    line-height:normal!important
}
#validity-indicator-container.ytcp-channel-editing-channel-handle {
    height:15px
}
#child-input.ytcp-form-input-container {
    height:auto
}
#add-translation-button.ytcp-channel-editing-details-tab {
    margin-left:0
}

.section.ytcp-channel-editing-sections-tab {
    margin:12px 0
}





/*SUPER HACKS*/
.page.selected.ytcp-app[name="channel.editing"]:before {
    content:"";
    background:#f1f1f1;
    height:100px;
    top:0;
    width:calc(100% - 10px);
    overflow:hidden;
    position:absolute
}
.section.ytcp-channel-editing-images-tab {
    padding:0
}
.main-sections.ytcp-channel-editing-images-tab, [name="channel.editing"]  {
    max-width:1003px;
    min-width:0;
    flex-grow:initial
}
iron-pages.ytcp-channel-editing-section {
    position:relative
}
[name="channel.editing"] .section.ytcp-channel-editing-images-tab:nth-child(2) {
    position:absolute;
    top:-257px;
    left:0;
    padding:0;
    width:1003px
}
[name="channel.editing"] ytcp-sticky-header {
    margin-top:145px
}
ytcp-primary-action-bar {
    height:46px
}
.guide.ytcp-banner-upload, .label.ytcp-banner-upload, .description.ytcp-banner-upload, .guide.ytcp-banner-upload, .description.ytcp-profile-image-upload:not(.instructions), .label.ytcp-profile-image-upload, .description.ytcp-profile-image-upload .guide {
    display:none
}
svg.ytcp-banner-upload > * {
    display:none
}
.button-layer.ytcp-banner-upload, .content.ytcp-profile-image-upload {
    margin:0;
    display:inline-block
}
.content.ytcp-banner-upload {
    margin:0;
    height:165px;
    border-bottom:1px solid #e2e2e2
}
.preview.ytcp-banner-upload svg {
    z-index:2;
    position:relative;
    overflow:visible;
    width:100%!important;
    height:auto
}
svg.ytcp-banner-upload > image:nth-of-type(2) {
    position:absolute;
    width:1003px;
    height:auto;
    z-index:2;
    display:inline-block!important;
    x:0;
    y:0;
}
.ytcp-banner-upload #replace-button {
    z-index:4;
    position:absolute;
    right:0;
    height:32px;
    padding:0 9px;
    border-top:0;
    border-right:0;
    opacity:0
}
.content.ytcp-banner-upload:hover .ytcp-banner-upload #replace-button {
    opacity:1
}
.preview.ytcp-profile-image-upload {
    width:100px;
    height:100px;
    background-color: #e9ecee;
    box-shadow: 0 1px 1px rgb(0 0 0 / 40%);
}
.preview.ytcp-profile-image-upload img {
    width:100px;
    height:100px;
    border-radius:0
}
ytcp-profile-image-upload {
    position:absolute;
    top:-257px;
    z-index:44;
    left:15px
}
.instructions.ytcp-profile-image-upload, .button-layer.ytcp-profile-image-upload {
    margin:0
}
.instructions.ytcp-profile-image-upload #replace-button {
    position:absolute;
    top:0;
    left:68px;
    padding:0 9px;
    height:32px;
    border-top:0;
    border-right:0;
    opacity:0
}
.content.ytcp-profile-image-upload .preview:hover ~ .instructions.ytcp-profile-image-upload #replace-button, .instructions.ytcp-profile-image-upload #replace-button:hover {
    opacity:1
}
.instructions.ytcp-profile-image-upload #remove-button {
    display:none
}

ytcp-channel-editing-thumbnail.ytcp-spotlight-section-item {
    width:520px;
    height:257.5px
}
.section-metadata.ytcp-spotlight-section-item h4.ytcp-spotlight-section-item {
    display:none
}
.video-title-container.ytcp-spotlight-section-item>span.ytcp-spotlight-section-item {
    font-size:14px;
    font-weight:500;
    color:#167ac6
}
.section-label.ytcp-spotlight-section, .section-label.ytcp-shelves-section {
    display:none
}
[name="channel.editing"] ytcp-primary-action-bar tp-yt-paper-tab {
    padding: 0 3px 3px;
    cursor: pointer;
    background: none;
    color: #666;
    font-size: 13px;
    font-weight: normal;
    height: 29px;
    line-height: 29px;
    vertical-align: bottom;
    width:auto;
    min-width:0;
    border:none;
    box-sizing:border-box;
    min-height:0!important
}
[name="channel.editing"] ytcp-primary-action-bar tp-yt-paper-tab .tp-yt-paper-tab[style-target=tab-content] {
    margin:0;
    display:inline;
    font-size:13px;
    line-height:normal
}
[name="channel.editing"] tp-yt-paper-tabs {
    height:32px;
    min-height:0;
}
[name="channel.editing"] .tabs-content.tp-yt-paper-tabs {
    border:0
}
[name="channel.editing"] ytcp-primary-action-bar tp-yt-paper-tab.iron-selected[style-target=host], [name="channel.editing"] ytcp-primary-action-bar tp-yt-paper-tab:hover {
    border-bottom:3px solid #cc181e;
    border-top:0;
    padding:0 3px
}
[name="channel.editing"] ytcp-primary-action-bar tp-yt-paper-tab:not(:first-of-type) {
    margin-left:20px
}
[name="channel.editing"] ytcp-primary-action-bar tp-yt-paper-tab:nth-of-type(2) { /*remove branding*/
    display:none
}
[name="channel.editing"] tp-yt-paper-tab.ytcp-primary-action-bar span.ytcp-primary-action-bar {
    font-weight:400
}
[name="channel.editing"] ytcp-primary-action-bar tp-yt-paper-tab.iron-selected[style-target=host] .ytcp-primary-action-bar {
    color:#333;
    font-weight:500
}
.personal-name-edit.ytcp-channel-editing-channel-name, .brand-name-edit.ytcp-channel-editing-channel-name {
    margin:0;
}
.ytcp-channel-editing-channel-name div#outer.ytcp-form-input-container.style-scope {
    border-color:transparent;
    padding:1px 1px 1px 0
}
.ytcp-channel-editing-channel-name div#outer.ytcp-form-input-container.style-scope:hover {
    border-color:#f6f6f6;
    background:#f6f6f6
}
.ytcp-channel-editing-channel-name div#outer.ytcp-form-input-container.style-scope:focus-within {
    background:#fff
}
ytcp-channel-editing-channel-name.channel-name {
    position:absolute;
    top:-82px;
    z-index:4;
    left:15px
}
[name="channel.editing"] #replace-button .label.ytcp-button {
    font-size:0;
}
[name="channel.editing"] #replace-button .label.ytcp-button:after {
    content:"";
    display:inline-block;
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-channels-c4-editor-vflxIbTxG.png) -127px 0;
    background-size: auto;
    width: 13px;
    height: 12px;
}
        /*some abt page stuff*/
.section-label.ytcp-channel-editing-details-tab:first-of-type {
    display:none
}
#add-link-button.ytcp-channel-links {
    margin:0
}
/*settings*/
#dialog-title.ytcp-settings-dialog {
    font:500 14px roboto;
    text-transform:uppercase;
    margin:0;
    padding:10px 0 0 22px
}
#settings-dialog #dialog.ytcp-dialog {
    width:calc(100% - 300px)!important;
    height:calc(100% - 200px)!important;
    max-width:none!important;
    left:initial!important;
    margin:100px 150px;
    top:initial!important;
    border-radius:0;
    border: 1px solid #ccc;
}
#content.ytcp-navigation {
    width:calc(100% - 300px)
}
.menu-item.ytcp-navigation>span.ytcp-navigation {
    color:inherit;
    padding:0;
    line-height:24px;
    font-size:11px;
    font-family:roboto,arial;
}
.menu-item.ytcp-navigation {
    color:#555
}
ytcp-navigation[keyboard-focus] .menu-item.ytcp-navigation[selected]:focus, .menu-item.ytcp-navigation[selected] {
    background:#cc181e;
    color:#fff
}
.nav-drawer.ytcp-navigation {
    max-width:215px
}
        /*channel -> feature eligibility*/
.features-summary.yt-trust-tiers-home-level {
    display:none
}
.feature-level.yt-trust-tiers-home-level {
    background-color: #f8f8f8;
    border: solid 1px #e2e2e2;
    border-radius: 2px;
    display: inline-block;
    font-size: 12px;
    line-height: 16px;
    list-style-type: none;
    margin: 0 5px 20px 0;
    overflow: hidden;
    padding: 15px;
    position:relative;
    min-height:212px;
    display:block
}
ytcp-icon-button.yt-trust-tiers-home-level {
    display:none
}
.feature-level.yt-trust-tiers-home-level iron-collapse.iron-collapse-closed {
    display:block!important;
    overflow:visible;
    max-height:initial!important
}
.feature-level-bar.yt-trust-tiers-home-level {
    border-bottom:solid 1px #e7e6e6
}
yt-trust-tiers-home-level.yt-trust-tiers-home {
    margin:0;
    flex-direction:row;
    width:49%;
    display:inline-block;
    vertical-align:top
}
yt-trust-tiers-home {
    display:inline-block
}
.feature-level-name.yt-trust-tiers-home-level, .feature-level-status.yt-trust-tiers-home-level {
    font:500 14px roboto;
    color:#555;
    margin:0;
    background:none
}
.feature-level-status-bar.yt-trust-tiers-home-level {
    margin:0
}
.feature-level-unlocked.yt-trust-tiers-home-level:after {
    width:100%;
    height:3px;
    background:#42d916;
    display:inline-block;
    position:absolute;
    content:"";
    left:0;
    bottom:0
}
.feature-level-eligible.yt-trust-tiers-home-level:after {
    content:"";
    width:100%;
    height:3px;
    background:#cfcfcf;
    display:inline-block;
    position:absolute;
    left:0;
    bottom:0
}
.feature-level-ineligible.yt-trust-tiers-home-level:after {
    content:"";
    width:100%;
    height:3px;
    background:#e62117;
    display:inline-block;
    position:absolute;
    left:0;
    bottom:0
}
/*VIDEO DETAILS / INFO AND SETTINGS*/
[name="video.edit"] {
    max-width:1003px;
}
[name="video.edit"] ytcp-video-details-section {
    padding-top:55px
}
[name="video.edit"] ytcp-sticky-header {
    border-top:1px solid #e2e2e2;
}
[name="video.edit"] ytcp-sticky-header[stuck] {
    position:relative
}
[name="video.edit"] .page-title.ytcp-entity-page-header {
    color: #333;
    max-width: 700px;
    height: 1.1em;
    display: inline-block;
    overflow: hidden;
    white-space: nowrap;
    word-wrap: normal;
    font-family:roboto,arial;
    font-weight:400;
    font-size:18px;
    padding:0;
    line-height:normal;
    vertical-align:bottom;
    margin:8px 0
}
[name="video.edit"] .primary.ytcp-entity-page-header {
    align-items:flex-end
}
[name="video.edit"] ytcp-entity-page-header {
    height:auto;
    padding:20px 20px 15px 20px;
}
#video-overflow-menu #overflow-menu-button {
    padding:5px
}
.wrapper.ytcp-entity-page-header {
    border-bottom:1px solid #e2e2e2;
    padding-bottom:10px
}
div#outer.ytcp-form-input-container.style-scope {
    border:0;
    height:auto;
    padding:0
}
ytcp-social-suggestions-textbox {
    height:auto
}
.ytcp-video-details-section .left-col.ytcp-video-metadata-editor {
    margin-top:309px;
    width:955px
}
ytcp-video-metadata-editor-basics #label.ytcp-form-input-container  {
    display:none
}
.input-container.ytcp-video-metadata-editor-basics {
    margin:0;
    max-width:425px
}
.input-container.ytcp-video-metadata-editor-basics > ytcp-social-suggestions-textbox {
    margin-bottom:8px
}
        /*right sidebar cursing*/
.ytcp-video-details-section .container.ytcp-video-info {
    position:absolute;
    left:-439px;
    border-radius:0;
    background:none;
    display:inline-block;
    max-width:none;
    top:-309px;
    width:955px;
    overflow:visible
}
.ytcp-video-details-section .container.ytcp-video-info > ytcp-html5-video-player {
    float:left;
    margin:0;
    margin-right:181px
}
.ytcp-video-details-section ytcp-video-info {
    --player-width: 480px;
    --player-height: 270px;
}
.input-container.ytcp-video-metadata-editor-sidepanel {
    margin:0
}
ytcp-video-metadata-editor.ytcp-video-details-section {
    position:relative
}
.ytcp-video-details-section ytcp-video-metadata-editor-sidepanel.ytcp-video-metadata-editor {
    width:323px;
    padding:0;
    position:absolute;
    top:309px;
    left:459px;
}
.input-container.ytcp-video-metadata-editor-sidepanel {
    margin-left:29px
}
.label.ytcp-video-info {
    font-family: "YouTube Noto",Roboto,arial,sans-serif;
    color: #666;
    font-size: 11px;
    font-weight: normal;
    padding:0;
    min-width:0;
    line-height:normal;
    margin:0;
    display:inline-block;
    width:105px;
    vertical-align:middle;
    padding-bottom:10px;
}
.label.ytcp-video-info:after {
    content:":"
}
.left.ytcp-video-info {
    display:block
}
.row.ytcp-video-info {
    margin-top:10px;
}
.value.ytcp-video-info {
    margin:0;
    font-size:11px;
    line-height:normal;
    display:inline-block;
    padding:0;
    width:175px;
    vertical-align:middle;
    padding-bottom:10px;
    color:#444;
    overflow:visible
}
.right.ytcp-video-info {
    display:none
}
ytcp-video-info[show-video-url] .video-url-fadeable.ytcp-video-info {
    border: 1px solid #d3d3d3;
    color: #333;
    box-shadow: inset 0 0 1px rgb(0 0 0 / 5%);
    padding: 1px 8px;
}
ytcp-video-info[show-video-url] .video-url-fadeable.ytcp-video-info:hover {
    border-color: #b9b9b9;
}
ytcp-video-info[show-video-url] .video-url-fadeable.ytcp-video-info:active {
    border-color: #167ac6;
    box-shadow: inset 0 0 1px rgb(0 0 0 / 10%);
}
            /*incredibly funny grid*/
ytcp-video-metadata-editor-advanced {
    display:grid;
    grid-template-columns:454px 454px;
    column-gap:54px;
    row-gap:3px
}
.input-container.ytcp-video-metadata-editor-advanced {
    margin-right:29px
}
.input-container.ytcp-video-metadata-editor-advanced:nth-of-type(3), .input-container.ytcp-video-metadata-editor-advanced:nth-of-type(4) {
    grid-column:2
}
.input-container.ytcp-video-metadata-editor-advanced:nth-of-type(5) {
    grid-column:1;
    grid-row:2/5
}
.input-container.ytcp-video-metadata-editor-advanced:nth-of-type(6) {
    grid-column:1
}
.input-container.ytcp-video-metadata-editor-advanced:nth-of-type(7) {
    grid-column:2;
    grid-row:4;
    margin-top:16px
}
.input-container.ytcp-video-metadata-editor-advanced:nth-of-type(10) {
    grid-row:6/8;
    grid-column:2
}
.ytcp-video-metadata-editor-advanced .chip-and-bar.ytcp-chip-bar .chip:first-of-type {
    margin-left:0!important
}
.ytcp-video-metadata-editor-advanced .chip-and-bar.ytcp-chip-bar .chip {
    margin-bottom:4px!important
}
.ytcp-video-metadata-editor-advanced .chip-and-bar.ytcp-chip-bar .text-input.ytcp-chip-bar {
    width:100%;
    line-height:normal!important;
    vertical-align:top
}
.ytcp-video-metadata-editor-advanced .chip-and-bar.ytcp-chip-bar {
    padding-top:4px;
    padding-bottom:4px
}
.chip-bar-right-button.ytcp-chip-bar {
    margin:6px 0 0 0;
    padding:0
}
#license .label-text.ytcp-dropdown-trigger, .input-container.ytcp-video-metadata-editor-advanced:nth-of-type(7) .section-label-with-description.ytcp-video-metadata-editor-advanced, .input-container.ytcp-video-metadata-editor-advanced:nth-of-type(6) .section-label-with-description.ytcp-video-metadata-editor-advanced {
    display:none
}
.input-container.ytcp-video-metadata-editor-advanced:nth-of-type(6) .label-text.ytcp-dropdown-trigger, .input-container.ytcp-video-metadata-editor-advanced:nth-of-type(7) .label-text.ytcp-dropdown-trigger, .ytcp-form-gaming .label-text.ytcp-dropdown-trigger, .input-container.ytcp-video-metadata-editor-advanced:last-of-type .label-text.ytcp-dropdown-trigger { /*fake title*/
    position:absolute;
    color: #555;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
    padding: 0;
    line-height: 1;
    left:0;
}
#help-icon.ytcp-dropdown-trigger {
    display:none
}
.ytcp-video-metadata-editor .ytcp-form-autocomplete .container.ytcp-dropdown-trigger { /*video location searchbox*/
    background:#fff!important;
}
.ytcp-video-metadata-editor input.ytcp-form-autocomplete {
    font-size:13px
}
.ytcp-video-metadata-editor .ytcp-form-autocomplete .container.ytcp-dropdown-trigger:hover {
    border-color:#b9b9b9;
    box-shadow:none
}
.ytcp-video-metadata-editor .ytcp-form-autocomplete .container.ytcp-dropdown-trigger:active, .ytcp-video-metadata-editor .ytcp-form-autocomplete .container.ytcp-dropdown-trigger:focus-within {
    box-shadow:inset 0 0 1px rgb(0 0 0 / 10%);
    border-color:#167ac6!important
}
.ytcp-video-metadata-editor .row.ytcp-video-metadata-editor-advanced .container.ytcp-dropdown-trigger {
    margin-top:10px
}
#category-container.ytcp-video-metadata-editor-advanced > .row.ytcp-video-metadata-editor-advanced .container.ytcp-dropdown-trigger, #license .container.ytcp-dropdown-trigger {
    margin-top:0;
}
#license .container.ytcp-dropdown-trigger {
    margin-bottom:0
}
        /*privacy*/
#label.ytcp-video-metadata-visibility {
    display:none
}
#visibility-text.ytcp-video-metadata-visibility, #restrictions.ytcp-video-metadata-restrictions .restriction.ytcp-video-metadata-restrictions, #restrictions.ytcp-video-metadata-restrictions .label.ytcp-video-metadata-restrictions {
    padding:0;
    font:500 11px roboto,arial;
    line-height:26px;
    text-shadow: 0 1px 0 rgb(255 255 255 / 50%);
    color:#333
}
#restrictions.ytcp-video-metadata-restrictions .restriction.ytcp-video-metadata-restrictions, #restrictions.ytcp-video-metadata-restrictions .label.ytcp-video-metadata-restrictions {
    display:inline
}
#restrictions.ytcp-video-metadata-restrictions .label.ytcp-video-metadata-restrictions {
    padding-left:10px
}
#restrictions.ytcp-video-metadata-restrictions .label.ytcp-video-metadata-restrictions:after {
    content:": "
}
#privacy-icon.ytcp-video-metadata-visibility {
    display:none
}
#select-button.ytcp-video-metadata-visibility {
    padding:0;
        float: right;
    width: 0;
    height: 0;
    border: 1px solid transparent;
    border-width: 4px 4px 0;
    border-top-color: #666;
    margin-top: 2px;
    margin-right: 10px;
    color:transparent
}
#container.ytcp-video-metadata-visibility, #restrictions.ytcp-video-metadata-restrictions {
    border: 1px solid #d3d3d3;
    cursor: pointer;
    text-shadow: 0 1px 0 rgb(255 255 255 / 50%);
    background-color: #f8f8f8;
    background-image: linear-gradient(to bottom,#fcfcfc 0,#f8f8f8 100%);
    border-radius:0;
    margin-bottom:15px;
    min-height:0;
    padding:0
}
#container.ytcp-video-metadata-visibility:hover, #restrictions.ytcp-video-metadata-restrictions:hover {
    border-color:#b9b9b9
}
#restrictions.ytcp-video-metadata-restrictions[disabled], #container.ytcp-video-metadata-visibility[disabled] {
    background-color: #f8f8f8;
    background-image: linear-gradient(to bottom,#fcfcfc 0,#f8f8f8 100%);
    opacity:.5;
    cursor:default;
    border-color:#d3d3d3
}
.ytcp-video-metadata-editor .left-icon.ytcp-dropdown-trigger, .ytcp-video-metadata-editor .right-container.ytcp-dropdown-trigger {
    display:none
}
.dropdown-trigger-text.ytcp-text-dropdown-trigger {
    font:400 11px roboto;
    padding:0;
    line-height:28px;
    color:#333
}
.ytcp-video-metadata-editor .container.ytcp-dropdown-trigger {
    margin-bottom:15px
}
.section-description.ytcp-video-metadata-editor-basics, .section-label-with-description.ytcp-video-metadata-editor-basics { /*playlist*/
    display:none
}
.compact-row.ytcp-video-metadata-editor-basics {
    position:absolute;
    width:294px;
    left:488px;
    margin-top:80px
}
.col.ytcp-video-metadata-editor-basics {
    min-width:294px
}
.use-placeholder.ytcp-text-dropdown-trigger .dropdown-trigger-text.ytcp-text-dropdown-trigger {
    font-size:0;
    line-height:27px
}
[name="video.edit"] .ytcp-video-metadata-editor-basics .use-placeholder.ytcp-text-dropdown-trigger .dropdown-trigger-text.ytcp-text-dropdown-trigger:before {
    content:"";
    margin-right: 4px;
    vertical-align: sub;
    display: inline-block;
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-editor-vflFFpeNg.webp) -190px 0;
    background-size: auto;
    width: 13px;
    height: 10px;
    line-height:27px
}
.ytcp-video-metadata-editor-basics .use-placeholder.ytcp-text-dropdown-trigger .dropdown-trigger-text.ytcp-text-dropdown-trigger:after {
    content:"+Add to Playlist";
    font-size:11px;
}
        /*made for kids*/
#audience.ytcp-video-metadata-editor-basics .section-label.ytcp-video-metadata-editor-basics, .mfk-infobox-container.ytkc-made-for-kids-select {
    display:none
}
ytcp-age-restriction-select#age-restriction {
    display:inline!important
}
        /*thubmys*/
.sublabel.ytcp-thumbnails-compact-editor-old, .label.ytcp-thumbnails-compact-editor-old {
    display:none
}
.ytcp-video-details-section ytcp-thumbnails-compact-editor-old.ytcp-video-metadata-editor-basics {
    position:absolute;
    top:0;
    left:514px;
    z-index:4
}
#still-picker.ytcp-thumbnails-compact-editor-old {
    flex-direction:column
}
ytcp-still-cell, ytcp-thumbnails-compact-editor-uploader-old {
    --ytcp-thumbnails-still-width: 120px;
    --ytcp-thumbnails-still-height: 67.5px;
    --ytcp-thumbnails-still-border: 3px;
    border-radius:0
}
#add-photo-icon {
    display:none
}
.still.ytcp-still-cell .container.ytcp-img-with-fallback {
    padding:1px
}
ytcp-still-cell[selected] .still.ytcp-still-cell {
    border-color: #828282;
    border-radius:0
}
        /*advanced radios*/
.radio-button-title.ytkc-made-for-kids-select, .radio-button-title.ytcp-age-restriction-select, .section-label-with-description[class] { /*title*/
    color: #555;
    font-size: 14px;
    font-weight: 500;
    margin-bottom: 8px;
    padding:0;
    line-height:1
}
.radio-button-title.ytcp-age-restriction-select {
    margin-top:12px
}
.description.ytcp-age-restriction-select, .description.ytkc-made-for-kids-select, .section-description[class] { /*sub*/
    font-size:12px;
    color:#888
}
.section-description.ytcp-video-metadata-editor-advanced {
    display:none
}
.made-for-kids-rating-container.ytkc-made-for-kids-select {
    padding:0;
    margin:0
}
#offRadio.tp-yt-paper-radio-button, #checkbox.ytcp-checkbox-lit {
    border: 1px solid #c6c6c6;
    display: inline-block;
    vertical-align: middle;
    cursor: pointer;
    background-size: auto;
    width: 16px;
    height: 16px;
}
ytcp-checkbox-lit {
    padding:0!important
}
.input-container.ytcp-video-metadata-editor-advanced {
    margin-bottom:18px
}
.places-header.ytcp-video-metadata-editor-advanced {
    margin-bottom:0
}
tp-yt-paper-radio-button tp-yt-paper-radio-button .tp-yt-paper-radio-button[style-target=label], .tp-yt-paper-radio-button[style-target=label], .label.ytcp-checkbox-lit {
    color:#333;
    font-size:13px
}
.tp-yt-paper-radio-button[style-target=container], #checkbox-container.ytcp-checkbox-lit {
    max-width:16px;
    height:17px;
    margin-right:0;
    margin-left:0
}
#onRadio.tp-yt-paper-radio-button {
    opacity:0
}
tp-yt-paper-radio-button[checked] #onRadio.tp-yt-paper-radio-button {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflbQfoQG.webp) -171px -233px;
    background-size: auto;
    width: 14px;
    height: 14px;
    transform:initial;
    top:1px;
    left:1px;
    opacity:1
}
tp-yt-paper-radio-button[checked] #offRadio.tp-yt-paper-radio-button {
    border-color:#c6c6c6
}
tp-yt-paper-radio-button[checked]:hover #offRadio.tp-yt-paper-radio-button, tp-yt-paper-radio-button:hover #offRadio.tp-yt-paper-radio-button, #checkbox-container.ytcp-checkbox-lit:hover #checkbox.ytcp-checkbox-lit {
    border-color:#b9b9b9;
    transition:none
}
tp-yt-paper-radio-button[checked]:focus #offRadio.tp-yt-paper-radio-button, tp-yt-paper-radio-button:focus #offRadio.tp-yt-paper-radio-button {
    border-color:#4496e7;
    box-shadow: inset 0 0 1px rgb(0 0 0 / 10%);
    background-color:transparent
}
#checkbox-container.ytcp-checkbox-lit #checkbox.ytcp-checkbox-lit {
    border-radius:0
}
ytcp-checkbox-lit[checked] #checkbox.ytcp-checkbox-lit {
    border: 1px solid #36649c!important;
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflbQfoQG.webp) -416px -51px;
    border-radius:0;
}
ytcp-checkbox-lit[checked] #checkbox.ytcp-checkbox-lit #checkmark {
    display:none
}
.expand-button.ytcp-video-metadata-editor-basics {
    display:none
}
        /*sidebar*/
.back-button-text.ytcp-navigation-drawer {
    font-size:0;
}
.back-button-text.ytcp-navigation-drawer:before {
    content:"Video Manager";
    font-size:11px
}
ytcp-video-overflow-menu #overflow-menu-button tp-yt-iron-icon, #more-menu-button tp-yt-iron-icon {
    margin-top:6px;
    margin-left:6px
}
#label-help-tooltip.ytcp-form-input-container, .thumbnail.ytcp-navigation-drawer {
    display:none
}
[layout="video"] .top-section.ytcp-navigation-drawer {
    position:absolute;
    left:225px;
    background:#fff;
    padding-left:20px;
    width:983px;
    border-bottom:1px solid #e2e2e2;
    overflow:visible;
    height:55px
}
[layout="video"] .top-section.ytcp-navigation-drawer:before {
    content:"";
    display:inline-block;
    background:#f1f1f1;
    width:1003px;
    position:absolute;
    height:10px;
    top:-10px;
    left:0
}
[layout="video"] .top-section.ytcp-navigation-drawer #main-menu, [layout="video"] .top-section.ytcp-navigation-drawer #main-menu > li {
    width:auto;
    display:inline-block;
    overflow:hidden;
    height:55px;
}
[layout="video"] nav.ytcp-navigation-drawer {
    z-index:6
}
[layout="video"]  .top-section.ytcp-navigation-drawer tp-yt-paper-icon-item.ytcp-navigation-drawer {
    padding:18px 8px 0 8px;
    border-bottom:4px solid transparent;
    margin-right:17px;
    font-weight: 500;
    font-size: 11px;
    height: 55px;
    min-width: 0;
    box-sizing:border-box;
    background:none!important
}
[layout="video"]  .top-section.ytcp-navigation-drawer tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected, [layout="video"]  .top-section.ytcp-navigation-drawer tp-yt-paper-icon-item.ytcp-navigation-drawer:hover {
    border-bottom-color:#cc181e
}
[layout="video"] .top-section.ytcp-navigation-drawer .nav-item-text.ytcp-navigation-drawer {
    text-transform:none;
    color:#333
}
[layout="video"] [href*="edit?o=U"]  tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-creatoreditor-vfl5BJeU_.webp) 0 -214px;
    background-size: auto;
    width: 17px;
    height: 18px;
    background-position:0 -214px!important
}
[layout="video"] [href*="edit?o=U"] .content-icon.tp-yt-paper-icon-item, [layout="video"] [href*="editor"] .content-icon.tp-yt-paper-icon-item, [layout="video"] [href*="translations"] .content-icon.tp-yt-paper-icon-item {
    width:17px;
    margin-top:-1px
}
[layout="video"] .top-section.ytcp-navigation-drawer .content-icon.tp-yt-paper-icon-item {
    width:17px
}
[layout="video"] [href*="analytics"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer  {
    background-size: 40px 814.4px;
    width:17px;
    height:18px;
    background-position:-21px -408px!important
}
[layout="video"] [href*="editor"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer  {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-creatoreditor-vfl5BJeU_.webp) 0 -60px!important;
    background-size: auto;
    width: 17px;
    height: 18px;
}
[layout="video"] [href*="translations"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
    background: no-repeat url(//s.ytimg.com/yts/imgbin/www-creatoreditor-vfl5BJeU_.webp) 0 -22px!important;
    background-size: auto;
    width: 17px;
    height: 18px;
}
[layout="video"] [href*="comments/inbox"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
    background-size: 40px 814.4px;
    width:17px;
    height:18px;
    background-position:-1px -775px!important
}
[layout="video"] [href*="comments/inbox"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer:before {
    top:2px;
    left:2px;
    width:12px;
    height:12px
}
[layout="video"] [href*="copyright"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
    background-size: 40px 814.4px;
    width:17px;
    height:18px;
    background-position:-1px -796px!important
}
/*VIDEO ANALYITICS*/
[name="video.analytics"] {
    max-width:1327px;
}
[name="video.analyitics"] ytcp-video-details-section {
    padding-top:55px
}
/*LIVE DASHBOARD*/
/*first load popup*/
.ytls-user-experience-dialog #dialog.ytcp-dialog .header.ytcp-dialog {
    display:none
}
#body-content.ytls-user-experience-dialog {
    padding:0 20px 15px;
    margin-bottom:0px;
    background:#fff;
    color:#333;
    font-size:13px;
    line-height:normal;
    width:100%
}
.ytls-user-experience-dialog .content.ytcp-dialog #dialog-content {
    flex:1;
    display:flex;
    width:100%
}
.ytls-user-experience-dialog #dialog.ytcp-dialog {
    background:#f1f1f1
}
h2.ytls-user-experience-dialog {
    background:#2793E6;
    margin:0 -20px;
    line-height: 50px;
    font-size: 21px;
    text-align:left;
    padding-left:21px;
    color:#fff
}
#dialog-body.ytls-user-experience-dialog {
    text-align:left;
    margin-top:15px;
    font-weight:500;
    color:#333;
    font-size:13px;
    line-height:normal
}
.selection.ytls-user-experience-dialog {
    background:none;
    padding:0
}
.selection-title.ytls-user-experience-dialog {
    font-weight:500
}
ytls-user-experience-dialog[dialog-type] ytcp-button.ytls-user-experience-dialog[type=filled] {
    position:absolute;
    bottom:15px;
    right:20px;
    z-index:2
}
.selection.ytls-user-experience-dialog ytcp-button.ytls-user-experience-dialog[type=filled] > div {
    font-size:0;
    color:#fff
}
.selection.ytls-user-experience-dialog:first-of-type ytcp-button.ytls-user-experience-dialog[type=filled] > div:before {
    content:"Webcam";
    font-size:11px
}
h2 ~ .selection.ytls-user-experience-dialog:first-of-type ytcp-button.ytls-user-experience-dialog[type=filled] > div:before {
    content:"Right now";
    font-size:11px
}
.selection.ytls-user-experience-dialog:last-of-type ytcp-button.ytls-user-experience-dialog[type=filled] > div:before {
    content:"Software";
    font-size:11px
}
h2 ~ .selection.ytls-user-experience-dialog:last-of-type ytcp-button.ytls-user-experience-dialog[type=filled] > div:before {
    content:"Later date";
    font-size:11px
}
.selection.ytls-user-experience-dialog:last-of-type ytcp-button.ytls-user-experience-dialog[type=filled] {
    right:100px
}
.selection.ytls-user-experience-dialog h3.ytls-user-experience-dialog {
    color:#333;
    font-weight:500;
    font-size:13px;
    line-height:normal
}
tp-yt-iron-icon.ytls-user-experience-dialog {
    background:none;
    fill:#888
}
.ytls-user-experience-dialog .footer {
    bottom:0;
    height:58px
}
#bottom-content.ytls-user-experience-dialog {
    margin-bottom:15px;
    padding-left:20px;
    justify-content:flex-start;
    align-items:end;
    height:43px
}
/*actual live dashboard*/
.ytls-core-app {
    --ytls-menu-header-background:#fff;
    --yt-spec-black-3:#f1f1f1;
    --yt-spec-black-2:#fff;
    --yt-spec-brand-background-solid:#fbfbfb;
    --yt-spec-menu-background:#fff;
    --ytcp-text-secondary:#333;
    --ytcp-text-primary:#333;
    --ytls-default-text-color:#3f3f3f;
    --paper-input-container-input-color:#333;
    --yt-spec-text-primary:#333;
    --ytls-inline-text-paragraph-color:#333;
    --ytcp-general-background-b:transparent;
    
        --yt-live-chat-background-color: #fff;
    --yt-live-chat-action-panel-background-color: rgb(248, 248, 248);
    --yt-live-chat-secondary-background-color: #fff;
    --yt-live-chat-toast-text-color: #333
    --yt-live-chat-toast-background-color: #fff;
    --yt-live-chat-mode-change-background-color: #fff;
    --yt-live-chat-primary-text-color: #000;
    --yt-live-chat-secondary-text-color: rgba(0, 0, 0, 0.7);
    --yt-live-chat-tertiary-text-color: rgba(0, 0, 0, 0.54);
    --yt-live-chat-enabled-send-button-color: #333;
    --yt-live-chat-disabled-icon-button-color: rgba(0, 0, 0, 0.3);
    --yt-live-chat-picker-button-color: var(--yt-live-chat-tertiary-text-color);
    --yt-live-chat-picker-button-active-color: #000;
    --yt-live-chat-picker-button-disabled-color: var( --yt-live-chat-disabled-icon-button-color );
    --yt-live-chat-picker-button-hover-color: rgba(0, 0, 0, 0.74);
    --yt-live-chat-mention-background-color: #ff5722;
    --yt-live-chat-mention-text-color: #fff;
    --yt-live-chat-deleted-message-color: rgba(0, 0, 0, 0.5);
    --yt-live-chat-deleted-message-bar-color: rgba(0, 0, 0, 0.5);
    --yt-live-chat-error-message-color: var(--yt-spec-brand-link-text);
    --yt-live-chat-reconnect-message-color: #333;
    --yt-live-chat-disabled-button-background-color: #eee;
    --yt-live-chat-disabled-button-text-color: var( --yt-live-chat-secondary-text-color );
    --yt-live-chat-sub-panel-background-color: #eee;
    --yt-live-chat-sub-panel-background-color-transparent: rgba(162, 162, 162, 0.7);
    --yt-live-chat-header-background-color: var( --yt-live-chat-action-panel-background-color );
    --yt-live-chat-header-button-color: var(--yt-live-chat-secondary-text-color);
    --yt-live-chat-moderator-color: #5e84f1;
    --yt-live-chat-owner-color: #ffd600;
    --yt-live-chat-message-highlight-background-color: #fff;
    --yt-live-chat-author-chip-owner-text-color: var(--yt-deprecated-luna-black);
    --yt-live-chat-author-chip-verified-background-color: var(--yt-spec-grey-5);
    --yt-live-chat-author-chip-verified-text-color: var(--yt-spec-white-4);
    --yt-live-chat-sponsor-color: #2ba640;
    --yt-live-chat-overlay-color: rgba(0, 0, 0, 0.5);
    --yt-live-chat-dialog-background-color: #fff;
    --yt-live-chat-dialog-text-color: var(--yt-spec-static-brand-white);
    --yt-live-chat-button-default-text-color: var(--yt-spec-static-brand-white);
    --yt-live-chat-button-default-background-color: var( --yt-deprecated-white-opacity-lighten-4 );
    --yt-live-chat-button-dark-text-color: var(--yt-spec-static-brand-white);
    --yt-live-chat-button-dark-background-color: var( --yt-deprecated-white-opacity-lighten-4 );
    --yt-emoji-picker-variant-selector-bg-color: #fff;
    --yt-live-chat-moderation-mode-hover-background-color: rgba( 255, 255, 255, 0.3 );
    --yt-live-chat-additional-inline-action-button-color: var(--yt-grey);
    --yt-live-chat-text-input-field-suggestion-background-color: #fff;
    --yt-live-chat-text-input-field-suggestion-background-color-hover: #fff;
    --yt-emoji-picker-search-background-color: #ddd;
    --yt-emoji-picker-search-color: #000;
    --yt-emoji-picker-search-placeholder-color: #999;
    --yt-emoji-picker-base-with-variants-border: var(--yt-spec-white-1-alpha-25);
    --yt-live-chat-slider-active-color: #2196f3;
    --yt-live-chat-slider-container-color: #515151;
    --yt-live-chat-slider-markers-color: #fff;
    --yt-live-chat-poll-editor-start-button-background-color-disabled: var( --yt-spec-grey-1 );
    --yt-live-chat-automod-button-background-color: var( --yt-deprecated-opalescence-grey-opacity-lighten-3 );
    --yt-live-chat-automod-button-background-color-hover: rgba( 255, 255, 255, 0.5 );
    --yt-live-chat-automod-button-explanation-color: rgba(255, 255, 255, 0.7);
    --yt-live-chat-countdown-opacity: 0.5;
    --yt-live-chat-shimmer-background-color: rgba(17, 17, 17, 0.4);
    --yt-live-chat-shimmer-linear-gradient: linear-gradient( 0deg, rgba(0, 0, 0, 0.1) 40%, rgba(100, 100, 100, 0.3) 50%, rgba(0, 0, 0, 0.1) 60% );
    --yt-live-chat-vem-background-color: #fff;
    --yt-live-chat-product-picker-icon-color: rgba(4, 4, 4, 0.5);
    --yt-live-chat-product-picker-hover-color: rgba(68, 68, 68, 1);
    --yt-live-chat-product-picker-disabled-icon-color: rgba(55, 55, 55, 0.3);
}
.ytls-core-app iron-input.tp-yt-paper-input > input.tp-yt-paper-input, .ytls-core-app #paragraph-text.ytls-inline-text-renderer, .ytls-broadcast-edit-dialog iron-input.tp-yt-paper-input > input.tp-yt-paper-input {
    color:#333
}
ytls-header {
    height:49px;
    border-bottom:1px solid #e8e8e8
}
#header-container.ytls-core-app {
    box-shadow:none
}
#header.ytls-live-dashboard-widget-renderer {
    border-bottom:1px solid #e2e2e2
}
#header.ytls-live-dashboard-widget-renderer tp-yt-paper-tabs {
    height:43px;
    font-size:13px
}
tp-yt-paper-tab.ytls-live-dashboard-widget-renderer {
    border-bottom:4px solid transparent;
    box-sizing:border-box;
    padding:0 15px;
    margin-right:3px
}
tp-yt-paper-tab.ytls-live-dashboard-widget-renderer.iron-selected, tp-yt-paper-tab.ytls-live-dashboard-widget-renderer:hover {
    border-bottom-color:#cc181e;
    color:#cc181e
}
#header.ytls-inline-text-renderer, .ytls-core-app #labelAndInputContainer#labelAndInputContainer.label-is-floating>label {
    font:500 13px 'roboto',arial;
    color:#000!important;
    transform:unset;
}
.ytls-core-app #labelAndInputContainer#labelAndInputContainer.label-is-floating>label {
    top:-22px
}
.floated-label-placeholder.tp-yt-paper-input-container {
    height:22px
}
.ytls-core-app .input-wrapper.tp-yt-paper-input-container {
    border: 1px solid #d3d3d3;
    color: #333;
    background-image: linear-gradient(to bottom,#fcfcfc 0,#f8f8f8 100%);
    text-shadow: 0 1px 0 rgb(255 255 255 / 50%);
}
.ytls-core-app .input-wrapper.tp-yt-paper-input-container:hover {
    border-color:#b9b9b9
}
.ytls-core-app .input-wrapper.tp-yt-paper-input-container:active {
    border-color: #167ac6;
    box-shadow: inset 0 0 1px rgb(0 0 0 / 10%);
}
.ytls-core-app .input-wrapper.tp-yt-paper-input-container ~ .underline {
    display:none
}
.ytls-core-app .input-wrapper.tp-yt-paper-input-container input.tp-yt-paper-input {
    font-size:13px;
    line-height:22px;
    padding:0 10px
}
.ytls-core-app tp-yt-paper-input.ytls-ingestion-dropdown-trigger-renderer .input-content.tp-yt-paper-input-container>iron-input input.tp-yt-paper-input, .ytls-core-app tp-yt-paper-dropdown-menu.ytls-dropdown-renderer .input-content.tp-yt-paper-input-container>iron-input input {
    font-size:11px;
    font-weight:500;
    line-height:18px
}
/*chat*/
#avatar.yt-live-chat-message-input-renderer, yt-live-chat-author-chip {
    display:none
}
#top.yt-live-chat-message-input-renderer {
    margin:0 30px;
    z-index:22222;
    position:relative
}
yt-live-chat-message-input-renderer {
    padding:0;
    overflow:hidden
}
#engage-with-audience-picker, #count.yt-live-chat-message-input-renderer {
    display:none
}
#buttons.yt-live-chat-message-input-renderer {
    margin:0;
    position:absolute;
    top:0;
    width:100%
}
#button.yt-live-chat-icon-toggle-button-renderer, #message-buttons yt-icon-button.yt-button-renderer {
    width:32px;
    height:32px;
    padding:2px
}
/*edit popup*/
.ytls-broadcast-edit-dialog tp-yt-paper-dialog {
    --paper-dialog-background-color:#fff;
    --ytcp-text-secondary:#333;
    --ytcp-text-primary:#333;
    --ytcp-form-input-container-disabled-background:#f8f8f8;
    --paper-dialog-color:#333;
    --ytcp-dropdown-trigger-disabled-background-color:#f8f8f8;
    --ytcp-container-border-color:#d3d3d3
}
.ytls-broadcast-edit-dialog .header-content.ytcp-dialog {
    display:none
}
.ytls-broadcast-edit-dialog .nav-drawer.ytcp-navigation {
    width:auto;
    max-width:0;
    min-width:0
}
.ytls-broadcast-edit-dialog .nav-drawer.ytcp-navigation > ul {
    position:absolute;
    bottom:10px;
    display:inline-block;
    z-index:444
}
.ytls-broadcast-edit-dialog .nav-drawer.ytcp-navigation ytcp-ve {
    display:inline-block
}
.ytls-broadcast-edit-dialog .nav-drawer.ytcp-navigation [selected] {
    display:none
}
.ytls-broadcast-edit-dialog ytcp-video-metadata-editor-advanced {
    grid-template-columns: 444px 444px;
}
.ytls-broadcast-edit-dialog #content.ytcp-navigation {
    width:calc(100% - 74px)
}
.ytls-broadcast-edit-dialog .compact-row.ytcp-video-metadata-editor-basics {
    position:static;
    top:0;
    margin:0
}
.ytls-broadcast-edit-dialog .footer {
    background:#f1f1f1
}
.ytls-broadcast-edit-dialog .footer #cancel-button {
    margin-right:8px
}
}

@-moz-document domain("studio.youtube.com") {
ytd-multi-page-menu-renderer {
border-radius: 0 !important;
background: var(--yt-spec-brand-background-primary) !important;
border: 1px solid var(--yt-spec-10-percent-layer) !important;
box-shadow: none !important;
backdrop-filter: none !important;
}
[d*="M21,6H3V5h18V6z M21,11H3v1h18V11z M21,17H3v1h18V17z"] {
d: path("M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z");
}
[d*="M10 16V20H4V16H10ZM11 15H3V21H11V15ZM20 4V8H14V4H20ZM21 3H13V9H21V3ZM3 3V13H11V3H3ZM10 12H4V4H10V12ZM13 11V21H21V11H13ZM20 20H14V12H20V20Z"] {
d: path("M11 3H3V13H11V3ZM21 11H13V21H21V11ZM11 15H3V21H11V15ZM13 3V9H21V3H13Z");
}
[d*="M11 6.99982V13.9998L17 10.4998L11 6.99982Z"] {
d: path("M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z");
}
[d*="M6 2.99982V17.9998H21V2.99982H6ZM11 13.9998V6.99982L17 10.4998L11 13.9998Z"] {
d: path("M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z");
}
[d*="M9 17H7V10H9V17ZM13 7H11V17H13V7ZM17 14H15V17H17V14ZM20 4H4V20H20V4ZM21 3V21H3V3H21Z"] {
d: path("M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z");
}
[d*="M3 3V21H21V3H3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V14H17V17Z"] {
d: path("M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z");
}
[d*="M8 7H16V9H8V7ZM8 13H13V11H8V13ZM5 3V16H15H15.41L15.7 16.29L19 19.59V3H5ZM4 2H20V22L15 17H4V2Z"] {
d: path("M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z");
}
[d*="M8,7h8v2H8V7z M8,13h5v-2H8V13z M5,3v13h10h0.41l0.29,0.29L19,19.59V3H5 M4,2h16v20l-5-5H4V2L4,2z"] {
d: path("M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z");
}
[d*="M4 2V17H15L20 22V2H4ZM8 11H13V13H8V11ZM8 7H16V9H8V7Z"] {
d: path("M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z");
}
[d*="M5 11H7V13H5V11ZM15 15H5V17H15V15ZM19 15H17V17H19V15ZM19 11H9V13H19V11ZM22 6H2V20H22V6ZM3 7H21V19H3V7Z"] {
d: path("M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z");
}
[d*="M2 6V20H22V6H2ZM5 11H7V13H5V11ZM15 17H5V15H15V17ZM19 17H17V15H19V17ZM19 13H9V11H19V13Z"] {
d: path("M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z");
}
[d*="M10.57 10.96C10.62 10.66 10.72 10.4 10.84 10.17C10.96 9.94 11.15 9.75 11.38 9.61C11.6 9.47 11.87 9.41 12.21 9.4C12.42 9.41 12.61 9.45 12.78 9.52C12.96 9.6 13.13 9.71 13.25 9.85C13.38 9.99 13.48 10.15 13.56 10.33C13.64 10.51 13.68 10.71 13.69 10.91L15.32 10.91C15.3 10.48 15.22 10.09 15.06 9.73C14.91 9.37 14.7 9.06 14.42 8.81C14.14 8.56 13.82 8.35 13.44 8.21C13.07 8.06 12.65 8 12.18 8C11.59 8 11.07 8.1 10.63 8.31C10.19 8.52 9.83 8.79 9.54 9.15C9.25 9.5 9.03 9.91 8.89 10.39C8.75 10.87 8.67 11.36 8.67 11.88L8.67 12.13C8.67 12.66 8.74 13.15 8.88 13.62C9.02 14.09 9.24 14.5 9.53 14.85C9.82 15.2 10.19 15.48 10.62 15.68C11.06 15.88 11.58 15.99 12.17 15.99C12.6 15.99 13 15.92 13.37 15.78C13.74 15.64 14.07 15.45 14.35 15.21C14.63 14.96 14.86 14.68 15.02 14.35C15.18 14.02 15.28 13.68 15.29 13.3L13.66 13.3C13.65 13.49 13.61 13.66 13.52 13.83C13.43 14 13.33 14.13 13.19 14.25C13.05 14.37 12.9 14.46 12.72 14.52C12.55 14.58 12.36 14.6 12.17 14.61C11.84 14.6 11.57 14.54 11.36 14.4C11.13 14.25 10.95 14.06 10.82 13.84C10.69 13.61 10.59 13.34 10.55 13.04C10.51 12.74 10.48 12.43 10.48 12.13L10.48 11.88C10.5 11.56 10.52 11.26 10.57 10.96ZM12 3C16.96 3 21 7.04 21 12C21 16.96 16.96 21 12 21C7.04 21 3 16.96 3 12C3 7.04 7.04 3 12 3ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"] {
d: path("M11.88 9.14c1.28.06 1.61 1.15 1.63 1.66h1.79c-.08-1.98-1.49-3.19-3.45-3.19C9.64 7.61 8 9 8 12.14c0 1.94.93 4.24 3.84 4.24 2.22 0 3.41-1.65 3.44-2.95h-1.79c-.03.59-.45 1.38-1.63 1.44-1.31-.04-1.86-1.06-1.86-2.73 0-2.89 1.28-2.98 1.88-3zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z");
}
[d*="M12 21.9998C17.5228 21.9998 22 17.5226 22 11.9998C22 6.47691 17.5228 1.99976 12 1.99976C6.47715 1.99976 2 6.47691 2 11.9998C2 17.5226 6.47715 21.9998 12 21.9998ZM10.8399 10.1698C10.7199 10.3998 10.6199 10.6598 10.5699 10.9598C10.5199 11.2598 10.4999 11.5598 10.4799 11.8798V12.1298C10.4799 12.4298 10.5099 12.7398 10.5499 13.0398C10.5899 13.3398 10.6899 13.6098 10.8199 13.8398C10.9499 14.0598 11.1299 14.2498 11.3599 14.3998C11.5699 14.5398 11.8399 14.5998 12.1699 14.6098C12.3599 14.5998 12.5499 14.5798 12.7199 14.5198C12.8999 14.4598 13.0499 14.3698 13.1899 14.2498C13.3299 14.1298 13.4299 13.9998 13.5199 13.8298C13.6099 13.6598 13.6499 13.4898 13.6599 13.2998H15.2899C15.2799 13.6798 15.1799 14.0198 15.0199 14.3498C14.8599 14.6798 14.6299 14.9598 14.3499 15.2098C14.0699 15.4498 13.7399 15.6398 13.3699 15.7798C12.9999 15.9198 12.5999 15.9898 12.1699 15.9898C11.5799 15.9898 11.0599 15.8798 10.6199 15.6798C10.1899 15.4798 9.81992 15.1998 9.52992 14.8498C9.23992 14.4998 9.01992 14.0898 8.87992 13.6198C8.73992 13.1498 8.66992 12.6598 8.66992 12.1298V11.8798C8.66992 11.3598 8.74992 10.8698 8.88992 10.3898C9.02992 9.90976 9.24992 9.49976 9.53992 9.14976C9.82992 8.78976 10.1899 8.51976 10.6299 8.30976C11.0699 8.09976 11.5899 7.99976 12.1799 7.99976C12.6499 7.99976 13.0699 8.05976 13.4399 8.20976C13.8199 8.34976 14.1399 8.55976 14.4199 8.80976C14.6999 9.05976 14.9099 9.36975 15.0599 9.72975C15.2199 10.0898 15.2999 10.4798 15.3199 10.9098H13.6899C13.6799 10.7098 13.6399 10.5098 13.5599 10.3298C13.4799 10.1498 13.3799 9.98976 13.2499 9.84976C13.1299 9.70976 12.9599 9.59976 12.7799 9.51976C12.6099 9.44976 12.4199 9.40976 12.2099 9.39976C11.8699 9.40976 11.5999 9.46976 11.3799 9.60976C11.1499 9.74976 10.9599 9.93976 10.8399 10.1698Z"] {
d: path("M11.88 9.14c1.28.06 1.61 1.15 1.63 1.66h1.79c-.08-1.98-1.49-3.19-3.45-3.19C9.64 7.61 8 9 8 12.14c0 1.94.93 4.24 3.84 4.24 2.22 0 3.41-1.65 3.44-2.95h-1.79c-.03.59-.45 1.38-1.63 1.44-1.31-.04-1.86-1.06-1.86-2.73 0-2.89 1.28-2.98 1.88-3zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z");
}
[d*="M8 7V10C8 10.55 8.45 11 9 11H15C16.1 11 17 11.9 17 13V17C17 18.1 16.1 19 15 19H13V21H11V19H7V18H15C15.55 18 16 17.55 16 17V13C16 12.45 15.55 12 15 12H9C7.9 12 7 11.1 7 10V7C7 5.9 7.9 5 9 5H11V3H13V5H17V6H9C8.45 6 8 6.45 8 7Z"] {
d: path("M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z");
}
[d*="M9 7V11H15C16.1 11 17 11.9 17 13V17C17 18.1 16.1 19 15 19H13V21H11V19H7V17H15V13H9C7.9 13 7 12.1 7 11V7C7 5.9 7.9 5 9 5H11V3H13V5H17V7H9Z"] {
d: path("M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z");
}
[d*="M6.71 7.2L7.89 5.1L6.71 3L8.81 4.18L10.91 3L9.74 5.1L10.92 7.2L8.82 6.02L6.71 7.2ZM18.9 14.26L16.8 13.08L17.98 15.18L16.8 17.28L18.9 16.1L21 17.28L19.82 15.18L21 13.08L18.9 14.26ZM21 3L18.9 4.18L16.8 3L17.98 5.1L16.8 7.2L18.9 6.02L21 7.2L19.82 5.1L21 3ZM17.14 10.02L6.15 21L3 17.85L14 6.85L17.14 10.02ZM6.15 19.59L13.7 12.04L11.96 10.3L4.41 17.85L6.15 19.59Z"] {
d: path("M7.5 5.6 10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29a.9959.9959 0 0 0-1.41 0L1.29 18.96c-.39.39-.39 1.02 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05c.39-.39.39-1.02 0-1.41l-2.33-2.35zm-1.03 5.49-2.12-2.12 2.44-2.44 2.12 2.12-2.44 2.44z");
}
[d*="M8.81 6.03L10.91 7.21L9.74 5.1L10.91 3L8.81 4.18L6.71 3L7.89 5.1L6.71 7.2L8.81 6.03ZM18.9 14.26L16.8 13.08L17.98 15.18L16.8 17.28L18.9 16.1L21 17.28L19.82 15.18L21 13.08L18.9 14.26ZM21 3L18.9 4.18L16.8 3L17.98 5.1L16.8 7.2L18.9 6.02L21 7.2L19.82 5.1L21 3ZM17.14 10.02L14 6.85L3 17.85L6.15 21L17.14 10.02ZM13.72 12.06L11.94 10.28L13.99 8.23L15.77 10.01L13.72 12.06Z"] {
d: path("M7.5 5.6 10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29a.9959.9959 0 0 0-1.41 0L1.29 18.96c-.39.39-.39 1.02 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05c.39-.39.39-1.02 0-1.41l-2.33-2.35zm-1.03 5.49-2.12-2.12 2.44-2.44 2.12 2.12-2.44 2.44z");
}
[d*="M16 6L16 8L14 8L14 13C14 14.1 13.1 15 12 15C10.9 15 10 14.1 10 13C10 11.9 10.9 11 12 11C12.37 11 12.7 11.11 13 11.28L13 6L16 6ZM18 20L4 20L4 6L3 6L3 21L18 21L18 20ZM21 3L6 3L6 18L21 18L21 3ZM7 4L20 4L20 17L7 17L7 4Z"] {
d: path("M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 5h-3v5.5c0 1.38-1.12 2.5-2.5 2.5S10 13.88 10 12.5s1.12-2.5 2.5-2.5c.57 0 1.08.19 1.5.51V5h4v2zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z");
}
[d*="M18 21L3 21L3 6L4 6L4 20L18 20L18 21ZM21 3L21 18L6 18L6 3L21 3ZM16 6L13 6L13 11.28C12.7 11.11 12.37 11 12 11C10.9 11 10 11.9 10 13C10 14.1 10.9 15 12 15C13.1 15 14 14.1 14 13L14 8L16 8L16 6Z"] {
d: path("M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 5h-3v5.5c0 1.38-1.12 2.5-2.5 2.5S10 13.88 10 12.5s1.12-2.5 2.5-2.5c.57 0 1.08.19 1.5.51V5h4v2zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z");
}
[d*="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,8c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4 S14.21,8,12,8L12,8z M13.22,3l0.55,2.2l0.13,0.51l0.5,0.18c0.61,0.23,1.19,0.56,1.72,0.98l0.4,0.32l0.5-0.14l2.17-0.62l1.22,2.11 l-1.63,1.59l-0.37,0.36l0.08,0.51c0.05,0.32,0.08,0.64,0.08,0.98s-0.03,0.66-0.08,0.98l-0.08,0.51l0.37,0.36l1.63,1.59l-1.22,2.11 l-2.17-0.62l-0.5-0.14l-0.4,0.32c-0.53,0.43-1.11,0.76-1.72,0.98l-0.5,0.18l-0.13,0.51L13.22,21h-2.44l-0.55-2.2l-0.13-0.51 l-0.5-0.18C9,17.88,8.42,17.55,7.88,17.12l-0.4-0.32l-0.5,0.14l-2.17,0.62L3.6,15.44l1.63-1.59l0.37-0.36l-0.08-0.51 C5.47,12.66,5.44,12.33,5.44,12s0.03-0.66,0.08-0.98l0.08-0.51l-0.37-0.36L3.6,8.56l1.22-2.11l2.17,0.62l0.5,0.14l0.4-0.32 C8.42,6.45,9,6.12,9.61,5.9l0.5-0.18l0.13-0.51L10.78,3H13.22 M14,2h-4L9.26,4.96c-0.73,0.27-1.4,0.66-2,1.14L4.34,5.27l-2,3.46 l2.19,2.13C4.47,11.23,4.44,11.61,4.44,12s0.03,0.77,0.09,1.14l-2.19,2.13l2,3.46l2.92-0.83c0.6,0.48,1.27,0.87,2,1.14L10,22h4 l0.74-2.96c0.73-0.27,1.4-0.66,2-1.14l2.92,0.83l2-3.46l-2.19-2.13c0.06-0.37,0.09-0.75,0.09-1.14s-0.03-0.77-0.09-1.14l2.19-2.13 l-2-3.46L16.74,6.1c-0.6-0.48-1.27-0.87-2-1.14L14,2L14,2z"] {
d: path("M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z");
}
[d*="M13,14h-2v-2h2V14z M13,5h-2v6h2V5z M19,3H5v16.59l3.29-3.29L8.59,16H9h10V3 M20,2v15H9l-5,5V2H20L20,2z"] {
d: path("M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z");
}
[d*="M20.87,20.17l-5.59-5.59C16.35,13.35,17,11.75,17,10c0-3.87-3.13-7-7-7s-7,3.13-7,7s3.13,7,7,7c1.75,0,3.35-0.65,4.58-1.71 l5.59,5.59L20.87,20.17z M10,16c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S13.31,16,10,16z"] {
d: path("M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z");
}
[d*="M20.87 20.17L15.28 14.58C16.35 13.35 17 11.75 17 10C17 6.13 13.87 3 10 3C6.13 3 3 6.13 3 10C3 13.87 6.13 17 10 17C11.75 17 13.35 16.35 14.58 15.29L20.17 20.88L20.87 20.17ZM10 16C6.69 16 4 13.31 4 10C4 6.69 6.69 4 10 4C13.31 4 16 6.69 16 10C16 13.31 13.31 16 10 16Z"] {
d: path("M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z");
}
[d*="M15.36,9.96c0,1.09-0.67,1.67-1.31,2.24c-0.53,0.47-1.03,0.9-1.16,1.6L12.85,14h-1.75l0.03-0.28 c0.14-1.17,0.8-1.76,1.47-2.27c0.52-0.4,1.01-0.77,1.01-1.49c0-0.51-0.23-0.97-0.63-1.29c-0.4-0.31-0.92-0.42-1.42-0.29 c-0.59,0.15-1.05,0.67-1.19,1.34L10.32,10H8.57l0.06-0.42c0.2-1.4,1.15-2.53,2.42-2.87c1.05-0.29,2.14-0.08,2.98,0.57 C14.88,7.92,15.36,8.9,15.36,9.96z M12,18c0.55,0,1-0.45,1-1s-0.45-1-1-1s-1,0.45-1,1S11.45,18,12,18z M12,3c-4.96,0-9,4.04-9,9 s4.04,9,9,9s9-4.04,9-9S16.96,3,12,3 M12,2c5.52,0,10,4.48,10,10s-4.48,10-10,10S2,17.52,2,12S6.48,2,12,2L12,2z"] {
d: path("M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z");
}
[d*="M14,13h-3v3H9v-3H6v-2h3V8h2v3h3V13z M17,6H3v12h14v-6.39l4,1.83V8.56l-4,1.83V6 M18,5v3.83L22,7v8l-4-1.83V19H2V5H18L18,5 z"] {
d: path("M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z");
}
[d*="M17,18v1H6V18ZM6.49,9l.71.71L11,5.91V16h1V5.91l3.8,3.81L16.51,9l-5-5Z"] {
d: path("M5 20h14v-2H5v2zm0-10h4v6h6v-6h4l-7-7-7 7z");
}
[d*="M14 11.9999C14 13.0999 13.1 13.9999 12 13.9999C10.9 13.9999 10 13.0999 10 11.9999C10 10.8999 10.9 9.99992 12 9.99992C13.1 9.99992 14 10.8999 14 11.9999ZM8.48 8.44992L7.77 7.74992C6.68 8.82992 6 10.3399 6 11.9999C6 13.6599 6.68 15.1699 7.77 16.2499L8.48 15.5399C7.57 14.6399 7 13.3899 7 11.9999C7 10.6099 7.57 9.35992 8.48 8.44992ZM16.23 7.74992L15.52 8.45992C16.43 9.35992 17 10.6099 17 11.9999C17 13.3899 16.43 14.6399 15.52 15.5499L16.23 16.2599C17.32 15.1699 18 13.6599 18 11.9999C18 10.3399 17.32 8.82992 16.23 7.74992ZM5.65 5.62992L4.95 4.91992C3.13 6.72992 2 9.23992 2 11.9999C2 14.7599 3.13 17.2699 4.95 19.0799L5.66 18.3699C4.02 16.7399 3 14.4899 3 11.9999C3 9.50992 4.02 7.25992 5.65 5.62992ZM19.05 4.91992L18.34 5.62992C19.98 7.25992 21 9.50992 21 11.9999C21 14.4899 19.98 16.7399 18.35 18.3699L19.06 19.0799C20.87 17.2699 22 14.7599 22 11.9999C22 9.23992 20.87 6.72992 19.05 4.91992Z"] {
d: path("M16.94 6.91l-1.41 1.45c.9.94 1.46 2.22 1.46 3.64s-.56 2.71-1.46 3.64l1.41 1.45c1.27-1.31 2.05-3.11 2.05-5.09s-.78-3.79-2.05-5.09zM19.77 4l-1.41 1.45C19.98 7.13 21 9.44 21 12.01c0 2.57-1.01 4.88-2.64 6.54l1.4 1.45c2.01-2.04 3.24-4.87 3.24-7.99 0-3.13-1.23-5.96-3.23-8.01zM7.06 6.91c-1.27 1.3-2.05 3.1-2.05 5.09s.78 3.79 2.05 5.09l1.41-1.45c-.9-.94-1.46-2.22-1.46-3.64s.56-2.71 1.46-3.64L7.06 6.91zM5.64 5.45L4.24 4C2.23 6.04 1 8.87 1 11.99c0 3.13 1.23 5.96 3.23 8.01l1.41-1.45C4.02 16.87 3 14.56 3 11.99s1.01-4.88 2.64-6.54z M12,9a3,3,0,1,1-3,3,3,3,0,0,1,3-3");
}
[d*="M22,13h-4v4h-2v-4h-4v-2h4V7h2v4h4V13z M14,7H2v1h12V7z M2,12h8v-1H2V12z M2,16h8v-1H2V16z"] {
d: path("M14 10H3v2h11v-2zm0-4H3v2h11V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM3 16h7v-2H3v2z");
}
[d*="M6,12c0-3.31,2.69-6,6-6s6,2.69,6,6c0,1.66-0.67,3.16-1.77,4.25l-0.71-0.71C16.44,14.63,17,13.38,17,12c0-2.76-2.24-5-5-5"] {
d: path("M14 12c0 .74-.4 1.38-1 1.72V22h-2v-8.28c-.6-.35-1-.98-1-1.72 0-1.1.9-2 2-2s2 .9 2 2zm-2-6c-3.31 0-6 2.69-6 6 0 1.74.75 3.31 1.94 4.4l1.42-1.42C8.53 14.25 8 13.19 8 12c0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.19-.53 2.25-1.36 2.98l1.42 1.42C17.25 15.31 18 13.74 18 12c0-3.31-2.69-6-6-6zm0-4C6.48 2 2 6.48 2 12c0 2.85 1.2 5.41 3.11 7.24l1.42-1.42C4.98 16.36 4 14.29 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 2.29-.98 4.36-2.53 5.82l1.42 1.42C20.8 17.41 22 14.85 22 12c0-5.52-4.48-10-10-10z");
}
[d*="M3,3v18h18V3H3z M4.99,20c0.39-2.62,2.38-5.1,7.01-5.1s6.62,2.48,7.01,5.1H4.99z M9,10c0-1.65,1.35-3,3-3s3,1.35,3,3 c0,1.65-1.35,3-3,3S9,11.65,9,10z M12.72,13.93C14.58,13.59,16,11.96,16,10c0-2.21-1.79-4-4-4c-2.21,0-4,1.79-4,4 c0,1.96,1.42,3.59,3.28,3.93c-4.42,0.25-6.84,2.8-7.28,6V4h16v15.93C19.56,16.73,17.14,14.18,12.72,13.93z"] {
d: path("M3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z");
}
[d*="M10,9.35,15,12l-5,2.65ZM12,6a54.36,54.36,0,0,0-7.56.38A1.53,1.53,0,0,0,3.38,7.44,24.63,24.63,0,0,0,3,12a24.63,24.63,0,0,0,.38,4.56,1.53,1.53,0,0,0,1.06,1.06A54.36,54.36,0,0,0,12,18a54.36,54.36,0,0,0,7.56-.38,1.53,1.53,0,0,0,1.06-1.06A24.63,24.63,0,0,0,21,12a24.63,24.63,0,0,0-.38-4.56,1.53,1.53,0,0,0-1.06-1.06A54.36,54.36,0,0,0,12,6h0m0-1s6.25,0,7.81.42a2.51,2.51,0,0,1,1.77,1.77A25.87,25.87,0,0,1,22,12a25.87,25.87,0,0,1-.42,4.81,2.51,2.51,0,0,1-1.77,1.77C18.25,19,12,19,12,19s-6.25,0-7.81-.42a2.51,2.51,0,0,1-1.77-1.77A25.87,25.87,0,0,1,2,12a25.87,25.87,0,0,1,.42-4.81A2.51,2.51,0,0,1,4.19,5.42C5.75,5,12,5,12,5Z"] {
d: path("M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z");
}
[d*="M4,20h14v1H3V6h1V20z M6,3v15h15V3H6z M8.02,17c0.36-2.13,1.93-4.1,5.48-4.1s5.12,1.97,5.48,4.1H8.02z M11,8.5 C11,7.12,12.12,6,13.5,6S16,7.12,16,8.5c0,1.38-1.12,2.5-2.5,2.5S11,9.88,11,8.5z M14.21,11.93C15.8,11.6,17,10.19,17,8.5 C17,6.57,15.43,5,13.5,5S10,6.57,10,8.5c0,1.69,1.2,3.1,2.79,3.43c-3.48,0.26-5.4,2.42-5.78,5.07H7V4h13v13h-0.01 C19.61,14.35,17.68,12.19,14.21,11.93z"] {
d: path("M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h12zm-3 5c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3zm-9 8v1h12v-1c0-2-4-3.1-6-3.1S8 13 8 15z");
}
[d*="M13.72,11.93C15.58,11.59,17,9.96,17,8c0-2.21-1.79-4-4-4c-2.21,0-4,1.79-4,4c0,1.96,1.42,3.59,3.28,3.93 C6.77,12.21,4,15.76,4,20h18C22,15.76,19.23,12.21,13.72,11.93z M10,8c0-1.65,1.35-3,3-3s3,1.35,3,3s-1.35,3-3,3S10,9.65,10,8z M13,12.9c5.33,0,7.56,2.99,7.94,6.1H5.06C5.44,15.89,7.67,12.9,13,12.9z M4,12H2v-1h2V9h1v2h2v1H5v2H4V12z"] {
d: path("M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z");
}
[d*="M20,3v18H8v-1h11V4H8V3H20z M11.1,15.1l0.7,0.7l4.4-4.4l-4.4-4.4l-0.7,0.7l3.1,3.1H3v1h11.3L11.1,15.1z"] {
d: path("M10.09 15.59 11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z");
}
[d*="M12 22C10.93 22 9.86998 21.83 8.83998 21.48L7.41998 21.01L8.83998 20.54C12.53 19.31 15 15.88 15 12C15 8.12 12.53 4.69 8.83998 3.47L7.41998 2.99L8.83998 2.52C9.86998 2.17 10.93 2 12 2C17.51 2 22 6.49 22 12C22 17.51 17.51 22 12 22ZM10.58 20.89C11.05 20.96 11.53 21 12 21C16.96 21 21 16.96 21 12C21 7.04 16.96 3 12 3C11.53 3 11.05 3.04 10.58 3.11C13.88 4.81 16 8.21 16 12C16 15.79 13.88 19.19 10.58 20.89Z"] {
d: path("M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z");
}
[d*="M21,6H3V5h18V6z M18,11H6v1h12V11z M15,17H9v1h6V17z"] {
d: path("M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z");
}
[d*="M14.06 7.6L16.4 9.94L6.34 20H4V17.66L14.06 7.6ZM14.06 6.19L3 17.25V21H6.75L17.81 9.94L14.06 6.19ZM17.61 4.05L19.98 6.42L18.84 7.56L16.47 5.19L17.61 4.05ZM17.61 2.63L15.06 5.18L18.85 8.97001L21.4 6.42L17.61 2.63Z"] {
d: path("M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z");
}
[d*="M14.06,7.6l2.34,2.34L6.34,20H4v-2.34L14.06,7.6 M14.06,6.19L3,17.25V21h3.75L17.81,9.94L14.06,6.19L14.06,6.19z M17.61,4.05l2.37,2.37l-1.14,1.14l-2.37-2.37L17.61,4.05 M17.61,2.63l-2.55,2.55l3.79,3.79l2.55-2.55L17.61,2.63L17.61,2.63z"] {
d: path("M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z");
}
[d*="M12,16.5c0.83,0,1.5,0.67,1.5,1.5s-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5S11.17,16.5,12,16.5z M10.5,12 c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5s-0.67-1.5-1.5-1.5S10.5,11.17,10.5,12z M10.5,6c0,0.83,0.67,1.5,1.5,1.5 s1.5-0.67,1.5-1.5S12.83,4.5,12,4.5S10.5,5.17,10.5,6z"] {
d: path("M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z");
}
[d*="M15.01 7.34L16.65 8.98L8.64 17H6.99V15.36L15.01 7.34ZM15.01 5.92L5.99 14.94V18H9.05L18.07 8.98L15.01 5.92ZM17.91 4.43L19.58 6.1L18.91 6.77L17.24 5.1L17.91 4.43ZM17.91 3.02L15.83 5.1L18.92 8.19L21 6.11L17.91 3.02ZM21 10H20V20H4V4H14V3H3V21H21V10Z"] {
d: path("M18,10v8H6V6h8l2-2H6A2.15,2.15,0,0,0,4,6V18a2.15,2.15,0,0,0,2,2H18a2.15,2.15,0,0,0,2-2V8Z M8,14v2h2l7-7L15,7ZM19.15,6.85a.5.5,0,0,0,0-.71L17.85,4.85a.5.5,0,0,0-.71,0L16,6l2,2Z");
}
[d*="M17 14.9998C16.06 14.9998 15.23 15.4398 14.68 16.1198L9.74 13.2098C9.9 12.8398 10 12.4298 10 11.9998C10 11.5898 9.92 11.1898 9.76 10.8298L14.71 7.91976C15.26 8.56976 16.08 8.99976 17 8.99976C18.65 8.99976 20 7.64976 20 5.99976C20 4.34976 18.65 2.99976 17 2.99976C15.35 2.99976 14 4.34976 14 5.99976C14 6.36976 14.08 6.72976 14.2 7.05976L9.21 9.98976C8.66 9.38976 7.88 8.99976 7 8.99976C5.35 8.99976 4 10.3498 4 11.9998C4 13.6498 5.35 14.9998 7 14.9998C7.86 14.9998 8.63 14.6298 9.18 14.0498L14.19 16.9898C14.07 17.3098 14 17.6398 14 17.9998C14 19.6498 15.35 20.9998 17 20.9998C18.65 20.9998 20 19.6498 20 17.9998C20 16.3498 18.65 14.9998 17 14.9998ZM17 3.99976C18.1 3.99976 19 4.89976 19 5.99976C19 7.09976 18.1 7.99976 17 7.99976C15.9 7.99976 15 7.09976 15 5.99976C15 4.89976 15.9 3.99976 17 3.99976ZM7 13.9998C5.9 13.9998 5 13.0998 5 11.9998C5 10.8998 5.9 9.99976 7 9.99976C8.1 9.99976 9 10.8998 9 11.9998C9 13.0998 8.1 13.9998 7 13.9998ZM17 19.9998C15.9 19.9998 15 19.0998 15 17.9998C15 16.8998 15.9 15.9998 17 15.9998C18.1 15.9998 19 16.8998 19 17.9998C19 19.0998 18.1 19.9998 17 19.9998Z"] {
d: path("M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z");
}
[d*="M8 9.00003L14 5.00003V8.53519C15.1956 9.22681 16 10.5195 16 12.0001C16 13.4806 15.1956 14.7733 14 15.4649V19L8 15H7V19H5V15H2V9.00003H8ZM8.30278 10L13 6.86855V17.1315L8.30278 14H3V10H8.30278Z"] {
d: path("M18 11v2h4v-2h-4zm-2 6.61c.96.71 2.21 1.65 3.2 2.39.4-.53.8-1.07 1.2-1.6-.99-.74-2.24-1.68-3.2-2.4-.4.54-.8 1.08-1.2 1.61zM20.4 5.6c-.4-.53-.8-1.07-1.2-1.6-.99.74-2.24 1.68-3.2 2.4.4.53.8 1.07 1.2 1.6.96-.72 2.21-1.65 3.2-2.4zM4 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v4h2v-4h1l5 3V6L8 9H4zm11.5 3c0-1.33-.58-2.53-1.5-3.35v6.69c.92-.81 1.5-2.01 1.5-3.34z");
}
[d*="M17 18V19H6V18H17ZM16.5 11.4L15.8 10.7L12 14.4V4H11V14.4L7.2 10.6L6.5 11.3L11.5 16.3L16.5 11.4Z"] {
d: path("M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z");
}
[d*="M11,17H9V8h2V17z M15,8h-2v9h2V8z M19,4v1h-1v16H6V5H5V4h4V3h6v1H19z M17,5H7v15h10V5z"] {
d: path("M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z");
}
[d*="M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11H3v10h4h1h9.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z M7,20H4v-8h3V20z M19.98,13.17l-1.34,6 C18.54,19.65,18.03,20,17.43,20H8v-8.61l5.6-6.06C13.79,5.12,14.08,5,14.38,5c0.26,0,0.5,0.11,0.63,0.3 c0.07,0.1,0.15,0.26,0.09,0.47l-1.52,4.94L13.18,12h1.35h4.23c0.41,0,0.8,0.17,1.03,0.46C19.92,12.61,20.05,12.86,19.98,13.17z"] {
d: path("M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z");
}
[d*="M17,4h-1H6.57C5.5,4,4.59,4.67,4.38,5.61l-1.34,6C2.77,12.85,3.82,14,5.23,14h4.23l-1.52,4.94C7.62,19.97,8.46,21,9.62,21 c0.58,0,1.14-0.24,1.52-0.65L17,14h4V4H17z M10.4,19.67C10.21,19.88,9.92,20,9.62,20c-0.26,0-0.5-0.11-0.63-0.3 c-0.07-0.1-0.15-0.26-0.09-0.47l1.52-4.94l0.4-1.29H9.46H5.23c-0.41,0-0.8-0.17-1.03-0.46c-0.12-0.15-0.25-0.4-0.18-0.72l1.34-6 C5.46,5.35,5.97,5,6.57,5H16v8.61L10.4,19.67z M20,13h-3V5h3V13z"] {
d: path("M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z");
}
[d*="M12,8.91c1.7,0,3.09,1.39,3.09,3.09S13.7,15.09,12,15.09S8.91,13.7,8.91,12S10.3,8.91,12,8.91 M12,7.91 c-2.25,0-4.09,1.84-4.09,4.09s1.84,4.09,4.09,4.09s4.09-1.84,4.09-4.09S14.25,7.91,12,7.91L12,7.91z M12,6.18 c3.9,0,7.35,2.27,8.92,5.82c-1.56,3.55-5.02,5.82-8.92,5.82c-3.9,0-7.35-2.27-8.92-5.82C4.65,8.45,8.1,6.18,12,6.18 M12,5.18 C7.45,5.18,3.57,8.01,2,12c1.57,3.99,5.45,6.82,10,6.82s8.43-2.83,10-6.82C20.43,8.01,16.55,5.18,12,5.18L12,5.18z"] {
d: path("M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z");
}
[d*="M3.85,3.15L3.15,3.85L6.19,6.9C4.31,8.11,2.83,9.89,2,12c1.57,3.99,5.45,6.82,10,6.82c1.77,0,3.44-0.43,4.92-1.2l3.23,3.23 l0.71-0.71L3.85,3.15z M13.8,14.5c-0.51,0.37-1.13,0.59-1.8,0.59c-1.7,0-3.09-1.39-3.09-3.09c0-0.67,0.22-1.29,0.59-1.8L13.8,14.5z M12,17.82c-3.9,0-7.35-2.27-8.92-5.82c0.82-1.87,2.18-3.36,3.83-4.38L8.79,9.5c-0.54,0.69-0.88,1.56-0.88,2.5 c0,2.25,1.84,4.09,4.09,4.09c0.95,0,1.81-0.34,2.5-0.88l1.67,1.67C14.9,17.49,13.48,17.82,12,17.82z M11.49,7.95 c0.17-0.02,0.34-0.05,0.51-0.05c2.25,0,4.09,1.84,4.09,4.09c0,0.17-0.02,0.34-0.05,0.51l-1.01-1.01c-0.21-1.31-1.24-2.33-2.55-2.55 L11.49,7.95z M9.12,5.59C10.04,5.33,11,5.18,12,5.18c4.55,0,8.43,2.83,10,6.82c-0.58,1.47-1.48,2.78-2.61,3.85l-0.72-0.72 c0.93-0.87,1.71-1.92,2.25-3.13C19.35,8.45,15.9,6.18,12,6.18c-0.7,0-1.39,0.08-2.06,0.22L9.12,5.59z"] {
d: path("M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z");
}
[d*="M5 17V15H9V13H7C5.89 13 5 12.11 5 11V9C5 7.89 5.89 7 7 7H11V9H7V11H9C10.11 11 11 11.89 11 13V15C11 16.11 10.11 17 9 17H5ZM19 10V14C19 15.66 17.66 17 16 17H13V7H16C17.66 7 19 8.34 19 10ZM17 10C17 9.45 16.55 9 16 9H15V15H16C16.55 15 17 14.55 17 14V10ZM21 3V21H3V3H21ZM20 4H4V20H20V4Z"] {
d: path("M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-6 6h4c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1h-4V9zm-3.5 4.5v-1H7c-.55 0-1-.45-1-1V10c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1H9.5v-.5h-2v1H10c.55 0 1 .45 1 1V14c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-1h1.5v.5h2zm5 0h2v-3h-2v3z");
}
[d*="M3 3V21H21V3H3ZM20 20H4V4H20V20ZM16 7H13V17H16C17.66 17 19 15.66 19 14V10C19 8.34 17.66 7 16 7ZM15 15V9H16C16.55 9 17 9.45 17 10V14C17 14.55 16.55 15 16 15H15ZM11 7V17H9V13H7V17H5V7H7V11H9V7H11Z"] {
d: path("M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 12H9.5v-2h-2v2H6V9h1.5v2.5h2V9H11v6zm2-6h4c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1h-4V9zm1.5 4.5h2v-3h-2v3z");
}
[d*="M9 7H11V17H9V13H5V7H7V11H9V7ZM19 9.5V7H17V10C17 10.55 16.55 11 16 11H15V7H13V17H15V13H16C16.55 13 17 13.45 17 14V17H19V14.5C19 13.52 18.59 12.63 17.94 12C18.59 11.37 19 10.48 19 9.5ZM20 4H4V20H20V4ZM21 3V21H3V3H21Z"] {
d: path("M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 10.5h-1V15H9.5v-1.5h-3V9H8v3h1.5V9H11v3h1v1.5zm6 1.5h-1.75l-1.75-2.25V15H13V9h1.5v2.25L16.25 9H18l-2.25 3L18 15z");
}
[d*="M21,7h-2v2h-2V7h-2V5h2V3h2v2h2V7z M13,4v6v1h1h6v9H4V4H13 M14,3H3v18h18V10h-7V3L14,3z"] {
d: path("M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z");
}
[d*="M2 4.99982V18.9998H22V4.99982H2ZM21 5.99982V17.9998H3V5.99982H5L6.5 8.99982H9.5L8 5.99982H10L11.5 8.99982H14.5L13 5.99982H15L16.5 8.99982H19.5L18 5.99982H21Z"] {
d: path("m18 4 2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z");
}
[d*="M2 4.99982V18.9998H22V4.99982H2ZM6.5 8.99982L5 5.99982H8L9.5 8.99982H6.5ZM11.5 8.99982L10 5.99982H13L14.5 8.99982H11.5ZM16.5 8.99982L15 5.99982H18L19.5 8.99982H16.5Z"] {
d: path("m18 4 2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z");
}
[d*="M5,11h2v2H5V11z M15,15H5v2h10V15z M19,15h-2v2h2V15z M19,11H9v2h10V11z M22,6H2v14h20V6z M3,7h18v12H3V7z"] {
d: path("M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z");
}
[d*="M5,8h9v5H5V8z M22,5H2v14h20V5z M3,6h18v12H3V6z"] {
d: path("M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z");
}
[d*="M13,17h-2v-6h2V17z M13,7h-2v2h2V7z M12,3c-4.96,0-9,4.04-9,9s4.04,9,9,9c4.96,0,9-4.04,9-9S16.96,3,12,3 M12,2 c5.52,0,10,4.48,10,10s-4.48,10-10,10C6.48,22,2,17.52,2,12S6.48,2,12,2L12,2z"] {
d: path("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z");
}
[d*="M13.18,4l0.24,1.2L13.58,6h0.82H19v7h-5.18l-0.24-1.2L13.42,11H12.6H6V4H13.18 M14,3H5v18h1v-9h6.6l0.4,2h7V5h-5.6L14,3 L14,3z"] {
d: path("M14.4 6 14 4H5v17h2v-7h5.6l.4 2h7V6z");
}
[d*="M18.71,6C20.13,7.59,21,9.69,21,12c0,4.97-4.03,9-9,9c-2.31,0-4.41-0.87-6-2.29L18.71,6z M3,12 c0-4.97,4.03-9,9-9c2.31,0,4.41,0.87,6,2.29L5.29,18C3.87,16.41,3,14.31,3,12z M12,2c5.52,0,10,4.48,10,10c0,5.52-4.48,10-10,10 C6.48,22,2,17.52,2,12C2,6.48,6.48,2,12,2z"] {
d: path("M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zM4 12c0-4.4 3.6-8 8-8 1.8 0 3.5.6 4.9 1.7L5.7 16.9C4.6 15.5 4 13.8 4 12zm8 8c-1.8 0-3.5-.6-4.9-1.7L18.3 7.1C19.4 8.5 20 10.2 20 12c0 4.4-3.6 8-8 8z");
}
[d*="M10.51,14.74l-0.71-0.71l7.74-7.74L18.25,7L10.51,14.74z M7.31,17.24l-4.35-4.35l-0.71,0.71l4.35,4.35L7.31,17.24z M21.75,7 L21.04,6.3L10.45,16.88l-4-4l-0.71,0.71l4.71,4.71L21.75,7z"] {
d: path("m18 7-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41 6 19l1.41-1.41L1.83 12 .41 13.41z");
}
[d*="M20,18h-2v2h-1v-2h-2v-1h2v-2h1v2h2V18z M22,17.5c0,2.49-2.01,4.5-4.5,4.5c-1.11,0-2.11-0.42-2.9-1.08 c-0.78,0.47-1.61,0.83-2.49,1.05L12,22l-0.12-0.03c-2.43-0.61-4.53-2.26-5.95-4.44c-0.19-0.29-0.36-0.58-0.52-0.88 c-0.22-0.41-0.42-0.84-0.6-1.28C4.3,14.05,4,12.62,4,11.15V5.67L12,2l8,3.67v5.49c0,0.83-0.1,1.65-0.28,2.45 C21.07,14.38,22,15.83,22,17.5z M13.9,20.17C13.34,19.42,13,18.5,13,17.5c0-2.49,2.01-4.5,4.5-4.5c0.45,0,0.88,0.09,1.29,0.21 c0.14-0.68,0.21-1.37,0.21-2.05V6.31L12,3.1L5,6.31v4.84c0,1.3,0.25,2.6,0.75,3.86c0.15,0.37,0.33,0.76,0.55,1.17 c0.14,0.27,0.31,0.54,0.48,0.81C8.09,19,9.94,20.41,12,20.97C12.66,20.79,13.29,20.52,13.9,20.17z M21,17.5c0-1.93-1.57-3.5-3.5-3.5 S14,15.57,14,17.5s1.57,3.5,3.5,3.5S21,19.43,21,17.5z"] {
d: path("M13.22 22.61c-.4.15-.8.29-1.22.39-5.16-1.26-9-6.45-9-12V5l9-4 9 4v6c0 .9-.11 1.78-.3 2.65-.81-.41-1.73-.65-2.7-.65-3.31 0-6 2.69-6 6 0 1.36.46 2.61 1.22 3.61zM19 20v2.99s-1.99.01-2 0V20h-3v-2h3v-3h2v3h3v2h-3z");
}
[d*="M16.5,3C19.02,3,21,5.19,21,7.99c0,3.7-3.28,6.94-8.25,11.86L12,20.59l-0.74-0.73l-0.04-0.04C6.27,14.92,3,11.69,3,7.99 C3,5.19,4.98,3,7.5,3c1.4,0,2.79,0.71,3.71,1.89L12,5.9l0.79-1.01C13.71,3.71,15.1,3,16.5,3 M16.5,2c-1.74,0-3.41,0.88-4.5,2.28 C10.91,2.88,9.24,2,7.5,2C4.42,2,2,4.64,2,7.99c0,4.12,3.4,7.48,8.55,12.58L12,22l1.45-1.44C18.6,15.47,22,12.11,22,7.99 C22,4.64,19.58,2,16.5,2L16.5,2z"] {
d: path("m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z");
}
[d*="M9,18.7l-5.4-5.4l0.7-0.7L9,17.3L20.6,5.6l0.7,0.7L9,18.7z"] {
d: path("M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z");
}
[d*="M14.6,18.4L8.3,12l6.4-6.4l0.7,0.7L9.7,12l5.6,5.6L14.6,18.4z"] {
d: path("M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z");
}
[d*="M9.4,18.4l-0.7-0.7l5.6-5.6L8.6,6.4l0.7-0.7l6.4,6.4L9.4,18.4z"] {
d: path("M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z");
}
[d*="M12.7,12l6.6,6.6l-0.7,0.7L12,12.7l-6.6,6.6l-0.7-0.7l6.6-6.6L4.6,5.4l0.7-0.7l6.6,6.6l6.6-6.6l0.7,0.7L12.7,12z"] {
d: path("M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z");
}
[d*="M16.24,9.17L13.41,12l2.83,2.83l-1.41,1.41L12,13.41l-2.83,2.83l-1.41-1.41L10.59,12L7.76,9.17l1.41-1.41L12,10.59 l2.83-2.83L16.24,9.17z M4.93,4.93c-3.91,3.91-3.91,10.24,0,14.14c3.91,3.91,10.24,3.91,14.14,0c3.91-3.91,3.91-10.24,0-14.14 C15.17,1.02,8.83,1.02,4.93,4.93z M18.36,5.64c3.51,3.51,3.51,9.22,0,12.73s-9.22,3.51-12.73,0s-3.51-9.22,0-12.73 C9.15,2.13,14.85,2.13,18.36,5.64z"] {
d: path("M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z");
}
[d*="M21,11v1H5.64l6.72,6.72l-0.71,0.71L3.72,11.5l7.92-7.92l0.71,0.71L5.64,11H21z"] {
d: path("M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z");
}
[d*="M21,21H3V3h9v1H4v16h16v-8h1V21z M15,3v1h4.32l-8.03,8.03L12,12.74l8-8V9h1V3H15z"] {
d: path("M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z");
}
[d*="M9.8,17.3l-4.2-4.1L7,11.8l2.8,2.7L17,7.4l1.4,1.4L9.8,17.3z M12,3c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S17,3,12,3 M12,2 c5.5,0,10,4.5,10,10s-4.5,10-10,10S2,17.5,2,12S6.5,2,12,2L12,2z"] {
d: path("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z");
}
[d*="M15.01,7.34l1.64,1.64L8.64,17H6.99v-1.64L15.01,7.34 M15.01,5.92l-9.02,9.02V18h3.06l9.02-9.02L15.01,5.92L15.01,5.92z M17.91,4.43l1.67,1.67l-0.67,0.67L17.24,5.1L17.91,4.43 M17.91,3.02L15.83,5.1l3.09,3.09L21,6.11L17.91,3.02L17.91,3.02z M21,10h-1 v10H4V4h10V3H3v18h18V10z"] {
d: path("M18,10v8H6V6h8l2-2H6A2.15,2.15,0,0,0,4,6V18a2.15,2.15,0,0,0,2,2H18a2.15,2.15,0,0,0,2-2V8Z M8,14v2h2l7-7L15,7ZM19.15,6.85a.5.5,0,0,0,0-.71L17.85,4.85a.5.5,0,0,0-.71,0L16,6l2,2Z");
}
[d*="M22,7H2v1h20V7z M13,12H2v-1h11V12z M13,16H2v-1h11V16z M15,19v-8l7,4L15,19z"] {
d: path("M3 10h11v2H3zm0-4h11v2H3zm0 8h7v2H3zm13-1v8l6-4z");
}
[d*="M19.41,14l2.29,2.29l-1.41,1.41L18,15.41l-2.29,2.29l-1.41-1.41L16.59,14l-2.29-2.29l1.41-1.41L18,12.59l2.29-2.29 l1.41,1.41L19.41,14z M22,8H2V7h20V8z M13,11H2v1h11V11z M13,15H2v1h11V15z"] {
d: path("M14 10H3v2h11v-2zm0-4H3v2h11V6zM3 16h7v-2H3v2zm11.41 6L17 19.41 19.59 22 21 20.59 18.41 18 21 15.41 19.59 14 17 16.59 14.41 14 13 15.41 15.59 18 13 20.59 14.41 22z");
}
[d*="M7,6H6v12h1V6z M17.35,17.65L11.71,12l5.65-5.65l0.71,0.71L13.12,12l4.94,4.94L17.35,17.65z"] {
d: path("M18.41 16.59 13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z");
}
[d*="M18,18h-1V6h1V18z M5.65,7.06L10.59,12l-4.94,4.94l0.71,0.71L12,12L6.36,6.35L5.65,7.06z"] {
d: path("M5.59 7.41 10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z");
}
[d*="M16,14v3h-1v-3H16z M11,7v10h1V7H11z M7,10v7h1v-7H7z"] {
d: path("M4 9h4v11H4zm12 4h4v7h-4zm-6-9h4v16h-4z");
}
[d*="M18,8.83V5H2v14h16v-5.83L22,15V7L18,8.83z M21,13.44l-2.58-1.18L17,11.61v1.56V18H3V6h14v2.83v1.56l1.42-0.65L21,8.56 V13.44z"] {
d: path("M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z");
}
[d*="M12 4V13.38C11.27 12.54 10.2 12 9 12C6.79 12 5 13.79 5 16C5 18.21 6.79 20 9 20C11.21 20 13 18.21 13 16V8H19V4H12ZM9 19C7.34 19 6 17.66 6 16C6 14.34 7.34 13 9 13C10.66 13 12 14.34 12 16C12 17.66 10.66 19 9 19ZM18 7H13V5H18V7Z"] {
d: path("M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z");
}
[d*="M11.5858 7L9.58579 5H3V19H21V7H11.5858ZM22 6V20H2V4H10L12 6H22Z"] {
d: path("M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z");
}
[d*="M13,13h-2V7h2V13z M13,17h-2v-2h2V17z M15.59,3L21,8.41v7.17L15.59,21H8.41L3,15.59V8.41L8.41,3H15.59 M16,2H8L2,8v8l6,6h8"] {
d: path("M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM12 17.3c-.72 0-1.3-.58-1.3-1.3 0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3 0 .72-.58 1.3-1.3 1.3zm1-4.3h-2V7h2v6z");
}
[d*="M2,5v14h20V5H2z M21,6v0.88l-9,6.8l-9-6.8V6H21z M3,18V8.13l9,6.8l9-6.8V18H3z"] {
d: path("M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z");
}
[d*="M4,21H3V3h1V21z M8,15H6v2h2V15z M8,11H6v2h2V11z M8,7H6v2h2V7z M18,15h-2v2h2V15z M8,19H6v2h2V19z M18,19h-2v2h2V19z M18,11h-2v2h2V11z M18,7h-2v2h2V7z M8,3H6v2h2V3z M18,3h-2v2h2V3z M21,3h-1v18h1V3z"] {
d: path("M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z");
}
[d*="M2,5v14h20V5H2z M21,6v12H3V6h2l1,3h3L8,6h2l1,3h3l-1-3h2l1,3h3l-1-3H21z M6,14l2.34-0.66L9,11l0.66,2.34L12,14l-2.34,0.66"] {
d: path("m18 4 2 3h-3l-2-3h-2l2 3h-3l-2-3H8l2 3H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4zm-6.75 11.25L10 18l-1.25-2.75L6 14l2.75-1.25L10 10l1.25 2.75L14 14l-2.75 1.25zm5.69-3.31L16 14l-.94-2.06L13 11l2.06-.94L16 8l.94 2.06L19 11l-2.06.94z");
}
[d*="M21,10H3V9h18V10z M21,14H3v1h18V14z"] {
d: path("M20 9H4v2h16V9zM4 15h16v-2H4v2z");
}
[d*="M20,12h-8v8h-1v-8H3v-1h8V3h1v8h8V12z"] {
d: path("M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z");
}
[d*="M19,6v15H8V6H19 M15,2H4v16h1V3h10V2L15,2z M20,5H7v17h13V5L20,5z"] {
d: path("M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z");
}
[d*="M8 7C8 7.55 7.55 8 7 8C6.45 8 6 7.55 6 7C6 6.45 6.45 6 7 6C7.55 6 8 6.45 8 7ZM7 16C6.45 16 6 16.45 6 17C6 17.55 6.45 18 7 18C7.55 18 8 17.55 8 17C8 16.45 7.55 16 7 16ZM10.79 8.23L21 18.44V20H17.73L11.97 14.24L10.7 15.51C10.89 15.97 11 16.47 11 17C11 19.21 9.21 21 7 21C4.79 21 3 19.21 3 17C3 14.79 4.79 13 7 13C7.42 13 7.81 13.08 8.19 13.2L9.56 11.83L8.45 10.72C8 10.89 7.51 11 7 11C4.79 11 3 9.21 3 7C3 4.79 4.79 3 7 3C9.21 3 11 4.79 11 7C11 7.43 10.91 7.84 10.79 8.23ZM10.08 8.94L9.65 8.5L9.84 7.92C9.95 7.58 10 7.28 10 7C10 5.35 8.65 4 7 4C5.35 4 4 5.35 4 7C4 8.65 5.35 10 7 10C7.36 10 7.73 9.93 8.09 9.79L8.7 9.55L9.16 10.01L10.27 11.12L10.98 11.83L10.27 12.54L8.9 13.91L8.47 14.34L7.89 14.16C7.55 14.05 7.27 14 7 14C5.35 14 4 15.35 4 17C4 18.65 5.35 20 7 20C8.65 20 10 18.65 10 17C10 16.62 9.93 16.25 9.78 15.88L9.53 15.27L10 14.8L11.27 13.53L11.98 12.82L12.69 13.53L18.15 19H20V18.85L10.08 8.94ZM17.73 4H21V5.56L15.48 11.08L13.07 8.67L17.73 4ZM18.15 5L14.48 8.67L15.48 9.67L20 5.15V5H18.15Z"] {
d: path("M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z");
}
[d*="M9.91,8.7l0.6,2.12l0.15,0.54l0.54,0.15l2.12,0.6l-2.12,0.6l-0.54,0.15l-0.15,0.54l-0.6,2.12l-0.6-2.12l-0.15-0.54 L8.62,12.7l-2.12-0.6l2.12-0.6l0.54-0.15l0.15-0.54L9.91,8.7 M9.91,5.01l-1.56,5.53L2.83,12.1l5.53,1.56l1.56,5.53l1.56-5.53 L17,12.1l-5.53-1.56L9.91,5.01L9.91,5.01z M16.72,16.81l-2.76,0.78l2.76,0.78l0.78,2.76l0.78-2.76l2.76-0.78l-2.76-0.78l-0.78-2.76 L16.72,16.81z M17.5,2.96l-0.78,2.76L13.96,6.5l2.76,0.78l0.78,2.76l0.78-2.76l2.76-0.78l-2.76-0.78L17.5,2.96z"] {
d: path("m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z");
}
[d*="M16,16H8v-2h8V16z M16,11h-2v2h2V11z M19,11h-2v2h2V11z M13,11h-2v2h2V11z M10,11H8v2h2V11z M7,11H5v2h2V11z M16,8h-2v2h2V8 z M19,8h-2v2h2V8z M13,8h-2v2h2V8z M10,8H8v2h2V8z M7,8H5v2h2V8z M22,5v14H2V5H22z M21,6H3v12h18V6z"] {
d: path("M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z");
}
[d*="M14,2H4v20h16V8L14,2z M14,3.4L18.6,8H14V3.4z M5,21V3h8v6h6v12H5z"] {
d: path("M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z");
}
[d*="M12.26,16.18l-2.93-2.87c-0.8,0.86-1.64,1.71-2.48,2.54L4.6,18.1L3.9,17.4l2.25-2.25c0.84-0.84,1.68-1.69,2.48-2.55 c-1.18-1.23-2.17-2.64-2.9-4.18L5.73,8.4h1.14c0.65,1.26,1.47,2.43,2.44,3.45c1.59-1.81,2.89-3.69,3.43-5.7H2.08v-1h6.65V3h1v2.15 h6.78v1h-2.73c-0.54,2.32-2.01,4.42-3.77,6.42l2.63,2.58C12.51,15.5,12.39,15.82,12.26,16.18z M21.51,21.01h-0.95l-1.12-3.04h-4.91 l-1.11,3.04h-0.96l4.09-10.81h0.87L21.51,21.01z M19.15,17.2l-2.17-5.89l-2.17,5.89H19.15z"] {
d: path("M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z");
}
[d*="M20.8504 20.1499L20.1404 20.8599L13.0004 13.7099L13.0004 15.9999C13.0004 18.2099 11.2104 19.9999 9.00039 19.9999C6.79039 19.9999 5.00039 18.2099 5.00039 15.9999C5.00039 13.7899 6.79039 11.9999 9.00039 11.9999C10.2004 11.9999 11.2704 12.5399 12.0004 13.3799L12.0004 12.7099L3.15039 3.84989L3.86039 3.13989L20.8504 20.1499ZM12.0004 15.9999C12.0004 14.3399 10.6604 12.9999 9.00039 12.9999C7.34039 12.9999 6.00039 14.3399 6.00039 15.9999C6.00039 17.6599 7.34039 18.9999 9.00039 18.9999C10.6604 18.9999 12.0004 17.6599 12.0004 15.9999ZM13.0004 9.45989L12.0004 8.45989L12.0004 3.99989L19.0004 3.99989L19.0004 7.99989L13.0004 7.99989L13.0004 9.45989ZM13.0004 6.99989L18.0004 6.99989L18.0004 4.99989L13.0004 4.99989L13.0004 6.99989Z"] {
d: path("M4.27 3 3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73L19.73 21 21 19.73 4.27 3zM14 7h4V3h-6v5.18l2 2z");
}
[d*="M12,10c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,10,12,10 M12,9c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4 S14.21,9,12,9L12,9z M14.59,5l1.71,1.71L16.59,7H17h4v12H3V7h4h0.41l0.29-0.29L9.41,5H14.59 M15,4H9L7,6H2v14h20V6h-5L15,4L15,4z"] {
d: path("M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z");
}
[d*="M5 9V20H19V9H5ZM17 13H12V18H17V13Z"] {
d: path("M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z");
}
[d*="M18 2V4H21V22H3V4H6V2H8V4H16V2H18ZM4 21H20V5H4V21Z"] {
display: none !important;
}
[d*="M2,5v14h20V5H2z M21,6v12H3V6h2l1,3h3L8,6h2l1,3h3l-1-3h2l1,3h3l-1-3H21z"] {
d: path("m18 4 2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z");
}
[d*="M18,4v15.06l-5.42-3.87L12,14.77l-0.58,0.42L6,19.06V4H18 M19,3H5v18l7-5l7,5V3L19,3z"] {
d: path("M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z");
}
[d*="M15,5.63L20.66,12L15,18.37V15v-1h-1c-3.96,0-7.14,1-9.75,3.09c1.84-4.07,5.11-6.4,9.89-7.1L15,9.86V9V5.63 M14,3v6 C6.22,10.13,3.11,15.33,2,21c2.78-3.97,6.44-6,12-6v6l8-9L14,3L14,3z"] {
d: path("M14 9V3L22 12L14 21V15C8.44 15 4.78 17.03 2 21C3.11 15.33 6.22 10.13 14 9Z");
}
[d*="M12,3.1l7,3.21v4.84c0,1.3-0.25,2.6-0.75,3.86c-0.15,0.37-0.33,0.76-0.55,1.17c-0.15,0.27-0.31,0.54-0.48,0.81 C15.91,19,14.06,20.41,12,20.97C9.94,20.41,8.09,19,6.77,16.99c-0.17-0.27-0.33-0.54-0.48-0.81c-0.22-0.41-0.4-0.79-0.55-1.17 C5.25,13.75,5,12.45,5,11.15V6.31L12,3.1 M12,2L4,5.67v5.49c0,1.47,0.3,2.9,0.81,4.22c0.17,0.44,0.37,0.86,0.6,1.28 c0.16,0.3,0.34,0.6,0.52,0.88c1.42,2.17,3.52,3.82,5.95,4.44L12,22l0.12-0.03c2.43-0.61,4.53-2.26,5.95-4.43 c0.19-0.29,0.36-0.58,0.52-0.88c0.22-0.41,0.43-0.84,0.6-1.28C19.7,14.05,20,12.62,20,11.15V5.67L12,2L12,2z"] {
d: path("M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z");
}
[d*="M12.73,11.93C14.59,11.58,16,9.96,16,8c0-2.21-1.79-4-4-4C9.79,4,8,5.79,8,8c0,1.96,1.41,3.58,3.27,3.93 C5.1,12.2,2,15.84,2,20h20C22,15.84,18.9,12.2,12.73,11.93z M9,8c0-1.65,1.35-3,3-3s3,1.35,3,3s-1.35,3-3,3S9,9.65,9,8z M12,12.9 c5.98,0,8.48,3.09,8.93,6.1H3.07C3.52,15.99,6.02,12.9,12,12.9z"] {
d: path("M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z");
}
[d*="M14.97,16.95L10,13.87V7h2v5.76l4.03,2.49L14.97,16.95z M12,3c-4.96,0-9,4.04-9,9s4.04,9,9,9s9-4.04,9-9S16.96,3,12,3 M12,2c5.52,0,10,4.48,10,10s-4.48,10-10,10S2,17.52,2,12S6.48,2,12,2L12,2z"] {
d: path("M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z");
}
[d*="M17,8V6.63C17,4.08,14.76,2,12,2S7,4.08,7,6.63V8H4v14h16V8H17z M8,6.63c0-2.02,1.79-3.66,4-3.66s4,1.64,4,3.66V8H8V6.63z M19,21H5V9h14V21z M12,12c-1.66,0-3,1.34-3,3s1.34,3,3,3s3-1.34,3-3S13.66,12,12,12z M12,17c-1.1,0-2-0.9-2-2c0-1.1,0.9-2,2-2 s2,0.9,2,2C14,16.1,13.1,17,12,17z"] {
d: path("M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z");
}
[d*="M17.7797 16H12.9997V15H17.7797C19.5797 15 21.0397 13.43 21.0397 11.5C21.0397 9.57 19.5797 8 17.7797 8H12.9997V7H17.7797C20.1297 7 22.0397 9.02 22.0397 11.5C22.0397 13.98 20.1297 16 17.7797 16ZM10.9997 15H6.18969C4.38969 15 2.92969 13.43 2.92969 11.5C2.92969 9.57 4.38969 8 6.18969 8H10.9997V7H6.18969C3.83969 7 1.92969 9.02 1.92969 11.5C1.92969 13.98 3.83969 16 6.18969 16H10.9997V15ZM15.9997 11H7.99969V12H15.9997V11Z"] {
d: path("M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z");
}
[d*="M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10s10-4.48,10-10C22,6.48,17.52,2,12,2z M3,12c0-0.7,0.09-1.37,0.24-2.02 L8,14.71v0.79c0,1.76,1.31,3.22,3,3.46v1.98C6.51,20.44,3,16.62,3,12z M11.5,18C10.12,18,9,16.88,9,15.5v-1.21l-5.43-5.4 C4.84,5.46,8.13,3,12,3c1.05,0,2.06,0.19,3,0.53V5c0,0.55-0.45,1-1,1h-3v2c0,0.55-0.45,1-1,1H8v3h6c0.55,0,1,0.45,1,1v4h2 c0.55,0,1,0.45,1,1v0.69C16.41,20.12,14.31,21,12,21v-3H11.5z M18.97,17.69C18.82,16.73,18,16,17,16h-1v-3c0-1.1-0.9-2-2-2H9v-1h1 c1.1,0,2-0.9,2-2V7h2c1.1,0,2-0.9,2-2V3.95c2.96,1.48,5,4.53,5,8.05C21,14.16,20.24,16.14,18.97,17.69z"] {
d: path("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z");
}
[d*="M2 4V18H8V20H16V18H22V4H2ZM21 17H3V5H21V17Z"] {
d: path("M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h3l-1 1v2h12v-2l-1-1h3c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H4V5h16v11z");
}
[d*="M12 18C13.6569 18 15 16.6569 15 15C15 13.3431 13.6569 12 12 12C10.3431 12 9 13.3431 9 15C9 16.6569 10.3431 18 12 18ZM12 17C13.1046 17 14 16.1046 14 15C14 13.8954 13.1046 13 12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17Z"] {
d: path("M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z");
}
[d*="M17 6.63V8H20V22H4V8H16V6.63C16 4.61 14.21 2.97 12 2.97C10.025 2.97 8.38544 4.27976 8.05907 6H7.04615C7.37894 3.74611 9.47121 2 12 2C14.76 2 17 4.08 17 6.63ZM5 21V9H19V21H5Z"] {
display: none !important;
}
[d*="M5 9H4V4H9V5H5V9ZM20 4H15V5H19V9H20V4ZM20 15H19V19H15V20H20V15ZM9 19H5V15H4V20H9V19Z"] {
d: path("M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z");
}
[d*="M9 19H7V5H9V19ZM17 5H15V19H17V5Z"] {
d: path("M6 19h4V5H6v14zm8-14v14h4V5h-4z");
}
[d*="M17.5 11.93C17.5 14.07 16 15.85 14 16.31V15.27C15.44 14.84 16.5 13.51 16.5 11.93C16.5 10.35 15.44 9.03 14 8.59V7.55C16 8.01 17.5 9.79 17.5 11.93ZM12 4V19.86L6.16 14.93H3V8.93H6.16L12 4ZM11 6.15L6.52 9.93H4V13.93H6.52L11 17.71V6.15ZM21 11.93C21 16.01 17.95 19.37 14 19.86V18.85C17.39 18.36 20 15.45 20 11.93C20 8.41 17.39 5.5 14 5.01V4C17.95 4.49 21 7.85 21 11.93Z"] {
d: path("M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z");
}
[d*="M 19.5 11.93 C 19.5 14.07 18 15.85 16 16.31 V 15.27 C 17.44 14.84 18.5 13.51 18.5 11.93 C 18.5 10.35 17.44 9.03 16 8.59 V 7.55 C 18 8.01 19.5 9.79 19.5 11.93 Z M 14 4 V 19.86 L 8.16 14.93 H 5 V 8.93 H 8.16 L 14 4 Z M 13 6.15 L 8.52 9.93 H 6 V 13.93 H 8.52 L 13 17.71 V 6.15 Z"] {
d: path("M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z");
}
[d*="M3.15 3.85014L7.32 8.02014L6.16 9.00014H3V15.0001H6.16L12 19.9301V12.7101L14.45 15.1601C14.3 15.2301 14.15 15.2901 14 15.3401V16.3801C14.43 16.2801 14.83 16.1101 15.2 15.9001L17.01 17.7101C16.13 18.3301 15.11 18.7501 14 18.9101V19.9201C15.39 19.7501 16.66 19.2101 17.73 18.4301L20.15 20.8501L20.86 20.1401L3.86 3.14014L3.15 3.85014ZM11 11.7101V17.7801L6.52 14.0001H4V10.0001H6.52L8.02 8.73014L11 11.7101ZM10.33 6.79014L9.62 6.08014L12 4.07014V8.46014L11 7.46014V6.22014L10.33 6.79014ZM14 8.66014V7.62014C16 8.08014 17.5 9.86014 17.5 12.0001C17.5 12.5801 17.37 13.1301 17.17 13.6401L16.38 12.8501C16.45 12.5801 16.5 12.3001 16.5 12.0001C16.5 10.4201 15.44 9.10014 14 8.66014ZM14 5.08014V4.07014C17.95 4.56014 21 7.92014 21 12.0001C21 13.5601 20.54 15.0101 19.77 16.2401L19.04 15.5101C19.65 14.4801 20 13.2801 20 12.0001C20 8.48014 17.39 5.57014 14 5.08014Z"] {
d: path("M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z");
}
[d*="M 10 10 H 4.676 V 8.669 H 8.669 V 4.676 H 10 V 10 Z M 20.648 8.669 H 16.655 V 4.676 H 15.324 V 10 H 20.648 V 8.669 Z M 16.655 16.655 H 20.648 V 15.324 H 15.324 V 20.648 H 16.655 V 16.655 Z M 10 15.324 H 4.676 V 16.655 H 8.669 V 20.648 H 10 V 15.324 Z"] {
d: path("M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z");
}
[d*="M14,11H6V9h8V11z M20.17,20.87l-5.59-5.59C13.35,16.35,11.75,17,10,17c-3.87,0-7-3.13-7-7c0-3.87,3.13-7,7-7s7,3.13,7,7 c0,1.75-0.65,3.35-1.71,4.58l5.59,5.59L20.17,20.87z M16,10c0-3.31-2.69-6-6-6s-6,2.69-6,6s2.69,6,6,6S16,13.31,16,10z"] {
d: path("M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z");
}
[d*="M14,11h-3v3H9v-3H6V9h3V6h2v3h3V11z M20.17,20.87l-5.59-5.59C13.35,16.35,11.75,17,10,17c-3.87,0-7-3.13-7-7 c0-3.87,3.13-7,7-7s7,3.13,7,7c0,1.75-0.65,3.35-1.71,4.58l5.59,5.59L20.17,20.87z M16,10c0-3.31-2.69-6-6-6s-6,2.69-6,6s2.69,6,6,6 S16,13.31,16,10z"] {
d: path("M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z");
}
[d*="M19.2001 14.02C19.2001 11.82 17.1001 9.99997 14.5101 9.99997H5.86012L9.29012 13.36L8.58012 14.07L3.87012 9.44997L8.58012 4.83997L9.28012 5.54997L5.76012 8.99997H14.5101C17.6501 8.99997 20.2001 11.27 20.2001 14.02C20.2001 16.77 17.6501 19 14.5101 19H6.07012V18H14.5101C17.1001 18 19.2001 16.21 19.2001 14.02Z"] {
d: path("M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z");
}
[d*="M9.56012 18H18.0001V19H9.56012C6.42012 19 3.87012 16.77 3.87012 14.02C3.87012 11.27 6.42012 8.99997 9.56012 8.99997H18.3101L14.7901 5.54997L15.4901 4.83997L20.2001 9.44997L15.4901 14.06L14.7801 13.35L18.2101 9.99997H9.56012C6.97012 9.99997 4.87012 11.82 4.87012 14.02C4.87012 16.21 6.97012 18 9.56012 18Z"] {
d: path("M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z");
}
[d*="M10,8v8l6-4L10,8L10,8z M12,3c4.96,0,9,4.04,9,9s-4.04,9-9,9s-9-4.04-9-9S7.04,3,12,3 M12,2C6.48,2,2,6.48,2,12 s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2L12,2z"] {
d: path("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 16.5v-9l7 4.5-7 4.5z");
}
[d*="M16 16H8V8H16V16Z"] {
d: path("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 14H8V8h8v8z");
}
[d*="M18.95,6.28C17.23,4.19,14.7,3,12,3h-1.43l1.02-1.02l-1.41-1.41L6.82,3.92l3.35,3.35l1.41-1.41L10.73,5H12 c2.1,0,4.07,0.93,5.4,2.55c1.34,1.62,1.87,3.76,1.46,5.86c-0.53,2.73-2.72,4.92-5.45,5.45c-2.11,0.41-4.24-0.12-5.86-1.46 C5.93,16.07,5,14.1,5,12H3c0,2.7,1.19,5.23,3.28,6.95C7.9,20.29,9.93,21,12.02,21c0.59,0,1.19-0.06,1.78-0.17 c3.52-0.68,6.35-3.51,7.03-7.03C21.35,11.1,20.66,8.36,18.95,6.28z M10,8H9.85L7,9.19v1.29l1.63-0.59V16H10V8z M16.35,8.84 C15.92,8.28,15.3,8,14.5,8s-1.42,0.28-1.85,0.84c-0.43,0.56-0.64,1.39-0.64,2.48v1.43c0.01,1.04,0.23,1.85,0.65,2.41 C13.09,15.72,13.7,16,14.51,16c0.82,0,1.43-0.29,1.86-0.86c0.42-0.57,0.63-1.39,0.63-2.47v-1.43C16.99,10.2,16.77,9.39,16.35,8.84z M15.53,12.95c-0.01,0.61-0.09,1.06-0.25,1.36c-0.16,0.3-0.42,0.44-0.78,0.44c-0.36,0-0.62-0.15-0.79-0.46 c-0.16-0.31-0.25-0.78-0.25-1.42v-1.89c0.01-0.6,0.1-1.03,0.26-1.31c0.16-0.28,0.42-0.42,0.76-0.42c0.36,0,0.62,0.15,0.78,0.44 c0.17,0.29,0.25,0.76,0.25,1.41V12.95z"] {
d: path("M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z M10.89 16h-.85v-3.26l-1.01.31v-.69l1.77-.63h.09V16zm4.28-1.76c0 .32-.03.6-.1.82s-.17.42-.29.57-.28.26-.45.33-.37.1-.59.1-.41-.03-.59-.1-.33-.18-.46-.33-.23-.34-.3-.57-.11-.5-.11-.82v-.74c0-.32.03-.6.1-.82s.17-.42.29-.57.28-.26.45-.33.37-.1.59-.1.41.03.59.1.33.18.46.33.23.34.3.57.11.5.11.82v.74zm-.85-.86c0-.19-.01-.35-.04-.48s-.07-.23-.12-.31-.11-.14-.19-.17-.16-.05-.25-.05-.18.02-.25.05-.14.09-.19.17-.09.18-.12.31-.04.29-.04.48v.97c0 .19.01.35.04.48s.07.24.12.32.11.14.19.17.16.05.25.05.18-.02.25-.05.14-.09.19-.17.09-.19.11-.32.04-.29.04-.48v-.97z");
}
[d*="M10.0007 16.0001H8.63066V9.89006L7.00066 10.4701V9.19006L9.85066 8.00006H10.0007V16.0001ZM17.0007 12.6701C17.0007 13.7501 16.7907 14.5701 16.3707 15.1401C15.9407 15.7101 15.3207 16.0001 14.5107 16.0001C13.7007 16.0001 13.0907 15.7201 12.6607 15.1601C12.2307 14.6001 12.0207 13.8001 12.0107 12.7501V11.3201C12.0107 10.2301 12.2207 9.41006 12.6507 8.84006C13.0807 8.28006 13.6907 8.00006 14.5007 8.00006C15.3107 8.00006 15.9207 8.28006 16.3507 8.84006C16.7807 9.40006 16.9907 10.2001 17.0007 11.2401V12.6701ZM15.5307 11.1001C15.5307 10.4501 15.4507 9.98006 15.2807 9.69006C15.1107 9.40006 14.8507 9.25006 14.5007 9.25006C14.1507 9.25006 13.9007 9.39006 13.7407 9.67006C13.5807 9.95006 13.4907 10.3901 13.4807 10.9801V12.8701C13.4807 13.5101 13.5607 13.9801 13.7307 14.2901C13.8907 14.6001 14.1607 14.7501 14.5207 14.7501C14.8807 14.7501 15.1407 14.6001 15.3007 14.3101C15.4607 14.0101 15.5407 13.5601 15.5507 12.9501V11.1001H15.5307ZM19.0007 12.0001C19.0007 14.1001 18.0707 16.0701 16.4507 17.4001C14.8307 18.7401 12.6907 19.2701 10.5907 18.8601C7.86066 18.3301 5.67066 16.1401 5.14066 13.4101C4.73066 11.3101 5.26066 9.17006 6.60066 7.55006C7.93066 5.93006 9.90066 5.00006 12.0007 5.00006H13.2707L12.4207 5.85006L13.8307 7.26006L17.1807 3.91006L13.8307 0.560059L12.4207 1.97006L13.4307 3.00006H12.0007C9.30066 3.00006 6.77066 4.19006 5.05066 6.28006C3.33066 8.36006 2.65066 11.1001 3.17066 13.8001C3.85066 17.3201 6.68066 20.1501 10.2007 20.8301C10.8007 20.9401 11.3907 21.0001 11.9807 21.0001C14.0707 21.0001 16.0907 20.2901 17.7207 18.9501C19.8107 17.2301 21.0007 14.7001 21.0007 12.0001H19.0007Z"] {
d: path("M18 13c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6v4l5-5-5-5v4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8h-2z M10.86 15.94v-4.27h-.09L9 12.3v.69l1.01-.31v3.26zm1.39-2.5v.74c0 1.9 1.31 1.82 1.44 1.82.14 0 1.44.09 1.44-1.82v-.74c0-1.9-1.31-1.82-1.44-1.82-.14 0-1.44-.09-1.44 1.82zm2.04-.12v.97c0 .77-.21 1.03-.59 1.03s-.6-.26-.6-1.03v-.97c0-.75.22-1.01.59-1.01.38-.01.6.26.6 1.01z");
}
[d*="M11,16H9V8h2V16z M15,8h-2v8h2V8z M12,3c4.96,0,9,4.04,9,9s-4.04,9-9,9s-9-4.04-9-9S7.04,3,12,3 M12,2C6.48,2,2,6.48,2,12 s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2L12,2z"] {
d: path("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z");
}
[d*="M19,6L9,12l10,6V6L19,6z M7,6H5v12h2V6z"] {
d: path("M6 6h2v12H6zm3.5 6 8.5 6V6z");
}
[d*="M5,18l10-6L5,6V18L5,18z M19,6h-2v12h2V6z"] {
d: path("m6 18 8.5-6L6 6v12zM16 6v12h2V6h-2z");
}
[d*="M6,4l12,8L6,20V4z"] {
d: path("M8 5v14l11-7z");
}
[d*="M6,9H2V5h1v1.8C3.9,5.1,5.7,4,7.7,4c2.8,0,5.1,2.2,5.3,5h-1c-0.3-2.2-2.1-3.9-4.3-3.9C5.8,5.1,4.2,6.3,3.6,8H6V9z M9,11h2.4  c-0.6,1.7-2.2,2.9-4.1,2.9c-2.2,0-4.1-1.7-4.3-3.9H2c0.3,2.8,2.5,5,5.3,5c2,0,3.7-1.1,4.7-2.8V14h1v-4H9V11z M22,10v2h-3v5.5  c0,1.4-1.1,2.5-2.5,2.5c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5c0.6,0,1.1,0.2,1.5,0.5l0,0V10H22z M18,17.5c0-0.8-0.7-1.5-1.5-1.5  S15,16.7,15,17.5s0.7,1.5,1.5,1.5S18,18.3,18,17.5z"] {
d: path("m7.6 4.1v-2.1l-2.8 2.8 2.8 2.8v-2.1c2.4 0 4.3 1.9 4.3 4.3 0 0.7-0.2 1.3-0.5 1.9l1 1.1c0.5-0.9 0.9-1.9 0.9-3 0-3.2-2.5-5.7-5.7-5.7zm0 9.9c-2.3 0-4.2-1.9-4.2-4.2 0-0.8 0.2-1.4 0.5-2l-1-1.1c-0.6 0.9-0.9 1.9-0.9 3.1 0 3.1 2.5 5.6 5.6 5.6v2.1l2.9-2.8-2.9-2.8z m18.2 8.3v7.3q-0.7-0.4-1.4-0.4c-1.6 0-2.8 1.2-2.8 2.8 0 1.5 1.2 2.7 2.8 2.7 1.5 0 2.8-1.2 2.8-2.7v-7h2.7v-2.7z");
}
[d*="M16,9H8V7h8V9z M13,11H8v2h5V11z M19,3H5v16.59l3.29-3.29L8.59,16H9h10V3 M20,2v15H9l-5,5V2H20L20,2z"] {
d: path("M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z");
}
[d*="M21.29 7.63A5.244 5.244 0 0 0 16.73 5c-.89 0-1.8.23-2.63.71L12 6.92 9.9 5.71C9.07 5.23 8.17 5 7.27 5c-1.82 0-3.59.94-4.56 2.63a5.264 5.264 0 0 0 1.93 7.19L12 19l7.36-4.17c2.52-1.46 3.39-4.68 1.93-7.2zm-17.72.5A4.296 4.296 0 0 1 7.27 6c.75 0 1.48.2 2.13.57 0 0 4.22 2.43 4.54 2.61.17.1.32.22.42.39.29.46.19 1.18-.43 1.49-.36.18-.72.16-1.07-.03-.35-.19-4.62-2.58-4.62-2.58l-1.07.6 1.04.6-4.68 2.65s-.3-.6-.38-.93c-.3-1.1-.15-2.25.42-3.24zm.58 5.02c1.43-.8 5.17-2.88 5.17-2.88l2.2 1.22-5.39 3.03-1-.57a4.19 4.19 0 0 1-.98-.8zm16.7-1.78c-.29 1.1-1 2.02-1.98 2.59L12 17.85l-1.62-.92 6-3.36c-.01-.02-.7-.41-1.04-.6l-6.01 3.37-2.13-1.21s5.31-2.97 5.32-2.98c.07-.05.14-.05.22-.02.52.17 1.03.16 1.53-.06.77-.33 1.22-.9 1.32-1.72.06-.47-.05-.91-.29-1.32-.19-.32-.47-.56-.79-.75-.4-.23-1.45-.81-1.45-.81l1.55-.9c.64-.37 1.37-.57 2.12-.57 1.52 0 2.94.82 3.7 2.13.57.99.72 2.14.42 3.24z"] {
d: path("M16.48 10.41c-.39.39-1.04.39-1.43 0l-4.47-4.46-7.05 7.04-.66-.63c-1.17-1.17-1.17-3.07 0-4.24l4.24-4.24c1.17-1.17 3.07-1.17 4.24 0L16.48 9c.39.39.39 1.02 0 1.41zm.7-2.12c.78.78.78 2.05 0 2.83-1.27 1.27-2.61.22-2.83 0l-3.76-3.76-5.57 5.57c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.42 0l4.62-4.62.71.71-4.62 4.62c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.42 0l4.62-4.62.71.71-4.62 4.62c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.62-4.62.71.71-4.62 4.62c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l8.32-8.34c1.17-1.17 1.17-3.07 0-4.24l-4.24-4.24c-1.15-1.15-3.01-1.17-4.18-.06l4.47 4.47z");
}
[d*="M3,11h3v10H3V11z M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11v10h10.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z"] {
d: path("M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z");
}
[d*="M18,4h3v10h-3V4z M5.23,14h4.23l-1.52,4.94C7.62,19.97,8.46,21,9.62,21c0.58,0,1.14-0.24,1.52-0.65L17,14V4H6.57 C5.5,4,4.59,4.67,4.38,5.61l-1.34,6C2.77,12.85,3.82,14,5.23,14z"] {
d: path("M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z");
}
}`;
if ((location.hostname === "studio.youtube.com" || location.hostname.endsWith(".studio.youtube.com"))) {
  css += `



  /*general*/
  html ::-webkit-scrollbar, html ::-webkit-scrollbar-thumb {
      border-radius:0;
      height:initial;
  }
  paper-ripple {
      display:none!important
  }
  * {
      letter-spacing:0!important
  }
  #progressContainer.tp-yt-paper-progress {
      background:transparent
  }
  .indeterminate.tp-yt-paper-progress::after, #primaryProgress.tp-yt-paper-progress {
      background:#cc181e
  }
  tp-yt-paper-progress.ytcp-header {
      top:0
  }
  /*overlay*/
  tp-yt-iron-overlay-backdrop, .popup-host-behavior-backdrop {
      background:rgba(255,255,255.2)!important;
  }
  /*tooltip*/
  ytcp-paper-tooltip-placeholder[type=truncation] #tooltip.ytcp-paper-tooltip-placeholder, ytcp-paper-tooltip-placeholder[type=label] #tooltip.ytcp-paper-tooltip-placeholder {
      border-radius:2px;
      background:#000;
      color:#fff;
      box-shadow:0 1px 1px rgba(0,0,0,.25);
      font-size:11px;
      padding:6px;
      line-height:1
  }
          /*general*/
  ytcp-paper-tooltip-placeholder[type=explanatory] #tooltip.ytcp-paper-tooltip-placeholder {
      border-radius:2px;
      background:#000;
      color:#fff;
      box-shadow:0 1px 1px rgba(0,0,0,.25);
      font-size:11px;
      padding:6px;
      line-height:1
  }
  ytcp-paper-tooltip-placeholder[type=explanatory] #tooltip.ytcp-paper-tooltip-placeholder > * * {
      padding:0;
      color:#fff;
      line-height:1;
  }
          /*copyright tt*/
  .title.ytcp-video-restrictions-tooltip-body, .description.ytcp-video-restrictions-tooltip-body {
      display:none
  }
  .content.ytcp-video-restrictions-tooltip-body {
      position:relative;
      top:06px;
      left:0px;
      background:#fff;
      padding:6px;
      box-shadow:0 1px 1px rgba(0,0,0,.25);
      line-height:1;
      border:1px solid #ebebeb
  }
  .content.ytcp-video-restrictions-tooltip-body .label.ytcp-button {
      text-transform:none;
      padding:0!important;
      line-height:1
  }
  ytcp-button.ytcp-video-restrictions-tooltip-body {
      min-height:0;
      height:auto;
      padding:0;
      margin:0
  }
  /*alert*/
  ytcp-banner[color-theme] .banner-icon.ytcp-banner {
      background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vflZyP8dK.webp) -243px -799px;
      background-size: auto;
      width: 20px;
      height: 21px;
  }
  ytcp-banner[color-theme] .banner-icon.ytcp-banner svg {
      fill:none
  }
  ytcp-banner[color-theme]:not([hide-border]) .container.ytcp-banner {
      border:0;
      background:#167ac6;
      max-height:36px
  }
  ytcp-banner {
      max-height:36px
  }
  ytcp-banner[color-theme] *, .pagination-text.ytcp-banner {
      --ytcp-themed-blue:#fff;
      color:#fff;
      font:500 13px roboto, arial;
      text-transform:none
  }
  ytcp-banner[color-theme] #message.ytcp-banner {
      line-height:16px
  }
  /*callout*/
  #callout.ytcp-feature-discovery-callout, #divot.ytcp-feature-discovery-callout {
      background:#167ac6;
      border-color:#167ac6;
      color:#fff;
      fill:#fff
  }
  #next-button.ytcp-feature-discovery-callout {
      color:#fff
  }
  /*button*/
  html {
      --ytcp-call-to-action-raised-background:#167ac6;
      --ytcp-call-to-action:#167ac6
  }
  ytcp-button[type=filled][disabled] {
      background:var(--ytcp-call-to-action-raised-background);
      opacity:.5
  }
  [studio-theme="DEFAULT"] ytcp-button[type="primary"][disabled] {
      opacity:.5
  }
  ytcp-button[type=filled], .suggestion.ytcp-suggestions, #hover-items.ytcp-playlist-row a.ytcp-playlist-row ytcp-icon-button, #create-playlist-buttons > ytcp-button, [studio-theme="DEFAULT"] ytcp-button[type="primary"], #cancel-button, #submit-button, .ytcp-video-metadata-editor .container.ytcp-dropdown-trigger, ytcp-video-list-cell-video[show-hover-items] .hover-item.ytcp-video-list-cell-video > ytcp-icon-button, .borderless.container.ytcp-dropdown-trigger, #save-button, ytcp-button.ytcp-video-list-cell-video-edit-dialog, [icon="icons:feedback"], #video-details[track-click].hover-item, #watch-on-yt[track-click].hover-item, .hover-item.ytcp-video-list-cell-video[icon="more-vert"], #dialog-buttons.ytcp-confirmation-dialog ytcp-button.ytcp-confirmation-dialog#confirm-button, [menu-style=multi-page-menu-style-type-account] yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(2) > a, ytd-toggle-theme-compact-link-renderer, ytls-user-experience-dialog[dialog-type=SELECT_SOURCE] #bottom-button.ytls-user-experience-dialog {
      display: inline-block;
      height: 28px;
      border: solid 1px transparent;
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
      text-transform:none;
      min-width:0;
      margin:0;
      transition:none;
      animation:initial;
      align-items:center;
  }
  ytcp-button[type=filled]:focus, #hover-items.ytcp-playlist-row a.ytcp-playlist-row ytcp-icon-button:focus, [studio-theme="DEFAULT"] ytcp-button[type="primary"]:focus, #cancel-button:focus, .ytcp-video-metadata-editor .container.ytcp-dropdown-trigger:focus, ytcp-video-list-cell-video[show-hover-items] .hover-item.ytcp-video-list-cell-video ytcp-icon-button:focus, .borderless.container.ytcp-dropdown-trigger:focus, #save-button:focus, ytcp-button.ytcp-video-list-cell-video-edit-dialog:focus, #video-details[track-click].hover-item:focus, .hover-item.ytcp-video-list-cell-video[icon="more-vert"]:focus, #watch-on-yt[track-click].hover-item:focus, [menu-style=multi-page-menu-style-type-account] yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(2) > a:focus, ytd-toggle-theme-compact-link-renderer:focus, ytls-user-experience-dialog[dialog-type=SELECT_SOURCE] #bottom-button.ytls-user-experience-dialog:focus {
      box-shadow: 0 0 0 2px rgb(27 127 204 / 40%);
  }
  #create-icon.ytcp-header, .suggestion.ytcp-suggestions, #hover-items.ytcp-playlist-row a.ytcp-playlist-row ytcp-icon-button, #create-playlist-buttons > ytcp-button, [studio-theme="DEFAULT"] ytcp-button[type="primary"], #cancel-button, .ytcp-video-metadata-editor .container.ytcp-dropdown-trigger, ytcp-video-list-cell-video[show-hover-items] .hover-item.ytcp-video-list-cell-video > ytcp-icon-button, ytcp-dropdown-trigger[dark] .container.ytcp-dropdown-trigger, ytcp-button.ytcp-video-list-cell-video-edit-dialog, #select-files-button.ytcp-uploads-file-picker, #video-details[track-click].hover-item, .hover-item.ytcp-video-list-cell-video[icon="more-vert"], #watch-on-yt[track-click].hover-item, [menu-style=multi-page-menu-style-type-account] yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(2) > a, ytd-toggle-theme-compact-link-renderer, ytls-user-experience-dialog[dialog-type=SELECT_SOURCE] #bottom-button.ytls-user-experience-dialog { /*uix default*/
      border-color: #d3d3d3;
      background: #f8f8f8;
      color: #333;
      border-radius:2px
  }
  #create-icon.ytcp-header:hover, .suggestion.ytcp-suggestions:hover, #hover-items.ytcp-playlist-row a.ytcp-playlist-row ytcp-icon-button:hover, #create-playlist-buttons > ytcp-button:hover, [studio-theme="DEFAULT"] ytcp-button[type="primary"]:hover, #cancel-button:hover, .ytcp-video-metadata-editor .container.ytcp-dropdown-trigger:hover,  ytcp-video-list-cell-video[show-hover-items] .hover-item.ytcp-video-list-cell-video > ytcp-icon-button:hover, ytcp-dropdown-trigger[dark] .container.ytcp-dropdown-trigger:hover, ytcp-button.ytcp-video-list-cell-video-edit-dialog:hover, #select-files-button.ytcp-uploads-file-picker:hover, #video-details[track-click].hover-item:hover, .hover-item.ytcp-video-list-cell-video[icon="more-vert"]:hover, #watch-on-yt[track-click].hover-item:hover, [menu-style=multi-page-menu-style-type-account] yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(2) > a:hover, ytd-toggle-theme-compact-link-renderer:hover, ytls-user-experience-dialog[dialog-type=SELECT_SOURCE] #bottom-button.ytls-user-experience-dialog:hover { /*uix default*/
      border-color: #c6c6c6;
      background: #f0f0f0;
      box-shadow: 0 1px 0 rgb(0 0 0 / 10%);
  }
  #create-icon.ytcp-header:active, .suggestion.ytcp-suggestions:active,  #hover-items.ytcp-playlist-row a.ytcp-playlist-row ytcp-icon-button:active, #create-playlist-buttons > ytcp-button:active, [studio-theme="DEFAULT"] ytcp-button[type="primary"]:active, #cancel-button:active, .ytcp-video-metadata-editor .container.ytcp-dropdown-trigger:active,  ytcp-video-list-cell-video[show-hover-items] .hover-item.ytcp-video-list-cell-video > ytcp-icon-button:active, ytcp-dropdown-trigger[dark] .container.ytcp-dropdown-trigger:active, ytcp-button.ytcp-video-list-cell-video-edit-dialog:active, #select-files-button.ytcp-uploads-file-picker:active, #video-details[track-click].hover-item:active, .hover-item.ytcp-video-list-cell-video[icon="more-vert"]:active, #watch-on-yt[track-click].hover-item:active, [menu-style=multi-page-menu-style-type-account] yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(2) > a:active, ytd-toggle-theme-compact-link-renderer:active, ytls-user-experience-dialog[dialog-type=SELECT_SOURCE] #bottom-button.ytls-user-experience-dialog:active { /*uix default*/
      border-color: #c6c6c6;
      background: #e9e9e9;
      box-shadow: inset 0 1px 0 #ddd;
  }
  #create-playlist-buttons > ytcp-button#create-button, #submit-button, #save-button, #dialog-buttons.ytcp-confirmation-dialog ytcp-button.ytcp-confirmation-dialog#confirm-button {
      border-color: #167ac6;
      background: #167ac6;
      box-shadow:none;
      color:#fff
  }
  #create-playlist-buttons > ytcp-button#create-button:hover, #submit-button:hover, #save-button:hover, #dialog-buttons.ytcp-confirmation-dialog ytcp-button.ytcp-confirmation-dialog#confirm-button:hover {
      background: #126db3;
      border-color:#167ac6;
      box-shadow:none
  }
  #create-playlist-buttons > ytcp-button#create-button:active, #submit-button:active, #save-button:active, #dialog-buttons.ytcp-confirmation-dialog ytcp-button.ytcp-confirmation-dialog#confirm-button:active {
      background: #095b99;
      border-color:#167ac6;
      box-shadow: inset 0 1px 0 rgb(0 0 0 / 50%);
  }
  ytcp-button.ytcp-video-visibility-edit-popup, ytcp-button.ytcp-video-list-cell-video-edit-dialog, #dialog-buttons.ytcp-confirmation-dialog ytcp-button.ytcp-confirmation-dialog {
      margin-right:8px!important
  }
  /*player*/
   #playhead.ytcp-video-player-timeline {
      transform:scale(0);
      border: 5px solid #eaeaea;
      background: #aeaeae;
      height: 6px;
      width: 6px;
      border-radius:50%;
      transition:all 500ms, left 0ms;
      transform-origin:center;
      margin-top:0;
      margin-left:-7px;
  }
  ytcp-video-player-timeline:hover #playhead.ytcp-video-player-timeline, ytcp-video-player-timeline.locked #playhead.ytcp-video-player-timeline {
      border: 5px solid #eaeaea;
      background: #aeaeae;
      height: 6px;
      width: 6px;
      border-radius:50%;
      transform:scale(1)
  }
  ytcp-video-player-timeline:hover #playhead.ytcp-video-player-timeline:hover {
      background:#cc181e
  }
  [name="video.edit"] #toolbar-container.ytcp-video-player-controls {
      height:35px;
      bottom:-26px;
  }
  #toolbar-container.ytcp-video-player-controls {
      height:35px
  }
  [name="video.edit"] #video-container:not([style="width: 480px; height: 270px;"]) #toolbar-container.ytcp-video-player-controls {
      bottom:0
  }
  #timeline-container.ytcp-video-player-timeline, ytcp-video-player-timeline {
      width:100%;
      left:0;
      right:0
  }
  ytcp-video-player-timeline {
      padding-left:0;
      padding-right:0;
      padding-bottom:0;
  }
  .timeline-slice.ytcp-video-player-timeline {
      background:#444
  }
  .buffer-progress-slice.ytcp-video-player-timeline, .hover-progress-slice.ytcp-video-player-timeline {
      background:#777
  }
  .progress-slice.ytcp-video-player-timeline {
      background:#cc181e
  }
  ytcp-video-player-timeline .slice.ytcp-video-player-timeline,ytcp-video-player-timeline.locked .slice.ytcp-video-player-timeline {
      height:8px;
      transform:scaley(0.375);
      transition: transform .5s ease-in,background .15s;
      transform-origin: bottom;
  }
  #highlight-container.ytcp-video-player-timeline {
      height:8px;
      bottom:0
  }
  ytcp-video-player-timeline:hover .slice.ytcp-video-player-timeline, ytcp-video-player-timeline.locked .slice.ytcp-video-player-timeline {
      height:8px;
      transform:scaley(1);
      transition: transform .5s ease-in,background .15s;
  }
  #timeline-container.ytcp-video-player-timeline {
      height:8px
  }
   #toolbar.ytcp-video-player-controls {
      height:37px;
      z-index:2;
      top:0
  }
  #button-bar.ytcp-video-player-controls {
      background:#1b1b1b
  }
  #toolbar.ytcp-video-player-controls ytcp-icon-button, .volume-control.ytcp-video-player-controls {
      padding:0;
      height:27px
  }
  ytcp-video-player-timestamp {
      height:27px;
      font-size:11px;
      line-height:27px;
      white-space:nowrap;
      overflow:hidden
  }
  #settings-button.ytcp-video-player-settings-menu {
      margin:0;
      height:24px
  }
  #toolbar.ytcp-video-player-controls ytcp-icon-button#settings-button {
      height:24px;
      margin-top:1px;
      width:30px
  }
  #settings-button svg {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) -39px -1298px;
      fill:none
  }
  #settings-button:hover svg {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) -48px -1645px;
  }
  .right-button.ytcp-video-player-controls {
      width:30px;
      margin-right:4px
  }
  .right-button.ytcp-video-player-controls svg {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) 0 -1079px;
      fill:none;
      width:35px
  }
  .right-button.ytcp-video-player-controls:hover svg {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) -13px -1953px;
  }
  .volume-control.ytcp-video-player-controls {
      width:30px
  }
  .volume-control.ytcp-video-player-controls svg {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) 0 -735px;
      fill:none
  }
  .volume-control.ytcp-video-player-controls:hover svg {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) -34px -1984px;
  }
  .volume-control.ytcp-video-player-controls ytcp-icon-button {
      margin-left:0!important;
      width:30px
  }
  .volume-control.ytcp-video-player-controls .low svg {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) 0 -1298px;
  }
  .volume-control.ytcp-video-player-controls:hover .low svg {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) -39px -316px;
  }
  .volume-control.ytcp-video-player-controls .muted svg {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) 0 -316px;
  }
  .volume-control.ytcp-video-player-controls:hover .muted svg {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) -34px -371px;
  }
  #pause-button {
      width:55px;
      margin:0
  }
  .ytcp-uploads-dialog #pause-button, .ytcp-uploads-dialog #play-button {
      width:38px;
      margin-left:-14px
  }
  #pause-button svg {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) 0 -2182px;
      fill:none
  }
  #pause-button:hover svg {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) 0 -161px;
  }
  #play-button {
      width:55px;
      margin:0
  }
  #play-button svg {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) 0 -1172px;
      fill:none
  }
  #play-button:hover svg {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/player-common-vflGwqWf5.png) -17px -1492px;
  }
  #progressContainer.tp-yt-paper-progress {
      height:4px
  }
  .slider-knob.tp-yt-paper-slider {
      top:1px
  }
  /*header*/
  header.ytcp-header {
      padding:7px 30px 8px 30px;
      border-bottom:1px solid #e8e8e8;
      box-shadow:none;
      height:34px
  }
  ytcp-header {
      box-shadow:none
  }
      /*guide*/
  #collapse-expand-icon.ytcp-header > tp-yt-iron-icon {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-2x-vflAoq8p7.png) -280px -123px;
      background-size: 571px 360px;
      width: 16px;
      height: 16px;
  }
  #collapse-expand-icon.ytcp-header {
      height:28px;
      width:auto;
      padding:0 10px;
      border:1px solid transparent;
      align-items:center;
      margin:0;
      margin-top:3px
  }
      /*logo*/
  ytcp-home-button {
      background: no-repeat url(://s.ytimg.com/yts/imgbin/www-hitchhiker-vflbk2Y8_.png) -493px -324px;
      background-size: 571px 360px;
      width: 73.5px;
      height: 30px;
      padding:0;
      margin:0;
      margin-top:3px
  }
  ytcp-home-button a {
      opacity:0
  }
      /*search*/
  #backdrop.ytcp-omnisearch {
      opacity:0
  }
  ytcp-omnisearch.ytcp-header {
      height: 29px;
      padding:0;
      margin-top:3px;
      margin-left:224px
  }
  form.ytcp-omnisearch {
      border:1px solid #d3d3d3;
      box-shadow: inset 0 1px 2px #eee;
  }
  input.ytcp-omnisearch {
      font:400 16px roboto, arial;
      height:auto;
      border:0;
      padding: 2px 6px;
      align-items:center;
      vertical-align:middle;
      line-height:23px;
      color:#000
  }
  input.ytcp-omnisearch::placeholder {
      color:#767676;
  }
  .search-icon.ytcp-omnisearch {
      right:0;
      left:auto;
      border:1px solid #d3d3d3;
      background: #f8f8f8;
      height:27px;
      top:0px;
      width:60px;
      box-shadow: 0 1px 0 rgb(0 0 0 / 5%);
      bottom:initial;
      padding:0;
      cursor:pointer
  }
  .search-icon.ytcp-omnisearch:hover {
      border-color: #c6c6c6;
      background: #f0f0f0;
      box-shadow: 0 1px 0 rgb(0 0 0 / 10%);
  }
  .search-icon.ytcp-omnisearch:active {
      border-color: #c6c6c6;
      background: #e9e9e9;
      box-shadow: inset 0 1px 0 #ddd;
  }
  .search-icon.ytcp-omnisearch svg {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-2x-vflAoq8p7.png) -447px -145px;
      background-size: 571px 360px;
      max-width: 15px;
      max-height: 15px;
      opacity:.6;
      fill:none
  }
  #results.results-ready.ytcp-omnisearch {
      padding:0;
      border:1px solid #d3d3d3;
      border-top:0;
      box-sizing:border-box;
      border-radius:0
  }
  #clear-icon.ytcp-omnisearch {
      right:60px;
      padding:3px;
      width:22px;
      height:22px;
      align-items:center;
      top:0
  }
  #clear-icon.ytcp-omnisearch tp-yt-iron-icon {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflKclzgY.webp) -90px -190px;
      width: 20px;
      height: 10px;
      font-size: 8px;
      color: transparent;
      opacity:.5
  }
      /*others*/
  #search-icon.ytcp-header, #help-icon {
      padding:0 10px;
  }
  .avatar.ytcp-header {
      height:28px;
      width:29px
  }
  yt-img-shadow.ytd-topbar-menu-button-renderer, yt-img-shadow.ytd-topbar-menu-button-renderer img {
      height:28px;
      width:29px;
  }
      /*create*/
  tp-yt-iron-icon.inline.ytcp-button {
      display:none
  }
  #create-icon.ytcp-header {
      padding-left:10px
  }
  ytcp-button[icon][icon-alignment=start] .label.ytcp-button {
      padding-left:0;
      padding-top:7px;
      padding-bottom:6px
  }
  #create-icon.ytcp-header:not([keyboard-focus]):focus {
      box-shadow: 0 0 0 2px rgb(27 127 204 / 40%);
  }
      /*user menu*/
  ytd-multi-page-menu-renderer[menu-style=multi-page-menu-style-type-account] {
      border: 1px solid #c5c5c5;
      box-shadow: 0 0 15px rgb(0 0 0 / 18%);
  }
  #avatar.ytd-active-account-header-renderer {
      border-radius:0;
      width:60px;
      height:60px;
      margin-right:10px
  }
  #avatar.ytd-active-account-header-renderer img {
      width:100%;
      height:100%;
      border-radius:0
  }
  #channel-container.ytd-active-account-header-renderer {
      justify-content:start
  }
  ytd-active-account-header-renderer:not([enable-handles-account-menu-switcher]) #account-name.ytd-active-account-header-renderer {
      font-size:13px;
      line-height:1.3em;
      margin-bottom:1px
  }
  #email.ytd-active-account-header-renderer {
      font-size:13px;
      line-height:1.3em;
      font-weight:400
  }
  #channel-handle.ytd-active-account-header-renderer {
      display:none
  }
  ytd-active-account-header-renderer {
      padding:15px;
      border-color:rgba(0,0,0,0.1)
  }
      /*channel link*/
  [menu-style=multi-page-menu-style-type-account][slot="dropdown-content"] > #container yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(1) {
      position:absolute;
      top:15px;
      left:15px;
      opacity:0
  }
  [menu-style=multi-page-menu-style-type-account][slot="dropdown-content"] > #container yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(1) tp-yt-paper-item {
      padding:0
  }
  [menu-style=multi-page-menu-style-type-account][slot="dropdown-content"] > #container yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(1) #primary-text-container {
      display:none
  }
  [menu-style=multi-page-menu-style-type-account][slot="dropdown-content"] > #container yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(1) a {
      width:60px;
      height:60px;
  }
      /*youtube.com redirect*/
  [menu-style=multi-page-menu-style-type-account][slot="dropdown-content"] > #container yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(2) {
      position:absolute;
      top:55px;
      background:none!Important;
      left:85px
  }
  [menu-style=multi-page-menu-style-type-account][slot="dropdown-content"] > #container yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(2) > a#endpoint {
      height:auto;
      line-height:1
  }
  [menu-style=multi-page-menu-style-type-account][slot="dropdown-content"] > #container yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(2) > a#endpoint > tp-yt-paper-item {
      padding:0;
      height:20px;
      min-height:0;
      font:400 11px roboto,arial;
  }
  [menu-style=multi-page-menu-style-type-account][slot="dropdown-content"] > #container yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(2) #content-icon {
      display:none
  }
  [menu-style=multi-page-menu-style-type-account][slot="dropdown-content"] > #container yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(2) > a#endpoint > tp-yt-paper-item:before {
      content:none
  }
  [menu-style=multi-page-menu-style-type-account][slot="dropdown-content"] > #container yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(2) #label.ytd-compact-link-renderer {
      font-size:inherit;
      font-weight:500
  }
      /*switch account*/
  [menu-style=multi-page-menu-style-type-account] #container yt-multi-page-menu-section-renderer:first-of-type ytd-compact-link-renderer:nth-of-type(3) {
      
  }
      /*switch account inner*/
  [menu-style=multi-page-menu-style-type-account] #subtitle.ytd-compact-link-renderer {
      padding:0
  }
  #submenu.ytd-multi-page-menu-renderer, #container.ytd-multi-page-menu-renderer, #header.ytd-multi-page-menu-renderer {
      display:block!Important
  }
      /*appearance*/
  ytd-toggle-theme-compact-link-renderer {
      position:absolute;
      top:55px;
      left:160px;
      height:20px;
      min-height:0;
      min-width:0;
      padding:0 5px 0 1px
  }
  ytd-toggle-theme-compact-link-renderer yt-icon {
      width:18px;
      height:18px
  }
  ytd-toggle-theme-compact-link-renderer #label, ytd-toggle-theme-compact-link-renderer #secondary-icon {
      display:none
  }
  .content-icon.ytd-toggle-theme-compact-link-renderer {
      margin:0;
  }
      /*feedback*/
  #sections.ytd-multi-page-menu-renderer>*.ytd-multi-page-menu-renderer:nth-child(2) {
      background:#eee
  }
  /*guide*/
  img.image-thumbnail.ytcp-navigation-drawer {
      display:none
  }
  .image-thumbnail.ytcp-navigation-drawer, .icon-thumbnail.ytcp-navigation-drawer, .square-image-thumbnail.ytcp-navigation-drawer {
      height:24px;
      width:100%;
      left:0;
      top:17px;
      padding-top:3px;
      padding-bottom:6px
  }
  .thumbnail-wrapper.ytcp-navigation-drawer {
      height:50px;
  }
  div ytcp-navigation-drawer[layout] #entity-label-container.ytcp-navigation-drawer {
      display:none
  }
  .grey-overlay.ytcp-overlay-with-link {
      display:none
  }
  .overlay-with-link.ytcp-overlay-with-link:before {
      content:"Creator studio";
      background: none;
      color: #444;
      font-size: 13px;
      text-transform: uppercase;
      font-weight: 500;
      padding: 4px 0 5px 17px;
      display:inline-block;
  }
  .overlay-container.ytcp-overlay-with-link:hover .overlay-with-link.ytcp-overlay-with-link:before {
      text-decoration:underline
  }
  ytcp-navigation-drawer[collapsed-nav] .thumbnail-wrapper.ytcp-navigation-drawer {
      height:0
  }
  [collapsed-nav] #bottom-section {
      display:none
  }
  .overlay-link.ytcp-overlay-with-link {
      top:0;
      opacity:0
  }
  .overlay-with-link.ytcp-overlay-with-link[hidden] {
      display:block!important;
  }
  .image-thumbnail.ytcp-navigation-drawer {
      border-radius:0
  }
  ytcp-navigation-drawer {
      --navigation-drawer-expanded-width:215px;
      --navigation-drawer-collapsed-width:57px
  }
      /*body*/
  ytcp-navigation-drawer.ytcp-entity-page {
      box-shadow: 0 1px 2px rgb(0 0 0 / 10%);
      background:#fff;
      flex:initial;
      height:min-content;
      margin-top:10px
  }
  nav.ytcp-navigation-drawer {
      border:0;
      flex:initial
  }
  .top-section.ytcp-navigation-drawer {
      display:inline;
      flex:initial
  }
      /*icons*/
  .menu-right-icon.ytcp-navigation-drawer {
      display:none!important
  }
  tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-videomanager-2x-vflLIGSP6.png) 0 -46px;
      background-size: 50px 1018px;
      width: 24px;
      height: 24px;
      fill:none;
      vertical-align: middle;
      display: inline-block;
  }
  .ytcp-navigation-drawer .content-icon.tp-yt-paper-icon-item {
      margin:0 7px 0 0
  }
  tp-yt-paper-icon-item.ytcp-navigation-drawer {
      padding:13px 14px;
      height:auto;
      margin:0;
      min-height:0
  }
  tp-yt-paper-icon-item.iron-selected.ytcp-navigation-drawer {
      background:none
  }
  tp-yt-paper-icon-item.ytcp-navigation-drawer:hover {
      background:#f6f6f6
  }
  tp-yt-paper-icon-item.iron-selected.ytcp-navigation-drawer:after {
      content:none
  }
  .nav-item-text.ytcp-navigation-drawer {
      font:500 11px roboto,arial;
      text-transform:uppercase
  }
  #menu-item-0 tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer { /*dash*/
      background-position:0 -46px;
  }
  #menu-item-0 tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected tp-yt-iron-icon.ytcp-navigation-drawer {
      background-position:0 -392px
  }
  [href*="videos/upload"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
      background-position: 0 -724px
  }
  [href*="videos/upload"] tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected tp-yt-iron-icon.ytcp-navigation-drawer {
      background-position: 0 -20px
  }
  [href*="playlists"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
      background-position: 0 -724px;
      transform:rotate(90deg)
  }
  [href*="playlists"] tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected tp-yt-iron-icon.ytcp-navigation-drawer {
      background-position: 0 -20px
  }
  [href*="analytics"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
      background-position:-26px -509px;
  }
  [href*="analytics"] tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected tp-yt-iron-icon.ytcp-navigation-drawer {
      background-position:-26px -429px;
  }
  [href*="comments/inbox"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer { /*comments*/
      background-position:-0px -966px;
  }
  [href*="comments/inbox"] tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected tp-yt-iron-icon.ytcp-navigation-drawer {
      background-position:-26px -619px;
  }
  [href*="comments/inbox"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer:before {
      content:"";
      width:14px;
      height:13px;
      position:absolute;
      background:#343434;
      top:5px;
      left:5px
  }
  [href*="comments/inbox"] tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected tp-yt-iron-icon.ytcp-navigation-drawer:before {
      background:#CC181F
  }
  [href*="translations"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
      background-position:-26px -20px;
  }
  [href*="translations"] tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected tp-yt-iron-icon.ytcp-navigation-drawer {
      background-position:-0px -213px;
  }
  [href*="copyright"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
      background-position:-0px -994px;
  }
  [href*="copyright"] tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected tp-yt-iron-icon.ytcp-navigation-drawer {
      background-position:-26px -968px;
  }
  [href*="monetization"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
      background-position:-0px -240px;
  }
  [href*="monetization"] tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected tp-yt-iron-icon.ytcp-navigation-drawer {
      background-position:-26px -204px;
  }
  [href*="music"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
      background-position:-26px -230px;
  }
  [href*="music"] tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected tp-yt-iron-icon.ytcp-navigation-drawer {
      background-position:-0px -857px;
  }
  [href*="editing"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
      background-position: 0 -429px;
  }
  [href*="editing"] tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected tp-yt-iron-icon.ytcp-navigation-drawer {
      background-position:0px -621px;
  }
  #bottom-section #contentIcon {
      display:none
  }
  #bottom-section tp-yt-paper-icon-item.ytcp-navigation-drawer {
      padding:0 10px;
      height:29px;
      background:#333!important;
      border:1px solid #333;
      margin-left:17px;
      width:auto;
      display:inline-block;
      margin-bottom:10px
  }
  #bottom-section tp-yt-paper-icon-item.ytcp-navigation-drawer:hover {
      background:#3c3c3c!important
  }
  #bottom-section .nav-item-text.ytcp-navigation-drawer {
      color:#fff;
      text-transform:none;
      line-height:29px
  }
  /***************************BODY**************************/
  /*very annoying fix*/
  .header.ytcp-content-section, ytcp-primary-action-bar, ytcp-video-section-content, #stuck-to-left-header.ytcp-video-section-content {
      width:auto!important
  }

  /*fix end*/
  .page > .ytcp-app:not(#channel-dashboard-section) {
      background:#fff
  }
  #main-container.ytcp-entity-page #main.ytcp-entity-page[studio-theme] {
      background:none;
  }
  .nav-and-main-content.ytcp-entity-page {
      background:#f1f1f1
  }
  ytcd-channel-dashboard {
      --card-margin:10px
  }
  .card.ytcd-card {
      border:0;
      border-radius:0;
  }
  ytcd-card {
      box-shadow: 0 1px 2px rgb(0 0 0 / 10%);
  }
  ytcp-entity-page-header.page-header, #page-title-container {
      padding:18px 25px;
      background:#fff;
      height:auto;
      min-height:0
  }
  #page-title-container {
      border:0
  }
  ytcp-entity-page-header.page-header .page-title.ytcp-entity-page-header, ytcp-app[enable-page-title] .page-title.ytcp-app {
      padding:0;
      height:30px;
      vertical-align: middle;
      line-height: 30px;
      color: #333;
      font-size: 18px;
      font-weight: 500;
      font-family:"youtube noto",roboto,arial
  }
  [studio-theme="DEFAULT"] .all-pages.ytcp-app ytcp-activity-section { /*main card*/;
      height: calc(100vh - 100px);
  }
  [studio-theme="DEFAULT"] .all-pages.ytcp-app {
      margin-top:10px;
      margin-left:10px
  }
          /*tab*/
  .selection-bar.tp-yt-paper-tabs {
      display:none
  }
  ytcp-primary-action-bar {
      padding:0 15px;
      max-width:100%
  }
  ytcp-primary-action-bar tp-yt-paper-tab[style-target=host] {
      border-top: 1px solid #ddd;
      border-right: 1px solid #ddd;
      border-bottom: 1px solid #ddd;
      padding: 10px 15px;
      min-width: 150px;
      max-width: 160px;
      background-color: #fbfbfb;
      color: #666;
      text-decoration: none;
      margin:0;
      height:initial!important;
      min-height:34px!important;
      display:inline-block
  }
  ytcp-primary-action-bar tp-yt-paper-tab.iron-selected[style-target=host] {
      border-top: 3px solid #cc181e;
      border-bottom: 1px solid #fff;
      background-color: #fff;
      color: #333;
      padding-top:8px
  }
  ytcp-primary-action-bar tp-yt-paper-tab .tp-yt-paper-tab[style-target=tab-content] {
      display: block;
      margin-right: 20px;
      font:500 13px "YouTube Noto",Roboto,arial,sans-serif;
      line-height: 1.2em;
      min-height:0;
      height:auto;
      color:inherit
  }
  .tabs-content.tp-yt-paper-tabs {
      border-left:1px solid #ddd
  }
  tp-yt-paper-tabs {
      height:56px;
      margin-bottom:-1px;
      background:none
  }
          /*chip*/
  ytcp-chip {
      border-radius:0;
      height:auto;
      min-height:0;
      line-height:1
  }
  .chip.ytcp-chip-bar {
      height:26px;
      border:1px solid #d3d3d3;
      background:#f8f8f8;
      margin:0 4px!important
  }
  .chip.ytcp-chip-bar:hover {
      border-color: #c6c6c6;
      background: #f0f0f0;
      box-shadow: 0 1px 0 rgb(0 0 0 / 10%);
  }
  .chip.ytcp-chip-bar:active {
      border-color: #c6c6c6;
      background: #e9e9e9;
      box-shadow: inset 0 1px 0 #ddd;
  }
  .chip.ytcp-chip-bar svg {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflKclzgY.webp) -90px -190px;
      margin-top:10px;
      margin-right:-5px;
      font-size: 8px;
      color: transparent;
      opacity: .5;
      margin-left:3px
  }
          /*filter dropdown*/
  #filter-icon.ytcp-filter-bar {
      margin:0;
      padding:0 12px 0 13px;
      border:1px solid transparent;
      height:26px;
      margin-top:15px;
      margin-left:8px;
      margin-right:8px
  }
  #filter-icon.ytcp-filter-bar:hover {
      border-color: #c6c6c6;
      background: #f0f0f0;
      box-shadow: 0 1px 0 rgb(0 0 0 / 10%);
  } 
  #filter-icon.ytcp-filter-bar:active {
      border-color: #c6c6c6;
      background: #e9e9e9;
      box-shadow: inset 0 1px 0 #ddd;
  }
  #filter-icon.ytcp-filter-bar:before {
      content:"Filter";
      display:inline-block;
      font:500 11px roboto,arial;
      color:#000;
  }
  #filter-icon.ytcp-filter-bar:after {
      content:"";
      margin-top: -3px;
      margin-left: 5px;
      border: 1px solid transparent;
      border-top-color: #333;
      border-width: 4px 4px 0;
      width: 0;
      height: 0;
      display: inline-block;
      vertical-align: middle;
  }
      /*filter bar*/
  .chip-and-bar.ytcp-chip-bar {
      align-items:center;
      margin:0;
      padding:15px 0px;
      cursor:default
  }
  .text-input.ytcp-chip-bar {
      padding: 5px 10px 6px;
      margin:0!important;
      font-size: 13px;
      box-shadow: inset 0 0 1px rgb(0 0 0 / 5%);
      border: 1px solid #d3d3d3;
      color: #333;
      height:auto;
      width:auto;
      min-width:250px;
      line-height:15px;
      flex:initial;
  }
      /*pop up dialog*/
  tp-yt-paper-dialog.ytcp-text-menu {
      border: 1px solid #ccc;
      border-radius:2px;
      box-shadow:none
  }
  tp-yt-paper-item.tp-yt-paper-item.ytcp-text-menu {
      display: block;
      margin: 0;
      padding: 0 25px;
      color: #333;
      font-size: 13px;
      text-decoration: none;
      white-space: nowrap;
      word-wrap: normal;
      line-height: 25px;
      cursor: pointer;
      min-height:0;
  }
  yt-formatted-string.ytcp-text-menu {
      padding:0;
      color:inherit
  }
  .menu-item-selected {
      font-weight: 500;
  }
  tp-yt-paper-item:focus, .tp-yt-paper-item.tp-yt-paper-item:focus {
      background:none;
      color:#333
  }
  tp-yt-paper-item.ytcp-text-menu:hover, tp-yt-paper-item.ytcp-text-menu:hover:focus {
      background-color: #333;
      color: #fff;
  }
  tp-yt-paper-item.ytcp-text-menu:before {
      content:none!important
  }
  .menu-icon.ytcp-text-menu {
      display:none
  }
  .menu-right-icon.second-icon.ytcp-text-menu, tp-yt-paper-item.ytcp-text-menu[has-anchor] a.ytcp-text-menu {
      padding:0;
  }
          /*small modals and popups*/
  #dialog.ytcp-dialog {
      border: 1px solid #c5c5c5;
      box-shadow: 0 0 15px rgb(0 0 0 / 18%);
      border-radius:0!important
  }
  .text-container.ytcp-form-textarea {
      border:0;
      border-radius:0
  }
  #section-label.ytcp-form-textarea, h2.section-label[class] { /*section labels and section titles*/
      margin: 10px 0!important;
      font-size: 11px;
      font-weight: 500;
      color: #333;
      text-transform: uppercase;
      padding:0;
      letter-spacing:0;
      line-height:normal
  }
  textarea.ytcp-form-textarea, div#outer.ytcp-form-input-container.style-scope, ytcp-video-metadata-editor-basics ytcp-social-suggestion-input.fill-height.ytcp-social-suggestions-textbox, .ytcp-channel-editing-section div#outer.ytcp-form-input-container.style-scope {
      border: 1px solid #d3d3d3;
      color: #333;
      box-shadow: inset 0 0 1px rgb(0 0 0 / 5%);
      padding: 5px 10px 6px;
      margin-top: 0;
      margin-bottom: 0;
      font-size: 13px;
      min-height:0;
      line-height:normal;
      border-radius:0
  }
  textarea.ytcp-form-textarea:hover, #outer.ytcp-form-input-container:hover, ytcp-video-metadata-editor-basics ytcp-social-suggestion-input.fill-height.ytcp-social-suggestions-textbox:hover, .ytcp-channel-editing-section div#outer.ytcp-form-input-container.style-scope:hover {
      border-color:#b9b9b9
  }
  textarea.ytcp-form-textarea:focus, .focused #outer.ytcp-form-input-container, ytcp-video-metadata-editor-basics ytcp-form-input-container.focused ytcp-social-suggestion-input.fill-height.ytcp-social-suggestions-textbox, .ytcp-channel-editing-section div#outer.ytcp-form-input-container.style-scope:focus-within {
      border-color: #167ac6!important;
      box-shadow: inset 0 0 1px rgb(0 0 0 / 10%);
  }
  div#outer.ytcp-form-input-container.style-scope > #label.ytcp-form-input-container {
      margin:0
  }
  ytcp-form-input-container.ytcp-channel-editing-channel-handle .handle-input-container.ytcp-channel-editing-channel-handle {
      line-height:24px; /*handle fix*/
  }
  #description-section-label.ytcp-channel-editing-details-tab {
      padding:0
  }
  #dialog-content-confirm-checkboxes.ytcp-confirmation-dialog { /*video delete*/
      padding:0 15px
  }
          /*more*/
  .open-menu-button tp-yt-iron-icon, #overflow-menu-button tp-yt-iron-icon, #more-menu-button tp-yt-iron-icon {
      opacity: .8;
      background: url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflNlthLq.webp) -460px -138px no-repeat;
      width: 13px;
      height: 13px;
      color:transparent;
  }

  .open-menu-button {
      width:13px;
      height:13px;
      color:transparent
  }
          /*visibility popup*/
  #first-container.ytcp-video-visibility-select, #second-container.ytcp-video-visibility-select {
      border:0;
      padding:0
  }
  ytcp-video-visibility-select.ytcp-video-visibility-edit-popup {
      padding:15px
  }
  #dialog.ytcp-video-visibility-edit-popup {
      border: 1px solid #d3d3d3;
      box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
      border-radius:0;
      min-width:0!important;
      margin-left:-15px
  }
  .container-radios.ytcp-video-visibility-select, #visibility-title.ytcp-video-visibility-select {
      margin:0
  }
  tp-yt-paper-radio-group.ytcp-video-visibility-select {
      margin-left:16px!important
  }
  #datepicker-trigger .right-container {
      display:none
  }
  /*UPLOAD*/
  tp-yt-paper-dialog.ytcp-uploads-dialog {
      border: 1px solid #c5c5c5;
      box-shadow: 0 0 15px rgb(0 0 0 / 18%);
      border-radius:0;
      width:1003px;
      overflow-y:scroll
  }
  html ::-webkit-scrollbar-thumb {
      border-radius:0;
      border:1px solid transparent;
  }
  html ::-webkit-scrollbar {
      width:14px
  }
  #textbox.ytcp-social-suggestions-textbox {
      line-height:normal;
      font-size:13px;
      min-height:0;
      height:auto
  }
  #description-textarea #textbox.ytcp-social-suggestions-textbox {
      height:73px;
  }
  #description-textarea #child-input.ytcp-form-input-container{
      height:auto
  }
  .title #child-input.ytcp-form-input-container {
      height:auto;
      line-height:normal
  }
  .container-bottom.ytcp-social-suggestions-textbox {
      display:none
  }
  .mfk-infobox-container.ytkc-made-for-kids-select .infobox.ytkc-made-for-kids-select {
      display:none
  }
  #circle.ytcp-uploads-file-picker-animation {
      width: 118px;
      height: 80px;
      background-image: url(https://s.ytimg.com/yts/img/upload/large-upload-resting-icon-vflM6eC13.png);
      border-radius:0;
  }
  #circle.ytcp-uploads-file-picker-animation:hover {
      background:url(https://s.ytimg.com/yts/img/upload/large-upload-hover-icon-vflcwlQhZ.png)
  }
  #arrow-group.ytcp-uploads-file-picker-animation {
      display:none
  }
  .step.ytcp-stepper:not([disabled]).ytcp-stepper:hover, ytcp-stepper[keyboard-focus] .step.ytcp-stepper:not([disabled]).ytcp-stepper:focus {
      background:transparent
  }
  .metadata-fade-in-section.ytcp-uploads-dialog {
      opacity:1;
      transition:0ms
  }

  yt-share-target-renderer yt-icon.yt-share-target-renderer {
      height:40px;
      width:60px
  }
  #contents.yt-third-party-share-target-section-renderer yt-share-target-renderer.yt-third-party-share-target-section-renderer {
      width:60px
  }
  .ytcp-video-share-dialog, .ytcp-video-share-dialog #dialog.ytcp-dialog {
      max-width:800px!important;
      width:800px!important;
      
  }
  .ytcp-video-share-dialog #dialog.ytcp-dialog {
      margin-left:-200px
  }
  .ytcp-video-share-dialog .content.ytcp-dialog > [slot=content]:not([no-padding]) {
      padding:0!important;
  }
  .ytcp-video-share-dialog ytcp-video-thumbnail-with-info.ytcp-video-share-dialog {
      width:766px!important
  }
  .url-container.ytcp-video-share-dialog {
      width:750px!important
  }
  #scroll-button-forward.yt-third-party-share-target-section-renderer {
      right:0;
      border-radius:0;
      width:20px
  }
  #scroll-button-back.yt-third-party-share-target-section-renderer {
      right:0;
      border-radius:0;
      width:20px;
      left:0
  }
  .mfk-infobox-container.ytcp-audience-picker {
      display:none
  }
  .input-container.ytcp-video-metadata-editor-advanced {
      margin-bottom:4px;
  }
  .sublabel.ytcp-thumbnails-compact-editor, .section-description.ytcp-video-metadata-editor-basics, .description.ytcp-audience-picker, .section-description.ytcp-video-metadata-editor-advanced {
      height:0;
      font-size:0;
      order:5
  }
  ytcp-thumbnails-compact-editor:active .sublabel.ytcp-thumbnails-compact-editor {
      height:auto!important;
      font-size:13px!important;
  }
  #ytcp-uploads-dialog-file-picker.ytcp-uploads-dialog {
      align-self:center;
      justify-self:center
  }

  [workflow-step="SELECT_FILES"] .header.ytcp-uploads-dialog {
      width:calc(100% - 30px);
      margin:0;
      padding-left:15px;
      padding-right:15px
  }
  [workflow-step="SELECT_FILES"] .ytcp-uploads-dialog #close-button {
      right:25px
  }
  [workflow-step="SELECT_FILES"] .title-row.ytcp-uploads-dialog {
      width:100%
  }
          /*details and header*/
  .progress-label.ytcp-video-upload-progress /*text in bar*/ {
      text-transform:uppercase;
      color:#222
  }

  #processing-badge.ytcp-video-upload-progress, ytcp-video-upload-progress:not([checks-can-start]) #checks-badge.ytcp-video-upload-progress /*regular "button"*/ {
      
  }

  [progress-type="UPLOADING"] /*progress*/ {
      
  }
  ytcp-video-upload-progress-hover[progress-type] {
      max-width:none!important;
      min-width:0!important;
      overflow:visible!important;
      width:622px;
  }

  ytcp-video-metadata-editor.ytcp-uploads-dialog {
      padding:15px
  }
  .processing-shimmer.ytcp-still-cell:after {
      content:none
  }
  #uploading-badge, #processing-badge.ytcp-video-upload-progress {
      margin:0;
      position:absolute;
      width:1000px;
      height:800px;
      transition:all 999999999999999999999999999999999999s;
      left:0;
      top:0;
      opacity:0
  }
  #uploading-badge:hover, #processing-badge.ytcp-video-upload-progress:hover {
      width:0;
      height:0;
      transition:all .0001s
  }
  #checks-badge {
      display:none
  }
  #uploading-tooltip, #processing-tooltip {
      z-index:-1;
      margin-top:-2px
  }
  tp-yt-paper-progress.ytcp-video-upload-progress-hover,
  #uploading-tooltip, #uploading-tooltip > ytcp-paper-tooltip-placeholder, #uploading-tooltip, #uploading-tooltip > ytcp-paper-tooltip-placeholder > #tooltip,
  #processing-tooltip, #processing-tooltip > ytcp-paper-tooltip-placeholder, #processing-tooltip, #processing-tooltip > ytcp-paper-tooltip-placeholder > #tooltip {
      display:block!important;
      inset:initial!important;
  }
  #processing-tooltip > ytcp-paper-tooltip-placeholder, #uploading-tooltip > ytcp-paper-tooltip-placeholder {
      position:absolute!important
  }
  .content.ytcp-video-upload-progress-hover {
      display:none
  }
  tp-yt-paper-progress.ytcp-video-upload-progress-hover {
      margin:0;
      height:26px;
      overflow:visible;
  }
  #uploading-tooltip #tooltip.ytcp-paper-tooltip-placeholder, #processing-tooltip #tooltip.ytcp-paper-tooltip-placeholder {
      border:1px solid #E7E7E7;
      background:#fff;
      padding:0;
      box-shadow:none;
      width:622px;
      max-width:none;
      overflow:visible;
  }
  #processing-tooltip #tooltip.ytcp-paper-tooltip-placeholder {
      background:none;
      border:none;
      box-shadow:none;
      overflow:visible;
      width:622px;
      padding:0;
      max-width:none
  }
  .title.ytcp-video-upload-progress-hover {
      display:none
  }
  #uploading-tooltip #primaryProgress.tp-yt-paper-progress {
      background: linear-gradient(-45deg, #BBE0FC 0px, #BBE0FC 1px, #fff 1px, #fff 5px, #BBE0FC 5px, #BBE0FC 6px, #fff 6px, #fff 10px) repeat;
      background-size: 7px 7px;
      background-position: 28px top;
      box-shadow:none;
      border:1px solid #BBE0FC;
      height:26px;
      position:relative;
      margin:-1px;
      margin-top:0;
      margin-top:-1.2px
  }
  #processing-tooltip #primaryProgress.tp-yt-paper-progress {
      background:#D2E7FC;
      border:1px solid #D2E7FC;
      height:26px;
      margin:-1px;
      margin-top:0
  }
   #processing-tooltip [value="100"] #primaryProgress.tp-yt-paper-progress {
      background:#4883BD;
       border-color:#4883BD
  }
  .ytcp-uploads-dialog ytcp-video-info {
      --player-width:205px;
      --player-height:140px
  }
  .ytcp-uploads-dialog ytcp-video-metadata-editor-sidepanel.ytcp-video-metadata-editor {
      width:205px;
      padding:0 15px 0 0;
      order:-1;
      margin-top:-120px;
      position:relative!important;
      top:0!Important;
  }
  .ytcp-uploads-dialog .input-container.ytcp-video-metadata-editor-sidepanel {
      margin:0;
  }
  .ytcp-uploads-dialog .container.ytcp-video-info {
      background:none;
      border-radius:0
  }
  .ytcp-uploads-dialog ytcp-thumbnails-compact-editor-old {
      position:absolute;
      left:15px;
  }
  .ytcp-uploads-dialog ytcp-video-metadata-editor-advanced {
          grid-template-columns: 345px 345px;
  }
  .ytcp-uploads-dialog .compact-row.ytcp-video-metadata-editor-basics {
      position:relative;
      left:454px;
      top:0;
      margin-top:-94px
  }
  .ytcp-uploads-dialog #scrollable-content {
      max-height:none!important
  }
  .details-header-wrapper.ytcp-uploads-dialog {
      margin:0;
      width:auto;
  }
  .details-header-wrapper.ytcp-uploads-dialog h1 {
      display:none
  }
  #scrollable-content.ytcp-uploads-dialog {
      overflow-y:auto;
      height:max-content;
      max-height:none;
      overflow:visible;
  }
  .dialog-content.ytcp-uploads-dialog {
      height:auto;
      overflow-x:hidden;
      min-height:100%
  }
  .stepper-animatable.ytcp-uploads-dialog {
      margin:0;
      height:auto;
      margin-top:30px;
      z-index:2
  }
  .header.ytcp-uploads-dialog {
      position:absolute;
      margin-left:235px;
      width:calc(100% - 235px)
  }
  .button-area.ytcp-uploads-dialog {
      height:118px;
      margin-left:235px;
      padding-left:0;
      padding-bottom:0;
  }
  .stepper.ytcp-stepper {
      padding:0;
      justify-content:initial;
      border-bottom:1px solid #e2e2e2;
  }
  ytcp-stepper:not([vertical]) .step-and-separator.ytcp-stepper {
      min-width:0;
      flex:initial;
      margin:0;
      margin-right:20px;
      justify-content:initial
  }
  ytcp-stepper:not([vertical]) .step.ytcp-stepper {
      min-width:0;
      padding:0 16px;
      height:32px;
      justify-content:center;
      border-bottom:3px solid transparent
  }
  ytcp-stepper:not([vertical]) .separator.ytcp-stepper, .step-badge.ytcp-stepper {
      display:none
  }
  ytcp-stepper:not([vertical]) .step.ytcp-stepper[active], ytcp-stepper:not([vertical]) .step.ytcp-stepper:hover {
      border-bottom:3px solid #cc181e;
      border-radius:0
  }
  [state="completed"] .step-title.ytcp-stepper:after {
      content:"";
      display:inline-block;
      width:16px;
      height:11px;
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflbQfoQG.webp) -416px -51px;
      margin-left:6px
  }
  .step-title.ytcp-stepper {
      font:400 13px roboto,arial;
      color:#666
  }
  .step.ytcp-stepper[active] .step-title.ytcp-stepper {
      font-weight:500;
      color:#333
  }
  #scrollable-content.ytcp-uploads-dialog {
      order:2
  }
  .title-row.ytcp-uploads-dialog {
      padding:0;
      border:0;
      width:calc(100% - 15px);
      margin-top:15px;
      z-index:2;
      height:40px
  }
  .ytcp-uploads-dialog #close-button {
      padding:4px;
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflKclzgY.webp) -90px -186px;
      fill:none;
      width:10px;
      height:10px;
      position:absolute;
      top:59px;
      opacity:.6;
      right:140px
  }
  .inner-button-area.ytcp-uploads-dialog ytcp-button.ytcp-uploads-dialog+ytcp-button.ytcp-uploads-dialog {
      line-height:12px;
      width:110px
  }
  .ytcp-uploads-dialog #close-button svg {
      display:none!important
  }
  .ytcp-uploads-dialog .container.ytcp-badge {
      background:none
  }
  #reuse-details-button.ytcp-uploads-dialog {
      right:226px;
      margin-top:12px;
      text-transform:none;
      font-size:13px
  }
  .ytcp-uploads-dialog #back-button {
      display:none
  }
  [icon="icons:feedback"] {
      width:auto;
      vertical-align:middle;
      line-height:29px;
      box-shadow:none;
      color: var(--ytcp-call-to-action)!important;
  }
  [icon="icons:feedback"]:hover {
      text-decoration:underline
  }
  [icon="icons:feedback"]:after {
      content:attr(tooltip-label);
  }
  [icon="icons:feedback"] tp-yt-iron-icon {
      display:none
  }
          /*visibility*/
  .left-col.ytcp-uploads-review {
      order:2
  }
  .right-col.ytcp-uploads-review>*.ytcp-uploads-review {
      margin-left:-25px;
      margin-top:-170px;
      top:0
  }
  .left-col.ytcp-uploads-review {
      margin-right:0;
      margin-left:10px
  }
  .top-row.ytcp-uploads-review {
      margin-left:195px
  }
  /*DASHBOARD*/
  [studio-theme="DASHBOARD"] #page-title-container {
      display:none
  }
  [studio-theme="DASHBOARD"] .ytcd-card ytcp-button {
      color:#167ac6;
      font-size:11px;
      text-align:center;
      text-transform:none;
      font-family:roboto,arial;
      letter-spacing:0;
      line-height:13px;
      padding:15px;
      min-height:0;
      height:auto;
      margin:auto;
      display:block
  }
  [studio-theme="DASHBOARD"] a.remove-default-style.ytcd-basic-item-large-image:hover, [studio-theme="DASHBOARD"] .analytics-button.ytcd-channel-facts-item:hover, [studio-theme="DASHBOARD"] .link-button-ve-container.ytcd-entity-snapshot-item>a.ytcd-entity-snapshot-item:hover, [studio-theme="DASHBOARD"] .ytcd-card-button-action-item:hover, [studio-theme="DASHBOARD"] .action-link.ytcd-recent-activity-subscribers:hover {
      background:#eee;
  }
  a.remove-default-style.ytcd-basic-item-large-image, .analytics-button.ytcd-channel-facts-item, .link-button-ve-container.ytcd-entity-snapshot-item>a.ytcd-entity-snapshot-item, .ytcd-card-button-action-item, .action-link.ytcd-recent-activity-subscribers {
      padding:0
  }
  [studio-theme="DASHBOARD"] .link-button-ve-container.ytcd-entity-snapshot-item>a.ytcd-entity-snapshot-item {
      display:flex;
      width:100%;
  }
  [studio-theme="DASHBOARD"] .ytcd-card ytcp-button .label {
      padding:0;
      text-align:center;
      justify-content:center
  }
  [studio-theme="DASHBOARD"] div > .title:not(.ytcd-basic-item-large-image), [studio-theme="DASHBOARD"] .item-title, [studio-theme="DASHBOARD"] .card-title, [studio-theme="DASHBOARD"] .title.ytcd-recent-activity-item {
      padding-top: 12px;
      line-height: 1.3em;
      text-transform: uppercase;
      font-size: 13px;
      font-weight: 500;
      margin-bottom: 0;
      margin-top: 0;
      color: #555;
      padding-bottom:0;
      height:25px;
      border-bottom:1px solid transparent
  }
  [studio-theme="DASHBOARD"] div > .title:not(.ytcd-basic-item-large-image):hover, [studio-theme="DASHBOARD"] .item-title:hover, [studio-theme="DASHBOARD"] .card-title:hover, [studio-theme="DASHBOARD"] .title.ytcd-recent-activity-item:hover {
      background-color: #fbfbfb;
      border-bottom: 1px solid #dcdcdc;
      color:#167ac6
  }
  [studio-theme="DASHBOARD"] .body.ytcd-basic-item-large-image  .item-title {
      border:0!important;
      background:none!important
  }
  [studio-theme="DASHBOARD"] .simple-banner.ytcd-list-card, [studio-theme="DASHBOARD"] #link-button-container.ytcd-entity-snapshot-item, ytcd-channel-facts-item {
      padding:0
  }
          /*comms*/
  ytcd-item.ytcd-list-card:first-child {
      margin:0
  }
  [studio-theme="DASHBOARD"] #author-thumbnail-container.ytcd-comments-snapshot-item {
      border-radius:0;
      width:28px;
      height:28px
  }
  [studio-theme="DASHBOARD"] #author-comment-badge.ytcd-comments-snapshot-item {
      border-radius:0;
      margin-left:6px;
      color: #333;
      font-weight: 500;
      font-size: 12px;
      line-height:14px;
      height:auto
  }
  [studio-theme="DASHBOARD"] #author-comment-badge.ytcd-comments-snapshot-item:hover {
      color:#0e7dcf
  }
  [studio-theme="DASHBOARD"] #timestamp.ytcd-comments-snapshot-item {
      color: #666;
      font-size: 11px;
      line-height:14px;
      height:auto;
      padding-left:6px
  }
  [studio-theme="DASHBOARD"] #author-divider {
      display:none
  }
  [studio-theme="DASHBOARD"] #comment-text-container.ytcd-comments-snapshot-item {
      margin:0 0 0 10px;
      font-size:12px;
      line-height:1.3em
  }
  [studio-theme="DASHBOARD"] #comment-text-container.ytcd-comments-snapshot-item #content-text.ytcd-comments-snapshot-item{
      color: #333;
      font-size: 12px;
      line-height: 1.3em;
      max-height: 2.6em;
      overflow: hidden;
      margin-bottom: 5px;
  }
  [studio-theme="DASHBOARD"] #header.ytcd-comments-snapshot-item {
      margin:0
  }
  [studio-theme="DASHBOARD"] .navigation-buttons.ytcd-carousel-card {
      padding-top:0
  }
          /*subscribers*/
  .subscriber-avatar.ytcd-recent-activity-subscribers {
      border-radius:0
  }
  h1 span.ytcd-subscriber-list-dialog {
      display: inline;
      vertical-align: middle;
      line-height: 30px;
      color: #333;
      font-size: 18px;
      font-weight: 500;   
  }
  .header-content.ytcp-dialog > h1[slot=primary-header].ytcd-subscriber-list-dialog {
      padding:18px 25px;
      margin:0
  }
  .ytcd-subscriber-list-dialog .container.has-label.ytcp-dropdown-trigger {
      height:auto
  }
  .ytcd-subscriber-list-dialog .container.has-label.ytcp-dropdown-trigger .left-container {
      height:auto;
      display:flex;
      flex-direction:row-reverse;
      font:500 11px roboto,arial;
      vertical-align:middle;
      line-height:14px
  }
  .ytcd-subscriber-list-dialog .container.borderless.ytcp-dropdown-trigger .label-text.ytcp-dropdown-trigger {
      margin-top:0px;
      line-height:28px;
      margin-left:6px
  }
  .ytcd-subscriber-list-dialog .container.borderless.ytcp-dropdown-trigger .label-text.ytcp-dropdown-trigger:before {
      content:"("
  }
  .ytcd-subscriber-list-dialog .container.borderless.ytcp-dropdown-trigger .label-text.ytcp-dropdown-trigger:after {
      content:")"
  }
  #header.ytcp-subscribers-table {
      line-height:27px;
      min-height:27px;
      border-color:#f1f1f1;
      background:none
  }
  #header.ytcp-subscribers-table .cell-header.sortable.ytcp-table-header {
      margin-left:0
  }
  #date-select.ytcd-subscriber-list-dialog .right-container {
      display:none
  }
  #date-select.ytcd-subscriber-list-dialog {
      min-width:72px
  }
  .divider.ytcp-subscribers-table {
      border-color:#f1f1f1
  }
  .header-name.ytcp-table-header span.ytcp-table-header {
      font-size:11px;
      font-weight:500
  }
  .cell-header.sortable.ytcp-table-header:hover, .cell-header.column-sorted.ytcp-table-header {
      font-weight:500;
  }
  .subscriber-info-name.ytcp-subscribers-table-row {
      font:500 13px roboto,arial
  }
  .subscriber-info-avatar.ytcp-subscribers-table-row, .subscriber-info-avatar.ytcp-subscribers-table-row yt-img-shadow {
      border-radius:0;
      width:60px;
      height:60px;
      padding-right:10px
  }
  .subscriber-info.ytcp-subscribers-table-row {
      max-height:60px
  }
  .ytcp-subscribe-button {
      border-radius: 2px;
      box-shadow: 0 1px 0 rgb(0 0 0 / 5%);
      border: 1px solid #ccc;
      background-color: #f8f8f8;
      color: #666;
      padding: 0 8px;
      height: 20px;
      font:500 11px roboto,arial;
      text-transform:none
  }
  .ytcp-subscribe-button .label {
      padding:0;
      line-height:20px;
      margin:0
  }
  /*VIDEO MANAGER*/
  [name="channel.videos"] #header.ytcp-video-section-content {
      top:56px;
      z-index:333
  }
  [name="channel.videos"] ytcp-primary-action-bar {
      min-height:56px;
  }
  .description.ytcp-video-list-cell-video {
      display:none
  }
  .video-title-wrapper.ytcp-video-list-cell-video, .video-under-title-wrapper.ytcp-video-list-cell-video, #video-info-edit.ytcp-video-list-cell-video {
      margin:0!important
  }
  ytcp-video-list-cell-video[show-hover-items] .open-menu-button.ytcp-video-list-cell-video, ytcp-video-list-cell-video[show-hover-items] #hover-items.ytcp-video-list-cell-video, ytcp-video-list-cell-video[show-hover-items][is-highlighted] .video-under-title-wrapper.ytcp-video-list-cell-video, ytcp-video-list-cell-video[show-hover-items][is-highlighted] #hover-items.ytcp-video-list-cell-video {
      display:flex;
      align-items:center;
      max-height:20px;
      align-self:initial;
      margin-top:16px;
      visibility:visible
  }
  ytcp-video-list-cell-video[show-hover-items] .hover-item.ytcp-video-list-cell-video {
      margin:0
  }
   ytcp-video-list-cell-video[class] .hover-item.ytcp-video-list-cell-video > ytcp-icon-button, #video-details[track-click].hover-item, .hover-item.ytcp-video-list-cell-video[icon="more-vert"], #watch-on-yt[track-click].hover-item {
       border-radius:0!important;
       margin-right:-1px;
       width:auto;
       line-height:18px;
       height:18px;
  }
  .hover-item.ytcp-video-list-cell-video[icon="more-vert"] {
      padding:0 7px
  }
  .hover-item.ytcp-video-list-cell-video[icon="more-vert"] tp-yt-iron-icon {
      fill:none;
      background:none!Important;
      width: 0;
      height: 0;
      border: 1px solid transparent;
      border-width: 4px 4px 0;
      border-top-color: #666;
  }
  ytcp-video-list-cell-video[show-hover-items] .hover-item.ytcp-video-list-cell-video:first-of-type > ytcp-icon-button {
       border-radius:2px 0 0 2px!important;
  }
  ytcp-video-list-cell-video[show-hover-items] .hover-item.ytcp-video-list-cell-video > ytcp-icon-button:before, #watch-on-yt[track-click].hover-item:before, #video-details[track-click].hover-item:before {
      content:attr(aria-label)
  }
  ytcp-video-list-cell-video[show-hover-items] .hover-item.ytcp-video-list-cell-video > ytcp-icon-button tp-yt-iron-icon, #watch-on-yt[track-click].hover-item tp-yt-iron-icon, #video-details[track-click].hover-item tp-yt-iron-icon {
      display:none
  }
  ytcp-video-row .floating-column.ytcp-video-row {
      padding:0!important
  }
  .tablecell-video {
      left:56px!important
  }
  .tablecell-selection {
      max-width:16px!important;
      flex:initial!important;
      min-width:0!important;
      margin-left:15px;
      align-items:center   
  }
  .cell-header.tablecell-selection.ytcp-table-header {
      padding:0!important;
      height:16px
  }
  #video-thumbnail.ytcp-video-list-cell-video {
      padding-right:15px
  }
  .video-title-wrapper.ytcp-video-list-cell-video {
      margin:0;
      padding:0
  }
  .video-title-wrapper.ytcp-video-list-cell-video #video-title.ytcp-video-list-cell-video {
      margin:0;
      padding:0;
      color: #333;
      font-size: 13px;
      font-weight: 500;
      line-height: 17px;
      margin-right: 4px;
      vertical-align: middle;
      white-space: normal;
  }
  .video-title-wrapper.ytcp-video-list-cell-video:hover #video-title.ytcp-video-list-cell-video {
      color:#167ac6;
      text-decoration:underline
  }
  .tablecell-date.cell-body.ytcp-video-row { /*date*/
      position:absolute;
      left:179px;
      z-index:2;
      padding:0;
      line-height:15px;
      color:#767676;
      font-size:12px;
      flex-direction:row;
      margin-top:26px
  }
  .tablecell-date.cell-body.ytcp-video-row .cell-description.ytcp-video-row {
      order:-1;
      margin:0;
      line-height:15px;
      color:#767676;
      font-size:12px;
      margin-right:4px
  }
  .tablecell-comments.cell-body.ytcp-video-row { /*comms*/
      position:absolute;
      right:100px;
      color:#666!important;
      min-width:0px!important;
      padding:0!important;
      flex:initial!important;
      flex-direction:row;
      margin-top:8px
  }
  .tablecell-comments.cell-body.ytcp-video-row a.row-highlighted.ytcp-video-row {
      color:#666
  }
  .tablecell-comments.cell-body.ytcp-video-row a.ytcp-video-row {
      padding:0;
      font:400 12px roboto;
      line-height:18px
  }
  .tablecell-comments.cell-body.ytcp-video-row:before {
      content:"";
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-videomanager-vfl2kHqv0.webp) 0 -670px;
      background-size: auto;
      width: 18px;
      height: 18px;
      display:inline-block;
      min-width:18px;
      margin-right:20px;
      opacity:.6
  }
  .likes-container.ytcp-video-row .progress.ytcp-video-row, .likes-container.ytcp-video-row .progress-fill.ytcp-video-row { /*like*/
      height:2px;
      border-radius:0;
      background:#ccc
  }
  .likes-container.ytcp-video-row .progress-fill.ytcp-video-row {
      background:#167ac6
  }
  .likes-container.ytcp-video-row .primary-label.ytcp-video-row, .likes-container.ytcp-video-row .percent-label.ytcp-video-row {
      font:400 11px roboto;
      line-height:12px;
      color:#999;
      padding:0;
      display:inline-block;
      padding-top:3px;
  }
  .likes-container.ytcp-video-row .likes-label.ytcp-video-row {
      padding-bottom:0;
      display:inline-block;
      font:400 12px roboto;
      line-height:17px;
      margin-right:6px;
      margin-left:42px;
      text-overflow:clip;
      word-spacing:60px
  }
  .likes-container.ytcp-video-row {
      flex-direction:row-reverse;
      align-items:center;
      position:relative;
      max-width:130px;
      justify-content:flex-end;
  }
  .likes-container.ytcp-video-row .progress.ytcp-video-row {
      position:absolute;
      bottom:0;
      left:4px
  }
  .likes-container.ytcp-video-row:after {
      content:"";
      display:inline-block;
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-videomanager-vfl2kHqv0.webp) 0 -542px;
      background-size: auto;
      width: 18px;
      height: 18px;
      opacity: .6;
      position:absolute;
      right:108px;
      bottom:34px
  }
  .likes-container.ytcp-video-row:before {
      content:"";
      display:inline-block;
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-videomanager-vfl2kHqv0.webp) -28px -1088px;
      background-size: auto;
      width: 18px;
      height: 18px;
      opacity: .6;
      position:absolute;
      right:108px;
      bottom:10px
  }
  .cell-body.ytcp-video-row:last-of-type {
      padding-right:18px!important;
      flex: 1 0 70px!important;
      min-width:0!important;
      max-width:192px
  }
  ytcp-paper-tooltip-placeholder[type=custom-content] #tooltip.ytcp-paper-tooltip-placeholder {/*like tooltip*/
      border:0;
      border-radius:0;
      box-shadow:none;
      padding:0;
      background:none
  }
  ytcp-video-list-cell-likes-tooltip-body {
      height:auto
  }
  ytcp-video-list-cell-likes-tooltip-body > * {
      display:none
  }
  .label.ytcp-video-list-cell-likes-tooltip-body:last-of-type { /*dislike*/
      display:inline-block;
      position:absolute;
      right:61px;
      font:400 12px roboto;
      color:#666;
      top:45px
  }
  .likes-container.ytcp-video-row .percent-label.ytcp-video-row:last-child {
      margin-left:42px;
      font-size:0;
      margin-top:-1px
  }
  .likes-container.ytcp-video-row .percent-label.ytcp-video-row:last-child:after {
      content:"0";
      font-size:12px;
      line-height:normal;
      color:#666;
      cursor:text;
  }
  .tablecell-views.cell-body.ytcp-video-row { /*views*/
      align-items:center;
      padding-top:0;
      min-width:0!important;
      font-weight:500
  }
  .tablecell-views.cell-body.ytcp-video-row:after {
      content:" views";
      margin-left:4px
  }
  .icon-text-edit-triangle-wrap.ytcp-video-row .icon-grey.ytcp-video-row[icon="yt-sys-icons:visibility_off"] {
      background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-videomanager-vflpg9nMX.webp) 0 -1141px;
      background-size: auto;
      width: 18px;
      height: 18px;
      fill:none;
      margin:0;
      padding:0
  }
  .icon-text-edit-triangle-wrap.ytcp-video-row .icon-grey.ytcp-video-row[icon="yt-sys-icons:visibility"], .icon-text-edit-triangle-wrap.ytcp-video-row .icon-grey.ytcp-video-row {
      background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-videomanager-vflpg9nMX.webp) -33px -441px;
      background-size: auto;
      width: 18px;
      height: 18px;
      fill:none;
      margin:0;
      padding:0
  }
  .icon-text-edit-triangle-wrap.ytcp-video-row .icon-green.ytcp-video-row {
      background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-videomanager-vflpg9nMX.webp)-10px -631px;
      background-size: auto;
      width: 18px;
      height: 18px;
      fill:none;
      margin:0;
      padding:0
  }
  .icon-text-edit-triangle-wrap.ytcp-video-row .icon-yellow.ytcp-video-row {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-videomanager-vflsrtxCf.webp) 0 -28px;
      width: 18px;
      height: 18px;
      fill:none;
      margin:0;
      padding:0
  }
  .icon-text-edit-triangle-wrap.ytcp-video-row .label-span.ytcp-video-row {
      display:none
  }
  .last-floating-column.ytcp-video-row+.cell-body.ytcp-video-row {
      min-width:52px!important;
      flex:initial!important;
      position:absolute;
      right:192px;
      margin-top:-4px;
      z-index:2;
      padding-left:0!important
  }
  .restrictions-list.ytcp-video-row>div.ytcp-video-row {
      font-size:12px;
      color:#666
  }
  ytcp-video-row[horizontal-scroll] .last-floating-column.ytcp-video-row:after {
      content:none
  }
  .cell-body.ytcp-video-row:nth-of-type(4) {
      position:absolute;
      right:260px;
      z-index:2;
      text-align:right;
      min-width:0!important;
      flex:initial!important;
      padding:0!important;
      line-height:1
  }
  .restrictions-list.ytcp-video-row {
      padding-top:8px
  }
  /*silly select*/
  ytcp-text-dropdown-trigger[dark] .dropdown-trigger-text.ytcp-text-dropdown-trigger {
      font:inherit;
      color:inherit;
      line-height:26px
  }
  ytcp-text-dropdown-trigger[dark] .dropdown-trigger-text.ytcp-text-dropdown-trigger:after {
      content:"";
          width: 0;
      height: 0;
      border: 1px solid transparent;
      border-width: 4px 4px 0;
      border-top-color: #555;
      display:inline-block;
      position:relative;
  }
  ytcp-text-dropdown-trigger[dark] .right-container {
      display:none
  }
  ytcp-select.top-dropdown.ytcp-bulk-actions, ytcp-bulk-add-playlists.ytcp-video-bulk-actions, ytcp-select.ytcp-video-bulk-actions, ytcms-csv-export-menu.ytcp-video-bulk-actions {
      margin:0;
      margin-right:8px
  }
  .toolbar-wrapper.ytcp-bulk-actions {
      display:flex!important
  }
  .label.ytcp-bulk-actions {
      display:none
  }
  .toolbar.ytcp-bulk-actions {
      margin:0
  }
  #header.opened.ytcp-bulk-actions, #header.ytcp-bulk-actions {
      background:none;
      border:0;
      height:30px!important;
      min-height:0;
      position:absolute;
      left:38px;
      margin-top:9px
  }
  #header.ytcp-bulk-actions {
      opacity:.5
  }
  #header.ytcp-bulk-actions.opened {
      opacity:1
  }
  .divider.ytcp-bulk-actions {
      display:none
  }
  .cell-header.sortable.ytcp-table-header:hover, .cell-header.sortable.ytcp-table-header {
      margin-left:300px
  }
  .close-button.ytcp-bulk-actions, .selection-label.ytcp-bulk-actions {
      display:none
  }
  .ytcp-video-section-content [role="columnheader"]:not(.sortable), .tablecell-comments[role="columnheader"], .tablecell-visibility[role="columnheader"] {
      display:none
  }
  .cell-header.tablecell-selection.ytcp-table-header {
      display:flex
  }
  /*PLAYLIST*/
  ytcp-playlist-section-content {
      border:0
  }
  ytcp-playlist-section.ytcp-app {
      margin:0
  }
  #new-playlist-button .ytcp-button {
      padding:7px 0
  }
  #new-playlist-button .label.ytcp-button:before {
      background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfliTgLqv.webp) -130px -862px;
      background-size: auto;
      width: 16px;
      height: 16px;
      content:"";
      margin-right: 6px;
      opacity:.5;
      display:inline-block;
      vertical-align:middle;
      margin-top:-2px
  }
  #hover-items.ytcp-playlist-row a.ytcp-playlist-row ytcp-icon-button:before {
      content:attr(aria-label)
  }
  #hover-items.ytcp-playlist-row a.ytcp-playlist-row ytcp-icon-button {
      width:auto
  }
  #hover-items.ytcp-playlist-row {
      display:inline-block!important;
      position:absolute;
      right:24px;
      top:28px
  }
  #hover-items.ytcp-playlist-row tp-yt-iron-icon {
      display:none
  }
  #hover-items.ytcp-playlist-row a.ytcp-playlist-row ytcp-icon-button {
      line-height:27px;
      max-height:26px
  }
  .playlist-right-section.ytcp-playlist-row > .ytcp-playlist-row {
      display:block!important
  }
  .playlist-icon.ytcp-playlist-thumbnail {
      display:none
  }
  .playlist-size.ytcp-playlist-thumbnail:after {
      content:" videos"
  }
  .playlist-size.ytcp-playlist-thumbnail {
      font-size:13px;
      letter-spacing:0;
      font-weight:400;
      color: #fff;
      text-align: center;
      border-radius: 3px;
      width:auto;
      padding:0;
      display:block;
      line-height:1
  }
  .playlist-thumbnail-half-scrim.ytcp-playlist-thumbnail {
      background: rgba(0,0,0,0.7);
      color: #fff;
      text-align: center;
      border-radius: 3px;
      right: 5px;
      top: 6px;
      padding: 3px 7px;
      width:auto;
      height:min-content
  }
  ytcp-table-header.ytcp-playlist-section-content {
      display:none
  }
  #row-container.ytcp-playlist-row > div:nth-child(2) { /*visibility*/
      position:absolute;
      left:177px;
      margin-top:24px;
      flex:initial!important;
      min-width:0!important;
      padding:0!important
  }
  .description.ytcp-playlist-row {
      padding-left:20px;
      margin-right:300px
  }
  .visibility-cell.ytcp-playlist-row, .visibility-cell.ytcp-playlist-row tp-yt-iron-icon.ytcp-playlist-row {
      padding:0;
      margin:0
  }
  .visibility-cell.ytcp-playlist-row span {
      display:none
  }
  #row-container.ytcp-playlist-row > div:nth-child(3) { /*date*/
      position:absolute;
      left:166px;
      margin-top:58px
  }
  #row-container.ytcp-playlist-row > div:nth-child(4) {
      display:none
  }
  .playlist-title.ytcp-playlist-row {
      margin-top:7px;
      color:#167ac6;
      font-weight:500
  }
  .last-time-updated-cell.ytcp-playlist-row {
      color:#999;
      font-size:12px;
      padding:0
  }
  .last-time-updated-cell.ytcp-playlist-row:before {
      content:"Updated ";
      cursor:text
  }
  .icon-grey.visibility-off-icon.ytcp-playlist-row {
      background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-videomanager-vflpg9nMX.webp) -33px -441px;
      background-size: auto;
      width: 18px;
      height: 18px;
      fill:none
  }
  .icon-green.visibility-icon.ytcp-playlist-row {
      background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-videomanager-vflpg9nMX.webp) -10px -631px;
      background-size: auto;
      width: 18px;
      height: 18px;
      fill:none
  }
  #row-container.row-highlighted.ytcp-playlist-row {
      background:none
  }
  ytcp-playlist-row {
      border:0
  }
          /*create playlist*/
  #create-playlist-form textarea.ytcp-form-textarea {
      max-height:15px;
      white-space:nowrap;
  }
  #create-playlist-form textarea.ytcp-form-textarea::-webkit-scrollbar {
      display:none!important
  }
  .char-counter.ytcp-form-textarea {
      padding-top:3px;
      padding-bottom:0
  }
  #create-playlist-buttons.ytcp-playlist-creation-dialog-old {
      background-color: #f6f6f6;
      padding:15px;
      min-height:32px
  }
  #create-playlist-buttons.ytcp-playlist-creation-dialog-old > ytcp-button {
      margin-left:13px
  }
  #create-playlist-buttons.ytcp-playlist-creation-dialog-old > ytcp-button .label {
      padding-top:7px
  }
  #create-playlist-form.ytcp-playlist-creation-dialog-old {
      padding:15px;
      min-height:0
  }
  .content.ytcp-dialog > [slot=content]:not([no-padding]) {
      padding:0
  }
  .input-container.title.ytcp-playlist-creation-dialog-old, .input-container.visibility.ytcp-playlist-creation-dialog-old {
      margin:0
  }
  .ytcp-playlist-creation-dialog-old.ytcp-playlist-creation-dialog-old > #dialog { /*ugly dialog*/
      background: #fff;
      border: 1px solid #d3d3d3;
      box-shadow: 0 2px 4px rgb(0 0 0 / 20%);
      margin-top:27px
  }
  .ytcp-playlist-creation-dialog-old.ytcp-playlist-creation-dialog-old tp-yt-paper-item.tp-yt-paper-item.ytcp-text-menu {
      padding:0 15px
  }
  .ytcp-playlist-creation-dialog-old.ytcp-playlist-creation-dialog-old tp-yt-paper-item.tp-yt-paper-item.ytcp-text-menu:hover {
      color:#333;
      background:#eee
  }
  .ytcp-playlist-creation-dialog-old.ytcp-playlist-creation-dialog-old tp-yt-paper-item.tp-yt-paper-item.ytcp-text-menu yt-formatted-string:before {
      content:"";
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;
      padding-bottom: 1px;
      background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfliTgLqv.webp) 0 -918px;
      width: 16px;
      height: 16px;
      opacity:.5
  }
  .ytcp-playlist-creation-dialog-old.ytcp-playlist-creation-dialog-old tp-yt-paper-item.tp-yt-paper-item.ytcp-text-menu:hover yt-formatted-string:before {
      opacity:.6
  }
  .ytcp-playlist-creation-dialog-old.ytcp-playlist-creation-dialog-old tp-yt-paper-item.tp-yt-paper-item.ytcp-text-menu:active yt-formatted-string:before {
      opacity:1
  }
  .ytcp-playlist-creation-dialog-old.ytcp-playlist-creation-dialog-old tp-yt-paper-item.tp-yt-paper-item.ytcp-text-menu[aria-selected="true"] yt-formatted-string:before {
      opacity:1
  }
  .ytcp-playlist-creation-dialog-old.ytcp-playlist-creation-dialog-old tp-yt-paper-item.tp-yt-paper-item.ytcp-text-menu#text-item-2 yt-formatted-string:before {
      background-position:-76px -474px;
  }
  .ytcp-playlist-creation-dialog-old.ytcp-playlist-creation-dialog-old tp-yt-paper-item.tp-yt-paper-item.ytcp-text-menu#text-item-1 yt-formatted-string:before {
      background-position:-211px -122px;
  }
  .input-container.visibility .container.ytcp-dropdown-trigger { /*visibility*/
      border-color:transparent;
      border-radius:2px;
      padding:0 10px;
      height:28px;
      align-items:center;
      flex:initial
  }
  .input-container.visibility .container.ytcp-dropdown-trigger:hover {
      border-color: #c6c6c6;
      background: #f0f0f0;
      box-shadow: 0 1px 0 rgb(0 0 0 / 10%);
  }
  .input-container.visibility .container.ytcp-dropdown-trigger:active, .input-container.visibility .container.ytcp-dropdown-trigger:focus {
      border-color: #c6c6c6;
      background: #e9e9e9;
      box-shadow: inset 0 1px 0 #ddd;
  }
  .input-container.visibility .container.ytcp-dropdown-trigger:before {
      content: '';
      display: inline-block;
      vertical-align: middle;
      margin-right: 6px;
      background: no-repeat url(https://s.ytimg.com/yts/imgbin/www-hitchhiker-vfliTgLqv.webp) 0 -918px;
      background-size: auto;
      width: 16px;
      height: 16px;
  }
  .input-container.visibility .container.ytcp-dropdown-trigger:after {
      content:"";
      display: inline-block;
      vertical-align: middle;
          margin-top: -3px;
      margin-left: 5px;
      border: 1px solid transparent;
      border-top-color: #333;
      border-width: 4px 4px 0;
      width: 0;
      height: 0;
  }
  .left-container.ytcp-dropdown-trigger {
      flex:initial
  }
  ytcp-text-dropdown-trigger.ytcp-playlist-creation-dialog-old.ytcp-playlist-creation-dialog-old {
      position:absolute;
      bottom:20px;
      background:none
  }
  .input-container.visibility .container.ytcp-dropdown-trigger .label-area.ytcp-dropdown-trigger, .input-container.visibility .container.ytcp-dropdown-trigger .right-container {
      display:none
  }
  .input-container.visibility .dropdown-trigger-text.ytcp-text-dropdown-trigger {
      font-size:11px;
      font-family:roboto,arial;
      font-weight:500;
      line-height:normal
  }
  /*comments*/
      /*chips*/
  #comments-content #chip-text {
      font:400 13px "YouTube Noto",Roboto,arial,sans-serif;
      line-height: 1.2em;
      min-height:0;
      height:auto;
      color:#333;
      margin-right:0px;
  }
  .chip.ytcp-comments-section {
      background:none!important;
      border:0!important;
      height:auto;
      width:auto;
      min-width:0;
      padding:0;
      margin:0;
      border-radius:0
  }
  .chip.ytcp-comments-section:hover #chip-text {
      text-decoration:underline
  }
  .chip.ytcp-comments-section[selected] #chip-text {
      font-weight:500!important
  }
  .chips-container.ytcp-comments-section {
      width:auto;
      border:0;
      position:absolute;
      z-index:42;
      top:-20px;
      padding-left:19px
  }
  #sticky-header.ytcp-comments-section {
      z-index:3
  }
          /*main*/
  #contents.ytcp-comments-section {
      background:#fff;
      box-shadow: 0 1px 2px rgb(0 0 0 / 10%);
  }
  .metadata-divider.ytcp-comment {
      display:none
  }
  #author-thumbnail.ytcp-comment yt-img-shadow.ytcp-comment {
      border-radius:0;
      margin-top:0;
      margin-right:10px;
      height:48px;
      width:48px;
  }
  #author-thumbnail.ytcp-comment yt-img-shadow.ytcp-comment img.yt-img-shadow {
      width:48px;
      height:48px
  }
  .ytcp-comment-replies img.yt-img-shadow{
      max-width:32px;
      max-height:32px
  }
  #comment.ytcp-comment-thread {
      padding:0;
      padding-bottom:0px!important;
      min-height:61px
  }
  ytcp-comment-thread {
      border:0;
      padding-bottom:26px
  }
  ytcp-comment {
      background:none!Important
  }
  tp-yt-iron-list.ytcp-comments-section {
      padding:25px 15px
  }
  #metadata.ytcp-comment {
      font:400 11px 'roboto',arial;
      line-height:17px;
      display:inline;
      vertical-align:top;
      margin:0;
      color:#767676
  }
  #content-text.ytcp-comment {
      font:400 12px 'roboto', arial;
      color:#000;
      line-height:17px
  }
  #name.ytcp-comment, #reply-endpoint.ytcp-comment {
      color:#167ac6;
      font:500 12px 'roboto',arial;
  }
  .published-time-text.ytcp-comment {
      vertical-align:top;
      margin-left:5px
  }
  .comments .comment-text .comment-text-content {
      font:400 13px 'roboto'
  }
  body ytcp-comment-button[is-paper-button] yt-formatted-string.ytcp-comment-button {
      color: #555;
      cursor: pointer;
      font-size: 11px;
      font-weight: 500;
      line-height:1.1;
      opacity: .75;
      vertical-align: sub;
      text-transform:none;
  }
  body ytcp-comment-button[is-paper-button]:hover yt-formatted-string.ytcp-comment-button {
      opacity:1;
      color:#555
  }
  #reply-button.ytcp-comment-action-buttons, tp-yt-paper-button.ytcp-comment-button {
      min-width:0;
      min-height:0;
      height:auto;
  }
  #reply-button.ytcp-comment-action-buttons {
      margin:0
  }
  #reply-button.ytcp-comment-action-buttons yt-formatted-string:after {
      content:"·";
      display:inline-block;
      margin:0 8px;
      color:#000;
      opacity:1
  }
  ytcp-comment-button #button.ytcp-comment-button {
      padding:5px 0 0 0
  }
  #comment-actions.ytcp-comment, #moderations.ytcp-comment {
      margin:0
  }
  #comment-actions ytcp-icon-button[compact] {
      position:absolute;
      right:120px;
      top:0px;
      border:1px solid transparent;
      padding: 6px 12px 4px;
      width:auto;
      height:auto
  }
  #comment-actions ytcp-icon-button[compact] tp-yt-iron-icon {
      display: inline-block;
      background:transparent no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -74px -74px;
      background-size: auto;
      width: 14px;
      height: 14px;
      fill:none;
      opacity:0.5
  }
  #comment-actions ytcp-icon-button[compact]:after {
      content:"▼";
      display: inline-block;
      margin: 2px -3px 0 5px;
      vertical-align: top;
      font-size: 9px;
      
  }
  ytcp-comment-thread:hover #comment-actions ytcp-icon-button[compact] {
      border-color:#eee
  }
  ytcp-comment-thread #comment-actions ytcp-icon-button[compact]:hover {
      background-color:#f0f0f0
  }
  #show-replies-button.ytcp-comment-action-buttons[disabled] {
      display:none
  }
  #dislike-button.ytcp-comment-action-buttons, #like-button.ytcp-comment-action-buttons, #creator-heart.ytcp-comment-action-buttons {
      width:14px;
      height:17px;
      margin-right:12px;
      order:2
  }
  #creator-heart.ytcp-comment-action-buttons {
      width:16px;
      height:19px
  }
  a.yt-simple-endpoint.ytcp-comment-toggle-button, ytcp-comment-toggle-button #button.ytcp-comment-toggle-button, ytcp-comment-toggle-button #button.ytcp-comment-toggle-button yt-icon,#creator-heart-button.ytcp-comment-creator-heart,#creator-heart-button .ytcp-comment-creator-heart {
      height:inherit;
      width:inherit;
      padding:0;
      margin:0;
  }
  #vote-count.ytcp-comment-action-buttons[hidden]~#dislike-button.ytcp-comment-action-buttons,#vote-count.ytcp-comment-action-buttons~#dislike-button.ytcp-comment-action-buttons {
      margin-left:0
  }
  yt-interaction#interaction {
      display:none!important
  }
  .ytcp-comment-action-buttons~.ytcp-comment-action-buttons yt-icon {
      opacity:.2
  }
  ytcp-comment:hover .ytcp-comment-action-buttons~.ytcp-comment-action-buttons yt-icon, ytcp-comment:hover #creator-heart-button yt-icon#unhearted {
      opacity:.4
  }
  ytcp-comment .ytcp-comment-action-buttons~.ytcp-comment-action-buttons .ytcp-comment-toggle-button:hover yt-icon,ytcp-comment #creator-heart-button:hover yt-icon#unhearted {
      opacity:.6
  }
  .ytcp-comment-action-buttons~#like-button.ytcp-comment-action-buttons yt-icon {
      display: inline-block;
      vertical-align: top;
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -206px 0;
      background-size: auto;
      width: 14px;
      height: 14px;
      fill:none
  }
  .ytcp-comment-action-buttons~#like-button.ytcp-comment-action-buttons.style-default-active yt-icon {
      background-position:-12px -74px;;
      opacity:1
  }
  .ytcp-comment-action-buttons~#dislike-button.ytcp-comment-action-buttons yt-icon {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -12px 0;
      width: 14px;
      height: 14px;
      fill:none
  }
  .ytcp-comment-action-buttons~#dislike-button.ytcp-comment-action-buttons.style-default-active yt-icon {
      background-position:-30px 0;
      opacity:1
  }
  yt-icon#unhearted {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-comments-vflVHNGhW.webp) -112px -90px;
      fill:none;
      width: 16px;
      height: 16px;
      display: inline-block;
      opacity:.2
  }
  #creator-heart-button yt-icon#hearted {
      opacity:1!important;
      fill:none;
      background:#f00;
      transform: rotate(-45deg);
      width: 6px;
      height: 10px;
      border-radius: 6px 6px 0 0;
  }
  #creator-heart-button yt-icon#hearted:after {
      content:"";
      background:#f00;
      width:6px;
      height:10px;
      border-radius:6px 6px 0 0;
      display:inline-block;
      transform:rotate(90deg);
      position:absolute;
      right:-2px;
      bottom:-3px
  }
  yt-icon#hearted svg,#hearted-border {
      display:none!important
  }
  #hearted-thumbnail.ytcp-comment-creator-heart {
      border-radius:0;
      border:0
  }
  #vote-count.ytcp-comment-action-buttons {
      margin-right: 10px;
      color: #128ee9;
      order:0;
      margin-bottom:-2px;
  }
  #show-replies-button.ytcp-comment-action-buttons tp-yt-paper-button[style-target=host] {
      height:auto;
      width:auto;
      min-width:0
  }
  #show-replies-button.ytcp-comment-action-buttons tp-yt-paper-button[style-target=host] yt-formatted-string {
      font:400 12px 'roboto',arial;
      color:#128ee9;
      line-height:15px
  }
  #show-replies-button.ytcp-comment-action-buttons tp-yt-paper-button[style-target=host] yt-icon {
      display:none
  }
  #show-replies-button.ytcp-comment-action-buttons {
      margin-right:8px;
      margin-top:3px
  }
  ytcp-comment[is-reply] #author-thumbnail.ytcp-comment yt-img-shadow.ytcp-comment {
      margin-left:60px
  }
  ytcp-comment.ytcp-comment-replies {
      padding:15px 0 12px 0
  }
  ytcp-comment.ytcp-comment-replies:last-of-type {
      padding-bottom:5px;
  }
  ytcp-author-comment-badge.creator {
      background:#dbe4eb;
      border-radius:0;
      padding:0;
      margin:0;
      height:auto;
  }
  #badge-name.ytcp-author-comment-badge {
      height:auto;
      line-height:15px;
      color:#167ac6!important;
      font-weight:500
  }
  #content.ytcp-comment,#author-thumbnail {
      height:max-content
  }
  #body.ytcp-comment {
      height:max-content;

  }
  #video-thumbnail.ytcp-comment-video-thumbnail {
      width:96px;
      height:54px;
      margin:0
  }
  #video-thumbnail.ytcp-comment-video-thumbnail img {
      height:54px;
  }
  #body.ytcp-comment-video-thumbnail {
      flex-direction:column;
      position:absolute
  }
  #video-title.ytcp-comment-video-thumbnail {
      display: block;
      margin-left: auto;
      margin-right: auto;
      max-width: 100px;
      color: #888;
      text-align: center;
      overflow: hidden;
      white-space: nowrap;
      word-wrap: normal;
      -o-text-overflow: ellipsis;
      text-overflow: ellipsis;
  }
  #video-title.ytcp-comment-video-thumbnail yt-formatted-string[split-lines] {
      white-space:nowrap;
      height:21px
  }
  #view-comment-button.ytcp-comment-video-thumbnail {
      display:none
  }
  ytcp-comment-action-menu #action-menu-dialog {
      box-shadow:none;
      padding:8px 0;
      border: 1px solid #ccc;
      border-radius:2px;
      margin-top:19px;
  }
  tp-yt-paper-item.ytcp-menu-service-item-renderer, tp-yt-paper-item.ytcp-toggle-menu-service-item-renderer {
      min-height:0;
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
  yt-formatted-string.ytcp-menu-service-item-renderer, tp-yt-paper-item.ytcp-toggle-menu-service-item-renderer span{
      font-size:13px
  }
  yt-formatted-string.ytcp-menu-service-item-renderer:before,tp-yt-paper-item.ytcp-toggle-menu-service-item-renderer:before {
      content:none
  }
  tp-yt-paper-item.ytcp-menu-service-item-renderer:hover,tp-yt-paper-item.ytcp-toggle-menu-service-item-renderer:hover {
      background:#444;
      color:#fff;
  }
  tp-yt-paper-item.ytcp-menu-service-item-renderer:hover yt-icon,tp-yt-paper-item.ytcp-toggle-menu-service-item-renderer:hover yt-icon {
      fill:#fff
  }
  yt-icon.ytcp-menu-service-item-renderer, yt-icon.ytcp-toggle-menu-service-item-renderer {
      margin-right:8px;
      height:16px;
      width:16px;
      margin-top:0px;
      margin-bottom:3px
  }
  ytcp-sticky-header {
      max-width:none
  }
  /*suggest*/
  #label.ytcp-suggestions {
      font:inherit
  }
  /*comment end*/



  /*customization*/
  iron-pages > :not(slot):not(.iron-selected).ytcp-channel-editing-section {
      display:block!important
  }
  iron-pages > .ytcp-channel-editing-section.iron-selected ~ :not(slot):not(.iron-selected).ytcp-channel-editing-section ~ :not(slot):not(.iron-selected).ytcp-channel-editing-section section > *,
  iron-pages > .ytcp-channel-editing-section.iron-selected ~ :not(slot):not(.iron-selected).ytcp-channel-editing-section ~ :not(slot):not(.iron-selected).ytcp-channel-editing-section ytcp-channel-links,
  iron-pages > .ytcp-channel-editing-section.iron-selected ~ :not(slot):not(.iron-selected).ytcp-channel-editing-section ~ :not(slot):not(.iron-selected).ytcp-channel-editing-section ytcp-channel-url,
  .description.ytcp-channel-editing-channel-name { /*hide about*/
      display:none
  }
  iron-pages > .ytcp-channel-editing-section.iron-selected ~ :not(slot):not(.iron-selected).ytcp-channel-editing-section ~ :not(slot):not(.iron-selected).ytcp-channel-editing-section section > ytcp-channel-editing-channel-name { /*about name*/
      display:block
  }
  iron-pages > :not(slot):not(.iron-selected).ytcp-channel-editing-section:nth-child(1) {  /*hide main*/
      display:none!important
  }
  iron-pages > :not(slot):not(.iron-selected).ytcp-channel-editing-section ~ :not(slot):not(.iron-selected).ytcp-channel-editing-section ytcp-video-watermark-upload {
      display:none
  }
  .ytcp-channel-editing-section:nth-of-type(2) ytcp-channel-editing-images-tab {
      padding-top:0;
      padding-bottom:0
  }
          /*layout*/
  .left.ytcp-spotlight-section-item, .description.ytcp-spotlight-section {
      display:none
  }
  .container.ytcp-spotlight-section-item {
      border:0;
      margin:0;
      padding:8px 0
  }
  #add-section-button.ytcp-shelves-section {
      margin-right:0;
      margin-bottom:5px
  }
  .container.ytcp-shelf-list-item {
      margin:0;
      padding:0;
      border:0;
      border-radius:0;
      border-bottom: 1px solid #e2e2e2;
  }
  .container.ytcp-shelf-list-item .drag-handle-container.ytcp-shelf-list-item tp-yt-iron-icon {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vfl-Nn88d.png) -412px -116px;
      background-size: auto;
      width: 2px;
      height: 10px;
      opacity:0
  }
  .container.ytcp-shelf-list-item:hover .drag-handle-container.ytcp-shelf-list-item tp-yt-iron-icon {
      opacity:1
  }
  .drag-handle-container.ytcp-shelf-list-item {
      border-left:1px solid transparent;
      border-right:1px solid transparent;
  }
  .ytcp-shelf-list-item:hover .drag-handle-container.ytcp-shelf-list-item {
      background: #fbfbfb;
      border-left: 1px solid #e2e2e2;
      border-right: 1px solid #e2e2e2;
  }
  .shelf-container.ytcp-shelf-list-item {
      padding:5px 0 15px 0
  }
  #shelf-items-container.ytcp-shelves-section {
      border:1px solid #e2e2e2;
      border-bottom:0
  }
  .video-length.ytcp-channel-editing-thumbnail {
      padding:0 4px;
      font-size:11px;
      line-height:normal;
      bottom:2px;
      right:2px;
      font-weight:500;
      background:#000;
      opacity:.75
  }
              /*choose specific video popup*/
  ytcp-entity-card.card, ytcp-entity-card.ytcp-playlist-pick-dialog {
      border:0;
      border-radius:0;
      padding:10px;
      margin-left:0;
      min-height:0;
      width:160px
  }
  ytcp-entity-card.card:hover, ytcp-entity-card.ytcp-playlist-pick-dialog:hover {
      background:#D9D8DA;
      box-shadow:1px 0px 1px rgba(0,0,0,.1)
  }
  .title.ytcp-entity-card {
      padding:0;
      font-weight:500;
      margin-top:1px
  }
  .thumbnail.ytcp-entity-card {
      width:160px;
      height:90px
  }
  .ytcp-video-pick-dialog > tp-yt-paper-tabs, .ytcp-playlist-pick-dialog > tp-yt-paper-tabs { /*search*/
      height:32px
  }
  .ytcp-video-pick-dialog > tp-yt-paper-tabs tp-yt-iron-icon, .ytcp-playlist-pick-dialog > tp-yt-paper-tabs tp-yt-iron-icon {
      display:none
  }
  tp-yt-paper-tab.ytcp-video-pick-dialog input.ytcp-video-pick-dialog, tp-yt-paper-tab.ytcp-playlist-pick-dialog input.ytcp-playlist-pick-dialog {
      height:32px;
      padding:0
  }
  .search.ytcp-playlist-pick-dialog {
      min-height:0
  }
          /*basic info*/
  ytcp-form-input-container.ytcp-channel-editing-channel-name input.ytcp-channel-editing-channel-name {
      font-size:20px;
      font-weight:500;
      line-height:33px!important;
  }
  #handle-input.ytcp-channel-editing-channel-handle, ytcp-form-input-container.ytcp-channel-editing-channel-handle .handle-input-container.ytcp-channel-editing-channel-handle, #textbox.ytcp-social-suggestions-textbox {
      font-size:13px;
      line-height:normal!important
  }
  #validity-indicator-container.ytcp-channel-editing-channel-handle {
      height:15px
  }
  #child-input.ytcp-form-input-container {
      height:auto
  }
  #add-translation-button.ytcp-channel-editing-details-tab {
      margin-left:0
  }

  .section.ytcp-channel-editing-sections-tab {
      margin:12px 0
  }





  /*SUPER HACKS*/
  .page.selected.ytcp-app[name="channel.editing"]:before {
      content:"";
      background:#f1f1f1;
      height:100px;
      top:0;
      width:calc(100% - 10px);
      overflow:hidden;
      position:absolute
  }
  .section.ytcp-channel-editing-images-tab {
      padding:0
  }
  .main-sections.ytcp-channel-editing-images-tab, [name="channel.editing"]  {
      max-width:1003px;
      min-width:0;
      flex-grow:initial
  }
  iron-pages.ytcp-channel-editing-section {
      position:relative
  }
  [name="channel.editing"] .section.ytcp-channel-editing-images-tab:nth-child(2) {
      position:absolute;
      top:-257px;
      left:0;
      padding:0;
      width:1003px
  }
  [name="channel.editing"] ytcp-sticky-header {
      margin-top:145px
  }
  ytcp-primary-action-bar {
      height:46px
  }
  .guide.ytcp-banner-upload, .label.ytcp-banner-upload, .description.ytcp-banner-upload, .guide.ytcp-banner-upload, .description.ytcp-profile-image-upload:not(.instructions), .label.ytcp-profile-image-upload, .description.ytcp-profile-image-upload .guide {
      display:none
  }
  svg.ytcp-banner-upload > * {
      display:none
  }
  .button-layer.ytcp-banner-upload, .content.ytcp-profile-image-upload {
      margin:0;
      display:inline-block
  }
  .content.ytcp-banner-upload {
      margin:0;
      height:165px;
      border-bottom:1px solid #e2e2e2
  }
  .preview.ytcp-banner-upload svg {
      z-index:2;
      position:relative;
      overflow:visible;
      width:100%!important;
      height:auto
  }
  svg.ytcp-banner-upload > image:nth-of-type(2) {
      position:absolute;
      width:1003px;
      height:auto;
      z-index:2;
      display:inline-block!important;
      x:0;
      y:0;
  }
  .ytcp-banner-upload #replace-button {
      z-index:4;
      position:absolute;
      right:0;
      height:32px;
      padding:0 9px;
      border-top:0;
      border-right:0;
      opacity:0
  }
  .content.ytcp-banner-upload:hover .ytcp-banner-upload #replace-button {
      opacity:1
  }
  .preview.ytcp-profile-image-upload {
      width:100px;
      height:100px;
      background-color: #e9ecee;
      box-shadow: 0 1px 1px rgb(0 0 0 / 40%);
  }
  .preview.ytcp-profile-image-upload img {
      width:100px;
      height:100px;
      border-radius:0
  }
  ytcp-profile-image-upload {
      position:absolute;
      top:-257px;
      z-index:44;
      left:15px
  }
  .instructions.ytcp-profile-image-upload, .button-layer.ytcp-profile-image-upload {
      margin:0
  }
  .instructions.ytcp-profile-image-upload #replace-button {
      position:absolute;
      top:0;
      left:68px;
      padding:0 9px;
      height:32px;
      border-top:0;
      border-right:0;
      opacity:0
  }
  .content.ytcp-profile-image-upload .preview:hover ~ .instructions.ytcp-profile-image-upload #replace-button, .instructions.ytcp-profile-image-upload #replace-button:hover {
      opacity:1
  }
  .instructions.ytcp-profile-image-upload #remove-button {
      display:none
  }

  ytcp-channel-editing-thumbnail.ytcp-spotlight-section-item {
      width:520px;
      height:257.5px
  }
  .section-metadata.ytcp-spotlight-section-item h4.ytcp-spotlight-section-item {
      display:none
  }
  .video-title-container.ytcp-spotlight-section-item>span.ytcp-spotlight-section-item {
      font-size:14px;
      font-weight:500;
      color:#167ac6
  }
  .section-label.ytcp-spotlight-section, .section-label.ytcp-shelves-section {
      display:none
  }
  [name="channel.editing"] ytcp-primary-action-bar tp-yt-paper-tab {
      padding: 0 3px 3px;
      cursor: pointer;
      background: none;
      color: #666;
      font-size: 13px;
      font-weight: normal;
      height: 29px;
      line-height: 29px;
      vertical-align: bottom;
      width:auto;
      min-width:0;
      border:none;
      box-sizing:border-box;
      min-height:0!important
  }
  [name="channel.editing"] ytcp-primary-action-bar tp-yt-paper-tab .tp-yt-paper-tab[style-target=tab-content] {
      margin:0;
      display:inline;
      font-size:13px;
      line-height:normal
  }
  [name="channel.editing"] tp-yt-paper-tabs {
      height:32px;
      min-height:0;
  }
  [name="channel.editing"] .tabs-content.tp-yt-paper-tabs {
      border:0
  }
  [name="channel.editing"] ytcp-primary-action-bar tp-yt-paper-tab.iron-selected[style-target=host], [name="channel.editing"] ytcp-primary-action-bar tp-yt-paper-tab:hover {
      border-bottom:3px solid #cc181e;
      border-top:0;
      padding:0 3px
  }
  [name="channel.editing"] ytcp-primary-action-bar tp-yt-paper-tab:not(:first-of-type) {
      margin-left:20px
  }
  [name="channel.editing"] ytcp-primary-action-bar tp-yt-paper-tab:nth-of-type(2) { /*remove branding*/
      display:none
  }
  [name="channel.editing"] tp-yt-paper-tab.ytcp-primary-action-bar span.ytcp-primary-action-bar {
      font-weight:400
  }
  [name="channel.editing"] ytcp-primary-action-bar tp-yt-paper-tab.iron-selected[style-target=host] .ytcp-primary-action-bar {
      color:#333;
      font-weight:500
  }
  .personal-name-edit.ytcp-channel-editing-channel-name, .brand-name-edit.ytcp-channel-editing-channel-name {
      margin:0;
  }
  .ytcp-channel-editing-channel-name div#outer.ytcp-form-input-container.style-scope {
      border-color:transparent;
      padding:1px 1px 1px 0
  }
  .ytcp-channel-editing-channel-name div#outer.ytcp-form-input-container.style-scope:hover {
      border-color:#f6f6f6;
      background:#f6f6f6
  }
  .ytcp-channel-editing-channel-name div#outer.ytcp-form-input-container.style-scope:focus-within {
      background:#fff
  }
  ytcp-channel-editing-channel-name.channel-name {
      position:absolute;
      top:-82px;
      z-index:4;
      left:15px
  }
  [name="channel.editing"] #replace-button .label.ytcp-button {
      font-size:0;
  }
  [name="channel.editing"] #replace-button .label.ytcp-button:after {
      content:"";
      display:inline-block;
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-channels-c4-editor-vflxIbTxG.png) -127px 0;
      background-size: auto;
      width: 13px;
      height: 12px;
  }
          /*some abt page stuff*/
  .section-label.ytcp-channel-editing-details-tab:first-of-type {
      display:none
  }
  #add-link-button.ytcp-channel-links {
      margin:0
  }
  /*settings*/
  #dialog-title.ytcp-settings-dialog {
      font:500 14px roboto;
      text-transform:uppercase;
      margin:0;
      padding:10px 0 0 22px
  }
  #settings-dialog #dialog.ytcp-dialog {
      width:calc(100% - 300px)!important;
      height:calc(100% - 200px)!important;
      max-width:none!important;
      left:initial!important;
      margin:100px 150px;
      top:initial!important;
      border-radius:0;
      border: 1px solid #ccc;
  }
  #content.ytcp-navigation {
      width:calc(100% - 300px)
  }
  .menu-item.ytcp-navigation>span.ytcp-navigation {
      color:inherit;
      padding:0;
      line-height:24px;
      font-size:11px;
      font-family:roboto,arial;
  }
  .menu-item.ytcp-navigation {
      color:#555
  }
  ytcp-navigation[keyboard-focus] .menu-item.ytcp-navigation[selected]:focus, .menu-item.ytcp-navigation[selected] {
      background:#cc181e;
      color:#fff
  }
  .nav-drawer.ytcp-navigation {
      max-width:215px
  }
          /*channel -> feature eligibility*/
  .features-summary.yt-trust-tiers-home-level {
      display:none
  }
  .feature-level.yt-trust-tiers-home-level {
      background-color: #f8f8f8;
      border: solid 1px #e2e2e2;
      border-radius: 2px;
      display: inline-block;
      font-size: 12px;
      line-height: 16px;
      list-style-type: none;
      margin: 0 5px 20px 0;
      overflow: hidden;
      padding: 15px;
      position:relative;
      min-height:212px;
      display:block
  }
  ytcp-icon-button.yt-trust-tiers-home-level {
      display:none
  }
  .feature-level.yt-trust-tiers-home-level iron-collapse.iron-collapse-closed {
      display:block!important;
      overflow:visible;
      max-height:initial!important
  }
  .feature-level-bar.yt-trust-tiers-home-level {
      border-bottom:solid 1px #e7e6e6
  }
  yt-trust-tiers-home-level.yt-trust-tiers-home {
      margin:0;
      flex-direction:row;
      width:49%;
      display:inline-block;
      vertical-align:top
  }
  yt-trust-tiers-home {
      display:inline-block
  }
  .feature-level-name.yt-trust-tiers-home-level, .feature-level-status.yt-trust-tiers-home-level {
      font:500 14px roboto;
      color:#555;
      margin:0;
      background:none
  }
  .feature-level-status-bar.yt-trust-tiers-home-level {
      margin:0
  }
  .feature-level-unlocked.yt-trust-tiers-home-level:after {
      width:100%;
      height:3px;
      background:#42d916;
      display:inline-block;
      position:absolute;
      content:"";
      left:0;
      bottom:0
  }
  .feature-level-eligible.yt-trust-tiers-home-level:after {
      content:"";
      width:100%;
      height:3px;
      background:#cfcfcf;
      display:inline-block;
      position:absolute;
      left:0;
      bottom:0
  }
  .feature-level-ineligible.yt-trust-tiers-home-level:after {
      content:"";
      width:100%;
      height:3px;
      background:#e62117;
      display:inline-block;
      position:absolute;
      left:0;
      bottom:0
  }
  /*VIDEO DETAILS / INFO AND SETTINGS*/
  [name="video.edit"] {
      max-width:1003px;
  }
  [name="video.edit"] ytcp-video-details-section {
      padding-top:55px
  }
  [name="video.edit"] ytcp-sticky-header {
      border-top:1px solid #e2e2e2;
  }
  [name="video.edit"] ytcp-sticky-header[stuck] {
      position:relative
  }
  [name="video.edit"] .page-title.ytcp-entity-page-header {
      color: #333;
      max-width: 700px;
      height: 1.1em;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      word-wrap: normal;
      font-family:roboto,arial;
      font-weight:400;
      font-size:18px;
      padding:0;
      line-height:normal;
      vertical-align:bottom;
      margin:8px 0
  }
  [name="video.edit"] .primary.ytcp-entity-page-header {
      align-items:flex-end
  }
  [name="video.edit"] ytcp-entity-page-header {
      height:auto;
      padding:20px 20px 15px 20px;
  }
  #video-overflow-menu #overflow-menu-button {
      padding:5px
  }
  .wrapper.ytcp-entity-page-header {
      border-bottom:1px solid #e2e2e2;
      padding-bottom:10px
  }
  div#outer.ytcp-form-input-container.style-scope {
      border:0;
      height:auto;
      padding:0
  }
  ytcp-social-suggestions-textbox {
      height:auto
  }
  .ytcp-video-details-section .left-col.ytcp-video-metadata-editor {
      margin-top:309px;
      width:955px
  }
  ytcp-video-metadata-editor-basics #label.ytcp-form-input-container  {
      display:none
  }
  .input-container.ytcp-video-metadata-editor-basics {
      margin:0;
      max-width:425px
  }
  .input-container.ytcp-video-metadata-editor-basics > ytcp-social-suggestions-textbox {
      margin-bottom:8px
  }
          /*right sidebar cursing*/
  .ytcp-video-details-section .container.ytcp-video-info {
      position:absolute;
      left:-439px;
      border-radius:0;
      background:none;
      display:inline-block;
      max-width:none;
      top:-309px;
      width:955px;
      overflow:visible
  }
  .ytcp-video-details-section .container.ytcp-video-info > ytcp-html5-video-player {
      float:left;
      margin:0;
      margin-right:181px
  }
  .ytcp-video-details-section ytcp-video-info {
      --player-width: 480px;
      --player-height: 270px;
  }
  .input-container.ytcp-video-metadata-editor-sidepanel {
      margin:0
  }
  ytcp-video-metadata-editor.ytcp-video-details-section {
      position:relative
  }
  .ytcp-video-details-section ytcp-video-metadata-editor-sidepanel.ytcp-video-metadata-editor {
      width:323px;
      padding:0;
      position:absolute;
      top:309px;
      left:459px;
  }
  .input-container.ytcp-video-metadata-editor-sidepanel {
      margin-left:29px
  }
  .label.ytcp-video-info {
      font-family: "YouTube Noto",Roboto,arial,sans-serif;
      color: #666;
      font-size: 11px;
      font-weight: normal;
      padding:0;
      min-width:0;
      line-height:normal;
      margin:0;
      display:inline-block;
      width:105px;
      vertical-align:middle;
      padding-bottom:10px;
  }
  .label.ytcp-video-info:after {
      content:":"
  }
  .left.ytcp-video-info {
      display:block
  }
  .row.ytcp-video-info {
      margin-top:10px;
  }
  .value.ytcp-video-info {
      margin:0;
      font-size:11px;
      line-height:normal;
      display:inline-block;
      padding:0;
      width:175px;
      vertical-align:middle;
      padding-bottom:10px;
      color:#444;
      overflow:visible
  }
  .right.ytcp-video-info {
      display:none
  }
  ytcp-video-info[show-video-url] .video-url-fadeable.ytcp-video-info {
      border: 1px solid #d3d3d3;
      color: #333;
      box-shadow: inset 0 0 1px rgb(0 0 0 / 5%);
      padding: 1px 8px;
  }
  ytcp-video-info[show-video-url] .video-url-fadeable.ytcp-video-info:hover {
      border-color: #b9b9b9;
  }
  ytcp-video-info[show-video-url] .video-url-fadeable.ytcp-video-info:active {
      border-color: #167ac6;
      box-shadow: inset 0 0 1px rgb(0 0 0 / 10%);
  }
              /*incredibly funny grid*/
  ytcp-video-metadata-editor-advanced {
      display:grid;
      grid-template-columns:454px 454px;
      column-gap:54px;
      row-gap:3px
  }
  .input-container.ytcp-video-metadata-editor-advanced {
      margin-right:29px
  }
  .input-container.ytcp-video-metadata-editor-advanced:nth-of-type(3), .input-container.ytcp-video-metadata-editor-advanced:nth-of-type(4) {
      grid-column:2
  }
  .input-container.ytcp-video-metadata-editor-advanced:nth-of-type(5) {
      grid-column:1;
      grid-row:2/5
  }
  .input-container.ytcp-video-metadata-editor-advanced:nth-of-type(6) {
      grid-column:1
  }
  .input-container.ytcp-video-metadata-editor-advanced:nth-of-type(7) {
      grid-column:2;
      grid-row:4;
      margin-top:16px
  }
  .input-container.ytcp-video-metadata-editor-advanced:nth-of-type(10) {
      grid-row:6/8;
      grid-column:2
  }
  .ytcp-video-metadata-editor-advanced .chip-and-bar.ytcp-chip-bar .chip:first-of-type {
      margin-left:0!important
  }
  .ytcp-video-metadata-editor-advanced .chip-and-bar.ytcp-chip-bar .chip {
      margin-bottom:4px!important
  }
  .ytcp-video-metadata-editor-advanced .chip-and-bar.ytcp-chip-bar .text-input.ytcp-chip-bar {
      width:100%;
      line-height:normal!important;
      vertical-align:top
  }
  .ytcp-video-metadata-editor-advanced .chip-and-bar.ytcp-chip-bar {
      padding-top:4px;
      padding-bottom:4px
  }
  .chip-bar-right-button.ytcp-chip-bar {
      margin:6px 0 0 0;
      padding:0
  }
  #license .label-text.ytcp-dropdown-trigger, .input-container.ytcp-video-metadata-editor-advanced:nth-of-type(7) .section-label-with-description.ytcp-video-metadata-editor-advanced, .input-container.ytcp-video-metadata-editor-advanced:nth-of-type(6) .section-label-with-description.ytcp-video-metadata-editor-advanced {
      display:none
  }
  .input-container.ytcp-video-metadata-editor-advanced:nth-of-type(6) .label-text.ytcp-dropdown-trigger, .input-container.ytcp-video-metadata-editor-advanced:nth-of-type(7) .label-text.ytcp-dropdown-trigger, .ytcp-form-gaming .label-text.ytcp-dropdown-trigger, .input-container.ytcp-video-metadata-editor-advanced:last-of-type .label-text.ytcp-dropdown-trigger { /*fake title*/
      position:absolute;
      color: #555;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 8px;
      padding: 0;
      line-height: 1;
      left:0;
  }
  #help-icon.ytcp-dropdown-trigger {
      display:none
  }
  .ytcp-video-metadata-editor .ytcp-form-autocomplete .container.ytcp-dropdown-trigger { /*video location searchbox*/
      background:#fff!important;
  }
  .ytcp-video-metadata-editor input.ytcp-form-autocomplete {
      font-size:13px
  }
  .ytcp-video-metadata-editor .ytcp-form-autocomplete .container.ytcp-dropdown-trigger:hover {
      border-color:#b9b9b9;
      box-shadow:none
  }
  .ytcp-video-metadata-editor .ytcp-form-autocomplete .container.ytcp-dropdown-trigger:active, .ytcp-video-metadata-editor .ytcp-form-autocomplete .container.ytcp-dropdown-trigger:focus-within {
      box-shadow:inset 0 0 1px rgb(0 0 0 / 10%);
      border-color:#167ac6!important
  }
  .ytcp-video-metadata-editor .row.ytcp-video-metadata-editor-advanced .container.ytcp-dropdown-trigger {
      margin-top:10px
  }
  #category-container.ytcp-video-metadata-editor-advanced > .row.ytcp-video-metadata-editor-advanced .container.ytcp-dropdown-trigger, #license .container.ytcp-dropdown-trigger {
      margin-top:0;
  }
  #license .container.ytcp-dropdown-trigger {
      margin-bottom:0
  }
          /*privacy*/
  #label.ytcp-video-metadata-visibility {
      display:none
  }
  #visibility-text.ytcp-video-metadata-visibility, #restrictions.ytcp-video-metadata-restrictions .restriction.ytcp-video-metadata-restrictions, #restrictions.ytcp-video-metadata-restrictions .label.ytcp-video-metadata-restrictions {
      padding:0;
      font:500 11px roboto,arial;
      line-height:26px;
      text-shadow: 0 1px 0 rgb(255 255 255 / 50%);
      color:#333
  }
  #restrictions.ytcp-video-metadata-restrictions .restriction.ytcp-video-metadata-restrictions, #restrictions.ytcp-video-metadata-restrictions .label.ytcp-video-metadata-restrictions {
      display:inline
  }
  #restrictions.ytcp-video-metadata-restrictions .label.ytcp-video-metadata-restrictions {
      padding-left:10px
  }
  #restrictions.ytcp-video-metadata-restrictions .label.ytcp-video-metadata-restrictions:after {
      content:": "
  }
  #privacy-icon.ytcp-video-metadata-visibility {
      display:none
  }
  #select-button.ytcp-video-metadata-visibility {
      padding:0;
          float: right;
      width: 0;
      height: 0;
      border: 1px solid transparent;
      border-width: 4px 4px 0;
      border-top-color: #666;
      margin-top: 2px;
      margin-right: 10px;
      color:transparent
  }
  #container.ytcp-video-metadata-visibility, #restrictions.ytcp-video-metadata-restrictions {
      border: 1px solid #d3d3d3;
      cursor: pointer;
      text-shadow: 0 1px 0 rgb(255 255 255 / 50%);
      background-color: #f8f8f8;
      background-image: linear-gradient(to bottom,#fcfcfc 0,#f8f8f8 100%);
      border-radius:0;
      margin-bottom:15px;
      min-height:0;
      padding:0
  }
  #container.ytcp-video-metadata-visibility:hover, #restrictions.ytcp-video-metadata-restrictions:hover {
      border-color:#b9b9b9
  }
  #restrictions.ytcp-video-metadata-restrictions[disabled], #container.ytcp-video-metadata-visibility[disabled] {
      background-color: #f8f8f8;
      background-image: linear-gradient(to bottom,#fcfcfc 0,#f8f8f8 100%);
      opacity:.5;
      cursor:default;
      border-color:#d3d3d3
  }
  .ytcp-video-metadata-editor .left-icon.ytcp-dropdown-trigger, .ytcp-video-metadata-editor .right-container.ytcp-dropdown-trigger {
      display:none
  }
  .dropdown-trigger-text.ytcp-text-dropdown-trigger {
      font:400 11px roboto;
      padding:0;
      line-height:28px;
      color:#333
  }
  .ytcp-video-metadata-editor .container.ytcp-dropdown-trigger {
      margin-bottom:15px
  }
  .section-description.ytcp-video-metadata-editor-basics, .section-label-with-description.ytcp-video-metadata-editor-basics { /*playlist*/
      display:none
  }
  .compact-row.ytcp-video-metadata-editor-basics {
      position:absolute;
      width:294px;
      left:488px;
      margin-top:80px
  }
  .col.ytcp-video-metadata-editor-basics {
      min-width:294px
  }
  .use-placeholder.ytcp-text-dropdown-trigger .dropdown-trigger-text.ytcp-text-dropdown-trigger {
      font-size:0;
      line-height:27px
  }
  [name="video.edit"] .ytcp-video-metadata-editor-basics .use-placeholder.ytcp-text-dropdown-trigger .dropdown-trigger-text.ytcp-text-dropdown-trigger:before {
      content:"";
      margin-right: 4px;
      vertical-align: sub;
      display: inline-block;
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-editor-vflFFpeNg.webp) -190px 0;
      background-size: auto;
      width: 13px;
      height: 10px;
      line-height:27px
  }
  .ytcp-video-metadata-editor-basics .use-placeholder.ytcp-text-dropdown-trigger .dropdown-trigger-text.ytcp-text-dropdown-trigger:after {
      content:"+Add to Playlist";
      font-size:11px;
  }
          /*made for kids*/
  #audience.ytcp-video-metadata-editor-basics .section-label.ytcp-video-metadata-editor-basics, .mfk-infobox-container.ytkc-made-for-kids-select {
      display:none
  }
  ytcp-age-restriction-select#age-restriction {
      display:inline!important
  }
          /*thubmys*/
  .sublabel.ytcp-thumbnails-compact-editor-old, .label.ytcp-thumbnails-compact-editor-old {
      display:none
  }
  .ytcp-video-details-section ytcp-thumbnails-compact-editor-old.ytcp-video-metadata-editor-basics {
      position:absolute;
      top:0;
      left:514px;
      z-index:4
  }
  #still-picker.ytcp-thumbnails-compact-editor-old {
      flex-direction:column
  }
  ytcp-still-cell, ytcp-thumbnails-compact-editor-uploader-old {
      --ytcp-thumbnails-still-width: 120px;
      --ytcp-thumbnails-still-height: 67.5px;
      --ytcp-thumbnails-still-border: 3px;
      border-radius:0
  }
  #add-photo-icon {
      display:none
  }
  .still.ytcp-still-cell .container.ytcp-img-with-fallback {
      padding:1px
  }
  ytcp-still-cell[selected] .still.ytcp-still-cell {
      border-color: #828282;
      border-radius:0
  }
          /*advanced radios*/
  .radio-button-title.ytkc-made-for-kids-select, .radio-button-title.ytcp-age-restriction-select, .section-label-with-description[class] { /*title*/
      color: #555;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 8px;
      padding:0;
      line-height:1
  }
  .radio-button-title.ytcp-age-restriction-select {
      margin-top:12px
  }
  .description.ytcp-age-restriction-select, .description.ytkc-made-for-kids-select, .section-description[class] { /*sub*/
      font-size:12px;
      color:#888
  }
  .section-description.ytcp-video-metadata-editor-advanced {
      display:none
  }
  .made-for-kids-rating-container.ytkc-made-for-kids-select {
      padding:0;
      margin:0
  }
  #offRadio.tp-yt-paper-radio-button, #checkbox.ytcp-checkbox-lit {
      border: 1px solid #c6c6c6;
      display: inline-block;
      vertical-align: middle;
      cursor: pointer;
      background-size: auto;
      width: 16px;
      height: 16px;
  }
  ytcp-checkbox-lit {
      padding:0!important
  }
  .input-container.ytcp-video-metadata-editor-advanced {
      margin-bottom:18px
  }
  .places-header.ytcp-video-metadata-editor-advanced {
      margin-bottom:0
  }
  tp-yt-paper-radio-button tp-yt-paper-radio-button .tp-yt-paper-radio-button[style-target=label], .tp-yt-paper-radio-button[style-target=label], .label.ytcp-checkbox-lit {
      color:#333;
      font-size:13px
  }
  .tp-yt-paper-radio-button[style-target=container], #checkbox-container.ytcp-checkbox-lit {
      max-width:16px;
      height:17px;
      margin-right:0;
      margin-left:0
  }
  #onRadio.tp-yt-paper-radio-button {
      opacity:0
  }
  tp-yt-paper-radio-button[checked] #onRadio.tp-yt-paper-radio-button {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflbQfoQG.webp) -171px -233px;
      background-size: auto;
      width: 14px;
      height: 14px;
      transform:initial;
      top:1px;
      left:1px;
      opacity:1
  }
  tp-yt-paper-radio-button[checked] #offRadio.tp-yt-paper-radio-button {
      border-color:#c6c6c6
  }
  tp-yt-paper-radio-button[checked]:hover #offRadio.tp-yt-paper-radio-button, tp-yt-paper-radio-button:hover #offRadio.tp-yt-paper-radio-button, #checkbox-container.ytcp-checkbox-lit:hover #checkbox.ytcp-checkbox-lit {
      border-color:#b9b9b9;
      transition:none
  }
  tp-yt-paper-radio-button[checked]:focus #offRadio.tp-yt-paper-radio-button, tp-yt-paper-radio-button:focus #offRadio.tp-yt-paper-radio-button {
      border-color:#4496e7;
      box-shadow: inset 0 0 1px rgb(0 0 0 / 10%);
      background-color:transparent
  }
  #checkbox-container.ytcp-checkbox-lit #checkbox.ytcp-checkbox-lit {
      border-radius:0
  }
  ytcp-checkbox-lit[checked] #checkbox.ytcp-checkbox-lit {
      border: 1px solid #36649c!important;
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-hitchhiker-vflbQfoQG.webp) -416px -51px;
      border-radius:0;
  }
  ytcp-checkbox-lit[checked] #checkbox.ytcp-checkbox-lit #checkmark {
      display:none
  }
  .expand-button.ytcp-video-metadata-editor-basics {
      display:none
  }
          /*sidebar*/
  .back-button-text.ytcp-navigation-drawer {
      font-size:0;
  }
  .back-button-text.ytcp-navigation-drawer:before {
      content:"Video Manager";
      font-size:11px
  }
  ytcp-video-overflow-menu #overflow-menu-button tp-yt-iron-icon, #more-menu-button tp-yt-iron-icon {
      margin-top:6px;
      margin-left:6px
  }
  #label-help-tooltip.ytcp-form-input-container, .thumbnail.ytcp-navigation-drawer {
      display:none
  }
  [layout="video"] .top-section.ytcp-navigation-drawer {
      position:absolute;
      left:225px;
      background:#fff;
      padding-left:20px;
      width:983px;
      border-bottom:1px solid #e2e2e2;
      overflow:visible;
      height:55px
  }
  [layout="video"] .top-section.ytcp-navigation-drawer:before {
      content:"";
      display:inline-block;
      background:#f1f1f1;
      width:1003px;
      position:absolute;
      height:10px;
      top:-10px;
      left:0
  }
  [layout="video"] .top-section.ytcp-navigation-drawer #main-menu, [layout="video"] .top-section.ytcp-navigation-drawer #main-menu > li {
      width:auto;
      display:inline-block;
      overflow:hidden;
      height:55px;
  }
  [layout="video"] nav.ytcp-navigation-drawer {
      z-index:6
  }
  [layout="video"]  .top-section.ytcp-navigation-drawer tp-yt-paper-icon-item.ytcp-navigation-drawer {
      padding:18px 8px 0 8px;
      border-bottom:4px solid transparent;
      margin-right:17px;
      font-weight: 500;
      font-size: 11px;
      height: 55px;
      min-width: 0;
      box-sizing:border-box;
      background:none!important
  }
  [layout="video"]  .top-section.ytcp-navigation-drawer tp-yt-paper-icon-item.ytcp-navigation-drawer.iron-selected, [layout="video"]  .top-section.ytcp-navigation-drawer tp-yt-paper-icon-item.ytcp-navigation-drawer:hover {
      border-bottom-color:#cc181e
  }
  [layout="video"] .top-section.ytcp-navigation-drawer .nav-item-text.ytcp-navigation-drawer {
      text-transform:none;
      color:#333
  }
  [layout="video"] [href*="edit?o=U"]  tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-creatoreditor-vfl5BJeU_.webp) 0 -214px;
      background-size: auto;
      width: 17px;
      height: 18px;
      background-position:0 -214px!important
  }
  [layout="video"] [href*="edit?o=U"] .content-icon.tp-yt-paper-icon-item, [layout="video"] [href*="editor"] .content-icon.tp-yt-paper-icon-item, [layout="video"] [href*="translations"] .content-icon.tp-yt-paper-icon-item {
      width:17px;
      margin-top:-1px
  }
  [layout="video"] .top-section.ytcp-navigation-drawer .content-icon.tp-yt-paper-icon-item {
      width:17px
  }
  [layout="video"] [href*="analytics"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer  {
      background-size: 40px 814.4px;
      width:17px;
      height:18px;
      background-position:-21px -408px!important
  }
  [layout="video"] [href*="editor"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer  {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-creatoreditor-vfl5BJeU_.webp) 0 -60px!important;
      background-size: auto;
      width: 17px;
      height: 18px;
  }
  [layout="video"] [href*="translations"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
      background: no-repeat url(//s.ytimg.com/yts/imgbin/www-creatoreditor-vfl5BJeU_.webp) 0 -22px!important;
      background-size: auto;
      width: 17px;
      height: 18px;
  }
  [layout="video"] [href*="comments/inbox"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
      background-size: 40px 814.4px;
      width:17px;
      height:18px;
      background-position:-1px -775px!important
  }
  [layout="video"] [href*="comments/inbox"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer:before {
      top:2px;
      left:2px;
      width:12px;
      height:12px
  }
  [layout="video"] [href*="copyright"] tp-yt-paper-icon-item.ytcp-navigation-drawer tp-yt-iron-icon.ytcp-navigation-drawer {
      background-size: 40px 814.4px;
      width:17px;
      height:18px;
      background-position:-1px -796px!important
  }
  /*VIDEO ANALYITICS*/
  [name="video.analytics"] {
      max-width:1327px;
  }
  [name="video.analyitics"] ytcp-video-details-section {
      padding-top:55px
  }
  /*LIVE DASHBOARD*/
  /*first load popup*/
  .ytls-user-experience-dialog #dialog.ytcp-dialog .header.ytcp-dialog {
      display:none
  }
  #body-content.ytls-user-experience-dialog {
      padding:0 20px 15px;
      margin-bottom:0px;
      background:#fff;
      color:#333;
      font-size:13px;
      line-height:normal;
      width:100%
  }
  .ytls-user-experience-dialog .content.ytcp-dialog #dialog-content {
      flex:1;
      display:flex;
      width:100%
  }
  .ytls-user-experience-dialog #dialog.ytcp-dialog {
      background:#f1f1f1
  }
  h2.ytls-user-experience-dialog {
      background:#2793E6;
      margin:0 -20px;
      line-height: 50px;
      font-size: 21px;
      text-align:left;
      padding-left:21px;
      color:#fff
  }
  #dialog-body.ytls-user-experience-dialog {
      text-align:left;
      margin-top:15px;
      font-weight:500;
      color:#333;
      font-size:13px;
      line-height:normal
  }
  .selection.ytls-user-experience-dialog {
      background:none;
      padding:0
  }
  .selection-title.ytls-user-experience-dialog {
      font-weight:500
  }
  ytls-user-experience-dialog[dialog-type] ytcp-button.ytls-user-experience-dialog[type=filled] {
      position:absolute;
      bottom:15px;
      right:20px;
      z-index:2
  }
  .selection.ytls-user-experience-dialog ytcp-button.ytls-user-experience-dialog[type=filled] > div {
      font-size:0;
      color:#fff
  }
  .selection.ytls-user-experience-dialog:first-of-type ytcp-button.ytls-user-experience-dialog[type=filled] > div:before {
      content:"Webcam";
      font-size:11px
  }
  h2 ~ .selection.ytls-user-experience-dialog:first-of-type ytcp-button.ytls-user-experience-dialog[type=filled] > div:before {
      content:"Right now";
      font-size:11px
  }
  .selection.ytls-user-experience-dialog:last-of-type ytcp-button.ytls-user-experience-dialog[type=filled] > div:before {
      content:"Software";
      font-size:11px
  }
  h2 ~ .selection.ytls-user-experience-dialog:last-of-type ytcp-button.ytls-user-experience-dialog[type=filled] > div:before {
      content:"Later date";
      font-size:11px
  }
  .selection.ytls-user-experience-dialog:last-of-type ytcp-button.ytls-user-experience-dialog[type=filled] {
      right:100px
  }
  .selection.ytls-user-experience-dialog h3.ytls-user-experience-dialog {
      color:#333;
      font-weight:500;
      font-size:13px;
      line-height:normal
  }
  tp-yt-iron-icon.ytls-user-experience-dialog {
      background:none;
      fill:#888
  }
  .ytls-user-experience-dialog .footer {
      bottom:0;
      height:58px
  }
  #bottom-content.ytls-user-experience-dialog {
      margin-bottom:15px;
      padding-left:20px;
      justify-content:flex-start;
      align-items:end;
      height:43px
  }
  /*actual live dashboard*/
  .ytls-core-app {
      --ytls-menu-header-background:#fff;
      --yt-spec-black-3:#f1f1f1;
      --yt-spec-black-2:#fff;
      --yt-spec-brand-background-solid:#fbfbfb;
      --yt-spec-menu-background:#fff;
      --ytcp-text-secondary:#333;
      --ytcp-text-primary:#333;
      --ytls-default-text-color:#3f3f3f;
      --paper-input-container-input-color:#333;
      --yt-spec-text-primary:#333;
      --ytls-inline-text-paragraph-color:#333;
      --ytcp-general-background-b:transparent;
      
          --yt-live-chat-background-color: #fff;
      --yt-live-chat-action-panel-background-color: rgb(248, 248, 248);
      --yt-live-chat-secondary-background-color: #fff;
      --yt-live-chat-toast-text-color: #333
      --yt-live-chat-toast-background-color: #fff;
      --yt-live-chat-mode-change-background-color: #fff;
      --yt-live-chat-primary-text-color: #000;
      --yt-live-chat-secondary-text-color: rgba(0, 0, 0, 0.7);
      --yt-live-chat-tertiary-text-color: rgba(0, 0, 0, 0.54);
      --yt-live-chat-enabled-send-button-color: #333;
      --yt-live-chat-disabled-icon-button-color: rgba(0, 0, 0, 0.3);
      --yt-live-chat-picker-button-color: var(--yt-live-chat-tertiary-text-color);
      --yt-live-chat-picker-button-active-color: #000;
      --yt-live-chat-picker-button-disabled-color: var( --yt-live-chat-disabled-icon-button-color );
      --yt-live-chat-picker-button-hover-color: rgba(0, 0, 0, 0.74);
      --yt-live-chat-mention-background-color: #ff5722;
      --yt-live-chat-mention-text-color: #fff;
      --yt-live-chat-deleted-message-color: rgba(0, 0, 0, 0.5);
      --yt-live-chat-deleted-message-bar-color: rgba(0, 0, 0, 0.5);
      --yt-live-chat-error-message-color: var(--yt-spec-brand-link-text);
      --yt-live-chat-reconnect-message-color: #333;
      --yt-live-chat-disabled-button-background-color: #eee;
      --yt-live-chat-disabled-button-text-color: var( --yt-live-chat-secondary-text-color );
      --yt-live-chat-sub-panel-background-color: #eee;
      --yt-live-chat-sub-panel-background-color-transparent: rgba(162, 162, 162, 0.7);
      --yt-live-chat-header-background-color: var( --yt-live-chat-action-panel-background-color );
      --yt-live-chat-header-button-color: var(--yt-live-chat-secondary-text-color);
      --yt-live-chat-moderator-color: #5e84f1;
      --yt-live-chat-owner-color: #ffd600;
      --yt-live-chat-message-highlight-background-color: #fff;
      --yt-live-chat-author-chip-owner-text-color: var(--yt-deprecated-luna-black);
      --yt-live-chat-author-chip-verified-background-color: var(--yt-spec-grey-5);
      --yt-live-chat-author-chip-verified-text-color: var(--yt-spec-white-4);
      --yt-live-chat-sponsor-color: #2ba640;
      --yt-live-chat-overlay-color: rgba(0, 0, 0, 0.5);
      --yt-live-chat-dialog-background-color: #fff;
      --yt-live-chat-dialog-text-color: var(--yt-spec-static-brand-white);
      --yt-live-chat-button-default-text-color: var(--yt-spec-static-brand-white);
      --yt-live-chat-button-default-background-color: var( --yt-deprecated-white-opacity-lighten-4 );
      --yt-live-chat-button-dark-text-color: var(--yt-spec-static-brand-white);
      --yt-live-chat-button-dark-background-color: var( --yt-deprecated-white-opacity-lighten-4 );
      --yt-emoji-picker-variant-selector-bg-color: #fff;
      --yt-live-chat-moderation-mode-hover-background-color: rgba( 255, 255, 255, 0.3 );
      --yt-live-chat-additional-inline-action-button-color: var(--yt-grey);
      --yt-live-chat-text-input-field-suggestion-background-color: #fff;
      --yt-live-chat-text-input-field-suggestion-background-color-hover: #fff;
      --yt-emoji-picker-search-background-color: #ddd;
      --yt-emoji-picker-search-color: #000;
      --yt-emoji-picker-search-placeholder-color: #999;
      --yt-emoji-picker-base-with-variants-border: var(--yt-spec-white-1-alpha-25);
      --yt-live-chat-slider-active-color: #2196f3;
      --yt-live-chat-slider-container-color: #515151;
      --yt-live-chat-slider-markers-color: #fff;
      --yt-live-chat-poll-editor-start-button-background-color-disabled: var( --yt-spec-grey-1 );
      --yt-live-chat-automod-button-background-color: var( --yt-deprecated-opalescence-grey-opacity-lighten-3 );
      --yt-live-chat-automod-button-background-color-hover: rgba( 255, 255, 255, 0.5 );
      --yt-live-chat-automod-button-explanation-color: rgba(255, 255, 255, 0.7);
      --yt-live-chat-countdown-opacity: 0.5;
      --yt-live-chat-shimmer-background-color: rgba(17, 17, 17, 0.4);
      --yt-live-chat-shimmer-linear-gradient: linear-gradient( 0deg, rgba(0, 0, 0, 0.1) 40%, rgba(100, 100, 100, 0.3) 50%, rgba(0, 0, 0, 0.1) 60% );
      --yt-live-chat-vem-background-color: #fff;
      --yt-live-chat-product-picker-icon-color: rgba(4, 4, 4, 0.5);
      --yt-live-chat-product-picker-hover-color: rgba(68, 68, 68, 1);
      --yt-live-chat-product-picker-disabled-icon-color: rgba(55, 55, 55, 0.3);
  }
  .ytls-core-app iron-input.tp-yt-paper-input > input.tp-yt-paper-input, .ytls-core-app #paragraph-text.ytls-inline-text-renderer, .ytls-broadcast-edit-dialog iron-input.tp-yt-paper-input > input.tp-yt-paper-input {
      color:#333
  }
  ytls-header {
      height:49px;
      border-bottom:1px solid #e8e8e8
  }
  #header-container.ytls-core-app {
      box-shadow:none
  }
  #header.ytls-live-dashboard-widget-renderer {
      border-bottom:1px solid #e2e2e2
  }
  #header.ytls-live-dashboard-widget-renderer tp-yt-paper-tabs {
      height:43px;
      font-size:13px
  }
  tp-yt-paper-tab.ytls-live-dashboard-widget-renderer {
      border-bottom:4px solid transparent;
      box-sizing:border-box;
      padding:0 15px;
      margin-right:3px
  }
  tp-yt-paper-tab.ytls-live-dashboard-widget-renderer.iron-selected, tp-yt-paper-tab.ytls-live-dashboard-widget-renderer:hover {
      border-bottom-color:#cc181e;
      color:#cc181e
  }
  #header.ytls-inline-text-renderer, .ytls-core-app #labelAndInputContainer#labelAndInputContainer.label-is-floating>label {
      font:500 13px 'roboto',arial;
      color:#000!important;
      transform:unset;
  }
  .ytls-core-app #labelAndInputContainer#labelAndInputContainer.label-is-floating>label {
      top:-22px
  }
  .floated-label-placeholder.tp-yt-paper-input-container {
      height:22px
  }
  .ytls-core-app .input-wrapper.tp-yt-paper-input-container {
      border: 1px solid #d3d3d3;
      color: #333;
      background-image: linear-gradient(to bottom,#fcfcfc 0,#f8f8f8 100%);
      text-shadow: 0 1px 0 rgb(255 255 255 / 50%);
  }
  .ytls-core-app .input-wrapper.tp-yt-paper-input-container:hover {
      border-color:#b9b9b9
  }
  .ytls-core-app .input-wrapper.tp-yt-paper-input-container:active {
      border-color: #167ac6;
      box-shadow: inset 0 0 1px rgb(0 0 0 / 10%);
  }
  .ytls-core-app .input-wrapper.tp-yt-paper-input-container ~ .underline {
      display:none
  }
  .ytls-core-app .input-wrapper.tp-yt-paper-input-container input.tp-yt-paper-input {
      font-size:13px;
      line-height:22px;
      padding:0 10px
  }
  .ytls-core-app tp-yt-paper-input.ytls-ingestion-dropdown-trigger-renderer .input-content.tp-yt-paper-input-container>iron-input input.tp-yt-paper-input, .ytls-core-app tp-yt-paper-dropdown-menu.ytls-dropdown-renderer .input-content.tp-yt-paper-input-container>iron-input input {
      font-size:11px;
      font-weight:500;
      line-height:18px
  }
  /*chat*/
  #avatar.yt-live-chat-message-input-renderer, yt-live-chat-author-chip {
      display:none
  }
  #top.yt-live-chat-message-input-renderer {
      margin:0 30px;
      z-index:22222;
      position:relative
  }
  yt-live-chat-message-input-renderer {
      padding:0;
      overflow:hidden
  }
  #engage-with-audience-picker, #count.yt-live-chat-message-input-renderer {
      display:none
  }
  #buttons.yt-live-chat-message-input-renderer {
      margin:0;
      position:absolute;
      top:0;
      width:100%
  }
  #button.yt-live-chat-icon-toggle-button-renderer, #message-buttons yt-icon-button.yt-button-renderer {
      width:32px;
      height:32px;
      padding:2px
  }
  /*edit popup*/
  .ytls-broadcast-edit-dialog tp-yt-paper-dialog {
      --paper-dialog-background-color:#fff;
      --ytcp-text-secondary:#333;
      --ytcp-text-primary:#333;
      --ytcp-form-input-container-disabled-background:#f8f8f8;
      --paper-dialog-color:#333;
      --ytcp-dropdown-trigger-disabled-background-color:#f8f8f8;
      --ytcp-container-border-color:#d3d3d3
  }
  .ytls-broadcast-edit-dialog .header-content.ytcp-dialog {
      display:none
  }
  .ytls-broadcast-edit-dialog .nav-drawer.ytcp-navigation {
      width:auto;
      max-width:0;
      min-width:0
  }
  .ytls-broadcast-edit-dialog .nav-drawer.ytcp-navigation > ul {
      position:absolute;
      bottom:10px;
      display:inline-block;
      z-index:444
  }
  .ytls-broadcast-edit-dialog .nav-drawer.ytcp-navigation ytcp-ve {
      display:inline-block
  }
  .ytls-broadcast-edit-dialog .nav-drawer.ytcp-navigation [selected] {
      display:none
  }
  .ytls-broadcast-edit-dialog ytcp-video-metadata-editor-advanced {
      grid-template-columns: 444px 444px;
  }
  .ytls-broadcast-edit-dialog #content.ytcp-navigation {
      width:calc(100% - 74px)
  }
  .ytls-broadcast-edit-dialog .compact-row.ytcp-video-metadata-editor-basics {
      position:static;
      top:0;
      margin:0
  }
  .ytls-broadcast-edit-dialog .footer {
      background:#f1f1f1
  }
  .ytls-broadcast-edit-dialog .footer #cancel-button {
      margin-right:8px
  }
  `;
}
if ((location.hostname === "studio.youtube.com" || location.hostname.endsWith(".studio.youtube.com"))) {
  css += `
  ytd-multi-page-menu-renderer {
  border-radius: 0 !important;
  background: var(--yt-spec-brand-background-primary) !important;
  border: 1px solid var(--yt-spec-10-percent-layer) !important;
  box-shadow: none !important;
  backdrop-filter: none !important;
  }
  [d*="M21,6H3V5h18V6z M21,11H3v1h18V11z M21,17H3v1h18V17z"] {
  d: path("M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z");
  }
  [d*="M10 16V20H4V16H10ZM11 15H3V21H11V15ZM20 4V8H14V4H20ZM21 3H13V9H21V3ZM3 3V13H11V3H3ZM10 12H4V4H10V12ZM13 11V21H21V11H13ZM20 20H14V12H20V20Z"] {
  d: path("M11 3H3V13H11V3ZM21 11H13V21H21V11ZM11 15H3V21H11V15ZM13 3V9H21V3H13Z");
  }
  [d*="M11 6.99982V13.9998L17 10.4998L11 6.99982Z"] {
  d: path("M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z");
  }
  [d*="M6 2.99982V17.9998H21V2.99982H6ZM11 13.9998V6.99982L17 10.4998L11 13.9998Z"] {
  d: path("M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-8 12.5v-9l6 4.5-6 4.5z");
  }
  [d*="M9 17H7V10H9V17ZM13 7H11V17H13V7ZM17 14H15V17H17V14ZM20 4H4V20H20V4ZM21 3V21H3V3H21Z"] {
  d: path("M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z");
  }
  [d*="M3 3V21H21V3H3ZM9 17H7V10H9V17ZM13 17H11V7H13V17ZM17 17H15V14H17V17Z"] {
  d: path("M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z");
  }
  [d*="M8 7H16V9H8V7ZM8 13H13V11H8V13ZM5 3V16H15H15.41L15.7 16.29L19 19.59V3H5ZM4 2H20V22L15 17H4V2Z"] {
  d: path("M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z");
  }
  [d*="M8,7h8v2H8V7z M8,13h5v-2H8V13z M5,3v13h10h0.41l0.29,0.29L19,19.59V3H5 M4,2h16v20l-5-5H4V2L4,2z"] {
  d: path("M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z");
  }
  [d*="M4 2V17H15L20 22V2H4ZM8 11H13V13H8V11ZM8 7H16V9H8V7Z"] {
  d: path("M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z");
  }
  [d*="M5 11H7V13H5V11ZM15 15H5V17H15V15ZM19 15H17V17H19V15ZM19 11H9V13H19V11ZM22 6H2V20H22V6ZM3 7H21V19H3V7Z"] {
  d: path("M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z");
  }
  [d*="M2 6V20H22V6H2ZM5 11H7V13H5V11ZM15 17H5V15H15V17ZM19 17H17V15H19V17ZM19 13H9V11H19V13Z"] {
  d: path("M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z");
  }
  [d*="M10.57 10.96C10.62 10.66 10.72 10.4 10.84 10.17C10.96 9.94 11.15 9.75 11.38 9.61C11.6 9.47 11.87 9.41 12.21 9.4C12.42 9.41 12.61 9.45 12.78 9.52C12.96 9.6 13.13 9.71 13.25 9.85C13.38 9.99 13.48 10.15 13.56 10.33C13.64 10.51 13.68 10.71 13.69 10.91L15.32 10.91C15.3 10.48 15.22 10.09 15.06 9.73C14.91 9.37 14.7 9.06 14.42 8.81C14.14 8.56 13.82 8.35 13.44 8.21C13.07 8.06 12.65 8 12.18 8C11.59 8 11.07 8.1 10.63 8.31C10.19 8.52 9.83 8.79 9.54 9.15C9.25 9.5 9.03 9.91 8.89 10.39C8.75 10.87 8.67 11.36 8.67 11.88L8.67 12.13C8.67 12.66 8.74 13.15 8.88 13.62C9.02 14.09 9.24 14.5 9.53 14.85C9.82 15.2 10.19 15.48 10.62 15.68C11.06 15.88 11.58 15.99 12.17 15.99C12.6 15.99 13 15.92 13.37 15.78C13.74 15.64 14.07 15.45 14.35 15.21C14.63 14.96 14.86 14.68 15.02 14.35C15.18 14.02 15.28 13.68 15.29 13.3L13.66 13.3C13.65 13.49 13.61 13.66 13.52 13.83C13.43 14 13.33 14.13 13.19 14.25C13.05 14.37 12.9 14.46 12.72 14.52C12.55 14.58 12.36 14.6 12.17 14.61C11.84 14.6 11.57 14.54 11.36 14.4C11.13 14.25 10.95 14.06 10.82 13.84C10.69 13.61 10.59 13.34 10.55 13.04C10.51 12.74 10.48 12.43 10.48 12.13L10.48 11.88C10.5 11.56 10.52 11.26 10.57 10.96ZM12 3C16.96 3 21 7.04 21 12C21 16.96 16.96 21 12 21C7.04 21 3 16.96 3 12C3 7.04 7.04 3 12 3ZM12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"] {
  d: path("M11.88 9.14c1.28.06 1.61 1.15 1.63 1.66h1.79c-.08-1.98-1.49-3.19-3.45-3.19C9.64 7.61 8 9 8 12.14c0 1.94.93 4.24 3.84 4.24 2.22 0 3.41-1.65 3.44-2.95h-1.79c-.03.59-.45 1.38-1.63 1.44-1.31-.04-1.86-1.06-1.86-2.73 0-2.89 1.28-2.98 1.88-3zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z");
  }
  [d*="M12 21.9998C17.5228 21.9998 22 17.5226 22 11.9998C22 6.47691 17.5228 1.99976 12 1.99976C6.47715 1.99976 2 6.47691 2 11.9998C2 17.5226 6.47715 21.9998 12 21.9998ZM10.8399 10.1698C10.7199 10.3998 10.6199 10.6598 10.5699 10.9598C10.5199 11.2598 10.4999 11.5598 10.4799 11.8798V12.1298C10.4799 12.4298 10.5099 12.7398 10.5499 13.0398C10.5899 13.3398 10.6899 13.6098 10.8199 13.8398C10.9499 14.0598 11.1299 14.2498 11.3599 14.3998C11.5699 14.5398 11.8399 14.5998 12.1699 14.6098C12.3599 14.5998 12.5499 14.5798 12.7199 14.5198C12.8999 14.4598 13.0499 14.3698 13.1899 14.2498C13.3299 14.1298 13.4299 13.9998 13.5199 13.8298C13.6099 13.6598 13.6499 13.4898 13.6599 13.2998H15.2899C15.2799 13.6798 15.1799 14.0198 15.0199 14.3498C14.8599 14.6798 14.6299 14.9598 14.3499 15.2098C14.0699 15.4498 13.7399 15.6398 13.3699 15.7798C12.9999 15.9198 12.5999 15.9898 12.1699 15.9898C11.5799 15.9898 11.0599 15.8798 10.6199 15.6798C10.1899 15.4798 9.81992 15.1998 9.52992 14.8498C9.23992 14.4998 9.01992 14.0898 8.87992 13.6198C8.73992 13.1498 8.66992 12.6598 8.66992 12.1298V11.8798C8.66992 11.3598 8.74992 10.8698 8.88992 10.3898C9.02992 9.90976 9.24992 9.49976 9.53992 9.14976C9.82992 8.78976 10.1899 8.51976 10.6299 8.30976C11.0699 8.09976 11.5899 7.99976 12.1799 7.99976C12.6499 7.99976 13.0699 8.05976 13.4399 8.20976C13.8199 8.34976 14.1399 8.55976 14.4199 8.80976C14.6999 9.05976 14.9099 9.36975 15.0599 9.72975C15.2199 10.0898 15.2999 10.4798 15.3199 10.9098H13.6899C13.6799 10.7098 13.6399 10.5098 13.5599 10.3298C13.4799 10.1498 13.3799 9.98976 13.2499 9.84976C13.1299 9.70976 12.9599 9.59976 12.7799 9.51976C12.6099 9.44976 12.4199 9.40976 12.2099 9.39976C11.8699 9.40976 11.5999 9.46976 11.3799 9.60976C11.1499 9.74976 10.9599 9.93976 10.8399 10.1698Z"] {
  d: path("M11.88 9.14c1.28.06 1.61 1.15 1.63 1.66h1.79c-.08-1.98-1.49-3.19-3.45-3.19C9.64 7.61 8 9 8 12.14c0 1.94.93 4.24 3.84 4.24 2.22 0 3.41-1.65 3.44-2.95h-1.79c-.03.59-.45 1.38-1.63 1.44-1.31-.04-1.86-1.06-1.86-2.73 0-2.89 1.28-2.98 1.88-3zM12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z");
  }
  [d*="M8 7V10C8 10.55 8.45 11 9 11H15C16.1 11 17 11.9 17 13V17C17 18.1 16.1 19 15 19H13V21H11V19H7V18H15C15.55 18 16 17.55 16 17V13C16 12.45 15.55 12 15 12H9C7.9 12 7 11.1 7 10V7C7 5.9 7.9 5 9 5H11V3H13V5H17V6H9C8.45 6 8 6.45 8 7Z"] {
  d: path("M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z");
  }
  [d*="M9 7V11H15C16.1 11 17 11.9 17 13V17C17 18.1 16.1 19 15 19H13V21H11V19H7V17H15V13H9C7.9 13 7 12.1 7 11V7C7 5.9 7.9 5 9 5H11V3H13V5H17V7H9Z"] {
  d: path("M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z");
  }
  [d*="M6.71 7.2L7.89 5.1L6.71 3L8.81 4.18L10.91 3L9.74 5.1L10.92 7.2L8.82 6.02L6.71 7.2ZM18.9 14.26L16.8 13.08L17.98 15.18L16.8 17.28L18.9 16.1L21 17.28L19.82 15.18L21 13.08L18.9 14.26ZM21 3L18.9 4.18L16.8 3L17.98 5.1L16.8 7.2L18.9 6.02L21 7.2L19.82 5.1L21 3ZM17.14 10.02L6.15 21L3 17.85L14 6.85L17.14 10.02ZM6.15 19.59L13.7 12.04L11.96 10.3L4.41 17.85L6.15 19.59Z"] {
  d: path("M7.5 5.6 10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29a.9959.9959 0 0 0-1.41 0L1.29 18.96c-.39.39-.39 1.02 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05c.39-.39.39-1.02 0-1.41l-2.33-2.35zm-1.03 5.49-2.12-2.12 2.44-2.44 2.12 2.12-2.44 2.44z");
  }
  [d*="M8.81 6.03L10.91 7.21L9.74 5.1L10.91 3L8.81 4.18L6.71 3L7.89 5.1L6.71 7.2L8.81 6.03ZM18.9 14.26L16.8 13.08L17.98 15.18L16.8 17.28L18.9 16.1L21 17.28L19.82 15.18L21 13.08L18.9 14.26ZM21 3L18.9 4.18L16.8 3L17.98 5.1L16.8 7.2L18.9 6.02L21 7.2L19.82 5.1L21 3ZM17.14 10.02L14 6.85L3 17.85L6.15 21L17.14 10.02ZM13.72 12.06L11.94 10.28L13.99 8.23L15.77 10.01L13.72 12.06Z"] {
  d: path("M7.5 5.6 10 7 8.6 4.5 10 2 7.5 3.4 5 2l1.4 2.5L5 7zm12 9.8L17 14l1.4 2.5L17 19l2.5-1.4L22 19l-1.4-2.5L22 14zM22 2l-2.5 1.4L17 2l1.4 2.5L17 7l2.5-1.4L22 7l-1.4-2.5zm-7.63 5.29a.9959.9959 0 0 0-1.41 0L1.29 18.96c-.39.39-.39 1.02 0 1.41l2.34 2.34c.39.39 1.02.39 1.41 0L16.7 11.05c.39-.39.39-1.02 0-1.41l-2.33-2.35zm-1.03 5.49-2.12-2.12 2.44-2.44 2.12 2.12-2.44 2.44z");
  }
  [d*="M16 6L16 8L14 8L14 13C14 14.1 13.1 15 12 15C10.9 15 10 14.1 10 13C10 11.9 10.9 11 12 11C12.37 11 12.7 11.11 13 11.28L13 6L16 6ZM18 20L4 20L4 6L3 6L3 21L18 21L18 20ZM21 3L6 3L6 18L21 18L21 3ZM7 4L20 4L20 17L7 17L7 4Z"] {
  d: path("M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 5h-3v5.5c0 1.38-1.12 2.5-2.5 2.5S10 13.88 10 12.5s1.12-2.5 2.5-2.5c.57 0 1.08.19 1.5.51V5h4v2zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z");
  }
  [d*="M18 21L3 21L3 6L4 6L4 20L18 20L18 21ZM21 3L21 18L6 18L6 3L21 3ZM16 6L13 6L13 11.28C12.7 11.11 12.37 11 12 11C10.9 11 10 11.9 10 13C10 14.1 10.9 15 12 15C13.1 15 14 14.1 14 13L14 8L16 8L16 6Z"] {
  d: path("M20 2H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 5h-3v5.5c0 1.38-1.12 2.5-2.5 2.5S10 13.88 10 12.5s1.12-2.5 2.5-2.5c.57 0 1.08.19 1.5.51V5h4v2zM4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6z");
  }
  [d*="M12,9c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,9,12,9 M12,8c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4 S14.21,8,12,8L12,8z M13.22,3l0.55,2.2l0.13,0.51l0.5,0.18c0.61,0.23,1.19,0.56,1.72,0.98l0.4,0.32l0.5-0.14l2.17-0.62l1.22,2.11 l-1.63,1.59l-0.37,0.36l0.08,0.51c0.05,0.32,0.08,0.64,0.08,0.98s-0.03,0.66-0.08,0.98l-0.08,0.51l0.37,0.36l1.63,1.59l-1.22,2.11 l-2.17-0.62l-0.5-0.14l-0.4,0.32c-0.53,0.43-1.11,0.76-1.72,0.98l-0.5,0.18l-0.13,0.51L13.22,21h-2.44l-0.55-2.2l-0.13-0.51 l-0.5-0.18C9,17.88,8.42,17.55,7.88,17.12l-0.4-0.32l-0.5,0.14l-2.17,0.62L3.6,15.44l1.63-1.59l0.37-0.36l-0.08-0.51 C5.47,12.66,5.44,12.33,5.44,12s0.03-0.66,0.08-0.98l0.08-0.51l-0.37-0.36L3.6,8.56l1.22-2.11l2.17,0.62l0.5,0.14l0.4-0.32 C8.42,6.45,9,6.12,9.61,5.9l0.5-0.18l0.13-0.51L10.78,3H13.22 M14,2h-4L9.26,4.96c-0.73,0.27-1.4,0.66-2,1.14L4.34,5.27l-2,3.46 l2.19,2.13C4.47,11.23,4.44,11.61,4.44,12s0.03,0.77,0.09,1.14l-2.19,2.13l2,3.46l2.92-0.83c0.6,0.48,1.27,0.87,2,1.14L10,22h4 l0.74-2.96c0.73-0.27,1.4-0.66,2-1.14l2.92,0.83l2-3.46l-2.19-2.13c0.06-0.37,0.09-0.75,0.09-1.14s-0.03-0.77-0.09-1.14l2.19-2.13 l-2-3.46L16.74,6.1c-0.6-0.48-1.27-0.87-2-1.14L14,2L14,2z"] {
  d: path("M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58c.18-.14.23-.41.12-.61l-1.92-3.32c-.12-.22-.37-.29-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54c-.04-.24-.24-.41-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.09.63-.09.94s.02.64.07.94l-2.03 1.58c-.18.14-.23.41-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z");
  }
  [d*="M13,14h-2v-2h2V14z M13,5h-2v6h2V5z M19,3H5v16.59l3.29-3.29L8.59,16H9h10V3 M20,2v15H9l-5,5V2H20L20,2z"] {
  d: path("M20 2H4c-1.1 0-1.99.9-1.99 2L2 22l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-7 12h-2v-2h2v2zm0-4h-2V6h2v4z");
  }
  [d*="M20.87,20.17l-5.59-5.59C16.35,13.35,17,11.75,17,10c0-3.87-3.13-7-7-7s-7,3.13-7,7s3.13,7,7,7c1.75,0,3.35-0.65,4.58-1.71 l5.59,5.59L20.87,20.17z M10,16c-3.31,0-6-2.69-6-6s2.69-6,6-6s6,2.69,6,6S13.31,16,10,16z"] {
  d: path("M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z");
  }
  [d*="M20.87 20.17L15.28 14.58C16.35 13.35 17 11.75 17 10C17 6.13 13.87 3 10 3C6.13 3 3 6.13 3 10C3 13.87 6.13 17 10 17C11.75 17 13.35 16.35 14.58 15.29L20.17 20.88L20.87 20.17ZM10 16C6.69 16 4 13.31 4 10C4 6.69 6.69 4 10 4C13.31 4 16 6.69 16 10C16 13.31 13.31 16 10 16Z"] {
  d: path("M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z");
  }
  [d*="M15.36,9.96c0,1.09-0.67,1.67-1.31,2.24c-0.53,0.47-1.03,0.9-1.16,1.6L12.85,14h-1.75l0.03-0.28 c0.14-1.17,0.8-1.76,1.47-2.27c0.52-0.4,1.01-0.77,1.01-1.49c0-0.51-0.23-0.97-0.63-1.29c-0.4-0.31-0.92-0.42-1.42-0.29 c-0.59,0.15-1.05,0.67-1.19,1.34L10.32,10H8.57l0.06-0.42c0.2-1.4,1.15-2.53,2.42-2.87c1.05-0.29,2.14-0.08,2.98,0.57 C14.88,7.92,15.36,8.9,15.36,9.96z M12,18c0.55,0,1-0.45,1-1s-0.45-1-1-1s-1,0.45-1,1S11.45,18,12,18z M12,3c-4.96,0-9,4.04-9,9 s4.04,9,9,9s9-4.04,9-9S16.96,3,12,3 M12,2c5.52,0,10,4.48,10,10s-4.48,10-10,10S2,17.52,2,12S6.48,2,12,2L12,2z"] {
  d: path("M11 18h2v-2h-2v2zm1-16C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm0-14c-2.21 0-4 1.79-4 4h2c0-1.1.9-2 2-2s2 .9 2 2c0 2-3 1.75-3 5h2c0-2.25 3-2.5 3-5 0-2.21-1.79-4-4-4z");
  }
  [d*="M14,13h-3v3H9v-3H6v-2h3V8h2v3h3V13z M17,6H3v12h14v-6.39l4,1.83V8.56l-4,1.83V6 M18,5v3.83L22,7v8l-4-1.83V19H2V5H18L18,5 z"] {
  d: path("M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13h-3v3H9v-3H6v-2h3V8h2v3h3v2z");
  }
  [d*="M17,18v1H6V18ZM6.49,9l.71.71L11,5.91V16h1V5.91l3.8,3.81L16.51,9l-5-5Z"] {
  d: path("M5 20h14v-2H5v2zm0-10h4v6h6v-6h4l-7-7-7 7z");
  }
  [d*="M14 11.9999C14 13.0999 13.1 13.9999 12 13.9999C10.9 13.9999 10 13.0999 10 11.9999C10 10.8999 10.9 9.99992 12 9.99992C13.1 9.99992 14 10.8999 14 11.9999ZM8.48 8.44992L7.77 7.74992C6.68 8.82992 6 10.3399 6 11.9999C6 13.6599 6.68 15.1699 7.77 16.2499L8.48 15.5399C7.57 14.6399 7 13.3899 7 11.9999C7 10.6099 7.57 9.35992 8.48 8.44992ZM16.23 7.74992L15.52 8.45992C16.43 9.35992 17 10.6099 17 11.9999C17 13.3899 16.43 14.6399 15.52 15.5499L16.23 16.2599C17.32 15.1699 18 13.6599 18 11.9999C18 10.3399 17.32 8.82992 16.23 7.74992ZM5.65 5.62992L4.95 4.91992C3.13 6.72992 2 9.23992 2 11.9999C2 14.7599 3.13 17.2699 4.95 19.0799L5.66 18.3699C4.02 16.7399 3 14.4899 3 11.9999C3 9.50992 4.02 7.25992 5.65 5.62992ZM19.05 4.91992L18.34 5.62992C19.98 7.25992 21 9.50992 21 11.9999C21 14.4899 19.98 16.7399 18.35 18.3699L19.06 19.0799C20.87 17.2699 22 14.7599 22 11.9999C22 9.23992 20.87 6.72992 19.05 4.91992Z"] {
  d: path("M16.94 6.91l-1.41 1.45c.9.94 1.46 2.22 1.46 3.64s-.56 2.71-1.46 3.64l1.41 1.45c1.27-1.31 2.05-3.11 2.05-5.09s-.78-3.79-2.05-5.09zM19.77 4l-1.41 1.45C19.98 7.13 21 9.44 21 12.01c0 2.57-1.01 4.88-2.64 6.54l1.4 1.45c2.01-2.04 3.24-4.87 3.24-7.99 0-3.13-1.23-5.96-3.23-8.01zM7.06 6.91c-1.27 1.3-2.05 3.1-2.05 5.09s.78 3.79 2.05 5.09l1.41-1.45c-.9-.94-1.46-2.22-1.46-3.64s.56-2.71 1.46-3.64L7.06 6.91zM5.64 5.45L4.24 4C2.23 6.04 1 8.87 1 11.99c0 3.13 1.23 5.96 3.23 8.01l1.41-1.45C4.02 16.87 3 14.56 3 11.99s1.01-4.88 2.64-6.54z M12,9a3,3,0,1,1-3,3,3,3,0,0,1,3-3");
  }
  [d*="M22,13h-4v4h-2v-4h-4v-2h4V7h2v4h4V13z M14,7H2v1h12V7z M2,12h8v-1H2V12z M2,16h8v-1H2V16z"] {
  d: path("M14 10H3v2h11v-2zm0-4H3v2h11V6zm4 8v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zM3 16h7v-2H3v2z");
  }
  [d*="M6,12c0-3.31,2.69-6,6-6s6,2.69,6,6c0,1.66-0.67,3.16-1.77,4.25l-0.71-0.71C16.44,14.63,17,13.38,17,12c0-2.76-2.24-5-5-5"] {
  d: path("M14 12c0 .74-.4 1.38-1 1.72V22h-2v-8.28c-.6-.35-1-.98-1-1.72 0-1.1.9-2 2-2s2 .9 2 2zm-2-6c-3.31 0-6 2.69-6 6 0 1.74.75 3.31 1.94 4.4l1.42-1.42C8.53 14.25 8 13.19 8 12c0-2.21 1.79-4 4-4s4 1.79 4 4c0 1.19-.53 2.25-1.36 2.98l1.42 1.42C17.25 15.31 18 13.74 18 12c0-3.31-2.69-6-6-6zm0-4C6.48 2 2 6.48 2 12c0 2.85 1.2 5.41 3.11 7.24l1.42-1.42C4.98 16.36 4 14.29 4 12c0-4.41 3.59-8 8-8s8 3.59 8 8c0 2.29-.98 4.36-2.53 5.82l1.42 1.42C20.8 17.41 22 14.85 22 12c0-5.52-4.48-10-10-10z");
  }
  [d*="M3,3v18h18V3H3z M4.99,20c0.39-2.62,2.38-5.1,7.01-5.1s6.62,2.48,7.01,5.1H4.99z M9,10c0-1.65,1.35-3,3-3s3,1.35,3,3 c0,1.65-1.35,3-3,3S9,11.65,9,10z M12.72,13.93C14.58,13.59,16,11.96,16,10c0-2.21-1.79-4-4-4c-2.21,0-4,1.79-4,4 c0,1.96,1.42,3.59,3.28,3.93c-4.42,0.25-6.84,2.8-7.28,6V4h16v15.93C19.56,16.73,17.14,14.18,12.72,13.93z"] {
  d: path("M3 5v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2H5c-1.11 0-2 .9-2 2zm12 4c0 1.66-1.34 3-3 3s-3-1.34-3-3 1.34-3 3-3 3 1.34 3 3zm-9 8c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1H6v-1z");
  }
  [d*="M10,9.35,15,12l-5,2.65ZM12,6a54.36,54.36,0,0,0-7.56.38A1.53,1.53,0,0,0,3.38,7.44,24.63,24.63,0,0,0,3,12a24.63,24.63,0,0,0,.38,4.56,1.53,1.53,0,0,0,1.06,1.06A54.36,54.36,0,0,0,12,18a54.36,54.36,0,0,0,7.56-.38,1.53,1.53,0,0,0,1.06-1.06A24.63,24.63,0,0,0,21,12a24.63,24.63,0,0,0-.38-4.56,1.53,1.53,0,0,0-1.06-1.06A54.36,54.36,0,0,0,12,6h0m0-1s6.25,0,7.81.42a2.51,2.51,0,0,1,1.77,1.77A25.87,25.87,0,0,1,22,12a25.87,25.87,0,0,1-.42,4.81,2.51,2.51,0,0,1-1.77,1.77C18.25,19,12,19,12,19s-6.25,0-7.81-.42a2.51,2.51,0,0,1-1.77-1.77A25.87,25.87,0,0,1,2,12a25.87,25.87,0,0,1,.42-4.81A2.51,2.51,0,0,1,4.19,5.42C5.75,5,12,5,12,5Z"] {
  d: path("M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 2.19-.16 3.8-.44 4.83-.25.9-.83 1.48-1.73 1.73-.47.13-1.33.22-2.65.28-1.3.07-2.49.1-3.59.1L12 19c-4.19 0-6.8-.16-7.83-.44-.9-.25-1.48-.83-1.73-1.73-.13-.47-.22-1.1-.28-1.9-.07-.8-.1-1.49-.1-2.09L2 12c0-2.19.16-3.8.44-4.83.25-.9.83-1.48 1.73-1.73.47-.13 1.33-.22 2.65-.28 1.3-.07 2.49-.1 3.59-.1L12 5c4.19 0 6.8.16 7.83.44.9.25 1.48.83 1.73 1.73z");
  }
  [d*="M4,20h14v1H3V6h1V20z M6,3v15h15V3H6z M8.02,17c0.36-2.13,1.93-4.1,5.48-4.1s5.12,1.97,5.48,4.1H8.02z M11,8.5 C11,7.12,12.12,6,13.5,6S16,7.12,16,8.5c0,1.38-1.12,2.5-2.5,2.5S11,9.88,11,8.5z M14.21,11.93C15.8,11.6,17,10.19,17,8.5 C17,6.57,15.43,5,13.5,5S10,6.57,10,8.5c0,1.69,1.2,3.1,2.79,3.43c-3.48,0.26-5.4,2.42-5.78,5.07H7V4h13v13h-0.01 C19.61,14.35,17.68,12.19,14.21,11.93z"] {
  d: path("M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H8c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h12zm-3 5c0-1.66-1.34-3-3-3s-3 1.34-3 3 1.34 3 3 3 3-1.34 3-3zm-9 8v1h12v-1c0-2-4-3.1-6-3.1S8 13 8 15z");
  }
  [d*="M13.72,11.93C15.58,11.59,17,9.96,17,8c0-2.21-1.79-4-4-4c-2.21,0-4,1.79-4,4c0,1.96,1.42,3.59,3.28,3.93 C6.77,12.21,4,15.76,4,20h18C22,15.76,19.23,12.21,13.72,11.93z M10,8c0-1.65,1.35-3,3-3s3,1.35,3,3s-1.35,3-3,3S10,9.65,10,8z M13,12.9c5.33,0,7.56,2.99,7.94,6.1H5.06C5.44,15.89,7.67,12.9,13,12.9z M4,12H2v-1h2V9h1v2h2v1H5v2H4V12z"] {
  d: path("M15 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm-9-2V7H4v3H1v2h3v3h2v-3h3v-2H6zm9 4c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z");
  }
  [d*="M20,3v18H8v-1h11V4H8V3H20z M11.1,15.1l0.7,0.7l4.4-4.4l-4.4-4.4l-0.7,0.7l3.1,3.1H3v1h11.3L11.1,15.1z"] {
  d: path("M10.09 15.59 11.5 17l5-5-5-5-1.41 1.41L12.67 11H3v2h9.67l-2.58 2.59zM19 3H5c-1.11 0-2 .9-2 2v4h2V5h14v14H5v-4H3v4c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z");
  }
  [d*="M12 22C10.93 22 9.86998 21.83 8.83998 21.48L7.41998 21.01L8.83998 20.54C12.53 19.31 15 15.88 15 12C15 8.12 12.53 4.69 8.83998 3.47L7.41998 2.99L8.83998 2.52C9.86998 2.17 10.93 2 12 2C17.51 2 22 6.49 22 12C22 17.51 17.51 22 12 22ZM10.58 20.89C11.05 20.96 11.53 21 12 21C16.96 21 21 16.96 21 12C21 7.04 16.96 3 12 3C11.53 3 11.05 3.04 10.58 3.11C13.88 4.81 16 8.21 16 12C16 15.79 13.88 19.19 10.58 20.89Z"] {
  d: path("M20 8.69V4h-4.69L12 .69 8.69 4H4v4.69L.69 12 4 15.31V20h4.69L12 23.31 15.31 20H20v-4.69L23.31 12 20 8.69zM12 18c-.89 0-1.74-.2-2.5-.55C11.56 16.5 13 14.42 13 12s-1.44-4.5-3.5-5.45C10.26 6.2 11.11 6 12 6c3.31 0 6 2.69 6 6s-2.69 6-6 6z");
  }
  [d*="M21,6H3V5h18V6z M18,11H6v1h12V11z M15,17H9v1h6V17z"] {
  d: path("M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z");
  }
  [d*="M14.06 7.6L16.4 9.94L6.34 20H4V17.66L14.06 7.6ZM14.06 6.19L3 17.25V21H6.75L17.81 9.94L14.06 6.19ZM17.61 4.05L19.98 6.42L18.84 7.56L16.47 5.19L17.61 4.05ZM17.61 2.63L15.06 5.18L18.85 8.97001L21.4 6.42L17.61 2.63Z"] {
  d: path("M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z");
  }
  [d*="M14.06,7.6l2.34,2.34L6.34,20H4v-2.34L14.06,7.6 M14.06,6.19L3,17.25V21h3.75L17.81,9.94L14.06,6.19L14.06,6.19z M17.61,4.05l2.37,2.37l-1.14,1.14l-2.37-2.37L17.61,4.05 M17.61,2.63l-2.55,2.55l3.79,3.79l2.55-2.55L17.61,2.63L17.61,2.63z"] {
  d: path("M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34a.9959.9959 0 0 0-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z");
  }
  [d*="M12,16.5c0.83,0,1.5,0.67,1.5,1.5s-0.67,1.5-1.5,1.5s-1.5-0.67-1.5-1.5S11.17,16.5,12,16.5z M10.5,12 c0,0.83,0.67,1.5,1.5,1.5s1.5-0.67,1.5-1.5s-0.67-1.5-1.5-1.5S10.5,11.17,10.5,12z M10.5,6c0,0.83,0.67,1.5,1.5,1.5 s1.5-0.67,1.5-1.5S12.83,4.5,12,4.5S10.5,5.17,10.5,6z"] {
  d: path("M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z");
  }
  [d*="M15.01 7.34L16.65 8.98L8.64 17H6.99V15.36L15.01 7.34ZM15.01 5.92L5.99 14.94V18H9.05L18.07 8.98L15.01 5.92ZM17.91 4.43L19.58 6.1L18.91 6.77L17.24 5.1L17.91 4.43ZM17.91 3.02L15.83 5.1L18.92 8.19L21 6.11L17.91 3.02ZM21 10H20V20H4V4H14V3H3V21H21V10Z"] {
  d: path("M18,10v8H6V6h8l2-2H6A2.15,2.15,0,0,0,4,6V18a2.15,2.15,0,0,0,2,2H18a2.15,2.15,0,0,0,2-2V8Z M8,14v2h2l7-7L15,7ZM19.15,6.85a.5.5,0,0,0,0-.71L17.85,4.85a.5.5,0,0,0-.71,0L16,6l2,2Z");
  }
  [d*="M17 14.9998C16.06 14.9998 15.23 15.4398 14.68 16.1198L9.74 13.2098C9.9 12.8398 10 12.4298 10 11.9998C10 11.5898 9.92 11.1898 9.76 10.8298L14.71 7.91976C15.26 8.56976 16.08 8.99976 17 8.99976C18.65 8.99976 20 7.64976 20 5.99976C20 4.34976 18.65 2.99976 17 2.99976C15.35 2.99976 14 4.34976 14 5.99976C14 6.36976 14.08 6.72976 14.2 7.05976L9.21 9.98976C8.66 9.38976 7.88 8.99976 7 8.99976C5.35 8.99976 4 10.3498 4 11.9998C4 13.6498 5.35 14.9998 7 14.9998C7.86 14.9998 8.63 14.6298 9.18 14.0498L14.19 16.9898C14.07 17.3098 14 17.6398 14 17.9998C14 19.6498 15.35 20.9998 17 20.9998C18.65 20.9998 20 19.6498 20 17.9998C20 16.3498 18.65 14.9998 17 14.9998ZM17 3.99976C18.1 3.99976 19 4.89976 19 5.99976C19 7.09976 18.1 7.99976 17 7.99976C15.9 7.99976 15 7.09976 15 5.99976C15 4.89976 15.9 3.99976 17 3.99976ZM7 13.9998C5.9 13.9998 5 13.0998 5 11.9998C5 10.8998 5.9 9.99976 7 9.99976C8.1 9.99976 9 10.8998 9 11.9998C9 13.0998 8.1 13.9998 7 13.9998ZM17 19.9998C15.9 19.9998 15 19.0998 15 17.9998C15 16.8998 15.9 15.9998 17 15.9998C18.1 15.9998 19 16.8998 19 17.9998C19 19.0998 18.1 19.9998 17 19.9998Z"] {
  d: path("M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z");
  }
  [d*="M8 9.00003L14 5.00003V8.53519C15.1956 9.22681 16 10.5195 16 12.0001C16 13.4806 15.1956 14.7733 14 15.4649V19L8 15H7V19H5V15H2V9.00003H8ZM8.30278 10L13 6.86855V17.1315L8.30278 14H3V10H8.30278Z"] {
  d: path("M18 11v2h4v-2h-4zm-2 6.61c.96.71 2.21 1.65 3.2 2.39.4-.53.8-1.07 1.2-1.6-.99-.74-2.24-1.68-3.2-2.4-.4.54-.8 1.08-1.2 1.61zM20.4 5.6c-.4-.53-.8-1.07-1.2-1.6-.99.74-2.24 1.68-3.2 2.4.4.53.8 1.07 1.2 1.6.96-.72 2.21-1.65 3.2-2.4zM4 9c-1.1 0-2 .9-2 2v2c0 1.1.9 2 2 2h1v4h2v-4h1l5 3V6L8 9H4zm11.5 3c0-1.33-.58-2.53-1.5-3.35v6.69c.92-.81 1.5-2.01 1.5-3.34z");
  }
  [d*="M17 18V19H6V18H17ZM16.5 11.4L15.8 10.7L12 14.4V4H11V14.4L7.2 10.6L6.5 11.3L11.5 16.3L16.5 11.4Z"] {
  d: path("M5 20h14v-2H5v2zM19 9h-4V3H9v6H5l7 7 7-7z");
  }
  [d*="M11,17H9V8h2V17z M15,8h-2v9h2V8z M19,4v1h-1v16H6V5H5V4h4V3h6v1H19z M17,5H7v15h10V5z"] {
  d: path("M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z");
  }
  [d*="M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11H3v10h4h1h9.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z M7,20H4v-8h3V20z M19.98,13.17l-1.34,6 C18.54,19.65,18.03,20,17.43,20H8v-8.61l5.6-6.06C13.79,5.12,14.08,5,14.38,5c0.26,0,0.5,0.11,0.63,0.3 c0.07,0.1,0.15,0.26,0.09,0.47l-1.52,4.94L13.18,12h1.35h4.23c0.41,0,0.8,0.17,1.03,0.46C19.92,12.61,20.05,12.86,19.98,13.17z"] {
  d: path("M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z");
  }
  [d*="M17,4h-1H6.57C5.5,4,4.59,4.67,4.38,5.61l-1.34,6C2.77,12.85,3.82,14,5.23,14h4.23l-1.52,4.94C7.62,19.97,8.46,21,9.62,21 c0.58,0,1.14-0.24,1.52-0.65L17,14h4V4H17z M10.4,19.67C10.21,19.88,9.92,20,9.62,20c-0.26,0-0.5-0.11-0.63-0.3 c-0.07-0.1-0.15-0.26-0.09-0.47l1.52-4.94l0.4-1.29H9.46H5.23c-0.41,0-0.8-0.17-1.03-0.46c-0.12-0.15-0.25-0.4-0.18-0.72l1.34-6 C5.46,5.35,5.97,5,6.57,5H16v8.61L10.4,19.67z M20,13h-3V5h3V13z"] {
  d: path("M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z");
  }
  [d*="M12,8.91c1.7,0,3.09,1.39,3.09,3.09S13.7,15.09,12,15.09S8.91,13.7,8.91,12S10.3,8.91,12,8.91 M12,7.91 c-2.25,0-4.09,1.84-4.09,4.09s1.84,4.09,4.09,4.09s4.09-1.84,4.09-4.09S14.25,7.91,12,7.91L12,7.91z M12,6.18 c3.9,0,7.35,2.27,8.92,5.82c-1.56,3.55-5.02,5.82-8.92,5.82c-3.9,0-7.35-2.27-8.92-5.82C4.65,8.45,8.1,6.18,12,6.18 M12,5.18 C7.45,5.18,3.57,8.01,2,12c1.57,3.99,5.45,6.82,10,6.82s8.43-2.83,10-6.82C20.43,8.01,16.55,5.18,12,5.18L12,5.18z"] {
  d: path("M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z");
  }
  [d*="M3.85,3.15L3.15,3.85L6.19,6.9C4.31,8.11,2.83,9.89,2,12c1.57,3.99,5.45,6.82,10,6.82c1.77,0,3.44-0.43,4.92-1.2l3.23,3.23 l0.71-0.71L3.85,3.15z M13.8,14.5c-0.51,0.37-1.13,0.59-1.8,0.59c-1.7,0-3.09-1.39-3.09-3.09c0-0.67,0.22-1.29,0.59-1.8L13.8,14.5z M12,17.82c-3.9,0-7.35-2.27-8.92-5.82c0.82-1.87,2.18-3.36,3.83-4.38L8.79,9.5c-0.54,0.69-0.88,1.56-0.88,2.5 c0,2.25,1.84,4.09,4.09,4.09c0.95,0,1.81-0.34,2.5-0.88l1.67,1.67C14.9,17.49,13.48,17.82,12,17.82z M11.49,7.95 c0.17-0.02,0.34-0.05,0.51-0.05c2.25,0,4.09,1.84,4.09,4.09c0,0.17-0.02,0.34-0.05,0.51l-1.01-1.01c-0.21-1.31-1.24-2.33-2.55-2.55 L11.49,7.95z M9.12,5.59C10.04,5.33,11,5.18,12,5.18c4.55,0,8.43,2.83,10,6.82c-0.58,1.47-1.48,2.78-2.61,3.85l-0.72-0.72 c0.93-0.87,1.71-1.92,2.25-3.13C19.35,8.45,15.9,6.18,12,6.18c-0.7,0-1.39,0.08-2.06,0.22L9.12,5.59z"] {
  d: path("M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.43-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78 3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z");
  }
  [d*="M5 17V15H9V13H7C5.89 13 5 12.11 5 11V9C5 7.89 5.89 7 7 7H11V9H7V11H9C10.11 11 11 11.89 11 13V15C11 16.11 10.11 17 9 17H5ZM19 10V14C19 15.66 17.66 17 16 17H13V7H16C17.66 7 19 8.34 19 10ZM17 10C17 9.45 16.55 9 16 9H15V15H16C16.55 15 17 14.55 17 14V10ZM21 3V21H3V3H21ZM20 4H4V20H20V4Z"] {
  d: path("M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-6 6h4c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1h-4V9zm-3.5 4.5v-1H7c-.55 0-1-.45-1-1V10c0-.55.45-1 1-1h3c.55 0 1 .45 1 1v1H9.5v-.5h-2v1H10c.55 0 1 .45 1 1V14c0 .55-.45 1-1 1H7c-.55 0-1-.45-1-1v-1h1.5v.5h2zm5 0h2v-3h-2v3z");
  }
  [d*="M3 3V21H21V3H3ZM20 20H4V4H20V20ZM16 7H13V17H16C17.66 17 19 15.66 19 14V10C19 8.34 17.66 7 16 7ZM15 15V9H16C16.55 9 17 9.45 17 10V14C17 14.55 16.55 15 16 15H15ZM11 7V17H9V13H7V17H5V7H7V11H9V7H11Z"] {
  d: path("M19 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-8 12H9.5v-2h-2v2H6V9h1.5v2.5h2V9H11v6zm2-6h4c.55 0 1 .45 1 1v4c0 .55-.45 1-1 1h-4V9zm1.5 4.5h2v-3h-2v3z");
  }
  [d*="M9 7H11V17H9V13H5V7H7V11H9V7ZM19 9.5V7H17V10C17 10.55 16.55 11 16 11H15V7H13V17H15V13H16C16.55 13 17 13.45 17 14V17H19V14.5C19 13.52 18.59 12.63 17.94 12C18.59 11.37 19 10.48 19 9.5ZM20 4H4V20H20V4ZM21 3V21H3V3H21Z"] {
  d: path("M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 10.5h-1V15H9.5v-1.5h-3V9H8v3h1.5V9H11v3h1v1.5zm6 1.5h-1.75l-1.75-2.25V15H13V9h1.5v2.25L16.25 9H18l-2.25 3L18 15z");
  }
  [d*="M21,7h-2v2h-2V7h-2V5h2V3h2v2h2V7z M13,4v6v1h1h6v9H4V4H13 M14,3H3v18h18V10h-7V3L14,3z"] {
  d: path("M19 7v2.99s-1.99.01-2 0V7h-3s.01-1.99 0-2h3V2h2v3h3v2h-3zm-3 4V8h-3V5H5c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2v-8h-3zM5 19l3-4 2 3 3-4 4 5H5z");
  }
  [d*="M2 4.99982V18.9998H22V4.99982H2ZM21 5.99982V17.9998H3V5.99982H5L6.5 8.99982H9.5L8 5.99982H10L11.5 8.99982H14.5L13 5.99982H15L16.5 8.99982H19.5L18 5.99982H21Z"] {
  d: path("m18 4 2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z");
  }
  [d*="M2 4.99982V18.9998H22V4.99982H2ZM6.5 8.99982L5 5.99982H8L9.5 8.99982H6.5ZM11.5 8.99982L10 5.99982H13L14.5 8.99982H11.5ZM16.5 8.99982L15 5.99982H18L19.5 8.99982H16.5Z"] {
  d: path("m18 4 2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z");
  }
  [d*="M5,11h2v2H5V11z M15,15H5v2h10V15z M19,15h-2v2h2V15z M19,11H9v2h10V11z M22,6H2v14h20V6z M3,7h18v12H3V7z"] {
  d: path("M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zM4 12h4v2H4v-2zm10 6H4v-2h10v2zm6 0h-4v-2h4v2zm0-4H10v-2h10v2z");
  }
  [d*="M5,8h9v5H5V8z M22,5H2v14h20V5z M3,6h18v12H3V6z"] {
  d: path("M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z");
  }
  [d*="M13,17h-2v-6h2V17z M13,7h-2v2h2V7z M12,3c-4.96,0-9,4.04-9,9s4.04,9,9,9c4.96,0,9-4.04,9-9S16.96,3,12,3 M12,2 c5.52,0,10,4.48,10,10s-4.48,10-10,10C6.48,22,2,17.52,2,12S6.48,2,12,2L12,2z"] {
  d: path("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z");
  }
  [d*="M13.18,4l0.24,1.2L13.58,6h0.82H19v7h-5.18l-0.24-1.2L13.42,11H12.6H6V4H13.18 M14,3H5v18h1v-9h6.6l0.4,2h7V5h-5.6L14,3 L14,3z"] {
  d: path("M14.4 6 14 4H5v17h2v-7h5.6l.4 2h7V6z");
  }
  [d*="M18.71,6C20.13,7.59,21,9.69,21,12c0,4.97-4.03,9-9,9c-2.31,0-4.41-0.87-6-2.29L18.71,6z M3,12 c0-4.97,4.03-9,9-9c2.31,0,4.41,0.87,6,2.29L5.29,18C3.87,16.41,3,14.31,3,12z M12,2c5.52,0,10,4.48,10,10c0,5.52-4.48,10-10,10 C6.48,22,2,17.52,2,12C2,6.48,6.48,2,12,2z"] {
  d: path("M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zM4 12c0-4.4 3.6-8 8-8 1.8 0 3.5.6 4.9 1.7L5.7 16.9C4.6 15.5 4 13.8 4 12zm8 8c-1.8 0-3.5-.6-4.9-1.7L18.3 7.1C19.4 8.5 20 10.2 20 12c0 4.4-3.6 8-8 8z");
  }
  [d*="M10.51,14.74l-0.71-0.71l7.74-7.74L18.25,7L10.51,14.74z M7.31,17.24l-4.35-4.35l-0.71,0.71l4.35,4.35L7.31,17.24z M21.75,7 L21.04,6.3L10.45,16.88l-4-4l-0.71,0.71l4.71,4.71L21.75,7z"] {
  d: path("m18 7-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41 6 19l1.41-1.41L1.83 12 .41 13.41z");
  }
  [d*="M20,18h-2v2h-1v-2h-2v-1h2v-2h1v2h2V18z M22,17.5c0,2.49-2.01,4.5-4.5,4.5c-1.11,0-2.11-0.42-2.9-1.08 c-0.78,0.47-1.61,0.83-2.49,1.05L12,22l-0.12-0.03c-2.43-0.61-4.53-2.26-5.95-4.44c-0.19-0.29-0.36-0.58-0.52-0.88 c-0.22-0.41-0.42-0.84-0.6-1.28C4.3,14.05,4,12.62,4,11.15V5.67L12,2l8,3.67v5.49c0,0.83-0.1,1.65-0.28,2.45 C21.07,14.38,22,15.83,22,17.5z M13.9,20.17C13.34,19.42,13,18.5,13,17.5c0-2.49,2.01-4.5,4.5-4.5c0.45,0,0.88,0.09,1.29,0.21 c0.14-0.68,0.21-1.37,0.21-2.05V6.31L12,3.1L5,6.31v4.84c0,1.3,0.25,2.6,0.75,3.86c0.15,0.37,0.33,0.76,0.55,1.17 c0.14,0.27,0.31,0.54,0.48,0.81C8.09,19,9.94,20.41,12,20.97C12.66,20.79,13.29,20.52,13.9,20.17z M21,17.5c0-1.93-1.57-3.5-3.5-3.5 S14,15.57,14,17.5s1.57,3.5,3.5,3.5S21,19.43,21,17.5z"] {
  d: path("M13.22 22.61c-.4.15-.8.29-1.22.39-5.16-1.26-9-6.45-9-12V5l9-4 9 4v6c0 .9-.11 1.78-.3 2.65-.81-.41-1.73-.65-2.7-.65-3.31 0-6 2.69-6 6 0 1.36.46 2.61 1.22 3.61zM19 20v2.99s-1.99.01-2 0V20h-3v-2h3v-3h2v3h3v2h-3z");
  }
  [d*="M16.5,3C19.02,3,21,5.19,21,7.99c0,3.7-3.28,6.94-8.25,11.86L12,20.59l-0.74-0.73l-0.04-0.04C6.27,14.92,3,11.69,3,7.99 C3,5.19,4.98,3,7.5,3c1.4,0,2.79,0.71,3.71,1.89L12,5.9l0.79-1.01C13.71,3.71,15.1,3,16.5,3 M16.5,2c-1.74,0-3.41,0.88-4.5,2.28 C10.91,2.88,9.24,2,7.5,2C4.42,2,2,4.64,2,7.99c0,4.12,3.4,7.48,8.55,12.58L12,22l1.45-1.44C18.6,15.47,22,12.11,22,7.99 C22,4.64,19.58,2,16.5,2L16.5,2z"] {
  d: path("m12 21.35-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z");
  }
  [d*="M9,18.7l-5.4-5.4l0.7-0.7L9,17.3L20.6,5.6l0.7,0.7L9,18.7z"] {
  d: path("M9 16.2 4.8 12l-1.4 1.4L9 19 21 7l-1.4-1.4L9 16.2z");
  }
  [d*="M14.6,18.4L8.3,12l6.4-6.4l0.7,0.7L9.7,12l5.6,5.6L14.6,18.4z"] {
  d: path("M15.41 16.59 10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z");
  }
  [d*="M9.4,18.4l-0.7-0.7l5.6-5.6L8.6,6.4l0.7-0.7l6.4,6.4L9.4,18.4z"] {
  d: path("M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z");
  }
  [d*="M12.7,12l6.6,6.6l-0.7,0.7L12,12.7l-6.6,6.6l-0.7-0.7l6.6-6.6L4.6,5.4l0.7-0.7l6.6,6.6l6.6-6.6l0.7,0.7L12.7,12z"] {
  d: path("M19 6.41 17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z");
  }
  [d*="M16.24,9.17L13.41,12l2.83,2.83l-1.41,1.41L12,13.41l-2.83,2.83l-1.41-1.41L10.59,12L7.76,9.17l1.41-1.41L12,10.59 l2.83-2.83L16.24,9.17z M4.93,4.93c-3.91,3.91-3.91,10.24,0,14.14c3.91,3.91,10.24,3.91,14.14,0c3.91-3.91,3.91-10.24,0-14.14 C15.17,1.02,8.83,1.02,4.93,4.93z M18.36,5.64c3.51,3.51,3.51,9.22,0,12.73s-9.22,3.51-12.73,0s-3.51-9.22,0-12.73 C9.15,2.13,14.85,2.13,18.36,5.64z"] {
  d: path("M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm5 13.59L15.59 17 12 13.41 8.41 17 7 15.59 10.59 12 7 8.41 8.41 7 12 10.59 15.59 7 17 8.41 13.41 12 17 15.59z");
  }
  [d*="M21,11v1H5.64l6.72,6.72l-0.71,0.71L3.72,11.5l7.92-7.92l0.71,0.71L5.64,11H21z"] {
  d: path("M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z");
  }
  [d*="M21,21H3V3h9v1H4v16h16v-8h1V21z M15,3v1h4.32l-8.03,8.03L12,12.74l8-8V9h1V3H15z"] {
  d: path("M19 19H5V5h7V3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z");
  }
  [d*="M9.8,17.3l-4.2-4.1L7,11.8l2.8,2.7L17,7.4l1.4,1.4L9.8,17.3z M12,3c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S17,3,12,3 M12,2 c5.5,0,10,4.5,10,10s-4.5,10-10,10S2,17.5,2,12S6.5,2,12,2L12,2z"] {
  d: path("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z");
  }
  [d*="M15.01,7.34l1.64,1.64L8.64,17H6.99v-1.64L15.01,7.34 M15.01,5.92l-9.02,9.02V18h3.06l9.02-9.02L15.01,5.92L15.01,5.92z M17.91,4.43l1.67,1.67l-0.67,0.67L17.24,5.1L17.91,4.43 M17.91,3.02L15.83,5.1l3.09,3.09L21,6.11L17.91,3.02L17.91,3.02z M21,10h-1 v10H4V4h10V3H3v18h18V10z"] {
  d: path("M18,10v8H6V6h8l2-2H6A2.15,2.15,0,0,0,4,6V18a2.15,2.15,0,0,0,2,2H18a2.15,2.15,0,0,0,2-2V8Z M8,14v2h2l7-7L15,7ZM19.15,6.85a.5.5,0,0,0,0-.71L17.85,4.85a.5.5,0,0,0-.71,0L16,6l2,2Z");
  }
  [d*="M22,7H2v1h20V7z M13,12H2v-1h11V12z M13,16H2v-1h11V16z M15,19v-8l7,4L15,19z"] {
  d: path("M3 10h11v2H3zm0-4h11v2H3zm0 8h7v2H3zm13-1v8l6-4z");
  }
  [d*="M19.41,14l2.29,2.29l-1.41,1.41L18,15.41l-2.29,2.29l-1.41-1.41L16.59,14l-2.29-2.29l1.41-1.41L18,12.59l2.29-2.29 l1.41,1.41L19.41,14z M22,8H2V7h20V8z M13,11H2v1h11V11z M13,15H2v1h11V15z"] {
  d: path("M14 10H3v2h11v-2zm0-4H3v2h11V6zM3 16h7v-2H3v2zm11.41 6L17 19.41 19.59 22 21 20.59 18.41 18 21 15.41 19.59 14 17 16.59 14.41 14 13 15.41 15.59 18 13 20.59 14.41 22z");
  }
  [d*="M7,6H6v12h1V6z M17.35,17.65L11.71,12l5.65-5.65l0.71,0.71L13.12,12l4.94,4.94L17.35,17.65z"] {
  d: path("M18.41 16.59 13.82 12l4.59-4.59L17 6l-6 6 6 6zM6 6h2v12H6z");
  }
  [d*="M18,18h-1V6h1V18z M5.65,7.06L10.59,12l-4.94,4.94l0.71,0.71L12,12L6.36,6.35L5.65,7.06z"] {
  d: path("M5.59 7.41 10.18 12l-4.59 4.59L7 18l6-6-6-6zM16 6h2v12h-2z");
  }
  [d*="M16,14v3h-1v-3H16z M11,7v10h1V7H11z M7,10v7h1v-7H7z"] {
  d: path("M4 9h4v11H4zm12 4h4v7h-4zm-6-9h4v16h-4z");
  }
  [d*="M18,8.83V5H2v14h16v-5.83L22,15V7L18,8.83z M21,13.44l-2.58-1.18L17,11.61v1.56V18H3V6h14v2.83v1.56l1.42-0.65L21,8.56 V13.44z"] {
  d: path("M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z");
  }
  [d*="M12 4V13.38C11.27 12.54 10.2 12 9 12C6.79 12 5 13.79 5 16C5 18.21 6.79 20 9 20C11.21 20 13 18.21 13 16V8H19V4H12ZM9 19C7.34 19 6 17.66 6 16C6 14.34 7.34 13 9 13C10.66 13 12 14.34 12 16C12 17.66 10.66 19 9 19ZM18 7H13V5H18V7Z"] {
  d: path("M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z");
  }
  [d*="M11.5858 7L9.58579 5H3V19H21V7H11.5858ZM22 6V20H2V4H10L12 6H22Z"] {
  d: path("M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z");
  }
  [d*="M13,13h-2V7h2V13z M13,17h-2v-2h2V17z M15.59,3L21,8.41v7.17L15.59,21H8.41L3,15.59V8.41L8.41,3H15.59 M16,2H8L2,8v8l6,6h8"] {
  d: path("M15.73 3H8.27L3 8.27v7.46L8.27 21h7.46L21 15.73V8.27L15.73 3zM12 17.3c-.72 0-1.3-.58-1.3-1.3 0-.72.58-1.3 1.3-1.3.72 0 1.3.58 1.3 1.3 0 .72-.58 1.3-1.3 1.3zm1-4.3h-2V7h2v6z");
  }
  [d*="M2,5v14h20V5H2z M21,6v0.88l-9,6.8l-9-6.8V6H21z M3,18V8.13l9,6.8l9-6.8V18H3z"] {
  d: path("M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4-8 5-8-5V6l8 5 8-5v2z");
  }
  [d*="M4,21H3V3h1V21z M8,15H6v2h2V15z M8,11H6v2h2V11z M8,7H6v2h2V7z M18,15h-2v2h2V15z M8,19H6v2h2V19z M18,19h-2v2h2V19z M18,11h-2v2h2V11z M18,7h-2v2h2V7z M8,3H6v2h2V3z M18,3h-2v2h2V3z M21,3h-1v18h1V3z"] {
  d: path("M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2z");
  }
  [d*="M2,5v14h20V5H2z M21,6v12H3V6h2l1,3h3L8,6h2l1,3h3l-1-3h2l1,3h3l-1-3H21z M6,14l2.34-0.66L9,11l0.66,2.34L12,14l-2.34,0.66"] {
  d: path("m18 4 2 3h-3l-2-3h-2l2 3h-3l-2-3H8l2 3H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4zm-6.75 11.25L10 18l-1.25-2.75L6 14l2.75-1.25L10 10l1.25 2.75L14 14l-2.75 1.25zm5.69-3.31L16 14l-.94-2.06L13 11l2.06-.94L16 8l.94 2.06L19 11l-2.06.94z");
  }
  [d*="M21,10H3V9h18V10z M21,14H3v1h18V14z"] {
  d: path("M20 9H4v2h16V9zM4 15h16v-2H4v2z");
  }
  [d*="M20,12h-8v8h-1v-8H3v-1h8V3h1v8h8V12z"] {
  d: path("M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z");
  }
  [d*="M19,6v15H8V6H19 M15,2H4v16h1V3h10V2L15,2z M20,5H7v17h13V5L20,5z"] {
  d: path("M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z");
  }
  [d*="M8 7C8 7.55 7.55 8 7 8C6.45 8 6 7.55 6 7C6 6.45 6.45 6 7 6C7.55 6 8 6.45 8 7ZM7 16C6.45 16 6 16.45 6 17C6 17.55 6.45 18 7 18C7.55 18 8 17.55 8 17C8 16.45 7.55 16 7 16ZM10.79 8.23L21 18.44V20H17.73L11.97 14.24L10.7 15.51C10.89 15.97 11 16.47 11 17C11 19.21 9.21 21 7 21C4.79 21 3 19.21 3 17C3 14.79 4.79 13 7 13C7.42 13 7.81 13.08 8.19 13.2L9.56 11.83L8.45 10.72C8 10.89 7.51 11 7 11C4.79 11 3 9.21 3 7C3 4.79 4.79 3 7 3C9.21 3 11 4.79 11 7C11 7.43 10.91 7.84 10.79 8.23ZM10.08 8.94L9.65 8.5L9.84 7.92C9.95 7.58 10 7.28 10 7C10 5.35 8.65 4 7 4C5.35 4 4 5.35 4 7C4 8.65 5.35 10 7 10C7.36 10 7.73 9.93 8.09 9.79L8.7 9.55L9.16 10.01L10.27 11.12L10.98 11.83L10.27 12.54L8.9 13.91L8.47 14.34L7.89 14.16C7.55 14.05 7.27 14 7 14C5.35 14 4 15.35 4 17C4 18.65 5.35 20 7 20C8.65 20 10 18.65 10 17C10 16.62 9.93 16.25 9.78 15.88L9.53 15.27L10 14.8L11.27 13.53L11.98 12.82L12.69 13.53L18.15 19H20V18.85L10.08 8.94ZM17.73 4H21V5.56L15.48 11.08L13.07 8.67L17.73 4ZM18.15 5L14.48 8.67L15.48 9.67L20 5.15V5H18.15Z"] {
  d: path("M9.64 7.64c.23-.5.36-1.05.36-1.64 0-2.21-1.79-4-4-4S2 3.79 2 6s1.79 4 4 4c.59 0 1.14-.13 1.64-.36L10 12l-2.36 2.36C7.14 14.13 6.59 14 6 14c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4c0-.59-.13-1.14-.36-1.64L12 14l7 7h3v-1L9.64 7.64zM6 8c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm0 12c-1.1 0-2-.89-2-2s.9-2 2-2 2 .89 2 2-.9 2-2 2zm6-7.5c-.28 0-.5-.22-.5-.5s.22-.5.5-.5.5.22.5.5-.22.5-.5.5zM19 3l-6 6 2 2 7-7V3z");
  }
  [d*="M9.91,8.7l0.6,2.12l0.15,0.54l0.54,0.15l2.12,0.6l-2.12,0.6l-0.54,0.15l-0.15,0.54l-0.6,2.12l-0.6-2.12l-0.15-0.54 L8.62,12.7l-2.12-0.6l2.12-0.6l0.54-0.15l0.15-0.54L9.91,8.7 M9.91,5.01l-1.56,5.53L2.83,12.1l5.53,1.56l1.56,5.53l1.56-5.53 L17,12.1l-5.53-1.56L9.91,5.01L9.91,5.01z M16.72,16.81l-2.76,0.78l2.76,0.78l0.78,2.76l0.78-2.76l2.76-0.78l-2.76-0.78l-0.78-2.76 L16.72,16.81z M17.5,2.96l-0.78,2.76L13.96,6.5l2.76,0.78l0.78,2.76l0.78-2.76l2.76-0.78l-2.76-0.78L17.5,2.96z"] {
  d: path("m19 9 1.25-2.75L23 5l-2.75-1.25L19 1l-1.25 2.75L15 5l2.75 1.25L19 9zm-7.5.5L9 4 6.5 9.5 1 12l5.5 2.5L9 20l2.5-5.5L17 12l-5.5-2.5zM19 15l-1.25 2.75L15 19l2.75 1.25L19 23l1.25-2.75L23 19l-2.75-1.25L19 15z");
  }
  [d*="M16,16H8v-2h8V16z M16,11h-2v2h2V11z M19,11h-2v2h2V11z M13,11h-2v2h2V11z M10,11H8v2h2V11z M7,11H5v2h2V11z M16,8h-2v2h2V8 z M19,8h-2v2h2V8z M13,8h-2v2h2V8z M10,8H8v2h2V8z M7,8H5v2h2V8z M22,5v14H2V5H22z M21,6H3v12h18V6z"] {
  d: path("M20 5H4c-1.1 0-1.99.9-1.99 2L2 17c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm-9 3h2v2h-2V8zm0 3h2v2h-2v-2zM8 8h2v2H8V8zm0 3h2v2H8v-2zm-1 2H5v-2h2v2zm0-3H5V8h2v2zm9 7H8v-2h8v2zm0-4h-2v-2h2v2zm0-3h-2V8h2v2zm3 3h-2v-2h2v2zm0-3h-2V8h2v2z");
  }
  [d*="M14,2H4v20h16V8L14,2z M14,3.4L18.6,8H14V3.4z M5,21V3h8v6h6v12H5z"] {
  d: path("M6 2c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6H6zm7 7V3.5L18.5 9H13z");
  }
  [d*="M12.26,16.18l-2.93-2.87c-0.8,0.86-1.64,1.71-2.48,2.54L4.6,18.1L3.9,17.4l2.25-2.25c0.84-0.84,1.68-1.69,2.48-2.55 c-1.18-1.23-2.17-2.64-2.9-4.18L5.73,8.4h1.14c0.65,1.26,1.47,2.43,2.44,3.45c1.59-1.81,2.89-3.69,3.43-5.7H2.08v-1h6.65V3h1v2.15 h6.78v1h-2.73c-0.54,2.32-2.01,4.42-3.77,6.42l2.63,2.58C12.51,15.5,12.39,15.82,12.26,16.18z M21.51,21.01h-0.95l-1.12-3.04h-4.91 l-1.11,3.04h-0.96l4.09-10.81h0.87L21.51,21.01z M19.15,17.2l-2.17-5.89l-2.17,5.89H19.15z"] {
  d: path("M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z");
  }
  [d*="M20.8504 20.1499L20.1404 20.8599L13.0004 13.7099L13.0004 15.9999C13.0004 18.2099 11.2104 19.9999 9.00039 19.9999C6.79039 19.9999 5.00039 18.2099 5.00039 15.9999C5.00039 13.7899 6.79039 11.9999 9.00039 11.9999C10.2004 11.9999 11.2704 12.5399 12.0004 13.3799L12.0004 12.7099L3.15039 3.84989L3.86039 3.13989L20.8504 20.1499ZM12.0004 15.9999C12.0004 14.3399 10.6604 12.9999 9.00039 12.9999C7.34039 12.9999 6.00039 14.3399 6.00039 15.9999C6.00039 17.6599 7.34039 18.9999 9.00039 18.9999C10.6604 18.9999 12.0004 17.6599 12.0004 15.9999ZM13.0004 9.45989L12.0004 8.45989L12.0004 3.99989L19.0004 3.99989L19.0004 7.99989L13.0004 7.99989L13.0004 9.45989ZM13.0004 6.99989L18.0004 6.99989L18.0004 4.99989L13.0004 4.99989L13.0004 6.99989Z"] {
  d: path("M4.27 3 3 4.27l9 9v.28c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4v-1.73L19.73 21 21 19.73 4.27 3zM14 7h4V3h-6v5.18l2 2z");
  }
  [d*="M12,10c1.65,0,3,1.35,3,3s-1.35,3-3,3s-3-1.35-3-3S10.35,10,12,10 M12,9c-2.21,0-4,1.79-4,4s1.79,4,4,4s4-1.79,4-4 S14.21,9,12,9L12,9z M14.59,5l1.71,1.71L16.59,7H17h4v12H3V7h4h0.41l0.29-0.29L9.41,5H14.59 M15,4H9L7,6H2v14h20V6h-5L15,4L15,4z"] {
  d: path("M4,4H7L9,2H15L17,4H20A2,2 0 0,1 22,6V18A2,2 0 0,1 20,20H4A2,2 0 0,1 2,18V6A2,2 0 0,1 4,4M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7M12,9A3,3 0 0,1 15,12A3,3 0 0,1 12,15A3,3 0 0,1 9,12A3,3 0 0,1 12,9Z");
  }
  [d*="M5 9V20H19V9H5ZM17 13H12V18H17V13Z"] {
  d: path("M17 12h-5v5h5v-5zM16 1v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2h-1V1h-2zm3 18H5V8h14v11z");
  }
  [d*="M18 2V4H21V22H3V4H6V2H8V4H16V2H18ZM4 21H20V5H4V21Z"] {
  display: none !important;
  }
  [d*="M2,5v14h20V5H2z M21,6v12H3V6h2l1,3h3L8,6h2l1,3h3l-1-3h2l1,3h3l-1-3H21z"] {
  d: path("m18 4 2 4h-3l-2-4h-2l2 4h-3l-2-4H8l2 4H7L5 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4h-4z");
  }
  [d*="M18,4v15.06l-5.42-3.87L12,14.77l-0.58,0.42L6,19.06V4H18 M19,3H5v18l7-5l7,5V3L19,3z"] {
  d: path("M17 3H7c-1.1 0-1.99.9-1.99 2L5 21l7-3 7 3V5c0-1.1-.9-2-2-2z");
  }
  [d*="M15,5.63L20.66,12L15,18.37V15v-1h-1c-3.96,0-7.14,1-9.75,3.09c1.84-4.07,5.11-6.4,9.89-7.1L15,9.86V9V5.63 M14,3v6 C6.22,10.13,3.11,15.33,2,21c2.78-3.97,6.44-6,12-6v6l8-9L14,3L14,3z"] {
  d: path("M14 9V3L22 12L14 21V15C8.44 15 4.78 17.03 2 21C3.11 15.33 6.22 10.13 14 9Z");
  }
  [d*="M12,3.1l7,3.21v4.84c0,1.3-0.25,2.6-0.75,3.86c-0.15,0.37-0.33,0.76-0.55,1.17c-0.15,0.27-0.31,0.54-0.48,0.81 C15.91,19,14.06,20.41,12,20.97C9.94,20.41,8.09,19,6.77,16.99c-0.17-0.27-0.33-0.54-0.48-0.81c-0.22-0.41-0.4-0.79-0.55-1.17 C5.25,13.75,5,12.45,5,11.15V6.31L12,3.1 M12,2L4,5.67v5.49c0,1.47,0.3,2.9,0.81,4.22c0.17,0.44,0.37,0.86,0.6,1.28 c0.16,0.3,0.34,0.6,0.52,0.88c1.42,2.17,3.52,3.82,5.95,4.44L12,22l0.12-0.03c2.43-0.61,4.53-2.26,5.95-4.43 c0.19-0.29,0.36-0.58,0.52-0.88c0.22-0.41,0.43-0.84,0.6-1.28C19.7,14.05,20,12.62,20,11.15V5.67L12,2L12,2z"] {
  d: path("M12 1 3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z");
  }
  [d*="M12.73,11.93C14.59,11.58,16,9.96,16,8c0-2.21-1.79-4-4-4C9.79,4,8,5.79,8,8c0,1.96,1.41,3.58,3.27,3.93 C5.1,12.2,2,15.84,2,20h20C22,15.84,18.9,12.2,12.73,11.93z M9,8c0-1.65,1.35-3,3-3s3,1.35,3,3s-1.35,3-3,3S9,9.65,9,8z M12,12.9 c5.98,0,8.48,3.09,8.93,6.1H3.07C3.52,15.99,6.02,12.9,12,12.9z"] {
  d: path("M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z");
  }
  [d*="M14.97,16.95L10,13.87V7h2v5.76l4.03,2.49L14.97,16.95z M12,3c-4.96,0-9,4.04-9,9s4.04,9,9,9s9-4.04,9-9S16.96,3,12,3 M12,2c5.52,0,10,4.48,10,10s-4.48,10-10,10S2,17.52,2,12S6.48,2,12,2L12,2z"] {
  d: path("M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10 10-4.5 10-10S17.5 2 12 2zm4.2 14.2L11 13V7h1.5v5.2l4.5 2.7-.8 1.3z");
  }
  [d*="M17,8V6.63C17,4.08,14.76,2,12,2S7,4.08,7,6.63V8H4v14h16V8H17z M8,6.63c0-2.02,1.79-3.66,4-3.66s4,1.64,4,3.66V8H8V6.63z M19,21H5V9h14V21z M12,12c-1.66,0-3,1.34-3,3s1.34,3,3,3s3-1.34,3-3S13.66,12,12,12z M12,17c-1.1,0-2-0.9-2-2c0-1.1,0.9-2,2-2 s2,0.9,2,2C14,16.1,13.1,17,12,17z"] {
  d: path("M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z");
  }
  [d*="M17.7797 16H12.9997V15H17.7797C19.5797 15 21.0397 13.43 21.0397 11.5C21.0397 9.57 19.5797 8 17.7797 8H12.9997V7H17.7797C20.1297 7 22.0397 9.02 22.0397 11.5C22.0397 13.98 20.1297 16 17.7797 16ZM10.9997 15H6.18969C4.38969 15 2.92969 13.43 2.92969 11.5C2.92969 9.57 4.38969 8 6.18969 8H10.9997V7H6.18969C3.83969 7 1.92969 9.02 1.92969 11.5C1.92969 13.98 3.83969 16 6.18969 16H10.9997V15ZM15.9997 11H7.99969V12H15.9997V11Z"] {
  d: path("M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z");
  }
  [d*="M12,2C6.48,2,2,6.48,2,12c0,5.52,4.48,10,10,10s10-4.48,10-10C22,6.48,17.52,2,12,2z M3,12c0-0.7,0.09-1.37,0.24-2.02 L8,14.71v0.79c0,1.76,1.31,3.22,3,3.46v1.98C6.51,20.44,3,16.62,3,12z M11.5,18C10.12,18,9,16.88,9,15.5v-1.21l-5.43-5.4 C4.84,5.46,8.13,3,12,3c1.05,0,2.06,0.19,3,0.53V5c0,0.55-0.45,1-1,1h-3v2c0,0.55-0.45,1-1,1H8v3h6c0.55,0,1,0.45,1,1v4h2 c0.55,0,1,0.45,1,1v0.69C16.41,20.12,14.31,21,12,21v-3H11.5z M18.97,17.69C18.82,16.73,18,16,17,16h-1v-3c0-1.1-0.9-2-2-2H9v-1h1 c1.1,0,2-0.9,2-2V7h2c1.1,0,2-0.9,2-2V3.95c2.96,1.48,5,4.53,5,8.05C21,14.16,20.24,16.14,18.97,17.69z"] {
  d: path("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z");
  }
  [d*="M2 4V18H8V20H16V18H22V4H2ZM21 17H3V5H21V17Z"] {
  d: path("M20 3H4c-1.1 0-2 .9-2 2v11c0 1.1.9 2 2 2h3l-1 1v2h12v-2l-1-1h3c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 13H4V5h16v11z");
  }
  [d*="M12 18C13.6569 18 15 16.6569 15 15C15 13.3431 13.6569 12 12 12C10.3431 12 9 13.3431 9 15C9 16.6569 10.3431 18 12 18ZM12 17C13.1046 17 14 16.1046 14 15C14 13.8954 13.1046 13 12 13C10.8954 13 10 13.8954 10 15C10 16.1046 10.8954 17 12 17Z"] {
  d: path("M12 17c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm6-9h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6h1.9c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm0 12H6V10h12v10z");
  }
  [d*="M17 6.63V8H20V22H4V8H16V6.63C16 4.61 14.21 2.97 12 2.97C10.025 2.97 8.38544 4.27976 8.05907 6H7.04615C7.37894 3.74611 9.47121 2 12 2C14.76 2 17 4.08 17 6.63ZM5 21V9H19V21H5Z"] {
  display: none !important;
  }
  [d*="M5 9H4V4H9V5H5V9ZM20 4H15V5H19V9H20V4ZM20 15H19V19H15V20H20V15ZM9 19H5V15H4V20H9V19Z"] {
  d: path("M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z");
  }
  [d*="M9 19H7V5H9V19ZM17 5H15V19H17V5Z"] {
  d: path("M6 19h4V5H6v14zm8-14v14h4V5h-4z");
  }
  [d*="M17.5 11.93C17.5 14.07 16 15.85 14 16.31V15.27C15.44 14.84 16.5 13.51 16.5 11.93C16.5 10.35 15.44 9.03 14 8.59V7.55C16 8.01 17.5 9.79 17.5 11.93ZM12 4V19.86L6.16 14.93H3V8.93H6.16L12 4ZM11 6.15L6.52 9.93H4V13.93H6.52L11 17.71V6.15ZM21 11.93C21 16.01 17.95 19.37 14 19.86V18.85C17.39 18.36 20 15.45 20 11.93C20 8.41 17.39 5.5 14 5.01V4C17.95 4.49 21 7.85 21 11.93Z"] {
  d: path("M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z");
  }
  [d*="M 19.5 11.93 C 19.5 14.07 18 15.85 16 16.31 V 15.27 C 17.44 14.84 18.5 13.51 18.5 11.93 C 18.5 10.35 17.44 9.03 16 8.59 V 7.55 C 18 8.01 19.5 9.79 19.5 11.93 Z M 14 4 V 19.86 L 8.16 14.93 H 5 V 8.93 H 8.16 L 14 4 Z M 13 6.15 L 8.52 9.93 H 6 V 13.93 H 8.52 L 13 17.71 V 6.15 Z"] {
  d: path("M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z");
  }
  [d*="M3.15 3.85014L7.32 8.02014L6.16 9.00014H3V15.0001H6.16L12 19.9301V12.7101L14.45 15.1601C14.3 15.2301 14.15 15.2901 14 15.3401V16.3801C14.43 16.2801 14.83 16.1101 15.2 15.9001L17.01 17.7101C16.13 18.3301 15.11 18.7501 14 18.9101V19.9201C15.39 19.7501 16.66 19.2101 17.73 18.4301L20.15 20.8501L20.86 20.1401L3.86 3.14014L3.15 3.85014ZM11 11.7101V17.7801L6.52 14.0001H4V10.0001H6.52L8.02 8.73014L11 11.7101ZM10.33 6.79014L9.62 6.08014L12 4.07014V8.46014L11 7.46014V6.22014L10.33 6.79014ZM14 8.66014V7.62014C16 8.08014 17.5 9.86014 17.5 12.0001C17.5 12.5801 17.37 13.1301 17.17 13.6401L16.38 12.8501C16.45 12.5801 16.5 12.3001 16.5 12.0001C16.5 10.4201 15.44 9.10014 14 8.66014ZM14 5.08014V4.07014C17.95 4.56014 21 7.92014 21 12.0001C21 13.5601 20.54 15.0101 19.77 16.2401L19.04 15.5101C19.65 14.4801 20 13.2801 20 12.0001C20 8.48014 17.39 5.57014 14 5.08014Z"] {
  d: path("M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4 9.91 6.09 12 8.18V4z");
  }
  [d*="M 10 10 H 4.676 V 8.669 H 8.669 V 4.676 H 10 V 10 Z M 20.648 8.669 H 16.655 V 4.676 H 15.324 V 10 H 20.648 V 8.669 Z M 16.655 16.655 H 20.648 V 15.324 H 15.324 V 20.648 H 16.655 V 16.655 Z M 10 15.324 H 4.676 V 16.655 H 8.669 V 20.648 H 10 V 15.324 Z"] {
  d: path("M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z");
  }
  [d*="M14,11H6V9h8V11z M20.17,20.87l-5.59-5.59C13.35,16.35,11.75,17,10,17c-3.87,0-7-3.13-7-7c0-3.87,3.13-7,7-7s7,3.13,7,7 c0,1.75-0.65,3.35-1.71,4.58l5.59,5.59L20.17,20.87z M16,10c0-3.31-2.69-6-6-6s-6,2.69-6,6s2.69,6,6,6S16,13.31,16,10z"] {
  d: path("M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14zM7 9h5v1H7z");
  }
  [d*="M14,11h-3v3H9v-3H6V9h3V6h2v3h3V11z M20.17,20.87l-5.59-5.59C13.35,16.35,11.75,17,10,17c-3.87,0-7-3.13-7-7 c0-3.87,3.13-7,7-7s7,3.13,7,7c0,1.75-0.65,3.35-1.71,4.58l5.59,5.59L20.17,20.87z M16,10c0-3.31-2.69-6-6-6s-6,2.69-6,6s2.69,6,6,6 S16,13.31,16,10z"] {
  d: path("M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z M12 10h-2v2H9v-2H7V9h2V7h1v2h2v1z");
  }
  [d*="M19.2001 14.02C19.2001 11.82 17.1001 9.99997 14.5101 9.99997H5.86012L9.29012 13.36L8.58012 14.07L3.87012 9.44997L8.58012 4.83997L9.28012 5.54997L5.76012 8.99997H14.5101C17.6501 8.99997 20.2001 11.27 20.2001 14.02C20.2001 16.77 17.6501 19 14.5101 19H6.07012V18H14.5101C17.1001 18 19.2001 16.21 19.2001 14.02Z"] {
  d: path("M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z");
  }
  [d*="M9.56012 18H18.0001V19H9.56012C6.42012 19 3.87012 16.77 3.87012 14.02C3.87012 11.27 6.42012 8.99997 9.56012 8.99997H18.3101L14.7901 5.54997L15.4901 4.83997L20.2001 9.44997L15.4901 14.06L14.7801 13.35L18.2101 9.99997H9.56012C6.97012 9.99997 4.87012 11.82 4.87012 14.02C4.87012 16.21 6.97012 18 9.56012 18Z"] {
  d: path("M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z");
  }
  [d*="M10,8v8l6-4L10,8L10,8z M12,3c4.96,0,9,4.04,9,9s-4.04,9-9,9s-9-4.04-9-9S7.04,3,12,3 M12,2C6.48,2,2,6.48,2,12 s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2L12,2z"] {
  d: path("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zM9.5 16.5v-9l7 4.5-7 4.5z");
  }
  [d*="M16 16H8V8H16V16Z"] {
  d: path("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4 14H8V8h8v8z");
  }
  [d*="M18.95,6.28C17.23,4.19,14.7,3,12,3h-1.43l1.02-1.02l-1.41-1.41L6.82,3.92l3.35,3.35l1.41-1.41L10.73,5H12 c2.1,0,4.07,0.93,5.4,2.55c1.34,1.62,1.87,3.76,1.46,5.86c-0.53,2.73-2.72,4.92-5.45,5.45c-2.11,0.41-4.24-0.12-5.86-1.46 C5.93,16.07,5,14.1,5,12H3c0,2.7,1.19,5.23,3.28,6.95C7.9,20.29,9.93,21,12.02,21c0.59,0,1.19-0.06,1.78-0.17 c3.52-0.68,6.35-3.51,7.03-7.03C21.35,11.1,20.66,8.36,18.95,6.28z M10,8H9.85L7,9.19v1.29l1.63-0.59V16H10V8z M16.35,8.84 C15.92,8.28,15.3,8,14.5,8s-1.42,0.28-1.85,0.84c-0.43,0.56-0.64,1.39-0.64,2.48v1.43c0.01,1.04,0.23,1.85,0.65,2.41 C13.09,15.72,13.7,16,14.51,16c0.82,0,1.43-0.29,1.86-0.86c0.42-0.57,0.63-1.39,0.63-2.47v-1.43C16.99,10.2,16.77,9.39,16.35,8.84z M15.53,12.95c-0.01,0.61-0.09,1.06-0.25,1.36c-0.16,0.3-0.42,0.44-0.78,0.44c-0.36,0-0.62-0.15-0.79-0.46 c-0.16-0.31-0.25-0.78-0.25-1.42v-1.89c0.01-0.6,0.1-1.03,0.26-1.31c0.16-0.28,0.42-0.42,0.76-0.42c0.36,0,0.62,0.15,0.78,0.44 c0.17,0.29,0.25,0.76,0.25,1.41V12.95z"] {
  d: path("M11.99 5V1l-5 5 5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6h-2c0 4.42 3.58 8 8 8s8-3.58 8-8-3.58-8-8-8z M10.89 16h-.85v-3.26l-1.01.31v-.69l1.77-.63h.09V16zm4.28-1.76c0 .32-.03.6-.1.82s-.17.42-.29.57-.28.26-.45.33-.37.1-.59.1-.41-.03-.59-.1-.33-.18-.46-.33-.23-.34-.3-.57-.11-.5-.11-.82v-.74c0-.32.03-.6.1-.82s.17-.42.29-.57.28-.26.45-.33.37-.1.59-.1.41.03.59.1.33.18.46.33.23.34.3.57.11.5.11.82v.74zm-.85-.86c0-.19-.01-.35-.04-.48s-.07-.23-.12-.31-.11-.14-.19-.17-.16-.05-.25-.05-.18.02-.25.05-.14.09-.19.17-.09.18-.12.31-.04.29-.04.48v.97c0 .19.01.35.04.48s.07.24.12.32.11.14.19.17.16.05.25.05.18-.02.25-.05.14-.09.19-.17.09-.19.11-.32.04-.29.04-.48v-.97z");
  }
  [d*="M10.0007 16.0001H8.63066V9.89006L7.00066 10.4701V9.19006L9.85066 8.00006H10.0007V16.0001ZM17.0007 12.6701C17.0007 13.7501 16.7907 14.5701 16.3707 15.1401C15.9407 15.7101 15.3207 16.0001 14.5107 16.0001C13.7007 16.0001 13.0907 15.7201 12.6607 15.1601C12.2307 14.6001 12.0207 13.8001 12.0107 12.7501V11.3201C12.0107 10.2301 12.2207 9.41006 12.6507 8.84006C13.0807 8.28006 13.6907 8.00006 14.5007 8.00006C15.3107 8.00006 15.9207 8.28006 16.3507 8.84006C16.7807 9.40006 16.9907 10.2001 17.0007 11.2401V12.6701ZM15.5307 11.1001C15.5307 10.4501 15.4507 9.98006 15.2807 9.69006C15.1107 9.40006 14.8507 9.25006 14.5007 9.25006C14.1507 9.25006 13.9007 9.39006 13.7407 9.67006C13.5807 9.95006 13.4907 10.3901 13.4807 10.9801V12.8701C13.4807 13.5101 13.5607 13.9801 13.7307 14.2901C13.8907 14.6001 14.1607 14.7501 14.5207 14.7501C14.8807 14.7501 15.1407 14.6001 15.3007 14.3101C15.4607 14.0101 15.5407 13.5601 15.5507 12.9501V11.1001H15.5307ZM19.0007 12.0001C19.0007 14.1001 18.0707 16.0701 16.4507 17.4001C14.8307 18.7401 12.6907 19.2701 10.5907 18.8601C7.86066 18.3301 5.67066 16.1401 5.14066 13.4101C4.73066 11.3101 5.26066 9.17006 6.60066 7.55006C7.93066 5.93006 9.90066 5.00006 12.0007 5.00006H13.2707L12.4207 5.85006L13.8307 7.26006L17.1807 3.91006L13.8307 0.560059L12.4207 1.97006L13.4307 3.00006H12.0007C9.30066 3.00006 6.77066 4.19006 5.05066 6.28006C3.33066 8.36006 2.65066 11.1001 3.17066 13.8001C3.85066 17.3201 6.68066 20.1501 10.2007 20.8301C10.8007 20.9401 11.3907 21.0001 11.9807 21.0001C14.0707 21.0001 16.0907 20.2901 17.7207 18.9501C19.8107 17.2301 21.0007 14.7001 21.0007 12.0001H19.0007Z"] {
  d: path("M18 13c0 3.31-2.69 6-6 6s-6-2.69-6-6 2.69-6 6-6v4l5-5-5-5v4c-4.42 0-8 3.58-8 8s3.58 8 8 8 8-3.58 8-8h-2z M10.86 15.94v-4.27h-.09L9 12.3v.69l1.01-.31v3.26zm1.39-2.5v.74c0 1.9 1.31 1.82 1.44 1.82.14 0 1.44.09 1.44-1.82v-.74c0-1.9-1.31-1.82-1.44-1.82-.14 0-1.44-.09-1.44 1.82zm2.04-.12v.97c0 .77-.21 1.03-.59 1.03s-.6-.26-.6-1.03v-.97c0-.75.22-1.01.59-1.01.38-.01.6.26.6 1.01z");
  }
  [d*="M11,16H9V8h2V16z M15,8h-2v8h2V8z M12,3c4.96,0,9,4.04,9,9s-4.04,9-9,9s-9-4.04-9-9S7.04,3,12,3 M12,2C6.48,2,2,6.48,2,12 s4.48,10,10,10s10-4.48,10-10S17.52,2,12,2L12,2z"] {
  d: path("M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 14H9V8h2v8zm4 0h-2V8h2v8z");
  }
  [d*="M19,6L9,12l10,6V6L19,6z M7,6H5v12h2V6z"] {
  d: path("M6 6h2v12H6zm3.5 6 8.5 6V6z");
  }
  [d*="M5,18l10-6L5,6V18L5,18z M19,6h-2v12h2V6z"] {
  d: path("m6 18 8.5-6L6 6v12zM16 6v12h2V6h-2z");
  }
  [d*="M6,4l12,8L6,20V4z"] {
  d: path("M8 5v14l11-7z");
  }
  [d*="M6,9H2V5h1v1.8C3.9,5.1,5.7,4,7.7,4c2.8,0,5.1,2.2,5.3,5h-1c-0.3-2.2-2.1-3.9-4.3-3.9C5.8,5.1,4.2,6.3,3.6,8H6V9z M9,11h2.4  c-0.6,1.7-2.2,2.9-4.1,2.9c-2.2,0-4.1-1.7-4.3-3.9H2c0.3,2.8,2.5,5,5.3,5c2,0,3.7-1.1,4.7-2.8V14h1v-4H9V11z M22,10v2h-3v5.5  c0,1.4-1.1,2.5-2.5,2.5c-1.4,0-2.5-1.1-2.5-2.5s1.1-2.5,2.5-2.5c0.6,0,1.1,0.2,1.5,0.5l0,0V10H22z M18,17.5c0-0.8-0.7-1.5-1.5-1.5  S15,16.7,15,17.5s0.7,1.5,1.5,1.5S18,18.3,18,17.5z"] {
  d: path("m7.6 4.1v-2.1l-2.8 2.8 2.8 2.8v-2.1c2.4 0 4.3 1.9 4.3 4.3 0 0.7-0.2 1.3-0.5 1.9l1 1.1c0.5-0.9 0.9-1.9 0.9-3 0-3.2-2.5-5.7-5.7-5.7zm0 9.9c-2.3 0-4.2-1.9-4.2-4.2 0-0.8 0.2-1.4 0.5-2l-1-1.1c-0.6 0.9-0.9 1.9-0.9 3.1 0 3.1 2.5 5.6 5.6 5.6v2.1l2.9-2.8-2.9-2.8z m18.2 8.3v7.3q-0.7-0.4-1.4-0.4c-1.6 0-2.8 1.2-2.8 2.8 0 1.5 1.2 2.7 2.8 2.7 1.5 0 2.8-1.2 2.8-2.7v-7h2.7v-2.7z");
  }
  [d*="M16,9H8V7h8V9z M13,11H8v2h5V11z M19,3H5v16.59l3.29-3.29L8.59,16H9h10V3 M20,2v15H9l-5,5V2H20L20,2z"] {
  d: path("M21.99 4c0-1.1-.89-2-1.99-2H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h14l4 4-.01-18zM18 14H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z");
  }
  [d*="M21.29 7.63A5.244 5.244 0 0 0 16.73 5c-.89 0-1.8.23-2.63.71L12 6.92 9.9 5.71C9.07 5.23 8.17 5 7.27 5c-1.82 0-3.59.94-4.56 2.63a5.264 5.264 0 0 0 1.93 7.19L12 19l7.36-4.17c2.52-1.46 3.39-4.68 1.93-7.2zm-17.72.5A4.296 4.296 0 0 1 7.27 6c.75 0 1.48.2 2.13.57 0 0 4.22 2.43 4.54 2.61.17.1.32.22.42.39.29.46.19 1.18-.43 1.49-.36.18-.72.16-1.07-.03-.35-.19-4.62-2.58-4.62-2.58l-1.07.6 1.04.6-4.68 2.65s-.3-.6-.38-.93c-.3-1.1-.15-2.25.42-3.24zm.58 5.02c1.43-.8 5.17-2.88 5.17-2.88l2.2 1.22-5.39 3.03-1-.57a4.19 4.19 0 0 1-.98-.8zm16.7-1.78c-.29 1.1-1 2.02-1.98 2.59L12 17.85l-1.62-.92 6-3.36c-.01-.02-.7-.41-1.04-.6l-6.01 3.37-2.13-1.21s5.31-2.97 5.32-2.98c.07-.05.14-.05.22-.02.52.17 1.03.16 1.53-.06.77-.33 1.22-.9 1.32-1.72.06-.47-.05-.91-.29-1.32-.19-.32-.47-.56-.79-.75-.4-.23-1.45-.81-1.45-.81l1.55-.9c.64-.37 1.37-.57 2.12-.57 1.52 0 2.94.82 3.7 2.13.57.99.72 2.14.42 3.24z"] {
  d: path("M16.48 10.41c-.39.39-1.04.39-1.43 0l-4.47-4.46-7.05 7.04-.66-.63c-1.17-1.17-1.17-3.07 0-4.24l4.24-4.24c1.17-1.17 3.07-1.17 4.24 0L16.48 9c.39.39.39 1.02 0 1.41zm.7-2.12c.78.78.78 2.05 0 2.83-1.27 1.27-2.61.22-2.83 0l-3.76-3.76-5.57 5.57c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.42 0l4.62-4.62.71.71-4.62 4.62c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.42 0l4.62-4.62.71.71-4.62 4.62c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l4.62-4.62.71.71-4.62 4.62c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l8.32-8.34c1.17-1.17 1.17-3.07 0-4.24l-4.24-4.24c-1.15-1.15-3.01-1.17-4.18-.06l4.47 4.47z");
  }
  [d*="M3,11h3v10H3V11z M18.77,11h-4.23l1.52-4.94C16.38,5.03,15.54,4,14.38,4c-0.58,0-1.14,0.24-1.52,0.65L7,11v10h10.43 c1.06,0,1.98-0.67,2.19-1.61l1.34-6C21.23,12.15,20.18,11,18.77,11z"] {
  d: path("M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z");
  }
  [d*="M18,4h3v10h-3V4z M5.23,14h4.23l-1.52,4.94C7.62,19.97,8.46,21,9.62,21c0.58,0,1.14-0.24,1.52-0.65L17,14V4H6.57 C5.5,4,4.59,4.67,4.38,5.61l-1.34,6C2.77,12.85,3.82,14,5.23,14z"] {
  d: path("M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z");
  }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
