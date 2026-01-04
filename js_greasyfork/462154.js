// ==UserScript==
// @name         non JP manga alert demo📖
// @description  RT
// @namespace    no_webton_allowed
// @author       Covenant
// @version      1.0.4
// @license      MIT
// @homepage
// @match        *://*/*
// @exclude      file:///*
// @icon         data:image/png;base64,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
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @connect
// @run-at       document-end
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/462154/non%20JP%20manga%20alert%20demo%F0%9F%93%96.user.js
// @updateURL https://update.greasyfork.org/scripts/462154/non%20JP%20manga%20alert%20demo%F0%9F%93%96.meta.js
// ==/UserScript==
function fn_url(url){
    let obj_url=new URL(url);
    let params=obj_url.searchParams;
    //let params=new URLSearchParams(obj_url.search);
    return [obj_url,params];
}
function JenkHash(key,is_toLowerCase){
    function parseSignedInt(hex){//questions/13468474
        const i = parseInt(hex, 16);
        return i >= 0x80000000 ? i - 0x100000000 : i;
    }
    if(is_toLowerCase)key=key.toLowerCase();
    var hash = 0;
    for(var i = 0; i < key.length; ++i){
        hash += key.charCodeAt(i);
        hash += (hash << 10);
        hash ^= (hash >>> 6);
    }
    hash += (hash << 3);
    hash ^= (hash >>> 11);
    hash += (hash << 15);
    hash = hash >>> 0;
    return ["0x"+hash.toString(16).toUpperCase().padStart(8,"0"),parseSignedInt("0x"+hash.toString(16)),hash];
}
(function() {
    'use strict';
    let url=fn_url(document.location);
    let host=url[0].host;
    let kr_toon=/\u5185\u5730/i;
    let cn_manhua=/\u97E9\u56FD/i;
    if(JenkHash(host)[2]==3910989692){
        let div_book_cont=document.querySelectorAll('div.book-cont')[0];
        let type=div_book_cont.querySelectorAll('li>span>a');
        let h1=div_book_cont.querySelectorAll('h1')[0];
        let img=div_book_cont.querySelectorAll('img')[0];
        for(let i=0; i<type.length; i++){
            if(type[i].innerText.search(kr_toon)!=-1){
                h1.style.setProperty("text-decoration-line", "line-through");
                h1.style.setProperty("text-decoration-style", "double");
                img.setAttribute('style', 'filter: grayscale(100%)!important;');
            }
            else if(type[i].innerText.search(cn_manhua)!=-1){
                h1.style.setProperty("text-decoration", "line-through");
                img.setAttribute('style', 'filter: grayscale(100%)!important;');
            }
            else if(type[i].innerText.search("耽美")!=-1||type[i].innerText.search("腐女")!=-1){
                h1.textContent="♂️♂️ "+h1.textContent;
            }
            else if(type[i].innerText.search("百合")!=-1){
                h1.textContent="♀️♀️ "+h1.textContent;
            }
        }
    }
    else if(JenkHash(host)[2]==2951725491||JenkHash(host)[2]==4011504410){
        console.log("tmp");
    }
})();