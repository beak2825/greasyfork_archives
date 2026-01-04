// ==UserScript==
// @name 设置coze的对话框大一点1
// @name:zh-CN 设置coze的对话框大一点2
// @description This script even does the laundry!
// @match https://www.coze.com/space/*/bot/*
// @version 0.0.1.20240202031441
// @namespace https://greasyfork.org/users/1256247
// @downloadURL https://update.greasyfork.org/scripts/486269/%E8%AE%BE%E7%BD%AEcoze%E7%9A%84%E5%AF%B9%E8%AF%9D%E6%A1%86%E5%A4%A7%E4%B8%80%E7%82%B91.user.js
// @updateURL https://update.greasyfork.org/scripts/486269/%E8%AE%BE%E7%BD%AEcoze%E7%9A%84%E5%AF%B9%E8%AF%9D%E6%A1%86%E5%A4%A7%E4%B8%80%E7%82%B91.meta.js
// ==/UserScript==

window.onload = function () {
    let myInterval = setInterval(function () {
        let con = document.getElementsByClassName('sidesheet-container')[0];
        if (!!con) {
            let myChildren = con.children[1];
            if (!!myChildren) {
                clearInterval(myInterval)
                con.children[1].remove()
                con.style= "grid-template-columns: 1fr 3.5fr;"
                document.body.style.minWidth = '1000px'
                document.documentElement.style.minWidth = '1000px'
            }
        }
    },100)
}
