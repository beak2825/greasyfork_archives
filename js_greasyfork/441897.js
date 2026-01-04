// ==UserScript==
// @name         【图灵】Discord 左侧导航变宽 更方便操作
// @namespace    http://tampermonkey.net/
// @version      0.4.1
// @description  Discord 左侧导航变宽 可以显示5列 更方便操作
// @author       You
// @match        https://discord.com/*
// @icon         data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACUAAAAfCAYAAABgfwTIAAACPElEQVRYhe2XsW/TQBTGvyL+Cs5bByR2xyMVFZ3tZKMQytqkGRtCZoQYCWnmqlI3EqdrpEgZa3tGYmDrvf4bxwBn2cm78xElpAO/Jcrl3fnzu3ffvewppRQeGI92LYDjvyhXnEVJIgyGIxwcHiFJM2vsYDjCcfMEg+GoMpZjz1boSZohSTMMhhel8aDmox6FILoHABARhBAQ4gkAoNvrl+I9IVCPQgQ1H0HNX19Ut9fHOJ5WLvC3XF9dVgpjRSVphuPmycYFAb+ztpjPrDFsTS1v1ybRtWljRZSuo20yiaeQRO6ilot0G0giTOIb4+8lUUmaWd9gk0wsh6gkyha4aSSRsUxWMmXDE8LJZ1zjTEnIRY0riq/TbmExn+H66hKL+QyeEGxcIwpLcY0oNK7plCkTQc1Hp32af/eEwOdPH9nY4rgnBM4K85YxJSEXlVq2jsuKvlKKcFtWtZVctpwyxb0RJ1Tfha7jlaJsRU50vyKMc2XuRFXVKsfj4oImJBFeN9/hrH2KoOZjEt8Yr6Jur593BFyHsQwxz80v5IPDo39mnEUaUbhyaHbeeQqmNp1EmTxpW+Si6haTq/8xxE675eTUgPa2ltVATXZRavIkEbq9PnsStRE2ohCSqHQi9ZHXD9Cf43hq7Do67VbJkI2iNIPhiO15fv74zi5igutg9W1gzbgycCel+jaJ1fn7D2r/6TN1m6SmUCuv3rxVz1+8VF++Xqg7KZ3mGEUtC1yXdeZa/2Ltip37FMeDFPUL3fUp5paJc/oAAAAASUVORK5CYII=
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/441897/%E3%80%90%E5%9B%BE%E7%81%B5%E3%80%91Discord%20%E5%B7%A6%E4%BE%A7%E5%AF%BC%E8%88%AA%E5%8F%98%E5%AE%BD%20%E6%9B%B4%E6%96%B9%E4%BE%BF%E6%93%8D%E4%BD%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/441897/%E3%80%90%E5%9B%BE%E7%81%B5%E3%80%91Discord%20%E5%B7%A6%E4%BE%A7%E5%AF%BC%E8%88%AA%E5%8F%98%E5%AE%BD%20%E6%9B%B4%E6%96%B9%E4%BE%BF%E6%93%8D%E4%BD%9C.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...

var runre=false;
console.log("Discode 左侧导航变宽 更方便操作!!!!!!!!!!!!!")


//等待navdom 存在 才执行
function waitForNavDom() {
console.log("111111111Discode 左侧导航变宽 更方便操作!!!!!!!!!!!!!")
var navdom = document.querySelector("nav")
    if (navdom) {
            var nav = document.querySelector("nav");

            //在nav前面插入缩放按钮
            var div2 = document.createElement("button");
            div2.style = `
                position: fixed;
                background-color: rgb(27, 255, 0);
                color: black;
                top: 0;
                left: 0;
                z-index: 99999;
                font-weight: bold;
                border-radius: 0 0 5px;`;
            div2.innerHTML = `缩小/展开`;
            div2.onclick = function () {
                if(!runre){
                    RunRe();
                }
                var navdom = document.querySelector("nav")
                if(navdom.style.width == "440px"){
                    console.log("宽度2",navdom.style.width)
                    navdom.style.width = "";
                }else{
                    console.log("宽度1",navdom.style.width)
                    navdom.style.width = "440px"
                }
            }
            nav.parentNode.insertBefore(div2, nav);


        setTimeout(()=>{
            if(!runre){
                RunRe();
            }
        }, 10000);

        setInterval(() => {
            var ycs = document.querySelectorAll("[class*=expandedFolderBackground]");
            //循环ycs 隐藏掉
            for (var i = 0; i < ycs.length; i++) {
                ycs[i].style.display = "none";
            }

        }, 1000);
    }
    else {
        setTimeout(waitForNavDom, 100);
    }
}
function RunRe(){
    var navdom = document.querySelector("nav")
    var style = document.createElement("style");
    style.type = "text/css";
    var text = document.createTextNode(`.wrapper-38slSD{
    background: #b7b7b754;
    box-sizing: border-box;
    border-radius: 10px;
    border: 3px solid #202225;}`); /* 这里编写css代码 */
    style.appendChild(text);
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
    navdom.style.width = "440px";
    var list = document.querySelectorAll("div[aria-label=服务器] > div")
    //循环 给每个元素添加css样式  float:left;
    for (var i = 0; i < list.length; i++) {
        list[i].style.float = "left";
    }
    document.querySelectorAll("div[class*=tutorialContainer]")[1].style.display = "none";

            var nav = document.querySelector("nav");
            //在nav前面插入div 内容为 num
            var div = document.createElement("div");
            div.style = `
    color: rgb(27, 255, 0);
    position: fixed;
    top: 3px;
    left: 120px;
    z-index: 99999;
    font-size: 12px;`;
            div.innerHTML = `服务器个数:${GetNum()} 点击刷新`;
            div.onclick = function () {
                this.innerHTML = "...";
                this.innerHTML = `服务器个数:${GetNum()} 点击刷新`;
            }
            nav.parentNode.insertBefore(div, nav);


    runre=true;
}

function GetNum() {
    var items1 = document.querySelectorAll("div[aria-label=服务器] > div[class*=listItem]");
    var items2 = document.querySelectorAll("div[aria-label=服务器] div[class*=iconInactive]");
    var num = items1.length + items2.length;
    return num;
}

waitForNavDom();
})();