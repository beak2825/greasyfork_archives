// ==UserScript==
// @name         RequestHook
// @namespace    https://greasyfork.org/zh-CN/scripts/414756
// @version      0.3
// @description  Copy Request Information For fetch and XMLHttpRequest
// @author       AutumnSun
// @match        *://*.youtube.com/*
// @grant        GM_setClipboard
// @grant        GM_cookie
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/414756/RequestHook.user.js
// @updateURL https://update.greasyfork.org/scripts/414756/RequestHook.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Config Here
    function urlChecker(url){
        return /(heartbeat|send_message)$/.test(url.pathname);
    }
    function handleResponse(method, url, data, args){
        if(urlChecker(url)){
            console.log("Current Status:", data.playabilityStatus.status);
            return;
        }
    }

    function copyCookie(extra={}){
        GM_cookie('list', { url: location.href }, (cookies) => {
            const text = JSON.stringify({extra: extra, cookies: cookies});
            console.log(text);
            GM_setClipboard(text);
        });
    }

    const originRequest = unsafeWindow.fetch;
    unsafeWindow.fetch = (...args) => {
        const url = new URL(args[0].url, location.href);
        if(urlChecker(url)){
           let req = args[0].clone();
           req.json().then((data)=>{
                console.log('Request Captured:', req.method, req.url);
                let headers = {};
                for(let pair of req.headers){
                    headers[pair[0]] = pair[1];
                }
                console.log('Headers', headers);
                console.log('Body');
                console.log(data);
                copyCookie({
                    method: req.method,
                    url: req.url,
                    headers: headers,
                    data: data,
                })
            });
        }
        let resp = originRequest(...args);
        return resp;
    }
    console.log("fetch Injected");
    (function() {
        var origOpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function() {
            let args = arguments;
            const method = arguments[0];
            const url = new URL(arguments[1], location.href);
            if(urlChecker(url)){
                console.log('request started!', arguments);
                this.addEventListener('load', function() {
                    console.log('request completed!', this.readyState); //will always be 4 (ajax is completed successfully)
                    if(this.responseType === 'text' || this.responseType === ''){
                        let data = JSON.parse(this.responseText);
                        handleResponse(method, url, data, args);
                    }
                });
            }
            origOpen.apply(this, arguments);
        };
        console.log("XMLHttpRequest Injected");
    })();
})();