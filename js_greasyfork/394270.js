// ==UserScript==
// @name         Google search in several columns
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Google search results in 4 columns (News and Video) and 3 columns for All. Fork of Mozilla's 2-Column Google Results 2.7.0
// @author       difabor
// @include      http*://www.google.*/*
// @include      http*://www.google.*.*/*
// @include      http*://ipv6.google.*/*
// @include      http*://encrypted.google.*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/394270/Google%20search%20in%20several%20columns.user.js
// @updateURL https://update.greasyfork.org/scripts/394270/Google%20search%20in%20several%20columns.meta.js
// ==/UserScript==
var urloc = location;
var switch_news = /tbm=nws/.test(urloc)? '' : '.bkWMgd > div:not(.knavi)';
var col_num = /tbm=nws/.test(urloc)? 4 : /tbm=vid/.test(urloc)? 4 : 3;
var spring_color = '#8ff';
var css = 'body:not(.no-two-col) {\n'+
'  max-width: 100vw !important;\n'+
'  overflow-x: hidden !important;\n'+
'}\n'+
'\n'+
'body:not(.no-two-col) img {\n'+
'  max-width: 100%;\n'+
'}\n'+
'\n'+
'body:not(.no-two-col) #center_col {\n'+
'  margin-left: 0 !important;\n'+
'  margin-right: 0 !important;\n'+
'  overflow-x: visible !important;\n'+
'  width: 100vw !important;\n'+
'  padding-left: 10px !important;'+
'}\n'+
'\n'+
'body:not(.no-two-col) #res {\n'+
'  box-sizing: border-box;\n'+
'  width: 100% !important;\n'+
'}\n'+
'\n'+
'/* body:not(.no-two-col) #res .bkWMgd {\n'+
'  vertical-align: top;\n'+
'} */\n'+
'\n'+
'/*\n'+
' * .knavi is for calculator. ref: #9\n'+
' * */\n'+
'/*.knavi*/\n'+
'body:not(.no-two-col) #res '+ switch_news +' {\n'+
'  column-count: '+col_num+' !important;\n'+
'  column-gap: 10px !important;\n'+
'  column-rule: 1px solid silver !important;\n'+
'  /*background-color: #fda !important;*/\n'+
'}\n'+
'\n'+
'body:not(.no-two-col) #res .bkWMgd > div:not(.knavi) > div {\n'+
'  box-sizing: border-box;\n'+
'  margin: 0 3% 10px;\n'+
'  min-height: 100px;\n'+
'  vertical-align: bottom;\n'+
'}\n'+
'\n'+
'body:not(.no-two-col) #res .bkWMgd > div.knavi > div {\n'+
'  width: 25%;\n'+
'  margin: auto;\n'+
'}\n'+
'\n'+
'body:not(.no-two-col) #res .bkWMgd g-section-with-header {\n'+
'  margin-left: 2.5%;\n'+
'  clear: both;\n'+
'}\n'+
'\n'+
'body:not(.no-two-col) #res .bkWMgd g-scrolling-carousel {\n'+
'  margin: 0;\n'+
'}\n'+
'\n'+
'body:not(.no-two-col) #iur {\n'+
'  width: 100% !important;\n'+
'}\n'+
'\n'+
'body:not(.no-two-col) .big .mw {\n'+
'  max-width: 100% !important;\n'+
'}\n'+
'\n'+
'body:not(.no-two-col) #rhs {\n'+
'  background-color: '+ spring_color +' !important;\n'+
'  box-shadow: 0 0 10px 0 rgba(0,0,0,0.5);\n'+
'  margin-right: 0 !important;\n'+
'  margin-left: 0 !important;\n'+
'  overflow: hidden !important;\n'+
'  padding: 0 !important;\n'+
'  position: absolute !important;\n'+
'  transition: .3s right;\n'+
'  top: -40px !important;\n'+
'  right: -440px !important;\n'+
'  width: 460px !important;\n'+
'  z-index: 1000 !important;\n'+
'}\n'+
'\n'+
'body:not(.no-two-col) #rhs:hover {\n'+
'  right: 0px !important;\n'+
'}\n'+
'\n'+
'body:not(.no-two-col) #rhs img {\n'+
'  width: 100%;\n'+
'}\n'+
'\n'+
'body:not(.no-two-col) #rhs #rhs_block,\n'+
'body:not(.no-two-col) #rhs #rhs_block .g.rhsvw.mnr-c.g-blk,\n'+
'body:not(.no-two-col) #rhs #rhs_block .g.rhsvw.mnr-c.g-blk .kp-blk {\n'+
'  padding-left: 0 !important;\n'+
'  padding-right: 0 !important;\n'+
'  margin: 2.5 !important;\n'+
'  width: 90%;\n'+
'}\n'+
'\n'+
'body:not(.no-two-col) #taw, #extrares {\n'+
'  clear: both;\n'+
'  margin-left: 30px;\n'+
'}\n'+
'\n'+
'body:not(.no-two-col) #rc {\n'+
'  width: 40vw;\n'+
'}\n'+
'\n'+
'body:not(.no-two-col) .rc table.ts td { /* for SearchPreview */\n'+
'  min-width: 130px;\n'+
'}\n'+
'\n'+
'/* also work for startpage.com */\n'+
'\n'+
'.startpage .web_regular_results > li {\n'+
'  box-sizing: border-box;\n'+
'  float: left;\n'+
'  min-height: 125px;\n'+
'  vertical-align: top;\n'+
'  width: 50%;\n'+
'}\n';

let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);// ==UserScript==
