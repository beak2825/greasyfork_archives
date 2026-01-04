// ==UserScript==
// @name         图寻vip破解
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  不用抽奖的会员
// @icon         https://s2.loli.net/2024/01/17/4nqsveVoH8A1mTB.png
// @author       特神
// @match        tuxun.fun/*
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/501306/%E5%9B%BE%E5%AF%BBvip%E7%A0%B4%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/501306/%E5%9B%BE%E5%AF%BBvip%E7%A0%B4%E8%A7%A3.meta.js
// ==/UserScript==
(function() {
    'use strict';

    var originalOpen = XMLHttpRequest.prototype.open;
    var originalSend = XMLHttpRequest.prototype.send;
    var customCookies = 'fun_ticket=ssoBqQ5b/oOQhVBx+/F6jL+TcK3MHlDsPCgXYuuWw/aA0DMKuADuWbvIziMbRyts1j6Nzkn2XfKgxmRBB5FkQQ; SESSION=OGZlMzVmODMtNTY0NS00OWE4LWI2MTYtNTczYWExYzJlYWQz; Hm_lvt_e7166bd8d0c253eb08e345c1bc6e0ed7=1721439679,1721491430,1721496674,1721524114; HMACCOUNT=1A30E86255CE213E; Hm_lpvt_e7166bd8d0c253eb08e345c1bc6e0ed7=1721524135';

    XMLHttpRequest.prototype.open = function(method, url, async, user, password) {
        this._method = method;
        this._url = url;
        originalOpen.apply(this, arguments);
    };

    XMLHttpRequest.prototype.send = function(data) {
        if (this._url.includes('/api/v0/tuxun/challenge/create')) {
            GM_xmlhttpRequest({
                method: this._method,
                url: this._url,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                    "Cookie": customCookies,
                    "Referer": "https://someotherwebsite.com",
                    "Origin": "https://yetanotherwebsite.com"
                },
                onload: function(response) {
                    var responseData = JSON.parse(response.responseText);
                    if (responseData.success && responseData.data) {
                        window.location.href = 'https://tuxun.fun/challenge/' + responseData.data;
                    }
                }
            });

            return;
        } else if (this._url.includes('/api/v0/tuxun/again')) {
            GM_xmlhttpRequest({
                method: this._method,
                url: this._url,
                headers: {
                    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36",
                    "Cookie": customCookies,
                    "Referer": "https://someotherwebsite.com",
                    "Origin": "https://yetanotherwebsite.com"
                },
                onload: function(response) {
                    var responseData = JSON.parse(response.responseText);
                    if (responseData.success && responseData.data && responseData.data.challengeId) {
                        window.location.href = 'https://tuxun.fun/challenge/' + responseData.data.challengeId;
                    }
                }
            });

            return;
        }
        originalSend.apply(this, arguments);
    };
})();
