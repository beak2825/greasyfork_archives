// ==UserScript==
// @name     Jenkins auto-login
// @namespace basilevs
// @description If there is a link "log in" on the Jenkins page, click it immediately.
// @version  1
// @match    https://jenkins-itest.spirenteng.com/jenkins/*
// @match    https://ci.eclipse.org/*
// @grant    none
// @license EPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/513802/Jenkins%20auto-login.user.js
// @updateURL https://update.greasyfork.org/scripts/513802/Jenkins%20auto-login.meta.js
// ==/UserScript==

function findSingleNode(query) {
	const buttons = document.evaluate(query, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE);
  const node = buttons.singleNodeValue
	return node;
}

findSingleNode('/html/body/header/div/a[text()="log in"]')?.click()