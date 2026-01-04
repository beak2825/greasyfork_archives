// ==UserScript==
// @name         OpenerPictureOtp
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  get permanant changed ClassName
// @author       MeGa
// @match        https://mail.google.com/mail/*
// @match        https://algeria.blsspainvisa.com/*
// @match        file:///C:/Users/a/Downloads/bls/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
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
// @downloadURL https://update.greasyfork.org/scripts/443637/OpenerPictureOtp.user.js
// @updateURL https://update.greasyfork.org/scripts/443637/OpenerPictureOtp.meta.js
// ==/UserScript==
/*add
// @require      &*1https://cdn.jsdelivr.net/gh/naptha/tesseract.js@v1.0.14/dist/tesseract.min.js
*/
if (localStorage.OTP1 !== undefined) {
    var waiterForemailOTP2= setInterval(function(){if(document.body.outerHTML.indexOf('OTP Confirmation')!==-1){document.querySelector("#\\:2q > span").click();clearInterval(waiterForemailOTP2);}},1000)
    var waiterOTP2opened = setInterval(function() {
        if (document.body.outerHTML.lastIndexOf('data-image-whitelisted') !== -1) {
            var innerHTML = document.body.innerHTML;
            var targetFix = "data-image-whitelisted";
            var target = innerHTML.indexOf(targetFix);
            var begin = target + 30; /*begin classeName aproximatif ---*/
            var end = target + 40; /*end classeName approximatif +++*/

            var cibleImage = innerHTML.substring(begin, end);

            var appo = cibleImage.lastIndexOf('"');
            if (appo !== -1) {
                var DecaleLeft = cibleImage.length - appo;
                var newCibleImage = innerHTML.substring(begin, end - DecaleLeft);
                var appoNCI = newCibleImage.indexOf('"');
                if (appoNCI !== -1) {
                    var cutBeginToAppo = appoNCI + 1;
                    var classImg1 = innerHTML.substring(begin + cutBeginToAppo, end - DecaleLeft);
                    var cibleImage1 = document.getElementsByClassName(classImg1)[0];

                    window.location.href = cibleImage1.src;
                } else {
                    var classImg2 = newCibleImage;
                    var cibleImage2 = document.getElementsByClassName(classImg2)[0];

                    window.location.href = cibleImage2.src;
                }
            } else {
                var classImg0 = cibleImage;
                var cibleImage0 = document.getElementsByClassName(classImg0)[0];

                window.location.href = cibleImage0.src;
            }

            ;
            clearInterval(waiterOTP2opened);
        };
    }, 1000);
};