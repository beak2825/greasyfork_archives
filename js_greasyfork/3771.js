// ==UserScript==
// @name       LogoChanger v1.0.5
// @namespace   Logo
// @author     Maxy
// @description replaces the any logo with one of your wish
// @include     http://baidu.com/*
// @include     *.baidu.com/*
// @version     1.0.5
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/3771/LogoChanger%20v105.user.js
// @updateURL https://update.greasyfork.org/scripts/3771/LogoChanger%20v105.meta.js
// ==/UserScript==



// saves all settings of all <img> tags in the tags variable/array
var tags = document.getElementsByTagName('img');


// goes through every entry in the tags array, so through every <img> tag

for (var i = 0; i < tags.length; i++) {


 // replaces the searched image src with the one you want. This happens in ALL <img> tags with the searched src
 
 tags[i].src = tags[i].src.replace('http://img.baidu.com/img/baike/logo-baike.png', 'https://farm4.staticflickr.com/3901/14767310726_7f804f1944_o.png');
 tags[i].src = tags[i].src.replace('http://www.baidu.com/img/baidu_jgylogo3.gif?v=06534357.gif', 'https://farm4.staticflickr.com/3901/14767310726_7f804f1944_o.png');

}