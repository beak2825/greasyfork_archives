// ==UserScript==
// @name       KAT - Request From Uploader
// @namespace  RequestFrom
// @version    1.00
// @description  Dislays a popup asking what you are requesting
// @require		http://code.jquery.com/jquery-latest.js
// @match       http://kickass.to/user/*
// @match       https://kickass.to/user/*
// @downloadURL https://update.greasyfork.org/scripts/4193/KAT%20-%20Request%20From%20Uploader.user.js
// @updateURL https://update.greasyfork.org/scripts/4193/KAT%20-%20Request%20From%20Uploader.meta.js
// ==/UserScript==

var friend = $('a[href^="/friend/"]').attr("href");
var bookmark = $('a[href^="/bookmarks/"]').attr("href");
alert(friend);
alert(bookmark);
if ((/^\/friend/).test(friend) == true)
{
	('<a id="Request" href="#" class="icon16 textButton" style="margin-right:5px;"><span></span>request torrent</a>').insertBefore(".iheart");
}
/**else
{
    alert('Failure');
}
alert(friend);
}**/