// ==UserScript==
// @name         AI tag 绘画管理器 Stable Diffusion 注入版
// @namespace    http://tampermonkey.net/
// @version      0.402
// @description  AI tag 绘画管理器 Stable Diffusion 注入版，不定时更新，希望使用的小伙伴及时提交bug
// @author       izumikineno
// @license      MIT
// @match        http://*/*
// @icon         https://izumkineno.github.io/tag-model-manage/distMonkey/favicon.ico
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/458675/AI%20tag%20%E7%BB%98%E7%94%BB%E7%AE%A1%E7%90%86%E5%99%A8%20Stable%20Diffusion%20%E6%B3%A8%E5%85%A5%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/458675/AI%20tag%20%E7%BB%98%E7%94%BB%E7%AE%A1%E7%90%86%E5%99%A8%20Stable%20Diffusion%20%E6%B3%A8%E5%85%A5%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    const js1 = 'https://izumkineno.github.io/tag-model-manage/distMonkey/js/app.js'
    const js2 = 'https://izumkineno.github.io/tag-model-manage/distMonkey/js/chunk-vendors.js'
    const css1 = 'https://izumkineno.github.io/tag-model-manage/distMonkey/css/app.css'
    const css2 = 'https://izumkineno.github.io/tag-model-manage/distMonkey/css/chunk-vendors.css'
    function jsLoad(url) {
        let script = document.createElement('script');
        script.setAttribute('type', 'text/javascript');
        script.src = url;
        document.documentElement.appendChild(script);
    }
    function cssLoad(url) {
        let script = document.createElement('link');
        script.setAttribute('rel', 'stylesheet');
        script.setAttribute('type', 'text/css');
        script.href = url;
        document.documentElement.appendChild(script);
    }
    window.addEventListener('load', (event) => {
        console.log('注入 loading')
        jsLoad(js1)
        jsLoad(js2)
        cssLoad(css1)
        cssLoad(css2)
    });
    function Request(d) {
        GM_xmlhttpRequest(d)
    }
    document.Request = Request
})();
