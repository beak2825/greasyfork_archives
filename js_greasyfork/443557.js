// ==UserScript==
// @name         ReaderTextOtp
// @namespace    http://tampermonkey.net/
// @version      4.1
// @description  ReadeAnewOTPtextArrivesForBlsFromGmail
// @author       MeGa
// @match        https://mail.google.com/mail/*
// @match        https://algeria.blsspainvisa.com/*
// @match        file:///C:/Users/a/Downloads/bls/*
// @include      https://algeria.blsspainvisa.com/*
// @include      https://mail.google.com/mail/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant        God
// @downloadURL https://update.greasyfork.org/scripts/443557/ReaderTextOtp.user.js
// @updateURL https://update.greasyfork.org/scripts/443557/ReaderTextOtp.meta.js
// ==/UserScript==
var InboxEmail = "https://mail.google.com/";
var loc = window.location.href;
var GmailBox = loc.indexOf(InboxEmail);
var date = new Date();
var ActualTime = date.getTime();

if (GmailBox !== -1) {
    if (localStorage.OTP1 == undefined) {
        var ReaderTextOtp = function() {
            var innerHTML = document.body.innerHTML;
            var targetFix = "Please verify your email by below OTP. OTP -";
            var target = innerHTML.indexOf(targetFix);
            var begin = target + 45;
            var end = target + 50;

            var cibleImage = innerHTML.substring(begin, end);

            if (isNaN(cibleImage) == true) {
                var OtpText = innerHTML.substring(begin, end - 1);
                console.log('Otp founded, Value is ' + OtpText);
                localStorage.setItem('OTP1', OtpText);
                GM_setValue('OTP1', localStorage.OTP1);
                var OTP1RegistredAt = date.getTime();
                localStorage.setItem('OTP1At', OTP1RegistredAt);
                setTimeout(function() {
                    window.location.reload()
                }, 9000)
            } else {
                var OtpText1 = cibleImage;
                console.log('Otp founded, Value is ' + OtpText1);
                localStorage.setItem('OTP1', OtpText1);
                GM_setValue('OTP1', localStorage.OTP1);
                var OTP1RegistredAt0 = date.getTime();
                localStorage.setItem('OTP1At', OTP1RegistredAt0);
                setTimeout(function() {
                    window.location.reload()
                }, 9000)
            }



        };
        ReaderTextOtp();

        /*Check Value Otp*/
        if (isNaN(localStorage.OTP1) == true) {
            console.log('OTP1 is not a number, Deleting....');
            localStorage.removeItem('OTP1');
            GM_deleteValue('OTP1');
        }
    } else {
        if (ActualTime - localStorage.OTP1At > 1800000) {
            console.log('OTP1 a éxpiré \n Deleting...');
            localStorage.removeItem('OTP1At');
            localStorage.removeItem('OTP1');
        } else {
            console.log('OTP1 is saved since ' + Math.floor(((ActualTime - localStorage.OTP1At) / 60000) + 1) + ' min');
        };
        console.log('Waiting for the second OTP....')
    }
};