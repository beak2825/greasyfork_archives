// ==UserScript==
// @name            twitter_re
// @namespace       http://weibo.com/myimagination
// @author          @MyImagination
// @version			    0.4
// @description     re
// @include         https://twitter.com/*
// @exclude         https://twitter.com/*/status/*
// @exclude         https://twitter.com/*/cards/*
// @license         WTFPL
// @run-at          document-end
// @downloadURL https://update.greasyfork.org/scripts/40819/twitter_re.user.js
// @updateURL https://update.greasyfork.org/scripts/40819/twitter_re.meta.js
// ==/UserScript==
(function () {
//    alert(count);
	if(document.body.innerHTML.length < 55024 && document.body.innerHTML.indexOf("search-404")<1)
	{
		location.reload();
	}
}) ();