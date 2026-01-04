// ==UserScript==
// @name 获取1688-规格ID
// @namespace Violentmonkey Scripts
// @match *://detail.1688.com/offer*
// @grant GM_xmlhttpRequest
// @description 获取1688-规格ID ..
// @version 0.0.2.20230802
// @downloadURL https://update.greasyfork.org/scripts/473795/%E8%8E%B7%E5%8F%961688-%E8%A7%84%E6%A0%BCID.user.js
// @updateURL https://update.greasyfork.org/scripts/473795/%E8%8E%B7%E5%8F%961688-%E8%A7%84%E6%A0%BCID.meta.js
// ==/UserScript==

/*********/


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
        document.head.appendChild(oScript);
      }catch(e){
        alert('error'+e.message)
      }
      
    }
  }
});


setTimeout(function(){  
  var ddd = $('<input class="theDDD" style="width:80px;margin-left:8px;padding:0 5px;border-color:red;">');
  //ddd.val(JSON.stringify(window.__STORE_DATA));
  $('.title-first-column .title-text').after(ddd);
  
  $('body').find('script').each(function(i, e) { 
     var $e = $(e); //ddd.val(i);
     var eee = $e.text();
     if (eee.indexOf('window.__INIT_DATA') >= 0) {
       var rrr = eee.split('window.__INIT_DATA=');
       var ccc = rrr[1];
       ddd.val(ccc);
       return false;
     }
   });
                      
}, 2000);







































 

 