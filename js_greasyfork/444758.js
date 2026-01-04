// ==UserScript==
// @name         jhvb
// @namespace    ipjhhvbihg
// @version      0.1
// @description  orgjinjkhb
// @author       ritpujvn
// @match        http://captchafaucet.unaux.com/page/dashboard
// @match        http://captchafaucet.unaux.com/page/dashboard/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=faupig-bit.online
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/444758/jhvb.user.js
// @updateURL https://update.greasyfork.org/scripts/444758/jhvb.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var clicked = false;
    var url = window.location.href;

    function makeRequest() {
        fetch(url)
            .then(response => {
                if (response.status != 200) {
                    location.reload();
                } else {
                    setInterval(function() {
                        if (!clicked && document.querySelector(".h-captcha > iframe") && document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length > 0) {
                            document.querySelector("#holder > div > div.col-xs-12.col-sm-8 > form > input").click();
                            clicked = true;
                        } else {
                            document.querySelector("#holder > div > div.col-xs-12.col-sm-8 > form > input").click();
                            clicked = true;
                        }
                    }, 120000);
                }
            })
            .catch(err => {
                console.log(err);
            });
    }
    makeRequest();
})();
