// ==UserScript==
// @name            anti google search redirect
// @id              antiGoogleSearchRedirect@zbinlin
// @namespace       http://script.bitcp.com/antigooglesearchredirect
// @description     打开 Google 搜索结果链接时，直接使用链接而不使用 Google 重定向
// @include         http*://*.google.tld/search?*
// @author          zbinlin
// @homepage        http://bitcp.com
// @supportURL      http://blog.bitcp.com
// @version         0.0.2
// @run-at          document-start
// @downloadURL https://update.greasyfork.org/scripts/15226/anti%20google%20search%20redirect.user.js
// @updateURL https://update.greasyfork.org/scripts/15226/anti%20google%20search%20redirect.meta.js
// ==/UserScript==

/*
Original URL (0.0.1):
https://bitbucket.org/zbinlin/antigooglesearchredirect/src/0f9f4c27def9

0.0.2:
@include changed to all Google domains.
*/

Object.defineProperty("wrappedJSObject" in window ? window.wrappedJSObject
                                                  : window, "rwt", {
    value: function () {
        return;
    },
    writable: false,
    configurable: false,
    enumerable: true
});
