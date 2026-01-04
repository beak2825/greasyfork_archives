// ==UserScript==
// @name         研修网挂机
// @namespace    http://tampermonkey.net/
// @version      0.0.5
// @description  自动看课程
// @author       ZSJ
// @match        https://ipx.yanxiu.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        unsafeWindow

// @downloadURL https://update.greasyfork.org/scripts/522646/%E7%A0%94%E4%BF%AE%E7%BD%91%E6%8C%82%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/522646/%E7%A0%94%E4%BF%AE%E7%BD%91%E6%8C%82%E6%9C%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';


    function Pd(){        
        if(document.URL.search('grain')>1){kk();}
        if(document.URL.search('train')>1){xk();}
    }
    function sx(){window.location.reload()}
    function close(){window.close();}
    function xk(){
        var xmms=document.querySelectorAll(".inner")       
       for (let span of xmms){            
            if(span.querySelector(".learn-btn>button>span").textContent=="看课"){
                setTimeout(sx,600000);
                clearInterval(Pds);
                //span.click();
                span.querySelector(".learn-btn>button").click();
                break;
            }else if(span.querySelector(".learn-status>span").textContent!="已观看 100%" ){
                setTimeout(sx,600000);
                clearInterval(Pds);
                //span.click();
                span.querySelector(".learn-btn>button").click();
                break;
            }
        }
    }
    function kk(){
        if(document.getElementsByClassName('rate-item').length==10){
            if(document.getElementsByClassName('scoring-wrapper')[0].style[0]==undefined){//！==,评分显示出来为空,==没显示出来了
                var rate=document.getElementsByClassName('rate-item');
                const event = new MouseEvent('mousemove', {bubbles: true,cancelable: true});
                rate[9].dispatchEvent(event);//rate[9] 这里可以改评分
                rate[9].click();
                document.getElementsByClassName('ivu-btn ivu-btn-primary')[0].click();
            }
        }
        if(document.getElementsByClassName('text').length!=0){
            document.getElementsByClassName('text')[0].click()
        }
        if(document.getElementsByTagName('video').length==1){
            document.getElementsByTagName('video')[0].volume=0;
            if (document.getElementsByTagName('video')[0].paused) {
                document.getElementsByTagName('video')[0].play();
            }
            //document.getElementsByTagName('video')[0].play;
            if(document.getElementsByClassName('ended-mask')[0].style[0]==undefined){
                document.getElementsByClassName('next')[0].click();
            }
        }
        if (kks){
            kks=false;
        setInterval(close,600000);
            }
    }
var kks=true;
var Pds=setInterval(Pd,3000);

})();