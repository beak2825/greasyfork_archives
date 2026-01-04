// ==UserScript==
// @name IAFD - Widescreen DARK AND GRAY v.59
// @namespace iafd.com
// @version 59.01
// @description CSS theme for a larger IAFD on large screen (1920x1080)
// @author janvier56
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.www.iafd.com/*
// @match *://*.iafd.com/*
// @match *://*.rame.net/*
// @match https://www.rame.net/amri/*
// @match https://www.rame.net/reviews/imperator/par*
// @downloadURL https://update.greasyfork.org/scripts/412637/IAFD%20-%20Widescreen%20DARK%20AND%20GRAY%20v59.user.js
// @updateURL https://update.greasyfork.org/scripts/412637/IAFD%20-%20Widescreen%20DARK%20AND%20GRAY%20v59.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "www.iafd.com" || location.hostname.endsWith(".www.iafd.com")) || (location.hostname === "iafd.com" || location.hostname.endsWith(".iafd.com"))) {
  css += `

  /* ==== IAFD - Widescreen Dark And Gray v.59 (new59) - CSS NEW :HAS() - DEV CHROME - NEW DESIGN ==== */

  /* (new50) ADDING PEOLIC IDEAS:
  https://gist.github.com/peolic/9e2981a8a14a49b9626cb277f878b157 
  === */

  /* (new52) ROOT VAR - FOR SHADOW ROOT */
  :root {
      --shadow-test-red: red !important;
      --shadow-test-green: green !important;
  	--shadow-test-gold: gold !important;
      --shadow-test-black: #111 !important;
  	--shadow-test-222: #222 !important;
  	--custom-width-scrool-test: 2px !important;
  }
  * {
      scrollbar-color: var(--shadow-test-red) var(--shadow-test-green) !important;
      scrollbar-width: var(--custom-width-scrool-test) !important;
  }


  /* (new16) - SUPP PUBS - === */
  #persontitlead ,
  #titleresult tbody tr td:last-of-type ,
  #titleresult tbody tr td a[href^="buymovie"] ,
  #titleresult tr .text-center + .text-center,
  .text-center>a[href^="buymovie"] ,
  #topadzone {
      display: none !important;
  }

  /* (new37) OFFLINE MESSAGE */
  #cf_alert_div:not(:hover) {
  	position: absolute !important;	
      display: inline-block !important;
  	width: 130px  !important;
  	height: 3vh !important;
      top: 0;
      left: 0;
      margin: 0 0 5px;
      padding: 0 !important;
      z-index: 99999;
  	overflow: hidden !important;
      background-color: #f7f7f8;
      box-shadow: 0 5px 5px rgba(0,0,0,.25);
  }
  #cf_alert_div:hover {
  	position: absolute !important;	
      display: inline-block !important;
  	width: auto  !important;
  	height: auto !important;
      top: 0;
      left: 0;
      margin: 0 0 5px;
      padding: 0 !important;
      z-index: 99999;
  	overflow: hidden !important;
      background-color: #f7f7f8;
      box-shadow: 0 5px 5px rgba(0,0,0,.25);
  }
  #cf_alert_div:not(:hover)  .wrapper {
  	height: 3vh !important;
      padding: 0 !important;
      margin: 0;
      text-align: left;
      font-size: 12px;
  }
  #cf_alert_div:not(:hover) .wrapper td.refresh {
      display: none !important;
  }
  #cf_alert_div:not(:hover) p {
      display: inline-block !important;
      margin: 0;
      padding: 0 5px !important;
      max-width: 1100px;
      font-size: 0 !important;
  	background:red !important;
  }
  #cf_alert_div:not(:hover) strong {
      display: inline-block !important;
  	width: 90px  !important;
  	height: 1.5vh !important;
  	overflow: hidden !important;
  	text-overflow: ellipsis !important;
      font-size: 12px !important;
  	white-space: nowrap !important;
  	    color: white !important;
  }
  #cf_alert_div:not(:hover) a[href="https://www.cloudflare.com/always-online/"] {
      display: none !important;
  }

  /*  (new18) BLOG */

  .archive.category.category-interviews .entry-content>p:empty {
      display: none !important;
  }
  .archive.category.category-interviews .entry-content>p {
      margin-bottom: 0.6842em !important;
  }
  .hentry + .hentry, 
  .page-header + .hentry, 
  .page-header + .page-content {
      margin-top: 1.3333% !important;
  }
  .hentry {
      padding-top: 2.3333% !important;
  }
  .entry-title, 
  .widecolumn h2 {
      font-size: 3.9rem;
      line-height: 1.2308;
      margin-bottom: 0.2308em !important;
  }

  /* (new18) NEWS HEAD SHOTS */

  .row.headshotrow {
      float: left !important;
      width: 48% !important;
      margin-right: 2.5vw !important;
      padding-bottom: 1em;
      padding-top: 1em;
  }

  .row.row.headshotrow  + .row.text-center{
      display: none !important;
  }

  .headshotrow .col-lg-2 {
  /*     width: 10.6667% !important; */
  }
  .headshotrow .col-lg-2 img {
      height: 170px !important;
      width: auto !important;
  }

  /* (new50) - MOVIES PAGES - PERFORMERS - === */
  .panel.panel-heading  +  .padded-panel .castbox {
      float: left;
      max-height: 300px !important;
      min-height: 300px !important;
      width: 200px;
      overflow: hidden !important;
  }

  /* (new53) CSS NEW :HAS() - PEOLIC IDEA - Place NonSex performers after "Sex" performers + MALEs */
  /* https://gist.github.com/peolic/9e2981a8a14a49b9626cb277f878b157 */
  .padded-panel > .row > .col-sm-12 {
          display: flex !important;
          flex-wrap: wrap !important;
  }
  .panel.panel-heading  +  .padded-panel .castbox {
          float: unset !important;
  }
  .panel.panel-heading  +  .padded-panel .castbox:has(img[src*="_m_"]) ,
  .panel.panel-heading  +  .padded-panel .castbox.nonsex {
          order: 1 !important;
  }

  /* (new50) PEOLIC IDEA - FADE OUT NON SEX */
   /* Fade-out NonSex performers */
  .panel.panel-heading  +  .padded-panel .castbox.nonsex {
  	opacity: 60% !important;
  	transition: opacity .15s linear;
  }
  .panel.panel-heading  +  .padded-panel .castbox.nonsex:hover {
  	opacity: unset !important;
  }


  .panel.panel-heading  +  .padded-panel .castbox p {
      float: left;
      max-height: 300px !important;
      min-height: 300px !important;
      overflow: hidden !important;
  }
  .panel.panel-heading  +  .padded-panel .castbox>p> a {
      display: inline-block !important;
      line-height: 14px !important;
  background: #333 !important;
  }
  .panel.panel-heading  +  .padded-panel .castbox>p> a img {
      margin-bottom: -13px !important;
  }
  .panel.panel-heading  +  .padded-panel .castbox>p>a>br {
      display: block !important;
      margin-bottom: -13px !important;
  }
  .panel.panel-heading  +  .padded-panel .castbox>p>i + br ,
  .panel.panel-heading  +  .padded-panel .castbox>p>br {
      display: none !important;
  }
  .panel.panel-heading  +  .padded-panel .castbox>p> i {
      display: inline-block !important;
      line-height: 14px !important;
      margin-bottom: -13px !important;
      padding: 1px !important;
      text-align: left !important;
  background: #333 !important;
  }





  /* (new5) FOOTER - === */
  footer .container {
      display: inline-block !important;
      width: 100% !important;
      min-width: 1000px !important;
      max-width: 1000px !important;
      padding: 20px;
      color: white;
      background: #222 !important;
  }
  footer .container  .col-sm-offset-2 {
      margin-left: 150px !important;
  }
  /* (new5) - BUTTONS COLOR - ==== */
  button, 
  input[type="reset"], 
  input[type="submit"] {
      cursor: pointer;
      background-color: #e0e0e0 !important;
      color: #23527c !important;
  }
  .btn-primary, 
  .btn-primary, 
  .open > .dropdown-toggle.btn-primary {
      background-color: #337ab7 !important;
      color: #fff !important;
  }
  .btn-primary:focus, 
  .btn-primary:hover {
      color: gold !important;
      background-color: #337ab7 !important;
      background-position: 0 -33px !important;
  transition: all ease 0.04s !important;
  }
  /* (new5) SEARCH - REFINE SEARCH INPUT - === */
  #personal_wrapper .row .col-sm-6:last-of-type  ,
  #tblReviews_wrapper .row .col-sm-6:last-of-type  ,
  #tblMal_wrapper .row .col-sm-6:last-of-type  ,
  #tblFem_wrapper .row .col-sm-6:last-of-type  ,
  #tblDir_wrapper .row .col-sm-6:last-of-type  ,
  #titleresult_wrapper .row .col-sm-6:last-of-type {
      float: left !important;
      clear: both !important;
      height: 26px !important;
      line-height: 26px !important;                     
      margin-left: 15px !important;
      text-align: left !important;
  background-color: #252424 !important;
  }

  /* .form-inline .form-control  */
  div.dataTables_filter.form-inline input.form-control  {
      display: inline-block;
      vertical-align: middle;
      width: 779px!important;
  }
  .form-horizontal .control-label {
      margin-bottom: 0;
      padding-top: 12px !important;
      text-align: right;
      color: peru !important;
      min-width: 341px !important;
  }

  /* (new30A) TEST - SEARCH PAGE RESULTS - SEARCH TERMS VISIBLE - CF MY GM - STICKY */
  .col-xs-12>form:not(#correct){
      position: sticky !important;
      display: inline-block !important;
      min-width: 100% !important;
      max-width: 100% !important;
      min-height: 30px !important;
      max-height: 30px !important;
      line-height: 30px !important;
      top: 0px !important;
      left: 0px !important;
      margin-top: 0px !important;
      z-index: 100 !important;
  background: #111 !important;
  }

  .col-xs-12>form>input:last-of-type {
      display: none !important;
  }
  .col-xs-12>form>p {
      float: none !important;
      width: 583px;
      height: 30px !important;
      margin-top: -32px !important;
      margin-left: 320px !important;
      line-height: 25px !important;
  }
  /* (new30) */
  .col-xs-12>form#correct input[name="FilmID"] {
      color: gold;
  border: none !important;
  background-color: transparent !important;
  }
  .col-xs-12>h2 {
      margin: 5px 0 0 0 !important;
  }




  /* (new30) ALL - GENERAL CONTAINER - === */
  .container {
      display: inline-block !important;
      min-width: 99% !important;
      max-width: 99% !important;
      margin-left: auto;
      margin-right: auto;
      padding: 0 0 0 15px !important;
  }

  /* (new38) ALL - HEADER + FIXED HEADER - === */
  .navbar-inverse ,
  .navbar-header {
      height: 40px !important;
      margin-top: 3px !important;
  }
  .navbar-brand {
      float: left;
      height: 50px;
      line-height: 20px;
      margin-left: -23px !important;
      margin-right: -20px !important;
      padding: 15px 0 !important;
      font-size: 18px;
  }
  #bs-example-navbar-collapse-1 {
      margin-left: -11px !important;
      padding-left: 0 !important;
  }
  .navbar-nav > li  {
      position: relative;
      display: block;
      float: left;
      margin-right: -10px;
  }
  .navbar-nav > li > a {
      position: relative;
      display: block;
      line-height: 20px;
      float: left;
      padding: 15px 11px!important;
  }
  /* (new53) COR FLOAT */
  li.dropdown.open > a {
  	height: 5.8vh  !important;
  	line-height: 1vh !important;
  	margin: 0px 0 0 0 !important;
  	z-index: 500000 !important;
  color: peru !important;
  background-color: #111!important;
  border-left: 5px solid red !important;
  border-right: 5px solid red !important;
  border-top: 5px solid red !important;
  }

  li.dropdown.open .dropdown-menu {
      position: absolute !important;
  	display: inline-block !important;
  /*float: left;*/
      min-width: 160px;
      top: 100%;
      left: 0;
      margin: -15px 0 0 0 !important;
      padding: 5px 0;
  	z-index: 500000 !important;
  background-color: #111 !important;
  border: 1px solid red !important;
  }

  /* new30A */
  #titleresult_wrapper {
      top:0px !important;
  }

  #titleresult_wrapper  .row {
      display: inline-block !important;
      min-width: 1890px !important;
      max-width: 1890px !important;
      margin-left: auto;
      padding: 0 !important;
  }
  .FixedHeader_Cloned.fixedHeader.FixedHeader_Header[style*="position: fixed;"] {
      position: fixed;
      width: 100% !important;
      min-width: 1890px !important;
      max-width: 1890px !important;
      left: 15px;
      top: 0;
      z-index: 104;
  background: black !important;
  }

  /* (new9) SHOWING - == */
  #tblReviews_wrapper .row:last-of-type ,
  #tblReviews_wrapper .row:last-of-type .col-sm-5 ,
  #tblMal_wrapper .row:last-of-type ,
  #tblMal_wrapper .row:last-of-type .col-sm-5 ,
  #tblFem_wrapper .row:last-of-type ,
  #tblFem_wrapper .row:last-of-type .col-sm-5 ,
  #titleresult_wrapper .row:last-of-type ,
  #titleresult_wrapper .row:last-of-type .col-sm-5 {
      height: 20px !important;
      line-height: 20px !important;
  }
  #tblReviews_wrapper .row:last-of-type .col-sm-5 .dataTables_info ,
  #tblMal_wrapper .row:last-of-type .col-sm-5 .dataTables_info ,
  #tblFem_wrapper .row:last-of-type .col-sm-5 .dataTables_info ,
  #titleresult_wrapper .row:last-of-type .col-sm-5 .dataTables_info{
      padding: 0 !important;
      color: red !important;
  }

  /* HEADER FEMALES MALES DIRECTORS REVIEWS - */
  .col-xs-12>h2 {
      background: #222 !important;
  }
  .col-xs-12>h3{
      background: #222 !important;
  }
  .col-xs-6.col-md-4>input {
      width: 528px !important;
      margin-top: -2px !important;
      margin-left: -65px !important;
      color: black !important;
  }

  /* (new30) SEARCH - REFINE SEARCH INPUT - === */
  /* #titleresult_wrapper.dataTables_wrapper.form-inline.dt-bootstrap.no-footer  .row */

  /* #titleresult>tbody {
      top: 37px !important;
  } */

  /* (new21) SEARCH REFINE - === */

  /* (new21) TITLE REFINE */
  #titleresult_wrapper.dataTables_wrapper .row:first-of-type {
      position: sticky !important;
  	display: inline-block !important;
  	width: 100% !important;
  	min-width: 300px !important;
      max-width: 300px !important;
      margin: -40px 0 0 0px !important;
      height: 30px !important;
      left: 1450px !important;
      top: 2px !important;
      padding: 0 0 0 50px !important;
      z-index: 500000 !important;
  }
  #titleresult_wrapper.dataTables_wrapper .row:first-of-type .col-sm-6:last-of-type {
      display: inline-block !important;
      float: none !important;
      width: 100% !important;
      min-width: 252px !important;
      max-width: 252px !important;
      height: 27px !important;
      text-align: right;
  }
  #titleresult_wrapper.dataTables_wrapper .row:first-of-type .dataTables_filter input {
      height: 22px !important;
      line-height: 5px !important;
      min-width: 235px !important;
      margin: -4px 0 0 4px !important;
      padding: 0 5px 2px 5px !important;
      font-size: 15px !important;
  }

  /* ACTOR PAGES */
  .dataTables_wrapper#personal_wrapper .row:first-of-type {
      position: absolute !important;
      width: 680px !important;
      margin: 0 0 0 250px !important;
      right: 20px !important;
      top: 10px !important;
      padding: 0 0 0 40px !important;
      z-index: 500000 !important;
  border-left: 1px solid red !important;
  }
  .col-xs-12>h3 ,
  .col-xs-12 .dataTables_wrapper + h3 {
      height: 28px !important;
      margin-bottom: -27px !important;
      margin-top: 0 !important;
  }

  #tblReviews_wrapper .row .col-sm-6:last-of-type  ,
  #tblMal_wrapper .row .col-sm-6:last-of-type  ,
  #tblFem_wrapper .row .col-sm-6:last-of-type  ,
  #tblDir_wrapper .row .col-sm-6:last-of-type  ,
  #titleresult_wrapper .row .col-sm-6:last-of-type {
      float: right !important;
      clear: both !important;
      width: 707px !important;
      right: 19px !important;
      text-align: left !important;
      z-index: 5000000 !important;
  background: yellow !important;
  }

  /* (new55)  SEARCH - SUB SEARCH - CHROME ? */
  .dataTables_filter {
      position: sticky !important;
      display: inline-block !important;
      float: none !important;
  	width: 320px  !important;
      height: 24px !important;
      line-height: 20px !important; 
      top: 4.7vh !important;
  	left: unset !important;
  	margin: 0vh 0 0vh 1540px !important;
      padding: 0 0 0 0px !important;
      z-index: 5000000 !important;
  /*border: 1px solid aqua !important;*/
  }
  .dataTables_filter  .dataTables_filter .dataTables_filter {
  	width: 300px  !important;
  	top: 4.7vh !important;
  	left: unset !important;
  	margin: 0vh 0 0vh 1540px !important;
  	right: 0 !important;
  border: 1px solid orangered!important;
  }
  .dataTables_filter  .dataTables_filter input {
      height: 22px !important;
      line-height: 5px !important;
      min-width: 280px !important;
  	max-width: 285px !important;
      margin: -4px 0 0 4px !important;
      padding: 0 5px 2px 5px !important;
      font-size: 15px !important;
  border: 1px solid yellow !important;
  }
  div.dataTables_filter label {
      height: 2.8vh !important;
      line-height: 20px !important; 
      font-weight: 400;
      text-align: left;
      padding:  0 5px 0 5px !important;
      white-space: nowrap;
  color: white !important;
  background: brown !important;
  }

  /* (new55) FILTER - LABELS INDICATOR - TOP RESULTS HEADER */
  #tblReviews_wrapper .dataTables_filter:before ,
  #tblDir_wrapper .dataTables_filter:before ,
  #tblMal_wrapper .dataTables_filter:before ,
  #tblDir_wrapper .dataTables_filter:before ,
  div.dataTables_filter label:before {
  	position: fixed !important;
  	height: 1vh  !important;
  	line-height: 8px !important;
  	margin: 0px 0 0 0px !important;
  	top: 3.5vh !important;
  	padding: 0 5px  !important;
  	font-size: 10px  !important;
  	border-radius: 5px 5px 0 0  !important;
  color: white  !important;
  }
  /* TITLE - LABELS INDICATOR - TOP RESULTS HEADER */
  #titleresult_wrapper div.dataTables_filter label:before {
  	content: "Tit. Filter" !important;
  	left: 635px  !important;
  	background: olive !important;
  border: 1px solid olive !important;
  }

  /* FEM - LABELS INDICATOR - TOP RESULTS HEADER */
  #tblFem_wrapper .dataTables_filter label:before {
  	content: "Fem filter" !important;
  	left: 895px  !important;
  	background: green !important;
  border: 1px solid green !important;
  }

  /* MAL - LABELS INDICATOR - TOP RESULTS HEADER */
  #tblMal_wrapper .dataTables_filter:before {
  	content: "Mal Filter" !important;
  	left: 1117px  !important;
  	background: goldenrod !important;
  border: 1px solid goldenrod!important;
  }

  /* DIR - LABELS INDICATOR - TOP RESULTS HEADER */
  #tblDir_wrapper .dataTables_filter:before {
  	content: "Dir Filter" !important;
  	left: -35px  !important;
  	background: gold !important;
  border: 1px solid yellow !important;
  }

  /* REVIEWS - LABELS INDICATOR - TOP RESULTS HEADER */
  #tblReviews_wrapper .dataTables_filter:before {
  	content: "Rev Filter" !important;
  	left: 1338px  !important;
  background: blueviolet !important;
  border: 1px solid blueviolet !important;
  }

  /* (new55) FILTER - LABELS INDICATOR - TOP RESULTS HEADER  - BEFORE SEARCH INPUT */
  #tblReviews_wrapper .dataTables_filter:after,
  #tblDir_wrapper .dataTables_filter:after ,
  #tblMal_wrapper .dataTables_filter::after ,
  #tblDir_wrapper .dataTables_filter:after ,
  div.dataTables_filter label:after {
  	position: absolute !important;
  	height: 1vh  !important;
  	line-height: 8px !important;
  	margin: 0px 0 0 0px !important;
  	top: -0.8vh !important;
  	left: 0px  !important;
  	padding: 0 5px  !important;
  	font-size: 10px  !important;
  	border-radius: 5px 5px 0 0  !important;
  color: white  !important;
  }
  /* TITLE - LABELS INDICATOR - TOP RESULTS HEADER */
  #titleresult_wrapper div.dataTables_filter label:after {
  	content: "Tit. Filter" !important;
  background: olive !important;
  border: 1px solid olive !important;
  }

  /* FEM - LABELS INDICATOR - TOP RESULTS HEADER */
  #tblFem_wrapper .dataTables_filter label:after{
  	content: "Fem filter" !important;
  	background: green !important;
  border: 1px solid green !important;
  }

  /* MAL - LABELS INDICATOR - TOP RESULTS HEADER */
  #tblMal_wrapper .dataTables_filter:after {
  	content: "Mal Filter" !important;
  background: goldenrod !important;
  border: 1px solid goldenrod!important;
  }

  /* DIR - LABELS INDICATOR - TOP RESULTS HEADER */
  #tblDir_wrapper .dataTables_filter:after {
  	content: "Dir Filter" !important;
  background: gold !important;
  border: 1px solid yellow !important;
  }

  /* REVIEWS - LABELS INDICATOR - TOP RESULTS HEADER */
  #tblReviews_wrapper .dataTables_filter:after {
  	content: "Rev Filter" !important;
  	background: blueviolet !important;
  border: 1px solid blueviolet !important;
  }


  /* SEARCH INPUT */
  .dataTables_wrapper .dataTables_filter input {
  display: inline-block !important;
      height: 22px !important;
      line-height: 5px !important;
      min-width: 265px !important; 
  	max-width: 315px !important; 
      margin: -4px 0 0 4px !important;
      padding: 0 5px 2px 5px !important;
      font-size: 15px !important;
  }
  /* (new31) DIRECTORIAL FILTER */
  .dataTables_wrapper .dataTables_filter#directoral_filter {
      position: fixed !important;
  	display: inline-block !important;
      height: 3vh!important;
      line-height: 1vh!important;
      width: auto !important; 
      margin: -5px 0 0 744px !important;
  	top: 5.5vh !important;
      padding: 0 0 0 5px !important;
      font-size: 15px !important;
  /*border: 1px dotted aqua !important;*/
  }

  /* (new53) COR A VOIR */
  /* .form-inline .form-control  */
  /*.dataTables_wrapper .dataTables_filter#directoral_filter input.form-control {
      display: inline-block;
      vertical-align: middle;
      width: 779px!important;
  }*/

  .FixedHeader_Cloned.fixedHeader.FixedHeader_Header {
      margin: 0 !important;
      border-bottom: 2px solid red !important;
      background: #222 !important;
  }

  table.dataTable:not(#deadpornstars) thead .sorting, 
  table.dataTable:not(#deadpornstars) thead .sorting_asc, 
  table.dataTable:not(#deadpornstars) thead .sorting_desc ,

  table.dataTable:not(#deadpornstars) table.dataTable:not(#deadpornstars) .sorting_desc ,
  table.dataTable:not(#deadpornstars) .sorting_asc ,
  table.dataTable:not(#deadpornstars) .sorting ,

  .col-md-3.sorting_asc ,
  .col-md-3.sorting_desc ,
  .col-md-3.sorting ,

  .col-md-2.sorting ,

  .col-md-1.text-center.sorting_asc ,
  .col-md-1.text-center.sorting_desc ,
  .col-md-1.text-center.sorting,


  .col-md-1.sorting_asc ,
  .col-md-1.sorting_desc ,
  .col-md-1.sorting ,
  .col-md-1.sorting[aria-label^="Headshot"] {
      display: inline-block !important;
      height: 30px !important;
      line-height: 30px !important;
      width: auto !important;
  border: 1px solid yellow !important;
  }
  /* (new4) - ALL - TABLES - === */
  .table-responsive {
      min-height: 0.01%;
  /*     overflow-x: auto; */
  }

  /* (new21) -
  PB:
  http://www.iafd.com/results.asp?searchtype=comprehensive&searchstring=Bottoms+Up
  http://www.iafd.com/studio.rme/studio=3534/lesbian-provocateur.htm
  */
  table.dataTable:not(#deadpornstars) {
      display: inline-block !important;
      clear: both;
      width: 100% !important;
      min-width: 1878px !important;
      max-width: 1878px !important;
      margin-bottom: 6px !important;
      margin-top: 0px !important;
      border-collapse: separate;
      border-spacing: 0;
  }
  /* (new53) TITLE RESULTS */

  .table.display.table-responsive ,
  #titleresult ,
  table.dataTable#titleresult:not(#deadpornstars) {
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      margin: 0px 0 0px 0px !important;
      padding: 5vh 0vh 0 0 !important;
      border-collapse: separate;
      border-spacing: 0;
      overflow: visible !important;
  background: #111 !important;
  border: 1px solid green !important;
  }
  /* (new38) STICKY */
  .table.display.table-responsive > thead ,
  #titleresult > thead ,
  table.dataTable#titleresult > thead {
      position: sticky !important;
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
  	top: 3vh !important;
     margin: 24px 0 15px 0 !important; 
  /* margin: -8px 0 -35px 0 !important; */
  	z-index: 50000 !important;
  	background: #222 !important;
  /*border: 1px solid yellow !important;*/
  }
  /* (new30A) FIRST RESULTS CONTAINER */
  .col-xs-12 table#titleresult.table.display.table-responsive   {
      margin: 20px 0 0px 0 !important;
      padding:  35px 0 40px 0 !important;
  background: #111 !important;
  border: 1px solid red !important;
  }
  .col-xs-12 table#titleresult.table.display.table-responsive > thead  {
  margin: -80px 0 -30px 0 !important;

  border: 1px solid red !important;
  }

  /* (new30) */
  .table.display.table-responsive > thead  > tr ,
  #titleresult > thead > tr {
  /*     position: sticky !important; */
      display: inline-block !important;
      width: 100% !important;
      min-width: 90% !important;
      max-width: 90% !important;
  /* top: 20vh !important; */
  }

  /* (new53) */
  #titleresult > thead > tbody ,
  table.dataTable#titleresult > tbody {
      position: relative !important;
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      top: 0px !important;
      margin: 0px !important;
   border: 1px solid violet !important; 
  }
  /* #titleresult>tbody[role="row"] , */
  table.dataTable#titleresult>tbody[role="row"]{
      display: table-row !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
  }

  /* (new53) INFOS - TITE RESULTS */
  #titleresult tbody tr {
  	float: left !important;
      width: 33% !important; 
      height: 100% !important;
      min-height: 8.8vh !important;
      max-height: 8.8vh !important;
      margin-left: 0px !important;
      margin-right: 5px !important;
      margin-bottom: 10px !important;
  	border-radius: 3px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  border: 1px solid red !important;
  }
  .co, 
  .co td.sorting_1 {
      background-color: red !important;
  }

  #titleresult tbody tr > td:first-of-type  {
      display: inline-block !important;
      width: 575px !important;
      height: 100% !important;
      height: auto !important;
      min-height: 2vh !important;
      max-height: 4vh !important;
      padding: 0 0  0 25px !important;
      margin-left:  3px !important;
      margin-top: 0px !important;
      border-bottom: 1px solid gray !important;
  }
  #titleresult td:nth-child(2) {
      position: relative !important;
      display: inline-block !important;
      min-width: 50px !important;
      max-width: 50px !important;
      height: 100% !important;
      min-height: 17px !important;
      max-height: 15px !important;
      left: 3px !important;
      padding: 0 !important;
      bottom: -2px !important;
      text-align: center !important;
      font-size: 14px !important;
      color: tan !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
  }
  #titleresult td:nth-child(3) {
      display: inline-block !important;
      position: relative !important;
      min-width: 120px !important;
      max-width: 120px !important;
      height: 100% !important;
      min-height: 20px !important;
      max-height: 20px !important;
      left: 3px !important;
      padding: 0 !important;
      bottom: -2px !important;
      text-align: center !important;
      font-size: 14px !important;
      color: tan !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
  }
  /* (new53) */
  #titleresult td:nth-child(4):not(:empty) {

  	float: left !important;
      min-width: 420px !important;
      max-width: 420px !important;
      height: 100% !important;
      min-height: 2vh !important;
      max-height: 6vh !important;
  	margin: 0 0 0 0 !important;
      left: 0px !important;
      bottom: 0px !important;
  	padding: 0 !important;
      text-align: left !important;
      font-size: 14px !important;
      overflow: hidden !important;
  	overflow-y: auto !important;
      text-overflow: ellipsis !important;
      white-space: normal !important;
  color: tan !important;	
  background: #a52a2a24 !important;
  }

  #titleresult td:nth-child(4):not(:empty):before {
      content: "AKA:" ;
      /*position: absolute !important;*/
      /*display: inline-block !important;*/
      min-width: 70px !important;
      max-width: 70px !important;
      height: 100% !important;
      min-height: 15px !important;
      max-height: 15px !important;
      font-size: 10px !important;
      left: 0px !important;
      top: 0px !important;
  	margin: 0 5px 0 0 !important;
      padding-right: 3px !important;
      text-align: left !important;
      color: gold !important;
      opacity: 1 !important;
      transition: ease all 0.7s !important;
  outline: 1px solid gold !important;
  }
  #titleresult td:nth-child(4):hover:not(:empty):before {
      opacity: 1 !important;
  }

  /* (new8) TITLE RESULTS - REVIEWS NUMBER INFO */
  #titleresult td.text-center:not(:empty) ,
  #titleresult td:nth-child(5):not(:empty) {
      position: relative !important;
      display: inline-block !important;
      min-width: 20px !important;
      max-width: 20px !important;
      height: 100% !important;
      min-height: 15px !important;
      max-height: 15px !important;
      margin-left: 580px !important;
      padding: 0 !important;
      margin-top: -42px !important;
      text-align: center !important;
      color: tan !important;
      white-space: nowrap !important;
  }
  #titleresult tbody tr td:nth-child(5):not(:empty) a:not([href*="buymovie"]) ,
  #titleresult  tr td.text-center:not(:empty) a:not([href*="buymovie"]) {
      display: inline-block !important;
      width: 100% !important;
      min-width: 20px !important;
      max-width: 20px !important;
      margin-left: 0px !important;
      padding: 0px !important;
      border-radius: 10px !important;
      overflow: visible !important;
  color: tan !important;
  background: black !important;
  }

  #titleresult  tr td:empty ,
  #titleresult td.text-center + td.text-center ,
  a[href*="buymovie"] ,
  #titleresult tbody tr td:nth-child(5):not(:empty) a[href*="buymovie"] ,
  #titleresult  tr td.text-center:not(:empty) a[href*="buymovie"] {
      display: none !important;
  }
  #titleresult tbody tr td:nth-child(5):not(:empty) a:not([href*="buymovie"]):not(:empty):hover:before ,
  #titleresult  tr td.text-center:not(:empty):hover:before {
      content: "Review(s)" !important;
      position: absolute !important;
      display: inline-block !important;
      width: 100% !important;
      min-width: 70px !important;
      max-width: 70px !important;
      margin-left: -65px !important;
      overflow: visible !important;
      z-index: 50000 !important;
      color: green !important;
  background: black !important;
  }
  #titleresult tbody tr td:nth-child(5):not(:empty) a:not([href*="buymovie"]):not(:empty):hover:before  {
      margin-left: -73px !important;
  }
  #titleresult  tr td.text-center:not(:empty) a:visited {
      color: red !important;
  }

  /* PERSONAL */
  table.dataTable#personal {
      display: inline-block !important;
      clear: both;
      width: 100% !important;
      min-width: 1400px !important;
      max-width: 1400px !important;
      margin-bottom: 6px !important;
      margin-top: 6px !important;
      border-collapse: separate;
      border-spacing: 0;
  }
  table.dataTable#personal>thead {
      display: inline-block !important;
      clear: both;
      width: 100% !important;
      min-width:1400px !important;
      max-width: 1400px !important;
  }
  table.dataTable#personal>tbody {
      display: inline-block !important;
      clear: both;
      width: 100% !important;
      min-width:1400px !important;
      max-width: 1400px !important;
  }
  table.dataTable#personal>tbody tr[role^="row"]{
      display: table-row !important;
      width: 100% !important;
  }

  /* ===*/

  .table.display.table-responsive.dataTable.no-footer {
      width: 100% !important;
      margin: 0;
  }
  .table.display.table-responsive.dataTable.no-footer>thead {
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
  }
  .table.display.table-responsive.dataTable.no-footer>thead>tr {
      display: inline-block !important;
      width: 90% !important;
      height: 43px;
      margin-top: 0px !important;
      margin-left: 17px !important;
  }
  .col-sm-12 table#titleresult thead tr th ,
  table.dataTable:not(#deadpornstars) thead > tr > th {
      display: inline-block !important;
      width: auto !important;
      height: 30px !important;
      line-height: 30px !important;
      vertical-align: middle !important;
      padding: 5px 35px 5px 5px !important;
      font-weight: bold;
      border: none !important;
  }
  #titleresult .col-md-3.sorting_asc{
      width: 32% !important;
      margin: 0;
  } 
  /* (new53) PB FLOAT A VOIR - SEARCH RESUTLTS TABLE - FILTER - 
  .table.display.table-responsive.dataTable.no-footer#titleresult thead tr .col-md-1.text-center.sorting:last-of-type:after 
  === */
  .navbar-inverse + .container + footer + script + script + script + .FixedHeader_Cloned.fixedHeader.FixedHeader_Header:not([style*="position: fixed;"]) {
      display: none !important;
  }
  .navbar-inverse + .container + footer + script + script + script + .FixedHeader_Cloned.fixedHeader.FixedHeader_Header[style*="position: fixed;"] {
      margin-left: 0px !important;
  }
  .FixedHeader_Cloned.fixedHeader.FixedHeader_Header {
      display: inline-block !important;
      height: 100% !important;
      min-height: 40px !important;
      max-height: 40px !important;
  }
  /* (new58) FLOAT */
  .FixedHeader_Cloned.fixedHeader.FixedHeader_Header table:after {
      display: block !important;
      float: right !important;
      width: 100% !important;
      min-width: 400px !important;
      max-width: 400px !important;
      height: 100% !important;
      min-height: 22px !important;
      max-height: 22px !important;
      line-height: 22px !important;
      margin-right: 10px !important;
      margin-top: -35px !important;
      padding: 0px 40px !important;
      font-size: 20px !important;
      z-index: 100000 !important;
      background: #333 !important;
  }
  .navbar-inverse + .container + footer + script + script + script + .FixedHeader_Cloned.fixedHeader.FixedHeader_Header table[aria-describedby="titleresult_info"]:after  {
      content: "▶ Movies TitleS Result FILTER" !important;
      background: #333 !important;
  }
  .navbar-inverse + .container + footer + script + script + script + .FixedHeader_Cloned.fixedHeader.FixedHeader_Header + script + .FixedHeader_Cloned.fixedHeader.FixedHeader_Header table[aria-describedby="titleresult_info"]:after {
      content: "▶ Movies TitleS Result FILTER" !important;
      background: #333 !important;
  }

  .FixedHeader_Cloned.fixedHeader.FixedHeader_Header table[aria-describedby="tblPer_info"]:after  {
      content: "▶  Performers FILTER" !important;
      background: #333 !important;
  }

  .FixedHeader_Cloned.fixedHeader.FixedHeader_Header table[aria-describedby="tblDir_info"]:after ,
  .table.display.table-responsive.dataTable.no-footer#tblDir thead tr:after {
      content: "▶ Directors FILTER" !important;
      background: #333 !important;
  }

  .FixedHeader_Cloned.fixedHeader.FixedHeader_Header table[aria-describedby="tblFem_info"]:after  {
  content: "▶ Females Performers FILTER" !important;
      background: #333 !important;
  }

  .FixedHeader_Cloned.fixedHeader.FixedHeader_Header table[aria-describedby="tblMal_info"]:after   {
      content: "▶ Males Performers FILTER" !important;
      background: #333 !important;
  }
  .table.display.table-responsive.dataTable.no-footer#tblReviews thead tr{
      height: 42px !important;
      line-height: 42px !important;
  }
   #tblReviews_wrapper table#tblReviews thead tr th {
      width: 102px !important;
  }
  .FixedHeader_Cloned.fixedHeader.FixedHeader_Header table[aria-describedby="tblReviews_info"]:after ,
  .table.display.table-responsive.dataTable.no-footer#tblReviews thead tr:after {
      content: " Reviews FILTER" !important;
  background: red !important;
  }

  /* (new30) INFOS - NAMES */
  #tblDir tbody tr td:nth-child(2) ,
  #tblMal tbody tr td:nth-child(2) ,
  #tblFem tbody tr td:nth-child(2)  {
      position: relative !important;
  display: inline-block !important;
      vertical-align: middle !important;
      min-width: 485px !important;
      max-width: 485px !important;
      height: 3.2vh !important;
      line-height: 15px !important;
  top: 2px !important;
      left: 2px !important;
      bottom: 0px !important;
  padding: 5px 5px!important;
  font-size: 20px  !important;
  border-left: 3px solid red !important;
  background: #111 !important;
  /* border: 1px solid violet !important; */
  }

  /* (new53) TEST */
  #tblDir_wrapper tbody tr td:nth-child(2) ,
  #tblMal_wrapper tbody tr td:nth-child(2) ,
  #tblFem_wrapper tbody tr td:nth-child(2) {
      position: relative !important;
      vertical-align: middle !important;
      padding: 8px 10px;
      min-width: 75% !important;
      max-width: 75% !important;
      height: 20px !important;
      left: 3px !important;
      bottom: -2px !important;
  border-left: 3px solid red !important;
  }
  #tblReviews_wrapper tbody tr td:nth-child(2) {
      position: relative !important;
  	display: inline-block !important;
      min-width: 110px !important;
      max-width: 110px !important;
      height: 100% !important;
      min-height: 2vh !important;
      max-height: 2vh !important;
      left: 3px !important;
      padding: 0 !important;
      bottom: 0px !important;
      text-align: center !important;
      color: tan !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
  	/*border: 1px solid aqua  !important;*/
  }
  #tblReviews_wrapper tbody tr td:nth-child(3) {
      position: relative !important;
  	display: block !important;
  	float: right  !important;
      min-width: 304px !important;
      max-width: 334px !important;
      height: 100% !important;
      min-height: 2vh !important;
      max-height: 2vh !important;
      left: 0px !important;
      padding: 0 !important;
      bottom: 0px !important;
      text-align: center !important;
      color: tan !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      white-space: nowrap !important;
  /*border: 1px solid yellow  !important;*/
  }

  /* (new30) INFOS - AKA - */
  .text-left:not(#corrections):not(#persontitlead) {
  position: relative !important;
  display: inline-block !important;
      min-width: 472px !important;
      max-width: 472px !important;
      min-height: 9.5vh !important;
      max-height: 9.5vh !important;
  margin: -13vh 0 0px 132px !important;
  padding: 3px 5px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  border: 1px solid gray!important;
  border-left: 3px solid gray !important;
  border-right: 3px solid gray !important;
  }
  /* (new30A) hack Chrome / Safari */
  @media screen and (-webkit-min-device-pixel-ratio:0) {
  .text-left:not(#corrections):not(#persontitlead) {
      min-height: 10.1vh !important;
      max-height: 10.1vh !important;
  margin: -13.5vh 0 0px 132px !important;
  padding: 3px 5px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  border: 1px solid gray!important;
  border-left: 3px solid gray !important;
  border-right: 3px solid gray !important;
  }
  }

  .text-left:empty:after {
      content: " No INFOS ..." !important;
  display: inline-block !important;
      vertical-align: middle !important;
      font-size: 30px !important;
      width: 225px !important;
      line-height: 30px !important;
      margin-top: 20px !important;
      color: gray !important;
  }

  /* (new4) INFOS AKA / YEAR / NBR MOVIES - 
  [id$="_wrapper"] .row >.col-sm-12 .dataTable[id*="tbl"] tbody tr .text-center
  === */

  /* ALL */
  [id$="_wrapper"] .row >.col-sm-12 .dataTable[id*="tbl"] tbody tr .text-center {
      display: inline-block !important;
      vertical-align: middle !important;
      float: none !important;
      min-height: 50px !important;
      max-height: 50px !important;
      line-height: 50px !important;
      margin-left: 5px !important;
      margin-top: -205px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  border: 1px solid gray !important;
  }

  /* INFO - NBR TITLE MOVIES - === */
  [id$="_wrapper"] .row >.col-sm-12 .dataTable[id*="tbl"] tbody tr .text-center:last-of-type:not(:empty) {
      position: relative !important;
      display: inline-block !important;
      min-width: 93px !important;
      max-width: 93px !important;
      min-height: 10px !important;
      max-height: 10px !important;
      line-height: 10px !important;
      margin-left: 502px !important;
      margin-top: -120px !important;
      z-index: 100 !important;
  border: 1px solid gray !important;
  }
  /* (new30A) SORTING ITEMS */
  #personal_wrapper .sorting_1 ,
  #titleresult .sorting_1 ,
  [id$="_wrapper"] .row >.col-sm-12 .dataTable[id*="tbl"] tbody tr .sorting_1 ,
  [id$="_wrapper"] .row >.col-sm-12 .dataTable[id*="tbl"] tbody tr .text-center.sorting_1 {
     background-color: #111 !important;
  border-right: 3px solid aqua !important;
  }

  /* (new53) COR - DEFAULT HEAD SHOT THUMB - OPACITY - === */
  #ps>dl>img[src*="_ad.gif"] {
      opacity: 0.4 !important;
  }

  /* (new28)FOOTER */
  footer ,
  html>body>footer {
      position: fixed !important;
      margin-left: 600px !important;
      width: 1290px !important;
      bottom: -20.5vh !important;
      padding: 0 !important;
  transition: bottom ease 0.7s !important;
  }
  footer:hover ,
  html>body>footer:hover {
      position: fixed !important;
      margin-left: 600px !important;
      width: 1290px !important;
      bottom: 0vh !important;
  transition: bottom ease 0.7s !important;
  background: #111 !important;
  border: 1px solid red !important;
  }
  html>body>footer:before {
      content: "About" !important;
      position: absolute !important;
      width: 70px !important;
      top: -22px !important;
      right: 0 !important;
      text-align: center !important;
      border-radius: 3px 3px 0 0 !important;
  background: #111 !important;
  border: 1px solid red !important;
  }
  html>body>footer .container {
      min-width: 1000px !important;
      max-width: 1000px !important;
  outline: 1px solid tan !important;
  }
  .smaller {
      display: none !important;
  }

  /* (new30) TEST - RESULTS FEMALES / MALES / DIRECTORS - MOZAIC - */
  /* #titleresult tbody ,
  #tblReviews tbody ,
  #tblDir>tbody ,
  #tblMal>tbody ,
  #tblFem>tbody{
      position: relative !important;
      display: inline-block !important;
      float: left !important;
  } */
  #titleresult tbody ,
  #tblReviews tbody , 
  #tblDir tbody ,
  #tblMal tbody ,
  #tblFem  tbody {
  display: inline-block !important;
      width: 100% !important;
      height: 100% !important;
  outline: 1px solid gray !important;
  }
  .col-sm-12 tbody {
      top: 8px !important;
  }
  /* (new30) */
  #tblDir tbody tr ,
  #tblMal tbody tr ,
  #tblFem  tbody tr {
  display: inline-block !important;
  /*     float: left !important; */
      width: 32.9% !important;
      height: 100% !important;
      min-height: 17vh !important;
      max-height: 17vh !important;
      margin: 0px 0 10px 5px !important;
  /*     overflow: hidden !important; */
      background: #222 !important;
  outline: 1px solid gray !important;
  }

  /* (new30 HEAD SHOT */
  #tblDir tbody tr > td:first-of-type ,
  #tblMal tbody tr > td:first-of-type ,
  #tblFem  tbody tr > td:first-of-type {
  position: relative !important;
  display: inline-block !important;
      height: 16.7vh !important;
      width: 20% !important;
  margin: 0 0 0 0 !important;
      padding: 0 !important;
  /* background: green !important; */
  border: 1px solid green !important;
  border-left: 3px solid red !important;
  }
  /* (new30) */
  #tblDir tbody tr > td:first-of-type a ,
  #tblMal tbody tr > td:first-of-type a ,
  #tblFem  tbody tr > td:first-of-type a {
      display: inline-block !important;
      margin: 0px 0px 0px 0 !important;
  }

  /*(new30) LARGE THUMB */
  #tblDir tbody tr > td:first-of-type a>img ,
  #tblMal tbody tr > td:first-of-type a>img ,
  #tblFem  tbody tr > td:first-of-type>a>img {
      display: inline-block !important;
      width: 115px !important;
      height: 100% !important;
      margin: 8px 0px 0px 0 !important;
  object-fit: contain !important;
  border: 1px solid red !important;
  }

  /* (new30) DATES */
  /* #tblDir tbody td + td , 
  #tblMal tbody td + td , 
  #tblFem tbody td + td {
  display: inline-block !important;
      width: 104px !important;
      max-height: 157px !important;
      min-height: 157px !important;
      margin: 0px 0px 0px 0 !important;
  border: 1px dashed  aqua !important;
  }
   */
  #tblDir tbody td.text-center , 
  #tblMal tbody td.text-center , 
  #tblFem tbody td.text-center {
  position: relative !important;
  display: inline-block !important;
  /* float: left !important; */
  /* clear: both !important; */
      width: 23.7% !important;
      height: 20px !important;
      line-height: 15px !important;
  margin: 0 5px 0px 10px !important;
  bottom: 4.5vh !important;
  padding:  0 !important;
      transform: translate(125px, 0) !important;
  border: 1px solid gray !important;
  }

  /* (new30A) hack Chrome / Safari */
  @media screen and (-webkit-min-device-pixel-ratio:0) {
  #tblDir tbody td.text-center , 
  #tblMal tbody td.text-center , 
  #tblFem tbody td.text-center {
  bottom: 4.5vh !important;
  /* border: 1px solid aqua !important; */
  }
  }



  /* DATE START */
  #tblDir tbody td.text-left + td.text-center:before , 
  #tblMal tbody td.text-left + td.text-center:before , 
  #tblFem tbody td.text-left + td.text-center:before {
  content: "Start" !important;
  position: absolute !important;
  top: 2px !important;
  left:  0 !important;
  padding: 0 3px  !important;
  font-size: 10px  !important;
  background: green !important;
  } 
  /* DATE END */
  #tblDir tbody td.text-left + td.text-center + td:before , 
  #tblMal tbody td.text-left + td.text-center + td:before , 
  #tblFem tbody td.text-left + td.text-center + td:before {
  content: "End" !important;
  position: absolute !important;
  top: 2px !important;
  left:  0 !important;
  padding: 0 3px  !important;
  font-size: 10px  !important;
  background: red !important;
  } 

  /* (new30) MOVIE Number */
  #tblDir tbody td.text-left + td.text-center + td + td , 
  #tblMal tbody td.text-left + td.text-center + td + td , 
  #tblFem tbody td.text-left + td.text-center + td + td{
  text-align: right !important;
  }
  #tblDir tbody td.text-left + td.text-center + td + td:before , 
  #tblMal tbody td.text-left + td.text-center + td + td:before , 
  #tblFem tbody td.text-left + td.text-center + td + td:before {
  content: "Nbr of Movie(s):" !important;
  position: absolute !important;
  top: 0px !important;
  left:  0 !important;
  padding: 0 3px  !important;
  font-size: 10px  !important;
  color: red !important;
  }

  /* REWIEWS */
  #tblReviews tbody tr {
      display: inline-block !important;
      width: 450px !important;
      height: 100% !important;
      height:50px !important;
      min-height: 70px !important;
      max-height: 70px !important;
      margin-left: 15px !important;
      margin-bottom: 10px !important;
      border-radius: 3px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  border: 1px solid gray !important;
  }
  #tblReviews tbody tr .sorting_1 {
      display: inline-block !important;
      width: 410px !important;
      height: 100% !important;
      height: 15px !important;
      min-height: 15px !important;
      max-height: 15px !important;
      padding-left: 25px !important;
  }


  /* (new5) PARING PAGE - SELECT PERFORMERS -
  http://www.iafd.com/together.asp
  === */

  #rameheader>table {
      clear: both !important;
      float: left !important;
      height: 27px !important;
      margin-bottom: 1px;
      margin-left: 765px !important;
      margin-top: -38px !important;
      background: #222 !important;
  }
  #rameheader>table>tbody ,
  #rameheader>table>tbody>tr {
      display: inline-block !important;
      height: 34px !important;
      line-height: 34px !important;
  }
  #rameheader>table>tbody>tr>td {
      display: inline-block !important;
      height: 34px !important;
      line-height: 34px !important;
      padding: 0 5px !important;
  }
  #rameheader>table>tbody>tr>td:last-of-type {
      display: inline-block !important;
      height: 34px !important;
      line-height: 15px !important;
  }
  #www-iafd-com>table[width="570"] {
      width: 1888px;
  }
  #www-iafd-com>table[width="570"] p.heading{
      font-family: Arial,Helvetical,sans-serif;
      font-size: 18pt;
      margin-top: 5px !important;
      margin-bottom: 2px !important;
  }
  #www-iafd-com>table[width="570"] p.heading + p {
      margin-bottom: -11px !important;
      margin-top: 3px !important;
  }

  #www-iafd-com>table[width="570"]>tbody>tr>td>form[action="together2.asp"] p {
      float: left !important;
      width: 100% !important;
      color: peru !important;
      text-align: center !important;
  background: black  !important;
  }
  #www-iafd-com>table[width="570"]>tbody>tr>td>form[action="together2.asp"] p b {
      color: peru !important;
      text-align: center !important;
  }
  /* (new58) FLOAT */
  .pair {
      display: block !important;
      float: left!important;
      width: 255px !important;
      height: 70px !important;
      margin-right: 5px !important;
      margin-bottom: 12px !important;
      margin-top: -8px !important;
      padding-left: 5px;
      padding-top: 0px !important;
      border-radius: 3px !important;
      font-size: 11pt;
  background: #222 !important;
  }
  /* (new58) FLOAT */
  .pair + .xsmall-padleft {
      position: relative !important;
      display: block!important;
      float: left !important;
      clear: right!important;
      width: 248px !important;
      height: 30px !important;
      margin-left: -254px !important;
      margin-top: 14px !important;
      padding-left: 0px !important;
      font-family: Verdana,Arial,Helvetica,sans-serif;
      font-size: 8pt;
      white-space: pre-wrap !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  background: black !important;
  }
  .pair + .xsmall-padleft + .xsmall-padleft {
      float: left !important;
      clear: none !important;
      width: 248px !important;
      height: 15px !important;
      margin-left: -254px !important;
      margin-top: 45px !important;
      padding-left: 0px !important;
      font-family: Verdana,Arial,Helvetica,sans-serif;
      font-size: 8pt;
      white-space: pre-wrap !important;
      overflow: hidden !important;
  }

  #www-iafd-com>table>tbody>tr[bgcolor="#EEEEEE"]{
      background: #474747  !important;
  }
  #www-iafd-com>table>tbody>tr[bgcolor="white"]{
      background: #222!important;
  }

  /* MOVIE PAGES - === */
  .padded-panel .row  {
      margin-top: -36px !important;
  }
  .castbox {
      float: left;
      width: 171px !important;
  }
  .castbox p {
      height: 280px !important;
      text-align: center;
      border: 1px solid gray !important;
  }

  /* FEMALES / MALES / DIRECTORS / REVIEWS - COUNTER */
  #titleresult tbody ,
  #tblReviews tbody ,
  #tblDir tbody ,
  #tblMal tbody , 
  #tblFem tbody {
      counter-reset:  myIndex ! important;
      counter-increment: myIndex 0 ! important;
  }
  #titleresult tbody tr:before ,
  #tblReviews tbody tr:before ,
  #tblDir tbody tr:before , 
  #tblMal tbody tr:before , 
  #tblFem tbody tr:before {
      counter-increment: myIndex ! important;
      content: counter(myIndex, decimal-leading-zero);
      position: absolute !important;
      min-width: 17px !important;
      border-radius: 10px !important;
      box-shadow: 0 0 2px rgba(162, 160, 160, 0.6) inset !important;
      font-size: 14px !important;
      text-align: center !important;
      color: peru !important;
      background: #222 !important;
      z-index: 10 !important;
  }

  /* ===== COLOR ====== */

  /* DEFAULT HEAD SHOT THUMB - OPACITY - 
  IMPORTANT For ADBLOCK and Ublock Origin:
  Auturize :
  http://cdn2.iafd.com/headshots/thumbs/th_iafd_ad.gif
  === */
  img[src="http://cdn2.iafd.com/headshots/thumbs/th_iafd_ad.gif"] {
      opacity: 0.4 !important;
  }


  /* (new53) BACKGROUND and BORDER - === */
  	/* Coloring the page, tables and links (DECEMBRE change this:#5577ff by #6174C8 */
  body { 
      background: #333 !important; 
      color: #ddd !important; 
  }

  .table.display.table-responsive.dataTable.no-footer>thead>tr {
  /* background-color: #252424 !important; */
  	border-bottom: 2px solid red  !important;
  }
  .table > thead > tr > th {
      background-color: #181717 !important;
  }

  .odd>td ,
  .odd .sorting_1 ,
  table.dataTable.stripe tbody tr.odd, 
  table.dataTable.display tbody tr.odd {
      border-top: none !important;
      background: #222 !important;
  }
  .even>td ,
  .even .sorting_1 ,
  table.dataTable.stripe tbody tr.even, 
  table.dataTable.display tbody tr.even {
      background: #333 !important;
  }

  table.dataTable.row-border tbody th, 
  table.dataTable.row-border tbody td, 
  table.dataTable.display tbody th, 
  table.dataTable.display tbody td {
      border-top: none !important;
  }

  /* PERFORMERS PAGES (with /without cloundfront.net ) */

  #vitalbox {
      background-color: #252424 !important;
  }
  /* PERFORMERS PAGES - MOVIES LIST (with /without cloundfront.net ) */
  #perflist #personal{
      background-color: #252424 !important;
  }
  .table-striped > tbody > tr:nth-child(odd) {
      background-color: #222 !important;
  }
  .table-striped > tbody > tr:nth-child(even) {
      background-color: #333 !important;
  }

  .row.memdark {
      background-color: #252424 !important;
  }
  .panel.panel-default ,
  .row.memlight {
      background-color: #444343 !important;
  }

  /* WEBBSCEMES - YELLOW */
  .we>td:first-of-type ,
  .we td.sorting_1{
      border-left: 4px solid gold !important;
      background: black !important;
  }

  .we>td:first-of-type a ,
  .we td.sorting_1 a {
      color: gold !important;
  }
  .we>td:first-of-type a:before ,
  .we td.sorting_1 a:before {
      content: "WebSecenes" !important;
      position: absolute !important;
      color: gold !important;
      opacity: 0 !important;
      transition: all ease 0.7s !important;
  }
  .we:hover>td:first-of-type a:before ,
  .we:hover td.sorting_1 a:before {
      margin-top: -10px !important;
      margin-left: 20px !important;
      font-size: 12px !important;
      opacity: 1 !important;
  }


  /* (new6) BI - BLUE */
  .ga.even td.sorting_1{
      border-left: 4px solid gray !important;
      background: #306387 !important;
  }
  .ga.odd td.sorting_1{
      border-left: 4px solid gray !important;
      background: #4E98CD  !important;
  }
  .ga a {
      color: #ABD4F1 !important;
  }

  .bi td.sorting_1 a:before {
      content: "ComPilations" !important;
      position: absolute !important;
      color: blue !important;
      opacity: 0 !important;
      transition: all ease 0.7s !important;
  }
  .bi:hover td.sorting_1 a:before {
      margin-top: -10px !important;
      margin-left: 20px !important;
      font-size: 12px !important;
      opacity: 1 !important;
  }

  /* COMPILATIONS - GRAY */
  .co td:first-of-type ,
  .co td.sorting_1{
      border-left: 4px solid gray !important;
  background: black !important;
  }
  .co td a ,
  .co a {
      color: gray !important;
  }

  .co td:first-of-type a:before,
  .co td.sorting_1 a:before {
      content: "ComPilations" !important;
      position: absolute !important;
      color: white !important;
      opacity: 0 !important;
      transition: all ease 0.7s !important;
  }
  .co:hover td:first-of-type a:before,
  .co:hover td.sorting_1 a:before {
      margin-top: -10px !important;
      margin-left: 20px !important;
      font-size: 12px !important;
      opacity: 1 !important;
  }

  /* MOVIE PAGES */
  .padded-panel>h4 ,
  .panel-heading {
      background-color: #252424 !important;
      background-image: linear-gradient(to bottom, #0B0B0B 0px, #0D0C0C 51%);
      background-image: none !important;
  /* outline: 1px solid violet !important; */
  }
  .panel.panel-default  {
      background-color: #444343 !important;
  }

  /* (new5) */
  #commerce {
      display: none !important;
  }

  /* TEXT and LINKS - === */
  a { 
      color: #6174C8 !important; 
  }
  a:hover { 
      color: #ccbb55 !important; 
  }
  a:visited { 
      color: #7B84AA !important; 
  }

  .nav-pills > li > a {
      display: block;
      padding: 10px 15px;
      position: relative;
      color: #9EE3E4 !important;
  }

  /* (new5) */
  .nav > li > a:focus, 
  .nav > li > a:hover {
      background-color: #514E4E !important;
      text-decoration: none;
  }

  .panel-heading > h3 {
      font-size: 2em;
      margin: 0;
      padding: 0;
      color: gray  !important;
  }


  /* TEXT - GRAY */
  figcaption ,
  .menu-item-description {
      color: gray  !important;

  }
  /* (new50) TEXT - PERU */

  .widget-title {
      color: peru !important;
  }
  span:not(.caret)::before {
      content: "\\f301";
      color: peru !important;
  }



  /* (new13) VISITED - TOMATO */

  a:visited {
      color: tomato  !important;
  }


  /* (new18) BACKGROUND - #222 */

  article ,
  .entry-footer ,
  .page-header ,
  body.archive.category.category-interviews:before ,
  .sidebar ,
  .archive.category.category-interviews .entry-content ,
  .dropdown-menu {
      background: #222 !important;
  }

  /* (new18) BACKGROUND - #333 */

  body::before ,
  .archive.category.category-interviews ,
  .hentry + .hentry, 
  .page-header + .hentry, 
  .page-header + .page-content ,
  .entry-header ,
  .entry-title {
      background: #333 !important;
  }

  /* (new58) ICON FILTER */
  img[src="/images/x.png"] ,
  img[src="/images/Instagram_Glyph_Black.png"] {
  filter: invert(15%) sepia(100%) saturate(6481%) hue-rotate(46deg) brightness(102%) contrast(43%) !important;
  }




  /* ===== END - COLOR ====== */
  `;
}
if (location.href.startsWith("http://www.iafd.com/person.rme/") || location.href.startsWith("https://www.iafd.com/person.rme/perfid=") || location.href.startsWith("https://www.iafd.com/person.asp?perfid=") || location.href.startsWith("https://www.iafd.com/person.rme/id=")) {
		css += `
		/* Pornstars */


		/* (new38) URL-PREF - PERFORMERS PAGES - STICKY */

		/* (new38) - PORNSTAR NAME */
		header.navbar-inverse + .container > .row:first-of-type ,
		header.navbar-inverse + .container > .row:first-of-type >.col-xs-12 {
			display: inline-block !important;
		    width: 365px !important;
		    line-height: 32px !important;
		    top: 0px !important;
		    left: -2px !important;
		    margin: 0 0 0 -10px !important;
		    padding: 2px 5px !important;
		    font-size: 26px !important;
		    text-align: center !important;
			z-index: 50000 !important;
		background-color: #333!important;
		}
		/* HEADER - SEARCH FORM  ?- === */
		header.navbar-inverse + .container > .row:first-of-type >.col-xs-12 > h1  {
			float: left !important;
		    max-height: 25px !important;
		    width: 100% !important;
		    margin: 0px 0px 0 0px !important;
		    font-size: 22px !important;
		}
		/* 'new53) */
		.col-xs-12.col-sm-3 #headshot {
		    position: fixed !important;
		    width: 100% !important;
			min-width: 20% !important;
			max-width: 20% !important;
			height: 100% !important;
			min-height: 310px !important;
			max-height: 310px !important;
		    left: 0 !important;
		    top: 8vh !important;
			margin: 0 !important;
		    padding: 3px !important;
		    border-radius: 5px;
		background: #111 !important;
		border: 1px solid red !important;
		}
		.col-xs-12.col-sm-3 #headshot>img {
		    width: 45% !important;
		    margin-left: -198px !important;
		    border-radius: 5px;
		}
		header.navbar-inverse + .container {
			display: inline-block !important;
		    width: 100% !important;
		    min-width: 100% !important;
		    max-width: 100% !important;
			height: 93.5vh !important;
		    top: 0vh !important;
		overflow: hidden !important;
		}

		/* (new53) */
		header.navbar-inverse + .container > .row + .row .col-xs-12.col-sm-3 {
			display: inline-block !important;
		    width: 20% !important;
		    height: 56.5vh !important;
		    top: 33vh !important;
			padding: 0 5px !important;
			overflow: hidden !important;
			overflow-y: auto !important;
		background: #252424 !important;
			border: 1px solid red !important;
		}
		#corrections {
		    padding-bottom: 2em;
		} 

		br ,
		header.navbar-inverse + .container > .row + .row .col-xs-12.col-sm-3  .headshotcaption {
		    display: none !important;
		}
		.row.memdark {
		    background-color: #252424 !important;
		}
		.row.memlight {
		    background-color: #444343 !important;
		}
		/* (new12) linkifyplus */
		.biodata .linkifyplus{
		    font-size: 0;
		}

		/* /* (new35SHORT)  STICK TOP HEADER */
		header.navbar-inverse + .container >  .row:last-of-type .col-xs-12.col-sm-9{
		    position: sticky !important;
		    display: inline-block !important;
		    width: 79% !important;
			height: 94.4vh !important;
		    top: 0px !important;
		    margin-top: -45px !important;
			padding: 0 5px !important;
			overflow: hidden !important;
			overflow-y: auto !important;
		    z-index: 50000 !important;
		background-color: #111 !important;
		}

		#perfbox>hr ,
		.col-xs-12.col-sm-9>hr{
		    display: none !important;
		}
		/* (new38) */
		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox:not(:hover) {
		    position: fixed !important;
		    display: inline-block !important;
		    height: auto !important;
		    min-height: 30px !important;
		    max-height: 30px !important;
		    width: 25px !important;
			top: 5vh !important;
		    margin: 0px 0px 0 -30px !important;
		    padding: 0px !important;
			overflow: visible !important;
			z-index: 50000000 !important;
		background-color: #111 !important;
		border: 1px solid #333 !important;
		}
		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox:not(:hover) > ul.nav.nav-tabs{
		    display: none  !important;
		}

		/* (new38) */
		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox:hover {
		    position: fixed !important;
		    display: inline-block !important;
		    top: 0px !important;
		    height: auto !important;
		    min-height: 300px !important;
		    max-height: 300px !important;
		    width: 50% !important;
		    margin: 0px 0px -280px -28px !important;
		    padding: 0px 0 0 18px !important;
			overflow: hidden !important;
		    z-index: 50000000 !important;
		background-color: #111 !important;
		border: 1px solid #333 !important;
		}
		/* :not(:hover) */
		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox:before {
		    content: "▶" !important;
		    display: inline-block !important;
		    height: 28px !important;
		    width: 25px !important;
		    top: 0px !important;
		    left: 0 !important;
		    margin: 0px 0px 0 0px !important;
		    padding: 3px !important;
			font-size: 15px !important;
			text-align: center !important;
			overflow: hidden !important;
		    z-index: 50000000 !important;
		background-color: red !important;
		border: 1px solid #333 !important;
		}
		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox:hover:before {
		    content: ">" !important;
			position: sticky !important;
		    display: inline-block !important;
		    height: 28px !important;
		    width: 15px !important;
			top: 0px !important;
			left: -15px !important;
		    margin: 0px 0px -10px -20px !important;
		    z-index: 500000000 !important;
		background-color: red !important;
		border: 1px solid #333 !important;
		border: 1px solid yellow !important;
		}
		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox .nav.nav-tabs{
		    display: inline-block !important;
		    position: sticky !important;
		    top: 0px !important;
		    height: auto !important;
		    width: 100% !important;
		    margin: 0px 0 -22px 0px !important;
		    z-index: 50000000 !important;
		background-color: #111 !important;
		border: 1px solid #333 !important;
		}

		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox .nav.nav-tabs:not(:hover) + #vitalbox.tab-content{
		    display: inline-block !important;
		    position: sticky !important;
		    top: 0px !important;
		    margin: 0px 0 -4px 0 !important;
		    height: 0 !important;
		    width: 100% !important;
		    padding: 0 !important;
		    overflow: visible !important; 
		    z-index: 5000000 !important;
		    transition: all ease 0.7s !important;
		border: none  !important;
		}
		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox:hover .nav.nav-tabs:not(:hover)  + #vitalbox.tab-content ,
		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox .nav.nav-tabs + #vitalbox.tab-content:hover ,
		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox .nav.nav-tabs:hover + #vitalbox.tab-content {
		    position: sticky !important;
		    display: inline-block !important;
		    top: 35px !important;
		    margin: 12px 0px 14px 0px !important;
		    height: 250px !important;
		    width: 100% !important;
		    padding: 0  !important;
		    z-index: 5000000 !important;
		    transition: all ease 0.7s !important;
		background-color: #111 !important;
		border: 1px solid red !important;
		}
		#perflist table#personal.table {
		    margin-bottom: 20px;
		    max-width: 100%;
		    width: 78% !important;
		}
		/* (new35SHORT) */
		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox:hover  .nav.nav-tabs + #vitalbox.tab-content .tab-pane.active,
		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox .nav.nav-tabs + #vitalbox.tab-content .tab-pane.active:hover ,
		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox .nav.nav-tabs + #vitalbox.tab-content:hover .tab-pane.active ,
		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox .nav.nav-tabs:hover + #vitalbox.tab-content .tab-pane.active{
		    display: block !important;
		    height: 250px !important;
		    width: 100% !important;
		    padding: 20px 5px !important;
		    visibility: visible !important;
		    overflow: hidden !important;
		    overflow-y: auto !important;
		    z-index: 500000 !important;
		background: #111 !important;
		}
		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox .nav.nav-tabs + #vitalbox.tab-content .tab-pane:only-of-type#home{
		position: relative !important;
		    display: inline-block !important;
		    height: 200px !important;
		    width: 100% !important;
		    padding: 0px 5px !important;
		    visibility: visible !important;
		    overflow: hidden !important;
		    z-index: 500000 !important;
		background: #333 !important;
		}
		#perfwith form.form-horizontal ,
		#perfwith p {
		    margin: 0 0 0 20px !important;
		}
		#perfwith form.form-horizontal  .col-md-3 {
		    width: 40% !important;
		}
		#perfwith form.form-horizontal .form-group > .col-md-3:first-of-type {
		    height: 42px !important;
		background: #222 !important;
		}
		#perfwith form.form-horizontal  .col-md-4 + .col-md-3{
		    width: 35% !important;
		    right: -50px !important;
		    top: 21px !important;
		}

		#perfwith form.form-horizontal  .control-label {
		display: inline-block !important;
		    min-width: 250px !important;
		    max-width: 250px !important;
		    height: 42px !important;
		    line-height: 42px !important;
		    margin: 0 0 0 5px !important;
		    padding-top: 0 !important;
		    text-align: left !important;
		color: peru;
		}
		#perfwith form.form-horizontal .form-group .col-xs-6.col-md-4 input {
		    max-width: 300px !important;
		    margin: 0 0 0 -40px !important;
		color: black;
		}

		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox .nav.nav-tabs + #vitalbox.tab-content:hover #filters > .row:first-of-type ,
		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox .nav.nav-tabs:hover + #vitalbox.tab-content #filters > .row:first-of-type {
		    height: 2.5em;
		    width : 600px !important;
		    margin-bottom: 1em;
		    padding-top: 0.5em;
		    text-align: center;
		background-color: #222 !important;	
		}
		.col-xs-12.col-sm-9>#perfbox.padding-col-top + hr +   div[role="tabpanel"] {
		    position: sticky;
		    display: inline-block !important;
		    width: 100% !important;
		    top: 0px !important;
		    margin-left: -3px !important;
		    z-index: 500000 !important;
		background-color: #111 !important;
		}
		.col-xs-12.col-sm-9>#perfbox.padding-col-top:hover + hr +   div[role="tabpanel"] {
		    position: sticky;
		    display: inline-block !important;
		    width: 100% !important;
		    top: 0px !important;
		    margin: -40px 0 0px 0px !important;
			padding: 0 0px 0 0px !important;
		    z-index: 500000 !important;
		background-color: #111 !important;
		border: 1px solid blue !important;
		}
		/* HOVER */
		.col-xs-12.col-sm-9>#perfbox.padding-col-top:hover + hr +   div[role="tabpanel"] + .tab-content {
		    margin-top: 2.9vh !important;
		border: 1px solid blue !important;
		}


		/* (new24) NATIONALITY - MOVE at left on ACTRESS THUMBNAIL -  .biodata */
		.col-xs-12.col-sm-9 > div#perfbox[role="tabpanel"]:not(:hover) .nav.nav-tabs + #vitalbox.tab-content:not(:hover) #home {
		    position: sticky !important;
		    display: inline-block !important;
		    height: 0 !important;
		    top: 0vh !important;
		    margin: 0 !important;
		    padding: 0 !important;
		    z-index: 500000 !important;
		}
		.col-xs-12.col-sm-9 > div#perfbox[role="tabpanel"]:not(:hover) .nav.nav-tabs:not(:hover) + #vitalbox.tab-content:not(:hover) #home .col-xs-12.col-sm-4:first-of-type {
			position: absolute !important;
		    display: inline-block !important;
		    width: 190px !important;
			top: 1.2vh !important;
			left: -180px !important;
			margin: 0vh 0 0 0 !important;
		    z-index: 500000 !important;
			pointer-events: none !important;
		}
		.col-xs-12.col-sm-9 > div#perfbox[role="tabpanel"] .nav.nav-tabs:not(:hover) + #vitalbox.tab-content:not(:hover) #home .col-xs-12.col-sm-4:first-of-type  > p:nth-child(even) {
		    max-height: 40px !important;
		    width: 100% !important;
		    white-space: pre-wrap !important;
		    word-break: keep-all !important;
		    overflow: hidden !important;
		}

		.col-xs-12.col-sm-9 > div#perfbox[role="tabpanel"]:not(:hover) .nav.nav-tabs:not(:hover) + #vitalbox.tab-content:not(:hover) #home .col-xs-12.col-sm-4:last-of-type ,
		.col-xs-12.col-sm-9 > div#perfbox[role="tabpanel"]:not(:hover) .nav.nav-tabs:not(:hover) + #vitalbox.tab-content:not(:hover) #home .col-xs-12.col-sm-4:last-of-type {
			position: absolute !important;
		    width: 364px !important;
			top: 20.5vh !important;
			left: -353px  !important;
		    margin: 0vh 0 0 0px !important;
		    z-index: 500000 !important;
		}
		/* (new53) */
		.bioheading {
		    margin: 8px 0 0 0  !important;
		}
		.col-xs-12.col-sm-9 > div#perfbox[role="tabpanel"]:not(:hover) .nav.nav-tabs:not(:hover) + #vitalbox.tab-content:not(:hover) #home .col-xs-12.col-sm-4:last-of-type p ,
		.col-xs-12.col-sm-9 > div#perfbox[role="tabpanel"]:not(:hover) .nav.nav-tabs:not(:hover) + #vitalbox.tab-content:not(:hover) #home .col-xs-12.col-sm-4:last-of-type p {
		    margin: 0  !important;
		}

		/* (new53) PERFORMER ID */
		.bioheading[style="margin-top: 4em;"] {
			position: fixed !important;
		    display: inline-block !important;
		    height: 1.3vh!important;

		    line-height: 10px !important;
		    margin: 0px 0 0 0  !important;
			top: 8.5vh !important;
			left: 180px  !important;
			font-size: 10px  !important;
			visibility: visible !important;
			user-select: all !important;
		color: transparent !important;
		background: rgba(0, 0, 0, 0.7) !important;
		}
		.bioheading[style="margin-top: 4em;"]:before {
			content: "ID: "!important;
			position: fixed !important;
		    display: inline-block !important;
		    height: 2vh!important;
			min-width: 200px !important;
		    max-width: 200px !important;
		    line-height: 2vh !important;
		    margin: 0px 0 0 0  !important;
			top: 8.1vh !important;
			left: 180px  !important;
			padding: 1px 0 1px 5px !important;
			font-size: 15px  !important;
			visibility: visible !important;
		color: red !important;
		background: green !important;
		}
		.bioheading[style="margin-top: 4em;"] + p.biodata {
			position: fixed !important;
		    display: inline-block !important;
		    height: 1.7vh!important;
		    width: auto !important;
		    line-height: 1.8vh !important;
		    margin: 0px 0 0 0  !important;
			top: 8.2vh !important;
			right: 80.5%  !important;
			font-size: 15px  !important;
			user-select: all !important;
		color: red !important;
		background: gold !important;
		}
		/* (new24) */
		.col-xs-12.col-sm-9 > div#perfbox[role="tabpanel"] .nav.nav-tabs:not(:hover) + #vitalbox.tab-content:not(:hover) #home .col-xs-12.col-sm-4:last-of-type > p:nth-child(even) {
		    max-height: 40px !important;
			text-indent: -90px !important;
		    overflow: hidden !important;
		}
		.col-xs-12.col-sm-9 > div#perfbox[role="tabpanel"] .nav.nav-tabs:not(:hover) + #vitalbox.tab-content:not(:hover) #home .col-xs-12.col-sm-4:last-of-type > p:nth-child(even):before{
		    content: "......" !important;
		    position: relative !important;
		    display: inline-block !important;
		    height: 10px !important;
		    width: 90px !important;
		    line-height: 10px !important;
		    top: 28px !important;
		    left: 90px !important;
		    padding: 0 5px 0 0 !important;
		    text-align: right !important;
		    text-indent: -10px !important;
		color: red !important;
		background: rgba(0, 0, 0, 0.7) !important;
		}

		.col-xs-12.col-sm-9 > div#perfbox[role="tabpanel"] .nav.nav-tabs:not(:hover) + #vitalbox.tab-content #home .row  {
		    pointer-events: none !important;
		}
		.col-xs-12.col-sm-9 > div#perfbox[role="tabpanel"]:not(:hover) .nav.nav-tabs:not(:hover) + #vitalbox.tab-content:not(:hover) #home  .col-xs-12.col-sm-4:first-of-type + .col-xs-12.col-sm-4 {
		    display: none !important;
		}
		/* (new21) PERFORMERS - SORT */
		.col-xs-12.col-sm-3 + .col-xs-12.col-sm-9 .dataTables_wrapper#personal_wrapper .row:first-of-type {
		    display: inline-block !important;
		    position: sticky !important;
		    width: 100% !important;
		    min-width: 500px !important;
		    max-width: 500px !important;
		    top: 48px !important;
		    margin-left: 650px !important;
		background-color: #111 !important;
		}
		.col-xs-12.col-sm-9>#perfbox.padding-col-top:hover + hr + div[role="tabpanel"] + .tab-content .dataTables_wrapper#personal_wrapper .row:first-of-type {
		    display: inline-block !important;
		    position: sticky !important;
		    width: 100% !important;
		    min-width: 400px !important;
		    max-width: 400px !important;
		    top: 48px !important;
		    margin-left: 690px !important;
		background-color: #111 !important;
		}

		/* (new54) PERFORMERS - FILTER SEARCH */
		#personal_wrapper.dataTables_wrapper #personal_filter {
		    float: right !important;
		    height: 3vh !important;
			width: auto !important;
		    line-height: 20px !important;
		    margin: -3vh 0 -2vh 200px !important;
		    padding: 0 0 0 0px !important;
		    z-index: 5000000 !important;
		}
		.col-xs-12.col-sm-3 + .col-xs-12.col-sm-9 table.dataTable#personal > thead {
		    display: inline-block !important;
		    position: sticky !important;
		    top: 42px !important;
		    width: 100% !important;
		    min-width: 1400px !important;
		    max-width: 1400px !important;
		background-color: #111 !important;
		}
		/* (new38) DIRECTOR */
		.col-xs-12.col-sm-9 > #perfbox.padding-col-top  ul.nav.nav-tabs + #vitalbox + hr + div[role="tabpanel"] {
		    display: inline-block !important;
		    position: fixed !important;
		    width: 100% !important;
		    height: 2vh !important;
		    min-width: 20% !important;
		    max-width: 20% !important;
		    top: 40vh !important;
			left: 0 !important;
			text-align: center !important;
			z-index: 5000000 !important;
			pointer-events: none !important;
		background-color: #111 !important;
		}
		.col-xs-12.col-sm-9 > #perfbox.padding-col-top  ul.nav.nav-tabs + #vitalbox + hr + div[role="tabpanel"]  .nav-pills > li > a {
		    display: block;
		    padding: 1px 15px !important;
		    position: relative;
		    color: #9EE3E4 !important;
		}
		.col-xs-12.col-sm-9 > #perfbox.padding-col-top  ul.nav.nav-tabs + #vitalbox + hr + div[role="tabpanel"] #perftabs.nav-pills li.active {
		    float: none !important;
		}

		.col-xs-12.col-sm-9 > #perfbox.padding-col-top  ul.nav.nav-tabs + #vitalbox + hr + div[role="tabpanel"] + .tab-content{
		    display: inline-block !important;
		    position: fixed !important;
		    width: 100% !important;
		    min-width: 100% !important;
		    max-width: 100% !important;
		    height: auto !important;
		    top: 42px !important;
		    right: -25% !important;
		background-color: #111 !important;
		}
		.col-xs-12.col-sm-9 > #perfbox.padding-col-top:hover  ul.nav.nav-tabs + #vitalbox + hr + div[role="tabpanel"] +  .tab-content:hover {
			z-index: 5000000 !important;
		background-color: #111 !important;
		}
		/* (new38) */
		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox #vitalbox.tab-content ~.tab-content .tab-pane.active[id="dirlist"] p {
			position: relative !important;
		    display: inline-block !important;
		    height: 4.4vh !important;
			line-height: 3vh !important;
		    min-width: 100% !important;
		    max-width: 100% !important;
			top: 0.2vh !important;
			left: -95px !important;
			padding: 5px 0 0 10px!important;
		    z-index: 5000000 !important;
		background-color: #222 !important;
		}

		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox #vitalbox.tab-content + hr + div  + .tab-content #directoral  {
		    position: fixed !important;
		    display: inline-block !important;
		    height: auto !important;
		    max-height: 87vh !important;
		    min-width: 80% !important;
		    max-width: 80% !important;
			top: 9vh !important;
			right: 0 !important;
			overflow: hidden !important;
			overflow-y: auto !important;
		    z-index: 5000000 !important;
		background-color: #111 !important;
		} 
		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox #vitalbox.tab-content +  hr + div  + .tab-content #directoral tbody  {
		    display: inline-table !important;
		    height: 100% !important;
		    min-height: 37vh !important;
		    max-height: 37vh !important;
		    min-width: 70% !important;
		    max-width: 70% !important;
			overflow: hidden !important;
			overflow-y: auto !important;
		    z-index: 5000000 !important;
		background-color: #111 !important;
		border: 1px solid #333 !important;
		} 

		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox #vitalbox.tab-content +  hr + div  + .tab-content #directoral > thead {
		    display: inline-block !important;
		    position: sticky !important;
		    top: 0px !important;
		    height: auto !important;
		    min-width: 100% !important;
		    max-width: 100% !important;
		    z-index: 5000000 !important;
		background-color: #111 !important;
		border: 1px solid #333 !important;
		} 

		.col-xs-12.col-sm-3 + .col-xs-12.col-sm-9 .tab-pane.active p + #directoral_wrapper.dataTables_wrapper.form-inline.dt-bootstrap > .row:first-of-type {
		    position: fixed !important;
		    display: inline-block !important;
		    top: 98px !important;
		    height: auto !important;
		    width: 20% !important;
		    margin-left: 880px !important;
		    text-align: left !important;
		    z-index: 50000000 !important;
		background-color: #111 !important;
		}

		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox .nav.nav-tabs:hover  + #vitalbox.tab-content + hr + div ,
		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox .nav.nav-tabs  + #vitalbox.tab-content:hover + hr + div ,
		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox .nav.nav-tabs + #vitalbox.tab-content:hover +  hr + div  + .tab-content #directoral > thead ,
		.col-xs-12.col-sm-9>div[role="tabpanel"]#perfbox .nav.nav-tabs:hover + #vitalbox.tab-content  +  hr + div  + .tab-content #directoral > thead {
		    z-index: 0 !important;
		background-color: #111 !important;
		} 


		/* CHECK PARING ==
		http://www.iafd.com/person.rme/perfid=cleacarson/gender=f/clea-carson.htm
		=== */
		#scpr {
		    width: 100% !important;
		    height: 87vh !important;
		    margin-top: 0 !important;
		    padding: 5px 0 !important;
		border-top: 1px solid peru !important;
		border-bottom: 1px solid peru !important;
		}
		.matchuphs.img-responsive {
		    height: 120px !important;
		    width: auto !important;
		}

		.carousel-inner > .item > a > img, 
		.carousel-inner > .item > img, 
		.img-responsive, .thumbnail a > img, 
		.thumbnail > img {
		    display: block;
		    height: auto;
		    max-width: 150px !important;
		}

		/* ( (new50) PEOLIC - COPY ALIAS */
		p.headshotcaption + p.bioheading a[title="Copy only the names used (removes site names)"] ,
		p.bioheading a[title="Copy only the names used (removes site names)"] {
			display: inline-block !important;
		    float: none !important;
			line-height: 1;
			margin: 0 0 0 40px !important;
			padding: 2px 7px !important;
			border-radius: 5px !important;
		    cursor: pointer;
		color: gold !important;
		background: red ;
		}

		.biodata[style^="background-color: yellow"] {
		    font-size: .9em;
		    line-height: normal;
		    -margin-top: 15px;
		color: gold !important;
		background-color: green !important;
		}

		/* <br>  in LIST */
		p.headshotcaption + p.bioheading + .biodata br  {
		    display: inline-block !important;
		}





		/* ======= END - (new)URL-PREF - X IAFD - Colonnes - PERFORMER PAGE ===== */
		`;
}
if (location.href.startsWith("http://www.iafd.com/matchups.rme/") || location.href.startsWith("https://www.iafd.com/matchups.rme/")) {
  css += `
  /* Pornstars - Pairing */    
      
  /* (new54) Adaptation FOR FILER FORM by GM " IAFD Scene Pairings Search Filter " */
  .filter-total {
  	position: fixed !important;
  	display: inline-block !important;
  	height: 3vh !important;
  	line-height: 3vh !important;
  	min-width: 95% !important;
      max-width: 100% !important;
      margin: 0vh 0px 0vh -14px !important;
  	top: 0vh !important;
  	z-index: 500000000 !important;
  background: brown !important;
  }
  .filter-total label {
      display: inline-block;
  	height: 3vh !important;
  	line-height: 3vh !important;
      min-width: 85%;
  	max-width: 85%;
      margin: 0 0 0 0 !important;
  }
  .filter-total label + button {
  	position: relative !important;
      float: left !important;
  	height: 2.8vh !important;
  	line-height: 2vh !important;
      margin: 0px 10px 0 0 !important;
  }
  .filter-total input[type=search] {
  	position: relative !important;
  	display: inline-block;
  	min-width: 85%;
  	max-width: 85%;
  	height: 2.8vh !important;
  	line-height: 2vh !important;
  	margin: 0 0 0 20px !important;
      appearance: none;
  color: red !important;
  }


  .filter-particular {
  	position: relative !important;
  	float: right  !important;
  	clear: both  !important;
  	min-width: 25% !important;
      max-width: 30% !important;
      margin: -5.7vh 250px 0vh 0 !important;
  	top: 0vh !important;
  }
  .filter-particular label {
      display: inline-block;
      min-width: 85%;
  	max-width: 85%;
      margin-bottom: 5px;
      font-weight: 700;
  }
  .filter-particular input[type=search] {
  	position: relative !important;
  	display: inline-block;
  	min-width: 60%;
  	max-width: 60%;
  	height: 2.8vh !important;
  	line-height: 2vh !important;
  	margin: 0 0 0 20px !important;
      appearance: none;
  color: green !important;
  }


  /* (new35SHORT) PERFOMERS PAGE - CHECK PAIRING -
  #scenepairings 
  PB =
  .tab-content > .tab-pane:not([display="none"])#scenepairings
  === */
  /* #scenepairings iframe */
  .tab-content > .tab-pane.active#scenepairings iframe  {
      display: inline-table !important;
      width: 100% !important;
      min-width: 1406px !important;
      max-width: 1406px !important;
      margin-top: 0 !important;
      overflow: hidden !important;
      overflow-x: hidden !important;
  }

  boby ,
  .container  {
      position: relative !important;
      display: inline-block !important;
      float: none !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      overflow: hidden !important;
      overflow-x: hidden !important;
  }

  /* (new35SHORT)  */
  .row.memdark ,
  .row.memlight  {
      /*display: inline-block;*/
  	float: left  !important;
      width: 100% !important;
      min-width: 277px !important;
      max-width: 277px !important;
      height: 220px !important;
      margin: 0 10px 0 -5px !important;
      padding: 5px !important;
      overflow: hidden !important;
  border: 1px solid red  !important;
  }

  /* (new35SHORT) SHORT HOVER */
  .row.memdark:hover ,
  .row.memlight:hover  {
      overflow: visible !important;
  border-left: 4px solid green !important;
  }

  .row.memdark .col-xs-3 ,
  .row.memlight .col-xs-3 {
      width: 100% !important;
  	height: 100px !important;
  	padding: 0 0 0 0px !important;
  }
  .row a .matchuphs.img-responsive {
  	position: absolute  !important;
  	display: inline-block !important;
      height: 95px;
  	object-fit: contain !important;
  }
  /* (new35SHORT) IMG HOVER */
  .row a .matchuphs.img-responsive:hover {
      height: 175px !important;
  	object-fit: contain !important;
  	z-index: 500000 !important;
  }
  .row a .matchuphs.img-responsive {
     border-right: 3px solid red !important;
  }
  .row a:visited .matchuphs.img-responsive {
     border-right: 3px solid green !important;
  }
  .row.memlight ,
  .row.memdark {
      border-left: 4px solid red !important;
  }

  /* (new35SHORT) SHORT */
  .row.memlight .matchupaka ,
  .row.memdark .matchupaka {
      width: 100% !important;
      line-height: 13px!important;
      margin: 0 0 0 0 !important;
      padding: 5px !important;
      font-size: 13px !important;
      overflow: hidden !important;
  background: #111 !important;
  }



  /* (new35SHORT) SHORT */
  .row.memdark  .col-xs-9 ,
  .row.memlight .col-xs-9 {
      padding: 0;
      width: 100% !important;
  background: brown !important;
  }


  /* (new37)  SHORT */
  .col-xs-9 h3 {
      display: inline-block !important;
      width: 100% !important;
      height: 20px !important;
      line-height: 9px !important;
      margin: 0 0 0 0px !important;
      padding: 5px !important;
      font-size: 18px !important;
      text-align: left !important;
      -moz-user-select: all !important;
      user-select: all !important;
  background: #222 !important;
  }

  /* (new36) H3 ZEBRA */
  .row.memdark .col-xs-9 h3 {
      background-color: #444343 !important;
  }
  .row.memlight .col-xs-9 h3 {
      background-color: #252424 !important;
  }

  /* (new57) MOVIE LIST - INDICATOR */
  .col-xs-9 h3:not(:hover):before {
      content: "🎞▹" !important;
  	position: absolute !important;
      display: inline-block !important;
      width: 35px !important;
      height: 20px !important;
      line-height: 15px !important;
  	right: -5px !important;
  	top: -12.8vh !important;
      margin: 0 0 0 0px !important;
      font-size: 15px !important;
      text-align: center !important;
      border-radius: 5px 0 0 5px !important;
  	z-index: 50000 !important;
  background: #222 !important;
  border: 1px solid red !important;
  border-right: 3px solid red !important;
  }
   .col-xs-9> .matchupaka {
      position: relative !important;
      display: inline-block!important;
      width: 508px !important;
      height: 100% !important;
  	min-height: 11vh !important;
      max-height: 11vh !important;
      line-height: 15px !important;
      padding: 1px 5px 0px 5px !important;
      font-size: 17px !important;
      overflow: hidden !important;
      -moz-user-select: all !important;
      user-select: all !important;
  border-bottom: 1px solid #333 !important;
  }

  /* (new35SHORT) SHORT */
   .col-xs-9> .matchupaka:hover {
      position: relative !important;
      display: inline-block!important;
      width: 100% !important;
      height: 100% !important;
      max-height: 84px !important;
      min-height: 84px !important;
      line-height: 13px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  outline: 1px solid red !important;
  }


   .col-xs-9> .matchupaka:not(:hover):after {
  content: "..." !important;
  position: absolute !important;
      display: inline-block!important;
      width: 99.5%!important;
      height: 100% !important;
      height: 20px !important;
      line-height: 0px !important;
      bottom: -1vh !important;
      left: 2px !important;
      padding: 1px 5px !important;
      text-align: center !important;
      font-size: 17px !important;
      overflow: hidden !important;
  background: rgba(17, 17, 17, 0.7) !important;
  }

  /* (new35SHORT)  - MOVIE LIST */
  *, *:before, *:after {
    -webkit-box-sizing: border-box;
    box-sizing: border-box !important;
  }

  .row .col-xs-9 h3:not(:hover) ~ ul ,
  .row .col-xs-9 h3 ~ ul:not(:hover) {
      position: absolute !important;
      width: 69.5% !important;
      height: 100% !important;
      min-height: 80px !important;
      max-height: 80px !important;
      line-height: 4px !important;
      margin:  0 0 0 0 !important;
  	left: 85px  !important;
  	top: -10.4vh !important;
  	padding: 0px 0px 0 0px !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  	font-size: 10px  !important;
  	opacity: 1 !important;
  	z-index: 0 !important;
  	transition: opacity ease 0.7s, width ease 0.7s  !important;
  }
  /* (new35SHORT) MOVIES - HOVER */
  .row .col-xs-9 h3 ~ ul:hover ,
  .row .col-xs-9 h3:hover ~ ul {
      position: absolute !important;
      display: inline-block!important;
      width: 100% !important;
      height: 100% !important;
      max-height: 220px !important;
      min-height: 220px !important;
      line-height: 12px !important;
      margin:  0 0 0 0 !important;
  	left: 80px  !important;
  	top: -13.2vh !important;
  	padding: 1px 5px !important;
      border-radius: 0 5px 5px 0 !important;
      overflow: hidden !important;
      overflow-y: auto !important;
  	font-size: 15px  !important;
  	opacity: 1 !important;
  	z-index: 50000 !important;
  	transition: opacity ease 0.7s  !important;
  background: #111 !important;
  border: 1px solid red !important;
  border-left: 3px solid red !important;
  }


  /* (new35SHORT) SHORT */

  /* (new35SHORT) NOT HOVER */
  .row .col-xs-9 h3 ~ ul:not(:hover)>li ,
  .row .col-xs-9 h3:not(:hover) ~ ul>li {
      position: relative !important;
      display: inline-block!important;
      width: 100% !important;
      max-width: 100% !important;
      height: 10px !important;
      line-height: 10px !important;
      margin: 0px 0 0 0 !important;
      top: 0px !important;
      padding: 1px 0 1px 6px !important;
  }
  .row.memdark li:before,
  .row.memlight li:before {
  	content: "⦁" !important;
  	position: absolute !important;
  	left: 0px !important;
  }

  /* (new35SHORT) HOVER */
  .row .col-xs-9 h3 ~ ul:hover>li ,
  .row .col-xs-9 h3:hover ~ ul>li {
      position: relative !important;
      display: inline-block!important;
      width: 100% !important;
      max-width: 100% !important;
      height: auto !important;
  	line-height: 18px !important;
      margin: 0px 0 0 0 !important;
      top: 0px !important;
      padding: 1px 0 0px 9px !important;
  	overflow: hidden !important;
  	text-overflow: ellipsis !important;
  }
  /* (new35SHORT) NOT HOVER */
  .row .col-xs-9 h3 ~ ul:not(:hover)>li a ,
  .row .col-xs-9 h3:not(:hover) ~ ul>li a {
      position: relative !important;
      display: inline-block!important;
      width: 100% !important;
      max-width: 100% !important;
      height: auto !important;
      line-height: 10px !important;
      margin: 0px 0 0 0 !important;
      top: 0px !important;
  	white-space: pre-wrap !important;
  }
  .row .col-xs-9 h3 ~ ul:hover>li a  ,
  .row .col-xs-9 h3:hover ~ ul>li a {
      position: relative !important;
      display: inline-block!important;
      width: 100% !important;
      max-width: 100% !important;
      height: auto !important;
      line-height: 18px !important;
      margin: 0px 0 0 0 !important;
      top: 0px !important;
  	white-space: pre-wrap !important;
  	overflow: hidden !important;
  	text-decoration: none  !important;
  }

  /* (new58) FEM / MENS - IAFD COUNTER  */
  .row + h3  ,
  .container > h3:first-of-type {
      position: absolute !important;
      display: inline-block !important;
      height: 2vh !important;
      line-height: 1vh !important;
      width: 100%  ! important;
      min-width: 400px ! important;
      max-width: 400px ! important;
      left: 15px ! important;
      top: 7px !important;
  	padding: 5px !important;
      border-radius: 0 5px 5px 0 !important;
      font-size: 15px ! important;
      text-align: left ! important;
  /*     z-index: 100000000 !important; */
  color: gold !important;
  background: green ! important;
  }
  /* MENS - COUNTER IAFD */
  .row + h3 {
      display: inline-block !important;
  	top: 3vh !important;
      padding: 5px !important;
      text-align: left !important;
  background: red !important;
  }

  /* (new58) FEM / MENS - HEADER */
  h2 ,
  .row + h3 + h2 {
      display: inline-block !important;
      min-width: 1377px !important;
      margin-left: -13px !important;
      padding: 5px !important;
      text-align: center !important;
  background: blue !important;
  }


  /* (new58) CSS COUNTER - TOTAL CONTAINER */
  .container {
      counter-increment: myIndex 0 myIndex2 0 ! important;
  }
  /* (new58) FEM / MENS - CSS COUNTER */
  .row .col-xs-9 h3:after{
      counter-increment: myIndex 1 ! important;
      content: counter(myIndex, decimal-leading-zero);
      position: absolute !important;
      display: inline-block !important;
      height: 20px !important;
      line-height: 20px !important;
      width: 45px ! important;
      left: 82px ! important;
  	top: -12.8vh !important;
      border-radius: 0 5px 5px 0 !important;
      font-size: 15px ! important;
      text-align: center ! important;
  /*     z-index: 100000 !important; */
  color: red !important;
  background: #333 ! important;
  }
  /* (new58) FEM - CSS COUNTER  - TOTAL */
  .container > h3:first-of-type:before {
      counter-increment: myIndex 0 ! important;
      content: counter(myIndex, decimal-leading-zero);
      position: absolute !important;
      display: inline-block !important;
      height: 2vh !important;
      line-height: 2vh !important;
      width: 75px ! important;
      left: 770px ! important;
  	top: 1vh !important;
      border-radius: 0 5px 5px 0 !important;
      font-size: 18px ! important;
      text-align: center ! important;
  /*     z-index: 100000 !important; */
  color: red !important;
  background: #333 ! important;
  }


  /* (new58) MEN - CSS COUNTER */
  .container h3 + h2 ~.row .col-xs-9 h3:after{
      counter-increment: myIndex2 1 ! important;
      content: counter(myIndex2, decimal-leading-zero);
  }
  /* (new58) MEN - CSS COUNTER  - TOTAL - NOT WORK*/

  /*h3:not(.matchuph3) + h2:after {
      counter-increment: myIndex 1 ! important;
      content: counter(myIndex, decimal-leading-zero);
  		counter-reset: myIndex !important;
      position: relative !important;
      display: inline-block !important;
      height: 20px !important;
      line-height: 20px !important;
      width: 45px ! important;
      left: 82px ! important;
      top: 0vh !important;
      border-radius: 0 5px 5px 0 !important;
      font-size: 15px ! important;
      text-align: center ! important;
      color: red !important;
      background: #333 ! important;
  }
  */

  /* LINKIFY PLUS - PB Some not Working??? */
  .col-sm-12 table#titleresult tbody tr  .linkifyplus ,
  .container .col-xs-12.col-sm-3  .biodata a.linkifyplus[href="http://ifuckedherfinally.com"]  ,
  .container .row .col-xs-12 .dataTables_wrapper .col-sm-12 table.dataTable tbody tr .linkifyplus ,
  .matchupaka .linkifyplus {
      display: none !important;
      visibility: hidden !important;
      font-size: 0 !important;
  }

  /* ======= END - new PREFIX - PAIRING PAGE ===== */
  `;
}
if (location.href.startsWith("https://www.iafd.com/deadporn/")) {
		css += `
		/* Pornstars - Dead List */


		table.dataTable#deadpornstars  {
			display: inline-block !important;
			width: 98.5vw !important;
		    vertical-align: middle;
		/*background: brown !important;*/
		/*border: 1px dashed aqua  !important;*/
		}
		table.dataTable#deadpornstars tbody  {
			display: inline-block !important;
			width: 100% !important;
		    vertical-align: middle;
		/*background: brown !important;*/
		/*border: 1px dashed aqua  !important;*/
		}
		/* (new58) FLOAT */
		table.dataTable#deadpornstars tbody tr {
		    display: block !important;
			float: left !important;
			clear: none !important;
			min-width: 33% !important;
			max-width: 33% !important;
			height: 200px  !important;
			margin: 0 5px 5px 0 !important;
			overflow: hidden !important;
			border-radius: 5px  !important;
		border: 1px solid red !important;
		}
		table.dataTable#deadpornstars  tbody td {
			/*display: inline-block !important;*/
			line-height: 15px  !important;
			vertical-align: top !important;
			height: auto  !important;
		    padding: 0px 0px;
		}
		table.dataTable#deadpornstars tbody td br {
			display: none !important;
		}
		table.dataTable#deadpornstars tbody tr.odd {
			background: #222 !important;
		}
		table.dataTable#deadpornstars tbody tr.even{
			background: #333 !important;
		}


		table.dataTable#deadpornstars tbody tr td.no-sort {
			position: absolute !important;
		    display: inline-block !important;
		    vertical-align: inherit;
			width: 177px  !important;
			padding: 5px 0 5px 0 !important;
			text-align: center !important;
			overflow: hidden !important;
			z-index: 500 !important;
		border-bottom: 1px solid red!important;
		}
		/* (new58) FLOAT */
		table.dataTable#deadpornstars tbody tr.odd td.no-sort + td  ,
		table.dataTable#deadpornstars tbody tr.even td.no-sort + td {
			display: block !important;
			float: left  !important;
			clear: none !important;
			min-height: 195px  !important;
			width: 172px  !important;
			margin: 0vh 5px 0 0px !important;
			overflow: hidden !important;
			overflow-y: auto !important;
		border: 1px solid red !important;
		}
		/* (new58) FLOAT */
		table.dataTable#deadpornstars tbody tr td:not(.no-sort):not(:empty){
			/*position: relative !important;*/
			display: block !important;
			float: left  !important;
			clear: none !important;
			max-height: 100px  !important;
			width: 68%  !important;
			margin: 0vh 0 3px 0px !important;
			padding: 2px 0 2px 5px !important;
			overflow: hidden !important;
			overflow-y: auto !important;
		/*border: 1px solid aqua !important;*/
		}



		table.dataTable#deadpornstars tbody tr td img {
			position: relative !important;
		    display: inline-block !important;
		    vertical-align: inherit;
			height: 160px  !important;
			width: 180px  !important;
			margin: 3vh 0 0 -8px !important;
			overflow: hidden !important;
			object-fit: contain !important;
		/*border: 1px solid aqua !important;*/
		}
		/* ======= END - URL-PREF - Dead Pornstar List ===== */
		`;
}
if (location.href.startsWith("https://www.iafd.com/title.rme/title=") || location.href.startsWith("https://www.iafd.com/title.rme/")) {
  css += `
  /* Movies - Info (new55) */

  /* SUPP - NOTICE USAGE */
  .panel.panel-default:not(:first-of-type):not(#sceneinfo):not(#reviews) ,
  /*.panel.panel-default#sceneinfo + .panel-default ,*/
  #commerce + .panel.panel-default {
      display: none !important;
  }

  /* TOP NAV */
  nav[role="navigation"]{
      position: fixed !important;
  	display: inline-block !important;
  	vertical-align:  top !important;
      width: 100% !important;
  	height: 4vh !important;
  	line-height: 2vh !important;
  	top: 0vh !important;
  	left: 0 !important;
      margin: 0 !important;
  	padding: 0 0 0 50px !important;
  	z-index: 5000 !important;
  background: #111 !important;
  border-bottom: 1px solid red  !important;
  }

  /* TOP SEARCH */
  .navbar-inverse .navbar-form {
      position: fixed !important;
      width: 35% !important;
  	top: 0vh !important;
  	right: 0 !important;
      margin: 0 !important;
  	border-radius: 5px  0 0 0 !important;
  	z-index: 50000 !important;
  background: #111 !important;
  border-top: 1px solid red  !important;

  	 border-left: 1px solid red  !important;
  }
  .navbar-form .form-group {
  	display: inline-block;
  	width: 85% !important;
  	margin: 0 0 0 0 !important;
  	vertical-align: middle;
  }
  .navbar-form .form-group  input {
  	display: inline-block;
  	width: 100% !important;
      line-height: normal;
  }

  /* (new30) MOVIE TITLE CONTAINER */
  body > .container > .row[style="margin-top: 1em;"] {
      position: fixed !important;
      width: 25% !important;
  	top: 4.2vh !important;
      margin: 0 !important;
  background: #111 !important;
  border-top: 1px solid red  !important;
  border-bottom: 1px solid red  !important;
  }
  body > .container > .row[style="margin-top: 1em;"] h1 {
      margin: 0 0 0 0 !important;
  }


  body header.navbar-inverse + .container > .row .col-xs-12.col-sm-3 {
      position: fixed !important;
      width: 25% !important;
  	bottom: 0.5vh !important;
  	left: 15px !important;
      margin: 0 !important;
  background: #111 !important;
  border-top: 1px solid red  !important;
  border-bottom: 1px solid red  !important;
  }
  body header.navbar-inverse + .container > .row .col-xs-12.col-sm-3 .bioheading {
      margin: 0 0 0 0 !important;
  }

  body header.navbar-inverse + .container > .row .col-xs-12.col-sm-3  + .col-xs-12.col-sm-9 {
      position: absolute !important;
      right: 0 !important;
  }


  /* (new50) - MOVIES PAGES - SCENE BREAKDOWNS - === */
  #sceneinfo .panel-heading + ul {
      display: inline-block !important;
      padding-left: 2px !important;
  /* background: red !important; */
  }
  /* (new58) FLOAT */
  #sceneinfo .panel-heading + ul li  {
      display: block !important;
      float: left !important;
      width: 465px !important;
      padding: 5px !important;
  /* background: blue  !important; */
  }
  #sceneinfo .panel-heading + ul li.g  {
      background: #222  !important;
  }
  #sceneinfo .panel-heading + ul li.w  {
      background: #333  !important;
  }

  /* (new53) PEOLIC IDEA - Improve scene breakdowns styling */
  #sceneinfo table td:first-of-type {
  	float: left !important;
  	min-height: 2vh  !important;
  	max-height: 2vh  !important;
  	line-height: 0vh !important;
  	width: 5.5em !important;
  	margin: -1vh 0 0 0 !important;
  	text-align: left !important;
  	padding: 8px 0 8px 1em !important;
  border: 1px solid red !important;
  }
  #sceneinfo table td[colspan="3"] {
  	display: inline-block !important;
  	width: 100% !important;
  	line-height: 1.7vh !important;
  	margin: -2vh 0 0 0 !important;
  	padding: 0px 0 0 80px !important;
  border-top: 1px solid aqua !important;
  }
  /* (new53) FOR PEOLIC GM - SCENES with HEADSHOT */
  .panel.panel-default + .panel.panel-default[id="sceneinfo"]:not(:hover):before {
  	content: "▲ Scenes ▼" !important;
  	position: fixed !important;
  	display: inline-block !important;
  	bottom: 1vh !important;
  	font-size: 25px !important;
  	margin: 0 0px 0px 20px !important;
  	padding:  0 10px  !important;
  	border-radius: 5px  5px  0 0 !important;
  	background: green!important;
  border: 1px solid red  !important;
  }
  .panel.panel-default + .panel.panel-default[id="sceneinfo"] {
  	position: fixed !important;
  	display: inline-block !important;
  	width: 100% !important;
  	min-width: 74% !important;
  	max-width: 74% !important;
  	height: 5vh !important;
      margin: 0 0px 0px 0 !important;
  	bottom: -4vh !important;
  	border-radius: 5px  5px  0 0 !important;
  background: #111 !important;
  border: 1px solid red  !important;
  }
  /* HOVER */
  .panel.panel-default + .panel.panel-default[id="sceneinfo"]:hover {
  	position: fixed !important;
  	display: inline-block !important;
  	width: 100% !important;
  	min-width: 74% !important;
  	max-width: 74% !important;
  	height: auto !important;
  	max-height: 55vh !important;
      margin: 0 0px 0px 0 !important;
  	bottom: 0 !important;
  	border-radius: 5px  5px  0 0 !important;
  background: #111 !important;
  border: 1px solid red  !important;
  }

  .panel.panel-default + .panel.panel-default[id="sceneinfo"] .table tbody  {
  	display: inline-block !important;
  	width: 100% !important;
  	max-height: 49vh !important;
      margin: 0 0px 0px 0 !important;
  	overflow: hidden !important;
  	overflow-y: auto !important;
  background: #111 !important;
  border: 1px solid red  !important;
  }

  .panel.panel-default + .panel.panel-default[id="sceneinfo"] .panel-heading > h3[style="cursor: pointer; text-decoration: underline double;"]  {
      font-size: 2em;
      margin: 0;
      padding: 0;
  	text-decoration: none  !important;
      color: gold !important;
  }
  .panel.panel-default + .panel.panel-default[id="sceneinfo"] .panel-heading > h3[style="cursor: pointer; text-decoration: underline double;"]:before  {
  	content: " Click to Expand >>"  !important;
      font-size: 0.6em;
      margin: 0 40px 0 0 !important;
      padding: 0;
  	text-decoration: unset !important;
      color: green !important;
  }

  .panel.panel-default + .panel.panel-default[id="sceneinfo"] .panel-heading > h3[style="cursor: pointer; text-decoration: underline double;"]:after  {
  	content: " >>> "attr(title)  !important;
      font-size: 0.6em;
      margin: 0 0 0 40px !important;
      padding: 0;
      color: green !important;
  }


  .panel.panel-default + .panel.panel-default[id="sceneinfo"] table.table tr {
  	display: inline-block !important;
  	width: 100% !important;
  	min-width: 49.5% !important;
  	max-width: 49.5% !important;
      margin: 0 5px 5px 0 !important;
  	padding: 1vh 0 0 0 !important;
  	border-radius: 5px;
  background: #111 !important;
  border: 1px solid red  !important;
  }
  /* ZEBBRA */
  .panel.panel-default + .panel.panel-default[id="sceneinfo"] table.table tr:nth-child(odd) {
  	background: #222  !important;
  }
  .panel.panel-default + .panel.panel-default[id="sceneinfo"] table.table tr:nth-child(even) {
  	background: #333 !important;
  }

  /* (new53) */
  .panel.panel-default + .panel.panel-default[id="sceneinfo"] table.table tr .ext__scene-performers-toggle {
  	position: relative !important;
  	display: inline-block !important;
  	margin: 0 10px 0px 0 !important;
  	color: gold !important;
      white-space: nowrap;
  	text-decoration: none  !important;
  	user-select: all !important;
  }
  .panel.panel-default + .panel.panel-default[id="sceneinfo"] table.table tr .ext__scene-performers-toggle:after {
  	content: "▼" !important;
  	margin: 0 0px 0 0px !important;
  color: red !important;
  }

  /* [style="display: none;"] */
  .panel.panel-default + .panel.panel-default[id="sceneinfo"] table.table tr .ext__scene-performers {
      display: flex !important;
      flex-wrap: wrap !important;
      column-gap: 0.5em !important;
  	margin: 4px 0 0 -80px !important;
  }
  .panel.panel-default + .panel.panel-default[id="sceneinfo"] table.table tr .ext__scene-performers  .castbox {
      max-width: 160px !important;
      min-height: unset;
      float: unset;
      margin-left: 0;
  }
  .panel.panel-default + .panel.panel-default[id="sceneinfo"] table.table tr .ext__scene-performers .castbox p {
      height: 170px !important;
      width: 160px !important;
      padding:0 !important;
      border-radius: 5px;
  	overflow: hidden !important;
  	overflow-y: auto !important;
  }

  /* (new55) */
  .panel.panel-default + .panel.panel-default[id="sceneinfo"] table.table tr .ext__scene-performers .castbox p img.headshot {
  	clear: both;
      height: 70px;
      width: 60px !important;
      padding: 1px;
      border-radius: 5px;
  	margin: 0vh 0 8px 0 !important;
  	object-fit: contain !important;
  border: 1px solid red  !important;
  }
  /* HOVER */
  .panel.panel-default + .panel.panel-default[id="sceneinfo"] table.table tr .ext__scene-performers .castbox p img.headshot:hover {
      height:110px;
      width: 98px !important;
      padding: 1px;
      border-radius: 5px;
      clear: both;
      margin: 0vh 0 0vh 0 !important;
  	object-fit: contain !important;
  	transform: scale(1) !important;
  	transform-origin: 50% 50% !important;
  /*pointer-events: none  !important;*/
  }

  /* (new53) PERFORMER NOT FOUND */
  .panel.panel-default + .panel.panel-default[id="sceneinfo"] table.table tr .ext__scene-performers .castbox:has(abbr[title$="was not found above"])  p {
      height: 18.5vh !important;
  	line-height: 2vh !important;
      width: 160px !important;
  	margin: 0 0 0 0 !important;
      padding: 0 !important;
      border-radius: 5px;
  	font-size: 20px !important;
  }
  .panel.panel-default + .panel.panel-default[id="sceneinfo"] table.table tr .ext__scene-performers .castbox:has(abbr[title$="was not found above"])  p > div {
      height: 2vh !important;
  	line-height: 2vh !important;
      width: 160px !important;
  	margin: 5vh 0 0 0 !important;
      padding: 0 !important;
      border-radius: 5px;
  	font-size: 20px !important;
  }
  .panel.panel-default + .panel.panel-default[id="sceneinfo"] table.table tr .ext__scene-performers .castbox abbr[title$="was not found above"]  {
  	position: relative !important;
  	display: inline-block ;
  	float: none !important;
      height: 2vh !important;
  	line-height: 2vh !important;
      width: 154px !important;
  	margin: 2vh 0 0 0 !important;
  	top: 0 !important;
      padding: 0 !important;
      border-radius: 5px;
  	font-size: 15px !important;
  background: red !important;
  }



  /* ======= END - URL-PREF - MOVIE PAGE ===== */
  `;
}
if (location.href.startsWith("https://www.iafd.com/distrib.rme/distrib=") || location.href.startsWith("https://www.iafd.com/studio.rme/studio=")) {
  css += `
  /* Distributors / Studios */

  /* (new30) TOP HEADER - STICKY */
  .col-sm-12.col-md-8.col-md-push-2>h2 {
      position: sticky !important;
      top: 0vh !important;
      margin: -1vh 0 0 0 !important;
  	z-index: 500 !important;
  background: #111 !important;
  border-bottom: 3px solid red !important;
  }
  table#studio.table.display>thead  ,
  #distable>thead {
      position: sticky !important;
  	display: inline-block !important;
  width: 100% !important;
  	min-width: 64.7vw !important;
  	max-width: 64.7vw !important;
      top: 3.8vh !important;
  background: #111 !important;
  border-bottom: 3px solid aqua !important;
  }
  .dataTables_filter {
  	position: absolute !important;
      float: none !important;
      height: 24px !important;
      line-height: 20px !important;
      margin: 0 0 0 0 !important;
  	top: -3vh !important;
  	right: 0 !important;
      padding: 0 0 0 0px !important;
      z-index: 5000000 !important;
  }
  table#studio.table.display>tbody  ,
  #distable>tbody {
  	display: inline-block !important;
  width: 100% !important;
  	min-width: 64.7vw !important;
  	max-width: 64.7vw !important;

  background: #111 !important;
  border-bottom: 1px solid violet !important;
  }
  table#studio.table.display>tbody>tr:nth-child(odd) ,
  #distable>tbody>tr:nth-child(odd){
      border-top: none !important;
      background: #222 !important;
  }
  table#studio.table.display>tbody>tr:nth-child(even) ,
  #distable>tbody>tr:nth-child(even) {
      background: #333 !important;
  }
  table#studio.table.display>tbody>tr.sorting_1 ,
  #distable>tbody>tr td.sorting_1  {
      border-bottom: 1px solid red !important;
  }

  /* ======= END - URL-PREF - DISTRIBUTORS / STUDIOS PAGE ===== */
  `;
}
if (location.href.startsWith("https://www.iafd.com/results.asp?searchtype=")) {
  css += `
  /* SEARCH */

  /* (new21) SEARCH - H1 */
  .row[style="margin-top: 1em;"] .col-xs-12>h1 {
      float: left !important;
      height: 30px !important;
      line-height: 20px !important;
      width: 100% !important;
      width: 450px !important;
      margin: -10px 0 0px  0px !important;
      font-size: 22px !important;
  }
  .FixedHeader_Cloned.fixedHeader.FixedHeader_Header:not([style^="position: fixed;"])  {
      position: absolute !important;
      display: inline-block !important;
      top: 85px !important;
      left: 2px;
      width: 100% !important;
      z-index: 50000 !important;
  }

  .FixedHeader_Cloned.fixedHeader.FixedHeader_Header th {
      height: 32px !important;
      line-height: 32px !important;
      padding: 0 35px 0 5px !important;
  }


  /* (new55) SEARCH - FEMALES / MALES / DIRECTORS / REVIEWS - TOP HEADER COUNTER */

  /* (new55) ALL RESULTS COUNTER */

  .dataTables_info {
  	position: fixed !important;
  	display: inline-block !important;
      width: auto !important;
  	height: 3vh !important;
  	line-height: 3vh !important;
  	top: 4.5vh !important;
  	padding: 0 5px 0 0px !important;
  	text-align: left !important;
  	font-size: 15px !important;
  	border-radius: 5px  5px  0 0 !important;
  	z-index: 500000 !important;
  	transition: height ease 0.7s  !important;
  color: white !important;
  background: #111 !important;
  border: 1px solid red !important;
  }
  /* HOVER */
  .dataTables_info:hover {
  	position: fixed !important;
  	display: inline-block !important;
      width: auto !important;
  	height: 7vh !important;
  	line-height: 1.8vh !important;
  	top: 4.5vh !important;
  	padding: 0 5px 0 0px !important;
  	text-align: left !important;
  	font-size: 15px !important;
  	border-radius: 5px  5px  0 0 !important;
  	z-index: 500000 !important;
  	transition: height ease 0.7s  !important;
  color: white !important;
  background: #111 !important;
  border: 1px solid red !important;
  }

  .dataTables_info:before {
  	position: relative !important;
  	display: inline-block !important;
      width: 100px !important;
  	height: 2.8vh !important;
  	line-height: 3vh !important;
  	left: 0 !important;
  	margin: 0 -90px 0 0 !important;
  	padding: 0 5px 0 5px !important;
  	border-radius: 5px  0px  0 0 !important;
  	text-align: right !important;
  }

  /* (new55) TITLES RESULTS COUNTER */
  #titleresult_info.dataTables_info {
  	width: 200px !important;
  	left: 630px  !important;
  	overflow: hidden !important;
  border: 1px solid olive  !important;
  }
  #titleresult_info.dataTables_info:before {
  	content: "Titles:  " !important;
  	width: 60px !important;
  background: olive !important;
  }

  /* (new55) FEM RESULTS COUNTER */
  #tblFem_info.dataTables_info {
  	width: 200px !important;
  	left: 885px  !important;
  	overflow: hidden !important;
  border: 1px solid green  !important;
  }
  #tblFem_info.dataTables_info:before {
  	content: "Females:  " !important;
  	width: 70px !important;
  background: green !important;
  }

  /* MAL RESULTS COUNTER */
  .dataTables_info#tblMal_info {
  	width: 200px !important;
  	left: 1110px  !important;
  	overflow: hidden !important;
  	text-overflow: ellipsis !important;
  border: 1px solid goldenrod  !important;
  }
  .dataTables_info#tblMal_info:before {
  	content: "Males:  " !important;
  	width: 65px !important;
  background: goldenrod !important;
  }


  /* (new55) REVIEWS RESULTS COUNTER */
  .dataTables_info#tblReviews_info {
  	width: 200px !important;
  	left: 1330px  !important;
  	overflow: hidden !important;
  border: 1px solid blueviolet !important;
  }
  .dataTables_info#tblReviews_info:before {
  	content: "Reviews:  " !important;
  	width: 70px !important;
  background: blueviolet !important;
  }

  /* ======= END - URL-PREF - SEARCH PAGE ===== */
  `;
}
if (location.href.startsWith("https://www.iafd.com/results.asp?searchtype=title&searchstring=")) {
  css += `
  /* SEARCH - MORE */
  .table.display.table-responsive > thead, 
  #titleresult > thead, table.dataTable#titleresult > thead {
      position: sticky !important;
      display: inline-block !important;
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      top: 0vh !important;
      margin: 0 0px 15px !important;
      z-index: 50000 !important;
  background: aqua !important;
  }
  .dataTables_info {
      top: 0.8vh !important;
  border: 1px solid red !important;
  }

  table.dataTable#titleresult:not(#deadpornstars) {
  	position: fixed !important;
  	display: inline-block !important;
      border-collapse: separate;
      border-spacing: 0px;
  	height: 100% !important;
  	max-height: 95vh !important;
      
      width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
  	top: 4vh  !important;
  	left: 0 !important;
      margin: 0px 0px 0px !important;
      padding-bottom: 40px !important;
      overflow: hidden !important;
  	overflow-y: auto !important;
  background: olive !important;
  border: 1px solid yellow!important;
  }
  `;
}
if (location.href.startsWith("https://www.iafd.com/advsearch.asp")) {
		css += `
		/* SEARCH - ADVANCED */

		.container-fluid .row {
			display: inline-block !important;
			width: 100%  !important;
			min-width: 100vw  !important;
			max-width: 100vw !important;
		    margin: 0 !important;
		}
		.col-md-push-2 {
			width: 100%  !important;
			min-width: 100vw  !important;
			max-width: 100vw !important;
			left: 0%;
			background-color: #222 !important;
		border: 1px solid red ;	
		}
		.panel {
			display: block !important;
			float: left !important;
		    width: 32.5% !important;
			height: 200px !important;
		    margin: 0 5px 5px 0 !important;
		    border-radius: 4px;
		box-shadow: 0 1px 1px rgba(0, 0, 0, .05);
		background-color: #fff;
		border: 1px solid red ;	
		}

		.panel-heading h2 {
			height: 1.5vh !important;
			line-height: 1.5vh !important;
		    margin: 0 0 0 0 !important;
			font-size: 18px;
			color: gold !important;
		}

		/* TATTOOS SEARCH */
		/*.panel-default:nth-child(10)*/

		/* (new50) PEOLIC IDEA - TATTOOS SEARCH - LAST POSITION */
		/* https://gist.github.com/peolic/9e2981a8a14a49b9626cb277f878b157 */
		.col-md-push-2 {
		        display: flex !important;
		        flex-wrap: wrap !important;
		}
		.panel-default {
		        float: unset !important;
		}
		.panel-default:nth-child(10) {
			order: 1 !important;
			height: 300px !important;
		}

		/* OFF LINE */
		/*.panel-default:nth-child(13) ,
		.panel-default:nth-child(11) {
		    display: none  !important;
		}*/

		.panel-default:nth-child(11) {
			position: fixed !important;
		    display: inline-block !important;
			width: 10% !important;
			height: 5vh !important;
			right: 0 !important;
			top: 7vh  !important;
			text-align: center !important;
		}
		.panel-default:nth-child(13) {
			position: fixed !important;
		    display: inline-block !important;
			width: 15% !important;
			height: 5vh !important;
			right: 200px !important;
			top: 7vh  !important;
			text-align: center !important;
		}

		.panel-default:nth-child(13) > .panel-heading ,
		.panel-default:nth-child(11) > .panel-heading {
			display: inline-block !important;
			width: 100% !important;
			height: 2.2vh  !important;
			line-height: 15px !important;
			padding:  2px 0 !important;
			font-size: 17px  !important;
		    color: #333;
		    background-color: red !important;
		    border: none !important;
		}
		.panel-default:nth-child(13) .panel-body  ,
		.panel-default:nth-child(11) .panel-body {
			display: inline-block !important;
			height: 1.5vh  !important;
			line-height: 15px !important;
			width: 100% !important;
			min-width: 150px !important;
			max-width: 150px !important;
			padding: 0 !important;
			margin:  0vh 0 0 0 !important;
			top: 0vh !important;
			font-size: 10px !important;
		/*background: green!important*/
		}



		form {
			padding: 5px !important;
			text-align: center !important;
		color: gold !important;
		background: #111 !important;
		}
		.form-horizontal[action="searchvendormovie.rme/"] .form-group  {
			display: inline-block !important;
			width: 100%  !important;
			margin: 0 0 0 0 !important;
			padding: 0 5px !important;
			text-align: center !important;
		color: gold !important;
		background: #111 !important;
		/*border: 1px solid aqua !important;*/
		}

		.form-horizontal .control-label {
		    display: inline-block !important;
			width: 100%  !important;
			min-width: 100% !important;
			max-width: 100% !important;
			margin: 0 0 0 0 !important;
		    padding: 0 5px !important;
		    text-align: center !important;
		color: peru !important;
		}

		.form-horizontal[action="searchvendormovie.rme/"] .form-group input.form-control {
		    display: inline-block !important;
			width: 100%  !important;
			min-width: 530px !important;
			max-width: 530px !important;
		    height: 3vh !important;
		    padding: 6px 12px;
		    font-size: 14px;
			margin: 0 0 2vh 0 !important;
		    line-height: 1.42857143;
		/*color: gold !important;*/
		/*background-color: green !important;*/
		border: 1px solid yellow !important;
		}

		.form-horizontal[action="searchvendormovie.rme/"] .form-group .col-xs-offset-3  {
		    display: inline-block !important;
			width: 100%  !important;
			min-width: 560px !important;
			max-width: 530px !important;
		    height: 5vh !important;
		    padding: 6px 12px;
		    font-size: 14px;
			margin: 0 0 0vh 0 !important;
		    line-height: 1.42857143;
		color: gold !important;
		/*background-color: green !important;*/
		/*border: 1px solid yellow !important;*/
		}

		form[action="/rarities.asp"] p input {
		    margin: 4px 5px 0 0 !important;
		}


		/* (new51) SHADOW ROOT */
		/*slot#select-options option*/
		.form-horizontal[action="searchvendormovie.rme/"] .form-group input.form-control,
		.col-xs-9 input.form-control div,
		select {
			color: var(--shadow-test-gold) !important;
			background-color: var(--shadow-test-black) !important;
		}
		`;
}
if (location.href.startsWith("https://www.iafd.com/studio.asp")) {
  css += `
  /* SEARCH - STUDIO (new51) */

  .row form[action="/studio.rme/"]  {
      margin: 4px 5px 0 0 !important;
  	background-color: var(--shadow-test-black) !important;
  }

  .row form[action="/studio.rme/"] > input[type="text"] {
      display: inline-block !important;
      width: 50% !important;
      margin: 0 0 0 0 !important;
  	border: 1px solid red !important;
  }
  .row form select[size] {
  	width: 50%;
      height: 70vh !important;
  }

  /* (new51) SHADOW ROOT */
  .row form[action="/studio.rme/"] > input[type="text"]  {
  	color: var(--shadow-test-gold) !important;
  	background-color: var(--shadow-test-black) !important;
  }
  select {
  	color: var(--shadow-test-gold) !important;
  	background-color: var(--shadow-test-black) !important;
  }
  select  option:nth-child(odd) {
      font-weight: normal;
      display: block;
      min-height: 1.2em;
      padding: 0px 2px 1px;
      white-space: nowrap;
  	background-color: var(--shadow-test-222) !important;
  }

  /*  END  */
  `;
}
if (location.href === "https://www.iafd.com/") {
  css += `
  /* HOMEs */

  /* SUPP */
  .img-responsive.bancol {
      display: none !important;
  }
  .img-responsive.center-block {
      height: auto;
      width: 15% !important;
  object-position: center center !important;
  }


  figure.aligncenter.size-large ,
  figure.wp-block-image.size-large {
      width: 100%;
  text-align: center !important;
  }
  figure.aligncenter.size-large img ,
  figure.wp-block-image.size-large img {
      height: auto;
      width: 40% !important;
  object-position: center center !important;
  }


  /* COLOR */

  #ajax_tooltipObj .ajax_tooltip_arrow  ,
  #ajax_tooltipObj .ajax_tooltip_content {
      background-color: #333 !important;
  }

  .popsearch  ,
  div.bdayperson {
      background-color: #222 !important;
  }
  /* ======= END - URL-PREF - HOME PAGE ===== */
  `;
}
if (location.href.startsWith("https://www.iafd.com/calendar.asp?")) {
  css += `
  /* Calendar (new50) */

  .container > .row.bottom-space:first-of-type {
      position: fixed;
  	display: inline-block !important;
  	width: 300px  !important;
  	height: 3vh !important;
  	line-height: 3vh !important;
      top: 5vh !important;
  	left: 0 !important;
  	margin: 0 !important;
  	font-size: 15px !important;
  	z-index: 500 !important;
  background: red !important;
  }
  .container > .row.bottom-space:first-of-type h1 {
  	display: inline-block !important;
  	height: 3vh !important;
  	line-height: 3vh !important;
      top: 0vh !important;
  	margin: 0;
  	font-size: 15px !important;
  	z-index: 500 !important;
  	background: red !important;
  }

  .row.bottom-space + .row.bottom-space .col-sm-12.col-lg-3 {
      position: fixed;
  	display: inline-block !important;
  	width: 300px  !important;
  	height: 60vh !important;
  	line-height: 3vh !important;
      top: 8.5vh !important;
  	left: 0 !important;
  	margin: 0 !important;
  	font-size: 15px !important;
  	z-index: 500 !important;
  background: red !important;
  }

  .row.bottom-space + .row.bottom-space {
      position: fixed;
  	display: inline-block !important;
  	width: 82.5%  !important;
  	height: 94vh !important;
  	line-height: 3vh !important;
      top: 5vh !important;
  	left: 17% !important;
  	margin: 0 !important;
  	font-size: 15px !important;
  	overflow: hidden !important;
  	/*overflow-y: auto !important;*/
  	z-index: 500 !important;
  background: red !important;
  }
  .row.bottom-space + .row.bottom-space  .col-sm-12.col-lg-9 {
  	display: inline-block !important;
  	width: 100%  !important;
  	min-width: 100%  !important;
  	max-width: 100%  !important;
  	height: 93vh !important;
  	line-height: 3vh !important;
      top: 0vh !important;
  	left: 0% !important;
  	margin: 0 !important;
  	font-size: 15px !important;
  	overflow: hidden !important;
  	/*overflow-y: auto !important;*/
  	z-index: 500 !important;
  background: #222 !important;
  }
  .row.bottom-space + .row.bottom-space  .col-sm-12.col-lg-9 .row {
  	display: inline-block !important;
  	width: 100%  !important;
  	min-width: 100%  !important;
  	max-width: 100%  !important;
  	height: 90vh !important;
  	line-height: 3vh !important;
      top: 0vh !important;
  	left: 0% !important;
  	margin: 0 0 0vh 0 !important;
  	padding: 0.5vh 0 4vh 0 !important;
  	font-size: 15px !important;
  	overflow: hidden !important;
  	overflow-y: auto !important;
  	z-index: 500 !important;
  /*background: green !important;*/
  }
  .row.bottom-space + .row.bottom-space  .col-sm-12.col-lg-9 .row .col-sm-4 {
  	width: 13.8% !important;
  	margin: 0 5px 5px 0 !important;
  	border-radius: 5px  !important;
  background: #111 !important;
  }
  /* Calendar (new50) - END - URL-PREF === */
  `;
}
if (location.href.startsWith("https://www.iafd.com/matchups.rme/perfid=")) {
  css += `
  /* IFRAME PARING (empty)*/

  `;
}
if ((location.hostname === "rame.net" || location.hostname.endsWith(".rame.net"))) {
		css += `
		/* Rame.Net */

		/* WIDE  */
		table {
			width: 100%  !important;
			min-width: 100%  !important;
			max-width: 100%  !important;
			height: 93vh !important;
			line-height: 3vh !important;
		    top: 0vh !important;
			left: 0% !important;
			margin: 0 0 0 0 !important;
			padding: 0 20% 0 20% !important;
			font-size: 15px !important;
		color: silver !important;
		background: #222 !important;
		}

		/* TOC */
		table tbody tr:has(.toc1)  {
			background: #333 !important;
		}
		table tbody tr:has(.toc1) a:has(.toc1) {
			display: block !important;
			float: left  !important;
			width: 48% !important;
			height: 9vh !important;
			line-height: 3vh !important;
			margin: 0 5px 5px 13px !important;
			padding: 0 0 0 0 !important;
			font-size: 18px  !important;
			text-decoration: none !important;
			text-align: center !important;
		background: brown !important;
		border: 1px solid aqua  !important;
		}
		table tbody tr:has(.toc1) a:has(.toc1) .toc1 {
			display: inline-block !important;
			vertical-align: middle !important;
			height: auto !important;
			line-height: 2vh !important;
			margin: 2vh 0 0 0 !important;
		    padding: 0 0 0 0 !important;
			font-size: 15pt;
			text-decoration: none !important;
		}

		H1 {
		display: block !important;
		float: left !important;
			width: 100% !important;
		    background-color: #eeeeee;
		    border: none;
		    
		}

		/* COLOR */
		a {
		color: peru !important;
		}

		body {
		    color: silver !important;
		background: #111 !important;
		}


		.fquote {
		    color: silver !important;
		background: #111 !important;
		}

		td[bgcolor="#FBFFD9"] {
		    color: silver !important;
		background: #111 !important;
		}


		/* ZEBRA */
		.rowon {
		    color: silver !important;
		background: #111 !important;
		}
		.rowoff {
		    color: silver !important;
		background: #333 !important;
		}


		`;
}
if (location.href.startsWith("https://www.rame.net/amri/")) {
		css += `
		/* Rame.Net - Review sites */

		a[href="https://www.rame.net/reviews/heretic"] ,
		a[href*="rogreviews.com"] ,
		a[href="http://www.rogreviews.com"] ,

		a[href="/reviews/imperator/index.html"] {
			display: inline-block !important;
			width: 30% !important;
			text-align: center !important;
		color: peru !important;
		border: 1px solid yellow  !important;
		}

		/* NOT WORKING LINKS */
		table td[align="center"] td:has(a[href="http://amri.iafd.com/title-search.asp"]) ,
		table td[align="center"] td:has(a[href="http://amri.iafd.com/author-search.asp"]) ,
		table td[align="center"] td:has(a[href="http://amri.iafd.com/reviews.asp"]),
		a[href="http://www.mrwebreview.com"] ,
		a[href*="adultvhsreviews.com"] ,
		a[href="http://www.adultdvdreviews.com"] ,
		a[href="http://www.dvdpornreviews.com"] ,
		a[href*="rogreviews.com"] {
			 display: none !important;
		}

		/* COLOR FILTER */
		img[src="/graphics/amri-head.gif"] {
		filter: invert(85%) !important;
		}




		`;
}
if (location.href.startsWith("https://www.rame.net/reviews/imperator/par")) {
		css += `
		/* Rame.Net - Imperator */

		body {
			padding: 0 25% 0 25% !important;
		    color: silver !important;
		    background: #111 !important;
		}
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
