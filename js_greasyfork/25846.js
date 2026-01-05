// ==UserScript==
// @name TVBOXNOW download
// @namespace http://your.homepage/
// @version 0.3
// @description enter something useful
// @author You
// @match http://www.tvboxnow.com/misc.php?*
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/25846/TVBOXNOW%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/25846/TVBOXNOW%20download.meta.js
// ==/UserScript==

(function() {
    var retry = 10;
    var timer = window.setInterval(function() {
        var buttons = document.querySelectorAll('a[href^="attachment.php?"]');
        for (var i = 0; i < buttons.length; i++) {
            var button = buttons[i];
            if (button.innerHTML.indexOf('點擊此處馬上下載') !== -1) {
                console.log(button.href);
                button.click();
                retry = 0;
            }
        }
        if (--retry < 0) {
            window.clearInterval(timer);
        }
    }, 1000);
})();