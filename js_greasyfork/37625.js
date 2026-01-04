// ==UserScript==
// @name         hidemy.name proxy parser
// @namespace    tuxuuman:hideme-parser-proxy
// @version      0.1.3
// @description  parse proxy from site page
// @author       tuxuuman
// @match        https://hidemy.name/*/proxy-list/*
// @match        https://hidemyna.me/*/proxy-list/*
// @require      https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js
// @grant        GM_registerMenuCommand
// @grant        GM_setClipboard
// @grant        GM_notification
// @downloadURL https://update.greasyfork.org/scripts/37625/hidemyname%20proxy%20parser.user.js
// @updateURL https://update.greasyfork.org/scripts/37625/hidemyname%20proxy%20parser.meta.js
// ==/UserScript==

(function() {
    'use strict';

    $('.table_block>table>tbody>tr').on('click', function () {
        let tds = $(this).children('td');
        let ip = tds.eq(0).text();
        let port = tds.eq(1).text();
        let host = ip + ':' + port;
        GM_setClipboard(host);
        GM_notification({
            title: "Copied",
            text: host,
            timeout: 2000,
            silent: true
        })
    });

    GM_registerMenuCommand('Parse', function() {
        var resultText = "";
        $('.table_block>table>tbody>tr').each(function(i, e){
            var tr = $(e);
            var tdList = tr.children('td');
            var host = tdList.get(0).innerText;
            var port = tdList.get(1).innerText;
            resultText += host +':'+port+"<br>";
        });
        var newWin = window.open("about:blank", "Proxies", "width=400,height=300");
        newWin.document.write(resultText);
    });

})();