// ==UserScript==
// @name         Rodong Contained
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Opens rodong.rep.kp news links in the same browser window, because we are all the same :)
// @author       penneyb83@gmail.com
// @match        http://rodong.rep.kp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rep.kp
// @grant        none
// @license      Public domain
// @downloadURL https://update.greasyfork.org/scripts/502317/Rodong%20Contained.user.js
// @updateURL https://update.greasyfork.org/scripts/502317/Rodong%20Contained.meta.js
// ==/UserScript==

/* eslint-disable */

(function() {
    'use strict';

	const unwrap = (target, propertyName, prefix, suffix = prefix) =>
	{
		if(target[propertyName].startsWith(prefix) && target[propertyName].endsWith(suffix))
			target[propertyName] = target[propertyName].substr(prefix.length, target[propertyName].length - prefix.length - suffix.length);

		return;
	};

	Array.from(document.querySelectorAll("a[href]")).forEach(a => unwrap(a, "href", "javascript:article_open('", "%27)"));

	return;
})();
