// ==UserScript==
// @name        zt 
// @namespace   Violentmonkey Scripts
// @match       https://pc.xuexi.cn/*
// @grant       none
// @version     1.1
// @author      -
// @description 1
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/435696/zt.user.js
// @updateURL https://update.greasyfork.org/scripts/435696/zt.meta.js
// ==/UserScript==
(function() {
  console.log("GOGOGO");
  function sleep (time) {
      return new Promise((resolve) => setTimeout(resolve, time));
  }
  
  var f = 1;
  
  function func(){
    window.setInterval(function findAndClick(){
      	//var ls = $(".button ant-btn-primary");
      var ls = document.getElementsByClassName("button ant-btn-primary");
        //console.log(ls);
      sleep(2000).then(() =>{
      console.log("length .."+ls.length);
      for(var id = 0; id < ls.length; id++){
        var elm = ls[id];
        var te = elm.innerText;
        if(1 == f){
          if(te.indexOf("继")==0 || te.indexOf("开")==0){
            f = 0;
            //console.log(te);
            elm.click();
            break;
          }
        }
      }

      if(1 == f){
            console.log("IM IN");
            document.getElementsByClassName("ant-pagination-item-link")[1].click();
      }
    });
  },7000);
  }
  
  func();

})();