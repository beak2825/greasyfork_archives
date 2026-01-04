// ==UserScript==
// @name         河南中医药大学--自动刷-m
// @namespace    需要代刷++++++v:shuake345      ++++++++
// @version      0.1
// @description  功能：自动看课|切换|10分钟退一次|秒刷vx:shuake345
// @author       vx:shuake345
// @match        *://lms.hactcm.edu.cn/venus/study/*
// @match        *://cjmanager.hactcm.edu.cn/*
// @grant        none
// @icon         https://cjfiles.hactcm.edu.cn/web-public-file/logo/ae6a31b8637444e8a44c8ecafe84daad.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/466208/%E6%B2%B3%E5%8D%97%E4%B8%AD%E5%8C%BB%E8%8D%AF%E5%A4%A7%E5%AD%A6--%E8%87%AA%E5%8A%A8%E5%88%B7-m.user.js
// @updateURL https://update.greasyfork.org/scripts/466208/%E6%B2%B3%E5%8D%97%E4%B8%AD%E5%8C%BB%E8%8D%AF%E5%A4%A7%E5%AD%A6--%E8%87%AA%E5%8A%A8%E5%88%B7-m.meta.js
// ==/UserScript==

(function() {
	'use strict';
    var plan
	var Zyurl = 'cjmanager'
	var Cyurl = 'listCourseActivity'
	var Syurl = 'userCourseId'
	document.addEventListener("visibilitychange", function() {
		console.log(document.visibilityState);
		if (document.visibilityState == "hidden") {} else if (document.visibilityState == "visible") {
			if (document.URL.search(Zyurl) > 1) {
				setTimeout(sx, 1000)
			}
		}
	});

    function cwd(){
    function zy1(){
    if(document.querySelectorAll('div.ng-star-inserted>div>div>a>span').length>0){
    document.querySelectorAll('div.ng-star-inserted>div>div>a>span')[0].click()
    }else if(document.querySelectorAll('nz-content>div>nz-card>div>div>div.indi-item.ng-star-inserted').length>0){
        if(sessionStorage.getItem('key')==null){
            sessionStorage.getItem('key')=='0'
         plan=0
        }else if(sessionStorage.getItem('key')=="0"){
        sessionStorage.getItem('key')=="1"
         plan=1
        }else if(sessionStorage.getItem('key')=="1"){
        sessionStorage.getItem('key')=="2"
         plan=2
        }else if(sessionStorage.getItem('key')=="2"){
        sessionStorage.clear('key')
         plan=0
        }
    document.querySelectorAll('nz-content>div>nz-card>div>div>div.indi-item.ng-star-inserted')[plan].querySelector('button').click()
    }else if(document.querySelectorAll('div.ant-card-body>div>div>button>span').length>0){

        var imgs=document.querySelectorAll('div.ant-card-body>div>div>button>span')
    for (var i=0;i<imgs.length;i++){if(imgs[i].innerText=="去学习"||imgs[i].innerText=="继续学习"){
       imgs[i].click()
        break;
    }
                                   }
    }
    }
setTimeout(zy1,6000)
    function bfy(){
    if(document.URL.search('learning')>1){
        if(document.querySelector('i.fa.fa-dot-circle-o.text-warning')!==null){
            document.querySelector('i.fa.fa-dot-circle-o.text-warning').click()
        }else if(document.querySelector('span.text-success')!==null ){
           if(document.querySelector('span.text-success').innerText==" 已完成"){window.history.go(-1)}
        }else if(document.querySelector('i.fa.fa-circle-o')!==null){
        document.querySelector('i.fa.fa-circle-o').click()
        }else if(document.querySelectorAll('i.fa.fa-play.mr-025').length==document.querySelectorAll('i.fa.fa-check-circle-o.text-success').length){window.close()}
        }
    }
    setInterval(bfy,6000)
    function spbf(){
        document.querySelector('video').play()
    }
    setInterval(spbf,5000)
    function ks(){
    if(document.getElementsByClassName('form-check-input ng-untouched ng-pristine ng-valid').length>0){
        var imgs=document.getElementsByClassName('form-check-input ng-untouched ng-pristine ng-valid')
    for (var i=0;i<imgs.length;i++){imgs[i].click()}
    }
        document.getElementsByClassName('btn btn-info')[0].click()
        document.getElementsByClassName('layui-layer-btn0')[0].click()

    }
setInterval(ks,5000)
    }
	function fh() {
		document.getElementsByClassName('layui-icon layui-icon-left')[0].click()
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
        document.querySelectorAll('div>ul.fl>li')[2].click()
        var Times=document.querySelectorAll("body > div > div > div > div.course-Wrap.clearfix > div > div > div > div > div > div > div > div > ul > li > div > span ")//[0].innerText
        for (var i = 0; i < Times.length; i++) {
            if(Times[i].innerText.split('/')[0]<Times[i].innerText.split('/')[1]){
            document.querySelectorAll("body > div > div> div > div.course-Wrap.clearfix > div > div > div > div > div > div > div > div > ul > li > strong > a")[i].click()
                break;
            }else if(i==Times.length-1){
                gb()
            }
        }
	}

	function Sy() {
			document.querySelector('video').play()
        setTimeout(fh,301200)
		}

	/*function Fy() {
		if (document.getElementsByTagName('video').length == 1) {
			document.getElementsByTagName('video')[0].volume = 0
			document.getElementsByTagName('video')[0].play()
		}
		if (document.querySelector('iframe').contentWindow.document.querySelector('span.qplayer-currtime').innerText == document.querySelector('iframe').contentWindow.document.querySelector('span.qplayer-totaltime').innerText) {
			window.location.replace(localStorage.getItem('Surl'))
		}
	}*/
	function QT(){
        var d1=document.getElementsByClassName('catalog-hd')[0];
        var img=document.createElement("img");
        img.style="width:230px; height:230px;"
        img.src="https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";
        d1.appendChild(img);
    }
	function Pd() {
        if (document.URL.search(Cyurl) > 2) {
			setInterval(Cy, 2210)
		} else if (document.URL.search(Zyurl) > 2) {
			setTimeout(Zy, 24)
		}else if (document.URL.search(Syurl) > 2) {
			setInterval(Sy, 8524)
            setTimeout(QT,124)
        }
	}
	setTimeout(Pd, 3254)

})();