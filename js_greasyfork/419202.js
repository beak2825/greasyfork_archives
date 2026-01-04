// ==UserScript==
// @name         字体替换
// @namespace    http://tampermonkey.net/
// @version      2.8
// @description  字体替换，默认为Ubuntu，可自行修改，略过等宽字体
// @match        *://*/*
// @grant        GM_addStyle
// @downloadURL https://update.greasyfork.org/scripts/419202/%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/419202/%E5%AD%97%E4%BD%93%E6%9B%BF%E6%8D%A2.meta.js
// ==/UserScript==

const fonts = new Set()
const main = () => {
    let fontFaceCSS = '';
    document.querySelectorAll('*').forEach(node => {
        let nodeFont = getComputedStyle(node).fontFamily
        if (nodeFont.includes('mono')) { return }
        nodeFont = nodeFont.split(',')[0]
        if (fonts.has(nodeFont)) { return }
        fonts.add(nodeFont)
        fontFaceCSS += `
        @font-face {
            font-family: ${nodeFont};
            src: local('Ubuntu');
        }`
    })
    if (!fontFaceCSS.length) { return }
    GM_addStyle(fontFaceCSS)
    console.log('font replace done')
}
 
main()
setInterval(main, 3000)