// ==UserScript==
// @name         去除logo水印
// @namespace    http://tampermonkey.net/
// @version      1.3.0
// @description  免费的去除在线制作logo中的水印，适用于标智客、标小智、LOGO123
// @license      AGPL-3.0-or-later
// @author       imoki
// @match        *://www.logomaker.com.cn/*
// @match        *://www.logosc.cn/*
// @match        *://ai.logo123.com/*
// @icon         data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjc1ODQ2Mjc3NTMyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjIwMzgiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTg1MS41ODUgMTcyLjQxNmMtMTIuODg5LTEyLjg4OC0zMy43ODEtMTIuODg4LTQ2LjY3IDBsLTMyLjc2MSAzMi43NjFjLTE5LjE0OC0xNC44MTYtNDMuMTUtMjMuNjQ4LTY5LjE3OS0yMy42NDhoLTg1LjI3N2MtNjIuNDUzIDAtMTEzLjI2MiA1MC44MDktMTEzLjI2MiAxMTMuMjYxdjE3OC4xMDRMMjg1LjkzMSA2OTEuNGMtNy41NTctOC4zODEtMTIuMTY2LTE5LjQ2OS0xMi4xNjYtMzEuNjE2VjMzNy4yNWMwLTE5LjM3OCAxMi4xNDQtMzcuMDkzIDMwLjIxNy00NC4wODFsMTQ2LjcwMS01Ni43MjJjMTYuOTk5LTYuNTcyIDI1LjQ1MS0yNS42ODEgMTguODc4LTQyLjY4LTYuNTcyLTE2Ljk5OS0yNS42NzktMjUuNDQ5LTQyLjY4LTE4Ljg3OEwyODAuMTggMjMxLjYxYy0yMS40MTQgOC4yNzktMzkuNTkzIDIyLjY2NS01Mi41NzQgNDEuNjAxcy0xOS44NDIgNDEuMDgxLTE5Ljg0MiA2NC4wMzl2MzIyLjUzNGMwIDMwLjM0MyAxMS45OTYgNTcuOTM2IDMxLjQ5MiA3OC4yOWwtNjYuODQxIDY2Ljg0MWMtMTIuODg3IDEyLjg4OC0xMi44ODcgMzMuNzgyIDAgNDYuNjcgNi40NDQgNi40NDMgMTQuODg5IDkuNjY1IDIzLjMzNCA5LjY2NXMxNi44OTEtMy4yMjIgMjMuMzM0LTkuNjY1bDgwLjU3LTgwLjU3YTExMy4zNTcgMTEzLjM1NyAwIDAgMCAyMS4zNzEgMi4wMzFoMTE3LjUyOWMxOC4yMjYgMCAzMy0xNC43NzQgMzMtMzNzLTE0Ljc3NC0zMy0zMy0zM2gtNzQuOTMxbDE0MC44MTItMTQwLjgxMnYyNTIuMDk4YzAgMTguMjI2IDE0Ljc3NCAzMyAzMyAzM3MzMy0xNC43NzQgMzMtMzNWNTAwLjIzNGwxNzkuOC0xNzkuOHYzMTcuNTA4bC00Mi4zMTktNDIuMzJjLTEyLjg4OC0xMi44ODctMzMuNzgzLTEyLjg4OC00Ni42NjktMC4wMDEtMTIuODg4IDEyLjg4OC0xMi44ODggMzMuNzgyLTAuMDAxIDQ2LjY2OWw2NC40MDEgNjQuNDAyYzE1LjIzMSAxNS4yMzEgMzcuOTM0IDE5Ljc0NSA1Ny44MzEgMTEuNTAyIDE5Ljg5OS04LjI0MyAzMi43NTctMjcuNDg2IDMyLjc1Ny00OS4wMjVWMjk0Ljc5MWMwLTEyLjE1OS0xLjkzNC0yMy44NzMtNS40OTYtMzQuODZsNDAuODQ2LTQwLjg0NmMxMi44ODgtMTIuODg4IDEyLjg4OC0zMy43ODIgMC4wMDEtNDYuNjY5ek01NzAuNDM2IDI5NC43OTFjMC0yNi4wNiAyMS4yMDEtNDcuMjYxIDQ3LjI2Mi00Ny4yNjFoODUuMjc3YTQ2Ljk0OCA0Ni45NDggMCAwIDEgMjEuNTg3IDUuMjRMNTcwLjQzNiA0MDYuODk1VjI5NC43OTF6IiBwLWlkPSIyMDM5IiBmaWxsPSIjMTU4NGJmIiBkYXRhLXNwbS1hbmNob3ItaWQ9ImEzMTN4Ljc3ODEwNjkuMC5pMCIgY2xhc3M9IiI+PC9wYXRoPjxwYXRoIGQ9Ik0zMzIuODU1IDQzOS44NTZjLTE4LjIyNiAwLTMzIDE0Ljc3NC0zMyAzM3MxNC43NzQgMzMgMzMgMzNoMTA1LjkyN2MxOC4yMjYgMCAzMy0xNC43NzQgMzMtMzNzLTE0Ljc3NC0zMy0zMy0zM0gzMzIuODU1eiIgcC1pZD0iMjA0MCIgZmlsbD0iIzE1ODRiZiI+PC9wYXRoPjwvc3ZnPg==
// @grant GM_setValue
// @grant GM_getValue
// @grant GM_setClipboard
// @grant GM_log
// @grant GM_xmlhttpRequest
// @grant unsafeWindow
// @grant window.close
// @grant window.focus
// @downloadURL https://update.greasyfork.org/scripts/459647/%E5%8E%BB%E9%99%A4logo%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/459647/%E5%8E%BB%E9%99%A4logo%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function($) {
    'use strict';
    // 休眠，单位秒
    function sleep(time, desc = 'sleep') {
        return new Promise(resolve => {
            setTimeout(() => {
                console.log(desc, time, 's')
                resolve(time)
            }, Math.floor(time * 1000))
        })
    }
    //$("div.watermark").remove();

    // 添加手动去除水印功能
    var buttonClear=`
    <div style='padding:10px; position: fixed; float: right; top: 50%; z-index: 99999; overflow: visible;'>
        <button id='clearWatermark'
                style='display:flex;
                       align-items:flex-end;
                       padding: 10px;
                       margin-bottom:10px;
                       box-shadow: 2px 3px 5px #000;
                       border:1px solid #96C2F1;
                       border-radius: 21px;
                       font-size:10px;
                       text-align:center;
                       background-color: #B2D3F5;
                       color:#000000;
                       width: auto;
                       height: auto;'>
            <b>去水印</b>
        </button>
        <button id='clearBackground'
                style='display:flex;
                       align-items:flex-end;
                       padding: 10px;
                       box-shadow: 2px 3px 5px #000;
                       border:1px solid #96C2F1;
                       border-radius: 21px;
                       font-size:10px;
                       text-align:center;
                       background-color: #B2D3F5;
                       color:#000000;
                       width: auto;
                       height: auto;'>
            <b>去背景</b>
        </button>
    </div>`;
    $("body").prepend(buttonClear);
    $("button#clearWatermark").click(function(){
        $(".watermark").remove();
        $(".watermarklayer").remove();
    });
        $("button#clearBackground").click(function(){
        $(".background").remove();
    });

    // 标智客
    // 自动去除水印功能
    let list = document.querySelectorAll('.watermark')
    for(let index=0; index<list.length;index++){
        let item=list[index]
        //console.log(item)
        item.remove()
    }

    // 标小智、LOGO123
    function clearBXZ(){
        let temp= document.getElementsByClassName("watermarklayer");
        //let temparry = Array.from(temp)
        setTimeout(() => {
            for(let index=0; index<temp.length;index++){
                let item=temp[index]
                item.remove()
            }
        },500);
    }

    // 判断滚动的程度
    function scrollMouse(){
        // 页面高度
        var heightHtml = document.body.scrollHeight || document.documentElement.scrollHeight;
        // 可视高度
        var heightClient = document.body.clientHeight || document.documentElement.clientHeight;
        // 滚动条的top位置
        var scrollTop = document.body.scrollTop || document.documentElement.scrollTop;
        // 距离底部高度600px则执行
        if (scrollTop + heightClient > heightHtml - 500) {
            clearBXZ();
        }
    }

    // 防止抖动
    function PreventJitter(func, delay){
        let timeout;
        return function() {
            clearTimeout(timeout);
            timeout = setTimeout(()=>{
                func.apply(this, arguments);
            },delay)
        }
    }

    // 监听滚动
    window.onscroll = PreventJitter(scrollMouse, 200);

    window.onload = function(){
        // 第一次加载时，先等待5秒，等图片加载出来再执行
        setTimeout(() => {
            clearBXZ();
        },5000);
    }


    /*
    document.onreadystatechange = function() 　　//当页面加载状态改变的时候执行function
    {
        if(document.readyState == "complete")
        { 　　//当页面加载状态为完全结束时进入
            console.log("ok")
        }
    }
    */

})(jQuery);