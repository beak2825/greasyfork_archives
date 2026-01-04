// ==UserScript==
// @name         TürkAnime TV - Yorum Bölümü Ekleyici
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Türk Anime TV'deki Disqus yorum bölümünü GraphComment ile değiştirir.
// @license        MIT License
// @author         Kerim Demirkaynak
// @icon           https://www.turkanime.co/imajlar/favicon.ico
// @match        *://www.turkanime.co/video/*
// @grant        none
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/544931/T%C3%BCrkAnime%20TV%20-%20Yorum%20B%C3%B6l%C3%BCm%C3%BC%20Ekleyici.user.js
// @updateURL https://update.greasyfork.org/scripts/544931/T%C3%BCrkAnime%20TV%20-%20Yorum%20B%C3%B6l%C3%BCm%C3%BC%20Ekleyici.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Değiştirilecek yorum bölümünün ana konteynerini bul
    const commentContainer = document.querySelector('#orta-icerik-alt');

    if (commentContainer) {
        // İçeriği temizle ve GraphComment için div ekle
        commentContainer.innerHTML = '<div id="graphcomment"></div>';
        // Orijinal "Yorumları Görüntüle" butonundan kalan padding'i kaldır
        commentContainer.style.padding = "0";

        // İlgisiz kalan Disqus sekmesini gizle
        const disqusTab = document.querySelector('#orta-sekme-alt > li.active');
        if(disqusTab) {
            disqusTab.style.display = 'none';
        }


        // GraphComment yükleme betiğini oluştur
        const graphCommentScript = document.createElement('script');
        graphCommentScript.type = 'text/javascript';
        graphCommentScript.text = `
            /* - - - CONFIGURATION VARIABLES - - - */
            var __semio__params = {
                graphcommentId: "testyorum", // Kendi GraphComment ID'niz ile değiştirmeyi unutmayın
                behaviour: {
                    // HIGHLY RECOMMENDED
                    // uid: "..." // Sayfanızdaki yorum dizisi için benzersiz tanımlayıcı (ör: sayfa kimliğiniz)
                },
                // Değişkenlerinizi burada yapılandırın
            };

            /* - - - DON'T EDIT BELOW THIS LINE - - - */
            function __semio__onload() {
                __semio__gc_graphlogin(__semio__params);
            }

            (function() {
                var gc = document.createElement('script');
                gc.type = 'text/javascript';
                gc.async = true;
                gc.onload = __semio__onload;
                gc.defer = true;
                gc.src = 'https://integration.graphcomment.com/gc_graphlogin.js?' + Date.now();
                (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(gc);
            })();
        `;

        // Oluşturulan betiği sayfanın sonuna ekleyerek çalıştır
        document.body.appendChild(graphCommentScript);
    }
})();