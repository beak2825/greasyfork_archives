// ==UserScript==
// @name         MTV Color Torrents
// @namespace    morethan.tv
// @version      1.1
// @description  Extends the "Color Code Torrents" setting
// @author       FlaPJack
// @include      http*://www.morethan.tv/torrents.php?*id=*
// @downloadURL https://update.greasyfork.org/scripts/36908/MTV%20Color%20Torrents.user.js
// @updateURL https://update.greasyfork.org/scripts/36908/MTV%20Color%20Torrents.meta.js
// ==/UserScript==

function strip(html)
{
   var tmp = document.implementation.createHTMLDocument("New").body;
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}

(function() {
    var groups = document.querySelectorAll('.group_torrent > td > a');
    for (var i=0; i<groups.length; ++i) {
        var row = groups[i];
        var info = row.innerHTML.split(" / ");
        row.innerHTML = "";
        for (var j=0; j<info.length; j++) {
            var span = document.createElement('span');
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
})();