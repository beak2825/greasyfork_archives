// ==UserScript==
// @name         知乎小工具
// @namespace    greasyfork.org
// @version      0.1
// @description  知乎标题自由隐藏与显示
// @author       codrwu
// @include      https://www.zhihu.com/question/*
// @icon         https://static.zhihu.com/static/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/377791/%E7%9F%A5%E4%B9%8E%E5%B0%8F%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/377791/%E7%9F%A5%E4%B9%8E%E5%B0%8F%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

(function() {
    'use strict';
    document.getElementsByClassName("QuestionHeader-title")[0].setAttribute("hidden","true");
    var button = document.createElement("input");
    button.setAttribute("type", "button");
    button.setAttribute("value", "显示标题");
    button.setAttribute("class", "Button FollowButton Button--primary Button--blue");
    button.addEventListener('click', function() {
        if(document.getElementsByClassName("QuestionHeader-title")[0].getAttribute("hidden")){
            document.getElementsByClassName("QuestionHeader-title")[0].removeAttribute("hidden");
            button.setAttribute("value", "隐藏标题");
        }else{
            document.getElementsByClassName("QuestionHeader-title")[0].setAttribute("hidden","true");
            button.setAttribute("value", "显示标题");
        }
    });
    var x = document.getElementsByClassName("QuestionHeader-content");
    x[0].appendChild(button);
})();