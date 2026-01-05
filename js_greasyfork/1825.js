// ==UserScript==
// @name Direct to download for ChiaSeNhac
// @id	chiasenhac_download_xifos
// @namespace	  in.co.xifos.toolkit.chiasenhac_download
// @description	ChiaSeNhac direct to download from search results
// @license	GPL v3 or later version
// @include		*://search.chiasenhac.com//*
// @version	0.1
// @author	XiFoS
// @downloadURL https://update.greasyfork.org/scripts/1825/Direct%20to%20download%20for%20ChiaSeNhac.user.js
// @updateURL https://update.greasyfork.org/scripts/1825/Direct%20to%20download%20for%20ChiaSeNhac.meta.js
// ==/UserScript==

(function (d) {
	var target_table = document.getElementsByClassName('tbtable');
	if(target_table.length < 1) {
		return;
	} else {
		target_table = target_table[0];
	}
	var all_a = target_table.getElementsByTagName('a');
	var a = null;
	var match;
	for(i = 0; i < all_a.length; i++) {
		a = all_a.item(i);
		if(a.href) {
			match = a.href.match(/(mp3.*)\.html$/);
			console.log(a.href);
			if(match) {
				a.href = match[1] + "_download.html";
			}
		}
	}
})(document);