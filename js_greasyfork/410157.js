// ==UserScript==
// @name         小鹅通自动发弹幕
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  用来在小鹅通直播中实现自动发送弹幕
// @author       Cheney
// @match        *.xiaoeknow.com/*
// @require      https://cdn.staticfile.org/jquery/3.4.1/jquery.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/410157/%E5%B0%8F%E9%B9%85%E9%80%9A%E8%87%AA%E5%8A%A8%E5%8F%91%E5%BC%B9%E5%B9%95.user.js
// @updateURL https://update.greasyfork.org/scripts/410157/%E5%B0%8F%E9%B9%85%E9%80%9A%E8%87%AA%E5%8A%A8%E5%8F%91%E5%BC%B9%E5%B9%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //模拟键盘输入
    function keyboardInput(dom, st) {
        var evt = new InputEvent('input', {
            inputType: 'insertText',
            data: st,
            dataTransfer: null,
            isComposing: false
        });
        dom.value = st;
        dom.dispatchEvent(evt);
    };
    //添加样式
    let style = $(`<style>.ch-div label{position:absolute;left:5px;bottom:5px}.ch-div span.run::after{border: 8px solid #fff;left: 12px;top: 12px;}.ch-div span.pause::after{border:10px solid;border-color: transparent transparent transparent #fff;left:17px;top:10px;}.ch-div span::after{content:"";width:0;height:0;position:absolute;}.ch-div span{display:inline-block;width:40px;height:40px;box-shadow:0 0 10px #ccc;border-radius:50%;background:#409EFF;position:absolute;right:5px;bottom:5px;cursor:pointer}.ch-div textarea{width:100%;height:100px;resize:none;padding:5px;outline:none}.ch-div{display:flex;z-index: 2029;width:330px;right:16px;bottom:50px;padding:14px;border-radius:8px;box-sizing:border-box;border:1px solid #ebeef5;position:fixed;background-color:#fff;box-shadow:0 2px 12px 0 rgba(0,0,0,.1);transition:opacity .3s,transform .3s,left .3s,right .3s,top .4s,bottom .3s;overflow:hidden;font-size: 14px;line-height: 21px;margin: 6px 0 0;color: #606266;}</style>`);
    $("body").append(style);
    let div = $("<div class='ch-div'></div>");
    let state = false;
    let textarea = $("<textarea placeholder='在这里输入要循环发送的弹幕~'></textarea>");//创建输入框
    textarea.focus(function(){
        this.select();//自动选中
    })
    div.append(textarea);
    let span = $("<span class='pause'></span>");//启动/关闭按钮
    let times = 0;//次数
    let timer;//定时器
    let aliveInputText0 = $("#aliveInputText0").get(0);//获取弹幕输入框
    let btn = $("#text_input_wrapper .submitInfo");//获取发送按钮
    let label = $("<label></label>");
    div.append(label);
    span.click(function(){
        let text = textarea.val();
        if(state){
            times = 0;
            clearInterval(timer);
            console.log("关闭自动发送");
        }else{
            console.log("启动自动发送");
            timer = setInterval(function(){
                keyboardInput(aliveInputText0,text);
                btn.click();
                times ++;
                label.text(times);
                console.log("第"+times+"次发送：",text);
            },500)
        }
        state = !state;
        span.toggleClass("pause run")
    })
    div.append(span);
    $("body").append(div);
})();