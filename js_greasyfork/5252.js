// ==UserScript==
// @name        xunlei liebiao height
// @namespace   none
// @version     5.8.6
// @description     迅雷列表自动高度
// @include     http://kuai.xunlei.com/d/*
// @downloadURL https://update.greasyfork.org/scripts/5252/xunlei%20liebiao%20height.user.js
// @updateURL https://update.greasyfork.org/scripts/5252/xunlei%20liebiao%20height.meta.js
// ==/UserScript==
var list = document.getElementsByClassName('file_src file_list liebiao');
list[0].style.height = 'auto';