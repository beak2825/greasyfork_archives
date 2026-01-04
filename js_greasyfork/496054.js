// ==UserScript==
// @name         小叽资源自动填写密码
// @namespace    http://tampermonkey.net/
// @version      2024-05-25
// @description  自动填写小叽资源网站的密码
// @author       kakasearch
// @match        https://acgxj.com/XJ*
// @match        https://91bpw.com/XJ*
// @match        https://acfb.top/XJ*
// @match        https://acgxj.com/xj*
// @match        https://91bpw.com/xj*
// @match        https://acfb.top/xj*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=acgxj.com
// @grant        none
// @license      MIT
// @run-at       document-end
// @downloadURL https://update.greasyfork.org/scripts/496054/%E5%B0%8F%E5%8F%BD%E8%B5%84%E6%BA%90%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/496054/%E5%B0%8F%E5%8F%BD%E8%B5%84%E6%BA%90%E8%87%AA%E5%8A%A8%E5%A1%AB%E5%86%99%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let content = null
    if(/acgxj/.test(window.location.href)){
       content = document.querySelector(".kratos-post-content").innerText
    }else if(/91bpw/.test(window.location.href)){
       content = document.querySelector(".post-countent-data").innerText
    }else{
       content = document.querySelector("#lightgallery").innerText
    }
    let password = /\d+/.test(content)?/\d+/.exec(content)[0] :""
    let password_input = document.querySelector("form.post-password-form").querySelector("input")
    password_input.type = ""
    password_input.value = password
    // Your code here...
})();