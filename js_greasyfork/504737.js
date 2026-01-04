// ==UserScript==
// @name         还原PDD商家后台的加密字体
// @namespace    undefined
// @version      0.7
// @description  还原PDD商家后台的被加密的数字
// @author       You
// @match        https://mms.pinduoduo.com/sycm/goods_effect
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        GM_xmlhttpRequest
// @downloadURL https://update.greasyfork.org/scripts/504737/%E8%BF%98%E5%8E%9FPDD%E5%95%86%E5%AE%B6%E5%90%8E%E5%8F%B0%E7%9A%84%E5%8A%A0%E5%AF%86%E5%AD%97%E4%BD%93.user.js
// @updateURL https://update.greasyfork.org/scripts/504737/%E8%BF%98%E5%8E%9FPDD%E5%95%86%E5%AE%B6%E5%90%8E%E5%8F%B0%E7%9A%84%E5%8A%A0%E5%AF%86%E5%AD%97%E4%BD%93.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var handler = setInterval(function() {
        var reg = /src:\s*url\('(?<data>[^']+)'\)\s*format\('truetype'\)/;
        var match = reg.exec(document.head.outerHTML);
        if (match == undefined)
            return;

        console.log('match success:' + match.groups['data']);

        GM_xmlhttpRequest({
            headers: {
                'content-type': 'application/json',
                'Authorization': 'Basic ZGVtbzpzYWRhajA5YQ=='
            },
            responseType: 'json',
            url: 'http://itspiura.cn:8025/Decode',
            data: '"' + match.groups['data'] + '"',
            method: 'POST',
            onreadystatechange: function(res) {
                if (res.status === 200 && res.readyState === 4) {
                    [...document.querySelectorAll('.__spider_font')].filter(s=>s.childElementCount == 0).forEach(s=>{
                        var text = s.innerHTML.split('').reduce((a,b)=>a + (res.response.result[b.charCodeAt()] ?? b), '');
                        s.innerHTML = text;
                    }
                    )

                    clearInterval(handler);
                }
            }
        })
    }, 1000);
}
)();
