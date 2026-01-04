// ==UserScript==
// @name         itch.io Fast Claim
// @namespace    http://tampermonkey.net/
// @version      2024-01-22
// @description  Fast Claim
// @author       You
// @match        https://*.itch.io/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=itch.io
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/487871/itchio%20Fast%20Claim.user.js
// @updateURL https://update.greasyfork.org/scripts/487871/itchio%20Fast%20Claim.meta.js
// ==/UserScript==
const claimButton = document.querySelector('.left_col.column .button.buy_btn')
claimButton.onclick = async () => {
    //console.log('claimButton.onclick')
    let modal, total = 3000, delay = 100
    for(let i = 0; i < total; i += delay){
        modal = document.querySelector('div.buy_lightbox')
        //console.log(modal)
        if(modal){
            break;
        } else {
            await sleep(delay)
        }
    }
    if(modal){
        const directButton = modal.querySelector('.direct_download_btn')
        //console.log(directButton)
        if(directButton){
            directButton.click()
        }
    }
}
function sleep(ms){
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, ms)
    })
}