// ==UserScript==
// @name         自动打开VOCALOID周刊抄榜歌曲脚本
// @namespace    https://greasyfork.org/users/123456
// @version      0.2
// @description  观看抄榜时，因为b站笔记中的bv号不是超链接，想打开歌曲视频需要一个一个复制bv号再打开，巨麻烦，所以我让gpt生成了这个油猴脚本
// @match        https://*/*
// @grant        GM_registerMenuCommand
// @require      https://greasyfork.org/scripts/123456/code/GM_registerMenuCommand.js
// @downloadURL https://update.greasyfork.org/scripts/487472/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80VOCALOID%E5%91%A8%E5%88%8A%E6%8A%84%E6%A6%9C%E6%AD%8C%E6%9B%B2%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/487472/%E8%87%AA%E5%8A%A8%E6%89%93%E5%BC%80VOCALOID%E5%91%A8%E5%88%8A%E6%8A%84%E6%A6%9C%E6%AD%8C%E6%9B%B2%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Define a function to open Bilibili video links from BV strings on a webpage
    function openBilibiliLinks() {
        // Get all the text nodes on the page
        var textNodes = document.evaluate("//text()", document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null);

        // Define a set to store the opened BV strings
        var openedBV = new Set();

        // Loop through the text nodes and find the BV strings
        for (var i = 0; i < textNodes.snapshotLength; i++) {
            var node = textNodes.snapshotItem(i);
            var text = node.nodeValue;

            // Use a regular expression to match the BV strings
            var regex = /BV\w+/g;
            var match = regex.exec(text);

            // Loop through the matches and open the Bilibili video links in new tabs
            while (match) {
                var bv = match[0];
                // Check the length of the BV string
                if (bv.length == 12) {
                    // Check if the BV string has been opened before
                    if (!openedBV.has(bv)) {
                        // If not, open the link
                        var url = "https://www.bilibili.com/" + bv;
                        window.open(url, "_blank");
                        // Add the BV string to the opened set
                        openedBV.add(bv);
                    }
                    // Otherwise, do nothing
                }
                // Otherwise, do nothing
                match = regex.exec(text);
            }
        }
    }

    // Register a menu command to run the function
    GM_registerMenuCommand("打开哔哩哔哩链接", openBilibiliLinks);
})();