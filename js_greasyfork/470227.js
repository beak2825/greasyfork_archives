// ==UserScript==
// @name         aDependência
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Sem isso o código não roda!
// @author       Mikill
// @match        https://animefire.net/*
// @icon         https://animefire.net/uploads/cmt/317030_1688556659.webp
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/470227/aDepend%C3%AAncia.user.js
// @updateURL https://update.greasyfork.org/scripts/470227/aDepend%C3%AAncia.meta.js
// ==/UserScript==

function checkPrmtCookieExists() {
    return document.cookie.includes('prmt=');
}

function deleteCookie(cookieName) {
    document.cookie = cookieName + "=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
}

var cookieCreated = false;

function createCacheCookie() {
    if (!cookieCreated) {
        var randomValue = Math.floor(Math.random() * 9) + 1; // Random value between 1 and 9
        document.cookie = "cache=" + randomValue + "; path=/";
        cookieCreated = true;
    }
}

setInterval(function() {
    if (checkPrmtCookieExists()) {
        createCacheCookie();
    } else {
        deleteCookie('cache');
        cookieCreated = false;
    }
}, 10000);

function getCookieExpiration(cookieName) {
    var cookies = document.cookie.split(';');
    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName) === 0) {
            var cookieParts = cookie.split('=');
            if (cookieParts.length === 2) {
                return cookieParts[1];
            }
        }
    }
    return "";
}

setInterval(function() {
    if (!checkPrmtCookieExists()) {
        location.reload();
    }
}, 40000);
