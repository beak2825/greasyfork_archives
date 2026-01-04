// ==UserScript==
// @name         斗鱼直播广告屏蔽
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  屏蔽斗鱼直播中的广告
// @author       Dexter Chen
// @match        https://www.douyu.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/31005/%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/31005/%E6%96%97%E9%B1%BC%E7%9B%B4%E6%92%AD%E5%B9%BF%E5%91%8A%E5%B1%8F%E8%94%BD.meta.js
// ==/UserScript==

function isEmpty(obj) {
    // null and undefined are "empty"
    if (obj === null || obj === undefined) return true;
    // Assume if it has a length property with a non-zero value
    // that that property is correct.
    if (obj.length > 0)    return false;
    if (obj.length === 0)  return true;
    // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
        if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
}

function remover(name, callback) {
    var $ = window.jQuery;
    if (isEmpty($) || isEmpty($(name))) {
        setTimeout(function() {
                remover(name);
            }, 500);
    } else {
        if (isEmpty(callback)) {
            // default callback is clear html content and set "display: none".
            $(name).html('').hide();
        } else {
            callback($(name));
        }
    }
}

function main() {
    remover('.room-ad-top');
    remover('.sq-ad');
    remover('.room-ad-video-down');
    remover('#js-recommand');
    remover('.room-ad-bottom');
    remover('#js-chat-right-ad');
    remover('.f-sign-cont');
    remover('.live-room-normal-equal-right-item div:gt(2)');
}

main();