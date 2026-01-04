// ==UserScript==
// @name         Twitter TL Like Remover
// @namespace    http://carlostdev.com/
// @version      0.2
// @description  Likes are not shares. If you don't want to see on your homepage what the people you follow is liking, this script is for you.
// @author       carlostdev
// @match        https://twitter.com/
// @grant        none
// @require      http://code.jquery.com/jquery-latest.min.js
// @downloadURL https://update.greasyfork.org/scripts/36625/Twitter%20TL%20Like%20Remover.user.js
// @updateURL https://update.greasyfork.org/scripts/36625/Twitter%20TL%20Like%20Remover.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var MutationObserver    = window.MutationObserver || window.WebKitMutationObserver;
    var myObserver          = new MutationObserver (mutationHandler);
    var obsConfig           = { childList: true, characterData: true, attributes: true, subtree: true };

    function likeDeleter ( )
    {
        $("li[data-item-type='tweet']").each(function(index){
            var json = $(this).attr('data-suggestion-json');
            var arr = $.parseJSON(json);
            var len = Object.keys(arr.suggestion_details).length;
            if(len > 0)
            {
                if(arr.suggestion_details.suggestion_type != "RankedOrganicTweet")
                {
                    $(this).remove();
                }
            }
        });
    }

    likeDeleter();
    myObserver.observe ($(".stream").get(0),obsConfig);

    function mutationHandler (mutationRecords) {
        likeDeleter();
    }

})();