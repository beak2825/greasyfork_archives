// ==UserScript==
// @name         bcvetAutoLesson
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto click on bcvet website
// @author       You
// @match        http://www.bcvet.cn/web/page/outCourse*
// @match        http://course.teacheredu.cn/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=bing.com
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/449870/bcvetAutoLesson.user.js
// @updateURL https://update.greasyfork.org/scripts/449870/bcvetAutoLesson.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function parseEquation(e1) {
        if(e1.indexOf("+")>0)
        {
            var e2=e1.split("+");
            return parseInt(e2[0])+parseInt(e2[1]);
        }
        if(e1.indexOf("-")>0)
        {
            e2=e1.split("-");
            return parseInt(e2[0])-parseInt(e2[1]);
        }
        if(e1.indexOf("*")>0)
        {
            e2=e1.split("*");
            return parseInt(e2[0])+parseInt(e2[1]);
        }
        if(e1.indexOf("/")>0)
        {
            e2=e1.split("/");
            return parseInt(e2[0])+parseInt(e2[1]);
        }
        return null;
    }
    function videoendevent() {
        console.log("播放结束");
        selectNext();
        window.parent.postMessage('selectNext', '*');
    }
    function autoclick() {
        try {
            var iframe=document.getElementById("code");
            if(iframe==null) {
                var videoDOM = document.getElementsByTagName("video")
                if(videoDOM.length<=0) return;
                console.log(videoDOM);
                videoDOM[0].removeEventListener('ended', videoendevent);
                videoDOM[0].addEventListener('ended', videoendevent, false);
                //videoDOM[0].playbackRate=2
                return;
            }
            console.log("found code！")
            console.log(iframe.innerText)
            var e1=iframe.innerText.split("=")[0]
            var result=parseEquation(e1);
            if(e1==null) return;
            var validCode=document.getElementById("validCode");
            validCode.setAttribute("value", result);
            var btn = document.getElementById("checkCode")
            btn.click()
        } catch (err) {
            console.log(err)
        }
        //setTimeout(autoclick, 5000);
    }
    function selectNext() {
        var li_menu_1_0_id=document.getElementById("li_menu_1_0_id");
        var allChildElements = li_menu_1_0_id.querySelectorAll('.b_name');
        var found=false
        for(var i=0; i < allChildElements.length ; i++)
        {
            if(found)
            {
                allChildElements[i].click();
                break;
            }
            if(allChildElements[i].className.indexOf("b_sel") > 0)
            {
                found=true;
            }
        }

    }
    function getElementsByTagInFrames(win,idname)
    {
        var eid= win.document.getElementsByTagName(idname);
        if(eid.length>0) return eid;
        for(var i=0;i<win.frames.length;i++){
            return getElementsByTagInFrames(win.frames[i],idname);
        }
    }
    setInterval(autoclick, 5000);
    window.addEventListener('message', (e) => {
      if(e.data=='selectNext')
      {

      }
    }, false);
})();