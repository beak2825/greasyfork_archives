// ==UserScript==
// @name         好教师|菁师助手}自动看课切课
// @namespace    代刷+vx:shuake345
// @version      0.2
// @description  需赶时间|秒刷|软件一件秒+v:shuake345
// @author       主页联系我
// @match        http://r.forteacher.cn/ZXUserStudy/*
// @grant        v:shuake345
// @icon         http://r.forteacher.cn/Images/logo.png
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/465789/%E5%A5%BD%E6%95%99%E5%B8%88%7C%E8%8F%81%E5%B8%88%E5%8A%A9%E6%89%8B%7D%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE%E5%88%87%E8%AF%BE.user.js
// @updateURL https://update.greasyfork.org/scripts/465789/%E5%A5%BD%E6%95%99%E5%B8%88%7C%E8%8F%81%E5%B8%88%E5%8A%A9%E6%89%8B%7D%E8%87%AA%E5%8A%A8%E7%9C%8B%E8%AF%BE%E5%88%87%E8%AF%BE.meta.js
// ==/UserScript==

(function() {
	'use strict';
	var Zyurl = 'UserProjectTrain'
	var Cyurl = 'UserStudy'
	document.addEventListener("visibilitychange", function() {
		console.log(document.visibilityState);
		if (document.visibilityState == "hidden") {} else if (document.visibilityState == "visible") {
			if (document.URL.search(Zyurl) > 1) {
				setTimeout(sx, 1000)
			}
		}
	});

    function setCookie(cname,cvalue,exdays){

            var d = new Date();

            d.setTime(d.getTime()+(exdays*24*60*60*1000));

            var expires = "expires="+d.toGMTString();

            document.cookie = cname+"="+cvalue+"; "+expires;
        }

        function getCookie(cname){
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for(var i=0; i<ca.length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(name)==0) { return c.substring(name.length,c.length); }
            }
            return "";
        }

        function createElement(dom,domId){

            var rootElement = document.body;

            var newElement = document.createElement(dom);

            newElement.id = domId;

            var newElementHtmlContent = document.createTextNode('');

            rootElement.appendChild(newElement);

            newElement.appendChild(newElementHtmlContent);

        }

        function toast(msg,duration){

            duration=isNaN(duration)?3000:duration;

            let toastDom = document.createElement('div');

            toastDom.innerHTML = msg;

            toastDom.style.cssText='padding:2px 15px;min-height: 36px;line-height: 36px;text-align: center;transform: translate(-50%);border-radius: 4px;color: rgb(255, 255, 255);position: fixed;top: 50%;left: 50%;z-index: 9999999;background: rgb(0, 0, 0);font-size: 16px;'

            document.body.appendChild(toastDom);

            setTimeout(function() {

                var d = 0.5;

                toastDom.style.webkitTransition = '-webkit-transform ' + d + 's ease-in, opacity ' + d + 's ease-in';

                toastDom.style.opacity = '0';

                setTimeout(function() { document.body.removeChild(toastDom) }, d * 1000);

            }, duration);

        }


	function sx() {
		window.location.reload()
	}

	function Zy() {
        document.getElementsByClassName('el-tabs__item is-top')[1].click()
        setTimeout(function (){
            var KC = document.querySelectorAll('li>strong')
            for (var i = 0; i < KC.length; i++) {
			if (KC[i].style[0]==undefined) {
                if(i<5){
            document.getElementsByClassName('el-button el-button--primary is-round')[i].click()
                break;
                }
			}
		}
        },1254)
		/*var KC = document.querySelectorAll('.item>ul>li>a') //[0].href
		var KCjd = document.querySelectorAll('.item>ul>li>i') //[0].innerText
		for (var i = 0; i < KCjd.length; i++) {
			if (KCjd[i].innerText == '[未完成]') {
				window.open(KC[i].href)
				break;
			}
		}*/
	}

    function QDjx(){
    if(document.getElementsByClassName('el-button el-button--primary').length==4){
        document.getElementsByClassName('el-button el-button--primary')[2].click()

    }
    }
    setInterval(QDjx,8424)
	function Cy() {
        var kctime=document.getElementsByClassName('bai')
        if(kctime.length==2){

            if( kctime[0].innerText.replace(/[^\d]/g,'') <= kctime[1].innerText.split('分钟')[0].replace(/[^\d]/g,'') ){
            document.getElementsByClassName('el-button el-button--danger')[2].click()
            }
        }
		/*if(parseInt(localStorage.getItem('key'))==NaN){
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
           }*/
	}

	function Sy() {
		if (document.URL.search(Syurl) > 2) {
			var zzKC = document.querySelectorAll('tbody>tr>td>span1')
			var zzKCurl = document.querySelectorAll('tbody>tr>td>1a')
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

	function Fy() {
		if (document.getElementsByTagName('video').length == 1) {
			document.getElementsByTagName('video')[0].volume = 0
			document.getElementsByTagName('video')[0].play()
		}
		if (document.querySelector('iframe').contentWindow.document.querySelector('span.qplayer-currtime').innerText !== document.querySelector('iframe').contentWindow.document.querySelector('span.qplayer-totaltime').innerText) {
			window.location.replace(localStorage.getItem('Surl'))
		}
	}
	function QT(){
        var d1=document.getElementsByClassName('couInfoWrap')[0];
        var img=document.createElement("img");
        img.style="width:230px; height:230px;"
        img.src="https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";
        d1.appendChild(img);
    }
	function Pd() {
		if (document.URL.search(Cyurl) > 2) {
			setInterval(Cy, 1210)
            setTimeout(QT,2145)
		} else if (document.URL.search(Zyurl) > 2) {
			setTimeout(Zy, 24)
		}
	}
	setTimeout(Pd, 3254)

})();