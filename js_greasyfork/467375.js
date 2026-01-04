// ==UserScript==
// @name         帅连点连点
// @namespace    http://tampermonkey.net/
// @license      No License
// @version      0.1
// @description  独创
// @author       shuai
// @match        *://fxg.jinritemai.com/ffa/live_control/live/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=juejin.cn
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/467375/%E5%B8%85%E8%BF%9E%E7%82%B9%E8%BF%9E%E7%82%B9.user.js
// @updateURL https://update.greasyfork.org/scripts/467375/%E5%B8%85%E8%BF%9E%E7%82%B9%E8%BF%9E%E7%82%B9.meta.js
// ==/UserScript==
(function() {
    'use strict';
    var time = '';
    var a = 1;
    var t = 0;
    var oldI = 1;
    var bodys = document.querySelector('body');
    var divFather = document.createElement('div');
    divFather.className = 'dyDiv';
    divFather.style='position: fixed;top: 100px;right: 100px;z-index:9999;';
    //创建文本框
    var dyInput = document.createElement('input');
    dyInput.value = 1;
    dyInput.style='width:50px;font-size:20px;outline:none;';
    dyInput.className = 'dyInput';
    //创建按钮
    var dyBtn = document.createElement("input");
    dyBtn.id = "btn";
    dyBtn.type = 'button';
    dyBtn.style = "font-size:18px";
    dyBtn.value = "开始"
    dyBtn.className = 'dyBtn';

    //清除按钮
    var dyBtn2 = document.createElement("input");
    dyBtn2.id = "btn2";
    dyBtn2.style = "font-size:18px";
    dyBtn2.type = 'button';
    dyBtn2.value = "停止"
    dyBtn2.className = 'dyBtn2';


    dyBtn.onclick = ()=>{
        clearInterval(time)

        console.log('开始')
        a = dyInput.value;
        clickFnc(a)
    }
    //停止
    dyBtn2.onclick = ()=>{
        console.log('停止了')
        clearInterval(time)
    }


    function clickFnc(i){
        var douc = (i) => {
            var dom = document.querySelectorAll('.lvc2-doudian-btn')[5 * i + 2];;
            if (dom.className.split(" ").indexOf("active") == -1) {
                setTimeout(() => {
                    dom.click();
                });
            } else {
                dom.click();
                t = 0;
                setTimeout(function() {
                    dom.click();
                }, 1200);
            }
        };
        douc(i);
        time = setInterval(() => {
            console.log('开始了 i==='+i)
            t++;
            if (i != oldI) {
                douc(i);
                t=0;
                oldI = i;
            } else {
                if (t >= 15) {
                    douc(i);
                }
            }
        }, 1000);

    }

    divFather.appendChild(dyInput);
    divFather.appendChild(dyBtn);
    divFather.appendChild(dyBtn2);

    bodys.appendChild(divFather);


})();