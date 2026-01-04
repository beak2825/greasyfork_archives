// ==UserScript==
// @name         MDSADS12ASDADSA
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  Меняет Referer для XHR и логирует изменения в консоль
// @author       Ты
// @match        https://secure.chase.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/539145/MDSADS12ASDADSA.user.js
// @updateURL https://update.greasyfork.org/scripts/539145/MDSADS12ASDADSA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const origOpen = XMLHttpRequest.prototype.open;
    XMLHttpRequest.prototype.open = function(method, url) {
        this._method = method;
        this._url = url;
        return origOpen.apply(this, arguments);
    };

    const origSend = XMLHttpRequest.prototype.send;
    XMLHttpRequest.prototype.send = function(body) {
        const targetRegex = /\/svc\/wr\/oao\/public\/application\/capture\/ccb\/originations\/capture-inquiry\/app-status-api\/v2\/applications\/([^/]+)\/applicants\/([^/]+)\/status/;

        if (this._url && targetRegex.test(this._url)) {
            const [, applicationId, applicantId] = this._url.match(targetRegex);
            const newReferer = `https://secure.chase.com/web/oao/application/retail?cfgCode=010390A&applicationNumber=${applicationId}&applicantIdentifier=${applicantId}`;

            const origSetRequestHeader = this.setRequestHeader;
            this.setRequestHeader = function(header, value) {
                if (header.toLowerCase() === 'referer') {
                    // Skip original referer
                    return;
                }
                return origSetRequestHeader.call(this, header, value);
            };

            // Установка кастомного Referer и логирование
            const sendRef = () => {
                origSetRequestHeader.call(this, 'Referer', newReferer);
                console.log(`✅ [Tampermonkey] Referer изменён для XHR:\n→ Новый Referer: ${newReferer}\n→ Метод: ${this._method}\n→ URL: ${this._url}`);
            };

            // Задержка — чтобы не конфликтовать с setRequestHeader от скриптов сайта
            setTimeout(sendRef, 0);
        }

        return origSend.apply(this, arguments);
    };
})();
