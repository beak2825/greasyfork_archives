// ==UserScript==
// @name         掘金快速抽奖
// @namespace    web_chaser
// @version      0.2
// @description  跳过掘金抽奖动画环节
// @author       web_chaser
// @match        https://juejin.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @update       https://gitee.com/web_chaser/nuggets-quick-draw/blob/master/index.js
// @downloadURL https://update.greasyfork.org/scripts/431727/%E6%8E%98%E9%87%91%E5%BF%AB%E9%80%9F%E6%8A%BD%E5%A5%96.user.js
// @updateURL https://update.greasyfork.org/scripts/431727/%E6%8E%98%E9%87%91%E5%BF%AB%E9%80%9F%E6%8A%BD%E5%A5%96.meta.js
// ==/UserScript==

(function() {
    'use strict';

    window.onload = createDom;
    function createDom(){
        var dom = document.createElement('div');
        dom.className = 'turntable-item item lottery';
        dom.style.cssText = 'display: flex; align-items: center; justify-content: space-around; flex-direction: column;'
        var button = document.createElement('button');
        button.innerText = '抽奖';
        var input = document.createElement('input');
        input.style.cssText = 'width: 60%;';
        input.placeholder = '抽奖次数';
        dom.appendChild(button);
        dom.appendChild(input);
        var oldDom = document.getElementsByClassName('turntable-item item lottery')[0];
        console.log(oldDom)
        oldDom.parentNode.replaceChild(dom, oldDom);
        button.onclick = function (){
            executeCount(input.value );
        }
    }

    function executeCount(num){
        num = num ? num : 1;
        for(var i = 0; i < num; i++){
            run();
        }
    }

    function run(){
        var ajax = new XMLHttpRequest();
        ajax.open('post','https://api.juejin.cn/growth_api/v1/lottery/draw',true);
        ajax.withCredentials = true;
        ajax.setRequestHeader('content-type','application/json; charset=utf-8');
        ajax.send(JSON.stringify({}));
        ajax.onreadystatechange = function (){
            if(ajax.readyState==4&&ajax.status==200){
                var c = ajax.responseText;
                c = JSON.parse(c);
                var value = c.data.lottery_name;
                console.log('抽奖获得：' + value);
            }
        }
    }
})();