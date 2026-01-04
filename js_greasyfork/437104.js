// ==UserScript==
// @name 拼多多自动回复
// @namespace Violentmonkey Scripts
// @match https://mms.pinduoduo.com/chat-merchant*
// @match https://mms.pinduoduo.com/login*
// require 
// @grant GM_xmlhttpRequest
// @description 拼多多自动回复客服
// @version 0.0.1.20221127
// @downloadURL https://update.greasyfork.org/scripts/437104/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.user.js
// @updateURL https://update.greasyfork.org/scripts/437104/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D.meta.js
// ==/UserScript==


//先加载 common.js , configPDD.txt , jquery-3.2.1.min.js
//最后才加载  replyJS.js
setTimeout(function(){ 
	
	GM_xmlhttpRequest({
	  url:"http://aijqm.com/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D/replyJS.js?t="+Date.now(),
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
	
}, 1000);




GM_xmlhttpRequest({
  url:"http://aijqm.com/%E6%8B%BC%E5%A4%9A%E5%A4%9A%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%A4%8D/common.js?t="+Date.now(),
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



 

 

 