// ==UserScript==
// @name         CNKI PDF Download
// @namespace    http://joyuer.cn
// @version      0.1.5
// @description  Add a PDF download button for CNKI papers if possible
// @author       Joyuer
// @match        *.cnki.net/kcms/detail/detail*
// @match        *.cnki.net/KCMS/detail/detail*
// @require      https://cdn.jsdelivr.net/npm/jquery@3.4.1/dist/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/390212/CNKI%20PDF%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/390212/CNKI%20PDF%20Download.meta.js
// ==/UserScript==

(function() {
    'use strict';
    $(".dllink").prepend(`<a id="custom-pdf-dl-btn" class="icon icon-dlGreen" href="#">加载中...</a>`)
    const host = "https://joyuer.azurewebsites.net"
    fetch(host + "/cnki/pdf?url="+location.href).then(r => r.json()).then(r => {
        if (r.pdf_url) {
            $("#custom-pdf-dl-btn").attr('href', r.pdf_url)
            $("#custom-pdf-dl-btn").text('PDF 下载')
        }
        else
            $("#custom-pdf-dl-btn").remove()
    }).catch(e => $("#custom-pdf-dl-btn").remove())
})();