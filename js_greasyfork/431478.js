// ==UserScript==
// @name         财新自动展开全文
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  财新网自动展开全文，对于长文不用再手动翻页或手动点击余下全文
// @author       FrankJiangWH
// @match        *.caixin.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/431478/%E8%B4%A2%E6%96%B0%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.user.js
// @updateURL https://update.greasyfork.org/scripts/431478/%E8%B4%A2%E6%96%B0%E8%87%AA%E5%8A%A8%E5%B1%95%E5%BC%80%E5%85%A8%E6%96%87.meta.js
// ==/UserScript==

(function() {

function changeDomain(){
	var oldDomain = window.location.href;
	var len = oldDomain.length;
	if (oldDomain[len-2]!="p" && oldDomain[len-3]!="?" && oldDomain[len-1]=="l" && oldDomain[len-2]=="m" && oldDomain[len-3]=="t" && oldDomain[len-4]=="h"){
		window.location.replace(oldDomain+"?p0")
	}
	else {
		return
	}
}

changeDomain()

})();