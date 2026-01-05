// ==UserScript==
// @name         Telegram tg:// to web+tg://
// @namespace    http://denilson.sa.nom.br/
// @version      0.1
// @description  Converts "tg://" links to "web+tg://". See https://github.com/zhukov/webogram/issues/594
// @homepage     https://gist.github.com/denilsonsa/b32ee2957982bfa86a00
// @homepage     https://greasyfork.org/en/scripts/18593-telegram-tg-to-web-tg
// @author       Denilson Sá
// @grant        none
// @license      Public domain
// @downloadURL https://update.greasyfork.org/scripts/18593/Telegram%20tg%3A%20to%20web%2Btg%3A.user.js
// @updateURL https://update.greasyfork.org/scripts/18593/Telegram%20tg%3A%20to%20web%2Btg%3A.meta.js
// ==/UserScript==

// Due to web restrictions, web.telegram.org cannot register itself to "tg://" protocol.
// The browser only allows the white-listed version "web+tg://".
// See also: https://github.com/zhukov/webogram/issues/594
//
// This user-script converts any "tg://" link to "web+tg://".
// It is only run when a document finishes loading, so it won't slow down the entire browser.
// This also means that any dynamically-created links will be left untouched.
//
// This script is also hosted at https://greasyfork.org/en/scripts/18593-telegram-tg-to-web-tg

(function(){
    for (var i = 0; i < document.links.length; i++) {
        var anchor = document.links[i];
        if (/^tg:\/\//.test(anchor.href)) {
            anchor.href = 'web+' + anchor.href;
        }
    }
})();
