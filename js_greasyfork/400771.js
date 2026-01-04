// ==UserScript==
// @name        wekan.tv - remove WeChat QR code
// @namespace   Violentmonkey Scripts
// @description Remove WeChat QR code in wekan.tv
// @match       *://www.wekan.tv/*
// @match       *://www.kantv6.com/*
// @version     0.1.1
// @author      Bin
// @downloadURL https://update.greasyfork.org/scripts/400771/wekantv%20-%20remove%20WeChat%20QR%20code.user.js
// @updateURL https://update.greasyfork.org/scripts/400771/wekantv%20-%20remove%20WeChat%20QR%20code.meta.js
// ==/UserScript==

/* jshint esversion: 6 */

function openBypass(original_function) {

    return function(method, url) {

        this.addEventListener("readystatechange", (response) => {
            if (this.readyState !== 4 || method !== 'GET' || !/wxSubscribe/.test(url)) {
                return;
            }

            try{
                Object.defineProperty(this, 'responseText', { writable: true });
                const res = JSON.parse(response.target.response);
                res.data.code = 0;
                this.responseText = JSON.stringify(res);
            } catch(e) {}
        });

        return original_function.apply(this, arguments);
    };

}

XMLHttpRequest.prototype.open = openBypass(XMLHttpRequest.prototype.open);
