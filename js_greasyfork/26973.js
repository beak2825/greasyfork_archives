// ==UserScript==
// @name         アマゾンポチと入れさせないやつ
// @namespace    http://github.com/unarist/
// @version      0.2
// @description  「#アマゾンポチ と入れて@返信でカートに追加・後で買う」「@amazonJPさんから」を消す
// @author       unarist
// @match        http://www.amazon.co.jp/*dp/*
// @match        http://www.amazon.co.jp/gp/product/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/26973/%E3%82%A2%E3%83%9E%E3%82%BE%E3%83%B3%E3%83%9D%E3%83%81%E3%81%A8%E5%85%A5%E3%82%8C%E3%81%95%E3%81%9B%E3%81%AA%E3%81%84%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/26973/%E3%82%A2%E3%83%9E%E3%82%BE%E3%83%B3%E3%83%9D%E3%83%81%E3%81%A8%E5%85%A5%E3%82%8C%E3%81%95%E3%81%9B%E3%81%AA%E3%81%84%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==

var elem = jQuery('a[title=Twitterでシェアする]');
var href = elem.attr('href');
var tweeturl = decodeURIComponent(href.replace(/.+location=/, ''));
tweeturl = tweeturl.replace(/&via=[^&]+/, '');
tweeturl = tweeturl.replace(/&text=[^&]+/, '&text=' + encodeURIComponent(document.title));
elem.attr('href', tweeturl);