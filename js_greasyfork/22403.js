// ==UserScript==
// @name         [FrostTorrents.com] Better Header
// @namespace    pxgamer
// @version      0.1
// @description  Redoes the header on FT
// @author       pxgamer
// @include      *frosttorrents.com/*
// @require      https://code.jquery.com/jquery-3.1.0.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22403/%5BFrostTorrentscom%5D%20Better%20Header.user.js
// @updateURL https://update.greasyfork.org/scripts/22403/%5BFrostTorrentscom%5D%20Better%20Header.meta.js
// ==/UserScript==
/*jshint multistr: true */

(function() {
	'use strict';

	$('head').append('<style>body { margin: 0px; } #m_header{ height: 50px; width: 100%; background-color: white; border-bottom: 1px solid grey; margin-bottom: 10px; } #m_header ul { list-style: none; float: left; padding: 0; margin: 0; line-height: 0px; } #m_header ul li:hover { background-color: #f9f9f9; } #m_header ul li { display: block; float: left; margin: 0px; padding: 7pt 0px; } #m_header ul li a { padding: 15px; display: block; color: black; }</style>');
	$('table.main:first').replaceWith('<div id="m_header"><ul><li class="nav-btn"><a href="index.php" title=>HOME</a></li><li class="nav-btn"><a href="browse.php" title=>BROWSE</a></li><li class="nav-btn"><a href="browse.php?cat=28" title=>MUSIC</a></li><li class="nav-btn"><a href="subs.php" title=>SUBTITLES</a></li><li class="nav-btn"><a href="viewrequests.php" title=>REQUEST</a></li><li class="nav-btn"><a href="upload.php" title=>UPLOAD</a></li><li class="nav-btn"><a href="my.php" title=>PROFILE</a></li><li class="nav-btn"><a href="/community" title=>FORUM</a></li><li class="nav-btn"><a href="rules.php" title=>RULES</a></li><li class="nav-btn"><a href="donate.php" title=>DONATE</a></li><li class="nav-btn"><a href="staff.php" title=>STAFF</a></li><li class="nav-btn"><a href="faq.php" title=>FAQ</a></li></ul><ul style="float: right;"><li class="nav-btn"><a href="logout.php" title=>LOGOUT</a></li></ul></div>');
	$('map[name="m_footer"]').remove();
})();
