// ==UserScript==
// @name        智家网十大品牌评选投票
// @namespace        https://greasyfork.org/zh-CN/scripts/479212
// @description        智家网十大品牌评选未检测投票IP，在PC可以通过清除cookie进行无限制投票。
// @description        请在源码中查看bind-id值，把要投票的品牌或企业的值填写在下面代码中。
// @description        if(hm[i].getAttribute("bind-id")=='936'){//708，修改这句中的数字936为实际的bind-id值。
// @description        每1秒执行一次本脚本，即可实际按秒进行投票。
// @version           1.4
// @license           LGPLv3
// @match             *://*.znjj.tv/*
// @downloadURL https://update.greasyfork.org/scripts/479212/%E6%99%BA%E5%AE%B6%E7%BD%91%E5%8D%81%E5%A4%A7%E5%93%81%E7%89%8C%E8%AF%84%E9%80%89%E6%8A%95%E7%A5%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/479212/%E6%99%BA%E5%AE%B6%E7%BD%91%E5%8D%81%E5%A4%A7%E5%93%81%E7%89%8C%E8%AF%84%E9%80%89%E6%8A%95%E7%A5%A8.meta.js
// ==/UserScript==
(function() {
  'use strict';
       console.log(document.cookie);
       function getCookie($name){
            var data=document.cookie;
            var dataArray=data.split("; ");
          for(var i=0;i<dataArray.length;i++){
              var varName=dataArray[i].split("=");
                if(varName[0]==$name){
                     return decodeURI(varName[1]);
                }

         }
      }
       //删除cookie中所有定变量函数
       function delAllCookie(){
            var myDate=new Date();
            myDate.setTime(-1000);//设置时间
            var data=document.cookie;
            var dataArray=data.split("; ");
            for(var i=0;i<dataArray.length;i++){
                 var varName=dataArray[i].split("=");
                 document.cookie=varName[0]+"=''; expires="+myDate.toGMTString();
            }

      }
delAllCookie();
setTimeout(function(){
        var hm = document.querySelectorAll(".tp");
        for(var i=0;i<hm.length;i++){
            if(hm[i].getAttribute("bind-id")=='936'){//708
                hm[i].click();
                //alert(hm[i].getAttribute("bind-id"));
            }
        }
    },"200");

setTimeout(
function()
{
   window.location.reload();
}
    ,1000); //延迟1秒执行
  //init();
})();