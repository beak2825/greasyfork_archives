// ==UserScript==
// @name         huvod-dl
// @namespace    https://greasyfork.org
// @version      1.0
// @description  広島大学のVODサービスで配信されている動画をダウンロードします
// @author       aaaaa
// @match        *://*.huc.hiroshima-u.ac.jp/*
// @grant        GM.xmlHttpRequest
// @grant        GM.openInTab
// @downloadURL https://update.greasyfork.org/scripts/403433/huvod-dl.user.js
// @updateURL https://update.greasyfork.org/scripts/403433/huvod-dl.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var vid = document.querySelector('source');
    var hash = window.location.hash;
    if (vid&&hash) {
        var link = document.createElement("a");
        link.download = decodeURI(hash).slice(1);
        link.href = location.protocol+'//'+location.host+location.pathname;
        document.body.appendChild(link);
        link.click();
        window.close()
    }
    var detail = $('#details_text_box');
    if (!detail.length) {
        return
    }
    var sizedd = $('<dt>サイズ：</dt><dd></dd>').appendTo(detail.find('dl')).last();
    var btnBox = detail.find('div');
    var downloadButton = $('<button disabled>ダウンロード</button>').appendTo(btnBox);
    var codes = btnBox.html().match(/[0-9]{2,}/g);
    var contentsCode = codes[0], categoryCode = codes[1];
    var playlistURL;
    if (categoryCode) {
        playlistURL = 'https://vodweb.huc.hiroshima-u.ac.jp/pcsweb/playlist.do?contentsCode='+contentsCode+'&categoryCode='+categoryCode+'&time='+new Date().getTime();
    } else {
        playlistURL = 'https://vodweb.huc.hiroshima-u.ac.jp/pcsweb/playlist.do?contentsCode='+contentsCode+'&time='+new Date().getTime();
    }
    console.log(playlistURL);
    GM.xmlHttpRequest({
        method: "GET",
        url: playlistURL,
        onload: function(response) {
            var videoURL = response.responseText.match(/http[a-z0-9\/:\-_\.]*\.(mp4|m4v)/)[0];
            console.log(videoURL);
            var videoName = detail.find('dd').first().text();
            downloadButton.click(function() {
                GM.openInTab(videoURL+"#"+videoName, true);
            });
            downloadButton.attr("disabled", false);
            GM.xmlHttpRequest({
                url: videoURL,
                method: "HEAD",
                onload: function(response) {
                    console.log(response.responseHeaders);
                    // Get the raw header string
                    var headers = response.responseHeaders;

                    // Convert the header string into an array
                    // of individual headers
                    var arr = headers.trim().split(/[\r\n]+/);

                    // Create a map of header names to values
                    var headerMap = {};
                    arr.forEach(function (line) {
                        var parts = line.split(': ');
                        var header = parts.shift();
                        var value = parts.join(': ');
                        headerMap[header] = value;
                    });
                    var size = Math.floor(headerMap["content-length"]/1024/1024) + "MB";
                    sizedd.text(size);
                }
            });
        }
    });
}
)();