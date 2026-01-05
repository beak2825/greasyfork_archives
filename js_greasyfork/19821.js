// ==UserScript==
// @name            Reddit: Highlight New Comments
// @description     Highlight new comments since your last visit.
// @author          Targren (Targren)
// @icon            https://reddit.com/favicon.ico
// @namespace       http://example.com
// @version         1.0.1
// @include         /https?:\/\/((www|pay|[a-z]{2})\.)?reddit\.com\/r\/[a-zA-Z0-9_]+\/comments\/.*/
// @grant           GM_addStyle
// @require         https://code.jquery.com/jquery-1.12.3.min.js
// @downloadURL https://update.greasyfork.org/scripts/19821/Reddit%3A%20Highlight%20New%20Comments.user.js
// @updateURL https://update.greasyfork.org/scripts/19821/Reddit%3A%20Highlight%20New%20Comments.meta.js
// ==/UserScript==

// Based on:
//		https://greasyfork.org/scripts/1868-reddit-highlight-newest-comments/code/Reddit%20highlight%20newest%20comments.user.js
// and
//      https://greasyfork.org/scripts/8029-reddit-highlight-new-comments/code/Reddit:%20Highlight%20New%20Comments.user.js
//
// Zren's version was broken and apparently abandoned. Fixed it up. 

(function(uw) {
    //--- Settings
    var threadTTL = 3 * 24 * 60 * 60 * 1000; // 3 Days
    var applyStyle = true; // Set to true to overload Reddit's default styling of new comments with the style below.
    
    // Remove .res-commentBoxes if you're not using RES.
    var style = " \
.new-comment .usertext-body { \
background-color: #00AAAA; \
border: 1; \
margin: 1; \
} \
\
.res-commentBoxes .comment.new-comment, \
.res-commentBoxes .comment .comment .comment.new-comment, \
.res-commentBoxes .comment .comment .comment .comment .comment.new-comment, \
.res-commentBoxes .comment .comment .comment .comment .comment .comment .comment.new-comment, \
.res-commentBoxes .comment .comment .comment .comment .comment .comment .comment .comment .comment.new-comment \
{ background-color: #f2f8ff !important; border: solid 1px #d6e3f3 !important; } \
\
.res-commentBoxes .comment .comment.new-comment, \
.res-commentBoxes .comment .comment .comment .comment.new-comment, \
.res-commentBoxes .comment .comment .comment .comment .comment .comment.new-comment, \
.res-commentBoxes .comment .comment .comment .comment .comment .comment .comment .comment.new-comment, \
.res-commentBoxes .comment .comment .comment .comment .comment .comment .comment .comment .comment .comment.new-comment \
{ background-color: #e5efff !important; border: solid 1px #cddaf3 !important; } \
";
    
    //--- Variables
    var nowAtLoad = Date.now();
    var lastVisitedAtLoad = null;
    
    //--- Functions
    
    var getThreadId = function() {
        var element = document.querySelector('[rel="shorturl"]');
        if (!element)
            return null;
        return "redd_id_" + element.href.substr(-6);
    };
    
    var setThreadLastVisited = function(threadId, t) {
        if (typeof t === 'object' && t.getTime) { // Date
            t = t.getTime();
        }
        localStorage.setItem(threadId, t);
        console.log('set localStorage["' + threadId + '"] = ', t);
    };
    
    var getThreadLastVisited = function(threadId) {
        var t = localStorage.getItem(threadId);
        t = parseInt(t, 10);
        //console.log('get localStorage["' + threadId + '"] = ', t);
        return t;
    };
    
    var deleteThreadLastVisited = function(threadId) {
        localStorage.removeItem(threadId);
        console.log('del localStorage["' + threadId + '"]');
    };
    
    var highlightNewCommentsSince = function(t) {
        $('.comment').each(function(i, comment) {            
            var $comment = $(comment);
            if ($comment.hasClass('deleted'))
                return;
            
            var $commentTime = $comment.children('.entry').children('.tagline').children('time');
            var commentTime = $commentTime.attr('datetime');
            commentTime = new Date(commentTime).getTime();
            if (commentTime > t) {            
                $comment.addClass('new-comment');
            } else {
                $comment.removeClass('new-comment');
            }
        });
    };
    
    
    var updateLastVisited = function() {
        var threadId = getThreadId();
        var threadLastVisited = getThreadLastVisited(threadId);
        if (threadLastVisited) {
            highlightNewCommentsSince(threadLastVisited);
        } else {
        	threadLastVisited = nowAtLoad;
        }
        setThreadLastVisited(threadId, nowAtLoad);
        lastVisitedAtLoad = threadLastVisited;
    };
    
    var purgeExpiredData = function() {
        var keys = Object.keys(localStorage);
        var threadIdRegex = /redd_id_([a-zA-Z0-9]{6})/;
        // Filter out non threadLastVisited keys.
        keys = keys.filter(function(key) {
            return threadIdRegex.test(key);
        });
        // Filter out non expired keys.
        keys = keys.filter(function(threadId) {
            var threadLastVisited = getThreadLastVisited(threadId);
            return nowAtLoad - threadTTL >= threadLastVisited; // Return true if it has expired.
        });
        keys.forEach(function(threadId) {
            deleteThreadLastVisited(threadId);
        });
    };
    
    var update = function() {        
        if (lastVisitedAtLoad) {
            highlightNewCommentsSince(lastVisitedAtLoad);
        } else {
        	updateLastVisited();
        }
        purgeExpiredData();
    };
    
    //--- Main
    if (!getThreadId())
        return;
    
    // Wrap the function called when requesting more comments.
    var reddit_morechildren = uw.morechildren.__origional__ || uw.morechildren;
    uw.morechildren = function() {
        reddit_morechildren.apply(this, arguments);
        setTimeout(update, 1000);
    };
    uw.morechildren.__origional__ = reddit_morechildren;

    // Overwrite Reddit's default styling.
    if (applyStyle)
        GM_addStyle(style);
    
    update();
    
})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window);
