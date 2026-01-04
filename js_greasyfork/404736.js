// ==UserScript==
// @name           Feedly Engagement based Color
// @namespace      https://openuserjs.org/users/burn
// @version        0.2.1
// @description    color a Feedly list based on the engagement
// @license        MIT
// @match          https://feedly.com/*
// @run-at         document-end
// @grant          GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/404736/Feedly%20Engagement%20based%20Color.user.js
// @updateURL https://update.greasyfork.org/scripts/404736/Feedly%20Engagement%20based%20Color.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author burn
// ==/OpenUserJS==

/* PLEASE READ HERE

This userscript was originally written by modalblue and published on userscripts.org
https://userscripts-mirror.org/scripts/show/178751
I was using it years ago and I've decided to fork his code and continue maintaining it, just because I needed it working again.

*/

(function() {

    'use strict';

    const DBG = true;
    var mo = null;
    var attributeNamePrefix = "engagement-color";
    var colors = {};
    var css = {
        mainTag: "article",
        entry:"article.entry"
        , nbrRecommendations:"span.EntryEngagement"
        , unreadClass: "entry--unread"
    };
    function myLog(s) {
        return (DBG && console.log(GM_info.script.name + " | " + s));
    }
    function MakeColor(str) {
        if (str > 1000) str = 1000;
        return str / 1000;
    }
    function Colored() {
        var recommend = 0;
        var items = Array.prototype.slice.call(document.querySelectorAll(css.entry));
        if (items.length!=0) {
            myLog("found " + items.length + " articles");
            items.forEach(function (item) {
                if (item.querySelector(css.nbrRecommendations)) {
                    recommend = item.querySelector(css.nbrRecommendations).textContent.replace(/[\s\+]/g, "").replace(/^([\d]+)[A-Z]$/, "$1" + "000");
                    myLog("Found recommend: " + recommend);
                    if (recommend > 0) {
                        if (colors[recommend] === undefined) {
                            myLog("adding css classes for " + recommend + " rule");
                            colors[recommend] = MakeColor(recommend);
                            GM_addStyle(
                                css.mainTag+"[colored='" + attributeNamePrefix+recommend + "'] {background:rgba(0,204,0," + colors[recommend] + ") !important;}"
                                + css.mainTag+"[colored='" + attributeNamePrefix+recommend + "']:hover {background:rgba(0,204,0," + colors[recommend] + ") !important;}"
                            );
                        }
                        if (!item.getAttribute("colored")) {
                            myLog("adding colored attribute with value " + attributeNamePrefix+recommend);
                            item.setAttribute("colored", attributeNamePrefix+recommend);
                        }
                        if (item.classList.contains(css.unreadClass) && recommend >= 1000) {
                            myLog("adding text color to unread article with recommend >= 1000");
                            GM_addStyle(
                                css.mainTag+"[class^='entry'][class*='"+css.unreadClass+"'][colored='"+attributeNamePrefix+recommend + "'] div.content div.summary {color: #adff2f !important;}"
                            );
                        }
                    }
                }

            }); // end foreach
        } else myLog("items.length is 0");
    };
    mo = new MutationObserver(Colored);
    mo.observe(document.getElementById("root"), {childList:true, subtree : true});
})();
