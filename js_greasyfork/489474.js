// ==UserScript==
// @name         StackOverflow code标签替换
// @namespace    http://tampermonkey.net/
// @version      2024-03-101
// @description  替换<code>为<strong>，使chrome的翻译拆分效果更好。否则code会截断一整个句子的翻译。
// @author       You
// @match        https://stackoverflow.com/questions/*
// @match        https://*.stackexchange.com/questions/*
// @match        https://developer.mozilla.org/en-US/*
// @match        https://pypi.org/project/*
// @match        https://*.github.com/*
// @match        https://askubuntu.com/*
// @match        https://superuser.com/*
// @match        https://serverfault.com/*
// @match        https://scikit-learn.org/*
// @match        https://access.redhat.com/*
// @match        https://www.smashingmagazine.com/*
// @match        https://docs.npmjs.com/cli/v8/commands/*
// @match        https://highway-env.readthedocs.io/*
// @match        https://router.vuejs.org/*
// @match        https://farama-foundation.github.io/*
// @match        https://developer.chrome.com/*
// @match        https://git-scm.com/docs/*

// @icon         https://www.google.com/s2/favicons?sz=64&domain=stackoverflow.com
// @grant        none
// @license      LGPLv3
// @downloadURL https://update.greasyfork.org/scripts/489474/StackOverflow%20code%E6%A0%87%E7%AD%BE%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/489474/StackOverflow%20code%E6%A0%87%E7%AD%BE%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==


let consoleButton = document.createElement('button');
consoleButton.textContent = '替换code标签';


consoleButton.style.position = 'fixed';
consoleButton.style.top = '30px';
consoleButton.style.right = '30px';
consoleButton.style.zIndex = '9999';


consoleButton.addEventListener('click', function () {
	replaceCode()
});

document.body.appendChild(consoleButton);

function replaceCode() {
	let hh = document.querySelector("body").innerHTML
	// hh = hh.replace(/<code style="user-select: text;">(.*?)<\/code>/g, "<strong style=\"user-select: text;\">$1</strong>")
	// hh = hh.replace(/<code class="notranslate" style="user-select: text;">(.*?)<\/code>/g, "<strong style=\"user-select: text;\">$1</strong>")
	// hh = hh.replace(/<code class="docutils literal notranslate" style="user-select: text;">(.*?)<\/code>/g, "<strong style=\"user-select: text;\">$1</strong>")
	// hh = hh.replace(/<code .+?>(.*?)<\/code>/g, "<strong style=\"user-select: text;\">$1</strong>")
	hh = hh.replace(/<code.*?>(.*?)<\/code>/g, "<strong style=\"user-select: text;\">$1</strong>")

	document.querySelector("body").innerHTML = hh
}