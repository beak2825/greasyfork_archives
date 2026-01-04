// ==UserScript==
// @name         ACM 论文重新打开
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  当你第二天再次打开ACM里的论文时，这个脚本能帮你重新打开已经失效的pdf页面
// @author       tty112358
// @match        *://delivery.acm.org/*
// @match        *://dl.acm.org/*
// @grant        GM_xmlhttpRequest
// @grant        GM_openInTab
// @connect      dl.acm.org
// @downloadURL https://update.greasyfork.org/scripts/394048/ACM%20%E8%AE%BA%E6%96%87%E9%87%8D%E6%96%B0%E6%89%93%E5%BC%80.user.js
// @updateURL https://update.greasyfork.org/scripts/394048/ACM%20%E8%AE%BA%E6%96%87%E9%87%8D%E6%96%B0%E6%89%93%E5%BC%80.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    const curURL = new URL(window.location.href);
    console.log(curURL);

    if (curURL.searchParams.has('id')){
        const id = curURL.searchParams.get('id');
        if (curURL.host === "dl.acm.org" && curURL.searchParams.has('from_tty112358') && curURL.searchParams.get('from_tty112358') === '1'){
            for (const node of document.querySelectorAll("a[name=FullTextPDF]")){
                const href = node.href;
                const toURL = new URL(href);
                if (toURL.searchParams.has('id') && toURL.searchParams.get('id') === id){
                    // console.log(node);
                    // console.log(href);
                    node.click();
                    break;
                }
            }
            window.close();
        } else if (curURL.host === "delivery.acm.org") {
            const pdfEmbed = document.querySelector('embed');
             if(pdfEmbed){
                // do nothing and peace out
                return;
            }
            const paperHref = 'https://dl.acm.org/citation.cfm?id=' + id + '&from_tty112358=1';
            console.log(paperHref);
            GM_openInTab(paperHref);
        } else {
            // no job here
        }
        /*
        GM_xmlhttpRequest ({
            method: 'GET',
            url: paperHref,
            onload: function (response) {
                const text = response.responseText;
                const template = document.createElement('template');
                template.innerHTML = text.trim();
                for (const node of template.content.querySelectorAll("a[name=FullTextPDF]")){
                    const href = node.href;
                    const toURL = new URL(href);
                    if (toURL.searchParams.has('id') && toURL.searchParams.get('id') === id){
                        console.log(node);
                        console.log(href);
                        node.click();
                        // GM_openInTab(href);
                    }
                }
            }
        });
        */
    }
})();