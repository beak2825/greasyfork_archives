// ==UserScript==
// @name         admiral deleter/says goodbye to admiral adblocker blocker
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  the name says it all
// @author       You
// @match        http*://*/*
// @exclude      *docs.google.com/*/*
// @exclude      *sites.google.com/*/edit
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410958/admiral%20deletersays%20goodbye%20to%20admiral%20adblocker%20blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/410958/admiral%20deletersays%20goodbye%20to%20admiral%20adblocker%20blocker.meta.js
// ==/UserScript==
setInterval(function(){
    if(typeof ADBdetected == "undefined"){}
    else {
        ADBdetected = () => {console.log("bob")}
        if(document.body.getElementsByClassName("fEy1Z2XT ")[0]){
            document.body.getElementsByClassName("fEy1Z2XT ")[0].remove();
        }
    }
    if(typeof window.admiral == "undefined"){}
    else {
        window.admiral = () => {console.log("admiral is evil!")}
    }
},1);

for(i in document.getElementsByTagName("script")){
    var script = document.getElementsByTagName("script")[i]
    if(typeof script.innerHTML != "undefined" && script.innerHTML.includes('.setTargeting("admiral-engaged","true")')){
        script.innerHTML = "console.log('admiral is evil!');";
    }
}
