// ==UserScript==
// @name FP2 Anime CSS
// @grant GM_AddStyle
// @include http*://lab.facepunch.com
// @include http*://lab.facepunch.com/.*
// @include http*://lab.facepunch.com/anime
// @include http*://lab.facepunch.com/anime/*
// @grant        GM_addStyle
// @namespace 
// @description CSS loader for Anime subforum on newfacepunch
// @version 0.0.1.20160606121634
// @downloadURL https://update.greasyfork.org/scripts/20251/FP2%20Anime%20CSS.user.js
// @updateURL https://update.greasyfork.org/scripts/20251/FP2%20Anime%20CSS.meta.js
// ==/UserScript==


var css = "";

css += "@media only screen and (max-width: 766px) { #header .content { height: 120px; } } ";
css += ".container { width: auto; padding-left: 5px; padding-right: 5px;} ";
css += ".row.clearfix { margin-top: 8px; } ";
css += ".row.navigation { margin-right: -10px; margin-left: -10px; } ";
css += ".container > .row { margin-left: 0px; margin-right: 0px;} ";
css += "#header .content .title { font-size: 20px; margin-top: 20px; padding-right: 20px; } ";
css += "#header .content .title.inthread, #header .content .threadname.inthread { font-family: Tahoma, Helvetica, Arial, Verdana; font-size: 20px; margin-top: 20px; padding-right: 20px; } ";
css += "#header .content .title.inthread:hover, #header .content .threadname.inthread:hover, #header .content .title:hover { color: rgba(226, 0, 28, 1) } ";
css += "@media only screen and (max-width: 768px) { #header .content .title.inthread, #header .content .threadname.inthread, #header .content .title { left: 70px; margin-top: 5px; } } ";
css += "@media only screen and (min-width: 767px) { .container > .row { margin-left: 5%; margin-right: 5%;} } ";
css += ".PostView .forumPost .post .userinfo { left: 0px; top: 30px; z-index: 1; width: 90px; text-align: center; margin-top: auto; margin-bottom: auto; padding: 5px;} ";
css += ".col-md-offset-1 { margin-left: 0px; margin-right: 0px;} ";
css += ".col-md-10 {width: 100%; padding: 0px;} ";
css += ".col-lg-1 {height: 0px; display: flex; width: 100%; padding: 0px; } ";
css += "@media only screen and (max-width: 768px) { .col-lg-1 { padding: 0px; } } ";
css += ".PostView .forumPost .post .body p { margin: 0px; } ";
css += ".user a { color: white; } ";
css += ".user a:hover { color: rgba(226, 0, 28, 1); } ";
css += ".PostView .forumPost, .PostView .forumPost.seen { opacity: 1; -webkit-filter: brightness(100%); -webkit-box-shadow: rgba(0, 0, 0, 0.14902) 0 0 10px 5px;} ";
css += ".PostView .forumPost .post .header { background-color: rgba(235, 129, 94, 1); border: none; border-bottom: 5px solid #777; font: 14px Tahoma, Calibri, Verdana, Geneva, sans-serif; color: #444; height: 30px; -webkit-box-shadow: inset 0 0 10px 1px rgba(0, 0, 0, 0.3); } ";
css += ".PostView .forumPost.seen .post .header { background-color: rgba(235, 129, 94, 1); border: none; border-bottom: 5px solid #777; } ";
css += ".PostView .forumPost .post .header .time a { color: #444; } ";
css += ".PostView .forumPost .post .body { margin-left: 90px; min-height: 90px; padding-top: 20px; padding-bottom: 30px; padding-right: 25px; background-color: white; border-left: 5px solid rgba(99, 181, 99, 0.7); padding-left: 20px; -webkit-box-shadow: inset 0 0 10px 1px rgba(99, 181, 99, 0.3); } ";
css += ".PostView .forumPost.seen .post .body { background-color: white; border-left: 0px; padding-left: 25px; -webkit-box-shadow: inset 0 0 10px 1px rgba(0, 0, 0, 0.3);} ";
css += "@media only screen and (max-width: 768px) { .PostView .forumPost .post .body, .PostView .forumPost.seen .post .body { margin-left: 0px; margin-right: 0px; min-height: 30px; padding-top: 10px; padding-bottom: 30px; padding-left: 10px; padding-right: 15px; } }";
css += "@media only screen and (max-width: 768px) { .PostView .forumPost.seen .post .body {padding-left: 15px; } } ";
css += ".col-sm-11 { width: 100%; padding: 0px;} ";
css += ".PostView .forumPost .meta { padding: 5px; font-size: 11px; white-space: nowrap; overflow: hidden; margin-left: 0px; margin-right: auto; position: relative; width: auto; display: inline-block; height: 32px; top: -32px; opacity: 0.3; } ";
css += "@media only screen and (min-width: 767px) { .PostView .forumPost .meta { margin-left: 85px; margin-right: auto; padding: 10px; } } ";
css += ".meta.row > br { display: none; } ";
css += "forum-icon.ng-scope.ng-isolate-scope { padding-left: 10px; } ";
css += ".meta.row:hover { opacity: 1; } ";
css += ".pagination {margin: 0px; } ";
css += ".pagination .btn, .btn-primary {background-color: rgba(235, 129, 94, 1); -webkit-box-shadow: inset 0 0 10px 1px rgba(0, 0, 0, 0.1); } ";
css += ".pagination .btn:hover, .btn-primary:hover { background-color: rgba(226, 0, 28, 1); } ";
css += ".forumPost > row { opacity: 1; -webkit-filter: brightness(100%)} ";
css += ".shadow { box-shadow: 0 4px 8px rgba(0,0,0,.15); background-color: rgba(0,0,0,.15); } ";
css += "@media only screen and (min-width: 767px) { .embed-responsive { max-width: 640px; height: 400px; width: auto; border: 1px solid #777; padding: 0px; margin-left: auto; margin-right: auto;} } ";
//https://files.catbox.moe/j05tn9.png
css += ".col-md-12>a[href*='/anime/']>forum-icon { background: url(https://files.catbox.moe/iqlszz.png) no-repeat; background-size: 100% 100%; background-position: top; width: 80px; height: 80px; display: block; } ";
css += "@media only screen and (max-width: 768px) { .col-md-12>a[href*='/anime/']>forum-icon { width: 64px; height: 64px; } } ";
css += ".col-md-12>a[href*='/anime/']>forum-icon>canvas { display: none; } ";
css += ".content > .container > .row > .col-md-12 { padding: 0px; } ";
css += "@media only screen and (max-width: 768px) { .content > .container > .row > .col-md-12 { padding-top: 6px; } } ";
css += ".userinfo>a>forum-icon>canvas { width: 80px; height: 80px; !important } ";
//css += "#content-wrapper { background: url('https://files.catbox.moe/9jpuek.png'); } ";
//css += "#content-wrapper { background: url('https://files.catbox.moe/58ues2.png'); } ";
css += "#content-wrapper { background: url('https://files.catbox.moe/dsbat4.png'); } ";
css += "forum-threads .thread { margin-left: 5px; margin-right: 5px; -webkit-box-shadow: inset 0 0 10px 1px rgba(0, 0, 0, 0.3); } ";
css += "forum-threads .thread.read { border-left: none !important; margin-left: 5px !important; } ";
css += "forum-threads .thread .threadinfo .threadlink { color: rgba(234, 108, 86, 1); } ";
css += "forum-threads .thread.read .threadlink, forum-threads .thread.read a { color: #666; } ";
css += "forum-threads .thread.sticky { background-color: #FFFFFF; border-left: 8px solid rgba(235, 129, 94, 1) !important; margin-left: -3px !important; color: inherit; -webkit-filter: grayscale(0.1); display: flex; width: auto; /* padding-right: 20px; */ } ";
css += "forum-threads .thread.sticky .threadlink, forum-threads .thread.sticky a { color: rgba(249, 96, 41, 1); } ";
css += "forum-threads .thread.updated .threadlink, forum-threads .thread.updated a { color: rgba(237, 34, 7, 1); } ";
css += "forum-threads .thread.updated { border-left: none !important; margin-left: 5px !important; background-color: #FFFFFF; -webkit-box-shadow: inset 0 0 10px 1px rgba(99, 181, 99, 0.5);} ";
//-webkit-box-shadow: inset 0 0 10px 1px rgba(99, 181, 99, 0.5);
css += "forum-threads .thread.updated.sticky { border-left: 8px solid rgba(235, 129, 94, 1) !important; margin-left: -3px !important; background-color: #FFFFFF; } ";
css += "@media only screen and (max-width: 766px) { forum-threads .thread { margin-left: 5px !important; border-left: inherit!important; } } ";
css += ".col-md-12.col-sm-12 { width: 100%; } ";
//css += "@media only screen and (min-width: 767px) { .row.clearfix { margin-right: -25px; } forum-threads .thread { margin-left: 5px; margin-right: 5px; display: inline-flex; width: 48%;} forum-threads .thread.sticky {display: inline-flex; width: 100%;}";

//css += "@media only screen and (max-width: 767px) {  } } ";

console.log("Dumping CSS: ");
console.log(css);
GM_addStyle ( css );
console.log("Changed style of page: " + document.URL);

