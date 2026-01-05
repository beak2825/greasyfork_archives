// ==UserScript==
// @name         自动启动Daocloud容器
// @namespace    http://tampermonkey.net/
// @version      0.1.1
// @description  进入Daocloud容器页面;若容器关闭则自动启动容器
// @include      *://dashboard.daocloud.io/apps/*
// @author       syasuker
// @match        https://greasyfork.org/zh-CN/help/writing-user-scripts
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/24982/%E8%87%AA%E5%8A%A8%E5%90%AF%E5%8A%A8Daocloud%E5%AE%B9%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/24982/%E8%87%AA%E5%8A%A8%E5%90%AF%E5%8A%A8Daocloud%E5%AE%B9%E5%99%A8.meta.js
// ==/UserScript==
/* jshint -W097 */
'use strict';

// Your code here...
console.log('open daocloud!');

window.setTimeout(function(){console.log('open daocloud!');},60);

window.onload = function(){window.setTimeout(function(){startAPP();},1000);};

function startAPP(){
//    alert("启动容器!");
//    if(document.getElementsByClassName('dao-btn green')[0]!=null){
//       document.getElementsByClassName('dao-btn green')[0].click();
//    }
//    document.getElementsByClassName('dao-btn green')[0].click();
    //如果一个按钮会ng-click是switchPower()那么就去点击它
    if(document.getElementsByClassName("dao-btn green")[0].getAttribute("ng-click")=="switchPower()"){
        document.getElementsByClassName('dao-btn green')[0].click();
    }
}    