// ==UserScript==
// @name         MCBBS Report
// @namespace    http://tampermonkey.net/
// @version      0.6
// @description  快速水龙头举报
// @author       CaveNightingale
// @match        https://www.mcbbs.net/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/413655/MCBBS%20Report.user.js
// @updateURL https://update.greasyfork.org/scripts/413655/MCBBS%20Report.meta.js
// ==/UserScript==

//是否在一个新的标签页内举报
const newtab = true;
//所使用的水龙头图片的地址
//可以像这样的base64直接把整张图片弄进来，也可以外链
const imageurl = "data:image/ico;base64,AAABAAEAEBAQAAAAAAAoAQAAFgAAACgAAAAQAAAAIAAAAAEABAAAAAAAgAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAND/AOhGOgA/6OIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAiAAAAAAAAACIAAAAAAAAAIgAAAAAAAAAAAAAAAAAAABEAAAAzMQABEQAAARMzEBERARERETMxERAAAAARMzEAAAAAAAETMwAAAAAAABEwAAAAAAAAERAAAAAAAAABAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAD/+QAA//kAAP/5AAD/8AAA+DAAAPAgAAAAAAAAAAEAAAADAADwDwAA/B8AAPwfAAD8HwAA/j8AAP4/AADwBwAA";

(() => {
    'use strict';
    const disallow = {//已被禁言的用户不应再被举报
        "https://www.mcbbs.net/home.php?mod=spacecp&ac=usergroup&gid=4": "禁止发言",
        "https://www.mcbbs.net/home.php?mod=spacecp&ac=usergroup&gid=5": "禁止访问",
        "https://www.mcbbs.net/home.php?mod=spacecp&ac=usergroup&gid=6": "禁止IP",
        "https://www.mcbbs.net/home.php?mod=spacecp&ac=usergroup&gid=9": "Herobrine"
    };

    function byId(id){
        return document.getElementById(id);
    }

    function isEditing(){//判断是否在编辑举报
        let args = window.location.search.substring(1).split("&");
        return args.indexOf("mod=post") >= 0 && args.indexOf("action=edit") >= 0 && args.indexOf("tid=557610") >= 0;
    }

    function findEditableReportInThisPage(){//找到一个未处理的举报帖
        let btns = byId("postlist").getElementsByClassName("editp");
        if(btns.length == 0){
            return null;
        }
        let post = btns[0].parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement;//编辑键向上走8层
        if(byId(post.id.replace("post", "ratelog")) == null){//判断举报是否被处理是依据是否有评分
            return btns[0].href;
        }
        return null;
    }

    function getUserGroup(){
        for(let em of document.getElementsByClassName("xg1")){
            if(em.outerHTML == "<em class=\"xg1\">用户组&nbsp;&nbsp;</em>"){
                return em.parentElement.getElementsByTagName("a")[0].href;
            }
        }
        return null;
    }

    let uhd = byId("uhd");
    let myuid = byId("user_info").children[0].children[0].href.substring("https://www.mcbbs.net/home.php?mod=space&uid=".length);
    if(uhd){//在个人主页
        let p = uhd.children[0].children[0];
        if(p.children.length >= 2){
            let target = document.createElement("li");
            let a = document.createElement("a");
            target.appendChild(a);
            a.className = "cavenightingale_report";
            a.href = `https://www.mcbbs.net/forum.php?mod=viewthread&tid=557610&page=1&authorid=${myuid}`;
            if(newtab){
                a.target = "_blank";
            }
            let link = document.createTextNode("举报水龙头");
            a.appendChild(link);
            p.appendChild(target);
            a.onclick = function(){
                localStorage["cavenightingale:report_context"] =//这段内容来自版规
`违规者用户名(必填):${uhd.children[1].children[1].innerHTML.replace("\n","")}
违规者个人资料链接(必填):${uhd.children[1].children[2].children[0].innerHTML}
违规类型(必填):[签名档违规/头像违规/用户名违规/水龙头,可多选]水龙头
违规截图(可选, 水龙头举报无需附图):`;
                let group = getUserGroup();
                if(disallow[group]){
                    localStorage["cavenightingale:report_confirm"] = `您正在尝试举报一名${disallow[group]}的用户！\n继续举报可能违规\n点击“确定”继续举报`;
                }
            }
        }
    }

    if(localStorage["cavenightingale:report_context"]){
        if(isEditing()){//在编辑举报
            let context = byId("e_textarea");
            let report = localStorage["cavenightingale:report_context"];
            if(localStorage["cavenightingale:report_confirm"] ? confirm(localStorage["cavenightingale:report_confirm"]) : true){
                if(context.value.indexOf(report.split("\n")[0]) >= 0 ? confirm("您对此用户的上一个举报尚未被处理！\n继续举报可能违规\n点击“确定”继续举报") : true){
                    context.value += "\n\n" + report;
                    byId("e_iframe").contentDocument.body.innerHTML += ("\n\n" + report).replace(/\n/g, "<br>");
                }
            }
            delete localStorage["cavenightingale:report_context"];
            delete localStorage["cavenightingale:report_confirm"];
        }

        let url = String(window.location);
        if(url == `https://www.mcbbs.net/forum.php?mod=viewthread&tid=557610&page=1&authorid=${myuid}`){//在举报专用帖下
            let last = findEditableReportInThisPage();
            if(last != null){
                window.location = last;
            }else{
                window.location = "https://www.mcbbs.net/thread-557610-1-1.html";
            }
        }else if(url == "https://www.mcbbs.net/thread-557610-1-1.html"){
            if(localStorage["cavenightingale:report_confirm"] ? confirm(localStorage["cavenightingale:report_confirm"]) : true){
                let context = byId("fastpostmessage");
                context.value = localStorage["cavenightingale:report_context"];
                context.focus();
            }
            delete localStorage["cavenightingale:report_context"];
            delete localStorage["cavenightingale:report_confirm"];
        }
    }

    let style = document.createElement("style");
    style.innerHTML =
`.cavenightingale_report{
    background: url(${imageurl}) no-repeat 1px 2px!important;
    background-size: 16px!important;
}`;
    document.body.appendChild(style);
})();