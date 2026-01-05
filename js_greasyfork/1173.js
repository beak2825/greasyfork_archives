// ==UserScript==
// @name           Userpage RSS link
// @namespace      http://efcl.info/
// @description    ユーザー投稿動画ページでRSS linkをつけるだけ
// @include        http://www.nicovideo.jp/user/*/video
// @version 0.0.1.20140518104259
// @downloadURL https://update.greasyfork.org/scripts/1173/Userpage%20RSS%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/1173/Userpage%20RSS%20link.meta.js
// ==/UserScript==

(function() {
    var links = document.getElementsByTagName("link");
    if (isExistRss(links)) {
        alert("もうRSSあるからこのスクリプトいらないっす!");
        return;
    }
    var link = links[0];
    var alternateLink = document.createElement("link");
    setAttributes(alternateLink, {
        rel : "alternate",
        charset : "utf-8",
        type : "application/rss+xml",
        href : location.href + "?rss=2.0"
    });
    link.parentNode.insertBefore(alternateLink, link);
    function setAttributes(ele, attrs) {
        for (var attr in attrs) {
            ele.setAttribute(attr, attrs[attr]);
        }
    }

    function isExistRss(ele) {
        for (i = 0; i < ele.length; i++) {
            if (ele[i].getAttribute("rel") == "alternate" && /(xml|rss)/.test(ele[i].getAttribute("type"))) {
                return true;
            }
        }

    }
})();