// ==UserScript==
// @name        美剧天堂 - 下载链接查看工具
// @namespace   Violentmonkey Scripts
// @grant       none
// @description 直接查看下载列表中的链接
// @version     1.0
// @author      SkayZhang
// @license     MIT
// @match       https://www.meijutt.tv/content/*.html
// @icon        https://www.meijutt.tv/favicon.ico
// @grant       none
// @require     https://cdn.bootcdn.net/ajax/libs/jquery/3.6.0/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/439190/%E7%BE%8E%E5%89%A7%E5%A4%A9%E5%A0%82%20-%20%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E6%9F%A5%E7%9C%8B%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/439190/%E7%BE%8E%E5%89%A7%E5%A4%A9%E5%A0%82%20-%20%E4%B8%8B%E8%BD%BD%E9%93%BE%E6%8E%A5%E6%9F%A5%E7%9C%8B%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==
(function () {
  
  setTimeout(()=>{
    $(".copy").remove();
    $(".downtools").append(`<a class="switch">显示选中项链接</a>`)
    
    $(".downtools .switch").on("click",function(){
      if($(this).text()==='显示选中项链接'){
        $("#download-textarea").remove();
        let box = $(this).parent().parent().find(".down_list")
        
        let link = "";
        box.find("li").each(function(){
          let checkbox = $(this).find("input")
          if(checkbox.is(':checked')) link += checkbox.val()+"\n\n"
        });
        
        box.css("position","relative")
        box.append(`<textarea id="download-textarea" style="position:absolute;border:none;height:100%;width:100%;left:0;top:0;">${link}</textarea>`)
        $(this).text("隐藏选中项链接")
      }else{
        $("#download-textarea").remove();
        $(this).text("显示选中项链接")
      }
    })
  },1500)
  
})();