// ==UserScript==
// @name			Gist ‘.user.js’ EZ Install Link
// @author			SijosxStudio
// @author              http://tinyurl.com/BuySijosxStudioCoffee
// @namespace		gist-.user.js-EZInstallLink
// @include			http://gist.github.com/*
// @version			1.2
// @license			GPL version 3 or any later version; http://www.gnu.org/copyleft/gpl.html
// @description		This userscript will add an 'Install' link to all userscript files which end with .user.js by necessity on github and will replace the “raw” button.

// @downloadURL https://update.greasyfork.org/scripts/510993/Gist%20%E2%80%98userjs%E2%80%99%20EZ%20Install%20Link.user.js
// @updateURL https://update.greasyfork.org/scripts/510993/Gist%20%E2%80%98userjs%E2%80%99%20EZ%20Install%20Link.meta.js
// ==/UserScript==

(function(doc){
	var userscripts = doc.evaluate("//a[contains(substring(@href,string-length(@href)-9),'.user.js') and text()='raw']",doc,null,6,null),
		userscript,raw;
	for(var i=userscripts.snapshotLength-1;i>-1;i--){
		userscript = userscripts.snapshotItem(i);
		userscript.innerHTML = 'install';
		raw = userscript.cloneNode(false);
		raw.innerHTML = 'raw';
		raw.href = "view-source:" + raw.href;
		userscript.parentNode.insertBefore(raw,userscript);
	}
})(document);