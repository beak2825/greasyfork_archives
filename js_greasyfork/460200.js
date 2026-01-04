// ==UserScript==
// @name         theme_for_cw3
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  catwar script!
// @author       Nei
// @match        https://catwar.su/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=catwar.su
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/460200/theme_for_cw3.user.js
// @updateURL https://update.greasyfork.org/scripts/460200/theme_for_cw3.meta.js
// ==/UserScript==

(function() {
    'use strict';




    if( window.location.href == "https://catwar.su/cw3/"){

        var head  = document.getElementsByTagName('head')[0];
        var link  = document.createElement('link');
        link.rel  = 'stylesheet';
        link.type = 'text/css';
        link.href = localStorage.getItem('hrefForCss');
        link.media = 'all';
        head.appendChild(link);
    } else {
        localStorage.setItem('hrefForCss', document.querySelector("head > link:nth-child(7)").href);
    }
    document.querySelector("#tr_actions").firstChild.id = "site_table";
    document.querySelector("#tr_mouth").firstChild.id = "site_table";
    document.querySelector("#info_main").firstChild.id = "site_table";
    document.querySelector("#tr_tos").firstChild.id = "site_table";
    document.querySelector(".small").id ="site_table";
    document.querySelector("#app > br").remove();


    function addStyle(styles) {

        /* Create style element */
        var css = document.createElement('style');
        css.type = 'text/css';

        if (css.styleSheet)
            css.styleSheet.cssText = styles;
        else
            css.appendChild(document.createTextNode(styles));

        /* Append style to the head element */
        document.getElementsByTagName("head")[0].appendChild(css);
    }

    /* Declare the style element */
    var styles = `html, body {
  margin: 0;
  padding: 0; }


#app {
  display: none;
  
  margin: auto; }

#newchat, #newls {
  background-color: white;
  font-weight: bold; }

.small {
  font-size: 12px; }

.title {
  display: block;
  font-size: 18px;
  font-weight: bold;
  padding-bottom: 8px; }

#site_table {
   border-radius: 0 !important;
   width:auto;
}

input, select {
    color: black !important;
    background-color: white !important;
}

#main_table {
  border: 1px solid black;
  width: 100%;
  max-width: 1000px;
  border-spacing: 0;
  margin: 0;
  padding: 0;
  margin-top: 7px;
   }

 #main_table #tr_field {
 background: black;
 }

#main_table > tr, #main_table > tr > td, #main_table > tbody > tr, #main_table > tbody > tr > td {
  margin: 0;
  padding: 0; }

.infos {
  vertical-align: top;
  width: 33%; }

#info_main {
  border: none;
  width: 100%;
  }

.other_cats_list {
  background: initial;
  border: 1px solid rgba(0, 0, 0, 0.4); }

.other_cats_list > a {
  color: inherit; }

#timer {
  display: none;
  position: fixed;
  z-index: 9999;
  background-color: RGBA(204, 204, 204, 0.5);
  min-width: 50px;
  max-width: 100px;
  height: 20px;
  top: 60px;
  right: 10px;
  border-radius: 10px;
  text-align: center;
  padding: 1px; }


#dein {
  display: none; }

#block_mess {
  margin: 8px 0; }

#tr_chat {
  background-color: #C60; }

#chat_form {
  margin: 15px;
  color:black; }

input#text {
  width: 95%;
  max-width: 500px; }

#volume {
  width: 200px;
  display: inline-block;
  margin-left: 5px; }

#chat_msg {
  width: 1000px;
  overflow: auto;
  height: 275px;
  color:black; }

.chat_text {
  display: inline-block;
  word-wrap: break-word; }

.myname {
  background: #FC3; }

.nick {
  border-bottom: 1px dotted #000; }

.vlm0 {
  font-size: 10px; }

.vlm1 {
  font-size: 11px; }

.vlm2 {
  font-size: 11.5px; }

.vlm3 {
  font-size: 12px; }

.vlm4 {
  font-size: 12.5px; }

.vlm5 {
  font-size: 13px; }

.vlm6 {
  font-size: 15px; }

.vlm7 {
  font-size: 17px; }

.vlm8 {
  font-size: 19px; }

.vlm9 {
  font-size: 21px; }

.vlm10 {
  font-size: 23px; }

.pair-delete, .adopt {
  font-size: 17px; }

#tr_field, #act, #cages {
  padding: 0;
  margin: 0;
  border-spacing: 0; }

#cages_overflow, #cages_div {
  width: 1000px;
  min-height: 1000px; }

#cages_div {
  background-repeat: no-repeat; }

#cages {
  width: 1000px;
  min-height: 1000px;
  background-repeat: no-repeat; }

.cage, .cage_items {
  width: 100px;
  height: 150px;
  border: none;
  margin: 0;
  padding: 0; }

.cage {
  padding-bottom: 16px; }

#cages table td {
  width: 160px;
  height: 32px;
  text-align: left; }

#cages table td div, #cages div[id^=thd] {
  background-color: transparent; }

#cages table td img {
  width: 32px;
  height: 32px;
  text-align: left; }

.move_parent {
  display: block;
  position: relative;
  padding: 0;
  margin: 0;
  color:black; }

.move_img {
  display: block;
  width: 100px;
  height: 150px;
  border: 0;
  margin: 0;
  padding: 0; }

.move_parent .move_name {
  display: block;
  position: absolute;
  font-size: 11px;
  bottom: 43px;
  left: 10px;
  width: 85px;
  text-align: center;
  background-color: RGBA(255, 255, 255, 0.5);
  border-radius: 10px;
  padding: 0;
  margin: 0; }

.move_parent .owned {
  border-color: #C60; }

.move_parent .not_owned {
  border-color: #7e97ec; }

.move_parent .owned, .move_parent .not_owned {
  background-color: #ffffffc9;
  margin: -2px;
  border-width: 2px;
  border-style: solid; }

.cat {
  position: relative; }

.huntEl {
  position: absolute; }

.cat_tooltip {
  display: none; }

.cat:hover .cat_tooltip {
  display: block;
  position: absolute;
  z-index: 9999;
  padding: 10px;
  min-width: 160px;
  background: RGBA(255, 255, 255, 0.9);
  border: 2px solid gray;
  border-radius: 12px;
  color: #930;
  font-weight: bold;
  text-align: center; }

.cat:hover .cat_tooltip a {
  color: #930; }

.mouth {
  width: 100%;
  padding: 0;
  margin: 0; }
  .mouth ol {
    list-style-type: none; }
  .mouth li {
    display: inline-block; }
  .mouth img {
    width: 32px; }

.online {
  color: black; }

.smell_move {
  border: 2px solid white;
  width: 96px;
  height: 96px; }

.arrow-paws {
  background: url("/cw3/symbole/arrow_paws.png") 0 0 no-repeat; }

.arrow-claws {
  background: url("/cw3/symbole/arrow_claws.png") 0 0 no-repeat; }

.arrow-teeth {
  background: url("/cw3/symbole/arrow_teeth.png") 0 0 no-repeat; }

.arrow {
  height: 8px;
  position: absolute;
  margin: 0;
  padding: 3px 0 0 11px;
  z-index: 2; }

.arrow table, .arrow td {
  height: 5px !important;
  padding: 0;
  margin: 0; }

.arrow_red {
  background: #CD4141; }

.arrow_green {
  background: #41CD70; }

#fightPanel {
  position: fixed;
  z-index: 9999;
  background-color: RGBA(204, 204, 204, 0.9);
  height: 100px;
  top: 20px;
  right: 10px;
  border-radius: 10px;
  text-align: left;
  padding: 3px; }

.hotkey {
  background: white;
  width: 32px;
  padding: 1px;
  outline: none; }

#fightLog {
  overflow-y: scroll;
  margin-top: 4px;
  margin-left: 4px; }

.log_claws {
  background: RGBA(212, 141, 118, 0.7); }

.log_teeth {
  background: RGBA(255, 255, 255, 0.7); }

.itemInMouth, .catrot {
  cursor: pointer; }

.active_thing {
  border: 1px solid blue; }

#layer {
  width: 200px; }


#itemList {
  list-style-type: none;
  padding: 0;
  margin: 0; }

#itemList li {
  display: inline-block; }

.symbole {
  width: 15px;
  height: 15px;
  background: url("/cw3/symbole/icons.png") no-repeat;
  padding: 0;
  margin: 0; }

.parameter {
  border: 1px solid black;
  width: 150px;
  height: 15px; }

.parameter, .parameter td {
  margin: 0;
  padding: 0;
  border-spacing: 0; }

#lifes {
  margin-top: 5px; }

#sky {
  height: 150px;
  width: 100%;
  max-width: 1000px;
  background-repeat: no-repeat; }

#tos {
  width: 150px;
  height: 20px; }

#hour {
  margin: 0 5px; }

  #history_clean ~ div {
  color:black;
  }
  .small {
    width: 100% !important;
    display: flex;
    padding: 6px 0px;
    margin-bottom: -10px !important;
    border: 3px solid black;
    }`;

    //  document.querySelector("#cages_overflow").style.width = window.innerWidth;
    //document.querySelector("#cages_overflow").style.height = window.innerHeight;
    // document.getElementsByTagName("head")[0].insertAdjacentHTML('beforeend', '<meta name="viewport" content="width=device-width, initial-scale=1.0">');


    /* Function call */
    window.onload = function() { addStyle(styles) };

})();