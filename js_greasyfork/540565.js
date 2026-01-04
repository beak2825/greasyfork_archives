// ==UserScript==
// @name         开启vue dev
// @namespace    http://tampermonkey.net/
// @version      2025-06-17
// @description  open the vue devtools
// @author       mrwhat
// @license MI
// @match        https://github.com/EHfive/userscripts
// @icon         https://www.google.com/s2/favicons?sz=64&domain=github.com
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/540565/%E5%BC%80%E5%90%AFvue%20dev.user.js
// @updateURL https://update.greasyfork.org/scripts/540565/%E5%BC%80%E5%90%AFvue%20dev.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (document && document.documentElement && document.documentElement.appendChild) {
        const script = document.createElement('script');
        script.textContent = `
            try {
                let _init_ = () => {
                    console.log('启动注入')
                    const doc = Array.from(document.querySelectorAll('*')).find((e) => e.__vue_app__) || document.querySelector("#app")
                    if (!doc) return;
                    const app = doc.__vue_app__;
                    const version = app.version;
                    console.log('发现vue.js', version);

                    const devtools = window.__VUE_DEVTOOLS_GLOBAL_HOOK__
                    devtools.enabled = true

                    devtools.emit('app:init', app, version, {})
                }

                const button = document.createElement('button')
                button.id = '_hacking_'
                button.innerHTML = '注入dev'
                button.addEventListener('click', _init_)
                button.style.position = 'fixed'
                button.style.top = '0'
                button.style.right = '0'
                button.style.zIndex = '1000'
                button.style.cursor = 'pointer'
                document.body.appendChild(button)
            } catch (e) {
            }
        `
        document.documentElement.appendChild(script);
        script.remove();
    }
})();