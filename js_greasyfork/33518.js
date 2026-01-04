// ==UserScript==
// @name         YouRadio
// @namespace    http://jonas.ninja
// @version      1.0.1
// @description  remove the video parts of YouTube
// @author       http://jonas.ninja
// @match        https://www.youtube.com/*
// @require      https://code.jquery.com/jquery-3.2.1.min.js
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/33518/YouRadio.user.js
// @updateURL https://update.greasyfork.org/scripts/33518/YouRadio.meta.js
// ==/UserScript==
/* jshint -W097 */
/* global $, GM_addStyle */
/* jshint asi: true, multistr: true */
'use strict';

var styles = '\
.ytp-preview {\
  visibility: hidden !important;\
}\
.html5-video-container {\
  height: 100%;\
}\
.html5-video-container:after {\
  content: "";\
  width: 100%;\
  height: 100%;\
  background-color: white;\
  position: absolute;\
}\
.yt-img-shadow {\
  opacity: 0 !important;\
}\
.ytd-thumbnail:hover .yt-img-shadow {\
  opacity: 1 !important;\
  transition: opacity 450ms;\
}\
\
.yt-thumb-simple,\
.ytp-suggestion-image {\
  opacity: 0 !important;\
}\
.title,\
.watch-title,\
.spf-link,\
#eow-description,\
.ytp-videowall-still-image,\
.c4-visible-on-hover-container{\
    filter: blur(20px);\
}\
.title:hover,\
.watch-title:hover,\
.spf-link:hover,\
#eow-description:hover,\
.ytp-videowall-still-image:hover {\
    filter: none;\
}\
'

GM_addStyle(styles)

document.title = "YouTube Radio"
