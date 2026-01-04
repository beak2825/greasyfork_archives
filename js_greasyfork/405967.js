// ==UserScript==
// @name         设置支付宝余额
// @namespace    setaccount
// @version      1.0
// @description  设置支付宝PC页面余额
// @author       shac
// @match        https://my.alipay.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/405967/%E8%AE%BE%E7%BD%AE%E6%94%AF%E4%BB%98%E5%AE%9D%E4%BD%99%E9%A2%9D.user.js
// @updateURL https://update.greasyfork.org/scripts/405967/%E8%AE%BE%E7%BD%AE%E6%94%AF%E4%BB%98%E5%AE%9D%E4%BD%99%E9%A2%9D.meta.js
// ==/UserScript==

(function() {
    var textArr={
        account:['<strong class="fen"><span class="fen">**.**</span></strong> 元', '<span class="df-integer">10004200<span class="df-decimal">.12</span></span>元'],
        yuebao:['<strong class="fen"><span class="fen">**.**</span></strong> 元', '<span class="df-integer">2932500<span class="df-decimal">.03</span></span>元'],
    }
    var obj = [document.getElementById('account-amount-container'), document.getElementById('J-assets-mfund-amount')];
    var btn = [document.getElementById('showAccountAmount'), document.getElementById('showYuebaoAmount')];

    function setObjValue(){
        if(btn[0].className.indexOf('hide-amount') > -1){
            obj[0].innerHTML = textArr.account[0];
        }else{
            obj[0].innerHTML = textArr.account[1];
        }

        if(btn[1].className.indexOf('hide-amount') > -1){
            obj[1].innerHTML = textArr.yuebao[0];
        }else{
            obj[1].innerHTML = textArr.yuebao[1];
        }
    }
    var loader = setInterval(function(){
        setObjValue()
    }, 50)
})();