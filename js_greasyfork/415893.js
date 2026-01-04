// ==UserScript==
// @name 复制腾讯地图-新
// @namespace Violentmonkey Scripts
// @match *://map.qq.com/*
// @grant GM_xmlhttpRequest
// @description 复制腾讯地图-新 6666
// @version 0.0.2.20220906
// @downloadURL https://update.greasyfork.org/scripts/415893/%E5%A4%8D%E5%88%B6%E8%85%BE%E8%AE%AF%E5%9C%B0%E5%9B%BE-%E6%96%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/415893/%E5%A4%8D%E5%88%B6%E8%85%BE%E8%AE%AF%E5%9C%B0%E5%9B%BE-%E6%96%B0.meta.js
// ==/UserScript==



/*********/
GM_xmlhttpRequest({
  url:"http://aijqm.com/VM-复制腾讯地图/autoWork.js?t="+Date.now(),
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


/*
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
*/


 

 

 