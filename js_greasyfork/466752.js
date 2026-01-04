// ==UserScript==
// @name         たいつべ非公式検索
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  検索強化
// @author       You
// @match        https://typing-tube.net/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=typing-tube.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/466752/%E3%81%9F%E3%81%84%E3%81%A4%E3%81%B9%E9%9D%9E%E5%85%AC%E5%BC%8F%E6%A4%9C%E7%B4%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/466752/%E3%81%9F%E3%81%84%E3%81%A4%E3%81%B9%E9%9D%9E%E5%85%AC%E5%BC%8F%E6%A4%9C%E7%B4%A2.meta.js
// ==/UserScript==
keyword.addEventListener('keydown',(e)=>{
    if(e.code == 'Enter' && e.ctrlKey){
        const newURL = `https://typing-tube.net/search?q=${e.target.value}&option=title&filter=&sec_min=&sec_max=`;
        window.open(newURL);
        //location.href = newURL;
    };
});
