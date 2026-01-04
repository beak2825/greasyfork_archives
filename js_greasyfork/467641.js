// ==UserScript==
// @name         师学通自动换课+自动学习3版-只学选修课-花里胡哨的
// @namespace    刷课V软件定制：vx,shuake345
// @version      0.3
// @description  刷课VX：shuake345
// @author       You
// @match        *://*.stu.teacher.com.cn/course/*
// @match        *://*.stu.teacher.com.cn/studyPlan*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467641/%E5%B8%88%E5%AD%A6%E9%80%9A%E8%87%AA%E5%8A%A8%E6%8D%A2%E8%AF%BE%2B%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A03%E7%89%88-%E5%8F%AA%E5%AD%A6%E9%80%89%E4%BF%AE%E8%AF%BE-%E8%8A%B1%E9%87%8C%E8%83%A1%E5%93%A8%E7%9A%84.user.js
// @updateURL https://update.greasyfork.org/scripts/467641/%E5%B8%88%E5%AD%A6%E9%80%9A%E8%87%AA%E5%8A%A8%E6%8D%A2%E8%AF%BE%2B%E8%87%AA%E5%8A%A8%E5%AD%A6%E4%B9%A03%E7%89%88-%E5%8F%AA%E5%AD%A6%E9%80%89%E4%BF%AE%E8%AF%BE-%E8%8A%B1%E9%87%8C%E8%83%A1%E5%93%A8%E7%9A%84.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var Lookedtime

    document.addEventListener("visibilitychange", function() {
    console.log(document.visibilityState);
    if(document.visibilityState == "hidden") {
        console.log('隐藏');
        //window.close()
    } else if (document.visibilityState == "visible") {
        console.log('显示')
        if(document.URL.search('studyPlan/intoWorkshopCourse')>1){setTimeout(sx,1000)}
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
        if(document.URL.search('studyPlan/intoWorkshopCourse')>1){
            var xuanxiuke=document.getElementsByClassName('icon_tag')
            for (var i=0;i<xuanxiuke.length;i++){
                if(xuanxiuke[i].innerText=='选修课' && xuanxiuke[i].nextElementSibling.className!=='icon_1' && xuanxiuke[i].nextElementSibling.className!=='icon_2' ){//
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
    function Pd(){//判断
        if(document.URL.search('studyPlanId=')>1){
            if(Lookedtime==document.getElementById('courseStudyMinutesNumber').innerText){
            setTimeout(function (){window.close()},1232)
            }
            Lookedtime=document.getElementById('courseStudyMinutesNumber').innerText

        }

    }
    setInterval(180000)



})();