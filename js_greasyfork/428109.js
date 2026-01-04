// ==UserScript==
// @name         FreeBNB.cc (Pescador de Cripto)
// @namespace    https://pescadordecripto.com/
// @version      0.1
// @description  Auto claim
// @author       Jadson Tavares
// @match        https://freebnb.cc/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/428109/FreeBNBcc%20%28Pescador%20de%20Cripto%29.user.js
// @updateURL https://update.greasyfork.org/scripts/428109/FreeBNBcc%20%28Pescador%20de%20Cripto%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    setInterval(function(){
        if(!$('body > div.login-box > div.showcase > div.showcase__inner.slick-initialized.slick-slider > div > div > div > div > div > div.-c-claim-box > div').hasClass('claim-start')){
            document.querySelector("body > div > div.showcase > div.showcase__inner.slick-initialized.slick-slider > div > div > div > div > div > div.-c-claim-box > a").click();
        }
    },2000);
})();