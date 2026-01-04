// ==UserScript==
// @name        自用-雪球自动关闭更换手机号的弹框
// @namespace   nothing
// @description 网站总是弹框,烦,抄了个关闭弹框的代码
// @match       https://xueqiu.com/*
// @version     3
// @grant       none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/407030/%E8%87%AA%E7%94%A8-%E9%9B%AA%E7%90%83%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E6%9B%B4%E6%8D%A2%E6%89%8B%E6%9C%BA%E5%8F%B7%E7%9A%84%E5%BC%B9%E6%A1%86.user.js
// @updateURL https://update.greasyfork.org/scripts/407030/%E8%87%AA%E7%94%A8-%E9%9B%AA%E7%90%83%E8%87%AA%E5%8A%A8%E5%85%B3%E9%97%AD%E6%9B%B4%E6%8D%A2%E6%89%8B%E6%9C%BA%E5%8F%B7%E7%9A%84%E5%BC%B9%E6%A1%86.meta.js
// ==/UserScript==

var cnt=3;
function secondStep() {
    const btn3 = document.querySelector('.modal--sm .modal__confirm__btns .modal__confirm__cancle')
    console.log("btn3=",btn3);
    btn3.click();
    cnt=cnt-1;
    if(cnt>1){
        setTimeout(secondStep, 500);
    }
}
setTimeout(secondStep, 500);

(function() {
    'use strict';
    new MutationObserver(function(mutations) {
        const button = document.querySelector('.modal--sm .modal__confirm__btns .modal__confirm__cancle')
        if (button) {
            button.click();
        }
    }).observe(document, {childList: true, subtree: true});
})();