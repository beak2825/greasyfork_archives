// ==UserScript==
// @name        WaniKani Recent Topics Filter (for Discourse)
// @namespace   irrelephant
// @description Hides activity from certain boards in the recent topics list. Idea based on https://greasyfork.org/en/scripts/14373-wanikani-recent-topics-filter. See https://community.wanikani.com/t/possible-to-filter-recent-community-chat-topics/10949
// @version     1.0.0
// @author      irrelephant
// @include     http://www.wanikani.com/
// @include     https://www.wanikani.com/
// @include     http://www.wanikani.com/dashboard
// @include     https://www.wanikani.com/dashboard
// @run-at      document-end
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/375888/WaniKani%20Recent%20Topics%20Filter%20%28for%20Discourse%29.user.js
// @updateURL https://update.greasyfork.org/scripts/375888/WaniKani%20Recent%20Topics%20Filter%20%28for%20Discourse%29.meta.js
// ==/UserScript==

var filteredCategories = ["Campfire"];

$(function () {
    var targetNode = $('.forum-topics-list')[0];
    var config = { attributes: true, childList: true, subtree: true };

    //will be called after forum content has been loaded
    var callback = function(mutationsList, observer) {
        //content was updated, no need to observce anymore
        observer.disconnect();
        filterTopics();
    };
    var observer = new MutationObserver(callback);
    observer.observe(targetNode, config);
});

function filterTopics(){
    $('.forum-topics-list tr').each(function(){
        var row = $(this);
        //if this row contains any link with content "Campfire" then hide it
        row.find('.description a').not(".topic-title").each(function(){
            var textContent = this.childNodes[0].nodeValue;
            debugger;
            if(filteredCategories.includes(textContent.trim())){
                row.hide();
                row.next().hide();
            }
        });
    });
}