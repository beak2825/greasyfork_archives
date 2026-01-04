// ==UserScript==
// @name         Gartic.io Oda Linklerini Gönder
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Gartic.io'daki oda linklerini toplayıp başka bir siteye gönderir.
// @author       Siz
// @match        https://gartic.io/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524765/Garticio%20Oda%20Linklerini%20G%C3%B6nder.user.js
// @updateURL https://update.greasyfork.org/scripts/524765/Garticio%20Oda%20Linklerini%20G%C3%B6nder.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Oda linklerini toplama
    const rooms = document.querySelectorAll('.room-item a');
    const links = [];

    rooms.forEach(room => {
        let url = room.href;
        if (!url.endsWith('/viewer')) {
            url += '/viewer';
        }
        links.push(url);
    });

    // Linkleri başka bir siteye gönderme
    const targetSite = "https://sizin-siteniz.com/odalar"; // Bağlantıları göndereceğiniz site
    if (links.length > 0) {
        fetch(targetSite, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ links: links }),
        }).then(response => {
            if (response.ok) {
                console.log("Bağlantılar başarıyla gönderildi.");
                window.location.href = targetSite; // Başka siteye yönlendir
            } else {
                console.error("Bağlantılar gönderilemedi.");
            }
        }).catch(error => console.error("Bir hata oluştu:", error));
    } else {
        console.log("Hiç oda bulunamadı.");
    }
})();