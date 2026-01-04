// ==UserScript==
// @name         Abc 系统自动登录
// @description  登录
// @namespace    http://abczzs.cn
// @version      1.0.1
// @author       You
// @match        *global-dev.abczs.cn/login/password*
// @match        *global.abcyun.cn/login/password*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=tampermonkey.net
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/493667/Abc%20%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.user.js
// @updateURL https://update.greasyfork.org/scripts/493667/Abc%20%E7%B3%BB%E7%BB%9F%E8%87%AA%E5%8A%A8%E7%99%BB%E5%BD%95.meta.js
// ==/UserScript==

// 创建提示框
function tipsMessage() {
    const tipsDiv = document.createElement('div')
    tipsDiv.innerText = ''
    tipsDiv.setAttribute('style', 'width: 100%; text-align: center; margin-top: -10px; color: red')
    return tipsDiv
}

// 填充表单, 此处设置账号密码
function fillInfo(openId = '', username = '17709012412', password = 'asdf654852') {
    document.querySelectorAll('input').forEach((item, index) => {
        item.value = [openId, username, password][index]
        item.dispatchEvent(new InputEvent('input', { bubbles : true, cancelable: true }))
    })
}

setTimeout(() => {
    const tipsDiv = tipsMessage()
    document.querySelector('.wechat-login-wrapper').appendChild(tipsDiv)
    const btnElement = document.querySelector('button')
    navigator.clipboard.readText().then(value => {
        tipsDiv.innerText = '自动获取openid中...'
        setTimeout(() => {
            // 开发环境使用固定 openid
            if (location.href.indexOf('dev.abczs') !== -1) {
                btnElement.textContent = '自动登录中...'
                fillInfo('1')
                btnElement.click()
            } else {
                // 正式环境从剪切板获取 openId，并判断 openId 是否合法
                if ((value.trim().length === 28 && /^[\0-9A-Za-z_]+$/i.test(value))|| value.trim().length === 11 && /^[\0-9]+$/i.test(value)) {
                    // 合法直接登录
                    tipsDiv.innerText = ''
                    btnElement.textContent = '自动登录中...'
                    fillInfo(value.trim())
                    btnElement.click()
                } else {
                    // 不合法只填充部分信息
                    tipsDiv.innerText = '未识别到有效openid，请手动填写!'
                    fillInfo()
                }
            }
        }, 500)
    }).catch(err => {
        if (String(err).indexOf('Read permission denied') !== -1) {
            tipsDiv.innerText = '请打开浏览器获取剪切板权限!'
            fillInfo()
        }
    })
}, 1000)
