// ==UserScript==
// @name        GetXFPlayerLink
// @namespace   http://com.xchinastudio.com/getxfplayerlink
// @description 获取先锋影音资源网站的xfplay链接
// @include     http://www.kanzhelu18.com/*/*/player*
// @include     http://www.x1234.info/*/*/*/tryry.html?*
// @version     1
// @downloadURL https://update.greasyfork.org/scripts/30715/GetXFPlayerLink.user.js
// @updateURL https://update.greasyfork.org/scripts/30715/GetXFPlayerLink.meta.js
// ==/UserScript==

function getKZLJs() {
  var player = document.getElementById('player');
  var child = player.firstElementChild;
  var src = child.getAttribute('src');
  var node = document.createElement('div');
  node.innerHTML = '&nbsp;&nbsp;&raquo;&nbsp;&nbsp;<a href=' + src + '><b>XFPlayer</b></a>';
  var div = document.getElementsByClassName('a960') [0];
  div.appendChild(node);
  return src;
}
function copy_to_clipboard(text) {
  //TODO
}
function getXFPlayerSrc(dest) {
  var src = dest.substring(dest.indexOf('xfplay://'), dest.lastIndexOf('$xfplay'));
  //if(!copy_to_clipboard(src)){
  alert(src);
  //}
}
function getJs(sUrl) {
  var o = new XMLHttpRequest();
  o.open('get', sUrl, false);
  o.send(null);
  return o.responseText;
}
function getX1234Js() {
  var player = document.getElementById('xmplay');
  var tmplay = player.querySelector('.tmplay').firstChild;
  //alert(tmplay.getAttribute('src'));
  return tmplay.getAttribute('src');
}
var u = location.host;
if (u.indexOf('kanzhelu18') > 0) {
  getXFPlayerSrc(getJs(getKZLJs()));
} else if (u.indexOf('x1234') > 0) {
  getXFPlayerSrc(getJs(getX1234Js()));
}
