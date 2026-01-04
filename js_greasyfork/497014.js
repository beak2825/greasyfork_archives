// ==UserScript==
// @name         HDKylin-release-Torrent-bot
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  HDKylin发种机器人
// @author       Exception & 7ommy
// @match        *://*/details.php*
// @match        *://*/takeupload.php
// @match        *://*.hdkyl.in/upload.php*
// @match        *://*/web/torrent-approval-page?torrent_id=*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=www.hdkyl.in
// @require      https://cdn.bootcss.com/jquery/3.4.1/jquery.min.js
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/497014/HDKylin-release-Torrent-bot.user.js
// @updateURL https://update.greasyfork.org/scripts/497014/HDKylin-release-Torrent-bot.meta.js
// ==/UserScript==


function zhuan() {
    setTimeout(function() {
         let button = document.querySelector('#麒麟');
         button.click();
         },500);
      GM_setValue('autoClose', true);
}


zhuan();


  setTimeout(function() {let button = document.querySelector('#qr');
button.click();
window.close();
}, 500);


setTimeout(function() {let button = document.querySelector('#qron');
button.click();


}, 1000);

setTimeout(function() {
window.close();
}, 3000);

