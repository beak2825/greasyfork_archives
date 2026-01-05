// ==UserScript==
// @name         file-space.org FIX
// @namespace    FIX
// @version      0.1
// @description  Скачивание файлов с file-space.org без загрузчика
// @author       raletag
// @match        http://file-space.org/files/freeget/*
// @grant        none
// @compatible   Opera 15+
// @compatible   Chrome
// @downloadURL https://update.greasyfork.org/scripts/22421/file-spaceorg%20FIX.user.js
// @updateURL https://update.greasyfork.org/scripts/22421/file-spaceorg%20FIX.meta.js
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

    document.addEventListener('DOMNodeInserted',function(e){
        if (!e || !e.target || !(e.target instanceof HTMLElement)) return;
        var links = e.target.getElementsByTagName('a'), url64, decode64, url;
        for (var i = 0; i < links.length; i++) {
            url64 = decodeURIComponent((links[i].href.match(/\/\/(.*)\/(.*)/)||[])[2]);
            if (isBase64(url64)) {
                decode64 = decodeURIComponent(window.atob(url64));
                url = (decode64.match(/\;(.*)\;name/i)||[])[1];
                if (url) {
                    var div = document.getElementById('link_field');
                    if (div) {
                        var newdiv = document.createElement('div');
                        newdiv.innerHTML = '<div style="font-size:20px; padding-bottom: 10px;padding-top: 10px; text-align: center;width: 700px;"><a id="al4" class="al3" target="_blank" href="'+url+'">СКАЧАТЬ ФАЙЛ БЕЗ ЗАГРУЗЧИКА</a></div>';
                        div.insertBefore(newdiv, div.firstChild);
                    }
                    return;
                 }
             }
        }
        });
})();