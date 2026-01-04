// ==UserScript==
// @name         字体替换
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  字体替换，将页面全部等宽字体替换为Maple Mono NF CN
// @match        *://*/*
// @grant        GM_addStyle
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/513803/%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/513803/%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

const fonts = new Set()
const main = () => {
    let fontFaceCSS = '';
    document.querySelectorAll('*').forEach(node => {
        let nodeFont = getComputedStyle(node).fontFamily
        if (nodeFont.includes('mono')) {
            console.log(node)
            node.style.fontFamily = 'Maple Mono NF CN'
        }
    })
}

main()
setInterval(main, 3000)