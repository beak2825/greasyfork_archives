// ==UserScript==
// @name         remove_bejson_ad
// @namespace    http://tampermonkey.net/
// @version      20250001
// @description  移除页面的广告，减少打扰
// @author       hejiangyuan
// @match        https://www.bejson.com/jsonviewernew/*
// @match        https://*.sojson.com/editor.html
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/499710/remove_bejson_ad.user.js
// @updateURL https://update.greasyfork.org/scripts/499710/remove_bejson_ad.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

    const t = function() {

        const iframes = document.getElementsByTagName('iframe');
        console.info(iframes);

        const inss = document.getElementsByTagName('ins');
        console.info(inss);

        for (const child of iframes) {
            try {
                child.parentNode.removeChild(child);
            } catch(e) {
                console.error(e, child);
            }
        }

        for (const child of inss) {
            try {
                child.parentNode.removeChild(child);
            } catch(e) {
                console.error(e, child);
            }
        }

        let ele = document.getElementById("google-anno-sa");
        if (ele) {
            ele.parentNode.removeChild(ele);
        }

    }

    const timer = setInterval(t, 2000);

    const stop = function(){
        if (timer) {
            clearInterval(timer);
        }
    }

    setTimeout(stop, 20000);

})();