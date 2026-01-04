// ==UserScript==
// @name         设置B站的视频倍速,把消息和状态显示的更新个数隐藏掉
// @namespace    https://bbs.tampermonkey.net.cn/
// @version      0.1.2
// @description  最近看的是直播回放的视频，所以写个倍速，看见烦，老想点，所以我要隐藏掉，我不想看到
// @icon         https://www.wandhi.com//favicon.ico
// @match        https://www.bilibili.com/video/*
// @match        https://www.bilibili.com/
// @author       xiaoxiami
// @grant        GM_addStyle
// @grant        GM_addStyle
// @grant        unsafeWindow
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/447015/%E8%AE%BE%E7%BD%AEB%E7%AB%99%E7%9A%84%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%2C%E6%8A%8A%E6%B6%88%E6%81%AF%E5%92%8C%E7%8A%B6%E6%80%81%E6%98%BE%E7%A4%BA%E7%9A%84%E6%9B%B4%E6%96%B0%E4%B8%AA%E6%95%B0%E9%9A%90%E8%97%8F%E6%8E%89.user.js
// @updateURL https://update.greasyfork.org/scripts/447015/%E8%AE%BE%E7%BD%AEB%E7%AB%99%E7%9A%84%E8%A7%86%E9%A2%91%E5%80%8D%E9%80%9F%2C%E6%8A%8A%E6%B6%88%E6%81%AF%E5%92%8C%E7%8A%B6%E6%80%81%E6%98%BE%E7%A4%BA%E7%9A%84%E6%9B%B4%E6%96%B0%E4%B8%AA%E6%95%B0%E9%9A%90%E8%97%8F%E6%8E%89.meta.js
// ==/UserScript==
 
(function() {
    'use strict';

    if(window.location.href == 'https://www.bilibili.com/'){
        setTimeout(() => {
            let getNumDiv = document.getElementsByClassName("num");
            if(getNumDiv){
                if(getNumDiv.length > 1){
                    for(let i=0;i<getNumDiv.length;i++){
                        getNumDiv[i].style.display="none"
                    }
                }else{
                    getNumDiv[0].style.display="none"
                }
            }
        },2000)

    } else {
        var div = document.createElement("div");
        div.innerHTML="<div class='three'>3倍速</div><div class='five'>5倍速</div><div class='ten'>10倍速</div><div class='hideMessage'>隐藏消息和动态显示个数</div>"
        //为div创建属性class = "beisuDiv"
        var divattr = document.createAttribute("class");
        divattr.value = "beisuDiv";
        //把属性class = "beisuDiv"添加到div
        div.setAttributeNode(divattr);
        document.body.appendChild(div);
        let controlThreeDiv = document.getElementsByClassName("three")[0];
        let controlfiveDiv = document.getElementsByClassName("five")[0];
        let controlTenDiv = document.getElementsByClassName("ten")[0];
        let controlHideMessage = document.getElementsByClassName("hideMessage")[0];
        controlThreeDiv.addEventListener("click", ()=>{
            document.querySelector('bwp-video').playbackRate = 3 
            alert("你已经设置为3倍速")
        })
        controlfiveDiv.addEventListener("click", ()=>{
            document.querySelector('bwp-video').playbackRate = 5
            alert("你已经设置为5倍速")
        })
        controlTenDiv.addEventListener("click", ()=>{
            document.querySelector('bwp-video').playbackRate = 10
            alert("你已经设置为10倍速")
        })
        controlHideMessage.addEventListener("click", ()=>{
            let getNumDiv = document.getElementsByClassName("num");
            if(getNumDiv){
                if(getNumDiv.length > 1){
                    for(let i=0;i<getNumDiv.length;i++){
                        getNumDiv[i].style.display="none"
                    }
                }else{
                    getNumDiv[0].style.display="none"
                }
            }
        })

        }
 
	

 
 
})();
GM_addStyle(`
  .beisuDiv {
       position: absolute;
       top: 25vh;
       left: 0vw;
       background: white;
       z-index:999;
  }
  .three {
      background-color:skyblue;
      margin-bottom: 5px;
      cursor: pointer
  }
  .five {
      background-color:orange;
      margin-bottom: 5px;
      cursor: pointer
  }
  .ten {
      background-color:pink;
      margin-bottom: 5px;
      cursor: pointer;
      
  }
  .hideMessage {
      background-color:skyblue;
      cursor: pointer;
  }
`)