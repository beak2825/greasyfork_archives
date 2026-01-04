// ==UserScript==
// @name         Copiar IP
// @namespace    https://www.taringa.net/Needrom
// @version      0.1
// @description  acceso facil a copiar IP
// @author       Yo
// @include     *://*.taringa.net/*
// @include     *://*.poringa.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34506/Copiar%20IP.user.js
// @updateURL https://update.greasyfork.org/scripts/34506/Copiar%20IP.meta.js
// ==/UserScript==

$('.shouts-admin,.widget-admin').before('<button class="shouts-admin__list--bt" id="copiar">Copiar IP</button><input type="text" id="temp">');
        var playButton = $('#copiar');
        playButton.click(function(){
            copyToClipboard();
        });
        function copyToClipboard() {
        var ip = $(".shouts-admin__ip a,.ip a").text().trim().replace("IP: ","");
        $("#temp").val(ip).select();
        document.execCommand("copy");

    }