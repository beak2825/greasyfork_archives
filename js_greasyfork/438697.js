// ==UserScript==
// @name         Faucetpay Cors Proxy
// @icon         https://icons.duckduckgo.com/ip2/faucetpay.io.ico
// @version      0.2.1
// @namespace    https://greasyfork.org/users/592063
// @description  Enable cors proxy.
// @author       wuniversales
// @include      http*://faucetpay.io/*
// @run-at       document-end
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/438697/Faucetpay%20Cors%20Proxy.user.js
// @updateURL https://update.greasyfork.org/scripts/438697/Faucetpay%20Cors%20Proxy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    async function add_cors_proxy(url) {
        let head = document.querySelector('head');
        let script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/xdomain@0.8.2/dist/xdomain.min.js';
        script.setAttribute('master', url);
        head.appendChild(script);
    }
    if(window.location.pathname.indexOf("/proxy")>=0){
        add_cors_proxy('https://jmcrypto.eu.org');
        try{
            let title=document.title;
            title=title.replace("Page Not Found", "Cors Proxy");
            document.title=title;
        }catch(e){
            console.log('Cors Proxy title error.');
        }
        try{
            document.body.querySelector('h4').innerText='Cors Proxy enabled';
            document.body.querySelector('p').innerText='';
        }catch(e){
            console.log('Cors Proxy innerText error.');
        }
    }
})();