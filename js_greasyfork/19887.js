// ==UserScript==
// @name         美剧窝自动复制片源地址
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动复制带字幕片源地址(第一个)
// @author       Code Monster
// @match        http://www.meiwo.com/*/*/*
// @match        http://www.meiwo.com/resource/*
// @grant        GM_setClipboard
// @downloadURL https://update.greasyfork.org/scripts/19887/%E7%BE%8E%E5%89%A7%E7%AA%9D%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E7%89%87%E6%BA%90%E5%9C%B0%E5%9D%80.user.js
// @updateURL https://update.greasyfork.org/scripts/19887/%E7%BE%8E%E5%89%A7%E7%AA%9D%E8%87%AA%E5%8A%A8%E5%A4%8D%E5%88%B6%E7%89%87%E6%BA%90%E5%9C%B0%E5%9D%80.meta.js
// ==/UserScript==
jQuery.fn.valuechange = function(fn) {
    return this.bind('valuechange', fn);
};
jQuery.event.special.valuechange = {
    setup: function() {
        jQuery(this).watch('value', function(){
            jQuery.event.handle.call(this, {type:'valuechange'});
        });
    },
    teardown: function() {
        jQuery(this).unwatch('value');
    }
};


function detectLink(){
    $(".resource-more-link a").each(function(){
        var link = $(this).attr("href").toLowerCase();
        if(link.indexOf("%e4%b8%ad") > 0){
            GM_setClipboard(link);
            return;
        }
    });
}

(function() {
    $("body").bind('DOMNodeInserted',function(){
        detectLink();
    });
})();