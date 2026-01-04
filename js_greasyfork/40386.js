// ==UserScript==
// @name         Coolrom, direct download
// @namespace    http://tampermonkey.net/
// @version      1.6
// @description  With this, the download link will point to the direct download url, allowing to download without opening popups windows and without downloading downloader executables.
// @include      *://coolrom.com/roms/*
// @include      *://www.coolrom.com/roms/*
// @include      *://coolrom.com.au/*
// @run-at       document-start
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40386/Coolrom%2C%20direct%20download.user.js
// @updateURL https://update.greasyfork.org/scripts/40386/Coolrom%2C%20direct%20download.meta.js
// ==/UserScript==

(function () {
    'use strict';
    var appendInterval, iframeInterval, idInterval, iframe, query, setTime, downloadUrl;

    iframe = document.createElement('iframe');
    iframe.style = 'display:none';
    query = "";
    idInterval = setInterval(function () {
        var element = document.querySelector('a[href*="/dlpop.php"], a[href*="/downloader"]');
        if (element) {
            element = document.querySelector('a[href*="/downloader"]');
            if (element) {
                query = element.href.split("?", 2)[1];
            } else {
                element = document.querySelector('a[href*="/dlpop.php"]');
                if (element) {
                    query = element.href.replace(/[^\?]+\?([^']+).*/, "$1");
                }
            }
            iframe.src = '/dlpop.php?' + query;
            clearInterval(idInterval);
        }
    }, 1);

    appendInterval = setInterval(function () {
        if (document.body) {
            document.body.appendChild(iframe);
            clearInterval(appendInterval);
        }
    }, 1);

    iframeInterval = setInterval(function () {
        var links, input;

        if (iframe.contentWindow && !setTime) {
            Object.defineProperty(iframe.contentWindow, 'time', {value: 0});
            setTime = true;
        }

        input = iframe.contentDocument && iframe.contentDocument.getElementsByTagName('input')[0];
        if (input) {
            clearInterval(iframeInterval);
            downloadUrl = input.parentNode.action;
            links = document.querySelectorAll('a[href*="/dlpop.php"], a[href*="/downloader"]');
            Array.prototype.forEach.call(links, function (a) {
                a.href = downloadUrl;
            });
            var center = document.querySelectorAll('center')[1];
            if (center && center.textContent && (center.textContent.indexOf('Este título está protegido') > -1 || center.textContent.indexOf("title is protected") > -1)) {
                var div = document.createElement('center');
                div.innerHTML = '<div class="container"><style>.download-button {position: absolute;top: 50%;left: 54.5%;transform: translate(-50%, -50%);font-family: Verdana;font-style: bold;font-size: 18px;color: #FFFFFF;}</style><a class="download_link" href="' + downloadUrl + '"><img src="/images/download_button2.png" alt="download" style="width:300px;"><div class="download-button">DOWNLOAD</div></a></div>';
                center.insertBefore(div, center.childNodes[13]);
                center.removeChild(center.childNodes[14]);
            }
            console.log(downloadUrl);
            iframe.src = 'about:blank';
        }
    }, 1);


    Object.defineProperty(window, 'open', {value: function (url) {
        var inter;
        if (url.substr(0, 10) === '/dlpop.php') {
            inter = setInterval(function () {
                if (downloadUrl) {
                    window.location = downloadUrl;
                    clearInterval(inter);
                }
            }, 10);
        } else {
            window.location = url;
        }
        return true;
    }});

}());
