// ==UserScript==
// @name              一个返回顶部和到达底部的按钮
// @namespace         http://mofiter.com/
// @version           0.31
// @description       在网页上添加一个按钮，可以快速返回顶部和到达底部，有滑动效果
// @description:en    Add a button for all websites which can back to the top and go to the bottom,and there is a sliding effecct.
// @author            mofiter
// @create            2018-07-22
// @lastmodified      2018-08-24
// @resource          up_button_icon https://o.xarea.win/icon/up_button_icon.png
// @resource          down_button_icon https://o.xarea.win/icon/down_button_icon.png
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @include           http*://*/*
// @grant             GM_info
// @grant             GM_getResourceURL
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/459120/%E4%B8%80%E4%B8%AA%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E5%92%8C%E5%88%B0%E8%BE%BE%E5%BA%95%E9%83%A8%E7%9A%84%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/459120/%E4%B8%80%E4%B8%AA%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E5%92%8C%E5%88%B0%E8%BE%BE%E5%BA%95%E9%83%A8%E7%9A%84%E6%8C%89%E9%92%AE.meta.js
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
    goTopBottomButton.innerHTML = "<img class='toggleButton' style='width:35px;height:35px;display:block;cursor:pointer;'></img>"; //图片的宽和高可修改，原始图片宽高均为 40px
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