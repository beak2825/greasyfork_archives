// ==UserScript==
// @name        Shodan自动登录
// @description shodan auto Login
// @namespace   https://greasyfork.org/users/91873
// @include     https://*.shodan.io/*
// @include     *://*.shodan.io/*
// @grant       none
// @version     1.0.0
// @author      wujixian
// @grant       none
// @run-at      document-end
// @downloadURL https://update.greasyfork.org/scripts/443324/Shodan%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/443324/Shodan%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==
(async () => {
	var strCookies = document.cookie;
	if (strCookies.indexOf("8b1f83c14958bbf59e8d7ecd3f8a835d6256d3616256d3151bad5db81cec71b9") == -1) {
		document.cookie="polito=\"8b1f83c14958bbf59e8d7ecd3f8a835d6256d3616256d3151bad5db81cec71b9!\";domain=.shodan.io;path=/;";
		document.cookie="polito=\"8b1f83c14958bbf59e8d7ecd3f8a835d6256d3616256d3151bad5db81cec71b9!\";domain=account.shodan.io;path=/;";
		location.reload();
	} 
})();