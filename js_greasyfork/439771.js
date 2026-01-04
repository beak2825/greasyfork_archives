// ==UserScript==
// @name         立得学自动答题
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  用于立得学单词词测的自动答题
// @author       H-OH
// @match        https://danci.lidexue.com/index.html
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/439771/%E7%AB%8B%E5%BE%97%E5%AD%A6%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.user.js
// @updateURL https://update.greasyfork.org/scripts/439771/%E7%AB%8B%E5%BE%97%E5%AD%A6%E8%87%AA%E5%8A%A8%E7%AD%94%E9%A2%98.meta.js
// ==/UserScript==

(function() {
    'use strict';
    GM_registerMenuCommand("添加单词",add,"A");
    GM_registerMenuCommand("自动答题",run,"R");
    var now=new Array(),ans=new Array();
    function load()
    {
        now=new Array();
        ans=new Array();
        var all=GM_getValue("words","");
        var flag=false;
        var useq="",usea="";
        for (var i=0;i<all.length;i++)
        {
            if (all[i]=="=")
            {flag=true;}
            else if (all[i]=="\n")
            {
                now.push(useq);
                ans.push(usea);
                useq="";
                usea="";
                flag=false;
            }
            else if (flag)
            {usea=usea+all[i];}
            else
            {useq=useq+all[i];}
        }
    }
    function save()
    {
        var res="";
        for (var i=0;i<now.length;i++)
        {res=res+now[i]+"="+ans[i]+"\n";}
        GM_setValue("words",res);
    }
    function add()
    {
        load();
        var ens=document.getElementsByClassName("cli-con mag-bottom3");
        var chs=document.getElementsByClassName("flex zhong mag-bottom1");
        var en="",ch="";
        for (var i=0;i<ens.length;i++)
        {
            ch=chs[i].children[1].innerText;
            en=ens[i].innerText.substr(ens[i].innerText.indexOf(".")+2);
            if (now.includes(en))
            {continue;}
            now.push(en);
            ans.push(ch);
        }
        save();
        alert("添加完成！");
    }
    function solve(id,num)
    {
        var pro=document.getElementsByTagName("h1")[0].innerText;
        var at=now.findIndex(e=>e==pro);
        if (at!=-1)
        {
            var todo=document.getElementsByTagName("input")[0];
            var task=document.createEvent("HTMLEvents");
            task.initEvent("input",true,true);
            todo.value=ans[at];
            todo.dispatchEvent(task);
        }
        if (id==num)
        {return;}
        setTimeout(next,300,id+1,num);
    }
    function next(id,num)
    {
        if (id!=1)
        {document.getElementsByClassName("start_end_btn xend")[0].children[0].click();}
        setTimeout(solve,300,id,num);
    }
    function run()
    {
        load();
        var info=document.getElementsByClassName("questionIndex")[0].innerText;
        var num=40;
        if (info[info.indexOf("/")+3]=="0")
        {num=100;}
        next(1,num);
    }
})();