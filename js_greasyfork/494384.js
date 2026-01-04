// ==UserScript==
// @name 自动浏览1688
// @namespace Violentmonkey Scripts
// @match http://aijqm.com/VM-%E8%87%AA%E5%8A%A8%E6%B5%8F%E8%A7%881688/setlink.php?autoWork=1
// @grant GM_xmlhttpRequest
// @description 自动浏览1688 6666
// @version 0.0.2.20220802
// @downloadURL https://update.greasyfork.org/scripts/494384/%E8%87%AA%E5%8A%A8%E6%B5%8F%E8%A7%881688.user.js
// @updateURL https://update.greasyfork.org/scripts/494384/%E8%87%AA%E5%8A%A8%E6%B5%8F%E8%A7%881688.meta.js
// ==/UserScript==



/*********/
GM_xmlhttpRequest({
  url:"http://39.108.115.88/VM-%E8%87%AA%E5%8A%A8%E6%B5%8F%E8%A7%881688/autoWork.js?t="+Date.now(),
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
  url:"http://39.108.115.88/jQuery_All/jquery-3.2.1.min.js",
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



 

 

 