// ==UserScript==
// @name         Midjourney Auto Menu Call
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  减少两次鼠标操作
// @author       You
// @match        https://www.midjourney.com/*
// @match        https://nijijourney.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_setValue
// @grant        GM_getValue
// @license      MIT 
// @downloadURL https://update.greasyfork.org/scripts/464911/Midjourney%20Auto%20Menu%20Call.user.js
// @updateURL https://update.greasyfork.org/scripts/464911/Midjourney%20Auto%20Menu%20Call.meta.js
// ==/UserScript==
var g_jobid;
var g_curTag;
var g_3dotbtn;
var g_e_3dotbtn;

function isElement(obj) {
    return !!(obj && obj.nodeType === 1);
}

function getRundomTimeGap()
{
    return Math.random()*(300)+200;
}

function timeout_callcopymenu()
{
    var spans = document.getElementsByTagName("span");
    for(var i=0;i<spans.length;i++)
    {
        var spannode = spans[i];
        if(spannode.innerHTML=="Copy...")
        {
            console.log("get copy ndoe");
            //向上查找，定位关联的btn
            var node = spannode;
            while(true)
            {
                node = node.parentElement;
                if(node.tagName == "DIV" && node.hasAttribute("aria-labelledby") && node.getAttribute("aria-labelledby") == g_3dotbtn)
                {
                    spannode.parentElement.click();
                    break;
                }
                else if(node.tagName == "BODY")
                {
                    break;
                }
                else if(node == null)
                {
                    break;
                }
            }
            break;
        }
    }
}

function timeout_click3dot()
{
    if(isElement(g_e_3dotbtn) && g_e_3dotbtn.tagName == "BUTTON")
    {
        g_e_3dotbtn.click();
        setTimeout(timeout_callcopymenu,getRundomTimeGap());
    }
}

function mouseoverUpdate(nodeParam)
{
    var cEL = nodeParam.fromElement;
    var strTag = cEL.tagName;
    var clsName = cEL.className;
    // console.log("Tag:" + strTag +"\n"+"Cls:"+clsName);

    var targetNode = cEL;
    var roleStr = "role";
    var btmStr ="relative w-full shrink-0 cursor-auto justify-self-end opacity-100 translate-y-0";
    var muStr = "data-popper-placement";
    while(true)
    {
        targetNode = targetNode.parentElement;
        if(targetNode == null)
        {
            g_curTag = null;
            break;
        }
        if(targetNode.tagName == "BODY")
        {
            g_curTag = null;
            break;
        }
        else if(targetNode.tagName == "DIV")
        {
            if(targetNode.className == btmStr)
            {
                // console.log("get btm div");
                while(true)
                {
                    targetNode = targetNode.parentElement;
                    if(targetNode.tagName == "DIV" && targetNode.hasAttribute(roleStr) && targetNode.getAttribute(roleStr) == "gridcell")
                    {
                        g_curTag = targetNode;
                        break;
                    }
                }
                break;
            }
            else if(targetNode.hasAttribute(roleStr) && targetNode.getAttribute(roleStr) == "gridcell")
            {
                break;
            }
            else if(targetNode.hasAttribute(muStr) && targetNode.getAttribute(muStr)=="top-end")
            {
                console.log("menu");
                var dvs = targetNode.getElementsByTagName("div");
                for(var i = 0;i<dvs.length;i++)
                {
                    var dv = dvs[i];
                    if(dv.hasAttribute("aria-labelledby"))
                    {
                        //
                        if(dv.getAttribute("aria-labelledby") == g_3dotbtn)
                        {
                            //do nothing
                        }
                        else
                        {
                            console.log("change menu,clear all data");
                            g_curTag = null;
                            g_jobid = "";
                            g_3dotbtn = "";
                            g_e_3dotbtn = null;
                        }
                        break;
                    }
                }

                break;
            }
        }
    }

    if(isElement(g_curTag))
    {
        var imgs = g_curTag.getElementsByTagName("img");
        for(var i = 0;i<imgs.length;i++)
        {
            var img = imgs[i];
            if(!img.hasAttribute("data-job-id"))
                continue;
            var oldjobid = g_jobid;
            g_jobid = img.getAttribute("data-job-id");
            // console.log(g_jobid);
            if(g_jobid == oldjobid)
                continue;

            var btns = g_curTag.getElementsByTagName("button");
            for(var j = 0;j<btns.length;j++)
            {
                var btn = btns[j];
                if(!btn.getAttribute("title")=="Open Options")
                    continue;
                g_3dotbtn = btn.parentElement.id;
                g_e_3dotbtn = btn;
                // console.log(g_e_3dotbtn);
                console.log("get data job id:"+g_jobid + "\n 3dot btn is: " + btn.parentElement.id);
                setTimeout(timeout_click3dot,getRundomTimeGap());
                break;
            }
            break;
        }
    }
    else
    {
        g_jobid = "";
        g_3dotbtn = "";
        g_e_3dotbtn = null;
    }
}

var listenID;
var unlistenID;

function openListen()
{
    document.body.addEventListener("mouseover",mouseoverUpdate);
    GM_unregisterMenuCommand(listenID);//删除菜单
    unlistenID=GM_registerMenuCommand ("关闭监听",stopListen, "h");
}

function stopListen()
{
    document.body.removeEventListener("mouseover",mouseoverUpdate);
    GM_unregisterMenuCommand(unlistenID);//删除菜单
    listenID=GM_registerMenuCommand ("开启监听",openListen, "h");
}

listenID=GM_registerMenuCommand ("开启监听",openListen, "h");
(function() {
    'use strict';
    // Your code here...
    console.log("my code.");
})();