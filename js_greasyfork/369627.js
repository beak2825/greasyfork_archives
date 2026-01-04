// ==UserScript==
// @name         SubyShare timeout bypass
// @namespace    timeout.bypass
// @version      0.0.0.1
// @description  Shows Download button immediately
// @author       AHOHNMYC
// @match        https://subyshare.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/369627/SubyShare%20timeout%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/369627/SubyShare%20timeout%20bypass.meta.js
// ==/UserScript==

const codeInput = document.querySelector('[name="code"]');
if (!codeInput) {
	document.querySelector('[name="method_free"]').click();
} else {
	document.getElementById('countdown').style.display = 'none';
	document.querySelector('.downloadbtn').removeAttribute('disabled');
	document.querySelector('.downloadbtn').style = 'display: block; margin-bottom: 20px;';
	codeInput.focus();
}
