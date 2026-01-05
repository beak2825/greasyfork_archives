// ==UserScript==
// @name         Stash-ShowAllSideIcons
// @namespace    http://ooopscc.com/
// @version      0.2
// @description  enter something useful
// @author       ooops
// @match        http://git.sankuai.com/*
// @grant        none
// @require      http://code.jquery.com/jquery-1.8.1.min.js
// @downloadURL https://update.greasyfork.org/scripts/12574/Stash-ShowAllSideIcons.user.js
// @updateURL https://update.greasyfork.org/scripts/12574/Stash-ShowAllSideIcons.meta.js
// ==/UserScript==

$(function() {
    var topWrapper = $('#aui-sidebar-content .aui-sidebar-group.aui-sidebar-group-actions');
    var topItems = topWrapper.find('ul.aui-nav').clone();
    var bottomWrapper = $('#aui-sidebar-content .aui-sidebar-group.aui-sidebar-group-tier-one');
    var bottomItems = bottomWrapper.find('ul.aui-nav').eq(0);
    topItems.insertBefore(bottomItems);
    bottomItems.css('border-top', '1px solid #ccc');
    topWrapper.remove();
    bottomWrapper.css('margin-top', '20px');
});
