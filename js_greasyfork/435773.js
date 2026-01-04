// ==UserScript==
// @name         广东省中小学教师信息技术应用能提升工程培训2.0-jstsgc.gdedu-试用版
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  浩浩逆天
// @author       浩浩
// @match        *.ttcn.cn/*
// @match        *jstsgc.gdedu.gov.cn/info2/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435773/%E5%B9%BF%E4%B8%9C%E7%9C%81%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E5%B8%88%E4%BF%A1%E6%81%AF%E6%8A%80%E6%9C%AF%E5%BA%94%E7%94%A8%E8%83%BD%E6%8F%90%E5%8D%87%E5%B7%A5%E7%A8%8B%E5%9F%B9%E8%AE%AD20-jstsgcgdedu-%E8%AF%95%E7%94%A8%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/435773/%E5%B9%BF%E4%B8%9C%E7%9C%81%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E5%B8%88%E4%BF%A1%E6%81%AF%E6%8A%80%E6%9C%AF%E5%BA%94%E7%94%A8%E8%83%BD%E6%8F%90%E5%8D%87%E5%B7%A5%E7%A8%8B%E5%9F%B9%E8%AE%AD20-jstsgcgdedu-%E8%AF%95%E7%94%A8%E7%89%88.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    // Your code here...
    var end=13000
    var n=0
    document.addEventListener("visibilitychange", function() {
    //console.log(document.visibilityState);
    if(document.visibilityState == "hidden") {
        //console.log('隐藏');
        //window.close()
    } else if (document.visibilityState == "visible") {
        //console.log('显示')
        if(document.URL.search('home.action')>1){
            n+=1
            if(document.getElementsByClassName('training-btn').length>n)
            {setTimeout(主页,1000)}
        }
    }
});
    function sx(){
        window.location.reload()
    }
 
//主页改变后点播放
function 主页(){
     document.getElementsByClassName('training-btn')[n].children[0].click()
    }
    //var zhuye1=setInterval(主页,30000)
 
//次页
       function kc(){
            if(document.getElementsByClassName('anticon anticon-close-circle').length>0){window.close()}
           if(document.URL.search('jti=')>1){
           if(document.getElementsByClassName('un').length==0){window.close()}else{document.getElementsByClassName('ant-btn')[0].click()}
           }
        }
setInterval(kc,2000)
//点击未学
   function ss(){
      if(document.getElementsByClassName('customcur-tab-text').length>0){
          document.getElementsByClassName('customcur-tab-text')[1].click()
         // clearInterval(ss1)
      }
   }
 var ss1=setInterval(ss,3000)
 //播放
 function bf(){
     if(document.URL.search('.ttcn.cn/study/study')>1){
     if(document.getElementsByTagName('video').length==1){
     document.getElementsByTagName('video')[0].play()
     document.getElementsByTagName('video')[0].currentTime=end
     console.log('播放中')
     }
         if(document.getElementsByClassName('ant-btn')[2].innerText=="下一活动"){document.getElementsByClassName('ant-btn')[2].click()}
     }
     }
    setInterval(bf,20000)
    window.onload=function zy(){
    if(document.getElementsByClassName('training-btn').length>0){
    document.getElementsByClassName('training-btn')[0].children[0].click()
    }}
 
})();