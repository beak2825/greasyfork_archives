// ==UserScript==
// @name         天津好医生
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  秒播+自动答题 （继续医学教育培训）
// @author       周大侠
// @match        https://tjsjxyxjy.cmechina.net/*
// @match        *://*.cmechina.net/cme/*
// @match        http://tjs.cmechina.net/*
// @match        https://tjs.cmechina.net/*
// @match        cme.haoyisheng.com/cme/*
// @icon         ttps://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/472031/%E5%A4%A9%E6%B4%A5%E5%A5%BD%E5%8C%BB%E7%94%9F.user.js
// @updateURL https://update.greasyfork.org/scripts/472031/%E5%A4%A9%E6%B4%A5%E5%A5%BD%E5%8C%BB%E7%94%9F.meta.js
// ==/UserScript==

(function() {
    'use strict';

       setInterval(function () {

            if(document.querySelector('video')){
                 document.querySelector("video").dispatchEvent(new Event("ended"));
                document.querySelector('video').muted=true;
              // document.querySelector('video').playbackRate = 10;
                document.querySelector('video').currentTime=document.querySelector('video').duration-3;

                }


        },5000)

        var elements = document.getElementsByTagName("input");

        for (var i = 0; i < elements.length; i++) {
             console.log('检测到nnn');

            if (elements[i].type === "radio" &&  elements[i].value=='1' ) //&&  elements[i].value=='1' && elements[i].class==="questionId"
                {

               elements[i].checked=true;
              console.log('检测到aaaa');//  elements[i].checked=true;//name.checked=true;

               // break;
            }
        }
    
})();