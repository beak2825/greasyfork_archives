// ==UserScript==
// @name         Redirector
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Bunkrrr.org, Bunkrr.ru, Bunkr.pk, Recurbate.me, Sxyprn.net, Twitch URL'lerini, cyberfile.su URL'lerini ve noodlemagazine.com/watch/ URL'lerini yüklenmeden önce yönlendirir.
// @author       You
// @match        *://bunkrrr.org/*
// @match        *://bunkrr.ru/*
// @match        *://bunkr.pk/*
// @match        *://recurbate.me/*
// @match        *://sxyprn.net/*
// @match        *://www.twitch.tv/popout/*
// @match        *://cyberfile.su/*
// @match        *://noodlemagazine.com/watch/*
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520944/Redirector.user.js
// @updateURL https://update.greasyfork.org/scripts/520944/Redirector.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Mevcut URL'yi al
    var currentUrl = window.location.href;
    // newUrl değişkenini sadece bir kez tanımlıyoruz
    let newUrl;

    // Eğer URL 'twitch.tv/popout' içeriyorsa, '/popout' ve 'chat' kısmını kaldır
    if (currentUrl.includes('https://www.twitch.tv/popout')) {
        // /popout ve chat kısmını kaldır
        newUrl = currentUrl.replace('/popout', '').replace('/chat', '');
        window.location.replace(newUrl);
    }
    // Eğer URL 'recurbate.me' içeriyorsa, 'recu.me' ile değiştir
    else if (currentUrl.includes('recurbate.me')) {
        newUrl = currentUrl.replace('recurbate.me', 'recu.me');
        window.location.replace(newUrl);
    }
    // Eğer URL 'cyberfile.su' içeriyorsa, 'cyberfile.me' ile değiştir
    else if (currentUrl.includes('cyberfile.su')) {
        newUrl = currentUrl.replace('cyberfile.su', 'cyberfile.me');
        window.location.replace(newUrl);
    }
    // Eğer URL 'sxyprn.net' içeriyorsa, 'sxyprn.com' ile değiştir ve sonuna .html ekle
    else if (currentUrl.includes('sxyprn.net')) {
        newUrl = currentUrl.replace('sxyprn.net', 'sxyprn.com') + '.html';
        window.location.replace(newUrl);
    }
    // Eğer URL 'bunkrrr.org' içeriyorsa, 'bunkr.fi' ile değiştir
    else if (currentUrl.includes('bunkrrr.org')) {
        newUrl = currentUrl.replace('bunkrrr.org', 'bunkr.fi');
        window.location.replace(newUrl);
    }
    // Eğer URL 'bunkrr.ru' içeriyorsa, 'bunkr.fi' ile değiştir
    else if (currentUrl.includes('bunkrr.ru')) {
        newUrl = currentUrl.replace('bunkrr.ru', 'bunkr.fi');
        window.location.replace(newUrl);
    }
    // Eğer URL 'bunkr.pk' içeriyorsa, 'bunkr.fi' ile değiştir
    else if (currentUrl.includes('bunkr.pk')) {
        newUrl = currentUrl.replace('bunkr.pk', 'bunkr.fi');
        window.location.replace(newUrl);
    }
    /*
    // BAŞTAKİ DEVREDİŞI YAPAR
    // Eğer URL 'noodlemagazine.com/watch/' içeriyorsa, 'vk.com/video' ile değiştir
    else if (currentUrl.includes('noodlemagazine.com/watch/')) {
        newUrl = currentUrl.replace('noodlemagazine.com/watch/', 'vk.com/video');
        window.location.replace(newUrl);
    }
    // SONDAKİ DEVREDİŞI YAPAR
    */
})();
