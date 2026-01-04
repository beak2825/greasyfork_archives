// ==UserScript==
// @name            pinktower.com自動スキップ
// @name:en         pinktower.com autoskip
// @version         1.0.0
// @license         MIT License
// @description     PINKちゃんねるのpinktower.comを自動でスキップします。
// @description:en  Automatically skip pinktower.com on bbspink.com.
// @match           http://pinktower.com/?*
// @match           https://pinktower.com/?*
// @match           http://www.pinktower.com/?*
// @match           https://www.pinktower.com/?*
// @namespace       https://greasyfork.org/users/1160382
// @downloadURL https://update.greasyfork.org/scripts/473991/pinktowercom%E8%87%AA%E5%8B%95%E3%82%B9%E3%82%AD%E3%83%83%E3%83%97.user.js
// @updateURL https://update.greasyfork.org/scripts/473991/pinktowercom%E8%87%AA%E5%8B%95%E3%82%B9%E3%82%AD%E3%83%83%E3%83%97.meta.js
// ==/UserScript==

var url = window.location.href;

if (url.indexOf('http://pinktower.com/?') > -1) {
	location.href = url.replace('http://pinktower.com/?', '');
} else if (url.indexOf('https://pinktower.com/?') > -1) {
	location.href = url.replace('https://pinktower.com/?', '');
} else if (url.indexOf('http://www.pinktower.com/?') > -1) {
	location.href = url.replace('http://www.pinktower.com/?', '');
} else {
	location.href = url.replace('https://www.pinktower.com/?', '');
}