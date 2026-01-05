// ==UserScript==
// @name         reddit comments expand
// @namespace    http://old.reddit.com/
// @version      1.6
// @description  when you've collapsed a lot of comment threads on a reddit thread and don't want to expand them all one by one
// @author       Antonio Lima
// @match        http://old.reddit.com/r/*/comments/*
// @match        https://old.reddit.com/r/*/comments/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/22189/reddit%20comments%20expand.user.js
// @updateURL https://update.greasyfork.org/scripts/22189/reddit%20comments%20expand.meta.js
// ==/UserScript==

$('#siteTable .flat-list').append('<li><a href="#" id="expander">expand all comments</a></li>');

$('#expander').click(function(e){
    if($('.comment').hasClass("collapsed")) {
        $('.comment').removeClass("collapsed");
        $('.comment').addClass("noncollapsed");
        $('.expand').html("[–]");
    }
    //hides back deleted comments and comments with score below threshold
    $('.collapsed-for-reason').removeClass("noncollapsed");
    $('.collapsed-for-reason').addClass("collapsed");
    $('.deleted').removeClass("noncollapsed");
    $('.deleted').addClass("collapsed");
    //prevents jump to the top of the page
    e.preventDefault();
});