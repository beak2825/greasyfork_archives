// ==UserScript==
// @name         이랜드 구매바로클릭
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://secure.elandmall.com/order/initOrder.action?*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/387817/%EC%9D%B4%EB%9E%9C%EB%93%9C%20%EA%B5%AC%EB%A7%A4%EB%B0%94%EB%A1%9C%ED%81%B4%EB%A6%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/387817/%EC%9D%B4%EB%9E%9C%EB%93%9C%20%EA%B5%AC%EB%A7%A4%EB%B0%94%EB%A1%9C%ED%81%B4%EB%A6%AD.meta.js
// ==/UserScript==




function goEvent(){
    setTimeout(function() {
        var buy = document.getElementsByClassName('btn06');
        buy[0].click();
    }, 400);

}

goEvent();

