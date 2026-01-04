// ==UserScript==
// @name         Bilibili UP blocker
// @namespace    https://github.com/sync-coding
// @version      1.1
// @description  Customizable Bilibili UP blocker via UID -- 利用 UID 屏蔽 b站 UP主
// @author       sync-coding
// @license      GNU GPLv3
// @match        *.bilibili.com/*
// @grant        GM_log
// @run-at       document-end
// @charset      UTF-8
// @downloadURL https://update.greasyfork.org/scripts/437587/Bilibili%20UP%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/437587/Bilibili%20UP%20blocker.meta.js
// ==/UserScript==


'use strict';

var localBlockList = [];
var remoteBlockList = [];
var blockList = localBlockList.concat(remoteBlockList);

setInterval(function(){

    var allVideoOwnerElements, videoOwnerElement;
    allVideoOwnerElements = document.evaluate(
        '//a[@class="bili-video-card__info--owner"]',
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null);
    var i;
    for (i = 0; i < allVideoOwnerElements.snapshotLength; i++) {
        var node = allVideoOwnerElements.snapshotItem(i);
        var href = node.attributes.getNamedItem("href").value;
        if (href.match(/\/\/space.bilibili.com\/.*/g))
        {
            var UID = parseInt(href.replace(/.*com\//i,""));
            if (blockList.includes(UID))
            {
                node.parentNode.parentNode.parentNode.parentNode.parentNode.remove();
            }
        }
   }

},1000);
