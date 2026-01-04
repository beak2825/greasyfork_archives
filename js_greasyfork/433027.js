// ==UserScript==
// @name         中软云课堂考试
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  解除必须全屏，解除遮挡，解除禁止复制粘贴，暂缓提交
// @author       lty123
// @match        https://www.zretc.net/classrooms/*
// @icon         https://gimg2.baidu.com/image_search/src=http%3A%2F%2F5b0988e595225.cdn.sohucs.com%2Fimages%2F20170816%2Fd5de1670fb8f41e8be5dd70e246b2844.jpeg&refer=http%3A%2F%2F5b0988e595225.cdn.sohucs.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1634743766&t=4697c288de05aad43552a35442042a6a
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/433027/%E4%B8%AD%E8%BD%AF%E4%BA%91%E8%AF%BE%E5%A0%82%E8%80%83%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/433027/%E4%B8%AD%E8%BD%AF%E4%BA%91%E8%AF%BE%E5%A0%82%E8%80%83%E8%AF%95.meta.js
// ==/UserScript==

(function () {
    $(".limit_page").hide();
    $(".mask_ques_box").css("background-color", "transparent");
    setTimeout(() => {
        clearInterval(6);
        clearInterval(7);
        clearInterval(8);
        clearInterval(9);
        clearInterval(10);
        clearInterval(11);
        clearInterval(12);
    }, 2000);
    const events = ['beforecopy', 'contextmenu', 'copy', 'cut', 'dragstart', 'select', 'selectstart'];
    for (let event of events) {
       window.addEventListener(event, e => e.stopImmediatePropagation(), true);
    }



})();