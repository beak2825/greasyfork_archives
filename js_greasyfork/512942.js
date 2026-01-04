// ==UserScript==
// @name         Scroll to Top and Bottom
// @namespace    http://tampermonkey.net/
// @version      0.1
// @license 	 MIT
// @description  Add buttons to scroll to top and bottom of the page on all websites
// @author       shanhai
// @match        *://*/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/512942/Scroll%20to%20Top%20and%20Bottom.user.js
// @updateURL https://update.greasyfork.org/scripts/512942/Scroll%20to%20Top%20and%20Bottom.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 创建按钮的样式
    const buttonStyle = `
        position: fixed;
        right: 20px;
        padding: 10px 15px;
        //width: 30px;
        //height: 18px;
        font-size: 14px;
        background-color: #f39c12;
        color: white;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        z-index: 9999;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        display: none; /* 默认隐藏按钮 */
    `;

    // 创建 "Top" 按钮
    const topButton = document.createElement('button');
    topButton.innerHTML = '⤊';//⬆⭡⇈ Top
    topButton.style = buttonStyle + 'bottom: 80px;';
    topButton.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });

    // 创建 "Bottom" 按钮
    const bottomButton = document.createElement('button');
    bottomButton.innerHTML = '⤋';//⬇ Bottom
    bottomButton.style = buttonStyle + 'bottom: 20px;';
    bottomButton.onclick = () => {
        const footElement = document.getElementById("rhf");
        if(footElement){
            window.scrollTo(0, footElement.offsetTop);
        }else{
            window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
        }
    }

    // 把按钮加到页面上
    document.body.appendChild(topButton);
    document.body.appendChild(bottomButton);

    // 监听滚动事件
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const scrollHeight = document.body.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;

        //console.log('ScrollY:', scrollY);
        //console.log('ScrollHeight:', scrollHeight);
        //console.log('ClientHeight:', clientHeight);


        // 如果滚动到顶部，隐藏 "Top" 按钮，否则显示
        if (scrollY === 0) {
            topButton.style.display = 'none';
        } else {
            topButton.style.display = 'block';
        }

        // 如果滚动到底部，隐藏 "Bottom" 按钮，否则显示
        if (scrollY + clientHeight +10 >= scrollHeight) {
            bottomButton.style.display = 'none';
        } else {
            bottomButton.style.display = 'block';
        }
    });
})();
