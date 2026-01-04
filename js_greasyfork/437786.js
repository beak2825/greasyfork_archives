// ==UserScript==
// @name         如故云自动注册
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  如故云的自动化流程，自动注册账号，自动复制订阅链接地址
// @author       HooHeHa
// @match        https://ruguyun.com/*
// @icon         https://www.hualigs.cn/image/61cd6519df450.jpg
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/437786/%E5%A6%82%E6%95%85%E4%BA%91%E8%87%AA%E5%8A%A8%E6%B3%A8%E5%86%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/437786/%E5%A6%82%E6%95%85%E4%BA%91%E8%87%AA%E5%8A%A8%E6%B3%A8%E5%86%8C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //获取当前页面地址
    let href = window.location.href;

    //判断所在页面

    if(href=="https://ruguyun.com/#/login"){
        //跳转到注册页
        window.location.href="https://ruguyun.com/#/register"
        //刷新页面
        location.reload();
    }

    if(href=="https://ruguyun.com/#/register"){

        //创建11位数的随机数
        let randomCode = Math.round(Math.random()*10000000000)+10000000000;

        //默认密码
        let pwd = 12345678;

        //获取所有包含placeholder的元素对象
        let inputList = document.querySelectorAll("input[placeholder]");
        inputList[0].value=randomCode+"@qq.com";
        inputList[1].value=pwd;
        inputList[2].value=pwd;

        //获取所有的按钮对象
        let buttonList = document.querySelectorAll("button[type]");

        //判断是否是注册按钮的对象
        let sign;
        buttonList.forEach(function(e){
            if(e.type=="submit"){
                sign=e;
            }
        })

        //提交表单
        sign.click();

    }


    let int = setInterval(function(){
            //console.log("开始计时");
            //查找所有包含类 mb-3 的元素
            let btnList = document.querySelectorAll(".mb-3");
            //console.log(btnList[1]);
            //获取所有a标签
            let aList = document.querySelectorAll("a");
            //console.log(aList);
            //循环a标签
            aList.forEach(function(e){
                //判断a标签的值是否包含 一键订阅 文字
                if(e.innerText.indexOf("一键订阅") !=-1){
                    //console.log(e);
                    //停止计时器
                    int = window.clearInterval(int);

                    //点击一键订阅按钮
                    e.click();

                    //获取复制订阅地址按钮对象
                    let fzdydz = document.querySelector(".ant-dropdown-menu-item");
                    //console.log(fzdydz);

                    //点击复制订阅地址按钮
                    fzdydz.click();
                }
            })

        },1000);
})();