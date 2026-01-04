// ==UserScript==
// @name        sahibinden.com censor bypass
// @name:tr        sahibinden.com iletişim gösterici
// @namespace   Violentmonkey Scripts
// @match       https://www.sahibinden.com/ilan/*/detay
// @grant       none
// @version     1.0
// @author      illegalsolutions
// @description Automatically removes contact information censorship from sahibinden.com ads without captcha
// @description:tr Otomatik olarak sahibinden.com ilanlarındaki iletişim bilgileri sansürünü captchaya gerek kalmadan kaldırır
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/483886/sahibindencom%20censor%20bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/483886/sahibindencom%20censor%20bypass.meta.js
// ==/UserScript==

function deleteCookie(name) {
    document.cookie = name + '=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}

function getCookie(name) {
    var nameEQ = name + "=";
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1, cookie.length);
        }
        if (cookie.indexOf(nameEQ) === 0) {
            return cookie.substring(nameEQ.length, cookie.length);
        }
    }
    return null;
}

var cookieName = "riskyCategoryViewEnabled";

deleteCookie(cookieName);

var cookieValue = getCookie(cookieName);

if (cookieValue === null) {
    document.cookie = cookieName + "=true; path=/;";
    window.location.reload();
} else if (cookieValue === "false") {
    document.cookie = cookieName + "=true; path=/;";
    window.location.reload();
}
