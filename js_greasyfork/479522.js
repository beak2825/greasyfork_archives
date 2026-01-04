// ==UserScript==
// @name        Cookie Setter
// @namespace   http://tampermonkey.net/
// @version     0.1
// @description Set cookies for current website
// @author      Jaeger <JaegerCode@gmail.com>
// @match       *://*/*
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/479522/Cookie%20Setter.user.js
// @updateURL https://update.greasyfork.org/scripts/479522/Cookie%20Setter.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Create and attach UI
    var button = document.createElement('button');
    button.innerText = 'Set Cookie';
    button.style.position = 'fixed';
    button.style.right = '20px';
    button.style.bottom = '20px';
    button.style.zIndex = '9999';
    button.style.padding = '10px 20px';
    button.style.borderRadius = '5px';
    button.style.border = 'none';
    button.style.backgroundColor = '#007BFF';
    button.style.color = 'white';
    button.style.cursor = 'pointer';
    button.onclick = showPopup;
    document.body.appendChild(button);

    // auto hidden button
    setTimeout(() => document.body.removeChild(button), 3000);

    function showPopup() {
        var popup = document.createElement('div');
        popup.innerHTML = `
            <div style="position: fixed; z-index:999; top: 0; left: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; align-items: center;">
                <div style="background: white; padding: 20px; width: 400px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                    <h2 style="margin-top: 0; color: #333;">Set Cookie</h2>
                    <textarea id="cookie-input" placeholder="key1=value1;key2=value2;" rows="10" style="width: 100%; border: 1px solid #ccc; border-radius: 5px; padding: 10px; box-sizing: border-box;">${GM_getValue('cookie', '')}</textarea>
                    <div style="margin: 10px 0;">
                        <label style="display: block; margin-bottom: 5px;">
                            <input type="checkbox" id="save-cookie" ${GM_getValue('save', false) ? 'checked' : ''}>
                            Save Cookie
                        </label>
                        <label style="display: block;">
                            <input type="checkbox" id="auto-apply" ${GM_getValue('auto', false) ? 'checked' : ''}>
                            Auto Apply Cookie
                        </label>
                    </div>
                    <button id="close-button" style="padding: 10px 20px; border: none; border-radius: 5px; background: #333333; color: white; cursor: pointer;">Close</button>
                    <button id="apply-button" style="padding: 10px 20px; border: none; border-radius: 5px; background: #007BFF; color: white; cursor: pointer;">Apply</button>
                </div>
            </div>
        `;
        document.body.appendChild(popup);
        document.getElementById('apply-button').onclick = function() {
            var cookie = document.getElementById('cookie-input').value;
            var save = document.getElementById('save-cookie').checked;
            var auto = document.getElementById('auto-apply').checked;
            GM_setValue('cookie', save ? cookie : '');
            GM_setValue('save', save);
            GM_setValue('auto', auto);
            setCookie(cookie);
            document.body.removeChild(popup);
            window.location.reload();
        };

        document.getElementById('close-button').onclick = function() {
            document.body.removeChild(popup);
        };

        document.getElementById('auto-apply').onchange = function() {
            var autoApply = document.getElementById('auto-apply').checked;
            if (autoApply) {
                document.getElementById('save-cookie').checked = true;
            }
        };
        document.getElementById('save-cookie').onchange = function() {
            var autoApply = document.getElementById('save-cookie').checked;
            if (!autoApply) {
                document.getElementById('auto-apply').checked = false;
            }
        };
    }

    // Set cookie
    function setCookie(cookieString) {
        var cookies = cookieString.split(';');
        for (var i = 0; i < cookies.length; i++) {
            var cookie = cookies[i].trim();
            var equalsPos = cookie.indexOf('=');
            var name = cookie.substring(0, equalsPos);
            var value = cookie.substring(equalsPos + 1);
            document.cookie = name + '=' + value + '; domain=.' + location.hostname.split('.').slice(-2).join('.');
        }
    }

    // Auto apply cookie
    if (GM_getValue('save', false) && GM_getValue('auto', false)) {
        setCookie(GM_getValue('cookie', ''));
    }
})();
