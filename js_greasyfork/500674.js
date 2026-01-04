// ==UserScript==
// @name         千千蓝鲸OJ优化
// @namespace    https://script.yaka.fun/
// @version      1.4.1
// @description  千千蓝鲸OJ的优化脚本，包括但不限于：动画优化、毛玻璃优化等
// @author       The ScriptAll Project
// @match        https://qqwhale.com/*
// @match        https://*.aicoders.cn/*
// @icon          https://cdnjson.com/images/2024/07/31/qqw.jpg
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/500674/%E5%8D%83%E5%8D%83%E8%93%9D%E9%B2%B8OJ%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/500674/%E5%8D%83%E5%8D%83%E8%93%9D%E9%B2%B8OJ%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==
 
(function() {
    'use strict';
 
    var styleElement = document.createElement("style");
    styleElement.innerText = `
 
        @-webkit-keyframes flowCss {
            0% {
                /* 移动背景位置 */
                background-position: 0 0;
            }
 
            100% {
                background-position: -400% 0;
            }
        }
       .oj-table-row:hover .option-btn{
          background-image: url(https://cloudflare.cdnjson.com/images/2024/07/31/8505cefae6f334e6e13f50e37d878371.jpg);
          background-repeat: no-repeat;
          border-radius: 8px;
       }
       .el-image__inner{
           background-color: black;
       }
       #problem-left {
          animation: slide-in 0.5s forwards;
        }
       #header {
          animation: slide-in 0.5s forwards;
        }
        .el-card {
          animation: slide-in 0.5s forwards;
        }
        .home-right {
          animation: slide-in 0.5s forwards;
        }
        @keyframes slide-in {
          0% {
            transform: translateX(-100%);
            opacity: 0;
          }
          100% {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .el-card {
            backdrop-filter: blur(25px) saturate(128%);
            -webkit-backdrop-filter: blur(25px) saturate(128%);
            background-color: rgba(255, 255, 255, 0.26);
            border-radius: 12px;
            border: 1px solid rgba(209, 213, 219, 0.3);
        }
        .vxe-table--header-wrapper {
            backdrop-filter: blur(25px) saturate(128%);
            -webkit-backdrop-filter: blur(25px) saturate(128%);
            background-color: rgba(255, 255, 255, 0.26);
            border-top-left-radius: 12px;
            border-top-right-radius: 12px;
            border: 1px solid rgba(209, 213, 219, 0.3);
        }
        .loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.3);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
        }
        .borderDom {
            position: relative;
            width: 58px;
            height: 30px;
            border-radius: 10px;
            border: 2px solid #333;
            animation: oneAnimation 4s cubic-bezier(.12, 0, .39, 0) infinite;
        }
        .option-btn:hover,
        .option-btn:focus {
            -webkit-animation: pulse 1s;
            animation: pulse 1s;
            box-shadow: 0 0 0 2em rgba(255, 255, 255, 0);
        }
        @-webkit-keyframes pulse {
            0% { box-shadow: 0 0 0 0 var(--hover); }
        }
        .el-tooltip.info-inner.cu-p.item {
            background: linear-gradient(to right, green, darkgreen);
            transition: background 2s ease-in-out;
        }
       `;
    document.head.appendChild(styleElement);
 
    var header = document.getElementById("header");
    var bg = document.getElementById("app");
    var headad = document.getElementsByClassName("el-carousel el-carousel--horizontal")[0];
    var footer = document.getElementById("fix-to-bottom");
 
    if (document.getElementsByClassName("el-card card-top is-never-shadow")[0]) {
        document.getElementsByClassName("el-card card-top is-never-shadow")[0].setAttribute("style", "backdrop-filter: blur(9px) saturate(180%); -webkit-backdrop-filter: blur(9px) saturate(180%); background-color: rgba(255, 255, 255, 0.43); border-radius: 12px; border: 1px solid rgba(209, 213, 219, 0.3);");
    }
 
    header.setAttribute("style", "backdrop-filter: blur(9px) saturate(180%); -webkit-backdrop-filter: blur(9px) saturate(180%); background-color: rgba(255, 255, 255, 0.43); border-radius: 0px 0px 12px 12px; border: 1px solid rgba(209, 213, 219, 0.3);");
 
    bg.setAttribute("style", "background-image: url(https://api.kdcc.cn)");
 
    var location = decodeURIComponent(window.location);
 
    console.log("qqwhale oj improve success loaded");
    console.log(headad);
    function Toast(msg, duration) {
        duration = isNaN(duration) ? 3000 : duration;
        var m = document.createElement('div');
        m.innerHTML = msg;
        m.style.cssText = "font-size: .32rem;color: rgb(255, 255, 255);background-color: rgba(0, 0, 0, 0.6);padding: 10px 15px;margin: 0 0 0 -60px;border-radius: 4px;position: fixed; top: 50%;left: 48%;width: 130px;text-align: center;";
        document.body.appendChild(m);
        setTimeout(function () {
            var d = 0.5;
            m.style.opacity = "0";
            setTimeout(function () { document.body.removeChild(m) }, d * 1000);
        }, duration);
    };
    function deleteAd(){
        const ad1=document.getElementsByClassName("el-carousel")[0];
        const ad2=document.getElementsByClassName("figure-item")[0];
        const footer = document.getElementsByClassName("fix-to-bottom")[0];
        const tikuad = document.getElementsByClassName("ad-container")[0];
        if(ad1){ad1.remove();};
        if(ad2){ad2.remove();};
        if(footer){footer.remove();};
        if(tikuad){tikuad.remove();};
    };
    setInterval(deleteAd,1000)
    ;}
)();