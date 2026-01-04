// ==UserScript==
// @name         faucet
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  for 4stupid
// @author       You
// @match        https://faucets.chain.link/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=chain.link
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/442157/faucet.user.js
// @updateURL https://update.greasyfork.org/scripts/442157/faucet.meta.js
// ==/UserScript==

let close = true
function SetTime() {
    let submit_btn = document.getElementsByClassName('button_primary__9T1XN faucetForm_submit__haVbN')[0]
    if(!(submit_btn.disabled) && close){
        submit_btn.click()
        close = false
    }
    if(!(close)){
        let close_btn = document.getElementsByClassName('Box-sc-1vpmd2a-0 Button-sc-1sg3lik-0 kgcTca')[0]
        if(!(close_btn.disabled)){
            close_btn.click()
            close = true
        }
    }

}
setInterval(SetTime, 1000);
