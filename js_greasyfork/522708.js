// ==UserScript==
// @name         BEtterCODER
// @namespace    http://tampermonkey.net/
// @version      2025-01-06
// @description  修正 Becoder 里的若干唐氏问题。
// @author       Hagasei
// @match        https://www.becoder.com.cn/*
// @match        http://xxx.xxx.xxx.xxx:xxxxx/*
// @icon         https://cdn.luogu.com.cn/upload/image_hosting/qs1rwdn5.png
// @grant        none
// @run-at       document-start
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/522708/BEtterCODER.user.js
// @updateURL https://update.greasyfork.org/scripts/522708/BEtterCODER.meta.js
// ==/UserScript==

(()=>{
    'use strict';
    function endContestTGPAdder(){
        const regex=/^\/contest\/\d+\/problem\/\d+\/?$/;
        if(!regex.test(document.location.pathname)) return ;// not in the contest problem
        var panel=document.getElementsByClassName("ui fluid secondary vertical menu").item(0);
        if(panel.children[1].id=="tgp") return ; // have a TGP

        const myTGP=document.createElement('a'); // Attributes & innerHTML from becoder.
        myTGP.className="item";
        myTGP.id="tgp";
        myTGP.setAttribute("onclick","javascript:toggleProblem()");
        myTGP.setAttribute("style","display: none;");
        myTGP.innerHTML="<i aria-hidden=\"true\" class=\"arrow left icon\"></i>返回题面";
        panel.insertBefore(myTGP,panel.firstChild.nextSibling);

    } // document-idle

    function homepageRedirect(){
        if(!(document.location.pathname=="/")) return ;// not in the homepage
        document.write("");
        var url=document.URL;
        if(!url.endsWith('/')) url+='/';
        window.location.replace(url+"contests");
    } //document-start

    function submissionRedirect(){
        const regex=/^\/contest\/submission\/\d+\/?$/;
        if(!regex.test(document.location.pathname)) return ;// not in the submission page
        document.write("");
        var url=document.location.origin+"/submission/"+document.location.pathname.split("/").pop();
        window.location.replace(url);
    }

    function preventWatermark(){
        const regex=/^\/js\/pdf\/web\/viewer.html/;
        if(!regex.test(document.location.pathname)) return ;

        var callback=(mutationsList, observer)=>{
            mutationsList.forEach((mutation)=>{
                if(mutation.type!="childList") return ;
                if(mutation.target.className!="page") return ;
                if(mutation.target.children[2]){ // the watermark
                    mutation.target.children[2].innerHTML="";
                }
            });
        };
        var targetNode=document.body;
        var observerOptions={
            childList: true,
            attributes: false,
            subtree: true,
        };
        var observer=new MutationObserver(callback);
        observer.observe(targetNode, observerOptions);
    }

    function rightClickEnable(){
        window.oncontextmenu=null;
        document.oncontextmenu=null;
    }

    function contestSubmissionFix(){
        const regex=/^\/contest\/\d+\/?$/;
        if(!regex.test(document.location.pathname)) return ;
        var submissionBtn=document.getElementsByClassName("ui small positive button")[0];
        submissionBtn.setAttribute("href",document.location.origin+document.location.pathname+"/submissions");
    }

    function submissionListFix(){
        const regex=/^\/contest\/\d+\/submissions/;
        if(!regex.test(document.location.pathname)) return ;

        var table=document.getElementById("vueAppFuckSafari");
        var tbody=table.children[1];
        for(let row of tbody.children){
            let id=row.children[0].innerHTML;
            var num=id.slice(4,id.length-4);
            row.children[0].innerHTML="<a href=\"\/submission\/"+num+"\" style=\"color: green;\"><b>#"+num+"<\/b><\/a>"
        }
    }

    var tmpCode=null;

    function submitClipboard(){
        function submitCode(code){
            $('#submit_code input[name=language]').val("cpp14");
            $('#submit_code input[name=code]').val(code);
            var theform=document.getElementById("submit_code");
            const onsub=theform.onsubmit;
            theform.onsubmit=null;
            theform.submit();
            theform.onsubmit=onsub;
        }
        var btn=document.getElementById("quickSubmit");
        if(btn.classList.contains("yellow")){
            if(tmpCode) submitCode(tmpCode);
            else console.error("未获取到代码？？");
            return ;
        }
        if (navigator.clipboard) {
            navigator.clipboard.readText().then(code=>{
                if((!code.trim())||(code.trim()[0]!='#'&&code.trim()[0]!='/')){ // red flash warning
                    console.log(code.trim());
                    console.log((code.trim()[0]=='/'));
                    console.log((!code.trim()));
                    btn.classList.toggle("red");
                    setTimeout(()=>{btn.classList.toggle("red");},300);
                    return ;
                }
                btn.classList.toggle("yellow");
                btn.innerHTML="<i aria-hidden=\"true\" class=\"upload icon\"></i>确认提交？"
                tmpCode=code;
                setTimeout(()=>{
                    btn.classList.toggle("yellow");
                    btn.innerHTML="<i aria-hidden=\"true\" class=\"f101 icon\"></i>快捷提交";
                    tmpCode=null;
                },1500);
            }).catch(err=>{console.error('读取剪贴板失败:', err);});
        }
        else console.error('当前浏览器不支持 Clipboard API');
    }

    function quickSubmit(){
        const regex1=/^\/contest\/\d+\/problem\/\d+\/?$/;
        const regex2=/^\/problem\/\d+\/?$/;
        if(!regex1.test(document.location.pathname)&&!regex2.test(document.location.pathname)) return ;

        var quickBtn=document.createElement("a");
        quickBtn.className="item green";
        quickBtn.id="quickSubmit";
        quickBtn.onclick=submitClipboard;
        quickBtn.innerHTML="<i aria-hidden=\"true\" class=\"f101 icon\"></i>快捷提交";

        const panel=document.getElementsByClassName("ui fluid secondary vertical menu")[0];
        panel.insertBefore(quickBtn,panel.firstChild);
        var ss=document.createElement("style");
        ss.innerHTML=`
            a#quickSubmit.item.green{
                background: rgb(25 255 0 / 26%);
                color: rgb(41 135 36 / 95%);
                transition: background 0.3s ease-in-out,
                    color 0.3s ease-in-out;
            }
            a#quickSubmit.item.green:hover{
                background: rgb(25 255 0 / 46%);
                color: rgb(41 135 36 / 100%);
            }
            a#quickSubmit.item.green.red{
                background: rgb(255 25 0 / 56%);
                color: rgb(135 41 36 / 100%);
            }
            a#quickSubmit.item.green.yellow{
                background: rgb(255 249 0 / 26%);
                color: rgb(128 135 36 / 95%);
            }
            a#quickSubmit.item.green.yellow:hover{
                background: rgb(255 249 0 / 46%);
                color: rgb(128 135 36 / 100%);
            }
            i.icon.f101:before{content: \"\\f101\";}
        `;
        ss.setAttribute("type","text/css");
        document.head.appendChild(ss);
    }
    // 主页重定向
    homepageRedirect();
    // 比赛提交记录重定向
    submissionRedirect();
    document.addEventListener("DOMContentLoaded",()=>{
        // 返回题面按钮
        endContestTGPAdder();
        // 禁用 PDF 水印
        preventWatermark();
        // 启用右键菜单
        rightClickEnable();
        // 修正比赛首页的提交记录链接
        contestSubmissionFix();
        // 提交记录列表增加超链接
        submissionListFix();
        // 快捷提交
        // quickSubmit();
    });
})();