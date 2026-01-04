// ==UserScript==
// @name         知乎屏蔽自动弹出登录框，不影响正常使用，比如手动点击登录，回答，关注，收藏等
// @namespace    http://bbs.91wc.net/zhihu-no-modal.htm
// @version      0.2.2
// @description  不影响所有手动点击，真正随心所欲；屏蔽后自动停止监听，不浪费一丝系统资源。
// @author       Wilson
// @icon         https://static.zhihu.com/static/favicon.ico
// @match        *://www.zhihu.com/question/*
// @license      GPL License
// @downloadURL https://update.greasyfork.org/scripts/414404/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E8%87%AA%E5%8A%A8%E5%BC%B9%E5%87%BA%E7%99%BB%E5%BD%95%E6%A1%86%EF%BC%8C%E4%B8%8D%E5%BD%B1%E5%93%8D%E6%AD%A3%E5%B8%B8%E4%BD%BF%E7%94%A8%EF%BC%8C%E6%AF%94%E5%A6%82%E6%89%8B%E5%8A%A8%E7%82%B9%E5%87%BB%E7%99%BB%E5%BD%95%EF%BC%8C%E5%9B%9E%E7%AD%94%EF%BC%8C%E5%85%B3%E6%B3%A8%EF%BC%8C%E6%94%B6%E8%97%8F%E7%AD%89.user.js
// @updateURL https://update.greasyfork.org/scripts/414404/%E7%9F%A5%E4%B9%8E%E5%B1%8F%E8%94%BD%E8%87%AA%E5%8A%A8%E5%BC%B9%E5%87%BA%E7%99%BB%E5%BD%95%E6%A1%86%EF%BC%8C%E4%B8%8D%E5%BD%B1%E5%93%8D%E6%AD%A3%E5%B8%B8%E4%BD%BF%E7%94%A8%EF%BC%8C%E6%AF%94%E5%A6%82%E6%89%8B%E5%8A%A8%E7%82%B9%E5%87%BB%E7%99%BB%E5%BD%95%EF%BC%8C%E5%9B%9E%E7%AD%94%EF%BC%8C%E5%85%B3%E6%B3%A8%EF%BC%8C%E6%94%B6%E8%97%8F%E7%AD%89.meta.js
// ==/UserScript==

(function() {
    'use strict';

    //是否开启调试模式
    var debug = 0;

    //知乎弹窗有四种情况：1.不弹窗；2.仅加载时弹窗1次；3.加载和滚动时各弹窗1次；4.滚动条不在顶部时，加载时可能会加载2次弹窗

    //日志输出
    var def = function(v){return typeof v !== "undefined";}
    var log = function(v1,v2, v3){
        if(!debug || !console||!console.log) return;
        if(def(v1) && def(v2) && def(v3)){console.log(v1,v2,v3);return;}
        if(def(v1) && def(v2)){console.log(v1,v2);return;}
        if(def(v1)){console.log(v1);return;}
    }

    //hideLogin标记是否手动点击登录 true代表系统自动弹出，false代表手动操作后的弹窗
    var hideLogin = true, listenLoginRemoveFuns = [];
    //取消监听事件
    var removeLoginModalEvent = function(evt){ listenLoginRemoveFuns[evt](); }
    //弹窗屏蔽处理函数
    var listenLoginModal = function(evt){
        log(evt, "监听开始");
        //取消事件监听
        var removeDOMNodeInsertedEvent = function(){
            log(evt, "取消事件监听");
            if(evt === "scroll"){
                document.body.removeEventListener('DOMNodeInserted', scrollDOMNodeInsertedEvent, false);
                document.body.removeEventListener('click', scrollDOMClickEvent, false);
            }else{
                document.body.removeEventListener('DOMNodeInserted', DOMNodeInsertedEvent, false);
                document.body.removeEventListener('click', DOMClickEvent, false);
            }
            if(removeLoadLoginTimer) clearTimeout(removeLoadLoginTimer);
        }
        listenLoginRemoveFuns[evt] = removeDOMNodeInsertedEvent;

        //处理弹窗屏蔽事件
        var DOMNodeInsertedEvent = function(e){
            if(!hideLogin || e.target.nodeType !== 1) return;
            var signFlowModal = e.target.getElementsByClassName('signFlowModal');
            if(signFlowModal.length!==0){
                //屏蔽系统自动弹出登录框
                for(var i in signFlowModal){
                    if(signFlowModal[i] && signFlowModal[i].previousElementSibling){
                        log(evt, "屏蔽1次弹窗");
                        signFlowModal[i].previousElementSibling.click();
                    }
                }
                //屏蔽后，取消监听事件，以节省资源
                if(removeLoadLoginTimer) clearTimeout(removeLoadLoginTimer);
                removeLoadLoginTimer=setTimeout(function(){ removeDOMNodeInsertedEvent(); }, 30000);
            }
        }

        if(evt === "scroll"){
            //滚动时，再次监听弹窗事件
            var scrollDOMNodeInsertedEvent = function(e){DOMNodeInsertedEvent(e);}
            document.body.addEventListener('DOMNodeInserted', scrollDOMNodeInsertedEvent, false);
        } else {
            //开始监听事件
            document.body.addEventListener('DOMNodeInserted', DOMNodeInsertedEvent, false);
        }

        var removeLoadLoginTimer=0;
        if(evt === "load"){
            //加载时，超过60秒内未弹窗，取消监听事件，以节省资源
            removeLoadLoginTimer=setTimeout(function(){ removeDOMNodeInsertedEvent(); log(evt, '超时未弹窗');}, 60000);
        }

        //监听手动点击事件
        var DOMClickEvent = function(){
            log(evt, "触发点击事件");
            hideLogin = false;
            setTimeout(function(){ hideLogin = true; }, 100);
        }
        if(evt === "scroll"){
            var scrollDOMClickEvent = function(e){DOMClickEvent(e);}
            document.body.addEventListener('click', scrollDOMClickEvent, false);
        } else {
            document.body.addEventListener('click', DOMClickEvent, false);
        }
    }

    //监听刷新时的弹窗
    listenLoginModal("load");

    //监听滚动时的弹窗
    var isListened = false;
    var DOMScrollEvent = function(){
        if(!isListened){
            isListened = true;
            removeLoginModalEvent("load");
            listenLoginModal("scroll");
        }
        log("scrollTop="+document.documentElement.scrollTop, "滚动监听中");
        //滚动时，如果未加载弹窗则取消事件监听，这里知乎会在scrollTop1000-1500之间弹窗，这里保险起见取2000
        var docEle = document.documentElement;
        if(docEle.scrollTop > 2000 || docEle.scrollTop+docEle.clientHeight === docEle.scrollHeight){
            window.removeEventListener('scroll', DOMScrollEvent, false);
            log("scrollTop="+document.documentElement.scrollTop, "结束滚动事件");
            setTimeout(function(){
                removeLoginModalEvent("scroll");
            }, 60000);
        }
    }
    window.addEventListener('scroll', DOMScrollEvent, false);

})();