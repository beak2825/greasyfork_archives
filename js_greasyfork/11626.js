// ==UserScript==
// @name        Enhanced dindebat.dk
// @namespace   unstupify.jubii
// @include     http://dindebat.dk/*
// @version     6
// @require  http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @run-at document-end
// @grant    GM_addStyle
// @description A few small enhancements for dindebat.dk
// @downloadURL https://update.greasyfork.org/scripts/11626/Enhanced%20dindebatdk.user.js
// @updateURL https://update.greasyfork.org/scripts/11626/Enhanced%20dindebatdk.meta.js
// ==/UserScript==


  //Fjerner den irriterende kæmpe Jubii-bar fra toppen
  document.getElementById('jubii-header').remove();

  //rykker debatten op
  GM_addStyle ("  \
    .jubii-header-fixed-container{  \
       padding-top:10px !important;  \
    } " );

  GM_addStyle ("  \
    .jubii-adunit-container{  \
       display:none !important;  \
    } " );

//Farver and stuff

  //Indlæg baggrund og ramme
  GM_addStyle ("  \
    .ipsAreaBackground_light{  \
       background:#EEEEEE !important;  \
    } " );

  GM_addStyle ("  \
    .ipsBox {  \
       background-color:#EEEEEE !important;  \
       border-color:#CCCCCC !important; \
    } " );

  //Skillelinie mellem indlæg og signatur
  GM_addStyle ("  \
    hr.ipsHr {  \
       border-width:1px 0 0 0 !important;  \
       border-color:#CCCCCC !important; \
    } " );

  //Fjerner "Announcement" (Ordensregler) i toppen
  GM_addStyle ("  \
    .ipsWidget_horizontal {  \
       display:none !important; \
    } " );

  //Fjerner "Announcement" (Ordensregler) i højre side
  GM_addStyle ("  \
    .ipsWidget_vertical {  \
       display:none !important; \
    } " );

  //Fjerner hele højre side, så forumoversigt fylder hele bredden
  GM_addStyle ("  \
    .ipsLayout_sidebarright {  \
       display:none !important; \
    } " );

  //Skjuler den ikke-funktionelle "Hurtigmenu"
  GM_addStyle ("  \
    .elNavigation_app_cms_0 {  \
       display:none !important; \
    } " );





//Laver lidt nye menupunkter
    
var mainNav = $('#ipsLayout_mainNav');

if (mainNav.length > 0) {

    var li = $('<li />');
    li.attr('data-role', 'navItem');
    li.attr('data-originalwidth', '75');
    
    a = $('<a>');
    a.attr('href', 'http://dindebat.dk/new-content/?type=forums_topic&sortby=last_real_post&sortdirection=desc&onlyFollowed=0&vncTimePeriod=week&onlyUnread=0&change_section=1');
    a.attr('class', 'elNavigation_app_forums_Forums');
    a.append('Nyt');
    a.appendTo(li);
    
    li.appendTo(mainNav);
    
    
    var li2 = $('<li />');
    li2.attr('data-role', 'navItem');
    li2.attr('data-originalwidth', '75');
    
    a2 = $('<a>');
    a2.attr('href', 'http://dindebat.dk/new-content/?type=forums_topic&sortby=last_real_post&sortdirection=desc&onlyFollowed=0&vncTimePeriod=week&onlyUnread=1&change_section=1');
    a2.attr('class', 'elNavigation_app_forums_Forums');
    a2.append('Nyt Ulæst');
    a2.appendTo(li2);
    
    li2.appendTo(mainNav);
    
    
    var li3 = $('<li />');
    li3.attr('data-role', 'navItem');
    li3.attr('data-originalwidth', '75');
    
    a3 = $('<a>');
    a3.attr('href', 'http://dindebat.dk/new-content/?type=forums_topic&sortby=last_real_post&sortdirection=desc&onlyFollowed=1&vncTimePeriod=all&onlyUnread=0&change_section=1');
    a3.attr('class', 'elNavigation_app_forums_Forums');
    a3.append('Følger');
    a3.appendTo(li3);
    
    li3.appendTo(mainNav);
    
    
    var li4 = $('<li />');
    li4.attr('data-role', 'navItem');
    li4.attr('data-originalwidth', '75');
    
    a4 = $('<a>');
    a4.attr('href', 'http://dindebat.dk/new-content/?type=forums_topic&sortby=last_real_post&sortdirection=desc&onlyFollowed=1&vncTimePeriod=all&onlyUnread=1&change_section=1');
    a4.attr('class', 'elNavigation_app_forums_Forums');
    a4.append('Følger Ulæst');
    a4.appendTo(li4);
    
    li4.appendTo(mainNav);
    
}



