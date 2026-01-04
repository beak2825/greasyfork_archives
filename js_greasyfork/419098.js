// ==UserScript==
// @name         vConsole
// @name:cn      vConsole
// @namespace    http://tampermonkey.net/
// @version      0.1.2
// @description  【使用前先看介绍/有问题可反馈】手机浏览器控制台 (vConsole)：在移动端手机浏览器中插入 vConsole 从而调用控制台，使用 via 浏览器进入该页面可添加脚本
// @author       cc
// @include      *
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/419098/vConsole.user.js
// @updateURL https://update.greasyfork.org/scripts/419098/vConsole.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let script = document.createElement('script');
    script.type = 'text/javascript';
    script.src = 'https://cdn.bootcss.com/vConsole/3.3.0/vconsole.min.js';
    document.body.appendChild(script);
    script = document.createElement('script');
    script.type = 'text/javascript';
    script.innerHTML =
    `
        (function wait() {
            try {
                var vc = new VConsole();
                console.log('vConsole has been created.');
            } catch {
                setTimeout(wait, 50);
            };
        })();
    `;
    document.body.appendChild(script);
})();