// ==UserScript==
// @name        tumblr图片转为1280
// @namespace   1018148046
// @version     0.1
// @grant       none
// @description  tumblr图片尺寸转为1280
// @match        http://*.media.tumblr.com/*
// @match        https://*.media.tumblr.com/*
// @downloadURL https://update.greasyfork.org/scripts/36286/tumblr%E5%9B%BE%E7%89%87%E8%BD%AC%E4%B8%BA1280.user.js
// @updateURL https://update.greasyfork.org/scripts/36286/tumblr%E5%9B%BE%E7%89%87%E8%BD%AC%E4%B8%BA1280.meta.js
// ==/UserScript==
var image = document.getElementsByTagName('img') [0];
var loc = location.toString();
var imageType = loc.match(/_\d\d0\./);
if (image && image.getAttribute('src') == loc) {
  if (imageType.toString() != null) {
    var newLoc = loc;
    newLoc = newLoc.replace(/_\d\d0\./, '_1280.');
    window.location = newLoc;
  }
}
