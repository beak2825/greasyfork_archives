// ==UserScript==
// @name         重庆人社培训必修课-另外接：2023年专业科目（工程类）（60学时）课程
// @namespace    代刷网课:VX---------shuake345
// @version      0.2
// @description  看运气吧-2年前开发的脚本。不一定能用。代刷网课:VX---------shuake345接：2023年专业科目（工程类）（60学时）课程
// @author       VX---------shuake345
// @match        *://*.21tb.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/466569/%E9%87%8D%E5%BA%86%E4%BA%BA%E7%A4%BE%E5%9F%B9%E8%AE%AD%E5%BF%85%E4%BF%AE%E8%AF%BE-%E5%8F%A6%E5%A4%96%E6%8E%A5%EF%BC%9A2023%E5%B9%B4%E4%B8%93%E4%B8%9A%E7%A7%91%E7%9B%AE%EF%BC%88%E5%B7%A5%E7%A8%8B%E7%B1%BB%EF%BC%89%EF%BC%8860%E5%AD%A6%E6%97%B6%EF%BC%89%E8%AF%BE%E7%A8%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/466569/%E9%87%8D%E5%BA%86%E4%BA%BA%E7%A4%BE%E5%9F%B9%E8%AE%AD%E5%BF%85%E4%BF%AE%E8%AF%BE-%E5%8F%A6%E5%A4%96%E6%8E%A5%EF%BC%9A2023%E5%B9%B4%E4%B8%93%E4%B8%9A%E7%A7%91%E7%9B%AE%EF%BC%88%E5%B7%A5%E7%A8%8B%E7%B1%BB%EF%BC%89%EF%BC%8860%E5%AD%A6%E6%97%B6%EF%BC%89%E8%AF%BE%E7%A8%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function sx(){window.location.reload()}
function ks(){
    if(document.getElementsByClassName('only-one-btn elpui-layer-btn0').length>0){
   document.getElementsByClassName('only-one-btn elpui-layer-btn0')[0].click()
    window.close();
    }
    else if(document.getElementsByClassName('btn-item cursor').length>0){
  document.getElementsByClassName('btn-item cursor')[2].click()
      clearInterval(ks1)
  }
}
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
    var ks1=setInterval(ks,3000)
    function zy(){
        if(document.URL.search('courseDetail')>0){
               setTimeout(sx,280000)
        var kcnum=document.getElementsByClassName('item__name')[0].innerText
        console.log(window.sessionStorage.getItem('key'))
        if(window.sessionStorage.getItem('key')!==kcnum){
            clearInterval(zy1)
        window.sessionStorage.setItem('key', kcnum)
            document.querySelectorAll('div.text-box>div>div.text-item.cursor')[0].click()

        }
        }else if(document.URL.search('courseStudyItem.learn.do')>0){
            if(document.getElementsByClassName('outter').length>0){
            window.close();
            }
            setTimeout(sx,280000)
        }

    }
   var zy1= setInterval(zy,5000)
})();