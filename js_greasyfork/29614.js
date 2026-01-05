// ==UserScript==
// @name         BTN Color Torrents
// @namespace    broadcasthe.net
// @version      1.2
// @description  Extends the "Color Code Torrents" setting
// @author       SIGTERM86
// @include      http*://broadcasthe.net/torrents.php*
// @downloadURL https://update.greasyfork.org/scripts/29614/BTN%20Color%20Torrents.user.js
// @updateURL https://update.greasyfork.org/scripts/29614/BTN%20Color%20Torrents.meta.js
// ==/UserScript==

function strip(html)
{
   var tmp = document.implementation.createHTMLDocument("New").body;
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

(function() {
    // torrents.php?id=*
    let groups = document.querySelectorAll('.group_torrent > td > a');
    for (let i=0; i<groups.length; ++i) {
        let row = groups[i];
        let info = row.innerHTML.split(" / ");
        row.innerHTML = "";
        for (let j=0; j<info.length; j++) {
            let span = document.createElement('span');
            span.innerHTML = info[j];
            span.classList.add(strip(info[j]).replace(/[^\w]/gi, ''));
            row.appendChild(span);
            if (j<info.length-1) {
                span = document.createElement('span');
                span.innerHTML = " / ";
                row.appendChild(span);
            }
        }
    }

    // torrents.php
    let torrents = document.querySelectorAll('.torrent > td:nth-of-type(3)');
    for (let i=0; i<torrents.length; ++i) {
        torrent = torrents[i];
        let content = torrent.innerHTML;
        let info = torrent.innerText.match(/\[(.+?)\]/)[1].split(' / ');
        for (let j=0; j<info.length; j++) {
            content = content.replace(info[j], '<span class="'+info[j]+'" style="float: none">'+info[j]+'</span>');
        }
        torrent.innerHTML = content;
    }
})();
