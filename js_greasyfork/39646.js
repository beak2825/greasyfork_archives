// ==UserScript==
// @name         Toranoana: Add thumbnails to shopping cart
// @namespace    http://darkfader.net/
// @version      0.1.1
// @description  Add thumbnail and doujinshi image lookup link
// @author       Rafael Vuijk
// @match        http*://www.toranoana.jp/cgi-bin/R5/details1010.cgi*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/39646/Toranoana%3A%20Add%20thumbnails%20to%20shopping%20cart.user.js
// @updateURL https://update.greasyfork.org/scripts/39646/Toranoana%3A%20Add%20thumbnails%20to%20shopping%20cart.meta.js
// ==/UserScript==
"strict";

var patt = /http:\/\/www.toranoana.jp\/mailorder\/common\/images\/mat\/stock([0-5]).gif/;

var links = [];

function nextlink() {
    var link = links.shift();
    if (link === undefined) return;

    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function() {
        if (xhr.readyState === XMLHttpRequest.DONE) {
            if (xhr.status === 200) {
                var match = patt.exec(xhr.responseText);
                if (match != null) {
                    console.log("got match " + match[1]);

                    var td = document.createElement('td');
                    var img = document.createElement('img');
                    img.setAttribute('src', "http://www.toranoana.jp/mailorder/common/images/mat/stock" + match[1] + ".gif");
                    td.appendChild(img);
                    link.row.appendChild(td);
                }
                nextlink();
            }
        }
    };
    console.log("opening " + link.url);
    xhr.open("GET", link.url, true);
    xhr.send();
}

// $(document).ready
(function() {

    var xpath = "//table[@class='item_list_pc']/tbody/tr";
    var results = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    for (var i = 0; i < results.snapshotLength; i++) {
        var tr = results.snapshotItem(i);

        var tds = tr.getElementsByTagName('td');
        if (tds.length == 0) continue;

        var no = tds[0].innerText;

        var item_id = tds[1].innerText;

        if (tds[2].getElementsByTagName('a').length == 0) continue;
        var link = tds[2].getElementsByTagName('a')[0].getAttribute('href');
        var img1_src = link.replace('/mailorder/article/', 'http://img.toranoana.jp/img/').replace('.html', '-1r.gif');
        var img2_src = link.replace('/mailorder/article/', 'http://img.toranoana.jp/img/').replace('.html', '-1.gif');

        var s = document.createElement('td');
        var a = document.createElement('a');

        a.setAttribute('target', '_blank');
        a.setAttribute('href', 'http://www.doujinshi.org/IMGSERV/socket.php?img=&COLOR=4&URL=' + encodeURIComponent(img2_src));

        var img = document.createElement('img');
        img.setAttribute('src', img1_src);
        a.appendChild(img);

        s.appendChild(a);

        tr.appendChild(s);

        links.push({url:link, row:tr});
    }

    nextlink();
})();
