// ==UserScript==
// @name          Sözcü Plus
// @namespace     http://tampermonkey.net/
// @version       1.0
// @description   Sözcü sitesinde plus kullanıcısıymış gibi görünmenizi sağlar ve bağlantıları aynı sekmede açar.
// @author        ranzoric
// @match         https://www.sozcu.com.tr/*
// @grant         none
// @run-at        document-start
// @license       GNU GPLv3
// @downloadURL https://update.greasyfork.org/scripts/536868/S%C3%B6zc%C3%BC%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/536868/S%C3%B6zc%C3%BC%20Plus.meta.js
// ==/UserScript==

(function () {
    'use strict';

    // Plus çerezlerini ayarla
    const cookiesToSet = {
        "loggedin": "1",
        "loggedIn": "1",
        "_sgf_facebook_name": "Sözcü Plus Etkin",
        "_sgf_user_pids": "UmVrbGFtc8SxeiwgaXpsZXlpY2lzaXogw7ZzZ8O8ciBpbnRlcm5ldCE="
    };

    let allCookiesExist = true;
    Object.entries(cookiesToSet).forEach(([name, value]) => {
        if (!document.cookie.includes(`${name}=`)) {
            allCookiesExist = false;
        }
    });
    if (!allCookiesExist) {
        Object.entries(cookiesToSet).forEach(([name, value]) => {
            document.cookie = `${name}=${value}; path=/;`;
        });
    }

    // Bağlantıları aynı sekmede aç
    document.addEventListener('click', e => {
        const link = e.target.closest('a[target="_blank"]');
        if (link) {
            e.preventDefault();
            window.location.href = link.href;
        }
    });

})();