// ==UserScript==
// @name        TMD comments hider
// @description hide comments of some users on Torrents.md / ascunde comentarii pe TMD
// @grant      unsafeWindow
// @include    *torrentsmd.*
// @include    *torrentsmoldova.*
// @version    1.0
// @require    http://ajax.googleapis.com/ajax/libs/jquery/1.3/jquery.min.js
// @namespace https://greasyfork.org/users/3718
// @downloadURL https://update.greasyfork.org/scripts/10048/TMD%20comments%20hider.user.js
// @updateURL https://update.greasyfork.org/scripts/10048/TMD%20comments%20hider.meta.js
// ==/UserScript==
jQuery(function($)
{
    var ignoreUser = ['Jonothan', 'Executioner']; //username here
    $('#forumPosts .forumPostName a[href*="userdetails.php?id"] b').each(function (i, v)
    {
      ($.inArray(v.innerHTML, ignoreUser) + 1) && $(v).closest('.forumPostName').css('background-color', 'rgba(247, 12, 12, 0.16)').next('.main').empty();
    });
});

//        ($.inArray(v.innerHTML, ignoreUser) + 1) && $(v).closest('.forumPostName').empty().next('.main').empty();