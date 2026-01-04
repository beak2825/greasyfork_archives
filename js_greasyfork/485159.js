// ==UserScript==
// @name         基础教育教师培训网-高等教育出版社-德胜工作坊
// @namespace    代刷+vx:shuake345
// @version      0.4
// @description  主页点击：课程按钮|自动学习小节|未写自动换课功能|需要代刷+vx:shuake345
// @author       vx:shuake345
// @match        *://*.gpa.enetedu.com/*
// @grant        none
// @icon         https://per.chinabett.com/favicon.ico
// @downloadURL https://update.greasyfork.org/scripts/485159/%E5%9F%BA%E7%A1%80%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD%E7%BD%91-%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E5%87%BA%E7%89%88%E7%A4%BE-%E5%BE%B7%E8%83%9C%E5%B7%A5%E4%BD%9C%E5%9D%8A.user.js
// @updateURL https://update.greasyfork.org/scripts/485159/%E5%9F%BA%E7%A1%80%E6%95%99%E8%82%B2%E6%95%99%E5%B8%88%E5%9F%B9%E8%AE%AD%E7%BD%91-%E9%AB%98%E7%AD%89%E6%95%99%E8%82%B2%E5%87%BA%E7%89%88%E7%A4%BE-%E5%BE%B7%E8%83%9C%E5%B7%A5%E4%BD%9C%E5%9D%8A.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.alert = function() {}
    window.onbeforeunload = null
    window.confirm = function() {
        return true
    }
    var Zyurl = 'MyEventList'
    var Cyurl = 'MyjoinEvent'
    var Syurl = 'CourseWare'
    var Fyurl = '&courseware'

    document.addEventListener("visibilitychange", function() {
        console.log(document.visibilityState);
        if (document.visibilityState == "hidden") {} else if (document.visibilityState == "visible") {
            if (document.URL.search(Zyurl) > 1 || document.URL.search(Syurl) > 1) {
                setTimeout(sx,1000)
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
        var KC = document.querySelectorAll('.item>ul>li>a') //[0].href
        var KCjd = document.querySelectorAll('.item>ul>li>i') //[0].innerText
        for (var i = 0; i < KCjd.length; i++) {
            if (KCjd[i].innerText == '[未完成]') {
                window.open(KC[i].href)
                break;
            }
        }
    }

    function Cy() {
        var CKC=document.querySelectorAll("td:nth-child(1) > a")
        var KCkec=CKC//[i].parentElement.nextElementSibling.nextElementSibling.innerText
        for (var i = 0; i < CKC.length; i++) {
                if (CKC[i].parentElement.nextElementSibling.nextElementSibling.innerText=='未完成' || CKC[i].parentElement.nextElementSibling.nextElementSibling.innerText=='未开始') {
                    CKC[i].click()
                    break;
                } else if (i == CKC.length - 1) {
                    setTimeout(gb, 1104)
                }
            }
    }

    function Sy() {
        if (document.URL.search(Syurl) > 2) {
            var zzKC = document.querySelectorAll('tbody>tr>td>span')
            var zzKCurl = document.querySelectorAll('tbody>tr>td>a')
            for (var i = 0; i < zzKC.length; i++) {
                if (zzKC[i].innerText.search('未学完')>-1 || zzKC[i].innerText.search('未开始')>-1) {
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
            if(document.querySelector("span.duration").innerText==document.querySelector("span.current-time").innerText){
            setTimeout(gb, 1104)
            }else{
            document.getElementsByTagName('video')[0].volume = 0
            document.getElementsByTagName('video')[0].play()
            }
        }
        if (document.querySelector('iframe').contentWindow.document.querySelector('span.qplayer-currtime').innerText == document.querySelector('iframe').contentWindow.document.querySelector('span.qplayer-totaltime').innerText) {
            window.location.replace(localStorage.getItem('Surl'))
        }
    }
    function QT(){
        var img =document.createElement("img");
        var img1=document.createElement("img");
        img.src="https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";
        img.style.position = 'fixed';
        img.style.top = '0';
        img1.style.right = '200';
        img.style.zIndex = '999';
        img.style="width:230px; height:230px;"
        document.body.appendChild(img);
        img1.src="https://img.nuannian.com/files/images/23/1019/1697723881-6511.png";
        img1.style="width:230px; height:230px;"
        img1.style.position = 'fixed';
        img1.style.top = '0';
        img1.style.right = '0';
        img1.style.zIndex = '9999';
        document.body.appendChild(img1);
    }
    function Pd() {
        if (document.URL.search(Fyurl) > 2) {
            setTimeout(QT,20)
            setInterval(Fy, 5520)
            setTimeout(function(){
                window.location.replace(localStorage.getItem('Surl'))
            },61245*10)
        } else if (document.URL.search(Cyurl) > 2) {
            setInterval(Cy, 1210)
        } else if (document.URL.search(Zyurl) > 2) {
            setTimeout(Zy, 124)
        }
    }
    setTimeout(Pd, 2254)

})();