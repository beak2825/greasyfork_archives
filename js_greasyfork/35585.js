// ==UserScript==
// @name         Toggle sidebar in tickets
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds a toggle button to expand and collapse the ticket sidebar in Zendesk ticket view
// @author       Tal Admon
// @match        https://*.zendesk.com/agent/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35585/Toggle%20sidebar%20in%20tickets.user.js
// @updateURL https://update.greasyfork.org/scripts/35585/Toggle%20sidebar%20in%20tickets.meta.js
// ==/UserScript==

(function() {
setInterval(function(){
	if (jQuery('.toggle-sidebar__t').length) {} else {
		jQuery('.ember-view.pane.left.section.ticket-sidebar').prepend('<div class="toggle-sidebar__t opened__t" style="font-weight: bolder; cursor: pointer; padding: 10px; display: block;">></div>');
		jQuery('.ember-view.pane.left.section.ticket-sidebar').prepend('<div class="toggle-sidebar__t closed__t" style="font-weight: bolder; cursor: pointer; padding: 10px; display: none;"><</div>');
		setTimeout(function(){
			jQuery('.toggle-sidebar__t').on('click',function(){
				if (jQuery(this).hasClass('opened__t')) {
					jQuery(this).hide();
					jQuery('.toggle-sidebar__t.closed__t').show();
					jQuery('.split_pane.filters .pane.left, .split_pane.dashboard .pane.left, .split_pane.search .pane.left, .split_pane.ticket .pane.left, .split_pane.user .pane.left, .split_pane.organization .pane.left, .split_pane.user_filters .pane.left, .split_pane.incidents .pane.left, .split_pane.admin .pane.left, .split_pane.reporting .pane.left').css('width','40px');
					jQuery('.split_pane.filters .pane.right, .split_pane.dashboard .pane.right, .split_pane.search .pane.right, .split_pane.ticket .pane.right, .split_pane.user .pane.right, .split_pane.organization .pane.right, .split_pane.user_filters .pane.right, .split_pane.incidents .pane.right, .split_pane.admin .pane.right, .split_pane.reporting .pane.right').css('left','100px');
				}
				if (jQuery(this).hasClass('closed__t')) {
					jQuery(this).hide();
					jQuery('.toggle-sidebar__t.opened__t').show();

					jQuery('.split_pane.filters .pane.left, .split_pane.dashboard .pane.left, .split_pane.search .pane.left, .split_pane.ticket .pane.left, .split_pane.user .pane.left, .split_pane.organization .pane.left, .split_pane.user_filters .pane.left, .split_pane.incidents .pane.left, .split_pane.admin .pane.left, .split_pane.reporting .pane.left').css('width','330px');
					jQuery('.split_pane.filters .pane.right, .split_pane.dashboard .pane.right, .split_pane.search .pane.right, .split_pane.ticket .pane.right, .split_pane.user .pane.right, .split_pane.organization .pane.right, .split_pane.user_filters .pane.right, .split_pane.incidents .pane.right, .split_pane.admin .pane.right, .split_pane.reporting .pane.right').css('left','390px');
				}
			});
		},1000);
	}
}, 2000);
})();