// ==UserScript==
// @name         file4.pro FIX
// @namespace    FIX
// @version      0.2
// @description  Скачивание файлов с file4.pro без загрузчика
// @author       raletag
// @match        *://file4.pro/go/view/*
// @grant        none
// @compatible   Opera 15+
// @compatible   Chrome
// @downloadURL https://update.greasyfork.org/scripts/22434/file4pro%20FIX.user.js
// @updateURL https://update.greasyfork.org/scripts/22434/file4pro%20FIX.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function isBase64(str) {
        try {
            return !!str && !!window.atob(str);
        } catch (err) {
            return false;
        }
    }

    var link = document.getElementsByClassName('well tac')[0].getElementsByClassName('btn btn-danger btn')[0], url64, decode64, url;
    url64 = decodeURIComponent((link.href.match(/\/\/(.*)\/(.*)/)||[])[2]);
    if (isBase64(url64)) {
        decode64 = decodeURIComponent(window.atob(url64));
        url = (decode64.match(/\;(.*)\;name/i)||[])[1];
        if (url) {
            link.href = url;
            link.innerHTML += '<br>(без загрузчика)';
        }
    }
})();