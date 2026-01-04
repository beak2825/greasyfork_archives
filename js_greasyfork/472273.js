// ==UserScript==
// @name modo oscuro
// @namespace https://greasyfork.org/en/users/1056265-sashayesin
// @version 1.0
// @description Dark theme for Drawaria.
// @author insert___text (https://userstyles.world/style/2430/drawaria-dark)
// @grant GM_addStyle
// @run-at document-start
// @include https://drawaria.online/scoreboards/
// @include https://drawaria.online/gallery/?uid=7ac98650-b5ce-11eb-88ff-1ff00662e054
// @include https://drawaria.online/gallery/new/?uid=7ac98650-b5ce-11eb-88ff-1ff00662e054
// @include https://drawaria.online/gallery/top/?uid=7ac98650-b5ce-11eb-88ff-1ff00662e054
// @include https://drawaria.online/gallery/picks/?uid=7ac98650-b5ce-11eb-88ff-1ff00662e054
// @include https://drawaria.online*
// @include https://drawaria.online/profile/?uid=7ac98650-b5ce-11eb-88ff-1ff00662e054*
// @include https://drawaria.online/palettes/?uid=7ac98650-b5ce-11eb-88ff-1ff00662e054*
// @include https://drawaria.online/friends/?uid=7ac98650-b5ce-11eb-88ff-1ff00662e054*
// @downloadURL https://update.greasyfork.org/scripts/472273/modo%20oscuro.user.js
// @updateURL https://update.greasyfork.org/scripts/472273/modo%20oscuro.meta.js
// ==/UserScript==

(function() {
let css = "";
if (location.href.startsWith("https://drawaria.online")) {
  css += `
  body {
      background: url(" data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAIAAACQd1PeAAAACXBIWXMAAAsTAAALEwEAmpwYAAAADElEQVQImWOQlJQCAACbAE0aAYF+AAAAAElFTkSuQmCC") center fixed !important;
      background-color: #1d1d1d !important;
      color:  #fff;
  }

  .btn-success.focus,
  .btn-success:focus {
   box-shadow:0 0 0 .2rem #00847870;
  }

  .btn-primary {
      color: #fff;
      background-color: #00ae85;
      border-color: #00ae85;
  }

  .btn-primary:hover {
      color: #fff;
      background-color: #008478;
      border-color: #008478;
  }

  .btn-primary:not(:disabled):not(.disabled).active, .btn-primary:not(:disabled):not(.disabled):active, .show > .btn-primary.dropdown-toggle {
      color: #fff;
      background-color: #008478;
      border-color: #008478;
  }

  .btn-primary:not(:disabled):not(.disabled).active:focus,
  .btn-primary:not(:disabled):not(.disabled):active:focus,
  .show>.btn-primary.dropdown-toggle:focus {
   box-shadow:0 0 0 .2rem #00847870;
  }

  .btn-primary.focus,
  .btn-primary:focus {
   box-shadow:0 0 0 .2rem #00847870;
  }


  .btn-outline-primary {
      color: #00ae85;
      border-color: #00ae85;
  }

  .btn-outline-primary:hover {
      color: #fff;
      background-color: #00ae85;
      border-color: #00ae85;
  }

  .btn-outline-primary:not(:disabled):not(.disabled).active, .btn-outline-primary:not(:disabled):not(.disabled):active, .show > .btn-outline-primary.dropdown-toggle {
    color: #141415;
    background-color: #ffc107;
    border-color: #ffc107;
  }

  .btn-outline-primary.focus, .btn-outline-primary:focus {
    box-shadow: 0 0 0 .2rem #ffc1075e;
  }

  .modal-header {
      border-bottom: 1px solid #212122;
  }
  .btn-success {
   border-color:#00ae85;
  }

  .btn-success:hover {
   border-color:#008478;
  }

  .loginbox-alloptionslink {
   color:#ffd726 !important;
  }

  .custom-control-input:checked ~ .custom-control-label::before {
      border-color: #00ae85;
      background-color: #00ae85;
  }

  .custom-control-input:not(:disabled):active~.custom-control-label::before {
   color:#fff;
   background-color:#ffc107;
   border-color:#ffc107
  }

  .custom-control-input:focus~.custom-control-label::before {
   box-shadow:0 0 0 .2rem #00847870;
  }

  .custom-control-label::before {
      background-color: #414142;
      border: #414142 solid 1px;
  }
  .custom-control-input:focus:not(:checked)~.custom-control-label::before {
   border-color:#00847870;
  }

  .modal-content {
      background-color: #171717;
  }

  .dropdown-menu {
      color: #fff;
      background-color: #171717;
      box-shadow: 0 0 10px 0px #00000085
  }

  .dropdown-header {
      color: #fff;
  }

  .dropdown-item:focus, .dropdown-item {
      color: #fff;
      background-color: #0000;
  }

  .dropdown-item:focus, .dropdown-item:hover {
      color: #00ae85;
      background-color: #141415;
  }

  .dropdown-item.disabled, .dropdown-item:disabled {
    color: #4a4a4a;
  }
  .dropdown-divider {
      border-top: 1px solid #212122;
  }

  #login-midcol {
      background: #141415;
  }

  #avatarcontainer {
      background: #0000;
  }

  #avatarcontainer a {
   background:#1414158f;
  }

  .fa-edit {
   color: #fff !important;
  }

  .form-control::placeholder {
      color: #fff ;
  }

  #login-rightcol .loginbox .btn {
      background: #00ae85;
  }

  #login-rightcol .loginbox .btn:hover {
      background: #008478;
  }

  #login-rightcol .loginbox {
      background: #0000;
  }

  .input-group > .input-group-append > .btn,
  .input-group > .input-group-append > .input-group-text,
  .input-group > .input-group-prepend:first-child > .btn:not(:first-child),
  .input-group > .input-group-prepend:first-child > .input-group-text:not(:first-child),
  .input-group > .input-group-prepend:not(:first-child) > .btn,
  .input-group > .input-group-prepend:not(:first-child) > .input-group-text {
      background: #00ae85 !important;
  }
  .btn-warning {
      color: #fff;
      background-color: #00ae85;
      border-color: #00ae85;
  }

  .custom-select {

      color: #919293;
      background-color: rgba(0, 0, 0, 0);
      background-color: #0000;
      border: 1px solid #414142;
  }

  .btn-warning:hover {
      color: #fff;
      background-color: #008478;
      border-color: #008478;
  }

  .btn-secondary {
      color: #fff;
      background-color: #0000;
      border-color: #6c757d;
  }

  #quickplay div {
      color: #fff;
  }

  .btn-info {
      color: #fff;
      background-color: #0000;
      border-color: #00ae85;
  }

  .btn-info:hover {
      color: #fff;
      background-color: #008478;
      border-color: #008478;
  }

  .btn-outline-info {
      color: #00ae85;
      border-color: #00ae85;
  }

  .btn-outline-info:hover {
      color: #fff;
      border-color: #00ae85;
      background-color: #00ae85;
  }

  #continueautosaved-run {
   color: #fff !important;
  }

  #continueautosaved-run:hover {
   color: #fff !important;
  }

  .btn-outline-info:not(:disabled):not(.disabled).active,
  .btn-outline-info:not(:disabled):not(.disabled):active,
  .show>.btn-outline-info.dropdown-toggle {
   color:#fff;
   background-color:#008478;
   border-color:#008478
  }

  #continueautosaved-clear {
   color: #fff !important;
  }
  #login-midcol > div:nth-child(1) > div:nth-child(9) {
      border-top: #00ae85 solid 1px !important;
  }

  .close {
      color: #fff;
      text-shadow: 0 1px 0 #000;
  }

  .form-control {
      color: #fff;
      background-color: #141415;
      border: 1px solid #414142;
  }

  #login-rightcol .loginbox .dropdown .btn {
      color: #fff;
      padding: 0 1em;
  }

  #login-midcol > div:nth-child(1) > div:nth-child(9) > a:nth-child(1) {
      color: #00ae85 !important;
  }

  #login-midcol > div:nth-child(1) > div:nth-child(10) > a:nth-child(1) {
      color: #00ae85 !important;
  }

  #socbuttons > span:nth-child(2) {
      background: #00ae85 !important;
  }

  #roomlist {
      background: #141415;
  }

  .roomlist-header {
      border-bottom: 1px solid #414142;
  }

  .roomlist-groupheader {
      border-bottom: 1px solid #414142;
  }

  .roomlist-mostlang {
      color: #fff;
      background: #00ae85;
  }

  .roomlist-playercount {
   color: #fff;
   background:#1414158f;
   box-shadow:0 0 5px 0 #00ae85;
  }

  .card {
      color: #fff !important;
      background-color: #141415;
  }

  div.howtoplay:nth-child(2) > a:nth-child(8) {
      color: #00ae85 !important;
  }

  .footer a:hover {
      color: #00ae85;
      white-space: nowrap;
  }

  .cmp-persistent-link {
   background-color: #00ae85 !important;
   color: #ffffff;
  }
  `;
}
if (location.href.startsWith("https://drawaria.online")) {
  css += `
  div.row:nth-child(1) > div:nth-child(1) {
      background: #171717 !important;
  }

  div.row:nth-child(1) > div:nth-child(1) > div:nth-child(1) > a:nth-child(13) {
      color: #00ae85 !important;
  }
  `;
}
if (location.href.startsWith("https://drawaria.online")) {
  css += `
  .App > header .Button {
      background: #00ae85;
      border-color: #00ae85;
   color: #fff;
  }

  .App > header .Button:hover {
      background: #008478;
      border-color: #008478;
   color: #fff;
  }

  .Library .category {
      background: #141415 !important;
  }

  .Library {

      background: #171717;
  }

  .List img.asset {
      background: -webkit-radial-gradient(center, circle, #171717 62%, transparent 63%);
      background: radial-gradient(circle at center, #141415 62%, transparent 63%);
  }

  .List img.asset:hover {
      background: -webkit-radial-gradient(center, circle, #00ae85 62%, transparent 63%);
      background: radial-gradient(circle at center, #00ae85 62%, transparent 63%);
  }

  .Library li:hover {
      background: rgba(0, 0, 0, 0);
  }

  .Canvas {
      background: #171717;
  box-shadow: 0 3px 12px #00ae85;
  }

  .Layers li {
      background: #141415;
  }

  .Button {
      border: 2px solid rgba(0, 0, 0, 0);
  background-color:  #141415;
  }

  .Button:hover {
      border: 2px solid rgba(0, 0, 0, 0);
  background-color:  #191919;
  }
  `;
}
if (location.href.startsWith("https://drawaria.online")) {
  css += `
  #friends-wg {
      background: rgba(0, 0, 0, .25);
  }

  #friends-container > .tab {
      color: #fff;
      border-top: 1px solid #0000;
      box-shadow: 0px 0 5px 0px rgba(0, 0, 0, .25);
  }

  #friends-container > .tab > .header > span {
  	color: #fff;
  }

  #friends-tabfriendlist-filterinput > input {
      background: #131313;
      border-color: #232323;
  }

  #friends-wg:hover,
  .friendswg-opened {
      background: #141414 !important;
      box-shadow: 0 0 5px 0px #000000a1;
  }

  #friends-container .tabrow.menuopen {
      background: rgba(0, 0, 0, .25);
  }

  #friends-container .tabrow > .menubutton {
  	color: #009d83;
  }

  #friends-container .tabrow > .menubutton:hover {
      background: #009d83;
  }

  #friends-container .tabrow > .statustext  > span {
  	color: #ffffffe0;
  }

  #friends-container .tabrow > .notification:hover {
  	background: #08c78d;
  	box-shadow: 0 0 5px 0px #ffffff2e;
  }

  #friends-container > .tab > .returnbutton {
  	color: #009d83;
  }

  #friends-container > .tab > .returnbutton:hover {
  	color: #fff;
  }

  #friends-tabmessages-list {
      background: #232323;
      color: #ffffff;
      border: 1px solid #0000;
      box-shadow: 0 0 5px 0px #0000006b
  }

  #friends-tabmessages-list > .fromself {
      background: #151515 !important;
  }

  #friends-tabmessages-list > .message {
      background: #131313;
      border-top: 1px solid rgba(255, 255, 255, .14)
  }

  #friends-tabmessages-list > .message > .created {
  	    color: #009d83;
      font-size: 0.7em;
  }

  .form-control:focus {
    background-color: #171717;
   border: 1px solid #fff;
  }

  #friends-tabmessages-input input {
    border-color: #008c80;
  }

  #friends-tabmessages-input input:focus {
    border-color: #fff;
  }

  #friends-header .notifybutton {
      color: #ffffff;
      background: #009d83;
  }

  #friends-container .tabrow > .buttons > span {
      color: #ffffff;
      background: #08c78d;
  }

  #friends-container .tabrow > .buttons > .secondary {
      background: #009d83;
  }
  #friends-header .secondary {
    background: #08c78d !important;
  }

  #friends-wg ::-webkit-scrollbar-thumb {
  background-color: #00ae85;
  border: #00ae85
  }

  #friends-wg ::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, .25)
  }
  `;
}
if (location.href.startsWith("https://drawaria.online")) {
  css += `
  .page-load-status {
    border-top: 1px solid #414142;
  }

  .container {
  	background: #171717 !important;
  }

  div.container:nth-child(6) > div:nth-child(1) {
      padding: 2px;
      background: #0000 !important;
  }

  .justify-content-center > div:nth-child(1) > div:nth-child(3) {
      border-bottom: 1px solid #414142 !important;
      ;
  }

  .grid-item img {
      box-shadow: 0 0 5px 0px #000;
  }

  .active {
      background-color: inherit !important;
      color: #00ae85 !important;
      border: 1px solid #00ae85 !important;
   }

  .active:hover {
      background-color: inherit !important;
      color: #008478 !important;
      border: 1px solid #008478 !important;
  }

  a {
      color: #00ae85;
      background-color: transparent;
  }

  a:hover {
      color: #008478;
  }

  li.nav-item:nth-child(4) > a:nth-child(1) {
      color: #00ae85 !important;
  }

  li.nav-item:nth-child(4) > a:nth-child(1):hover {
      color: #008478 !important;
  }

  .custom-select {
   color: #e1e1e1 !important;
  background: #171717 !important;
  }

  .justify-content-center > div:nth-child(1) > div:nth-child(3) {
      border-bottom:  #171717 !important;
      ;
  }

  div.row:nth-child(1) > div:nth-child(1) > div:nth-child(4) {
   margin-bottom: 0.5em;
      border-bottom:  #171717 !important;
  }


  .grid-item .info {
      background: #171717;
  }

  .grid-item  .info-u {
    border-bottom: 1px solid #171717;
  }

  .grid-item  .info-l {
  	border-top: #171717;
  }


  .grid-item .playername a, .grid-item .playername span, #viewimage .playername a, #viewimage .playername span {
      color: #fff;
  }

  .imagerating a {
      color: #fff;
  }

  .ratingbutton-voted i {
      color: #00ae85;
  }

  .grid-item .comments > a {
      color: #fff;
  }

  .uidlinks,
  .uidlinks > a {
      color: #00ae85;
  }

  .uidlinks,
  .uidlinks > a:hover {
      color: #008478 !important;
  }

  .uidlinks-active {
      color: #e1e1e1!important;
  }


  div.container:nth-child(6) > div:nth-child(1) > h1:nth-child(1) {
      background: #0000 !important;
  }

  div.container:nth-child(6) > div:nth-child(1) {
      background: #141415 !important;
  }

  .deleteimage {
      color: #ffffff;
      background: #00ae85;
  }

  .turnresults-avatar {
   padding: 1px;
   box-shadow: 0px 0 9px 0px #00ae85 !important;
  }


  .deleteimage:hover {
      color: #e1e1e1;
      background: #008478;
  }
  `;
}
if (location.href.startsWith("https://drawaria.online")) {
  css += `
  .imagerating a {
      color: #fff;
  }

  .ratingbutton-voted i {
      color: #00ae85;
  }

  .details-editmessage {
      color: #00ae85;
  }

  .details-cardmenu > .btn {
      color: #fff !important;
  }

  .details-editenabled {
      background: #171717 !important;
     box-shadow: 0 0px 11px 2px #0c0c0c;
  }

  .details-inputcontainer {
      background: #171717 !important;
  }
  .details-input-tags {
      background: #171717 !important;
  }

  .tagify {
      --tags-disabled-bg: #6c757d;
      --tags-border-color: #919293;
      --tags-hover-border-color: #00ae85;
      --tags-focus-border-color: #008478;
      --tag-bg: #00ae85;
      --tag-hover: #008478;
      --tag-text-color: #fff;
      --tag-text-color--edit: #fff;
      --tag-invalid-color: #00ae85;
      --tag-invalid-bg: rgba(211, 148, 148, 0.5);
      --tag-remove-bg: #008478;
      --tag-remove-btn-color: #fff;
      --tag-remove-btn-bg--hover: #e62738;
      --placeholder-color: rgba(0, 0, 0, 0.4);
      --placeholder-color-focus: rgba(0, 0, 0, 0.25);
      border: 1px solid #ddd;
  }

  .tagify__input::before {
      color: #fff;
  }

  .tagify__input:focus:empty:before {
      color: #919293;
  }

  .tagify__input::after {
      color: #fff;
  }

  :root {
   --tagify-dd-color-primary:#00ae85;
   --tagify-dd-bg-color:#171717;
  }

  .details-expander-button {
    text-align: left;
    color: #00ae85;
  }

  .details-expander-button:hover {
    text-align: left;
    color: #008478;
  }

  #comments-container .commentlist {
      background: #1c1c1e;
      border: 1px solid #0000;
  }

  #comments-container .comment-header > a {
      color: #fff;
  }

  #comments-container .header-date {
      margin-left: 1em;
      color: #fff;
      white-space: pre;
  }

  #comments-container .comment-entry .menubutton {
      color: #fff;
  }

  #comments-container .comment-entry-hl {
      color: #fff;
      background: #00ae85;
  }

  .btn-link {
   color:#00ae85;
  }

  .btn-link:hover {
   color:#008478;
  }

  .btn-link:active {
   color:#008478;
  }

  #comments-container .comment-actions {
      color: #fff;
  }

  #comments-container .header-name-hl::after {
      color: #00ae85;
      background: #141415;
  }
  `;
}
if (location.href.startsWith("https://drawaria.online")) {
  css += `
  .drawcontrols-arrow::before {
      border-top: 10px solid #00ae85;
  }

  .drawcontrols-popupbutton {
      background-color: #212122;
      box-shadow: inset 0 0 20px 1px #00000059;
      color: #959597;
      border-top: 1px solid #171717;
  }

  .drawcontrols-popupbutton:hover {
      background-color: #171717;
      color: #fff;
  }

  .drawcontrols-popupbutton-active {
      color: #00ae85;
  }

  .drawcontrols-settingscontainer {
    background: #181818;
  }

  .pcr-app[data-theme=classic] {
   background:#171717;
   box-shadow: 0px 0 9px 0px #00000059;
  }

  .pcr-app[data-theme=classic] .pcr-interaction .pcr-result {
   color:#b0b5b9;
   background:#00000038;
  }

  .pcr-app[data-theme=classic] .pcr-interaction input {
   color:#75797e;
   background: #00000038;
  }

  .pcr-app[data-theme=classic] .pcr-interaction input:focus {
   box-shadow:0 0 0 1px #00847863,0 0 0 3px #00847863;
  }


  .custom-range::-moz-range-track {
   background-color:#00000038;
  }

  .custom-range::-moz-range-thumb {
    background-color: #00ae85;
  }

  .custom-range:focus::-moz-range-thumb {
    background-color: #00ae85;
    box-shadow: 0 0 0 1px #0000,0 0 0 .2rem #00847863;
  }

      .custom-range::-webkit-slider-runnable-track {
  background: #00000038;
  }

      .custom-range::-webkit-slider-thumb {
  background: #00ae85 !important
  }

      .custom-range:focus::-webkit-slider-thumb {
  background-color: #00ae85;
    box-shadow: 0 0 0 1px #0000,0 0 0 .2rem #00847863;
  }


  .drawcontrols-widthtoggle span:hover {
      border-color: transparent #00ae85 transparent transparent;
  }

  .timer-bg {
   background-color:#171717;
  }

  .timer-bar > svg:nth-child(1) > path:nth-child(1) {
      stroke: #00ae85;
  }

  .timer-bar {
  background: #141415;
  }

  .timer-face {
   background-color:#171717;
  }

  .timer-text {
   color:#fff;
  }


  .topbox-content-targetword {
   background-color:#212122;
   color: #fff;
  }

  .topbox-content {
   background-color:#212122;
   color: #fff;
  }

  #targetword_guessedself > div:nth-child(2) {
   background-color: #171717 !important;
   color: #fff !important;
  }

  .wordchooser-row {
    background-color: #00000038;
    color: #fff;
  }

  .wordchooser-row:hover {
    background-color: #00000059;
    color: #00ae85;
  }

  .playerlist-rank-first {
   color:#00ae85;
  }

  #turnresults > div:nth-child(2) > div:nth-child(1) {
   background: #212122 !important;
  }

  #turnresults > div:nth-child(2) {
   background-color: #212122 !important;
  }

  .playername-self {
   color:#00ae85 !important;
  }

  #roundresults > div:nth-child(1) {
   background: #212122 !important;
  }

  .drawcontrols-dialogbutton:hover {
    background: #00ae85;
  }

  .bubble {
      background-color: #212122;
      box-shadow: 0 0 3px #00000080;
  }

  .bubble::before {
      background-color: #212122;
      box-shadow: 0 0 6px #0000;
  }

  .spawnedavatar-bubble {
      background: #212122;
      box-shadow: 0 0 6px #ffffff1f;
  }

  .spawnedavatar-bubble::after {
      border-color: #212122 #212122 #212122 #212122;
      box-shadow: 0 0 6px rgba(0, 0, 0, 0);
  }

  .playerlist-avatar-spawned {
      background: #19191a;
      box-shadow: inset 0 0 5px 0 #19191a;
  }

  .playerlist-row-freeslot .playerlist-avatar {
   background:#19191a;
  }

  #leftbar {
      background: #212122;
      border-right: .2em solid #19191a;
  }

  .playerlist-row {
      background: #212122;
      border-bottom: 2px solid rgba(0, 0, 0, .2);
  }

  .playerlist-pgdrawallow {
      background-image: repeating-linear-gradient(0.13turn, #212122, #212122 5px, #141415 5px, #141415 10px);
  }

  .playerlist-drawerhighlight {
   background:#00847863 !important;
  }

  .pgdrawallowbox-button {
    cursor: pointer;
    color: #00ae85;
  }

  .playerlist-avatar {
      background: #0000;
  }

  .playerlist-menu-friendsbutton:hover {
    color: #959597;
  }

  .playerlist-menu-friendsbutton .friend {
    color: #00ae85;
  }

  .drawcontrols-button {
      background-color: #212122;
  }

  body {
      color: #959597;
  }

  #rightbar {
      background: #212122;
      border-left: .2em solid #212122 !important;
  }

  .accountbox-topbar:hover {
   background:#00000059;
   box-shadow:0 0 5px 1px #00000059
  }

  #clearchatbutton {
      background: #19191a;
      opacity: .9;
  }

  .btn-outline-dark {
      color: #7b7b7b;
      border-color: #7b7b7b;
  }

  .btn-outline-dark:hover {
      color: #fff;
      background-color: #171717;
      border-color: #171717;
  }

  .btn-outline-dark.disabled,
  .btn-outline-dark:disabled {
   color:#7b7b7b;
   background-color:transparent
  }

  .btn-outline-secondary {
      color: #fff;
      border-color: #0000;
  }

  .playerlist-name-loggedin a {
      color: #e62738 !important;
  }

  .playerlist-name a {
      color: #b0b5b9;
  }

  .playerlist-name-self a {
      color: #00ae85 !important;
  }

  .popover {
      background-color: #212122;
      border: 1px solid rgba(0, 0, 0, .2);
      box-shadow: 0px 0 22px 0px #00000059;
  }

  .popover-body {
      color: #959597;
  }

  .playerlist-exp-bar {
      background: #171717;
  }

  .playerlist-exp-bar>span {
   background:#ffd92f;;
  }

  .bs-popover-auto[x-placement^="right"] .arrow::after,
  .bs-popover-right .arrow::after {
      border-right-color: #212122;
  }

  .bs-popover-auto[x-placement^=bottom] .arrow::after,
  .bs-popover-bottom .arrow::after {
   top:1px;
   border-bottom-color:#212122;
  }

  .bs-popover-auto[x-placement^=top] .arrow::after,
  .bs-popover-top .arrow::after {
   bottom:1px;
   border-top-color:#212122;
  }

  .btn-light {
    color: #fff;
    background-color: #181818;
    border-color: #0000;
  }

  .btn-light:hover {
    color: #fff;
    background-color: #141415;
    border-color: #0000;
  }

  .btn-primary.disabled, .btn-primary:disabled {
    color: #b0b5b9;
    background-color: #008478;
    border-color: #0000;
  }

  .playerlist-tokens-notset::before {
      color: #171717 !important;
  }

  .playerlist-tokens:not(.playerlist-tokens-self)>.playerlist-tokens-notset:hover::before {
   color:#00847863 !important;
  }

  .playerlist-tokens:not(.playerlist-tokens-self) > i:hover::before {
    color: #008478;
  }

  .playerlist-tokens > i::before {
      color: #00ae85;
  }

  .playerlist-country img {
    box-shadow: 0px 0 5px 0px #00ae85;
  }

  #rightbar {
      background: #171717;
      border-left: .2em solid #b0b5b9;
  }

  .invbox {
      background-color: #141415 !important;
  }

  .form-control:disabled,
  .form-control[readonly] {
      background-color: #141415;
      opacity: 1;
  }

  .form-control {
      color: #fff;
      border: 1px solid #414142;
      background-color: #141415;
  }

  .playerchatmessage-name {
      color: #959597;
  }

  .playerchatmessage-selfname {
      color: #00ae85;
  }

  #rightbar > div:nth-child(5) {    border-top: 1px solid #212122 !important;
  }

  .form-control {
      color: #fff;
      border: 1px solid #414142;
  }

  #chatbox_messages > div:nth-child(2n + 1) {
      background: #1c1c1e;
  }

  #chatbox_textinput {
      border: 1px solid #00ae85 !important;
  }
  #chatbox_textinput:focus {
    background-color: rgba(0, 0, 0, .2);
  }

  .form-control:focus {
    color: #fff;
    box-shadow: 0 0 0 .2rem #00847863;

  }

  .tokenicon {
      color: #00ae85;
      background: #171717;
      box-shadow: 0 0 2px #8c8c8c00;
  }

  .playerchatmessage-highlightable:hover {
      color: #515151;
      background:#ffeb3b !important;
  }

  .playerchatmessage-highlighted {
   color: #515151;
   background:#ffeb3b !important;
   box-shadow:inset 0 -1px 0 0 #ffeb3b;
  }

  .playerchatmessage-selfname1 {
   color:#00ae85;
  }

  .systemchatmessage8 {
    background: #00ae85 !important;
  }

  .systemchatmessage5 {
   color:#00ae85;
  }

  .systemchatmessage4 {
      color: #00ae85;
  }

  .systemchatmessage2 {
   color: #75797e;
   border-top:1px solid #00ae85;
  }

  .systemchatmessage1 {
    color: #aeaeae;
  }

  .gesturespicker-item {
      background-color: #19191a;
      border: 1px solid #141415;
  }

  .gesturespicker-item:hover {
      border: 1px solid #ffffff1f;
  }

  .brushcursor {
   background:#ffffffab;
  color: #00000080;
  }
  `;
}
if (location.href.startsWith("https://drawaria.online")) {
  css += `
  #selToken {
  border: 1px solid transparent;
  border-radius: .3rem !important;
  border-color: #0000 !important;
  color: #aeaeae !important;
  background: #0f0f0f !important;
  transition: background .15s linear, color .15s linear;
  }

  #selToken:hover {
  border-radius: .3rem !important;
  border-color: #0000 !important;
  color: #fff !important;
  background: #090909 !important;
  }

  #give {
  border: 1px solid transparent;
  border-radius: .3rem !important;
  border-color: #131313 !important;
  color: #8c8c8c !important;
  background: #131313 !important;
  transition: background .15s linear, color .15s linear;
  margin-bottom: 4px !important;
  }

  #give:hover {
  border-radius: .3rem !important;
  border-color: #090909 !important;
  color: #fff !important;
  background: #090909 !important;
  }

  #give:focus {
  box-shadow: 0 0 0 .2rem rgba(152, 161, 169, .5);
  }

  #rightbar > div:nth-child(6) {
      border-top: 1px solid #202020 !important;
  }

  #selStat {
  border: 1px solid transparent;
  border-radius: .3rem !important;
  border-color: #0000 !important;
  color: #aeaeae !important;
  background: #0f0f0f !important;
  transition: background .15s linear, color .15s linear;
  }

  #selStat:hover {
  border-radius: .3rem !important;
  border-color: #0000 !important;
  color: #fff !important;
  background: #090909 !important;
  }

  #addAll {
  border: 1px solid transparent;
  border-radius: .3rem !important;
  border-color: #131313 !important;
  color: #8c8c8c !important;
  background: #131313 !important;
  margin-right: 1px !important;
  transition: background .15s linear, color .15s linear;
  }

  #addAll:hover {
  border-radius: .3rem !important;
  border-color: #090909 !important;
  color: #fff !important;
  background: #090909 !important;
  }

  #addAll:focus {
  box-shadow: 0 0 0 .2rem rgba(152, 161, 169, .5);
  }

  #remAll {
  border: 1px solid transparent;
  border-radius: .3rem !important;
  border-color: #131313 !important;
  color: #8c8c8c !important;
  background: #131313 !important;
  margin-left: 1px !important;
  transition: background .15s linear, color .15s linear;
  }

  #remAll:hover {
  border-radius: .3rem !important;
  border-color: #090909 !important;
  color: #fff !important;
  background: #090909 !important;
  }

  #remAll:focus {
  box-shadow: 0 0 0 .2rem rgba(152, 161, 169, .5);
  }

  #togStats {
  border: 1px solid transparent;
  border-radius: .3rem !important;
  border-color: #131313 !important;
  color: #8c8c8c !important;
  background: #131313 !important;
  margin-bottom: 2px !important;
  transition: background .15s linear, color .15s linear;
  }

  #togStats:hover {
  border-radius: .3rem !important;
  border-color: #090909 !important;
  color: #fff !important;
  background: #090909 !important;
  }

  #togStats:focus {
  box-shadow: 0 0 0 .2rem rgba(152, 161, 169, .5);
  }
  `;
}
if (location.href.startsWith("https://drawaria.online")) {
  css += `
  .close:hover {
    color: #626262;
  }

  .btn-light:not(:disabled):not(.disabled).active,
  .btn-light:not(:disabled):not(.disabled):active,
  .show>.btn-light.dropdown-toggle {
   color:#fff;
   background-color:#131313;
   border-color:#131313
  }

  .btn-light.focus,
  .btn-light:focus {
   box-shadow:0 0 0 .2rem #00ae8559;
  }

  #roomcontrols .dropdown-menu i {
      color: #00ae85;
  }

  #showextmenu {
      background: #141415 none repeat scroll 0% 0% !important;
  }

  .btn-light.disabled,
  .btn-light:disabled {
   color:#9e9e9e;
   background-color:#141415;
   border-color:#141415
  }

  .btn-info.disabled, .btn-info:disabled {
    color: #fff;
    background-color: #008478;
    border-color: #008478;
  }

  .modal-content {
      background-color: #171717 !important;
  }

  .modal-body {
      background: #171717 !important;
  }

  .modal-header {
      background: #131313;
      border-bottom: 1px solid #131313;
  }

  .modal-footer {
      background: #131313;
      border-top: 1px solid #131313;
  }

  .palettechooser-row {
      background: #141415;
      box-shadow: 0 0 3px #00000073;
  }
  .selmode-palettechooser-list .palettechooser-row:hover {
      color: #00ae85;
      background: #19191a;
  }



  #musictracks-playlist {
      background: #141415;
      border: 1px #212122 solid;
  }

  #musictracks-tracklist {
      background: #141415;
      border: 1px #212122 solid;
  }

  .inventorydlg-shopitem {
   background-color:#fff;
   box-shadow:0 0 2px 1px #9e9e9e;
   color: #141415;
  }

  .accountbox-itemscontainer-slot:not(.accountbox-static) {
   background-color:#0000 !important;
  }

  #accountbox .accountbox-inventorybutton {
   color:#ffc107;
  }



  .inventorydlg-leftpanel {
   border-right:solid 5px #0000;
  }

  .inventorydlg-addcoinsview,
  .inventorydlg-groupview {
   background:#191919;
   box-shadow:0 0 7px 0 #00000073
  }

  .inventorydlg-addcoinsview-header,
  .inventorydlg-groupview-header {
   padding-right:1em;
   height:2em;
   border-bottom:1px solid #131313;
  }

  .accountbox-itemscontainer-slot:not(.accountbox-static):hover {
   background-color:#131313;
   box-shadow:0 0 2px 1px #0000;
  }

  .inventorydlg-groupview-item:hover {
   background-color:#141415;
   box-shadow:0 0 2px 1px #141415
  }


  #stencilsbuttons {
   border-radius:2px;
   box-shadow:0 0 3px 0 #00000073;
   background-color:#171717;
  }

  .canvasobjects-menu+div {
   background-color:#212122 !important;
  }

  #customvotingbox {
   background:#171717;
   box-shadow:0 0 5px 1px #000000b5;
  }

  #customvotingbox .customvotingbox-timer {
   color:#9e9e9e;
  }

  .customvotingbox-notvoted .customvotingbox-descr {
   color:#fff !important;
  }

  #customvotingbox .customvotingbox-descr {
   border-top:1px solid #19191a;
  }


  .customvotingbox-notvoted .customvotingbox-buttons {
   color:#00ae85 !important;
  }

  .customvotingbox-notvoted .customvotingbox-buttons>span:hover {
   background:#131313;
  }

  .customvotingbox-highlighted {
   background:#171717 !important;
  }
  `;
}
if (location.href === "https://drawaria.online/scoreboards/") {
  css += `
  body > div:nth-child(4) {
   background: #00ae85 !important;
  }

  .btn-success:hover {
   color:#fff;
   background-color:#008478;
   border-color:#008478
  }

  .btn-success {
   color:#fff;
   background-color:#00ae85;
   border-color:#00ae85
  }


  div.row:nth-child(1) > div:nth-child(1) > div:nth-child(2) {
   padding: 1em;
   background: #0000 !important;
   border-radius: 0.3em;
  }


  .table td, .table th {
    padding: .75rem;
    vertical-align: top;
    border-top: 1px solid #fff;
  }
  .nav-tabs .nav-link.active {
      background: #141415 !important;
      border-color: #fff #fff #141415 !important;
  }

  .nav-tabs {
      border-bottom: 1px solid #fff;
  }

  div.row:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div:nth-child(2) {
      background: #141415 !important;
  }

  .table {
      background: #14141500 !important;
  }

  .table > thead:nth-child(1) > tr:nth-child(1) {
      background: #141415 !important;
  }

  td:nth-child(2) > a:nth-child(1) {
      color: #00ae85 !important;
  }

  .page-item.active .page-link {
    color: #fff;
    background-color: #00ae85;
    border-color: #00ae85;
  }

  .page-item.disabled .page-link {
    color: #aeaeae;
    background-color: #212121;
    border-color: #171717;
  }

  .page-link {
    color: #00ae85;
    text-decoration: none;
    background-color: #212121;
    border-color: #212121;
  }

  .page-link:hover {
    color: #008478;
    text-decoration: none;
    background-color: #141415;
    border-color: #141415;
  }
  `;
}
if (location.href.startsWith("https://drawaria.online")) {
  css += `
  .palettelist {
      background: #141415;
  }

  .rowitem {
      background: #141415;
  	box-shadow: 0 0 3px #000000a1;
  }

  .rowitem-playername a {
      color: #00ae85;
  }

  .rowitem-playername:hover a {
      color: #008478;
  }

  .page-item.active .page-link {
    color: #fff;
    background-color: #00ae85;
    border-color: #00ae85;
  }

  .page-item.disabled .page-link {
    color: #aeaeae;
    background-color: #212121;
    border-color: #171717;
  }

  .page-link {
    color: #00ae85;
    text-decoration: none;
    background-color: #212121;
    border-color: #212121;
  }

  .page-link:hover {
    color: #008478;
    text-decoration: none;
    background-color: #141415;
    border-color: #141415;
  }
  `;
}
if (location.href.startsWith("https://drawaria.online")) {
  css += `
  div.container:nth-child(5) > div:nth-child(1) {
   background: #0000 !important;
  }

  div.container:nth-child(5) > div:nth-child(1) > h1:nth-child(1) {text-align: center; color: #0000; margin: 0; background: #171717 !important;
  }

  div.row:nth-child(1) {    background: #0000 !important;
  }

  #playstats {
  	background: #0000;
      padding-top: 0.1px;
  }

  #playstats tr {
  	border-bottom: 2px dotted #ffffff73;
  }

  #level > div:nth-child(1) > div:nth-child(1) {
      background: #141414 !important;
  	box-shadow: 0 0 3px #0000 !important;
  }

  #levelbar {
      background: #0000003d;
  	box-shadow: 0 0 2px #141414;
  }

  #levelbar > svg > path {
      stroke: #ffc107;
  }

  #tokens i::before {
  	color: #00ae85;
  	    background: #141414;
      box-shadow: 0 0 2px #0000003d;
  }
  `;
}
if (location.href.startsWith("https://drawaria.online")) {
  css += `
  .friendcard {
    background: #141414;
  }
  `;
}
if (location.href.startsWith("https://drawaria.online")) {
  css += `
  .nav-tabs {
   border-bottom:1px solid #0000;
  }

  .nav-tabs .nav-link:hover {
    border: 1px solid #0000;
  }

  .loginbutton-icon {
  background: #0000;
  }

  .loginbutton:not(:hover) {
  background: #0000;
  color: #fff;
  }

  .btn-success {
    color: #fff;
     background: #00ae85;
      border-color: #00ae85;
  }

  .btn-success:hover {
    color: #fff;
    background-color: #008478;
    border-color: #008478;
  }

  .btn-success:not(:disabled):not(.disabled).active, .btn-success:not(:disabled):not(.disabled):active, .show > .btn-success.dropdown-toggle {
    color: #141415;
    background-color: #ffc107;
    border-color: #ffc107;
  }

  .btn-success.focus, .btn-success:focus {
    box-shadow: 0 0 0 .2rem #ffc1076b;
  }
  .emailcontainer {
  background: #f5f7ff00;
  	border-top: 1px solid #0000;
  }

  .input-group-text {
   color:#141415;
  }
  `;
}
if (location.href === "https://drawaria.online/gallery/?uid=7ac98650-b5ce-11eb-88ff-1ff00662e054" || location.href === "https://drawaria.online/gallery/new/?uid=7ac98650-b5ce-11eb-88ff-1ff00662e054" || location.href === "https://drawaria.online/gallery/top/?uid=7ac98650-b5ce-11eb-88ff-1ff00662e054" || location.href === "https://drawaria.online/gallery/picks/?uid=7ac98650-b5ce-11eb-88ff-1ff00662e054") {
  css += `
  div.container:nth-child(6) > div:nth-child(1) > h1:nth-child(1) {
  background:  url('  data:image/png;base64,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') center fixed !important;
  }
  `;
}
if (location.href.startsWith("https://drawaria.online/profile/?uid=7ac98650-b5ce-11eb-88ff-1ff00662e054") || location.href.startsWith("https://drawaria.online/palettes/?uid=7ac98650-b5ce-11eb-88ff-1ff00662e054") || location.href.startsWith("https://drawaria.online/friends/?uid=7ac98650-b5ce-11eb-88ff-1ff00662e054")) {
  css += `
  div.container:nth-child(5) > div:nth-child(1) > h1:nth-child(1) {
  background:  url('  data:image/png;base64,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') center fixed !important;
  }

  .container {
  background:  url('  data:image/png;base64,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') center fixed !important;
  }

  div.row:nth-child(1) > div:nth-child(1) {
  background: transparent !important;
  }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
