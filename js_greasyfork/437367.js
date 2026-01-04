// ==UserScript==
// @name         下载 ttbz PDF
// @namespace    http://tampermonkey.net/
// @description  下载
// @version      0.1
// @author       You
// @match        *://www.ttbz.org.cn/Pdfs/Index*
// @match        *://www.ttbz.org.cn/Home/PdfView*
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/437367/%E4%B8%8B%E8%BD%BD%20ttbz%20PDF.user.js
// @updateURL https://update.greasyfork.org/scripts/437367/%E4%B8%8B%E8%BD%BD%20ttbz%20PDF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function download(url) {
        fetch(url)
            .then(res => {
                return res.blob()
            })
            .then(res => {
                let url = window.URL.createObjectURL(new Blob([res], { type: 'application/pdf' }))
                let link = document.createElement('a')
                link.style.display = 'none'
                link.href = url
                link.setAttribute('download', 'test.pdf')
        
                document.body.appendChild(link)
                link.click()
            })
    }

    const button = document.createElement('button')
    button.innerText = '下载'
    button.style.cssText = [
      'position: fixed',
      'z-index: 99999',
      'top: 60px',
      'left: 10px',
    ].join(';')
    button.onclick = () => {
        const iframe = document.querySelector('#myiframe')
        let filePath = 'http://www.ttbz.org.cn'
        if (iframe) {
           filePath += new URL(iframe.src).searchParams.get('file')
        } else {
           filePath += new URL(location).searchParams.get('file')
        }
        console.log('filePath', filePath)
        download(filePath)
    }
    document.body.prepend(button)
})();