// ==UserScript==
// @name        Habitica Web增强
// @namespace    https://borber.cn
// @version      0.0.9
// @description  增强 Habitica 网页端
// @author       Borber
// @match        https://habitica.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/404405/Habitica%20Web%E5%A2%9E%E5%BC%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/404405/Habitica%20Web%E5%A2%9E%E5%BC%BA.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 自定义 关键词  将 html语句 放在 key /key 之间即可
    var key = 'borber';
    // 关闭团队 默认开启
    var hideGroub = true;
    // 关闭底部信息 默认开启
    var hideFooter = true;
    // 关闭玩家按钮内的 宝石推荐信息 默认开启
    var hideLearn = true;
    // 更小的 点击范围 markdown的解析 div 将不作为更新事件的响应范围 默认开启
    var lessClick = true;
    // 替换 主页玩家背景 默认关闭
    // midnight_castle 午夜城堡
    // clocktower 复古钟楼
    // steamworks 蒸汽时代
    // airship 横空飞艇
    // giant_dandelions 巨型蒲公英
    // ocean_sunrise 海上日出
    // rowboat 荡漾海上
    // aurora 绚丽极光
    var username = 'Borber';  // 填写用户名
    var background1 = 'midnight_castle';  // 填写背景代号
    var background2 = background1;

    const pattern = new RegExp('<p>' + key + '<\/p>.*<p>\/' + key + '<\/p>');
    var decode = false;
    setInterval(function () {
        // 关闭团队
        if(hideGroub && document.getElementsByClassName("topbar-item droppable")[3]){document.getElementsByClassName("topbar-item droppable")[3].innerHTML = ''; hideGroub = false;}
        // 关闭底部信息
        if(hideFooter && document.getElementsByClassName("row footer-row")[0]){document.getElementsByClassName("row footer-row")[0].innerHTML = ''; hideFooter = false;}
        // 关闭玩家按钮内的 宝石推荐信息
        if(hideLearn && document.querySelector("#menu_collapse > div.form-inline.desktop-only > div.habitica-menu-dropdown.dropdown.item-user.item-with-icon.open > div.dropdown-menu.dropdown-menu-right > div > li")){document.querySelector("#menu_collapse > div.form-inline.desktop-only > div.habitica-menu-dropdown.dropdown.item-user.item-with-icon.open > div.dropdown-menu.dropdown-menu-right > div > li").innerHTML = ''; hideLearn = false;}
        // 更小的 点击范围
        if(lessClick && document.getElementsByClassName("task-clickable-area task-clickable-area-user").length > 1) {
            document.getElementsByClassName("task-clickable-area task-clickable-area-user").forEach( i => {i.className = '';});
            document.getElementsByClassName("d-flex justify-content-between").forEach( i => {i.className += ' task-clickable-area task-clickable-area-user';});
            lessClick = false;
        };
        // 替换 主页玩家背景
        if(background1 != '' && document.querySelector("#app-header > div.member-details.d-flex > div:nth-child(1) > div")){document.querySelector("#app-header > div.member-details.d-flex > div:nth-child(1) > div").className = 'avatar background_'+background1; background1 = '';}
        var only = document.querySelector("#profile___BV_modal_body_ > div > div.header > div.row > div > div > div.member-stats.col-8 > div.d-flex.align-items-center.profile-first-row > div > h3 > span");
        if(only && only.innerHTML == username && document.querySelector("#profile___BV_modal_body_ > div > div.header > div.row > div > div > div.col-4 > div")){document.querySelector("#profile___BV_modal_body_ > div > div.header > div.row > div > div > div.col-4 > div").className = 'avatar background_'+background2;}
        // 实现 markdown  内嵌 html
        if(window.location.href == 'https://habitica.com/' && document.getElementsByClassName("task-notes small-text markdown").length > 1 && decode == false){
            document.getElementsByClassName("task-notes small-text markdown").forEach(i => {
            if(pattern.exec(i.innerHTML.replace(/\n/g,''))){
                var temp = document.createElement("div"); var replaceStr1 = '<p>'+ key + '<\/p>'; var replaceStr2 = '<p>\/' + key + '<\/p>';decode = true;
                temp.innerHTML = pattern.exec(i.innerHTML.replace(/\n/g,''))[0].replace(new RegExp(replaceStr1,'gm'),'').replace(new RegExp(replaceStr2,'gm'),'');
                i.innerHTML = i.innerHTML.replace(/\n/g,'').replace(pattern.exec(i.innerHTML.replace(/\n/g,'')),temp.innerText || temp.textContent);
            }});}else{decode = false;}},100);
})();