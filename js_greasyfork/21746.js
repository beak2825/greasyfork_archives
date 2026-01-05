// ==UserScript==
// @name       akiba thumb
// @namespace  https://www.akiba-online.com/
// @version    0.1
// @description  akiba list thumb
// @include    http*://*.akiba-online.*/*
// @grant      none
// @copyright  2012+, You
// @downloadURL https://update.greasyfork.org/scripts/21746/akiba%20thumb.user.js
// @updateURL https://update.greasyfork.org/scripts/21746/akiba%20thumb.meta.js
// ==/UserScript==

$(function() {
    var getThumb = $(".discussionListItems .posterAvatar");    
    getThumb.css("width",235);
    getThumb.find(".Thumbnail").css("width","auto");
    getThumb.find("span").css({ width:"auto", height:"auto" });
    getThumb.find("img").css({ width:220, height:"auto", display:"block" });
});