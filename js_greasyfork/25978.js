// ==UserScript==
// @name         Polovniautomobili besplatan premium
// @namespace    https://polovniautomobili.com/
// @version      0.1
// @description  Na stranici sa opisom automobila, klikom na "HD" ispod svih slika otvara se novi prozor sa 1920x1080 slikom
// @author       You
// @match        https://polovniautomobili.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/25978/Polovniautomobili%20besplatan%20premium.user.js
// @updateURL https://update.greasyfork.org/scripts/25978/Polovniautomobili%20besplatan%20premium.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".hd-btn.icon").replaceWith("<h1 id='hd1'>HD</h1>");
    $('#hd1').click(goHD);
    function goHD(){
        var image = $(".ad-gallery.small img").first();
        var imgSrc = image.attr('src');
        var newPath = imgSrc.substring(0,imgSrc.indexOf("-477x357"));
        newPath += "-1920x1080.jpg";
        var win = window.open(newPath, '_blank');
        win.focus();
    }
})();