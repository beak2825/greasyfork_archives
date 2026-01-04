// ==UserScript==
// @name         EX账号登录
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  账号登录
// @match        https://exhentai.org/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/516917/EX%E8%B4%A6%E5%8F%B7%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/516917/EX%E8%B4%A6%E5%8F%B7%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

(function() {
    const button = document.createElement('button');
    button.style = 'position:fixed; left:10px; bottom:10px; width:15px; height:15px; background:transparent; border:none; cursor:pointer; opacity:0.5;';
    button.innerHTML = '+';
    document.body.appendChild(button);

    button.onclick = () => {
        // Expiration date set for one year from now
        const expires = new Date();
        expires.setFullYear(expires.getFullYear() + 1);
        const expiresString = expires.toUTCString();

        // Clear existing cookies
        document.cookie.split(';').forEach(c =>
            document.cookie = c.split('=')[0] + '=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/'
        );

        // Set new cookies with expiration date
        document.cookie = `igneous=kgnlu41islpmx61dv; path=/; expires=${expiresString}`;
        document.cookie = `ipb_member_id=8042140; path=/; expires=${expiresString}`;
        document.cookie = `ipb_pass_hash=dfbeed6d18d89f4ac706c125651f4b2c; path=/; expires=${expiresString}`;

        // Reload the page to apply changes
        location.reload();
    };
})();
