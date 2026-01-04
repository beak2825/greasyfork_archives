// ==UserScript==
// @name beeline-pixel
// @description   beeline-pixel fcp
// @match          *://*/*
// @version 0.0.1.20240913103452
// @namespace https://greasyfork.org/users/1366961
// @downloadURL https://update.greasyfork.org/scripts/508278/beeline-pixel.user.js
// @updateURL https://update.greasyfork.org/scripts/508278/beeline-pixel.meta.js
// ==/UserScript==

function getCookie(name) {
    var value = "; " + document.cookie;
    var parts = value.split("; " + name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

function getPixelId() {
    const localStorageValue = localStorage.getItem("__pixel_user_id");

    if (localStorageValue === null) {
        const newUserId = getUserId();
        localStorage.setItem("__pixel_user_id", newUserId);

        return newUserId;
    }

    return localStorageValue;
}

function getUserId() {
    return Math.random().toString(36).substr(2, 8)
        + '-'
        + Math.random().toString(36).substr(2, 4)
        + '-'
        + Math.random().toString(36).substr(2, 4)
        + '-'
        + Math.random().toString(36).substr(2, 4)
        + '-'
        + Math.random().toString(36).substr(2, 12);
}

function httpGetAsync(theUrl, callback) {
    var xmlHttp = new XMLHttpRequest();
    xmlHttp.onreadystatechange = function () {
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
            callback(xmlHttp.responseText);
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
}

//вместо sspid нужно подставить реальный sspid, который выдан для партнера
var apiKey = 'DDFEAF37-830F-59C5-A8E7-FF17264D5F26';
var fcpLink = 'https://fcpe.beeline.ru/sync/me?guid=' + apiKey;

var user_id = getCookie('thissiteuserid') || getUserId();
document.cookie = "thissiteuserid=" + user_id + "; max-age=40176000";

if (typeof user_id !== 'undefined') {
    var img = document.createElement("img");
    img.src = fcpLink + '&?pixid=' + user_id;
    img.width = img.height = 1, img.style.border = "none", img.style.display = "none";
    document.body.appendChild(img);
}