// ==UserScript==
// @name         Ekşisözlük+
// @namespace    https://github.com/FrknKoseoglu/eksisozluk-plus
// @version      0.3
// @description  Daha iyi bir ekşisözlük deneyimi
// @author       Furkan Köseoğlu
// @match        https://eksisozluk.com/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/389798/Ek%C5%9Fis%C3%B6zl%C3%BCk%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/389798/Ek%C5%9Fis%C3%B6zl%C3%BCk%2B.meta.js
// ==/UserScript==

var $ = window.jQuery;

(function() {
    'use strict';
    document.getElementById("search-textbox").maxLength = 50; // Arama Çubuğu 50 Karakter Sınırlama

})();

$(document).ready(function() {
    //Genel basit reklam kaldırma
    $(".ad-double-click").css('display', 'none');

    // Sponsor içerik kaldırma
    var sponsor = $("#corporate-content-sponsored-entry").parent();
    $(sponsor).parent().css('display','none');

    if($('#corporate-content-sponsored-entry').length){
        $("#topic h1:first").css('display','none');
       }

});

