// ==UserScript==
// @name            Cookietosser
// @name:es         Lanzagalletas
// @namespace       miki365
// @version         1.0
// @description     Fix a problem with popup window for comments
// @description:es  Arregla un problema de la caja de comentarios
// @author          miki365
// @match           *://blogs.libertaddigital.com/penultimo-raulista-vivo/*
// @grant           none
// @downloadURL https://update.greasyfork.org/scripts/393314/Cookietosser.user.js
// @updateURL https://update.greasyfork.org/scripts/393314/Cookietosser.meta.js
// ==/UserScript==

(function() {
    function createCookie(name, value, days, domain) {
        var expires;
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days*24*60*60*1000));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
        document.cookie = name + "=" + value + expires + "; domain=" + domain + "; path=/";
    }

    function readCookie(name) {
        var str = name + "=";
        var arr = document.cookie.split(';');
        for(var i=0;i < arr.length;i++) {
            var c = arr[i];
            while (c.charAt(0) == ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(str) === 0)
                return c.substring(str.length, c.length);
        }
        return null;
    }

    if (readCookie('sso_ld_unique') !== null && readCookie('sso_ld_userdata') !== null) {
        createCookie('sso_ld_unique', readCookie('sso_ld_unique'), 7, '.libertaddigital.com');
        createCookie('sso_ld_userdata', readCookie('sso_ld_userdata'), 7, '.libertaddigital.com');
    }
})();