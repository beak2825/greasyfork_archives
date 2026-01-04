// ==UserScript==
// @name         Stackoverflow 轻度汉化
// @namespace    http://tampermonkey.net/
// @version      4.0
// @description  stackoverflow 轻度汉化，包含 stackexchange 汉化
// @author       Zszen
// @match        https://stackoverflow.com/questions/*
// @match        https://*.stackoverflow.com/questions/*
// @match        https://stackexchange.com/questions/*
// @match        https://*.stackexchange.com/questions/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/380639/Stackoverflow%20%E8%BD%BB%E5%BA%A6%E6%B1%89%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/380639/Stackoverflow%20%E8%BD%BB%E5%BA%A6%E6%B1%89%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //修改日期格式
    //setTimeout(()=>{
    var dicTrans = {"active":"活跃度","oldest":"旧答案","votes":"投票数","Log In":"登陆","Sign Up":"注册","Ask Question":"提个问题"," Answers":"个回答","answered":"回答","asked":"提问","edited":"修改","today":"今天","yesterday":"昨天","days":"天","ago":"以前","times":"次","months":"个月","month":"个月","years":"年","year":"年","half":"半"};
    var dates = $("span.relativetime-clean");
    //console.log(dates.length);
    for(var i=0;i<dates.length;i++){
        dates[i].textContent = getLocaleDateStr(dates[i].title)
    }
    dates = $("span.relativetime")
    for(i=0;i<dates.length;i++){
        dates[i].textContent = getLocaleDateStr(dates[i].title)
    }
    //登陆
    var nm = $("a.login-link.s-btn.btn-topbar-clear.py8")[0];
    nm.textContent = transMe(nm.textContent)
    nm = $("a.login-link.s-btn.s-btn__primary.py8.btn-topbar-primary")[0];
    nm.textContent = transMe(nm.textContent)
    nm = $("a.d-inline-flex.ai-center.ws-nowrap.s-btn.s-btn__primary")[0];
    nm.textContent = transMe(nm.textContent)
    //修改
    var infos = $("div.user-action-time").find("a")
    for(i=0;i<infos.length;i++){
        if(infos[i].childNodes[0])infos[i].childNodes[0].textContent = transMe(infos[i].childNodes[0].textContent);
        //if(infos[i].childNodes[0]
    }
    //回答
    infos = $("div.user-action-time");
    for(i=0;i<infos.length;i++){
        infos[i].childNodes[0].textContent = transMe(infos[i].childNodes[0].textContent);
    }
    //console.log([123,infos.textContent])
    //插入评论
    var bts = $("a.js-add-link.comments-link.disabled-link");
    for(i=0;i<bts.length;i++){
        bts[i].textContent = "插入评论"
    }
    //分享
    bts = $("a.short-link");
    for(i=0;i<bts.length;i++){
        bts[i].textContent = "分享"
    }
    //改良内容
    bts = $("a.suggest-edit-post");
    for(i=0;i<bts.length;i++){
        bts[i].textContent = "改良内容"
    }
    //提问者信息
    var datas = $("div.module.question-stats").find("p.label-key");
    var type = 0;
    for(i=0;i<datas.length;i++){
        //console.log(datas[i],i,datas.length);
        if(datas[i].textContent=="asked"){
            datas[i].textContent="提问时间";
            type = 1;
            continue;
        }else if(datas[i].textContent=="viewed"){
            datas[i].textContent="访问次数";
            type = 2;
            continue;
        }else if(datas[i].textContent=="active"){
            datas[i].textContent="最近访问";
            type = 3;
            continue;
        }
        datas[i].textContent = transMe(datas[i].textContent);
    }

    infos = $("div.subheader.answers-subheader").find("h2");
    infos.find("span").remove();
    for (i = 0; i < infos.length; i++) {
		infos[i].textContent = transMe(infos[i].textContent);
	}
    infos = $("div#tabs").find("a");
    for (i = 0; i < infos.length; i++) {
		infos[i].textContent = transMe(infos[i].textContent);
	}
    infos = $("a.js-show-link.comments-link");
    for (i = 0; i < infos.length; i++) {
		infos[i].textContent = infos[i].textContent.replace(/.*(\d).*/,"显示 $1 条更多评论");//show 5 more comments
	}
    infos = $("span.js-new-contributor-label");
    for (i = 0; i < infos.length; i++) {
		infos[i].textContent = "萌新贡献者";
	}

    function transMe(str1){
        //console.log(str1);
        for(var key in dicTrans){
            str1 = str1.replace(key,dicTrans[key]);
        }
        return str1;
    }

    //},500)
    function getLocaleDateStr(strDateOriginal){//"2013-09-21 14:10:03Z"
        var arrDate = strDateOriginal.split(" ")[0].split("-")
        var arrTime = strDateOriginal.split(" ")[1].split(":")
        var dt = new Date(parseInt(arrDate[0]),parseInt(arrDate[1]),parseInt(arrDate[2]),parseInt(arrTime[0]),parseInt(arrTime[1]),parseInt(arrTime[2]));
        return dt.toLocaleDateString()+" "+dt.toLocaleTimeString()
    }
})();