// ==UserScript==
// @name         慧学君键盘支持
// @namespace    https://github.com/Fbk-waifu
// @version      1.1
// @description  使慧学君网页版答题时支持使用键盘选择和翻页，自动记录题目图片位置，禁止清空控制台
// @author       冰糖的电子宠物
// @match        https://s.huixuejun.com/Lessons/AnswerObj?*
// @icon         https://i0.hdslb.com/bfs/face/878fc9689016279171d63d10e01e1cdd2754679c.jpg@240w_240h_1c_1s.webp
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/443593/%E6%85%A7%E5%AD%A6%E5%90%9B%E9%94%AE%E7%9B%98%E6%94%AF%E6%8C%81.user.js
// @updateURL https://update.greasyfork.org/scripts/443593/%E6%85%A7%E5%AD%A6%E5%90%9B%E9%94%AE%E7%9B%98%E6%94%AF%E6%8C%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
var scrollTopPosition;
window.onload = function () {
    console.clear = function () {
        return 0;
    };
    console.info = function () {
        return 0;
    };
    init();
}

function accessToThePage() {    //获取当前页面页数
    var getpage = document.getElementById("now-page").innerText;
    return getpage;
}

function giveId() { //对对应页面的元素赋ID
    var page = accessToThePage();
    var i = 0, theTargetID;
    while (document.getElementsByClassName("col-xs-12 question-page")[page - 1].getElementsByClassName("zimu-btn ")[i] !== undefined) {
        theTargetID = document.getElementsByClassName("col-xs-12 question-page")[page - 1].getElementsByClassName("zimu-btn ")[i].innerText + page;
        document.getElementsByClassName("col-xs-12 question-page")[page - 1].getElementsByClassName("zimu-btn ")[i].setAttribute("id", theTargetID);
        i++;
    }
    while (document.getElementsByClassName("col-xs-12 question-page")[page - 1].getElementsByClassName("zimu-btn-dx ")[i] !== undefined) {
        theTargetID = document.getElementsByClassName("col-xs-12 question-page")[page - 1].getElementsByClassName("zimu-btn-dx ")[i].innerText + page;
        document.getElementsByClassName("col-xs-12 question-page")[page - 1].getElementsByClassName("zimu-btn-dx ")[i].setAttribute("id", theTargetID);
        i++;
    }
}

function init() {
    giveId();
    var theCurrentPage = 0;
    setInterval(function () {
        if (theCurrentPage !== accessToThePage()) {
            document.getElementsByClassName("col-xs-12 qbody_img scroll_content")[accessToThePage() - 1].scrollTop = scrollTopPosition;
            theCurrentPage = accessToThePage();
            giveId();
        }
        scrollTopPosition = document.getElementsByClassName("col-xs-12 qbody_img scroll_content")[accessToThePage() - 1].scrollTop //获取题目位置
    }, 5000);
    document.onkeydown = function (event) {
        var e = event || arguments.callee.caller.arguments[0];
        if (e.key == 'Enter') {
            document.getElementById("next").click();
        }
        if (e.key == '`') {
            document.getElementById("prev").click();
        }
        document.getElementById(e.key + theCurrentPage).click();

    }
}
})();