// ==UserScript==
// @name         知乎排版优化 for Mobile
// @namespace    https://greasyfork.org/zh-CN/users/150560
// @version      1.0
// @description  手机浏览器访问知乎电脑板页面排版优化
// @author       田雨菲
// @match        http://www.zhihu.com/question/*
// @include      https://www.zhihu.com/question/*
// @run-at document-end
// @downloadURL https://update.greasyfork.org/scripts/37738/%E7%9F%A5%E4%B9%8E%E6%8E%92%E7%89%88%E4%BC%98%E5%8C%96%20for%20Mobile.user.js
// @updateURL https://update.greasyfork.org/scripts/37738/%E7%9F%A5%E4%B9%8E%E6%8E%92%E7%89%88%E4%BC%98%E5%8C%96%20for%20Mobile.meta.js
// ==/UserScript==

(function () {
    'use strict';
    window.addEventListener("load", function(event) {
        var parentAnswer = document.getElementsByClassName('Question-main')[0];
        var sideAnswerChild = document.getElementsByClassName('Question-sideColumn')[0];
        var mainAnswerChild = document.getElementsByClassName('Question-mainColumn')[0];
        parentAnswer.removeChild(sideAnswerChild);
        mainAnswerChild.style.width = "100%";
        parentAnswer.style.width = "100%";
        parentAnswer.style.padding = "0";
        var sideButton = document.getElementsByClassName('CornerButtons')[0];
        sideButton.parentNode.removeChild(sideButton);
        var logo = document.getElementsByClassName('AppHeader-inner')[0].getElementsByTagName('a')[0];
        logo.parentNode.removeChild(logo);
        var questionHeader = document.getElementsByClassName('QuestionHeader')[0];
        questionHeader.parentNode.removeChild(questionHeader);
        var questionHeaderTitle = document.getElementsByClassName('Sticky AppHeader')[0];
        questionHeaderTitle.parentNode.removeChild(questionHeaderTitle);
        var zoom = window.innerWidth / window.outerWidth;
        var userAgent = navigator.userAgent;
        if(userAgent.indexOf("Firefox") > -1){
            document.body.style.fontSize = 15 * zoom +'px';
        }else{
            document.body.style.zoom = zoom;
            document.body.style.fontSize = 15 * (1 / zoom) +'px';
        }

        var shareButtons = document.getElementsByClassName('Popover ShareMenu ContentItem-action');
        for (const shareButton of shareButtons) {
            shareButton.parentNode.removeChild(shareButton);
        }
        var heartButtons = document.getElementsByClassName('Zi--Heart');
        for (const heartButton of heartButtons) {
            heartButton.parentNode.parentNode.parentNode.removeChild(heartButton.parentNode.parentNode);
        }
        var starButtons = document.getElementsByClassName('Zi--Star');
        for (const starButton of starButtons) {
            starButton.parentNode.parentNode.parentNode.removeChild(starButton.parentNode.parentNode);
        }

        setTimeout(function(){
            var buttonBar = document.getElementsByClassName('ContentItem-actions Sticky RichContent-actions is-fixed is-bottom')[0];
            if(buttonBar!==undefined){
                var shareButton = buttonBar.getElementsByClassName('Popover ShareMenu ContentItem-action')[0];
                if(shareButton!==undefined){
                    shareButton.parentNode.removeChild(shareButton);
                }
                var heartButton = document.getElementsByClassName('Zi--Heart')[0];
                if(heartButton!==undefined){
                    heartButton.parentNode.parentNode.parentNode.removeChild(heartButton.parentNode.parentNode);
                }
                var starButton = document.getElementsByClassName('Zi--Star')[0];
                if(starButton!==undefined){
                    starButton.parentNode.parentNode.parentNode.removeChild(starButton.parentNode.parentNode);
                }
            }
        },1000);

        window.onscroll = function(){
            var buttonBar = document.getElementsByClassName('ContentItem-actions Sticky RichContent-actions is-fixed is-bottom')[0];
            if(buttonBar!==undefined){
                var shareButton = buttonBar.getElementsByClassName('Popover ShareMenu ContentItem-action')[0];
                if(shareButton!==undefined){
                    shareButton.parentNode.removeChild(shareButton);
                }
                var heartButton = document.getElementsByClassName('Zi--Heart')[0];
                if(heartButton!==undefined){
                    heartButton.parentNode.parentNode.parentNode.removeChild(heartButton.parentNode.parentNode);
                }
                var starButton = document.getElementsByClassName('Zi--Star')[0];
                if(starButton!==undefined){
                    starButton.parentNode.parentNode.parentNode.removeChild(starButton.parentNode.parentNode);
                }
            }

            var shareButtons = document.getElementsByClassName('Popover ShareMenu ContentItem-action');
            for (const shareButton of shareButtons) {
                shareButton.parentNode.removeChild(shareButton);
            }
            var heartButtons = document.getElementsByClassName('Zi--Heart');
            for (const heartButton of heartButtons) {
                heartButton.parentNode.parentNode.parentNode.removeChild(heartButton.parentNode.parentNode);
            }   
            var starButtons = document.getElementsByClassName('Zi--Star');
            for (const starButton of starButtons) {
                starButton.parentNode.parentNode.parentNode.removeChild(starButton.parentNode.parentNode);
            }  
        }
        
    }); 
})();
