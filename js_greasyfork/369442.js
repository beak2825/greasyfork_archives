// ==UserScript==
// @name               Open GIF In Zhihu "Open image in new tab"
// @name:zh-CN         右键打开知乎GIF时自动播放
// @description        知乎gif上右键打开新图片时可以自动播放
// @description:zh-cn  知乎gif上右键打开新图片时可以自动播放
// @version            0.0.1
// @run-at             document-start
// @match              https://*.zhimg.com/*_r.jpg
// @namespace          https://trim21.me/
// @downloadURL https://update.greasyfork.org/scripts/369442/Open%20GIF%20In%20Zhihu%20%22Open%20image%20in%20new%20tab%22.user.js
// @updateURL https://update.greasyfork.org/scripts/369442/Open%20GIF%20In%20Zhihu%20%22Open%20image%20in%20new%20tab%22.meta.js
// ==/UserScript==

var url = document.location.toString();
var m = null;

if ((m = url.match(/(https:\/\/pic\d\.zhimg\.com\/v2.*)_r\.jpg/i))) {
    document.location = m[1] + '.gif'
}
