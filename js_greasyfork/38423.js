// ==UserScript==
// https://github.com/hannsen/userscripts
// @name         My Merge Requests Gitlab
// @namespace    http://tampermonkey.net/
// @version      2.5
// @description  Show Link to opened Merge Requests, auto click swipe on MR with pics
// @author       hannsen
// @match        https://git04.quodata.de/*
// @grant GM_setValue
// @grant GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/38423/My%20Merge%20Requests%20Gitlab.user.js
// @updateURL https://update.greasyfork.org/scripts/38423/My%20Merge%20Requests%20Gitlab.meta.js
// ==/UserScript==
(function() {
    'use strict';

    //    var swipe = 0;
    //    function scrollFunction() {
    //        if(!swipe)
    //            swipe = $('li.swipe');
    //
    //        for(var i = 0; i < swipe.length; i++){
    //            if(isScrolledIntoView(swipe[i])){
    //                swipe[i].click();
    //                return;
    //            }
    //        }
    //    }
    //
    //    function isScrolledIntoView(elem) {
    //        var docViewTop = $(window).scrollTop();
    //        var docViewBottom = docViewTop + $(window).height();
    //        var elemTop = $(elem).offset().top;
    //        var elemBottom = elemTop + $(elem).height();
    //        return ((elemBottom <= docViewBottom) && (elemTop >= docViewTop));
    //    }
    //
    //
    //

    // Set ur own clone url prefix with GM_setValue("git_url_prefix", "username:token");
    var git_url_prefix = GM_getValue("git_url_prefix");
    var $http_clone = $('input[name="http_project_clone"]');
    if(git_url_prefix && $http_clone.val()){
        var clone_url = $http_clone.val();
        clone_url = clone_url.replace("https://", "https://" + git_url_prefix + "@");
        $http_clone.val(clone_url);
    }

    function colorCollapsed(){
        $("div.diff-collapsed").css('background-color', 'red');
    }

    if(window.location.href.indexOf("merge_requests") > 0){
        window.onscroll = colorCollapsed;
    }

    var last_mr_count = GM_getValue("open_mr_count") || 0;

    var $merge_button = $($(".user-counter:eq( 1 )").prop('outerHTML'));
    var new_href = $merge_button.children().attr('href').replace('assignee_username', 'scope=all&state=opened&author_username');
    $merge_button.children().attr('href', new_href);
    $merge_button.find('span').toggleClass('gitlab-own-merge-requests merge-requests-count issues-count')
        .removeClass('hidden');
    $merge_button.find('span').html(last_mr_count);
    $($merge_button.prop('outerHTML')).insertBefore(".user-counter:eq( 2 )");

    $.ajax({
            url: new_href,
        })
        .done(function(data) {
            var open_mr_count = $(data).find('a#state-opened > span.badge').html();
            $('.gitlab-own-merge-requests').html(open_mr_count);
            GM_setValue("open_mr_count", open_mr_count);
        });

    // Grey out issues with pending Merge Request
    if(document.location.href.indexOf('dashboard/issues?') !== -1 && document.location.href.indexOf('assignee_username=') !== -1){
        $('li.issue:has(.issuable-mr)').css('opacity', 0.4);
    }

})();
