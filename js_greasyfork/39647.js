// ==UserScript==
// @name         Surugaya: cart: Add item code and DoujinshiDB link
// @namespace    http://darkfader.net/
// @version      0.1
// @description  Add item code and DoujinshiDB link to the shopping cart.
// @author       Rafael Vuijk
// @match        http*://www.suruga-ya.jp/cargo/detail*
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/39647/Surugaya%3A%20cart%3A%20Add%20item%20code%20and%20DoujinshiDB%20link.user.js
// @updateURL https://update.greasyfork.org/scripts/39647/Surugaya%3A%20cart%3A%20Add%20item%20code%20and%20DoujinshiDB%20link.meta.js
// ==/UserScript==
"strict";

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

$(document).ready(function() {
    var xpath = "//td[@class='photo_box']";
    var results = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);

    for (var i = 0; i < results.snapshotLength; i++) {
        var td = results.snapshotItem(i);
        var a = td.getElementsByTagName('p')[0].getElementsByTagName('a')[0];
        var code = a.getAttribute('href').split('/').slice(-1)[0];
        if (isNumeric(code) && (code.indexOf('001', code.length - 3) !== -1)) {
            code = code.substr(0,code.length-3);
        }
        console.log(code);
        var src = "http://www.suruga-ya.jp/pics/boxart_m/" + code.toLowerCase() + "m.jpg";
        a.setAttribute('target', '_blank');
        a.setAttribute('href', 'http://www.doujinshi.org/IMGSERV/socket.php?img=&COLOR=4&URL=' + encodeURIComponent(src));

        var s = document.createElement('span');
        s.innerText = code;
        a.appendChild(s);
    }
});
