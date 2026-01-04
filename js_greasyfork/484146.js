// ==UserScript==
// @name         华兴科软培训研修网自动看，未加秒刷功能
// @namespace    需要秒刷++v:shuake345+++
// @version      0.1
// @description  主页点击：课程按钮|自动学习小节|自动换课功能|赶时间+需要秒刷+vx:shuake345+不建议秒刷
// @author       vx:shuake345
// @match        *://hxpxxy.cn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/484146/%E5%8D%8E%E5%85%B4%E7%A7%91%E8%BD%AF%E5%9F%B9%E8%AE%AD%E7%A0%94%E4%BF%AE%E7%BD%91%E8%87%AA%E5%8A%A8%E7%9C%8B%EF%BC%8C%E6%9C%AA%E5%8A%A0%E7%A7%92%E5%88%B7%E5%8A%9F%E8%83%BD.user.js
// @updateURL https://update.greasyfork.org/scripts/484146/%E5%8D%8E%E5%85%B4%E7%A7%91%E8%BD%AF%E5%9F%B9%E8%AE%AD%E7%A0%94%E4%BF%AE%E7%BD%91%E8%87%AA%E5%8A%A8%E7%9C%8B%EF%BC%8C%E6%9C%AA%E5%8A%A0%E7%A7%92%E5%88%B7%E5%8A%9F%E8%83%BD.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.alert = function() {}
    window.onbeforeunload = null
    window.confirm = function() {
        return true
    }
    var Zhuyurl = 'mustCourse'
    var Chuyurl = 'courseName'
    var Shuyurl = 'CourseWare'
    var Fhuyurl = '&courseware'

    /*document.addEventListener("visibilitychange", function() {
		console.log(document.visibilityState);
		if (document.visibilityState == "hidden") {
        //yincang
        } else if (document.visibilityState == "visible") {
			if (document.URL.search(Zhuyurl) > 1) {
				setTimeout(sxrefere, 1000)
			}
		}
	});*/

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
        if (document.URL.search('mustCourse') > 2||document.URL.search('selectCourse')) {
            if(document.querySelector("div.left-menu > ul > li.el-submenu.is-opened > ul > li:nth-child(1)")!==null){
                var KC = document.querySelector("div.left-menu > ul > li.el-submenu.is-opened > ul > li:nth-child(1)").innerText
                if(KC==" 选修课程"){
                    console.log('点击选秀')
                    document.querySelector("div.left-menu > ul > li.el-submenu.is-opened > ul > li:nth-child(1)").click()
                    setTimeout(kskec,2000)
                }
            }
            var KCjd = document.querySelectorAll('.item>ul>li>i') //[0].innerText

            }
    }
    setInterval(Zhuy, 8224)

    function Chuy() {
        if (document.URL.search(Chuyurl) > 2) {

            if(document.getElementsByClassName('doing').length>0){
                document.getElementsByClassName('doing')[0].click()
                setTimeout(function (){
                    document.getElementsByTagName('video')[0].play()},2015)

            }else if(document.getElementsByClassName('no-start').length>0){
                document.getElementsByClassName('no-start')[0].click()
                setTimeout(function (){
                    document.getElementsByTagName('video')[0].play()},2015)
            }
            var Lookdpage = parseInt(localStorage.getItem('key'))
            var zKC = document.querySelectorAll('tbody>tr>td>a')
            var zKCnum=zKC.length-1//2num kc
            if(Lookdpage<zKCnum){
                localStorage.setItem('key',Lookdpage+1)
                zKC[Lookdpage].click()
            }else{
                //localStorage.setItem('key',0)
            }
        }
    }
    setInterval(Chuy, 3210)
    function Shuy() {
        if (document.URL.search(Shuyurl) > 2) {
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
    setInterval(Shuy, 3124)
    function kskec(){

        var zzKC =document.querySelectorAll("div > div > button")
        //var zzKCurl = document.querySelectorAll('tbody>tr>td>a')
        for (var i = 0; i < zzKC.length; i++) {
            if (zzKC[i].innerText == "继续学习" || zzKC[i].innerText == "开始学习") {
                zzKC[i].click()
                break;
            } else if (i == zzKC.length - 1) {
                setTimeout(nex, 1104)
            }
        }
    }
    function nex(){
        if (document.URL.search('mustCourse') > 2||document.URL.search('selectCourse')) {
            document.querySelector("div > div.left-main > div.el-pagination > button.btn-next > i").click()
            setTimeout(kskec,2010)
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
        img1.style.right = '100';
        img1.style.zIndex = '9999';
        document.body.appendChild(img1);
    }
    setTimeout(QT,20)
    function Pd() {
        if (document.URL.search(Fhuyurl) > 2) {
            setTimeout(QT,20)
            setInterval(Fhuy, 5520)
            setTimeout(function(){
                window.location.replace(localStorage.getItem('Surl'))
            },61245*10)
        }
    }
    setTimeout(Pd, 1254)

})();