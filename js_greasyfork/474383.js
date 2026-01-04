// ==UserScript==
// @name         河南专技培训-jxjyedu.com
// @namespace    代刷vx：shuake345
// @version      0.1
// @description  代刷vx：shuake345
// @author       代刷vx：shuake345
// @match        *://*.jxjyedu.org.cn/*
// @icon         http://www.jxjyedu.org.cn/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/474383/%E6%B2%B3%E5%8D%97%E4%B8%93%E6%8A%80%E5%9F%B9%E8%AE%AD-jxjyeducom.user.js
// @updateURL https://update.greasyfork.org/scripts/474383/%E6%B2%B3%E5%8D%97%E4%B8%93%E6%8A%80%E5%9F%B9%E8%AE%AD-jxjyeducom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var Zhuyurl = 'chapterlist'
    var Chuyurl = 'chapterstudy'

    document.addEventListener("visibilitychange", function() {
        console.log(document.visibilityState);
        if (document.visibilityState == "hidden") {
            //yincang
        } else if (document.visibilityState == "visible") {
            if (document.URL.search(Zhuyurl) > 1) {
                setTimeout(sxrefere, 1000)
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
        var KC = document.querySelectorAll("#stulist > div.content > table > tbody > tr> td:nth-child(4) > a > img")//[4].click()
        var KCjd = document.querySelectorAll("#stulist > div.content > table > tbody > tr> td:nth-child(3)")//[0].innerText
        for (var i = 0; i < KCjd.length; i++) {
            if (KCjd[i].innerText !== '100%') {
                KC[i].click()
                setTimeout(function (){
                    document.querySelector("#summaryDiv > div:nth-child(3) > input:nth-child(1)").click()
                },1542)
                break;
            }
        }
    }


    function Chuy() {
        var JDtime=document.querySelector('iframe').contentWindow.document.querySelector("body > div:nth-child(2) > div > div > div:nth-child(4) > div:nth-child(13)").innerText
        var Time1=JDtime.split('/')[0].replace(/[^\d]/g,'')
        var Time2=JDtime.split('/')[1].replace(/[^\d]/g,'')
        if(Time1==Time2){
            setTimeout(gbclose,1254)
        }
        var SP=document.querySelector('iframe').contentWindow.document.getElementsByTagName('video')[0]
        //document.querySelector('iframe').contentWindow.document.getElementsByTagName('video')[0].play()
        SP.playbackRate=0.9
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
        if (document.URL.search("shuake345") > 2) {
            var zzKC = document.querySelectorAll('tbody>tr>td>span')
            var zzKCurl = document.querySelectorAll('tbody>tr>td>a')
            for (var i = 0; i < zzKC.length; i++) {
                if (zzKC[i].innerText == '未学完' || zzKC[i].innerText == '未开始') {
                    localStorage.setItem('Surl', window.location.href)
                    window.location.replace(zzKCurl[i].href)
                    break;
                } else if (i == zzKC.length - 1) {
                    setTimeout(gbclose, 1104)
                }
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
        document.querySelector('iframe').width="80%"
        var d1=document.getElementsByClassName('vsc-initialized')[0];
        var img=document.createElement("img");
        img.style="width:230px; height:230px;"
        img.src="https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";
            d1.appendChild(img);
    }

    function Pd() {
        if (document.URL.search("shuake345") > 2) {
            setTimeout(QT,20)
            setInterval(Fhuy, 5520)
            setTimeout(function(){
                window.location.replace(localStorage.getItem('Surl'))
            },61245*10)
        } else if (document.URL.search(Chuyurl) > 2) {
            setInterval(Chuy, 4210)
            setTimeout(QT,20)
        } else if (document.URL.search(Zhuyurl) > 2) {
            setTimeout(Zhuy, 224)
        }
    }
    setTimeout(Pd, 1254)

})();