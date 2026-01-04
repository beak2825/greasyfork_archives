// ==UserScript==ontchat
// @name           OnTchat
// @description    Outil de discussion instantanée pour les forums de onche.org
// @author         PingKungFu
// @namespace      OnTchat
// @license        MIT
// @version        0.2.2
// @match          http://onche.org/topic/*
// @match          https://onche.org/topic/*
// @grant          none
// @downloadURL https://update.greasyfork.org/scripts/462393/OnTchat.user.js
// @updateURL https://update.greasyfork.org/scripts/462393/OnTchat.meta.js
// ==/UserScript==


let bodyBgColor = getStyle(document.getElementsByTagName("body")[0], "background-color");
let textareaBgColor = getStyle(document.getElementsByTagName("textarea")[0], "background-color");
let textareaBorderColor = getStyle(document.getElementsByTagName("textarea")[0], "border-color");
let messageBgColor = getStyle(document.getElementsByClassName("message")[0], "background-color");
let messageBorderColor = getStyle(document.getElementsByClassName("message")[0], "border-color");
let messageAnswerBgColor = getStyle((document.getElementsByClassName("message answer")[0]) ? document.getElementsByClassName("message answer")[0] : document.getElementsByClassName("favoriteStickers")[0], "background-color");
let fontColor = getStyle(document.getElementsByClassName("message-content")[0], "color");

let CSS = `<style type="text/css" id="OnTchat-css">
header,
.left,
.logo,
.container > .right,
.screen,
.bloc.hot,
.message-anchor,
.message:not(.answer, .small),
.pagination,
#confirmation,
#right,
#topic.bloc
{
    display: none!important;
}

html,
body,
#ontchat-main,
#page-messages-forum,
#left,
#forum-main-col > .left,
.messages
{
    height: 100%;
    width: 100%;
}

.ontchat-hide {
    display: none!important;
}

.ontchat-hide-visibility {
    visibility: hidden;
}

body {
    overflow-y: unset;
    padding: 0!important;
}

.ontchat-disabled-form {
    opacity: 0.5;
    cursor: not-allowed;
    pointer-events: none;
}

#ontchat-leftbar h4 {
    font-weight: 600;
}

#bloc-formulaire-forum > .form-post-message > .row {
    margin: 0;
}

.jv-editor > .conteneur-editor {
    background-color: var(--jv-bg-color);
}

.jv-editor > .conteneur-editor > .text-editor {
    border: 0;
    display: flex!important;
}

#ontchat-alerts {
    position: absolute;
    z-index: 3;
    right: 1rem;
    left: 0;
    overflow-y: hidden;
}

#ontchat-alerts .alert {
    color: #842029!important;
    background-color: #f8d7da!important;
    margin: 1rem 2rem;
    border-radius: 0.5rem;
}

#ontchat-leftbar {
    max-width: 15rem;
    flex-grow: 100000;
    flex-shrink: 100;
    position: relative;
}

#ontchat-leftbar-button {
    display: flex;
    position: absolute;
    right: 0;
    top: 6px;
}

#ontchat-leftbar-button span {
    font-size: 1.3rem;
    color: white;
    padding: 0 0.5rem 0 0rem;
    max-width: 100%;
    cursor: pointer;
    opacity: 0.3;
}

#ontchat-leftbar-button span:hover {
    opacity: 1;
}

#content {
    margin: 0;
    padding: 0;
    line-height: 1.42857;
    font-size: .875rem;
}

#page-messages-forum > .layout__contentMain {
    display: flex;
    padding: 0!important;
    height: 100%;
    max-width: unset;
}

#page-messages-forum {
    margin: 0;
    display: flex;
}

label {
    display: inline-block;
    max-width: 100%;
    margin-bottom: .3125rem;
    font-weight: 700;
}

#forum-main-col {
    flex-basis: 35rem;
    flex-grow: 100;
    overflow-x: auto;
    position: relative;
    min-width: 13rem;
}

#ontchat-right-padding {
    flex-shrink:1000;
    flex-grow:0;
}

#forum-main-col > .conteneur-messages-pagi {
    display: flex;
    flex-direction: column;
}

#page-messages-forum > .container-content {
    padding: 0;
    max-width: unset;
    min-width: unset;
    min-height: unset;
    max-height: unset;
}

.form-post-message {
    margin: 0;
}

.ontchat-textarea {
    resize: none;
    min-width: unset;
}

.ontchat-edition-textarea {
    resize: none;
    width: 100%;
    max-height: 6.5rem;
    min-height: 3.5rem;
    overflow-y: auto;
}

.ontchat-reduced {
    padding: 0.3rem;
    min-height: 1.5rem!important;
    max-height: 6.5rem;
    overflow: auto;
    line-height: 1rem;
    height: 1.8rem;
}

.ontchat-reduced .jv-editor .conteneur-editor > * {
    display: none;
}

#ontchat-buttons-main button {
    padding: 0;
    width: 2rem;
}

#ontchat-buttons-main button::before {
    font-size: 1.4rem;
}

#ontchat-buttons-main button.icon-reply::before {
    font-size: 1rem;
}

.ontchat-buttons {
    display: flex;
    flex-direction: column;
}

.ontchat-buttons button {
    border: 0.0625rem solid ${textareaBorderColor};
    border-left-width: 0;
    height: 100%;
    background: white;
    color: gray;
}

.ontchat-buttons .ontchat-button-solo {
    border-radius: 0 0.3rem 0.3rem 0;
}

.ontchat-buttons .ontchat-button-top {
    border-radius: 0 0.3rem 0 0;
}

.ontchat-buttons .ontchat-button-bottom {
    border-radius: 0 0 0.3rem 0;
    border-top: 0!important;
}

.ontchat-textarea {
    border-radius: initial;
    border-right: none !important;
    color: inherit !important;
}

.ontchat-buttons button:hover {
    background: lightgray;
    color: black;
}

.ontchat-buttons button:focus {
    outline: none;
    border: dotted 1px!important;
    color: black;
    border: blue;
}

#forum-main-col {
    display: block;
    padding: 0;
    max-width: unset;
}

#ontchat-leftbar > .panel {
    margin: 0;
    padding: 0 0.5rem;
}

#ontchat-config {
    line-height: 1.40;
}

#ontchat-leftbar #ontchat-profil .titre-info-fofo,
#ontchat-leftbar #ontchat-configuration .titre-info-fofo {
    margin-top: 0.5rem;
}

#ontchat-configuration-intro {
    color: grey;
    font-size: 0.84rem;
}

#ontchat-leftbar .titre-info-fofo {
    margin-top: 1rem;
}


.ontchat-config-option {
    margin-top: 2rem;
}

.ontchat-config-option p {
    font-size:0.83rem;
}

.ontchat-config-option > label {
    margin-bottom: 0.15rem;
}

.ontchat-range-option {
    display: flex;

}

.ontchat-range-option > span {
    white-space: nowrap;
    margin: 0px 10px;
}

.ontchat-range-option > input {
    width: 65%;
}

.ontchat-message {
    display: flex;
    margin-bottom: 0.35rem;
}

.ontchat-bloc-message {
    animation-duration:0.5s;
    animation-name: slidein;
}

.ontchat-message-deleted > div {
    opacity: 0.2;
    filter: grayscale(100%);
}

.ontchat-message-deleted {
    position: relative;
}

.ontchat-message-deleted:after {
    content: "Message supprimé";
    position: absolute;
    top: 40%;
    left: 50%;
    color: gray;
    font-weight: bold;
	opacity: 0.7;
}

.ontchat-message-deleted .ontchat-delete,
.ontchat-message-deleted .ontchat-edit {
    display: none;
}

@keyframes slidein {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

.ontchat-toolbar {
    margin: 0 0 .3rem 0;
}

.ontchat-author {
    margin: 0;
    display: inline-block;
    font-size: .875rem;
    font-weight: 600;
    line-height: 1.1;
}

.ontchat-tooltip {
    display: flex;
    float: right;
    color: ##fffdfd;
}

.ontchat-picto {
    margin-right: 0.8rem;
    visibility: hidden;
    font-size: 1rem;
}

.ontchat-bloc-message:hover .ontchat-picto {
    visibility: visible;
    cursor: pointer;
    opacity: 0.25;
}

.ontchat-picto:hover {
    opacity: 1!important;
}

.ontchat-edition {
    display: flex;
}

.ontchat-edition-check {
    color: darkgreen!important;
}

.ontchat-night-mode .ontchat-edition-check {
    color: green!important;
}

.ontchat-edition-cancel {
    color: darkred!important;
}

.ontchat-night-mode .ontchat-edition-cancel {
    color: red!important;
}

.ontchat-edition-textarea {
    outline: none;
    width: 100%;
    background-color: var(--jv-input-bg-color);
}

hr.ontchat-ruler:first-of-type {
    margin-top: auto;
}

.ontchat-ruler {
    opacity: 1;
    margin: 0rem 0rem .35rem 0rem;
    border: 0;
    border-style: solid;
    border-top: 0.0625rem solid #1d1e20;
    border-top-width: 0.0625rem;
    border-bottom-width: 0.0625rem;
    border-block-end-color: #4a4c4f;
    box-sizing: content-box;
    height: 0!important;
    color: unset;
    background-color: unset;
}

#ontchat-ruler-new {
    border-bottom: 1px outset gray;
}

.ontchat-bloc-author-content {
    overflow: hidden;
    width: 100%;
    margin-left: .875rem;
}

.ontchat-content {
    font-size: 0.835rem;
    line-height: 1.1rem;
}

.ontchat-content > .txt-msg > p:last-of-type {
    margin-bottom: 0;
}

.ontchat-content > .txt-msg p {
    margin-bottom: 0.2rem;
}

.ontchat-content .text-enrichi-forum blockquote.blockquote-jv {
    margin: 0.2rem 0;
    padding: 0rem 0.3rem 0 0.3rem;
    color:#8b8b8b;
}

.ontchat-content .text-enrichi-forum .nested-quote-toggle-box {
    position: relative!important;
}

.ontchat-rounded {
    overflow: hidden;
    border-radius: 15%;
    background-size:     cover;
    background-repeat:   no-repeat;
    background-position: center center;
}

.ontchat-bloc-avatar {
    min-width: 40px;
    min-height: 40px;
    width: 40px;
    height: 40px;
    box-shadow: -3px 3px 7px grey;
}

#ontchat-user-avatar-link {
    width: 60%;
    min-width: 3rem;
    min-height: 3rem;
    margin: auto;
}

.ontchat-user-avatar {
    width: 100%;
    padding-top: 100%;
}

.ontchat-content .img-shack {
    height: 39px;
    width: 52px;
    display: inline-block;
    vertical-align: bottom;
    margin-bottom:0.27rem;
    overflow: hidden;
}

.ontchat-content .img-stickers {
    max-height: 39px;
    min-height: 39px;
    width: auto;
    display: inline-block;
    vertical-align: bottom;
    margin-bottom:0.1rem;
}

#ontchat-main .bloc-spoil-jv .open-spoil {
    position: unset;
    display: none;
}

.new-stickers {
    background-color: unset;
}

#ontchat-user-mp {
    font-size: 2rem;
    margin: auto;
    position: relative;
}

#ontchat-user-notif {
    font-size: 2rem;
    margin: auto;
    position: relative;
}

#ontchat-user-notif.has-notif::after,
#ontchat-user-mp.has-notif::after
{
    z-index: 2;
    content: " " attr(data-val) "";
    color: #fff;
    line-height: 1.25rem;
    font-size: 0.9rem;
    padding: 0 .25rem;
    position: absolute;
    top: .6875rem;
    right: -.6875rem;
    background: #ff3c00;
    width: 1.1rem;
    height: 1.1rem;
    border-radius: 1rem;
}

#ontchat-user-pseudo {
    margin: 0.5rem;
    text-align: center;
    font-size: 1.125rem;
    font-weight: 500;
    line-height: 1.1;
    /* overflow-x: hidden; */
}

#ontchat-user-info {
    display: flex;
}

#ontchat-mp-and-notif {
    position: unset;
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: auto;
}

#ontchat-topic-link {
    color: white;
}

#ontchat-topic-info {
    display: flex;
    flex-direction: column;
}

#ontchat-topic-nb-connected {
    color: lightgray;
}

#ontchat-topic-nb-messages {
    color: lightgray;
}

#bloc-formulaire-forum .jv-editor > .conteneur-editor {
    margin: 0;
    border: 0;
    padding: 0.5rem;
    line-height: normal;
}

#ontchat-main {
    overflow-y: auto;
    padding: 0.35rem 0.875rem;
    display: flex;
    flex-direction: column;
}

#ontchat-leftbar > .panel-jv-forum {
    height: 100%;
    overflow-y: auto;
}

#ontchat-leftbar.ontchat-leftbar-reduced {
    flex-grow: 0;
}

#ontchat-leftbar.ontchat-leftbar-reduced > .panel > .panel-body {
    display: none;
}

#ontchat-leftbar.ontchat-leftbar-reduced #ontchat-leftbar-button {
    position: relative;
}

#ontchat-leftbar.ontchat-leftbar-reduced span {
    padding: 0;
}

#ontchat-leftbar > .panel {
    position: relative;
}

.disabled-content {
    opacity: 0.3;
    cursor: not-allowed;
    pointer-events: none;
}

#ontchat-sondage-bloc {
    background: unset;
    padding: 0;
}

#ontchat-sondage-bloc .pourcent {
    background: unset;
    width: 5rem;
}

#ontchat-sondage-bloc .back-barre {
    width: 5rem;
}

#ontchat-sondage-bloc .tab-choix {
    margin-bottom: 1rem;
}

#ontchat-sondage-choix.notanswered .result-pourcent {
    display: none;
}

#ontchat-sondage-choix.notanswered .reponse {
    background:  url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAICAYAAAAx8TU7AAAAG0lEQVQImWP4DwUMyOA/EqBAAkOQsACyILL5ACUbV6n3UrG0AAAAAElFTkSuQmCC') no-repeat left 0.35rem;
    padding-left: 0.7rem;
}

#ontchat-sondage-choix.notanswered .reponse > div {
    cursor: pointer;
}

#ontchat-turbo {
    display: inline-block;
    cursor: pointer;
    margin-top: 0.3rem;
    -webkit-tap-highlight-color: transparent;
    position: relative;
}

#ontchat-turbo i {
    position: relative;
    display: inline-block;
    margin-right: .5rem;
    width: 46px;
    height: 26px;
    background-color: #e6e6e6;
    border-radius: 23px;
    vertical-align: text-bottom;
    transition: all 0.3s linear;
}

#ontchat-turbo i::before {
    content: "";
    position: absolute;
    left: 0;
    width: 42px;
    height: 22px;
    background-color: #fff;
    border-radius: 11px;
    transform: translate3d(2px, 2px, 0) scale3d(1, 1, 1);
    transition: all 0.25s linear;
}

#ontchat-turbo i::after {
    content: "";
    position: absolute;
    left: 0;
    width: 22px;
    height: 22px;
    background-color: #fff;
    border-radius: 11px;
    box-shadow: 0 2px 2px rgba(0, 0, 0, 0.24);
    transform: translate3d(2px, 2px, 0);
    transition: all 0.2s ease-in-out;
}

#ontchat-turbo:active i::after {
    width: 28px;
    transform: translate3d(2px, 2px, 0);
}

#ontchat-turbo:active input:checked + i::after {
    transform: translate3d(16px, 2px, 0);
}

#ontchat-turbo input:checked + i {
    background-color: #4BD763;
}

#ontchat-turbo input:checked + i::before {
    transform: translate3d(18px, 2px, 0) scale3d(0, 0, 0);
}

#ontchat-turbo input:checked + i::after {
    transform: translate3d(22px, 2px, 0);
}

#ontchat-turbo-span {
    position: absolute;
    margin-top: 4px;
}

#ontchat-alerts.ontchat-hide-alerts #ontchat-turbo-warning,
#ontchat-alerts.ontchat-hide-alerts #ontchat-degraded-refresh-warning {
    display: none!important;
}

#ontchat-main.ontchat-hide-mosaics .ontchat-mosaic-root::before {
    content: "Mosaïque Cachée ¯\\\\_(ツ)_/¯";
    color:black;
    text-align:center;
    font-size:10px;
    display:block;
    height:55px;
    width:55px;
    background: white;
    border: solid #f00;
}

#ontchat-main.ontchat-hide-mosaics .ontchat-mosaic-root {
    pointer-events: none;
}


#ontchat-main.ontchat-hide-mosaics .ontchat-mosaic {
    display: none;
}

#ontchat-turbo-delay-range,
#ontchat-max-width-range,
#ontchat-hide-mosaic-checkbox,
#ontchat-hide-mosaic-span,
#ontchat-night-mode-checkbox,
#ontchat-night-mode-span,
#ontchat-load-images-checkbox,
#ontchat-load-images-span,
#ontchat-play-sound-checkbox,
#ontchat-play-sound-span {
    cursor: pointer;
}

.ontchat-night-mode #ontchat-leftbar > .panel {
    background-color: #2F3136!important;
}

.ontchat-night-mode {
    color: #dcddde!important;
    scrollbar-color: #191A1C #2F3136!important;
}

.ontchat-night-mode .ontchat-ruler {
    border-color: #2e3035!important;
    border-top: 1px solid transparent !important;
}

.ontchat-night-mode .conteneur-editor,
.ontchat-night-mode .bloc-editor-forum,
.ontchat-night-mode .ontchat-bloc-message,
.ontchat-night-mode .conteneur-messages-pagi {
    background-color: ${messageBgColor} !important;
}

.ontchat-night-mode #message_topic,
.ontchat-night-mode .btn-group {
    background: #484C52!important;
}

.ontchat-night-mode .ontchat-bloc-avatar {
    box-shadow: -3px 3px 7px black!important;
}

.ontchat-night-mode #ontchat-leftbar > .panel {
    background-color: #2F3136!important;
}

.ontchat-night-mode .ontchat-edition-textarea {
    background: #484c52!important;
}

/*.ontchat-night-mode .ontchat-buttons button {
    background: #484c52!important;
}*/

.ontchat-night-mode .text-enrichi-forum blockquote.blockquote-jv {
    border-left-color: #484C52!important;
}

.ontchat-night-mode .text-enrichi-forum .nested-quote-toggle-box::after {
	background-color: #484c52!important;
	border-color: #737373!important;
	color: #737373!important;
}

.ontchat-night-mode .text-enrichi-forum .nested-quote-toggle-box:hover::before {
	color: #cbcdce!important;
}

.ontchat-night-mode .bloc-spoil-jv .contenu-spoil {
    background-color: #2d2d2d!important;
    border-color: #202020!important;
    color: #dcddde !important;
}

/* Rajout Onche */
a {
    color: #7dc3f7;
    text-decoration: none;
}

input[type="checkbox"] {
    -moz-appearance: auto;
    -webkit-appearance: auto;
}

#content {
    padding: 0;
    background-color: #36393f;
}

.container {
    width: 100%;
}

#ontchat-main {
    flex: 1;
}

.messages {
    background-color: ${messageBgColor} !important;
    display: flex;
    flex-direction: column;
    color: ${fontColor};
}

.message.answer {
    background: ${messageAnswerBgColor} !important;
}

#answer .message-content {
    height: auto;
    max-height: 120px;
    overflow-y: scroll;
}

.bloc.insert-image {
    margin: 0;
    border: 1px solid #2a2d34;
}

.bloc.insert-image > .title {
    display: none;
}

.boc.content {
    padding: 0;
}

.textarea {
    font-size: 1.5em;
    resize: none;
    min-height: 138px;
}

.items {
    flex-direction: column;
}

.format {
    background-color: ${textareaBgColor};
    border-top: 0.0625rem solid ${textareaBorderColor};
    border-bottom: 0.0625rem solid ${textareaBorderColor};
}

.ontchat-textarea-wrapper {
    display: flex;
}

#ontchat-post-2 {
    border-radius: 0;
}

.ontchat-hide-stickers {
    display: none!important;
}

/* Lavydavant */

.panel-jv-forum {
    background-color: #2A2A2A !important;
    border-radius: 0 !important;
}

.panel-body {
        color: #FFFFFF !important;
}

.panel-body .titre-info-fofo {
    color: #ffca20;
    font-weight: 500;
    line-height: 1.1;
    font-size: .875rem;
    text-transform: uppercase;
    border-bottom: .0625rem solid #9c9da7;
    padding-bottom: .5rem;
    margin: 0 0 .5rem;
}

.onchat-quoting {
    cursor: pointer;
    opacity: 0.5;
    margin: 0.3rem;
}

.onchat-quoting:hover {
    opacity: 1;
}

.alert-row {
    flex: 1;
}

#ontchat-mp-and-notif .nav-link, .nav-link-search, .account-pseudo, .jv-account-number-mp, .jv-account-number-notif   {
    color: white !important;
}

.alert.alert-success {
    color: #842029!important;
    background-color: #f8d7da!important;
    border-color: #f5c2c7;
    display: flex;
    filter: brightness(0.85)
    flex-direction: row-reverse;
}

.row.wrap .button.medium.filled.right{
    display: none;
}

.item.onche {
    height: 42px;
}

.ontchat-poll {
	background-color: transparent!important;
    border: none;
	margin: 0;
    padding: 5px;
}

.ontchat-poll-answers{
	flex-direction: column!important;
}

.signature {
    display: none;
}

/* Revert random CSS changes by Webedia */

.ontchat-alert-close {
  float: right;
  font-size: 1.3125rem;
  font-weight: 700;
  line-height: 1;
  color: #000;
  text-shadow: 0 0.0625rem 0 #fff;
  filter: alpha(opacity=20);
  opacity: 0.2;
  padding: 0;
  cursor: pointer;
  background: transparent;
  border: 0;
  -webkit-appearance: none;
  -moz-appearance: none;
  appearance: none;
}

.ontchat-alert-close:focus,
.ontchat-alert-close:hover {
  color: #000;
  text-decoration: none;
  cursor: pointer;
  filter: alpha(opacity=50);
  opacity: 0.5;
}
</style>`;

let PANEL = `
<div id='ontchat-leftbar'>
    <div class='panel panel-jv-forum'>
        <div id="ontchat-leftbar-button">
            <div id="ontchat-leftbar-config">
                <span id="ontchat-leftbar-config-open" class="material-icons" title="Afficher les paramètres">settings</span>
                <span id="ontchat-leftbar-config-close" class="material-icons ontchat-hide" title="Fermer les paramètres">close</span>
            </div>
            <div id="jvchar-leftbar-size">
                <span id="ontchat-leftbar-reduce" class="material-icons icon-arrow-left" title="Masquer la sidebar">arrow_back_ios</span>
                <span id="ontchat-leftbar-extend" class="material-icons icon-arrow-right ontchat-hide" title="Afficher la sidebar">arrow_forward_ios</span>
            </div>
        </div>
        <div class='panel-body'>
            <div id='ontchat-info'>
                <div id='ontchat-profil' class='ontchat-hide'>
                    <h4 class='titre-info-fofo'>Profil</h4>
                    <h4 id='ontchat-user-pseudo'></h4>
                    <div id='ontchat-user-info'>
                        <a title="Ouvrir le profil" id="ontchat-user-avatar-link" target="_blank"><div id='ontchat-user-avatar' class='ontchat-rounded ontchat-user-avatar'></div></a>
                        <div id='ontchat-mp-and-notif'>
                        <a target="_blank" href="https://onche.org/chat" title="Ouvrir la boîte de réception" id="ontchat-user-mp-link">
                            <span id="ontchat-user-mp" class="material-icons jv-account-number-mp" data-val="0">email</span>
                        </a>
                        </div>
                    </div>
                </div>
                <div id='ontchat-topic'>
                    <h4 class='titre-info-fofo'>Topic</h4>
                    <div id="ontchat-topic-info">
                        <div><strong><a title="Ouvrir le topic" id="ontchat-topic-title"></a></strong></div>
                        <span id="ontchat-topic-nb-connected"></span>
                        <span id="ontchat-topic-nb-messages"></span>
                        <!-- <label id="ontchat-turbo" title="Actualise la liste des messages plus rapidement">
                            <input id="ontchat-turbo-checkbox" type="checkbox">
                            <i></i>
                            <span id="ontchat-turbo-span">Mode Turbo</span>
                        </label> -->
                    </div>
                </div>
                <div id='ontchat-forum'>
                    <h4 class='titre-info-fofo'>Forum</h4>
                    <div id="ontchat-forum-info">
                        <div><strong><a title="Ouvrir le forum" id="ontchat-forum-title"></a></strong></div>
                    </div>
                </div>
                <div id='ontchat-sondage' class='ontchat-hide'>
                    <h4 class='titre-info-fofo'>Sondage</h4>
                    <div id="ontchat-sondage-bloc" class="bloc-sondage">
                        <label><span id="ontchat-sondage-intitule"></span></label>
                        <table class="tab-choix"><tbody id="ontchat-sondage-choix" class="notanswered"></tbody></table>
                        <span id="ontchat-sondage-votes"></span>
                    </div>
                </div>
            </div>
            <div id='ontchat-config' class='ontchat-hide'>
                <div id='ontchat-configuration'>
                    <h4 class='titre-info-fofo'>Configuration</h4>
                    <p id='ontchat-configuration-intro'><i>Les paramètres sont automatiquement sauvegardés et mis à jour lorsque vous les modifiez.</i></p>
                    <div class="ontchat-config-option" id="ontchat-play-sound">
                        <label>
                            <input id="ontchat-play-sound-checkbox" type="checkbox">
                            <span id="ontchat-play-sound-span">Alerte sonore</span>
                        </label>
                        <p>Joue un son de notification lorsqu'un nouveau message est posté et que vous êtes sur un onglet différent.</p>
                    </div>
                    <!-- <div class="ontchat-config-option" id="ontchat-night-mode">
                        <label>
                            <input id="ontchat-night-mode-checkbox" type="checkbox">
                            <span id="ontchat-night-mode-span">Thème sombre</span>
                        </label>
                        <p>Active un mode nuit pour protéger vos petits yeux fatigués le soir.</p>
                    </div> -->
                    <div class="ontchat-config-option" id="ontchat-load-imagesc">
                        <label>
                            <input id="ontchat-load-images-checkbox" type="checkbox">
                            <span id="ontchat-load-images-span">Charger les images</span>
                        </label>
                        <p>Remplace les miniatures NoelShack avec l'image source complète afin de laisser apparaître la transparence (cela sollicite davantage votre connexion Internet).</p>
                    </div>
                    <div class="ontchat-config-option" id="ontchat-hide-mosaic">
                        <label>
                            <input id="ontchat-hide-mosaic-checkbox" type="checkbox">
                            <span id="ontchat-hide-mosaic-span">Masquer les mosaïques</span>
                        </label>
                        <p>Cache automatiquement les mosaïques d'images NoelShack pour réduire le flooding.</p>
                    </div>
                    <div class="ontchat-config-option" id="ontchat-hide-stickers">
                        <label>
                            <input id="ontchat-hide-onche-stickers-checkbox" type="checkbox">
                            <span id="ontchat-hide-onche-stickers-span">Masquer les stickers favoris d'Onche</span>
                        </label>
                        <p>Cache automatiquement la barre des stickers favoris d'Onche.</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
`;

let freshHash = undefined;
let freshDeletionHash = undefined;
let freshForm = undefined;
let firstMessageId = undefined;
let firstMessageDate = undefined;
let lastEditionTime = {};  // id => [timestamp, edition, deleted]
let messagesByPage = {};
let userConnected = undefined;
let updateIntervals = [2, 3, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 10, 10, 10, 10, 10, 10, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 30, 30, 30, 30, 30, 30, 30, 30, 60];
let transisitions = [0, 0, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 13, 19, 19, 19, 19, 19, 19, 19, 19, 31];
let updateIntervalIdx = 2;
let updateIntervalMax = updateIntervals.length - 1;
let isLocked = false;
let isError = false;
let isReduced = true;
let nbNewMessage = 0;
let topicNbMessages = 0;
let favicon = undefined;
let faviconLoaded = false;
let faviconTextWhenLoaded = "";
let currentUser = { notif: undefined, mp: undefined, author: undefined, avatar: undefined };
let currentTopicTitle = undefined;
let turboActivated = false;
let turboDateActivated = undefined;
let turboWarnTimeoutId = -1;
let turboDateSessions = [];
let refreshDegraded = false;
let refreshDegradedTimeoutId = -1;
let timeoutedDates = [];
let refreshInfosAcceptable = [];
let sondageChoices = undefined;
let urlToFetch = undefined;
let urlToRefreshInfos = undefined;
let urlToCheckEdited = undefined;
let currentFetchedPage = 1;
let currentTimeoutId = -1;
let shouldCheckEdited = false;
let checkEditedInterval = 30000;
let refreshInfosTimeoutId = -1;
let postingMessage = false;
let fetchingMessages = false;
let leavingTopic = false;
let storageKey = "ontchat-configuration";
let ringBell = undefined;
let configuration = undefined;

let sondageExist = false;
let counterSondage = 0;

function defaultConfig() {
    return {
        default_reduced: false,
        turbo_delay: 1000,
        max_width: 100,
        hide_alerts: false,
        play_sound: false,
        night_mode: false,
        load_images: false,
        hide_mosaic: false,
        hide_stickers: false,
        turbo_alerted: false,
        sound: "data:audio/mp3;base64, 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KZ+4/J4hhPMbxk9uZlkvh6/jLtS6T9noZlleNzM1apGt+7CwkdfONPpLpNT0rivtF6d5JRejlihnmuTMIf3OWsl7KKKapZHQ3IBmnFlUchyHaOIzN+Syuo2SUVYPlNqCn+n4xG78SrR1lD/QTSyWlcKHJychjdSVSWMwDAM3EY7Rf/////4vzXlEEQJGHKsO7LsZ6U2J2PwPQf/////wNDUARKBH5g6tXeyKSKCcnRpY3DcYAAEAAAMEoLwyQhqjAOAaMLkNqt00SR7TGnEwMCcLkwGAN/0YLQF4kEeYBQBxgMgDf5zDxADC4wy5TXmbBm6JJimNECMEY0V/+ZUKbI8RFS75hwiwRgQhhQ3//mSGBgiSmIDAYQ8RaowYaYQy///4FAgIFCFcICDBAACE//uSxO0AK+Iu+xnsAAT7PuBXPaAAsrSBICGWxf///q8USLIIaMqLIIUF1n1hhHpwYQrd////69i6hehbyJiOCcatiVjSXVaU3Fpsebiy2x/////+jW3RSxAe2JliKcPPIim67osRh10V2u7ALDWcx1hv///////DiG7T48oOzeXsjTHhtmap3fdFMdYWZaysLddlhtaIrlpqFlMSp//////////3Hh1Qdf8HMPUvasytPttG5svXpBLO1LJlr//////7WYlRuzEotEYCfqZiTvX4k5UPRJynekxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqkxBTUUzLjEwMKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqv/7ksQ5A8AAAaQcAAAgAAA0gAAABKqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqo="
    };
}

function saveConfig() {
    let config = JSON.stringify(configuration);
    localStorage.setItem(storageKey, config);
}

function loadConfig() {
    let config = JSON.parse(localStorage.getItem(storageKey) || "{}");
    for (let key in config) {
        if (config.hasOwnProperty(key) && configuration.hasOwnProperty(key)) {
            configuration[key] = config[key];
        }
    }
}

function getTimestamp() {
    return new Date().getTime();
}

function escape(str, isAttribute) {
    str = str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    if (isAttribute) {
        str = str.replace(/"/g, "&quot;").replace(/'/g, "&#039;");
    }
    return str;
}

function getForm(doc) {
    return doc.getElementById("post").firstChild;
}

function getTopicLocked(elem) {
    let lock = elem.getElementsByClassName("message-lock-topic")[0];
    if (lock === undefined) {
        return lock;
    }
    let reason = lock.getElementsByTagName("span")[0].textContent.trim();
    return `Le topic a été verrouillé pour la raison suivante : "${reason}"`;
}

function getTopicError(elem) {
    let error = elem.getElementsByClassName("img-erreur")[0];
    if (error === undefined) {
        return error;
    }
    return `Le topic présente une erreur: ${error.getAttribute("alt")}`;
}

function tryCatch(func) {
    function wrapped(optArg) {
        try {
            func(optArg);
        } catch (err) {
            let message = `Une erreur est survenue dans ontchat: '${err.message}' (function '${func.name}', line ${err.lineNumber})`;
            console.error("===== ontchat ERROR =====");
            console.error(message)
            console.error(err);
            console.error("========================");
            try {
                addAlertbox("danger", message);
            } catch (e) {
                alert(message);
            }
        }
    }
    return wrapped;
}

function toggleTextarea() {
    isReduced = !isReduced;
    configuration["default_reduced"] = isReduced;
    saveConfig();

    let isDown = isScrollDown();
    document.getElementsByClassName("format")[0].classList.toggle("ontchat-hide");
    document.getElementById("ontchat-enlarge").classList.toggle("ontchat-hide");
    document.getElementById("ontchat-reduce").classList.toggle("ontchat-hide");
    document.getElementById("ontchat-post").classList.toggle("ontchat-hide");
    document.getElementById("ontchat-post-2").classList.toggle("ontchat-hide");
    document.getElementsByClassName("textarea")[0].classList.toggle("ontchat-reduced");

    // document.getElementsByClassName("favoriteStickers")[0].classList.toggle("ontchat-hide");

    let risiOnche = document.getElementsByClassName("quote-risionche")[0];

    if (risiOnche) {
        risiOnche.classList.toggle("ontchat-hide");
    }

    setTextareaHeight();

    if (isDown) {
        setScrollDown();
    }
}

function parseURL(url) {
    let regex = /^(.*?)\/(\d+)\/([\w-]+)\/?(\d*)\/?(.*)?$/i;
    let [_, domain, ids, title, page, anchor] = url.match(regex); 
    return { domain: domain, ids: ids, title: title, page: page, anchor: anchor };
}

function buildURL(dict) {
    return `${dict.domain}/${dict.ids}/${dict.title}${(dict.page) ? '/' + dict.page : ''}${(dict.anchor) ? '/' + dict.anchor : ''}`;
}

function getForum(document) {
    let link = document.getElementsByClassName("links")[0].getElementsByClassName("active")[0];

    return { href: link.href, title: link.textContent };
}

function getLastPage(document) {
    let blocPages = document.getElementsByClassName("pagination")[0];
    let ahrefs = blocPages.getElementsByTagName("a");
    let lastPage = 1;
    for (let ahref of ahrefs) {
        let page = parseInt(ahref.textContent.trim());
        if (!isNaN(page) && page > lastPage) {
            lastPage = page;
        }
    }
    return lastPage;
}


function parseMessage(elem) {
    let conteneur = elem;
    let author = conteneur.getElementsByClassName("message-username")[0].textContent.trim();
    //badge
    let avatar = conteneur.getElementsByClassName("avatar")[0];
    if (avatar !== undefined) {
        avatar = avatar.getAttribute("src");
    }
    let date = conteneur.getElementsByClassName("message-date")[0].getAttribute("title").trim();
    let content = conteneur.querySelectorAll(":scope > .message-content")[0];
    let message_answer = conteneur.getElementsByClassName("message answer")[0];

    let id = parseInt(conteneur.getAttribute("data-id"));
    let id_message_author = parseInt(conteneur.getAttribute("data-user-id"));
    let edited = elem.getElementsByClassName("edited")[0];
    if (edited !== undefined) {
        let msgEdited = edited.getAttribute("title").trim();
        edited = msgEdited.match(/Publié le (\d{2}\/\d{2}\/\d{4}) à (\d{2}\:\d{2}\:\d{2}) et modifié le (\d{2}\/\d{2}\/\d{4}) à (\d{2}\:\d{2}\:\d{2})/i)[4];
    }
    return {
        author: author, dateString: date, date: parseDate(date), avatar: avatar,
        id: id, content: content, id_message_author: id_message_author, message_answer: message_answer, edited: edited
    };
}

function parseUserInfo(elem) {
    let accountMp = elem.getElementsByClassName("account__badge")[0];
    if (accountMp === undefined) {
        return { author: undefined, avatar: undefined, mp: undefined, notif: undefined };
    }
    let accountNotif = elem.getElementById("notification-button"); // mdi-notification-button
    let avatarBox = elem.getElementsByClassName("account")[0].getElementsByClassName("avatar")[0];
    let authorBox = elem.getElementsByClassName("account")[0].getElementsByTagName("span")[0];
    let mp = parseInt(accountMp.getAttribute("data-chat-nb"));
    let notif = parseInt(accountNotif.getAttribute("data-nb"));
    let avatar = avatarBox.src;
    let author = authorBox.textContent.trim();
    return { author: author, avatar: avatar, mp: mp, notif: notif };
}

function getPage(elem) {
    let pageActive = elem.getElementsByClassName("active")[0];
    let page = 1;
    if (pageActive !== undefined) {
        page = parseInt(pageActive.textContent.trim());
    }
    return page;
}

function parseTopicInfo(elem) {
    let title = elem.getElementsByClassName('title is_sticky')[0].getElementsByTagName("h1")[0].textContent.trim();
    let connected = parseInt(elem.getElementsByClassName("bloc border green")[0].getElementsByClassName("content rows")[0].getElementsByTagName("span")[1].textContent.trim());
    let lastPage = getLastPage(elem);
    let page = getPage(elem);
    return { title: title, connected: connected, lastPage: lastPage, page: page };
}

function fixMessage(elem) {
    let jvcares = Array.from(elem.getElementsByClassName("JvCare"));
    for (let jvcare of jvcares) {
        let a = document.createElement("a");
        a.setAttribute("target", "_blank");
        a.setAttribute("href", jvCake(jvcare.getAttribute("class")));
        a.innerHTML = jvcare.innerHTML;
        jvcare.outerHTML = a.outerHTML;
    }
    let togglableQuotes = Array.from(elem.querySelectorAll(".text-enrichi-forum > blockquote > blockquote"));
    for (let togglableQuote of togglableQuotes) {
        let toggleButton = document.createElement("div");
        toggleButton.classList.add("nested-quote-toggle-box");
        togglableQuote.insertBefore(toggleButton, togglableQuote.firstChild);
        // The click event is bound in the "dontScrollOnExpand()" function
    }
}

function jvCake(cls) {
    let base16 = '0A12B34C56D78E9F', lien = '', s = cls.split(' ')[1];
    for (let i = 0; i < s.length; i += 2) {
        lien += String.fromCharCode(base16.indexOf(s.charAt(i)) * 16 + base16.indexOf(s.charAt(i + 1)));
    }
    return lien;
}

function detectMosaic(elem) {
    let imagesShack = elem.getElementsByClassName("img-shack");
    if (imagesShack.length < 4) {
        return;
    }
    let mosaics = {};
    let regex1 = /^.+\/(?:[0-9]+-)+[0-9]{1,2}-([a-z0-9]+)\.\w+$/i;
    let regex2 = /^.+\/(?:[0-9]+-)+row-[0-9]+-col-[0-9](?:-[0-9]+)?\.\w+$/i;
    for (let image of imagesShack) {
        let match1 = image.src.match(regex1);
        if (match1) {
            let [_, identifier] = match1;
            if (mosaics.hasOwnProperty(identifier)) {
                mosaics[identifier].push(image);
            } else {
                mosaics[identifier] = [image];
            }
            continue;
        }
        let match2 = image.src.match(regex2);
        if (match2) {
            if (mosaics.hasOwnProperty("@rowcol")) {
                mosaics["@rowcol"].push(image);
            } else {
                mosaics["@rowcol"] = [image];
            }
            continue;
        }
    }
    for (let identifier in mosaics) {
        let images = mosaics[identifier];
        if (images.length < 4) {
            continue;
        }
        images[0].parentNode.classList.add("ontchat-mosaic-root");
        images[0].classList.add("ontchat-mosaic");
        for (let image of images.slice(1)) {
            image.parentNode.classList.add("ontchat-mosaic");
        }
    }
}

function improveImages(elem) {
    let imagesShack = elem.getElementsByClassName("img-shack");
    for (let image of imagesShack) {
        let src = image.src;
        let parent = image.parentNode;
        let extension = parent.href.split(".").pop();
        let direct = src.replace(/(.*?)\/minis\/(.*)\.\w+/i, "$1/fichiers/$2." + extension);
        image.setAttribute("data-src-mini", src);
        image.setAttribute("data-src-direct", direct);
        image.classList.add("ontchat-loadable-image");
        parent.href = direct;
        if (extension.toUpperCase() === "GIF") {
            image.src = direct;
            image.classList.remove("ontchat-loadable-image");
        } else if (configuration["load_images"]) {
            image.src = direct;
        }
        src = image.src;
        image.setAttribute("onerror", `this.onerror=null;this.src=this.getAttribute("data-src-direct");this.classList.remove("ontchat-loadable-image");`);
    }
}

function clearPage(document) {
    let buttons = `
    <div id="ontchat-buttons-main-2" class='ontchat-buttons'>
        <button id='ontchat-post-2' tabindex="4" type="button" class='ontchat-button-top icon-reply material-icons' title="Envoyer le message">send</button>
    </div>
    <div id="ontchat-buttons-main" class='ontchat-buttons'>
        <button id='ontchat-post' tabindex="4" type="button" class='ontchat-hide ontchat-button-top icon-reply material-icons' title="Envoyer le message">send</button>
        <button id='ontchat-reduce' tabindex="5" type="button" class='ontchat-hide ontchat-button-bottom icon-arrow-down-entypo material-icons' title="Réduire la zone de texte">expand_more</button>
        <button id='ontchat-enlarge' tabindex="4" type="button" class='ontchat-button-solo icon-arrow-up-entypo material-icons' title="Agrandir la zone de texte">expand_less</button>
    </div>`;

    document.head.insertAdjacentHTML("beforeend", CSS);

    let messageTopic = document.getElementsByClassName("textarea")[0];
    
    // remove previsu
    messageTopic.removeAttribute("data-preview");

    if (messageTopic) {
        let form = messageTopic.parentElement;
        let answerDiv = document.getElementById("answer");
        answerDiv.insertAdjacentHTML("afterend", "<div class='ontchat-textarea-wrapper'></div>");
        let textareaWrapper = document.getElementsByClassName("ontchat-textarea-wrapper")[0];
        textareaWrapper.appendChild(messageTopic.parentNode.removeChild(messageTopic));

        let format = document.getElementsByClassName("format")[0];
        format.classList.add('ontchat-hide');
        textareaWrapper.appendChild(format.parentNode.removeChild(format));

        textareaWrapper.insertAdjacentHTML("beforeend", buttons);

        messageTopic = document.getElementsByClassName("textarea")[0];
        messageTopic.classList.add("ontchat-textarea");
        messageTopic.setAttribute("placeholder", "Hop hop hop, le message ne va pas s'écrire tout seul !");
        messageTopic.addEventListener("keydown", tryCatch(postMessageIfEnter));
        form.addEventListener('submit', tryCatch(postingMessageOnche));
        document.getElementById("ontchat-post").addEventListener("click", tryCatch(postingMessageOnche));
        document.getElementById("ontchat-post-2").addEventListener("click", tryCatch(postingMessageOnche));
        document.getElementById("ontchat-enlarge").addEventListener("click", tryCatch(toggleTextarea));
        document.getElementById("ontchat-reduce").addEventListener("click", tryCatch(toggleTextarea));
    }
    document.getElementsByClassName("messages")[0].insertAdjacentHTML("afterbegin", "<div id='ontchat-main'><hr class='ontchat-ruler'></div>");
    document.getElementById("left").insertAdjacentHTML("afterbegin", "<div id='ontchat-alerts'><div id='ontchat-fixed-alert' class='ontchat-hide'><div class='alert-row'></div></div><div id='ontchat-turbo-warning' class='ontchat-hide'><button class='close ontchat-alert-hide' aria-hidden='true' data-dismiss='alert' type='button'>×</button><div class='alert-row'></div></div><div id='ontchat-degraded-refresh-warning' class='ontchat-hide'><div class='alert-row'></div></div></div>");

    document.getElementsByClassName("container")[0].insertAdjacentHTML("afterbegin", PANEL);
    document.getElementsByClassName("container")[0].insertAdjacentHTML("beforeend", "<div id='ontchat-right-padding'></div>");

    document.getElementById("content").classList.add("ontchat-root");
    document.getElementsByClassName("textarea")[0].classList.add("ontchat-reduced");

    let risiOnche = document.getElementsByClassName("quote-risionche")[0];

    if (risiOnche) {
        risiOnche.classList.add("ontchat-hide")
    }

    document.getElementsByClassName("bloc insert-image")[0].classList.add("ontchat-hide");

    document.getElementById("ontchat-main").addEventListener("click", tryCatch(dontScrollOnExpand));

    document.getElementById("ontchat-alerts").addEventListener("click", tryCatch(closeAlert));

    let sondage = document.getElementsByClassName("poll")[0];
    if (!!sondage) {
        sondageExist = true;
        let sondageTitle = sondage.getElementsByTagName("h2")[0];
        sondageTitle.classList.add("ontchat-hide");

        sondage.classList.add("ontchat-poll");
        sondage.getElementsByClassName("poll-answers")[0].classList.add("ontchat-poll-answers");

        document.getElementById("ontchat-sondage").classList.toggle("ontchat-hide");
        let sondageBloc = document.getElementById("ontchat-sondage-bloc");
        let sondageOntchat = sondage.cloneNode(true);
        sondage.classList.add("ontchat-hide");
        sondageBloc.insertBefore(sondageOntchat, sondageBloc.firstChild);
        
        sondageTitle.classList.add("ontchat-hide");
        if (sondageTitle.textContent.length > 7){
            let numberVotes = sondageTitle.textContent.match(/\d+/)[0];
            document.getElementById("ontchat-sondage-votes").textContent = `(${numberVotes} votes)`;
        }
    }

    document.getElementById("ontchat-leftbar-config-open").addEventListener("click", tryCatch(toggleConfig));
    document.getElementById("ontchat-leftbar-config-close").addEventListener("click", tryCatch(toggleConfig));

    document.getElementById("ontchat-play-sound-checkbox").checked = configuration["play_sound"];
    document.getElementById("ontchat-play-sound-checkbox").addEventListener("change", tryCatch(togglePlaySoundOption));

    document.getElementById("ontchat-hide-onche-stickers-checkbox").checked = configuration["hide_stickers"];
    document.getElementById("ontchat-hide-onche-stickers-checkbox").addEventListener("change", tryCatch(toggleOncheStickersOption));


    if (configuration["hide_stickers"]){
        document.getElementsByClassName("favoriteStickers")[0].classList.add("ontchat-hide-stickers");
    }

    document.getElementById("content").classList.add("ontchat-night-mode");

    document.getElementById("ontchat-hide-mosaic-checkbox").checked = configuration["hide_mosaic"];
    document.getElementById("ontchat-hide-mosaic-checkbox").addEventListener("change", tryCatch(toggleHideMosaicOption));
    if (configuration["hide_mosaic"]) {
        document.getElementById("ontchat-main").classList.add("ontchat-hide-mosaics");
    }

    if (configuration["hide_alerts"]) {
        document.getElementById("ontchat-alerts").classList.add("ontchat-hide-alerts");
    }

    document.getElementById("ontchat-load-images-checkbox").checked = configuration["load_images"];
    document.getElementById("ontchat-load-images-checkbox").addEventListener("change", tryCatch(toggleLoadImagesOption));

    // change la position du submit pour mettre dans la div messages
    let submitForm = document.getElementsByClassName("bloc insert-image")[0];
    let submitFormCut = submitForm.parentNode.removeChild(submitForm);
    let messages = document.getElementsByClassName("messages")[0];
    messages.insertBefore(submitFormCut, messages.children[1]);

    let favs = Array.from(document.querySelectorAll("link[rel='icon'], link[rel='shortcut icon']"));
    for (let fav of favs) {
        fav.parentElement.removeChild(fav);
    }
    setFavicon("");

    document.addEventListener("visibilitychange", function () {
        let hidden = document.hidden;
        if (hidden) {
            let newHr = document.getElementById("ontchat-ruler-new");
            if (newHr) {
                newHr.removeAttribute("id");
            }
            nbNewMessage = 0;
        } else if (!isError && !isLocked) {
            setFavicon("");
        }
    });

    document.getElementsByClassName("bloc insert-image")[0].addEventListener("click", tryCatch(deleteAnswer));
}

function deleteAnswer(event) {
    if(event.target.classList.contains(".mdi-close"))
    {
        console.log("abc");
    }
}

function toggleSidebar(event) {
    let isDown = isScrollDown();
    document.getElementById("ontchat-leftbar-extend").classList.toggle("ontchat-hide");
    document.getElementById("ontchat-leftbar-reduce").classList.toggle("ontchat-hide");
    document.getElementById("ontchat-leftbar-config").classList.toggle("ontchat-hide");
    document.getElementById("ontchat-leftbar").classList.toggle("ontchat-leftbar-reduced");
    if (isDown) {
        setScrollDown();
    }
}

function toggleConfig(event) {
    document.getElementById("ontchat-leftbar-config-open").classList.toggle("ontchat-hide");
    document.getElementById("ontchat-leftbar-config-close").classList.toggle("ontchat-hide");
    document.getElementById("ontchat-info").classList.toggle("ontchat-hide");
    document.getElementById("ontchat-config").classList.toggle("ontchat-hide");
}

function forceUpdate() {
    // If waiting for next update, restart it immediately, otherwise just wait for the HTTP request to end
    if (!fetchingMessages) {
        clearTimeout(currentTimeoutId);
        updateMessages(currentFetchedPage, true);
    }
}

function scheduleTurboWarningDelay() {
    let now = getTimestamp();
    let maxAllowedTime = 60 * 1000;
    let lookupTime = now - 90 * 1000;
    let nbToCleanup = 0;
    let duration = 0;

    for (let session of turboDateSessions) {
        let begin = session[0];
        let end = session[1];
        if (end < lookupTime) {
            nbToCleanup++;
            continue;
        }
        duration += end - Math.max(lookupTime, begin);
    }

    for (let i = 0; i < nbToCleanup; i++) {
        turboDateSessions.shift();
    }

    let remainingTimeAllowed = Math.max(0, maxAllowedTime - duration);
    turboDateActivated = now;
    turboWarnTimeoutId = setTimeout(tryCatch(setTurboWarning), remainingTimeAllowed);
}

function togglePlaySoundOption(event) {
    let checked = document.getElementById("ontchat-play-sound-checkbox").checked;
    configuration["play_sound"] = checked;
    saveConfig();
}

function toggleHideMosaicOption(event) {
    let checked = document.getElementById("ontchat-hide-mosaic-checkbox").checked;
    configuration["hide_mosaic"] = checked;
    saveConfig();
    let isDown = isScrollDown();
    document.getElementById("ontchat-main").classList.toggle("ontchat-hide-mosaics");
    if (isDown) {
        setScrollDown();
    }
}

function toggleLoadImagesOption(event) {
    let checked = document.getElementById("ontchat-load-images-checkbox").checked;
    configuration["load_images"] = checked;
    saveConfig();
    for (let image of document.getElementsByClassName("ontchat-loadable-image")) {
        image.src = image.getAttribute(checked ? "data-src-direct" : "data-src-mini");
    }
}

function toggleOncheStickersOption(event) {
    let checked = document.getElementById("ontchat-hide-onche-stickers-checkbox").checked;
    configuration["hide_stickers"] = checked;
    saveConfig();
    document.getElementsByClassName("favoriteStickers")[0].classList.toggle("ontchat-hide-stickers");
}

// function toggleRisioncheOption(event) {

// }

function adjustMaxWidth(maxWidth) {
    document.getElementById("forum-main-col").style["flex-grow"] = maxWidth;
    document.getElementById("ontchat-right-padding").style["flex-grow"] = 100 - maxWidth;
}

function closeAlert(event) {
    let target = event.target;
    if (!target) {
        return;
    }
    if (target.classList.contains("ontchat-alert-close")) {
        let parent = target.parentElement;
        parent.parentElement.removeChild(parent);
    } else if (target.classList.contains("ontchat-alert-hide")) {
        let parent = target.parentElement;
        parent.classList.add("ontchat-hide");
    }
}

function postingMessageOnche(e) {
    e.preventDefault();

    if (freshForm === undefined) {
        addAlertbox("danger", "Impossible de poster le message, aucun formulaire trouvé");
        return;
    }

    let textarea = document.getElementsByClassName("textarea")[0];

    let formData = serializeForm(freshForm);
    formData["message"] = textarea.value;
    if (document.getElementsByName("answer")[0]) {
        formData["answer"] = document.getElementsByName("answer")[0].value;
    }
    let formulaire = document.getElementById("post");

    formulaire.classList.add("ontchat-disabled-form");
    textarea.setAttribute("disabled", "true");

    let timestamp = getTimestamp();

    function onSuccess(res) {
        formulaire.classList.remove("ontchat-disabled-form");
        textarea.removeAttribute("disabled");
        let parsedPage = parsePage(res, timestamp);
        document.getElementById("answer").innerHTML='';
        if (!parsedPage.alert) {
            textarea.value = "";
        }
        setTextareaHeight();
        setScrollDown();
        postingMessage = false;

        if (parsedPage.nbMessagesPage === 20) {
            // Bug si on poste un message générant une nouvelle page : la requête retourne la page
            // courante, donc notre nouveau message n'apparaît pas, il faut forcer un refetch()
            // MAIS il faut attendre un peu, car JVC galère à créer la page...
            setTimeout(tryCatch(forceUpdate), 3000);
        }
    }

    function onError(err, _) {
        addAlertbox("danger", err);
        formulaire.classList.remove("ontchat-disabled-form");
        textarea.removeAttribute("disabled");
        postingMessage = false;
    }

    function onTimeout(err) {
        addAlertbox("warning", err);
        formulaire.classList.remove("ontchat-disabled-form");
        textarea.removeAttribute("disabled");
        postingMessage = false;
    }


    let timeout = 20000;
    if (turboActivated) {
        timeout = 5000;
    }

    postingMessage = true;
    request("POST", document.URL, onSuccess, onError, onTimeout, makeFormData(formData), false, timeout, false);
}

function postMessage() {
    if (freshForm === undefined) {
        addAlertbox("danger", "Impossible de poster le message, aucun formulaire trouvé");
        return;
    }

    let textarea = document.getElementsByClassName("textarea")[0];

    let formData = serializeForm(freshForm);
    formData["message_topic"] = textarea.value;
    let formulaire = document.getElementById("post");

    formulaire.classList.add("ontchat-disabled-form");
    textarea.setAttribute("disabled", "true");

    let timestamp = getTimestamp();

    function onSuccess(res) {
        formulaire.classList.remove("ontchat-disabled-form");
        textarea.removeAttribute("disabled");
        let parsedPage = parsePage(res, timestamp);
        if (!parsedPage.alert) {
            textarea.value = "";
        }
        setTextareaHeight();
        setScrollDown();
        postingMessage = false;

        if (parsedPage.nbMessagesPage === 20) {
            // Bug si on poste un message générant une nouvelle page : la requête retourne la page
            // courante, donc notre nouveau message n'apparaît pas, il faut forcer un refetch()
            // MAIS il faut attendre un peu, car JVC galère à créer la page...
            setTimeout(tryCatch(forceUpdate), 3000);
        }
    }

    function onError(err, _) {
        addAlertbox("danger", err);
        formulaire.classList.remove("ontchat-disabled-form");
        textarea.removeAttribute("disabled");
        postingMessage = false;
    }

    function onTimeout(err) {
        addAlertbox("warning", err);
        formulaire.classList.remove("ontchat-disabled-form");
        textarea.removeAttribute("disabled");
        postingMessage = false;
    }


    let timeout = 20000;
    if (turboActivated) {
        timeout = 5000;
    }

    postingMessage = true;
    request("POST", document.URL, onSuccess, onError, onTimeout, makeFormData(formData), false, timeout, false);
}

function editMessage(bloc) {
    let textarea = bloc.getElementsByClassName("ontchat-edition-textarea")[0];

    let blocEdition = bloc.getElementsByClassName("ontchat-edition")[0];
    let formData = JSON.parse(blocEdition.getAttribute("data-form"));
    formData["message"] = textarea.value;
    formData["action"] = "post";
    formData["token"] = document.getElementById('topic').dataset.token;
    let edition = bloc.getElementsByClassName("ontchat-edition")[0];
    let id = bloc.getAttribute("ontchat-id");
    let messageAnswer = bloc.getElementsByClassName("message answer")[0];

    edition.classList.add("ontchat-disabled-form");
    textarea.setAttribute("disabled", "true");

    let timestamp = getTimestamp();

    function onSuccess(res) {
        edition.classList.remove("ontchat-disabled-form");
        if (res['reset_form']) {
            let reset = document.createElement("html");
            reset.innerHTML = res["hidden_reset"];
            let resetData = serializeForm(reset);
            for (let key in resetData) {
                formData[key] = resetData[key];
            }
            blocEdition.setAttribute("data-form", JSON.stringify(formData));
        }

        textarea.removeAttribute("disabled");
        if (res && res.erreur && res.erreur.length > 0) {
            for (let err of res.erreur) {
                addAlertbox("danger", err);
            }
            return;
        }
        let dom = document;

        let message = getMessagesOnche(bloc);
        message.message_answer = messageAnswer;

        let divMessage = document.getElementsByClassName("message-content")[0].cloneNode(true);

        divMessage.innerHTML = res.message;
        message.content = divMessage;

        addMessages([message], true, timestamp, false);
    }

    function onError(err, _) {
        addAlertbox("danger", err);
        edition.classList.remove("ontchat-disabled-form");
        textarea.removeAttribute("disabled");
    }

    function onTimeout(err) {
        addAlertbox("warning", err);
        edition.classList.remove("ontchat-disabled-form");
        textarea.removeAttribute("disabled");
    }

    let url = `https://onche.org/message/edit/${id}`;

    request("POST", url, onSuccess, onError, onTimeout, makeFormData(formData), true, 20000, false);
}

function requestEdit(bloc) {
    if (!bloc.getElementsByClassName("ontchat-edition")[0].classList.contains("ontchat-hide")) {
        return;
    }

    let contentClasses = bloc.getElementsByClassName("ontchat-content")[0].classList;
    contentClasses.add("disabled-content");


    contentClasses.remove("disabled-content");

    let txtsub = bloc.getElementsByClassName("message-content");
    let text = txtsub[txtsub.length - 1].cloneNode(true);
    cleanQuote(text);
    let txt = text.innerHTML.replace(/<br>/g, "");
    let form = document.getElementsByTagName("form")[0];
    let formData = serializeForm(form);
    let editionBloc = bloc.getElementsByClassName("ontchat-edition")[0];
    editionBloc.setAttribute("data-form", JSON.stringify(formData));
    let height = computeHeight(countLines(txt));
    let isDown = isScrollDown();
    bloc.getElementsByClassName("ontchat-edition-textarea")[0].value = txt;
    bloc.getElementsByClassName("ontchat-edition-textarea")[0].style["height"] = `${height}rem`;
    bloc.getElementsByClassName("ontchat-content")[0].classList.add("ontchat-hide");
    editionBloc.classList.remove("ontchat-hide");
    if (isDown) {
        setScrollDown();
    }
}

function cleanQuote(text) {
    for (const child of text.childNodes) {
        if (child.tagName == "A") {
            const textNode = document.createTextNode(child.href);
            child.replaceWith(textNode);
        }
        else if (child.tagName == "DIV" && child.classList.contains("sticker")) {
            const textNode = document.createTextNode(child.getElementsByTagName("img")[0].getAttribute("title"));
            child.replaceWith(textNode);

        }
        else if (child.tagName == "DIV" && child.classList.contains("youtube")) {
            if (child.hasChildNodes()) {
                let textNode;
                if (child.getElementsByTagName("iframe")[0].src.includes("youtube")) 
                    textNode = document.createTextNode(youtubeURL(child.getElementsByTagName("iframe")[0].src));
                else 
                    textNode = document.createTextNode(child.getElementsByTagName("iframe")[0].src);
                child.replaceWith(textNode);
            }
        }
        else if (child.tagName == "DIV" && child.classList.contains("_format _gif")) {
            const textNode = document.createTextNode(child.getElementsByTagName("img")[0].src);
            child.replaceWith(textNode);
        }
    }
}

function youtubeURL(url) {
    const match = url.match(/(?:embed\/|watch\?v=)([^&?]*)&?(t=(\d*))?/);

    const videoId = match[1];
    const startTime = match[3];

    return `https://www.youtube.com/watch?v=${videoId}${startTime ? `&t=${startTime}` : ''}`;
}

function requestDelete(bloc) {
    let contentClasses = bloc.getElementsByClassName("ontchat-content")[0].classList;
    contentClasses.add("disabled-content");

    let id = parseInt(bloc.getAttribute("ontchat-id"));

    function onSuccess(res) {
        contentClasses.remove("disabled-content");
        if (res && res.erreur && res.erreur.length > 0) {
            for (let err of res.erreur) {
                addAlertbox("danger", err);
            }
            return;
        }

        let [timestamp, edition, deleted] = lastEditionTime[id];
        

        if (deleted === true) {
            return;
        }

        let isDown = isScrollDown();

        if (!bloc.getElementsByClassName("ontchat-edition")[0].classList.contains("ontchat-hide")) {
            bloc.getElementsByClassName("ontchat-content")[0].classList.remove("ontchat-hide");
            bloc.getElementsByClassName("ontchat-edition")[0].classList.add("ontchat-hide");
        }

        bloc.closest(".ontchat-message").classList.add("ontchat-message-deleted");
        lastEditionTime[id] = [timestamp, edition, true];

        if (isDown) {
            setScrollDown();
        }
    }

    function onError(err, _) {
        addAlertbox("danger", err);
        contentClasses.remove("disabled-content");
    }

    function onTimeout(err) {
        addAlertbox("warning", err);
        contentClasses.remove("disabled-content");
    }


    let token = document.getElementById('topic').dataset.token;
    let url = `https://onche.org/message/remove/${id}`;
    let deleteData = { token: token };
    request("POST", url, onSuccess, onError, onTimeout, makeFormData(deleteData), true, 5000, false);
}

function countLines(text) {
    return text.split(/\r|\r\n|\n/|"<br>").length;
}

function computeHeight(lines) {
    return 1 * lines + 0.6;
}

function setTextareaHeight(plusOne) {
    let textarea = document.getElementsByClassName("textarea")[0];
    if (!isReduced) {
        textarea.style["height"] = "";
        return;
    }
    plusOne = !!plusOne;
    let lines = countLines(textarea.value);

    if (!plusOne && lines === 1) {
        textarea.style["height"] = "";
        return;
    }

    if (plusOne) {
        lines += 1;
    }

    let height = computeHeight(lines);
    textarea.style["height"] = `${height}rem`;
}

function postMessageIfEnter(event) {
    if (isReduced && (event.which == 13 || event.keyCode == 13)) {
        if (event.shiftKey) {
            let isDown = isScrollDown();
            setTextareaHeight(true);
            if (isDown) {
                setScrollDown();
            }
        } else {
            // event.preventDefault();
            // postMessage();
        }
    }
}

function serializeForm(form) {
    // Useless actually, just use new FormData(form)
    let dict = {};

    for (let select of form.getElementsByTagName("select")) {
        dict[select.name] = select.querySelector("option[selected]").value;
    }

    for (let input of form.getElementsByTagName("input")) {
        dict[input.name] = input.value;
    }

    for (let textarea of form.getElementsByTagName("textarea")) {
        dict[textarea.name] = textarea.value;
    }

    return dict;
}

function makeFormData(dict) {
    var formData = new FormData();
    for (let key in dict) {
        formData.append(key, dict[key]);
    }
    return formData;
}

function getMessages(document) {
    let blocMessages = document.querySelectorAll(".message:not(.answer)");
    let messages = [];
    for (let bloc of blocMessages) {
        messages.push(parseMessage(bloc));
    }
    return messages;
}

function getMessagesOnche(doc) {
    let author = doc.getElementsByClassName("ontchat-author")[0].textContent.trim();
    let avatar = doc.getElementsByClassName("ontchat-bloc-avatar")[0].getAttribute("data-avatar");
    let dateString = doc.getElementsByClassName("message-date")[0].getAttribute("title");
    let [dateCreated, dateEdited] = getOncheDate(dateString);
    let id = doc.getAttribute("ontchat-id");

    return {author: author, avatar: avatar, dateString: dateString, date: dateCreated, edited: dateEdited, id: id};
}

function getSondages(doc) {
    let sondage = doc.getElementsByClassName("poll")[0];
    let arrayAnswers = {};
    let numberVotes = 0;
    if (!!sondage) {
        
        let sondageAnswers = sondage.getElementsByClassName("poll-answer");

        for (let i = 0; i < sondageAnswers.length; i++) {
            let answer = sondageAnswers[i];
            arrayAnswers[answer.getAttribute("data-poll-answer")] = answer.getAttribute("data-percent");
        }

        let sondageTitle = sondage.getElementsByTagName("h2")[0];
        if (sondageTitle.textContent.length > 7){
            numberVotes = +sondageTitle.textContent.match(/\d+/)[0];
        }
    }

    return { answered : arrayAnswers, votes : numberVotes};
}

function updateSondage(choix) {
    let sondage = document.getElementsByClassName("poll")[0];
    if (choix.votes > 0) {
        sondage.getElementsByTagName("h2").textContent = `Sondage – ${choix.votes} votes`;
        document.getElementById("ontchat-sondage-votes").textContent = `(${choix.votes} votes)`;
    }
    else {
        sondage.getElementsByTagName("h2").textContent = `Sondage`;
        document.getElementById("ontchat-sondage-votes").textContent = ``;
    }

    let sondageAnswers = sondage.getElementsByClassName("poll-answer");

    for (let i = 0; i < sondageAnswers.length; i++) {
        let answer = sondageAnswers[i];
        
        if (choix.votes > 0) {
            answer.setAttribute("data-percent", choix.answered[answer.getAttribute("data-poll-answer")]);
            answer.setAttribute("style", `--percent: ${choix.answered[answer.getAttribute("data-poll-answer")]}%`);
        }
        else {
            answer.setAttribute("data-percent", '');
            answer.setAttribute("style", "--percent: false%");
        }
    }

}

function getOncheDate(date) {
    let textDate = date.toLocaleLowerCase();
    if (textDate.includes("et modifié")) {
        let [created, edited] = textDate.split("et modifié");
        created = parseDate(created);
        edited = edited.slice(4);
        [dateEdited, timeEdited] = edited.toLocaleLowerCase().split("à");
        let [day, month, year] = dateEdited.trim().split("/");
        let [hour, minute, second] = timeEdited.trim().split(":");
        return [created, new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second))];
    }
    created = parseDate(textDate);
    return [created, {}];
}

function findDeletedMessages(res, requestTimestamp) {
    let page = getPage(res);
    let blocMessages = res.querySelectorAll('.message:not(.answer)');

    let newIds = []
    let newDates = [];

    for (let bloc of blocMessages) {
        let id = parseInt(bloc.getAttribute("data-id"));
        let date = bloc.getElementsByClassName("message-date")[0].getAttribute("title").trim();
        newIds.push(id);
        newDates.push(date);
    }

    if (!messagesByPage.hasOwnProperty(page)) {
        messagesByPage[page] = [newIds, newDates];
        return;
    }

    let [regIds, regDates] = messagesByPage[page];

    let regLength = regIds.length;
    let newLength = newIds.length;

    messagesByPage[page] = [newIds, newDates];

    for (let i = 0; i < newLength; i++) {
        let id = newIds[i];

        if (!lastEditionTime.hasOwnProperty(id)) {
            continue;
        }

        let [timestamp, edition, deleted] = lastEditionTime[id];

        // Message "ressuscité" (parfois bug, message peut disparaître)
        if (deleted) {
            let msg = document.querySelector(`.ontchat-message[ontchat-id="${id}"]`);
            if (msg) {
                msg.classList.remove("ontchat-message-deleted");
                lastEditionTime[id] = [timestamp, edition, false];
            }
        }
    }

    if (regLength === 0) {
        return;
    }

    if (regLength <= newLength && regIds[0] === newIds[0] && regIds[regLength - 1] === newIds[regLength - 1]) {
        return;
    }

    let after = new Set(newIds);
    let isFirst = true;

    for (let i = 0; i < regIds.length; i++) {
        let id = regIds[i];
        if (after.has(id)) {
            isFirst = false;
            continue;
        }

        // Pas enregistré => blacklist
        if (!lastEditionTime.hasOwnProperty(id)) {
            continue;
        }

        let [timestamp, edition, _] = lastEditionTime[id];

        if (timestamp >= requestTimestamp) {
            continue;
        }

        // Si message en début de page : vérifier qu'il n'est pas sur la page précédente
        // Vérifier aussi les début/fin de page en cas de PEMT, car 2 messages peuvent être "swap"
        if (isFirst || (regDates[i] === newDates[0]) || (newLength === 20 && regDates[i] === newDates[19])) {
            // checkDeleted(id);
            continue;
        }

        let msg = document.querySelector(`.ontchat-message[ontchat-id="${id}"]`);
        if (msg) {
            msg.classList.add("ontchat-message-deleted");
            lastEditionTime[id] = [timestamp, edition, true];
        }
    }
}

function formatDate(date) {
    let now = new Date();
    try {
        now = new Date(now.toLocaleString('en-US', { timeZone: "Europe/Paris" }));
    } catch (e) { }
        let day = date.getDate();
        let month = date.getMonth();
        let year = date.getFullYear();
    if (now.getDate() === day && now.getMonth() === month && now.getFullYear() === year) {
        return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}:${date.getSeconds().toString().padStart(2, "0")}`;
    } else {
        return `${day.toString().padStart(2, "0")}/${(month + 1).toString().padStart(2, "0")}/${year}`;
    }
}

function makeMessage(message) {
    let content = message.content;
    fixMessage(content);
    detectMosaic(content);
    improveImages(content);
    let message_answer_before = message.message_answer;
    let message_answer = '';
    if (message_answer_before) {
        let dateAnswer = message_answer_before.getElementsByClassName("answer-date")[0].getAttribute("title");
        message_answer_before.getElementsByClassName("answer-date")[0].textContent = formatDate(parseDateEdit(dateAnswer));
        let quoteForAnswer = message_answer_before.getElementsByClassName("onchat-quoting")[0];
        if (!quoteForAnswer) {
            quoteForAnswer = message_answer_before.getElementsByClassName("mdi mdi-share")[0];
        }
        if (!quoteForAnswer.classList.contains("material-icons")) {
            quoteForAnswer.classList.add("material-icons" , "onchat-quoting");
            quoteForAnswer.innerHTML = "format_quote";
        }
        if (!quoteForAnswer.classList.contains("onchat-quoting")) {
            quoteForAnswer.classList.add("onchat-quoting");
        }
        if (quoteForAnswer.classList.contains("mdi") && quoteForAnswer.classList.contains("mdi-share"))
            quoteForAnswer.classList.remove("mdi", "mdi-share");
        message_answer = message_answer_before.outerHTML;
    }
    let id = message.id;
    let avatar = message.avatar;
    let toQuoteDate = message.dateString;
    let titleDate = message.dateString;
    let textDate = formatDate(message.date);
    if (message.edited !== undefined) {
        textDate += "*";
        titleDate += ` (édité à ${message.edited})`;
    }
    let exists = avatar !== undefined;
    let author = exists ? message.author : `<i>${message.author}</i>`;
    let authorHref = exists ? `href="https://onche.org/profil/${author}"` : "";
    let authorTitle = exists ? `title="Ouvrir le profil de ${author}"` : "";
    let authorAvatarHidden = exists ? "" : "class='ontchat-hide-visibility'";
    let editionSpan = '<span class="material-icons ontchat-edit ontchat-picto" title="Modifier"> edit </span>';
    let deletionSpan = '<span class="material-icons ontchat-delete ontchat-picto" title="Supprimer"> delete </span>';
    let deletion = (currentUser.author === undefined) || (message.author.toLowerCase() !== currentUser.author.toLowerCase()) ? "" : deletionSpan;
    let edition = (currentUser.author === undefined) || (message.author.toLowerCase() !== currentUser.author.toLowerCase()) ? "" : editionSpan;
    let html =
        `<div class="ontchat-bloc-message">
            <div class="ontchat-message" ontchat-id=${id}>
                <div>
                    <a ${authorAvatarHidden} ${authorHref} target="_blank" ${authorTitle}>
                        <div class="ontchat-bloc-avatar ontchat-rounded" style="background-image: url(${avatar})" data-avatar="${avatar}"></div>
                    </a>
                </div>
                <div class="ontchat-bloc-author-content">
                    <div class="ontchat-toolbar">
                        <h5 class="ontchat-author">${author}</h5>
                        <div class="ontchat-tooltip">
                            ${deletion}
                            ${edition}
                            <span class="material-icons ontchat-picto ontchat-quote picto-msg-quote" title="Citer">format_quote</span>
                            <small class="ontchat-date message-date" to-quote="${toQuoteDate}" title="${titleDate}">${textDate}</small>
                        </div>
                    </div>
                    <div class="ontchat-content">${message_answer}${content.outerHTML}</div>
                    <div class="ontchat-edition ontchat-hide">
                        <textarea class="ontchat-edition-textarea ontchat-textarea"></textarea>
                        <div class="ontchat-buttons">
                            <button tabindex="0" type="button" class='ontchat-edition-check icon-check-jv ontchat-button-top material-icons' title="Valider la modification">check_circle</button>
                            <button tabindex="0" type="button" class='ontchat-edition-cancel icon-cancel-circle ontchat-button-bottom material-icons' title="Annuler la modification">cancel</button>
                        </div>
                    </div>
                </div>
            </div>
            <hr class="ontchat-ruler">
        </div>`;
    return html;
}

function parseDate(string) {
    let [date, time] = string.toLowerCase().split("à");
    date = date.slice(10);
    let [day, month, year] = date.trim().split("/");
    let [hour, minute, second] = time.trim().split(":");
    return new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));
}

function parseDateEdit(string) {
    let [date, time] = string.toLowerCase().split("à");
    let [string_day, day, month, year] = date.trim().split(" ");
    let [hour, minute, second] = time.trim().split(":");
    let monthIndex = ["janvier", "février", "mars", "avril", "mai", "juin", "juillet", "août", "septembre", "octobre", "novembre", "décembre"].indexOf(month.trim().toLowerCase());
    return new Date(parseInt(year), monthIndex, parseInt(day), parseInt(hour), parseInt(minute), parseInt(second));
}

function addMessages(messages, editing, requestTimestamp) {
    let main = document.getElementById("ontchat-main");
    let hasNewMessages = false;
    let init = true;
    let toInsert = "";
    let newMessagesIds = [];
    for (let message of messages) {
        let date = message.date;
        let id = message.id;

        if (init === true && !editing) {
            init = false;
            let now = new Date();
            let delta = now - date;
            if (delta > 5 * 60 * 1000 + checkEditedInterval) {
                shouldCheckEdited = false;
            } else {
                shouldCheckEdited = true;
            }
        }

        if (message.blacklisted) {
            continue;
        }

        if (firstMessageId === undefined) {
            firstMessageId = id;
            firstMessageDate = date;
        }

        // Attention à 2 choses: le changement d'heure et le fait qu'un message suivant un autre peut avoir un id inférieur au précédent
        if (id < firstMessageId && date < firstMessageDate) {
            continue;
        }

        let referenced = lastEditionTime.hasOwnProperty(id);
        let edited = message.edited;

        if (referenced) {
            let [timestamp, edition, deleted] = lastEditionTime[id];
            if (deleted) {
                continue;
            }
            if (timestamp >= requestTimestamp || edition === edited) {
                continue;
            }
        }

        let newBloc = makeMessage(message);

        lastEditionTime[id] = [requestTimestamp, edited, false];

        if (referenced) {
            let selector = `.ontchat-message[ontchat-id="${id}"]`;
            let oldBloc = main.querySelector(selector).closest(".ontchat-bloc-message");
            let isDown = isScrollDown();
            oldBloc.outerHTML = newBloc;
            if (isDown) {
                setScrollDown();
            }
            let event = new CustomEvent('ontchat:newmessage', { 'detail': { id: id, isEdit: true } });
            dispatchEvent(event);
            continue;
        }

        hasNewMessages = true;
        if (nbNewMessage === 0 && document.hidden) {
            let hrs = document.getElementsByClassName("ontchat-ruler");
            let lastHr = hrs[hrs.length - 1];
            lastHr.setAttribute("id", "ontchat-ruler-new");
        }

        toInsert += newBloc;
        newMessagesIds.push(id);
        nbNewMessage++;
    }

    if (toInsert !== "") {
        let isDown = isScrollDown();
        main.insertAdjacentHTML("beforeend", toInsert);
        if (isDown) {
            setScrollDown();
        }
    }

    if (editing) {
        return;
    }

    if (isScrollDown()) {
        let blocMessages = main.getElementsByClassName("ontchat-bloc-message");
        let nb = blocMessages.length;
        if (nb > 100) {
            for (let i = 0; i < nb - 100; i++) {
                main.removeChild(blocMessages[0]);
            }
            setScrollDown();
        }
    }

    if (hasNewMessages) {
        if (!turboActivated && !refreshDegraded) {
            decreaseUpdateInterval();
        }
        if (document.hidden) {
            setFavicon(nbNewMessage > 99 ? 99 : nbNewMessage);
            if (configuration["play_sound"]) {
                ringBell.pause();
                ringBell.currentTime = 0;
                ringBell.play();
            }
        }
        for (let newMessageId of newMessagesIds) {
            let event = new CustomEvent('ontchat:newmessage', { 'detail': { id: newMessageId, isEdit: false } });
            dispatchEvent(event);
        }
    } else {
        if (!turboActivated && !refreshDegraded) {
            increaseUpdateInterval();
        }
    }
}

function parseSondage() {
    let sondage = document.getElementsByClassName("poll")[0];

    if (!sondage) 
        return null;

    let choix = sondage.getElementsByClassName("poll-answer");
    let results = {};
    let numberVotes = 0;

    let sondageTitle = sondage.getElementsByTagName("h2")[0];
    if (sondageTitle.textContent.length > 7){
        for (let i = 0; i < choix.length; i++) {
            let answer = choix[i];
            results[answer.getAttribute("data-poll-answer")] = { name: answer.getElementsByTagName("span").textContent, percent: answer.getAttribute("data-percent")};
        }
        numberVotes = +sondageTitle.textContent.match(/\d+/)[0];
    }
    else {
        for (let i = 0; i < choix.length; i++) {
            let answer = choix[i];
            results[answer.getAttribute("data-poll-answer")] = { name: answer.getElementsByTagName("span").textContent, percent: null};
        }
    }

    return { answered : results, numberVotes : numberVotes};
}

function setUser(document, user) {

    let isConnected = (user.author !== undefined);

    if (isConnected) {
        if (user.author !== currentUser.author) {
            let pseudo = document.getElementById("ontchat-user-pseudo");
            pseudo.innerHTML = user.author;
            let avatarLink = document.getElementById("ontchat-user-avatar-link");
            avatarLink.setAttribute("href", `https://onche.org/account/profil`);
        }

        if (user.avatar !== currentUser.avatar) {
            let avatar = document.getElementById("ontchat-user-avatar");
            avatar.style["background-image"] = `url("${user.avatar}")`;
        }

        if (user.mp !== currentUser.mp) {
            let mp = document.getElementById("ontchat-user-mp");
            mp.setAttribute("data-val", user.mp);
            if (user.mp > 0) {
                mp.classList.add("has-notif");
            } else {
                mp.classList.remove("has-notif");
            }
        }
    }

    if ((userConnected === undefined && isConnected) || (userConnected !== undefined && isConnected !== userConnected)) {
        document.getElementById("ontchat-profil").classList.toggle("ontchat-hide");
        let isDown = isScrollDown();
        document.getElementsByClassName("bloc insert-image")[0].classList.toggle("ontchat-hide");
        if (isDown) {
            setScrollDown();
        }
    }

    if (userConnected !== undefined) {
        if (isConnected && !userConnected) {
            addAlertbox("success", "Vous êtes désormais connecté");
        } else if (!isConnected && userConnected) {
            addAlertbox("warning", "Vous avez été déconnecté");
        }
    }

    userConnected = isConnected;
    currentUser = user;
}

function setTopicTitle(document, topicTitle) {
    if (topicTitle !== currentTopicTitle) {
        currentTopicTitle = topicTitle;
        document.getElementById("ontchat-topic-title").innerHTML = escape(topicTitle);
    }
}

function setTopicNbConnected(document, nbConnected) {
    let txt = `${nbConnected} connectés`;
    if (!(nbConnected > 1)) {
        if (nbConnected === undefined) {
            txt = "? connectés";
        } else {
            txt = txt.slice(0, -1);
        }
    }
    document.getElementById("ontchat-topic-nb-connected").innerHTML = txt;
}

function setTopicNbMessages(document, nbMessages) {
    let txt = `${nbMessages} messages`;
    if (!(nbMessages > 1)) {
        if (nbMessages === undefined) {
            txt = "? messages";
        } else {
            txt = txt.slice(0, -1);
        }
    }
    document.getElementById("ontchat-topic-nb-messages").innerHTML = txt;
    if (nbMessages !== undefined) {
        topicNbMessages = nbMessages;
    }
}

function triggerontchat() {
    // TamperMonkey / Chrome bug: https://github.com/Tampermonkey/tampermonkey/issues/705#issuecomment-493895776

    let link = document.createElement('link');
    link.rel = 'stylesheet';
    link.type = 'text/css';
    link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';

    document.head.appendChild(link);

    freshForm = getForm(document);

    favicon = makeFavicon();

    let topicUrl = document.URL;
    let topic = parseTopicInfo(document);
    let user = parseUserInfo(document);

    urlToFetch = parseURL(topicUrl);
    urlToFetch.page = 1;
    urlToFetch.anchor = "";

    urlToRefreshInfos = parseURL(topicUrl);
    urlToRefreshInfos.page = 1;
    urlToRefreshInfos.anchor = "";

    urlToCheckEdited = parseURL(topicUrl);
    urlToCheckEdited.page = 1;
    urlToCheckEdited.anchor = "";

    configuration = defaultConfig();
    loadConfig();

    ringBell = new Audio(configuration["sound"]);



    clearPage(document);

    setUser(document, user);
    setTopicTitle(document, topic.title);
    setTopicNbMessages(document, undefined);
    setTopicNbConnected(document, topic.connected);

    document.getElementById("ontchat-topic-title").setAttribute("href", buildURL(urlToFetch));

    let forum = getForum(document);
    let forumSide = document.getElementById("ontchat-forum-title");
    forumSide.setAttribute("href", forum.href);
    forumSide.innerHTML = escape(forum.title);

    let defaultReduced = configuration["default_reduced"];
    let messageTopic = document.getElementsByClassName("ontchat-textarea")[0];

    if (messageTopic && (defaultReduced === false || (messageTopic.value !== ""))) {
        toggleTextarea();
    }

    let event = new CustomEvent('ontchat:activation');
    dispatchEvent(event);

    let page = topic.lastPage > 1 ? topic.lastPage - 1 : topic.lastPage;
    updateMessages(page, true);

    setInterval(tryCatch(checkEdited), checkEditedInterval);
}

function refreshNoLongerDegraded() {
    removeDegradedRefreshWarning();
    timeoutedDates = [];
    refreshDegraded = false;
    refreshDegradedTimeoutId = -1;
}

function scheduleDegradedRefreshWarning() {
    if (!refreshDegraded) {
        let now = getTimestamp();
        let lookupDate = now - 60 * 1000;
        let nbClean = 0;
        for (let date of timeoutedDates) {
            if (date < lookupDate) {
                nbClean++;
            } else {
                break;
            }
        }
        for (i = 0; i < nbClean; i++) {
            timeoutedDates.shift();
        }

        timeoutedDates.push(now);

        if (timeoutedDates.length >= 3) {
            refreshDegraded = true;
            updateIntervalIdx = 2;
            setDegradedRefreshWarning();
        } else {
            return;
        }
    }

    if (refreshDegradedTimeoutId !== -1) {
        clearTimeout(refreshDegradedTimeoutId);
    }

    refreshDegradedTimeoutId = setTimeout(tryCatch(refreshNoLongerDegraded), 30000);
}

function updateMessages(page, goToLast) {
    if (postingMessage && turboActivated) {
        // Postpone message fetching, posting the message is priorized
        fetchingMessages = false;
        currentTimeoutId = setTimeout(tryCatch(function postponedUpdate() {
            updateMessages(page, goToLast);
        }), 100);
        return;
    }

    let timestamp = getTimestamp();

    function scheduleNextUpdate(interval, p, goLast) {
        fetchingMessages = false;
        currentTimeoutId = setTimeout(tryCatch(function scheduledUpdate() {
            updateMessages(p, goLast);
        }), interval);
    };

    function onSuccess(res) {
        let parsed = parsePage(res, timestamp);
        let lastPage = parsed.lastPage;
        let currPage = parsed.page;
        let interval = turboActivated ? configuration["turbo_delay"] : updateIntervals[updateIntervalIdx] * 1000;

        if (page < lastPage && goToLast) {
            updateMessages(page + 1, true);
        } else if (currPage < page || parsed.nbMessagesPage === 0) {  // Bug des messages supprimés
            scheduleNextUpdate(interval, page - 1, false);
        } else if (page > lastPage) {
            updateMessages(lastPage, true);
        } else {
            scheduleNextUpdate(interval, page, true);
        }
    }

    function onSuccessSondage(res) {
        parseSondage(res);
    }

    function onError(err, code) {
        if (code === 0) {
            scheduleDegradedRefreshWarning();
            scheduleNextUpdate(turboActivated ? configuration["turbo_delay"] : 10000, page, true);
            return
        }
        if (!isError) {
            isError = true;
            setFixedAlert("danger", err);
        }
        scheduleNextUpdate(turboActivated ? configuration["turbo_delay"] : 60000, page, true);
    }

    function onTimeout(_) {
        scheduleDegradedRefreshWarning();
        scheduleNextUpdate(turboActivated ? configuration["turbo_delay"] : 5000, page, true);
    }

    let timeout = 10000;;
    if (turboActivated) {
        timeout = 5000;
    }

    fetchingMessages = true;
    currentFetchedPage = page;
    urlToFetch.page = page;
    let urlLastPage = buildURL(urlToFetch);

    if (counterSondage > 3) {
        counterSondage = 0;
        let urlFirstPage = urlLastPage.replace(/\d+(?=[^/]*$)/, '1');
        request("GET", urlFirstPage, onSuccessSondage, onError, onTimeout, undefined, false, 20000);
    }
    counterSondage++;

    request("GET", urlLastPage, onSuccess, onError, onTimeout, undefined, false, timeout, turboActivated);
}

function checkEdited() {
    if (!shouldCheckEdited || currentFetchedPage === 1 || isError) {
        return;
    }

    urlToCheckEdited.page = currentFetchedPage - 1;
    let urlPrevLastPage = buildURL(urlToCheckEdited);
    let timestamp = getTimestamp();

    function onSuccess(res) {
        let newMessages = [];
        let edited = res.getElementsByClassName("edited");
        for (let msg of edited) {
            let bloc = msg.closest(".message");
            newMessages.push(parseMessage(bloc));
        }
        addMessages(newMessages, true, timestamp, false);
        findDeletedMessages(res, timestamp);
    }

    function onError(_, _) { }

    function onTimeout(_) { }

    request("GET", urlPrevLastPage, onSuccess, onError, onTimeout, undefined, false, 20000);
}

function checkDeleted(id) {
    let url = `https://www.jeuxvideo.com/ontchat/forums/message/${id}`;
    let requestTimestamp = getTimestamp();

    function onSuccess(_) {
        // Le message existe, il a disparu de la page car un message plus ancien a été supprimé
    }

    function onError(_, status) {
        let [timestamp, edition, deleted] = lastEditionTime[id];

        if (status === 410 && !deleted) {
            if (timestamp >= requestTimestamp) {
                return;
            }

            let msg = document.querySelector(`.ontchat-message[ontchat-id="${id}"]`);
            if (msg) {
                msg.classList.add("ontchat-message-deleted");
                lastEditionTime[id] = [timestamp, edition, true];
            }
        }
    }

    function onTimeout(_) { }

    request("GET", url, onSuccess, onError, onTimeout, undefined, false, 20000, false);
}

function parseAlerts(res) {
    let alerts = [];
    let alertsDiv = res.getElementsByClassName("alert");
    for (let a of alertsDiv) {
        let type = "danger";
        if (a.classList.contains("alert-warning")) {
            type = "warning";
        } else if (a.classList.contains("alert-success")) {
            type = "success";
        }
        for (let p of a.getElementsByTagName("p")) {
            let message = p.textContent.trim();
            alerts.push({ type: type, message: message });
        }
    }
    return alerts;
}

function increaseUpdateInterval() {
    if (updateIntervalIdx < updateIntervalMax) {
        updateIntervalIdx++;
    }
}

function decreaseUpdateInterval() {
    updateIntervalIdx = transisitions[updateIntervalIdx];
}

function parsePage(res, requestTimestamp) {
    let error = getTopicError(res);
    if (error !== undefined) {
        if (!isError) {
            updateIntervalIdx = updateIntervalMax;
            isError = true;
            setFixedAlert("danger", error);
        }
        return { lastPage: undefined, page: undefined, alert: true, nbMessagesPage: 0 }
    }

    if (isError) {
        isError = false;
        updateIntervalIdx = 2;
        removeFixedAlert("Le topic ne retourne plus d'erreur");
    }

    let form = getForm(res);
    if (form !== undefined) {
        freshForm = form;
    }

    let messages = getMessages(res);
    addMessages(messages, false, requestTimestamp, false);

    let user = parseUserInfo(res);
    setUser(document, user);

    let topic = parseTopicInfo(res);

    findDeletedMessages(res, requestTimestamp);

    let nbMessages = (topic.lastPage - 1) * 20;
    if (topic.page === topic.lastPage) {
        nbMessages += messages.length;
    }
    if (topic.page === topic.lastPage || nbMessages > topicNbMessages) {
        setTopicNbMessages(document, nbMessages);
    }

    setTopicNbConnected(document, topic.connected);

    let alerts = parseAlerts(res);
    for (let alert of alerts) {
        addAlertbox(alert.type, alert.message);
    }

    let locked = getTopicLocked(res);
    let isLocked_ = (locked !== undefined);

    if (isLocked_ && !isLocked) {
        updateIntervalIdx = updateIntervalMax;
        setFixedAlert("warning", locked);
    } else if (!isLocked_ && isLocked) {
        updateIntervalIdx = 0;
        removeFixedAlert("Le topic a été dévérouillé");
    }
    isLocked = isLocked_;

    return {
        page: topic.page, lastPage: topic.lastPage,
        nbMessagesPage: messages.length, alert: isLocked_ || (alerts.length > 0)
    };
}

function parseSondage(res) {
    let sondage = document.getElementsByClassName("poll")[0];
    if (!!sondage) {
        let sondageAnswer = getSondages(res);
        updateSondage(sondageAnswer);
    }
}

function addAlertbox(type, message) {
    // type: success / warning / danger
    let alertsSuccess = document.getElementsByClassName('alert alert-success');

    if (type == 'success' && alertsSuccess.length > 0) {
        return;
    }


    let alert = `<div class="alert alert-${type}">
        <button class="material-icons close ontchat-alert-close" aria-hidden="true" data-dismiss="alert" type="button">close</button>
        <div class="alert-row">${escape(message)}</div>
        </div>`;
    document.getElementById("ontchat-fixed-alert").insertAdjacentHTML("afterend", alert);

}

function setFixedAlert(type, message) {
    setFavicon("⨯");
    if (configuration["hide_alerts"]) {
        addAlertbox(type, message);
        return
    }
    document.getElementById("ontchat-fixed-alert").getElementsByClassName("alert-row")[0].innerHTML = escape(message);
    document.getElementById("ontchat-fixed-alert").setAttribute("class", `alert alert-${type}`);
}

function removeFixedAlert(message) {
    document.getElementById("ontchat-fixed-alert").classList.add("ontchat-hide");
    if (message !== undefined) {
        addAlertbox("success", message);
    }
    if (document.hidden && nbNewMessage > 0) {
        setFavicon(nbNewMessage > 99 ? 99 : nbNewMessage);
    } else {
        setFavicon("");
    }
}

function setTurboWarning() {
    let message = "Le mode turbo est resté activé pendant plus d'une minute, les requêtes pour récupérer les nouveaux messages risquent d'être ralenties";
    document.getElementById("ontchat-turbo-warning").getElementsByClassName("alert-row")[0].innerHTML = message;
    document.getElementById("ontchat-turbo-warning").setAttribute("class", "alert alert-warning");
}

function removeTurboWarning() {
    document.getElementById("ontchat-turbo-warning").classList.add("ontchat-hide");
}

function setDegradedRefreshWarning() {
    let message = "Les serveurs d'Onche semblent surchargés, l'actualisation des nouveaux messages peut s'en voir dégradée";
    document.getElementById("ontchat-degraded-refresh-warning").getElementsByClassName("alert-row")[0].innerHTML = message;
    document.getElementById("ontchat-degraded-refresh-warning").setAttribute("class", "alert alert-warning");
}

function removeDegradedRefreshWarning() {
    document.getElementById("ontchat-degraded-refresh-warning").classList.add("ontchat-hide");
}

function makeontchatButton() {
    let cls = 'btn-ontchat';
    let text = 'OnTchat';
    let btn = `<button class="btn btn-actu-new-list-forum ${cls}">${text}</button>`;
    return btn;
}

function addontchatButton(document) {
    let fontColor = getStyle(document.getElementsByTagName("h1")[0], "color");
    let css = `<style type="text/css">
    #forum-main-col .bloc-pre-pagi-forum {
        display: flex;
    }

    #forum-main-col .bloc-pre-pagi-forum .bloc-pre-right {
        position: relative;
        right: unset;
        left: unset;
        top: unset;
        bottom: unset;
        overflow: hidden;
        display: flex;
        flex-wrap: wrap;
        justify-content: flex-end;
        margin-top: auto;
        flex: 1;
    }

    #forum-main-col .bloc-pre-pagi-forum .bloc-pre-right button {
        float: right;
        min-width: 5.25rem;
        margin-left: 0.3125rem;
    }

    .btn-ontchat {
        background-color: inherit;
        border-radius: 4px;
        height: 1.75rem;
        border-width: thin;
        border-style: ridge;
        padding: 0.1875rem 1rem;
        color: ${fontColor};
        border-color: ${fontColor};
        cursor: pointer;
        margin-right: 1rem;
    }
    </style>`
    document.head.insertAdjacentHTML("beforeend", css);

    let blocPreRight = document.getElementsByClassName("bloc")[0].getElementsByClassName("right")[0];
    let ontchatButton = makeontchatButton();

    blocPreRight.insertAdjacentHTML('afterbegin', ontchatButton);
}

function bindontchatButton(document) {
    let buttons = document.getElementsByClassName('btn-ontchat');
    for (let btn of buttons) {
        btn.addEventListener('click', tryCatch(triggerontchat));
    }
}

function getStyle(el,styleProp)
{
    if (el.currentStyle)
        return el.currentStyle[styleProp];

    return document.defaultView.getComputedStyle(el,null)[styleProp];
}

function request(mode, url, callbackSuccess, callbackError, callbackTimeout, data, json, timeout, nocache) {
    json = !!json;
    let xhr = new XMLHttpRequest();
    xhr.timeout = timeout;

    xhr.ontimeout = tryCatch(function xhrOnTimeout() {
        callbackTimeout(`La délai d'attente de la requête a expiré`);
    });

    xhr.onerror = tryCatch(function xhrOnError() {
        callbackError(`La requête a échoué (${xhr.status}): ${xhr.statusText}`, xhr.status);
    });

    xhr.onabort = tryCatch(function xhrOnAbort() {
        if (!leavingTopic) {
            callbackTimeout(`La requête a été interrompue pour une raison inconnue`);
        }
    });

    xhr.onload = tryCatch(function xhrOnLoad() {
        if (xhr.status !== 200) {
            callbackError(`La requête a retourné une erreur (${xhr.status}): ${xhr.statusText}`, xhr.status);
            return;
        }
        callbackSuccess(xhr.response);
    });

    if (data === undefined) {
        data = null;
    }

    if (json) {
        xhr.responseType = "json";
    } else {
        xhr.responseType = "document";
    }

    xhr.open(mode, url, true);

    if (nocache) {
        xhr.setRequestHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    }

    xhr.send(data);
};

// On copie/colle le code de TopicLive et on se sent développeur :)
function makeFavicon() {
    let canvas = document.createElement("canvas");
    canvas.width = 16;
    canvas.height = 16;
    let context = canvas.getContext('2d');
    let image = new Image();
    image.onload = function () {
        faviconLoaded = true;
        setFavicon(faviconTextWhenLoaded);
    }
    image.src = 'data:image/x-icon;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAMASURBVDhPZVJbSFRRFF3n3rkz4+TkOPlIkZSxDDUzKQXxmalBUElERPTAj/CrPqKfso9+Koion0KwfoKQRIwQLMxHTokpWiJiKWo+Rs3n5DPnOnfubd8zalQL7jln77P3OvuuvRkInteRWQC7C4ZUMk3QaNVv/t11aJBp7aRDqblo0snk6ohsuqwnp5HfU3D/hIKeUS/cq/6smFCGnEQjzMZNFg6FyAqYXBXeQkaGnlj5yYsZIQKJiZE4EG+H3UbFMBED4zIanCOwLvTjfJYBwh+eNia/DFund6WyJhWHT2ZiryPIf8UYVGkbNNHktwmuiWVUPK3D9SMemCTOogjMp0rNPetIzDy0lawJBvhMtq3khSUZVTX9mJ3/hZJrx/GoUQJ8KijXIKiKis9zdmSlhvPgvuEVPK4YwrBrmds6Ai0S8nOi4ZEVPHvRjcIzeajpoMJVFcLotAJHwi4eOD3nQUO7GyUXUxAWYuE+Hbo+V282orN7CmeL4uGj1wfUaGheIugeUZAcv4MH1jaPo/hcEi5dqUVsWjnm5te4f3FZRm39EN42DiMq0oqUpHAkpcWhd0yBoBDLZo9VjcFsMmCPIxhxsXaYzSL3h9gD0P2+GJXlJ7itY39CKHqIgHXdCtC+haTh1FEqiURTjYEbIX7xbNtN8JJOPxc8f/3W9OwqPj55DiGahO/78p07mU/vqI+fdbjGl/CueQT19AXbzBtePz60juFgFINgEVXEC1Nwtk+RW4Mok/obJElUZmFuDI7lOyAZBO7T4aZqBp3tiLFpECTSsmA34KxuhevHKk8WPYtgij7y/2PEtYiHt1/h8r4VmAVNYeoDqcWnahmTixrKugKQfTodeekRPFgfKM0QQLuErwNu1L3pBRvqwYVkHyK2M4gCa2PqfTGbKq8nEuPMCtA0qKF31QqLPQhMFKB4ZHjcS4ixrCHXwbDTClhJDpExhZpWwBuo3ROyab1Dg5W65tVMy6QlDR0fIP3XzTS5NIwwGehVhnVqewdJXspuqM7fCoY2RzEU22EAAAAASUVORK5CYII=';
    return { canvas: canvas, context: context, image: image };
};

function setFavicon(txt) {
    if (!faviconLoaded) {
        faviconTextWhenLoaded = txt;
        return;
    }

    let fav = document.getElementById("ontchat-favicon");
    if (fav) {
        fav.parentElement.removeChild(fav);
    }

    favicon.context.clearRect(0, 0, favicon.canvas.width, favicon.canvas.height);
    favicon.context.drawImage(favicon.image, 0, 0);

    if (txt !== '') {
        let context = favicon.context;
        context.fillStyle = 'DodgerBlue';
        context.fillRect(0, 0, context.measureText(txt).width + 3, 11);
        context.fillStyle = 'white';
        context.font = 'bold 10px Verdana';
        context.textBaseline = 'bottom';
        context.fillText(txt, 1, 11);
    }

    let url = favicon.canvas.toDataURL('image/png');
    let icon = `<link id="ontchat-favicon" rel="shortcut icon" type="image/png" href="${url}">`;
    document.head.insertAdjacentHTML("beforeend", icon);
}

function reverseMessage(node, isInit, isUl) {
    let quote = "";
    let prevIsP = false;
    let startsWithSpoil = false;

    for (let child of node.childNodes) {
        let name = child.nodeName;

        switch (name) {
            case "P": {
                quote += reverseMessage(child) + "\n\n";
                break;
            }
            case "STRONG": {
                quote += "'''" + reverseMessage(child) + "'''";
                break;
            }
            case "U": {
                quote += "<u>" + reverseMessage(child) + "</u>";
                break;
            }
            case "S": {
                quote += "<s>" + reverseMessage(child) + "</s>";
                break;
            }
            case "EM": {
                quote += "''" + reverseMessage(child) + "''";
                break;
            }
            case "BR": {
                quote += "\n";
                break;
            }
            case "UL": {
                quote += reverseMessage(child, false, true) + "\n\n";
                break;
            }
            case "OL": {
                quote += reverseMessage(child, false, false) + "\n\n";
                break;
            }
            case "LI": {
                if (isUl === true) {
                    quote += "* " + reverseMessage(child) + "\n";
                } else {
                    quote += "# " + reverseMessage(child) + "\n";
                }
                break;
            }
            case "DIV": {
                let classList = child.classList;
                if (classList.contains("bloc-spoil-jv")) {
                    if (quote === "") {
                        startsWithSpoil = true;
                    }
                    quote += "<spoil>" + reverseMessage(child) + "</spoil>\n\n"
                } else if (classList.contains("contenu-spoil")) {
                    quote += reverseMessage(child);
                }
                break;
            }
            case "SPAN": {
                let classList = child.classList;
                if (classList.contains("bloc-spoil-jv")) {
                    quote += "<spoil>" + reverseMessage(child) + "</spoil>";
                } else if (classList.contains("contenu-spoil")) {
                    quote += reverseMessage(child);
                }
                break;
            }
            case "LABEL": {
                break;
            }
            case "INPUT": {
                break;
            }
            case "IMG": {
                quote += child.alt;
                break;
            }
            case "A": {
                if (child.href) {
                    quote += child.href;
                } else {
                    quote += reverseMessage(child);
                }
                break;
            }
            case "PRE": {
                quote += reverseMessage(child) + "\n\n";
                break;
            }
            case "CODE": {
                quote += "<code>" + child.textContent + "</code>";
                break;
            }
            case "BLOCKQUOTE": {
                if (prevIsP) {
                    quote = quote.trimEnd() + "\n" + reverseMessage(child).replace(/^/gm, '> ') + "\n\n";
                } else {
                    quote += reverseMessage(child).replace(/^/gm, '> ') + "\n\n";
                }

                break;
            }
            case "#text": {
                // The "isInit" check is to prevent the empty text surroudning message
                // However, it may happen that the root node contains valid text child, so it need to be added somehow
                // For some reason, an "new line" may be missing in this case, so just add it
                if (!isInit || child.textContent.trim() !== "") {
                    quote += child.textContent;
                    if (isInit && !quote.endsWith("\n")) {
                        quote += "\n";
                    }
                }
                break;
            }
            default: {
                break;
            }
        }

        if (name == "P") {
            prevIsP = true;
        } else {
            prevIsP = false;
        }
    }

    quote = quote.replace(/(\n){3,}/g, '\n\n');

    if (startsWithSpoil && isInit) {
        quote = "\n" + quote.trimEnd();
    } else {
        quote = quote.trim();
    }

    if (isInit) {
        quote = quote.replace(/^/gm, '> ');
    }

    return quote;
}

function reverseQuote(blocMessage) {
    let author_name = blocMessage.getElementsByClassName("ontchat-author")[0].textContent.trim();
    let author_avatar = blocMessage.getElementsByClassName("ontchat-bloc-avatar")[0].getAttribute("data-avatar");
    let messageLast = blocMessage.getElementsByClassName("message-content");
    let message = messageLast[messageLast.length - 1].innerHTML;
    let data_id = blocMessage.getAttribute('ontchat-id');
    return {author_name: author_name, author_avatar: author_avatar, message: message, data_id: data_id};
}

function insertTextareaAnswer(textToInsert) {
    let answer = document.getElementById("answer");

    if (answer.innerHTML != "") {
        answer.innerHTML = "";
    }
    let textInsert = `
    <div class="message small">
        <div class="message-top">
                <img class="avatar" alt="${textToInsert.author_name}"
                        src="${textToInsert.author_avatar}">
                <div class="message-infos">
                        <div class="message-username">${textToInsert.author_name}</div>
                </div>
                <div class="right">
                        <div class="mdi mdi-close" data-message-close></div>
                </div>
        </div>
        <div class="message-content rmjs-3">
            ${textToInsert.message}
        </div>
    </div>
    <input type="hidden" name="answer" value="${textToInsert.data_id}">
    `;
    answer.insertAdjacentHTML('beforeend', textInsert);
}

function dontScrollOnExpand(event) {
    let target = event.target;
    if (!target) {
        return;
    }

    let classes = target.classList;

    if (classes.contains("nested-quote-toggle-box")) {
        let isDown = isScrollDown();
        let blockQuote = target.closest(".blockquote-jv");
        let visible = blockQuote.getAttribute("data-visible");
        let value = visible === "1" ? "" : "1";
        blockQuote.setAttribute('data-visible', value);
        if (isDown) {
            setScrollDown();
        }
    } else if (classes.contains("txt-spoil") || classes.contains("aff-spoil") || classes.contains("masq-spoil")) {
        event.preventDefault();
        let check = target.closest(".bloc-spoil-jv").getElementsByClassName("open-spoil")[0];
        let isDown = isScrollDown();
        check.checked = !check.checked;
        if (isDown) {
            setScrollDown();
        }
    } else if (classes.contains("ontchat-quote")) {
        let bloc = target.closest(".ontchat-message");
        let quote = reverseQuote(bloc);
        let textarea = document.getElementsByClassName("textarea")[0];
        insertTextareaAnswer(quote);
        textarea.focus();
    } else if (classes.contains("ontchat-edit")) {
        let bloc = target.closest(".ontchat-message");
        requestEdit(bloc);
    } else if (classes.contains("ontchat-delete")) {
        let bloc = target.closest(".ontchat-message");
        event.stopPropagation();
        requestDelete(bloc);
    } else if (classes.contains("ontchat-edition-check")) {
        let bloc = target.closest(".ontchat-message");
        editMessage(bloc);
    } else if (classes.contains("ontchat-edition-cancel")) {
        let bloc = target.closest(".ontchat-message");
        let isDown = isScrollDown();
        bloc.getElementsByClassName("ontchat-content")[0].classList.remove("ontchat-hide");
        bloc.getElementsByClassName("ontchat-edition")[0].classList.add("ontchat-hide");
        if (isDown) {
            setScrollDown();
        }
    }
}

function isScrollDown() {
    let element = document.getElementById("ontchat-main");
    return element.clientHeight + Math.floor(element.scrollTop) >= element.scrollHeight - 100;
}

function setScrollDown() {
    setTimeout(() => {
        let element = document.getElementById("ontchat-main");
        element.scrollTop = element.scrollHeight + 10000;
    }, 50);
}

function main() {
    addontchatButton(document);
    bindontchatButton(document);
}

main();