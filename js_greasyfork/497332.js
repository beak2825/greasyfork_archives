// ==UserScript==
// @name         一键获取网站Cookie脚本
// @namespace    http://tampermonkey.net/
// @version      24.0615.1200
// @description  用来自动获取用户设置的指定网站的Cookie
// @author       Yi-Zero

// @match        https://*/*

// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @require      https://unpkg.com/sweetalert/dist/sweetalert.min.js
// @downloadURL https://update.greasyfork.org/scripts/497332/%E4%B8%80%E9%94%AE%E8%8E%B7%E5%8F%96%E7%BD%91%E7%AB%99Cookie%E8%84%9A%E6%9C%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/497332/%E4%B8%80%E9%94%AE%E8%8E%B7%E5%8F%96%E7%BD%91%E7%AB%99Cookie%E8%84%9A%E6%9C%AC.meta.js
// ==/UserScript==

(function() {
    'use strict';

let Container = document.createElement('div');
Container.id = "sp-ac-container";
Container.style.position="fixed"
Container.style.left="-28px"
Container.style.top="500px"
Container.style['z-index']="999999"
Container.innerHTML =`<button id="myCustomize" style="width: 50px; height: 50px; border: none; background-color: #1795bb; color: #FFFFFF; border-radius:5px; position:absolute; left:30px; top:20px " >
  复制Cookie
</button>
`
document.body.appendChild(Container);

    // 按钮点击事件处理程序
    Container.addEventListener("click", function() {
        // 在这里添加按钮点击后的逻辑

    var cookies = document.cookie;
    //获取网站Cookie
    console.log("当前网站Cookies：", cookies);
    //控制台输出Cookie
    const text = cookies;
    navigator.clipboard
    .writeText(text)
    // 复制Cookie
    swal("本站Cookie已复制!", "", "success", {
    button: "确定",
    // 弹窗提示
   });

   });

})();