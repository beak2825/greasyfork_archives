// ==UserScript==
// @name        快照链接
// @namespace   lovearia.me
// @description 把谷歌快照的链接全部转换成谷歌快照
// @include     http://webcache.googleusercontent.com/search?*q=cache:*
// @version     3.1
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/11281/%E5%BF%AB%E7%85%A7%E9%93%BE%E6%8E%A5.user.js
// @updateURL https://update.greasyfork.org/scripts/11281/%E5%BF%AB%E7%85%A7%E9%93%BE%E6%8E%A5.meta.js
// ==/UserScript==
var foreach = function foreach(list, func) {
  return Array.prototype.forEach.call(list, func);
};
var translate = function translate(node_list) {
  foreach(node_list, function (node) {
    if (!!node.href) {
      node.href = 'http://webcache.googleusercontent.com/search?q=cache:' + escape(node.href);
    }
  });
};
var check = function check(node) {
  return node.getAttribute('style') === 'position:relative;';
};
var timer = setInterval(function () {
  if (document.body.childNodesCount < 3) return;
  foreach(document.body.childNodes, function (node) {
    if (check(node)) {
      translate(node.getElementsByTagName('a'));
      clearInterval(timer);
    };
  });
}, 100);
