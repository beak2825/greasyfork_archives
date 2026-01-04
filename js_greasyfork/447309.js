// ==UserScript==
// @name         GitHub commits button
// @namespace    http://berkantkz.me/
// @version      0.2
// @description  bring back the commits tab on github repos
// @author       berkantkz
// @match        https://github.com/*
// @require      http://code.jquery.com/jquery-3.6.0.min.js
// @icon         https://berkantkz.me/kz.png
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/447309/GitHub%20commits%20button.user.js
// @updateURL https://update.greasyfork.org/scripts/447309/GitHub%20commits%20button.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;

    //console.log($('.UnderlineNav-body'));
    var list = $('.UnderlineNav-body li:nth-child(1)');
    var repo = $('a[data-pjax="#repo-content-pjax-container"][data-turbo-frame="repo-content-turbo-frame"]').attr('href');
    var commitsButton = '<li data-view-component="true" class="d-inline-flex"><a id="commits-tab" href="' + repo + '/commits" data-tab-item="i6commits-tab" data-pjax="#repo-content-pjax-container" data-turbo-frame="repo-content-turbo-frame" data-ga-click="Repository, Navigation click, Commits tab" data-view-component="true" class="UnderlineNav-item no-wrap js-responsive-underlinenav-item js-selected-navigation-item"><svg text="gray" aria-hidden="true" height="16" viewBox="0 0 16 16" version="1.1" width="16" data-view-component="true" class="octicon octicon-history UnderlineNav-octicon d-none d-sm-inline"><path fill-rule="evenodd" d="M1.643 3.143L.427 1.927A.25.25 0 000 2.104V5.75c0 .138.112.25.25.25h3.646a.25.25 0 00.177-.427L2.715 4.215a6.5 6.5 0 11-1.18 4.458.75.75 0 10-1.493.154 8.001 8.001 0 101.6-5.684zM7.75 4a.75.75 0 01.75.75v2.992l2.028.812a.75.75 0 01-.557 1.392l-2.5-1A.75.75 0 017 8.25v-3.5A.75.75 0 017.75 4z"></path></svg><span data-content="Commits">Commits</span><span id="commits-repo-tab-count" data-pjax-replace="" title="Not available" data-view-component="true" class="Counter"></span></a></li>';
    list.after(commitsButton);

    if (window.location.pathname.toString().includes('/commits')) {
        checkTab();
    }

    function checkTab() {
        $('a.selected').removeClass('selected');
        $('.UnderlineNav-item[aria-current]').attr("aria-current", "false");
        $('#commits-tab').attr("aria-current", "page");
        console.log('commits');
    }

})();