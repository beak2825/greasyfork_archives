// ==UserScript==
// @name         leechpremium.link/cheat/ をアレするやつ
// @namespace    http://plg4u.blog.fc2.com/
// @version      0.1
// @description  Don't try to cheat us!! We are Smarter than you!!?
// @author       hk
// @run-at       document-start
// @match        http://leechpremium.link/cheat/?link=*
// @grant        window.close
// @downloadURL https://update.greasyfork.org/scripts/23610/leechpremiumlinkcheat%20%E3%82%92%E3%82%A2%E3%83%AC%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/23610/leechpremiumlinkcheat%20%E3%82%92%E3%82%A2%E3%83%AC%E3%81%99%E3%82%8B%E3%82%84%E3%81%A4.meta.js
// ==/UserScript==

var link = location.href;
link = atob(link.substring(link.lastIndexOf("?link=") + 6));
if (/Chrome/i.test(navigator.userAgent)) {
    window.open(link, '_blank');
    setTimeout(function(){ window.close(); }, 500);
} else {
    location.href = link;
}