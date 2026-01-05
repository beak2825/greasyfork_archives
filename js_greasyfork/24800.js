// ==UserScript==
// @name         Steam Community - Group List Sorter
// @namespace    Royalgamer06
// @version      1.0
// @description  This userscript makes it possible to sort your group list by group name, creation date or total members.
// @author       Royalgamer06
// @include      /http(s)?\:\/\/steamcommunity\.com\/(id\/.+|profiles\/7656119[0-9]{10})\/groups(\/)?/
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/24800/Steam%20Community%20-%20Group%20List%20Sorter.user.js
// @updateURL https://update.greasyfork.org/scripts/24800/Steam%20Community%20-%20Group%20List%20Sorter.meta.js
// ==/UserScript==

var groupsSelector = ".groupBlock:not(:first)";
var parentSelector = "#BG_bottom > div:nth-child(2)";
var groups_creation = Array.from(jQuery(groupsSelector));
var groups_name = Array.from(
    getOrderedByText(parentSelector, groupsSelector, ".linkTitle", false));
var groups_members = Array.from(
    getOrderedByText(parentSelector, groupsSelector, ".memberRow > .linkStandard", true));

function getOrderedByText(parentSelector, childSelector, keySelector, intgr) {
    var parent = jQuery(parentSelector);
    var items = parent.children(childSelector).sort(function(a, b) {
        var vA = intgr ? parseInt(jQuery(keySelector, a).text().replace(/\,| |Members/, "")) : jQuery(keySelector, a).text().toUpperCase();
        var vB = intgr ? parseInt(jQuery(keySelector, b).text().replace(/\,| |Members/, "")) : jQuery(keySelector, b).text().toUpperCase();
        return (vA < vB) ? -1 : (vA > vB) ? 1 : 0;
    });
    return items;
}

unsafeWindow.orderBy = function orderBy(prop, dir) {
    var groups = null;
    if (prop == "name" && dir == "asc") {
        groups = groups_name;
    } else if (prop == "name" && dir == "desc") {
        var reverse = [];
        for (var i = groups_name.length - 1; i >= 0; i--) reverse.push(groups_name[i]);
        groups = reverse;
    } else if (prop == "creation" && dir == "asc") {
        groups = groups_creation;
    } else if (prop == "creation" && dir == "desc") {
        var reverse = [];
        for (var i = groups_creation.length - 1; i >= 0; i--) reverse.push(groups_creation[i]);
        groups = reverse;
    } else if (prop == "members" && dir == "asc") {
        groups = groups_members;
    } else if (prop == "members" && dir == "desc") {
        var reverse = [];
        for (var i = groups_members.length - 1; i >= 0; i--) reverse.push(groups_members[i]);
        groups = reverse;
    }
    jQuery(groupsSelector).remove();
    jQuery(parentSelector).append(groups);
};

jQuery(document).ready(function() {
    jQuery(".sectionDesc").append("&nbsp;<div class=\"btnv6_blue_hoverfade btn_small\" onclick=\"ShowMenu(this, 'group_order_dropdown', 'right');\"><span>Order by <span class=\"popup_menu_pulldown_indicator\"></span></span></div><div class=\"popup_block_new\" id=\"group_order_dropdown\" style=\"visibility: visible; opacity: 1; display: none;\"><div class=\"popup_body popup_menu\"><a class=\"popup_menu_item\" href=\"javascript:orderBy('name','asc');\">Name Ascending</a><a class=\"popup_menu_item\" href=\"javascript:orderBy('name','desc');\">Name Descending</a><a class=\"popup_menu_item\" href=\"javascript:orderBy('creation','asc');\">Creation Date Ascending</a><a class=\"popup_menu_item\" href=\"javascript:orderBy('creation','desc');\">Creation Date Descending</a><a class=\"popup_menu_item\" href=\"javascript:orderBy('members','asc');\">Total Members Ascending</a><a class=\"popup_menu_item\" href=\"javascript:orderBy('members','desc');\">Total Members Descending</a></div></div>");
});