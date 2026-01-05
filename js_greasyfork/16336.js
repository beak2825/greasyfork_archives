// ==UserScript==
// @name TVBOXNOW
// @namespace http://your.homepage/
// @version 0.3
// @description enter something useful
// @author You
// @match http://www.tvboxnow.com/thread-*.html
// @match http://www.tvboxnow.com/viewthread.php?*
// @match http://tv520.funbbs.me/thread-*.html
// @grant none
// @downloadURL https://update.greasyfork.org/scripts/16336/TVBOXNOW.user.js
// @updateURL https://update.greasyfork.org/scripts/16336/TVBOXNOW.meta.js
// ==/UserScript==

(function() {
    document.body.insertAdjacentHTML('beforeend', '<div style="position:fixed;right:10px;bottom:10px;padding:10px;border:1px solid black;background:white;z-index:999999;"><button id="btnDownloadAll">Download all</button></div>');
    document.getElementById('btnDownloadAll').onclick = function() {
        var links = document.querySelectorAll('a[href^="attachment.php?"]');
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            if (link.innerHTML.indexOf('.torrent') !== -1) {
                document.body.insertAdjacentHTML('beforeend', '<iframe id="pnlDownload" style="display:none;" src="'+link.href+'" onload="this.parent.removeChild(this);"></iframe>');
                console.log(link.href);
            }
        }
    };
})();