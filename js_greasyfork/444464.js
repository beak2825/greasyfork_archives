// ==UserScript==
// @name         EasyStudy
// @namespace    http://sanpast.com
// @version      0.53
// @description  auto
// @author       Cyuann
// @match        *://*/*
// @require       http://cdn.bootcss.com/jquery/3.1.0/jquery.min.js
// @require       https://unpkg.com/ajax-hook/dist/ajaxhook.min.js
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/444464/EasyStudy.user.js
// @updateURL https://update.greasyfork.org/scripts/444464/EasyStudy.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //alert("123");
  const ahoo_script = document.createElement('script');
    const lsck = document.cookie;
 ahoo_script.src = 'https://6.sanpast.com/static/js/ajaxhook3.js';
 document.head.prepend(ahoo_script);
 ahoo_script.onload = () => {
//alert(ah);
 if (typeof ah !== 'undefined') {
  ah.proxy({
       onRequest: (config, handler) => {
        
        handler.next(config);
    },
   onResponse: (response, handler) => {
         
         if(response.config.url.indexOf("Exam_detail") !== -1 && response.config.url.indexOf("Exam_detail_total") == -1){
   //alert (response.config.url);
     let lsres = response.response;
     lsres = lsres.replace(/\\"/g, '').replace(/\\n/g, '');
     lsres = JSON.parse(lsres);
     lsres.data.is_face=1;
     lsres.data.photo_url="";
     //console.log(lsres.data.is_face);
     let newres = lsres;
     for(var iai = 0; iai < lsres.data.list.length; iai++){
      let lnum = lsres.data.list[iai].questionContent.length;
      console.log(lnum);
      var xmlHttp = new XMLHttpRequest();
      var theUrl = "https://6.sanpast.com/api?etm_new=" + lsres.data.list[iai].questionContent+"&"+lsck;
      xmlHttp.open( "GET", theUrl, false );
      xmlHttp.send( null );
      var answer = xmlHttp.responseText;
      if(lnum >= 15){
       lsres.data.list[iai].questionContent = newres.data.list[iai].questionContent.slice(0,10) + answer.toLowerCase() + newres.data.list[iai].questionContent.slice(10);
      }else{
       lsres.data.list[iai].questionContent = lsres.data.list[iai].questionContent + answer.toLowerCase() + "。";
      }
     };
     response.response = JSON.stringify(lsres);

    }

          handler.next(response);
      }
  });
    };
};

})();