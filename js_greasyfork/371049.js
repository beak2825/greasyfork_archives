// ==UserScript==
// @name         qBittorrent Web UI clipboard support
// @name:zh-TW   qBittorrent Web UI 剪貼簿支援
// @namespace    https://github.com/axzxc1236/
// @version      0.1
// @description  Adds ctrl+v support to qBittorrent's Web UI, if a magnet link is in your clipboard it automatically adds the torrent.
// @description:zh-tw  對qBittorrent的Web UI新增了貼上(ctrl+v)的支援，如果腳本在你的剪貼簿偵測到磁力連結，會自動新增種子
// @author       axzxc1236
// @match        https://127.0.0.1:8080/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/371049/qBittorrent%20Web%20UI%20clipboard%20support.user.js
// @updateURL https://update.greasyfork.org/scripts/371049/qBittorrent%20Web%20UI%20clipboard%20support.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    navigator.permissions.query({
        name: 'clipboard-read'
    }).then(permissionStatus => {
        // Will be 'granted', 'denied' or 'prompt':
        if (permissionStatus.state == "denied") {
            alert("Clipboard permission is denied, this script will not work until you change that");
        }
    });
    document.addEventListener('paste', function(data) {
        var text = data.clipboardData.getData("text");
        if (text.startsWith("magnet:?xt=")) {
            document.getElementById('downloadButton').click();
            document.getElementById("downloadPage_iframe").contentDocument.body.onload = function() {
                this.document.body.getElementById("urls").innerText = text;
                this.document.body.getElementById("submitButton").click();
            };
        }
    });
})();