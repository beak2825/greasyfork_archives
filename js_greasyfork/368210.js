// ==UserScript==
// @name THZ.BKUP
// @version 2018.5.1
// @description THZ.la
// @homepageURL https://greasyfork.org/zh-CN/users/186552-wotmcaishiguachazhe
// @require http://cdn.staticfile.org/jquery/1.8.3/jquery.min.js
// @include http://*
// @include https://*
// @namespace https://greasyfork.org/users/186552
// @downloadURL https://update.greasyfork.org/scripts/368210/THZBKUP.user.js
// @updateURL https://update.greasyfork.org/scripts/368210/THZBKUP.meta.js
// ==/UserScript==
(function() {
	if (document.title.indexOf('thz.la') != -1) {
		var linkNode = $('p.attnm > a');
		if (linkNode.length != 0) {
            var orginLink = linkNode.attr('href');
            var pureLink = 'forum.php?mod=attachment&' + orginLink.substring(orginLink.indexOf('?')+1);;
            linkNode.attr('href', pureLink);
            linkNode.removeAttr('onclick');
		}
	}
})();