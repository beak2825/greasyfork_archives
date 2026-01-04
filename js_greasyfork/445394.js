// ==UserScript==
// @name         Business Insider Paywall-Yeet
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  removes the article paywall from businessinsider.com
// @author       xsesupremebanana
// @match        *://www.businessinsider.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445394/Business%20Insider%20Paywall-Yeet.user.js
// @updateURL https://update.greasyfork.org/scripts/445394/Business%20Insider%20Paywall-Yeet.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log("wait script");
    window.setInterval(function(){
        //if (done == false)
        //{
            try{
                document.querySelector('.tp-modal').remove();
                document.querySelector('.tp-backdrop').remove();

            }catch(e)
            {
            }
       // }

    }, 1000);
})();