// ==UserScript==
// @name         Webcamdarts Dual View Streaming size for Test JOINER
// @name:fr      Webcamdarts Dual View Streaming taille TEST JOIGNER
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  To see your webcam and the opponent webcam in equal size. Webcamdarts Dual view for Joiner in this case and activate this one.
// @description:fr redesign de l'espace match
// @author       Antoine Maingeot
// @match        https://game.webcamdarts.com/game
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/402238/Webcamdarts%20Dual%20View%20Streaming%20size%20for%20Test%20JOINER.user.js
// @updateURL https://update.greasyfork.org/scripts/402238/Webcamdarts%20Dual%20View%20Streaming%20size%20for%20Test%20JOINER.meta.js
// ==/UserScript==

(function() {
    'use strict';
function addGlobalStyle(css) {
   var head, style;
   head = document.getElementsByTagName('head')[0];
   if (!head) { return; }
   style = document.createElement('style');
   style.type = 'text/css';
   style.innerHTML = css;
   head.appendChild(style);
}
    //addGlobalStyle('div.col-xs-2.col-sm-2.col-md-2.col-lg-2 > div { color:#FFF;}');
    //addGlobalStyle('.max { height: 98vh;padding-left: 0px; padding-right: 0px;}');
    //addGlobalStyle('div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div.h4 > span, div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div > div > div.h4 > span { color:#333;}');
    //addGlobalStyle('div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div.h1.font-bold.text-scores > span,div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div > div > div.h1.font-bold.text-scores > span { color:#333;}');
    //addGlobalStyle('div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div > div > div.h3.font-bold.wrapper-sm > span, div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div.h3.font-bold.wrapper-sm > span { color:#333;}');
    //addGlobalStyle('.wrapper-md{ padding:0px 5px 5px 0px;}');
    //addGlobalStyle('.wrapper-md{ padding-top: 0px; padding-right: 5px;padding-bottom: 5px; padding-left: 15px;}');

  //  addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div{ background-color:#caced2;border-radius: 5px 5px 0px 0px;}');
  //  addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker{ background-color:#caced2;border-radius: 0px 0px 0px 5px;padding-bottom: 5px;padding-top:5px;}');
  //  addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker{ background-color:#caced2;border-radius: 0px 0px 5px 0px;padding-bottom: 5px;padding-top:5px;}');

//    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div { background-color:#caced2;border-radius: 5px 5px 0px 0px;}');
 //   addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5{ background-color:#caced2;border-radius: 0px 0px 0px 5px;padding-bottom: 5px;padding-top:5px;}');
 //   addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7{ background-color:#caced2;border-radius: 0px 0px 5px 0px;padding-bottom: 5px;padding-top:5px;}');

 //   addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker { color:#333;}');
 //   addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7 { color:#333;}');
addGlobalStyle('.active-player{ border: none;}');

    //addGlobalStyle('#remotevideo{order:1;display: flex; flex-direction: row;}');
    //addGlobalStyle('#content > div > div > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(2){order:2; display: flex; flex-direction: row;}');

addGlobalStyle('#myvideo, #content > div > div > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) > div > div:nth-child(2){max-width:50%;position:fixed;right:0px;bottom:70px;z-index:1;    height: auto;border:1px green;}');
addGlobalStyle('#content > div > div > div > div:nth-child(4) {width: 50%;position:fixed;right:0px;top:0px;z-index:1;}');
addGlobalStyle('#remotevideo {width: 50%;position:fixed;left:0px;bottom:70px;height:auto;z-index:1;}');

    addGlobalStyle(' #content > div > div > div > div:nth-child(1) > div.row.ng-scope > div {z-index:1;padding:0;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1){z-index:90;}');

    //Score et affichage jeu
    //addGlobalStyle('.text-scores{font-size: 5em;color:#dcddde;background-color: #00000042;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7,#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker,#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7,#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker{color:#dcddde;margin-top:-113px;background-color: #00000042;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div,#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div,#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-2.col-sm-2.col-md-2.col-lg-2,#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7,#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker{background-color: #00000042;}');
   // addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div > div.h1.font-bold.text-scores{font-size: 5em;}');
    //Ne pas afficher photo

addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-2.col-sm-2.col-md-2.col-lg-2 > div > div:nth-child(1){display:none;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div:nth-child(1) {display:none;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div > div > div:nth-child(1){display:none;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div:nth-child(1) > img{display:none;}');

    //position entrer score
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div {bottom:0px;background-color:transparent; width:100%;right:0;padding-right: 0px;padding-left: 48px;position:fixed;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(1){ display:inline-block;padding-top: 5px; padding-right: 5px;padding-bottom: 5px; padding-left: 5px;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(1) > div.wrapper-sm{ display:inline-block;padding-top: 0px; padding-right: 0px;padding-bottom: 5px; padding-left: 0px;}');

   //addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1){position:absolute;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1){;padding-left:0;padding-right:0px;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(1) > div.wrapper-sm > button{bottom:0px;}');
 addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1),#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div{background-color:transparent;}');
 //score position centrer
    addGlobalStyle('#content > div > div > div > div:nth-child(1){width: 50%;left: 25%;}');

    //text stat
    //addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-2.col-sm-2.col-md-2.col-lg-2{padding:0;width:30px;}');
    //addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-2.col-sm-2.col-md-2.col-lg-2 > div > div:nth-child(5){padding:0;width:30px;}');
//active player
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player{padding:0;float:left;display: block;position: relative;}');
//active name

//active score
     addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div, #content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div{top:0px;padding:0;margin-left: -35px;}');
//active stat
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7{padding:0;width: 35px;float:right;position:relative;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div{display:grid;padding:0;float: right;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7{padding:0;width: 35px;float:right;position:relative;}');

    //active historique score
 addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) {{position: fixed;}');
   //adversaire
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker{padding:0;float:right;display: block;position: relative;}');
    addGlobalStyle('.bg-black .dker{background-color:transparent ;}');
    addGlobalStyle('.bg-black{background-color: transparent;}');
 addGlobalStyle('.bg-black .dk, body.bg-black.dk{background-color: black;}');
 addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div.h4 > span, #content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div.h4 > span{color: white;font-size:x-large;}');
  addGlobalStyle('.alert{display: none;}');
  addGlobalStyle('.text-scores {color: #dcddde;}');
    // checkout
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div.h3.font-bold.wrapper-sm > span{position: fixed;right: 0;top: 0px;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div.h3.font-bold.wrapper-smsm > span {position: fixed;left: 0;top: 0px;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div.h3.font-bold.wrapper-smsm > span{position: fixed;right: 0;top: 0px;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div > div > div.h3.font-bold.wrapper-smsm > span{position: fixed;left: 0;top: 0px;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div.h3.font-bold.wrapper-sm > span{position: fixed;right: 0;top: 0px;font-size: xxx-large;background-color: #00000042;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div > div > div.h3.font-bold.wrapper-sm > span{position: fixed;left: 0;top: 0px;font-size: xxx-large;background-color: #00000042;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div.h3.font-bold.wrapper-sm {position: fixed;left: 0;top: 0px;color:#dcddde;font-size: xxx-large;background-color: #00000042;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div.h3.font-bold.wrapper-sm{color:#dcddde;font-size: xxx-large;background-color: #00000042;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div.h3.font-bold.wrapper-sm {position: fixed;right: 0;top: 0px;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-2.col-sm-2.col-md-2.col-lg-2 > div > div.h3.font-bold.wrapper-sm, #content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-2.col-sm-2.col-md-2.col-lg-2 > div > div.h3.font-bold.wrapper-sm > span{display:none;}');

    //adversaire score
     addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div{top:0px;padding:0;    margin-left: 35px;}');
//adversaire historique score


    //adversaire stat
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker{padding:0;width:35px;float:left;}');

    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div.h1.font-bold.text-scores{ position:relative;}');
//waiting turn
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(1) > div{margin-bottom:-20px;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(1){padding:0px;}');
   //Cancel
     addGlobalStyle('#content > div > div > div > div:nth-child(1) > div:nth-child(3){ display:block;width:fit-content;bottom:4px; position:fixed;right:0px;padding-left:0px;z-index:0;}');
    //addGlobalStyle('#content > div > div > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div > div:nth-child(1) > button{;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1){ ;z-index:0;padding-left:48px;width: unset;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(1) > div{padding:0px;}');

//addGlobalStyle('.text-scores{ font-size:50%;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div{ top:0;}');
addGlobalStyle('.wrapper-sm, #content > div{ padding:0;}');
addGlobalStyle('.row, #content > div{margin:0; padding:0px}');
addGlobalStyle('.wrapper-md{ padding-top: 2px;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(1) > div.wrapper-sm{ padding-left:2px;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div:nth-child(1){ display:flex;width: fit-content;}');

   addGlobalStyle('#enterscore{ max-width: 95px;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1){ padding:0;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-2.col-sm-2.col-md-2.col-lg-2 > div > div.h1.font-bold.text-scores{ display:block;}');


    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-2.col-sm-2.col-md-2.col-lg-2{ padding-left:0px;padding-right:0px;;}');
   //AVG
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7 > div:nth-child(6){ color: #fff;font-size: xx-large;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker > div:nth-child(6)   {color:  #fff;font-size: xx-large;;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker > div:nth-child(6) { color: #fff;font-size: xx-large;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7 > div:nth-child(6){color:  #fff;font-size: xx-large}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-2.col-sm-2.col-md-2.col-lg-2 > div > div:nth-child(10){font-size: xx-large; ;color:#6B8E23;    position: fixed;bottom: 0;left: 44%;width: 12%}');
 //SETS
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7 > div:nth-child(1){ color: #fff;font-size: x-large;}');
addGlobalStyle('    #content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker > div:nth-child(1),#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker > div:nth-child(1)  {color:  #fff;font-size: x-large;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-2.col-sm-2.col-md-2.col-lg-2 > div > div:nth-child(5){font-size: x-large;color:#6B8E23;}');
 //LEGS
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7 > div:nth-child(2){ color: #fff;font-size: x-large;margin-top:-11px;    margin-bottom: -4px;}');
addGlobalStyle(' #content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker > div:nth-child(2),#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker > div:nth-child(2){color:  #fff;font-size: x-large;margin-top:-11px;    margin-bottom: -4px;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-2.col-sm-2.col-md-2.col-lg-2 > div > div:nth-child(6){font-size: x-large;color:#6B8E23;margin-top:-11px;    margin-bottom: -4px;}');

addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select > option{color:#000;display: inline-table;padding-right: 5px;padding-left: 5px;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div > select > option{color:#FFF;display: inline-table;padding-right: 5px;padding-left: 5px;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select > option{color:#FFF;display: inline-table;padding-right: 5px;padding-left: 5px;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div > select > option{color:#000;display: inline-table;padding-right: 5px;padding-left: 5px;}');

addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select,#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select,#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div > select,#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div > select{height:0px;}');

addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-2.col-sm-2.col-md-2.col-lg-2 { margin-top:-110px;color:#dcddde;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-2.col-sm-2.col-md-2.col-lg-2, { margin-top:-110px;color:#dcddde;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-2.col-sm-2.col-md-2.col-lg-2 > div { margin-top:4px;}');

addGlobalStyle('div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div > select,div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select { padding: 0px 1px; height:120px; display:block;border: 1px solid var(--baseFg);overflow: visible;font-size: 1.5em;background-color:var(--baseBg);}');

addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker{padding:0;width: 50%;position:fixed; right:0;height:30px;display: grid;bottom:40px;color:#FFF;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div {padding:0;width: 50%;position:fixed; right:0;height:30px;z-index:200;color:#FFF;     background-color: #dcddde; }');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5{padding:0;width: 50%;position:fixed; height:30px;display: grid;bottom:40px;color:#FFF;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div{padding:0;width: 50%;position:fixed; left:0;;height:30px;display: grid;bottom:40px;color:#FFF;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5{padding:0;width: fit-content;position:fixed; left:0;height:30px;bottom:40px;color:#FFF;}');


addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker > div:nth-child(6){position:fixed;bottom:0px;width:8%;right:36%;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7 > div:nth-child(6) {position:fixed;bottom:0px;width:8%;left:36%;}');

    //addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7.bg-black.dker, #content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-2.col-sm-2.col-md-2.col-lg-2, #content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-7.col-sm-7.col-md-7.col-lg-7{ background-color: #131e268f;}');
//addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player{padding: 0;float: left;display: block;position: relative;}');

//addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div.h1.font-bold.text-scores, #content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div.h1.font-bold.text-scores{ background-color:#FFF;}');
//addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div > div > div.h1.font-bold.text-scores, #content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div.h1.font-bold.text-scores > span{ background-color:transparent;color:#dcddde}');
//addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div > div > div.h1.font-bold.text-scores > span{ background-color:transparent;color:#dcddde}');
//addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div.h1.font-bold.text-scores > span, #content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div.h1.font-bold.text-scores > span{ color:#000;}');
//addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div.h4, #content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div.h4{ background-color:#B90014;color:#FFF;}');
//addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div > div > div.h4, #content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div.h1.font-bold.text-scores{ background-color:transparent;color:#dcddde}');
//addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div.h4{ background-color:transparent;}');

   addGlobalStyle('#correctscore,#enterscore{font-weight: bolder;font-size: xx-large;}');
    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(2) > div > div:nth-child(1) > div > div > div:nth-child(1) > div > span{margin-bottom:-20px;}');

    addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select{color:#dcddde;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5 > div > select{color:#dcddde;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div > select{color:#dcddde;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(2) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div > select{color:#dcddde;}');
    //active player color
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div > div > div.h4{background-color:#B90014; color:#FFF;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div > div > div.h1.font-bold.text-scores > span  {color:#000;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.active-player > div:nth-child(1) > div > div > div.h1.font-bold.text-scores{background-color:#FFF;}');

addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker > div:nth-child(1) > div > div.h4, #content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div:nth-child(1) > div:nth-child(1) > div > div > div.h4{background-color:#B90014; color:#FFF;text-transform: uppercase;}');
    //opponent player color
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div.h4{background-color:#B90014; color:#FFF;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div.h1.font-bold.text-scores > span{color:#000;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) > div.row.ng-scope > div > div:nth-child(1) > div.col-xs-5.col-sm-5.col-md-5.col-lg-5.bg-black.dker.active-player > div:nth-child(1) > div > div.h1.font-bold.text-scores{background-color:#FFF;}');
addGlobalStyle('#content > div > div > div > div:nth-child(1) {background-color: transparent;}');
})();