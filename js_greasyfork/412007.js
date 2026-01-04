// ==UserScript==
// @name         mooc半自动互评
// @version      1.1.1
// @description  互评自动填写分数及评语
// @author       Ocellus
// @match        *://www.icourse163.org/learn/*
// @match        *://www.icourse163.org/spoc/learn/*
// @grant        none
// @namespace https://greasyfork.org/users/690569
// @downloadURL https://update.greasyfork.org/scripts/412007/mooc%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%BA%92%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/412007/mooc%E5%8D%8A%E8%87%AA%E5%8A%A8%E4%BA%92%E8%AF%84.meta.js
// ==/UserScript==

(function() {
    var style = document.createElement("style");
    style.type = "text/css";
    try {　　style.appendChild(document.createTextNode(".j-submitbtn{width:10%;height:5%;transition-duration: 0.25s;left:45%;bottom:-3.2%;background:E3E3E3;} .j-submitbtn:hover{width:10%;height:10%;transition-duration: 0.25s;left:45%;bottom:0%;}"));
        } catch (ex) {　　style.styleSheet.cssText = ".j-submitbtn{width:10%;height:5%;transition-duration: 0.25s;left:45%;bottom:-3.2%;background:E3E3E3;} .j-submitbtn:hover{width:10%;height:10%;transition-duration: 0.25s;left:45%;bottom:0%;}";  }
    var head = document.getElementsByTagName("head")[0];
    head.appendChild(style);
    var body = document.getElementsByClassName("m-learnhead")[0];
    var button = document.createElement("button");
    button.innerHTML = "自动评分";
    button.className = "u-btn u-btn-default f-fl j-submitbtn";
    button.style.cssText = "{}"
    button.style.position = "fixed";
    button.style.zIndex = "50";
    body.appendChild(button);
    button.onclick = function() {
        var 题目数 = document.getElementsByClassName("s").length;
        var 选项数 = document.getElementsByClassName("j-select").length;
        var 评语数 = document.getElementsByClassName("inputtxt").length;
        var 预定义评语 = ["好！", "666", "很好", "没问题", "对"];
        for (var 当前题目 = 0;当前题目 < 题目数;当前题目++) {
            var 当前选项数 = document.getElementsByClassName("s")[当前题目].getElementsByClassName("j-select").length;
            document.getElementsByClassName("s")[当前题目].getElementsByClassName("j-select")[当前选项数 - 1].checked = true;
            document.getElementsByClassName("inputtxt")[当前题目 + 1].value = 预定义评语 [Math.floor(Math.random() * 5)];
        }
        document.documentElement.scrollTop = document.getElementById("g-container").scrollHeight;
    };
})();