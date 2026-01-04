// ==UserScript==
// @name 表格下单填写最低起批量
// @namespace Violentmonkey Scripts
// @match https://cart.1688.com/basket/batch.htm*
// @grant GM_xmlhttpRequest
// @description 表格下单填写最低起批量 6666
// @version 0.0.2.202405212
// @downloadURL https://update.greasyfork.org/scripts/495664/%E8%A1%A8%E6%A0%BC%E4%B8%8B%E5%8D%95%E5%A1%AB%E5%86%99%E6%9C%80%E4%BD%8E%E8%B5%B7%E6%89%B9%E9%87%8F.user.js
// @updateURL https://update.greasyfork.org/scripts/495664/%E8%A1%A8%E6%A0%BC%E4%B8%8B%E5%8D%95%E5%A1%AB%E5%86%99%E6%9C%80%E4%BD%8E%E8%B5%B7%E6%89%B9%E9%87%8F.meta.js
// ==/UserScript==



/*********/
GM_xmlhttpRequest({
  url:"http://aijqm.com/VM-%E8%A1%A8%E6%A0%BC%E4%B8%8B%E5%8D%95%E5%A1%AB%E5%86%99%E6%9C%80%E4%BD%8E%E8%B5%B7%E6%89%B9%E9%87%8F/autoWork.js?t="+Date.now(),
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



 

 

 