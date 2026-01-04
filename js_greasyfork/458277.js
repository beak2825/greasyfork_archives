// ==UserScript==
// @name         机场注册
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  用于一键注册并登录
// @author       You
// @match        https://msclm.xyz/*
// @match        https://www.wuyuandianpu.com/*
// @icon         🐱
// @grant        GM_addStyle
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/458277/%E6%9C%BA%E5%9C%BA%E6%B3%A8%E5%86%8C.user.js
// @updateURL https://update.greasyfork.org/scripts/458277/%E6%9C%BA%E5%9C%BA%E6%B3%A8%E5%86%8C.meta.js
// ==/UserScript==

let email = random(7) + '@qq.com'
let password = random(8)

// 生成账号密码
function random(n) {
    let str = ''

    for(let i = 1; i<= n; i++) {
        str += Math.floor(Math.random() * 10)
    }

    return str
}

// 生成按钮样式
function addStyle() {

    let css = `

    .login_btn {
      position: absolute;
      top: 20px;
      right: 20px;
      width: 200px;
      height: 50px;
      border-radius: 10px;
      border: 3px solid rgb(217, 217, 217);
      font-size: 24px;
      line-height: 45px;
      text-align: center;
      color:rgb(141, 141, 141)
    }
    `

    GM_addStyle(css)

}

// 生成按钮并填写表单
function addHtml() {
    const root = document.getElementById('root')
    const btn = document.createElement('div')
    btn.innerHTML = '<div class="login_btn" click="createForm">登&nbsp;&nbsp;&nbsp;录</div>'
    btn.addEventListener("click", function() {

        document.querySelectorAll("input")[0].value = email
        document.querySelectorAll("input")[1].value = password
        document.querySelectorAll("input")[2].value = password

        document.querySelector("button").click()

        setTimeout(() => {
          login()
        }, 3000)
    })
    root.appendChild(btn)
}

function login() {
  const form = document.querySelectorAll("input")
  form[0].value = email
  form[1].value = password
  document.querySelector("button").click()
}

(function () {
    addStyle()
    addHtml()

})();

