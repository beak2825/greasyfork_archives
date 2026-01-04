// ==UserScript==
// @name         超星学习通ppt视频下载
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  按下D下载ppt,pdf,上课视频
// @author       JiuYue
// @match        http://mooc1.chaoxing.com/mycourse/*
// @match        https://mooc1.chaoxing.com/mycourse/*
// @match        http://mooc1.chaoxing.com/*
// @match        https://mooc1.chaoxing.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @updateURL
// @installURL
// @downloadURL
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/468425/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9Appt%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/468425/%E8%B6%85%E6%98%9F%E5%AD%A6%E4%B9%A0%E9%80%9Appt%E8%A7%86%E9%A2%91%E4%B8%8B%E8%BD%BD.meta.js
// ==/UserScript==

 
(function () {
    'use strict';
    var i = 0;

    function sendRequestAndOpenWindow(url) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, false);
        xhr.send();
        var json = JSON.parse(xhr.responseText);
        window.open(json.pdf || json.http, '_blank');
        i = (i + 1) % document.getElementsByTagName("iframe")[0].contentDocument.body.getElementsByClassName("ans-attach-ct").length;
    }

    document.onkeydown = function (e) {
        var keyNum = window.event ? e.keyCode : e.which;

        if (keyNum == 68) {
            var iframe = document.getElementsByTagName("iframe")[0];
            var attachElement = iframe.contentDocument.body.getElementsByClassName("ans-attach-ct")[i] || document.getElementsByClassName("ans-attach-ct")[i];
            var objectid = attachElement.getElementsByTagName('iframe')[0].getAttribute('objectid');
            var protocolStr = document.location.protocol;
            var url = protocolStr + '//mooc1.chaoxing.com/ananas/status/' + objectid + '?flag=normal';
            var FileType = attachElement.getElementsByTagName('iframe')[0].getAttribute('data');
            FileType = (FileType && JSON.parse(FileType).type) || '.pdf';

            sendRequestAndOpenWindow(url);
        }
    }
})();
