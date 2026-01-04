// ==UserScript==
// @name         Автопоказ комментов dtf
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  Кликает кнопку показа комментов, когда она появляется
// @author       resursator
// @license      MIT
// @match        https://dtf.ru/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=dtf.ru
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/481526/%D0%90%D0%B2%D1%82%D0%BE%D0%BF%D0%BE%D0%BA%D0%B0%D0%B7%20%D0%BA%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%BE%D0%B2%20dtf.user.js
// @updateURL https://update.greasyfork.org/scripts/481526/%D0%90%D0%B2%D1%82%D0%BE%D0%BF%D0%BE%D0%BA%D0%B0%D0%B7%20%D0%BA%D0%BE%D0%BC%D0%BC%D0%B5%D0%BD%D1%82%D0%BE%D0%B2%20dtf.meta.js
// ==/UserScript==

window.addEventListener('scroll', function() {
    var Btn = document.querySelector('.link-button--default.comments-limit__expand');
    if (Btn!=undefined||Btn!=null){

       var BtnTop = Btn.getClientRects()[0].top;
       var WH = window.outerHeight/1.1;
        if (BtnTop < WH){
         Btn.click();
       }
    }
})