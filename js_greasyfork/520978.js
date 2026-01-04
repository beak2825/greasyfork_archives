// ==UserScript==
// @name         ServiceBox Path
// @namespace    http://tampermonkey.net/
// @version      2024-12-17
// @description  ServiceBox Path for still using servicebox after the updates
// @author       You
// @include      https://public.servicebox-parts.com/socle/?start=true
// @include      https://public.servicebox-parts.com/doc*/accesDoc.do*
// @include      https://public.servicebox-parts.com/briqueCMM/*.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=servicebox-parts.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/520978/ServiceBox%20Path.user.js
// @updateURL https://update.greasyfork.org/scripts/520978/ServiceBox%20Path.meta.js
// ==/UserScript==

const searchBtnString = `
<button class="search-bar" id="vin_ok" type="submit" name="VIN_OK_BUTTON" onclick="return copyVIN(this)">
   <img class="search-box" src="/ressource/images/images/searchQuickWin.svg" alt="button">
</button>
`

const searchBtnEle = document.createElement('button')

const url = location.href

const vinInput = document.querySelector('#short-vin')
const paidURL = 'https://public.servicebox.peugeot.com/briqueCMM/accesDoc.do?jbnRedirect=true'
const freeURL = 'https://public.servicebox.peugeot.com/docapvAP/accesDoc.do?jbnRedirect=true'
const paidURL2 = 'https://public.servicebox-parts.com/briqueCMM/initNav.do'

main()

async function main(){
    await waitForLoad()
    switch (true){
        case url.includes('doc'):
            fixInputVIN()
            var newURL = url.split('docprAP').join('briqueCMM').split('docapvAP').join('briqueCMM')
            location.replace(newURL)
            break;
        case url.includes('briqueCMM'):
            fixInputVIN()
            break;
        case url.includes('/socle/'):
            location.replace(paidURL2)
            break;
    }
}



function fixInputVIN(){
    vinInput.style.display = ''
    vinInput.parentNode.insertBefore(searchBtnEle, vinInput.nextSibling)
    searchBtnEle.outerHTML = searchBtnString
}

async function waitForLoad(){
    return new Promise(async res=>{
        while(document.readyState !== 'complete'){
            console.log(document.readyState)
            await sleep(500)
        }
        res()
    })
}

async function sleep(ms){
    return new Promise(res=>setTimeout(res,ms))
}