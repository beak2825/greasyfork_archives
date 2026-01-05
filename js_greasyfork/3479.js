// ==UserScript==
// @name Wykoplayer na Wykopie
// @namespace http://wykoplayer.pl/
// @version 1.0
// @description Umożliwia odsłuchiwanie danego tagu w Wykoplayerze
// @match http://*.wykop.pl/tag/*
// @copyright 2014+, max1m0- (http://wykop.pl/ludzie/max1m0-)
// @require http://code.jquery.com/jquery-latest.js
// @downloadURL https://update.greasyfork.org/scripts/3479/Wykoplayer%20na%20Wykopie.user.js
// @updateURL https://update.greasyfork.org/scripts/3479/Wykoplayer%20na%20Wykopie.meta.js
// ==/UserScript==

var tag = $('input#input-tag.create').val()

var link = 'http://wykoplayer.pl/index.php/player/tag/'+tag;
var newlink = '<a href="'+link+'" class="button" title="Słuchaj tagu '+tag+' w Wykoplayerze"><i class="fa fa-play"></i> odsłuchaj tag #'+tag+' w Wykoplayerze</a>';

var links_dom = $('div.row.buttons p');
var links = newlink + links_dom.html();
links_dom.html(links);