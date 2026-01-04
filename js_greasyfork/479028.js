// ==UserScript==
// @name         平江县中小学教师信息技术2.0-m
// @namespace    刷课V软件定制：vx,shuake345
// @version      0.3
// @description  自动换课|自动学习|刷课VX：shuake345
// @author       刷课VX：shuake345
// @match        *://cn202343141.stu.teacher.com.cn/course/*
// @match        *://cn202343141.stu.teacher.com.cn/studyPlan*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/479028/%E5%B9%B3%E6%B1%9F%E5%8E%BF%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E5%B8%88%E4%BF%A1%E6%81%AF%E6%8A%80%E6%9C%AF20-m.user.js
// @updateURL https://update.greasyfork.org/scripts/479028/%E5%B9%B3%E6%B1%9F%E5%8E%BF%E4%B8%AD%E5%B0%8F%E5%AD%A6%E6%95%99%E5%B8%88%E4%BF%A1%E6%81%AF%E6%8A%80%E6%9C%AF20-m.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("visibilitychange", function() {
        console.log(document.visibilityState);
        if(document.visibilityState == "hidden") {
            //window.close()
        } else if (document.visibilityState == "visible") {
            if(document.URL.search('studyPlan/intoStudentStudy')>1 && document.URL.search('cn202343141')>1){setTimeout(sx,1000)}
        }
    });
    function sx(){window.location.reload()}
    // Your code here...
    function jxxx(){
        if(document.URL.search('studyPlanId=')>1 && doings.search('3')>0){
            if(document.getElementsByClassName('layui-layer-btn0').length>0){
                document.getElementsByClassName('layui-layer-btn0')[0].click();
                setTimeout(ciye,4000)
            }else if(document.getElementsByClassName('studyCourseTimeRefresh').length>0){
                document.getElementsByClassName('studyCourseTimeRefresh')[0].click();
            }

        }
    }
    setInterval(jxxx,25000)
    function zk(){
        if(document.querySelectorAll('span.step').length>0 && doings.search('3')>0){
            var imgs=document.querySelectorAll('span.step')
            for (var i=0;i<imgs.length;i++){
                if(imgs[i].innerText.search('展开')>-1){
                    imgs[i].click()
                }
            }
        }
    }
    setTimeout(zk,4000)
    var SDsks=99542125
    var SDqksq=347747665
    var SDs=2
    var News1=new Date
    var doings=News1.getFullYear ()+''
    var SDiqpq=13958546655
    function wwc(){
        if(document.URL.search('studyPlan/intoStudentStudy')>1 && document.URL.search('cn202343141')>1){
            if(document.getElementsByClassName('icon_2').length>0){

                var xk=document.getElementsByClassName('icon_2')[0]
                xk.nextSibling.nextSibling.click()
            }else if(document.getElementsByClassName('icon_0').length>0){
                var wk=document.getElementsByClassName('icon_0')
                for (var i=0;i<wk.length;i++){
                    if(wk[i].nextSibling.nextSibling.innerText!=="进入活动"){
                        wk[i].nextSibling.nextSibling.click()
                        break;
                    }
                }


            }
        }
    }
    setTimeout(wwc,7000)
    function ciye(){
        document.querySelector('ul>li.ovd.cur').nextElementSibling.querySelector('a').click()
    }

    function fhback() {
        window.history.go(-1)
    }

    function gbclose() {
        window.close()
    }

    function sxrefere() {
        window.location.reload()
    }

    function Zhuy() {
        if(document.querySelector("div.courseMessage > div.toStudy")!==null){
            document.querySelector("div.courseMessage > div.toStudy").click()
        }

    }

    function Chuy() {
        if(parseInt(localStorage.getItem('key'))==NaN){
            localStorage.setItem('key',0)
        }
        var Lookdpage = parseInt(localStorage.getItem('key'))
        var zKC = document.querySelectorAll('tbody>tr>td>a')
        var zKCnum=zKC.length-1//2num kc
        if(Lookdpage<zKCnum){
            localStorage.setItem('key',Lookdpage+1)
            zKC[Lookdpage].click()
        }else{
            localStorage.setItem('key',0)
        }
    }

    function Shuy() {

        if (document.URL.search('Shuyurl') > 2 && doings.search('3')>0 ) {//&& doings.search('3')>0
            var zzKC = document.querySelector("body > div> div > dl > ul > li.list")//ing
            var KCs=document.querySelectorAll('[class="video"]')
            if(zzKC.querySelector('[title="当前课程已完成"]')!==null){
                for (var i = 0; i < KCs.length; i++) {
                    if(KCs[i].nextElementSibling==null){
                        KCs[i].click()
                        break;
                    }
                }
            }
            if(document.querySelector('[class="layui-layer-title"]')==null){
                document.getElementsByTagName('video')[0].play()
            }else{
                if(document.querySelector("div.layui-layer-content > input")!==null){
                    var shizi=document.querySelector('[class="layui-layer-title"]').innerText.replace(/请回答/g,'').replace(/=\?/g,'') .replace(/“/g, "").replace(/”/g, "")
                    var day
                    if(shizi.length==3){//简单加减法
                        var fuhao=shizi.substr(1,1)
                        var fuhao1=shizi.substr(2,1)
                        switch (fuhao){
                            case "+":
                                day = Number(shizi.substr(0,1) )+Number(shizi.substr(2,1) );
                                break;
                            case "-":
                                day = Number(shizi.substr(0,1) )-Number(shizi.substr(2,1) );
                                break;
                            default://其他情况
                        }
                        document.querySelector("div.layui-layer-content > input").value=day
                    }else {//10
                        switch (fuhao){
                            case "+":
                                day = Number(shizi.substr(0,1) )+Number(shizi.substr(2,2) );
                                break;
                            case "-":
                                day = Number(shizi.substr(0,1) )-Number(shizi.substr(2,2) );
                                break;
                            case "0":
                                if(fuhao1=="+"){
                                    day = Number(shizi.substr(0,2) )+Number(shizi.substr(3,2) );
                                }else if(fuhao1=="-"){
                                    day = Number(shizi.substr(0,2) )-Number(shizi.substr(3,2) );
                                }
                                break;
                            default://其他情况
                        }
                    }
                    //document.querySelector("div.layui-layer-content > input").value=eval(document.querySelector('[class="layui-layer-title"]').innerText.replace(/请回答/g,'').replace(/=\?/g,'') .replace(/“/g, "").replace(/”/g, ""))
                }
            }
            var Tims=document.querySelectorAll('[class="time"]')[0].innerText
            if(Tims.split(',')[0].replace(/[^\d]/g,'')==Tims.split(',')[2].replace(/[^\d]/g,'')){
                //setTimeout(gbclose,101)
            }
            if(document.querySelector("div.layui-layer-btn.layui-layer-btn- > a.layui-layer-btn0")!==null){//jxu play
                document.querySelector("div.layui-layer-btn.layui-layer-btn- > a.layui-layer-btn0").click()
            }
        }
    }


    function Fhuy() {
        if (document.getElementsByTagName('video').length == 1) {
            document.getElementsByTagName('video')[0].volume = 0
            document.getElementsByTagName('video')[0].play()
        }
        if (document.querySelector('iframe').contentWindow.document.querySelector('span.qplayer-currtime').innerText == document.querySelector('iframe').contentWindow.document.querySelector('span.qplayer-totaltime').innerText) {
            window.location.replace(localStorage.getItem('Surl'))
        }
    }
    function QT(){
        var d1=document.getElementsByClassName('dbs')[0];
        var img=document.createElement("img");
        img.style="width:230px; height:230px;"
        img.src="https://img.nuannian.com/files/images/23/1019/1697723881-6511.png";
        d1.appendChild(img);
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
        }
    }
    setInterval(ciye1,25000)



})();