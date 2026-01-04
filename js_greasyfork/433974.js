// ==UserScript==
// @name              一键押后
// @namespace         http://web.yuyehk.cn/
// @version           0.2
// @description       在网页上添加一个押后按钮，可以实现点击押后效果
// @author            mofiter
// @create            2018-07-22
// @lastmodified      2018-08-24
// @resource          up_button_icon http://web.yuyehk.cn/static/upload/image/20181002/1538414702742948.png
// @resource          down_button_icon http://web.yuyehk.cn/static/upload/image/20181002/1538414702742948.png
// @require           https://cdn.bootcss.com/jquery/1.12.4/jquery.min.js
// @include           http*://*/*
// @grant             GM_info
// @grant             GM_getResourceURL
// @noframes
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/433974/%E4%B8%80%E9%94%AE%E6%8A%BC%E5%90%8E.user.js
// @updateURL https://update.greasyfork.org/scripts/433974/%E4%B8%80%E9%94%AE%E6%8A%BC%E5%90%8E.meta.js
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
        var ju_动态id="17"
        var btntcs = document.querySelector("#app > div:nth-child(3) > div > div > div > div.work-process-footer > div > div > button.tcs-new-button.verify-page-button.ivu-btn.ivu-btn-default")
        btntcs.click();
        // 模拟输入押后原因
        var btnS = document.querySelector("body > div:nth-child(17) > div.ivu-modal-wrap > div > div > div.ivu-modal-body > div > div.postpone-color > div > div.tcs-new-input.ivu-input-wrapper.ivu-input-type > input")
        if(btnS == null){
            btnS = document.querySelector("body > div:nth-child(13) > div.ivu-modal-wrap > div > div > div.ivu-modal-body > div > div.postpone-color > div > div.tcs-new-input.ivu-input-wrapper.ivu-input-type > input")
            if(btnS == null){
                //动态确定id
                for (var tsci = 0; tsci < 30; tsci++) {
                    btnS = document.querySelector("body > div:nth-child("+ tsci +") > div.ivu-modal-wrap > div > div > div.ivu-modal-body > div > div.postpone-color > div > div.tcs-new-input.ivu-input-wrapper.ivu-input-type > input")
                    console.log(btnS,tsci);
                    if(btnS != null){
                        ju_动态id = tsci
                        tsci = 20000
                    }
                }
            };
        };
        console.log(btnS);
        var evt = new UIEvent('input', {
            bubbles: false,
            cancelable: false
        });
        btnS.value = '1';
        btnS.dispatchEvent(evt);
        console.log(ju_动态id);
        var btnqd = document.querySelector("body > div:nth-child("+ju_动态id+") > div.ivu-modal-wrap > div > div > div.ivu-modal-footer > div > button.tsc-new-button.primary.ivu-btn.ivu-btn-primary")
        console.log(btnqd.innerText);
        console.log(btnqd.innerText.indexOf("确定") != -1 );
        if(btnqd.innerText.indexOf("确定") == -1){
            btnqd = document.querySelector("body > div:nth-child(13) > div.ivu-modal-wrap > div > div > div.ivu-modal-footer > div > button.tsc-new-button.primary.ivu-btn.ivu-btn-primary")
            console.log(btnqd.innerText);
            if(btnqd.innerText.indexOf("确定") == -1){
                btnqd = document.querySelector("body > div:nth-child("+ju_动态id+") > div.ivu-modal-wrap > div > div > div.ivu-modal-footer > div > button.tsc-new-button.primary.ivu-btn.ivu-btn-primary")
                console.log(btnqd.innerText);
            };
        };
        btnqd.click();

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