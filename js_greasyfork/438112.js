// ==UserScript==
// @name         Disable Douban Jump
// @namespace    A-SOUL
// @version      0.1
// @description  To disable douban jump
// @author       hicarol
// @match https://www.douban.com/group/topic/*
// @match https://douban.com/group/topic/*
// @icon         https://img9.doubanio.com/favicon.ico
// @grant        none
// @run-at document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/438112/Disable%20Douban%20Jump.user.js
// @updateURL https://update.greasyfork.org/scripts/438112/Disable%20Douban%20Jump.meta.js
// ==/UserScript==

XMLHttpRequest.prototype.realOpen = XMLHttpRequest.prototype.open;

var myOpen = function(method, url, async, user, password) {
    //do whatever mucking around you want here, e.g.
    //changing the onload callback to your own version
    //call original
    if(url.startsWith("/j/group/check_content_clean")){
        return "{\"r\":0}";
    }
    return this.realOpen (method, url, async, user, password);
}


//ensure all XMLHttpRequests use our custom open method
XMLHttpRequest.prototype.open = myOpen ;