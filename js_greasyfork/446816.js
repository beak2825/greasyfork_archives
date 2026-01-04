// ==UserScript==
// @name         b站独轮车（开发测试版）
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于B站直播的弹幕重复发送,弹幕发送间隔时间建议为六秒及以上(不然容易发送过快)
// @author       tetu137
// @match        https://live.bilibili.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/446816/b%E7%AB%99%E7%8B%AC%E8%BD%AE%E8%BD%A6%EF%BC%88%E5%BC%80%E5%8F%91%E6%B5%8B%E8%AF%95%E7%89%88%EF%BC%89.user.js
// @updateURL https://update.greasyfork.org/scripts/446816/b%E7%AB%99%E7%8B%AC%E8%BD%AE%E8%BD%A6%EF%BC%88%E5%BC%80%E5%8F%91%E6%B5%8B%E8%AF%95%E7%89%88%EF%BC%89.meta.js
// ==/UserScript==


(function () {
    'use strict';
    const point1 = document.getElementsByClassName("bottom-actions p-relative")[0];
    const point2 = document.getElementsByClassName('chat-history-panel')[0];
    let panelBtn = 0; //面板开关的数值，点击展开独轮车面板，数值为1，0为关闭面板
    let tractorBtn = 0; //具体发送开关，开为1，关为0
    var value = ''; //输入框内容
    var time = 6; //弹幕发送间隔
    var timeval1;//循环定时器

    //创建控制面板开启按钮
    let btn = document.createElement("buttom");
    btn.className = 'switch-btn';
    btn.innerText = '拖拉机面板';
    btn.style.cssText = 'position: relative; left:0;top:0;box-sizing: border-box; line-height: 1; margin: 0; padding: 6px 12px; border: 0; cursor: pointer; outline: 0; overflow: hidden; display: inline-flex; justify-content: center; align-items: center; min-width: 80px; height: 24px; font-size: 12px; background-color: #23ade5; color: #fff; border-radius: 4px;'
    point1.appendChild(btn);

    // 创建控制面板和弹幕发送关闭按钮
    let btn1 = document.createElement("buttom");
    btn1.className = 'switch-btn';
    btn1.style.cssText = "display: none; position: relative; left:5px; top:0px; box-sizing: border-box; line-height: 1; margin: 0; padding: 6px 12px; border: 0; cursor: pointer; outline: 0; overflow: hidden; display: inline-flex; justify-content: center; align-items: center; min-width: 80px; height: 24px; font-size: 12px; background-color: #23ade5; color: #fff; border-radius: 4px;";
    btn1.innerText = '拖拉机关闭按钮';
    point1.appendChild(btn1);

    //创建控制面板
    let panel = document.createElement("div");
    panel.style.position = "absolute";
    panel.style.bottom = "145px";
    panel.style.left = "0px";
    panel.style.width = '100%';
    panel.style.zIndex = '100';
    panel.style.backgroundColor = 'black';
    panel.style.justifyContent = 'center';
    panel.style.alignItems = 'center';
    panel.style.display='none';
    panel.style.backgroundColor='aqua';
    // 设置面板背景图片
   panel.style.backgroundImage='url(https://ts1.cn.mm.bing.net/th/id/R-C.b7d4c65329ece995c33a8055d3ac87a0?rik=stip8Vy2LZsn1w&riu=http%3a%2f%2fimg.ewebweb.com%2fuploads%2f20200224%2f14%2f1582525667-KLqhXgQtJc.jpeg&ehk=cZb%2bK3mYfOTAYoESegGqU3eFl4qkF9G4hzhmG0P%2fdVk%3d&risl=&pid=ImgRaw&r=0)'
    panel.style.backgroundSize="contain";
    // 设置面板输入框
    let input=document.createElement("input");
    input.type='text';
    input.id='inputText';
    input.style.width='100%';
    input.style.height='16px';
    input.setAttribute("maxlength",20);
    input.placeholder='请输入一段不超过20个字的弹幕';
    // 设置面板时间调整部件
    let timerControl=document.createElement("div");
    let addTimeBtn=document.createElement("buttom");
    let subTimeBtn=document.createElement("buttom");
    addTimeBtn.innerText="+";
    subTimeBtn.innerText="-";
    addTimeBtn.style.fontSize="25px";
    subTimeBtn.style.fontSize="25px";
    addTimeBtn.style.cursor="pointer";
    subTimeBtn.style.cursor="pointer";
    let TimeSpan=document.createElement("span");
    TimeSpan.innerText="6";
    TimeSpan.style.fontSize="25px"
    timerControl.appendChild(addTimeBtn);
    timerControl.appendChild(TimeSpan);
    timerControl.appendChild(subTimeBtn);
    timerControl.style.display="block"
    timerControl.style.width="36px"
    timerControl.style.margin="0px auto";
    // 设置开启拖拉机按钮
    let loopBtn=document.createElement("buttom");
    loopBtn.innerText='开启拖拉机';
    loopBtn.style.display='block';
    loopBtn.style.fontSize="15px";
    loopBtn.style.margin="0px auto";
    loopBtn.style.width="92px";
    loopBtn.style.cursor="pointer";
    panel.appendChild(input);
    panel.appendChild(timerControl);
    panel.appendChild(loopBtn);

    point2.appendChild(panel);
    // 为按钮绑定点击事件，点击打开或关闭面板
    btn.addEventListener("click",function(){
        if(!panelBtn){
            panel.style.display="block";
            panelBtn=1;
        }
        else{
            panel.style.display='none';
            panelBtn=0;
        }
    });

    //为加减时间按钮绑定事件
    addTimeBtn.addEventListener("click",function(){
        time++;
        TimeSpan.innerHTML=time;
    });
    subTimeBtn.addEventListener("click",function(){
        time--;
        TimeSpan.innerHTML=time;
    });

    //为开启拖拉机按钮绑定事件
    loopBtn.addEventListener("click",function(){
        if(input.value==''){
            alert("请先输入内容在点击开启拖拉机按钮");
        }
        else if(time<=0){
            alert("间隔输入事件至少要大于0");
        }
        else{
            timeval1=setInterval(go,time*1000)
        }
    })

    //为关闭拖拉机按钮绑定事件
    btn1.addEventListener("click",function(){
        panel.style.display="none";
        clearInterval(timeval1);
    })

    // 发送弹幕函数
    function go(){
        let text=document.getElementsByClassName("chat-input")[1];
        let evt=new Event("input",{"bubbles":true, "cancelable":true});
        text.value=text._value=input.value;
        text.dispatchEvent(evt);
        document.querySelector('.live-skin-highlight-button-bg').click();
    };
})();