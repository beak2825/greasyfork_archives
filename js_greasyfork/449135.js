// ==UserScript==
// @name         bwalls shortlink start
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  just for fun
// @author       You
// @match        *://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449135/bwalls%20shortlink%20start.user.js
// @updateURL https://update.greasyfork.org/scripts/449135/bwalls%20shortlink%20start.meta.js
// ==/UserScript==
let auto_claim_frequency = 120000;

var captchaInterval = setInterval(function() {
    try {
        if (
            window.location.href.includes("/offerwall") &&
            document.querySelector("#shortlinks").className.includes("bg-primary3")
        ) {
            console.log("Auto claim frequency set to " + auto_claim_frequency / 60000 + " min");
            clearInterval(captchaInterval);
            console.log("starting auto claim in " + auto_claim_frequency / 60000 + " min");
            let a = document.querySelectorAll("[data-idd]");
            let max_shortlink_found = a.length;
            const printNumbersForEvery2Sec = (n) => {
                for (let i = 1; i <= n; i++) {
                    setTimeout(() => {
                        var close = document.querySelector(
                            "#goShortlink > div > div.modal-content.bg-dark.text-white > button"
                        );
                        close.click();
                        console.log("clicking shortLink No > " + (i + 1));
                        a[i].click();
                    }, i * auto_claim_frequency);
                }
            };
            printNumbersForEvery2Sec(`${max_shortlink_found}`);
        } else {
            document.querySelector("#shortlinks").click();
            console.log("Navigating to Shortlink Tab");
        }
    } catch (e) {}
}, 10000);

setInterval(function(){
    if(window.localStorage.getItem('reload')=="true"){
                        location.reload();
                            console.log("Clearing Reload trigger");
                            window.localStorage.removeItem('reload');
                        };
   if(window.location.href.includes("/success")||window.location.href.includes("/time")||window.location.href.includes("/not_found")){
   window.close()
   }
   if(window.location.href.includes("/redirect")&&document.querySelector("#status").innerText.includes("error")){
       window.localStorage.setItem('reload', true);
       console.log("window reload trigger set");
       window.close();
   }
},5000);