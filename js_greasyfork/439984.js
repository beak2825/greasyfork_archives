// ==UserScript==
// @name           polsy.org.uk-ify youtube links
// @version        2.0
// @namespace      https://polsy.org.uk
// @description    Converts YouTube video links to the equivalent polsy.org.uk viewer link
// @include        *
// @exclude        https://polsy.org.uk/*
// @exclude        https://*youtube.com/*
// @exclude        https://*youtu.be/*
// @license        GPLv3
// @downloadURL https://update.greasyfork.org/scripts/439984/polsyorguk-ify%20youtube%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/439984/polsyorguk-ify%20youtube%20links.meta.js
// ==/UserScript==

var hrefs = document.evaluate('//a[@href]', document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

for (var i = 0; i < hrefs.snapshotLength; i++) {
    var hr = hrefs.snapshotItem(i);

    var m = hr.href.match('^(https?://(?:www.)?youtube.com/watch\\?[-=&#\\w]+)');
    if(m == null) {
        m = hr.href.match('^(https?://youtu\\.be/[-\\w]+(?:\\?t=[\\dms]+)?)');
    }

    if(m != null) {
        hr.href = 'https://polsy.org.uk/play/yt/?vurl=' + encodeURIComponent(m[1]);
    }
}