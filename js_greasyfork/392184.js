// ==UserScript==
// @name         Simple Style Change by Seven
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Custom Style change for any Jumpin room.
// @author       HMRSeven
// @license      Computer Programmer/Analyst Undergrad
// @match        https://jumpin.chat/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/392184/Simple%20Style%20Change%20by%20Seven.user.js
// @updateURL https://update.greasyfork.org/scripts/392184/Simple%20Style%20Change%20by%20Seven.meta.js
// ==/UserScript==


//styling
GM_addStyle(`
.cams__RoomDisplayPic {
    max-width: calc(40px/.75);
    height: 100%;
    border-radius: 22px;
}
body.dark{
    color: white;
}
.dark .roomHeader{
    background-color: #865FC5
}
.roomHeader{
    background-color: #865FC5
}
.dark .cams__Restriction{
    background-color: #865FC5;
    color: white;
}
.cams__Restriction{
    background-color: #865FC5;
    color: white;
}
.dark .button-blue{
    background-color: #865FC5;
    color: white;
}
.dark .button-blue:hover{
    background-color: #A074C4;
}
.button-blue{
    background-color: #865FC5;
    color: white;
}
.button-blue:hover{
    background-color: #A074C4;
}
.dark .input {
    color: white;
    border-color: #333333;
    background-color: #1E1E1E;
}
.dark .input:focus {
    border-color: #A16CED;
}
.dark .modal__SubText {
    color: #A16CED;
}
.dark .modal__Header {
    color: white;
    background-color: #333333;
}
.modal__Body {
    background: #252526;
}
.dark .cams__Header {
    background-color: #333333;
    padding: 1em 0.5em;
}
.dark .cams__InfoLabel {
    color: white;
}
.dark .button-white:disabled, .dark .button-white {
    background-color: #007ACC;
}
.dark .button-white:disabled, .dark .button-white:hover {
    background-color: #9CDCFE;
}
.dark .button--text, .dark .button-black, .dark .button-red {
    color: white;
}
.dark .roomHeader__LogoText {
    color: white;
}
.dark .cams {
    background-color: #1E1E1E;
}
.dark .chat__ShareCopy {
    background-color: #007ACC;
}
.dark .chat__ShareCopy:hover {
    background-color: #9CDCFE;
}
.dark .chat__Header {
    background-color: #333333;
}
.dark .chat__MessageBody-status {
    color: white;
}
.dark .chat__MessageBody-status:hover {
    color: #F5C8F7;
}
.dark .chat__MessageTimestamp {
    color: #C78DF7;
}
.dark .chat__Feed {
    border-color: #121212;
}
.dark .chat__InputWrapper {
    border-color: #C28DD8;
    background-color: #1E1E1E;
}
.dark .chat__FeedWrapper {
    background-color: #121212;
}
.dark .chat__UserList {
    background-color: #121212;
}
.button-default:hover {
    background: #e7ecf2;
}
.dark .button-default {
    background-color: #865FC5;
    color: white;
}
.dark .button-default:hover {
    background-color: #a583da;
}
.dark .dropdown__Option {
    border-color: #C28DD8;
    color: white;
}
.dark .dropdown__Option:hover {
    background-color: #5F3780;
}
.dark .dropdown__Option, .dark .dropdown__Options {
    background-color: #866fab;
}
.dark .settings {
    --border: #C28DD8;
    --menu-bg: #1E1E1E;
    --menu-item-hover: rgba(255, 255, 255, 0.15);
    --control-bg: #333333;
    --control-selected: rgba(143, 143, 143, 0.15);
    --control-selected-bg: #1B8CB5;
    --chat-preview-bg: ##1E1E1E;
}
.dark .modal {
    --bg-color: #1E1E1E;
}
.settings__Menu {
    background-color: var(--menu-bg);
}
.settings__RadioElement--checked {
    border: 0;
    background-color: var(--control-selected-bg);
    color: white;
}
.dark .text-sub {
    color: #a89984;
}
.dark .switch__Input {
    background-color: #432F62;
}
.dark .switch__Input:after{
    background-color: #9a7bca;
}
.dark .text-sub {
    color: #725d92;
}
.youtube__VideoContainer{
    width: 30%!important;
    height: 520px!important;
}
`);

//check if the website loaded
var waitInterval = setInterval(function () {
    var headerOptions = document.getElementsByClassName("chat__HeaderOptions")[0];
    if (headerOptions != undefined) {
        clearInterval(waitInterval);
        //constant loop
        var startLoop = setInterval(function () {
            dynamicCheck();
        }, 100)
    }
}, 200)

function dynamicCheck() {

    //variables
    var allCams = document.getElementsByClassName("cams__Cam");
    var camWrappers = document.getElementsByClassName("cams__CamWrapper");

    //changes all cams
    allCams.forEach(element => {
        var watermarks = element.getElementsByClassName("cams__CamWatermark");
        var handle = element.getElementsByClassName("cams__CamHandle")[0];

        if (handle.innerHTML == "bae" || handle.innerHTML == "bae_lesbian"){
            element.style.height = "100%";
            element.style.width = "auto";
        }

        watermarks.forEach(w => {
            element.removeChild(w);
        });
        element.style.border = 0;
    });

    //take away cam spacing
    camWrappers.forEach(element => {
        element.style.padding = 0;
    });
}
