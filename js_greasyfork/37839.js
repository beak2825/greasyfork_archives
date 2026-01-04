// ==UserScript==
// @name         Chrome 应用商店绕个弯下载
// @namespace    mscststs
// @version      0.2
// @description  可以在应用商店中下载.crx ，依赖 chrome-extension-downloader.com
// @author       mscststs
// @match      	 *://chrome-extension-downloader.com/?fromHelper*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/37839/Chrome%20%E5%BA%94%E7%94%A8%E5%95%86%E5%BA%97%E7%BB%95%E4%B8%AA%E5%BC%AF%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/37839/Chrome%20%E5%BA%94%E7%94%A8%E5%95%86%E5%BA%97%E7%BB%95%E4%B8%AA%E5%BC%AF%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

(function() {
	'use strict';
	let My = window.location.href+"";
	let queryString = My.substr(My.indexOf("?fromHelper")+12,10000);
	if(!/chrome\.google\.com/.test(queryString)){
		window.close();
	}

	document.querySelector(".input-append>input").value = (queryString);
	document.querySelector(".input-append>button").click();
	//window.close();
	setTimeout(_=>{window.close();},60e3);





	// Your code here...
})();