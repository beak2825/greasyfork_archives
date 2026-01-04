// ==UserScript==
// @name         yanxiu教师研修网-2024_请自行配合大漠插件-全自动代刷VX：shuake345
// @namespace    慢速脚本
// @version      0.1
// @description  慢速脚本|自动看课程|全自动代刷VX：shuake345
// @author       VX：shuake345
// @match        https://ipx.yanxiu.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yanxiu.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/496360/yanxiu%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%BD%91-2024_%E8%AF%B7%E8%87%AA%E8%A1%8C%E9%85%8D%E5%90%88%E5%A4%A7%E6%BC%A0%E6%8F%92%E4%BB%B6-%E5%85%A8%E8%87%AA%E5%8A%A8%E4%BB%A3%E5%88%B7VX%EF%BC%9Ashuake345.user.js
// @updateURL https://update.greasyfork.org/scripts/496360/yanxiu%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E7%BD%91-2024_%E8%AF%B7%E8%87%AA%E8%A1%8C%E9%85%8D%E5%90%88%E5%A4%A7%E6%BC%A0%E6%8F%92%E4%BB%B6-%E5%85%A8%E8%87%AA%E5%8A%A8%E4%BB%A3%E5%88%B7VX%EF%BC%9Ashuake345.meta.js
// ==/UserScript==

(function() {
    'use strict';


    

    function sx(){window.location.reload()}

    /*function qt(){
    document.getElementsByClassName('ended')[0].innerHTML="<img style=\"width:230px; height:230px;\" src='https://img.nuannian.com/files/images/22/0921/1663766968-1460.jpg'>"
    }//宣传用的图片
    setInterval(qt,3000)*/
    function Pd(){//判断没有看完的视频
        if(document.URL.search('train')>1){
            if(document.getElementsByClassName('item-infos default').length>0){
            var FirNoOk=document.getElementsByClassName('item-infos default')
            //有未看完的
                setTimeout(sx,300000)
                clearInterval(Pds)
                FirNoOk[0].previousElementSibling.click()
            }else if(document.getElementsByClassName('item-infos default').length==0){//本页看完了
            document.getElementsByClassName('ivu-page-next')[0].click()
            }
//_____________________________主页-----次页分割线------------------------------------------
        }else if(document.URL.search('grain')>1){//次页

             if(document.getElementsByClassName('rate-item').length==10){//平五颗星
                 if(document.getElementsByClassName('scoring-wrapper')[0].style[0]!=='display'){//！==,评分显示出来为空,==没显示出来了
                     document.getElementsByClassName('ivu-btn ivu-btn-primary')[0].click()
                 }
                 }

             if(document.getElementsByClassName('text').length!==0){
             document.getElementsByClassName('text')[0].click()//点我继续计时
             }
             if(document.getElementsByTagName('video').length==1){//是视频，不是文档
             document.getElementsByTagName('video')[0].volume=0
                 if(document.getElementsByClassName('ended-mask')[0].style[0]==undefined){
                 document.getElementsByClassName('replay')[0].click()
                 }
             }else if(document.getElementsByClassName('next').length==1){
                 document.getElementsByClassName('next')[0].click()
             }//如果是文档，就找到有视频为止

            // document.getElementsByClassName('next')[0].click()//下一个

         }
    }
     var Pds=setInterval(Pd,3000)

})();