// ==UserScript==
// @name              返回顶部和到达底部的按钮修改版
// @namespace         http://mofiter.com/
// @version           0.3
// @license MIT
// @description       在网页上添加一个按钮，可以快速返回顶部和到达底部，有滑动效果，原作者mofiter
// @description:en    Add a button for all websites which can back to the top and go to the bottom,and there is a sliding effecct
// @resource          up_button_icon data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjgzMTE5MDk2OTE0IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMzOTUiIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCI+PHBhdGggZD0iTTk0MCAzNjUuMkEzNzcuMzQgMzc3LjM0IDAgMCAwIDY1OC44IDg0Yy05Ni42LTIyLjYtMTk3LjItMjIuNi0yOTMuNiAwQTM3Ny4zNCAzNzcuMzQgMCAwIDAgODQgMzY1LjJjLTIyLjYgOTYuNi0yMi42IDE5Ny4yIDAgMjkzLjYgMzIuNiAxMzkuNiAxNDEuNiAyNDguNCAyODEuMiAyODEuMiA5Ni42IDIyLjYgMTk3LjIgMjIuNiAyOTMuNiAwIDEzOS42LTMyLjYgMjQ4LjQtMTQxLjYgMjgxLjItMjgxLjIgMjIuNi05Ni42IDIyLjYtMTk3IDAtMjkzLjZ6TTY1MC40IDU3OS40Yy0xMSAxMS4yLTI5IDExLjItNDAuMiAwTDUxMiA0ODEuMmwtOTguMiA5OC4yYy0xMSAxMS4yLTI5IDExLjItNDAuMiAwLTExLjItMTEtMTEuMi0yOSAwLTQwLjJsMTE4LjQtMTE4LjRjNS40LTUuNCAxMi42LTguNCAyMC04LjRzMTQuOCAzIDIwIDguNGwxMTguNCAxMTguNGMxMS4yIDExLjIgMTEuMiAyOS4yIDAgNDAuMnoiIGZpbGw9IiMyMTU3RjIiIHAtaWQ9IjMzOTYiPjwvcGF0aD48L3N2Zz4=
// @resource          down_button_icon data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB0PSIxNjgzMTE5MTE4MDY4IiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9Ijk5NyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNOTQwIDM2NS4yQTM3Ny4zNCAzNzcuMzQgMCAwIDAgNjU4LjggODRjLTk2LjYtMjIuNi0xOTcuMi0yMi42LTI5My42IDBBMzc3LjM0IDM3Ny4zNCAwIDAgMCA4NCAzNjUuMmMtMjIuNiA5Ni42LTIyLjYgMTk3LjIgMCAyOTMuNiAzMi42IDEzOS42IDE0MS42IDI0OC40IDI4MS4yIDI4MS4yIDk2LjYgMjIuNiAxOTcuMiAyMi42IDI5My42IDAgMTM5LjYtMzIuNiAyNDguNC0xNDEuNiAyODEuMi0yODEuMiAyMi42LTk2LjYgMjIuNi0xOTcgMC0yOTMuNnogbS0yODkuNiAxMTkuNkw1MzIgNjAzYy01LjQgNS40LTEyLjYgOC40LTIwIDguNC03LjYgMC0xNC44LTMtMjAtOC40bC0xMTguNC0xMTguNGMtMTEuMi0xMS0xMS4yLTI5IDAtNDAuMiAxMS0xMS4yIDI5LTExLjIgNDAuMiAwbDk4LjIgOTguMiA5OC4yLTk4LjJjMTEtMTEuMiAyOS0xMS4yIDQwLjIgMCAxMS4yIDExLjIgMTEuMiAyOS4yIDAgNDAuNHoiIGZpbGw9IiMyMTU3RjIiIHAtaWQ9Ijk5OCI+PC9wYXRoPjwvc3ZnPg==
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @include           http*://*/*
// @grant             GM_info
// @grant             GM_getResourceURL
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/465474/%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E5%92%8C%E5%88%B0%E8%BE%BE%E5%BA%95%E9%83%A8%E7%9A%84%E6%8C%89%E9%92%AE%E4%BF%AE%E6%94%B9%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/465474/%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E5%92%8C%E5%88%B0%E8%BE%BE%E5%BA%95%E9%83%A8%E7%9A%84%E6%8C%89%E9%92%AE%E4%BF%AE%E6%94%B9%E7%89%88.meta.js
// ==/UserScript==

(function() {
    'use strict';
    var $ = $ || window.$;
    var canScrollMouseOver = false; //当鼠标在按钮上，但未点击时，页面能否自动滚动，true 为可以自动滚动，false 为不能自动滚动，可修改
    var opacityMouseLeave = 0.5; //当鼠标不在按钮上时，按钮的不透明度，从 0.0（完全透明）到 1.0（完全不透明），可修改
    var opacityMouseEnter = 0.8; //当鼠标在按钮上时，按钮的不透明度，从 0.0（完全透明）到 1.0（完全不透明），可修改
    var clickScrollTime = 500; //点击按钮时，网页滚动到顶部或底部需要的时间，单位是毫秒，可修改
    var needScrollTime; //网页可以自动滚动时，滚动需要的时间，由网页高度计算得出，这样不同网页都会匀速滚动
    var isClicked = false; //按钮是否被点击
    var initialHeight = 0; //网页向底部滚动时，需要滚动的距离
    var scrollAction = 'undefined';
    var scrollDirection = "down"; //网页滚动方向，down 为向下，up 为向上
    var loadTimes = 0; //网页中动态增加数据的次数
    var maxLoadTimes = 10; //最大的动态增加数据的次数（可修改），如果动态增加数据的次数超过这个值，则说明当前网页不适合执行此脚本，建议将其加入排除的网站当中
    var goTopBottomButton = document.createElement("div");
    goTopBottomButton.className = "goTopBottomButton";
    goTopBottomButton.innerHTML = "<img class='toggleButton' style='width:55px;height:55px;display:block;cursor:pointer;'></img>"; //图片的宽和高可修改，原始图片宽高均为 40px
    goTopBottomButton.style.position = "fixed";
    goTopBottomButton.style.zIndex = 10000;
    goTopBottomButton.style.bottom = "50px"; //距离网页底部 50px，可修改
    goTopBottomButton.style.right = "30px"; //距离网页右边 30px，可修改
    var toggleButton = goTopBottomButton.lastChild;
    toggleButton.style.opacity = opacityMouseLeave; //按钮初始不透明度
    toggleButton.src = GM_getResourceURL("down_button_icon"); //按钮初始显示向下的图片
    document.getElementsByTagName("body")[0].appendChild(goTopBottomButton);

    /*按钮事件开始*/
    toggleButton.addEventListener("mouseenter",function() { //鼠标移入时不透明度改变，如果 canScrollMouseOver 为 true，则网页可以自动滚动
        isClicked = false;
        if (canScrollMouseOver) {
            if (scrollDirection == "up") {
                needScrollTime = getScrollTop() * 10;
                $('html,body').animate({scrollTop:'0px'},needScrollTime);
            } else {
                initialHeight = $(document).height();
                var restHeight = $(document).height() - getScrollTop();
                needScrollTime = restHeight * 10;
                $('html,body').animate({scrollTop:initialHeight},needScrollTime,continueToBottom);
            }
        }
        toggleButton.style.opacity = opacityMouseEnter;
    })
    toggleButton.addEventListener("mouseleave",function() { //鼠标移出时不透明度改变，如果 canScrollMouseOver 为 true，并且按钮未被点击，停止网页自动滚动的动画
        if (canScrollMouseOver && !isClicked) {
            $('html,body').stop();
        }
        toggleButton.style.opacity = opacityMouseLeave;
    })
    toggleButton.addEventListener("click",function() { //点击按钮时，网页滚动到顶部或底部
        isClicked = true;
        if (canScrollMouseOver) {
            $('html,body').stop();
        }
        if (scrollDirection == "up") {
            $('html,body').animate({scrollTop:'0px'},clickScrollTime);
        } else {
            initialHeight = $(document).height();
            $('html,body').animate({scrollTop:initialHeight},clickScrollTime,continueToBottom);
        }
    })
    /*按钮事件结束*/

    /*页面滚动监听*/
    document.onscroll = function() {
        if (scrollAction == 'undefined') {
            scrollAction = window.pageYOffset;
        }
        var diffY = scrollAction - window.pageYOffset;
        scrollAction = window.pageYOffset;
        if (diffY < 0) {
            changeDirection("down");
        } else if (diffY > 0) {
            changeDirection("up");
        }
        if (getScrollTop() == 0) {
            changeDirection("down");
        }
        if (getScrollTop() + $(window).height() >= $(document).height()) {
            changeDirection("up");
        }
    }

    function changeDirection(direction) { //改变按钮方向
        scrollDirection = direction;
        toggleButton.src = GM_getResourceURL(direction + "_button_icon");
    }

    function getScrollTop() { //获取垂直方向滑动距离
        var scrollTop = 0;
        if (document.documentElement && document.documentElement.scrollTop) {
            scrollTop = document.documentElement.scrollTop;
        } else if (document.body) {
            scrollTop = document.body.scrollTop;
        }
        return scrollTop;
    }

    function continueToBottom() { //判断页面是否继续下滑（主要是为了处理网页动态增加数据导致网页高度变化的情况）
        var currentHeight = $(document).height();
        if (initialHeight != currentHeight) {
            if (loadTimes >= maxLoadTimes) {
                $('html,body').stop();
                alert(" 本网站有太多的异步请求，不适合执行脚本《" + GM_info.script.name + "》，建议加入排除网站当中，具体方法请查看脚本主页");
                loadTimes = 0;
                return;
            }
            loadTimes ++;
            initialHeight = currentHeight;
            $('html,body').animate({scrollTop:initialHeight},1000,continueToBottom);
        }
    }
})();