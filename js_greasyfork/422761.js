// ==UserScript==
// @name         GBFhell
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  try to take over the world!
// @author       You
// @match        http://game.granbluefantasy.jp/
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/422761/GBFhell.user.js
// @updateURL https://update.greasyfork.org/scripts/422761/GBFhell.meta.js
// ==/UserScript==

 var origin = unsafeWindow.XMLHttpRequest.prototype.open;
 unsafeWindow.XMLHttpRequest.prototype.open = function () {
     if ((/\/data\//).test(arguments[1])) {
         this.addEventListener('load', function () {
             if (JSON.parse(this.response).appearance.hasOwnProperty("quest_skip")) {
                 unsafeWindow.alert("Hell");
             };
         });
     };
     origin.apply(this, arguments);
 };

//GM_addStyle(`body{overflow: hidden;}`);
GM_addStyle(`::-webkit-scrollbar{display: none;}`);

var bookmarkLauncher = (function() {
    var bookmarks = {},
        url;

    bookmarks['B'] = 'http://game.granbluefantasy.jp/#quest/assist/multi/0';


    unsafeWindow.window.addEventListener('keyup', function() {
        if (url = bookmarks[String.fromCharCode(event.keyCode)])
            unsafeWindow.location.replace(url);
    });
}());

unsafeWindow.window.addEventListener('mousedown', function() {
    if (this.event.button == 4) {
        unsafeWindow.location.replace('http://www.qq.com')
    }
});
