// ==UserScript==
// @name         M-team replace old links
// @name:zh-CN   M-team replace old links
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Automatically replaces the outdated domain in links
// @description:zh-cn 老链接自动转换
// @author       GaiaChaos
// @match        https://kp.m-team.cc/*
// @icon         https://www.google.com/s2/favicons?domain=m-team.cc
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428692/M-team%20replace%20old%20links.user.js
// @updateURL https://update.greasyfork.org/scripts/428692/M-team%20replace%20old%20links.meta.js
// ==/UserScript==

(function() {
    'use strict';

    let links,thisLink;
    links = document.evaluate("//a[@href]",
                              document,
                              null,
                              XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
                              null);

    for (var i=0;i<links.snapshotLength;i++) {
        let thisLink = links.snapshotItem(i);

        thisLink.href = thisLink.href.replace(RegExp('https?://pt\\.m-team\\.cc/(.*)'),
                                      'https://kp\.m-team\.cc/$1');
        thisLink.href = thisLink.href.replace(RegExp('https?://tp\\.m-team\\.cc/(.*)'),
                                      'https://kp\.m-team\.cc/$1');
    }

})();