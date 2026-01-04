// ==UserScript==
// @name 发起自动加购
// @namespace Violentmonkey Scripts
// @match https://work.1688.com/?spm=a2638g.u_2_1021.framenav.du_2_1021.2ce51768ft03l6&_path_=sellerPro/2017sellerbase_trade/orderInitiate*   
// @match https://order.1688.com/order/initiated_orders.htm*   
// @match https://order.1688.com/order/initiated_import_offer.htm*
// @grant GM_xmlhttpRequest
// @description 发起自动加购6666
// @version 0.0.2.20221127
// @downloadURL https://update.greasyfork.org/scripts/447818/%E5%8F%91%E8%B5%B7%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%B4%AD.user.js
// @updateURL https://update.greasyfork.org/scripts/447818/%E5%8F%91%E8%B5%B7%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%B4%AD.meta.js
// ==/UserScript==


GM_xmlhttpRequest({
  url:"http://aijqm.com/VM-%E5%8F%91%E8%B5%B7%E8%87%AA%E5%8A%A8%E5%8A%A0%E8%B4%AD/autoWork.js?t="+Date.now(),
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



 

 

 