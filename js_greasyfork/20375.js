// ==UserScript==
// @name         Jvc 2.0.1
// @namespace    http://tampersdfsdfet/
// @version      0.2
// @description  JVC 2.0.1
// @author       Singles
// @include     http://*.jeuxvideo.com/*
// @include     http://*.forumjv.com/*
// @include     https://*.jeuxvideo.com/*
// @include     https://*.forumjv.com/*
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.9.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/20375/Jvc%20201.user.js
// @updateURL https://update.greasyfork.org/scripts/20375/Jvc%20201.meta.js
// ==/UserScript==


$('.header-top').css('height',"2.5rem");
$('.global-menu').css('height',"2.5rem");
$('.global-web').css('height',"2.5rem");
$('.global-user').css('height',"2.5rem");


$('.global-menu').css('line-height',"2.5rem");
$('.global-web').css('line-height',"2.5rem");
$('.global-user').css('line-height',"2.5rem");

$('.nav-primary .nav-lvl1-item > .nav-link').css('line-height',"2.5rem");
$('.nav-primary .nav-lvl1-item > .nav-link').css('height',"2.5rem");

$('.nav-primary').css('height',"2.5rem");
$('.nav-primary').css('top',"-2.5rem");

$('.container').css('max-width',"none");
$('.nav-lvl1 li:last-child').hide();
$('.forum-right-col').find('iframe').hide();
$('.forum-right-col').find('body').hide();
$('.header-top').css('height',"2.5rem");
$('.header-top').css('height',"2.5rem");
$('.header-top').css('height',"2.5rem");