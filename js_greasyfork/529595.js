// ==UserScript==
// @name         滚动到顶部和底部按钮(修改版)
// @namespace    http://tampermonkey.net/
// @version      0.2.1
// @description  在所有页面上添加滚动到顶部和底部的按钮
// @author       Mr.R.J WOO
// @match        *://*/*
// @icon         data:image/png;base64,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
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/529595/%E6%BB%9A%E5%8A%A8%E5%88%B0%E9%A1%B6%E9%83%A8%E5%92%8C%E5%BA%95%E9%83%A8%E6%8C%89%E9%92%AE%28%E4%BF%AE%E6%94%B9%E7%89%88%29.user.js
// @updateURL https://update.greasyfork.org/scripts/529595/%E6%BB%9A%E5%8A%A8%E5%88%B0%E9%A1%B6%E9%83%A8%E5%92%8C%E5%BA%95%E9%83%A8%E6%8C%89%E9%92%AE%28%E4%BF%AE%E6%94%B9%E7%89%88%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    console.log('脚本开始执行');

    // 检查是否已经有滚动按钮
    if (document.querySelector('.scroll-top') || document.querySelector('.scroll-bottom')) {
        console.log('滚动按钮已存在，脚本终止执行');
        return;
    }

    const buttonStyle = `
        background: url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjgzMTE5MDk2OTE0IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMzOTUiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTk0MCAzNjUuMkEzNzcuMzQgMzc3LjM0IDAgMCAwIDY1OC44IDg0Yy05Ni42LTIyLjYtMTk3LjItMjIuNi0yOTMuNiAwQTM3Ny4zNCAzNzcuMzQgMCAwIDAgODQgMzY1LjJjLTIyLjYgOTYuNi0yMi42IDE5Ny4yIDAgMjkzLjYgMzIuNiAxMzkuNiAxNDEuNiAyNDguNCAyODEuMiAyODEuMiA5Ni42IDIyLjYgMTk3LjIgMjIuNiAyOTMuNiAwIDEzOS42LTMyLjYgMjQ4LjQtMTQxLjYgMjgxLjItMjgxLjIgMjIuNi05Ni42IDIyLjYtMTk3IDAtMjkzLjZ6TTY1MC40IDU3OS40Yy0xMSAxMS4yLTI5IDExLjItNDAuMiAwTDUxMiA0ODEuMmwtOTguMiA5OC4yYy0xMSAxMS4yLTI5IDExLjItNDAuMiAwLTExLjItMTEtMTEuMi0yOSAwLTQwLjJsMTE4LjQtMTE4LjRjNS40LTUuNCAxMi42LTguNCAyMC04LjRzMTQuOCAzIDIwIDguNGwxMTguNCAxMTguNGMxMS4yIDExLjIgMTEuMiAyOS4yIDAgNDAuMnoiIGZpbGw9IiMyMTU3RjIiIHAtaWQ9IjMzOTYiPjwvcGF0aD48L3N2Zz4=) no-repeat;
        background-size: 35px 35px;
        height: 50px;
        width: 60px;
        position: fixed;
        right: 10px;
        cursor: pointer;
        z-index: 9999;
        opacity: 0;
        visibility: hidden;
        transition: opacity 0.2s linear, visibility 0.2s linear;
    `;

    console.log('创建滚动到顶部按钮');
    var scrollTopButton = document.createElement('div');
    scrollTopButton.className = 'scroll-top';
    scrollTopButton.style.cssText = buttonStyle + 'bottom: 75px;';

    console.log('创建滚动到底部按钮');
    var scrollBottomButton = document.createElement('div');
    scrollBottomButton.className = 'scroll-bottom';
    scrollBottomButton.style.cssText = buttonStyle + 'bottom: 50px; transform: scaleY(-1);';

    // 添加点击事件
    scrollTopButton.addEventListener('click', function() {
        console.log('点击滚动到顶部按钮');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    scrollBottomButton.addEventListener('click', function() {
        console.log('点击滚动到底部按钮');
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
    });

    // 监听页面滚动，控制按钮的显示和隐藏
    window.addEventListener('scroll', function() {
        var scrollHeight = window.pageYOffset || document.documentElement.scrollTop;
        var maxScroll = document.body.scrollHeight - window.innerHeight;
        var hideButtonTimeout;

        if (scrollHeight > 160) {
            scrollTopButton.style.opacity = '1';
            scrollTopButton.style.visibility = 'visible';
            console.log('滚动超过160px，显示滚动到顶部按钮');
        } else {
            scrollTopButton.style.opacity = '0';
            scrollTopButton.style.visibility = 'hidden';
            console.log('滚动小于160px，隐藏滚动到顶部按钮');
        }

        if (scrollHeight < maxScroll - 160) {
            scrollBottomButton.style.opacity = '1';
            scrollBottomButton.style.visibility = 'visible';
            console.log('滚动未到底部，显示滚动到底部按钮');
        } else {
            scrollBottomButton.style.opacity = '0';
            scrollBottomButton.style.visibility = 'hidden';
            console.log('滚动到底部，隐藏滚动到底部按钮');
        }

        // 清除之前的计时器
        clearTimeout(hideButtonTimeout);
        // 设置新的计时器，在 3000 毫秒（2 秒）后隐藏按钮
        hideButtonTimeout = setTimeout(function() {
            scrollTopButton.style.opacity = '0';
            scrollTopButton.style.visibility = 'hidden';
            scrollBottomButton.style.opacity = '0';
            scrollBottomButton.style.visibility = 'hidden';
        }, 3000);
    });

    // 将按钮添加到页面
    document.body.appendChild(scrollTopButton);
    document.body.appendChild(scrollBottomButton);
    console.log('按钮已添加到页面');
})();