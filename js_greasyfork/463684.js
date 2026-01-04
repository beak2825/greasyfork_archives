// ==UserScript==
// @name         tele2 api lots text view
// @namespace    http://tampermonkey.net/
// @version      0.2.3
// @description  tele2 api lots page as text
// @author       
// @match        https://tele2.ru/api/exchange/lots?*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tele2.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/463684/tele2%20api%20lots%20text%20view.user.js
// @updateURL https://update.greasyfork.org/scripts/463684/tele2%20api%20lots%20text%20view.meta.js
// ==/UserScript==

(function() {
    'use strict';

    if (document.querySelector('div[hidden="true"]')) {
        const obj = JSON.parse(document.querySelector('div[hidden="true"]').innerText);
        if (obj.data.length > 0) {
            let newIH = obj.data[0].volume.value + obj.data[0].volume.uom + ' ' + obj.data[0].cost.amount + '\n\n';
            if (obj.data.length > 4) {
                obj.data[4].id = '\n' + obj.data[4].id;
            };
            newIH += '<table>';
            for (let key of obj.data) {
                newIH += '<tr><td align=right>' + key.id + '<td>&nbsp;&nbsp;&nbsp;<td valign=bottom>' + (key.my?'t2bot ':'') + key.seller.name + '   ' + key.seller.emojis + '\n';

            };
            if (window.trustedTypes && window.trustedTypes.createPolicy) {
                window.trustedTypes.createPolicy('default', {
                    createHTML: (string, sink) => string
                });
            }
            document.body.innerHTML = '<pre>' + newIH + '</pre>'
        } else document.body.innerText = 'no lots';
    };
})();
