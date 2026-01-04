// ==UserScript==
// @name NameThatPornStar / NameThatPorn Widescreen Dark and Gray v.4.2
// @namespace namethatpornstar.com
// @version 4.2.0
// @description NameThatPornStar on large screen (1920x1080)...
// @author janvier56
// @license unlicense
// @grant GM_addStyle
// @run-at document-start
// @match *://*.namethatporn.com/*
// @match *://*.namethatpornstar.com/*
// @match https://embedy.me/*
// @downloadURL https://update.greasyfork.org/scripts/428272/NameThatPornStar%20%20NameThatPorn%20Widescreen%20Dark%20and%20Gray%20v42.user.js
// @updateURL https://update.greasyfork.org/scripts/428272/NameThatPornStar%20%20NameThatPorn%20Widescreen%20Dark%20and%20Gray%20v42.meta.js
// ==/UserScript==

(function() {
let css = "";
if ((location.hostname === "namethatporn.com" || location.hostname.endsWith(".namethatporn.com")) || (location.hostname === "namethatpornstar.com" || location.hostname.endsWith(".namethatpornstar.com"))) {
  css += `

  /* ==== X NameThatPornStar / NameThatPorn - Widescreen Dark and Gray v.4 - TEST FRESH ==== */


  /* SUPP */
  .a_bbf_w ,
  .id_answer> .item_img_container + br ,
  .id_answer>a>br ,
  .bms_slider_div ,
  .row.helper ,
  .navbar > div:first-child ,

  .a_br ,
  #fab_blacko ,
  .container.footer ,
  .comment--deleted  ,
  #smb ,
  .item.part_a ,
  #item_share ,
  #pinnu_blacko ,
  #site_message_man {
  display: none !important;
  }



  .item {
      border-radius: 3px !important;
      border: 1px solid gray !important;
  }
  .item_title  {
      padding: 5px !important;
      line-height: 15px !important; 
      font-size: 15px !important; 
      background: #333 !important;
      color: gray !important; 
  }
  .item_info ,
  .item_answer {
      padding: 5px !important;
      background: #333 !important;
      color: gray !important; 
  }
  .ia_text b {
      color: peru !important; 
  }
  .item_featured ,
  .item_solved {
      transform: scale(0.5) !important;
      transform-origin: top right !important;
  }


  #item_detail_wrapper ,
  #sidebar {
      background: #222 !important;
      border-right: 1px solid gray !important; 
  }

  #nsw_f_d_desc ,
  .sdbrsts_dta ,
  .lc_para,
  .id_answer ,
  .ida_confirm_usernames  ,
  .ud_unme ,
  #id_description,
  #unsolved_title, 
  #related_title, 
  #sites_title {
      color: gray !important;
  }

  html {
      overflow-y: scroll;
      height: 100% !important;
  }
  body {
      position: relative;
      right: 0;
      width: 100%;
      height: 100% !important;
      min-height: 100% !important;
      max-height: 100% !important;
  /*     padding-top: 70px; */
  padding-top: 0px !important;
      font-size: 13px;
      overflow-y: scroll;
      color: gray !important;
      background-color: #222 !important;
  }

  /* (new3) TOP ALERT */
  h3[style^="text-align: center; color: red;"]  {
    position: absolute;
    width: 170px !important;
    top: 55px;
    padding: 5px;
  color: red;
  background: gold !important;
  }


  /* (new2) TOP HEADER - === */
  .navbar__bottomrow .container .row > div:first-of-type {
      position: absolute !important;
      left: 0 !important;
      transform: scale(0.7);
      transform-origin: center left !important;
  }
  .navbar__bottomrow .container .row > div:last-of-type {
      position: absolute !important;
      width: 400px !important;
      right: 0px !important;
  }
  .tabs {
    position: fixed;
    height: 30px !important;
    width: 50% !important;
    top: 5px !important;
  left: 20% !important;
    transition: top 300ms ease 0s;
    z-index: 1000 !important;
  background: #333 !important;

  }
  .tabs::after {
    background-color: #333;
    content: "";
    height: 2px;
    margin-top: 10px;
    position: absolute;
    width: 100%;
  }
  #tabs.tabs .tab {
    float: right;
    height: 20px !important;
    line-height: 20px !important;
    margin-right: 5px;
    padding-left: 13px;
    padding-right: 13px;
    position: relative;
    top: 9px !important;
    transition: opacity 200ms ease 0s;
  }
  #tabs.tabs .container  {
    height: 30px !important;
    width: 100% !important;
    margin-top: 0 !important;
  }
  .tabs .container .userinfo .username {
    float: left !important;
    margin-right: 21px !important;
  }
  .tabs .container .userinfo .points {
    float: right !important;
    color: gold !important;
  }

  .mainmenu {
    position: fixed;
    width: 100%;
    right: 0;
    top: 0;
    padding-bottom: 14px;
    padding-top: 0;
    transition: box-shadow 0s ease 0s, all 400ms cubic-bezier(0.23, 1, 0.32, 1) 0s;
    box-shadow: 0 5px 5px rgba(0, 0, 0, 0.25);
    z-index: 50000 !important;
  }
  .mainmenu--open {
    opacity: 1;
    pointer-events: auto;
    transform: translateY(0%);
  background-color: black !important;

  }



  /* (new2) ARROWS VOTE UP DOWN - PB CHROME - === */
  .comment__confirm__button--votedown .icon {
      background-image: url("https://namethatpornstar.com/img/icons-comment.png") !important;
      background-position: -16px center !important;
      background-repeat: no-repeat;
      background-size: 64px 10px;
      display: block;
      height: 10px;
      left: 0;
      margin-left: auto;
      margin-right: auto;
      position: relative;
      right: 0;
      top: 7px;
      width: 16px;
  }
  .comment__confirm__button--voteup .icon {
      background-image: url("https://namethatpornstar.com/img/icons-comment.png") !important;
      background-position: 0 center;
      background-repeat: no-repeat;
      background-size: 64px 10px !important;
      display: block;
      height: 10px;
      left: 0;
      margin-left: auto;
      margin-right: auto;
      position: relative;
      right: 0;
      top: 6px;
      width: 16px;
  }
  .comment__confirm__button--votedown:hover:not(.comment__confirm__button--selected) .icon {
      background-position: -48px center !important;
  }

  /* (new2) SEARCH CATEGORIE - TITLE - === */
  .category {
  position: fixed !important;
      display: inline-block !important;
      height: 37px;
      line-height: 37px !important;
  /*     width: 1091px; */
      width: 50% !important;
      left: 20% !important;
      top: 2px !important;
      text-align: left !important;
      background-color: #292929 !important;
      border-bottom: 1px solid red !important;
  z-index: 2000 !important;
  }
  .category .container {
    width: 100%;
  }

  .category .container h1 ,
  .category .container {
      display: inline-block !important;
      height: 37px;
      line-height: 37px !important;
  }
  .category .container .row {
    height: 37px !important;
  }


  .category + #content.content.search{
      margin-top: 42px !important;
  border-top: 1px solid red !important;
  }

  .allcontent.allcontent--comments {
      margin-top: 49px !important;
  border: 1px dotted red !important;
  }
  .allcontent--comments .allrequests {
      float: left;
      width: calc(100% - 228px);
  border: 1px solid red !important;
  }
  .top__background {
      background-color: #292929 !important;
      overflow: hidden;
      width: 100%;
  }
  .maintitle h1, 
  .category h1 ,
  .maintitle h1 a, 
  .category h1 a {
      color: peru !important;
  }

  /* (new2) FORUM - === */
  #item_detail_wrapper {
      width: 75% !important;
  margin-right: 20px !important;
  padding: 0 !important;
  background: #111 !important;
  }
  /* QUESTION */
  #item_detail_wrapper #item_question  {
      float:left !important;
  clear: none !important;
      width: 48.9% !important;
  height: 200vh !important;
      padding: 5px !important;
  background-color: #111 !important;
  border: 1px solid red !important;
  }

  /* NOT LOGGED - NEED */
  #id_ready_to_comment_but_first_login {
      display: none !important;
  }

  /*  ANSWER ITEMS */
  .id_answer_wrapper {
  /* display: inline-block !important; */
  /* float: none !important; */
  float: left !important;
  clear: none !important;
  display: inline-block !important;
  height: auto !important;
      width: 48.9% !important;
  /* margin-left : 20px !important; */
  /*     padding: 0 20px; */
      padding: 5px !important;
  overflow: hidden !important;
  /*     border-bottom: 2px solid #ededed; */
  border: 1px dotted aqua !important;
  }
  .id_answer:not([itemprop="text"]) {
  display: inline-block !important;
  vertical-align: bottom !important;
  height: auto !important;
      line-height: 15px !important;
  /* margin-left : 20px !important; */
      padding: 0  !important;
  text-align: left !important;
      overflow-wrap: break-word !important;
  overflow: hidden !important;
  overflow-y: auto !important;
  }

  /* .id_answer b  , */
  .id_answer>a:not(.name_syntax){
  position: relative !important;
  display: inline-block !important;
  /* float: left !important; */
      line-height: 15px !important;
  width: 100% !important;
  min-width: 550px !important;
  max-width: 550px !important;
  left: -15px !important;
  margin: 5px 20px 0px 20px !important;
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  /* outline: 1px solid violet !important; */
  }



  .id_answer a.name_syntax {
  padding: 0 5px !important;
      color: gold !important;
  background: #111 !important;
  }

  .ntpref_container{
      max-width: 400px !important;
  }


  .ntpref_wrapper {
      margin-bottom: 3px !important;
  }

  #id_media_wrapper .item_img {
      max-height: 35vh !important;
      vertical-align: bottom;
  }
  .id_answer .item_img {
      max-height: 250px !important;
      max-width: 500px !important;
  }

  /* IMAGE GALLERIE -  picture source */

  .id_answer .item_img_container {
  /* display: inline-block !important; */
  float: left !important;
  clear: right !important;
      width: 183px !important;
  min-height: 140px !important;
  max-height: 140px !important;
  margin-right: 2px !important;
  margin-left: 5px !important;
  /* top: 95px !important; */
      padding: 5px 2px !important;
  /* overflow: hidden !important; */
  text-align: center !important;
  color: gold ;
  background: #111 ;
  }
  .id_answer .item_img {
  height: 140px !important;
      width: 170px !important;
  object-fit: contain !important;
  }

  /* #correct_answer .id_answer .item_img_container:only-of-type {
  float: left !important;
  clear: right !important;
      width: 100% !important;
      min-width: 595px !important;
      max-width: 595px !important;
  min-height: 140px !important;
  max-height: 140px !important;
  margin-right: 2px !important;
  margin-left: 5px !important;
      padding: 5px 2px !important;
  text-align: center !important;
  color: gold ;
  background: blue !important;
  border: 1px solid yellow !important;
  } */


  /* #correct_answer .id_answer .item_img_container:only-of-type  .item_img {
  height: 140px !important;
      width: 100% !important;
  object-fit: contain !important;
  } */


  .id_answer> .item_img_container + br + br {
  display: inline-block !important;
  /*     width: 182px !important;
  /* height: 10px !important; */
  /*     margin-bottom: -10px !important; */
  }

  /* VIDEO EMBEDED */
  .ntpembd.vid {
      display: inline-block;
      width: 95% !important;
  }
  .ntpembd_frame {
      border-top-left-radius: 3px;
      border-top-right-radius: 3px;
      height: 334px;
      width: 100% !important;
      max-height: 15vh !important;
      vertical-align: bottom;
  background: #393d43 none repeat scroll 0 0;
  }


  /* COMMENT NOTICE */
  #item_detail_wrapper #idanr:before {
      content: "⚠️💬" ;
  position: absolute !important;
      width: 20px !important;
      height: 63px !important;
      line-height: 63px !important;
      line-height: 30px !important;
  top: 0px !important;
  left: 0 !important;
      padding: 0 !important;
  text-align: center !important;
  font-style: normal;
  font-size: 15px !important;
  color: gold ;
  background: red ;
  }

  #item_detail_wrapper #idanr {
  position: absolute !important;
  /*     float: left !important; */
      width: 20px !important;
  height: 63px !important;
  top: 95px !important;
      padding: 0 !important;
  overflow: hidden !important;
  color: gold ;
  background: black ;
  }
  #item_detail_wrapper #idanr:hover {
  position: absolute !important;
  /*     float: left !important; */
      width: 32% !important;
  top: 95px !important;
      padding: 0 !important;
  color: gold ;
  background: black ;
  }


  /* ANSWER COMMENTS */
  .id_comment_wrapper{
  float: left !important;
  clear: none !important;
  /* display: inline-block !important; */
      width: 49.9% !important;
  margin: 0 !important;
      padding: 20px 0;
  color: gold ;
  background: black ;
  }
  .id_answer_wrapper  + #idanr +.id_answer_wrapper{
  /* display: inline-block !important; */
  /* float: left !important; */
  /* clear: both !important; */
  /*     margin-top: -160px !important; */
  }

  /* ANSWERS ITEMS */
  .id_answer>br {
      display: block !important;
      margin-bottom: -1px !important;
  }

  /* ANSWER - PAGI */
  .idaf_pagi {
  float: left !important;
  width: 96.5% !important;
      padding: 20px;
      text-align: center;
  background: red !important;
  border-bottom: 2px solid #ededed;
  }
  /* SIDE */

  #item_detail_side {
      float: left;
      max-width: 50% !important;
      padding: 0 0 0 15px;
  }

  /* NOTICE COMMENT - EXTRA POINTSM */
  #extra_points {
  position: relative !important;
      float: none !important;
  /* clear: none !important; */
      display: inline-block !important;
      width: 46.5% !important;
      border-bottom: 2px solid #ededed;
  color: gold !important;
  background: #222 !important;
  border: 1px solid red !important;
  }

  /* COMMENT FORM */
  #idaf.dt {
  position: relative !important;
      float: none !important;
  /* clear: none !important; */
      display: inline-block !important;
      width: 49.7% !important;
      border-bottom: 2px solid #ededed;
  border: 1px solid red !important;
  }
  #idaf .dr {
      display: inline-block !important;
      width: 100% !important;
  }
  #idaf .dr #idaf_p.dc {
      display: inline-block !important;
      width: 15% !important;
  padding: 5px !important;
  }

  #idaf .dr #idaf_c.dc {
      display: inline-block !important;
      width: 80% !important;
  padding: 5px !important;
  }
  #idaf .dr #idaf_c.dc .idaf_ta.inpt.autosize  {
      display: inline-block !important;
      width: 96.8% !important;
  padding: 5px !important;
  }


  /* DELETED NOTICE */
  #deleted_question  {
  position: relative !important;
      float: left!important;
  /* clear: none !important; */
      display: inline-block !important;
      width: 49.1% !important;
  padding: 0 5px !important;
      border-bottom: 2px solid #ededed;
  color: gold !important;
  background: rgba(255, 0, 0, 0.57) !important;
  }
  #deleted_question #deleted_icon {
      padding-top: 0px !important;
  color: gold !important;
  /* background: #111 !important; */
  }
  #deleted_description {
      color: gray !important;
  }

  /* (new2) WIDE */
  .sp-separator + #content ,
  .sp-separator + #content.content.search ,
  .searchform + #content.content.search {
  /* display: inline-block !important; */
  /*     height: auto!important; */
  /*      max-height: 100% !important; */
  /*     max-height: 1500px !important; */
  /*     min-height: 1500px !important; */
      min-width: 98% !important;
      max-width: 98% !important;
  margin-bottom: 0px !important;
      padding: 5px !important;
  border: 1px dotted red !important;
  }

  #top_wrapper {
      display: inline-block !important;
      width: 100%;
      height: 19px !important;
      z-index: 9999999;
  }
  #top_row {
      display: inline-block !important;
      width: 100% !important;
      height: 100% !important;
      min-height: 20px !important;
      max-height: 20px !important;
  }
  #logo {
      display: inline-block !important;
      height: 100% !important;
      min-height: 20px !important;
      max-height: 20px !important;
      width: 160px !important;
  /*     padding: 0 20px !important; */
  /* transform: scale(0.8) !important; */
  /* background-position: left top !important; */
  	background-size: contain !important;
  }
  #logo_star {
      color: #ffffff;
      left: 100px;
      position: absolute;
      top: 0px !important;
      margin: 4px 0 0 5px !important;
  }
  #action_box {
      display: inline-block !important;
      width: 1448px !important;
      height: 100% !important;
      min-height: 20px !important;
      max-height: 20px !important;
      vertical-align: middle;
      margin-top: -13px !important;
      padding: 0 20px;
      background: #393d43;
  }
  #submit_box_wrapper {
      display: inline-block !important;
      width: 100%;
      max-height: 15px !important;
      line-height: 15px !important;
      border: 2px solid #3f4349;
      border-radius: 5px;
  }
  #submit_box_row {
      display: inline-block !important;
      max-height: 15px !important;
      line-height: 15px !important;
      width: 1448px !important;
  }
  #submit_box_field{
      display: inline-block !important;
      max-height: 15px !important;
      line-height: 15px !important;
      vertical-align: middle;
      padding: 0 20px;
  }
  input#submit_field ,
  #submit_field {
      display: inline-block !important;
      width: 1400px !important;
      max-height: 15px !important;
      line-height: 15px !important;
      padding: 0px 0 !important;
      color: #949698;
      font-size: 15px;
      background: transparent none repeat scroll 0 0;
  }
  #content2>form>label ,
  .searchform__tabs__content .tabs__content__form>label {
  position: absolute !important;
  display: inline-block !important;
  /* float: left !important; */
  /*     top: 0 !important; */
  left: 15px !important;
  }

  #login_box_ssl {
      display: inline-block !important;
      height: 20px !important;
      width: 260px;
      vertical-align: middle;
      margin-top: -13px !important;
      color: #fff;
      text-align: center;
      transition-duration: 0.5s;
      background: #ee145b;
  }

  /* SIDEBAR LEFT */
  #sidebar {
      position: absolute;
      float: left;
      width: 260px;
  max-height: 100vh !important;
  overflow: hidden !important;
  overflow-y: auto !important;
  border: 1px solid yellow !important;
  }

  /* CONTENT */
  .allcontent {
    margin-top: 47px !important;
  }



  #content_box {
      margin-top: -41px !important;
  }
  #content.content.content--tabs ,
  #content:not(.content--latest) {
  /*     display: inline-block !important; */
      min-width: 99% !important;
  /*     height: 100% !important; */
  /*     min-height: 1650px !important; */
  /*     max-height: 100% !important; */
      padding: 5px 19px !important;
  border: 1px solid red !important;
  border-top: 1px solid green !important;
  }

  #content .column.size-1of9 {
      float: left;
      width: 11.111%;
      height: 100% !important;
  /*     max-height: 1600px !important; */
  /* background: red !important; */
  }


  #content.content--latest {
  border: 1px solid red !important;
  /* border-top: 1px solid green !important; */
  }
  #sidebar + #content{
      margin: 0 0 0 260px !important;
  }
  #content[itemprop="mainContentOfPage"]  {
      min-width: 1622px !important;
      max-width: 1622px !important;
  /* height: 100vh !important; */
      padding-left: 5px !important;
      padding-right: 5px !important;
      overflow: hidden;
  /* overflow-y: auto !important; */
  /* background: blue !important; */
  /* outline: 1px solid violet !important; */
  }

  #content[itemprop="mainContentOfPage"] #items_wrapper  {
      max-width: 100% !important;
      overflow: hidden;
  /* background: red !important; */
  /* outline: 1px solid violet !important; */
  }

  #content.content.content--tabs {
      min-width: 100% !important;
      margin: 40px 0 0 0  !important;
  }
  #sp-separator-2  + #content.content.content--tabs {
      margin: 0  !important;
  }

  .content.content--tabs .activity #H2-3 {
      color: peru !important;
      left: 35% !important;
      position: absolute !important;
      top: 100px !important;
      width: 25% !important;
      z-index: 500;
  font-size: 17px !important;
  }
  .sp-separator + #content.content.content--tabs .container.activity .title  h2 {
      color: peru !important;
      left: 35% !important;
      position: absolute !important;
      top: -20px !important;
      width: 25% !important;
      z-index: 500;
  font-size: 17px !important;
  }
  .content.content--tabs .container.activity #H2-3 {
      top: -20px !important;
  }

  #nsw {
      display: inline-block !important;
      height: 100% !important;
      min-height: 100% !important;
      max-height: 100% !important;
      margin: 0 auto;
      max-width: 100% !important;
      min-width: 100% !important;
  color: gray !important;
  background: #222 !important;
  }
  #content_top_level {
      height: 23px;
  /* margin-bottom: 87px; */
      border-bottom: 2px solid #e2e2e2;
      padding-bottom: 20px;
  }

  #nsw>form {
  position: absolute !important;
      display: inline-block !important;
      max-width: 100% !important;
  /*     min-width: 100% !important; */
      left: 800px !important;
      margin-bottom: 0px !important;
      top: 50px !important;
  margin-top: -20px !important;
      padding: 0px 20px !important;
  text-align: center !important;
  border: 1px solid red !important;
  }
  #nsw_f {
  position: absolute !important;
      display: inline-block !important;
  min-width: 798px !important;
      max-width: 798px !important;
      height: 30px !important;
      left: 90px !important;
  /*     margin-bottom: 55px !important; */
  margin-top: 2px !important;
  padding: 0 20px !important;
  }
  #nsw_f .dt {
  display: inline-block !important;
      width: 100% !important;
  min-width: 778px !important;
      max-width: 778px !important;
      height: 100% !important;
      min-height: 30px !important;
      max-height:30px !important;
      margin-left: -196px !important;
      margin-top: 2px !important;
  }
  #nsw_f .dr {
  display: inline-block !important;
  /* float: left !important; */
  /* clear: both !important; */
      width: 100% !important;
  /*     min-width: 1300px !important; */
      max-width: 1300px !important;
      height: 100% !important;
      min-height: 30px !important;
      max-height: 30px !important;
      padding: 0 !important;
  }


  #nsw_f_inpt_w  {
  /*     display: inline-block !important; */
      width: 100% !important;
  min-width: 730px !important;
      max-width: 730px !important;
      height: 100% !important;
      min-height: 25px !important;
      max-height: 25px !important;
      padding: 0 !important;
  color: gold !important;
  }
  #nsw_f_inpt {
  /*     display: inline-block !important; */
      width: 100% !important;
  min-width: 700px !important;
      max-width: 700px !important;
      height: 100% !important;
      min-height: 25px !important;
      max-height: 25px !important;
      padding: 0 !important;
  color: gold !important;
  }

  #nsw_f_sbmt_w {
  /*     display: inline-block !important; */
  float: right !important;
      height: 100% !important;
      min-height: 30px !important;
      max-height: 30px !important;
      margin-top: -29px !important;
      padding: 0 !important;
  }
  input#nsw_f_sbmt {
  /*     display: inline-block !important; */
      height: 100% !important;
      min-height: 30px !important;
      max-height: 30px !important;
      padding: 0 !important;
  }

  #nsw_tls {
      margin-bottom: 35px !important;
      margin-top: -20px !important;
      color: #c2c2c2;
      padding: 0px !important;
  }
  #nsw_r {
      height: 737px !important;
      padding: 0 5px 5px;
  }

  .nsw_r_w {
      display: inline-block;
      height: 245px !important;
      width: 153px !important;
      margin-top: -34px !important;
      margin-right: 5px !important;
      margin-bottom: 40px !important;
  border-radius: 5px !important;
      overflow: hidden;
  border: 1px solid violet;
  }

  #nsw .nsw_r_w .dt {
      display: inline-block !important;
      height: 245px !important;
      width: 157px !important;

  }
  #nsw .nsw_r_w .dt .dr {
      display: inline-block !important;
      height: 245px !important;
      width: 153px !important;
  text-align:  left !important;
  }

  .nsw_r_thmb_w.dc {
      display: inline-block !important;
      width: 153px !important;
      vertical-align: middle;
  text-align:  center !important;
  }
  .nsw_r_rb.dc {
  /*     display: inline-block; */
      vertical-align: middle;
      float: right !important;
      height: 50px !important;
      line-height: 15px;
      width: 153px !important;
      margin-top: 1px;
      padding: 0 !important;
  }
  .nsw_r_tit {
  /*     display: inline-block; */
      float: left !important;
      width: 150px !important;
      line-height: 12px !important;
      color: #ed145b;
      font-size: 10px;
      font-weight: 300;
  }
  .nsw_r_det {
  /*     display: inline-block; */
      float: right !important;
      line-height: 12px !important;
  }

  .nsw_r_desc {
  position: relative !important;
  display: inline-block !important;
  /*     float: left !important; */
  height: 95px !important;
      line-height: 13px !important;
      width: 145px !important;
      margin-left: 0px !important;
  /* margin-top: 50px !important; */
  bottom: 0px !important;
  padding: 0 5px !important;
  font-size: 12px !important;
  overflow: hidden !important;
  overflow-y: auto !important;
  color: gray !important;
  }
  /* (new4) SEARCH THUMBNAIL */
  .linkifyplus >img ,
  #content.content.search .postbit__answer a.linkifyplus >img ,
  #content.content.search .postbit__img {
      position: relative;
      width: 100%;
      max-height: 290px !important;
      min-height: 50px;
      margin: 0;
      padding: 0;
      overflow: hidden;
      background-repeat: no-repeat;
      background-size: contain !important;
      box-shadow: 0 0 1px rgba(0, 0, 0, 0.25) inset;
      background-color: red !important;
  }

  /* (new2) FORUM SERACH - === */
  #hsf_wrap {
      float: right !important;
      height: 100% !important;
      min-height: 20px !important;
      max-height: 20px !important;
      width: 30% !important;
      margin-top: 0px;
      margin-right: 300px !important;
      padding-left: 0px !important;
      vertical-align: middle;
      background: #393d43 none repeat scroll 0 0;
  }
  #hsf_sbmt,
  #hsf_cont .dr div ,
  #hsf_cont .dr ,
  #hsf_cont {
      display: inline-block !important;
      height: 100% !important;
      min-height: 20px !important;
      max-height: 20px !important;
      line-height: 20px !important;
      vertical-align: top !important;
  }
  #hsf_wrap #hsf_fld {
      width: 100%;
      height: 100% !important;
      min-height: 20px !important;
      max-height: 20px !important;
      line-height: 12px !important;
      padding: 0;
      font-size: 12px;
  color: white !important;
  }
  #hsf_cont .dr {
      width: 100% !important;
  }
  #hsf_fld_wrp {
      width: 88% !important;
  }

  /* LOGIN BOX */
  #top_row #loggedin_box_new {
      position: absolute;
      display: inline-block;
      height: 20px;
      width: 228px;
      right: 20px !important;
      padding: 0 16px;
      transition-duration: 0.5s;
      vertical-align: middle;
      overflow: hidden !important;
  color: peru !important;
  background: #3d4147 ;
  }
  #loggedin_box_new:hover {
      position: absolute;
      display: inline-block;
      height: auto !important;
      width: 228px;
      right: 20px !important;
      padding: 0 16px;
      transition-duration: 0.5s;
      vertical-align: middle;
      overflow: hidden !important;
  color: peru !important;
  background: #3d4147 ;
  }
  #loggedin_box_new_avatar {
      height: 20px ;
      width: 20px ;
  }
  #event_dropper_wrapper {
      top: 19px !important;
  }
  /* FORUM - NEW POST BUTTON */
  #hcnp_wrap {
      float: right !important;
      height: 100% !important;
      min-height: 20px !important;
      max-height: 20px !important;
      width: 10% !important;
      margin-top: 0px;
      padding-left: 0px !important;
      vertical-align: middle;
      background: #393d43 none repeat scroll 0 0;
  }
  #h_cnp {
      padding: 0px 15px !important;
  }

  /* POSTS */

  /* POST - TITLE */
  .thread .maincolumn__title {
      font-size: 19px;
      letter-spacing: -1px;
      margin-top: -10px;
  color: violet !important;
      text-align: center;
      text-transform: capitalize !important;
      font-family: "Roboto",sans-serif !important;
  }
  /* POPUP */
  .thread__container.thread__container--open  .content.thread.content--thread  .maincolumn__title {
      width: 888px !important;
      font-size: 19px;
      letter-spacing: -1px;
      margin-top: -10px;
  color: violet !important;
      text-align: left !important;
      text-transform: capitalize !important;
      font-family: "Roboto",sans-serif !important;
  }

  /* POST - AUTHOR */
  .thread .maincolumn__author {
      color: #777;
      margin-bottom: 8px;
      margin-top: 16px;
  }

  /* POST - COMMENT */

  .thread__container--open .wrapper {
  background: #222 !important;
  }
  #thread__content.content.thread.content--thread {
      overflow: visible !important;
  background: #222 !important;
  }

  .comment:first-child {
      margin-top: 5px;
  }
  .comment {
      margin-bottom: 5px;
      padding: 2px 3px 3px 2px !important;
      background-color: #111 !important;
  }

  #item_content_box {
      margin: 0 auto;
      width: 100% !important;
  }

  #item_content_box #item_detail_side {
      float: left;
      padding: 0 0 0 5px;
      min-width: 360px !important;
      max-width: 360px !important;
  background: red !important;
  }
  #item_detail_side #other_unsolved, 
  #item_detail_side #related_items, 
  #item_detail_side #sites_items {
      overflow: hidden;
      width: 100% !important;
  }

  #item_detail_side #related_items {
      margin-bottom: 27px !important;
  }
  #unsolved_title, 
  #related_title, 
  #sites_title {
      font-size: 18px;
      margin-bottom: 15px;
  color: gold !important;
  background: #111 !important;
  }

  .ou_item {
  /*     display: inline-block !important; */
  float: left !important;
      background-color: #a7a7a7;
      border: 3px solid #ddd;
      display: inline-block;
      height: 102px;
      margin: 0 8px 10px 0;
      width: 102px;
  }


  #item_content_box #item_detail_side #other_unsolved{
      width: 100% !important;
      height: 395px !important;
  margin-top: 10px !important;
      padding-top: 25px !important;
      overflow: hidden;
      overflow-y: auto !important;
  border-top: 1px solid green !important;
  }
  #item_content_box #item_detail_side #other_unsolved #unsolved_title{
  position: absolute !important;
      min-width: 360px !important;
      max-width: 360px !important;
  top: 500px !important;
      margin: 0px 0 0 0 !important;
  }





  #other_unsolved_wrapper {
  /*   overflow: hidden; */
    width: 929px !important;
  }

  #other_unsolved_items {
    overflow: hidden;
    width: 929px;
  }




  /* POST - LINK/ FLAG ICON */
  .thread .maincolumn__photo__nav__button--flag, 
  .thread .maincolumn__photo__nav__button--link {
      position: absolute;
      left: -60px !important; 
      top: -56px;
  transform: scale(0.7) !important;
  z-index: 5000 !important;
  }

  /* POST - COMMENT CONFIRM */
  .comment__confirm {
  /*     position: absolute; */
  position: relative !important;
    width: 99% !important;
      height: 30px !important;
      line-height: 30px !important;
      margin-left: 0px !important; 
  /*     top: 6px; */
  margin-bottom: 0px !important;
  bottom: 0px !important;
      padding: 2px !important;
  background: #111 !important;
  /* border: 1px solid red !important; */
  }
  /* .comment--correct .comment__confirm__button--thanks {
      display: inline-block;
      width: 64px;
  } */
  .comment__confirm__button--thanks {
      display: inline-block;
      width: 64px;
      line-height: 19px !important;
      height: 15px !important;
      margin-top: -2px !important;
      font-size: 15px !important;
  }

  /* POST - COMMENT PREVIEW */
  .comment__previews>a:before {
  content: " > (" attr(href)")" ;
      display: inline-block;
    width: 740px !important;
      color: #337ab7;
  }
  .comment__previews>a:visited:before {
  content: " > (" attr(href)")" ;
      display: inline-block;
    width: 740px !important;
  color: tomato ;
  }
  /* POPUP */
  .thread__container.thread__container--open  .content.thread.content--thread .comment__previews>a:before {
  content: " > (" attr(href)")" ;
      display: inline-block;
    width: 570px !important;
      color: #337ab7;
  }
  .comment__previews>a:visited:before {
  content: " > (" attr(href)")" ;
      display: inline-block;
    width: 570px !important;
  color: tomato ;
  }

  /* LINKS  */

  .postbit a .postbit__img{
      border: 2px solid gray !important;
  }
  .postbit a:visited .postbit__img{
      max-height: 200px;
      min-height: 50px;
      overflow: hidden;
      border: 2px solid red !important;
  }
  .comment__info {
      display: inline-block !important;
  float: none !important;
  width: 100% !important;
  margin-top: 15px !important;
  border-top: 1px dashed gray !important;
  }
  .comment__info a {
      display: inline-block !important;
  float: none !important;
  width: 100% !important;
      text-decoration: none !important;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: peru;
  }
  .comment__text a:not(.pornstar) {
      display: inline-block !important;
  width: 100% !important;
      min-width: 50px !important;
      max-width: 740px !important;
      text-decoration: none !important;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: peru;
  }
  /* GOOGLE SEARCH LINK */
  .thread__container.thread__container--open  .content.thread.content--thread .comment__text>a:not(.pornstar)[href^="https://www.google.com/search?q="] {
      display: inline-block !important;
  width: 100% !important;
      min-width: 50px !important;
      max-width: 740px !important;
      text-decoration: none !important;
      white-space: nowrap !important;
      overflow: hidden !important;
      text-overflow: ellipsis !important;
      color: peru !important;
  }


  /* POPUP */
  .thread__container.thread__container--open  .content.thread.content--thread .comment__text>a:not(.pornstar) {
  display: inline-block !important;
  width: 100% !important;
      min-width: 100% !important;
      max-width: 100% !important;
      text-decoration: none !important;
      white-space: pre-wrap !important;
      overflow: hidden;
      text-overflow: ellipsis;
      color: peru;
  /* background: red !important; */
  }

  .comment__text a:not(.pornstar):visited {
      color: tomato !important;
  }

  /* POPUP INFOS */
  #thread__container.thread__container.thread__container--open  .thread__container__close + #thread__wrapper #thread__content.content.thread.content--thread .container > .row {
      display: inline-block !important;
      margin-left: -15px;
      margin-right: -15px;
  }
  /* POPUP INFOS MAIN */
  #thread__container.thread__container.thread__container--open  .thread__container__close + #thread__wrapper #thread__content.content.thread.content--thread .container > .row  .maincolumn {
      width: 65.667%;
  padding: 5px !important;
  border: 1px solid gray !important;
  }
  /* POPUP INFOS  - TUMBNAILS PANEL */
  .col-xs-4.col-sm-6.col-lg-4.thumb__wrapper a{
      background-color: green !important;
  }

  .col-xs-12.col-sm-4.col-lg-4.sidecolumn {
      position: relative;
      float: right !important;
      min-height: 1px;
  max-height: 84vh !important;
      padding-left: 15px;
      padding-right: 15px;
  overflow: hidden !important;
  overflow-y: auto !important;
  }
  .sidecolumn .row .thumb__wrapper .thumb {
      position: relative;
      height: 120px !important;
      margin: 0 5px 10px;
      overflow: hidden;
  /* transition: none !important; */
  border: 1px solid gray !important;
  box-shadow: 3px 2px 2px rgba(96, 96, 96, 0.98) !important;
  background-color: red !important;
  background-color: #111 !important;
  }
  .sidecolumn .row .thumb__wrapper .thumb img {
      display: inline-block !important;
      height: 120px !important;
      line-height: 15px !important;
      width: 100% !important;
      object-fit: cover !important;
  /* transition: none !important; */
  background-color: black !important;
  }
  /* .sidecolumn .row .thumb__wrapper .thumb::after, 
  .sidecolumn .row .thumb__wrapper .thumb:before {
  transition: none !important;
  background-color: red !important;
  } */
  /* POPUP INFOS PHOT */
  #thread__container.thread__container.thread__container--open .thread__container__close + #thread__wrapper #thread__content.content.thread.content--thread .container > .row .maincolumn .maincolumn__photo {
      position: relative;
      display: inline-block !important;
  float: left !important;
      width: 50% !important;
  min-height: 500px !important;
  max-height: 500px !important;
      margin-left: auto;
      margin-right: auto;
      margin-top: 4px;
  padding: 5px !important;
  overflow: hidden !important;
  border: 1px solid gray !important;
  }

  /* (new3) */
  .thread .maincolumn__photo video ,
  #thread__container.thread__container.thread__container--open .thread__container__close + #thread__wrapper #thread__content.content.thread.content--thread .container > .row .maincolumn  .maincolumn__photo__wrapper ,
  .thread .maincolumn__photo__wrapper {
      width: auto;
  min-height: 450px !important;
  max-height: 450px !important;
  }


  .thread .maincolumn__photo__notice {
      background-color: #111;
      color: gold !important;
  }
  .thread .maincolumn__photo__notice a {
      color: tomato !important;
  }


  #thread__container.thread__container.thread__container--open .thread__container__close + #thread__wrapper #thread__content.content.thread.content--thread .container > .row .maincolumn .maincolumn__photo img ,
  .row .maincolumn .maincolumn__photo img  {
      display: inline-block !important;
      width: auto;
  min-height: 450px !important;
  max-height: 450px !important;
  object-fit: contain !important;
  }

  #thread__container.thread__container.thread__container--open .thread .maincolumn__photo__nav__button--flag, 
  #thread__container.thread__container.thread__container--open .thread .maincolumn__photo__nav__button--link {
      left: 0px !important;
      position: absolute;
      top: 0px !important;
      transform: scale(0.7);
      z-index: 5000;
  }
  #thread__container.thread__container.thread__container--open .thread__container__close + #thread__wrapper #thread__content.content.thread.content--thread .container > .row .maincolumn .maincolumn__photo__nav ,
  .thread .maincolumn__photo__nav {
      background-color: #111 !important;
      height: 50px;
      margin-left: auto;
      margin-right: auto;
      position: relative;
      width: 100%;
  }
  /* POPUP INFOS COMM */
  #thread__container.thread__container.thread__container--open  .thread__container__close + #thread__wrapper #thread__content.content.thread.content--thread .container > .row #allcomments {
      position: relative;
      display: inline-block !important;
  float: none !important;
      width: 50% !important;
  min-height: 500px !important;
  max-height: 500px !important;
      margin-left: auto;
      margin-right: auto;
      margin-top: -2px !important;
  padding: 5px !important;
  overflow: hidden !important;
  overflow-y: auto!important;
  border: 1px solid gray !important;
  }
  .makecomment {
      position: relative;
      box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);
      margin-bottom: 14px;

      text-align: left;
      padding: 5px;
      background-color: #333 !important;
  }
  .makecomment textarea {
      border-color: #abadb3 #dbdfe6 currentcolor #e2e3ea;
      border-style: solid solid none;
      border-width: 1px 1px 0;
      font-size: 15px;
      width: 100%;
      background-color: #222 !important;
  }
  .makecomment__button {
      display: block;
      height: 24px;
      margin-left: auto;
      margin-right: auto;
      margin-top: 5px;
      position: relative;
      width: 120px;
  }
  .makecomment__button .button, .makecomment__button .button__pink, .makecomment__button .button__red, .makecomment__button .button__gray {
      border: 0 none;
      height: 24px;
      line-height: 24px;
      margin-left: auto;
      margin-right: auto;
      position: relative;
      width: 120px;
  }

  .makecomment .previews {
      background-color: #111 !important;
      border-color: #c4c5ca #dbdfe6 #e3e9ef #e2e3ea;
      border-style: dashed solid solid;
      border-width: 1px;
      min-height: 24px;
      padding: 0 14px 14px;
      position: relative;
      top: 0;
  }

  .makecomment__button .text {
      color: #fff;
      display: block;
      font-family: bignoodle;
      font-size: 20px;
      left: 0;
      margin-left: auto;
      margin-right: auto;
      pointer-events: none;
      position: absolute;
      right: 0;
      text-align: center;
      top: 5px !important;
      transition: all 0s ease 0s, all 200ms ease 0s, all 0s ease 0s;
      width: 100%;
      z-index: 10;
  }
  .button, .button__gray, 
  .button__red, .button__pink {
      border-radius: 3px;
      box-shadow: 3px 3px 0 black !important;
      font-family: bignoodle;
      font-size: 20px;
      font-weight: 500;
      text-align: center;
      transition: all 0s ease 0s, all 200ms ease 0s, all 0s ease 0s;
  }
  /* (new2) PAGINATION */
  .pagination__button:hover:not(.pagination__button--selected) {
      background-color: #ff00ec;
      color: #fff;
  }
  .pagination__button--selected {
      background-color: #661460 !important;
      box-shadow: 0 1px 2px transparent inset;
      cursor: default;
      pointer-events: none;
  }

  /* PORNSTAR PAGE - HOME
  https://namethatporn.com/pornstars.html
  === */
  #pstgs {
      margin: 0 auto;
      max-width: 100% !important;
  }

  .pstg_hor_blck {
      text-align: center !important;
  }
  .pstg_lst {
      column-count: 1 !important;
      column-gap: 5px !important;
  column-rule: 3px solid rgba(0,0,0,.4) !important;
      margin: 15px 0;
  }
  .pstg_lst > li {
  /*      display: inline-block !important; */
  float: left !important;
       min-width: 150px !important;
       max-width: 150px !important;
  padding: 0 5px !important;
  border: 1px solid violet !important;
  }



  /*  ===== COLOR - ALL ===== */

  /* TEXT - GRAY */
  html, 
  /* body,  */
  /* div, */
  /* span,  */
  td, 
  th, 
  /* a,  */
  .pstg_lbl ,
  .pstgs_hding ,
  .pstg_lbl.big ,
  #siep_description ,
  input, 
  textarea {
      color: gray !important;
  }

  /* TEXT - GOLD */
  .ia_text ,
  .nsw_r_desc em {
     color: gold !important;
  }


  /*LINK - PERU */

  .ntpref_container .ntpref_title ,
  .item_title ,
  a, 
  .fakelink, 
  .fl {
      color: peru !important;
  }

  /* LINK VISITED - ALL */

  .item_title:visited ,
  a:visited, 
  .fakelink:visited, 
  .fl:visited {
      color: tan !important;
  }



  /* COLOR - BACKGROUND / TEXT - ALL */

  /* BACKGROUND - #222 */
  .dt.ntptrl_wrp {
      background: #222 !important;
      color: white !important; 
  }



  /* BACKGROUND - #222 / TEXT  WHITE - ALL */
  .item.pornstar_profile .pornstar_name, 
  .item.tag_profile .tag_name ,
  .pornstar_profile .related_tags, 
  .tag_profile .related_tags ,
  .pornstar_profile .related_names, 
  .tag_profile .related_names ,
  .pornstar_dir_info, 
  .tag_dir_info ,
  .tabs ,
  .item_title ,
  .item ,
  #sidebar ,
  .id_answer_wrapper ,
  #id_ready_to_comment, 
  #id_ready_to_comment_but_first_login ,
  #correct_answer ,
  #id_resources_wrapper ,
  #id_auth_acts_dets ,
  #id_title_wrapper {
      background: #222 !important;
      color: white !important; 
  }


  /* BACKGROUND - #333 */

  #idaf {
      background: #333 !important;
  }

  /* BACKGROUND - #333 / BORDER RED */

  /* .tag_dir_info   {
      border: 1px solid red !important;
      background: #333 !important;
  }*/

  /* BACKGROUND - #333 - BORDER RED*/
  .ntpref_wrapper {
      border: 1px solid red !important;
      background: #333 !important;
  }


  /* ==== END - ALL - GENERAL  ==== */
  `;
}
if (location.href === "https://namethatporn.com/search.html" || location.href === "https://namethatporn.com/search/images.html") {
  css += `
  /* START - URL - SEARCH ==== */
  #content[itemprop="mainContentOfPage"] {
  display: inline-block !important;
  height: 100% !important;
      max-width: 1622px;
      min-width: 1622px;
      overflow: hidden;
      padding-left: 5px;
      padding-right: 5px;
  border: 1px solid yellow !important;
  /* background: red !important; */
  }

  #content[itemprop="mainContentOfPage"] #nsw > form {
      position: relative !important;
      display: inline-block;
      min-width: 98% !important;
      max-width: 98% !important;
      top: 0px !important;
      margin-top: 0px;
      left: -4px !important;
      margin-bottom: 0;
      padding: 0 20px;
      text-align: center;
  border: 1px solid aqua !important;
  }
  #content[itemprop="mainContentOfPage"] #nsw > form #nsw_f_d_w {
      width: 50%;
      margin-top: 67px !important;
      text-align: left !important;
  }
  #content[itemprop="mainContentOfPage"] #nsw > form #nsw_f_d_desc > b {
      position: relative !important;
      display: inline-block;
      width: 100%;
      top: 0px !important;
      margin-top: 0px;
      left: 0px !important;
      margin-bottom: 0;
      padding: 0 20px;
      text-align: left !important;
  color: gold !important;
  /* border: 1px solid aqua !important; */
  }

  /* END - URL - SEARCH === */
  `;
}
if (location.href.startsWith("https://embedy.me/")) {
  css += `
  /* START - URL PREF - embedy.me  ==== */

  /* , url-prefix("https://www.xvideos.com/"), url-prefix("https://static-ss.xvideos-cdn.com/"), url-prefix("https://flashservice.xvideos.com/embedframe/") */

  #video_iframe, 
  #video_player {
      height: 100%;
      width: 100%;
  background: #000 none repeat scroll 0 0;
  }

  #html5video.embed-responsive.desktop #hlsplayer .xv-logo {
      display: none !important;
  }
  #html5video.embed-responsive.desktop:not(:hover)  #hlsplayer .buttons-bar.left ,
  #html5video.embed-responsive.desktop:not(:hover)  #hlsplayer .buttons-bar.right ,
  #html5video.embed-responsive.desktop:not(:hover)  #hlsplayer .progress-bar-container {
      opacity: 0.05 !important;
  }
  #html5video.embed-responsive.desktop .video-bg-pic .video-pic img {
      height: 100%;
  width: 100% !important;
      box-sizing: content-box;
      object-fit: contain !important;
  }
  #html5video.embed-responsive.desktop  #hlsplayer .big-button img {
      height: 24px !important;
      width: 24px !important;
      padding: 3px !important;

      background: rgba(0, 0, 0, 0.3) !important;
  }
  /* END - URL PREF - embedy.me  === */
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
