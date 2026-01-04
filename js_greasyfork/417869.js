// ==UserScript==
// @name         Webcamdarts Dual View Record&Streaming Auto Switch
// @name:fr      Webcamdarts Dual View Enregistrement&Streaming (camera automatique)
// @namespace    http://tampermonkey.net/
// @version      3
// @description  To see your webcam and the opponent webcam in equal size. Webcamdarts Dual view for Joiner in this case and activate this one.
// @description:fr design de l'espace match - votre cible est score sont a gauche (quand c'est vous qui invité un joueur)
// @author       Antoine Maingeot
// @match        https://game.webcamdarts.com/game
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/RecordRTC/5.6.1/RecordRTC.js
// @require      https://cdn.jsdelivr.net/npm/detectrtc@1.4.1/DetectRTC.min.js
// @require      https://cdn.jsdelivr.net/npm/rtcmulticonnection@3.7.0/dev/getHTMLMediaElement.js
// @license MIT
// @copyright 2020, maingeot
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/417869/Webcamdarts%20Dual%20View%20RecordStreaming%20Auto%20Switch.user.js
// @updateURL https://update.greasyfork.org/scripts/417869/Webcamdarts%20Dual%20View%20RecordStreaming%20Auto%20Switch.meta.js
// ==/UserScript==
(function () {
    'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) {
            return;
        }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div > div.ng-hide {width: 50%;right: 0;top: 177px;position: fixed;padding:0;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div.col-xs-12.col-sm-12.col-md-8.col-lg-8.bg-black.dker.max.text-center.ng-hide > div {width: 50%;left: 0;top: 177px;position: fixed;padding:0;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(2){width: 50%;left: 0;top: 177px;position: fixed;padding:0;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(4){width: 50%;right: 0;top: 177px;position: fixed;padding:0;height:fit-content;height:-moz-fit-content;}');
    addGlobalStyle('#content > div {padding:0;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope {height: 15%;  background:white}');
    addGlobalStyle(' #content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div {position: fixed;top:0px;height:177px;}');
    addGlobalStyle('.row {margin-right: 0;margin-left: 0;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) {padding:0px;}');
    ///////Nom player
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div > div > div.h4,{background-color: #B90014;color: #FFF;width: 100%;height: 25%;position: relative;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div.h4 > div > div > div.h4{background-color: #B90014;color: #FFF;width: 100%;height: 25%;position: relative;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div.h1.font-bold.text-scores{height: 75%;     width: 100%;background:#131e26}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div > div > div.h1.font-bold.text-scores{    background-color: #FFF;height: 75%;    width: 100%;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div.h4, #content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div.h4 {background-color: #B90014;color: #FFF;width: 100%;height: 25%;position: relative;}');
    addGlobalStyle('.wrapper-sm, #content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker,#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div{ padding:0;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2), .bg-black ,.dker, .bg-black.dker{ background-color:#ffffff00;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div, #content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player,{position: fixed;right: 0px;width: 40%;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div, #content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1){ padding:0;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div.h1.font-bold.text-scores > span {z-index: 2;position: relative;}');
    //active player
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player,#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div{padding:0;float:left;display: block;position: relative;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div.h1.font-bold.text-scores{background: #131e26;}');
    addGlobalStyle('{    background: #131e26;}');
    addGlobalStyle('#error-container > div {width: 30%;left: 35%;position: relative;}');
    addGlobalStyle('.btn {     font-size: 12px;    padding: 5px;}');
    //////////Video position
    addGlobalStyle('button#switchbtn { position:fixed;bottom: 4px ;float: right;right: 120px;}');
    addGlobalStyle('button#hidecambtn { position:fixed;bottom: 4px ;float: right;right: 210px;}');
    addGlobalStyle('button#button_fullScreen { position:fixed;bottom: 4px ;float: right;right: 306px;}');
    addGlobalStyle('button#button_fullScreen:hover { position:fixed;bottom: 4px ;float: right;right: 306px;}');
    addGlobalStyle('#myvideo{position:relative; float:none;left:0px;height:auto;width:50%;}');
    addGlobalStyle('#remotevideo {position:relative; float:right; right:0px; height:auto;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div:nth-child(3) > div:nth-child(2){width: 50%;top: 17%;position: fixed;left: 0;padding: 0;}');
    addGlobalStyle('div.col-xs-7.col-sm-7.col-md-7.col-lg-7, div.col-xs-5.col-sm-5.col-md-5.col-lg-5 ,div.col-xs-2.col-sm-2.col-md-2.col-lg-2,  div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player, div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player{color: #FFF;font-size: larger;font-weight: 400;line-height: 21px;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div.h1.font-bold.text-scores > span{ color: #7793a7;z-index: 2;position: relative;}');
    ////////////////////historique/////////////////
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select{color:#dcddde;background-color:#131e26}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select > option{height:30px;color:#000;display: inline-table;padding-right: 5px;padding-left: 5px;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div > select > option{height:30px;color:#FFF;display: inline-table;padding-right: 5px;padding-left: 5px;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select > option{color:#FFF;display: inline-table;padding-right: 5px;padding-left: 5px;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div > select > option{color:#000;display: inline-table;padding-right: 5px;padding-left: 5px;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select,#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select,#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div > select,#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div > select{height:30px;overflow:hidden;    cursor: grabbing;}');
    addGlobalStyle('div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div > select,div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select { padding: 0px 1px; height:120px; display:block;border: 1px solid var(--baseFg);overflow: hidden;font-size: 1.5em;background-color:var(--baseBg);}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker{padding:0;width: 50%;position:fixed; right:0;height:30px;display: contents;bottom:40px;color:#000;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div {padding:0; right:0;height:30px;z-index:0;color:#000;     background-color: #dcddde; }');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5{padding:0;width: 50%;position:fixed; height:30px;display: contents;bottom:40px;color:#000;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div{padding:0;width: 50%;position:fixed; left:0;;height:30px;display: contents;bottom:40px;color:#000;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5{padding:0;display: contents; left:0;color:#FFF;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select {color: red;height: 30px;overflow: hidden;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select:-internal-list-box {background:#FFF;}');
    addGlobalStyle('#div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div > select, div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select{display: block;font-size:1.2em;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-2.col-sm-2.col-md-2.col-lg-2 > div > div:nth-child(1){display:none}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-2.col-sm-2.col-md-2.col-lg-2 > div > div.h4 {display:none}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-2.col-sm-2.col-md-2.col-lg-2 > div > div.h3.font-bold.wrapper-sm{display:none}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-2.col-sm-2.col-md-2.col-lg-2 > div > div.h3.font-bold.wrapper-sm{display:none}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-2.col-sm-2.col-md-2.col-lg-2 > div > div.h1.font-bold.text-scores{display:none}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1){float:left;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(1) > div.wrapper-sm{display:flex}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(1) > div.wrapper-sm > button {top: 147px;position: fixed;right:50%;margin-right:5px;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div > div:nth-child(2) > button:nth-child(2){top: 147px; position: fixed;right:50%;margin-right:5px;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div > div:nth-child(2) > button:nth-child(2){top: 147px; position: fixed;right:50%;margin-right:66px;}');
    addGlobalStyle('input#correctscore {top: 147px;position: fixed;width:60px;left:50%;height: 29px;    padding: 0;text-align: center;}');
    addGlobalStyle('input#enterdarts {top: 147px;position: fixed;width:60px;left:50%;height: 29px;   padding: 0;text-align: center;font-weight: bolder; font-size: xx-large;}');
    addGlobalStyle('input#enterscore {top: 147px;position: fixed;width:60px;height:29px;left:50%;   padding: 0;text-align: center;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player,#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player {border: 2px solid #B90013;    border-bottom-right-radius: 3px;padding: 2px;background: #B90013;border-bottom-left-radius: 3px;}');
    //active player color
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div > div > div.h4{background-color:#B90014; color:#FFF;z-index:2;position:relative;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div > div > div.h1.font-bold.text-scores > span  {color:#000;z-index:2;position:relative;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div.h4, #content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div.h4{background-color:#B90014; color:#FFF;text-transform: uppercase;z-index:2;position:relative;}');
    //opponent player color
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div.h4{background-color:#B90014; color:#FFF;z-index:2;position:relative;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div.h1.font-bold.text-scores > span{color:#000;z-index:2;position:relative;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div.h1.font-bold.text-scores{background-color:#FFF;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) {background-color: transparent;}');
    //addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div > div > div:nth-child(1) > img{position:relative;top:0px;right:50%;width:75px;height:75px;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div:nth-child(1) > img, #content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div > div > div:nth-child(1) > img{position:relative;top:14px;right:0;width:auto;height:auto;max-height: 129px;max-width: 129px;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div:nth-child(1),#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div:nth-child(1) {position: absolute;top: 0px;left: 0%;width:auto;height:auto ;background: transparent;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div:nth-child(1) {position: absolute;top: 0px;right: 0%;width:fit-content;height: 100%;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div:nth-child(1) > img{text-align:left;position:relative;top:14px;left:0;width:auto;height:auto;max-height: 129px;max-width: 129px;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker{text-align:left;top:0px;position: fixed;top: 0px;float: right;right: 44%;width:fit-content;padding:0 0 0 0;width:-moz-fit-content}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7{text-align:right;top:0px;position: fixed;top: 0px;float: left;left: 44%;width:fit-content;padding:0 0 0 0;width:-moz-fit-content}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker{text-align:left;top:0px;position: fixed;top: 0px;float: right;right: 44%;width:fit-content;padding:0 0 0 0;width:-moz-fit-content}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7{text-align:right;top:0px;position: fixed;top: 0px;float: right;right: 44%;width:fit-content;padding:0 0 0 0;width:-moz-fit-content}');
    //addGlobalStyle('.max { height: unset; width:unset}');
    addGlobalStyle('.active-player{ border: none;}');
    addGlobalStyle(' #content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div:nth-child(1), #content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div:nth-child(1) {   position: absolute;top: 0px;left: 0%;width: fit-content;width:-moz-fit-content;height: 100%; background:transparent;}');
    addGlobalStyle(' #content > div > div > div > div:nth-child(1) > div.row.ng-scope > div {z-index:1;padding:0;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div{position:relative;}');
    // checkout
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div.h3.font-bold.wrapper-sm > span{}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div.h3.font-bold.wrapper-smsm > span {}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div.h3.font-bold.wrapper-sm{background-color: #131E26; color:#FFF}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div > div > div.h3.font-bold.wrapper-sm > span{color:#B90013}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div.h3.font-bold.wrapper-sm > span{color:#B90013}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div > div > div.h3.font-bold.wrapper-sm{background: #131E26; background-color:#FFF}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div.h3.font-bold.wrapper-sm{color:#FFF;background-color: #FFF;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div.h3.font-bold.wrapper-sm {color:#FFF;background-color: #131E26;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div.h3.font-bold.wrapper-sm{color:FFF;background-color: #b90013;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div.h3.font-bold.wrapper-sm {}');
    addGlobalStyle('div.wrapper-md:nth-child(2),div.ng-binding:nth-child(2), #content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > div,#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div > div:nth-child(1) > div > span{ position: fixed;left: 42%;right: 42%;width: 16%;background: #f3f3f338;color: #131e26;font-variant: petite-caps;}');
    addGlobalStyle('div.ng-binding:nth-child(2){  top:137px; position: fixed;left: 42%;right: 42%;width: 16%;background: #f3f3f338;color: #FFF;font-variant: petite-caps;    font-weight: bolder;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div > div:nth-child(1) > button:hover{background-color:#000}');
    addGlobalStyle('.btn-primary{background-color:#131e26;cursor:pointer;}');
    //waiting turn
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > div{margin-bottom:-20px;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(1){padding:0px;}');
    //Cancel
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div:nth-child(3){ display:block;width:fit-content;width:-moz-fit-content;bottom:4px; position:fixed;right:0px;padding-left:0px}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1){ float: right;padding-right:0px;padding-left:0px;width: fit-content;width:-moz-fit-content;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div{padding:0px;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div > div:nth-child(1){ display:block;width:fit-content;width:-moz-fit-content;bottom:4px; position:fixed;right:2px;padding-left:0px}');
    addGlobalStyle('#correctscore,#enterscore{font-weight: bolder;font-size: xx-large;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div > div:nth-child(1) > div > span{margin-bottom:-20px;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select{background:#FFF;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div > select{background:#fff;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div > select{color:#FFF;background:#131e26;font-size:1.2em;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker > div, #content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker > div, #content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7 > div, #content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7  > div {text-align:center;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div > div:nth-child(3) > div:nth-child(1) > h3, #content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div > div:nth-child(3) > div:nth-child(2) > h3{background:#FFF;font-size:0.8em;}');
})();

////////////switchcamera/////////////////////
// add button for switch
var button_switchCam = document.createElement('div');
button_switchCam.innerHTML = '<button id="switchbtn" class="btn btn-primary" type="button">Switch Camera</button>';
//button_switchCam.setAttribute('z-index', '120');
//button_switchCam.setAttribute('position', 'absolute');
//button_switchCam.setAttribute('left', '50%');
//button_switchCam.style.width = 'fit-content';
var position3 = document.querySelector('.wrapper-sm');
position3.after(button_switchCam);

var savechange = document.getElementById('switchbtn').addEventListener('click', function (poswitch) {
    postionCamID1('myvideo');
    postionCamID2('remotevideo');
    postionCamID2Position('remotevideo');
    postionCamID2Position2('remotevideo');
    postionCamID2Position1('myvideo');
});

// add fucntion postion camera
function postionCamID1(id) {

    if (document.getElementById(id).style.left == '100%')
        document.getElementById(id).style.left = '0px';

    else
        document.getElementById(id).style.left = '100%'
}

function postionCamID2(id) {

    if (document.getElementById(id).style.right == '100%')
        document.getElementById(id).style.right = '0%';

    else
        document.getElementById(id).style.right = '100%'

}

function postionCamID2Position2(id) {

    if (document.getElementById(id).style.width == '50%')
        document.getElementById(id).style.width = '100%';

    else
        document.getElementById(id).style.width = '50%'
}

////////////END switch camera /////////////////////

////////////switchcamera/////////////////////
// add button for switch
var button_hideMyCam = document.createElement('div');
button_hideMyCam.innerHTML = '<button id="hidecambtn" class="btn btn-primary" type="button">Hide My Camera</button>';
var position4 = document.querySelector('.wrapper-sm');
position4.after(button_hideMyCam);

var saveHideCam = document.getElementById('hidecambtn').addEventListener('click', function () {
    positionMyVideo('myvideo');
    positionRemoteVideo('remotevideo');
});

// add fucntion postion camera
function positionMyVideo(id) {

    if (document.getElementById(id).style.width == '100%')
        document.getElementById(id).style.width = '50%';

    else
        document.getElementById(id).style.width = '100%'
}

function positionRemoteVideo(id) {

    if (document.getElementById(id).style.width == '100vh')
        document.getElementById(id).style.width = '';

    else
        document.getElementById(id).style.width = '100vh'

}
// add button for full
var button_fullScreen = document.createElement('div');
button_fullScreen.innerHTML = '<button id="button_fullScreen" class="btn btn-primary" type="button_fullScreen">Fullscreen</button>';
var position5 = document.querySelector('.wrapper-sm');
position5.after(button_fullScreen);
var gofull = document.getElementById('button_fullScreen').addEventListener('click', function () {
    fullscreen(button_fullScreen);
});

let fullscreen = function () {

    let enter = function () {
        let body = document.body;
        if (body.requestFullscreen) body.requestFullscreen();
        else if (body.webkitRequestFullscreen) body.webkitRequestFullscreen();
        else if (body.mozRequestFullScreen) body.mozRequestFullScreen();
        else if (body.msRequestFullscreen) body.msRequestFullscreen();
    };

    let exit = function () {
        if (document.exitFullscreen) document.exitFullscreen();
        else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
        else if (document.mozCancelFullScreen) document.mozCancelFullScreen();
        else if (document.msExitFullscreen) document.msExitFullscreen();
    };

    let attemptToGetState = element => element && element !== null;

    return function (action = undefined) {
        if (action === true) enter();
        else if (action === false) exit();
        else {
            let currentlyFullscreen = (
                attemptToGetState(document.fullscreenElement) ||
                attemptToGetState(document.webkitFullscreenElement) ||
                attemptToGetState(document.mozFullScreenElement) ||
                attemptToGetState(document.msFullscreenElement)
            );
            if (action === undefined) return !!currentlyFullscreen;
            else currentlyFullscreen ? exit() : enter();
        }
    };

}();

////////////Record button/////////////////////
(function () {
    'use strict';

    function addGlobalStyle(css) {
        var head, style;
        head = document.getElementsByTagName('head')[0];
        if (!head) {
            return;
        }
        style = document.createElement('style');
        style.type = 'text/css';
        style.innerHTML = css;
        head.appendChild(style);
    }

    addGlobalStyle('#start-stop{ position:fixed;bottom: 4px ;right:385px;}');
    addGlobalStyle('#save-option{ position:fixed;bottom: 4px ;right:450px;}');
    addGlobalStyle('#upload-to-php, #youtube, #recording-player > div.media-container > div.media-box > section > video{ display:none}');
    addGlobalStyle('#recording-player > div.media-container > div.media-box > h2{bottom: 36px ;right:4px;}')
    addGlobalStyle('.recording-media { display:none;}');
    addGlobalStyle('#time-slice{ position:fixed;bottom: 36px ;right:392px;}');
    addGlobalStyle('#video-status{position:fixed; bottom:36px; left;4px;}');
    addGlobalStyle('#save-to-disk{ background-color:#d54248;}');
    addGlobalStyle('#stream-button{ position:fixed;bottom: 4px ;left:4px;}');
    addGlobalStyle('#btn-start-stream:focus, #btn-start-stream:hover, .open .dropdown-toggle.btn-primary {  background-color: #000;    color: #fff}');
    addGlobalStyle('#RecordRTC_Extension_Options{ position:fixed;bottom: 30px ;left:4px;}');
    addGlobalStyle('#buttons-rtc{ position:fixed;bottom:4px ;right:555px;}');
    addGlobalStyle('#videortextension{ display:none;}');
    addGlobalStyle('#streamtest{ position:fixed;bottom:60px ;left:155px;}');


})();

(function () {
/*    'use strict';
document.onkeyup=function(e){
  var e1 = e1 || window.event; // for IE to cover IEs window event-object
  if(e1.Control && e1.which == 65) {
    alert('Keyboard shortcut working!');
    return false;
  }
}*/
 /* // add button to view stream  screen
    var startStream2 = document.createElement('div');
    startStream2.innerHTML = '<video id="video" autoplay playsinline controls muted="false" volume=1></video><div id="overlay"><div id="info-bar"></div></div><div id="stats-bar"><div id="hide-stats-bar">x</div><div id="stats-bar-html"></div></div><div id="chat-container"><div id="chat-messages"></div><input type="text" id="txt-chat-message" placeholder="Enter Chat Message"></div>';
    var posstartStream2 = document.querySelector('.wrapper-sm');
    posstartStream2.after(startStream2);
*/

/*    // add button to view stream  screen
    var startStream = document.createElement('div');
    startStream.innerHTML = '<div id="streamtest"><div id="radio-container"><label><input type="radio" id="camera" checked> Camera</label><label><input type="radio" id="microphone"> Microphone</label><label><input type="radio" id="screen"> Screen</label></div><button id="getUserMedia">getUserMedia</button><br><video controls autoplay playsinline></video><div id="logs"></div></div>';
    var posstartStream = document.querySelector('.wrapper-sm');
    posstartStream.after(startStream);*/

  /*  // add Streaming
    var StreamButton = document.createElement('div');
    StreamButton.innerHTML = '<div id="stream-button"><button class="btn btn-primary" id="btn-start-stream" class="btn btn-primary"style="margin-right:3px;height:22px; border-color: #4c3d3e;"><a href="https://chrome.google.com/webstore/detail/webrtc-desktop-sharing/nkemblooioekjnpfekmjhpgkackcajhg" target="_blank" style="color:#404442; vertical-align:top; line-height: 10px;">Stream & Share your games with WebRTC Desktop Sharing Extension for Chrome only</a></button><button id="btn-stop-streaming" class="btn btn-primary"style="display:none;margin-right:3px;">Stop Streaming</button></div>';
    var posStreamButton = document.querySelector('.wrapper-sm');
    posStreamButton.after(StreamButton);
*/
    // add Selectmedia
    var Selectmedia = document.createElement('div');
    Selectmedia.innerHTML = '<select class="recording-media">-<option value="record-screen">Full Screen</option><option value="record-audio-plus-video" style="display: none;">Microphone+Camera</option><option value="record-audio" style="display: none;">Microphone</option><option value="record-audio-plus-screen">Microphone+Screen</option></select>';
    var posSelectmedia = document.querySelector('.wrapper-sm');
    posSelectmedia.after(Selectmedia);

    // add Selectformat
    var Selectformat = document.createElement('div');
    Selectformat.innerHTML = '<select class="media-container-format" style="display: none;"><option>default</option><option>vp8</option><option>vp9</option><option>h264</option><option>mkv</option><option disabled="">opus</option><option disabled="">ogg</option><option disabled="">pcm</option><option>gif</option><option>whammy</option><option>WebAssembly</option></select>';
    var posSelectformat = document.querySelector('.wrapper-sm');
    posSelectformat.after(Selectformat);

    // add Selecttimeslice
    var Selecttimeslice = document.createElement('div');
    Selecttimeslice.innerHTML = '<div id="time-slice" style="display: none;"><input type="checkbox" id="chk-timeSlice" style="margin:0;width:auto;opacity: 0.4;vertical-align: middle;" title="Use intervals based recording"><label for="chk-timeSlice" style="font-size: 12px;margin:0;width: auto;opacity: 0.4cursor: pointer;-webkit-user-select:none;user-select:none;" title="Use intervals based recording">timeSlice?</label></div>';
    var posSelecttimeslice = document.querySelector('.wrapper-sm');
    posSelecttimeslice.after(Selecttimeslice);
    // add Selectbitrates
    var Selectbitrates = document.createElement('div');
    Selectbitrates.innerHTML = '<select class="media-bitrates" style="display: none;"><option value="default">Default bitrates</option><option value="8000000000">1 GB bps</option><option value="800000000">100 MB bps</option><option value="8000000">1 MB bps</option><option value="800000">100 KB bps</option><option value="8000">1 KB bps</option><option value="800">100 Bytes bps</option></select>';
    var posSelectbitrates = document.querySelector('.wrapper-sm');
    posSelectbitrates.after(Selectbitrates);

    // add Selectframerates
    var Selectframerates = document.createElement('div');
    Selectframerates.innerHTML = '<select class="media-framerates" style="display: none;"><option value="default">Default framerates</option><option value="5">5 fps</option><option value="15">15 fps</option><option value="24">24 fps</option><option value="30">30 fps</option><option value="60">60 fps</option></select>';
    var posSelectframerates = document.querySelector('.wrapper-sm');
    posSelectframerates.after(Selectframerates);

    // add Selectresolutions
    var Selectresolutions = document.createElement('div');
    Selectresolutions.innerHTML = '<select class="media-resolutions" style="display: none;"><option value="default">Default resolutions</option><option value="1920x1080">1080p</option><option value="1280x720">720p</option><option value="640x480">480p</option><option value="3840x2160">4K Ultra HD (3840x2160)</option></select>';
    var posSelectresolutions = document.querySelector('.wrapper-sm');
    posSelectresolutions.after(Selectresolutions);

    // add fixSeeking
    var fixSeeking = document.createElement('div');
    fixSeeking.innerHTML = '<div style="display: none;"><input type="checkbox" id="chk-fixSeeking" style=" display:none;margin:0;width:auto;" title="Fix video seeking issues?"><label for="chk-fixSeeking" style=" display:none;font-size: 15px;margin:0;width: auto;cursor: pointer;-webkit-user-select:none;user-select:none;" title="Fix video seeking issues?">Fix Seeking Issues?</label></div>';
    var posfixSeeking = document.querySelector('.wrapper-sm');
    posfixSeeking.after(fixSeeking);

    // add button StartStop
    var StartStop = document.createElement('div');
    StartStop.innerHTML = '<div id="start-stop"><button class="btn btn-primary" title="Recording without sounds - But no needs extension"id="btn-start-recording" class="btn btn-primary"style="margin-right:3px;">REC - no audio</button><button id="btn-pause-recording" class="btn btn-primary" style="display: none; ">Pause</button></div>';
    var posStartStop = document.querySelector('.wrapper-sm');
    posStartStop.after(StartStop);

    // add button Save record
    var buttonrecord = document.createElement('div');
    buttonrecord.innerHTML = '<div id="save-option" style="text-align: center; display: none;"><button id="save-to-disk"class="btn btn-primary"style="margin-right:5px;">Save</button><button id="open-new-tab" class="btn btn-primary">Preview</button><button id="upload-to-php">Upload to PHP</button></div>';
    var posbuttonrecord = document.querySelector('.wrapper-sm');
    posbuttonrecord.after(buttonrecord);

    // add button to view video on screen
    var viewvideo = document.createElement('div');
    viewvideo.innerHTML = '<div class="media-controls"></div><div class="control zoom-in"></div><div class="volume-control"></div><div id="recording-player"></div><div class="media-box"></div>';
    var posviewvideo = document.querySelector('.wrapper-sm');
    posviewvideo.after(viewvideo);

    // add button YouTube
    var buttonYouTube = document.createElement('div');
    buttonYouTube.innerHTML = '<div id="youtube" style="margin-top: 10px;"><span id="signinButton" class="pre-sign-in"><spanclass="g-signin"data-callback="signinCallback"data-clientid="41556190767-115ifahd55lk4ln5pop4jus55cr4l7oh.apps.googleusercontent.com"data-cookiepolicy="single_host_origin"data-scope="https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube"></span></span><button id="upload-to-youtube" style="vertical-align:top;">Upload to YouTube</button></div></div>';
    var posbuttonYouTube = document.querySelector('.wrapper-sm');
    posbuttonYouTube.after(buttonYouTube);

    // add divAutoplay
    var divAutoplay = document.createElement('div');
    divAutoplay.innerHTML = '<section><video autoplay="" style="max-height: 880px;"></video></section>';
    var posdivAutoplay = document.querySelector('.wrapper-sm');
    posdivAutoplay.after(divAutoplay);
    //
    //
    /*// add button to view video on screen
  var videotime = document.createElement('div');
  videotime.innerHTML = '<div id="video-status"><label>State preview:  </label><h5 id="state-preview" style="color: red;">inactive</h5></div>';
  var posvideotime = document.querySelector('.wrapper-sm');
  posvideotime.after(videotime);
  */
})();
// add RecordRTC_Extension_Options
var RecordExtensionOptions = document.createElement('div');
RecordExtensionOptions.innerHTML ='<select style="display:none" id="RecordRTC_Extension_Options"><option value="0">Screen Only (without audio)</option><option value="1">Screen + Microphone</option><option value="2">Screen + Speakers </option><option value="3">Screen + Microphone + Speakers (For game record)</option><option value="4">Chrome Tab (Image Only)</option><option value="7">Microphone + Camera (Your Camera & sounds Only)</option><option value="8">Microphone + Speakers (Sounds Only)</option><option value="9">Microphone Only</option></select><div id="buttons-rtc"><video id="videortextension" controls autoplay playsinline></video><button id="web-rtc-stream" title="Recording with sounds - require Chrome Extension" class="btn btn-primary" style="margin-right:3px;">Stream</button><button id="btn-start-recording2" title="Recording with sounds - require Chrome Extension" class="btn btn-primary" style="margin-right:3px;">REC - with Audio</button><button id="btn-stop-recording2" style="display:none;" class="btn btn-primary">Stop REC</button></div>';
//'<div id="stream-button"><button class="btn btn-primary" id="btn-start-stream" class="btn btn-primary"style="margin-right:3px;height:22px; border-color: #4c3d3e;"><a href="https://chrome.google.com/webstore/detail/webrtc-desktop-sharing/nkemblooioekjnpfekmjhpgkackcajhg" target="_blank" style="color:#404442; vertical-align:top; line-height: 10px;">Stream & Share your games with WebRTC Desktop Sharing Extension for Chrome only</a></button><button id="btn-stop-streaming" class="btn btn-primary"style="display:none;margin-right:3px;">Stop Streaming</button></div>';
var posRecordExtensionOptions = document.querySelector('.wrapper-sm');
posRecordExtensionOptions.after(RecordExtensionOptions);

//////////////////////Test JS STREAM
         document.querySelector('#web-rtc-stream').onclick = function (){
       if(typeof onAccessApproved === 'undefined') {
if (window.confirm("Share your matchs with your friends. Only for Google Chrome.\nClick Ok to install it and refresh the game with F5. Click Cancel to stay here.\n\nYou can use this extension with the button in the Chrome tab. You can use it on any website to test it (See tutorial on extension page).\nChoose Screen + Microphone + Speakers It will share Your screen, your micro sounds & the opponent sounds.\nShare link appears. ")) { // if they clicked "ok"
    window.open('https://chrome.google.com/webstore/detail/webrtc-desktop-sharing/nkemblooioekjnpfekmjhpgkackcajhg','_blank');
} else { // if they clicked "cancel"
    window.open
    return;
}
   ;}};

///////////////End Test Stream

(function () {

    var params = {},
        r = /([^&=]+)=?([^&]*)/g;

    function d(s) {
        return decodeURIComponent(s.replace(/\+/g, ' '));
    }

    var match, search = window.location.search;
    while (match = r.exec(search.substring(1))) {
        params[d(match[1])] = d(match[2]);

        if (d(match[2]) === 'true' || d(match[2]) === 'false') {
            params[d(match[1])] = d(match[2]) === 'true' ? true : false;
        }
    }

    window.params = params;
})();

function addStreamStopListener(stream, callback) {
    stream.addEventListener('ended', function () {
        callback();
        callback = function () {};
    }, false);
    stream.addEventListener('inactive', function () {
        callback();
        callback = function () {};
    }, false);
    stream.getTracks().forEach(function (track) {
        track.addEventListener('ended', function () {
            callback();
            callback = function () {};
        }, false);
        track.addEventListener('inactive', function () {
            callback();
            callback = function () {};
        }, false);
    });
}

var video = document.createElement('video');
video.controls = false;
var mediaElement = getHTMLMediaElement(video, {
    title: ' ',
    buttons: ['full-screen' /*, 'take-snapshot'*/ ],
    showOnMouseEnter: false,
    width: 360,
    onTakeSnapshot: function () {
        var canvas = document.createElement('canvas');
        canvas.width = mediaElement.clientWidth;
        canvas.height = mediaElement.clientHeight;

        var context = canvas.getContext('2d');
        context.drawImage(recordingPlayer, 0, 0, canvas.width, canvas.height);

        window.open(canvas.toDataURL('image/png'));
    }
});
document.getElementById('recording-player').appendChild(mediaElement);

var div = document.createElement('section');
mediaElement.media.parentNode.appendChild(div);
mediaElement.media.muted = false;
mediaElement.media.autoplay = true;
mediaElement.media.playsinline = true;
div.appendChild(mediaElement.media);

var recordingPlayer = mediaElement.media;
var recordingMedia = document.querySelector('.recording-media');
var mediaContainerFormat = document.querySelector('.media-container-format');
var mimeType = 'video/webm';
var fileExtension = 'webm';
var type = 'video';
var recorderType;
var defaultWidth;
var defaultHeight;
var btnStartRecording = document.querySelector('#btn-start-recording');

window.onbeforeunload = function () {
    btnStartRecording.disabled = false;
    recordingMedia.disabled = false;
    mediaContainerFormat.disabled = false;

    chkFixSeeking.parentNode.style.display = 'inline-block';

};

btnStartRecording.onclick = function (event) {
    var button = btnStartRecording;

    if (button.innerHTML === 'Stop REC') {
        btnPauseRecording.style.display = 'none';
        button.disabled = true;

        button.disableStateWaiting = true;

        setTimeout(function () {
            button.disabled = false;
            button.disableStateWaiting = false;

        }, 2000);

        button.innerHTML = 'Start REC';

        function stopStream() {
            if (button.stream && button.stream.stop) {
                button.stream.stop();
                button.stream = null;

            }

            if (button.stream instanceof Array) {
                button.stream.forEach(function (stream) {
                    stream.stop();
                });
                button.stream = null;
            }

            videoBitsPerSecond = null;
            var html = 'Recording status: stopped - ';
            html += 'Size: ' + bytesToSize(button.recordRTC.getBlob().size);
            recordingPlayer.parentNode.parentNode.querySelector('h2').innerHTML = html;
        }

        if (button.recordRTC) {
            if (button.recordRTC.length) {
                button.recordRTC[0].stopRecording(function (url) {
                    if (!button.recordRTC[1]) {
                        button.recordingEndedCallback(url);
                        stopStream();

                        saveToDiskOrOpenNewTab(button.recordRTC[0]);
                        return;
                    }

                    button.recordRTC[1].stopRecording(function (url) {
                        button.recordingEndedCallback(url);
                        stopStream();
                    });
                });
            }
            else {
                button.recordRTC.stopRecording(function (url) {
                    if (button.blobs && button.blobs.length) {
                        var blob = new File(button.blobs, getFileName(fileExtension), {
                            type: mimeType
                        });

                        button.recordRTC.getBlob = function () {
                            return blob;
                        };

                        url = URL.createObjectURL(blob);
                    }

                    if (chkFixSeeking.checked === true) {
                        // to fix video seeking issues
                        getSeekableBlob(button.recordRTC.getBlob(), function (seekableBlob) {
                            button.recordRTC.getBlob = function () {
                                return seekableBlob;
                            };

                            url = URL.createObjectURL(seekableBlob);

                            button.recordingEndedCallback(url);
                            saveToDiskOrOpenNewTab(button.recordRTC);
                            stopStream();
                        })
                        return;
                    }

                    button.recordingEndedCallback(url);
                    saveToDiskOrOpenNewTab(button.recordRTC);
                    stopStream();
                });
            }
        }

        return;
    }

    if (!event) return;

    button.disabled = true;

    var commonConfig = {
        onMediaCaptured: function (stream) {
            button.stream = stream;
            if (button.mediaCapturedCallback) {
                button.mediaCapturedCallback();
            }

            button.innerHTML = 'Stop REC';
            button.disabled = false;

            chkFixSeeking.parentNode.style.display = 'none';
        },
        onMediaStopped: function () {
            button.innerHTML = 'Start REC';

            if (!button.disableStateWaiting) {
                button.disabled = false;
            }

            chkFixSeeking.parentNode.style.display = 'inline-block';
        },
        onMediaCapturingFailed: function (error) {
            console.error('onMediaCapturingFailed:', error);

            if (error.toString().indexOf('no audio or video tracks available') !== -1) {
                alert('RecordRTC failed to start because there are no audio or video tracks available.');
            }

            if (error.name === 'PermissionDeniedError' && DetectRTC.browser.name === 'Firefox') {
                alert('Firefox requires version >= 52. Firefox also requires HTTPs.');
            }

            commonConfig.onMediaStopped();
        }
    };

    if (mediaContainerFormat.value === 'h264') {
        mimeType = 'video/webm\;codecs=h264';
        fileExtension = 'mp4';

        // video/mp4;codecs=avc1
        if (isMimeTypeSupported('video/mpeg')) {
            mimeType = 'video/mpeg';
        }
    }

    if (mediaContainerFormat.value === 'mkv' && isMimeTypeSupported('video/x-matroska;codecs=avc1')) {
        mimeType = 'video/x-matroska;codecs=avc1';
        fileExtension = 'mkv';
    }

    if (mediaContainerFormat.value === 'vp8' && isMimeTypeSupported('video/webm\;codecs=vp8')) {
        mimeType = 'video/webm\;codecs=vp8';
        fileExtension = 'webm';
        recorderType = null;
        type = 'video';
    }

    if (mediaContainerFormat.value === 'vp9' && isMimeTypeSupported('video/webm\;codecs=vp9')) {
        mimeType = 'video/webm\;codecs=vp9';
        fileExtension = 'webm';
        recorderType = null;
        type = 'video';
    }

    if (mediaContainerFormat.value === 'pcm') {
        mimeType = 'audio/wav';
        fileExtension = 'wav';
        recorderType = StereoAudioRecorder;
        type = 'audio';
    }

    if (mediaContainerFormat.value === 'opus' || mediaContainerFormat.value === 'ogg') {
        if (isMimeTypeSupported('audio/webm')) {
            mimeType = 'audio/webm';
            fileExtension = 'webm'; // webm
        }

        if (isMimeTypeSupported('audio/ogg')) {
            mimeType = 'audio/ogg; codecs=opus';
            fileExtension = 'ogg'; // ogg
        }

        recorderType = null;
        type = 'audio';
    }

    if (mediaContainerFormat.value === 'whammy') {
        mimeType = 'video/webm';
        fileExtension = 'webm';
        recorderType = WhammyRecorder;
        type = 'video';
    }

    if (mediaContainerFormat.value === 'WebAssembly') {
        mimeType = 'video/webm';
        fileExtension = 'webm';
        recorderType = WebAssemblyRecorder;
        type = 'video';
    }

    if (mediaContainerFormat.value === 'gif') {
        mimeType = 'image/gif';
        fileExtension = 'gif';
        recorderType = GifRecorder;
        type = 'gif';
    }

    if (mediaContainerFormat.value === 'default') {
        mimeType = 'video/webm\;codecs=vp9';
        fileExtension = 'webm';
        recorderType = null;
        type = 'video';
    }

    if (recordingMedia.value === 'record-audio') {
        captureAudio(commonConfig);

        button.mediaCapturedCallback = function () {
            var options = {
                type: type,
                mimeType: mimeType,
                leftChannel: params.leftChannel || false,
                disableLogs: params.disableLogs || false
            };

            if (params.sampleRate) {
                options.sampleRate = parseInt(params.sampleRate);
            }

            if (params.bufferSize) {
                options.bufferSize = parseInt(params.bufferSize);
            }

            if (recorderType) {
                options.recorderType = recorderType;
            }

            if (videoBitsPerSecond) {
                options.videoBitsPerSecond = videoBitsPerSecond;
            }

            if (DetectRTC.browser.name === 'Edge') {
                options.numberOfAudioChannels = 1;
            }

            options.ignoreMutedMedia = false;
            button.recordRTC = RecordRTC(button.stream, options);

            button.recordingEndedCallback = function (url) {
                setVideoURL(url);
            };

            button.recordRTC.startRecording();
            btnPauseRecording.style.display = '';
        };
    }

    if (recordingMedia.value === 'record-audio-plus-video') {
        captureAudioPlusVideo(commonConfig);

        button.mediaCapturedCallback = function () {
            if (typeof MediaRecorder === 'undefined') { // opera or chrome etc.
                button.recordRTC = [];

                if (!params.bufferSize) {
                    // it fixes audio issues whilst recording 720p
                    params.bufferSize = 16384;
                }

                var options = {
                    type: 'audio', // hard-code to set "audio"
                    leftChannel: params.leftChannel || false,
                    disableLogs: params.disableLogs || false,
                    video: recordingPlayer
                };

                if (params.sampleRate) {
                    options.sampleRate = parseInt(params.sampleRate);
                }

                if (params.bufferSize) {
                    options.bufferSize = parseInt(params.bufferSize);
                }

                if (params.frameInterval) {
                    options.frameInterval = parseInt(params.frameInterval);
                }

                if (recorderType) {
                    options.recorderType = recorderType;
                }

                if (videoBitsPerSecond) {
                    options.videoBitsPerSecond = videoBitsPerSecond;
                }

                options.ignoreMutedMedia = false;
                var audioRecorder = RecordRTC(button.stream, options);

                options.type = type;
                var videoRecorder = RecordRTC(button.stream, options);

                // to sync audio/video playbacks in browser!
                videoRecorder.initRecorder(function () {
                    audioRecorder.initRecorder(function () {
                        audioRecorder.startRecording();
                        videoRecorder.startRecording();
                        btnPauseRecording.style.display = '';
                    });
                });

                button.recordRTC.push(audioRecorder, videoRecorder);

                button.recordingEndedCallback = function () {
                    var audio = new Audio();
                    audio.src = audioRecorder.toURL();
                    audio.controls = true;
                    audio.autoplay = true;

                    recordingPlayer.parentNode.appendChild(document.createElement('hr'));
                    recordingPlayer.parentNode.appendChild(audio);

                    if (audio.paused) audio.play();
                };
                return;
            }

            var options2 = {
                type: type,
                mimeType: mimeType,
                disableLogs: params.disableLogs || false,
                getNativeBlob: false, // enable it for longer recordings
                video: recordingPlayer
            };

            if (recorderType) {
                options2.recorderType = recorderType;

                if (recorderType == WhammyRecorder || recorderType == GifRecorder || recorderType == WebAssemblyRecorder) {
                    options2.canvas = options2.video = {
                        width: defaultWidth || 320,
                        height: defaultHeight || 240
                    };
                }
            }

            if (videoBitsPerSecond) {
                options2.videoBitsPerSecond = videoBitsPerSecond;
            }

            if (timeSlice && typeof MediaRecorder !== 'undefined') {
                options2.timeSlice = timeSlice;
                button.blobs = [];
                options2.ondataavailable = function (blob) {
                    button.blobs.push(blob);
                };
            }

            options2.ignoreMutedMedia = false;
            button.recordRTC = RecordRTC(button.stream, options2);

            button.recordingEndedCallback = function (url) {
                setVideoURL(url);
            };

            button.recordRTC.startRecording();
            btnPauseRecording.style.display = '';
            recordingPlayer.parentNode.parentNode.querySelector('h2').innerHTML = '<img src="https://www.webrtc-experiment.com/images/progress.gif">';
        };
    }

    if (recordingMedia.value === 'record-screen') {
        captureScreen(commonConfig);

        button.mediaCapturedCallback = function () {
            var options = {
                type: type,
                mimeType: mimeType,
                disableLogs: params.disableLogs || false,
                getNativeBlob: false, // enable it for longer recordings
                video: recordingPlayer
            };

            if (recorderType) {
                options.recorderType = recorderType;

                if (recorderType == WhammyRecorder || recorderType == GifRecorder || recorderType == WebAssemblyRecorder) {
                    options.canvas = options.video = {
                        width: defaultWidth || 320,
                        height: defaultHeight || 240
                    };
                }
            }

            if (videoBitsPerSecond) {
                options.videoBitsPerSecond = videoBitsPerSecond;
            }

            options.ignoreMutedMedia = false;
            button.recordRTC = RecordRTC(button.stream, options);

            button.recordingEndedCallback = function (url) {
                setVideoURL(url);
            };

            button.recordRTC.startRecording();
            btnPauseRecording.style.display = '';
        };
    }

    // note: audio+tab is supported in Chrome 50+
    // todo: add audio+tab recording
    if (recordingMedia.value === 'record-audio-plus-screen') {
        captureAudioPlusScreen(commonConfig);

        button.mediaCapturedCallback = function () {
            var options = {
                type: type,
                mimeType: mimeType,
                disableLogs: params.disableLogs || false,
                getNativeBlob: false, // enable it for longer recordings
                video: recordingPlayer
            };

            if (recorderType) {
                options.recorderType = recorderType;

                if (recorderType == WhammyRecorder || recorderType == GifRecorder || recorderType == WebAssemblyRecorder) {
                    options.canvas = options.video = {
                        width: defaultWidth || 320,
                        height: defaultHeight || 240
                    };
                }
            }

            if (videoBitsPerSecond) {
                options.videoBitsPerSecond = videoBitsPerSecond;
            }

            options.ignoreMutedMedia = false;
            button.recordRTC = RecordRTC(button.stream, options);

            button.recordingEndedCallback = function (url) {
                setVideoURL(url);
            };

            button.recordRTC.startRecording();
            btnPauseRecording.style.display = '';
        };
    }
};

function captureVideo(config) {
    captureUserMedia({
        video: true
    }, function (videoStream) {
        config.onMediaCaptured(videoStream);

        addStreamStopListener(videoStream, function () {
            config.onMediaStopped();
        });
    }, function (error) {
        config.onMediaCapturingFailed(error);
    });
}

function captureAudio(config) {
    captureUserMedia({
        audio: true
    }, function (audioStream) {
        config.onMediaCaptured(audioStream);

        addStreamStopListener(audioStream, function () {
            config.onMediaStopped();
        });
    }, function (error) {
        config.onMediaCapturingFailed(error);
    });
}

function captureAudioPlusVideo(config) {
    captureUserMedia({
        video: true,
        audio: true
    }, function (audioVideoStream) {
        config.onMediaCaptured(audioVideoStream);

        if (audioVideoStream instanceof Array) {
            audioVideoStream.forEach(function (stream) {
                addStreamStopListener(stream, function () {
                    config.onMediaStopped();
                });
            });
            return;
        }

        addStreamStopListener(audioVideoStream, function () {
            config.onMediaStopped();
        });
    }, function (error) {
        config.onMediaCapturingFailed(error);
    });
}

var MY_DOMAIN = 'webrtc-experiment.com';

function isMyOwnDomain() {
    // replace "webrtc-experiment.com" with your own domain name
    return document.domain.indexOf(MY_DOMAIN) !== -1;
}

function isLocalHost() {
    // "chrome.exe" --enable-usermedia-screen-capturing
    // or firefox => about:config => "media.getusermedia.screensharing.allowed_domains" => add "localhost"
    return document.domain === 'localhost' || document.domain === '127.0.0.1';
}

var videoBitsPerSecond;

function setVideoBitrates() {
    var select = document.querySelector('.media-bitrates');
    var value = select.value;

    if (value == 'default') {
        videoBitsPerSecond = null;
        return;
    }

    videoBitsPerSecond = parseInt(value);
}

function getFrameRates(mediaConstraints) {
    if (!mediaConstraints.video) {
        return mediaConstraints;
    }

    var select = document.querySelector('.media-framerates');
    var value = select.value;

    if (value == 'default') {
        return mediaConstraints;
    }

    value = parseInt(value);

    if (DetectRTC.browser.name === 'Firefox') {
        mediaConstraints.video.frameRate = value;
        return mediaConstraints;
    }

    if (!mediaConstraints.video.mandatory) {
        mediaConstraints.video.mandatory = {};
        mediaConstraints.video.optional = [];
    }

    var isScreen = recordingMedia.value.toString().toLowerCase().indexOf('screen') != -1;
    if (isScreen) {
        mediaConstraints.video.mandatory.maxFrameRate = value;
    }
    else {
        mediaConstraints.video.mandatory.minFrameRate = value;
    }

    return mediaConstraints;
}

function setGetFromLocalStorage(selectors) {
    selectors.forEach(function (selector) {
        var storageItem = selector.replace(/\.|#/g, '');
        if (localStorage.getItem(storageItem)) {
            document.querySelector(selector).value = localStorage.getItem(storageItem);
        }

        addEventListenerToUploadLocalStorageItem(selector, ['change', 'blur'], function () {
            localStorage.setItem(storageItem, document.querySelector(selector).value);
        });
    });
}

function addEventListenerToUploadLocalStorageItem(selector, arr, callback) {
    arr.forEach(function (event) {
        document.querySelector(selector).addEventListener(event, callback, false);
    });
}

setGetFromLocalStorage(['.media-resolutions', '.media-framerates', '.media-bitrates', '.recording-media', '.media-container-format']);

function getVideoResolutions(mediaConstraints) {
    if (!mediaConstraints.video) {
        return mediaConstraints;
    }

    var select = document.querySelector('.media-resolutions');
    var value = select.value;

    if (value == 'default') {
        return mediaConstraints;
    }

    value = value.split('x');

    if (value.length != 2) {
        return mediaConstraints;
    }

    defaultWidth = parseInt(value[0]);
    defaultHeight = parseInt(value[1]);

    if (DetectRTC.browser.name === 'Firefox') {
        mediaConstraints.video.width = defaultWidth;
        mediaConstraints.video.height = defaultHeight;
        return mediaConstraints;
    }

    if (!mediaConstraints.video.mandatory) {
        mediaConstraints.video.mandatory = {};
        mediaConstraints.video.optional = [];
    }

    var isScreen = recordingMedia.value.toString().toLowerCase().indexOf('screen') != -1;

    if (isScreen) {
        mediaConstraints.video.mandatory.maxWidth = defaultWidth;
        mediaConstraints.video.mandatory.maxHeight = defaultHeight;
    }
    else {
        mediaConstraints.video.mandatory.minWidth = defaultWidth;
        mediaConstraints.video.mandatory.minHeight = defaultHeight;
    }

    return mediaConstraints;
}

function captureUserMedia(mediaConstraints, successCallback, errorCallback) {
    if (mediaConstraints.video == true) {
        mediaConstraints.video = {};
    }

    setVideoBitrates();

    mediaConstraints = getVideoResolutions(mediaConstraints);
    mediaConstraints = getFrameRates(mediaConstraints);

    var isBlackBerry = !!(/BB10|BlackBerry/i.test(navigator.userAgent || ''));
    if (isBlackBerry && !!(navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia)) {
        navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
        navigator.getUserMedia(mediaConstraints, successCallback, errorCallback);
        return;
    }

    navigator.mediaDevices.getUserMedia(mediaConstraints).then(function (stream) {
        successCallback(stream);

        setVideoURL(stream, true);
    }).catch(function (error) {
        if (error && (error.name === 'ConstraintNotSatisfiedError' || error.name === 'OverconstrainedError')) {
            alert('Your camera or browser does NOT supports selected resolutions or frame-rates. \n\nPlease select "default" resolutions.');
        }
        else if (error && error.message) {
            alert(error.message);
        }
        else {
            alert('Unable to make getUserMedia request. Please check browser console logs.');
        }

        errorCallback(error);
    });
}

function setMediaContainerFormat(arrayOfOptionsSupported) {
    var options = Array.prototype.slice.call(
        mediaContainerFormat.querySelectorAll('option')
    );

    var localStorageItem;
    if (localStorage.getItem('media-container-format')) {
        localStorageItem = localStorage.getItem('media-container-format');
    }

    var selectedItem;
    options.forEach(function (option) {
        option.disabled = true;

        if (arrayOfOptionsSupported.indexOf(option.value) !== -1) {
            option.disabled = false;

            if (localStorageItem && arrayOfOptionsSupported.indexOf(localStorageItem) != -1) {
                if (option.value != localStorageItem) return;
                option.selected = true;
                selectedItem = option;
                return;
            }

            if (!selectedItem) {
                option.selected = true;
                selectedItem = option;
            }
        }
    });
}

function isMimeTypeSupported(mimeType) {
    if (typeof MediaRecorder === 'undefined') {
        return false;
    }

    if (typeof MediaRecorder.isTypeSupported !== 'function') {
        return true;
    }

    return MediaRecorder.isTypeSupported(mimeType);
}

recordingMedia.onchange = function () {
    if (recordingMedia.value === 'record-audio') {
        var recordingOptions1 = [];

        if (isMimeTypeSupported('audio/webm')) {
            recordingOptions1.push('opus');
        }

        if (isMimeTypeSupported('audio/ogg')) {
            recordingOptions1.push('ogg');
        }

        recordingOptions1.push('pcm');

        setMediaContainerFormat(recordingOptions1);
        return;
    }

    var isChrome = !!window.chrome && !(!!window.opera || navigator.userAgent.indexOf(' OPR/') >= 0);

    var recordingOptions = ['vp8']; // MediaStreamRecorder with vp8

    if (isMimeTypeSupported('video/webm\;codecs=vp9')) {
        recordingOptions.push('vp9'); // MediaStreamRecorder with vp9
    }

    if (isMimeTypeSupported('video/webm\;codecs=h264')) {
        recordingOptions.push('h264'); // MediaStreamRecorder with h264
    }

    if (isMimeTypeSupported('video/x-matroska;codecs=avc1')) {
        recordingOptions.push('mkv'); // MediaStreamRecorder with mkv/matroska
    }

    recordingOptions.push('gif'); // GifRecorder

    if (DetectRTC.browser.name == 'Chrome') {
        recordingOptions.push('whammy'); // WhammyRecorder
    }

    if (DetectRTC.browser.name == 'Chrome') {
        recordingOptions.push('WebAssembly'); // WebAssemblyRecorder
    }

    recordingOptions.push('default'); // Default mimeType for MediaStreamRecorder

    setMediaContainerFormat(recordingOptions);
};
recordingMedia.onchange();

if (typeof MediaRecorder === 'undefined' && (DetectRTC.browser.name === 'Edge' || DetectRTC.browser.name === 'Safari')) {
    // webp isn't supported in Microsoft Edge
    // neither MediaRecorder API
    // so lets disable both video/screen recording options

    console.warn('Neither MediaRecorder API nor webp is supported in ' + DetectRTC.browser.name + '. You cam merely record audio.');

    recordingMedia.innerHTML = '<option value="record-audio">Audio</option>';
    setMediaContainerFormat(['pcm']);
}

function stringify(obj) {
    var result = '';
    Object.keys(obj).forEach(function (key) {
        if (typeof obj[key] === 'function') {
            return;
        }

        if (result.length) {
            result += ',';
        }

        result += key + ': ' + obj[key];
    });

    return result;
}

function mediaRecorderToStringify(mediaRecorder) {
    var result = '';
    result += 'mimeType: ' + mediaRecorder.mimeType;
    result += ', state: ' + mediaRecorder.state;
    result += ', audioBitsPerSecond: ' + mediaRecorder.audioBitsPerSecond;
    result += ', videoBitsPerSecond: ' + mediaRecorder.videoBitsPerSecond;
    if (mediaRecorder.stream) {
        result += ', streamid: ' + mediaRecorder.stream.id;
        result += ', stream-active: ' + mediaRecorder.stream.active;
    }
    return result;
}

function getFailureReport() {
    var info = 'RecordRTC seems failed. \n\n' + stringify(DetectRTC.browser) + '\n\n' + DetectRTC.osName + ' ' + DetectRTC.osVersion + '\n';

    if (typeof recorderType !== 'undefined' && recorderType) {
        info += '\nrecorderType: ' + recorderType.name;
    }

    if (typeof mimeType !== 'undefined') {
        info += '\nmimeType: ' + mimeType;
    }

    Array.prototype.slice.call(document.querySelectorAll('select')).forEach(function (select) {
        info += '\n' + (select.id || select.className) + ': ' + select.value;
    });

    if (btnStartRecording.recordRTC) {
        info += '\n\ninternal-recorder: ' + btnStartRecording.recordRTC.getInternalRecorder().name;

        if (btnStartRecording.recordRTC.getInternalRecorder().getAllStates) {
            info += '\n\nrecorder-states: ' + btnStartRecording.recordRTC.getInternalRecorder().getAllStates();
        }
    }

    if (btnStartRecording.stream) {
        info += '\n\naudio-tracks: ' + getTracks(btnStartRecording.stream, 'audio').length;
        info += '\nvideo-tracks: ' + getTracks(btnStartRecording.stream, 'video').length;
        info += '\nstream-active? ' + !!btnStartRecording.stream.active;

        btnStartRecording.stream.getTracks().forEach(function (track) {
            info += '\n' + track.kind + '-track-' + (track.label || track.id) + ': (enabled: ' + !!track.enabled + ', readyState: ' + track.readyState + ', muted: ' + !!track.muted + ')';

            if (track.getConstraints && Object.keys(track.getConstraints()).length) {
                info += '\n' + track.kind + '-track-getConstraints: ' + stringify(track.getConstraints());
            }

            if (track.getSettings && Object.keys(track.getSettings()).length) {
                info += '\n' + track.kind + '-track-getSettings: ' + stringify(track.getSettings());
            }
        });
    }

    if (timeSlice && btnStartRecording.recordRTC) {
        info += '\ntimeSlice: ' + timeSlice;

        if (btnStartRecording.recordRTC.getInternalRecorder().getArrayOfBlobs) {
            var blobSizes = [];
            btnStartRecording.recordRTC.getInternalRecorder().getArrayOfBlobs().forEach(function (blob) {
                blobSizes.push(blob.size);
            });
            info += '\nblobSizes: ' + blobSizes;
        }
    }

    else if (btnStartRecording.recordRTC && btnStartRecording.recordRTC.getBlob()) {
        info += '\n\nblobSize: ' + bytesToSize(btnStartRecording.recordRTC.getBlob().size);
    }

    if (btnStartRecording.recordRTC && btnStartRecording.recordRTC.getInternalRecorder() && btnStartRecording.recordRTC.getInternalRecorder().getInternalRecorder && btnStartRecording.recordRTC.getInternalRecorder().getInternalRecorder()) {
        info += '\n\ngetInternalRecorder: ' + mediaRecorderToStringify(btnStartRecording.recordRTC.getInternalRecorder().getInternalRecorder());
    }

    return info;
}

function saveToDiskOrOpenNewTab(recordRTC) {
    if (!recordRTC.getBlob().size) {
        var info = getFailureReport();
        console.log('blob', recordRTC.getBlob());
        console.log('recordrtc instance', recordRTC);
        console.log('report', info);

        if (mediaContainerFormat.value !== 'default') {
            alert('RecordRTC seems failed recording using ' + mediaContainerFormat.value + '. Please choose "default" option from the drop down and record again.');
        }
        else {
            alert('RecordRTC seems failed. Unexpected issue. You can read the email in your console log. \n\nPlease report using disqus chat below.');
        }

        if (mediaContainerFormat.value !== 'vp9' && DetectRTC.browser.name === 'Chrome') {
            alert('Please record using VP9 encoder. (select from the dropdown)');
        }
    }

    var fileName = getFileName(fileExtension);

    document.querySelector('#save-to-disk').parentNode.style.display = 'block';
    document.querySelector('#save-to-disk').onclick = function () {
        if (!recordRTC) return alert('No recording found.');

        var file = new File([recordRTC.getBlob()], fileName, {
            type: mimeType
        });

        invokeSaveAsDialog(file, file.name);
    };

    document.querySelector('#open-new-tab').onclick = function () {
        if (!recordRTC) return alert('No recording found.');

        var file = new File([recordRTC.getBlob()], fileName, {
            type: mimeType
        });

        window.open(URL.createObjectURL(file));
    };

    // upload to PHP server
    if (isMyOwnDomain()) {
        document.querySelector('#upload-to-php').disabled = true;
        document.querySelector('#upload-to-php').style.display = 'none';
    }
    else {
        document.querySelector('#upload-to-php').disabled = true;
    }

    document.querySelector('#upload-to-php').onclick = function () {
        if (isMyOwnDomain()) {
            alert('PHP Upload is not available on this domain.');
            return;
        }

        if (!recordRTC) return alert('No recording found.');
        this.disabled = true;

        var button = this;
        uploadToPHPServer(fileName, recordRTC, function (progress, fileURL) {
            if (progress === 'ended') {
                button.disabled = false;
                button.innerHTML = 'Click to download from server';
                button.onclick = function () {
                    SaveFileURLToDisk(fileURL, fileName);
                };

                setVideoURL(fileURL);

                var html = 'Uploaded to PHP.<br>Download using below link:<br>';
                html += '<a href="' + fileURL + '" download="' + fileName + '" style="color: yellow; display: block; margin-top: 15px;">' + fileName + '</a>';
                recordingPlayer.parentNode.parentNode.querySelector('h2').innerHTML = html;
                return;
            }
            button.innerHTML = progress;
            recordingPlayer.parentNode.parentNode.querySelector('h2').innerHTML = progress;
        });
    };

    // upload to YouTube!
    document.querySelector('#upload-to-youtube').disabled = false;
    document.querySelector('#upload-to-youtube').onclick = function () {
        if (!recordRTC) return alert('No recording found.');
        this.disabled = true;

        if (isLocalHost()) {
            alert('This feature is NOT available on localhost.');
            return;
        }

        if (isMyOwnDomain() === false) {
            var url = 'https://github.com/muaz-khan/RecordRTC/wiki/Upload-to-YouTube';
            alert('YouTube API key is configured to work only on webrtc-experiment.com. Please create your own YouTube key + oAuth client-id and use it instead.\n\nWiki page: ' + url);

            // check instructions on the wiki page
            location.href = url;
            return;
        }

        var button = this;
        uploadToYouTube(fileName, recordRTC, function (percentageComplete, fileURL) {
            if (percentageComplete == 'uploaded') {
                button.disabled = false;
                button.innerHTML = 'Uploaded. However YouTube is still processing.';
                button.onclick = function () {
                    window.open(fileURL);
                };
                return;
            }
            if (percentageComplete == 'processed') {
                button.disabled = false;
                button.innerHTML = 'Uploaded & Processed. Click to open YouTube video.';
                button.onclick = function () {
                    window.open(fileURL);
                };

                document.querySelector('h1').innerHTML = 'Your video has been uploaded.';
                window.scrollTo(0, 0);

                alert('Your video has been uploaded.');
                return;
            }
            if (percentageComplete == 'failed') {
                button.disabled = false;
                button.innerHTML = 'YouTube failed transcoding the video.';
                button.onclick = function () {
                    window.open(fileURL);
                };
                return;
            }
            button.innerHTML = percentageComplete + '% uploaded to YouTube.';
        });
    };
}

function uploadToPHPServer(fileName, recordRTC, callback) {
    var blob = recordRTC instanceof Blob ? recordRTC : recordRTC.getBlob();

    blob = new File([blob], getFileName(fileExtension), {
        type: mimeType
    });

    // create FormData
    var formData = new FormData();
    formData.append('video-filename', fileName);
    formData.append('video-blob', blob);

    callback('Uploading recorded-file to server.');

    // var upload_url = 'https://your-domain.com/files-uploader/';
    var upload_url = 'RecordRTC-to-PHP/save.php';

    // var upload_directory = upload_url;
    var upload_directory = 'RecordRTC-to-PHP/uploads/';

    makeXMLHttpRequest(upload_url, formData, function (progress) {
        if (progress !== 'upload-ended') {
            callback(progress);
            return;
        }

        callback('ended', upload_directory + fileName);
    });
}

function makeXMLHttpRequest(url, data, callback) {
    var request = new XMLHttpRequest();
    request.onreadystatechange = function () {
        if (request.readyState == 4 && request.status == 200) {
            if (request.responseText === 'success') {
                callback('upload-ended');
                return;
            }

            document.querySelector('.header').parentNode.style = 'text-align: left; color: red; padding: 5px 10px;';
            document.querySelector('.header').parentNode.innerHTML = request.responseText;
        }
    };

    request.upload.onloadstart = function () {
        callback('Upload started...');
    };

    request.upload.onprogress = function (event) {
        callback('Upload Progress ' + Math.round(event.loaded / event.total * 100) + "%");
    };

    request.upload.onload = function () {
        callback('progress-about-to-end');
    };

    request.upload.onload = function () {
        callback('Getting File URL..');
    };

    request.upload.onerror = function (error) {
        callback('Failed to upload to server');
    };

    request.upload.onabort = function (error) {
        callback('Upload aborted.');
    };

    request.open('POST', url);
    request.send(data);
}

function getRandomString() {
    if (window.crypto && window.crypto.getRandomValues && navigator.userAgent.indexOf('Safari') === -1) {
        var a = window.crypto.getRandomValues(new Uint32Array(3)),
            token = '';
        for (var i = 0, l = a.length; i < l; i++) {
            token += a[i].toString(36);
        }
        return token;
    }
    else {
        return (Math.random() * new Date().getTime()).toString(36).replace(/\./g, '');
    }
}

function getFileName(fileExtension) {
    var d = new Date();
    var year = d.getUTCFullYear();
    var month = d.getUTCMonth();
    var date = d.getUTCDate();
    return 'Webcamdarts-' + year + month + date + '-' + getRandomString() + '.' + fileExtension;
}

function SaveFileURLToDisk(fileUrl, fileName) {
    var hyperlink = document.createElement('a');
    hyperlink.href = fileUrl;
    hyperlink.target = '_blank';
    hyperlink.download = fileName || fileUrl;

    (document.body || document.documentElement).appendChild(hyperlink);
    hyperlink.onclick = function () {
        (document.body || document.documentElement).removeChild(hyperlink);

        // required for Firefox
        window.URL.revokeObjectURL(hyperlink.href);
    };

    var mouseEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true
    });

    hyperlink.dispatchEvent(mouseEvent);
}

function getURL(arg) {
    var url = arg;

    if (arg instanceof Blob || arg instanceof File) {
        url = URL.createObjectURL(arg);
    }

    if (arg instanceof RecordRTC || arg.getBlob) {
        url = URL.createObjectURL(arg.getBlob());
    }

    if (arg instanceof MediaStream || arg.getTracks) {
        // url = URL.createObjectURL(arg);
    }

    return url;
}

function setVideoURL(arg, forceNonImage) {
    var url = getURL(arg);

    var parentNode = recordingPlayer.parentNode;
    parentNode.removeChild(recordingPlayer);
    parentNode.innerHTML = '';

    var elem = 'video';
    if (type == 'gif' && !forceNonImage) {
        elem = 'img';
    }
    if (type == 'audio') {
        elem = 'audio';
    }

    recordingPlayer = document.createElement(elem);

    if (arg instanceof MediaStream) {
        recordingPlayer.muted = true;
    }

    recordingPlayer.addEventListener('loadedmetadata', function () {
        if (navigator.userAgent.toLowerCase().indexOf('android') == -1) return;

        // android
        setTimeout(function () {
            if (typeof recordingPlayer.play === 'function') {
                recordingPlayer.play();
            }
        }, 2000);
    }, false);

    recordingPlayer.poster = '';

    if (arg instanceof MediaStream) {
        recordingPlayer.srcObject = arg;
    }
    else {
        recordingPlayer.src = url;
    }

    if (typeof recordingPlayer.play === 'function') {
        recordingPlayer.play();
    }

    recordingPlayer.addEventListener('ended', function () {
        url = getURL(arg);

        if (arg instanceof MediaStream) {
            recordingPlayer.srcObject = arg;
        }
        else {
            recordingPlayer.src = url;
        }
    });

    parentNode.appendChild(recordingPlayer);
}

function captureScreen(config) {
    if (navigator.getDisplayMedia) {
        navigator.getDisplayMedia({
            video: true
        }).then(screenStream => {
            config.onMediaCaptured(screenStream);

            addStreamStopListener(screenStream, function () {
                // config.onMediaStopped();

                btnStartRecording.onclick();
            });

            setVideoURL(screenStream, true);
        }).catch(function (error) {
            config.onMediaCapturingFailed(error);
        });
    }
    else if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia({
            video: true
        }).then(screenStream => {
            config.onMediaCaptured(screenStream);

            addStreamStopListener(screenStream, function () {
                // config.onMediaStopped();

                btnStartRecording.onclick();
            });

            setVideoURL(screenStream, true);
        }).catch(function (error) {
            config.onMediaCapturingFailed(error);
        });
    }
    else {
        var error = 'getDisplayMedia API are not supported in this browser.';
        config.onMediaCapturingFailed(error);
        alert(error);
    }
}

function captureAudioPlusScreen(config) {
    if (navigator.getDisplayMedia) {
        navigator.getDisplayMedia({
            video: true
        }).then(screenStream => {
            navigator.mediaDevices.getUserMedia({
                audio: true
            }).then(function (mic) {
                screenStream.addTrack(mic.getTracks()[0]);

                config.onMediaCaptured(screenStream);

                addStreamStopListener(screenStream, function () {
                    // config.onMediaStopped();

                    btnStartRecording.onclick();
                });

                setVideoURL(screenStream, true);
            });
        }).catch(function (error) {
            config.onMediaCapturingFailed(error);
        });
    }
    else if (navigator.mediaDevices.getDisplayMedia) {
        navigator.mediaDevices.getDisplayMedia({
            video: true
        }).then(screenStream => {
            navigator.mediaDevices.getUserMedia({
                audio: true
            }).then(function (mic) {
                screenStream.addTrack(mic.getTracks()[0]);

                config.onMediaCaptured(screenStream);

                addStreamStopListener(screenStream, function () {
                    // config.onMediaStopped();

                    btnStartRecording.onclick();
                });

                setVideoURL(screenStream, true);
            });
        }).catch(function (error) {
            config.onMediaCapturingFailed(error);
        });
    }
    else {
        var error = 'getDisplayMedia API are not supported in this browser.';
        config.onMediaCapturingFailed(error);
        alert(error);
    }
}

/* upload_youtube_video.js Copyright 2017 Google Inc. All Rights Reserved. */

function uploadToYouTube(fileName, recordRTC, callback) {
    var blob = recordRTC instanceof Blob ? recordRTC : recordRTC.getBlob();

    blob = new File([blob], getFileName(fileExtension), {
        type: mimeType
    });

    if (!uploadVideo) {
        alert('YouTube API are not available.');
        return;
    }

    uploadVideo.callback = callback;
    uploadVideo.uploadFile(fileName, blob);
}

var uploadVideo;

var signinCallback = function (result) {
    if (result.access_token) {
        uploadVideo = new UploadVideo();
        uploadVideo.ready(result.access_token);

    }
    else {
        // console.error('YouTube error', result);
        // document.querySelector('#upload-to-youtube').style.display = 'none';
    }
};

var STATUS_POLLING_INTERVAL_MILLIS = 60 * 1000; // One minute.

var UploadVideo = function () {
    this.tags = ['recordrtc'];
    this.categoryId = 28; // via: http://stackoverflow.com/a/35877512/552182
    this.videoId = '';
    this.uploadStartTime = 0;
};

UploadVideo.prototype.ready = function (accessToken) {
    this.accessToken = accessToken;
    this.gapi = gapi;
    this.authenticated = true;
    false && this.gapi.client.request({
        path: '/youtube/v3/channels',
        params: {
            part: 'snippet',
            mine: true
        },
        callback: function (response) {
            if (!response.error) {
                // response.items[0].snippet.title -- channel title
                // response.items[0].snippet.thumbnails.default.url -- channel thumbnail
            }
        }.bind(this)
    });
};

UploadVideo.prototype.uploadFile = function (fileName, file) {
    var metadata = {
        snippet: {
            title: fileName,
            description: fileName,
            tags: this.tags,
            categoryId: this.categoryId
        },
        status: {
            privacyStatus: 'public'
        }
    };
    var uploader = new MediaUploader({
        baseUrl: 'https://www.googleapis.com/upload/youtube/v3/videos',
        file: file,
        token: this.accessToken,
        metadata: metadata,
        params: {
            part: Object.keys(metadata).join(',')
        },
        onError: function (data) {
            var message = data;
            try {
                var errorResponse = JSON.parse(data);
                message = errorResponse.error.message;
            }
            finally {
                alert(message);
            }
        }.bind(this),
        onProgress: function (data) {
            var bytesUploaded = data.loaded;
            var totalBytes = parseInt(data.total);
            var percentageComplete = parseInt((bytesUploaded * 100) / totalBytes);

            uploadVideo.callback(percentageComplete);
        }.bind(this),
        onComplete: function (data) {
            var uploadResponse = JSON.parse(data);
            this.videoId = uploadResponse.id;
            this.videoURL = 'https://www.youtube.com/watch?v=' + this.videoId;
            uploadVideo.callback('uploaded', this.videoURL);

            setTimeout(this.pollForVideoStatus, 2000);
        }.bind(this)
    });
    this.uploadStartTime = Date.now();
    uploader.upload();
};

UploadVideo.prototype.pollForVideoStatus = function () {
    this.gapi.client.request({
        path: '/youtube/v3/videos',
        params: {
            part: 'status,player',
            id: this.videoId
        },
        callback: function (response) {
            if (response.error) {
                uploadVideo.pollForVideoStatus();
            }
            else {
                var uploadStatus = response.items[0].status.uploadStatus;
                switch (uploadStatus) {
                    case 'uploaded':
                        uploadVideo.callback('uploaded', uploadVideo.videoURL);
                        uploadVideo.pollForVideoStatus();
                        break;
                    case 'processed':
                        uploadVideo.callback('processed', uploadVideo.videoURL);
                        break;
                    default:
                        uploadVideo.callback('failed', uploadVideo.videoURL);
                        break;
                }
            }
        }.bind(this)
    });
};

/* cors_upload.js Copyright 2015 Google Inc. All Rights Reserved. */

var DRIVE_UPLOAD_URL = 'https://www.googleapis.com/upload/drive/v2/files/';

var RetryHandler = function () {
    this.interval = 1000; // Start at one second
    this.maxInterval = 60 * 1000; // Don't wait longer than a minute
};

RetryHandler.prototype.retry = function (fn) {
    setTimeout(fn, this.interval);
    this.interval = this.nextInterval_();
};

RetryHandler.prototype.reset = function () {
    this.interval = 1000;
};

RetryHandler.prototype.nextInterval_ = function () {
    var interval = this.interval * 2 + this.getRandomInt_(0, 1000);
    return Math.min(interval, this.maxInterval);
};

RetryHandler.prototype.getRandomInt_ = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

var MediaUploader = function (options) {
    var noop = function () {};
    this.file = options.file;
    this.contentType = options.contentType || this.file.type || 'application/octet-stream';
    this.metadata = options.metadata || {
        'title': this.file.name,
        'mimeType': this.contentType
    };
    this.token = options.token;
    this.onComplete = options.onComplete || noop;
    this.onProgress = options.onProgress || noop;
    this.onError = options.onError || noop;
    this.offset = options.offset || 0;
    this.chunkSize = options.chunkSize || 0;
    this.retryHandler = new RetryHandler();

    this.url = options.url;
    if (!this.url) {
        var params = options.params || {};
        params.uploadType = 'resumable';
        this.url = this.buildUrl_(options.fileId, params, options.baseUrl);
    }
    this.httpMethod = options.fileId ? 'PUT' : 'POST';
};

MediaUploader.prototype.upload = function () {
    var self = this;
    var xhr = new XMLHttpRequest();

    xhr.open(this.httpMethod, this.url, true);
    xhr.setRequestHeader('Authorization', 'Bearer ' + this.token);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('X-Upload-Content-Length', this.file.size);
    xhr.setRequestHeader('X-Upload-Content-Type', this.contentType);

    xhr.onload = function (e) {
        if (e.target.status < 400) {
            var location = e.target.getResponseHeader('Location');
            this.url = location;
            this.sendFile_();
        }
        else {
            this.onUploadError_(e);
        }
    }.bind(this);
    xhr.onerror = this.onUploadError_.bind(this);
    xhr.send(JSON.stringify(this.metadata));
};

MediaUploader.prototype.sendFile_ = function () {
    var content = this.file;
    var end = this.file.size;

    if (this.offset || this.chunkSize) {
        // Only bother to slice the file if we're either resuming or uploading in chunks
        if (this.chunkSize) {
            end = Math.min(this.offset + this.chunkSize, this.file.size);
        }
        content = content.slice(this.offset, end);
    }

    var xhr = new XMLHttpRequest();
    xhr.open('PUT', this.url, true);
    xhr.setRequestHeader('Content-Type', this.contentType);
    xhr.setRequestHeader('Content-Range', 'bytes ' + this.offset + '-' + (end - 1) + '/' + this.file.size);
    xhr.setRequestHeader('X-Upload-Content-Type', this.file.type);
    if (xhr.upload) {
        xhr.upload.addEventListener('progress', this.onProgress);
    }
    xhr.onload = this.onContentUploadSuccess_.bind(this);
    xhr.onerror = this.onContentUploadError_.bind(this);
    xhr.send(content);
};

MediaUploader.prototype.resume_ = function () {
    var xhr = new XMLHttpRequest();
    xhr.open('PUT', this.url, true);
    xhr.setRequestHeader('Content-Range', 'bytes */' + this.file.size);
    xhr.setRequestHeader('X-Upload-Content-Type', this.file.type);
    if (xhr.upload) {
        xhr.upload.addEventListener('progress', this.onProgress);
    }
    xhr.onload = this.onContentUploadSuccess_.bind(this);
    xhr.onerror = this.onContentUploadError_.bind(this);
    xhr.send();
};

MediaUploader.prototype.extractRange_ = function (xhr) {
    var range = xhr.getResponseHeader('Range');
    if (range) {
        this.offset = parseInt(range.match(/\d+/g).pop(), 10) + 1;
    }
};

MediaUploader.prototype.onContentUploadSuccess_ = function (e) {
    if (e.target.status == 200 || e.target.status == 201) {
        this.onComplete(e.target.response);
    }
    else if (e.target.status == 308) {
        this.extractRange_(e.target);
        this.retryHandler.reset();
        this.sendFile_();
    }
};

MediaUploader.prototype.onContentUploadError_ = function (e) {
    if (e.target.status && e.target.status < 500) {
        this.onError(e.target.response);
    }
    else {
        this.retryHandler.retry(this.resume_.bind(this));
    }
};

MediaUploader.prototype.onUploadError_ = function (e) {
    this.onError(e.target.response); // TODO - Retries for initial upload
};

MediaUploader.prototype.buildQuery_ = function (params) {
    params = params || {};
    return Object.keys(params).map(function (key) {
        return encodeURIComponent(key) + '=' + encodeURIComponent(params[key]);
    }).join('&');
};

MediaUploader.prototype.buildUrl_ = function (id, params, baseUrl) {
    var url = baseUrl || DRIVE_UPLOAD_URL;
    if (id) {
        url += id;
    }
    var query = this.buildQuery_(params);
    if (query) {
        url += '?' + query;
    }
    return url;
};

var chkFixSeeking = document.querySelector('#chk-fixSeeking');
chkFixSeeking.onchange = function () {
    if (this.checked === true) {
        localStorage.setItem(this.id, 'true');
    }
    else {
        localStorage.removeItem(this.id);
    }
};
if (localStorage.getItem(chkFixSeeking.id) === 'true') {
    chkFixSeeking.checked = true;
}

var chkTimeSlice = document.querySelector('#chk-timeSlice');
var timeSlice = false;

if (typeof MediaRecorder === 'undefined') {
    chkTimeSlice.disabled = true;
}

chkTimeSlice.addEventListener('change', function () {
    if (chkTimeSlice.checked === true) {
        var _timeSlice = prompt('Please enter timeSlice in milliseconds e.g. 1000 or 2000 or 3000.', 1000);
        _timeSlice = parseInt(_timeSlice);
        if (!_timeSlice || _timeSlice == NaN || typeof _timeSlice === 'undefined') {
            timeSlice = false;
            return;
        }

        timeSlice = _timeSlice;
    }
    else {
        timeSlice = false;
    }
}, false);

var btnPauseRecording = document.querySelector('#btn-pause-recording');
btnPauseRecording.onclick = function () {
    if (!btnStartRecording.recordRTC) {
        btnPauseRecording.style.display = 'none';
        return;
    }

    btnPauseRecording.disabled = true;
    if (btnPauseRecording.innerHTML === 'Pause') {
        btnStartRecording.disabled = true;
        chkFixSeeking.parentNode.style.display = 'none';
        btnStartRecording.style.fontSize = '12px';
        btnStartRecording.recordRTC.pauseRecording();
        recordingPlayer.parentNode.parentNode.querySelector('h2').innerHTML = 'Recording status: paused';
        recordingPlayer.pause();

        btnPauseRecording.style.fontSize = '12px';
        setTimeout(function () {
            btnPauseRecording.innerHTML = 'Resume REC';
            btnPauseRecording.disabled = false;
        }, 2000);
    }

    if (btnPauseRecording.innerHTML === 'Resume REC') {
        btnStartRecording.disabled = false;
        chkFixSeeking.parentNode.style.display = 'none';
        btnStartRecording.style.fontSize = '12px';
        btnStartRecording.recordRTC.resumeRecording();
        recordingPlayer.parentNode.parentNode.querySelector('h2').innerHTML = 'Recording status: active';
        recordingPlayer.play();

        btnPauseRecording.style.fontSize = '12px';
        btnPauseRecording.innerHTML = 'Pause';
        setTimeout(function () {
            btnPauseRecording.disabled = false;
        }, 2000);
    }

};

//You can call this chrome extension directly from your own website as well!
//if (window.confirm('Ok to Confirm, Cancel to Stay here'))
 //  {window.open('http://www.google.com', '_blank');};
/*
         document.querySelector('#btn-start-recording2').onclick = function start (){
       if(typeof RecordRTC_Extension === 'undefined') {
if (installRTC) { // if they clicked "ok"
    window.open('https://chrome.google.com/webstore/detail/recordrtc/ndcljioonkecdnaaihodjgiliohngojp','_blank');
} else { // if they clicked "cancel"
    window.open('http://example.com/popup-not18.html','_blank');
}
   ;}*/
/*

document.querySelector('#btn-start-recording2').onclick = function start (){
       if(typeof RecordRTC_Extension === 'undefined') {
        alert(window.open('RecordRTC chrome extension is either disabled or not installed.\nClick Ok to install it.\nClick Cancel to stay here.'))

   ;}*/

var rec_options = ({enableScreen: true,enableMicrophone: true,enableSpeakers: true});
var stopRecording = document.querySelector('#btn-stop-recording2');
var startRecording = document.querySelector('#btn-start-recording2');
var video2 = document.querySelector('#videortextension');
var buttonhyperlink = document.createElement('button');
//var installRTC = window.confirm("RecordRTC chrome extension is either disabled or not installed.\nClick Ok to install it.\nClick Cancel to stay here.");

         document.querySelector('#btn-start-recording2').onclick = function (){
       if(typeof RecordRTC_Extension === 'undefined') {
if (window.confirm("For recording Video with audio, you need to install an extension.\nOnly for Google Chrome. If you're on Firefox, you can recording game without audio (REC - no audio).\n\nClick Ok to install it and refresh the game with F5.\nClick Cancel to stay here.\n\nUse this extension directly with 'Rec-with audio button' or with the Chrome extension (tutorial on extension page).Use it on any web page.")) { // if they clicked "ok"
    window.open('https://chrome.google.com/webstore/detail/recordrtc/ndcljioonkecdnaaihodjgiliohngojp','_blank');
} else { // if they clicked "cancel"
    window.open
    return;
}
   ;}


  //  location.href = url;
         //   return;
    startRecording.disabled = true;
    stopRecording.style.display = 'inline-block';
    buttonhyperlink.style.display = 'none';


    //startRecording.disabled = true;
    // stopRecording.disabled = false;
    {
        recorder4 = new RecordRTC_Extension;
        rec_options = {
            enableScreen: true,
            enableMicrophone: true,
            enableSpeakers: true
        }
        recorder4.startRecording( rec_options, function() {
        })}}
var recorder4 = new RecordRTC_Extension();

stopRecording.onclick = function stop (){
    startRecording.disabled = false;
    stopRecording.style.display = 'none';
    //  startRecording.disabled = false;
    //  stopRecording.disabled = true;
    recorder4.stopRecording(stopRecordingCallback);
    return;
};
return;

function stopRecordingCallback(blob) {
    var buttonhyperlink = document.createElement('button');
    buttonhyperlink.innerHTML = '';
    buttonhyperlink.setAttribute('id', 'button-rtc-dl');
    buttonhyperlink.setAttribute('class', 'btn btn-primary');
    buttonhyperlink.style.position = 'fixed';
    buttonhyperlink.style.bottom = '4px';
    buttonhyperlink.style.right = '706px';
    var poshyperlink = document.querySelector('.wrapper-sm');
    poshyperlink.after(buttonhyperlink);
    var hyperlink = document.createElement('a');
    hyperlink.innerHTML = 'Preview';
    hyperlink.href = URL.createObjectURL(blob);
    hyperlink.target = '_blank';
    hyperlink.style.color = '#fff';
    buttonhyperlink.appendChild(hyperlink);
    video2.src = video2.srcObject = null;
    video2.src = URL.createObjectURL(blob);
    var videoMimeType = 'video/webm' ;
    var videoFileExt = '.webm';
    var buttonhyperlink2 = document.createElement('button');
    buttonhyperlink2.innerHTML = '';
    buttonhyperlink2.setAttribute('id', 'button-dl-with-audio');
    buttonhyperlink2.setAttribute('class', 'btn btn-primary');
    buttonhyperlink2.style.position = 'fixed';
    buttonhyperlink2.style.bottom = '4px';
    buttonhyperlink2.style.right = '760px';
    buttonhyperlink2.style.backgroundColor = '#d54248';
    poshyperlink.after(buttonhyperlink2);
    var a = document.createElement('a');
    a.innerHTML = 'Save';
    a.style.color = '#fff';

    //a.style.display = 'block';
    var url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download ='Webcamdarts' + videoFileExt;
    buttonhyperlink2.appendChild(a);
    // a.click();
}