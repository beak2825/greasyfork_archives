// ==UserScript==
// @name         Edit store name
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  A script used to edit the name of store in taobao
// @author       sky1(qww)497363953@qq.com
// @match        https://buyertrade.taobao.com/trade/itemlist/*
// @icon         https://www.google.com/s2/favicons?domain=taobao.com
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/435359/Edit%20store%20name.user.js
// @updateURL https://update.greasyfork.org/scripts/435359/Edit%20store%20name.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var targetContainer = document.querySelectorAll(".seller-mod__container___zFAFV");
    var target = document.querySelectorAll(".seller-mod__name___2IlQm");
    var control = document.createElement("section");
    control.style.position = "fixed";
    control.style.width = "200px";
    control.style.height = "200px";
    control.style.backgroundColor = "#f3f3f3";
    control.style.top = "200px";
    control.style.left = "200px";
    control.setAttribute("class","control_box J_xiaomi_dialog");
    control.innerHTML = `<h4 style="text-align: center;">Edit store name</h4>
                         <input type="checkbox" id="edit" style="cursor: pointer;">
                         <label for="edit" style="cursor: pointer;">编辑店铺名称</label>
                         <button id="hide">隐藏控制面板</button>`;
    document.body.append(control);
    //控制面板拖拽功能
    var isDown = false,
        x = 0,
        y = 0,
        l = 0,
        t = 0;
    control.onmousedown = function(e){
        x = e.clientX;
        y = e.clientY;
        l = control.offsetLeft;
        isDown = true;
        control.style.cursor = "move";
        //control.removeAttribute("data-spm-anchor-id");
    }
    document.onmousemove = function(e){
        if(!isDown){
            return;
        }
        console.log(e);
        var nx = e.clientX,
            ny = e.clientY,
            nl = nx - (x - l),
            nt = ny - (y - t);
        if(nl < 0){
            control.style.left = "0px";
        }else if(nl > document.body.clientWidth - 85){
            control.style.left = document.body.clientWidth - 85 + "px";
            //console.log(nl,nx);
        }else{
            control.style.left = nl + "px";
            //console.log(nl,nx);
        }
        if(nt < 0){
            control.style.top = "0px";
        }else if(nt > document.body.clientHeight - 100){
            control.style.top = document.body.clientHeight - 100 + "px";
            //console.log(nt,ny);
        }else{
            control.style.top = nt + "px";
            //console.log(nt,ny);
        }
    }
    document.onmouseup = function(){
        isDown = false;
        control.style.cursor = "default";
    }
    function edit(){
        for(var item of target){
            var content = `<span class="seller-mod__name___2IlQm" data-href="${item.href}" style="display: block;width: 100%;" contenteditable = "true">${item.innerText}</span>`;
            item.innerHTML = content;
            item.href = "javascript:void(0);";
            item.target = "_self";
        }
    }
    function refresh(){
        for(var item of target){
            var content = item.children[0].innerText,
                href = item.children[0].getAttribute("data-href");
            console.log(href);
            item.href = href;
            item.target = "_target";
            item.innerHTML = content;
        }
    }
    var control_child = control.children;
    control_child[1].onclick = function(){
        console.log(control_child[1].checked);
        if(control_child[1].checked){
            edit();
        }else{
            refresh();
        }
    }
    function hide(){
        control.style.display = "none";
    }
    control_child[3].onclick = function(){
        hide();
    }

    //edit();
    // Your code here...
})();