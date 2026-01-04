// ==UserScript==
// @name         抖音直播持续点击讲解
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  解放你的双手😋
// @author       gz
// @match        https://fxg.jinritemai.com/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/480753/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E6%8C%81%E7%BB%AD%E7%82%B9%E5%87%BB%E8%AE%B2%E8%A7%A3.user.js
// @updateURL https://update.greasyfork.org/scripts/480753/%E6%8A%96%E9%9F%B3%E7%9B%B4%E6%92%AD%E6%8C%81%E7%BB%AD%E7%82%B9%E5%87%BB%E8%AE%B2%E8%A7%A3.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var appendButtons = new Array();
    var onsales = new Array();
    var interId;
    var timeoutId1, timeoutId2;
    function appendDuringButton() {
        let bottoms = document.querySelectorAll(".index__goodsAction___1Pz3g");
        for (let i = 0; i < bottoms.length; i++) {
            let button = document.createElement("button");
            button.className = "auxo-btn auxo-btn-sm lvc2-doudian-btn";
            button.innerText = "持续弹窗";
            button.dataset.index = i;
            button.addEventListener('click', function (e) {
                console.log("开始持续点击");
                let index = e.currentTarget.dataset.index;
                console.log(`获取index：${index}`);
                clearTimeout(timeoutId1);
                clearTimeout(timeoutId2);
                clearInterval(interId);
                onsales[index].click();
                console.log("清除残余完成");

                interId = setInterval(function () {
                    timeoutId1 = setTimeout(function () {
                        onsales[index].click();
                    }, 11000);

                    timeoutId2 = setTimeout(function () {
                        onsales[index].click();
                    }, 12000);
                }, 12000);
            })
            appendButtons.push(button);
            bottoms[i].appendChild(button);
        }
    }

    function getOnsalesButton() {
        let bottoms = document.querySelectorAll(".index__goodsAction___1Pz3g");
        onsales = Array.from(bottoms).map(function (bottom) {
            return bottom.lastChild.getElementsByTagName('button')[0];
        });
    }

    function init(){
        console.log("清空之前的对象");
        appendButtons = new Array();
        onsales = new Array();
        console.log("持续点击初始化中。。。。。。。。");
        let outDiv = document.createElement("div");
        outDiv.className = "index__guideItem___2GjBz";
        let innerDiv = document.createElement("div");
        innerDiv.innerText = "刷新弹窗按钮";
        outDiv.appendChild(innerDiv);
        console.log("创建弹窗按钮。。。。。。。");
        let sideBar = document.querySelectorAll(".index__bottomGuides___BOaP6")[0];
        console.log(`sidebar: ${sideBar}`)
        sideBar.appendChild(outDiv);
        console.log("添加按钮。。。。。。。");
        outDiv.addEventListener('click', function () {
            getOnsalesButton();
            appendDuringButton();
        });
    }

    function pageLoaded(){
        console.log("尝试获取");
        let sideBar = document.querySelectorAll(".index__bottomGuides___BOaP6")[0];
        if(typeof sideBar == 'undefined' && sideBar.length != 0){
            console.log("尝试失败");
            setTimeout(pageLoaded, 1000);
        }else {
            console.log("尝试成功");
            init();
        }
    }
    setTimeout( pageLoaded
               , 5000);

})();