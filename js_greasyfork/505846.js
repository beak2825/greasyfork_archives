// ==UserScript==
// @name         Naver Smartstore 链接打印
// @namespace    http://puresimple.cn
// @version      0.2.7
// @description  OutPut Links
// @author       IceGhost
// @icon         http://puresimple.cn/favicon.ico
// @match        https://smartstore.naver.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/505846/Naver%20Smartstore%20%E9%93%BE%E6%8E%A5%E6%89%93%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/505846/Naver%20Smartstore%20%E9%93%BE%E6%8E%A5%E6%89%93%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.href.includes('smartstore.naver.com')) {
        if (window.location.href.includes('products')){
            return;
        }
        else if (window.location.href.includes('profile')) {
            return;
        }
        else if (!window.location.href.includes('/category/ALL?st=TOTALSALE&dt=LIST&page=1&size=80')) {
            window.location.href += '/category/ALL?st=TOTALSALE&dt=LIST&page=1&size=80';
        }
    }
    window.onload = function() {
        let hrefLinks = [];
        const ulElements = document.querySelectorAll('ul');

        ulElements.forEach(ul => {
            const liElements = ul.querySelectorAll('li._3S7Ho5J2Ql');
            liElements.forEach(li => {
                const divElement = li.querySelector('div._3BMdVouLXe');
                if (divElement) {
                    return;
                }
                const aTag = li.querySelector('a[href]');
                if (aTag && aTag.href) {
                    hrefLinks.push(aTag.href);
                }
            });
        });
        console.log('Found href links:', hrefLinks);
    };
})();
