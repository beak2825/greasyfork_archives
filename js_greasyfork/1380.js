// ==UserScript==
// @name           hwm_add_diamond
// @author         Demin
// @namespace      Demin
// @description    Отображает 100500 бриллиантов (скрипт-шутка) (by Demin)
// @homepage       https://greasyfork.org/users/1602-demin
// @icon           http://i.imgur.com/LZJFLgt.png
// @version        2.0
// @encoding 	   utf-8
// @include        http://www.heroeswm.ru/*
// @include        http://qrator.heroeswm.ru/*
// @include        http://178.248.235.15/*
// @include        http://www.lordswm.com/*
// @exclude        */rightcol.php*
// @exclude        */ch_box.php*
// @exclude        */chat*
// @exclude        */ticker.html*
// @exclude        */frames*
// @exclude        */brd.php*
// @downloadURL https://update.greasyfork.org/scripts/1380/hwm_add_diamond.user.js
// @updateURL https://update.greasyfork.org/scripts/1380/hwm_add_diamond.meta.js
// ==/UserScript==

// (c) 2012-2015, demin  ( http://www.heroeswm.ru/pl_info.php?id=15091 )

(function() {

var version = '2.0';


var diamonds = "100,500";


if ( !document.querySelector("body") ) return;

// polychenie nika
var flash_heart = document.querySelector("object > param[value*='heart.swf']");
if ( flash_heart ) flash_heart = flash_heart.parentNode.querySelector("param[name='FlashVars']");
if ( flash_heart ) {
	flash_heart = flash_heart.value.split('|');
	if ( flash_heart[3] ) { var nick = flash_heart[3]; }
}

if ( !nick ) return;

var parent = document.querySelector("img[src*='i/diamond.gif']");
if ( !parent ) return;
while ( parent.tagName != 'TD' ) { parent = parent.parentNode; }
var previous = parent.previousSibling;
while ( previous.tagName != 'TD' ) { previous = previous.previousSibling; }
previous = previous.previousSibling;
var next = parent.nextSibling;
if ( previous && previous.tagName == 'TD' && previous.querySelector("img[src*='i/gem.gif']") && next && next.tagName == 'TD' ) {
	next.innerHTML = diamonds;
}

})();
