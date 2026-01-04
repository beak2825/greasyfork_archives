// ==UserScript==
// @name         smartedu
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  auto click on smartedu website
// @author       You
// @match        https://basic.smartedu.cn/teacherTraining/courseDetail*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=smartedu.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/449871/smartedu.user.js
// @updateURL https://update.greasyfork.org/scripts/449871/smartedu.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function findFrameInWindow(win,func)
    {
        var eles=func(win.document);
        if(eles!=null) return eles;
        for(var i=0;i<win.frames.length;i++){
            eles=findFrameInWindow(win.frames[i],func);
            if(eles!=null) return eles;
        }
        return null;
    }


    function findElementsInDocumentByClassName(doc,classname)
    {
        let qid= doc.getElementsByClassName(classname);
        if(qid.length>0)
        {
            return qid;
        }
        else
        {
            return null;
        }
    }


    function clickUnfinished(eles){
        for(var i=0;i<eles.length;i++){
            if(!IsElementActivate(eles[i]) && !IsElementFinish(eles[i]))
            {
                eles[i].click();
                return;
            }
        }
    }
    function IsElementFinish(ele){
        var ediv=ele.getElementsByTagName("div");
        if(ediv.length>0 && ediv[0].title =="已学完") return true;
        return false;
    }
    function IsElementActivate(ele){
        return ele.className.indexOf("resource-item-active")>=0;
    }
    function autoclick()
    {
        let vs=findFrameInWindow(window.top,(d)=>findElementsInDocumentByClassName(d,"vjs-tech"));
        if(vs!=null && vs.length>0) {
            vs[0].muted=true;
            vs[0].play();
        }
        console.log("ac");
        let eles=findFrameInWindow(window.top,(d)=>findElementsInDocumentByClassName(d,"resource-item"));
        for(var i=0;i<eles.length;i++){
            if(IsElementActivate(eles[i]) && IsElementFinish(eles[i]))
            {
                clickUnfinished(eles);
                return;
            }
        }

    }


    setInterval(autoclick,5000);

})();