// ==UserScript==
// @name         左上角浮动按钮插入吧务
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  在网页左上角显示一个浮动按钮，点击时触发提示
// @author       Your Name
// @match        https://tieba.baidu.com/p/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/525854/%E5%B7%A6%E4%B8%8A%E8%A7%92%E6%B5%AE%E5%8A%A8%E6%8C%89%E9%92%AE%E6%8F%92%E5%85%A5%E5%90%A7%E5%8A%A1.user.js
// @updateURL https://update.greasyfork.org/scripts/525854/%E5%B7%A6%E4%B8%8A%E8%A7%92%E6%B5%AE%E5%8A%A8%E6%8C%89%E9%92%AE%E6%8F%92%E5%85%A5%E5%90%A7%E5%8A%A1.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function set_style(btn,top,left){
    btn.style.position = 'fixed';
    btn.style.top = top;
    btn.style.left = left;
    btn.style.zIndex = 9999;  
    btn.style.padding = '10px 20px';
    btn.style.backgroundColor = 'white';
    btn.style.color = 'black';
    btn.style.borderColor = 'black';
    btn.style.borderRadius = '5px';
    btn.style.cursor = 'pointer';}
    // 创建一个按钮元素
    let btn1 = document.createElement('button');
    btn1.innerText = '有男不玩吧务';  
    set_style(btn1,"10px","10px");
        let btn2 = document.createElement('button');
    btn2.innerText = '尘白吧务';  
    set_style(btn2,"10px","120px");

    let btn3 = document.createElement('button');
        btn3.innerText = '有男不玩吧务';  
    set_style(btn3,"80px","10px");
        let btn4 = document.createElement('button');
    btn4.innerText = '尘白吧务';  
    set_style(btn4,"80px","120px");



    // 为按钮添加点击事件
    btn1.addEventListener('click', function() {
                const div = document.querySelector('div#j_editor_for_container');
        const child = document.createElement('p');

    // 为新元素设置内容（可以根据需要进行修改）
child.textContent = '@19届晴天 @youlixiaa @hyzlixi @场丕 @毁灭与复仇\u00A0';

    div.appendChild(child);

    });

        btn2.addEventListener('click', function() {
                const div = document.querySelector('div#j_editor_for_container');
        const child = document.createElement('p');

    // 为新元素设置内容（可以根据需要进行修改）
child.textContent = '@曙光天之阳 @Ribbonsex @视明日 @Yuhi_Ciallo @Impecable648\u00A0';

    div.appendChild(child);

    });

        btn3.addEventListener('click', function() {
                const div = document.querySelector('div#ueditor_replace');
        const child = document.createElement('p');

    // 为新元素设置内容（可以根据需要进行修改）
child.textContent = '@19届晴天 @youlixiaa @hyzlixi @场丕 @毁灭与复仇\u00A0';

    div.appendChild(child);

    });

        btn4.addEventListener('click', function() {
                const div = document.querySelector('div#ueditor_replace');
        const child = document.createElement('p');

    // 为新元素设置内容（可以根据需要进行修改）
child.textContent = '@曙光天之阳 @Ribbonsex @视明日 @Yuhi_Ciallo @Impecable648\u00A0';

    div.appendChild(child);

    });

    // 将按钮添加到页面中
    document.body.appendChild(btn1);
        document.body.appendChild(btn2);
     document.body.appendChild(btn3);
        document.body.appendChild(btn4);

})();
