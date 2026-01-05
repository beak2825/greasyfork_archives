// ==UserScript==
// @name dunno1
// @version dunno1.2
// @namespace http://www.bitemybutt.com
// @description too hard
// @include https://*.pinterest.com
// @include https://*.pinterest.com/
// @include https://*.pinterest.com/*
// @include https://*.pinterest.com/*/*
// @copyright � JustMyImagination 2015
// @downloadURL https://update.greasyfork.org/scripts/18494/dunno1.user.js
// @updateURL https://update.greasyfork.org/scripts/18494/dunno1.meta.js
// ==/UserScript==

var headID = document.getElementsByTagName("head")[0];
var cssNode = document.createElement('style');
cssNode.type = 'text/css';
cssNode.innerHTML ='body {background: url(http://26.media.tumblr.com/tumblr_m3r053sTw81rvr5ceo1_500.jpg)repeat fixed 0% / 500px 500px;}.UserBoards .Grid {background: url(http://26.media.tumblr.com/tumblr_m3r053sTw81rvr5ceo1_500.jpg)repeat fixed 0% / 500px 500px;} .Board .hoverMask {border: 1px solid rgb(0, 0, 0); border-radius: 3px; bottom: 0; box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.83) inset; left: 0; position: absolute; right: 0; top: 0; transition: background 0.2s linear 0s; z-index: 100;} .UserProfileHeader.v2 .header {border: 0px solid black; background: white url(http://assets.vancitybuzz.com/wp-content/uploads/2013/09/PB300-Golden-Harbour-Coal-Harbour-Vancouver-Skyline-Panoramic-Panorama-Chris-Collacott-avision.ca_.jpg?cddefc) repeat scroll 0 0; border-radius: 6px 6px 0 0; box-shadow: 0px 1px 8px 0px rgba(0, 0, 0, 0), 0px 1px 0px 0px rgba(0, 0, 0, 0) inset; color: rgb(68, 68, 68); height: 158px; padding: 14px 14px 0;} .UserProfileHeader.v2 .about .aboutText {font-size: 16px; color: rgb(68, 68, 68); height: 65px; line-height: 22px; margin: 0; overflow: hidden; padding: 0;} .UserProfileHeader.v2 .about {border: 0px solid black; color: rgb(68, 68, 68); float: left; height: 100px; position: relative; width: 620px;} .UserProfileHeader.v2 .about .iconsLinksEtc {color: rgb(68, 68, 68); font-size: 13px; font-weight: 500; line-height: 20px;} .UserProfileHeader.v2 .profileImage img {border: 1px solid black; box-shadow: 0px 1px 7px 0px rgba(0, 0, 0, 1.0); border-radius: 4px; height: 144px; width: 144px;} .Board.boardCoverImage { background: transparent repeat scroll 0 0; box-shadow: 0 0 6px rgba(0, 0, 0, 0.1), 0px 0px 10px rgba(0, 0, 0, 01) inset; border-radius: 12px; position: relative;} .Grid.hasFooter {background: url(http://26.media.tumblr.com/tumblr_m3r053sTw81rvr5ceo1_500.jpg)repeat fixed 0% / 500px 500px} .Grid {background: url(http://26.media.tumblr.com/tumblr_m3r053sTw81rvr5ceo1_500.jpg)repeat fixed 0% / 500px 500px;} .Header .headerBackground {background: none repeat scroll 0 0 rgba(235, 235, 235, 1); box-shadow: 0 2px 20px 0 rgba(120, 0, 120, 01) inset, 0 1px 20px 0 rgba(0, 0, 0, 0.4);} .Board.boardCoverImage .Button {background: url(http://26.media.tumblr.com/tumblr_m3r053sTw81rvr5ceo1_500.jpg)repeat fixed 0% / 500px 500px rgba(105, 05, 205, 0); box-shadow: 0 0px 5px 0 rgba(120, 0, 120, 01) inset, 0 1px 20px 0 rgba(0, 0, 0, 0.4); border: none; color: rgb(5, 95, 95); text-shadow: none; font-size: 120%;} .Board.boardCoverImage .Button:hover {background: url(http://26.media.tumblr.com/tumblr_m3r053sTw81rvr5ceo1_500.jpg)repeat fixed 0% / 500px 500px repeat scroll 0 0 rgba(105, 05, 205, 0.1); box-shadow: 0 0px 7px 0 rgba(120, 0, 120, 0.9) inset, 0 1px 20px 0 rgba(0, 0, 0, 0.4); border: none; text-shadow: none; color: rgb(5, 95, 95); font-size: 120%;}';
headID.appendChild(cssNode);