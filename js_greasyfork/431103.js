// ==UserScript==
// @name        MonkeyForDesigner
// @namespace   MonkeyForDesigner
// @match       https://e-cscec.zhixueyun.com/
// @grant       none
// @version     1.1
// @author      -
// @description  用于中建信和学堂党课自动挂机
// @downloadURL https://update.greasyfork.org/scripts/431103/MonkeyForDesigner.user.js
// @updateURL https://update.greasyfork.org/scripts/431103/MonkeyForDesigner.meta.js
// ==/UserScript==
(function() {
    'use strict';
    console.log("Start.");
    setTimeout(checkbtm, 5000);
})();

function checkbtm() {
    var a = 1;
    console.log("conntinue");
    var next_btm = document.getElementById("D212btn-ok");
    var end_btm = document.getElementById("D211anewStudy");

    if (next_btm) {
        next_btm.click();
        console.log("Get btm and clicked.");
    }
    if (end_btm) {
        if (a === 1) {
            alert("Done!");
            console.log("Done!");
            a--;
        } else {
            console.log("Something Wrong!");
        }
    }
    setTimeout(checkbtm, 1000);
}