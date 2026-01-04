// ==UserScript==
// @name         Rule34 JumpTo
// @namespace    http://tampermonkey.net/
// @version      1.0.2
// @description  fix rule34 button of jump to
// @author       You
// @match        https://rule34video.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=rule34video.com
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/494241/Rule34%20JumpTo.user.js
// @updateURL https://update.greasyfork.org/scripts/494241/Rule34%20JumpTo.meta.js
// ==/UserScript==


(function () {
    'use strict';

    // 循环检测
    load_page()

    function load_page() {
        setTimeout(() => {
            // 寻找JumpTo按钮
            let item_jump_to = document.getElementsByClassName("item jump_to")[0]
            // 检查按钮标签是否正常
            let jump_to_page_num = document.getElementById("jumpTo").value
            
            // 获取按钮子项
            let jump_to_button = item_jump_to.childNodes[5]
            // 获取跳转页码
            let jump_to_button_parameters = jump_to_button.getAttribute("data-parameters")

            // 跳转页码检查
            let parameters = jump_to_button_parameters.split(":")
            // 设置跳转页码
            parameters[parameters.length - 1] = jump_to_page_num
            parameters = parameters.join(":")
            jump_to_button.setAttribute("data-parameters", parameters)

            load_page()
        }, 200)
    }


})();