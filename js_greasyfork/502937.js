// ==UserScript==
// @name         Fluxus Android KeySystem Bypass
// @namespace    http://tampermonkey.net/
// @description Bypass Fluxus within seconds!
// @version      1.2
// @author       Shehajeez (GoatBypassers)
// @match        https://flux.li/android/external/start.php?HWID=*
// @grant        GM_xmlhttpRequest
// @connect      ethos.kys.gay
// @downloadURL https://update.greasyfork.org/scripts/502937/Fluxus%20Android%20KeySystem%20Bypass.user.js
// @updateURL https://update.greasyfork.org/scripts/502937/Fluxus%20Android%20KeySystem%20Bypass.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.stop();
    const url = window.location.href;

    GM_xmlhttpRequest({
        method: "GET",
        url: `https://ethos.kys.gay/api/free/bypass?url=${encodeURIComponent(url)}`,
        onload: function(res) {
            const key = JSON.parse(res.responseText).result;
            const div = document.createElement('div');
            div.className = 'gui';
            div.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:#333;color:#fff;padding:20px;box-shadow:0 0 10px rgba(0,0,0,0.5);z-index:9999;animation:fadeIn 0.5s;display:flex;flex-direction:column;justify-content:center;align-items:center;text-align:center;';
            div.innerHTML = `
                <h2>Bypassed by Ethos</h2>
                <p>Your key is below:</p>
                <p><strong>${key}</strong></p>
                <button id="copyKey" style="margin-top: 20px;padding: 10px 20px;background:#555;color:#fff;border:none;border-radius:5px;cursor:pointer;">Copy Key</button>
            `;
            document.body.appendChild(div);

            const style = document.createElement('style');
            style.innerHTML = `
                @keyframes fadeIn {
                    from { opacity: 0; }
                    to { opacity: 1; }
                }
                .gui {
                    font-size: 20px;
                    line-height: 1.5;
                }
                .gui h2 {
                    font-size: 28px;
                    margin-top: 0;
                }
                .gui p {
                    margin-bottom: 10px;
                }
                .gui strong {
                    font-weight: bold;
                }
                #copyKey:hover {
                    background: #777;
                }
            `;
            document.head.appendChild(style);

            document.getElementById('copyKey').onclick = function() {
                navigator.clipboard.writeText(key).then(() => {
                    alert('Key copied to clipboard!');
                }).catch(err => {
                    console.error('Could not copy text: ', err);
                });
            };
        }
    });
})();