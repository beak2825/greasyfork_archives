// ==UserScript==
// @name         Xenforo invisitext
// @namespace    http://davidlynch.org/
// @version      0.6
// @description  Make some invisible text a little more visible + some tweaks
// @author       David Lynch
// @match        https://forums.sufficientvelocity.com/*
// @match        https://forums.spacebattles.com/*
// @match        https://forums.questionablequesting.com/*
// @match        https://forum.questionablequesting.com/*
// @match        https://xenforo.com/community/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/37090/Xenforo%20invisitext.user.js
// @updateURL https://update.greasyfork.org/scripts/37090/Xenforo%20invisitext.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

//shows invisible text
GM_addStyle('span[style*="Transparent"], span[style*="transparent"], span[style*="TRANSPARENT"] { color:black !important; background-color:white !important; }');
//makes black text more readable
GM_addStyle('span[style*="black"], span[style*="#000000"], span[style*="Black"] { background-color: #494949 !important; }');
//makes pure white text stand out
GM_addStyle('span[style*="white"], span[style*="#ffffff"] { background-color: #494949 !important; }');
//makes blue text more readable
GM_addStyle('span[style*="#0000ff"], span[style*="#0040ff"] { background-color: #bfd2fc !important; }');
//makes indigo text more readable
GM_addStyle('span[style*="#3f33cc"] { color:indigo !important; background-color: #dbcce6 !important; }');
//makes apathy? text noticable
GM_addStyle('span[style*="#c0c0c0"] { color:#606060 !important; background-color: #040404 !important; }');