// ==UserScript==
// @name         X Ad remover
// @name:en      X Ad remover
// @name:ja      X 広告 ブロッカー
// @namespace    https://x.com/
// @version      2025-04-24
// @description       remove X ads
// @description:en    remove X ads
// @description:ja    広告 ブロック
// @author       ぐらんぴ
// @match        https://x.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=twitter.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/490697/X%20Ad%20remover.user.js
// @updateURL https://update.greasyfork.org/scripts/490697/X%20Ad%20remover.meta.js
// ==/UserScript==

const origAppendChild = Element.prototype.appendChild;
Element.prototype.appendChild = function(...args){
    try{
        if(args[0].localName === "path" && args[0].outerHTML.includes('<path d="M19.498 3h-15c-1.381 0-2.5 1.12-2.5 2.5v13c0')){
            args[0].id = 'promo';
        }
        document.querySelectorAll('path#promo').forEach(i =>{
            const article = i.closest('article');
            const trend = i.closest('.css-175oi2r.r-1adg3ll.r-1ny4l3l')
            if(article) article.innerHTML = '';
            if(trend) trend.innerHTML = '';
        });
        if(location.href == "https://x.com/home"){
            if(args[0].nodeName == "ASIDE" && args[0].role == "complementary" && args[0].className !== "css-175oi2r r-14lw9ot r-1dgieki r-5kkj8d"){// subscribe and dm
                args[0] = null
            }
        }
    }catch{}
    return origAppendChild.apply(this, args);
};