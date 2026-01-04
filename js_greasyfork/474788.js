// ==UserScript==
// @name            飞卢小说阅读页面净化
// @description     用于删除飞卢小说网页端阅读页面的无关元素
// @version         0.3.2
// @author          Confringo
// @namespace       https://github.com/gonghengjie/faloo-reading-improved/
// @match           *://b.faloo.com/*_*.html
// @license         AGPL-3.0-or-later
// @downloadURL https://update.greasyfork.org/scripts/474788/%E9%A3%9E%E5%8D%A2%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E9%A1%B5%E9%9D%A2%E5%87%80%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/474788/%E9%A3%9E%E5%8D%A2%E5%B0%8F%E8%AF%B4%E9%98%85%E8%AF%BB%E9%A1%B5%E9%9D%A2%E5%87%80%E5%8C%96.meta.js
// ==/UserScript==

(function() {
	'use strict';
	try{
		document.evaluate("/html/body/div[6]/div/div[1]/div[6]/a/img", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[7]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[6]/div/div[1]/div[9]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[6]/div/div[1]/div[8]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[6]/div/div[1]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[6]/div/div[1]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[6]/div/div[1]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[6]/div/div[3]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[6]/div/div[1]/div[5]/div[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[6]/div/div[3]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[6]/div/div[3]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[6]/div/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[5]/div", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[3]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[1]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[1]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[1]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[1]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[1]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[1]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[1]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[4]/div/div/div[3]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		return;
	}
	catch (k){
		console.log('No picture found. Entering non-picture mode.');
		document.evaluate("/html/body/div[7]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[6]/div/div[5]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[6]/div/div[4]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[6]/div/div[3]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[6]/div/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[6]/div/div/div[9]/div[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[6]/div/div/div[8]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[6]/div/div/div[7]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[6]/div/div/div[5]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[6]/div/div/div[4]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[6]/div/div/div[3]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[6]/div/div/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[5]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[3]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[2]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[2]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[2]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[2]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[2]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[2]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[2]/div[2]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[1]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
		document.evaluate("/html/body/div[4]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue.remove();
	}
})();