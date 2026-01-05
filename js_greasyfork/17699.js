// ==UserScript==
// @name         Byfandom Blacklist
// @description  Hide posts on Byfandom you don't want to see.
// @namespace    byfandom
// @include      http*://*.byfandom.org*
// @grant        none
// @version      0.9
// @downloadURL https://update.greasyfork.org/scripts/17699/Byfandom%20Blacklist.user.js
// @updateURL https://update.greasyfork.org/scripts/17699/Byfandom%20Blacklist.meta.js
// ==/UserScript==

/* CONFIG */

window.blacklistConfig = {

    // NOTE: * can be used as a wildcard, but this may slow down the blacklist script

    postBlacklist: ['Jar-Jar Binks', 'friendly reminder that * is problematic', "howard stark's a+ parenting"],
    // hides posts that contain text matching a term from the list

    postWhitelist: ['@myusername'],
    // shows posts that contain any of these terms, even if they match the blacklist

    showReasons: true,
    // set to false if you don't want to see why posts were hidden

};

/* END CONFIG */

(function($) {
    var _posts = $('div.ow_ipc_info');
    _posts = _posts.add('div.ow_newsfeed_body');
    _posts = _posts.add('div.ow_photo_item'); // not currently working
    
    // wrapper classes for whole posts, for a future no-placeholder option:
    // div.ow_ipc, li.ow_newsfeed_item, div.ow_photo_item_wrap

    var _toggleClass = 'blacklist-toggle';
    var _cfg = getConfig();

    _posts.each(function() {
        var reason = shouldBlockPost($(this));
        if(reason) {
            blockPost($(this), reason);
        }
    });

    function getConfig() {
        var config = window.blacklistConfig || {};

        config.showReasons = (config.showReasons !== undefined) ? config.showReasons : true;
        config.postBlacklist = config.postBlacklist || [];
        config.postWhitelist = config.postWhitelist || [];

        config.postBlacklist = convertToRegexen(config.postBlacklist);
        config.postWhitelist = convertToRegexen(config.postWhitelist);

        return config;

        function convertToRegexen(termList) {
            var term, escapedTerm;
            for(var i = 0; i < termList.length; i++) {
                term = termList[i];
                if(term.indexOf('*') != -1) {
                    escapedTerm = term.replace(/[-\/\\^$+?.()|[\]{}]/g, '\\$&');
                    escapedTerm = escapedTerm.replace('*', '.*');
                    termList[i] = { asString: term, asRegex: new RegExp(escapedTerm, "i") };
                } else {
                    termList[i] = { asString: term, asRegex: null };
                }
            }
            return termList;
        }
    }

    function blockPost(post, reason) {
        var placeholder = makePlaceholder(reason);
        var originalContent = post.children().addClass(_toggleClass);

        post.addClass('blacklisted-post');
        post.prepend(placeholder);
        originalContent.hide();

        post.find('a.blacklist-toggle-control').click(function() {
            var thisPost = $(this).closest('.blacklisted-post');
            var thisContent = thisPost.children('.' + _toggleClass).toggle();
            $(this).text(thisContent.first().is(':visible') ? 'Hide' : 'Unhide');
        });

        function makePlaceholder(reason) {
            var blacklistText = 'Blacklisted post';
            if(_cfg.showReasons) {
                blacklistText += ': contains the term "' + reason + '"';
            }
            var toggleLink = '<a class="blacklist-toggle-control">Unhide</a>';

            var plStr = "<div class='blacklist-placeholder'>";
            plStr += "<p>" + blacklistText + " (" + toggleLink + ")</p>";
            plStr += "</div>";
            return plStr;
        }
    }

    function shouldBlockPost(post) {
        var postText = post.text();
        var wl = _cfg.postWhitelist;
        var bl = _cfg.postBlacklist;

        for (var i = 0; i < wl.length; i++) {
            if(hasTerm(postText, wl[i])) {
                return '';
            }
        }

        for (i = 0; i < bl.length; i++) {
            if(hasTerm(postText, bl[i])) {
                return bl[i].asString;
            }
        }

        return '';

        function hasTerm(src, term) {
            if(term.asRegex == null) {
                return src.toLowerCase().indexOf(term.asString.toLowerCase()) != -1;
            }
            return src.match(term.asRegex) != null;
        }
    }



})(window.jQuery);