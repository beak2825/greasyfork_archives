// ==UserScript==
// @name        WaniKani Vocabulary Support
// @namespace   Aru
// @description Adds useful links to the Vocabulary pages
// @include     http*.wanikani.com/vocabulary/*
// @include     http*.wanikani.com/level/*/vocabulary/*
// @version     1.0
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/23754/WaniKani%20Vocabulary%20Support.user.js
// @updateURL https://update.greasyfork.org/scripts/23754/WaniKani%20Vocabulary%20Support.meta.js
// ==/UserScript==

var vocab = document.getElementsByClassName('vocabulary-icon')[0].firstChild.innerHTML;

var url1 = 'http://eow.alc.co.jp/search?q=' + encodeURIComponent(vocab) + '&ref=sa';
var info1 = document.getElementsByClassName('page-list')[0].getElementsByTagName('ul')[0];
var alc = document.createElement('li');
alc.innerHTML = '<a target="_alcVocab" href="' + url1 + '">ALC</a>';
info1.appendChild(alc);

var url2 = 'http://dictionary.goo.ne.jp/srch/en/' + encodeURIComponent(vocab) + '/m1u/';
var info2 = document.getElementsByClassName('page-list')[0].getElementsByTagName('ul')[0];
var goo = document.createElement('li');
goo.innerHTML = '<a target="_alcVocab" href="' + url2 + '">Goo</a>';
info2.appendChild(goo);

var url3 = 'http://classic.jisho.org/sentences?jap=' + encodeURIComponent(vocab);
var info3 = document.getElementsByClassName('page-list')[0].getElementsByTagName('ul')[0];
var jisho = document.createElement('li');
jisho.innerHTML = '<a target="_alcVocab" href="' + url3 + '">Jisho</a>';
info3.appendChild(jisho);

var url4 = 'http://tangorin.com/examples/' + encodeURIComponent(vocab);
var info4 = document.getElementsByClassName('page-list')[0].getElementsByTagName('ul')[0];
var tangorin = document.createElement('li');
tangorin.innerHTML = '<a target="_alcVocab" href="' + url4 + '">Tangorin</a>';
info4.appendChild(tangorin);

var url5 = 'http://ejje.weblio.jp/sentence/content/' + encodeURIComponent(vocab);
var info5 = document.getElementsByClassName('page-list')[0].getElementsByTagName('ul')[0];
var weblio = document.createElement('li');
weblio.innerHTML = '<a target="_alcVocab" href="' + url5 + '">Weblio</a>';
info5.appendChild(weblio);