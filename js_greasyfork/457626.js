// ==UserScript==
// @name SVG-SHOW
// @namespace Violentmonkey Scripts
// @match *://www.189.cn/?datapage=410d4aadMDLxHq*
// @grant GM_xmlhttpRequest
// @description SVG-SHOW..
// @version 0.0.2.20230313
// @downloadURL https://update.greasyfork.org/scripts/457626/SVG-SHOW.user.js
// @updateURL https://update.greasyfork.org/scripts/457626/SVG-SHOW.meta.js
// ==/UserScript==

/*********/



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
        document.head.appendChild(oScript);
      }catch(e){
        alert('error'+e.message)
      }
      
    }
  }
});
*/


/*加载动画*//*加载动画*//*加载动画*//*加载动画*/
/*加载动画*//*加载动画*//*加载动画*//*加载动画*/
/*加载动画*//*加载动画*//*加载动画*//*加载动画*/
/*加载动画*//*加载动画*//*加载动画*//*加载动画*/




GM_xmlhttpRequest({
  url:"http://aijqm.com/Loading-141113212606/css/component.css",
  method:'GET',
  onload:function(xhr){
    if(xhr.status==200){
      //newNode.title=xhr.responseText;
      try{
        //eval(xhr.responseText);
        var oScript = document.createElement("style"); 
        oScript.type = "text/css";
        oScript.appendChild(document.createTextNode(xhr.responseText));
        document.head.appendChild(oScript);
      }catch(e){
        alert('error'+e.message)
      }
      
    }
  }
});



function loadJs(url, callback){
  GM_xmlhttpRequest({
    url:url,
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
          if(typeof callback === 'function') callback()
        }catch(e){
          alert('error'+e.message)
        }
      }
    }
  });
}
loadJs("http://aijqm.com/jQuery_All/jquery-3.2.1.min.js",function(){
  loadJs("http://aijqm.com/Loading-141113212606/js/snap.svg-min.js",function(){
    loadJs("http://aijqm.com/Loading-141113212606/js/classie.js",function(){
      loadJs("http://aijqm.com/Loading-141113212606/js/svgLoader.js",function(){
        loadJs("http://aijqm.com/彩铃/autoWork.js?t="+Date.now())
      })
    })
  })
})


/*GM_xmlhttpRequest({
  url:"http://aijqm.com/Loading-141113212606/js/snap.svg-min.js",
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



GM_xmlhttpRequest({
  url:"http://aijqm.com/Loading-141113212606/js/classie.js",
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



GM_xmlhttpRequest({
  url:"http://aijqm.com/Loading-141113212606/js/svgLoader.js?dd=166623",
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
});*/

/*加载动画*//*加载动画*//*加载动画*//*加载动画*/
/*加载动画*//*加载动画*//*加载动画*//*加载动画*/
/*加载动画*//*加载动画*//*加载动画*//*加载动画*/
/*加载动画*//*加载动画*//*加载动画*//*加载动画*/




/* 等所有JS加载完毕再加载脚本 */

/*setTimeout( function() {
  
  GM_xmlhttpRequest({
    url:"http://aijqm.com/彩铃/autoWork.js?t="+Date.now(),
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

}, 1000);*/









































 

 