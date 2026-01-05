// ==UserScript==
// @name           What.CD Extended Main Menu
// @namespace      https://greasyfork.org/users/3348-xant1k
// @description    Injects links to better.php and logchecker.php into the main menu
// @include        https://what.cd/*
// @include        https://ssl.what.cd/*
// @version        1.0
// @downloadURL https://update.greasyfork.org/scripts/3217/WhatCD%20Extended%20Main%20Menu.user.js
// @updateURL https://update.greasyfork.org/scripts/3217/WhatCD%20Extended%20Main%20Menu.meta.js
// ==/UserScript==

(function() {
	var target = document.getElementById('menu').getElementsByTagName('ul')[0]; /* Main menu */
	/*var target = document.getElementById('userinfo_minor');*/ /* User menu */


	/* Insert logchecker link */

	var lc_item = document.createElement('li');

	lc_item.id = 'nav_logchecker';

	lc_item.innerHTML = '<a href="logchecker.php">Logchecker</a>';

	target.appendChild(lc_item);


	/* Insert better link */

	var better_item = document.createElement('li');

	better_item.id = 'nav_better';

	better_item.innerHTML = '<a href="better.php">Better</a>';

	target.appendChild(better_item);
})();