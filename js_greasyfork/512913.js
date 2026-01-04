// ==UserScript==
// @name         洛谷“问题跳转”样式优化
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  更改洛谷主页“问题跳转”框内按钮样式
// @author       Jerrycyx
// @homepage     https://www.luogu.com.cn/user/545986
// @match        https://www.luogu.com.cn/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=luogu.com.cn
// @grant        none
// @license      MPL-2.0
// @downloadURL https://update.greasyfork.org/scripts/512913/%E6%B4%9B%E8%B0%B7%E2%80%9C%E9%97%AE%E9%A2%98%E8%B7%B3%E8%BD%AC%E2%80%9D%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.user.js
// @updateURL https://update.greasyfork.org/scripts/512913/%E6%B4%9B%E8%B0%B7%E2%80%9C%E9%97%AE%E9%A2%98%E8%B7%B3%E8%BD%AC%E2%80%9D%E6%A0%B7%E5%BC%8F%E4%BC%98%E5%8C%96.meta.js
// ==/UserScript==

(function() {
    var intervalId = window.setInterval(function() {
        if (document.readyState === "complete") {

            clearInterval(intervalId);
            var input_group = document.querySelector(".am-input-group");
            var jump_btn = document.getElementsByName("goto")[0];
            input_group.appendChild(jump_btn);
            var input_field = document.getElementsByClassName("am-form-field")[0];
            input_group.style.whiteSpace = "nowrap";
            input_field.style.width = "82.7565%";
            jump_btn.innerHTML = "<svg data-v-1ad550c8=\"\" data-v-0640126c=\"\" aria-hidden=\"true\" focusable=\"false\" data-prefix=\"fas\" data-icon=\"magnifying-glass\" role=\"img\" xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 512 512\" class=\"svg-inline--fa fa-magnifying-glass\"><path data-v-1ad550c8=\"\" data-v-0640126c=\"\" fill=\"currentColor\" d=\"M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z\" class=\"\"></path></svg>";
            jump_btn.style.marginLeft = "2%";
            jump_btn.style.padding = "8px 10px";

        }
    }, 100);
    // Your code here...
})();