// ==UserScript==
// @name TVBOXNOW Download
// @version 0.8
// @description download all attachments
// @author JasonC
// @match http://tvboxnow.com/thread-*.html
// @match https://tvboxnow.com/thread-*.html
// @match http://www.tvboxnow.com/thread-*.html
// @match https://www.tvboxnow.com/thread-*.html
// @match https://www.tvboxnow.com/viewthread.php*
// @grant none
// @namespace https://greasyfork.org/users/165799
// @downloadURL https://update.greasyfork.org/scripts/370777/TVBOXNOW%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/370777/TVBOXNOW%20Download.meta.js
// ==/UserScript==
var TVBoxNowLinks = new Array();
function DownloadTVBoxNowLink()
{
    if (TVBoxNowLinks.length > 0)
    {
        var href = TVBoxNowLinks.pop();
        var ifrm = document.createElement("IFRAME");
        ifrm.src = href;
        ifrm.onload = function() {
            var DLBtn = this.contentDocument.querySelectorAll('a[href^="attachment.php?"]')[0];
            try{DLBtn.click();}catch(e){}
            DownloadTVBoxNowLink();
        };
        document.body.appendChild(ifrm);
    }
}
(function() {
    var MainDLBtn = document.createElement('INPUT');
    MainDLBtn.type = 'button';
    MainDLBtn.style.position = 'fixed';
    MainDLBtn.style.top = '10px';
    MainDLBtn.style.left = '10px';
    MainDLBtn.value = 'Download';
    MainDLBtn.onclick = function() {
        var links = document.querySelectorAll('a[href^="attachment.php?"]');
        var linkc = prompt("Link Contains:",".torrent");
        var Skips = parseInt(prompt("Skips:","0"));
        for (var i = 0; i < links.length; i++) {
            var link = links[i];
            if (linkc != "" && link.innerHTML.toLowerCase().indexOf(linkc.toLowerCase()) == -1) {
                continue;
            }
            if (link.innerHTML.toLowerCase().indexOf('.torrent') == -1) {
                continue;
            }
            if (Skips > 0)
            {
                Skips--;
                continue;
            }
            link.style.outline = "2px dashed green";
            TVBoxNowLinks.push(link.href);
        }
        DownloadTVBoxNowLink();
    };
    document.body.appendChild(MainDLBtn);
})();