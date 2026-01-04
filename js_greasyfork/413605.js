// ==UserScript==
// @name        蓝奏云域名转换
// @description 将 *.lanzou[a-z].com 跳转至 *.lanzou.com，解决一些网络环境下蓝奏云带后缀域名的访问问题。
// @namespace   RainSlide
// @author      RainSlide
// @icon        https://www.lanzou.com/favicon.ico
// @version     1.2
// @include     /^https?://([\w\-]+\.)?lanzou[a-z]?\.com/.*/
// @grant       none
// @license     Unlicense
// @run-at      document-start
// @downloadURL https://update.greasyfork.org/scripts/413605/%E8%93%9D%E5%A5%8F%E4%BA%91%E5%9F%9F%E5%90%8D%E8%BD%AC%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/413605/%E8%93%9D%E5%A5%8F%E4%BA%91%E5%9F%9F%E5%90%8D%E8%BD%AC%E6%8D%A2.meta.js
// ==/UserScript==

const domain = "lanzou.com";

if (!location.hostname.endsWith(domain)) {
	location.hostname = location.hostname.replace(/lanzou[a-z]?\.com$/, domain);
}
