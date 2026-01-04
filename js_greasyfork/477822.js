// ==UserScript==
// @name         华中师范大学教师研修平台-zhihuiteacher
// @namespace    v:shuake345
// @version      0.5
// @description  主页点击：课程按钮|自动学习小节|自动换课功能|
// @author       vx:shuake345
// @match        *://*.zhihuiteacher.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zhihuiteacher.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/477822/%E5%8D%8E%E4%B8%AD%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E5%B9%B3%E5%8F%B0-zhihuiteacher.user.js
// @updateURL https://update.greasyfork.org/scripts/477822/%E5%8D%8E%E4%B8%AD%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E6%95%99%E5%B8%88%E7%A0%94%E4%BF%AE%E5%B9%B3%E5%8F%B0-zhihuiteacher.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.alert = function() {}
    window.onbeforeunload = null
    window.confirm = function() {
        return true
    }
    var Zhuyurl = 'online'
    //var Chuyurl = 'lock'
    var Shuyurl = 'lock'
    var Fhuyurl = '&courseware'

    document.addEventListener("visibilitychange", function() {
        console.log(document.visibilityState);
        if (document.visibilityState == "hidden") {
        } else if (document.visibilityState == "visible") {
            if (document.URL.search(Zhuyurl) > 1 ) {
                //setTimeout(sxrefere, 1000)
            }
        }
    });

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
        
        if (document.URL.search(Shuyurl) > 2 && doings.search('3')>0 ) {//&& doings.search('3')>0
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
                    var fuhao=shizi.substr(1,1)
                    var fuhao1=shizi.substr(2,1)
                    if(shizi.length==3){//简单
                        switch (fuhao){
                            case "+":
                                day = Number(shizi.substr(0,1) )+Number(shizi.substr(2,1) );
                                break;
                            case "-":
                                day = Number(shizi.substr(0,1) )-Number(shizi.substr(2,1) );
                                break;
                            default:
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
                            default:
                        }
                        document.querySelector("div.layui-layer-content > input").value=day
                    }
                    //document.querySelector("div.layui-layer-content > input").value=eval(document.querySelector('[class="layui-layer-title"]').innerText.replace(/请回答/g,'').replace(/=\?/g,'') .replace(/“/g, "").replace(/”/g, ""))
                }
            }
            var Tims=document.querySelectorAll('[class="time"]')[0].innerText
            if(Tims.split(',')[0].replace(/[^\d]/g,'')==Tims.split(',')[2].replace(/[^\d]/g,'')){
                setTimeout(gbclose,101)
            }
            if(document.querySelector("div.layui-layer-btn.layui-layer-btn- > a.layui-layer-btn0")!==null){//jxu play
                document.querySelector("div.layui-layer-btn.layui-layer-btn- > a.layui-layer-btn0").click()
            }
        }
    }
    setInterval(Shuy, 5124)

    var News1=new Date
    var doings=News1.getFullYear ()+''
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
    function Pd() {
        if (document.URL.search(Fhuyurl) > 2) {
            setTimeout(QT,20)
            setInterval(Fhuy, 5520)
            setTimeout(function(){
                window.location.replace(localStorage.getItem('Surl'))
            },61245*10)
        } else if (document.URL.search(Zhuyurl) > 2) {
            setTimeout(Zhuy, 24)
        }
    }
    setTimeout(Pd, 2254)

})();