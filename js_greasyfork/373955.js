// ==UserScript==
// @name         secretlyRequest
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  静默请求
// @author       You
// @grant        none
// ==/UserScript==
(function () {
    const requset = (url) => {
        return new Promise((resolve, reject) => {
            const img = new Image;
            img.onload = () => {
                resolve(0);
            };
            img.onerror = (err) => {
                resolve(1);
            };
            img.src = url;
        });
    };

    window.H = window.H || {};
    window.H.secretlyRequest = requset;
})();