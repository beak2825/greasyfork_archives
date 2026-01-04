// ==UserScript==
// @name Synergia tweaks 
// @namespace Synergia
// @author KubaWojciechowski
// @match *://synergia.librus.pl/*
// @grant GM_addStyle
// @description:pl Ulepsz swojego librusa!
// @version 0.0.1.20180530100922
// @description Ulepsz swojego librusa!
// @downloadURL https://update.greasyfork.org/scripts/368766/Synergia%20tweaks.user.js
// @updateURL https://update.greasyfork.org/scripts/368766/Synergia%20tweaks.meta.js
// ==/UserScript==

$("head").append('<link href="https://fonts.googleapis.com/css?family=Roboto+Condensed" rel="stylesheet">');
$("#top-banner").attr("src", "https://i.imgur.com/bgG6gfs.png");
$(`a[href="javascript:otworz_w_nowym_oknie('/przegladaj_plan_lekcji','plan_u',0,0)"]`).attr("href", "/przegladaj_plan_lekcji")

GM_addStyle(`
body {
background: #2d2d2d;
font-family: 'Roboto Condensed', sans-serif !important;
}

.container-background {
border: 1px #afafb9 solid;
 background: #2d2d2d;
}

.container h2.inside {
color: #ffffff;
background-color: #9b999a;
}

#page.systema #header {
background: #2d2d2d;
}

#page.systema #header #top-banner-container {
background: none;
}

#page #header #top-banner-container {
background: none;
}

#page #header #top-banner-container #graphic-menu ul li a {
color: #ffffff;
}

#page #header #top-banner-container #graphic-menu ul li a .circle {
background-color: #000000;
}

#page #header #user-section #pag {
color: white;
}

#user-section {
color: white;
}

td, th {
color: white !important;
background-color: #2d2d2d !important;
}

table.decorated tbody td {
color: white !important;
}

.fold-start, .fold-end, .fold-end-scroll {
filter: grayscale();
}

span.grade-box {
filter: grayscale(50%);
}

.ui-tooltip {
filter: grayscale(70%);
}

.article__title {
color: white;
}

#main-menu ul.main-menu-list li:not(.no-access)>a:hover {
color: white;
}

.helper-icon {
content: url(/images/pomoc_jasna.png);
}

/* f***ing mess begins */
.tree-first-branch, .tree-next-branch, .tree-last-branch  {
filter: invert(82%);
background-color: #ffffff !important;
}

table.message-folders a {
color: #ffffff;
}
/* end of mess */

#page #header #top-banner-container #top-banner {
filter: saturate(10);
}

.welcome-page.student .container-background {
filter: saturate(5);
}

#bottom-logo {
filter: grayscale();
}

.existing-msg-files-icon {
filter: invert(100%);
}

/* this may break something*/
select {
background-color: black;
color: white;
}

.ui-state-hover, .ui-widget-content .ui-state-hover, .ui-widget-header .ui-state-hover, .ui-state-focus, .ui-widget-content .ui-state-focus, .ui-widget-header .ui-state-focus, .ui-button {
border: 1px solid white;
background: #2d2d2d;
color: white;
}

table.decorated tbody tr.line1 td,  table.decorated tbody tr.line0 td {
border-left: 1px #e3e3e3 solid;
}

span.grade-box a {
color: #f1f1f1;
}

table.decorated thead tr td.colspan span {
color: #5d5d5d;
}

#preloader-box {
filter: grayscale(100%);
}
`);

function rerun(){
$(".grade-box").each(function(){
  let clr = $(this).css("background-color");
  $(this).css("border", `1px solid ${clr}`).css("background-color", "");
  });
  /* neatloader-v2auto */
  $("a:not(.done)").each(function(){
  $(this).attr("data-oldLink", $(this).attr("href"));
  //if ($(this).attr("href").includes("http")){
  $(this).click((e)=>{
  e.preventDefault(); $("#preloader-box").css("display", "block");
  $("#body").load(`${$(this).attr("href")} #body`, ()=>{
    doStuffAfterLoad();
  });
  });
   
    $(this).addClass("done");
  //}
  });
  
}
rerun();




function doStuffAfterLoad(){
  $("#preloader-box").css("display", "none");
  rerun();
}