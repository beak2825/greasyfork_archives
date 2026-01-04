// ==UserScript==
// @name         西华师范大学校园网自动登录脚本测试
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  西华师范大学 校园网 自动填写 账号密码 登录 简易版
// @author       weisili
// @match        http://1.1.1.3/*
// @match        http://172.16.100.3/*
// @match        https://dl.cwnu.edu.cn:444/*
// @match        *://dl.cwnu.edu.cn:444/*
// @exclude       *://*/homepage/index.html?_FLAG=1
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @license      MIT
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/476470/%E8%A5%BF%E5%8D%8E%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC%E6%B5%8B%E8%AF%95.user.js
// @updateURL https://update.greasyfork.org/scripts/476470/%E8%A5%BF%E5%8D%8E%E5%B8%88%E8%8C%83%E5%A4%A7%E5%AD%A6%E6%A0%A1%E5%9B%AD%E7%BD%91%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95%E8%84%9A%E6%9C%AC%E6%B5%8B%E8%AF%95.meta.js
// ==/UserScript==

(function(){
    const cwnuUsername= document.querySelector('#password_name')
    const cwnuPassword= document.querySelector('#password_pwd')
    if (localStorage.getItem('cwnuUsername') !== null && localStorage.getItem('cwnuPassword') !== null ) {
        cwnuUsername.value=localStorage.getItem('cwnuUsername')
        cwnuPassword.value=localStorage.getItem('cwnuPassword')
        document.querySelector('#password_submitBtn').click()
    }else {
        const username = prompt('请输入用户名或者学号')
        const password = prompt('请输入登录密码')
        localStorage.setItem('cwnuUsername',username)
        localStorage.setItem('cwnuPassword',password)
    }
    cwnuUsername.value=localStorage.getItem('cwnuUsername')
    cwnuPassword.value=localStorage.getItem('cwnuPassword')
    document.querySelector('#password_submitBtn').click()
})()