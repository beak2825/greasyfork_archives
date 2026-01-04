// ==UserScript==
// @name         taobao key fix
// @namespace    http://xuefer.win/
// @version      0.1
// @description  remove stupid accesskey design
// @author       You
// @match        https://www.taobao.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/382352/taobao%20key%20fix.user.js
// @updateURL https://update.greasyfork.org/scripts/382352/taobao%20key%20fix.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var q = document.getElementById("q");
	console.log(q);
	if (q) {
		q.removeEventListener("keydown");
	}
})();
