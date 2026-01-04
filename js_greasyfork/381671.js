// ==UserScript==
// @name        E-H MiniMenu
// @description Simplifies the navigation menu.
// @author      Hen-Tie
// @homepage    https://hen-tie.tumblr.com/
// @namespace   https://greasyfork.org/en/users/8336
// @include    	/https:\/\/(.*\.)?(ex|e-)hentai\.org.*/
// @exclude		https://forums.e-hentai.org*
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.2.4/jquery.min.js
// @icon        https://i.imgur.com/pMMVGRx.png
// @version     2.2
// @downloadURL https://update.greasyfork.org/scripts/381671/E-H%20MiniMenu.user.js
// @updateURL https://update.greasyfork.org/scripts/381671/E-H%20MiniMenu.meta.js
// ==/UserScript==

/*════════════════════════════════╗
║          CONFIGURATION          ║
╠═════════════════════════════════╩═══════════════════════════════════╗
║ miniMenuItems" is a list          Bounties    Favorites    Forums   ║
║ of the nav items you want to      Front Page  HentaiVerse  My Home  ║
║ have moved under the menu.        My Tags     My Uploads   News     ║
║ Case sensitive.                   Popular     Settings     Toplists ║
║ Following are your choices.       Torrents    Watched      Wiki     ║
╠═════════════════════════════════════════════════════════════════════╣
║ customMenuItems is a nested       [['url','name'], ['url','name']]  ║
║ list of links you want to add                                       ║
║ in the menu, and their names.                                       ║
║ Following is the format to use.                                     ║
╚════════════════════════════════════════════════════════════════════*/
var miniMenuItems = ['Torrents', 'News', 'Forums', 'Wiki', 'HentaiVerse'];
var customMenuItems = [];
/*═══════════════════════════════════════════════════════════════════*/

var oldNav = $('#nb');
oldNav.prepend('<ul class="nav-menu"><li class="nav-menu-item"><a href="https://e-hentai.org/">Menu</a><ul class="nav-submenu"></ul></li></ul>');
miniMenuItems.forEach(function(i) {
	var item = oldNav.find('a:contains("'+i+'")');
	item.parent().remove();
	item.appendTo('.nav-submenu').wrap('<li class="nav-submenu-item"></li>');
});

customMenuItems.forEach(function(i) {
	$('<a href="' + i[0] + '">' + i[1] + '</a>').appendTo('.nav-submenu').wrap('<li class="nav-submenu-item"></li>')
});

$(`<style type="text/css" data-jqstyle="ehMiniMenu">
/* old nav */
#nb:hover {
	max-height: unset;
}
#nb {
	overflow: visible;
	max-height: unset;
	justify-content: center;
}
/* old nav items */
#nb>div {
	padding: 0 10px;
	background: none;
}
/* nav item aliases */
.nav-menu-item .nbw1 {
	display: inline;
}
/* menu */
.nav-menu {
	display: inline;
	padding: 0 10px 0 0;
	text-align: left;
	white-space: nowrap;
	margin: 0;
}
.nav-menu-item {
	display: inline-block;
	position: relative;
	z-index: 999;
    background-image: url(https://ehgt.org/g/mr.gif);
    background-repeat: no-repeat;
    background-position: left center;
    padding-left: 7px;
}
/* submenu */
.nav-submenu {
	display: none;
	padding: .5em;
	background: #f2efde;
	border: 2px solid #b5a3a4;
	border-radius: 3px;
	transform: translateX(-50%);
	left: 50%;
	position: absolute;
}
.nav-submenu-item {
	display: block;
	line-height: 1.3;
}
/* hover */
.nav-submenu-item:hover {
	background-color: none;
}
.nav-menu-item:hover .nav-submenu {
	display: block;
}
.nav-submenu::before {
	content: "";
	display: block;
	position: absolute;
	top: -5px;
	left: -8px;
	width: 100%;
	height: 100%;
	z-index: -1;
	padding: 8px;
}
</style>`).appendTo('head');

if (window.location.href.indexOf("exhentai") > -1) {
	$('.nav-menu-item > a').prop('href','https://exhentai.org/');
	$('style[data-jqstyle="ehMiniMenu"]').append(`
/* exhentai only */
.nav-submenu {
	background: #34353b;
	border: 2px solid #8d8d8d;
}`);
}