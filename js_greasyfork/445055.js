// ==UserScript==
// @name        公众号留言快捷复制
// @namespace   Violentmonkey Scripts
// @match       https://mp.weixin.qq.com/misc/appmsgcomment*
// @grant       none
// @version     1.0
// @author      helfee
// @description 2022-5-13
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/445055/%E5%85%AC%E4%BC%97%E5%8F%B7%E7%95%99%E8%A8%80%E5%BF%AB%E6%8D%B7%E5%A4%8D%E5%88%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/445055/%E5%85%AC%E4%BC%97%E5%8F%B7%E7%95%99%E8%A8%80%E5%BF%AB%E6%8D%B7%E5%A4%8D%E5%88%B6.meta.js
// ==/UserScript==


(function() {
    'use strict';
    var button = document.createElement("div");
  button.class='txt'
    button.textContent = "复制留言";
    button.style.width = "41px";
    button.style.height = "50px";
    button.style.align = "center";
    button.style.color = "white";
    button.style.background = "green";
    button.style.borderRadius = "8px";
    
    button.addEventListener("click", clickBotton)
   
    document.getElementsByClassName('weui-desktop-online-faq__switch_content')[0].appendChild(button)
  
    function clickBotton(){
          let as=""
          $("#commentlist .weui-desktop-panel__bd div.comment-list__item-container.comment-list__item-container_with-line ").each(function(){
           // alert($(this).$(' .comment-text').text())
          let a = $(this).find(".weui-desktop-popover__target").text().removeBlankLines()
          let c = $(this).find(".comment-text").text().removeBlankLines()
          let t = $(this).find(".comment-list__item-time").text().removeBlankLines()
          
            if (c!="留言已被用户删除"){
              as+=a+"\t"+t+"\t"+c+"\n"
            }

          });
          if (navigator.clipboard) {
          navigator.clipboard.writeText(as);
          }

    }
  
})(); 

String.prototype.removeBlankLines = function () {
    return this.replace(/\s/g,'')
}
