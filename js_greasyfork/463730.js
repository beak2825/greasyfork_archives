// ==UserScript==
// @name Restore program-think's comments
// @namespace http://tampermonkey.net/
// @version 0.1
// @description 修复编程随想博客加载评论出错的问题
// @author program-think
// @match https://program-think.blogspot.com/*
// @run-at document-start
// @icon https://www.google.com/s2/favicons?sz=64&domain=blogspot.com
// @grant none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/463730/Restore%20program-think%27s%20comments.user.js
// @updateURL https://update.greasyfork.org/scripts/463730/Restore%20program-think%27s%20comments.meta.js
// ==/UserScript==

(function() {
'use strict';

const original = HTMLAnchorElement.prototype.getAttribute;
HTMLAnchorElement.prototype.getAttribute = function(name) {
    if (name === 'href') {
        let link = original.call(this, name);
        let start = link ? link.indexOf('?po=') : -1;
        if (start !== -1) {
            let end = link.indexOf('&');
            let postID = link.substring(start+4, end);
            let newLink = link + "&postID=" + postID;
            console.log(`source => ${link}, new => ${newLink}`);
            link = newLink;
        }

        return link;
    }

    return original.call(this, name);
};
})();