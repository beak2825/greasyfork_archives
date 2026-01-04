// ==UserScript==
// @name         WOWS_GetTaskBonuses
// @namespace    http://mai.team/Inku
// @version      1.3
// @description  World Of Bullshits
// @author       Inku_Xuan
// @match        http://wows.kongzhong.com/ztm/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/34931/WOWS_GetTaskBonuses.user.js
// @updateURL https://update.greasyfork.org/scripts/34931/WOWS_GetTaskBonuses.meta.js
// ==/UserScript==


    function auto_get_gifts(){
        setTimeout(sign,0);
        setTimeout(gettask2,200);
        setTimeout(gettask3,400);
        setTimeout(gettask4,600);
        setTimeout(gettask5,800);
        setTimeout(gettask6,1000);
        setTimeout(gettask7,1200);
        setTimeout('dialog.alertMsg("提示","已领取至多6个任务和1个签到","dialog.closeDiv()","n");', 1400);
    }

    var auto_sign_button = document.createElement("input");
    auto_sign_button.setAttribute("type", "button");
    auto_sign_button.setAttribute("id", "bt1");
    auto_sign_button.setAttribute("width", "100");
    auto_sign_button.setAttribute("height", "30");
    auto_sign_button.setAttribute("value", "领奖励");
    auto_sign_button.setAttribute("style", "position:fixed;top:0;left:0;z-index:6000;");
    auto_sign_button.setAttribute("onclick", "auto_get_gifts()");
    var sc = document.createElement("script");
    var node = document.createTextNode(auto_get_gifts.toString());
    sc.appendChild(node);
    var body = document.body;
    body.appendChild(sc);
    body.insertBefore(auto_sign_button, body.firstChild);