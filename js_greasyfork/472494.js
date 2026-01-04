// ==UserScript==
// @name         GPT无限积分-Weilev
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  已破解https://ck.tenglangai.com/#
// @author       weilev
// @match        *://*/*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/472494/GPT%E6%97%A0%E9%99%90%E7%A7%AF%E5%88%86-Weilev.user.js
// @updateURL https://update.greasyfork.org/scripts/472494/GPT%E6%97%A0%E9%99%90%E7%A7%AF%E5%88%86-Weilev.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function modifyResponse(response) {
        response = response.replace(/"lastnum":0/g, '"lastnum":9999999999999999');
        response = response.replace(/"canAsk":false/g, '"canAsk":true');
        response = response.replace(/"viptime":0/g, '"viptime":1');
                response = response.replace(/tokens":/g, 'tokens":999999999999');

        response = response.replace(/您好，我是ChatGPT/g, '您好，Weilev已帮您破解永久VIP');
        response = response.replace(/您还不是会员,开通会员畅享无限对话/g, '已破解永久VIP会员');
        return response;
    }


    function blockWebsite() {
        var blockedUrls = [
            'https://ck.tenglangai.com/#/pages/vip',
            'https://ck.tenglangai.com/#/pages/score'
        ];

        var blockedExtensions = [
            '.png'
        ];

        if (blockedUrls.includes(window.location.href) || blockedExtensions.includes(window.location.pathname.split('.').pop())) {
            window.stop();
            document.documentElement.innerHTML = '';
            console.log('Blocked website:', window.location.href);
        }
    }


    function modifyXHR() {
        if (window.XMLHttpRequest.prototype.hasOwnProperty('realSend')) {
            return;
        }

        window.XMLHttpRequest.prototype.realSend = window.XMLHttpRequest.prototype.send;
        window.XMLHttpRequest.prototype.send = function() {
            var xhr = this;
            var onload = xhr.onload;

            xhr.onload = function() {
                if (xhr.readyState === 4 && xhr.status === 200) {
                    var modifiedResponse = modifyResponse(xhr.responseText);
                    Object.defineProperty(xhr, 'response', {writable: true});
                    Object.defineProperty(xhr, 'responseText', {writable: true});
                    xhr.response = xhr.responseText = modifiedResponse;
                }

                if (typeof onload === 'function') {
                    onload.apply(xhr, arguments);
                }
            };

            blockWebsite();

            return xhr.realSend.apply(xhr, arguments);
        };
    }

    modifyXHR();
})();
