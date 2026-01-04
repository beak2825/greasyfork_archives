// ==UserScript==
// @name         docker-ui（fast os docker）调整
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  自动登录、去除页头页尾
// @author       hlmio
// @match        http://127.0.0.1:8081/pc/
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/418901/docker-ui%EF%BC%88fast%20os%20docker%EF%BC%89%E8%B0%83%E6%95%B4.user.js
// @updateURL https://update.greasyfork.org/scripts/418901/docker-ui%EF%BC%88fast%20os%20docker%EF%BC%89%E8%B0%83%E6%95%B4.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // Your code here...
    // 配置变量
    var 用户名 = "admin"
    var 密码 = "888888"

    // 删除主界面的页头和页尾
    document.querySelector("#app > section > section > header").remove()
    document.querySelector("#app > section > section > main > div.footer > p").remove()

    // 如果是登录页，就尝试自动登录
    setTimeout(function(){
        let name = document.querySelector("#app > section > section > main > div.main.clearfix > div > div > div > p:nth-child(3) > input[type=text]")
        let pass = document.querySelector("#app > section > section > main > div.main.clearfix > div > div > div > p:nth-child(5) > input[type=password]")
        let login = document.querySelector("#app > section > section > main > div.main.clearfix > div > div > div > p.submit > button")
        if(name && pass){
            name.value = 用户名
            name.dispatchEvent(new Event('input'))
            pass.value = 密码
            pass.dispatchEvent(new Event('input'))
            login.click()
        }
    }, 1000);

})();