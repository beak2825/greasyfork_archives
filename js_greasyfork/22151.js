// ==UserScript==
// @name         Re-Add Popular Forum Posts Widget
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Temporarily re-add the Popular Forum Posts Widget to the front page of The Escapist. Mind you, this will break if the Escapist decides to delete the back-end of the widget.
// @author       You
// @match        http://www.escapistmagazine.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22151/Re-Add%20Popular%20Forum%20Posts%20Widget.user.js
// @updateURL https://update.greasyfork.org/scripts/22151/Re-Add%20Popular%20Forum%20Posts%20Widget.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Clear the sixth box on the main page and add an id for the refreshing function to add information to
    var display_box = document.querySelector(".grid_display_box:last-child");
    display_box.id = "forum_posts_panel";

    // Add the Refreshing function to the head of the page
    var script = document.createElement("script");
    script.innerHTML = "function change_forum_tab(tab,date_range,page){	jQuery('#forum_posts_panel').load('/ajax/forum_tab_new.php', {		'forum_tab': tab,		'date_range': date_range,		'page': page	});}";
    document.head.appendChild(script);
    
    // Load the widget
    jQuery('#forum_posts_panel').load('/ajax/forum_tab_new.php', {
        'forum_tab': 'latest',
        'date_range': '',
        'page': 0
    });
})();