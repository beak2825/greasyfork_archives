// ==UserScript==
// @name         gitlab
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  确认合并分支是否正确
// @author       You
// @match        https://gitlab.medcloud.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418724/gitlab.user.js
// @updateURL https://update.greasyfork.org/scripts/418724/gitlab.meta.js
// ==/UserScript==

(function() {
		'use strict';
		var regTxt = /\s*/g
		var labelTruncate = document.querySelectorAll('.label-truncate');
    console.log(labelTruncate)
		if (labelTruncate&&labelTruncate.length) {
			var fromBranch = labelTruncate[1].children[0].innerHTML.replace(regTxt, "");
			var toBranch = labelTruncate[0].children[1].innerHTML.replace(regTxt, "");
			console.log(fromBranch)
			console.log(toBranch)
			if (document.querySelector('.accept-merge-request')) {
				if (fromBranch !== toBranch) {
					alert("请注意分支是否正确")
				} else {
					alert("分支正确")
				}
			}
		}
})();