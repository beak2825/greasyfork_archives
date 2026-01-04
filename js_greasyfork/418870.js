// ==UserScript==
// @name X NudeVista - Widescreen Black Theme Tweak v.34
// @namespace nudevista.com
// @version 1.34.0
// @description larger and Dark NudeVista on large screen (1920x1080) ONLY...
// @author janvier56
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.nudevista.com/*
// @match *://*.www.nudevista.tv/*
// @match *://*.www.nudevista.at/*
// @match *://*.my.nudevista.com/*
// @match *://*.www.nudevista.be/*
// @match *://*.www.nudevista.it/*
// @match *://*.www.nudevista.com.br/*
// @match *://*.www.nudevista.jp/*
// @match *://*.www.nudevista.tw/*
// @match *://*.www.nudevista.nl/*
// @match *://*.www.nudevista.com.pl/*
// @match *://*.www.nudevista.se/*
// @match *://*.www.nudevista.es/*
// @match *://*.www.nudevista.pt/*
// @match *://*.nudevista.net/*
// @match https://www.nudevista.com/
// @match https://www.nudevista.com/?q=&s=p*
// @match https://www.nudevista.com/?q=*&s=p&start=*
// @match https://www.nudevista.com/?t=*
// @match https://www.nudevista.pl/?t=*
// @match https://www.nudevista.com/?q=*
// @match https://www.nudevista.pl/?q=*
// @match https://www.nudevista.net/*
// @match https://www.nudevista.pl/*
// @match https://www.nudevista.net/?q*
// @downloadURL https://update.greasyfork.org/scripts/418870/X%20NudeVista%20-%20Widescreen%20Black%20Theme%20Tweak%20v34.user.js
// @updateURL https://update.greasyfork.org/scripts/418870/X%20NudeVista%20-%20Widescreen%20Black%20Theme%20Tweak%20v34.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "nudevista.com" || location.hostname.endsWith(".nudevista.com")) || (location.hostname === "www.nudevista.tv" || location.hostname.endsWith(".www.nudevista.tv")) || (location.hostname === "www.nudevista.at" || location.hostname.endsWith(".www.nudevista.at")) || (location.hostname === "my.nudevista.com" || location.hostname.endsWith(".my.nudevista.com")) || (location.hostname === "www.nudevista.be" || location.hostname.endsWith(".www.nudevista.be")) || (location.hostname === "www.nudevista.it" || location.hostname.endsWith(".www.nudevista.it")) || (location.hostname === "www.nudevista.com.br" || location.hostname.endsWith(".www.nudevista.com.br")) || (location.hostname === "www.nudevista.jp" || location.hostname.endsWith(".www.nudevista.jp")) || (location.hostname === "www.nudevista.tw" || location.hostname.endsWith(".www.nudevista.tw")) || (location.hostname === "www.nudevista.nl" || location.hostname.endsWith(".www.nudevista.nl")) || (location.hostname === "www.nudevista.com.pl" || location.hostname.endsWith(".www.nudevista.com.pl")) || (location.hostname === "www.nudevista.se" || location.hostname.endsWith(".www.nudevista.se")) || (location.hostname === "www.nudevista.be" || location.hostname.endsWith(".www.nudevista.be")) || (location.hostname === "www.nudevista.es" || location.hostname.endsWith(".www.nudevista.es")) || (location.hostname === "www.nudevista.it" || location.hostname.endsWith(".www.nudevista.it")) || (location.hostname === "www.nudevista.pt" || location.hostname.endsWith(".www.nudevista.pt")) || (location.hostname === "www.nudevista.jp" || location.hostname.endsWith(".www.nudevista.jp")) || (location.hostname === "www.nudevista.nl" || location.hostname.endsWith(".www.nudevista.nl")) || (location.hostname === "www.nudevista.tw" || location.hostname.endsWith(".www.nudevista.tw")) || (location.hostname === "www.nudevista.se" || location.hostname.endsWith(".www.nudevista.se")) || (location.hostname === "www.nudevista.es" || location.hostname.endsWith(".www.nudevista.es")) || (location.hostname === "www.nudevista.at" || location.hostname.endsWith(".www.nudevista.at")) || (location.hostname === "nudevista.net" || location.hostname.endsWith(".nudevista.net")) || location.href === "http://my.nudevista.com/favorites/") {
  css += `

  /* ==== X NudeVista - X NudeVista - Widescreen Black Theme Tweak v.34 (new34)- 2025.06 ====

  IMPORTANT:
  WORK better fine If LOGED ....

  - USERSTYLE : 
  CSS theme for a larger NudeVista on large screen (1920x1080)...
  - WORK WITH THE OFFICIAL BLACK THEM PROVIDED BY THE SITE 
  - WORK with AUTOPAGERIZE Userscript

  USERTYLE WORK BETTER for these PREFERENCES:
  - Bacground: BLACK
  - Show 35 results per page
  - View results in MORE THUMBNAILS MODE
  - X ANIMATED THUBNAILS PREVIEW
  - X DERAILLED INFORMATION BLOCK

  PB for other preferences !important;!important;
  http://www.nudevista.tv/?q=flower&s=t
  ==== */
  /* === http://www.nudevista.com === */


  /* (new27) SUPP PUBS - === */
  #_atssh ,
  #results_1.results + div ,
  #results_1.results + div[style="clear:both;"]{
      display: none !important;
  }

  /* (new33) SUPP LINKs - NEED AGE VERIF */
  #mblock .pthumb:has([href^="https://www.hotmovies.com/"])  {
      display: none !important;
  }

  /* (new33) SUPP LINKs - NEED AGE VERIF - KEEP THUMBNAL FOR INFO - cursor: not-allowed */
  td[rowspan][align="center"]:has([href^="https://www.hotmovies.com/"]) a  {
  	cursor: not-allowed !important;
  }

  /*(new32) TEST REVEAL YOUR IP - === */
  #results_1 ~ div[style="display:none"] {
      position: relative !important;
  	position: absolute !important;
      display: inline-block !important;
      left: 200px !important;
      margin-bottom: -9px !important;
      top: 2px !important;
  font-size: 12px !important;
  z-index: 5000 !important;
  }
  #results_1 ~ div[style="display:none"]:before {
  content: "Your IP :" ;
      display: inline-block !important;
  }
  /* SUPERLOADER */
  .sp-separator ~ #results_1 ~ [style="display:none"]:before,
  .sp-separator ~ #results_1 ~ [style="display:none"] {
      display: none !important;
  }
  /* (new32) TEST - OVERFLOW GENERAL - === */
  #nnv {
      position: relative !important;
      display: inline-block !important;
      width: 100% !important;
      max-width: 1920px !important;
      min-width: 1920px !important;
  	margin: 0 0 0 0 !important;
      overflow-x: hidden !important;
      overflow-y: auto !important;
  }

      
  /* (new27) RESULTS === */
  .results #listing > table {
      display: inline-block !important;
      width: 100% !important;
      max-width: 1920px !important;
      min-width: 1920px !important;
  }
  #listing>table:nth-child(odd):not(:only-of-type) {
      background: #222 !important;
  }
  #listing>table:nth-child(even) {
      background: #333 !important;
  }

  /* (new27) RESULTS ===AUTOPAGERIZE == A VOIR */
  .results #listing .autopagerize_page_info {
      position: relative !important;
      display: inline-block !important;
      width: 2900px !important;
      height: 18px !important;
      line-height: 14px !important;
      top: 1520px !important;
      left: 410px !important;
      padding: 0 20px !important;
      text-align: left !important;
      transform: rotate(90deg) !important;
  background: #222 !important;
  }
  .results #listing .autopagerize_page_info a {
      position: relative !important;
      display: inline-block !important;
      width: 2800px !important;
      height: 16px !important;
      line-height: 16px !important;
      text-align: center !important;
  color: gold !important;
  background: black !important;
  }

  /* (new7) SEARCH PAGE - ADVANCED - === */
  #nnv>body>div[style="width: 80%; font-size: 120%; margin: 53px 0px 30px 6%;"] {
      margin: 53px 0 30px 6% !important;
  }


  /* (new6) NEW TOP HEADER - === */
  /* (new6) MESSAGE ABOUT NEW DESIGN - === */
  #nnv.nnv .notice {
      display: none !important;
  }
  /* (new32) TOP HEADER - NAV USER GESTION - LANGUE / USER INFOS / LOGIN/OUT /MOBILE / PREFERENCES /FAVORITES / LOGIN - === */
  #nnv.nnv  .copyright + .secondary ,
  #nnv.nnv .secondary  {
      position: fixed !important;
      display: inline-block !important;
      width: 100% !important;
      min-height: 15px !important;
      top: 0 !important;
      left: 2px !important;
      margin-left: 0;
      padding: 0px 0 !important;
  background-color: #102f5e !important;
  }
  #nnv.nnv  .copyright + .secondary nav.top_navigation.middle.font-arial ,
  .top_navigation {
  	position: relative !important;
      display: inline-block !important;
      width: 70% !important;
      min-width: 70% !important;
      left: 100px !important;
  	top: -3px !important;
      text-align: left !important;
  }
  #nnv.nnv .secondary a.lang_current {
      left: 0 !important;
  	top: 0 !important;
      margin-left: 0px !important;
      padding: 0px 0 0;
      z-index: 11100 !important;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.3);
  }
  #nnv.nnv span#lang_current:not(.fixplace) {
      position: absolute;
      margin: -11px 0 0 -10px;
      padding: 30px 0 0;
  	transform: translateZ(0px);
  	z-index: 0!important;
  	visibility: hidden !important;
  box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.3);
  background: transparent !important;
  }
  #nnv.nnv span#lang_current:not(.fixplace):hover {
      position: absolute;
      margin: -11px 0 0 -10px;
      padding: 30px 0 0;
  	transform: translateZ(0px);
      z-index: 0 !important;
  visibility: visible !important;
  }
  #nnv.nnv span#lang_current div {
      width: 120px;
  background: #102f5e !important;
  }

  #nnv.nnv span#lang_current a {
  	padding: 2px 10px 9px !important;
  background-color: #13356c !important;
      
  }
  /* (new19) FIXED */
  #nnv.nnv .copyright + .secondary .top_navigation.middle.font-arial span#lang_current.fixplace {
      left: -35px !important;
  background: transparent !important;
  }

  /* (new29) TOP HEADER -  CONTAINER - === */
  #nnv.nnv .header--results {
      position: relative;
      height: 8vh !important;
  }
  /* TOP SEARCH - CONTAINER - === */
  #formsearch {
  	position: relative !important;
  	display: inline-block !important;
      min-width: 900px !important;
      max-width: 900px !important;
  	height: 50px !important;
      margin: 20px 0 0 0 !important;
      left: 10px !important;
  	padding: 0 !important;
  }
  #nnv.nnv #formsearch #ili {

  height: 50px !important;
      margin: 0px 0 0 !important;
  }
  /* (new23 */
  #nnv.nnv .header--results .header__labels {
      position: absolute !important;
      min-width: 500px !important;
      top: -4px !important;
      left: 1320px !important;
      z-index: 500000 !important;
      padding: 2px !important;
  }
  #nnv.nnv .header__labels .afilter {
      font-size: 15px !important;
  color: white !important;
  background: green !important;
  }
  #nnv.nnv .header__labels .afilter:hover {
      font-size: 15px !important;
  color: white !important;
  background: red !important;
  }
  div#search_options {
      position: absolute !important;
      z-index: 5000000 !important;
  }
  /* (new21) LOGO - === */
  #nnv.nnv .header__logo-search .header__logo {
      position: absolute !important;
      display: inline-block !important;
      left: -560px!important;
      margin-left: 0 !important;
      top: -77px !important;
      transform: scale(0.2) !important;
      z-index: 500 !important;
  }
  #nnv.nnv .header--results .header__logo {
      position: absolute !important;
      display: inline-block !important;
      left: 0px!important;
      margin-left: 0 !important;
      margin-bottom: 0 !important;
      top: -32px !important;
      transform: scale(0.3) !important;
      z-index: 500 !important;
  }

  /* (new20) TOP HEADER - SEARCH - === */
  #nnv.nnv .header__search ,
  #nnv.nnv .header--results .header__search {
  position: relative !important;
      display: inline-block !important;
      margin-left: 0px!important;
  left: 0px!important;
  top: 0 !important;
      margin-top: 0px !important;
  transform: scale(0.7);
  }
  #nnv.nnv .header__search  {
      display: inline-block !important;
  /*     margin-left: -520px!important; */
  }
  #nnv.nnv .header.header--results #ili .header__search   {
      display: inline-block !important;
  height: 50px !important;
      margin-left: -195px!important;
  }
  #nnv.nnv .header__search-body {
      display: inline-block;
      height: 50px;
      width: 1370px;
  }
  #nnv.nnv .header__search .header__search-field ,
  #nnv.nnv .header--results .header__search-field {
      display: inline-block !important;
      width: auto !important;
      margin-left: 0px !important;
      padding-left: 5px;
      padding-right: 0px;
  }
  #nnv.nnv .header__search-field {
      display: inline-block;
      position: relative;
  top: 0px !important;
      vertical-align: top;
  } 
  #nnv.nnv .header__search-submit {
      display: inline-block;
      position: relative;
  	top: 0px !important;
      vertical-align: top;
  }
  #nnv.nnv .header__search .header__search-field #q.header__search-input , 
  #nnv.nnv #q.header__search-input {
      min-width: 800px;
      padding: 0 35px 0 15px;
      font-size: 30px !important;
  }
  div.search_current_index {
      font-size: 12px;
      position: absolute;
      text-align: left;
      top: -13px !important;
      left: -185px !important;
  }

  #nnv.nnv div.search_current {
  		margin-left: 744px !important;
  	top: 15px !important;
  }

  div#search_options {
  /*     display: inline-block !important; */
      position: absolute !important;
  /* z-index: 5000000 !important; */
  }

  /* (new21) SEARCH - NO MODELS - TXT "Unfornately..." - === */
  #nnv>body> #infoi + .nomodel {
      position: absolute !important;
      display: inline-block !important;
      top: 30px !important;
      right: 100px !important;
      padding: 0 20px !important;
  	z-index: 500000 !important;
  color: gold !important;
  background-color: #102f5e !important;
  }

  /* (new6) TOP HEADER - SEARCH - WIDE AUTOCOMPLETE LIST - === */
  #nnv.nnv ul.auto-complete-list {
      position: absolute;
      width: 1900px !important;
      max-height: 750px !important;
      top: 64px !important;
      left: 5px !important;
      list-style-type: none;
      overflow: auto;
      z-index: 10000 !important;
  background: #222 !important;
  border-bottom: 1px solid black;
  border-left: 1px solid black;
  border-right: 1px solid black;
  }
  ul.auto-complete-list li {
      display: inline-block!important;
      min-height: 27px !important;
      width: 432px !important;
      margin: 0 5px 5px 5px !important;
      padding: 3px;
      border-radius: 5px !important;
  	cursor: pointer;
      list-style-type: none;
  color: black;
  background-color: #ccc;
  border: 1px solid gray !important;
  }

  /* (new20) TOP HEADER - SEARCH - CLEAR BUTTON - === */
  form#formsearch.desctop .clear_button {
      position: relative !important;
      display: inline-block !important;
  	left: 804px !important;
      margin-top: 0px !important;
      top: -50px !important;
      border-radius: 3px !important;
      opacity: 0.7;
      transition: all ease 0.7s !important;
  background-image: url("http://x99.nudevista.com/_/clearxb.png");
  background-color: aqua !important;
  }
  form#formsearch.desctop:hover .clear_button {
      opacity: 1 !important;
      transform: scale(1.1) !important;
      transition: all ease 0.7s !important;

  }

  /* (new4) TOP HEADER - FEEDBACK/NEWS(TWITTER)/FEEDBACK / ABOUT BUTTONs - === */
  .copyright:before {
      content: "🔻" !important;
      position: absolute !important;
      display: inline-block !important;
      height: 25px !important;
      line-height: 15px !important;
      top: -2px !important;
      left: 0 !important;
      font-size: 15px !important;
      cursor: pointer !important;
      visibility: visible !important;
  color: gold !important;
  background: #102f5e !important;
  }
  .copyright {
      position: absolute !important;
      display: inline-block !important;
      float: none !important;
      width: 18px !important; 
      height: 15px !important;
      top: 0px !important;
      left: 15px !important;
      margin-top: 0 !important;
      font: 12px Verdana;
      font-size: 0 !important;
      text-align: left !important;
      visibility: visible !important;
      overflow: hidden !important;
      z-index: 5000000 !important;
      transition: ease all 0.7s !important;
  	 color: #888;
  background: blue !important;
  }
  .copyright:hover {
      position: absolute !important;
      display: inline-block !important;
      float: none !important;
      width: 100px !important; 
      height: auto !important;
      left: 0 !important;
      margin-top: 0 !important;
      padding: 0 20px 5px 25px !important;
      font: 12px Verdana;
      
      font-size: 0 !important;
      text-align: center;
      visibility: visible !important;
      overflow: hidden !important;
      z-index: 5000000 !important;
  color: #888;
  background: #102f5e !important;
  }
  .copyright > a {
      display: inline-block !important;
      width: 120px !important;
      font-size: 12px !important;
  }
  .copyright>a:hover {
      display: inline-block !important;
      font-size: 12px !important;
      background: #3371ff !important;
  }


  /* (new32) TOP HEADER - NAV TABS - CONTAINER - === */
  #nnv.nnv .header__nav {
      position: fixed !important;
  	display: inline-block !important;
  	float: none !important;
      height: 2vh !important;
      width: 10% !important;
  	top: 0vh !important;
      right: 10px !important;
  	overflow: hidden !important;
  	z-index: 5000000 !important;
  border: 1px solid red !important;
  }
  #nnv.nnv .header__nav:hover {
      position: fixed !important;
  	display: inline-block !important;
  	float: none !important;
      height: auto !important;
  	overflow: hidden auto !important;
  background: brown !important;
  border: 1px solid red !important;
  }
  #nnv.nnv .header__tabs.middle {
      position: relative;
  	min-width: 27% !important;
      max-width: 27% !important;
      padding: 0 0px;
  }
  #nnv.nnv .header__tabs-center {
      max-width: 600px;
  	padding: 0 !important;
  	margin: 0 0 0 0 !important;
      font-size: 0;
  background: brown !important;
  }


  /* (new27) TOP HEADER - MENU RIGHT - ITEMS */
  #nnv.nnv .header__tabs-center a.header__tab.noclick ,
  #nnv.nnv .header__tabs a {
      display: block !important;
      float: none !important;
  	min-width: 100% !important;
      max-width: 100% !important;
      height: 2vh !important;
      line-height: 2vh  !important;
      margin: 0 0 0 0 !important;
      padding: 0 !important;
      font-size: 15px !important;
      text-align: center !important;
  color: white !important;
  background: rgb(16, 47, 94) !important;
  }
  #nnv.nnv .header__tabs-center a#checked {
    color: white !important;
  	background-color: rgb(32, 98, 198) !important;
  }


  /* (new32) TOP HEADER - ADVANCED SEARCH - TABS - === */
  #nnv.nnv .header__tabs-center a.header__tab.noclick[href="/advanced-search/"], 
  #nnv.nnv .header__tabs a[href="/advanced-search/"] ,
  #nnv.nnv .header__tabs a[href="http://www.nudevista.com/advanced-search/"] ,
  #nnv.nnv .header__tabs a[href="/advanced-search/"] {
      width: 190px !important;
  	margin-right: 20px !important;
  	border-radius: 4px 4px 0 0 !important;
      font-size: 15px !important;
  background-image: none !important;
  background-color: red !important;
  }
  /* (new32) TOP HEADER - TABS - CHECKED / SELECTED - === */
  #nnv.nnv .header__tabs a#checked {
      display: inline-block !important;
      width: 100px !important;
      max-width: 100% !important;
      height: 2vh !important;
      line-height: 2vh  !important;
      padding-top: 0px !important;
      font-size: 20px;
      text-align: center;
  color: white !important;
  background-image: url("http://x99.nudevista.com/_/a_black.gif") !important;
  }

  #nnv.nnv .header__tabs.middle a:first-of-type:before ,
  #nnv.nnv .header__tabs-center a:first-of-type:before {
  position: absolute !important;
  	left: 0 !important;
  	content: "🔻 🔺" !important;
  }

  #nnv.nnv div#it, 
  #nnv.nnv div#iti ,
  #nnv.nnv .middle, 
  #nnv.nnv .results {
      max-width: 100% !important;
  }

  #nnv.nnv #formsearch #ili {
      color: transparent;
  }
  /* (new32) SUPERLOADER */
  .sp-separator ~ .header.header--results  .header__nav {
  	display: none !important;
  }




  /* (new19) RESULTS - BARRE INFOS - === */
  #nnv.nnv div#infoi {
      position: relative !important;
      min-width: 1855px !important; 
      min-height: 20px !important;
      max-height: 20px !important;
      line-height: 20px !important;
      margin-left: 2px !important;
      margin-top: 1px !important;
      font-size: 15px;
  }
  /* (new21) */
  #nnv > body > #infoi.panel.panel--results {
      position: sticky !important;
      display: inline-block !important;
      min-width: 100% !important;
      max-width: 100% !important;
      min-height: 0px !important;
      max-height: 20px !important;
      line-height: 20px !important;
  	top: 0vh !important;
      margin: 0 0 0 0 !important;
      padding: 0 0 0 0px  !important;
  	z-index: 5000 !important;
  background: brown!important; 
  } 
  /* (new15) A SUPP (???) - TXT " Do You Mean XXX ? " - === */
  #nnv > body > #infoi + div a{
  	color: white !important;
  }
  #nnv>body> #infoi + div a{
      color: white !important;
  }

  /* (new21) SEARCH - NO MODELS - PAGE - === */
  #nnv #infoi + .nomodel + #letters + div div[style="max-width:1200px;margin:auto"] {
  	margin: -30px 0px !important;
      max-width: 100% !important;
  }
  #models div.tmbs {
      float: left;
      width: 122px;
      height: 218px;
      line-height: 12px !important;
      margin: 3px 0 0 7px !important;
      padding: 2px !important;
      overflow: hidden;
  border: 1px solid gray !important;
  }
  #models div.tmbs div {
      margin-bottom: 3px;
      min-height: 162px;
      max-height: 162px;
  	width: 122px;
      overflow: hidden;
  }
  #models div.tmbs > a > div>img {
      height: 159px !important;
      width: 120px !important;
      object-fit: contain!important;
      object-position: center center !important;
  }
  /* (new21) */
  #models div.tmbs a {
      line-height: 10px !important;
      font-size: 12px !important;
  }

  #models div.tmbs p ,
  .tmbs.tiny > p {
      line-height: 10px !important;
      font-size: 10px !important;
  }
  /* (new9) PB - NUDEVISTA TAGS PAGE - === */
  #nnv>body > #infoi + div[style="margin:20px"] {
      position: relative !important;
      display: inline-block !important;
      min-width: 1908px !important;
      max-width: 1908px !important;
      margin-top: -9px !important;
      margin-bottom: -9px !important;
      margin-left: 0px  !important;
      margin-right: 0px  !important;
      padding: 0px !important;
      z-index: 500000 !important;
  color: gold !important;
  background: rgba(0, 0, 0, 0) !important;
  /* background: tan !important; */
  }
  #nnv>body> #infoi + div[style="margin:20px"] .results h3 {
      margin-top: -6px !important;
      text-align: center !important;
      background-color: #102f5e !important;
  }
  #nnv>body> #infoi + div[style="margin:20px"] a {
  color: peru !important;
  }
  /* (new29) */
  #nnv.nnv .results {
  	position: relative !important;
      display: inline-block !important;
      max-width: 100% !important;
  }
  #nnv.nnv .results .sct {
      width: 32% !important;
      float: left;
      margin-left: 15px !important;
  }
  #nnv>body > #infoi + div[style="margin:20px"] .results .sct>a {
      color: gold !important;
  }
  #nnv>body > #infoi + div[style="margin:20px"] .results .sct div {
      padding: 5px !important;
      background: #333  !important;
  }


  /* === */

  #nnv > body > #infoi + div[style="max-width: 1400px; margin: 14px auto -7px;"] {
  display: inline-block !important;
      margin: 14px auto -7px !important;
      max-width: 1400px;
  }
  /* (new20) */
  #nnv.nnv .panel--results a:hover ,
  #nnv>body>#infoi + div[style="max-width: 1400px; margin: 14px auto -7px;"] a:hover {
      color: tomato !important;
  }
  #nnv.nnv div#infoi .panel__content.panel__content--short:not(:empty) {
      min-height: 0px !important;
      padding: 0 !important;
      border: 0 none;
      text-align: center !important;
  /* background: red !important; */
  }
  #nnv.nnv div#infoi .panel__content.panel__content--short:empty {
      max-height: 0 !important;
  }
  /* (new21) */
  #nnv.nnv div#infoi  + .panel.panel--results {
      position: relative !important;
      display: inline-block !important;
      vertical-align: top !important;
  	width: 100% !important;
  	min-width: 100% !important;
  	max-width: 100% !important;
      min-height: 20px !important;
      max-height: 20px !important;
      margin-bottom: 0 !important;
      margin-top: 0 !important;
      padding: 0 0 0 0px !important;
  background: #222 !important;
  }
  #nnv.nnv div#infoi +.panel.panel--results .relrel {
      position: relative !important;
      display: inline-block !important;
      vertical-align: top !important;
      width: auto !important;
      min-height: 17px !important;
      max-height: 17px !important;
      margin-top: 0px ;
  	padding: 0 2px !important;
  border-radius: 3px !important;
  background: #111 !important;
  }
  #nnv.nnv div#infoi +.panel.panel--results .relrel:nth-child(2)  {
      margin-left: 130px ;
  background: #222 !important;
  }

  #nnv.nnv div#infoi + .panel.panel--results .panel__content.panel__content--short {
      margin-top: 0px ;
      padding-top: 0 ;
  }
  #nnv.nnv div#infoi + .panel.panel--results .panel__content.panel__content--short .relcat .t {
      position: relative !important;
      margin-top: 0px !important;
      top: 0px !important;
      margin-bottom: 0px !important;
      padding: 0 !important;
  /* border: 1px solid violet !important; */
  }

  #nnv.nnv div#infoi .panel__content.panel__content--short > div:first-of-type {
      height: 25px ;
      line-height: 29px ;
      margin-bottom: -20px !important;
      margin-right: 180px;
      margin-top: -6px !important;
      padding-bottom: 0 !important;
  	font-size: 16px;
  border-bottom: 1px solid #aaaaaa;
  }
  #nnv.nnv div#infoi  +.panel.panel--results .panel__content.panel__content--short .relcat {
      position: relative !important;
      margin-top: 0px !important;
      margin-bottom: 0px !important;
      padding: 0 !important;
  }
  .nowrap>strong ,
  .panel__content.panel__content--short>strong:first-of-type {
      color: gold !important;
  }
  .panel__content.panel__content--short>strong:last-of-type ,
  #nnv.nnv div#infoi  +.panel.panel--results .relrel > a {
      color: tomato !important;
  }
  .nowrap > a:hover ,
  #nnv.nnv div#infoi  +.panel.panel--results .relrel > a:hover {
      color: gold !important;
  }
  #nnv.nnv div#infoi  +.panel.panel--results .relrel > a:visited {
      color: tan !important;
  }

  /* (new15) RESULTS for "MORE THUMBNAILS" - PREF - ALL - ADAPTATION for GM "SUPER_PRELOADER PLUS - === */
  #results_1 {
      max-width: 100% !important;
      min-width: 100% !important;
      margin-bottom: -215px !important;
  }
  /* (new27) RESULTS for PORNSTAR MODEL PAGE - === */
  #mblock + #results_1 {
  	position: relative !important;
  	display: inline-block !important;
  	width: 100% !important;
  	min-width: 99% !important;
  	max-width: 99% !important;
      margin-top: 0px !important;
  border: 1px solid red !important;
  }

  /* (new4) MODELS - FAVORITES PAGES - 
  http://my.nudevista.com/favorites/?models
  === */
  #models {
      max-width: 100% !important;
  }

  /* (new4) MODELS - GENERAL PAGE - 
  http://www.nudevista.com/models/
  === */
  html > body > div[style="margin:20px 0px 0px 0px"] > div {
      max-width: 100% !important;
  }
  /* (new27) COR FLOAT - */
  div[style="margin:20px 0px 0px 0px"] #models > h3:first-of-type + div:not([style="height:320px;overflow:hidden;position:relative;clear:bloth"]) {
      display: block !important;
      float: left !important;
      clear: none !important;
      height: 100% !important;
      min-height: 650px !important;
      max-height: 650px !important;
      max-width: 790px !important;
      padding: 3px 3px 0 3px !important;
  background: #222 !important;
  }
  /*(new31) BIG THUMB */
  div[style="margin:20px 0px 0px 0px"] #models > h3:first-of-type + div:not([style="height:320px;overflow:hidden;position:relative;clear:bloth"]) .tmb {
      float: left;
      height: 300px;
      width: 175px !important;
      margin: 5px 0 0 10px;
  	padding: 5px !important;
      overflow: hidden;
  	border-radius: 5px !important;
  border: 1px solid gray !important;
  }
  div[style="margin:20px 0px 0px 0px"] #models>h3:first-of-type +div:not([style="height:320px;overflow:hidden;position:relative;clear:bloth"]) .tmb >a img {
      height: 238px !important;
      width: auto !important;
  	max-width: 177px !important;
  /* border: 1px solid red !important; */
  }
  div[style="margin:20px 0px 0px 0px"] #models>h3:first-of-type +div:not([style="height:320px;overflow:hidden;position:relative;clear:bloth"]) .tmb >p {
  	min-width: 177px !important;
  	max-width: 177px !important;
      font-size: 10px !important;
  }

  #models > h3:first-of-type + div[style="height:320px;overflow:hidden;position:relative;clear:bloth"] {
      display: inline-block !important;
      min-height: 200px !important;
      max-height: 200px !important;
      min-width: 100% !important;
      max-width: 100% !important;
  background: #222 !important;
  }
  #models > h3:first-of-type + div[style="height:320px;overflow:hidden;position:relative;clear:bloth"] div.tmb {
      float: left;
      height: 195px !important;
      width: 182px;
      margin: 0px 0 0 15px !important;
      overflow: hidden;
  border-radius: 5px !important;
  border: 1px solid gray !important;
  }
  #models > h3:first-of-type + div[style="height:320px;overflow:hidden;position:relative;clear:bloth"] div.tmb a div {
      margin-bottom: 3px;
      min-height: 140px !important;
      max-height: 140px !important;
  	line-height: 10px !important;
      overflow: hidden;
      width: 182px;
  font-size: 12px !important;
  }
  #models > h3:first-of-type + div[style="height:320px;overflow:hidden;position:relative;clear:bloth"] div.tmb a div img {
      min-height: 140px !important;
      max-height: 140px !important;
      width: 180px;
  	object-fit: contain !important;
  	object-position: center center !important;
  border: none !important;
  }
  #models > h3:first-of-type + div[style="height:320px;overflow:hidden;position:relative;clear:bloth"] div.tmb >p{
  	line-height: 12px !important;
      width: 182px;
  	font-size: 12px !important;
  }
  /* (new27) COR FLOAT - */
  #models > div > table > tbody > tr > td {
      position: relative !important;
      display: block !important;
      float: right !important;
      clear: none !important;
      height: 100% !important;
      min-height: 580px !important;
      max-height: 580px !important;
      max-width: 50% !important;
      margin-top: -400px !important;
      margin-right: 35px !important;
      margin-bottom: -180px !important;
      top: -200px !important;
      padding: 3px 5px 0 5px !important;
  background: #222 !important;
  /* background: red !important; */
  }
  #models > div > table > tbody > tr > td > div {
      height: 553px !important;
      padding: 12px;
  /* background-color: green !important; */
  }

  #models > div > table > tbody > tr > td:first-of-type {
      min-width: 534px !important;
  }
   
  /* (new27) MODELS - NEW/TOP - 
  http://www.nudevista.com/models/new/
  http://www.nudevista.com/models/top/
  === */
  .middle + #letters + div[style="margin:20px 0px"] > div,
  .middle + #letters + div[style="margin:20px 0px"] {
      margin: auto;
      max-width: 100% !important;
  }

  .middle + #letters ~[style="margin:20px 0px 0px 0px"]{
      margin: auto;
  	min-width: 100% !important;
      max-width: 100% !important;
  /*border: 1px solid aqua !important;*/
  }
  .middle + #letters ~[style="margin:20px 0px 0px 0px"] #models [style="margin:20px 0px 0px 18px"]{
  	position: absolute !important;
  	display: inline-block !important;
  	float: none !important;
  	min-width: 50% !important;
      max-width: 50% !important;
  	right: 0 !important;
  	top: 87vh !important;
  	margin: 0 !important;
  	padding: 0 !important;
  /*border: 1px solid yellow !important;*/
  }

  /* (new4) FAVORITE - MY FAVORITES MODELS - 
  http://my.nudevista.com/favorites/?models
  === */
  .middle + div[style="max-width:1200px;margin:auto"] {
      min-width: 100% !important;
  }
  /* (new9) PB - FAVORITE - ORGANIZE - === */
  #results_1.results #listing table .deleted {
      opacity: 0.7 !important;
  }

  /* (new19) === BLAK THEM ==== */
  body {
  	display: inline-block !important;
  	width: 100% !important;
  	margin: 0 !important;
      padding: 0px !important;
      font-family: verdana;
      font-size: 100%;
  color: #ccc !important;
  background: black !important;
  }
  div#infoi {
      min-height: 15px;
      padding: 10px;
  background-color: #102f5e !important;
  }

  #change_language {
      position: absolute;
      width: 242px;
      line-height: 16px;
      left: 1261px;
      top: 20px;
      padding: 15px 5px 5px;
      font-size: 13px;
  	z-index: 111;
      background-image: url("http://x99.nudevista.com/_/message.png");
      background-position: center top;
      background-repeat: no-repeat;
  color: gray!important;
  background-color: black !important;
  border-bottom: 1px solid #003c74;
  }

  /* (new19) WIDESCREEN */

  #results_1 #infoi ~ .middle + #letters + div > div > #models ,
  #results_1 #infoi ~ .middle + #letters + div > div ,
  #results_1 #infoi ~ .middle + #letters + div ,
  #results_1 #infoi ~ .middle + #letters ,
  #results_1 .results, 
  #results_1 .middle ,
  #results_1 #listing {
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
  }

  /* RUSSE */
  #results.results #listing  table {
      height: 1020px !important;
  }



  /* (new11) PB - ORGANIZE BUTTON */
  #infoi .middle > div:last-of-type {
      float: right;
      width: 175px !important;
      margin-left: 0;
      margin-right: -60px !important;
      margin-top: -71px !important;
      transform: rotate(90deg) !important;
  /* background-color: #102f5e !important; */
  }

  #ffm > div:first-of-type {
      margin-top: -3px !important;
      text-align: right;
  }
  #ffm > div:only-of-type {
      margin-top: -78px !important;
  	margin-left: -125px !important;
      text-align: right;
  }

  #ffm #fo {
      -moz-appearance: none !important;
      font-size: 14px;
      padding: 0 0px !important;
      border-radius: 5px 0 0 0 !important;
  color: white !important;
  background-color: #102f5e !important;
  }
  sup  {
      color: red;
      display: none;
  }

  /* (new21) FAVORIS/SERACH - ROWS - === */
  #results_1 #listing > table > tbody>tr {
      display: inline-block !important;
      position: relative !important;
      height: 100% !important;
      min-height: 245px !important;
      max-height: 245px !important;
      min-width: 940px !important;
      max-width: 940px !important;
      margin-right: 7px !important;
      margin-bottom: 7px !important;
  /* border: 1px solid red !important; */
  }

  /* (new11) ORGANIZE FAVS - HELP - === */
  #ffm > div > a:before {
  content: "To select a Video to move in a Folder: Click on its thumbnail (not the row)" ;
      display: inline-block ;
      width: 100% ;
      text-align: center ;
  color: gold ;
  background: black ;
  }

  /* (new17) - RELATED MODELS TAB - At the END of RESULTS - PB at the BEGINING (with GM NEXTO) - === */
  form + #models{
      position: relative !important;
      display: inline-block !important;
      width: 100% !important;
      max-width: 1897px !important;
      min-width: 1897px !important;
      height: 300px !important;
  	margin: auto !important;
  background-color: #d4e6fe;
  }

  /* (new3) FAVORITES / SEARCH PAGES - === */
   
  #results_1.results td[rowspan="100%"]{
      position: absolute !important;
      display: inline-block !important;
      float: none !important;
      vertical-align: top;
      height: 64px !important;
      line-height: 22px;
      width: 850px !important;
      top: 27px !important;
      right: 210px !important;
      padding: 5px !important;
      font-size: 14px;
  color: #BAB3B3 !important;
  background-color: #102f5e !important;
  border: 1px solid gray !important;
  }

  .fnf > br ,
  #listing>table>tbody>tr>td>br {
      display: none !important;
  }

  /* (new9) TEST - RESULTS - ZEBRA - ==== */
  #results_1 #listing > table > tbody > tr td {
  /*     border: 1px solid yellow !important; */
      background: #111 !important;
  }
  #results_1 #listing > table > tbody > tr:nth-child(3n+2) td {
  /*     border: 1px solid red !important; */
      background: #363636 !important;
  }
  #results_1 #listing > table > tbody > tr:nth-child(3n+3) td {
  /*     border: 1px solid pink !important; */
      background: #212020 !important;
  }

  /* (new23) ENGLISH - MY PREF  - NOT FAVORITES PAGES  - :not([colspan="5"])
  https://www.nudevista.com/?q=emma+exotic
  */
  #results_1.results td ,
  #results_1.results tr td[itemprop="subjectOf"]:not([rowspan="100%"]){
      display: inline-block !important;
      vertical-align: top;
      height: 100% !important;
      min-height: 235px !important;
      max-height: 235px !important;
  	width: 100% !important;
      min-width: 937px!important;
      max-width: 937px !important;
      padding: 5px 0 !important;
      font-size: 14px;
  /* backgound: red !important; */
  /* border: 1px solid yellow !important; */
  border: 1px solid gray !important;
  }


  /* ACTOR PAGES*/
  #mblock + #results_1 #listing > table > tbody > tr:first-of-type {
      position: relative;
      display: inline-block;
      height: 100% !important;
      min-height: 251px !important;
      max-height: 251px !important;
      margin-bottom: 7px;
      margin-right: 7px;
      max-width: 940px !important;
      min-width: 940px !important;
  /* border: 1px solid violet !important; */
  }
  #mblock + #results_1.results tr:first-of-type td[itemprop="subjectOf"]:not([rowspan="100%"]) {
      display: inline-block !important;
      vertical-align: top !important;
      height: 100% !important;
      min-height: 239px !important;
      max-height: 239px !important;
      width: 100% !important;
      max-width: 937px !important;
      min-width: 937px !important;
      padding: 5px 0 !important;
      font-size: 14px;
  /* border: 1px solid violet; */
  }


  /* (new27) SEARCH RESULTS - FORM - OTHER LUNGAGE */
  html > body > form {
  	position: absolute !important;
  	display: inline-block !important;
  	height: 0px !important;
  	width: 100% !important;
  	top: 0px !important;
  }

  /* (new32) SEARCH RESULTS - PAGINATION */
  form:first-of-type .pages:not(:empty){
  	position: fixed !important;
      float: none !important;
      width: 30% !important;
      height: 2vh !important;
  	top: 0 !important;
  	right: 205px !important;
      margin: 0px 0 0 0 !important;
      padding: 0px !important;
  	text-align: right !important;
  	z-index: 50000 !important;
  border: 1px solid red !important;
  }



  form:first-of-type .pages:not(:empty) a , 
  form:first-of-type .pages:not(:empty) strong {
  	position: relative !important;
  	display: inline-block !important;
      height: 1.5vh !important;
  	line-height: 1.5vh !important;
      margin: 0px 3px 0 0 !important;
  	top: -6px !important;
  	padding: 0px 10px;
  	font-size: 15px  !important;
  color: #000;
  background: #f5f5f5;
  border: 1px solid #ccc;
  }


  /*/(new29) SUPERLOADER */
  #nnv > body > #infoi + .panel.panel--results ~.sp-separator ~ .panel.panel--results ,
  #nnv > body > #infoi + .panel.panel--results ~.sp-separator ~ .panel.panel--results ,
  .sp-separator ~ .panel.panel--results ,
  .sp-separator ~ header.header.header--results ,
  .sp-separator ~ form .pages:not(:empty) ,
  .sp-separator ~ #results_1 td small ,
  .pages:empty {
     display: none !important;
  }



  /* (new27) COR FLOAT - */
  html > body > table {
      display: block !important;
      float: left !important;
  	width: 99.4% !important;
      margin: 15px auto 0;
  }

  /* PREFRENCES PAGE  */
  .preferences > table tbody ,
  .preferences > table  {
      min-width: 99.4% !important;
      max-width: 99.4% !important;
  }
  .preferences > table > tbody > tr:last-of-type {
      display: inline-block !important;
      min-width: 500px !important;
      max-width: 500px !important;
      margin-top: -40px !important;
  }

  /* (new19) TUBE/ SITES REFRERENCES */
  /* TUBE
  background: rgba(0, 0, 0, 0) url("http://x99.nudevista.com/_/tube_black.gif") no-repeat scroll 2px 5px; */
  .results td small i.site ,
  .results td small i.tube {
      position: absolute !important;
      display: inline-block !important;
      min-width: 115px !important;
      max-width: 115px !important;
      height: 18px !important;
      line-height: 15px !important;
      margin-top: 0px !important;
      bottom: 2px !important;
      right: -5px !important;
      margin-left: 740px !important;
      padding : 2px 5px 2px 12px !important;
      text-align: center !important;
      border-radius: 3px !important;
      font-size: 15px !important;
      overflow: hidden !important;
      text-overflow: ellipsis;
  	filter: none  !important;
  color: transparent !important;
  background-color: #111 !important;
  }
  /* (new33) TUBE - ICON  */
  .results td small i.tube {
  	background: #111 !important;
  }
  .results td small i.tube meta + a {
  	display: inline-block !important;
  	float: none !important;
  	clear: both  !important;
  	height: 18px !important;
      line-height: 15px !important;
  	width: 100% !important;
      min-width: 80px !important;
      max-width: 80px !important;
  	padding : 0px 0px 0px 0px !important;
  	text-align: left !important;
  	overflow: hidden !important;
      text-overflow: ellipsis !important;
  }
  .results td small i.tube:before {
  	content: "📺" !important;
  	position: absolute !important;
      display: inline-block !important;
  	width: 20px !important;
  	height: 19px !important;
  	margin: 0 0 0 -20px !important;
      line-height: 15px !important;
  	font-size: 15px !important;
  color: red !important;
  background: #111 !important;
  }
  /* SITE
  background: rgba(0, 0, 0, 0) url("http://x99.nudevista.com/_/site_black.gif") no-repeat scroll 2px 5px; */
  .results td small i.site {
      position: absolute !important;
      min-width: 100px !important;
      height: 19px !important;
      line-height: 19px !important;
      margin-top: -19px !important;
      margin-left: 740px !important;
      padding : 2px 5px 5px 22px !important;
      font-size: 19px !important;
      text-align: center !important;
      border-radius: 3px !important;
  color: transparent !important;
  background-color: green !important;
  }
  /* (new22) */
  .results td small i.site > a{
      display: inline-block !important;
      min-width: 100px !important;
      height: 19px !important;
      line-height: 19px !important;
  	font-size: 15px !important;
  }


  .results td small i.model {
      position: absolute !important;
      min-width: 135px !important;
      max-width: 135px !important;
      height: 19px !important;
      line-height: 19px !important;
      margin-top: 2px !important;
      padding : 2px !important;
      font-size: 15px !important;
      text-align: center !important;
      border-radius: 3px !important;
      white-space: nowrap !important;
      overflow: hidden !important;
  color: transparent !important;
  background-color: #222 !important;
  /* background: rgba(0, 0, 0, 0) url("http://x99.nudevista.com/_/model_black.gif") no-repeat scroll 2px 5px ; */
  background-image: none !important;
  }
  .results td small i.model a {
      display: inline-block !important;
      min-width: 135px !important;
      max-width: 135px !important;
      text-align: center !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
  }

  .results td small i.model:first-of-type {
      margin-left: 662px !important;
  }
  .results td small i.model:nth-child(2) {
      margin-left: 520px !important;
  }
  .results td small i.model:nth-child(3) {
      margin-left: 377px !important;
  }
  .results td small i.model:nth-child(4) {
      margin-left: 234px !important;
  }
  .results td small i.model:nth-child(5) {
      margin-left: 91px !important;
  }
  .results td small i.model:nth-child(6) {
      min-width: 82px !important;
      max-width: 82px !important;
      margin-left: 3px !important;
      text-align: left !important;
  background: red !important;
  }
  .results td small i.model:nth-child(6):not(:hover) a {
      min-width: 75px !important;
      max-width: 75px !important;
      margin-left: 0px !important;
      text-align: center !important;
  }
  .results td small i.model:nth-child(6):hover {
      min-width: 167px !important;
      max-width: 167px !important;
      margin-left: -2px !important;
      transition: all ease 0.7s !important;
  background: red !important;
  }


  /* (new19) TAGS */
  #results_1 .tag ,
  #results_1 .tag[style="display:none"] {
      position: relative !important;
  	display: inline-block !important;
      width: 100% !important;
      max-width: 85px !important;
      height: 15px !important;
      line-height: 15px !important;
      margin-right: 3px !important;
      bottom: 18px !important;
      font-size: 0 !important;
      text-align: center !important;
      opacity: 0.8 !important;
  }
  #results_1 .tag:hover ,
  #results_1 .tag[style="display:none"]:hover {
      opacity: 1 !important;
  }

  #results_1 .tag a ,
  #results_1 .tag[style="display:none"] a {
      display: inline-block !important;
      width: 100% !important;
      max-width: 85px !important;
      line-height: 14px !important;
      font-size: 14px !important;
      font-size: 12px !important;
      text-align: center !important;
      opacity: 1 !important;
  background-color: #222 !important;
  /* background: red !important; */
  }
  #results_1 .tube + .tag ,
  #results_1 .site + .tag {
  position: relative !important;
  	display: inline-block !important;
      margin-right: 28px !important;
      opacity: 1 !important;
  /* background: yellow !important; */
  }
  #results_1 .tube + .tag a ,
  #results_1 .site + .tag a {
      display: inline-block !important;
      height: 14px !important;
      line-height: 10px !important;
      opacity: 1 !important;
  /* background: yellow !important; */
  }
  #results_1 .tube + .tag a:after ,
  #results_1 .site + .tag a:after {
      content: "+" !important;
      position: absolute !important;
      display: inline-block !important;
      width: 100% !important;
      max-width: 28px !important;
      min-width: 28px !important;
      padding-right: 428px !important;
      height: 14px !important;
      line-height: 11px !important;
      float: none !important;
      font-size: 15px !important;
      font-style: normal;
      left: 78px !important;
      opacity: 1 !important;
  /* background: red !important; */
  }
  #results_1 .tube + .tag a:hover ,
  #results_1 .site + .tag a:hover {
      opacity: 1 !important;
  background: blue !important;
  }


  /* (new19) DATE */

  .results td small i.date ,
  #results_1 .tag + .date {
      position: absolute !important;
      display: inline-block !important;
      height: 18px !important;
      line-height: 12px !important;
      width: 142px !important;
  	top: -135px!important;
  	right: -72px !important;
      padding: 0 5px !important;
      font-size: 15px !important;
      font-style: normal;
      text-align: center !important;
      transform: rotate(90deg) !important;
  color: #E8E8E8 !important;
  background: blue !important;
  }



  /* (new8) THUMBNAIL IMAGE */
  #results_1 .name img  {
      display: inline-block !important;
      width: 100% !important;
  	min-width: 220px !important;
  	max-width: 220px !important;
      min-height: 160px !important;
      max-height: 160px !important;
      margin-right: 4px !important;
  	object-fit: contain !important;
  }
  /* (new25) THUMBNAIL IMAGE - ONE ONLY - LEFT SIDE To CENTER */
  #results_1 tr:nth-child(odd) .name img:only-of-type {
      display: inline-block !important;
      width: 100% !important;
  	min-width: 99.8% !important;
  	max-width: 99.8% !important;
      min-height: 160px !important;
      max-height: 160px !important;
      margin-right: 4px !important;
  	object-fit: contain !important;
  	object-position: 100% 0 !important;
  }

  #results_1 #models div.tmb {
      float: left;
      width: 182px !important;
      height: 160px !important;
      margin: 20px 0 0 15px;
      padding: 3px !important;
      overflow: hidden;
  border: 1px solid gray !important;
  }
  #results_1 #models div.tmb a {
      max-height: 144px !important;
      width: auto !important;
      font-size: 16px;
      white-space: nowrap;
      text-align: center!important;
  }
  #results_1 #models div.tmb div {
  	width: 182px;
  	max-height: 144px;
      margin-bottom: 3px;
      overflow: hidden;
  }
  #results_1 #models div.tmb div img {
      display: inline-block !important;
      height: auto !important;
      max-width: 71px !important;
  border: 1px solid gray;
  }
  /* MODELS - TOP */
  #results_1 #models div.tmb div i {
      margin-left: -53px !important;
      position: absolute;
      height: 20px;
      padding: 3px;
      opacity: 0.6;
      font-size: 18px;
      font-style: normal;
      font-weight: bold;
      text-decoration: none;
  color: white;
  background-color: #004;
  }


  /* TXT */
  td b ,
  table.asearch td {
  	border-top: 1px solid gray !important;
      color: #808080 !important;
  }

  /* LINKS */
  a {
      text-decoration: none !important;
      color: peru !important;
  }
  a:visited {
      color: tomato !important;
  }

  /* (new4) DIRECTORY / TAGS PAGES - 
  http://www.nudevista.com/directory/
  === */
  .results .sct a {
      margin: 5px 0 2px;
  	font-weight: bold;
  color: #9C7C5D !important;
  }
  .results .sct div a {
      display: inline-block !important;
      margin: 2px 0px 4px 0px !important;
      padding: 1px 5px !important;
      border-radius: 3px !important;
      font-weight: normal;
  color: #808080 !important;
  background: #222 !important;
  }

  /* (new19) VOIR #results_1 */
  .name>br ,
  .add {
      display: none !important;
  }
  /* (new19) THUMBNAIL CONTAINER */
  #results_1 .name {
      display: inline-block !important;
      width: auto !important;
      width: 100% !important;
      margin-right: 0px !important;
  }
  /* (new24) */
  #listing a.name  ,
  #results_1 #listing a.name {
      display: inline-block !important;
      min-height: 160px !important;
      padding: 0px  0px 3px 0px !important;
      text-decoration: none !important;
  	pointer-events: none  !important;
  color: gray !important;
  border-bottom: 1px dashed black !important;
  }
  /* (new22) CHROME - GALLERY */
  #listing a.name[href^="https://video.nudevista.com/gallery/"]  ,
  #results_1 #listing a.name[href^="https://video.nudevista.com/gallery/"] {
      display: inline-block !important;
      min-height: 165px !important;
      max-height: 165px !important;
  	max-width: 930px !important;
      padding: 0px  0px 3px 0px !important;
      text-decoration: none !important;
  	overflow: hidden !important;
  	overflow-y: auto !important;
  color: gray !important;
  /* border-bottom: 1px dashed red !important; */
  border-left: 2px dashed red !important;
  }
  #listing a.name[href^="https://video.nudevista.com/gallery/"] img ,
  #results_1 #listing a.name[href^="https://video.nudevista.com/gallery/"] img {
      display: inline-block !important;
      min-height: 160px !important;
      max-height: 160px !important;
      text-decoration: none !important;
  	overflow: hidden !important;
  color: gray !important;
  /* border-bottom: 1px dashed red !important; */
  /* border: 1px dashed aqua !important; */
  }

  /* (new19) DURATION / NBR IMAGES */
  .name > i ,
  .name > i[itemprop="duration"]{
      position: absolute !important;
      display: inline-block !important;
      height: 15px !important;
      line-height: 10px !important;
      top: 30px !important;
      left: 4px !important;
      padding: 0 3px !important;
      opacity: 0.7 !important;
  color: gold !important;
  background: red !important;
  }

  .name[href*="xhamster"] ,
  #results_1 .name[href*="xhamster"] {
      display: inline-block !important;
      min-height: 170px !important;
      padding: 0px  0px 3px 0px !important;
      text-decoration: none !important;
  color: gray !important;
  background: rgba(255, 0, 0, 0.45) !important;
  }
  #listing a:visited.name ,
  #results_1 #listing a:visited.name {
  	text-decoration: none !important;
  color: tomato !important;
  border-bottom: 1px dashed red !important;
  }

  /* (new19) TITLE */
  #results_1.results #listing.listing .block {
  	position: relative !important;
      display: inline-block;
      width: 100% !important;
  	width: 940px !important;
  	left: 0 !important;
      margin-bottom: 15px !important;
      font-size: 14px !important;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
  }


  /* (new27) TAGS + INFOS CONTAINER */
  td small:not([style="display: none;"]) ,
  #results_1 td small:not([style="display: none;"]) {
  	position: relative !important;
  	display: inline-block !important;
      width: 100% !important;
      height: 27px;
      line-height: 18px;
  	bottom: 0 !important;
  	left: 0 !important;
      font-size: 0px !important;
      overflow: visible !important;
  background: #004 !important;
  }
  td small[style="display: none;"],
  #results_1 td small[style="display: none;"] {
  	position: relative !important;
  	display: inline-block !important;
      width: 100% !important;
      height: 27px;
      line-height: 18px;
  	bottom: 0 !important;
  	left: 0 !important;
      font-size: 0px !important;
      overflow: visible !important;
  background: #004 !important;
  }

  /* (new28) TAGS + INFOS CONTAINER - HOVER TITLE LINK */
  td small[style="display: none;"] + p#info ,
  #results_1 td small[style="display: none;"] + p#info  {
  	width: 10% !important;
  	margin: -5vh 0 0 0 !important;
  background: brown!important;
  }

  /* (new15) MODEL PAGE INFOS - TEST Scanline BACKGROUND ANIMATION - 
  http://blog.adrianroselli.com/2012/10/chromatic-type-with-pseudo-elements.html    
  === */
  @keyframes scanline {
  0% {
      background-position: 0 -3.3em;
  }
  20% {
      background-position: 0 10.7em;
  }
  50% {
      background-position: 0 15.7em;
  }
  70% {
      background-position: 0 18.7em;
  }
  100% {
      background-position: 0 20.7em;
  }
  }
  /* (COR) */
  #mblock {
      max-width: 100% !important;
      padding: 5px !important;
      animation: 12s linear 3s normal none infinite running scanline !important;
      background-image: linear-gradient(to bottom, rgba(255, 176, 0, 0) 0px, rgba(255, 176, 0, 0) 1em, rgba(255, 176, 0, 0.05) 3em, rgba(255, 176, 0, 0.15) 3.1em, rgba(255, 176, 0, 0.01) 3.11em, rgba(255, 176, 0, 0.05) 3.2em, rgba(255, 176, 0, 0) 3.3em, rgba(255, 176, 0, 0) 10em) !important;
  /*    background-size: contain !important;*/
      background-color: #333 !important;
  /*    background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.15) 0.5em, rgba(255, 255, 255, 0.05) 2em, rgba(255, 255, 255, 0.05) 2em, rgba(255, 255, 255, 0)), linear-gradient(to bottom, #222, #222 50%, #000 50%, #000);*/
      background-size: 100% 100%, 100% 4px !important;
  }

  #mblock h2 {
      color: gold !important;
  }
  #params_scroll {
      color: tomato !important;
  }
  #mblock #top3 ,
  #mblock #top4 ,
  #nnv.nnv .relcat li.t , 
  #nnv.nnv .reldir li.t ,
  #params_scroll em {
      color: white !important;
  }
      
      
  #mblock_in {
      max-width: 100% !important;
  }
  #mblock_in > table {
      max-width: 100% !important;
  }
  #mblock_in > table > tbody > tr > td[align="center"] + td {
      width: 760px !important;
  }
  #profiles_scroll{
  display: inline-block !important;
      width: 760px !important;
  	height: 45vh !important;
  border-bottom: 1px solid red !important;
  border-left: 4px solid red !important;
  border-right: 4px solid red !important;

  }
  /* (new27) */
  #mblock .pthumb {
      float: left !important;
      width: 148px !important;
      height: 192px !important;
      margin: 0 3px 8px 0px;
  outline: 1px solid red !important;
  }
  /* (new27) */
  #mblock .pthumb img {
  	width: 99% !important;
      height: 80% !important;
      margin: 0px;
  	object-fit: contain !important;
  outline: none !important;
  border-bottom: 1px solid red !important;
  }

  #params_scroll {
      clear: left;
      width: 493px !important;
      height: 373px !important;
      margin-left: 10px;
      padding: 5px 5px 0 5px !important;
      overflow: auto;
  outline: 1px solid gray !important;
  }

  #mblock #top1 {
      width: 170px !important;
      padding: 5px !important;
      margin: auto;
      text-align: center !important;
      overflow: hidden;
  }
  #mblock_in > table > tbody > tr + tr > td + td {
      width: 170px !important;
      padding: 5px !important;
      margin: auto;
      text-align: center !important;
      overflow: hidden;
  }

  #top2 {
      width: 170px !important;
      line-height: 19px;
      margin-top: 7px;
      padding: 0 0 24px 0  !important;
      font-size: 14px;
      text-align: center !important;
      opacity: 0.8;
  border: 1px dotted gray;
  }
  #top4 {
      width: 170px !important;
      line-height: 19px;
      margin-top: 5px !important;
      padding: 0 !important;
      font-size: 14px;
      text-align: center !important;
      opacity: 0.8;
  border: 1px dotted gray;
  }
  /* (new27) COR FLOAT - */
  #top2 > span > a  {
      display: block;
      float: left !important;
      width: 168px !important;
  background-color: #004 !important;
  }
  #show_trends {
      display: inline-block;
      width: 170px !important;
  background-color: #004 !important;
  }
  #top4>b {
      display: inline-block;
      width: 170px !important;
  color: white !important;
  background-color: #004 !important;
  }


  /*(new5) MODEL PAGE - TOP PANEL - RIGHT SIDE - OTHERS MODEL LINKS - === */
  .mlinks {
      display: inline-block !important;
      width: 163px !important;
      height: auto !important;
      line-height: 12px !important;
      margin-left: 0px !important;
      margin-top: 0px !important;
      margin-bottom: 4px !important;
      padding: 4px !important;
      border-radius: 3px !important;
  border: 1px solid gray !important;
  }

  /* (new24) RELATED STAR */
  #mblock .relcat.mfriends  {
      user-select: all !important;
  }



  /* (new4) RESULTS for MORE INFOS -  PREF - ALL - === */
  #results_2 #listing table tbody ,
  #results_2 #listing table ,
  #results_2 #listing ,
  #results_2 {
      max-width: 98% !important;
      min-width:98% !important;
  }
  #results_2 #listing table tbody tr {
      display: inline-block !important;
      width: 590px !important;
      height: 210px !important;
      margin-right: 5px !important;
      margin-bottom: 5px !important;
      padding-top: 20px !important;
  background: blue !important;
  }

  #results_2 .text>a {
  position: relative !important;
      display: inline-block !important;
      width: 570px !important;
      height: 15px !important;
      margin-left: -249px !important;
      top: -25px !important;
      padding: 1px 5px !important;
      border: none !important;
  background: black !important;

  }
  #results_2 td b {
      display: inline-block !important;
      width: 570px !important;
      height: 15px !important;
      line-height: 13px !important;
      margin: auto !important;
      border-top: none !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
  }

  /* (new27) SUPERLOADER */
  .sp-separator ~ #results_1 {
  	position: relative !important;
  	display: inline-block !important;
  	width: 100% !important;
  	min-width: 97% !important;
  	max-width: 97% !important;
      margin-top: 0px !important;
  border: 1px solid red !important;
  }

  #results_1 .sp-separator ~ table tbody tr:first-of-type {
  	position: relative;
      display: inline-block;
      height: 100%;
  	max-height: 245px !important;
      max-width: 940px !important;
      min-height: 245px !important;
      min-width: 940px !important;
      margin-bottom: 7px;
      margin-right: 7px;
  }
  #results_1 .sp-separator ~ table tbody tr:first-of-type td[itemprop="subjectOf"]:not([rowspan="100%"]) {
      display: inline-block;
      vertical-align: top;
      height: 100%;
      min-height: 235px !important;
      max-height: 235px !important;
      min-width: 937px!important;
      max-width: 937px!important;
  	margin-top: 7px !important;
      padding: 5px 0 !important;
      font-size: 14px;
  border: 1px solid gray;
  }
  #results_1 .sp-separator ~ table tbody tr:first-of-type td[itemprop="subjectOf"]:not([rowspan="100%"]) .name{
  	position: absolute !important;
  	display: inline-block;
      min-height: 160px;
      left: 0 !important;
      padding: 0 0 3px;
  color: gray;
  border-bottom: 1px dashed black;
  }

  #results_1 .sp-separator ~ table tbody tr:first-of-type td[itemprop="subjectOf"]:not([rowspan="100%"]) .block {
  position: absolute !important;
      display: inline-block !important;
  	max-width: 935px !important;
      left: 0 !important;
      bottom: -168px !important;
      margin-bottom: 15px !important;
  	font-size: 14px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
  /* background: violet !important; */
  }
  /* (new27) */
  #results_1 .sp-separator ~ table tbody tr:first-of-type td[itemprop="subjectOf"]:not([rowspan="100%"]) .block + small {
       position: relative; 
      display: inline-block !important;
      width: 100% !important;
      height: 27px !important;
      line-height: 18px !important;
      left: 0px !important;
      top: 18vh !important;
      font-size: 0;
      overflow: visible;
      z-index: 1000;
  /*background: tan !important;*/
  }

  /* === COLOR  */
  /* ICON */

  .results td small i.tube {
      background: url(//i99.nudevista.com/_/tube.png) 0px 1px no-repeat;
  	filter: invert(1%) hue-rotate(49deg) brightness(102%) contrast(83%) !important;
  }
  /* ==== END  ==== */
  `;
}
if (location.href.startsWith("https://www.nudevista.com/?q=&s=p") || location.href.startsWith("https://www.nudevista.com/?q=*&s=p&start=") || location.href.startsWith("https://my.nudevista.com/favorites/") || location.href.startsWith("https://www.nudevista.com/?t=") || location.href.startsWith("https://www.nudevista.be/?t=") || location.href.startsWith("https://www.nudevista.at/?t=") || location.href.startsWith("https://www.nudevista.es/?t=") || location.href.startsWith("https://www.nudevista.it/?t=") || location.href.startsWith("https://www.nudevista.tw/?t=") || location.href.startsWith("https://www.nudevista.nl/?t=") || location.href.startsWith("https://www.nudevista.pl/?t=") || location.href.startsWith("https://www.nudevista.tv/?t=") || location.href.startsWith("https://www.nudevista.se/?t=") || location.href.startsWith("https://www.nudevista.com/?q=") || location.href.startsWith("https://www.nudevista.be/?q=") || location.href.startsWith("https://www.nudevista.at/?q=") || location.href.startsWith("https://www.nudevista.es/?q=") || location.href.startsWith("https://www.nudevista.it/?q=") || location.href.startsWith("https://www.nudevista.tw/?q=") || location.href.startsWith("https://www.nudevista.nl/?q=") || location.href.startsWith("https://www.nudevista.pl/?q=") || location.href.startsWith("https://www.nudevista.tv/?q=") || location.href.startsWith("https://www.nudevista.se/?q=") || location.href === "https://www.nudevista.com/") {
  css += `
  /*  NUDEVISTA HOME /FAV + SEARCH - ONE THUMBNAIL (new27) */

  .results #listing > table {
      padding: 0px !important;
  }
  #nnv.nnv body #results_1.results {
      display: inline-block !important;
      width: 100% !important;
      margin: 0 !important;
      padding: 0px !important;
      font-family: verdana;
      font-size: 100%;
  color: #ccc !important;
  background: black !important;
  }
  /* (new19) DURATION / NBR IMAGES */
  .name > i ,
  .name > i[itemprop="duration"]{
      position: absolute !important;
      display: inline-block !important;
      height: 15px !important;
      line-height: 10px !important;
      top: 33px !important;
      left: 4px !important;
      padding: 0 3px !important;
      opacity: 0.7 !important;
  color: gold !important;
  background: green !important;
  }
  #nnv.nnv div#infoi + .panel.panel--results .panel__content.panel__content--short .relcat {
      position: relative;
      display: inline-block !important;
      min-height: 20px !important;
      max-height: 20px !important;
      margin-bottom: -9px;
      margin-top: 0px !important;
      padding: 0;
  }
  #nnv.nnv div#infoi + .panel.panel--results.font-arial.middle .panel__content.panel__content--short .relcat .t {
      top: 0px !important;
  }

  /* (new27) SEARCH RESULTS - (ONLY ONE THUMBNAIL) - RESULTS CONTAINER -  #results.results*/
  #nnv.nnv #results.results #listing.listing {
  	position: relative;
      display: inline-block !important;
  	min-height: 100vh !important;
  	max-width: 100% !important;
      margin: 0 0 5vh 0 !important;
  /*background: green !important;*/
  /*border: 5px solid red  !important;*/
  }
  #nnv.nnv #results.results #listing.listing > table {
  	position: relative;
      display: inline-table !important;
  	min-height: 100vh !important;
  	max-width: 100% !important;
      margin: 0 0 0vh 0 !important;
  /*border: 5px solid red  !important;*/
  }

  /* (new27) SEARCH RESULTS - (ONLY ONE THUMBNAIL) -ROWS - EMPTY -  #results.results */
  #nnv.nnv #results.results #listing.listing > table tbody > tr:has([colspan="5"]) {
      display: none !important;
  }

  /* (new33) SEARCH RESULTS - (ONLY ONE THUMBNAIL) - ITEMS - OTHER LUNGAG -  #results.results */
  #nnv.nnv #results.results #listing.listing table tbody tr {
  display: inline-block !important;
  	width: 100%  !important;
  	min-width: 49%  !important;
  	max-width: 49%  !important;
      height: auto !important;
  	margin: 0 4px 4px 10px !important;
  /*border: 1px dashed red !important;*/
  }

  #nnv.nnv #results.results #listing.listing > table tbody > tr:not(:has([colspan="5"])) td:not([rowspan="100%"])[itemprop="subjectOf"] {
      display: block !important;
      float: left !important;
      height: 190px !important;
      height: 100% !important;
      min-height: 28vh !important;
      max-height: 28vh !important;
      min-width: 18.2% !important;
      max-width: 18%  !important;
  	margin: 0 4px 4px 0 !important;
      padding: 5px !important;
      font-size: 14px;
  	border-radius: 5px !important;
  /*background: gold !important;*/
  border: 1px solid gray !important;
  }
  /* (new33) */
  #nnv.nnv #results.results #listing.listing > table tbody > tr:not(:has([colspan="5"])) td:not([rowspan="100%"])[itemprop="subjectOf"] a.name[itemprop="url"] {
      display: inline-block !important;
      min-height: 165px !important;
      max-height: 165px !important;
      min-width: 100% !important;
  	max-width: 100% !important;
  	margin: 0 0px 0px -2px !important;
      padding: 0px 0px 0px 0px !important;
      text-decoration: none !important;
      overflow: hidden !important;
  color: gray !important;
  /* border-bottom: 1px dashed red !important; */
  /*border: 1px dashed red !important;*/
  }
  #nnv.nnv #results.results #listing.listing > table tbody > tr:not(:has([colspan="5"])) td:not([rowspan="100%"])[itemprop="subjectOf"] a.name[itemprop="url"] img {
      display: inline-block !important;
      min-height: 160px !important;
      max-height: 160px !important;
  	min-width: 99% !important;
  	max-width: 99% !important;
      text-decoration: none !important;
      overflow: hidden !important;
  	object-fit: contain !important;
  color: gray !important;
  /* border-bottom: 1px dashed red !important; */
  /*border: 1px dashed aqua !important;*/
  }

  #nnv.nnv #results.results #listing.listing table tbody tr td a.title{
  	position: absolute !important;
  	display: -webkit-box !important;
  	max-height: 4vh !important;
  	-webkit-box-orient: vertical;
  	-webkit-line-clamp: 2 !important;
  /*line-clamp: 4 !important;*/
  	height: auto !important;
      width: 170px !important;
  	white-space: pre-wrap !important;
  	line-height: 14px !important;
  	overflow: hidden;
  	text-overflow: ellipsis;
  	vertical-align: middle;
  /*border: 1px dashed aqua !important;*/
  }
  #nnv.nnv #results.results #listing.listing table tbody tr td a i {
  	position: relative !important;
  	display: inline-block !important;
  	float: none !important;
  	clear: both;
  	height: 1vh !important;
      margin: 0 0 0 0 !important;
  	top: -2vh!important;
      padding: 3px;
      text-decoration: none;
      font-weight: lighter !important;
      font-size: 11px !important;
      opacity: 0.6 !important;

  color: white !important;
  background: #0080005e !important;
  }

  #nnv.nnv #results.results #listing.listing table tbody tr td small[style="display: none;"] ,
  #nnv.nnv #results.results #listing.listing table tbody tr td small {
      position: relative !important;
      display: inline-block !important;
      width: 100% !important;
      height: 2vh !important;
      line-height: 2vh !important;
      bottom: -4.5vh!important;
      left: 0 !important;
      font-size: 0px !important;
      overflow: visible !important;
  /*background: green !important;*/
  }

  /* (new33) */
  #nnv.nnv #results.results #listing.listing table tbody tr td small[style="display: none;"] i.tube ,
  #nnv.nnv #results.results #listing.listing table tbody tr td small i.tube ,

  #nnv.nnv #results.results #listing.listing table tbody tr td small[style="display: none;"] i.site ,
  #nnv.nnv #results.results #listing.listing table tbody tr td small i.site {
      position: relative !important;
      min-width: 145px !important;
      height: 19px !important;
      line-height: 19px !important;
      margin: 0 0 0 0 !important;
  	left: 0 !important;
  	bottom: -2.5vh !important;
      padding: 2px 5px 5px 22px !important;
      font-size: 12px !important;
      text-align: center !important;
      border-radius: 3px !important;
  color: transparent !important;
  /*background-color: gold !important;*/
  }

  #nnv.nnv #results.results #listing.listing table tbody tr td small i.model:first-of-type {
      margin: 0 0 0 0px !important;
  }

  /* (new27) TAGS + INFOS CONTAINER - HOVER TITLE LINK  -  (ONLY ONE THUMBNAIL) - #results.results */
  #nnv.nnv #results.results #listing.listing table tbody tr td small[style="display: none;"] + p#info   {
  	width: 8.7% !important;
  	margin: -8vh 0 0vh 0 !important;
  background: #111111d6 !important;
  }


  /* SUPERLOADER */
  #nnv > body > .sp-separator ~ #infoi.panel.panel--results ,
  .sp-separator ~ .header.header--results{
      display: none !important;
  }


  /* ========== END URL - NUDEVISTA HOME + SEARCH STARTT  ======= */
  `;
}
if (location.href.startsWith("https://www.nudevista.net/") || location.href.startsWith("https://www.nudevista.be/") || location.href.startsWith("https://www.nudevista.at/") || location.href.startsWith("https://www.nudevista.es/") || location.href.startsWith("https://www.nudevista.it/") || location.href.startsWith("https://www.nudevista.tw/") || location.href.startsWith("https://www.nudevista.nl/") || location.href.startsWith("https://www.nudevista.pl/") || location.href.startsWith("https://www.nudevista.tv/") || location.href.startsWith("https://www.nudevista.se/") || location.href.startsWith("https://www.nudevista.net/?q") || location.href === "https://www.nudevista.com/") {
  css += `
  /* NUDVISTA HOME - NOT LOGGED (new31) ===
  LOGGED:
  #nnv.nnv:has(.top_navigation__link[href="//my.nudevista.com/logout/"])
  NOT LOGGED
  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"]))

  */

  /* (new31) HOME - NOT LOGGGED - RESULTS TAGS- #results.results */

  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results[itemprop="mainContentOfPage"] #listing.listing table {
      height: auto !important;
  }

  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results[itemprop="mainContentOfPage"] #listing.listing table tbody ,
  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results[itemprop="mainContentOfPage"] #listing.listing {
  display: inline-block !important;
      min-width: 100% !important;
  	max-width: 100% !important;
  /*background-color: red!important;*/
  }
  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results[itemprop="mainContentOfPage"] #listing.listing tbody {

      min-width: 100% !important;
  	max-width: 100% !important;
  	margin: 0 0 0 0 !important;
  /*background-color: blue !important;*/
  }
  /* (new33) :not(.ab_hide) */
  /*#nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results[itemprop="mainContentOfPage"] #listing.listing tr.ab_hide,*/
  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results[itemprop="mainContentOfPage"] #listing.listing tr.ab_hide{

  /*background-color: brown!important;*/
  /*border: 1px solid yellow !important;*/
  }

  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results[itemprop="mainContentOfPage"] #listing.listing tr {
  	display: inline-block !important;
  	width: 100% !important;
      min-width: 33% !important;
  	max-width: 33% !important;
  	min-height: 230px !important;
  	max-height: 230px !important;
  	margin: 0 0 0 0 !important;
  	overflow: hidden !important;
  /*background-color: brown!important;*/
  /*border: 1px solid yellow !important;*/
  }

  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results[itemprop="mainContentOfPage"] #listing.listing tr:has(em) + tr {
  	display: inline-block !important;
  	width: 100% !important;
      min-width: 33% !important;
  	max-width: 33% !important;
  	min-height: 230px !important;
  	max-height: 230px !important;
  	margin: 0 0 0 -6px !important;
  	overflow: hidden !important;
  /*background-color: brown!important;*/
  /*border: 1px solid yellow !important;*/
  }

  /* (new34) SUPP - SPONSORED / EMPTY */
  /*#nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results[itemprop="mainContentOfPage"] #listing.listing tr.ab_hide ,*/
  /*#nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results[itemprop="mainContentOfPage"] #listing.listing tr.ab_hide[style="display: revert;"],*/

  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results[itemprop="mainContentOfPage"] #listing.listing tr td .hd ,
  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results[itemprop="mainContentOfPage"] #listing.listing tr:has([style="border-top:3px dotted #ffeeee;;padding-bottom:5px"]) ,

  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results[itemprop="mainContentOfPage"] #listing.listing tr:has(em)  {
      display: none  !important;
  }


  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results[itemprop="mainContentOfPage"] #listing.listing tr td {
  	display: block !important;
  	float: left  !important;
      min-width: 120px !important;
  	max-width: 120px !important;
  	margin:  0 5px 0 0 !important;
      padding: 0;
      font-size: 14px;
  	overflow: hidden !important;
  }
  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results[itemprop="mainContentOfPage"] #listing.listing tr td a.name {
  	display: inline-block !important;
      min-width: 100% !important;
  	max-width: 100% !important;
  	margin:  0 0px 0 0 !important;
      padding: 0;
      font-size: 14px;
  	overflow: hidden !important;
  }
  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results[itemprop="mainContentOfPage"] #listing.listing tr td img.b, 
  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results[itemprop="mainContentOfPage"] #listing.listing tr td img.w, 
  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results[itemprop="mainContentOfPage"] #listing.listing tr td img {
      height: 168px;
      min-width: 100% !important;
  	max-width: 100% !important;
  	object-fit: contain !important;
  border: 1px solid gray;
  }
  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results[itemprop="mainContentOfPage"] #listing.listing tr td a.title {
      min-width: 100% !important;
  	max-width: 100% !important;
  }

  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) .results td small i.model {
      position: absolute !important;
      min-width: 100% !important;
  	max-width: 100% !important;
      height: 19px !important;
      line-height: 19px !important;
      margin-top: 2px !important;
      padding : 2px !important;
      font-size: 15px !important;
      text-align: center !important;
      border-radius: 3px !important;
      white-space: nowrap !important;
      overflow: hidden !important;
  color: transparent !important;
  background-color: #222 !important;
  /* background: rgba(0, 0, 0, 0) url("http://x99.nudevista.com/_/model_black.gif") no-repeat scroll 2px 5px ; */
  background-image: none !important;
  }


  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results[itemprop="mainContentOfPage"] #listing.listing tr td small i.site, 
  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results[itemprop="mainContentOfPage"] #listing.listing tr td small i.tube {
      position: absolute !important;
      display: inline-block !important;
      min-width: 100% !important;
  	max-width: 100% !important;
  	right: -25px !important;
  /*background-color: red !important;*/
  }


  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results[itemprop="mainContentOfPage"] #listing.listing tr td a.name i[itemprop="duration"] {
      position: static !important;
      display: block !important;
      height: 10px !important;
      line-height: 10px !important;
  	width: 30% !important;
      top: 0vh !important;
      left: unset !important;
  	margin: -2.5vh 0 0vh 0 !important;
      padding: 0px 3px !important;
  	font-size: 10px !important;
      opacity: 0.7 !important;
  color: gold !important;
  background: transparent !important;
  }
  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) .results td small i.date {
      position: absolute !important;
      display: inline-block !important;
      height: 15px !important;
      line-height: 15px !important;
      width: 82px !important;
      top: -135px !important;
      right: -42px !important;
      padding: 0 0px !important;
      font-size: 10px !important;
      font-style: normal;
      text-align: center !important;
      transform: rotate(90deg) !important;
      color: #E8E8E8 !important;
  background: #0000ff4d !important;
  }
  /*#nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) .results td small[style="display: none;"] {
      display: block !important;
  }*/
  /*#nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) .results td small[style="display: block;"] p:hover {
      display: inline-block !important;
      min-width: 100% !important;
  	max-width: 100% !important;
  	background-color: red !important;
  }*/
  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results #listing td:not(:hover) small i.tag {
      display: none !important;
  }

  #nnv.nnv:not(:has(.top_navigation__link[href="//my.nudevista.com/logout/"])) #results.results #listing td:not(:hover)  small i.tag a {
      display: none !important;
  }

  /* END - NUDVISTA HOME */
  `;
}
if (location.href.startsWith("https://my.nudevista.com/favorites/")) {
  css += `
  /* NUDVISTA FAvS */

  body #results_1 #listing > table > tbody > tr:first-of-type {
      position: relative;
      display: inline-block;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      height: 100%;
      min-height: 245px;
      max-height: 245px;
      margin-bottom: 7px;
      margin-right: 7px;
  /* border: 1px solid aqua; */
  }
  script + style + #results_1.results #listing > table > tbody:first-of-type > tr:first-of-type > td:first-of-type {
      position: absolute;
      width: 100% !important;
      height: 153px;
      right: 12px;
      top: 0;
      padding: 2px 4px;
      border-radius: 3px 3px 0 0;
  }
  script + style + #results_1.results #listing > table > tbody:first-of-type > tr:first-of-type > td:first-of-type #fl {
      position: absolute;
      width: 100% !important;
  }

  /* (new6) TOP FAVORITES ORGANIZER MENU - "ALL VIDEOS" / "UNSORTED" === */

  script + style + #results_1.results #listing>table>tbody:first-of-type>tr:first-of-type>td:first-of-type {
      position: absolute !important;
      height: 237px !important;
      width: 980px !important;
      line-height: 15px !important;
      right: 20px !important;
      top: 0px !important;
      padding: 2px 4px !important;
      border-radius: 3px 3px 0 0 !important;
      font-weight: bold;
      color: #dd4b39;
  }
  script + style + #results_1.results #listing > table > tbody:first-of-type > tr:first-of-type > td:last-of-type {
      border-radius: 3px 3px 0 0;
      font-weight: bold;
      height: 237px;
      padding: 2px 4px;
      position: absolute;
     left: 12px;
      top: 0;
      width: 880px;
  /* border: 1px solid red !important; */
  }
  #listing>table>tbody>tr>td>br {
      display: none !important;
  }


  /* #results_1.results #listing>table>tbody:first-of-type>tr:first-of-type>td:first-of-type>a */
  #fl>span {
      position: absolute !important;
      display: inline-block !important;
      height: 20px !important;
      line-height: 20px !important;
      top: -20px !important;
      padding: 2px 4px !important;
      border-radius: 3px 3px 0 0 !important;
      font-weight: bold;
      color: #dd4b39;
  }
  #fl>span  {
      width: 844px !important;
      top: 2px !important;
      left: 2px !important;
      border-bottom: 1px solid red !important;
  }

  ul#fl {
      position: absolute !important;
      width: 855px !important;
      height: 108px !important;
      line-height: 15px !important;
      left: 2px !important;
      top: 10px !important;
      margin: 10px 0;
      padding: 27px 0 0 0  !important;
      border-top: 1px solid red !important;
      border-bottom: 1px solid red !important;
      overflow: hidden !important;
      overflow-y: auto!important;
      overflow-x: hidden !important;
      z-index: 0 !important;
  }
  .fnf {
      margin-bottom: -4px !important;
      margin-left: 15px;
      color: #BFBFBF !important;
      font-style: italic;
  }

  #fl>li:not(.add) {
  display: inline-block !important;
      margin-left: 4px !important;
      margin-right: -5px !important;
      padding: 2px 3px !important;
      background: rgba(0, 0, 0, 0.34)!important;
  }
  .fd[title="Delete"] {
      position: relative !important;
      display: inline-block !important;
      height: 15px !important;
      line-height: 12px !important;
      width: 15px !important;
      margin-left: 5px !important;
      border-radius: 10px !important;
      text-align: center !important;
  background: gold !important;
  }
  .fd[title="Delete"]:hover {
      position: relative !important;
      display: inline-block !important;
      height: 15px !important;
      line-height: 12px !important;
      width: 15px !important;
      margin-left: 5px !important;
      border-radius: 10px !important;
      text-align: center !important;
      color: gold !important;
  background: green !important;
  }

  /* (new3) FAVORIT ORGANIZER - "MANAGE FOLDERS" / INPUT + BUTTONS- === */
  #fl > li:last-of-type ,
  .fd.fib ,
  .fd.fib + .fd  {
      top: -9px !important;
  }

  /* "MANAGE FOLDER" - BUTTON/TAB */
  #fl > li:last-of-type {
      position: absolute !important;
      height: 20px !important;
      line-height: 20px !important;
      right: 265px !important;
      top: -3px !important;
      padding: 2px 4px !important;
      border-radius: 3px 3px 0 0 !important;
      font-weight: bold;
      color: #dd4b39;
  background: blue !important;
  }
  #fl > li:last-of-type a{
      font-size: 15px !important;
  }
  /* "MANAGE FOLDER" - INPUT */
  .fd.fib {
      position: absolute !important;
      display: inline-block !important;
      right: 104px !important;
  }
  /* "MANAGE FOLDER" - BUTTON/TAB - SAVE CANCEL */
  .fd.fib + .fd {
      position: absolute !important;
      display: inline-block !important;
      right: 3px !important;
  }
  .fd.fib + .fd span a {
      display: inline-block !important;
      line-height: 23px !important;
      height: 23px !important;
      border-radius: 3px !important;
  }
  .fd.fib + .fd span a:hover {
      display: inline-block !important;
      line-height: 23px !important;
      height: 23px !important;
      padding: 0 2px !important;
      border-radius: 3px !important;
  background: gold !important;
  }

  script + style + #results_1.results #listing > table > tbody:first-of-type > tr:not(:first-of-type) > td {
      font-size: 14px;
      height: 240px !important;
      min-width: 940px !important;
      max-width: 940px !important;
      padding: 0;
      vertical-align: top;
  border: 1px solid violet !important;
  }

  td small:not([style="display: none;"]), 
  #results_1 td small:not([style="display: none;"]) {
      margin-top: 20px !important;
  }
  td div.add, 
  td div.remove {
      margin-top: 10px !important;
      right: 4px !important;
  }
  /* ========== END URL - NUDVITA HFAVS  ======= */
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
