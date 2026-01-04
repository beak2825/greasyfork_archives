// ==UserScript==
// @name         linkedin feed
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://www.linkedin.com/feed/
// @require http://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/35676/linkedin%20feed.user.js
// @updateURL https://update.greasyfork.org/scripts/35676/linkedin%20feed.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //Who to follow side bar
    $("aside.feed-right-rail.right-rail").remove();

    // Remove when autoloading new ones
    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
    var config = { childList: true, characterData: false, attributes: false, subtree: true };
    var observer = new MutationObserver( function (mutations) {
        mutations.forEach( function (mutation) {
            if (mutation.addedNodes) {
                $(mutation.addedNodes).each( function () {
                    if (
                        $(this).is(':contains("Related Articles")') ||
                        $(this).is(':contains("Jobs recommended for you")') ||
                        $(this).is(':contains("People you may know")') || // this one dosent work.
                        $(this).is(':contains("See more courses")') ||
                        $(this).is(':contains("Promoted")')
                    ) {
                        console.log("removing article for ", $(this).text());
                        $(this).parents('article').remove();
                    }
                } );
            }
        });
    });
    // run above function on this element
    $('div.core-rail').each( function () { observer.observe(this, config); } );

})();