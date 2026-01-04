// ==UserScript==
// @name         Webcamdarts Game 50/50 [plus]
// @version      2.13
// @description  Webcamdarts Game view splitted in 50/50 mode. Player can switch cameras side, hide AVG, use Marker voice  
// @description:pl  Widok Gry w WebcamDarts podzielony w trybie 50/50. Gracz może zmienić stronę kamery, ukryć AVG, użyć głosu Markera
// @author       Edmund Kawalec
// @match        https://game.webcamdarts.com/game
// @grant        GM_registerMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @require      https://greasyfork.org/scripts/395037-monkeyconfig-modern/code/MonkeyConfig%20Modern.js?version=764968
// @namespace    https://greasyfork.org/pl/users/1081222-edmund-kawalec
// @license MIT
// @copyright 2023, e.kawalec
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/466655/Webcamdarts%20Game%205050%20%5Bplus%5D.user.js
// @updateURL https://update.greasyfork.org/scripts/466655/Webcamdarts%20Game%205050%20%5Bplus%5D.meta.js
// ==/UserScript==

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



(function () {
    'use strict';


    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select > option {color:white;    display: inline-table;padding-right: 5px;padding-left: 5px;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div > div.ng-hide {width: 50%;right: 0;top: 177px;position: fixed;padding:0;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div.col-xs-12.col-sm-12.col-md-8.col-lg-8.bg-black.dker.max.text-center.ng-hide > div {width: 50%;left: 0;top: 177px;position: fixed;padding:0;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(2){width: 50%;left: 0;top: 177px;position: fixed;padding:0;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(4){width: 50%;right: 0;top: 177px;position: fixed;padding:0;height:fit-content;height:-moz-fit-content;}');
    addGlobalStyle('#content > div {padding:0;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope {height: 15%;  background:white}');
    addGlobalStyle(' #content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div {position: fixed;top:0px;height:177px;}');
    addGlobalStyle('.row {margin-right: 0;margin-left: 0;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) {padding:0px;}');
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
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player,#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div{padding:0;float:left;display: block;position: relative;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div.h1.font-bold.text-scores{background: #131e26;}');

    addGlobalStyle('#error-container > div {width: 30%;left: 35%;position: relative;}');
    addGlobalStyle('.btn {font-size: 12px;    padding: 5px; z-index: 99;}');
    addGlobalStyle('button#switchbtn { position:fixed;bottom: 4px ;float: right;right: 120px;}');
    addGlobalStyle('button#hidecambtn {display:none; position:fixed;bottom: 4px ;float: right;right: 210px;}');
    addGlobalStyle('button#button_fullScreen { position:fixed;bottom: 4px ;float: right;right: 210px;}');
    addGlobalStyle('button#button_fullScreen:hover { position:fixed;bottom: 4px ;float: right;right: 210px;}');
    addGlobalStyle('button#button_switchAvgBtn { position:fixed;bottom: 4px ;float: right;right: 300px;}');
    addGlobalStyle('#myvideo{position:relative; float:none;left:0px;height:auto;width:50%;}');
    addGlobalStyle('#remotevideo {position:relative; float:none; right:0px; height:auto;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div:nth-child(3) > div:nth-child(2){width: 50%;top: 17%;position: fixed;left: 0;padding: 0;}');
    addGlobalStyle('div.col-xs-7.col-sm-7.col-md-7.col-lg-7, div.col-xs-5.col-sm-5.col-md-5.col-lg-5 ,div.col-xs-2.col-sm-2.col-md-2.col-lg-2,  div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player, div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player{color: #FFF;font-size: larger;font-weight: 400;line-height: 21px;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div.h1.font-bold.text-scores > span{ color: #7793a7;z-index: 2;position: relative;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select{background-color:#131e2673}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select > option{height:30px;color:#000;display: inline-table;padding-right: 5px;padding-left: 5px;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div > select > option{height:30px;color:#FFF;display: inline-table;padding-right: 5px;padding-left: 5px;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select:-internal-list-box option:checked:hover{background-color:#FFF}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div > select > option{color:#000;display: inline-table;padding-right: 5px;padding-left: 5px;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select,#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select,#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div > select,#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div > select{height:30px;overflow:hidden;    cursor: grabbing;}');
    addGlobalStyle('div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div > select,div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select { padding: 0px 1px; height:120px; display:block;border: 1px solid var(--baseFg);overflow: hidden;font-size: 1.5em;background-color:var(--baseBg);}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker{padding:0;width: 50%;position:fixed; right:0;height:30px;display: contents;bottom:40px;color:#000;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div {padding:0; right:0;height:30px;z-index:0;color:#000;      }');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5{padding:0;width: 50%;position:fixed; height:30px;display: contents;bottom:40px;color:#000;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div{padding:0;width: 50%;position:fixed; left:0;;height:30px;display: contents;bottom:40px;color:#000;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5{padding:0;display: contents; left:0;color:#FFF;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select {color: red;height: 30px;overflow: hidden;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select:-internal-list-box {background:#ffffff42;}');
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
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player,#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player {    outline: 8px solid #b90013;background: #FFF;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div > div > div.h4{background-color:#B90014; color:#FFF;z-index:2;position:relative;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div > div > div.h1.font-bold.text-scores > span  {color:#000;z-index:2;position:relative;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div.h4, #content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div.h4{background-color:#B90014; color:#FFF;text-transform: uppercase;z-index:2;position:relative;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div.h4{background-color:#B90014; color:#FFF;z-index:2;position:relative;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div.h1.font-bold.text-scores > span{color:#000;z-index:2;position:relative;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div.h1.font-bold.text-scores{background-color:#FFF;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) {background-color: transparent;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div:nth-child(1) > img, #content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div > div > div:nth-child(1) > img{position:relative;top:19px;right:0;width:auto;height:150px;max-height: 150px;max-width: 150px;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div:nth-child(1),#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div:nth-child(1) {position: absolute;top: 0px;left: 0%;width:auto;height:auto ;background: transparent;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div:nth-child(1) {position: absolute;top: 0px;right: 0%;width:fit-content;height: 100%;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div:nth-child(1) > img{text-align:left;position:relative;top:19px;left:0;width:auto;height:150px;max-height: 150px;max-width: 150px;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker{text-align:left;top:0px;position: fixed;top: 0px;float: right;right: 44%;width:fit-content;padding:0 0 0 0;width:-moz-fit-content}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7{text-align:right;top:0px;position: fixed;top: 0px;float: left;left: 44%;width:fit-content;padding:0 0 0 0;width:-moz-fit-content}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker{text-align:left;top:0px;position: fixed;top: 0px;float: right;right: 44%;width:fit-content;padding:0 0 0 0;width:-moz-fit-content}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7{text-align:right;top:0px;position: fixed;top: 0px;float: right;right: 44%;width:fit-content;padding:0 0 0 0;width:-moz-fit-content}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2),#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2),#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2),#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2){ position:inherit}');
    addGlobalStyle('.active-player{ border: none;}');
    addGlobalStyle(' #content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div:nth-child(1), #content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div:nth-child(1) {   position: absolute;top: 0px;left: 0%;width: fit-content;width:-moz-fit-content;height: 100%; background:transparent;}');
    addGlobalStyle(' #content > div > div > div > div:nth-child(1) > div.row.ng-scope > div {z-index:1;padding:0;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div{position:relative;}');
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
    addGlobalStyle('div.wrapper-md:nth-child(2),div.ng-binding:nth-child(2), #content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > div,#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div > div:nth-child(1) > div > span{top:177px; position: fixed;left: 42%;right: 42%;width: 15.8%;background: #f3f3f338;color: #131e26;font-variant: petite-caps;}');
    addGlobalStyle('div.ng-binding:nth-child(2){  top:136.2px; position: fixed;left: 42%;right: 42%;width: 15.8%;background: #f3f3f338;color: #FFF;font-variant: petite-caps;    font-weight: bolder;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div > div:nth-child(1) > button:hover{background-color:#000}');
    addGlobalStyle('.btn-primary{background-color:#131e26;cursor:pointer;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > div{margin-bottom:-20px;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(1){padding:0px;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div:nth-child(3){ display:block;width:fit-content;width:-moz-fit-content;bottom:4px; position:fixed;right:0px;padding-left:0px}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1){ float: right;padding-right:0px;padding-left:0px;width: fit-content;width:-moz-fit-content;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div{padding:0px;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div > div:nth-child(1){ display:block;width:fit-content;width:-moz-fit-content;bottom:4px; position:fixed;right:2px;padding-left:0px}');
    addGlobalStyle('#correctscore,#enterscore{font-weight: bolder;font-size: xx-large;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div > div:nth-child(1) > div > span{margin-bottom:-20px;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select{background:#ffffff42;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div > select{background:#ffffff42;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div > select{color:#FFF;background:#131e2673;font-size:1.2em;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker > div, #content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker > div, #content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7 > div, #content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7  > div {text-align:center;}');
    addGlobalStyle('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div > div:nth-child(3) > div:nth-child(1) > h3, #content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div > div:nth-child(3) > div:nth-child(2) > h3{background:#FFF;font-size:0.8em;}');
})();

////////cancel game button fix z-index/////////////

setTimeout(function() {
    var cancelButton = $("button:contains('Cancel Game')");
    cancelButton.css('position', 'fixed');
    cancelButton.css('right', '2px');
    cancelButton.css('bottom', '4px');
    cancelButton.css('z-index', '99');
}, 3000);

////////////switchcamera/////////////////////
// add button for switch
var button_switchCam = document.createElement('div');
button_switchCam.innerHTML = '<button id="switchbtn" class="btn btn-primary" type="button">Switch Camera</button>';
var position3 = document.querySelector('.wrapper-sm');
position3.after(button_switchCam);
var savechange = document.getElementById('switchbtn').addEventListener('click', function (poswitch) {
    postionCamID1('myvideo');
    postionCamID2('remotevideo');

});

// add fucntion postion camera
function postionCamID1(id) {

    if (document.getElementById(id).style.left == '100%') document.getElementById(id).style.left = '0px'; else document.getElementById(id).style.left = '100%'
}

function postionCamID2(id) {

    if (document.getElementById(id).style.right == '100%') document.getElementById(id).style.right = 'auto'; else document.getElementById(id).style.right = '100%'
}

function postionCamID2Position2(id) {

    if (document.getElementById(id).style.width == '50%') document.getElementById(id).style.width = '100%'; else document.getElementById(id).style.width = '50%'
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

    if (document.getElementById(id).style.width == '100%') document.getElementById(id).style.width = '50%'; else document.getElementById(id).style.width = '100%'
}

function positionRemoteVideo(id) {

    if (document.getElementById(id).style.width == '100vh') document.getElementById(id).style.width = ''; else document.getElementById(id).style.width = '100vh'

}




////////////hide AVG's/////////////////////
// add button for hide players avg
var button_switchAvg = document.createElement('div');
button_switchAvg.innerHTML = '<button id="button_switchAvgBtn" class="btn btn-primary" type="button">Hide AVG</button>';
var positionWrapper = document.querySelector('.wrapper-sm');
positionWrapper.before(button_switchAvg);
var avgViewState = true;
var saveStateAvgs = document.getElementById('button_switchAvgBtn').addEventListener('click', function (poswitch) {
    if (avgViewState === true) {
        $('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7 > div:nth-child(6)').hide();
        $('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-2.col-sm-2.col-md-2.col-lg-2 > div > div:nth-child(10)').hide();
        $('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7 > div:nth-child(6)').hide();
        $('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker > div:nth-child(6)').hide();
        avgViewState = false;
        $('#button_switchAvgBtn').text('Show AVG');
    } else {
        $('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7 > div:nth-child(6)').show();
        $('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-2.col-sm-2.col-md-2.col-lg-2 > div > div:nth-child(10)').show();
        $('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7 > div:nth-child(6)').show();
        $('#content > div > div > div.row.text-center.wrapper-sm > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker > div:nth-child(6)').show();
        avgViewState = true;
        $('#button_switchAvgBtn').text('Hide AVG');
    }
});








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






// voice: points left
var voiceCfg = new MonkeyConfig({
    title: 'Marker voice settings',
    menuCommand: true,
    params: {
        voiceEnable: {
            'label': 'Voice enable',
            type: 'checkbox',
            default: true
        },
        voiceLanguage: {
            'label': 'Language',
            type: 'select',
            choices: [ 'Polski', 'English', 'Deutsch' ],
            default: 'English'
        },
        voiceVolume: {
            'label': 'Volume [0-100]',
            type: 'number',
            'default': 50
        }
    },
    onSave: function (values) {
        say(vCommands.settingsSaved[getLang()]);
    }
});

var speaking = 1;
var speech_voices;
var languages = {
    'Polski' : 15,
    'English' : 3,
    'Deutsch' : 2
};

var vCommands = {
    'scoresLeft' : {
        2 : 'Sie benötigen',
        3 : 'You require',
        15: 'Pozostało',
    },
    'settingsSaved' : {
        2 : 'Die Einstellungen wurden gespeichert',
        3 : 'Settings have been saved',
        15: 'Ustawienia zostały zapisane',
    }
};




if ('speechSynthesis' in window) {
    speech_voices = window.speechSynthesis.getVoices();
    window.speechSynthesis.onvoiceschanged = function () {
        speech_voices = window.speechSynthesis.getVoices();
    };
}

function getLang() {
    let _lng = voiceCfg.get('voiceLanguage');
    return languages[_lng];
}
function getVolume() {
    let _v = parseInt(voiceCfg.get('voiceVolume'));
    return _v > 100 ? 1 : (_v < 1 ? 0 : (_v/100)) ;
}


function say(m) { // language 3 en
    if (voiceCfg.get('voiceEnable')) {
        speechSynthesis.cancel();
        var msg = new SpeechSynthesisUtterance();
        var voices = window.speechSynthesis.getVoices();
        //console.log(voices);
        var lang = getLang();
        msg.voice = voices[lang];
        msg.voiceURI = voices[lang].voiceURI;
        msg.volume = getVolume();
        msg.rate = 1;
        msg.pitch = 1;
        msg.text = m;
        msg.lang = voices[lang].lang;
        // console.log(msg);
        msg.onerror = function(e) {
            speechSynthesis.cancel();
        };

        msg.onpause = function(e) {
            //console.log('onpause in ' + e.elapsedTime + ' seconds.');
        }

        msg.onend = function(e) {
            //console.log('onend in ' + e.elapsedTime + ' seconds.');
            speechSynthesis.cancel();
        };

        speechSynthesis.onerror = function(e) {
            //console.log('speechSynthesis onerror in ' + e.elapsedTime + ' seconds.');
            speechSynthesis.cancel();
        };
        speechSynthesis.speak(msg);
    }
}

$("[ng-hide='submittingScore']").addClass('submittingScore');

function checkScoresLeft() {
    let _activePlayer = $('.active-player');
    const myTimeout = setTimeout(function() {
        let _leftCombination = _activePlayer.find('.h3').find('span').text().trim(); // left combination
        let _playerName = _activePlayer.find('.h4').find('span').text().trim(); // left combination
        let _leftPoints = parseInt(_activePlayer.find('.h1').find('span').text()); //
        if (_leftCombination.length || _leftPoints < 61) {
            say(_playerName +", "+ vCommands.scoresLeft[getLang()] +" "+ _leftPoints);
            console.log('left combination: ', _leftCombination, ', left points:', _leftPoints);
        }
    }, 300);
}

var scoresSelectsObserver = (window.MutationObserver) ? window.MutationObserver : window.WebKitMutationObserver;
if (scoresSelectsObserver){
    var scoresSelectsMonitor = new scoresSelectsObserver(function(mutationSet){
        mutationSet.forEach(function(mutation) {
            for (var i=0; i<mutation.addedNodes.length; i++) {
                if (mutation.addedNodes[i].nodeType == 1) {
                    $("select").scrollLeft(999999);
                    const myTimeout = setTimeout(checkScoresLeft, 300);
                }
            }
        });
    });
    var opts = {childList: true, subtree: true};
    scoresSelectsMonitor.observe(document.body, opts);
}





