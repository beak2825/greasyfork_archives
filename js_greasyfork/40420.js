// ==UserScript==
// @name         Node.js API目录优化
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  将Node.js API 目录改为可伸缩的侧边栏，另添加滚动监听。
// @author       zy
// @include      http://nodejs.cn/api/*
// @include      https://nodejs.org/api/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/40420/Nodejs%20API%E7%9B%AE%E5%BD%95%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/40420/Nodejs%20API%E7%9B%AE%E5%BD%95%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var head = document.querySelector('head');
    var toc = document.querySelector('#toc');
    var style = document.createElement('style');
    var arrow = document.createElement('div');
    var mark = document.querySelectorAll('a[class="mark"]');
    var aLabel = document.querySelectorAll('#toc a');
    var dirCoord = {};
    var tArr = [];
    var idArr = [];
    style.innerText = ` #toc{ height: ${innerHeight}px; overflow: auto; position: fixed; top: 0; right: 0; z-index: 10; background: #fff; border-left: 2px solid #333333; transition:right 0.4s;} a.active{ color: #FFF; background-color: #43853d;}`;
    arrow.id = 'arrow';
    toc.append(arrow);
    document.head.appendChild(style);
    style.innerText += ` #arrow{ opacity: 0.8; position: fixed; top: calc(50% - 25px); right: ${toc.offsetWidth}px; background: #333; z-index: 11; color: #fff; border-top: 25px solid #333; border-bottom: 25px solid #333; border-left: 20px solid #43853d; cursor:pointer; transition:right 0.4s;} .hide-toc{ right: -${toc.offsetWidth}px !important; } .hide-arrow{ right: 0px !important; border-left: none !important; border-right: 25px solid #43853d;}`;
    mark.forEach((item)=>{
        dirCoord[item.id] = item.parentNode.parentNode.offsetTop;
        idArr.push(item.id);
    });
    arrow.onclick = ()=>{
        if(toc.className === 'hide-toc'){
            toc.className = '';
            arrow.className = '';
        }
        else{
            toc.className = 'hide-toc';
            arrow.className = 'hide-arrow';
        }
    };
    window.onscroll = () =>{
        tArr = [];
        for(let i in dirCoord){
            tArr.push(dirCoord[i]);
            if(dirCoord[i] > pageYOffset){
                tArr.pop();
                let _max = Math.max.apply(Math,tArr);
                let _index = tArr.indexOf(_max);
                let _id = idArr[_index];
                aLabel.forEach((item)=>{
                    item.className = '';
                });
                document.querySelector('[href="#'+ _id +'"]').className = 'active';
                break;
            }
        }
    };
})();