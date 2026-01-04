// ==UserScript==
// @name         igg-games 自動轉到檔案下載頁面
// @namespace    http://tampermonkey.net/
// @version      2.2
// @description  不用等待下載時的五秒
// @author       BeenYan
// @match        http*://bluemediafiles.com/*
// @match        http*://bluemediafiles.eu/*
// @match        http*://bluemediafiles.homes/*
// @match        http*://bluemediafiles.net/*
// @match        http*://bluemediafiles.xyz/*
// @match        http*://bluemediafile.sbs/*
// @match        http*://dl.pcgamestorrents.org/*
// @grant        none
// @license      GPL
// @downloadURL https://update.greasyfork.org/scripts/396167/igg-games%20%E8%87%AA%E5%8B%95%E8%BD%89%E5%88%B0%E6%AA%94%E6%A1%88%E4%B8%8B%E8%BC%89%E9%A0%81%E9%9D%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/396167/igg-games%20%E8%87%AA%E5%8B%95%E8%BD%89%E5%88%B0%E6%AA%94%E6%A1%88%E4%B8%8B%E8%BC%89%E9%A0%81%E9%9D%A2.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let url = null;
    const find_source = () =>{
        for (const script of document.getElementsByTagName('script')) {
            const matches = /Goroi_n_Create_Button\("(.*)"\)/.exec(script.innerHTML);
            if (matches && matches.length === 2) {
                return matches[1];
            }
        }
    }

    const time = setInterval(()=>{
        if (url === null) url = find_source();
        if (url){
            Goroi_n_Create_Button(url);
            const form = document.querySelector('[action="get-url.php"]')
            const redirect = form.querySelector('#url').getAttribute('value');
            if (redirect !== null) {
                form.submit();
                clearInterval(time);
            }
        }
    },10);
})();