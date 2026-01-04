// ==UserScript==
// @name         onlineEneteduHelper
// @namespace    http://kktt.top/
// @version      0.5
// @description  auto click on enetedu website
// @author       KK
// @match        https://onlinenew.enetedu.com/lise/*
// @match        https://onlinenew.enetedu.com/lise/MyTrainCourse/*
// @icon         http://kktt.top/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/447600/onlineEneteduHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/447600/onlineEneteduHelper.meta.js
// ==/UserScript==

(function() {
    'use strict';

    function getElementsByIdInFrames(win,idname)
    {
        var eid= win.document.getElementById(idname);
        if(eid!=null) return eid;
        for(var i=0;i<win.frames.length;i++){
            return getElementsByIdInFrames(win.frames[i],idname);
        }
    }

    function findButtonInDocument(doc)
    {
        let qid= doc.getElementById("cdnad_box");
        console.log(qid);
        if(qid==null) return;

        var btn = qid.childNodes[0].childNodes[1].childNodes[0]
        console.log(btn);
        btn.click()
    }
    function findFrameInWindow(win)
    {
        findButtonInDocument(win.document);
        for(var i=0;i<win.frames.length;i++){
            findFrameInWindow(win.frames[i]);
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
    function getIdCT(urlstr)
    {
        var coursetypestr=/[?&]coursewareid=[0-9]*/.exec(urlstr);
        var coursetypevalue=coursetypestr[0].substring(14);
        return coursetypevalue;
    }
    function clickNext() {
        let periods=window.top.document.getElementsByClassName("ellipsis");
        let curisend=false;
        for(var i=0;i<periods.length;i++){
            if(periods[i].childNodes.length==2)
            {
                var hrefs=periods[i].getAttribute("onclick").split("'");
                var cwid=getElementsByIdInFrames(window.top,"courseware_id").value
                var pcwid=getIdCT(hrefs[1]);
                if (pcwid==cwid)
                {
                    if(periods[i].childNodes[0].textContent[0]=="[" && periods[i].childNodes[0].textContent=="[100%]")
                    {
                        curisend=true;
                    }
                }
            }
        }
        if(!curisend) return;
        for(i=0;i<periods.length;i++){
            if(periods[i].childNodes.length==2)
            {
                if(periods[i].childNodes[0].textContent[0]=="[" && periods[i].childNodes[0].textContent!="[100%]")
                {
                    periods[i].click();
                    return;

                }
            }
        }
    }
    function autoclick()
    {
        console.log("ac");
        findFrameInWindow(window.top);
        clickNext();

    }
    setInterval(autoclick,5000);

})();