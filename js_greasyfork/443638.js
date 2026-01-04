// ==UserScript==
// @name         ReaderImageOtp
// @namespace    http://tampermonkey.net/
// @version      2.1
// @description  Read OTP image and transferd it to book-app
// @author       MeGaBOuSsOl
// @match        https://gm1*
// @match        https://algeria.blsspainvisa.com/*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @include      https://algeria.blsspainvisa.com/*
// @include      https://gm1*
// @require      http://code.jquery.com/jquery-3.4.1.min.js
// @require      http://ajax.googleapis.com/ajax/libs/jquery/1.6.4/jquery.min.js
// @grant       GM_getValue
// @grant       GM_setValue
// @grant       GM_deleteValue
// @grant       GM_listValues
// @grant       God
// @downloadURL https://update.greasyfork.org/scripts/443638/ReaderImageOtp.user.js
// @updateURL https://update.greasyfork.org/scripts/443638/ReaderImageOtp.meta.js
// ==/UserScript==

/*add
// @require      https://cdn.jsdelivr.net/gh/naptha/tesseract.js@v1.0.14/dist/tesseract.min.js
*/
var date = new Date();
var ActualTime = date.getTime();
var loc = window.location.href;
var book_appointment = loc.indexOf('book_appointment.php');
var gmailPicture= loc.indexOf('https://gm1');

if(book_appointment!==-1){if(localStorage.getItem('OTP2')!== undefined)
{/*Check OTP2At*/
if (ActualTime - localStorage.getItem('OTP2At') > 1800000) {
            console.log('OTP2 a éxpiré \n Deleting...');
            localStorage.removeItem('OTP2At');
            localStorage.removeItem('OTP2');
        } else {
            console.log('OTP2 is saved since ' + Math.floor(((ActualTime - localStorage.getItem('OTP2At')) / 60000) + 1) + ' min');
            setTimeout(function(){window.close();},7333)
        };
        console.log('Continue to Appointment....')

}
                          else{if (GM_getValue("OTP2") !== null && GM_getValue("OTP2") !== undefined) {

                    console.log("Gm_value founded \n Transfering it...");
                    localStorage.setItem('OTP2', (GM_getValue("OTP2")));
                    var OTP2RegistredAt0 = date.getTime();
                    console.log('OTP2 Transfered to bls Successfuly');

                };};
/*Transfer OTP2 to BLS*/

};
if(gmailPicture!== -1) {};


/*Read Image OTP2*/
  var myImage=document.querySelector("body > img");
Tesseract.recognize(myImage).then(function(result) {

            console.log(result.text);
            if (result.text.indexOf('\n') !== -1) {
                localStorage.setItem('OTP2', result.text.substring(0, result.text.indexOf('\n')));

            } else {
                localStorage.setItem('OTP2', result.text);


            };


            setTimeout(function() {
                window.location.reload();
            }, 3000);
    GM_setValue('OTP2', localStorage.getItem('OTP2'));
    var OTP2RegistredAt = date.getTime();
    localStorage.setItem('OTP2At', OTP2RegistredAt);
           

        });

