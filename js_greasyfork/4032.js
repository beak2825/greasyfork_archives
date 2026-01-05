// ==UserScript==
// @name         GOG.com - Updated Thread Count in Title
// @namespace    ssokolow.com
// @version      11
// @description  Display a count of updated threads (and notifications) in the GOG favicon (and page title) and reload hourly so a browser tab can be used as an update notifier
//
// @match        *://www.gog.com/forum
//
// @require      https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/tinycon/0.6.3/tinycon.min.js
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
//
// @grant        GM_getValue
// @grant        GM.getValue
// @grant        GM_setValue
// @grant        GM.setValue
// @grant        GM_registerMenuCommand
// @grant        GM.registerMenuCommand
// 
// @downloadURL https://update.greasyfork.org/scripts/4032/GOGcom%20-%20Updated%20Thread%20Count%20in%20Title.user.js
// @updateURL https://update.greasyfork.org/scripts/4032/GOGcom%20-%20Updated%20Thread%20Count%20in%20Title.meta.js
// ==/UserScript==

// Initialize with values indicating a soft error
var bubble_bg = '#FF8000';
var unviewed_count = '!';
var notification_counts = null;
var faved_replies = 0;
var needs_persist = false;
var old_counts = {};

// Conditional debugging
const DEBUG = true;
const debug = DEBUG ? console.log : function(msg) {};

/// Save a set of counts as 'stuck' so they'll get ignored next time
var mark_stuck_values = function(counts) {
    GM.setValue('notification_counts', JSON.stringify(counts));
}

/// Mark a value in old_counts to be cleared
var reset_stuck_value = function(idx) {
    old_counts[idx] = 0;
    needs_persist = true;
}

/// Retrieve GOG notification counts with "mark as read" support
var get_notification_counts = function() {
    // Parse the counts and omit the total to avoid double-counting
    var counts = [], total = 0;
    document.querySelectorAll(".top-nav__item-count").forEach(function(node, idx) { 
        if (idx == 0) { return; } // Skip first match (the total)
        counts.push(Number(node.textContent.trim()));
    });

    // Implement "Mark as Read" to work around GOG's delayed dismissal
    for (var i = 0, len = counts.length; i < len; i++) {
        if (old_counts && old_counts[i] && counts[i] >= old_counts[i]) {
            // If the number went up, keep suppressing stuff marked as stuck
            total += counts[i] - old_counts[i];
        } else {
            total += counts[i];
            reset_stuck_value(i);
        }
    }

    // Only call GM_setValue once for performance reasons
    if (needs_persist) {
        mark_stuck_values(old_counts);
        needs_persist = false;
    }

    // Make accessible to the "mark as read" callback
    notification_counts = counts;

    // Subtract faved replies here so the count for threads still works
    // properly if session bugs prevent the dropdown from displaying
    return Math.max(total - faved_replies, 0);
};

/// Retrieve unviewed count for favourite forum topics
/// TODO: Find equivalents to :contains and $().next(selector) so I can remove jQuery
var get_unviewed_count = function() {
    var category = $(".topics .text:contains('My favourite topics')");
    if (category.length) { // If not some kind of "server overloaded" page...
        category = category.parents('h2').next('.category');

        // Use an empty list of favourite topics to detect being logged out
        if (category.find('.item:not(.message)').length) {
            bubble_bg = '#9CC824';
            unviewed_count = category.find('.item:not(.visited) .name a').length;
            faved_replies = category.find('.item:not(.visited) .reply').length;
        } else {
            bubble_bg = '#ff0000';
            unviewed_count = 'X';
        }
    }
}


debug("About to initialize");
(async function() {
		debug("Beginning init");
  
    // Set up hourly reload before anything that unexpected markup could break
		setTimeout(function() { window.location.reload(true); },
	  	         await GM.getValue('check_interval', 3600 * 1000));

  	old_counts = JSON.parse(await GM.getValue('notification_counts', '{}'));
  
    get_unviewed_count();
    if (unviewed_count !== 'X') {
        unviewed_count += get_notification_counts();
    }
  
    Tinycon.setOptions({
        width: 7,
        height: 9,
        font: '10px arial',
        colour: '#ffffff',
        background: bubble_bg,
        fallback: false
    });
    Tinycon.setBubble(unviewed_count);
  
  	let title_elem = document.querySelector('title');
    title_elem.textContent = '[' + unviewed_count + '] ' + title_elem.textContent;
  
  	// TODO: Implement a solution for GreaseMonkey 4 not having reimplemented this
    GM.registerMenuCommand("Ignore Stuck Notification Count", function() {
        mark_stuck_values(notification_counts);
        Tinycon.setBubble(0);
    }, 'I');
})();