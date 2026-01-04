// ==UserScript==
// @name        蓝奏云域名重定向
// @description 蓝奏云重定向
// @icon        https://www.lanzoui.com/favicon.ico
// @version     2025040302
// @include     /^https?://([\w\-]+\.)?lanzou[a-z]?\.com/.*/
// @grant       none
// @license     Unlicense
// @run-at      document-start
// @namespace https://greasyfork.org/users/1235823
// @downloadURL https://update.greasyfork.org/scripts/486311/%E8%93%9D%E5%A5%8F%E4%BA%91%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91.user.js
// @updateURL https://update.greasyfork.org/scripts/486311/%E8%93%9D%E5%A5%8F%E4%BA%91%E5%9F%9F%E5%90%8D%E9%87%8D%E5%AE%9A%E5%90%91.meta.js
// ==/UserScript==

const domain = "lanzoui.com";

if (!location.hostname.endsWith(domain)) {
	location.hostname = location.hostname.replace(/lanzou[a-z]?\.com$/, domain);
}
