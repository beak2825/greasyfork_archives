// ==UserScript==
// @name           Redmine Ticket Status Hilighter
// @version        0.1
// @description:en Hilight ticket status.
// @namespace      http://twitter.com/foldrr/
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @match          http://*/redmine/projects/*/issues*
// @description Hilight ticket status.
// @downloadURL https://update.greasyfork.org/scripts/13648/Redmine%20Ticket%20Status%20Hilighter.user.js
// @updateURL https://update.greasyfork.org/scripts/13648/Redmine%20Ticket%20Status%20Hilighter.meta.js
// ==/UserScript==

(function(){
    var statusList = $('.status');
    jQuery.each(statusList, function(i, elem){
        text = $(elem).text();
        if(text == "新規"          ) $(elem).css("background-color", "#FAA");
        if(text == "進行中"        ) $(elem).css("background-color", "#FC0");
        if(text == "解決"          ) $(elem).css("background-color", "#AFA");
        if(text == "フィードバック") $(elem).css("background-color", "#B8F");
        if(text == "却下"          ) $(elem).css("background-color", "#DDD");
        if(text == "終了"          ) $(elem).css("background-color", "#DDD");
    });
})();
