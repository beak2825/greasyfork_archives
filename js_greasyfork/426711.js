// ==UserScript==
// @name        CNKI PDF Download
// @description 中国知网PDF下载(搜索列表)
// @author      Jachin
// @version     0.4
// @license     MIT
// @grant       GM_registerMenuCommand
// @namespace   http://tampermonkey.net/
// @include     *://kns.cnki.net/kns8/defaultresult/index*
// @include     *://oversea.cnki.net/kns/defaultresult/index*
// @include     *://*.res.gxlib.org.cn/kns*
// @exclude     *://image.cnki.net/*
// @include     *://kns.cnki.net/kns8/defaultresult/index*
// @include     *://oversea.cnki.net/kns/defaultresult/index*
// @include     */kns/brief/*
// @include     */kns55/brief/*
// @include     */grid2008/brief/*
// @include     */kcms/detail/detail.aspx*
// @include     *://er.szlib.org.cn/rwt/331/*

// @downloadURL https://update.greasyfork.org/scripts/426711/CNKI%20PDF%20Download.user.js
// @updateURL https://update.greasyfork.org/scripts/426711/CNKI%20PDF%20Download.meta.js
// ==/UserScript==


function get_pdf_url(url){
    let url_obj = new URL(url);
    url_obj.searchParams.set('dflag', "pdfdown");
    return url_obj.toString();
}

function add_pdf_download(){
    var $ = selector => Array.from(document.querySelectorAll(selector));
    $(".operat").forEach(i => {
        if(i.querySelector(".icon-download-pdf") != null)
            return
        if(i.querySelectorAll("a.downloadlink").length >= 2)
            return
        let download_node = i.querySelector(".downloadlink");
        if(download_node == null)
            return
        let pdf_download_node = download_node.cloneNode(true);
        pdf_download_node.href = get_pdf_url(pdf_download_node.href);
        pdf_download_node.classList.add("icon-download-pdf");
        pdf_download_node.classList.remove("icon-download");
        pdf_download_node.title = "download_pdf"
        pdf_download_node.querySelector("i").style.backgroundPosition = "-2px -140px"

        i.insertBefore(pdf_download_node, download_node);
        i.style.minWidth = "112px";
    })
}

(function() {
    'use strict';
    let observer = new MutationObserver(add_pdf_download);
    let options = {
        'childList': true,
        'attributes':true
    };

    observer.observe(document.querySelector(".main"), options);

    GM_registerMenuCommand(`PDF`, add_pdf_download);
})();