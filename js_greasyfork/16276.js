// ==UserScript==
// @name          FlyByNight Midnight Theme For HF
// @namespace  
// @version       4.2
// @description   Dark theme for HackForums & Custom userbars
// @include       http://hackforums.net/*
// @include       http://www.hackforums.net/*
// @include		  *.hackforums.net/*
// @copyright     2013-2014 fbn
// @author        Sasori
// @run-at        document-start
// @downloadURL https://update.greasyfork.org/scripts/16276/FlyByNight%20Midnight%20Theme%20For%20HF.user.js
// @updateURL https://update.greasyfork.org/scripts/16276/FlyByNight%20Midnight%20Theme%20For%20HF.meta.js
// ==/UserScript==

var link = window.document.createElement('link');
link.rel = 'stylesheet';
link.type = 'text/css';
link.href = 'http://jawe.pw/data/other/hfstyle.css';
document.getElementsByTagName("HEAD")[0].appendChild(link);
