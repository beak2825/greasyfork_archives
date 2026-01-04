// ==UserScript==
// @name         广城理自动化教评
// @version      0.3
// @description  教务系统自动教师评测，解放双手
// @author       BananaB0Y
// @match        https://jwc-jwxt.gcu.edu.cn/*
// @icon         http://lweilve.top/%E9%A6%99%E8%95%89.png
// @grant        none
// @require    http://code.jquery.com/jquery-2.1.1.min.js
// @namespace lweilve.top
// @downloadURL https://update.greasyfork.org/scripts/437271/%E5%B9%BF%E5%9F%8E%E7%90%86%E8%87%AA%E5%8A%A8%E5%8C%96%E6%95%99%E8%AF%84.user.js
// @updateURL https://update.greasyfork.org/scripts/437271/%E5%B9%BF%E5%9F%8E%E7%90%86%E8%87%AA%E5%8A%A8%E5%8C%96%E6%95%99%E8%AF%84.meta.js
// ==/UserScript==

$(document).ready(function () {
   let rowDoms = document.getElementsByClassName("ui-row-ltr");
    let selDoms = document.getElementsByClassName("ui-pg-selbox");
    selDoms[0][4].selected = true;
    selDoms[0].dispatchEvent(new Event("change"));
    for (let index = 0; index <= rowDoms.length; index++) {
        (function (index) {
            setTimeout(() => {
                checkAll();
                rowDoms[index + 1].click();
            }, index * 1000);
        })(index);
    }
    function checkAll() {
        let xspjDOMs = document.getElementsByClassName("input-xspj-1");
        for (let index = 0; index < xspjDOMs.length; index++) {
            xspjDOMs[index].children[0].children[0].checked = true;
        }
        let btn = document.getElementById("btn_xspj_bc");
        const event = document.createEvent("MouseEvents");
        event.initEvent("mouseover", true, false);
        btn.dispatchEvent(event);
        document.getElementById("btn_xspj_bc").click();
        setTimeout(function () {
            document.getElementById("btn_ok").click();
        }, 200);
    }
});