// ==UserScript==
// @name         google captcha solved checker
// @namespace    checked for google recaptcha solved or not
// @author       shrmarock
// @license      opensource
// @description  Check if google captcha is solved or not
// @version      1.0
// @match        https://www.google.com/recaptcha/api2/demo
// @require      https://ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/448972/google%20captcha%20solved%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/448972/google%20captcha%20solved%20checker.meta.js
// ==/UserScript==
var  captchaButtonSubmitSelector = "[#recaptcha-demo-submit]";
var clicked = false;
        var captchaInterval = setInterval(function(){


            try{
                if(!clicked && unsafeWindow.grecaptcha && unsafeWindow.grecaptcha.getResponse().length > 0){
                    clicked = true;
                    clearInterval(captchaInterval);
                    setTimeout(function(){
                    },10000);
                }
            }catch(e){

            }
if(clicked==false){console.log("not clicked")}
else{console.log(" clicked")};
        },10000);
