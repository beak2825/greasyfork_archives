// ==UserScript==
// @name        567zw_yh
// @namespace   kimihiro@live.cn
// @description 优化567中文网阅读页面
// @include     http://221.233.60.100:81/book_j.php?*
// @grant       none
// @version 0.0.1.20160309060717
// @downloadURL https://update.greasyfork.org/scripts/17861/567zw_yh.user.js
// @updateURL https://update.greasyfork.org/scripts/17861/567zw_yh.meta.js
// ==/UserScript==
var reg;
var booktext = document.getElementById('booktext');
var orgText = booktext.innerHTML;
var newText;
//去掉<br>
reg = new RegExp('<br>\n<br>', 'g');
newText = booktext.innerHTML.replace(reg, '');
//去掉多余的空格
reg = new RegExp('([　])+', 'g');
newText = newText.replace(reg, '');
//加上<p>
reg = new RegExp('([一-龥]|[“”，。！？：…()、—*])+', 'g');
newText = newText.replace(reg, function (strMatch) {
  return '<p>&nbsp;&nbsp;' + strMatch + '</p>'
});
booktext.innerHTML = newText;
//调整行高
var Tp = document.getElementsByTagName('p');
for (var i = 0; i < Tp.length; i++) {
  Tp[i].style.lineHeight = '140%';
}
//工具栏滚动

window.onscroll = function () {
  var t = document.documentElement.scrollTop || document.body.scrollTop;
  var topTool = document.getElementsByClassName('toptool') [0];
  topTool.style.top = 0;
  if (t > topTool.offsetHeight) {
    topTool.style.position = 'fixed';
  } else {
    topTool.style.position = '';
  }
}