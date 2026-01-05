// ==UserScript==
// @name        nyaa_show_all
// @namespace   sh2288
// @description nyaa_show_all[]
// @include     http://*.nyaa.se/*
// @version     1
// @grant       GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/10696/nyaa_show_all.user.js
// @updateURL https://update.greasyfork.org/scripts/10696/nyaa_show_all.meta.js
// ==/UserScript==
document.title = document.title + '_GM_BY_sh2288'
//得到帖子地址集合
var allDivs,https,dhtml;
https= document.evaluate("//td[@class='tlistname']", document, null,XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,null);
for (var i=0; i < https.snapshotLength; i++) {
    https.snapshotItem(i).getElementsByTagName('a')[0].href = https.snapshotItem(i).getElementsByTagName('a')[0].href + '&showfiles=1'
    var urls = https.snapshotItem(i).getElementsByTagName('a')[0].href
    var urlnode = https.snapshotItem(i)
    gethtml(urls,urlnode,".viewdescription")
    gethtml(urls,urlnode,".fileentry")
}
function gethtml(urls,urlnode,d){
    GM_xmlhttpRequest({
        method: 'GET',
        url: urls,
        onload: function(responseDetails) {
                var responseXML = new DOMParser().parseFromString(responseDetails.responseText,'text/xml');
                var logo = document.createElement("td");
                logo.innerHTML = responseDetails.responseText;
                var entries = logo.querySelectorAll(d)[0];
                var html = entries;
                dhtml = html
                urlnode.insertBefore(dhtml,urlnode.lastChild);
        }
    })
}