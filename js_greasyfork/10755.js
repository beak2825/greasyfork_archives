// ==UserScript==
// @name        Parallax Forum
// @description This puts the new discussion button and some user options in the menu bar to save space.
// @namespace   c07cdb37-8f56-4b46-adfc-00948bb127d4
// @include     http://forums.parallax.com/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/10755/Parallax%20Forum.user.js
// @updateURL https://update.greasyfork.org/scripts/10755/Parallax%20Forum.meta.js
// ==/UserScript==




var mePhotoWrap = document.getElementsByClassName('PhotoWrap');
var meUserName = document.getElementsByClassName('Username');
var meMenu = document.getElementsByClassName('MeMenu');


var siteMenu = document.getElementsByClassName('SiteMenu');


var boxNewDiscussion = document.getElementsByClassName('BoxNewDiscussion');


siteMenu[0].innerHTML = siteMenu[0].innerHTML + '<li class=MeBoxNewDiscussion>' + boxNewDiscussion[0].innerHTML + '</li>' +
                                                '<li class=PhotoWrap>' + mePhotoWrap[0].innerHTML + '</li>' +
                                         //       '<li class=Username>' + meUserName[0].innerHTML + '</li>' +
                                                '<li class=MeMenu>' + meMenu[0].innerHTML + '</li>' ;