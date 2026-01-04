// ==UserScript==
// @name         一键购买csgo饰品
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  实现skinport与waxpeer市场批量加入购物车
// @author       skyxiaoc
// @match        https://greasyfork.org/zh-CN
// @icon         https://www.google.com/s2/favicons?sz=64&domain=greasyfork.org
// @grant        none
// @include      *://skinport.com/*
// @include      *://waxpeer.com/*
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/465366/%E4%B8%80%E9%94%AE%E8%B4%AD%E4%B9%B0csgo%E9%A5%B0%E5%93%81.user.js
// @updateURL https://update.greasyfork.org/scripts/465366/%E4%B8%80%E9%94%AE%E8%B4%AD%E4%B9%B0csgo%E9%A5%B0%E5%93%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    //console.log("script start");
    // Your code here...
    //var price = document.getElementsByClassName("ItemPreview-priceValue")[0].getElementsByClassName("Tooltip-link")[0].innerHTML;
    //console.log(price);
    window.onload=function(){


        var wait = setInterval(function() {
            let url = window.location.href
            try {
                var price = document.getElementsByClassName("ItemPreview-priceValue")[0].getElementsByClassName("Tooltip-link")[0].innerHTML;
                console.log(price);
                if(price != undefined){
                    let button = document.createElement("button"); //创建一个按钮
                    button.textContent = "一键购买"; //按钮内容
                    button.style.width = "90px"; //按钮宽度
                    button.style.height = "28px"; //按钮高度
                    button.style.align = "center"; //文本居中
                    button.style.color = "white"; //按钮文字颜色
                    button.style.background = "#e33e33"; //按钮底色
                    button.style.border = "1px solid #e33e33"; //边框属性
                    button.style.borderRadius = "4px"; //按钮四个角弧度
                    document.getElementsByClassName("HeaderMenu-filter")[0].appendChild(button);
                    button.addEventListener("click", check); //监听按钮点击事件
                    clearInterval(wait);
                    console.log("load skinport website");
                }
             }
             catch(err) {
                console.log();
             }

            try {
                let price2 = document.getElementsByClassName("item_body")[0].getElementsByClassName("c-usd")[0].innerHTML;
                console.log(price2);
                if(price2 != undefined){
                    clearInterval(wait);
                    var button2 = document.createElement("button"); //创建一个按钮
                    button2.textContent = "一键购买"; //按钮内容
                    button2.style.width = "90px"; //按钮宽度
                    button2.style.height = "28px"; //按钮高度
                    button2.style.align = "center"; //文本居中
                    button2.style.color = "white"; //按钮文字颜色
                    button2.style.background = "#e33e33"; //按钮底色
                    button2.style.border = "1px solid #e33e33"; //边框属性
                    button2.style.borderRadius = "4px"; //按钮四个角弧度
                    document.getElementsByClassName("live_toolbar pb16")[0].appendChild(button2);
                    button2.addEventListener("click", waxpeer) //监听按钮点击事件
                    console.log("load waxpeer website");
                }
            }
            catch(err) {
                console.log();
            }
        }, 1000);



    };
})();


function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}

function check(){
    let input_price = prompt("一键购买价格","");
    if(input_price == null){
        return;
    }
    input_price = parseFloat(input_price);
    let buynum = document.getElementsByClassName("ItemPreview-priceValue").length;
    let i = 0;
    let buytime = setInterval(function() {
        let interprice = document.getElementsByClassName("ItemPreview-priceValue")[i].getElementsByClassName("Tooltip-link")[0].innerHTML;
        if(parseFloat(interprice.substr(1))<=input_price){
            console.log(parseFloat(interprice.substr(1)));
            document.getElementsByClassName("ItemPreview-mainAction")[i].click();
            sleep(10);
        }
        i += 1;
        if(i>=buynum){
            clearInterval(buytime);
            alert("购买完毕");
        }
    }, 10);

}

function waxpeer(){
    let input_price = prompt("一键购买价格","");
    if(input_price == null){
        return;
    }
    input_price = parseFloat(input_price);
    let buynum = document.getElementsByClassName("item_body").length;
    let i = 0;
    let buytime = setInterval(function() {
        let interprice = document.getElementsByClassName("item_body")[i].getElementsByClassName("c-usd")[0].innerHTML;
        if(parseFloat(interprice.substr(1))<=input_price){
            console.log(parseFloat(interprice.substr(1)));
            document.getElementsByClassName("btn btn-secondary px12")[i].click();
            sleep(10);
        }
        i += 1;
        if(i>=buynum){
            clearInterval(buytime);
            alert("购买完毕");
        }
    }, 10);
}