// ==UserScript==
// @name         広告リンクの強制リダイレクター
// @namespace    http://plg4u.blog.fc2.com/
// @version      0.3
// @description  3秒待たなくても自動でスキップするようになります
// @author       hk
// @match        http://bcv.io/go/*
// @match        http://vla.io/go/*
// @match        http://ouo.press/go/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/18209/%E5%BA%83%E5%91%8A%E3%83%AA%E3%83%B3%E3%82%AF%E3%81%AE%E5%BC%B7%E5%88%B6%E3%83%AA%E3%83%80%E3%82%A4%E3%83%AC%E3%82%AF%E3%82%BF%E3%83%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/18209/%E5%BA%83%E5%91%8A%E3%83%AA%E3%83%B3%E3%82%AF%E3%81%AE%E5%BC%B7%E5%88%B6%E3%83%AA%E3%83%80%E3%82%A4%E3%83%AC%E3%82%AF%E3%82%BF%E3%83%BC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var tag, i, m;
    if ((location.href.indexOf("bcv.io/go/") !== -1) ||
        (location.href.indexOf("vla.io/go/") !== -1)) {
        tag = document.getElementsByTagName("a");
        for (i = 0, m = tag.length; i < m; i++)
            if (tag[i].innerHTML.indexOf("GET LINK") !== -1)
                location.href = tag[i].href;
    } else if ((location.href.indexOf("ouo.press/") !== -1)) {
        location.href = document.getElementById("btn-main").href;
    }
})();