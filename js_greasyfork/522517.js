// ==UserScript==
// @name         console.log
// @namespace    https://jixiejidiguan.top/
// @version      1.0
// @description  查看console控制台信息，查看网页源码，js调试等。
// @author       jixiejidiguan.top
// @match        http://*/*
// @match        https://*/*
// @grant      GM_registerMenuCommand
// @license        AGPL License
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/522517/consolelog.user.js
// @updateURL https://update.greasyfork.org/scripts/522517/consolelog.meta.js
// ==/UserScript==

(function () {
    'use strict';
    const JSURL = 'https://s4.zstatic.net/ajax/libs/eruda/3.2.1/eruda.min.js'
    function loadScript(url, callback) {
        if(document.querySelector("#eruda")){
            callback();
            return
        }
        const script = document.createElement('script');
        script.setAttribute("id","eruda")
        script.type = 'text/javascript';
        script.onload = function() {
            callback();
        };
        script.src = url;
        document.head.appendChild(script);
    }
    loadScript(JSURL, () =>{
        eruda.init({
            useShadowDom:true,
            autoScale:true,
            defaults:{
                displaySize: 40,
                transparency: 0.9
            }
        });
    });
})();