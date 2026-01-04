// ==UserScript==
// @name            赚吧优化-关键字高亮提醒-屏蔽用户-屏蔽帖子
// @description     赚吧优化插件
// @include         *://*.zuanke8.com/*
// @version         1.1.013
// @namespace       zuanke8
// @require         http://cdn.staticfile.org/jquery/1.12.4/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/378168/%E8%B5%9A%E5%90%A7%E4%BC%98%E5%8C%96-%E5%85%B3%E9%94%AE%E5%AD%97%E9%AB%98%E4%BA%AE%E6%8F%90%E9%86%92-%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7-%E5%B1%8F%E8%94%BD%E5%B8%96%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/378168/%E8%B5%9A%E5%90%A7%E4%BC%98%E5%8C%96-%E5%85%B3%E9%94%AE%E5%AD%97%E9%AB%98%E4%BA%AE%E6%8F%90%E9%86%92-%E5%B1%8F%E8%94%BD%E7%94%A8%E6%88%B7-%E5%B1%8F%E8%94%BD%E5%B8%96%E5%AD%90.meta.js
// ==/UserScript==




(function() {
   
    //下面是屏蔽帖子的关键，设置以后，符合该关键字的帖子不会显示
    var keywords = ["关键字aaaa"];
    
    //下面是屏蔽用户的关键，设置以后，该用户的帖子不会显示
    var usernames = ["yxdeep", "appono", "magnitude", "瓶上扣这鞋", "不要怂就是干", "文馨", "笑谈一切风云", "秦时明月heaven", "dokich", "wayky", "360717125", "helloworld1", "kekeerer", "男吧友！", "gezhuci", "wc2346319", "用户b", "用户b"];
    
    //下面是你关注的帖子的关键字
    var highlights = ["bug"];



    blockTopicsByUsernames(usernames);
    blockTopicsByKeywords(keywords);
    blockRepliesByUsernames(usernames);
    highlightTopicByHighlights(highlights);
    highlightTopPostsByHighlights(highlights);//高亮热贴

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
        }).css({'color': '#EE1B2E', 'font-weight': 'bold','background': 'yellow'});
    }

    //热帖关键字高亮
    function highlightTopPostsByHighlights(highlights) {
        $('tbody>tr a').filter(function(){
            var subject = $(this).text().toUpperCase();
            for(var i in highlights) {
                if(subject.indexOf(highlights[i].toUpperCase() ) > 0 ){
                //if(subject.includes(highlights[i].toUpperCase())) {
                    return true;
                }
            }
        }).css({'color': '#EE1B2E', 'font-weight': 'bold','background': 'yellow'});

    }


})();