// ==UserScript==
// @name         Auto Through
// @namespace    AT_Marx
// @version      0.1
// @description  某个插件的自动翻页，时间默认3秒
// @author       marx
// @match       https://exhentai.org/s/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/374460/Auto%20Through.user.js
// @updateURL https://update.greasyfork.org/scripts/374460/Auto%20Through.meta.js
// ==/UserScript==
var state = false;
var clicker;

function click() {

    var list = document.getElementsByClassName("item");
    var next = list[list.length - 1];
    var albums = document.getElementsByClassName("album-item");
    console.log(albums[1].complete+"---"+albums[2].complete)
        if (albums[1].complete===false|| albums[2].complete===false) {
            return;
        }

    next.click();
}

window.onkeydown = function(event) {
    var e = event;
    if (e && e.keyCode == 13) { // 按 enter
        console.log(state);
        if (state === true) {
console.log("结束");
            state=false;
            window.clearInterval(clicker);
        } else {
            state = true;
            console.log("开始");
            clicker = self.setInterval(function() {
                click();
            },
            3000);
        }

    }

};