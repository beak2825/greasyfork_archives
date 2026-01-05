// ==UserScript==
// @name 饭否-关注前弹出确认
// @version 1.1
// @author HackMyBrain
// @description 关注饭否er前弹出确认提示以避免鼠标误击.
// @include http://fanfou.com/*
// @namespace https://greasyfork.org/users/2844
// @downloadURL https://update.greasyfork.org/scripts/2522/%E9%A5%AD%E5%90%A6-%E5%85%B3%E6%B3%A8%E5%89%8D%E5%BC%B9%E5%87%BA%E7%A1%AE%E8%AE%A4.user.js
// @updateURL https://update.greasyfork.org/scripts/2522/%E9%A5%AD%E5%90%A6-%E5%85%B3%E6%B3%A8%E5%89%8D%E5%BC%B9%E5%87%BA%E7%A1%AE%E8%AE%A4.meta.js
// ==/UserScript==


(function (){
    var foConfirm = function (e){
        if (/\/friend\.add\/|\/friend\.acceptadd\//.test(e.target.href)){
            if (!confirm('确实要关注 ?')){
                e.stopPropagation();
                e.preventDefault();
            } else if (!confirm('真的确实要关注 ?')){
                e.stopPropagation();
                e.preventDefault();
            }
        }
    }
    
    window.addEventListener('click', foConfirm, true);
})();