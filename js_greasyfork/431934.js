// ==UserScript==
// @name         nanoCaptcha Auto hCaptcha Solver
// @namespace    ekaraman89@hotmail.com
// @version      1.0.0
// @description  play nano sitesinden captha sonrasi otomatik tiklama
// @author       ekaraman ekaraman89@hotmail.com
// @match        https://playnano.online/watch-and-learn/nano/captcha*
// @match        https://playnano.online/watch-and-learn/nano*
// @grant        yes
// @downloadURL https://update.greasyfork.org/scripts/431934/nanoCaptcha%20Auto%20hCaptcha%20Solver.user.js
// @updateURL https://update.greasyfork.org/scripts/431934/nanoCaptcha%20Auto%20hCaptcha%20Solver.meta.js
// ==/UserScript==

window.onload=function(){
  setInterval(autoClick,5000);
}
function autoClick(){
  if(document.getElementsByClassName("button btn-primary watch-next-btn").length>0){
  document.getElementsByClassName("button btn-primary watch-next-btn")[0].click();
}
}

    setInterval(function() {
        // Click on claim when hCaptcha is solved.
        if (document.querySelector(".h-captcha > iframe").getAttribute("data-hcaptcha-response").length > 0) {
            document.getElementsByClassName("button")[0].click();
        }
    }, 5000);
