// ==UserScript==
// @name         湖南师范大学自学考试社会考生网络助学平台-xuexi.zikao365
// @namespace    代刷vx:shuake345
// @version      0.2
// @description  自动挂时长
// @author       代刷vx:shuake345
// @match       *://*.zikao365.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=zikao365.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/473961/%E6%B9%96%E5%8D%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%AD%A6%E8%80%83%E8%AF%95%E7%A4%BE%E4%BC%9A%E8%80%83%E7%94%9F%E7%BD%91%E7%BB%9C%E5%8A%A9%E5%AD%A6%E5%B9%B3%E5%8F%B0-xuexizikao365.user.js
// @updateURL https://update.greasyfork.org/scripts/473961/%E6%B9%96%E5%8D%97%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E8%87%AA%E5%AD%A6%E8%80%83%E8%AF%95%E7%A4%BE%E4%BC%9A%E8%80%83%E7%94%9F%E7%BD%91%E7%BB%9C%E5%8A%A9%E5%AD%A6%E5%B9%B3%E5%8F%B0-xuexizikao365.meta.js
// ==/UserScript==

(function() {
    'use strict';

    document.addEventListener("visibilitychange", function() {
		if (document.visibilityState == "hidden") {} else if (document.visibilityState == "visible") {
			if (document.URL.search('training') > 1) {
				setTimeout(sx, 1000)
			}
		}
	});
    function gb(){
        window.close()
    }

    function sx() {
		window.location.reload()
	}

    function Zy(){
        if(document.querySelectorAll('div.act-items').length>0){
        var Bk=document.querySelectorAll('div.act-items')
        for (var i=0;i<Bk.length;i++){
        if(Bk[i].querySelector('span.el-tag').innerText!=='已完成'){
            Bk[i].querySelector('button.el-button').click()
            break;
        }
        }
        }
        var d1=document.getElementsByClassName('cus-banner')[0]
        var img=document.createElement("img");
        img.style="width:230px; height:230px;"
        img.src="https://img.nuannian.com/files/images/22/0921/1663766968-1460.jpg";
        d1.appendChild(img);
        }
    function Cy(){
        if(document.getElementById('btnStartStudy')!==null){
        document.getElementById('btnStartStudy').click()
    }
    }
    function Sy(){
        if(document.getElementsByTagName('video').length==1){
            document.getElementsByTagName('video')[0].volume=0
            document.getElementsByTagName('video')[0].play()
            console.log('播放ing')
        }
        if(document.getElementsByClassName('clearfix online cur')[0].querySelector('i').className=='cg fl leve2_yx'){
            if(document.getElementsByClassName('cg fl leve2_wx')[0].nextElementSibling.length>0){
        document.getElementsByClassName('cg fl leve2_wx')[0].nextElementSibling.click()
            }else if(document.getElementsByClassName('cg fl leve2_jxz')[0].nextElementSibling.length>0){
        document.getElementsByClassName('cg fl leve2_jxz')[0].nextElementSibling.click()
            }
        }
    }
    setInterval(Sy,5426)

    function QT(){
        if(document.URL.search('video')>2 || document.URL.search('package/document')>2){
    document.getElementById('lblTitle').innerText='代刷VX：shuake345'
            document.getElementById('divPlay').attributes.style.value='height: 18px;'
            var d1=document.getElementById("divPublishComment");
            var img=document.createElement("img");
            img.style="width:230px; height:230px;"
            img.src="https://img.nuannian.com/files/images/22/0921/1663766968-1460.jpg";
            d1.appendChild(img);
            document.getElementsByClassName('ml50 pl20')[0].remove()
    }
    }
    function Gb(){
    window.history.go(-1)
    }


})();