// ==UserScript==
// @name               Cloudflare Plus
// @namespace          https://greasyfork.org/users/592063
// @version            0.2.2
// @author             wuniversales
// @description        Remove or fix ugly Cloudflare generated parameters from the url.
// @icon               https://icons.duckduckgo.com/ip2/cloudflare.com.ico
// @include            /__cf_chl_(jschl|captcha|managed|rt)_tk__=/
// @run-at             document-end
// @grant              none
// @license MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/433639/Cloudflare%20Plus.user.js
// @updateURL https://update.greasyfork.org/scripts/433639/Cloudflare%20Plus.meta.js
// ==/UserScript==

(function() {
    'use strict';
    async function fix_cloudflare() {
        let detected=document.querySelectorAll("div[class^='cf-']").length+document.querySelectorAll("div[id^='cf-']").length;
        if(detected==0){
            const oldUrl = window.location.href;
            const url = new URL(oldUrl);
            const params = url.searchParams;
            const key=['jschl','captcha','managed','rt'];
            for (let i = 0; i < key.length; i++) {
                params.delete('__cf_chl_'+key[i]+'_tk__');
            }
            const newUrl = url.toString();
            if(newUrl!==oldUrl){
                window.location.replace(newUrl);
            }
        }
    }
    window.addEventListener("load", function(){fix_cloudflare();});
})();