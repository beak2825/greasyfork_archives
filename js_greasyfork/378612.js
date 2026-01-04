// ==UserScript==
// @name        v2ex hide thank area
// @description 隐藏“感谢”按钮
// @namespace   https://www.v2ex.com
// @include     https://www.v2ex.com/t/*
// @version     1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/378612/v2ex%20hide%20thank%20area.user.js
// @updateURL https://update.greasyfork.org/scripts/378612/v2ex%20hide%20thank%20area.meta.js
// ==/UserScript==
var items = document.getElementsByClassName('thank_area');
for (var i = 0; i < items.length; i++) {
  items[i].getElementsByClassName('thank')[1].style.display = 'none';
}