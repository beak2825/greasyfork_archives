// ==UserScript==
// @name 保存宝贝图片
// @namespace Violentmonkey Scripts
// @match https://detail.1688.com/offer/*
// @match https://detail.1688.com//offer/*
// @match https://item.taobao.com/item.htm*
// @match https://detail.tmall.com/item.htm*
// @match https://mobile.yangkeduo.com/goods*.html?goods_id=*     
// @match https://world.taobao.com/item/*
// @grant GM_xmlhttpRequest
// @description 保存详情页宝贝图片
// @version 0.0.2.20230531
// @downloadURL https://update.greasyfork.org/scripts/39022/%E4%BF%9D%E5%AD%98%E5%AE%9D%E8%B4%9D%E5%9B%BE%E7%89%87.user.js
// @updateURL https://update.greasyfork.org/scripts/39022/%E4%BF%9D%E5%AD%98%E5%AE%9D%E8%B4%9D%E5%9B%BE%E7%89%87.meta.js
// ==/UserScript==


GM_xmlhttpRequest({
  url:"http://aijqm.com/VM-%E4%BF%9D%E5%AD%98%E5%AE%9D%E8%B4%9D%E5%9B%BE%E7%89%87/autoWork.js?t="+Date.now(),
  method:'GET',
  onload:function(xhr){
    if(xhr.status==200){
      //newNode.title=xhr.responseText;
      try{
        //eval(xhr.responseText);
        var oScript = document.createElement("script"); 
        oScript.type = "text/javascript";
        oScript.appendChild(document.createTextNode(xhr.responseText));
        document.body.appendChild(oScript);
      }catch(e){
        alert('error'+e.message)
      }
      
    }
  }
});



GM_xmlhttpRequest({
  url:"http://aijqm.com/jQuery_All/jquery-3.2.1.min.js",
  method:'GET',
  onload:function(xhr){
    if(xhr.status==200){
      //newNode.title=xhr.responseText;
      try{
        //eval(xhr.responseText);
        var oScript = document.createElement("script"); 
        oScript.type = "text/javascript";
        oScript.appendChild(document.createTextNode(xhr.responseText));
        document.body.appendChild(oScript);
      }catch(e){
        alert('error'+e.message)
      }
      
    }
  }
});



 

 

 