// ==UserScript==
// @name         Take Screenshot - Magnews
// @version      0.1
// @description  Script to download screenshot of newsletter
// @author       Piego
// @namespace    https://www.diegopavan.com
// @match        https://be-mn1.mag-news.it/be/cms/giotto/newsletterpreviewframe.do*
// @match        https://be-mn1.mag-news.it/be/cms/giotto/designerframe.do*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=magnews.it
// @require      https://greasyfork.org/scripts/457525-html2canvas-1-4-1/code/html2canvas%20141.js?version=1134363
// @grant        none
// @license      MIT
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/465137/Take%20Screenshot%20-%20Magnews.user.js
// @updateURL https://update.greasyfork.org/scripts/465137/Take%20Screenshot%20-%20Magnews.meta.js
// ==/UserScript==

(function() {

    // Get email id from url
    const urlParams = new URLSearchParams(window.location.search)
    const idn = urlParams.get('idn')

    // Take screenshot and download
    const screenshotTarget = document.getElementsByTagName('center')[0]
    screenshotTarget.style.width = '800px';
    screenshotTarget.style.margin = '0 auto';
    html2canvas(screenshotTarget, {scrollY: -window.scrollY,useCORS: true,imageTimeout: 15000,logging: true}).then(canvas => {
        download(canvas.toDataURL("image/png"), idn)
    }, false)

})();


function download(url, idn) {
  const a = document.createElement('a')
  a.href = url
  a.download = idn
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}