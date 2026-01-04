// ==UserScript==
// @name         百度贴吧自动一键签到
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  *
// @author       Saury
// @match        https://tieba.baidu.com
// @match        https://tieba.baidu.com/*
// @grant        none
// @license      MIT

// @downloadURL https://update.greasyfork.org/scripts/500713/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E4%B8%80%E9%94%AE%E7%AD%BE%E5%88%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/500713/%E7%99%BE%E5%BA%A6%E8%B4%B4%E5%90%A7%E8%87%AA%E5%8A%A8%E4%B8%80%E9%94%AE%E7%AD%BE%E5%88%B0.meta.js
// ==/UserScript==

try{
    var parentDiv = document.getElementById('likeforumwraper');

    // 使用children属性获取直接子元素的数量
    var childrenCount = parentDiv.children.length;

    // 打印子元素的数量
    for (let i = 0; i < childrenCount; i++ ){
        let thing_to_click = parentDiv.children[i].getAttribute('href');
        let name = 'child' + i;
        setTimeout(function(){
            let fornowopen = window.open(thing_to_click, name);
        }, i==0?100:3500*i);
    };


    let first_click = document.getElementById('moreforum');
    var rect = first_click.getBoundingClientRect()

    var targent_to_moveX = rect.left + rect.width/2
    var targent_to_moveY = rect.top + rect.height/2

    targent_to_moveX
    // 创建一个鼠标移动事件
    var mouseOverEvent = new MouseEvent('mouseover', {
        'view': window,
        'bubbles': true, // 事件是否可以冒泡
        'cancelable': true, // 事件是否可以取消
        'clientX': targent_to_moveX,
        'clientY': targent_to_moveY
    });
    // 触发鼠标移动事件
    first_click.dispatchEvent(mouseOverEvent);


    let parentDiv2 = document.getElementById('forumscontainer');
    let real_parent = parentDiv2.children[0];
    let real_real_parent = real_parent.children[0];
    let childrenCount2 = real_real_parent.children.length;
    for (let i = 0; i < childrenCount2-1; i++ ){
        let thing_to_click = real_real_parent.children[i].getAttribute('href');
        let name = 'child' + i;
        setTimeout(function(){
            let fornowopen = window.open(thing_to_click, name);
            
        }, 3000*i);
    };
}
catch(err){
    // 创建一个新的<base>元素
    window.onload = (event) => {
        try{
            let element = document.querySelector('a.j_signbtn.sign_btn_bright.j_cansign[rel="noopener"]');
            // 模拟点击事件
            element.click();
        }
        finally{
            setTimeout(function() {
                window.close();
            }, 100); // 延迟100毫秒
        }
    };
}