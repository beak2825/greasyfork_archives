// ==UserScript==
// @name         节日脚本，内容自己修改
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  happy new year
// @author       shaoyu
// @match        *://blog.csdn.net/*
// @match        *://www.zhihu.com/*
// @match        *://www.kxdao.net/*
// @match        *://www.bilibili.com/*
// @match        *://*/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=csdn.net
// @grant        unsafeWindow
// @license      MIT License
// @downloadURL https://update.greasyfork.org/scripts/456162/%E8%8A%82%E6%97%A5%E8%84%9A%E6%9C%AC%EF%BC%8C%E5%86%85%E5%AE%B9%E8%87%AA%E5%B7%B1%E4%BF%AE%E6%94%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/456162/%E8%8A%82%E6%97%A5%E8%84%9A%E6%9C%AC%EF%BC%8C%E5%86%85%E5%AE%B9%E8%87%AA%E5%B7%B1%E4%BF%AE%E6%94%B9.meta.js
// ==/UserScript==

(function() {
    'use strict';
        const style = document.createElement('style');
        style.type = 'text/css';
        style.textContent = `
        .deng-box1 {
            position: fixed;
            top: -30px;
            left: 10px;
            z-index: 9999;
            pointer-events: none;
        }

        .deng-box2 {
            position: fixed;
            top: -25px;
            left: 150px;
            z-index: 9999;
            pointer-events: none;
        }

        .deng-box3 {
            position: fixed;
            top: -28px;
            right: 10px;
            z-index: 9999;
            pointer-events: none;
        }

        .deng-box4 {
            position: fixed;
            top: -26px;
            right: 150px;
            z-index: 9999;
            pointer-events: none;
        }

        .deng-box1 .deng {
            position: relative;
            width: 120px;
            height: 90px;
            margin: 50px;
            background: #d8000f;
            background: rgba(216, 0, 15, 0.8);
            border-radius: 50% 50%;
            -webkit-transform-origin: 50% -100px;
            -webkit-animation: swing 3s infinite ease-in-out;
            box-shadow: -5px 5px 50px 4px rgba(250, 108, 0, 1);
        }

        .deng:before {
            position: absolute;
            top: -7px;
            left: 29px;
            height: 12px;
            width: 60px;
            content: " ";
            display: block;
            z-index: 999;
            border-radius: 5px 5px 0 0;
            border: solid 1px #dc8f03;
            background: #ffa500;
            background: linear-gradient(to right, #dc8f03, #ffa500, #dc8f03, #ffa500, #dc8f03);
        }

        .xian {
            position: absolute;
            top: -50px;
            left: 60px;
            width: 2px;
            height: 50px;
            background: #dc8f03;
        }

        .deng-a {
            width: 100px;
            height: 90px;
            background: #d8000f;
            background: rgba(216, 0, 15, 0.1);
            margin: 12px 8px 8px 10px;
            border-radius: 50% 50%;
            border: 2px solid #dc8f03;
        }

        .deng-b {
            width: 45px;
            height: 90px;
            background: #d8000f;
            background: rgba(216, 0, 15, 0.1);
            margin: -2px 8px 8px 26px;
            border-radius: 50% 50%;
            border: 2px solid #dc8f03;
        }

        .deng-t {
            font-family: Arial, Lucida Grande, Tahoma, sans-serif;
            font-size: 39px;
            color: #dc8f03;
            font-weight: bold;
            line-height: 85px;
            text-align: center;
        }

        .shui-a {
            position: relative;
            width: 5px;
            height: 20px;
            margin: -5px 0 0 59px;
            -webkit-animation: swing 4s infinite ease-in-out;
            -webkit-transform-origin: 50% -45px;
            background: #ffa500;
            border-radius: 0 0 5px 5px;
        }

        .deng:after {
            position: absolute;
            bottom: -7px;
            left: 10px;
            height: 12px;
            width: 60px;
            content: " ";
            display: block;
            margin-left: 20px;
            border-radius: 0 0 5px 5px;
            border: solid 1px #dc8f03;
            background: #ffa500;
            background: linear-gradient(to right, #dc8f03, #ffa500, #dc8f03, #ffa500, #dc8f03);
        }

        .shui-c {
            position: absolute;
            top: 18px;
            left: -2px;
            width: 10px;
            height: 35px;
            background: #ffa500;
            border-radius: 0 0 0 5px;
        }

        .shui-b {
            position: absolute;
            top: 14px;
            left: -2px;
            width: 10px;
            height: 10px;
            background: #dc8f03;
            border-radius: 50%;
        }

        .deng-box2 .deng {
            position: relative;
            width: 120px;
            height: 90px;
            margin: 50px;
            background: #d8000f;
            background: rgba(216, 0, 15, 0.8);
            border-radius: 50% 50%;
            -webkit-transform-origin: 50% -100px;
            -webkit-animation: swing 4s infinite ease-in-out;
            box-shadow: -5px 5px 30px 4px rgba(252, 144, 61, 1);
        }

        .deng-box3 .deng {
            position: relative;
            width: 120px;
            height: 90px;
            margin: 50px;
            background: #d8000f;
            background: rgba(216, 0, 15, 0.8);
            border-radius: 50% 50%;
            -webkit-transform-origin: 50% -100px;
            -webkit-animation: swing 5s infinite ease-in-out;
            box-shadow: -5px 5px 50px 4px rgba(250, 108, 0, 1);
        }

        .deng-box4 .deng {
            position: relative;
            width: 120px;
            height: 90px;
            margin: 50px;
            background: #d8000f;
            background: rgba(216, 0, 15, 0.8);
            border-radius: 50% 50%;
            -webkit-transform-origin: 50% -100px;
            -webkit-animation: swing 4s infinite ease-in-out;
            box-shadow: -5px 5px 30px 4px rgba(252, 144, 61, 1);
        }

        @keyframes swing {
            0% {
                -webkit-transform: rotate(-10deg);
            }

            50% {
                -webkit-transform: rotate(10deg);
            }

            100% {
                -webkit-transform: rotate(-10deg);
            }
        }`;
        const root = document.createElement('div');
        root.id = 'happyNewYear';
//在这里修改
        const list = ["国","庆","快","乐"];
        root.innerHTML = `
        <div class="deng-box1">
        <div class="deng">
            <div class="xian"></div>
            <div class="deng-a">
                <div class="deng-b">
                    <div class="deng-t">${list[0]}</div>
                </div>
            </div>
            <div class="shui shui-a">
                <div class="shui-c"></div>
                <div class="shui-b"></div>
            </div>
        </div>
    </div>
    <div class="deng-box2">
        <div class="deng">
            <div class="xian"></div>
            <div class="deng-a">
                <div class="deng-b">
                    <div class="deng-t">${list[1]}</div>
                </div>
            </div>
            <div class="shui shui-a">
                <div class="shui-c"></div>
                <div class="shui-b"></div>
            </div>
        </div>
    </div>
    <div class="deng-box3">
        <div class="deng">
            <div class="xian"></div>
            <div class="deng-a">
                <div class="deng-b">
                    <div class="deng-t">${list[3]}</div>
                </div>
            </div>
            <div class="shui shui-a">
                <div class="shui-c"></div>
                <div class="shui-b"></div>
            </div>
        </div>
    </div>
    <div class="deng-box4">
        <div class="deng">
            <div class="xian"></div>
            <div class="deng-a">
                <div class="deng-b">
                    <div class="deng-t">${list[2]}</div>
                </div>
            </div>
            <div class="shui shui-a">
                <div class="shui-c"></div>
                <div class="shui-b"></div>
            </div>
        </div>
    </div>`;
    if(self==top){
        document.head.appendChild(style); // 插入DOM
        document.body.appendChild(root); // 插入DOM
    }
})();