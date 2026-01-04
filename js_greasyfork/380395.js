// ==UserScript==
// @name         2FA EZ for AWS
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  save time with logins
// @author       Lazy
// @match        https://*.signin.aws.amazon.com/*
// @grant        none
// @require      https://cdnjs.cloudflare.com/ajax/libs/jsSHA/1.6.2/sha.js
// @downloadURL https://update.greasyfork.org/scripts/380395/2FA%20EZ%20for%20AWS.user.js
// @updateURL https://update.greasyfork.org/scripts/380395/2FA%20EZ%20for%20AWS.meta.js
// ==/UserScript==

(function() {
    'use strict';
    
    // modify this line to include your own 2FA security keys and your own region
    const keys = {'us-east-1.signin.aws.amazon.com':'ABCXYZ'}


    const sites = {'signin.aws.amazon.com':['#mfacode', '#submitMfa_button', '#signin_button', '#password']}

    const dec2hex = function(s) {
        return (s < 15.5 ? "0" : "") + Math.round(s).toString(16);
    };

    const hex2dec = function(s) {
        return parseInt(s, 16);
    };

    const leftpad = function(s, l, p) {
        if(l + 1 >= s.length) {
            s = Array(l + 1 - s.length).join(p) + s;
        }
        return s;
    };

    const base32tohex = function(base32) {
        const base32chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
        let bits = "";
        let hex = "";
        for(let i = 0; i < base32.length; i++) {
            const val = base32chars.indexOf(base32.charAt(i).toUpperCase());
            bits += leftpad(val.toString(2), 5, '0');
        }
        for(let i = 0; i + 4 <= bits.length; i+=4) {
            const chunk = bits.substr(i, 4);
            hex = hex + parseInt(chunk, 2).toString(16) ;
        }
        return hex;
    };

    const getOTP = function(secret) {
        let otp;
        try {
            const epoch = Math.round(new Date().getTime() / 1000.0);
            const time = leftpad(dec2hex(Math.floor(epoch / 30)), 16, "0");
            const hmacObj = new jsSHA(time, "HEX");
            const hmac = hmacObj.getHMAC(base32tohex(secret), "HEX", "SHA-1", "HEX");
            const offset = hex2dec(hmac.substring(hmac.length - 1));
            otp = (hex2dec(hmac.substr(offset * 2, 8)) & hex2dec("7fffffff")) + "";
            otp = (otp).substr(otp.length - 6, 6);
        } catch (error) {
            throw error;
        }
        return otp;
    };

    if (location.host in keys) {
        for (let site of Object.keys(sites)) {
            if (location.host.indexOf(site)) {

                    window.addEventListener('load', () => {
                        const otp = getOTP(keys[location.host]);
                        const inputTxt = document.querySelector(sites[site][0]);
                        if (inputTxt) inputTxt.value = getOTP(keys[location.host]);
                        let submitBtn;
                        if (sites[site][2] && (submitBtn = document.querySelector(sites[site][2]))) {
                            setTimeout(() => {
                                // if password prefilled then submit immediately
                                let password;
                                if (sites[site][3] && (password = document.querySelector(sites[site][3])) && password.value.length > 5) submitBtn.click();
                            }, 250);
                        }
                        else console.log(`${sites[site][0]} not found`)
                    }, false);

                      window.addEventListener('popstate', () => {
                        setTimeout(() => {
                        let inputTxt;
                        if ((inputTxt = document.querySelector(sites[site][0]))) {
                            inputTxt.setAttribute('type', 'password');
                            inputTxt.value = getOTP(keys[location.host]);
                            angular.element(inputTxt).controller().mfa_form.$invalid = false;
                            angular.element(inputTxt).controller().otp1 = inputTxt.value;
                            let submitMfa;
                            if (sites[site][1] && (submitMfa = document.querySelector(sites[site][1]))) submitMfa.click();

                        }
                        else console.log(`${sites[site][0]} not found`);
                        }, 500);
                    }, false);

                break;
            }
        }
    }
})();