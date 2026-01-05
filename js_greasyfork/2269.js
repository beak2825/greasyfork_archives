// ==UserScript==
// @name        No Blue Cups
// @namespace   NoBlueCups
// @description Updates links to old forum topics hosted at bigbluecup.com
// @include     http://www.adventuregamestudio.co.uk/forums/*
// @version     2
// @grant       none
// @downloadURL https://update.greasyfork.org/scripts/2269/No%20Blue%20Cups.user.js
// @updateURL https://update.greasyfork.org/scripts/2269/No%20Blue%20Cups.meta.js
// ==/UserScript==

(function(pattern, replacement)
{
    Array.prototype.map.call(document.querySelectorAll("a.bbc_link"), function(item)
    {
        var snapshot;
        var index;

        item.href = item.href.replace(pattern, replacement);
        snapshot = document.evaluate(".//text()", item, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        index = snapshot.snapshotLength;
        while(index--)
        {
            item = snapshot.snapshotItem(index);
            item.nodeValue = item.nodeValue.replace(pattern, replacement);
        }

        return;
    });

    return;
})(new RegExp("(://)(?:www\\.)?bigbluecup\\.com/yabb", "g"), function(group0, group1)
{
    return(group1 + "www.adventuregamestudio.co.uk/forums");
});
