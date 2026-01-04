// ==UserScript==
// @name         乌鲁木齐建设职业培训中心-wlmqcol.com
// @namespace    代刷vx:shuake345
// @version      0.2
// @description  代刷vx:shuake345
// @author       代刷vx:shuake345
// @match        *://*.wlmqcol.com/course/*
// @icon         https://www.wlmqcol.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473960/%E4%B9%8C%E9%B2%81%E6%9C%A8%E9%BD%90%E5%BB%BA%E8%AE%BE%E8%81%8C%E4%B8%9A%E5%9F%B9%E8%AE%AD%E4%B8%AD%E5%BF%83-wlmqcolcom.user.js
// @updateURL https://update.greasyfork.org/scripts/473960/%E4%B9%8C%E9%B2%81%E6%9C%A8%E9%BD%90%E5%BB%BA%E8%AE%BE%E8%81%8C%E4%B8%9A%E5%9F%B9%E8%AE%AD%E4%B8%AD%E5%BF%83-wlmqcolcom.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var iframes=document.querySelector('iframe')
    function cy11(){

        document.querySelector('iframe').contentWindow.document.getElementsByTagName('video')[0].play()
    }
    setInterval(cy11,8424)
    function cy22(){

        document.querySelector('iframe').contentWindow.document.querySelector("#time-pause-dialog > div > div > div > div.text-right.mt20 > a").click()

    }
    setInterval(cy22,18424)
    function cy33(){

        if(document.getElementsByClassName('btn btn-gray text-sm js-learn-prompt js-learn-video-prompt')[0].className!=='btn btn-gray text-sm js-learn-prompt js-learn-video-prompt open'){
            document.querySelector('iframe').contentWindow.document.getElementsByTagName('video')[0].currentTime = 7200
        }
    }
    setInterval(cy33,6424)
    function cy44(){
            if(document.getElementById('learn-btn')!==null){
            document.getElementById('learn-btn').click()
            setTimeout(function(){document.querySelector('iframe').contentWindow.document.getElementsByTagName('video')[0].currentTime = 7200},1154 )
        }
    }
    setInterval(cy44,4424)



    document.addEventListener("visibilitychange", function() {
    console.log(document.visibilityState);
    if(document.visibilityState == "hidden") {
        console.log('隐藏');
        //window.close()
    } else if (document.visibilityState == "visible") {
        console.log('显示')
        if(document.URL.search('studyPlan/intoStudentStudy')>1){setTimeout(sx,1000)}
    }
});
    function sx(){window.location.reload()}
    // Your code here...
    function jxxx(){
        if(document.URL.search('studyPlanId=')>1){
    if(document.getElementsByClassName('layui-layer-btn0').length>0){
    document.getElementsByClassName('layui-layer-btn0')[0].click();
        setTimeout(ciye,4000)
        console.log('验证')
    }else if(document.getElementsByClassName('studyCourseTimeRefresh').length>0){
    document.getElementsByClassName('studyCourseTimeRefresh')[0].click();
        console.log('刷新')
    }

    }
         }
    setInterval(jxxx,31000)
    //展开
   function zk(){
       if(document.querySelectorAll('span.step').length>0){
       var imgs=document.querySelectorAll('span.step')
       for (var i=0;i<imgs.length;i++){
           if(imgs[i].innerText.search('展开')>-1){
               imgs[i].click()
           }
       }
       }
   }
    setTimeout(zk,4000)
    //未完成-学习中
    function wwc(){
        if(document.URL.search('studyPlan/intoStudentStudy')>1){
            var xuanxiuke=document.getElementsByClassName('icon_tag')
            for (var i=0;i<xuanxiuke.length;i++){
                if(xuanxiuke[i].innerText=='选修课' && xuanxiuke[i].nextElementSibling.className!=='icon_1'){//
                    var xk=xuanxiuke[i].nextElementSibling
                     xk.nextSibling.nextSibling.click()
                    break;
                }


            }
   }
        }
     setTimeout(wwc,7000)
//次页
    function ciye(){
        document.querySelector('ul>li.ovd.cur').nextElementSibling.querySelector('a').click()
    }

function ciye1(){
    if(document.URL.search('studyPlanId=')>1){
    if(document.getElementById('bestMinutesTips').style.cssText==""){window.close()}
    if(document.getElementById('bestMinutesTips').style[0]!=='display'){
            window.close()
            }
        if(document.getElementById('codespan')!==null){
            document.getElementById('codespan').nextElementSibling.value=document.getElementById('codespan').innerText
        }
        document.getElementsByTagName('video')[0].play()
    }
}
    setInterval(ciye1,31000)



})();