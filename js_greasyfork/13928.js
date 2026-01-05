// ==UserScript==
// @name         niconico economy
// @namespace    https://twitter.com/aoh72931
// @version      1.0
// @description  ニコニコ動画を強制的に低画質モードにするスクリプト
// @author       aoh72931
// @match        http://www.nicovideo.jp/watch/*
// @exclude      http://www.nicovideo.jp/watch/*?eco=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/13928/niconico%20economy.user.js
// @updateURL https://update.greasyfork.org/scripts/13928/niconico%20economy.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
window.location.replace(document.URL+"?eco=1");