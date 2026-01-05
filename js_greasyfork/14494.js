// ==UserScript==
// @name         PCO Services Changes
// @namespace    PCOServicesChanges
// @include      https://services.planningcenteronline.com/*
// @exclude      https://services.planningcenteronline.com/people/*
// @author       Montana Selman
// @description  Enhancements to PCO Services
// @version      0.2
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require      https://greasyfork.org/scripts/1003-wait-for-key-elements/code/Wait%20for%20key%20elements.js?version=49342
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/14494/PCO%20Services%20Changes.user.js
// @updateURL https://update.greasyfork.org/scripts/14494/PCO%20Services%20Changes.meta.js
// ==/UserScript==

$('head').append('<link href="//fonts.googleapis.com/css?family=Lato:400,700,700italic,400italic" rel="stylesheet" type="text/css">');
$('head').append('<style>.col-1 {width: 8.33%;}.col-2 {width: 16.66%;}.col-3 {width: 25%;}.col-4 {width: 33.33%;}.col-5 {width: 41.66%;}.col-6 {width: 50%;}.col-7 {width: 58.33%;}.col-8 {width: 66.66%;}.col-9 {width: 75%;}.col-10 {width: 83.33%;}.col-11 {width: 91.66%;}.col-12 {width: 100%;}</style>');

var mainContentWrap = $('div#content');
var sidebar = $('div#sidebar');

waitForKeyElements('div#content',contentChanges);
function contentChanges(jNode){
    jNode.css({"overflow-y":"auto","overflow-x":"hidden","padding":"0","height":"calc(100vh-76px)"});
    $('ul#content_sidebar_buttons').remove();
    $('div#content_sidebar_buttons_placeholder').remove();
    $('.filler').remove();
}

waitForKeyElements('div#sidebar', sidebarChanges);
function sidebarChanges(jNode) {
  jNode.css({"background":"#fff","width":"20em","border-radius":"5px","padding":"5px","height":"85vh","overflow-y":"auto"});
  $('div.org_logo').remove();
}

waitForKeyElements('html', containedPage);
function containedPage(jNode) {
  jNode.css({"background":"#dedede"});
}

waitForKeyElements("#wrap", shrinkWrap);
function shrinkWrap(jNode){
    jNode.css({"background":"#f5f0f0","max-width":"130em","margin":"0 auto","box-shadow":"0px 0px 5px rgb(200,200,200)"});
}

waitForKeyElements("div.app-badge", appBadge);
function appBadge(jNode){
    jNode.attr("style", jNode.attr("style") + "; width: 262px !important");
}

waitForKeyElements("div#container", modContainer);
function modContainer(jNode){
  jNode.css({"padding":"20px"});
}

waitForKeyElements("div[style='position: relative; float: left']", tabNames);
function tabNames(jNode){
    var plansLink = jNode.children('a#sub_menu_plans').contents();
    plansLink[plansLink.length-1].nodeValue = 'Plans';
    var songsLink = jNode.children('a#sub_menu_songs').contents();
    songsLink[songsLink.length-1].nodeValue = 'Songs';
    var mediaLink = jNode.children('a#sub_menu_media').contents();
    mediaLink[mediaLink.length-1].nodeValue = 'Media';
    var peopleLink = jNode.children('a#sub_menu_people').contents();
    peopleLink[peopleLink.length-1].nodeValue = 'People';

    jNode.children('a').css({'font-size':'11px','font-weight':'bold'});

    $('.app-badge_button').css({'font-size':'14px','padding':'0px'});
}

waitForKeyElements("body", fontChanges);
function fontChanges(jNode){
    jNode.css({"font-family":"'Lato', sans-serif","-webkit-font-smoothing":"antialiased","height":"98vh !important","overflow-y":"auto"});
    $('div#footer').css({"max-width":"130em","margin-left":"auto","margin-right":"auto"});
}

// PLANS

waitForKeyElements("div#plan_view", scrollifyPlan);
function scrollifyPlan(jNode) {
  $('div.content_holder').css({"margin":"1px auto 0 auto","padding":"0","width":"80em","height":"85vh"});
  jNode.css({"overflow-y":"scroll","overflow-x":"hidden","padding":"5px","background":"#fff"});
}

waitForKeyElements("div.content_pane",peoplePane)
function peoplePane(jNode){
  jNode.css({"height":"75vh","overflow-y":"auto"});
}
