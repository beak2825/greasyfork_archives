// ==UserScript==
// @name         Dragon Theme
// @namespace      https://greasyfork.org/en/users/1353946-stragon-x
// @version        1.2
// @license        N/A
// @description  Dragon theme and new Persian font
// @author       STRAGON
// @match        https://gartic.io/*
// @icon            https://png.pngtree.com/png-vector/20230814/ourmid/pngtree-king-coerulean-red-dragon-decal-sticker-vector-png-image_6897699.png
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529811/Dragon%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/529811/Dragon%20Theme.meta.js
// ==/UserScript==

(function() {
    'use strict';
  function setCSS(){
        var css = `
@import url('https://fonts.googleapis.com/css2?family=Baloo+Bhaijaan+2:wght@400;700&display=swap');
body {
    background-image: url('https://i.redd.it/8ei4zruxrld31.jpg');
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    font-family: 'Baloo Bhaijaan 2', sans-serif;
    }
@media screen and (max-height: 641px), screen and (max-width: 1151px) {
  #screenRoom.common .ctt #interaction #answer .history .msg, #screenRoom.common .ctt #interaction #chat .history .msg {
    font-size: 12px;
    line-height: 15px;
  }
}
#screenRoom .ctt #interaction #answer .history .msg, #screenRoom .ctt #interaction #chat .history .msg {
  color: #fff;
  font-size: 16px;
  line-height: 16px;
  word-break: break-all;
  word-break: break-word;
}
#screenRoom .ctt #interaction {
  margin: 25px 0 0 23px;
  grid-area: c;
  -ms-grid-row: 2;
  -ms-grid-column: 2;
  min-height: 0;
  min-width: 0;
  position: relative;
  display: -webkit-box;
  display: -webkit-flex;
  display: -moz-box;
  display: -moz-flex;
  display: -ms-flexbox;
  display: flex;
  -webkit-box-direction: normal;
  -webkit-box-orient: horizontal;
  -webkit-flex-direction: row;
  -moz-flex-direction: row;
  -ms-flex-direction: row;
  flex-direction: row;
    background-image: url('https://i.redd.it/8ei4zruxrld31.jpg');
  border: 1px solid #979797;
  -webkit-border-radius: 12px;
  -moz-border-radius: 12px;
  -ms-border-radius: 12px;
  -o-border-radius: 12px;
  border-radius: 12px;
  box-shadow: 0 1px 4px 0 rgba(0,0,0,.5);
}
#screenRoom .ctt .users-tools #users .user .infosPlayer .points {
  color: #FFD700;
  font-size: 20px;
  margin: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
    font-family: 'Baloo-Bhaijaan-2', sans-serif;
}
#screenRoom .ctt .users-tools #users .user.turn .infosPlayer .nick, #screenRoom .ctt .users-tools #users .user.turn .infosPlayer .points {
  color: #FFD700;
}
#screenRoom .ctt .users-tools #users .user.turn::before {
  color: #FFD700;
}
#screenRoom .ctt .users-tools #users .user .avatar {
box-shadow: 0 0 0 4px #fff;
}
#screens > div {
  background-color: #00000059;
  border : 2px solid #fff;
}
.rooms .scroll a:not(.emptyList):not(.loading) {
  background-color: #fff0;
  border: 3px solid #b70000;

}
.interaction{
    background-image: url('https://i.redd.it/8ei4zruxrld31.jpg');

}
#screenRoom .ctt .users-tools #users .user .infosPlayer .nick {
  color: #fff;
    font-family: 'Baloo-Bhaijaan-2', sans-serif;
  font-size: 22px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 1.2;
}
.rooms .scroll a:not(.emptyList):not(.loading):hover {
  border-color: rgba(0,121,255,.7);
  background-color: #fff0;
}
.rooms .scroll a:not(.emptyList):not(.loading) {
  background-color: #fff0;

}
.rooms .scroll a:not(.emptyList):not(.loading) h5 {
color: #fff;
}
.rooms .scroll a:not(.emptyList):not(.loading) h5 strong {
  color: #fff;
}
.rooms .scroll a:not(.emptyList):not(.loading) .infosRoom > div span:not(.tooltip) {
  color: #fff;
}
.rooms .scroll a:not(.emptyList):not(.loading).bgEmptyRoom {
  background-color: #fff0;
  border-color: #fff0;
}
.scrollElements {
    background-image: url('https://i.redd.it/8ei4zruxrld31.jpg');
    background-size: cover; /* Adjusts the size of the background image */
    background-position: center; /* Centers the background image */
    background-repeat: no-repeat; /* Prevents the background image from repeating */

}
#background::before {
 display : none;

}
.rooms .scroll a:not(.emptyList):not(.loading) h5 strong {
    font-family: 'Baloo-Bhaijaan-2', sans-serif;
  margin-right: 5px;
  font-size: 19px;
}
#screenRoom .ctt #interaction #answer h5, #screenRoom .ctt #interaction #chat h5 {
  background-color: #FFD700;
}
h3 {
  color: #FFD700;
}
.home .anonymus .fieldset label::before, .home .anonymus .fieldset span::before, .home .logged .fieldset label::before, .home .logged .fieldset span::before {
  color: #FFD700;
  font-size: 24px;
  margin: 0 10px 0 0;
}
.home .anonymus .containerForm span, .home .logged .containerForm span {
  font-family: NunitoBold;
  font-size: 15px;
  color: #fff;
  padding: 0 15px 0 0;
}
.home .login .advantagesLogin span p{
  color: #fff;
}
.home .or span{
  color: #fff;
}
.contribute{
display:none;
}
#screens .title .filter .language, #screens .title .filter .subject {
  color: #fff;
}
#screens .title .filter .language strong, #screens .title .filter .subject strong {
  color: #fff;
}
#screens .title .filter .language:hover, #screens .title .filter .subject:hover {
  color: #fff;
}
#screens .title .filter .language:hover strong, #screens .title .filter .subject:hover strong {
  color: #fff;
}
#screens .title .filter .optionsFilter > div {
  background-color: #333333;

}
#screens .title .filter .optionsFilter > div .hotOnes .choice button.active, #screens .title .filter .optionsFilter > div .hotOnes .choice button:hover, #screens .title .filter .optionsFilter > div .regularOnes .choice button.active, #screens .title .filter .optionsFilter > div .regularOnes .choice button:hover {
  background-color: #FFD700;
}
.legend {
  color: #fff;
  font-size: 14px;
}
#screens .title .filter .optionsFilter > div {
  background-color: #000000e5;
}
.home .exit:hover {
  background-color: #fce15d;
}
.home .exit {
  background-color: #FFD700;
}
.rooms .scroll a:not(.emptyList):not(.loading).bgEmptyRoom.selected {
  border-color: #FFD700;
}
.rooms .scroll a:not(.emptyList):not(.loading).bgEmptyRoom:hover {
  border-color: rgb(255, 215, 0);
}
#screens .content.bg {
      background-image: url('https://i.redd.it/8ei4zruxrld31.jpg');
  border: 1px solid #5d8899;
  -webkit-border-radius: 15px;
  -moz-border-radius: 15px;
  -ms-border-radius: 15px;
  -o-border-radius: 15px;
  border-radius: 15px;
}
.createRoom .globalSettings {
  width: 272px;
  background-color: #000000b8;
}
.createRoom .themes .subject {
  background-color: #000000b8;
}
.createRoom .themes .selectTheme ul li:not(.emptyList) {
  background-color: #fff;
  border: 1px solid #fff;
}
.createRoom .themes .selectTheme ul li:not(.emptyList) {
  background-color: #000000a8;
  border: 0px solid #fff;
    border-top-color: rgb(255, 255, 255);
    border-right-color: rgb(255, 255, 255);
    border-bottom-color: rgb(255, 255, 255);
    border-left-color: rgb(255, 255, 255);
}
.createRoom .themes .selectTheme ul li:not(.emptyList):hover {
  border: 2px solid #fff;
  background-color: #000000a8;
}
.suggestion{
  background-color: #000000a8;
}
.btAdd button:hover, .btAdd input[type="submit"]:hover {
  background-color: #fce15d;
}
.btAdd button, .btAdd input[type="submit"] {
  border: none;
  background: none;
    background-color: #FFD700;
}
.createRoom .globalSettings .legend {
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  -moz-box-flex: 1;
  -moz-flex: 1;
  -ms-flex: 1;
  flex: 1;
  font-family: NunitoBold;
  font-size: 14px;
  color: #fff;
  margin: 0 10px 0 0;
}
.createRoom .globalSettings .fieldset::before {
  color: #FFD700;
}
.switchFieldCheck input[type="checkbox"]:checked + label {
  background-color: #FFD700;
}
#screens > div .mask {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  background-color: hsla(0, 0%, 0%, 0.48);
  height: 100%;
  z-index: 3;
  display: none;
}
#screens .title .filter .optionsFilter > div {
  border: 0px solid #868d96;
  box-shadow: 0 7px 5px 0 rgba(0,0,0,.2);
  border-radius: 10px;
}
.home .anonymus .fieldset.nick input, .home .logged .fieldset.nick input {
  background-color: #00000063;
}
input[type="email"], input[type="text"] {
  color: #fff;
}
.select select {
  color: #fff;
  background-color: #00000063;
}
.home .lastRooms > div ul li:not(.emptyList):not(.empty).bgEmptyRoom {
  background-color: #000000c7;
  border-color: #0000;
}
.home .lastRooms > div ul li:not(.emptyList):not(.empty) > span {
  background-color: rgba(0, 0, 0, 0.76);
  color: #FFD700;
}
input[type="email"]:placeholder-shown, input[type="text"]:placeholder-shown {
  background-color: #0000;
}
.home .lastRooms > div ul li:not(.emptyList):not(.empty) {

  background-color: #00000063;;
  border: 2px solid #fff;
}
input[type="email"]:disabled, input[type="text"]:disabled {

  background-color: #fff0;
}
input[type="email"], input[type="text"] {
  border: 1px solid #fff;
  font-family: NunitoBold;
  font-size: 18px;
  background-color: #0000;
}
#popUp .content {
  background-color: #000000b0;
  border: 1px solid #979797;-
}
#popUp .content.profile .contentPopup .nick {
  color: #FFD700;
}
`;

 var style = document.createElement('style');
        style.type = 'text/css';
        style.appendChild(document.createTextNode(css));
        document.head.appendChild(style);
    }
    setCSS();
})();