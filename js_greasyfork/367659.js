// ==UserScript==
// @name            赚吧优化
// @description     赚吧优化插件
// @include         *://*.zuanke8.com/*
// @version         1.0.5
// @namespace       zuanke8
// @require         http://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/367659/%E8%B5%9A%E5%90%A7%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/367659/%E8%B5%9A%E5%90%A7%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    var keywords = ["关键字a", "关键字b"];
    var usernames = ["用户a", "用户b"];
    var highlights = ["bug"];

    blockTopicsByUsernames(usernames);
    blockTopicsByKeywords(keywords);
    blockRepliesByUsernames(usernames);
    highlightTopicByHighlights(highlights);

    function blockTopicsByUsernames(usernames) {
        $('tbody[id^=normalthread] cite>a').filter(function() {
            return usernames.includes($(this).text());
        }).closest('tbody').remove();

    }

    function blockTopicsByKeywords(keywords) {
        $('tbody[id^=normalthread]>tr>th>a').filter(function(){
            var subject = $(this).text().toUpperCase();
            for(var i in keywords) {
                if(subject.includes(keywords[i].toUpperCase())) {
                    return true;
                }
            }
        }).closest('tbody').remove();
    }

    function blockRepliesByUsernames(usernames) {
        $('div.authi>a').filter(function() {
            return usernames.includes($(this).text());
        }).closest('tbody').remove();
    }

    function highlightTopicByHighlights(highlights) {
        $('tbody[id^=normalthread]>tr>th>a').filter(function(){
            var subject = $(this).text().toUpperCase();
            for(var i in highlights) {
                if(subject.includes(highlights[i].toUpperCase())) {
                    return true;
                }
            }
        }).css({'color': '#EE1B2E', 'font-weight': 'bold'});
    }

})();