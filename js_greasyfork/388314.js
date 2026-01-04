// ==UserScript==
// @name         Tweetdeck: Retro Dark Mode
// @version      1.53
// @description  Makes the Tweetdeck dark mode more like the pre-Feburary 2018 design.
// @author       Felix G. "Automalix"
// @namespace    https://greasyfork.org/en/users/322117
// @match        http://tweetdeck.twitter.com/*
// @match        https://tweetdeck.twitter.com/*
// @require      http://code.jquery.com/jquery-3.3.1.min.js
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/388314/Tweetdeck%3A%20Retro%20Dark%20Mode.user.js
// @updateURL https://update.greasyfork.org/scripts/388314/Tweetdeck%3A%20Retro%20Dark%20Mode.meta.js
// ==/UserScript==

function addGlobalStyle(css) {
    var head, style;
    head = document.getElementsByTagName('head')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}
//don't mind the horrible formatting
addGlobalStyle('html.dark .color-twitter-blue {color:#7ccbff !important;}'
               +'html.dark .attach-compose-buttons .tweet-button {background-color:#485865 !important;}'
               +'html.dark .bg-color-twitter-midnight-dark-gray {background-color:#222426 !important;}'
               +'html.dark .accounts-drawer {background:#222426 !important;}'
               +'html.dark .account-remove-check {background:#222426 !important;}'
               +'html.dark .column {background-color:#222426 !important;}'
               +'html.dark .column-panel {background:#222426 !important;}'
               +'html.dark .column-nav:after {background-color:#222426;border-color:#14171a !important;}'
               +'html.dark .column-background-fill {background-color:#222426 !important;}'
               +'html.dark .location-form .typeahead-dropdown {background:#222426 !important;}'
               +'html.dark .column-type-scheduled {background-color:#222426 !important;}'
               +'html.dark .column-header, html.dark .column-header-temp {background-color:#292f33 !important;}'
               +'html.dark .column-message {background-color:#222426 !important;}'
               +'html.dark .edit-conversation-name {background-color:#222426 !important;}'
               +'html.dark .column-options {background-color:#292f33 !important;}'
               +'html.dark .column-options .button-tray {background-color:#292f33 !important;}'
               +'html.dark .stream-item {background-color:#222426 !important;}'
               +'html.dark .tweet-detail-wrapper {background:#222426 !important;}'
               +'html.dark .conversation-event {background-color:#222426 !important;}'
               +'html.dark .add-participant {background-color:#222426 !important;}'
               +'html.dark .accordion-divider-t {border-top:1px solid #222426 !important;}'
               +'html.dark .facet-type {position:relative;border-bottom:1px solid #222426} !important;}'
               +'html.dark .facet-type-thumb-size {border-top:1px solid #222426 !important;}'
               +'html.dark .facet-type.is-active {background-color:#222426 !important;}'
               +'html.dark .numbered-badge-onheader{border:2px solid #222426 !important;}'
               +'html.dark .dataminr{background-color:#222426 !important;}'
               +'html.dark .mdl{background-color:#222426 !important;}'
               +'html.dark .detail-view-inline{background-color:#222426 !important;}'
               +'html.dark .embed-modal .mdl-content{height:auto;border:none;background:#222426 !important;}'
               +'html.dark .keyboard-shortcut-list-modal .mdl-content{background:#222426 !important;}'
               +'html.dark .prf-meta{background:#222426 !important;}'
               +'html.dark .scroll-conversation{background:#181a1c !important;}'
               +'html.dark .dark-border{border:1px solid #444448 !important;}'
               +'html.dark .bg-color-twitter-midnight-darkest-gray {background-color:#181a1c !important;}');
addGlobalStyle('html.dark .btn-on-dark:focus,html.dark input[type=button].btn-on-dark:hover'
                    +'{background-color:#444448 !important;}');
addGlobalStyle('html.dark button.btn-on-dark:focus, html.dark input[type=button].btn-on-dark:focus'
                    +'{box-shadow:0 0 0 2px #444448 !important;}');
addGlobalStyle('html.dark .column-nav .nav-item button:hover {background-color:#444448 !important;}');
addGlobalStyle('html.dark .column-title-edit-box {background-color:#444448 !important;}');
addGlobalStyle('html.dark .edit-conversation-name input {background-color:#181a1c !important;}');
addGlobalStyle('html.dark .gap-chirp {background-color:#444448 !important;}');
addGlobalStyle('html.dark .media-badge {border:1px solid #444448 !important;}');
addGlobalStyle('html.dark .app-columns-container,html.dark .app-content {background-color:#181a1c !important;}');
addGlobalStyle('html.dark .app-nav-tab.is-selected {background:#444448 !important;}');
addGlobalStyle('html.dark .app-search-fake,html.dark .app-search-input {background-color:#3a3d42 !important;}');
addGlobalStyle('html.dark .app-search-fake {color:#777777;border:1px solid #3a3d42 !important;}');
addGlobalStyle('html.dark .dataminr-separator {border-bottom:2px solid #444448 !important;}');
addGlobalStyle('html.dark .dataminr-external-link {background-color:#444448 !important;}');
addGlobalStyle('html.dark .search-tip-item-hover:hover {background:#444448 !important;}');
addGlobalStyle('html.dark .InputGroup input {background-color:#444448 !important;}');
addGlobalStyle('html.dark .InputGroup button {border:none;background-color:#444448 !important;}');
addGlobalStyle('html.dark .InputGroup button:hover {background-color:#444448 !important;}');
addGlobalStyle('html.dark .mdl-accent {background:#222426 !important;}');
addGlobalStyle('html.dark .detail-view-inline-text {background-color:#222426 !important;}');
addGlobalStyle('html.dark .text-like-keyboard-key {background-color:#e1e8ed;color:#10171e !important;}');
addGlobalStyle('html.dark .list-account:hover,html.dark .list-link:hover,html.dark .list-listaccount:hover,html.dark .list-listmember:hover,'
               +'html.dark .list-subtitle:hover,html.dark .list-twitter-list:hover'
                    +'{background:#222426 !important;}');
addGlobalStyle('html.dark .list-account:hover:active,html.dark .list-account:hover:focus,html.dark .list-account:hover:hover,'
               +'html.dark .list-link:hover:active,html.dark .list-link:hover:focus,html.dark .list-link:hover:hover,'
               +'html.dark .list-listaccount:hover:active,html.dark .list-listaccount:hover:focus,html.dark .list-listaccount:hover:hover,'
               +'html.dark .list-listmember:hover:active,html.dark .list-listmember:hover:focus,html.dark .list-listmember:hover:hover,'
               +'html.dark .list-subtitle:hover:active,html.dark .list-subtitle:hover:focus,html.dark .list-subtitle:hover:hover,'
               +'html.dark .list-twitter-list:hover:active,html.dark .list-twitter-list:hover:focus,html.dark .list-twitter-list:hover:hover'
                    +'{background:#222426 !important;}');
addGlobalStyle('html.dark input,html.dark select,html.dark textarea {display:inline-block; font-size:13px; line-height:18px; background:#222426 !important;}');
addGlobalStyle('html.dark input:disabled {background-color:#222426 !important;}');
addGlobalStyle('html.dark select:disabled {background-color:#222426 !important;}');
addGlobalStyle('html.dark .popover {background-color:#292f33;box-shadow:0 0 10px #1e2326 !important;}');
addGlobalStyle('html.dark .column-header-link {color:#8299a6}');
addGlobalStyle('html.dark .compose {background-color:#485865 !important;}');
addGlobalStyle('html.dark .app-header {background-color:#292f33 !important;}');
addGlobalStyle('html.dark .column-navigator {background-color:#292f33 !important;}');
addGlobalStyle('html.dark .js-int-scroller {background-color:#292f33 !important;}');
addGlobalStyle('html.dark .popover {background-color:#292f33 !important;}');
addGlobalStyle('html.dark .mdl-column-med{background:#292f33 !important;}');
addGlobalStyle('html.dark .mdl-lighter-on-dark{background-color:#292f33 !important;}');
addGlobalStyle('html.dark .is-dataminr-tweet{background-color:#292f33 !important;}');
addGlobalStyle('html.dark .numbered-badge-onnav{border:2px solid #292f33 !important;}');
addGlobalStyle('html.dark .join-team{background:#292f33 !important;}');
addGlobalStyle('html.dark .app-navigator{background-color:#292f33 !important;}');
addGlobalStyle('html.dark .app-nav-link{font-size:18px;color:#8899A6 !important;}');
addGlobalStyle('html.dark .app-nav-link:hover{font-size:18px;color:#b7c1c9 !important;}');
addGlobalStyle('html.dark .app-title{background-color:#292f33 !important;}');
addGlobalStyle('html.dark .app-header{background-color:#292f33 !important;}');
addGlobalStyle('html.dark .social-proof-for-tweet-title{background-color:#292f33 !important;}');
addGlobalStyle('html.dark .column-detail .is-selected-tweet{background:#292f33 !important;}');
addGlobalStyle('html.dark .is-selected-tweet{background:#292f33 !important;}');
addGlobalStyle('html.dark .search-results-container .stream-item{background-color:#292f33 !important;}');
addGlobalStyle('html.dark .contributor-row[data-state=confirmRemove-removing]{background-color:#292f33 !important;}');
addGlobalStyle('html.dark .contributor-row[data-state=confirmRemove-removing],html.dark .contributor-row[data-state=confirmRemove]'
                    +'{background-color:#292f33 !important;}');
addGlobalStyle('html.dark .contributor-row[data-state=confirmAdd-added] [data-hide-when-state~=confirmAdd-added] {display:none}'
               +'html.dark .contributor-row[data-state=confirmDeadmin] {background-color:#292f33 !important;}');
addGlobalStyle('html.dark .contributor-row[data-state=confirmAdd-added] {background-color:#292f33 !important;}');
addGlobalStyle('html.dark .contributor-row[data-state=confirmAdd] {background-color:#292f33} !important;}');
addGlobalStyle('html.dark .contributor-row[data-state=settings] {background-color:#292f33 !important;}');
addGlobalStyle('html.dark .column-nav {background-color:#292f33 !important;}');
addGlobalStyle('html.dark .manage-team-summary {background:#292f33 !important;}');
addGlobalStyle('html.dark .account-settings-row {background:#292f33 !important;}');
addGlobalStyle('html.dark .is-loading {background-color:#292f33 !important;}');
//addGlobalStyle('html.dark body:before {background-image:radial-gradient(circle,#82bbdd,#292f33 !important;}');
addGlobalStyle('.column-nav-item {color:#f5f8fa;background-color:#292f33 !important;}');
addGlobalStyle('.numbered-badge-onnav {border:2px solid #292f33; !important;}');
addGlobalStyle('.app-navigator {background-color:#292f33 !important;}');
addGlobalStyle('.app-title {background-color:#292f33 !important;}');
addGlobalStyle('.app-header {background-color:#292f33 !important;}');
addGlobalStyle('html.dark .app-nav-tab {color:#8899A6 !important;}');
addGlobalStyle('html.dark .app-nav-tab:hover {color:#b7c1c9 !important;}');
addGlobalStyle('.overlay-opaque {background-color:#485865 !important;}');
addGlobalStyle('html.dark .Button.btn-fav.s-favorited:focus, html.dark .Button.Button--primary.is-focus,'
               +'html.dark .Button.Button--primary:focus, html.dark .Button.is-focus.btn-fav.s-favorited,'
               +'html.dark .ButtonGroup--primary > .Button.is-focus, html.dark .ButtonGroup--primary > .Button:focus,'
               +'html.dark .ButtonGroup--primary > .ButtonGroup > .Button.is-focus, html.dark .ButtonGroup--primary > .ButtonGroup > .Button:focus,'
               +'html.dark .ButtonGroup--primary > .ButtonGroup > button.is-focus, html.dark .ButtonGroup--primary > .ButtonGroup > button:focus,'
               +'html.dark .ButtonGroup--primary > .ButtonGroup > input.is-focus[type="button"],'
               +'html.dark .ButtonGroup--primary > .ButtonGroup > input:focus[type="button"],'
               +'html.dark .ButtonGroup--primary > button.is-focus, html.dark .ButtonGroup--primary > button:focus,'
               +'html.dark .ButtonGroup--primary > input.is-focus[type="button"], html.dark .ButtonGroup--primary > input:focus[type="button"],'
               +'html.dark .s-following .follow-btn:hover .Button.following-text:focus, html.dark .s-following .follow-btn:hover .Button.is-focus.following-text,'
               +'html.dark .s-following .follow-btn:hover button.following-text:focus, html.dark .s-following .follow-btn:hover button.is-focus.following-text,'
               +'html.dark .s-following .follow-btn:hover input.following-text:focus[type="button"],'
               +'html.dark .s-following .follow-btn:hover input.is-focus.following-text[type="button"],'
               +'html.dark button.btn-fav.s-favorited:focus, html.dark button.Button--primary.is-focus,'
               +'html.dark button.Button--primary:focus, html.dark button.is-focus.btn-fav.s-favorited,'
               +'html.dark input.btn-fav.s-favorited:focus[type="button"], html.dark input.Button--primary.is-focus[type="button"],'
               +'html.dark input.Button--primary:focus[type="button"], html.dark input.is-focus.btn-fav.s-favorited[type="button"]'
                    +'{background:#51aeee;border:1px solid #51aeee}');
addGlobalStyle('html.dark a {color:#7ccbff}');
//addGlobalStyle('a:active,a:focus,a:hover {color:#83ccff !important}');
addGlobalStyle('.link-hover-override:hover .link-hover-target{color:#7ccbff}');
addGlobalStyle('html.dark .other-replies-link, html.dark .other-replies-link:hover {color:#7ccbff !important;}');
addGlobalStyle('html.dark .link-complex:active .link-complex-target, html.dark .link-complex:focus .link-complex-target,'
               +'html.dark .link-complex:hover .link-complex-target'
                    +'{color:#7ccbff !important;}');
//button colour style?
addGlobalStyle('html.dark .Button.btn-fav.s-favorited, html.dark .Button.btn-fav.s-favorited:visited, html.dark .Button.Button--primary,'
               +'html.dark .Button.Button--primary:visited, html.dark .ButtonGroup--primary > .Button, html.dark .ButtonGroup--primary > .Button:visited,'
               +'html.dark .ButtonGroup--primary > .ButtonGroup > .Button, html.dark .ButtonGroup--primary > .ButtonGroup > .Button:visited,'
               +'html.dark .ButtonGroup--primary > .ButtonGroup > button, html.dark .ButtonGroup--primary > .ButtonGroup > button:visited,'
               +'html.dark .ButtonGroup--primary > .ButtonGroup > input:visited[type="button"], html.dark .ButtonGroup--primary > .ButtonGroup > input[type="button"],'
               +'html.dark .ButtonGroup--primary > button, html.dark .ButtonGroup--primary > button:visited,'
               +'html.dark .ButtonGroup--primary > input:visited[type="button"], html.dark .ButtonGroup--primary > input[type="button"],'
               +'html.dark .s-following .follow-btn:hover .Button.following-text, html.dark .s-following .follow-btn:hover .Button.following-text:visited,'
               +'html.dark .s-following .follow-btn:hover button.following-text, html.dark .s-following .follow-btn:hover button.following-text:visited,'
               +'html.dark .s-following .follow-btn:hover input.following-text:visited[type="button"],'
               +'html.dark .s-following .follow-btn:hover input.following-text[type="button"], html.dark button.btn-fav.s-favorited,'
               +'html.dark button.btn-fav.s-favorited:visited, html.dark button.Button--primary,'
               +'html.dark button.Button--primary:visited, html.dark input.btn-fav.s-favorited:visited[type="button"],'
               +'html.dark input.btn-fav.s-favorited[type="button"], html.dark input.Button--primary:visited[type="button"],'
               +'html.dark input.Button--primary[type="button"]{background-color:#51aeee; border:1px solid #51aeee}');
addGlobalStyle('.bg-color-twitter-deep-blue {background-color:#51aeee !important;}');
//button hover?
addGlobalStyle('.Button.btn-fav.s-favorited:hover,.Button.Button--primary.is-hover,.Button.Button--primary:hover,.Button.is-hover.btn-fav.s-favorited,'
               +'.ButtonGroup--primary>.Button.is-hover,.ButtonGroup--primary>.Button:hover,.ButtonGroup--primary>.ButtonGroup>.Button.is-hover,'
               +'.ButtonGroup--primary>.ButtonGroup>.Button:hover,.ButtonGroup--primary>.ButtonGroup>button.is-hover,'
               +'.ButtonGroup--primary>.ButtonGroup>button:hover,.ButtonGroup--primary>.ButtonGroup>input.is-hover[type=button],'
               +'.ButtonGroup--primary>.ButtonGroup>input:hover[type=button],.ButtonGroup--primary>button.is-hover,.ButtonGroup--primary>button:hover,'
               +'.ButtonGroup--primary>input.is-hover[type=button],.ButtonGroup--primary>input:hover[type=button],'
               +'.s-following .follow-btn:hover .Button.following-text:hover,.s-following .follow-btn:hover .Button.is-hover.following-text,'
               +'.s-following .follow-btn:hover button.following-text:hover,.s-following .follow-btn:hover button.is-hover.following-text,'
               +'.s-following .follow-btn:hover input.following-text:hover[type=button],'
               +'.s-following .follow-btn:hover input.is-hover.following-text[type=button],button.btn-fav.s-favorited:hover,'
               +'button.Button--primary.is-hover,button.Button--primary:hover,button.is-hover.btn-fav.s-favorited,'
               +'input.btn-fav.s-favorited:hover[type=button],input.Button--primary.is-hover[type=button],input.Button--primary:hover[type=button],'
               +'input.is-hover.btn-fav.s-favorited[type=button]'
                    +'{background-color:#408bbe !important;border-color:#408bbe !important}'

               // buttons without a filled in background
               +'.js-back.btn.btn-on-dark.btn-back, .js-action-profile.action-text.thats-you-text.btn-on-dark {color: #51aeee !important}'
               +'.js-back.btn.btn-on-dark.btn-back, .js-action-profile.action-text.thats-you-text.btn-on-dark {border: 1px solid #51aeee !important}'
               +'.js-back.btn.btn-on-dark.btn-back:hover'
                    +'{background-color:#3b4146 !important;}');
addGlobalStyle('.Button.btn-fav.s-favorited:active,.Button.Button--primary.is-active,.Button.Button--primary:active,.Button.is-active.btn-fav.s-favorited,'
               +'.ButtonGroup--primary>.Button.is-active,.ButtonGroup--primary>.Button:active,.ButtonGroup--primary>.ButtonGroup>.Button.is-active,'
               +'.ButtonGroup--primary>.ButtonGroup>.Button:active,.ButtonGroup--primary>.ButtonGroup>button.is-active,.ButtonGroup--primary>.ButtonGroup>button:active,'
               +'.ButtonGroup--primary>.ButtonGroup>input.is-active[type=button],.ButtonGroup--primary>.ButtonGroup>input:active[type=button],'
               +'.ButtonGroup--primary>button.is-active,.ButtonGroup--primary>button:active,.ButtonGroup--primary>input.is-active[type=button],'
               +'.ButtonGroup--primary>input:active[type=button],.s-following .follow-btn:hover .Button.following-text:active,'
               +'.s-following .follow-btn:hover .Button.is-active.following-text,.s-following .follow-btn:hover button.following-text:active,'
               +'.s-following .follow-btn:hover button.is-active.following-text,.s-following .follow-btn:hover input.following-text:active[type=button],'
               +'.s-following .follow-btn:hover input.is-active.following-text[type=button],button.btn-fav.s-favorited:active,button.Button--primary.is-active,'
               +'button.Button--primary:active,button.is-active.btn-fav.s-favorited,input.btn-fav.s-favorited:active[type=button],'
               +'input.Button--primary.is-active[type=button],input.Button--primary:active[type=button],'
               +'input.is-active.btn-fav.s-favorited[type=button]'
                    +'{box-shadow:0 0 0 2px #fff,0 0 0 4px #408bbe;background-color:#408bbe !important;border-color:#408bbe !important}');
addGlobalStyle('.link-complex:hover {color:#7ccbff !important;}');
addGlobalStyle('.url-ext:hover {color:#7ccbff !important;}');
addGlobalStyle('.column-number {color:#f5f8fa !important;}');
addGlobalStyle('html.dark .stream-item {border-bottom: 1px solid #30383d !important;}');
addGlobalStyle('html.dark .Button.btn-fav.s-favorited[disabled], html.dark .Button.Button--primary.is-disabled, html.dark .Button.Button--primary[disabled],'
               +'html.dark .Button.is-disabled.btn-fav.s-favorited, html.dark .ButtonGroup--primary > .Button.is-disabled,'
               +'html.dark .ButtonGroup--primary > .Button[disabled], html.dark .ButtonGroup--primary > .ButtonGroup > .Button.is-disabled,'
               +'html.dark .ButtonGroup--primary > .ButtonGroup > .Button[disabled], html.dark .ButtonGroup--primary > .ButtonGroup > button.is-disabled,'
               +'html.dark .ButtonGroup--primary > .ButtonGroup > button.is-disabled:focus, html.dark .ButtonGroup--primary > .ButtonGroup > button[disabled],'
               +'html.dark .ButtonGroup--primary > .ButtonGroup > input.is-disabled[type="button"],'
               +'html.dark .ButtonGroup--primary > .ButtonGroup > input.is-disabled[type="button"]:focus,'
               +'html.dark .ButtonGroup--primary > .ButtonGroup > input[disabled][type="button"], html.dark .ButtonGroup--primary > button.is-disabled,'
               +'html.dark .ButtonGroup--primary > button.is-disabled:focus, html.dark .ButtonGroup--primary > button[disabled],'
               +'html.dark .ButtonGroup--primary > input.is-disabled[type="button"], html.dark .ButtonGroup--primary > input.is-disabled[type="button"]:focus,'
               +'html.dark .ButtonGroup--primary > input[disabled][type="button"], html.dark .follow-btn.is-disabled .ButtonGroup--primary > .ButtonGroup > button,'
               +'html.dark .follow-btn.is-disabled .ButtonGroup--primary > button,'
               +'html.dark .follow-btn.is-disabled .s-following .follow-btn:hover button.following-text, html.dark .follow-btn.is-disabled button.btn-fav.s-favorited,'
               +'html.dark .follow-btn.is-disabled button.Button--primary, html.dark .s-following .follow-btn:hover .Button.following-text[disabled],'
               +'html.dark .s-following .follow-btn:hover .Button.is-disabled.following-text,'
               +'html.dark .s-following .follow-btn:hover .follow-btn.is-disabled button.following-text,'
               +'html.dark .s-following .follow-btn:hover button.following-text[disabled],'
               +'html.dark .s-following .follow-btn:hover button.is-disabled.following-text,'
               +'html.dark .s-following .follow-btn:hover button.is-disabled.following-text:focus,'
               +'html.dark .s-following .follow-btn:hover fieldset[disabled] .Button.following-text,'
               +'html.dark .s-following .follow-btn:hover fieldset[disabled] button.following-text,'
               +'html.dark .s-following .follow-btn:hover fieldset[disabled] input.following-text[type="button"],'
               +'html.dark .s-following .follow-btn:hover input.following-text[disabled][type="button"],'
               +'html.dark .s-following .follow-btn:hover input.is-disabled.following-text[type="button"],'
               +'html.dark .s-following .follow-btn:hover input.is-disabled.following-text[type="button"]:focus,'
               +'html.dark button.btn-fav.s-favorited[disabled], html.dark button.Button--primary.is-disabled,'
               +'html.dark button.Button--primary.is-disabled:focus, html.dark button.Button--primary[disabled],'
               +'html.dark button.is-disabled.btn-fav.s-favorited, html.dark button.is-disabled.btn-fav.s-favorited:focus,'
               +'html.dark fieldset[disabled] .Button.btn-fav.s-favorited, html.dark fieldset[disabled] .Button.Button--primary,'
               +'html.dark fieldset[disabled] .ButtonGroup--primary > .Button, html.dark fieldset[disabled] .ButtonGroup--primary > .ButtonGroup > .Button,'
               +'html.dark fieldset[disabled] .ButtonGroup--primary > .ButtonGroup > button,'
               +'html.dark fieldset[disabled] .ButtonGroup--primary > .ButtonGroup > input[type="button"],'
               +'html.dark fieldset[disabled] .ButtonGroup--primary > button, html.dark fieldset[disabled] .ButtonGroup--primary > input[type="button"],'
               +'html.dark fieldset[disabled] .s-following .follow-btn:hover .Button.following-text,'
               +'html.dark fieldset[disabled] .s-following .follow-btn:hover button.following-text,'
               +'html.dark fieldset[disabled] .s-following .follow-btn:hover input.following-text[type="button"],'
               +'html.dark fieldset[disabled] button.btn-fav.s-favorited, html.dark fieldset[disabled] button.Button--primary,'
               +'html.dark fieldset[disabled] input.btn-fav.s-favorited[type="button"], html.dark fieldset[disabled] input.Button--primary[type="button"],'
               +'html.dark input.btn-fav.s-favorited[disabled][type="button"], html.dark input.Button--primary.is-disabled[type="button"],'
               +'html.dark input.Button--primary.is-disabled[type="button"]:focus, html.dark input.Button--primary[disabled][type="button"],'
               +'html.dark input.is-disabled.btn-fav.s-favorited[type="button"], html.dark input.is-disabled.btn-fav.s-favorited[type="button"]:focus'
                    +'{color:#FFF !important;}');
addGlobalStyle('html.dark .tweet-stats {border-top: 1px solid #30383d !important;}');
addGlobalStyle('html.dark .tweet-detail-actions {border-top: 1px solid #30383d !important;}');
addGlobalStyle('html.dark .thread {background-color:#444448 !important;}');
addGlobalStyle('.Token--blue.is-selected:hover,.Token.is-selected:hover {background-color:#ff0000;border-color:#ff0000 !important;}');
addGlobalStyle('html.dark .bg-color-twitter-deep-blue {background-color:#ff0000 !important;}');
addGlobalStyle('html.dark .Button.btn-fav.s-favorited:hover,html.dark .Button.Button--primary.is-hover,html.dark .Button.Button--primary:hover,'
               +'html.dark .Button.is-hover.btn-fav.s-favorited,html.dark .ButtonGroup--primary>.Button.is-hover,'
               +'html.dark .ButtonGroup--primary>.Button:hover,html.dark .ButtonGroup--primary>.ButtonGroup>.Button.is-hover,'
               +'html.dark .ButtonGroup--primary>.ButtonGroup>.Button:hover,html.dark .ButtonGroup--primary>.ButtonGroup>button.is-hover,'
               +'html.dark .ButtonGroup--primary>.ButtonGroup>button:hover,html.dark .ButtonGroup--primary>.ButtonGroup>input.is-hover[type=button],'
               +'html.dark .ButtonGroup--primary>.ButtonGroup>input:hover[type=button],html.dark .ButtonGroup--primary>button.is-hover,'
               +'html.dark .ButtonGroup--primary>button:hover,html.dark .ButtonGroup--primary>input.is-hover[type=button],'
               +'html.dark .ButtonGroup--primary>input:hover[type=button],html.dark .s-following .follow-btn:hover .Button.following-text:hover,'
               +'html.dark .s-following .follow-btn:hover .Button.is-hover.following-text,html.dark .s-following .follow-btn:hover button.following-text:hover,'
               +'html.dark .s-following .follow-btn:hover button.is-hover.following-text,'
               +'html.dark .s-following .follow-btn:hover input.following-text:hover[type=button],'
               +'html.dark .s-following .follow-btn:hover input.is-hover.following-text[type=button],'
               +'html.dark button.btn-fav.s-favorited:hover,html.dark button.Button--primary.is-hover,'
               +'html.dark button.Button--primary:hover,html.dark button.is-hover.btn-fav.s-favorited,'
               +'html.dark input.btn-fav.s-favorited:hover[type=button],html.dark input.Button--primary.is-hover[type=button],'
               +'html.dark input.Button--primary:hover[type=button],html.dark input.is-hover.btn-fav.s-favorited[type=button]'
                    +'{background-color:#4ba2dd;border-color:#4ba2dd !important;}');
addGlobalStyle('html.dark .icon.icon-arrow-l::before{color:#aab8c2 !important;}');
addGlobalStyle('html.dark .icon.icon-arrow-r::before{color:#aab8c2 !important;}');
addGlobalStyle('html.dark .fullname.link-complex-target {color:#FFF !important;}');
addGlobalStyle('html.dark .prf-stats li + li a{border-left: 1px solid #30363b !important;}');
addGlobalStyle('html.dark .prf .lst-profile a{border-right: 1px solid #30363b !important;}');
addGlobalStyle('html.dark .prf-stats a{color:#b6c3cc !important;}');
addGlobalStyle('html.dark .prf-stats a strong{color:#b6c3cc !important;}');
addGlobalStyle('.btn-on-dark:focus, html.dark input[type="button"].btn-on-dark:hover{color:#242426 !important;}');
addGlobalStyle('html.dark .prf-stats a:hover{color:#6f8089 !important;}');
addGlobalStyle('html.dark .prf-stats a:hover strong{color:#6f8089 !important;}');
addGlobalStyle('html.dark .prf .lst-profile a:hover{color:#6f8089 !important;}');
addGlobalStyle('html.dark .js-tooltip-target.link-complex-target {color:#e1e8ed !important;}');
addGlobalStyle('html.dark .btn-on-blue:focus {background-color:#7c8f9b !important;}');
addGlobalStyle('html.dark .btn-on-blue:hover {background-color:#85a6bc !important;}');
addGlobalStyle('html.dark .btn-on-blue {background-color: #66757f !important;}');
addGlobalStyle('html.dark .icon.icon-retweet-filled.icon-small-context.icon-retweet-color.txt-size--16::before'
                    +'{color:#00cb86 !important;}');
addGlobalStyle('html.dark js-send-button.js-spinner-button.js-show-tip.Button--primary.btn-extra-height.padding-v--6.padding-h--12.is-disabled'
                    +'{color:#51aeee; border-color:#51aeee !important;}');
addGlobalStyle('html.dark .Button.btn-fav.s-favorited[disabled], html.dark .Button.Button--primary.is-disabled,'
               +'html.dark .Button.Button--primary[disabled], html.dark .Button.is-disabled.btn-fav.s-favorited,'
               +'html.dark .ButtonGroup--primary > .Button.is-disabled, html.dark .ButtonGroup--primary > .Button[disabled],'
               +'html.dark .ButtonGroup--primary > .ButtonGroup > .Button.is-disabled, html.dark .ButtonGroup--primary > .ButtonGroup > .Button[disabled],'
               +'html.dark .ButtonGroup--primary > .ButtonGroup > button.is-disabled,'
               +'html.dark .ButtonGroup--primary > .ButtonGroup > button.is-disabled:focus,'
               +'html.dark .ButtonGroup--primary > .ButtonGroup > button[disabled],'
               +'html.dark .ButtonGroup--primary > .ButtonGroup > input.is-disabled[type="button"],'
               +'html.dark .ButtonGroup--primary > .ButtonGroup > input.is-disabled[type="button"]:focus,'
               +'html.dark .ButtonGroup--primary > .ButtonGroup > input[disabled][type="button"],'
               +'html.dark .ButtonGroup--primary > button.is-disabled, html.dark .ButtonGroup--primary > button.is-disabled:focus,'
               +'html.dark .ButtonGroup--primary > button[disabled], html.dark .ButtonGroup--primary > input.is-disabled[type="button"],'
               +'html.dark .ButtonGroup--primary > input.is-disabled[type="button"]:focus,'
               +'html.dark .ButtonGroup--primary > input[disabled][type="button"],'
               +'html.dark .follow-btn.is-disabled .ButtonGroup--primary > .ButtonGroup > button,'
               +'html.dark .follow-btn.is-disabled .ButtonGroup--primary > button,'
               +'html.dark .follow-btn.is-disabled .s-following .follow-btn:hover button.following-text,'
               +'html.dark .follow-btn.is-disabled button.btn-fav.s-favorited, html.dark .follow-btn.is-disabled button.Button--primary,'
               +'html.dark .s-following .follow-btn:hover .Button.following-text[disabled],'
               +'html.dark .s-following .follow-btn:hover .Button.is-disabled.following-text,'
               +'html.dark .s-following .follow-btn:hover .follow-btn.is-disabled button.following-text,'
               +'html.dark .s-following .follow-btn:hover button.following-text[disabled],'
               +'html.dark .s-following .follow-btn:hover button.is-disabled.following-text,'
               +'html.dark .s-following .follow-btn:hover button.is-disabled.following-text:focus,'
               +'html.dark .s-following .follow-btn:hover fieldset[disabled] .Button.following-text,'
               +'html.dark .s-following .follow-btn:hover fieldset[disabled] button.following-text,'
               +'html.dark .s-following .follow-btn:hover fieldset[disabled] input.following-text[type="button"],'
               +'html.dark .s-following .follow-btn:hover input.following-text[disabled][type="button"],'
               +'html.dark .s-following .follow-btn:hover input.is-disabled.following-text[type="button"],'
               +'html.dark .s-following .follow-btn:hover input.is-disabled.following-text[type="button"]:focus,'
               +'html.dark button.btn-fav.s-favorited[disabled], html.dark button.Button--primary.is-disabled,'
               +'html.dark button.Button--primary.is-disabled:focus, html.dark button.Button--primary[disabled],'
               +'html.dark button.is-disabled.btn-fav.s-favorited, html.dark button.is-disabled.btn-fav.s-favorited:focus,'
               +'html.dark fieldset[disabled] .Button.btn-fav.s-favorited, html.dark fieldset[disabled] .Button.Button--primary,'
               +'html.dark fieldset[disabled] .ButtonGroup--primary > .Button, html.dark fieldset[disabled] .ButtonGroup--primary > .ButtonGroup > .Button,'
               +'html.dark fieldset[disabled] .ButtonGroup--primary > .ButtonGroup > button,'
               +'html.dark fieldset[disabled] .ButtonGroup--primary > .ButtonGroup > input[type="button"],'
               +'html.dark fieldset[disabled] .ButtonGroup--primary > button, html.dark fieldset[disabled] .ButtonGroup--primary > input[type="button"],'
               +'html.dark fieldset[disabled] .s-following .follow-btn:hover .Button.following-text,'
               +'html.dark fieldset[disabled] .s-following .follow-btn:hover button.following-text,'
               +'html.dark fieldset[disabled] .s-following .follow-btn:hover input.following-text[type="button"],'
               +'html.dark fieldset[disabled] button.btn-fav.s-favorited, html.dark fieldset[disabled] button.Button--primary,'
               +'html.dark fieldset[disabled] input.btn-fav.s-favorited[type="button"], html.dark fieldset[disabled] input.Button--primary[type="button"],'
               +'html.dark input.btn-fav.s-favorited[disabled][type="button"], html.dark input.Button--primary.is-disabled[type="button"],'
               +'html.dark input.Button--primary.is-disabled[type="button"]:focus, html.dark input.Button--primary[disabled][type="button"],'
               +'html.dark input.is-disabled.btn-fav.s-favorited[type="button"],'
               +'html.dark input.is-disabled.btn-fav.s-favorited[type="button"]:focus'
                    +'{background-color:#51aeee;border-color:#51aeee !important;}');
addGlobalStyle('html.dark action-text follow-text btn-on-dark{color:#51aeee;border-color:#51aeee !important;}');
addGlobalStyle('html.dark .action-text.follow-text.btn-on-dark:hover {background:#2c2f33 !important;}');
addGlobalStyle('html.dark .js-user-actions-menu.btn.btn-round.btn-on-dark:hover {background:#2c2f33 !important;}');
addGlobalStyle('html.dark .js-user-actions-menu.btn.btn-round.btn-on-dark{color:#51aeee; border-color:#51aeee !important;}');
addGlobalStyle('html.dark .action-text.follow-text.btn-on-dark{border-color:#51aeee; color:#51aeee !important;}');
addGlobalStyle('html.dark .is-retweet .icon-retweet-toggle{color:#00cb86 !important;}');
addGlobalStyle('html.dark .pull-right .icon-retweet-toggle .margin-l--3 .margin-t--1 .txt-size--12 .js-retweet-count .retweet-count'
                    +'{color:#00cb86 !important;}');
addGlobalStyle('html.dark .icon-retweet-toggle:focus{color:#00cb86 !important;}');
addGlobalStyle('html.dark a.js-media-gallery-prev.link-no-focus.mdl-btn-media.mdl-media-prev{background:none !important;}');
addGlobalStyle('html.dark a.js-media-gallery-next.link-no-focus.mdl-btn-media.mdl-media-next{background:none !important;}');
//edit profile button when you click on your own username
addGlobalStyle('html.dark .js-action-profile .action-text .thats-you-text .btn-on-dark{color:#51aeee;border-color:#51aeee !important;}');
addGlobalStyle('html.dark .js-action-profile.action-text.thats-you-text.btn-on-dark:hover{background-color:#2c2f33 !important;}');
//bit at the bottom  of the composing menu with a checkbox that says keep open
addGlobalStyle('html.dark .old-composer-footer {background-color: #485865 !important;}');
//followed by [mutuals] part on the screen when you click a username
addGlobalStyle('html.dark .social-proof-container {background-color: #292f33 !important;}');
//scrollbar colour
addGlobalStyle('html.dark .scroll-styled-h, html.dark .scroll-styled-v {scrollbar-color: #30383d transparent !important;');
//loading bars
addGlobalStyle('html.dark .med-embeditem {background: transparent url(https://i.imgur.com/ZRBhNiF.gif) no-repeat 50% 50%;}');
addGlobalStyle('html.dark .spinner-small,html.dark .spinner-large{filter:grayscale(85%)brightness(117%)}');
//when likes are turned back to favs with bettertweetdeck, uncomment to turn the text yellow instead of red
/* addGlobalStyle('html.dark .dm-action:active .icon-favorite, html.dark .dm-action:active .like-count, html.dark .dm-action:focus .icon-favorite,'
               +'html.dark .dm-action:focus .like-count, html.dark .dm-action:hover .icon-favorite, html.dark .dm-action:hover .like-count,'
               +'html.dark .is-selected.dm-action .icon-favorite, html.dark .is-selected.dm-action .like-count,'
               +'html.dark .is-selected.tweet-detail-action .icon-favorite, html.dark .is-selected.tweet-detail-action .like-count,'
               +'html.dark .tweet-action.is-selected .icon-favorite, html.dark .tweet-action.is-selected .like-count,'
               +'html.dark .tweet-action:active .icon-favorite, html.dark .tweet-action:active .like-count,'
               +'html.dark .tweet-action:focus .icon-favorite, html.dark .tweet-action:focus .like-count, html.dark .tweet-action:hover .icon-favorite,'
               +'html.dark .tweet-action:hover .like-count, html.dark .tweet-detail-action:active .icon-favorite,'
               +'html.dark .tweet-detail-action:active .like-count, html.dark .tweet-detail-action:focus .icon-favorite,'
               +'html.dark .tweet-detail-action:focus .like-count, html.dark .tweet-detail-action:hover .icon-favorite,'
               +'html.dark .tweet-detail-action:hover .like-count'
                    +'{color: #fab41e !important;}'); */
//click on the three dots for the dropdown
addGlobalStyle('.js-dropdown-content {background-color:#222426; color:#fff;}'
               +'html.dark .dropdown-menu {background-color:#222426;}'
               +'html.dark .dropdown-menu a {color:#8899a6 !important;}'
               +'html.dark .dropdown-menu a:hover, html.dark .dropdown-menu a:focus {color:#FFFFFF !important;}'
               +'html.dark .dropdown-menu .is-selected'
                    +'{background: #4ba2dd !important}'
               +'html.btd-on .btd-settings-btn .icon {color:#8899A6 !important;}'
               +'html.btd-on .btd-settings-btn .icon:hover {color:#b7c1c9 !important;}'
               +'html.btd-on [data-btdtheme="dark"].btd__minimal_mode .dropdown-menu, html.btd-on [data-btdtheme="dark"].btd__minimal_mode .typeahead{background-color:#222426}'
               +'html.dark .caret-inner {border-bottom: 6px solid #222426 !important;}'
               +'html.dark .caret-outer {border-bottom: 7px solid rgba(17,17,17, 0.58) !important;}');
//when clicking on username its the following/tweets/favs/lists whatever hover colour
addGlobalStyle('html.dark .prf-stats a:hover, html.dark .prf-stats a:hover strong, html.dark .prf .lst-profile a:hover i,'
               +'html.dark .prf .lst-profile a:hover span'
                    +'{color:#cde3f1 !important}');
// the little reply icon hover colour & three dots hover colour
addGlobalStyle('html.dark .dm-action:active .icon-reply, html.dark .dm-action:active .reply-count,'
               +'html.dark .dm-action:focus .icon-reply, html.dark .dm-action:focus .reply-count, html.dark .dm-action:hover .icon-reply,'
               +'html.dark .dm-action:hover .reply-count, html.dark .is-selected.dm-action .icon-reply, html.dark .is-selected.dm-action .reply-count,'
               +'html.dark .is-selected.tweet-detail-action .icon-reply, html.dark .is-selected.tweet-detail-action .reply-count,'
               +'html.dark .tweet-action.is-selected .icon-reply, html.dark .tweet-action.is-selected .reply-count, html.dark .tweet-action:active .icon-reply,'
               +'html.dark .tweet-action:active .reply-count, html.dark .tweet-action:focus .icon-reply, html.dark .tweet-action:focus .reply-count,'
               +'html.dark .tweet-action:hover .icon-reply, html.dark .tweet-action:hover .reply-count, html.dark .tweet-detail-action:active .icon-reply,'
               +'html.dark .tweet-detail-action:active .reply-count, html.dark .tweet-detail-action:focus .icon-reply,'
               +'html.dark .tweet-detail-action:focus .reply-count, html.dark .tweet-detail-action:hover .icon-reply,'
               +'html.dark .tweet-detail-action:hover .reply-count'
                    +'{color: #51aeee !important}');
//inline reply
addGlobalStyle('html.dark .inline-reply{background-color:#30383d !important;}'
               +'html.dark .reply-triangle{border-bottom-color:#30383d !important;}');
// Delayed function to apply to page if it decides it didn't want to do my changes the first time around
$(function(){
    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) { return; }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    //don't mind the horrible formatting
    addGlobalStyle('html.dark .color-twitter-blue {color:#7ccbff !important;}'
                   +'html.dark .attach-compose-buttons .tweet-button {background-color:#485865 !important;}'
                   +'html.dark .bg-color-twitter-midnight-dark-gray {background-color:#222426 !important;}'
                   +'html.dark .accounts-drawer {background:#222426 !important;}'
                   +'html.dark .account-remove-check {background:#222426 !important;}'
                   +'html.dark .column {background-color:#222426 !important;}'
                   +'html.dark .column-panel {background:#222426 !important;}'
                   +'html.dark .column-nav:after {background-color:#222426;border-color:#14171a !important;}'
                   +'html.dark .column-background-fill {background-color:#222426 !important;}'
                   +'html.dark .location-form .typeahead-dropdown {background:#222426 !important;}'
                   +'html.dark .column-type-scheduled {background-color:#222426 !important;}'
                   +'html.dark .column-header, html.dark .column-header-temp {background-color:#292f33 !important;}'
                   +'html.dark .column-message {background-color:#222426 !important;}'
                   +'html.dark .edit-conversation-name {background-color:#222426 !important;}'
                   +'html.dark .column-options {background-color:#292f33 !important;}'
                   +'html.dark .column-options .button-tray {background-color:#292f33 !important;}'
                   +'html.dark .stream-item {background-color:#222426 !important;}'
                   +'html.dark .tweet-detail-wrapper {background:#222426 !important;}'
                   +'html.dark .conversation-event {background-color:#222426 !important;}'
                   +'html.dark .add-participant {background-color:#222426 !important;}'
                   +'html.dark .accordion-divider-t {border-top:1px solid #222426 !important;}'
                   +'html.dark .facet-type {position:relative;border-bottom:1px solid #222426} !important;}'
                   +'html.dark .facet-type-thumb-size {border-top:1px solid #222426 !important;}'
                   +'html.dark .facet-type.is-active {background-color:#222426 !important;}'
                   +'html.dark .numbered-badge-onheader{border:2px solid #222426 !important;}'
                   +'html.dark .dataminr{background-color:#222426 !important;}'
                   +'html.dark .mdl{background-color:#222426 !important;}'
                   +'html.dark .detail-view-inline{background-color:#222426 !important;}'
                   +'html.dark .embed-modal .mdl-content{height:auto;border:none;background:#222426 !important;}'
                   +'html.dark .keyboard-shortcut-list-modal .mdl-content{background:#222426 !important;}'
                   +'html.dark .prf-meta{background:#222426 !important;}'
                   +'html.dark .scroll-conversation{background:#181a1c !important;}'
                   +'html.dark .dark-border{border:1px solid #444448 !important;}'
                   +'html.dark .bg-color-twitter-midnight-darkest-gray {background-color:#181a1c !important;}');
    addGlobalStyle('html.dark .btn-on-dark:focus,html.dark input[type=button].btn-on-dark:hover'
                   +'{background-color:#444448 !important;}');
    addGlobalStyle('html.dark button.btn-on-dark:focus, html.dark input[type=button].btn-on-dark:focus'
                   +'{box-shadow:0 0 0 2px #444448 !important;}');
    addGlobalStyle('html.dark .column-nav .nav-item button:hover {background-color:#444448 !important;}');
    addGlobalStyle('html.dark .column-title-edit-box {background-color:#444448 !important;}');
    addGlobalStyle('html.dark .edit-conversation-name input {background-color:#181a1c !important;}');
    addGlobalStyle('html.dark .gap-chirp {background-color:#444448 !important;}');
    addGlobalStyle('html.dark .media-badge {border:1px solid #444448 !important;}');
    addGlobalStyle('html.dark .app-columns-container,html.dark .app-content {background-color:#181a1c !important;}');
    addGlobalStyle('html.dark .app-nav-tab.is-selected {background:#444448 !important;}');
    addGlobalStyle('html.dark .app-search-fake,html.dark .app-search-input {background-color:#3a3d42 !important;}');
    addGlobalStyle('html.dark .app-search-fake {color:#777777;border:1px solid #3a3d42 !important;}');
    addGlobalStyle('html.dark .dataminr-separator {border-bottom:2px solid #444448 !important;}');
    addGlobalStyle('html.dark .dataminr-external-link {background-color:#444448 !important;}');
    addGlobalStyle('html.dark .search-tip-item-hover:hover {background:#444448 !important;}');
    addGlobalStyle('html.dark .InputGroup input {background-color:#444448 !important;}');
    addGlobalStyle('html.dark .InputGroup button {border:none;background-color:#444448 !important;}');
    addGlobalStyle('html.dark .InputGroup button:hover {background-color:#444448 !important;}');
    addGlobalStyle('html.dark .mdl-accent {background:#222426 !important;}');
    addGlobalStyle('html.dark .detail-view-inline-text {background-color:#222426 !important;}');
    addGlobalStyle('html.dark .text-like-keyboard-key {background-color:#e1e8ed;color:#10171e !important;}');
    addGlobalStyle('html.dark .list-account:hover,html.dark .list-link:hover,html.dark .list-listaccount:hover,html.dark .list-listmember:hover,'
                   +'html.dark .list-subtitle:hover,html.dark .list-twitter-list:hover'
                   +'{background:#222426 !important;}');
    addGlobalStyle('html.dark .list-account:hover:active,html.dark .list-account:hover:focus,html.dark .list-account:hover:hover,'
                   +'html.dark .list-link:hover:active,html.dark .list-link:hover:focus,html.dark .list-link:hover:hover,'
                   +'html.dark .list-listaccount:hover:active,html.dark .list-listaccount:hover:focus,html.dark .list-listaccount:hover:hover,'
                   +'html.dark .list-listmember:hover:active,html.dark .list-listmember:hover:focus,html.dark .list-listmember:hover:hover,'
                   +'html.dark .list-subtitle:hover:active,html.dark .list-subtitle:hover:focus,html.dark .list-subtitle:hover:hover,'
                   +'html.dark .list-twitter-list:hover:active,html.dark .list-twitter-list:hover:focus,html.dark .list-twitter-list:hover:hover'
                   +'{background:#222426 !important;}');
    addGlobalStyle('html.dark input,html.dark select,html.dark textarea {display:inline-block; font-size:13px; line-height:18px; background:#222426 !important;}');
    addGlobalStyle('html.dark input:disabled {background-color:#222426 !important;}');
    addGlobalStyle('html.dark select:disabled {background-color:#222426 !important;}');
    addGlobalStyle('html.dark .popover {background-color:#292f33;box-shadow:0 0 10px #1e2326 !important;}');
    addGlobalStyle('html.dark .column-header-link {color:#8299a6}');
    addGlobalStyle('html.dark .compose {background-color:#485865 !important;}');
    addGlobalStyle('html.dark .app-header {background-color:#292f33 !important;}');
    addGlobalStyle('html.dark .column-navigator {background-color:#292f33 !important;}');
    addGlobalStyle('html.dark .js-int-scroller {background-color:#292f33 !important;}');
    addGlobalStyle('html.dark .popover {background-color:#292f33 !important;}');
    addGlobalStyle('html.dark .mdl-column-med{background:#292f33 !important;}');
    addGlobalStyle('html.dark .mdl-lighter-on-dark{background-color:#292f33 !important;}');
    addGlobalStyle('html.dark .is-dataminr-tweet{background-color:#292f33 !important;}');
    addGlobalStyle('html.dark .numbered-badge-onnav{border:2px solid #292f33 !important;}');
    addGlobalStyle('html.dark .join-team{background:#292f33 !important;}');
    addGlobalStyle('html.dark .app-navigator{background-color:#292f33 !important;}');
    addGlobalStyle('html.dark .app-nav-link{font-size:18px;color:#8899A6 !important;}');
    addGlobalStyle('html.dark .app-nav-link:hover{font-size:18px;color:#b7c1c9 !important;}');
    addGlobalStyle('html.dark .app-title{background-color:#292f33 !important;}');
    addGlobalStyle('html.dark .app-header{background-color:#292f33 !important;}');
    addGlobalStyle('html.dark .social-proof-for-tweet-title{background-color:#292f33 !important;}');
    addGlobalStyle('html.dark .column-detail .is-selected-tweet{background:#292f33 !important;}');
    addGlobalStyle('html.dark .is-selected-tweet{background:#292f33 !important;}');
    addGlobalStyle('html.dark .search-results-container .stream-item{background-color:#292f33 !important;}');
    addGlobalStyle('html.dark .contributor-row[data-state=confirmRemove-removing]{background-color:#292f33 !important;}');
    addGlobalStyle('html.dark .contributor-row[data-state=confirmRemove-removing],html.dark .contributor-row[data-state=confirmRemove]'
                   +'{background-color:#292f33 !important;}');
    addGlobalStyle('html.dark .contributor-row[data-state=confirmAdd-added] [data-hide-when-state~=confirmAdd-added] {display:none}'
                   +'html.dark .contributor-row[data-state=confirmDeadmin] {background-color:#292f33 !important;}');
    addGlobalStyle('html.dark .contributor-row[data-state=confirmAdd-added] {background-color:#292f33 !important;}');
    addGlobalStyle('html.dark .contributor-row[data-state=confirmAdd] {background-color:#292f33} !important;}');
    addGlobalStyle('html.dark .contributor-row[data-state=settings] {background-color:#292f33 !important;}');
    addGlobalStyle('html.dark .column-nav {background-color:#292f33 !important;}');
    addGlobalStyle('html.dark .manage-team-summary {background:#292f33 !important;}');
    addGlobalStyle('html.dark .account-settings-row {background:#292f33 !important;}');
    addGlobalStyle('html.dark .is-loading {background-color:#292f33 !important;}');
    //addGlobalStyle('html.dark body:before {background-image:radial-gradient(circle,#82bbdd,#292f33 !important;}');
    addGlobalStyle('.column-nav-item {color:#f5f8fa;background-color:#292f33 !important;}');
    addGlobalStyle('.numbered-badge-onnav {border:2px solid #292f33; !important;}');
    addGlobalStyle('.app-navigator {background-color:#292f33 !important;}');
    addGlobalStyle('.app-title {background-color:#292f33 !important;}');
    addGlobalStyle('.app-header {background-color:#292f33 !important;}');
    addGlobalStyle('html.dark .app-nav-tab {color:#8899A6 !important;}');
    addGlobalStyle('html.dark .app-nav-tab:hover {color:#b7c1c9 !important;}');
    addGlobalStyle('.overlay-opaque {background-color:#485865 !important;}');
    addGlobalStyle('html.dark .Button.btn-fav.s-favorited:focus, html.dark .Button.Button--primary.is-focus,'
                   +'html.dark .Button.Button--primary:focus, html.dark .Button.is-focus.btn-fav.s-favorited,'
                   +'html.dark .ButtonGroup--primary > .Button.is-focus, html.dark .ButtonGroup--primary > .Button:focus,'
                   +'html.dark .ButtonGroup--primary > .ButtonGroup > .Button.is-focus, html.dark .ButtonGroup--primary > .ButtonGroup > .Button:focus,'
                   +'html.dark .ButtonGroup--primary > .ButtonGroup > button.is-focus, html.dark .ButtonGroup--primary > .ButtonGroup > button:focus,'
                   +'html.dark .ButtonGroup--primary > .ButtonGroup > input.is-focus[type="button"],'
                   +'html.dark .ButtonGroup--primary > .ButtonGroup > input:focus[type="button"],'
                   +'html.dark .ButtonGroup--primary > button.is-focus, html.dark .ButtonGroup--primary > button:focus,'
                   +'html.dark .ButtonGroup--primary > input.is-focus[type="button"], html.dark .ButtonGroup--primary > input:focus[type="button"],'
                   +'html.dark .s-following .follow-btn:hover .Button.following-text:focus, html.dark .s-following .follow-btn:hover .Button.is-focus.following-text,'
                   +'html.dark .s-following .follow-btn:hover button.following-text:focus, html.dark .s-following .follow-btn:hover button.is-focus.following-text,'
                   +'html.dark .s-following .follow-btn:hover input.following-text:focus[type="button"],'
                   +'html.dark .s-following .follow-btn:hover input.is-focus.following-text[type="button"],'
                   +'html.dark button.btn-fav.s-favorited:focus, html.dark button.Button--primary.is-focus,'
                   +'html.dark button.Button--primary:focus, html.dark button.is-focus.btn-fav.s-favorited,'
                   +'html.dark input.btn-fav.s-favorited:focus[type="button"], html.dark input.Button--primary.is-focus[type="button"],'
                   +'html.dark input.Button--primary:focus[type="button"], html.dark input.is-focus.btn-fav.s-favorited[type="button"]'
                   +'{background:#51aeee;border:1px solid #51aeee}');
    addGlobalStyle('html.dark a {color:#7ccbff}');
    //addGlobalStyle('a:active,a:focus,a:hover {color:#83ccff !important}');
    addGlobalStyle('.link-hover-override:hover .link-hover-target{color:#7ccbff}');
    addGlobalStyle('html.dark .other-replies-link, html.dark .other-replies-link:hover {color:#7ccbff !important;}');
    addGlobalStyle('html.dark .link-complex:active .link-complex-target, html.dark .link-complex:focus .link-complex-target,'
                   +'html.dark .link-complex:hover .link-complex-target'
                   +'{color:#7ccbff !important;}');
    //button colour style?
    addGlobalStyle('html.dark .Button.btn-fav.s-favorited, html.dark .Button.btn-fav.s-favorited:visited, html.dark .Button.Button--primary,'
                   +'html.dark .Button.Button--primary:visited, html.dark .ButtonGroup--primary > .Button, html.dark .ButtonGroup--primary > .Button:visited,'
                   +'html.dark .ButtonGroup--primary > .ButtonGroup > .Button, html.dark .ButtonGroup--primary > .ButtonGroup > .Button:visited,'
                   +'html.dark .ButtonGroup--primary > .ButtonGroup > button, html.dark .ButtonGroup--primary > .ButtonGroup > button:visited,'
                   +'html.dark .ButtonGroup--primary > .ButtonGroup > input:visited[type="button"], html.dark .ButtonGroup--primary > .ButtonGroup > input[type="button"],'
                   +'html.dark .ButtonGroup--primary > button, html.dark .ButtonGroup--primary > button:visited,'
                   +'html.dark .ButtonGroup--primary > input:visited[type="button"], html.dark .ButtonGroup--primary > input[type="button"],'
                   +'html.dark .s-following .follow-btn:hover .Button.following-text, html.dark .s-following .follow-btn:hover .Button.following-text:visited,'
                   +'html.dark .s-following .follow-btn:hover button.following-text, html.dark .s-following .follow-btn:hover button.following-text:visited,'
                   +'html.dark .s-following .follow-btn:hover input.following-text:visited[type="button"],'
                   +'html.dark .s-following .follow-btn:hover input.following-text[type="button"], html.dark button.btn-fav.s-favorited,'
                   +'html.dark button.btn-fav.s-favorited:visited, html.dark button.Button--primary,'
                   +'html.dark button.Button--primary:visited, html.dark input.btn-fav.s-favorited:visited[type="button"],'
                   +'html.dark input.btn-fav.s-favorited[type="button"], html.dark input.Button--primary:visited[type="button"],'
                   +'html.dark input.Button--primary[type="button"]{background-color:#51aeee; border:1px solid #51aeee}');
    addGlobalStyle('.bg-color-twitter-deep-blue {background-color:#51aeee !important;}');
    //button hover?
    addGlobalStyle('.Button.btn-fav.s-favorited:hover,.Button.Button--primary.is-hover,.Button.Button--primary:hover,.Button.is-hover.btn-fav.s-favorited,'
                   +'.ButtonGroup--primary>.Button.is-hover,.ButtonGroup--primary>.Button:hover,.ButtonGroup--primary>.ButtonGroup>.Button.is-hover,'
                   +'.ButtonGroup--primary>.ButtonGroup>.Button:hover,.ButtonGroup--primary>.ButtonGroup>button.is-hover,'
                   +'.ButtonGroup--primary>.ButtonGroup>button:hover,.ButtonGroup--primary>.ButtonGroup>input.is-hover[type=button],'
                   +'.ButtonGroup--primary>.ButtonGroup>input:hover[type=button],.ButtonGroup--primary>button.is-hover,.ButtonGroup--primary>button:hover,'
                   +'.ButtonGroup--primary>input.is-hover[type=button],.ButtonGroup--primary>input:hover[type=button],'
                   +'.s-following .follow-btn:hover .Button.following-text:hover,.s-following .follow-btn:hover .Button.is-hover.following-text,'
                   +'.s-following .follow-btn:hover button.following-text:hover,.s-following .follow-btn:hover button.is-hover.following-text,'
                   +'.s-following .follow-btn:hover input.following-text:hover[type=button],'
                   +'.s-following .follow-btn:hover input.is-hover.following-text[type=button],button.btn-fav.s-favorited:hover,'
                   +'button.Button--primary.is-hover,button.Button--primary:hover,button.is-hover.btn-fav.s-favorited,'
                   +'input.btn-fav.s-favorited:hover[type=button],input.Button--primary.is-hover[type=button],input.Button--primary:hover[type=button],'
                   +'input.is-hover.btn-fav.s-favorited[type=button]'
                   +'{background-color:#408bbe !important;border-color:#408bbe !important}'

                   // buttons without a filled in background
                   +'.js-back.btn.btn-on-dark.btn-back, .js-action-profile.action-text.thats-you-text.btn-on-dark {color: #51aeee !important}'
                   +'.js-back.btn.btn-on-dark.btn-back, .js-action-profile.action-text.thats-you-text.btn-on-dark {border: 1px solid #51aeee !important}'
                   +'.js-back.btn.btn-on-dark.btn-back:hover'
                   +'{background-color:#3b4146 !important;}');
    addGlobalStyle('.Button.btn-fav.s-favorited:active,.Button.Button--primary.is-active,.Button.Button--primary:active,.Button.is-active.btn-fav.s-favorited,'
                   +'.ButtonGroup--primary>.Button.is-active,.ButtonGroup--primary>.Button:active,.ButtonGroup--primary>.ButtonGroup>.Button.is-active,'
                   +'.ButtonGroup--primary>.ButtonGroup>.Button:active,.ButtonGroup--primary>.ButtonGroup>button.is-active,.ButtonGroup--primary>.ButtonGroup>button:active,'
                   +'.ButtonGroup--primary>.ButtonGroup>input.is-active[type=button],.ButtonGroup--primary>.ButtonGroup>input:active[type=button],'
                   +'.ButtonGroup--primary>button.is-active,.ButtonGroup--primary>button:active,.ButtonGroup--primary>input.is-active[type=button],'
                   +'.ButtonGroup--primary>input:active[type=button],.s-following .follow-btn:hover .Button.following-text:active,'
                   +'.s-following .follow-btn:hover .Button.is-active.following-text,.s-following .follow-btn:hover button.following-text:active,'
                   +'.s-following .follow-btn:hover button.is-active.following-text,.s-following .follow-btn:hover input.following-text:active[type=button],'
                   +'.s-following .follow-btn:hover input.is-active.following-text[type=button],button.btn-fav.s-favorited:active,button.Button--primary.is-active,'
                   +'button.Button--primary:active,button.is-active.btn-fav.s-favorited,input.btn-fav.s-favorited:active[type=button],'
                   +'input.Button--primary.is-active[type=button],input.Button--primary:active[type=button],'
                   +'input.is-active.btn-fav.s-favorited[type=button]'
                   +'{box-shadow:0 0 0 2px #fff,0 0 0 4px #408bbe;background-color:#408bbe !important;border-color:#408bbe !important}');
    addGlobalStyle('.link-complex:hover {color:#7ccbff !important;}');
    addGlobalStyle('.url-ext:hover {color:#7ccbff !important;}');
    addGlobalStyle('.column-number {color:#f5f8fa !important;}');
    addGlobalStyle('html.dark .stream-item {border-bottom: 1px solid #30383d !important;}');
    addGlobalStyle('html.dark .Button.btn-fav.s-favorited[disabled], html.dark .Button.Button--primary.is-disabled, html.dark .Button.Button--primary[disabled],'
                   +'html.dark .Button.is-disabled.btn-fav.s-favorited, html.dark .ButtonGroup--primary > .Button.is-disabled,'
                   +'html.dark .ButtonGroup--primary > .Button[disabled], html.dark .ButtonGroup--primary > .ButtonGroup > .Button.is-disabled,'
                   +'html.dark .ButtonGroup--primary > .ButtonGroup > .Button[disabled], html.dark .ButtonGroup--primary > .ButtonGroup > button.is-disabled,'
                   +'html.dark .ButtonGroup--primary > .ButtonGroup > button.is-disabled:focus, html.dark .ButtonGroup--primary > .ButtonGroup > button[disabled],'
                   +'html.dark .ButtonGroup--primary > .ButtonGroup > input.is-disabled[type="button"],'
                   +'html.dark .ButtonGroup--primary > .ButtonGroup > input.is-disabled[type="button"]:focus,'
                   +'html.dark .ButtonGroup--primary > .ButtonGroup > input[disabled][type="button"], html.dark .ButtonGroup--primary > button.is-disabled,'
                   +'html.dark .ButtonGroup--primary > button.is-disabled:focus, html.dark .ButtonGroup--primary > button[disabled],'
                   +'html.dark .ButtonGroup--primary > input.is-disabled[type="button"], html.dark .ButtonGroup--primary > input.is-disabled[type="button"]:focus,'
                   +'html.dark .ButtonGroup--primary > input[disabled][type="button"], html.dark .follow-btn.is-disabled .ButtonGroup--primary > .ButtonGroup > button,'
                   +'html.dark .follow-btn.is-disabled .ButtonGroup--primary > button,'
                   +'html.dark .follow-btn.is-disabled .s-following .follow-btn:hover button.following-text, html.dark .follow-btn.is-disabled button.btn-fav.s-favorited,'
                   +'html.dark .follow-btn.is-disabled button.Button--primary, html.dark .s-following .follow-btn:hover .Button.following-text[disabled],'
                   +'html.dark .s-following .follow-btn:hover .Button.is-disabled.following-text,'
                   +'html.dark .s-following .follow-btn:hover .follow-btn.is-disabled button.following-text,'
                   +'html.dark .s-following .follow-btn:hover button.following-text[disabled],'
                   +'html.dark .s-following .follow-btn:hover button.is-disabled.following-text,'
                   +'html.dark .s-following .follow-btn:hover button.is-disabled.following-text:focus,'
                   +'html.dark .s-following .follow-btn:hover fieldset[disabled] .Button.following-text,'
                   +'html.dark .s-following .follow-btn:hover fieldset[disabled] button.following-text,'
                   +'html.dark .s-following .follow-btn:hover fieldset[disabled] input.following-text[type="button"],'
                   +'html.dark .s-following .follow-btn:hover input.following-text[disabled][type="button"],'
                   +'html.dark .s-following .follow-btn:hover input.is-disabled.following-text[type="button"],'
                   +'html.dark .s-following .follow-btn:hover input.is-disabled.following-text[type="button"]:focus,'
                   +'html.dark button.btn-fav.s-favorited[disabled], html.dark button.Button--primary.is-disabled,'
                   +'html.dark button.Button--primary.is-disabled:focus, html.dark button.Button--primary[disabled],'
                   +'html.dark button.is-disabled.btn-fav.s-favorited, html.dark button.is-disabled.btn-fav.s-favorited:focus,'
                   +'html.dark fieldset[disabled] .Button.btn-fav.s-favorited, html.dark fieldset[disabled] .Button.Button--primary,'
                   +'html.dark fieldset[disabled] .ButtonGroup--primary > .Button, html.dark fieldset[disabled] .ButtonGroup--primary > .ButtonGroup > .Button,'
                   +'html.dark fieldset[disabled] .ButtonGroup--primary > .ButtonGroup > button,'
                   +'html.dark fieldset[disabled] .ButtonGroup--primary > .ButtonGroup > input[type="button"],'
                   +'html.dark fieldset[disabled] .ButtonGroup--primary > button, html.dark fieldset[disabled] .ButtonGroup--primary > input[type="button"],'
                   +'html.dark fieldset[disabled] .s-following .follow-btn:hover .Button.following-text,'
                   +'html.dark fieldset[disabled] .s-following .follow-btn:hover button.following-text,'
                   +'html.dark fieldset[disabled] .s-following .follow-btn:hover input.following-text[type="button"],'
                   +'html.dark fieldset[disabled] button.btn-fav.s-favorited, html.dark fieldset[disabled] button.Button--primary,'
                   +'html.dark fieldset[disabled] input.btn-fav.s-favorited[type="button"], html.dark fieldset[disabled] input.Button--primary[type="button"],'
                   +'html.dark input.btn-fav.s-favorited[disabled][type="button"], html.dark input.Button--primary.is-disabled[type="button"],'
                   +'html.dark input.Button--primary.is-disabled[type="button"]:focus, html.dark input.Button--primary[disabled][type="button"],'
                   +'html.dark input.is-disabled.btn-fav.s-favorited[type="button"], html.dark input.is-disabled.btn-fav.s-favorited[type="button"]:focus'
                   +'{color:#FFF !important;}');
    addGlobalStyle('html.dark .tweet-stats {border-top: 1px solid #30383d !important;}');
    addGlobalStyle('html.dark .tweet-detail-actions {border-top: 1px solid #30383d !important;}');
    addGlobalStyle('html.dark .thread {background-color:#444448 !important;}');
    addGlobalStyle('.Token--blue.is-selected:hover,.Token.is-selected:hover {background-color:#ff0000;border-color:#ff0000 !important;}');
    addGlobalStyle('html.dark .bg-color-twitter-deep-blue {background-color:#ff0000 !important;}');
    addGlobalStyle('html.dark .Button.btn-fav.s-favorited:hover,html.dark .Button.Button--primary.is-hover,html.dark .Button.Button--primary:hover,'
                   +'html.dark .Button.is-hover.btn-fav.s-favorited,html.dark .ButtonGroup--primary>.Button.is-hover,'
                   +'html.dark .ButtonGroup--primary>.Button:hover,html.dark .ButtonGroup--primary>.ButtonGroup>.Button.is-hover,'
                   +'html.dark .ButtonGroup--primary>.ButtonGroup>.Button:hover,html.dark .ButtonGroup--primary>.ButtonGroup>button.is-hover,'
                   +'html.dark .ButtonGroup--primary>.ButtonGroup>button:hover,html.dark .ButtonGroup--primary>.ButtonGroup>input.is-hover[type=button],'
                   +'html.dark .ButtonGroup--primary>.ButtonGroup>input:hover[type=button],html.dark .ButtonGroup--primary>button.is-hover,'
                   +'html.dark .ButtonGroup--primary>button:hover,html.dark .ButtonGroup--primary>input.is-hover[type=button],'
                   +'html.dark .ButtonGroup--primary>input:hover[type=button],html.dark .s-following .follow-btn:hover .Button.following-text:hover,'
                   +'html.dark .s-following .follow-btn:hover .Button.is-hover.following-text,html.dark .s-following .follow-btn:hover button.following-text:hover,'
                   +'html.dark .s-following .follow-btn:hover button.is-hover.following-text,'
                   +'html.dark .s-following .follow-btn:hover input.following-text:hover[type=button],'
                   +'html.dark .s-following .follow-btn:hover input.is-hover.following-text[type=button],'
                   +'html.dark button.btn-fav.s-favorited:hover,html.dark button.Button--primary.is-hover,'
                   +'html.dark button.Button--primary:hover,html.dark button.is-hover.btn-fav.s-favorited,'
                   +'html.dark input.btn-fav.s-favorited:hover[type=button],html.dark input.Button--primary.is-hover[type=button],'
                   +'html.dark input.Button--primary:hover[type=button],html.dark input.is-hover.btn-fav.s-favorited[type=button]'
                   +'{background-color:#4ba2dd;border-color:#4ba2dd !important;}');
    addGlobalStyle('html.dark .icon.icon-arrow-l::before{color:#aab8c2 !important;}');
    addGlobalStyle('html.dark .icon.icon-arrow-r::before{color:#aab8c2 !important;}');
    addGlobalStyle('html.dark .fullname.link-complex-target {color:#FFF !important;}');
    addGlobalStyle('html.dark .prf-stats li + li a{border-left: 1px solid #30363b !important;}');
    addGlobalStyle('html.dark .prf .lst-profile a{border-right: 1px solid #30363b !important;}');
    addGlobalStyle('html.dark .prf-stats a{color:#b6c3cc !important;}');
    addGlobalStyle('html.dark .prf-stats a strong{color:#b6c3cc !important;}');
    addGlobalStyle('.btn-on-dark:focus, html.dark input[type="button"].btn-on-dark:hover{color:#242426 !important;}');
    addGlobalStyle('html.dark .prf-stats a:hover{color:#6f8089 !important;}');
    addGlobalStyle('html.dark .prf-stats a:hover strong{color:#6f8089 !important;}');
    addGlobalStyle('html.dark .prf .lst-profile a:hover{color:#6f8089 !important;}');
    addGlobalStyle('html.dark .js-tooltip-target.link-complex-target {color:#e1e8ed !important;}');
    addGlobalStyle('html.dark .btn-on-blue:focus {background-color:#7c8f9b !important;}');
    addGlobalStyle('html.dark .btn-on-blue:hover {background-color:#85a6bc !important;}');
    addGlobalStyle('html.dark .btn-on-blue {background-color: #66757f !important;}');
    addGlobalStyle('html.dark .icon.icon-retweet-filled.icon-small-context.icon-retweet-color.txt-size--16::before'
                   +'{color:#00cb86 !important;}');
    addGlobalStyle('html.dark js-send-button.js-spinner-button.js-show-tip.Button--primary.btn-extra-height.padding-v--6.padding-h--12.is-disabled'
                   +'{color:#51aeee; border-color:#51aeee !important;}');
    addGlobalStyle('html.dark .Button.btn-fav.s-favorited[disabled], html.dark .Button.Button--primary.is-disabled,'
                   +'html.dark .Button.Button--primary[disabled], html.dark .Button.is-disabled.btn-fav.s-favorited,'
                   +'html.dark .ButtonGroup--primary > .Button.is-disabled, html.dark .ButtonGroup--primary > .Button[disabled],'
                   +'html.dark .ButtonGroup--primary > .ButtonGroup > .Button.is-disabled, html.dark .ButtonGroup--primary > .ButtonGroup > .Button[disabled],'
                   +'html.dark .ButtonGroup--primary > .ButtonGroup > button.is-disabled,'
                   +'html.dark .ButtonGroup--primary > .ButtonGroup > button.is-disabled:focus,'
                   +'html.dark .ButtonGroup--primary > .ButtonGroup > button[disabled],'
                   +'html.dark .ButtonGroup--primary > .ButtonGroup > input.is-disabled[type="button"],'
                   +'html.dark .ButtonGroup--primary > .ButtonGroup > input.is-disabled[type="button"]:focus,'
                   +'html.dark .ButtonGroup--primary > .ButtonGroup > input[disabled][type="button"],'
                   +'html.dark .ButtonGroup--primary > button.is-disabled, html.dark .ButtonGroup--primary > button.is-disabled:focus,'
                   +'html.dark .ButtonGroup--primary > button[disabled], html.dark .ButtonGroup--primary > input.is-disabled[type="button"],'
                   +'html.dark .ButtonGroup--primary > input.is-disabled[type="button"]:focus,'
                   +'html.dark .ButtonGroup--primary > input[disabled][type="button"],'
                   +'html.dark .follow-btn.is-disabled .ButtonGroup--primary > .ButtonGroup > button,'
                   +'html.dark .follow-btn.is-disabled .ButtonGroup--primary > button,'
                   +'html.dark .follow-btn.is-disabled .s-following .follow-btn:hover button.following-text,'
                   +'html.dark .follow-btn.is-disabled button.btn-fav.s-favorited, html.dark .follow-btn.is-disabled button.Button--primary,'
                   +'html.dark .s-following .follow-btn:hover .Button.following-text[disabled],'
                   +'html.dark .s-following .follow-btn:hover .Button.is-disabled.following-text,'
                   +'html.dark .s-following .follow-btn:hover .follow-btn.is-disabled button.following-text,'
                   +'html.dark .s-following .follow-btn:hover button.following-text[disabled],'
                   +'html.dark .s-following .follow-btn:hover button.is-disabled.following-text,'
                   +'html.dark .s-following .follow-btn:hover button.is-disabled.following-text:focus,'
                   +'html.dark .s-following .follow-btn:hover fieldset[disabled] .Button.following-text,'
                   +'html.dark .s-following .follow-btn:hover fieldset[disabled] button.following-text,'
                   +'html.dark .s-following .follow-btn:hover fieldset[disabled] input.following-text[type="button"],'
                   +'html.dark .s-following .follow-btn:hover input.following-text[disabled][type="button"],'
                   +'html.dark .s-following .follow-btn:hover input.is-disabled.following-text[type="button"],'
                   +'html.dark .s-following .follow-btn:hover input.is-disabled.following-text[type="button"]:focus,'
                   +'html.dark button.btn-fav.s-favorited[disabled], html.dark button.Button--primary.is-disabled,'
                   +'html.dark button.Button--primary.is-disabled:focus, html.dark button.Button--primary[disabled],'
                   +'html.dark button.is-disabled.btn-fav.s-favorited, html.dark button.is-disabled.btn-fav.s-favorited:focus,'
                   +'html.dark fieldset[disabled] .Button.btn-fav.s-favorited, html.dark fieldset[disabled] .Button.Button--primary,'
                   +'html.dark fieldset[disabled] .ButtonGroup--primary > .Button, html.dark fieldset[disabled] .ButtonGroup--primary > .ButtonGroup > .Button,'
                   +'html.dark fieldset[disabled] .ButtonGroup--primary > .ButtonGroup > button,'
                   +'html.dark fieldset[disabled] .ButtonGroup--primary > .ButtonGroup > input[type="button"],'
                   +'html.dark fieldset[disabled] .ButtonGroup--primary > button, html.dark fieldset[disabled] .ButtonGroup--primary > input[type="button"],'
                   +'html.dark fieldset[disabled] .s-following .follow-btn:hover .Button.following-text,'
                   +'html.dark fieldset[disabled] .s-following .follow-btn:hover button.following-text,'
                   +'html.dark fieldset[disabled] .s-following .follow-btn:hover input.following-text[type="button"],'
                   +'html.dark fieldset[disabled] button.btn-fav.s-favorited, html.dark fieldset[disabled] button.Button--primary,'
                   +'html.dark fieldset[disabled] input.btn-fav.s-favorited[type="button"], html.dark fieldset[disabled] input.Button--primary[type="button"],'
                   +'html.dark input.btn-fav.s-favorited[disabled][type="button"], html.dark input.Button--primary.is-disabled[type="button"],'
                   +'html.dark input.Button--primary.is-disabled[type="button"]:focus, html.dark input.Button--primary[disabled][type="button"],'
                   +'html.dark input.is-disabled.btn-fav.s-favorited[type="button"],'
                   +'html.dark input.is-disabled.btn-fav.s-favorited[type="button"]:focus'
                   +'{background-color:#51aeee;border-color:#51aeee !important;}');
    addGlobalStyle('html.dark action-text follow-text btn-on-dark{color:#51aeee;border-color:#51aeee !important;}');
    addGlobalStyle('html.dark .action-text.follow-text.btn-on-dark:hover {background:#2c2f33 !important;}');
    addGlobalStyle('html.dark .js-user-actions-menu.btn.btn-round.btn-on-dark:hover {background:#2c2f33 !important;}');
    addGlobalStyle('html.dark .js-user-actions-menu.btn.btn-round.btn-on-dark{color:#51aeee; border-color:#51aeee !important;}');
    addGlobalStyle('html.dark .action-text.follow-text.btn-on-dark{border-color:#51aeee; color:#51aeee !important;}');
    addGlobalStyle('html.dark .is-retweet .icon-retweet-toggle{color:#00cb86 !important;}');
    addGlobalStyle('html.dark .pull-right .icon-retweet-toggle .margin-l--3 .margin-t--1 .txt-size--12 .js-retweet-count .retweet-count'
                   +'{color:#00cb86 !important;}');
    addGlobalStyle('html.dark .icon-retweet-toggle:focus{color:#00cb86 !important;}');
    addGlobalStyle('html.dark a.js-media-gallery-prev.link-no-focus.mdl-btn-media.mdl-media-prev{background:none !important;}');
    addGlobalStyle('html.dark a.js-media-gallery-next.link-no-focus.mdl-btn-media.mdl-media-next{background:none !important;}');
    //edit profile button when you click on your own username
    addGlobalStyle('html.dark .js-action-profile .action-text .thats-you-text .btn-on-dark{color:#51aeee;border-color:#51aeee !important;}');
    addGlobalStyle('html.dark .js-action-profile.action-text.thats-you-text.btn-on-dark:hover{background-color:#2c2f33 !important;}');
    //bit at the bottom  of the composing menu with a checkbox that says keep open
    addGlobalStyle('html.dark .old-composer-footer {background-color: #485865 !important;}');
    //followed by [mutuals] part on the screen when you click a username
    addGlobalStyle('html.dark .social-proof-container {background-color: #292f33 !important;}');
    //scrollbar colour
    addGlobalStyle('html.dark .scroll-styled-h, html.dark .scroll-styled-v {scrollbar-color: #30383d transparent !important;');
    //loading bars
    addGlobalStyle('html.dark .med-embeditem {background: transparent url(https://i.imgur.com/ZRBhNiF.gif) no-repeat 50% 50%;}');
    addGlobalStyle('html.dark .spinner-small,html.dark .spinner-large{filter:grayscale(85%)brightness(117%)}');
    //when likes are turned back to favs with bettertweetdeck, uncomment to turn the text yellow instead of red
    /* addGlobalStyle('html.dark .dm-action:active .icon-favorite, html.dark .dm-action:active .like-count, html.dark .dm-action:focus .icon-favorite,'
                   +'html.dark .dm-action:focus .like-count, html.dark .dm-action:hover .icon-favorite, html.dark .dm-action:hover .like-count,'
                   +'html.dark .is-selected.dm-action .icon-favorite, html.dark .is-selected.dm-action .like-count,'
                   +'html.dark .is-selected.tweet-detail-action .icon-favorite, html.dark .is-selected.tweet-detail-action .like-count,'
                   +'html.dark .tweet-action.is-selected .icon-favorite, html.dark .tweet-action.is-selected .like-count,'
                   +'html.dark .tweet-action:active .icon-favorite, html.dark .tweet-action:active .like-count,'
                   +'html.dark .tweet-action:focus .icon-favorite, html.dark .tweet-action:focus .like-count, html.dark .tweet-action:hover .icon-favorite,'
                   +'html.dark .tweet-action:hover .like-count, html.dark .tweet-detail-action:active .icon-favorite,'
                   +'html.dark .tweet-detail-action:active .like-count, html.dark .tweet-detail-action:focus .icon-favorite,'
                   +'html.dark .tweet-detail-action:focus .like-count, html.dark .tweet-detail-action:hover .icon-favorite,'
                   +'html.dark .tweet-detail-action:hover .like-count'
                   +'{color: #fab41e !important;}');*/
    //click on the three dots for the dropdown
    addGlobalStyle('.js-dropdown-content {background-color:#222426; color:#fff;}'
                   +'html.dark .dropdown-menu {background-color:#222426;}'
                   +'html.dark .dropdown-menu a {color:#8899a6 !important;}'
                   +'html.dark .dropdown-menu a:hover, html.dark .dropdown-menu a:focus {color:#FFFFFF !important;}'
                   +'html.dark .dropdown-menu .is-selected'
                   +'{background: #4ba2dd !important}'
                   +'html.btd-on .btd-settings-btn .icon {color:#8899A6 !important;}'
                   +'html.btd-on .btd-settings-btn .icon:hover {color:#b7c1c9 !important;}'
                   +'html.btd-on [data-btdtheme="dark"].btd__minimal_mode .dropdown-menu, html.btd-on [data-btdtheme="dark"].btd__minimal_mode .typeahead{background-color:#222426}'
                   +'html.dark .caret-inner {border-bottom: 6px solid #222426 !important;}'
                   +'html.dark .caret-outer {border-bottom: 7px solid rgba(17,17,17, 0.58) !important;}');
    //when clicking on username its the following/tweets/favs/lists whatever hover colour
    addGlobalStyle('html.dark .prf-stats a:hover, html.dark .prf-stats a:hover strong, html.dark .prf .lst-profile a:hover i,'
                   +'html.dark .prf .lst-profile a:hover span'
                   +'{color:#cde3f1 !important}');
    // the little reply icon hover colour & three dots hover colour
    addGlobalStyle('html.dark .dm-action:active .icon-reply, html.dark .dm-action:active .reply-count,'
                   +'html.dark .dm-action:focus .icon-reply, html.dark .dm-action:focus .reply-count, html.dark .dm-action:hover .icon-reply,'
                   +'html.dark .dm-action:hover .reply-count, html.dark .is-selected.dm-action .icon-reply, html.dark .is-selected.dm-action .reply-count,'
                   +'html.dark .is-selected.tweet-detail-action .icon-reply, html.dark .is-selected.tweet-detail-action .reply-count,'
                   +'html.dark .tweet-action.is-selected .icon-reply, html.dark .tweet-action.is-selected .reply-count, html.dark .tweet-action:active .icon-reply,'
                   +'html.dark .tweet-action:active .reply-count, html.dark .tweet-action:focus .icon-reply, html.dark .tweet-action:focus .reply-count,'
                   +'html.dark .tweet-action:hover .icon-reply, html.dark .tweet-action:hover .reply-count, html.dark .tweet-detail-action:active .icon-reply,'
                   +'html.dark .tweet-detail-action:active .reply-count, html.dark .tweet-detail-action:focus .icon-reply,'
                   +'html.dark .tweet-detail-action:focus .reply-count, html.dark .tweet-detail-action:hover .icon-reply,'
                   +'html.dark .tweet-detail-action:hover .reply-count'
                   +'{color: #51aeee !important}');
    //inline reply
    addGlobalStyle('html.dark .inline-reply{background-color:#30383d !important;}'
                   +'html.dark .reply-triangle{border-bottom-color:#30383d !important;}');
    });