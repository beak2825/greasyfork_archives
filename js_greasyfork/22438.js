// ==UserScript==
// @name             Без загрузчиков
// @name:en          Without external downloaders
// @namespace        FIX
// @version          0.1
// @description      Файлообменники без сторонних загрузчиков
// @description:en   File hosting without external downloaders
// @author           raletag
// @match            *://file-space.org/files/freeget/*
// @match            *://file4.pro/go/view/*
// @grant            none
// @compatible       Opera 15+
// @compatible       Chrome
// @downloadURL https://update.greasyfork.org/scripts/22438/%D0%91%D0%B5%D0%B7%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D1%87%D0%B8%D0%BA%D0%BE%D0%B2.user.js
// @updateURL https://update.greasyfork.org/scripts/22438/%D0%91%D0%B5%D0%B7%20%D0%B7%D0%B0%D0%B3%D1%80%D1%83%D0%B7%D1%87%D0%B8%D0%BA%D0%BE%D0%B2.meta.js
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

    var hostname = window.location.hostname, scripts = {};

    scripts['file-space.org'] = function() {
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
    };

    scripts['file4.pro'] = function() {
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
    };

    scripts[hostname]();

})();