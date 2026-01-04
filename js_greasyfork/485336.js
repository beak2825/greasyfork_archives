// ==UserScript==
// @name        streamcheck.link skipper
// @namespace   Violentmonkey Scripts
// @match       https://streamcheck.link/*
// @grant       none
// @version     1.0
// @author      -
// @license MIT
// @description 20.01.2024 23:02:46
// @downloadURL https://update.greasyfork.org/scripts/485336/streamchecklink%20skipper.user.js
// @updateURL https://update.greasyfork.org/scripts/485336/streamchecklink%20skipper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Sayfa yüklendiğinde çalışacak fonksiyon
    window.addEventListener('load', function() {
        // Sayfadaki tüm script etiketlerini al
        var scripts = document.getElementsByTagName('script');
        for (var i = 0; i < scripts.length; i++) {
            var script = scripts[i].innerHTML;
            // Eğer script içinde window.location.href varsa
            if (script.includes('window.location.href')) {
                // URL'yi yakala
                var urlMatch = script.match(/window\.location\.href\s*=\s*'(.*?)'/);
                if (urlMatch && urlMatch[1]) {
                    // Yakalanan URL'ye yönlendir
                    window.location.href = urlMatch[1];
                }
            }
        }
    });
})();
