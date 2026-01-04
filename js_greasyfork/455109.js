// ==UserScript==
// @name         Contenido premium el mercurio
// @namespace    http://tampermonkey.net/
// @version      1.0
// @license MIT
// @description  Permite leer contenido pagado en el mercurio
// @include      *digital.elmercurio.com/*
// @grant         GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/455109/Contenido%20premium%20el%20mercurio.user.js
// @updateURL https://update.greasyfork.org/scripts/455109/Contenido%20premium%20el%20mercurio.meta.js
// ==/UserScript==


    (function () {
        document.cookie = "socialReferrer=null";
        document.cookie = "T=null";


        if (getCookie("ActivePDF") == "") {
            window.location.reload();
            document.cookie = "ActivePDF=active";
        }
    }());


function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}