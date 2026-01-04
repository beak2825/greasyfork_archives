// ==UserScript==
// @name        去除深大公文通的水印
// @namespace   https://www1.szu.edu.cn/board/
// @match       *://www1.szu.edu.cn/board/view.asp?*
// @match       *://www1-443.webvpn.szu.edu.cn/board/view.asp?*
// @grant       none
// @version     1.1.12
// @description  去除垃圾水印
// @author      jin
// @description 2022/11/15 10:40:26
// @license MIT
// @noframes

// @downloadURL https://update.greasyfork.org/scripts/454840/%E5%8E%BB%E9%99%A4%E6%B7%B1%E5%A4%A7%E5%85%AC%E6%96%87%E9%80%9A%E7%9A%84%E6%B0%B4%E5%8D%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/454840/%E5%8E%BB%E9%99%A4%E6%B7%B1%E5%A4%A7%E5%85%AC%E6%96%87%E9%80%9A%E7%9A%84%E6%B0%B4%E5%8D%B0.meta.js
// ==/UserScript==

(function() {
    let b = window.onload
    // 如果不想要水印，直接使用
    // window.onload = null
    window.onload = function () {
        b();
        let pp=document.querySelectorAll('.mark_div');
        pp.forEach(a => {
          a.setHTML("马化腾");
      })
    }
    let ops = []
    ops.push(document.querySelector("font.fontcolor1"));
    ops.push(document.querySelector('tr:nth-child(2) font:nth-child(3)'));
    ops.push(document.querySelector('tr:nth-child(2) font:nth-child(3)'));
    ops.push(document.querySelector("#bodyBoard > table > tbody > tr:nth-child(1) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr > td:nth-child(1) > a:nth-child(2) > font"));

    ops.forEach(a => {
        if (a != null)
          a.setHTML("看什么看，一边玩去  ");
    })


    let a = document.querySelector("#bodyBoard > table > tbody > tr:nth-child(2) > td > table > tbody > tr:nth-child(3) > td > table > tbody > tr:nth-child(1) > td > font")
    a.setHTML("【本文属内部通告，请安装脚本后再到处转发】　　　　　　　　　　")
})();

