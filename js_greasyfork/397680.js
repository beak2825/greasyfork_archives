// ==UserScript==
// @name         CJCU Go Learning PDF Downloader
// @namespace    dev.dysphoria.c.us.cjcu.pdf-downloader
// @version      0.1.0
// @description  Download PDF file on CJCU Go learning web site.
// @author       Dareka
// @include      https://elearn.cjcu.edu.tw/learn/path/viewPDF.php?id=*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397680/CJCU%20Go%20Learning%20PDF%20Downloader.user.js
// @updateURL https://update.greasyfork.org/scripts/397680/CJCU%20Go%20Learning%20PDF%20Downloader.meta.js
// ==/UserScript==


window.PDFViewerApplication.appConfig.toolbar.download.style.display = 'block'
window.PDFViewerApplication.appConfig.toolbar.download.onclick = () => window.PDFViewerApplication.download()