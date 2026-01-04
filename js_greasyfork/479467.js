// ==UserScript==
// @name         EkşiBition
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Sub etha'ya ekşibition ekleme
// @author       bagcivan
// @match        https://eksisozluk1923.com/sub-etha
// @icon         https://www.google.com/s2/favicons?sz=64&domain=eksisozluk1923.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/479467/Ek%C5%9FiBition.user.js
// @updateURL https://update.greasyfork.org/scripts/479467/Ek%C5%9FiBition.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Sayfa yüklendiğinde çalışacak fonksiyon
    $(document).ready(function() {
        // Yeni li elementini ve içeriğini oluştur
        var yeniLiHtml = '<li id="site-4" class=""><article><h2><a href="/sub-etha/yardir?id=5" data-subetha="4" rel="noopener" target="_blank">ek$ibition</a></h2><img src="https://ekstat.com/img/subetha/exhibition.gif" alt="ek$ibition" class="logo"><div class="details"><p>ekşi sözlük sanat galerisi</p></div></article></li>';
        var yeniLi = $(yeniLiHtml);

        // UL elementine yeni li'yi ekleyin
        $('#sub-etha-sites').append(yeniLi);

        // Yeni eklenen li için olay dinleyicisini ayarlayın
        yeniLi.find('a').on('click', function(e) {
            e.preventDefault();
            $("#subetha-site-id").val($(this).data("subetha"));
            $("#subetha-redirect-form").submit();
            return false;
        });
    });
})();
