// ==UserScript==
// @name         根据用户名获取账户UID
// @namespace    Jndong
// @version      1.1
// @description  获取UID
// @author       la rui
// @match        https://shenghuo.alipay.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/491301/%E6%A0%B9%E6%8D%AE%E7%94%A8%E6%88%B7%E5%90%8D%E8%8E%B7%E5%8F%96%E8%B4%A6%E6%88%B7UID.user.js
// @updateURL https://update.greasyfork.org/scripts/491301/%E6%A0%B9%E6%8D%AE%E7%94%A8%E6%88%B7%E5%90%8D%E8%8E%B7%E5%8F%96%E8%B4%A6%E6%88%B7UID.meta.js
// ==/UserScript==

(function() {

    let url =  window.location.href


    function setObjValue(){
      let optUserId =  document.getElementsByName('optUserId')[0].value
      let optEmail = document.getElementsByName('optEmail')[0].value

      if(optUserId!=null){
        // 显示数据
        document.getElementsByName('optUserId')[0].setAttribute("type","text")
        document.getElementsByName('optEmail')[0].setAttribute("type","text")

        // 删除提交按钮 防止 出现问题
        document.getElementById('nextbtn').remove();

        clearInterval(loader)
      }
    }

    // 主动收款 判断地址
    if(url.indexOf('confirm.htm')>0){
      var loader = setInterval(function(){
        setObjValue()
      }, 50)
    }


    // 主动转账 判断地址
    if(url.indexOf('fill.htm')>0){

      var loader2 =  setInterval(function(){
        let optUserId = document.getElementById('optUserId').value.length;

        if(optUserId>0){
          document.getElementById('optUserId').setAttribute("type","text");
          document.getElementById('hiddenAccount').setAttribute("type","text")

          //clearInterval(loader2)
        }

      },50)

    }

})();