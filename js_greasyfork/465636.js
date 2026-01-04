// ==UserScript==
// @name         bett-德胜工作坊
// @namespace    zidong
// @version      0.1
// @description  vx:shuake345
// @author       vx:shuake345
// @match        *://jx19qy.gpa.enetedu.com/*
// @grant        none
// @icon         https://per.chinabett.com/favicon.ico
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465636/bett-%E5%BE%B7%E8%83%9C%E5%B7%A5%E4%BD%9C%E5%9D%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/465636/bett-%E5%BE%B7%E8%83%9C%E5%B7%A5%E4%BD%9C%E5%9D%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var zhuurl = 'MyEventList'
    var ciurl = 'MyjoinEvent'
    var sanurl = 'CourseWare'
    var siurl = '&courseware'

    document.addEventListener("visibilitychange", function() {
        console.log(document.visibilityState);
        if (document.visibilityState == "hidden") {} else if (document.visibilityState == "visible") {
            if (document.URL.search(zhuurl) > 1 || document.URL.search(sanurl) > 1) {
                setTimeout(sx, 1000)
            }
        }
    });

    function fh() {
        window.history.go(-1)
    }

    function gb() {
        window.close()
    }

    function sx() {
        window.location.reload()
    }

    function Zy() {
        var KC = document.querySelectorAll('.item>ul>li>a') 
        var KCjd = document.querySelectorAll('.item>ul>li>i') 
        for (var i = 0; i < KCjd.length; i++) {
            if (KCjd[i].innerText == '[未完成]') {
                window.open(KC[i].href)
                break;
            }
        }
    }

    function Cy() {
        if(parseInt(localStorage.getItem('key'))==NaN){
            localStorage.setItem('key',0)
        }
        var Lookdpage = parseInt(localStorage.getItem('key'))
        var zKC = document.querySelectorAll('tbody>tr>td>a')
        var zKCnum=zKC.length-1
        if(Lookdpage<zKCnum){
            localStorage.setItem('key',Lookdpage+1)
            zKC[Lookdpage].click()
        }else{
            localStorage.setItem('key',0)
        }
    }

    function Sy() {
        if (document.URL.search(sanurl) > 2) {
            var zzKC = document.querySelectorAll('tbody>tr>td>span')
            var zzKCurl = document.querySelectorAll('tbody>tr>td>a')
            for (var i = 0; i < zzKC.length; i++) {
                if (zzKC[i].innerText == '未学完' || zzKC[i].innerText == '未开始') {
                    localStorage.setItem('Surl', window.location.href)
                    window.location.replace(zzKCurl[i].href)
                    break;
                } else if (i == zzKC.length - 1) {
                    setTimeout(gb, 1104)
                }
            }
        }
    }
    setInterval(Sy, 3124)

    function Fy() {
        if (document.getElementsByTagName('video').length == 1) {
            document.getElementsByTagName('video')[0].volume = 0
            document.getElementsByTagName('video')[0].play()
        }
        if (document.querySelector('iframe').contentWindow.document.querySelector('span.qplayer-currtime').innerText == document.querySelector('iframe').contentWindow.document.querySelector('span.qplayer-totaltime').innerText) {
            window.location.replace(localStorage.getItem('Surl'))
        }
    }
    function Pd() {
        if (document.URL.search(siurl) > 2) {
            setInterval(Fy, 5520)
            setTimeout(function(){
                window.location.replace(localStorage.getItem('Surl'))
            },60245*10)
        } else if (document.URL.search(ciurl) > 2) {
            setInterval(Cy, 1210)
        } else if (document.URL.search(zhuurl) > 2) {
            setTimeout(Zy, 14)
        }
    }
    setTimeout(Pd, 1354)

})();