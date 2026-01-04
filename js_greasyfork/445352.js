// ==UserScript==
// @name         Press Telegram Paywall-Yeet
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  removes the article paywall from presstelegram.com
// @author       xsesupremebanana
// @match        *://www.presstelegram.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/445352/Press%20Telegram%20Paywall-Yeet.user.js
// @updateURL https://update.greasyfork.org/scripts/445352/Press%20Telegram%20Paywall-Yeet.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var t = document.createElement('div');
    t.innerHTML = document.querySelectorAll('.article-body')[0].innerHTML;
    console.log("wait script");
    var done = false;
    window.setInterval(function(){
        //if (done == false)
        //{
            try{
                document.querySelectorAll('.fade').forEach(e => e.remove());
                document.querySelector('.article-body').remove();
                document.querySelector('.article-content-wrapper').appendChild(t);
                document.querySelector("body").style.overflow = 'auto';
                document.querySelector('.modal-scrollable').style.position='initial';
                console.log("done script");
                done = true;

            }catch(e)
            {
                console.log(e);
            }
       // }

    }, 1000);
})();