// ==UserScript==
// @name         자동복호화1
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  자동복호화
// @author       SYJ
// @match        https://www.postype.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=arca.live
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/532675/%EC%9E%90%EB%8F%99%EB%B3%B5%ED%98%B8%ED%99%941.user.js
// @updateURL https://update.greasyfork.org/scripts/532675/%EC%9E%90%EB%8F%99%EB%B3%B5%ED%98%B8%ED%99%941.meta.js
// ==/UserScript==
 
function main(){
    setTimeout(doDecode, 400);
}
function doDecode() {
    ///'use strict';
    const article = document.querySelector("body div.article-body > div.fr-view.article-content");
 
    function dec(reg)
    {
        try
        {
            while (reg.test(article.innerHTML))
            {
                let decoded = reg.exec(article.innerHTML)[0];
                while (decoded.match(/aHR0c[0-9A-Za-z]{8,}[=]{0,2}/) == null)
                {
                    decoded = atob(decoded);
                }
 
                decoded = atob(decoded); console.log(decoded);
                article.innerHTML = article.innerHTML.replace(reg, `<a href=${decoded} target='_blank' rel='noreferrer'>${decoded}</a>`);
            }
        }
        catch(e)
        {
            console.log(e,article);
        }
    }
    dec(/aHR0c[0-9A-Za-z+]{20,}[=]{0,2}/); //aHR0c:1회인코딩된것.
    dec(/YUhSMGN[0-9A-Za-z]{80,}[=]{0,2}/); //YUhSMGN:2회인코딩된것.
    dec(/[0-9A-Za-z]{30,}[=]{1,2}/); //문자열 30회 + '=' 1~2회
    dec(/[0-9A-Za-z]{200,}[=]{0,2}/); //문자열 200회 + '=' 0~2회
}
 
window.addEventListener('load', main);