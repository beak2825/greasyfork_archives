// ==UserScript==
// @name         山东省教师教育网-2023中小学远程研修
// @namespace    http://tampermonkey.net/
// @version      2023.01
// @author       追梦
// @description  如有侵权请联系作者删除  邮箱：zm@zeus.tk QQ：403303929
// @match        *://www.qlteacher.com/
// @match        *://yanxiu.qlteacher.com/project/xx2023/*
// @match        *://yanxiu.qlteacher.com/project/cz2023/*
// @match        *://player.qlteacher.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=qlteacher.com
// @license      追梦
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/450469/%E5%B1%B1%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%91-2023%E4%B8%AD%E5%B0%8F%E5%AD%A6%E8%BF%9C%E7%A8%8B%E7%A0%94%E4%BF%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/450469/%E5%B1%B1%E4%B8%9C%E7%9C%81%E6%95%99%E5%B8%88%E6%95%99%E8%82%B2%E7%BD%91-2023%E4%B8%AD%E5%B0%8F%E5%AD%A6%E8%BF%9C%E7%A8%8B%E7%A0%94%E4%BF%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function open(){
        window.location.reload();
    }
    function mainpage(){
		if(document.URL.search('yanxiu.qlteacher.com/project/xx2023/learning/learning')>1 || document.URL.search('yanxiu.qlteacher.com/project/cz2023/learning/learning')>1){
			if(sessionStorage.getItem('key')!==document.querySelectorAll('div.col-6.bd-r>div.strongTitle')[document.getElementsByClassName('btn btn-sm btn-success').length-1].innerText){
				console.log(sessionStorage.getItem('key'));
				console.log(document.querySelectorAll('div.col-6.bd-r>div.strongTitle')[document.getElementsByClassName('btn btn-sm btn-success').length-1].innerText);
				if( document.getElementsByClassName('btn btn-sm btn-info').length>0){
					sessionStorage.setItem('key',document.querySelectorAll('div.col-6.bd-r>div.strongTitle')[document.getElementsByClassName('btn btn-sm btn-success').length-1].innerText);
					document.getElementsByClassName('btn btn-sm btn-info')[0].click();
				}else if(document.getElementsByClassName('btn btn-sm btn-warning').length>0){
					sessionStorage.setItem('key',document.querySelectorAll('div.col-6.bd-r>div.strongTitle')[document.getElementsByClassName('btn btn-sm btn-success').length-1].innerText);
					document.getElementsByClassName('btn btn-sm btn-warning')[0].click();
				}
			}
			setTimeout(open,60000*2)
		}
    }
    setInterval(mainpage,10000)
    function sele(){
        if(document.URL.search('qlteacher.com/learning/')>1){
			if(document.getElementsByClassName('btn btn-warning')[0].innerText.search('学习')>1){
				document.getElementsByClassName('btn btn-warning')[0].click()
			}/*else if(document.getElementsByClassName('fa fa-play mr-025').length==document.getElementsByClassName('fa fa-check-circle-o text-success').length){
			window.close()
			}*/
		}
    }
    setInterval(sele,5000)
    function play(){
        if(document.URL.search('qlteacher.com/learning/')>1){
            if(document.getElementsByTagName('video')[0].paused==true){
                document.getElementsByTagName('video')[0].play();
                //document.querySelector('video').playbackRate = 16;//设置播放速度
            }
            if(document.getElementsByClassName('text-success')[0].innerText==" 已完成"){
                if(document.getElementsByClassName('fa fa-dot-circle-o text-warning').length>0){
                    document.getElementsByClassName('fa fa-dot-circle-o text-warning')[0].click();
                }else if(document.getElementsByClassName('fa fa-circle-o').length>0){
                    document.getElementsByClassName('fa fa-circle-o')[0].click();
                }
			}
			if(document.getElementsByClassName('modal-content').length>0){
				document.getElementsByClassName('modal-content')[0].remove();
			}
		}
    }
    setInterval(play,10000)
})();