// ==UserScript==
// @name           VeryCD File Show Link
// @namespace      http://qixinglu.com
// @description    VeryCD 的文件页面直接显示下载地址而不是js按钮。
// @include        http://www.verycd.com/files/*
// @version 0.0.1.20140517140356
// @downloadURL https://update.greasyfork.org/scripts/1114/VeryCD%20File%20Show%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/1114/VeryCD%20File%20Show%20Link.meta.js
// ==/UserScript==

var button_node = document.getElementById('downloadButton');
var link_node = document.createElement('a');
link_node.text = button_node.name;
link_node.href = button_node.name;
var button_parent_node = button_node.parentNode;
button_parent_node.removeChild(button_node);
button_parent_node.appendChild(link_node);
