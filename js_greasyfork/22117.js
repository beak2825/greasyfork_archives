// ==UserScript==
// @name       mmo-champ author sneak-peak
// @namespace  
// @version    0.2
// @description  Hover recent threads to see author. I don't guarantee this works on anything other than Chrome and the current page structure of mmo-champion.
// @match http://www.mmo-champion.com/content/*
// @copyright  2016+, manhands
// @downloadURL https://update.greasyfork.org/scripts/22117/mmo-champ%20author%20sneak-peak.user.js
// @updateURL https://update.greasyfork.org/scripts/22117/mmo-champ%20author%20sneak-peak.meta.js
// ==/UserScript==

var recentForumPostsIterator=document.evaluate("//h4[@class='cms_widget_post_header']/a[contains(@href, 'threads')]",document,null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
for (var i=0; i < recentForumPostsIterator.snapshotLength; i++) {
    var thisA = recentForumPostsIterator.snapshotItem(i);
    getAuthor(thisA);
}

function getAuthor(thisA) {
    var onSuccess = function(response, thisA) {
        var re = /a class=".*?username.*?<strong>.*?<\/strong>/g;
        var authorSegment = re.exec(response);
        re = />[^<>]*?<\//g;
        authorSegment = String(re.exec(authorSegment));
        var subStart = 1;
        var subStop = authorSegment.length-2;
        authorSegment = authorSegment.substring(subStart,subStop);
        thisA.title = authorSegment + ": " + thisA.title;
    };
    return grabAuthor(thisA, onSuccess);
}

function grabAuthor(thisA, onSuccess) {
    var xmlhttp = new XMLHttpRequest();
    var link = thisA.href.substring(0, thisA.href.indexOf('?'));
    xmlhttp.open("GET",link,true);
    xmlhttp.onreadystatechange = function() {
      if (xmlhttp.readyState==4 && xmlhttp.status==200)
        onSuccess(xmlhttp.response, thisA);
    };

    xmlhttp.send();
}