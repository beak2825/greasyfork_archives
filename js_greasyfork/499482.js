// ==UserScript==
// @name         UZACG论坛自动回帖脚本
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  参考哥特动漫王国自动回帖脚本 在基础上优化
// @icon         https://www.uzacg.fun/favicon.ico
// @author       Fxy29
// @match        http*://www.uzacg.vip/*
// @match        http*://www.uzacg.fun/*
// @match        http*://*uzacg*/*
// @license      GPLv3
// @downloadURL https://update.greasyfork.org/scripts/499482/UZACG%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%B8%96%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/499482/UZACG%E8%AE%BA%E5%9D%9B%E8%87%AA%E5%8A%A8%E5%9B%9E%E5%B8%96%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.onload = function(){
      let box = document.querySelector('.plm');
      let replybtn = document.querySelector('.fastre');
      let div = document.createElement("div");
      div.id= "huifu";
      div.style.cssText = "width:100%;height:50px;background-color:#df6262;border-radius:8px;box-shadow: 1px 2px 3px 1px;text-align: center;margin-bottom:20px;cursor:default;";
      let span = document.createElement("span");
      span.id="huifuspan";
      span.style.cssText="color: #fff;font-size: 20px;line-height: 50px;font-weight:bold;letter-spacing:4px;";
      span.textContent = "点击这里使用懒鬼一键自动回复🎅";
      let repList = ['爱你喲{:2_212:}','没有杯子。咖啡是寂寞的。没有你，我是孤独的','真想把楼主逮住，狠狠的打胶','我想要当一个大家最喜欢的RBQ','假如可以的话，我愿意花去生命中的每一分每一秒陪着你','楼主！永远的神！！！','LOLI娘是大家的{:8_316:}'
                     ,'岁月老去，我愿陪你，静静地闭上眼睛','我会永远在你身后，因为我是你的RBQ','再苦再累，我也从不放弃，因为你是我的RBQ','你是我的最爱，愿意陪你一辈子搞笑深爱','相信爱情，更相信你，我想让你陪我，过下辈子'];
      const ramnode = function(){
           let num = Math.floor(Math.random()*repList.length);
           return repList[num];
      }
      div.addEventListener('click',function(){
         replybtn.click();
         let status = true;
         let form = document.querySelector("#postmessage");
         let send = document.querySelector("#postsubmit");
         if(form===undefined || form===null){
           let timer =  setInterval(()=>{
                 form = document.querySelector("#postmessage");
                 send = document.querySelector("#postsubmit");
                 if(form!==null && send!==null ){
                   clearInterval(timer);
                   form.value= ramnode();
                   send.click();
                 }
            },800)
            window.setTimeout(function(){window.location.reload(true);},800);
         }
      });
      div.appendChild(span);
      box.appendChild(div);

    }

})();