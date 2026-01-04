// ==UserScript==
// @name         关闭宝塔离线弹窗错误
// @license      MIT
// @version      0.1
// @description  1111
// @author       111
// @match        http://192.215.140.41:8808/*
// @grant        111
// @namespace https://greasyfork.org/users/416601
// @downloadURL https://update.greasyfork.org/scripts/445904/%E5%85%B3%E9%97%AD%E5%AE%9D%E5%A1%94%E7%A6%BB%E7%BA%BF%E5%BC%B9%E7%AA%97%E9%94%99%E8%AF%AF.user.js
// @updateURL https://update.greasyfork.org/scripts/445904/%E5%85%B3%E9%97%AD%E5%AE%9D%E5%A1%94%E7%A6%BB%E7%BA%BF%E5%BC%B9%E7%AA%97%E9%94%99%E8%AF%AF.meta.js
// ==/UserScript==

(function() {
    'use strict';
    function removeDialog(shader, dialog) {

    shader.style.display = 'none'
    dialog.style.display = 'none'

    console.log(dialog.style.display)
    console.log(shader.style.display)
}


function checkDialog() {
    let shader = document.getElementsByClassName("layui-layer-shade")[0]
    let dialog = document.getElementsByClassName("layui-layer layui-layer-dialog  layer-anim")[0]

    if (shader && dialog) {
        console.log("出现，直接删除")
        removeDialog(shader, dialog)

        return true
    } else {
        return false;
    }
}

let count = 3


let timer = setInterval(() => {
    if (count > 0 ) {
        console.log("检查一次:"+checkDialog())
    } else {

        console.log("结束")
        clearInterval(timer)
    }
    count--
}, 200)

})();