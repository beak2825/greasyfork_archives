// ==UserScript==
// @name         一键审核种子
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  快速审核种子，提高工作效率！
// @author       freefrank
// @match        https://sharkpt.net/details.php?id=*
// @icon         https://sharkpt.net/favicon.ico
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/461915/%E4%B8%80%E9%94%AE%E5%AE%A1%E6%A0%B8%E7%A7%8D%E5%AD%90.user.js
// @updateURL https://update.greasyfork.org/scripts/461915/%E4%B8%80%E9%94%AE%E5%AE%A1%E6%A0%B8%E7%A7%8D%E5%AD%90.meta.js
// ==/UserScript==

(function () {
    'use strict';

    function fetchToken(torrentId, callback) {
        var xhrToken = new XMLHttpRequest();
        xhrToken.open('GET', 'https://sharkpt.net/web/torrent-approval-page?torrent_id=' + torrentId, true);
        xhrToken.onreadystatechange = function () {
            if (xhrToken.readyState == 4 && xhrToken.status == 200) {
                var token = xhrToken.responseText.match(/<input type="hidden" name="_token" value="(.+?)">/);
                if (token && token[1]) {
                    callback(token[1]);
                } else {
                    alert('Error: Failed to obtain token.');
                }
            }
        };
        xhrToken.send();
    }

    var button = document.createElement('button');
    button.id = 'one-key-approve';
    button.style.height = '36px';
    button.style.width = '36px';
    button.style.fontSize = '16px';
    button.style.fontWeight = 'bold';
    button.style.borderRadius = '50%';
    button.style.backgroundColor = '#4CAF50';
    button.style.color = '#FFF';
    button.style.position = 'fixed';
    button.style.left = '0';
    button.style.top = '50%';
    button.style.transform = 'translateY(-50%)';
    button.innerText = '✓';
    button.onclick = function () {
        var torrent = document.getElementById('approval');
        var torrentId = torrent.getAttribute('data-torrent_id');
        fetchToken(torrentId, function (TOKEN) {
            var xhr = new XMLHttpRequest();
            xhr.open('POST', 'https://sharkpt.net/web/torrent-approval', true);
            xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4) {
                    if (xhr.status == 200) {
                        alert('种子已审核通过！');
                        history.back();
                    } else {
                        alert('错误：审核种子失败，错误');
                    }
                }
            };
            xhr.send('_token=' + TOKEN + '&torrent_id=' + torrentId + '&approval_status=1&comment=');
        });
    };

    var approval = document.getElementById('approval');
    if (approval) {
        approval.parentNode.insertBefore(button, approval);
    }
})();