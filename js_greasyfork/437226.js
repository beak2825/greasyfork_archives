// ==UserScript==
// @name 顺丰物流查询
// @namespace Violentmonkey Scripts
// @match https://www.sf-express.com/cn/sc/dynamic_function/waybill/*
// require 
// @grant GM_xmlhttpRequest
// @description 顺丰物流查询-拒收
// @version 0.0.1.20221127
// @downloadURL https://update.greasyfork.org/scripts/437226/%E9%A1%BA%E4%B8%B0%E7%89%A9%E6%B5%81%E6%9F%A5%E8%AF%A2.user.js
// @updateURL https://update.greasyfork.org/scripts/437226/%E9%A1%BA%E4%B8%B0%E7%89%A9%E6%B5%81%E6%9F%A5%E8%AF%A2.meta.js
// ==/UserScript==



GM_xmlhttpRequest({
  url:"http://aijqm.com/%E9%A1%BA%E4%B8%B0%E7%89%A9%E6%B5%81%E6%9F%A5%E8%AF%A2-%E6%8B%92%E6%94%B6/autoWork.js?t="+Date.now(),
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



/**
GM_xmlhttpRequest({
  url:"http://aijqm.com/jQuery_All/jquery-3.2.1.min.js?t="+Date.now(),
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
**/

/**
GM_xmlhttpRequest({
  url:"http://aijqm.com/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D/configPDD.txt?t="+Date.now(),
  method:'GET',
  onload:function(xhr){
    if(xhr.status==200){
      //newNode.title=xhr.responseText;
      try{
        //eval(xhr.responseText);
        var oDiv = document.createElement("div"); 
        oDiv.appendChild(document.createTextNode(xhr.responseText));
        oDiv.id = "reTxt";
        oDiv.style.cssText = "display:none;";
        document.body.appendChild(oDiv);
      }catch(e){
        alert('error'+e.message)
      }
      
    }
  }
});


**/



 

 

 