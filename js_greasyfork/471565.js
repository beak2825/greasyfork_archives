// ==UserScript==
// @name         电子教材下载器
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  下载国家中小学智慧教育平台的电子教材
// @author       小高CARL
// @match        *://basic.smartedu.cn/*
// @grant        none
// @license      GPL-3
// @downloadURL https://update.greasyfork.org/scripts/471565/%E7%94%B5%E5%AD%90%E6%95%99%E6%9D%90%E4%B8%8B%E8%BD%BD%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/471565/%E7%94%B5%E5%AD%90%E6%95%99%E6%9D%90%E4%B8%8B%E8%BD%BD%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    const download = (filename, url) => {fetch(url, {
        method: 'get',
        responseType: 'arraybuffer',
    }).then(res => {
        if (res.status !== 200) {
            return res.json()
        }
        return res.arrayBuffer()
    }).then(blobRes => {
        const e = new Blob([blobRes], {
            type:'application/octet-stream',
            'Content-Disposition':'attachment'
        })
        const link = window.URL.createObjectURL(e)
        let a = document.createElement('a');
        a.style = 'display:none';
        a.download = filename;
        a.href = link;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    }).catch(err => {
        console.error(err)
    })
    }

    var urls = []
    const addurl = (url) => {if (!urls.includes(url)) {urls.push(url)}};
    const geturl = () => {
        if (!document.querySelector("#viewer>*")) {
            setTimeout(geturl, 1000);
            return;
        }
        performance.getEntries().forEach(x=>{if(/^[^?]*pdf\.pdf/.test(x.name)){addurl(x.name.replace("-private", ""))}});
        console.log(urls);
        urls.forEach((url)=>{if(confirm("是否下载PDF格式的电子教材？")){download(window.top.document.getElementsByTagName("title")[0].innerText+".pdf", url)}})
    }
    setTimeout(geturl, 1000);
})();