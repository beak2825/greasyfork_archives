// ==UserScript==
// @namespace        https://www.adss.com.cn/

// @name              ADSS刷课时专用
// @name:zh           ADSS集团刷课时专用

// @description       ADSS Group brush academic hour dedicated ------- Author：Mr.Zhang
// @description:zh    安德集团刷课时专用

// @homepageURL       https://www.adss.com.cn/
// @supportURL        https://www.adss.com.cn/
// @author            Mr.Zhang
// @version           1.6
// @license           LGPLv3

// @compatible        chrome Chrome_46.0.2490.86 + TamperMonkey + 脚本_1.3 测试通过
// @compatible        firefox Firefox_42.0 + GreaseMonkey + 脚本_1.2.1 测试通过
// @compatible        opera Opera_33.0.1990.115 + TamperMonkey + 脚本_1.1.3 测试通过
// @compatible        safari 未测试

// @match             *://*/*
// @grant             none
// @run-at            document-start
// @downloadURL https://update.greasyfork.org/scripts/431001/ADSS%E5%88%B7%E8%AF%BE%E6%97%B6%E4%B8%93%E7%94%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/431001/ADSS%E5%88%B7%E8%AF%BE%E6%97%B6%E4%B8%93%E7%94%A8.meta.js
// ==/UserScript==

var buttons = document.getElementsByClassName("next_button___YGZWZ");
setInterval(function() {
    console.log("点击事件执行中。。。")
    var button = buttons[0];
    if(typeof(button) != 'undefined'){
        console.log("点击播放下一章！！！！")
        button.click();
    }
},5000);
var outters = document.getElementsByClassName("outter");
setInterval(function() {
    console.log("播放事件执行中。。。")
    var playing = document.getElementsByClassName("prism-big-play-btn");
    var attr = playing[0].getAttribute('class');
    if(attr.indexOf('playing') < 0){
        var outter = outters[0];
        if(typeof(outter) != 'undefined'){
            console.log("开始播放！！！！")
            outter.click();
        }
    }
},5000);
setInterval(function() {
    var ant = document.getElementsByClassName("ant-btn-primary");
    if(ant.length != 0){
        ant[0].click();
    }
},5000);