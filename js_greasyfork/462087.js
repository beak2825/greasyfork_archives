// ==UserScript==
// @name         Cryptoflare
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Free satoshi
// @author       vikiweb
// @match        https://cryptoflare.net/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/462087/Cryptoflare.user.js
// @updateURL https://update.greasyfork.org/scripts/462087/Cryptoflare.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Enter your email address on line 18 and Go to https://cryptoflare.net/?r=9949

    let email = "email@email.com";
    let password = "password";
    let check_address = window.location.origin;

    if(window.location.href.includes(check_address) && document.querySelector("#hero .hero-title")){
        window.location.replace(check_address +'/login');
    }

    if (window.location.href.includes(check_address +'/login')) {
        setTimeout(function() {
            if (document.querySelector("#email")) {
                document.querySelector("#email").value = email;
            }
            if (document.querySelector("#password")) {
                document.querySelector("#password").value = password;
            }
            if (document.querySelector("button[type='submit']")) {
                document.querySelector("button[type='submit']").click();
            }
        }, 10000);
    }

    if (window.location.href.includes(check_address +'/dashboard')) {
        window.location.replace(check_address +'/claim');
    }

    if(window.location.href.includes(check_address +'/claim')){
        setInterval(function(){
            document.querySelectorAll("#gpcaptcha .svg-padding .svg").forEach(function(img) {
                if (img.classList.contains('captcha-selected')) {
                    console.log("Image is selected!");
                    document.querySelector("#fauform button[type='submit']").click();
                } else {
                    console.log("Image is not selected!");
                }
            });


            let string = document.querySelector("body > section:nth-child(5) > div > div > div:nth-child(3) > div > div:nth-child(2) > h2");
            if(string){
                let parts = string.innerText.split("/");
                if (parts[0] === "0") {
                    console.log("The first value is 0.");
                    alert('Come back tomorrow to claim again')
                } else {
                    console.log("The first value is not 0.");
                }
            }

        }, 10000)
    }


})();