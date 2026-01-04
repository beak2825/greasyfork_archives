// ==UserScript==
// @name         ekşisözlük++
// @namespace    https://github.com/cermik
// @version      1.0
// @description  okunabilirliği artırılmış ve reklamlardan arındırılmış ekşisözlük deneyimi sunar
// @author       cermk
// @match        https://eksisozluk.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419965/ek%C5%9Fis%C3%B6zl%C3%BCk%2B%2B.user.js
// @updateURL https://update.greasyfork.org/scripts/419965/ek%C5%9Fis%C3%B6zl%C3%BCk%2B%2B.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var $ = window.jQuery;
    $(document).ready(function() {
        // reklam yönetimi
        $(".under-top-ad").css('display', 'none'); 	// üstteki banner reklam gizlendi
        $("#aside").css('display', 'none'); 		// yan menü gizlendi
        $(".bottom-ads").css('display', 'none');	// alttaki banner reklam gizlendi
        $("#content-body").css("width", "98%");
        $(".container, #yeni-reklam").css("display", "none");
    });
})();