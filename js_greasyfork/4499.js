// ==UserScript==
// @name        Chaturbate Colors
// @namespace   http://userscripts.org/users/packmank
// @homepage    https://greasyfork.org
// @description Style to improve Chaturbate design  - Watch cams in mega hentia theme , Ad free version and navigation made much better.
// @include     https://chaturbate.com/*
// @include     https://*.chaturbate.com/*
// @include     http://chaturbate.com/*
// @include     http://*.chaturbate.com/*
// @version     1.12
// @run-at document-start
// @downloadURL https://update.greasyfork.org/scripts/4499/Chaturbate%20Colors.user.js
// @updateURL https://update.greasyfork.org/scripts/4499/Chaturbate%20Colors.meta.js
// ==/UserScript==

function colorfulstyle2(css) {
    var head, style;
    head = document.getElementsByTagName('html')[0];
    if (!head) { return; }
    style = document.createElement('style');
    style.type = 'text/css';
    style.innerHTML = css;
    head.appendChild(style);
}

colorfulstyle2('#user_information div.top div.links{margin-left:60px !important;}' +
'html {background:none !important;color:#252525;font:62.5%/1  !important;height:100%;padding:0;cursor:url(images/my-cursor.png), auto;}' +
'html body div#header div.section{background:url("https://36.media.tumblr.com/0d72dc3b3095becd6fbd845782a6b96a/tumblr_nauap8pqq11tks9ofo1_1280.png") no-repeat !important;height:100px !important;width: 100%; !important;background-position:0px !important;}' +
'#header {background: #EEE022 !important;width: 100%;}' +
'html > body {background: #F0F0F0 !important;color: #000 !important;background: url("https://38.media.tumblr.com/92a77013ac4a4bf4d622bad018cbab0d/tumblr_nau4qsyYCz1tks9ofo1_1280.jpg") repeat-y #F0F0F0  !important;background-position:right top !important;}' +
'a:hover {text-decoration: none !important;}' +
'.logo-zone {float: right !important;padding: 0px 0 0 0px !important;}' +
'.logo {background: url("https://36.media.tumblr.com/326892ac0fe80cf6461ba8637d611690/tumblr_nauap8pqq11tks9ofo2_1280.png") no-repeat !important;height: 100px !important; width:1354px; !important; overflow: hidden;padding:0 !important;text-indent: -9999px;background-position:677px !important;}' +
'.logo-zone strong {display: block !important;font-family: Verdana, Geneva, sans-serif !important;padding: 0 0 0 17px;color: #F5F5F5 !important;font-size: 0px !important;}' +
'#user_information { box-shadow: 0px 4px 12px 1px #2F2F2F;-webkit-box-shadow:0px 4px 12px 1px  #2F2F2F; -moz-box-shadow: 0px 4px 12px 1px #2F2F2F;opacity: 0.9;width: auto;z-index: 100;margin-left:1070px !important;margin-top:7px !important; position: absolute !important;}' +
'#user_information .top {border-radius: 3px 3px 3px 3px !important;padding: 2px;background: #FF605B url("http://i.imgur.com/CNw8iAh.png?1") no-repeat !important; background-position: 37%  !important;}' +
'.top img {display: none !important;}' + 
'#user_information .bottom {border-radius: 1px 1px 1px 1px !important;background-color:#5E6DF5 !important;border-left: 0px !important;border-right:0px important;padding: 4px 4px 4px 0;color: #ffffff !important;}' +
'#user_information a {color: #ffffff !important;}' +
'#user_information table th, #user_information table td, #user_information a {font-family:  Century Gothic, sans-serif !important;text-align: left;}' +
'.block {background: none repeat scroll 0 0 orange !important;border: 1px solid #ACACAC;border-radius: 4px 4px 4px 4px;overflow: hidden;padding: 4px;}' +
'.nav-bar {background: #EEE022 !important;border-color: #E2DB0D !important;border-width:thin;margin-bottom:3px;margin-top:0px;margin-left:90px !important;box-shadow: 2px -3px 10px 0px rgba(246, 235, 235, 0.27);-moz-box-shadow: 2px -3px 10px 0px rgba(246, 235, 235, 0.27);-webkit-box-shadow: 2px -3px 10px 0px rgba(246, 235, 235, 0.27);}' +
'#nav li a {color: #F57723 !important;font-family: Verdana, Geneva, sans-serif !important;font-size: 12px !important;font-weight:thick !important;text-decoration:none !important;text-shadow: none;border-radius: 9px 9px 9px 9px ;padding: 3px;border: 1px solid #F3E5AB;-webkit-transition: 0.5s;-moz-transition: 0.5s;transition: 0.5s;}' +
'.nav-bar a:hover {background: #fff !important;color: #000 !important;border-radius:30px !important;}' +
'.creat {background: url("http://ccstatic.highwebmedia.com/static/images/arrow-white.gif?4f96b008b4f6") no-repeat scroll 94% 50% #104C91 !important;border-radius: 4px 4px 0 0;color: #FFFFFF;float: right;margin-right: 1px !important;padding: 6px 30px 0 15px;position: relative;}' +
'.top-section {background: #CDDA1C !important;border: 1px solid ;border-color: #D4CD0E !important;box-shadow: 0px 4px 7px 0px rgba(59, 59, 59, 0.3);-moz-box-shadow: 0px 4px 7px 0px rgba(59, 59, 59, 0.3);-webkit-box-shadow: 0px 4px 7px 0px rgba(59, 59, 59, 0.3);opacity: 0.9;border-radius:0px 0px 25px 0px;}' +
'.sub-nav {display: inline-block;font: 0.8666em/16px,Arial,Helvetica,sans-serif;height: 1%;list-style: none outside none;margin-left:55px !important;min-width: 690px;overflow: hidden;padding: 0px;position: relative;top: 3px;}' +
'.sub-nav .active a  {background: #1E99E1 !important;color: #888;border-radius:10px;}' +
'.sub-nav a:hover {background: #FF6464 !important;color: #000 !important;}' +
'.sub-nav a {background: #B5C108 !important;border-color:#84A500 !important;color: #fff !important;border-radius: 7px 10px 10px 10px !important;box-shadow: 1px 3px 4px 1px #C4A507;-webkit-box-shadow: 1px 3px 4px 1px #C4A507; -moz-box-shadow: 1px 3px 4px 1px #C4A507;opacity: 0.9;font-family:  Century Gothic, sans-serif !important;font-size: 12px;padding: 5px 11px 4px;}' +
'.sub-nav li {float: left;margin: 0 12px 0 0 !important;}' +
'#login-box {display: block !important;border: 1px solid #C10FC7 !important;border-radius: 6px 6px 6px 6px !important;background-color:rgba(184, 7, 249, 0.80); !important;left: 79% !important;margin-left: 0px;padding: 4px 6px !important;position: absolute;top: 2px !important;width: 270px !important;height: 75px !important;z-index: 101 !important;color: #fff !important;font-size: 11px !important;font-family: Gill Sans / Gill Sans MT, sans-serif !important;box-shadow: 0px 0px 8px 4px rgba(44, 0, 44, 0.71);-moz-box-shadow: 0px 0px 6px 2px rgba(44, 0, 44, 0.71);-webkit-box-shadow: 0px 0px 6px 2px rgba(44, 0, 44, 0.70);}' +
'#login-box .pagename {color: #fff !important;font-size: 11px !important;visibility:visible !important;}' +
'#login-box form input[type="text"], #login-box form input[type="password"] {width: 60px !important;border: none !important;background-color:rgba(225, 215, 215, 0.55); !important;box-shadow: inset 3px 3px 3px 0px #770377;border: none !important;margin: 5px 0 10px !important;border-radius: 30px 30px 30px 30px !important;}' +
'input, textarea, select {color: #000 !important; font: 105% Arial,Helvetica,sans-serif !important;vertical-align: middle;}' +
'#login-box h2 {display: none !important;color: #494949;font: 10px ,Arial,Helvetica,serif;margin: 0px 0px 3px important;}' +
'#login-box hr {display: none !important;margin: 20px 0 10px;}' +   
'#login-box p {display: none !important;margin: 3px 0;}' +
'#login-box form .button {margin-left: 187px !important;margin-top: -21px !important;opacity: 0.9 !important;color: #fff !important;box-shadow: 0px 0px 7px 1px rgba(119, 119, 119, 0.38);-moz-box-shadow: 0px 0px 7px 1px rgba(119, 119, 119, 0.38);-webkit-box-shadow: 0px 0px 7px 1px rgba(119, 119, 119, 0.38);}' +
'form .button {background: #FA5F69 !important;border: 1px solid #1d1d1 !important;border-radius: 6px 6px 6px 6px !important;color: #fff;display: block;height: 22px !important;margin: 15px 0 0 137px ;padding: 0 30px 2px 15px ;width: auto !important;text-decoration: none !important;font-family: Century Gothic, sans-serif !important;}' +
'form .button:hover {background-color: #77B7FF !important;}' +
'#login-box .close {left: 263px !important;position: absolute;top: 0px !important;}' +
'#login-box a.close img {width: 19px !important;height: 19px !important;border-radius: 15px 15px 15px 15px !important;opacity: 0.9;}' +
'div.nav-bar ul#nav li a.login-link {visibility:visible !important;}' +
'.overlay {background: url("http://ccstatic.highwebmedia.com/static/images/overlay_black.png?2798865149d4") repeat scroll left top transparent;bottom: 0;display: none ; left: 0;position: fixed;right: 0;top: 0;z-index: 100;opacity: 0.6 !important; }' +
'.ui-resizable-e {background: url("http://ccstatic.highwebmedia.com/static/images/resize_arrows.gif?599f57e1a2bc") no-repeat scroll center center transparent;cursor: e-resize;height: 100%;right: -8px;top: 0;width: 7px ; z-index: 100;opacity: 0.4 !important;}' +
'.list li {background: none repeat scroll 0 0 #FFFDF2 !important;border: 1px  #000000;border-radius: 6px 6px 6px 6px !important;box-shadow: 0px 3px 5px 2px rgba(9, 1, 1, 0.23);-moz-box-shadow: 0px 3px 5px 2px rgba(9, 1, 1, 0.23);-webkit-box-shadow: 0px 3px 5px 2px rgba(9, 1, 1, 0.23);margin: 7px 7px 10px 7px !important;}' +
'div.content div.advanced_search_options {width:65% !important;height: 130px !important;margin-left: 15px !important;padding: 5px 2.5px 1.5px !important;border: none !important;color: #9F9F9F !important; }' +
'div.content div.advanced_search_options form .button {background: #E5E2E2 !important; border: 1px solid #E5E2E2 ;box-shadow: 0px 0px 5px 2px rgba(119, 119, 119, 0.3);-moz-box-shadow: 0px 0px 5px 2px rgba(119, 119, 119, 0.3);-webkit-box-shadow: 0px 0px 5px 2px rgba(119, 119, 119, 0.3);}' +
'div.advanced_search_options table tbody tr td.search  form input[type="text"] {background: none repeat scroll 0 0 #E456D5 !important; border: 1px solid #B1B1B1;height: 20px;line-height: 18px;margin-top: 4px;padding: 2px 4px;width: 150px !important; box-shadow: inset 2px 2px 2px 1px #8E0C81 !important; border-radius: 25px !important; }' +
'.list .details  .sub-info li  {-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;margin: 0 !important;overflow: hidden !important;padding: 0 0 4px !important;}' +
'.list .details  .subject  li {-webkit-box-shadow: none;-moz-box-shadow: none;box-shadow: none;}' +
'.list .details {padding: 4px 7px 0 !important;text-align: left;}' +
'.likes li, .subject li {background: none repeat scroll 0 0 transparent;border: 0 none;margin: 0 !important;padding: 0 2px !important;width: auto;}' +
'.list .title a {color: #F24949 !important;float: left;overflow: hidden;width: 125px;-webkit-transition: 0.5s;-moz-transition: 0.5s;transition: 0.5s ;}' +
'.list .title a:hover {color: #fff;text-shadow: -1px 1px 5px #FF8900, 1px -1px 5px #FF8900 ;}' +
'.list .thumbnail_label_c {background-color: #0C6A93 !important;opacity: 0;}' +
'.list .thumbnail_label_offline {background-color: #221F1F !important;}' +
'.sub-info li.location {background: url("http://ccstatic.highwebmedia.com/static/images/ico-01.png?a83ca9dd70c8") no-repeat scroll 0 50% transparent;height: 15px;overflow: hidden;width: 145px;color: #04559C;}' +
'.sub-info li.cams {background: url("http://ccstatic.highwebmedia.com/static/images/ico-cams.png?a83ca9dd70c8") no-repeat scroll 0 50% transparent !important; height: 15px;overflow: hidden;width: 145px;background-position: 85%  !important;color: #000;}' +
'.content .c-1 {margin: 15px 190px 0 100px !important;}' +
'#defchat{background-color: #A2D7E3 !important;color: #777;border-radius: 10px 10px 10px 10px !important;box-shadow: 1px 1px 7px 6px #CDCDCD;-webkit-box-shadow: 1px 1x 7px 6px #CDCDCD; -moz-box-shadow: 1px  1px 7px 6px #CDCDCD;margin-top: 18px !important;margin-bottom: 60px !important;margin-left: 30px !important;}' +
'div.bio div#tabs_content_container dl dd p img {left:-15px !important;}' +
'.bio {background-color: #F9F9F9 !important;min-height: 650px;}' +
'.tokens {border-bottom: 1px solid #000000;color:  #1F4BB0 !important;}' +
'.buttons a:hover, .buttons .active a {background: none repeat scroll 0 0 #F3F3F3 !important;color: #777;text-decoration: none;}' +
'.datatable {background-color: #72C10A !important;margin: 10px 0 20px;width: 100%;}' +
'.datatable th {background-color: #E98400 !important;color: #FFFFFF;padding: 5px;vertical-align: top;}' +
'div.featured_blog_posts {display:none !important;}' +
'.ad, .remove_ads, #botright, .banner {display: none !important;}' +
'.content {overflow: hidden;padding: 0 !important;margin: 0 !important;}' +
'.featured_text {background: url("https://38.media.tumblr.com/3fee7f1e9ea8025515e491262c40166f/tumblr_nau4uoR1ui1tks9ofo1_1280.png") no-repeat !important;font-size: 0px !important;width: 1341px !important;height: 442px !important;padding: 0px !important;margin-top:2px !important;background-position: 10%  !important;}' +
'.featured_text h1{text-shadow: 0px 0px 5px rgba(0, 0, 0, 0.9);color: #DDDEDE;font-size: 25px !important;font-family: Impact !important;padding: 10px !important;margin: 100px 0px 0px 400px !important;}' +
'.footercon a:hover {-webkit-transform: scale(1.5,1.5);-moz-transform: scale(1.5,1.5);transform: scale(1.5,1.5);}' +
'.footercon a {display: inline-block;color: #0091FF !important;-webkit-transition: 0.5s;-moz-transition: 0.5s;transition: 0.5s;}' +
'.footer-holder .nav li a {color: #4E4E4E !important;font-family:  Century Gothic, sans-serif !important;font-size: 11px !important;}' +
'.footer-holder {background: url("https://38.media.tumblr.com/fd29fc8fd5726deaef5f3513d9255388/tumblr_nau4wwQL3D1tks9ofo1_500.png") no-repeat #F0F0F0 !important;font-family: Gill Sans / Gill Sans MT, sans-serif !important;font-size: 6px !important;overflow: hidden;padding: 20px 0 15px;text-align: center !important;width: 100% !important;height: 100% !important;box-shadow: 0px 0px 3px 2px rgba(118, 115, 115, 0.16);-moz-box-shadow: 0px 0px 3px 2px rgba(118, 115, 115, 0.16);-webkit-box-shadow: 0px 0px 3px 2px rgba(118, 115, 115, 0.16) !important;}');