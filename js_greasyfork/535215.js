// ==UserScript==
// @name         Cookie Setter for xdgame.com
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Set cookies on xdgame.com if they do not exist or are expired
// @author       Your Name
// @match        *://*.xdgame.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/535215/Cookie%20Setter%20for%20xdgamecom.user.js
// @updateURL https://update.greasyfork.org/scripts/535215/Cookie%20Setter%20for%20xdgamecom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // List of cookies to set
    const cookies = [
        {
            "domain": "www.xdgame.com",
            "hostOnly": true,
            "httpOnly": false,
            "name": "night",
            "path": "/",
            "sameSite": null,
            "secure": false,
            "session": true,
            "storeId": null,
            "value": "0"
        },
        {
            "domain": "www.xdgame.com",
            "expirationDate": 7662525964.345429,
            "hostOnly": true,
            "httpOnly": false,
            "name": "DedeLoginTime",
            "path": "/",
            "sameSite": null,
            "secure": false,
            "session": false,
            "storeId": null,
            "value": "1661921164"
        },
        {
            "domain": "www.xdgame.com",
            "expirationDate": 7662525964.345438,
            "hostOnly": true,
            "httpOnly": false,
            "name": "DedeLoginTime__ckMd5",
            "path": "/",
            "sameSite": null,
            "secure": false,
            "session": false,
            "storeId": null,
            "value": "431ed4d07a2a99c4"
        },
        {
            "domain": "www.xdgame.com",
            "expirationDate": 7662525964.345407,
            "hostOnly": true,
            "httpOnly": false,
            "name": "DedeUserID",
            "path": "/",
            "sameSite": null,
            "secure": false,
            "session": false,
            "storeId": null,
            "value": "63268"
        },
        {
            "domain": "www.xdgame.com",
            "expirationDate": 7662525964.345419,
            "hostOnly": true,
            "httpOnly": false,
            "name": "DedeUserID__ckMd5",
            "path": "/",
            "sameSite": null,
            "secure": false,
            "session": false,
            "storeId": null,
            "value": "69ae6de5c4a349ce"
        }
    ];

    // Function to get a cookie by name
    function getCookie(name) {
        const nameEQ = name + "=";
        const ca = document.cookie.split(';');
        for (let i = 0; i < ca.length; i++) {
            let c = ca[i];
            while (c.charAt(0) === ' ') c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
        }
        return null;
    }

    // Function to set a cookie
    function setCookie(name, value, expires, path, domain, secure) {
        let cookieString = `${name}=${value}; path=${path}; domain=${domain}`;
        if (expires) {
            const date = new Date(expires * 1000); // Convert to milliseconds
            cookieString += `; expires=${date.toUTCString()}`;
        }
        if (secure) {
            cookieString += "; secure";
        }
        document.cookie = cookieString;
    }

    // Check and set cookies
    cookies.forEach(cookie => {
        const currentCookie = getCookie(cookie.name);
        if (!currentCookie || (cookie.expirationDate && new Date().getTime() / 1000 > cookie.expirationDate)) {
            setCookie(
                cookie.name,
                cookie.value,
                cookie.expirationDate,
                cookie.path,
                cookie.domain,
                cookie.secure
            );
        }
    });

})();