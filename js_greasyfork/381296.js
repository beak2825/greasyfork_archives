// ==UserScript==
// @name         给网页添加一个返回顶部和到达底部按钮
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       liangge
// @resource     up_button_icon    https://coding.net/u/mofiter/p/public_files/git/raw/master/back_to_top_button.png
// @resource     down_button_icon    https://coding.net/u/mofiter/p/public_files/git/raw/master/go_to_bottom_button.png
// @match        *://*
// @grant        GM_getResourceURL
// @require      https://cdn.bootcss.com/jquery/3.3.1/jquery.min.js
// @downloadURL https://update.greasyfork.org/scripts/381296/%E7%BB%99%E7%BD%91%E9%A1%B5%E6%B7%BB%E5%8A%A0%E4%B8%80%E4%B8%AA%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E5%92%8C%E5%88%B0%E8%BE%BE%E5%BA%95%E9%83%A8%E6%8C%89%E9%92%AE.user.js
// @updateURL https://update.greasyfork.org/scripts/381296/%E7%BB%99%E7%BD%91%E9%A1%B5%E6%B7%BB%E5%8A%A0%E4%B8%80%E4%B8%AA%E8%BF%94%E5%9B%9E%E9%A1%B6%E9%83%A8%E5%92%8C%E5%88%B0%E8%BE%BE%E5%BA%95%E9%83%A8%E6%8C%89%E9%92%AE.meta.js
// ==/UserScript==

(function() {
    'use strict';
    // Your code here...
    var opacityMouseLeave = 0.5;//当鼠标不在按钮上时，按钮的不透明度从0到1
    var opacityMouseEnter = 0.8;//当鼠标在按钮上时，按钮的不透明度从0到1
    var goTopBottomButton = document.createElement("div");
    goTopBottomButton.className = "goTopBottomButton";
    goTopBottomButton.innerHTML = "<img class='toggleButton' style='width:35px;height:35px;display:block;cursor:pointer;'></img>";//图片的宽和高可修改，原始图片宽高均为 40px
    goTopBottomButton.style.position = "fixed";//按钮位置固定
    goTopBottomButton.style.zIndex = 10000;//按钮堆叠顺序，数字越大越显示在前面
    goTopBottomButton.style.bottom = "50px";//距离网页底部 50px
    goTopBottomButton.style.right = "30px";//距离网页右边 30px
    var toggleButton = goTopBottomButton.lastChild;
    toggleButton.style.opacity = opacityMouseLeave;
    toggleButton.src = GM_getResourceURL("down_button_icon");//按钮初始显示向下的图片
    document.getElementByTagName("body")[0].appendChild(goTopBottomButton);

    var $ = window.$;
    var canScrollMouseOver = false;//当鼠标在按钮上但未点击时，页面能否自动滚动；true为能滚动，false为不能滚动
    var clickScrollTime = 500;//点击按钮时，网页滚动到顶部或底部需要的时间，单位是毫秒
    var needScrollTime;//网页可以自动滚动时滚动需要的时间，由网页高度计算出，这样不同的网页都会匀速滚动
    var isClicked = false;//按钮是否被点击
    var initialHeight = 0;//网页向底部滚动时需要滚动的距离
    var scrollDirection = "down";//网页滚动方向
    var loadTimes = 0;//网页中动态增加数据的次数
    var maxLoadTimes = 10;//最大的动态增加数据的次数，如果动态增加数据次数超过这个数则说明当前网页不适合执行此脚本，建议将其加入排出的网站当中
    toggleButton.addEventListener("mouseenter",function(){//鼠标移入时不透明度改变，如果canScrollMouseOver为true则网页可以自动滚动
        isClicked = false;
        if(canScrollMouseOver){
            if(scrollDirection == "up"){
                needScrollTime = getScrollTop() * 10;
                $('html,body').animate({scrollTop:initialHeight},needScrollTime,continueToBottom);
            }
        }
        toggleButton.style.opacity = opacityMouseEnter;
    })
    toggleButton.addEventListener("mouseleave",function(){//鼠标移除时不透明度改变，如果canScrollMouseOver为true并且按钮未被点击则停止网页自动滚动的动画
        if(canScrollMouseOver && !isClicked){
            $('html.body').stop();
        }
        toggleButton.style.opacity = opacityMouseLeave;
    })

    toggleButton.addEventListener("click",function(){//点击按钮时网页滚动到顶部或者底部
        isClicked = true;
        if(canScrollMouseOver){
            $('html,body').stop();
        }
        if(scrollDirection == "up"){
            $('html,body').animate({scrollTop:'0px'},clickScrollTime);
        }else{
            initialHeight = $(document).height();
            $('html,body').animate({scrollTop:initialHeight},clickScrollTime,continueToBottom);
        }
    })

    function getScrollTop(){//获取垂直方向滑动距离
        var scrollTop = 0;
        if(document.documentElement && document.documentElement.scrollTop){
            scrollTop = document.documentElement.scrollTop;
        }else if(document.body){
            scrollTop = document.body.scrollTop;
        }
        return scrollTop;
    }

    function continueToBottom(){//判断页面是否继续下滑（主要是为了处理网页动态增加数据导致网页高度变化的情况）
        var currentHeight = $(document).height();
        if(initialHeight != currentHeight){
            if(loadTimes >= maxLoadTimes){
                $('html,body').stop();
                alert("本网站有太多的异步请求，不适合执行脚本《"+ GM_info.script.name +"》，建议加入排除网站中");
                loadTimes = 0;
                return;
            }
            loadTimes ++;
            initialHeight = currentHeight;
            $('html,body').animate({scrollTop:initialHeight},1000,continueToBottom);
        }
    }

    var scrollAction = 'undefined';
    document.onscroll = function() {
        if(scrollAction == 'undefined'){
            scrollAction = window.pageYOffset;
        }
        var diffY = scrollAction - window.pageYOffset;
        scrollAction = window.pageYOffset;
        if(diffY < 0){
            changeDirection("up");
        }else if(diffY > 0){
            changeDirection("down");
        }
        if(getScrollTop() == 0){
            changeDirection("down");
        }
        if(getScrollTop() + $(window).height() >= $(document).height()){
            changeDirection("up");
        }
    }
    function changeDirection(direction){//改变按钮方向
        scrollDirection = direction;
        toggleButton.src = GM_getResourceURL(direction + '_button_icon');
    }
})();