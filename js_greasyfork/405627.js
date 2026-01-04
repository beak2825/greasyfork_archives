// ==UserScript==
// @name         Google自动跳转
// @author       skyrocketing Hong
// @version      1.1
// @include      /^https?\:\/\/[^\/]+\.google\.com\.[^\/]+/
// @description  自动跳转到google.com
// @namespace https://greasyfork.org/users/601237
// @downloadURL https://update.greasyfork.org/scripts/405627/Google%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/405627/Google%E8%87%AA%E5%8A%A8%E8%B7%B3%E8%BD%AC.meta.js
// ==/UserScript==

location.replace(
	location.href.replace(/\:\/\/[^\/]+\.google\.com\.[^\/]+/, '://google.com')
)