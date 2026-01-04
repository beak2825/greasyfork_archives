// ==UserScript==
// @name         解析iid
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  方便一点是一点
// @author       ljy
// @match        http://zjysrv.kibana.pt.xiaomi.com/app/kibana
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/421172/%E8%A7%A3%E6%9E%90iid.user.js
// @updateURL https://update.greasyfork.org/scripts/421172/%E8%A7%A3%E6%9E%90iid.meta.js
// ==/UserScript==

(function () {
    'use strict';

    const body = document.querySelector('body');

    body.addEventListener('dblclick', (evt) => {
        if (evt.target.nodeName === 'SPAN' && evt.target.nodeType === 1) {

            if (Number(evt.target.getAttribute('de'))) {
                evt.target.innerText = evt.target.getAttribute('origin');
                evt.target.setAttribute('de', 0);
            } else {
                const text = evt.target.innerText;
                const deText = decodeURIComponent(decodeURIComponent(decodeURIComponent(text)));
                evt.target.setAttribute('origin', text);
                evt.target.setAttribute('de', 1);
                evt.target.innerText = deText;
            }
        }
    });
})();
