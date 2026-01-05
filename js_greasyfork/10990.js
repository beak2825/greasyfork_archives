// ==UserScript==
// @name        Hide Arch Wiki Sidebar
// @description Hides the sidebar on the Arch Linux wiki. The sidebar can be toggled with a button.
// @version     0.1.4
// @require     https://ajax.googleapis.com/ajax/libs/jquery/2.1.4/jquery.min.js
// @include     http://wiki.archlinux.org/*
// @include     https://wiki.archlinux.org/*
// @grant       none
// @namespace   https://greasyfork.org/users/13329
// @downloadURL https://update.greasyfork.org/scripts/10990/Hide%20Arch%20Wiki%20Sidebar.user.js
// @updateURL https://update.greasyfork.org/scripts/10990/Hide%20Arch%20Wiki%20Sidebar.meta.js
// ==/UserScript==

// make a "show sidebar" button mimicing the "watch" button
var watch_button = $('li#ca-nstab-main').parent().find('li:last')
var sidebar_button = watch_button.clone();

// change the duplicated "watch" button link to have the properties we want for
// the "show sidebar" button
var sidebar_toggle = sidebar_button.find('a')
	.text('show sidebar')
	.unbind('click')
	.removeAttr('href')
	.attr('id', 'ca-toggle-sidebar')
	.attr('accesskey', 'i')
	.attr('title', 'Toggle the sidebar [Alt+Shift+i]');

// put the new "show sidebar" button after the "watch" button
sidebar_button.insertAfter(watch_button);

var sidebar = $('div#column-one').find('div:gt(3)');
var content = $('div#content');
var original_margin = content.css('margin-left');

// toggle_sidebar shows or hides the sidebar, updating the "show sidebar"
// button link text to match
function toggle_sidebar() {
	if (sidebar.is(':visible')) {
		sidebar_toggle.text('show sidebar');
		sidebar.hide();
		content.css('margin-left', '0px');
	} else {
		sidebar_toggle.text('hide sidebar');
		sidebar.show();
		content.css('margin-left', original_margin);
	}
}

// bind the toggle_sidebar function to the "show sidebar" button link
sidebar_toggle.click(toggle_sidebar);

// sidebar is hidden by default
toggle_sidebar();
