// ==UserScript==
// @name        hchaptcha solved? checker
// @license      opensource
// @description  Check if hchaptcha has solved or not
// @namespace    http://tampermonkey.net/
// @version      1
// @author       shrmarock
// @match       https://cryptorotator.website/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/448974/hchaptcha%20solved%20checker.user.js
// @updateURL https://update.greasyfork.org/scripts/448974/hchaptcha%20solved%20checker.meta.js
// ==/UserScript==
var clicked = false;
var captchaInterval = setInterval(function(){
  for(var hc=0; hc < document.querySelectorAll("iframe").length; hc++){
                if(! clicked && document.querySelectorAll("iframe")[hc] &&
                   document.querySelectorAll("iframe")[hc].hasAttribute("data-hcaptcha-response") &&
                   document.querySelectorAll("iframe")[hc].getAttribute("data-hcaptcha-response").length > 0){
                    clicked = true;
                    clearInterval(captchaInterval);
                    setTimeout(function(){
                    },5000);
                }
            }
    if(clicked==false){console.log("not clicked")}
else{console.log(" clicked")};
    },5000);