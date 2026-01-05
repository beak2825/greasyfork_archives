// ==UserScript==
// @name         F365 Links without notifications
// @description  Edit navbar
// @match        http://forum.football365.com/*
// @grant        none
// @version 0.0.1.20150812101245
// @namespace https://greasyfork.org/users/14019
// @downloadURL https://update.greasyfork.org/scripts/11491/F365%20Links%20without%20notifications.user.js
// @updateURL https://update.greasyfork.org/scripts/11491/F365%20Links%20without%20notifications.meta.js
// ==/UserScript==

$('ul#nav-main').append('<li class="rightside"><a href="http://forum.football365.com/ucp.php?i=ucp_main&mode=bookmarks">Bookmarks</a></li><li class="rightside"><a href="http://forum.football365.com/search.php?search_id=egosearch">View Your Posts</a></li>');
$('ul#nav-main li.icon-notification').remove();
$('.postbody .post-buttons').append('<li><a class="button icon-button reply-icon" title="Post reply" href="'+$('.action-bar .reply-icon').attr('href')+'"><span>Reply</span> </a> </li>');
$('.section-search .topiclist .row .list-inner').each(function () {
    $(this).html($(this).html().substring(0,$(this).html().lastIndexOf("by <a")))
});