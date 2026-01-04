// ==UserScript==
// @name Data18 WideScreen Dark and Gray v.4
// @namespace data18.com
// @version 4.0.0
// @description Wide Data18
// @author janvier57
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*/*
// @downloadURL https://update.greasyfork.org/scripts/446190/Data18%20WideScreen%20Dark%20and%20Gray%20v4.user.js
// @updateURL https://update.greasyfork.org/scripts/446190/Data18%20WideScreen%20Dark%20and%20Gray%20v4.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "data18.com" || location.hostname.endsWith(".data18.com"))) {
  css += `
  /* ==== X Data18 WideScreen Dark and Gray v.4 (new4)  ===
  FOR : http://www.data18.com/content/

  TEST LINKS Full Member Ship:
  http://www.data18.com/content/1146510
  http://www.data18.com/content/1146511

  TEST LINKS OTHERS:
  http://www.data18.com/content/1153406

  ==== */

  /* (new1) SUPP */
  /* .p8>.p4  + div +div[style="float: left; width: 650px;"] ,
  .main3 > .contenedor {
  display: none !important;
  } */



  #sinit ~ div ,
  #indexscenes [style="float: left; width: 300px; height: 125px; overflow: hidden; margin-top: 25px;"] ,
  .bartop1w0 ,
  .bargreyw0 ,
  #optionsdiv ,

  #cookiealert ,
  #order ,
  .p8 > div h1 + div ,
  #finishedvideo>div ,
  #icons[onclick="videoControl();"]  ,

  #centered > .p8.dloc + table > tbody > tr > td > table:last-of-type > tbody > tr > td[style="background: white; padding: 6px;"] > div[style="background: #F6F4D0; padding: 6px; margin-bottom: 8px;"] ,
  .p8 > div > div > div[style="clear: both;"] ,
  .p8 #related +div ,
  #centered > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td:empty ,
  .p8 > div[style^="width: 900px;"] ,
  #centered>div[style^="height: 275px; "] ,
  .p8>.p4  + div + div[style="float: left; width: 650px;"] + div,
  .p8>.p4  + div + div[style="float: left; width: 650px;"] ,
  .p8>div>div:empty{
      display: none !important;
  }


  /* SUPP LINK VIDEO TO BAD SITES */
  /* BAD SITES */
  .contentpage.pagemedia:has(a[href="https://www.data18.com/studios/XXXXXX"]) p#lineposter2 {
      display: none !important;
  }
  .contentpage.pagemedia:has(a[href="https://www.data18.com/studios/XXXXXX"]) #moviewrap {
      pointer-events: none  !important;
  }
  .contentpage.pagemedia:has(a[href="https://www.data18.com/studios/XXXXXX"]) #moviewrap:before {
      content: " PUB" !important;
  	position: absolute !important;
  	width: 100% !important;
  	margin: 0 !important;
  	left: 0 !important;
  	bottom: 0vh !important;
  	font-size: 30px  !important;
  	z-index: 500000 !important;
  color: white !important;
  background: #ff000030 !important;
  }
  /* BAD SITES */
  .contentpage.pagemedia:has(a[href="https://www.data18.com/studios/XXXXXX"]) p#lineposter2 {
      display: none !important;
  }
  .contentpage.pagemedia:has(a[href="https://www.data18.com/studios/XXXXXX"]) #moviewrap {
      pointer-events: none  !important;
  }
  .contentpage.pagemedia:has(a[href="https://www.data18.com/studios/XXXXXX"]) #moviewrap:before {
      content: " PUB" !important;
  	position: absolute !important;
  	width: 100% !important;
  	margin: 0 !important;
  	left: 0 !important;
  	bottom: 0vh !important;
  	font-size: 30px  !important;
  	z-index: 500000 !important;
  color: white !important;
  background: #ff000030 !important;
  }
  /* BAD SITES */
  .contentpage.pagemedia:has(a[href="https://www.data18.com/studios/XXXXXX"]) p#lineposter2 {
      display: none !important;
  }
  .contentpage.pagemedia:has(a[href="https://www.data18.com/studios/XXXXXX"]) #moviewrap {
      pointer-events: none  !important;
  }
  .contentpage.pagemedia:has(a[href="https://www.data18.com/studios/XXXXXX"]) #moviewrap:before {
      content: " PUB" !important;
  	position: absolute !important;
  	width: 100% !important;
  	margin: 0 !important;
  	left: 0 !important;
  	bottom: 0vh !important;
  	font-size: 30px  !important;
  	z-index: 500000 !important;
  color: white !important;
  background: #ff000030 !important;
  }


  /* BAD SITES */
  .contentpage.pagemedia:has(a[href="https://www.data18.com/studios/lethalhardcore"]) p#lineposter2 {
      display: none !important;
  }
  .contentpage.pagemedia:has(a[href="https://www.data18.com/studios/lethalhardcore"]) #moviewrap {
      pointer-events: none  !important;
  }
  .contentpage.pagemedia:has(a[href="https://www.data18.com/studios/lethalhardcore"]) #moviewrap:before {
      content: " PUB" !important;
  	position: absolute !important;
  	width: 100% !important;
  	margin: 0 !important;
  	left: 0 !important;
  	bottom: 0vh !important;
  	font-size: 30px  !important;
  	z-index: 500000 !important;
  color: white !important;
  background: #ff000030 !important;
  }
  /* BAD SITES */
  .contentpage.pagemedia:has(a[href="https://www.data18.com/studios/evil-angel"]) p#lineposter2 {
      display: none !important;
  }
  .contentpage.pagemedia:has(a[href="https://www.data18.com/studios/evil-angel"]) #moviewrap {
      pointer-events: none  !important;
  }
  .contentpage.pagemedia:has(a[href="https://www.data18.com/studios/evil-angel"]) #moviewrap:before {
      content: " PUB" !important;
  	position: absolute !important;
  	width: 100% !important;
  	margin: 0 !important;
  	left: 0 !important;
  	bottom: 0vh !important;
  	font-size: 30px  !important;
  	z-index: 500000 !important;
  color: white !important;
  background: #ff000030 !important;
  }


  /* WIDE */
  #divmenu.absofixed {
      width: 100% !important;
      margin: 0 !important;
      background: #111 !important;
  }
  #mainclick {
      width: 100% !important;
  }
  #bodydiv {
      width: 100% !important;
  }
  #divmenu.absofixed #searchdivpri {
      width: 75% !important;
  }
  #divmenu.absofixed #searchdivpri .bigheader + .bigheader {
      float: left;
      width: 105px;
      margin-top: 10px !important;
  }

  #searchdivpri #searchdiv {
      width: 60% !important;
  border: 1px solid green !important;
  }
  #searchdivpri #searchdiv [id^="searchform"] {
      width: 96% !important;
  	height: 2.7vh !important;
  	    font-size: 15px !important;
      padding-right: 33px;
  }
  #searchdivpri #searchicon {
      float: left !important;
      height: 31px !important;
      margin: 2px 0px 0 4px !important;
      padding-left: 3px;
      padding-top: 3px;
      width: 27px;
      border-radius: 0 5px 5px 0 !important;
  background: white !important;
  border-left: 1px solid #a6a6a6;
  }

  #searchdivpri #searchclose {
      float: left !important;
      height: 31px !important;
      margin: 2px 0px 0 0px !important;
      padding-left: 3px;
      padding-top: 3px;
      width: 27px;
      border-radius: 0 5px 5px 0 !important;
  background: #222 !important;
  border-left: 1px solid #a6a6a6;
  }

  #searchdiv > div + input {
      width: 90% !important;
  border: 1px solid red !important;
  }

  .contentpage> .absofixed {
      width: 85% !important;
  }
  .contentpage> .absofixed > p ,
  .contentpage> .absofixed > div {
      width: 100% !important;
  }
  #disable .contentpage> .absofixed:not(.gen12){
      width: 86.3% !important;
  }

  #floatbody {
      float: left;
      margin: 0!important;
  	width: 100% !important;
  }

  .contentpage2 ,
  #contentpage2 ,
  #disable2 ,
  #disable .contentpage #bodyprimary ,
  #disable .contentpage {
      display: inline-block;
      width: 100% !important;
      min-height: 100vh !important;
  background: #111 !important;
  }

  #floatbody #disable .contentpage {
      margin-top: -4px !important;
  background: #111 !important;
  }

  .backgroundmenu > #primaryimg{
      background: #111 !important;
      border-bottom: 1px dashed red !important;
  }
  .backgroundmenu > #primaryimg a > div{
      float: left;
      padding: 6px;
      width: 99.7% !important;
      font-size: 20px !important;
      background: #111 !important;
  }

  .backgroundmenu > #primaryimg + div {
      height: 150px;
      width: 179px;
      margin: 15px 0 5px 0 !important;
      overflow: hidden;
  }
  .backgroundmenu > div > div > a > img[src="https://i.datavimg.com/images/user-nopic.png"] {
      height: 98px !important;
      width: 198px;
      margin: 15px 0 5px 0 !important;
      object-fit: contain !important;
  }


  #contentlist p.gen12 {
      background: #111 !important;
      display: inline-block;
      width: 100% !important;
      padding: 0 !important;
  }
  div[style="height: 132px;"] {
      height: 50px !important;
  }

  .contentpage > .absofixed {
      width: 86% !important;
      padding: 0 !important;
  }


  /* RIGHT PANEL */
  #navdiv.absofixed {
      position: fixed;
      float: none !important;
      width: 258px;
      right: 0 !important;
      margin-left: 0 !important;
      overflow: hidden;
      z-index: 18;
      border-right: 3px solid #dadada;
  }


  #bodyprimary #disable2 {
      margin: 0!important;
      width: 86% !important;
  }


  #bodyprimary #disable2 .contentpage2 > #filterdivdo2 ,
  #bodyprimary #disable2 .contentpage2 > #filter_html0 ,
  #bodyprimary #disable2 .contentpage2 > #filterdivdo ,
  #bodyprimary #disable2 .contentpage2 > #filterdivresults ,
  #bodyprimary #disable2 .contentpage2 > div#contentlist {
  	float: right !important;
      margin: 0!important;
      width: 88.5% !important;
  /* border: 1px solid aqua !important; */
  }

  #bodyprimary #disable2 .contentpage2 > #filterdivdo2 ,
  #bodyprimary #disable2 .contentpage2 > #filter_html0 ,
  #bodyprimary #disable2 .contentpage2 > #filterdivdo  {
      font-size: 15px !important;
  /* border: 1px solid aqua !important; */
  }

  #contentlist #tabmovies_list #tabmovies_line .boxep1 + div {
  	float: left !important;
      width: 99.8% !important;
      height: 20px !important;
      padding: 2px !important;
      text-align: right;
  color: gold !important;
  border-bottom: 1px solid green !important;
  border-top: 1px solid green !important;
  background: red !important;
  }

  /* (new3) TOP NAV - SCROLL */
  #gotopmediaheight {
  /* position: absolute !important; */
  	width: 100% !important;
      margin-top: 5vh !important;
      top: 15vh !important;
  border: 1px solid yellow !important;
  }
  #toolscollapsebar[style="display: none;"]  ~ #margintopdo {
      margin-top: 0 !important;;
  }
  #zonebuttons.absofixed {
      position: fixed !important;
      max-width: 50% !important;
  	height: 42px !important;
      margin-left: 0% !important;
  	top: 8.3vh !important;
  	right: 13.5% !important;
      padding: 0!important;
      z-index: 200 !important;
  background: white none repeat scroll 0 0;
  border: 1px solid red !important;
  }
  #zonebuttons > div.p8:not(#gotopmediaheigh):not([style="clear: both;"]) {
      float: right !important;
      height: 40px !important;
      width: 20% !important;
      margin-right: 6px;
      padding: 0 !important;
      border-bottom: 1px solid grey;
      cursor: pointer;
      font-size: 12px;
      background: #dadada none repeat scroll 0 0;
  border: 1px solid aqua !important;
  }

  #toolscollapsebar[style="display: none;"] ~ #options {
      display: block;
      height: 1200px;
      width: 200px;
      margin-left: 0;
      margin-top: 0vh !important;
      overflow: hidden;
  border: 1px dashed aqua !important;
  }
  #toolscollapsebar:not([style="display: none;"]) ~ #options {
      display: block;
      height: 1200px;
      width: 200px;
      margin-left: 0;
      margin-top: -5vh !important;
      overflow: hidden;
  border: 1px solid aqua !important;
  }

  #bar2token + div{
      float: left !important;
      width: 36% !important;
      margin: 0 0 0 11% !important;
  border: 1px solid red !important;
  }

  #body2div_b.body2_div_margin_left {
      float: right;
      width: 37% !important;
      margin: 0 11%  0 0 !important;
  border: 1px solid yellow !important;
  }
  #body2div {
      margin: 0 0 0 0 !important;
  }
  #divscenes {
      float: left !important;
  	clear: none !important;
      width: 36% !important;
      height: 50vh !important;
      margin: -50vh 0 0 11% !important;
  	overflow: hidden !important;
  	overflow-y: auto !important;
  color: gold !important;
  background: #333 !important;
  border: 1px solid red !important;
  }
  #divscenes #indexscenes > div {
      float: left !important;
      width: 31% !important;
  	height: 22vh !important;
      margin: 0 2px  5px 9px !important;
  background: #333 !important;
  border: 1px solid red !important;
  }
  #divscenes #indexscenes > div > [style^="float: left;"]:has(img) {
      float: left;
      width: 100% !important;
      height: 14vh !important;
      overflow: hidden;
  /*border: 1px dashed aqua !important;*/
  }
  #divscenes #indexscenes > div > [style^="float: left;"]  {
      float: left;
      width: 200px !important;
      height: 5.5vh !important;
      overflow: hidden;
  color: silver !important;
  /*border: 1px solid aqua !important;*/
  }

  #divoptions {
      display: none !important;
  }
  /* (new3)  PAGE MEDIA */
  #floatbody #disable  .absofixed + .contentpage.pagemedia #bar2token + div {
      float: left !important;
      width: 36% !important;
      margin: -6.8vh 0 0 11% !important;
  /*border: 1px solid aqua !important;*/
  }
  #floatbody #disable .absofixed + .contentpage.pagemedia #bar2token + div #body2div {
      width: 35.5vw !important;
      height: 85vh;
      margin: 0 0 0 0 !important;
      text-align: center;
  border: 1px solid red !important;
  }
  #floatbody #disable .absofixed + .contentpage.pagemedia #bar2token + div + #body2div_b.body2_div_margin_left {
      height: 85vh !important;
      margin: -6.8vh 11% 0 0  !important;
  	overflow: hidden !important;
  	overflow-y: auto !important;
  color: gray !important;
  border: 1px solid red !important;
  }
  #floatbody #disable .absofixed + .contentpage.pagemedia #bar2token + div + #body2div_b.body2_div_margin_left div[style="width: 640px;"] {
  	float: left !important;
      width: 100% !important;
  }
  #floatbody #disable .absofixed + .contentpage.pagemedia #bar2token + div + #body2div_b.body2_div_margin_left div[style="width: 640px;"] .gen12 {
  	float: left !important;
      width: 100% !important;
  color: silver !important;
  background: #222 !important;
  }

  #floatbody #disable .absofixed + .contentpage.pagemedia #bar2token + div + #body2div_b.body2_div_margin_left div[style="width: 640px;"] #toolsmedia + div ,
  #floatbody #disable .absofixed + .contentpage.pagemedia #blockscroll {
      display: none !important;
  }
  #floatbody #disable .absofixed + .contentpage.pagemedia  a.bold{
      color: peru !important;
  }

  #floatbody #disable .absofixed + .contentpage.pagemedia #bar2token + div + #body2div_b.body2_div_margin_left h3  + br + .gen12 {
  	float: left !important;
      width: 100% !important;
  }

  #floatbody #disable .absofixed + .contentpage.pagemedia #bar2token + div + #body2div_b.body2_div_margin_left [onmouseover]:has(a)  {
      float: left !important;
      width: 100% !important;
      margin: 0vh 5px 5px 0% !important;
  background: #333 !important;
  border: 1px solid red !important;
  } 


  #floatbody #disable .absofixed + .contentpage.pagemedia #bar2token + div + #body2div_b.body2_div_margin_left [onmouseover]:has(a):not(p) {
      float: left !important;
      width: 23% !important;
  	height: 20vh !important;
      margin: 0vh 5px 5px 0% !important;
  background: #333 !important;
  border: 1px solid red !important;
  } 

  #floatbody #disable .absofixed + .contentpage.pagemedia #bar2token + div + #body2div_b.body2_div_margin_left [onmouseover]:has(a) > div {
      float: left !important;
      width: 100% !important;
      margin: 0vh 5px 0 0% !important;
  /*border: 1px solid aqua !important;*/
  } 
  #floatbody #disable .absofixed + .contentpage.pagemedia #bar2token + div + #body2div_b.body2_div_margin_left [onmouseover]:has(a) > div div[style="margin-left: -15px;"]  {
      margin: 0 0 0 0 !important;
  }


  /* PAGI */
  #tab_list_scenes .tab_nav_page_oldest ,
  #tab_list_scenes .tab_nav_page_prev ,
  #tab_list_scenes .tab_nav_page_next ,
  #tab_list_scenes .tab_nav_page_newest  {
  /*     display: inline-block !important;
      float: none !important; */
      min-height: 20px !important;
      max-height: 20px !important;
      line-height: 10px !important;
      width: 30px !important;
      padding: 3px;
      text-align: center;
  background: red !important;
  }
  #tab_list_scenes .tab_nav_page_oldest > div ,
  #tab_list_scenes .tab_nav_page_prev > div ,
  #tab_list_scenes .tab_nav_page_next > div ,
  #tab_list_scenes .tab_nav_page_newest > div  {
      padding: 0 !important;
  }
  .tab_nav_page_newest + a > div {
      display: inline-block !important;
      float: none !important; 
      min-height: 20px !important;
      max-height: 20px !important;
      line-height: 10px !important;
      min-width: 60px !important;
      max-width: 60px !important;
      padding: 3px;
      text-align: center;
      border-radius: 0 !important;
  background: red !important;
  }
  .tab_nav_page_newest + a > div > div {
      padding: 0 !important;
  color: gold !important;
  }

  /* FILTERS */

  #filter_html > div  {
      width: 99.7% !important;;
  /* border: 1px solid yellow !important; */
  }
  #filter_html  > div >div:not([style="clear: both;"]) {
      float: left;
      width: 33% !important;
  }

  #filter_html  > div > div:not([style="clear: both;"]) .filtercolumn {
      height: 120px;
      overflow-y: scroll;
      width: 100% !important;
  }


  /* FITER STUDIOS */
  #filter_html > div > div:not([style="clear: both;"]) .filtercolumn #bystudiolist {
      display: inline-block !important;
  	width: 100% !important;
      font-size: 0 !important;
  }
  #filter_html > div >div:not([style="clear: both;"]) .filtercolumn #bystudiolist b {
      display: inline-block !important; 
      font-size: 15px !important;
  }
  #filter_html > div >div:not([style="clear: both;"]) .filtercolumn #bystudiolist span {
      display: block !important; 
  	float: left !important;
  	margin: 0 5px 4px 0 !important;
  	padding: 1px 5px  !important;
      font-size: 15px !important;
  	border-radius: 5px  !important;
  border: 1px solid green !important;
  }


  /* (new4) FITER PORNSTAR */
  #filter_html > div > div:not([style="clear: both;"]) .filtercolumn #bypornstarlist{
      display: inline-block !important;
  	width: 100% !important;
      font-size: 0 !important;
  }
  #filter_html > div >div:not([style="clear: both;"]) .filtercolumn #bypornstarlist b {
      display: inline-block !important; 
      font-size: 15px !important;
  }
  #filter_html > div >div:not([style="clear: both;"]) .filtercolumn #bypornstarlist span {
      display: block !important; 
  	float: left !important;
  	margin: 0 5px 4px 0 !important;
  	padding: 1px 5px  !important;
      font-size: 15px !important;
  	border-radius: 5px  !important;
  border: 1px solid green !important;
  }


  /* FITER TAGS */
  #filter_html > div > div:not([style="clear: both;"]) .filtercolumn #bytaglist{
      display: inline-block !important;
  	width: 100% !important;
      font-size: 0 !important;
  }
  #filter_html > div >div:not([style="clear: both;"]) .filtercolumn #bytaglist b {
      display: inline-block !important; 
      font-size: 15px !important;
  }
  #filter_html > div >div:not([style="clear: both;"]) .filtercolumn #bytaglist span {
      display: block !important; 
  	float: left !important;
  	margin: 0 5px 4px 0 !important;
  	padding: 1px 5px  !important;
      font-size: 15px !important;
  	border-radius: 5px  !important;
  border: 1px solid green !important;
  }

  /* FITERS  - REST BUTON */
  #filter2_html , 
  #filter2div {
      position: fixed;
      float: none !important;
      width: 458px;
  	top: 9vh !important;
      right: 300px !important;
      margin-left: 0 !important;
      overflow: hidden;
      z-index: 50000 !important;
  	color: silver !important;
  background: green !important;
  border: 3px solid #dadada;
  }
  #filter2div .resetlist {
      color: red !important;

  }

  /* RESULTS */

  #listing_results  {
  	float: left !important;
      margin: 0!important;
      width: 99.7% !important;
  /* border: 1px solid aqua !important; */
  }
  #listing_results select#orderpage   {
  	float: right !important;
      margin: 0!important;
      width: 95% !important;
  /* border: 1px solid yellow !important; */
  }

  .boxep1  {
  	float: left !important;
      margin: 0!important;
      width: 99.5% !important;
  border: 1px solid green !important;
  }

  #bodyprimary #disable2 .contentpage2 > div#contentlist > div > div  {
  	float: left !important;
      margin: 0!important;
      width: 100% !important;
      padding: 0 !important;
  border: 1px solid red !important;
  }
  #bodyprimary #disable2 .contentpage2 > div#contentlist > div[id^="pagination_bar"]:not([style="display: none;"]):not([style*="display: none;"]) {
  	display: block !important;
  	float: right !important;
  	clear: none !important;
      margin: 0!important;
      width: 60.6% !important;
      padding: 0 !important;
  background: red !important;
  /* border: 1px solid red !important; */
  }
  #bodyprimary #disable2 .contentpage2 > div#contentlist > div[id^="pagination_bar"]:not([style="display: none;"]):not([style*="display: none;"]) .gen {
      float: left;
      width: 10.6% !important;
      margin: 0;
  }


  #bodyprimary #disable2 .contentpage2 > div#contentlist > div#pagination_bar3:not([style="display: none;"]) {
  float: left !important;
      margin: 0!important;
      width: 99.6% !important;
      padding: 0 !important;
  /* background: blue !important; */
  /* border: 1px solid red !important; */
  }
  #bodyprimary #disable2 .contentpage2 > div#contentlist > div#pagination_bar3:not([style="display: none;"]) > div  {
      display: inline-block !important;
      width: 100% !important;
      margin: 0 0 0 0 !important;
  }

  #bodyprimary #disable2 .contentpage2 > #filter_html0 .absofixed {
      height: 24px !important;
      top: 115px !important;
      width: 75.5% !important;
      z-index: 9;
  /* border: 1px solid violet !important; */
  }
  #bodyprimary #disable2 .contentpage2 > #filter_html0 .absofixed p {
      height: 19px;
      width: 100% !important;
  background: red !important;
  }
  #bodyprimary #disable2 .contentpage2 > div#contentlist > #show_more_results .boxep1 ,
  #bodyprimary #disable2 .contentpage2 > div#contentlist > div > div.boxep1 {
  /* float: left !important; */
  	display: inline-block !important;
  	width: 100% !important;
      min-width: 49.6% !important;
      max-width: 49.6% !important;
      height: 255px !important;
      margin: 0 3px 0 0px !important;
  /* border: 1px solid aqua !important; */
  }
  #bodyprimary #disable2 .contentpage2 > div#contentlist > #show_more_results .boxep1 > div[style="display: table-row;"] ,
  #bodyprimary #disable2 .contentpage2 > div#contentlist > div > div.boxep1 > div[style="display: table-row;"] {
  	display: block !important;
  	float: left !important;
  	width: 100% !important;
      min-width: 99% !important;
      max-width: 99% !important;
      height: 252px !important;
      margin: 0 0 0 0 !important;
  border: 1px solid yellow !important;
  }
  /* (new3) */
  #bodyprimary #disable2 .contentpage2 > div#contentlist > #show_more_results .boxep1 > div > div ,
  #contentlist #listing_results .boxep1 > div > div {
      display: block !important;
  	float: left !important;
      height: 250px !important;
      width: 100% !important;
      min-width: 31.5% !important;
      max-width: 31.5% !important;
      margin: 2px 0px 0 4px !important;
      padding: 0px !important;
      overflow: hidden;
  border-left: 1.5px solid red !important;
  border-right: 1.5px solid red !important;
  }

  #bodyprimary #disable2 .contentpage2 > div#contentlist > #show_more_results .boxep1 > div > div p.genmed + a ,
  #contentlist #listing_results .boxep1 > div > div p.genmed + a  {
      width: 99% !important;
  background: #333 !important;
  border: none  !important;
  }
  #bodyprimary #disable2 .contentpage2 > div#contentlist > #show_more_results .boxep1 > div > div button ,
  #contentlist #listing_results .boxep1 > div > div button {
      width: 100% !important;
  background: #333 !important;
  border: none  !important;
  }
  #bodyprimary #disable2 .contentpage2 > div#contentlist > #show_more_results .boxep1 > div > div p.genmed + a  img ,
  #contentlist #listing_results .boxep1 > div > div p.genmed + a  img {
      width: 99% !important;
      height: 144px !important;
  	object-fit: contain !important;
  }
  #bodyprimary #disable2 .contentpage2 > div#contentlist > #show_more_results .boxep1 > div > div button img,
  #contentlist #listing_results .boxep1 > div > div button img{
      width: 100% !important;
      height: 144px !important;
  	object-fit: contain !important;
  }


  #contentlist #listing_results .boxep1 > div > div:nth-child(3) {
      border: none !important;
  }
  #contentlist #listing_results .boxep1 > div > div > div[style="margin-top: 3px; width: 200px; overflow: hidden"] {
      display: inline-block !important;
      width: 100% !important;
  }

  #contentlist #listing_results .boxep1 > div > div > div[style="margin-top: 3px; width: 200px; overflow: hidden"] {
      width: 100% !important;
      margin-top: 3px;
  }
  #contentlist #listing_results .boxep1 > div > div > div[style="margin-top: 3px; width: 200px; overflow: hidden"] > div {
      min-width: 99% !important;
      max-width: 99% !important;
      margin-left: 0 !important;
  }
  #contentlist #listing_results .boxep1 > div > div > div[style="margin-top: 3px; width: 200px; overflow: hidden"] > div .yborder{
      width: 100% !important;
      margin-left: 0 !important;
  }

  #bodyprimary #disable2 .contentpage2 > div#contentlist > div > div.boxep1 a.none .bold {
      padding: 0 !important;
  }


  /* (new3) MORE */
  #show_more_results {
  /*     float: left !important; */
      width: 99.7% !important;
      height: 20px !important;
      margin: 0px 0 0px 0px !important;
  }
  #show_more_results p  {
      float: left !important;
      width: 100% !important;
      height: 20px !important;
      padding: 0 12px !important;
  color: gold !important;
  background: #333 !important;
  }

  /* RIGHT PANEL */
  #navdivrest #navmode {
      width: 100% !important;
      padding: 2px !important;
  }
  #navmode > div{
      width: 100% !important;
      padding: 2px !important;
  }
  #navmode > div #nav_scenes{
      width: 90% !important;
      padding: 2px !important;
  }

  #tab_list_scenes > div {
  background-color: rgba(0, 0, 0, 0.16) !important;
  border-bottom: 1px dashed red !important;
  }


  #tab_list_scenes > div.relatedsceneszone2 {
      float: left;
  /*     height: 50px; */
      margin-bottom: 3px;
      overflow: hidden;
  background-color: #111 !important;
  border-bottom: 1px dashed red !important;
  }


  #tab_list_scenes > div > div{
      height: 50px !important;
  }
  #tab_list_scenes > div > div > div {
      margin: 0 ;
  }
  #tab_list_scenes > div > div > div > a > img {
      float: left;
      height: 50px;
      width: 50px;
      overflow: hidden;
      object-fit: contain !important;
  border: 1px solid red !important;
  }

  #navdivrest #showingmedia #tab_list_scenes {
  display: inline-block !important;
  float: none !important;
      width: 100% !important;
  }


  #tab_list_scenes > div.relatedsceneszone2 {
  display: inline-block !important;
  /*     height: 150px !important; */
      padding: 3px !important;
  }
  #tab_list_scenes > div.relatedsceneszone2 > a {
  /* display: inline-block !important; */
  float: left !important;
      height: 90px !important;
      width: 258px !important;
      margin: 0 0 0px 0px !important;
      padding: 5px !important;
      overflow: hidden;
  /* background-color: red !important; */
  border-bottom: 1px dashed red !important;
  }
  #tab_list_scenes > div.relatedsceneszone2 > a .gray2 {
      height: 90px !important;
      filter: none !important;
  background: #111 !important;
  }
  #tab_list_scenes > div.relatedsceneszone2 > a .gray2 > div {
      height: 90px !important;
      margin: 0px !important;
      padding: 0 !important;
  }
  #tab_list_scenes > div.relatedsceneszone2 > div:first-of-type {
  	float: left !important;
  	width: 92% !important;
      height: 34px !important;
  /*     margin: 20px 0 20px 0  !important; */
      padding: 0 !important;
  /* background: green !important; */
  }
  #tab_list_scenes > div.relatedsceneszone2 > div:first-of-type a div {
  	float: left !important;
      height: 34px !important;
  	width: 92% !important;
  /*     margin: -20px 0 0 0  !important; */
      padding: 0 !important;
  background: #111 !important;
  }
  #tab_list_scenes > div.relatedsceneszone2 > div:first-of-type a div p {
      height: 34px !important;
      padding: 0 !important;
  /* background: red !important; */
  }

  /* (new2) LISTS - TAGS / DIRECTOR / STUDIOS  */
  #bodyprimary #contentlist #listing_results > a[href^="https://www.data18.com/name/"] ,
  #bodyprimary #contentlist #listing_results .listdirector ,
  #bodyprimary #contentlist #listing_results .listtag {
      display: inline-block;
      width: 460px;
      padding: 6px;
  	margin: 0 3px 3px 3px !important;
  /* background: #f3f3f3 none repeat scroll 0 0; */
  }


  /* TOP/BOTTOM */
  #myBtn2.gotop_bottom {
      position: fixed;
      display: block;
      bottom: 0;
      right: 0 !important;
      margin: 0 !important;
      padding: 6px;
      text-align: center;
      z-index: 500 !important;
  }


  /* FOOTER */
  #disable > div > div.lineup ,
  #disable > div > div.lineup + div  {
      width: 74.8% !important;
  background: #111 !important;
  }

  #disable > div > div.lineup + div + div {
      width: 100% !important;
      z-index: 100 !important;
  background: red !important;
  }

  #disable .lineup + div > div img {
     display: inline-block !important;
      width: 10.8% !important;
  }
  #disable .lineup + div > div i {
      display: inline-block !important;
      width: 35.8% !important;
      height: 25px !important;
      object-fit: contain !important;
  }




  /* ==== COLOR  ==== */

  /* COLOR - BACKGROUND - #111 */
   [id^="show_more_results_and_"] + div[id^="show_more_"]:not(#show_more_results_and):not([id^="show_more_results_and_"]) .boxep1 ,
  [id^="show_more_results_and_"] + div[id^="show_more_"]:not(#show_more_results_and):not([id^="show_more_results_and_"]) .boxep1 > div[style="display: table-row;"] > div ,
  #menunav >div > div > div  a.gen.big > div ,
  #menunav >div > div > div > div > p ,
  #centered>table>tbody>tr>td>div[style="width: 100%; background: #DADADA;"] ,
  #centered>table>tbody>tr>td>table>tbody>tr>td>a>div:not(.imagemovie) ,
  #centered>table>tbody>tr>td>table>tbody>tr>td>table>tbody>tr>td[style="width: 560px;"] .boxep1 ,
  .contenedor div:not(.genmed):not([style="margin-top: 7px;"]) ,
  .lfoo ,
  #centered>table>tbody>tr>td>table>tbody>tr>td>div ,
  .boxep1 .gray2 ,
  .contentpage2 ,
  #disable2 .contentpage2 ,
  #divmenu.absofixed, 
  .bartop1w0, 
  #mainclick {
      background: #111 !important;
  }

  /* COLOR - BACKGROUND - #222 */

  .boxep1 div[style*="padding: 6px; background: #959595;"] ,
  #body2rest ,
  .none .bold,
  .boxep1 .gen12.bold ,
  #tabmovies_line .boxep1 div[style*="background: #959595;"] ,
  #menunav > div > div > div > div > a > div,
  #menunav > div > div > div ,
  #menunav > div > div ,
  #disable2  ,
  #tabmovies_list #tabmovies_line .boxep1 > div > div[style="display: table-cell; background: #f3f3f3;"] ,
  #tabmovies_list #tabmovies_line .boxep1 > div ,
  #tabmovies_list #tabmovies_line .boxep1 ,
  #tabmovies_line .boxep1 ,
  #tabmovies_line ,
  #tabmovies_pri ,
  #contentlist ,
  #tabmovies_line .boxep1 > div ,
  #bodyprimary #disable2 .contentpage2 > div#contentlist > div > div, 
  #bodyprimary #disable2 .contentpage2 > div#contentlist > #pagination_bar3, 
  #bodyprimary #disable2 .contentpage2 > #filter_html0 .absofixed ,
  #bodyprimary #disable2 .contentpage2 > div#contentlist > div > div.boxep1 > div > div,
  #floatbody .absofixed ,
  .contentpage2 ,
  #navdivrest ,
  #centered>table>tbody > tr > td > div[style="width: 100%; background: #DADADA;"] > div:not([style="clear: both;"]) ,
  .dsecure ,
  .dfoo2 ,
  #centered > table > tbody > tr > td > table > tbody > tr > td ,
  #centered > table > tbody > tr > td > table>tbody ,
  #centered > table > tbody > tr > td > table,
  #centered > table > tbody > tr > td:first-of-type ,
  #centered > table > tbody ,
  #centered > table ,
  #centered > .lineup:first-of-type + div + .lineup + div ,
  #centered > .lineup:first-of-type + div ,
  #centered.main2 ,
  body ,
  .main.gre1 {
      background: #222 !important;
  }


  /* COLOR - BACKGROUND COLOR - #222 */
  .gray2 {
      background-color: #222 !important;
  }





  /* COLOR - BACKGROUND - #333 */

  #searchcontains ,
  #searchtype ,
  #mixall ,
  #sharedfilmo ,
  #menuleft input ,
  #listing_results select#orderpage ,
  #navmode > div #nav_scenes ,
  #searchdiv > div + input ,
  #disable .lineup + div > div + .gen12 > div ,
  #disable .lineup + div > div ,
  #menunav > div > div > div > div ,
  #filter_html > div ,
  .p4 ,
  #centered > table > tbody > tr > td > div[style="width: 100%; background: #DADADA;"] > div[style*="background: #BEEFFD;"]:not([style="clear: both;"]) ,
  #centered > table > tbody > tr > td > div[style="height: 3px; background: #DADADA;"] ,
  .dfoo3 ,
  .dfoo1 ,
  #centered > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td  {
      background: #333 !important;
  }


  /* COLOR - BACKGROUND - GREEN */
  #menunav > div > div > div  > div > div a:not(.big)[href="https://www.data18.com/names/pornstars/female"] > div {
      background: green !important;
  }


  /* COLOR - BACKGROUND - RED */
  #menunav > div > div > div  > div > div a:not(.big)[href="https://www.data18.com/names/pornstars/male"] > div {
      background: red !important;
  }

  /* COLOR - BACKGROUND - IMAGES */
  #menunav > div > div > div > div > p img ,
  #menunav > div > div > div > div > a > div img {
      background-color: red !important;
  }


  /* COLOR - TXT - GRAY */
  #disable2 ,
  #navmode > div ,
  #listing_results > p ,
  #bodyprimary #disable2 .contentpage2 > div#contentlist > div > div, 
  #bodyprimary #disable2 .contentpage2 > div#contentlist > #pagination_bar3, 
  #bodyprimary #disable2 .contentpage2 > #filter_html0 .absofixed ,
  #bodyprimary #disable2 .contentpage2 > div#contentlist > div > div.boxep1 > div > div,
  #filter_html > div ,
  #centered > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td[style="border-left-width:1px; border-left-style:dashed; border-left-color:#BCBCBC;"] ,
  #centered > table > tbody > tr > td > table > tbody > tr > td > table > tbody > tr > td[style="width: 560px;"] .boxep1 > table > tbody > tr > td ,
  .gen11>i ,
  .p3>p ,
  .gen11>form ,
  .dfoo1>p ,
  .dfoo3>p ,
  .dsecure.genmed>p ,
  .bold ,
  .gen12 ,
  .gensmall ,
  .h1big, 
  .h23 {
      color: silver  !important;
  }

  /* COLOR - TEXT - GOLD */

  #tabmovies_line .boxep1 .gray2 > .genmed ,
  #searchcontains ,
  #searchtype ,
  #mixall ,
  #sharedfilmo ,
  #menuleft input ,
  #listing_results select#orderpage ,
  #navmode > div #nav_scenes ,
  #searchdiv > div + input ,
  #navmode > div b ,
  #tab_list_scenes>div ,
  .none .bold ,
  #menunav > div > div > div  > div > div  span ,
  #menunav >div > div > div > div > p ,
  .closemenu ,
  #filter_html > div > div:not([style="clear: both;"]) .filtercolumn > div i  ,
  #filter_html > div > div:not([style="clear: both;"]) .filtercolumn > div b ,
  .boxep1 > div a ,
  #listing_results>p span {
  	text-decoration: none  !important;
      color: gold  !important;
  }


  /* SELECTED FILTER */
  #listing_results > p span[style="color: red;"] {
  padding: 2px 2px !important;
      color: white !important;
  	background: green !important;
  }




  /* COLOR - TEXT - SPECIAL */
  .gray2 {
      filter: none !important;
      color: gold !important;
  }


  /* COLOR - TXT/links - PERU */
  #navmode > div span#goall ,
  .boxep1 .gen12.bold ,
  #filter_html > div > div:not([style="clear: both;"]) .filtercolumn > div span ,
  a {
      color: peru  !important;
  }

  #listing_results ,
  #centered > table > tbody > tr > td > div[style="width: 100%; background: #DADADA;"] > div[style*="background: #BEEFFD;"]:not([style="clear: both;"]) a ,
  #centered > table > tbody > tr > td > table > tbody > tr > td > div[style="padding: 10px;"] ,
  #centered > table > tbody > tr > td > table > tbody > tr > td > div[style="padding: 8px;"] ,
  .lfoo .bold {
      color: gold  !important;
  }

  /* COLOR - EMPTY THINGS - COLOR - */
  .imagepic p:empty {
      background: transparent !important;
  }

  /* COLOR - IMG - filter */
  #searchdivpri #searchicon{
      filter: invert(20%) !important;
  }

  .backgroundmenu > div > div > a > img[src="https://i.datavimg.com/images/user-nopic.png"] ,
  #tab_list_scenes > div > div > div > a > img[src="https://i.datavimg.com/images/user-nopic.png"] ,
  .yborder[src^="https://i.datavimg.com/images/no_prev_"] {
      filter: invert(85%) !important;
  }


  /* COLOR - BORDER */
  select {
      border: 1px solid red !important;
  }

  /* ==== END - COLOR ==== */
  `;
}
css += `
/* ACTORS PAGES */

/* RIGHT PANEL */
/*#navdiv.absofixed {
    display: none !important;
}*/

/* RESULTS  */
/*#floatbody #disable .contentpage > .absofixed ,
#floatbody #disable .contentpage #bodyprimary ,
#floatbody #disable .contentpage #bodyprimary #disable2{
    margin: 0 !important;
    width: 100% !important;
}

#bodyprimary #disable2 .contentpage2 > div#contentlist {
    float: right !important;
    margin: 0 !important;
    width: 88.5% !important;

border: 1px solid aqua !important;
}*/


#bodyprimary #disable2 .contentpage2 > div#contentlist > div > div.boxep1 {
    /* float: left !important; */
    display: inline-block !important;
    width: 100% !important;
    min-width: 49.6% !important;
    max-width: 49.6% !important;
    height: 215px !important;
    margin: 0 3px 0 0px !important;
/*border: 1px solid lime !important;*/
}

#bodyprimary #disable2 .contentpage2 > div#contentlist > div > div.boxep1 > div[style="display: table-row;"] {
    display: block !important;
    float: left !important;
    width: 100% !important;
    min-width: 99% !important;
    max-width: 99% !important;
    height: 212px !important;
    margin: 0 0 0 0 !important;
/*border: 1px solid yellow !important;*/
}

/* ACTOR PROFILE */
#contentlist #listing_results .boxep1 > div > div {
    display: block !important;
    float: left !important;
    height: 210px !important;
    width: 100% !important;
    min-width: 24.2% !important;
    max-width: 23.3% !important;
    margin: 2px 0px 0 4px !important;
    padding: 0px !important;
    overflow: hidden;
border-left: 1.5px solid red !important;
border-right: 1.5px solid red !important;
}
#contentlist #listing_results .boxep1 > div > div button img,
#bodyprimary #disable2 .contentpage2 > div#contentlist > #show_more_results .boxep1 > div > div p.genmed + a img, 
#contentlist #listing_results .boxep1 > div > div p.genmed + a img
 {
    width: 99% !important;
    height: 104px !important;
    object-fit: contain !important;
}

#bodyprimary #disable2 .contentpage2 > div#contentlist > div > div.boxep1 a.none .bold {
	width: 100% !important;
    padding: 0 !important;
}


#contentlist #listing_results .boxep1 > div > div [class^="gen"][class$="bold"] {
    width: 100% !important;
    margin-top: -2px;
    padding: 0 0 !important;
	text-align: center;
color: white;
background: #2f2d2d;
}
#contentlist #listing_results .boxep1 > div > div p[style^="text-align: center"] {
    width: 100% !important;
    margin: 0 0 1px 0 !important;
    padding: 0 0 !important;
	text-align: center;
color: white;
background: #3c3a3a;
}







`;
if (location.href.startsWith("https://www.data18.com/names/pairings/candice-dare_randy-denmark") || location.href.startsWith("https://www.data18.com/name/")) {
  css += `
  /* PAIRING MOVIE RESULTS */

  #contentlist #listing_results .boxep1 > div > div[id^="item"] {
      display: block !important;
      float: left !important;
      height: 210px !important;
      width: 100% !important;
      min-width: 32.4% !important;
      max-width: 23.3% !important;
      margin: 2px 0px 0 4px !important;
      padding: 0px !important;
      overflow: hidden;
  border-left: 1.5px solid red !important;
  border-right: 1.5px solid red !important;
  }
  #contentlist #listing_results .boxep1 > div > div[id^="item"]  + [style^="display: table-cell;"]  {
      display: none !important;
  }
  #bodyprimary #disable2 .contentpage2 #contentlist #listing_results > .boxep1 [style*="padding: 6px; background: #959595;"] {
      margin: 0 0 0 0 !important;
      padding: 0 0 0 0 !important;
      text-align: center;
  /*background: red !important;*/
  border-bottom: 1.5px solid silver !important;
  }

  #bodyprimary #disable2 .contentpage2 > div#contentlist > div > div.boxep1 {
      /* float: left !important; */
      display: inline-block !important;
      width: 100% !important;
      min-width: 49.6% !important;
      max-width: 49.6% !important;
      height: 215px !important;
      margin: 0 3px 0 0px !important;
  /*border: 1px solid lime !important;*/
  }

  #bodyprimary #disable2 .contentpage2 > div#contentlist > div > div.boxep1 > div[style="display: table-row;"] {
      display: block !important;
      float: left !important;
      width: 100% !important;
      min-width: 99% !important;
      max-width: 99% !important;
      height: 212px !important;
      margin: 0 0 0 0 !important;
  /*border: 1px solid yellow !important;*/
  }

  #contentlist #listing_results .boxep1 > div > div {
      display: block !important;
      float: left !important;
      height: 210px !important;
      width: 100% !important;
      min-width: 24.2% !important;
      max-width: 23.3% !important;
      margin: 2px 0px 0 4px !important;
      padding: 0px !important;
      overflow: hidden;
  border-left: 1.5px solid red !important;
  border-right: 1.5px solid red !important;
  }
  #contentlist #listing_results .boxep1 > div > div img
   {
      width: 99% !important;
      height: 84px !important;
      object-fit: contain !important;
  }


  `;
}
if (location.href.startsWith("http://www.data18.com/dev/")) {
  css += `
  /* DEV - ==== */

  .boxep1 {
      display: inline-table;
      width: 24.5% !important;
      height: 100%;
      max-height: 290px;
      min-height: 290px;
      overflow: hidden;
  background-color: rgb(250, 250, 250);
  border: 1px solid aqua !important;
  }

  /* ==== END (new1) - URL PREF - DEV ==== */
  `;
}
if (location.href.startsWith("https://www.data18.com/scenes/")) {
  css += `
  /* SCENE PAGES ==== */

  /* SCENES PAGES */

  /* SUPP */
  #barimg2 ,
  #gotopmediaheight ,
  #margintopdo ,
  #divoptions{
      display: none !important;
  }


  /* ZONE BUT */
  #zonebuttons.absofixed.body2_div_margin_left {
      position: fixed !important;
      display: inline-block !important;
      min-width: 190px !important;
      max-width: 190px !important;
      height: 100% !important;
      max-height: 1px !important;
      min-height: 1px !important;
      margin: -5px 0 0 0 !important;
      padding: 0 !important;
      z-index: 9;
  	overflow: hidden !important;
  	transition: all ease 0.7s !important;
  background: blue !important;
  }
  #zonebuttons.absofixed.body2_div_margin_left:before {
      content: "🔻" !important;
      position: fixed !important;
      display: inline-block !important;
      min-width: 190px !important;
      margin: -15px 0 0 0  !important;
  	text-align: center !important;
  color: gold !important;
  background: green !important;
  }
  #zonebuttons.absofixed.body2_div_margin_left:hover {
      height: 100% !important;
      max-height: 380px !important;
      min-height: 380px !important;
      padding: 3px !important;
  	transition: all ease 0.7s !important;
  background: green !important;
  border: 1px solid red !important;
  }
  #zonebuttons.absofixed > div:not([style="clear: both;"]) {
      display: inline-block !important;
      min-width: 190px !important;
  	height: 100% !important;
  	min-height: 45px !important;
  	max-height: 45px !important;
      margin: 0 !important;
  	padding: 0 !important;
  	overflow: hidden !important;
      z-index: 9;
  background: red !important;
  }
  #zonebuttons.absofixed > div #thiscurrentpage {
      display: block !important;
      float: left;
      margin-left: 0 !important;
      width: 190px !important;
  }
  #zonebuttons.absofixed > div #thiscurrentpage > #thiscurrentpage1 {
      display: block !important;
      float: left;
      width: 187px !important;
  height: 100% !important;
  min-height: 45px !important;
  max-height: 45px !important;
      margin-left: 0 !important;
  }
  #zonebuttons.absofixed > div #thiscurrentpage > #thiscurrentpage1 #imgcurrentpage1 {
      width: 120px !important;
  	height: 100% !important;
  	min-height: 45px !important;
  	max-height: 45px !important;
  }
  #zonebuttons.absofixed > div #thiscurrentpage > #thiscurrentpage1 #imgcurrentpage1 img {
      width: 120px !important;
  	height: 100% !important;
  	min-height: 50px !important;
  	max-height: 50px !important;
  	object-fit: contain !important;
  }
  #zonebuttons.absofixed > div #thiscurrentpage > #thiscurrentpage1 .iconcurrentpage {
      float: left;
      width: 75px !important;
      margin: 15px 0 0 -195px !important;
      text-align: center;
  color: red !important;
  }

  /* LEFT PANEL */
  .fixedopt {
      position: fixed;
      top: 13vh !important;
      margin: 0 !important;
  }


  /* CENTER CONTENT */
  #disable .absofixed {
      display: inline-block !important;
      width: 86% !important;
  	height: 100% !important;
  	min-height: 44px !important;
  	max-height: 44px !important;
      margin: 0 !important;
  	padding: 0 !important;
      z-index: 9;
  background: red !important;
  }
  #disable .absofixed >div:not(#optionsdiv)[style*="background: #FFF8F9;"]  {
      display: inline-block !important;
      width: 99.4% !important;
  	height: 100% !important;
  	min-height: 35px !important;
  	max-height: 35px !important;
      margin: 0 !important;
  	padding: 0 5px !important;
  background: black !important;
  }
  .contentpage.pagemedia>div[style="margin-top: 6px; margin-bottom: 6px;"] {
      display: inline-block !important;
      margin-bottom: 6px;
      margin-top: 5vh !important;
  }
  #body2div {
      float: left;
      width: 37vw !important;
  	height: 85vh !important;
      margin: 1vh 0 0 0 !important;
  	text-align: center !important;
  /* border: 1px solid yellow !important; */
  }
  .framevideolink ,
  #moviewrap>div ,
  #moviewrap {
      width: 100% !important;
  }

  /* (new3) FAKE PLAYER */
  .framevideolink img#playpriimage  {
      width: 100% !important;
  	height: 300px;
  	object-fit: contain !important;
  	pointer-events: none !important;
  }
  #divredthis img {
      display: none  !important;
  }
  p#lineposter2  {
  	position: absolute !important;
      display: inline-block !important;
      width: 100% !important;
  	bottom: 0vh !important;
  	left: 40px !important;
      margin: 0vh 0 0 0 !important;
      text-align: center;
  	z-index: 5000 !important;
  color: white;	
  background: rgba(255, 0, 0, 0.4) !important;
  }

  #body2div_b {
      float: left !important;
      width: 35vw !important;
  	height: 85vh !important;
      margin: 6vh 0 0 12vw !important;
  border-right: 1px solid red !important;
  }

  /* RIGHT PANEL */

  #navdivrest #showingmedia #tab_list_scenes {
      display: inline-block;
      float: none;
      width: 100%;
  	height: 62vh !important;
  	padding: 0 0px 0 10px !important;
  	overflow: hidden !important;
  	overflow-y: auto !important;
  border: 1px solid red !important;
  }


  /* END - URL PREF - SCENE PAGES === */
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
