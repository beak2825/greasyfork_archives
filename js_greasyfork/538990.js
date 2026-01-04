// ==UserScript==
// @name         ufret
// @namespace    https://greasyfork.org/ja/users/941284-ぐらんぴ
// @version      2025-06-02
// @description  something
// @author       ぐらんぴ
// @match        https://www.ufret.jp/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ufret.jp
// @grant        GM_addStyle
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538990/ufret.user.js
// @updateURL https://update.greasyfork.org/scripts/538990/ufret.meta.js
// ==/UserScript==

window.alert = () => console.log("Alert blocked!");
console.error = () => {};
window.onerror = () => {};
const log = console.log;
const origAppendChild = Element.prototype.appendChild;
Element.prototype.appendChild = function(...args){
    if(args[0].localName == "span" && args[0].id){
        args = ""
    }
    if(args[0].localName == "script"){
        if(args[0].src.includes('ads')){
            args = ''
        }
    }
    log(args[0]);
    log(args);
    return origAppendChild.apply(this, args);
}
GM_addStyle(`
#full-screen-ad {
display : none;
}
`)