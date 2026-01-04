// ==UserScript==
// @name         New Bing黑色模式
// @namespace    http://tampermonkey.net/
// @version      1.0.5
// @description  Bing Chat, New Bing黑色模式
// @author       CODEFOR
// @match        https://www.bing.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @license MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/464287/New%20Bing%E9%BB%91%E8%89%B2%E6%A8%A1%E5%BC%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/464287/New%20Bing%E9%BB%91%E8%89%B2%E6%A8%A1%E5%BC%8F.meta.js
// ==/UserScript==

let test = () => {
    let aim_element = document.getElementsByClassName('cib-serp-main')[0]
    if (aim_element.mode == 'conversation') {
        clear_background_image()
        clearInterval(modeInterval)
        console.log('succeed')
    }
}

let clear_background_image = () => {
    // body
    document.getElementsByClassName('cib-serp-main')[0].shadowRoot.childNodes[12].shadowRoot.childNodes[1].style='background-image: url(https://www.bing.com/cdx/bg-sprite.png); background-position: 0% 0%; opacity: 0'
    document.getElementsByClassName('cib-serp-main')[0].shadowRoot.childNodes[12].shadowRoot.childNodes[3].style='background-image: url(https://www.bing.com/cdx/bg-sprite.png); background-position: 0% 0%; opacity: 0'

    // head bar
    document.getElementsByClassName('cib-serp-main')[0].shadowRoot.childNodes[16].shadowRoot.childNodes[2].childNodes[6].childNodes[1].shadowRoot.childNodes[1].style='background-image: url(https://www.bing.com/cdx/bg-sprite.png); background-position: 0% 0%; opacity: 0'
    document.getElementsByClassName('cib-serp-main')[0].shadowRoot.childNodes[16].shadowRoot.childNodes[2].childNodes[6].childNodes[1].shadowRoot.childNodes[3].style='background-image: url(https://www.bing.com/cdx/bg-sprite.png); background-position: 0% 0%; opacity: 0'

    // foot bar
    document.getElementsByClassName('cib-serp-main')[0].shadowRoot.childNodes[16].shadowRoot.childNodes[2].childNodes[8].childNodes[1].shadowRoot.childNodes[1].style='background-image: url(https://www.bing.com/cdx/bg-sprite.png); background-position: 0% 0%; opacity: 0'
    document.getElementsByClassName('cib-serp-main')[0].shadowRoot.childNodes[16].shadowRoot.childNodes[2].childNodes[8].childNodes[1].shadowRoot.childNodes[3].style='background-image: url(https://www.bing.com/cdx/bg-sprite.png); background-position: 0% 0%; opacity: 0'
}

const modeInterval = setInterval(test, 1000)