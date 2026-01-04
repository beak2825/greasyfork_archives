// ==UserScript==
// @name         Cloudflare ugly token remove from url
// @namespace    http://tampermonkey.net/
// @version      1
// @description  Removes the tokenized cloudflare query from url
// @author       Root Android And Ethical Hacker
// @match        *://*/*
// @grant        none
// @exclude      /^https?://.*amazon\.*/*
// @exclude      /^https?://.*google\.*/*
// @exclude      /^https?://.*youtube\.*/*
// @downloadURL https://update.greasyfork.org/scripts/431182/Cloudflare%20ugly%20token%20remove%20from%20url.user.js
// @updateURL https://update.greasyfork.org/scripts/431182/Cloudflare%20ugly%20token%20remove%20from%20url.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function detectQueryString(url) {
        var pattern = new RegExp(/[\?&](__cf_chl_jschl_tk__|__cf_chl_captcha_tk__)=[^&]+/);

        return pattern.test(url);
    }

    function start(){
        var detect = detectQueryString(window.location.href);
        if(detect){
            console.log('%c Ugly Cloudflare url removed','color: red; font-size: 20px');
            history.replaceState && history.replaceState(
                null, '', location.pathname + location.search.replace(/[\?&](__cf_chl_jschl_tk__|__cf_chl_captcha_tk__)=[^&]+/, '').replace(/^&/, '?') + location.hash
            );
        }else{
            console.log('Ugly Cloudflare url not found!!');
        }
    }
    start();
})();