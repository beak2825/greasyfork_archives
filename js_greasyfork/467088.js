// ==UserScript==
// @name         威海专技人员公需科目
// @namespace    vx:shuake345
// @version      0.1
// @description  自动看课程|自动单选题|其他版本开发请加VX:shuake345
// @author       代刷所有网课VX:shuake345
// @match        *://sdwh-gxk.yxlearning.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=yxlearning.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/467088/%E5%A8%81%E6%B5%B7%E4%B8%93%E6%8A%80%E4%BA%BA%E5%91%98%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/467088/%E5%A8%81%E6%B5%B7%E4%B8%93%E6%8A%80%E4%BA%BA%E5%91%98%E5%85%AC%E9%9C%80%E7%A7%91%E7%9B%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';

    var xzt=0
    function zy(){
        var tm=document.querySelectorAll('tr>td')
     for (var i=0;i<tm.length;i++){
            if(tm[i].innerText=='未完成学习'){
            tm[i+3].querySelector('button.btn.btn-link.btn-block').click()
                //document.querySelectorAll('tr>td')[11].querySelector('button.btn.btn-link.btn-block').click()
            }
        }
    }
    setInterval(zy,5000)

    function dati(){
        var xuanxiang=document.querySelectorAll(" div > div.pv-ask-modal-wrap > div > div.pv-ask-content.pv-ask-content-noimg > div.pv-ask-right > div > div > label")
        var Tijiao=document.querySelector("div > div.pv-ask-modal-wrap > div > div.pv-ask-foot > button.pv-ask-submit")//.click()
        if(document.getElementsByClassName('ccQuestionList').length>0){
            setTimeout(datixuan,2000)
        }
        if(xuanxiang.length>0){
            if(xzt>=xuanxiang.length){xzt=0}
            xuanxiang[xzt].click()
            Tijiao.click()
                xzt++
        }
       if(document.getElementById('rightBtn')!==null){
       document.getElementById('rightBtn').click()
       }
    }
    setInterval(dati,10000)
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
    function QT() {
		var d1 = document.getElementsByClassName('first-tab')[0];
		var img = document.createElement("img");
		img.style = "width:230px; height:230px;"
		img.src = "https://img.nuannian.com/files/images/23/0305/1677989951-1403.jpg";
		d1.appendChild(img);
	}
	setTimeout(QT, 3245)
    function datixuan(){
        var dtfu=document.getElementsByClassName('ccQuestionList')[0]
        dtfu.querySelectorAll('li>i')[0].click()
            $('#ccQuestionSubmit').click()
            $('#rightBtn').click()
        setTimeout(function (){
        dtfu.querySelectorAll('li>i')[1].click()
            $('#ccQuestionSubmit').click()
            $('#rightBtn').click()
        },2000)
        setTimeout(function (){
        dtfu.querySelectorAll('li>i')[2].click()
            $('#ccQuestionSubmit').click()
            $('#rightBtn').click()
        },4000)
        setTimeout(function (){
        dtfu.querySelectorAll('li>i')[3].click()
            $('#ccQuestionSubmit').click()
            $('#rightBtn').click()
        },6000)
    }
    // Your code here...
})();