// ==UserScript==
// @name         数字城管自动刷新列表
// @namespace    http://tampermonkey.net/
// @version      1.0.7
// @description  成都市数字化城市管理信息系统自动刷新列表
// @author       huashen
// @match        http://tampermonkey.net/index.php?version=4.4&ext=dhdg&updated=true
// @grant        none
// @include      http://10.1.235.36:6888/*
// @include      http://171.221.172.74:6888/*
// @require      http://code.jquery.com/jquery-3.4.0.min.js
// @downloadURL https://update.greasyfork.org/scripts/407927/%E6%95%B0%E5%AD%97%E5%9F%8E%E7%AE%A1%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E5%88%97%E8%A1%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/407927/%E6%95%B0%E5%AD%97%E5%9F%8E%E7%AE%A1%E8%87%AA%E5%8A%A8%E5%88%B7%E6%96%B0%E5%88%97%E8%A1%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var isEnd = true; //setInterval 的开关，避免 setInterval 产生多个ID，无法关闭
    // 声明变量：循环执行，按钮
    var toRefresh,btStartRefresh, btEndRefresh;
    //
    function SetStart(){
        isEnd = false;
        document.getElementById("btStartRefresh").disabled = true;
        document.getElementById("btEndRefresh").disabled = "";
    }
    function SetEnd(){
        isEnd = true;
        document.getElementById("btStartRefresh").disabled = "";
        document.getElementById("btEndRefresh").disabled = true;
    }
    //声明方法：刷新受理员、值班长(派遣员)的列表，取消刷新
    function SLYRefresh(){
        if(isEnd){
            SetStart();
            toRefresh = setInterval(function(){
                setTimeout(function(){$(".app-tabs-head .app-tabs-item")[1].click();},0);
                setTimeout(function(){$(".app-tabs-head .app-tabs-item")[2].click();},2000);
            },4000);
            console.log(toRefresh);
        }
    }
    function ZBZRefresh(){
        if(isEnd){
            SetStart();
            toRefresh = setInterval(function(){
                setTimeout(function(){$(".app-tabs-head .app-tabs-item")[0].click();},0);
            },2000);
        }
        console.log(toRefresh);
    }
    function EndRefresh(){
        SetEnd();
        clearInterval(toRefresh);
        console.log(toRefresh);
    }
    // 声明方法：赋值按钮变量，附加按钮元素到页面，绑定事件
    function CreateButton(role){
        btStartRefresh = document.createElement("button");
        btEndRefresh = document.createElement("button");
        btStartRefresh.innerHTML = " -- 开始刷新 -- ";
        btEndRefresh.innerHTML = " -- 停止刷新 -- ";
        btStartRefresh.style.color = "black";
        btEndRefresh.style.color = "black";
        btStartRefresh.setAttribute("id","btStartRefresh");
        btEndRefresh.setAttribute("id","btEndRefresh");
        btEndRefresh.setAttribute("disabled",true);
        document.getElementById("desktop-head").appendChild(btStartRefresh);
        document.getElementById("desktop-head").appendChild(btEndRefresh);

        switch(role){
            case "受理员":
                btStartRefresh.onclick = SLYRefresh;
                break;
            case "值班长":
            case "派遣员":
                btStartRefresh.onclick = ZBZRefresh;
                break;
            default:
                break;
        }
        btEndRefresh.onclick = EndRefresh;
    }
    //初始化（打开页面10秒后初始化按钮）
    setTimeout(function(){
        if($(".desktop-human-message .desktop-human-message-name").attr("title").match("受理员")=="受理员"){
            CreateButton("受理员");
        }
        else if($(".desktop-human-message .desktop-human-message-name").attr("title").match("值班长")=="值班长"){
            CreateButton("值班长");
        }
        else if($(".desktop-human-message .desktop-human-message-name").attr("title").match("派遣员")=="派遣员"){
            CreateButton("派遣员");
        }
    },10000);

})();