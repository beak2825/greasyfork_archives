// ==UserScript==
// @name        FanFiction Link Helper
// @author      ZBS
// @include     http://m.fanfiction.net/s/*
// @include     http://m.fanfiction.net/u/*
// @include     http://www.fanfiction.net/s/*
// @include     http://www.fanfiction.net/u/*
// @include     https://m.fanfiction.net/s/*
// @include     https://m.fanfiction.net/u/*
// @include     https://www.fanfiction.net/s/*
// @include     https://www.fanfiction.net/u/*
// @version     1.0
// @license     Do What The Fuck You Want To Public License (WTFPL)
// @description Helps fanfiction.net authors get links to their readers
// @namespace https://greasyfork.org/users/109613
// @downloadURL https://update.greasyfork.org/scripts/28108/FanFiction%20Link%20Helper.user.js
// @updateURL https://update.greasyfork.org/scripts/28108/FanFiction%20Link%20Helper.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var els = document.getElementsByTagName("*");
    for(var i = 0, l = els.length; i < l; i++) {
        var el = els[i];
        el.innerHTML = el.innerHTML.replace(/googl:/gi, 'goo.gl/');
        el.innerHTML = el.innerHTML.replace(/bitly:/gi, 'bit.ly/');
        el.innerHTML = el.innerHTML.replace(/youtube:/gi, 'youtu.be/');           //youtube videos
        el.innerHTML = el.innerHTML.replace(/youtuber:/gi, 'youtube.com/user/');  //youtube user
    }
})();