// ==UserScript==
// @name         bilibiliLiveSign
// @namespace    https://iconquestion.github.io/
// @version      0.72
// @description  Automatically finish daily sign-up task at bilibili livestreaming website.
// @author       ICONQUESTION
// @match        https://t.bilibili.com/*
// @icon         https://bilibili.com/favicon.ico
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/456848/bilibiliLiveSign.user.js
// @updateURL https://update.greasyfork.org/scripts/456848/bilibiliLiveSign.meta.js
// ==/UserScript==

//为了提高执行效率，本例中不再检测用户是否已经登录。
window.onload = function () {
    //1.检查用户是否已经签到
    fetch('https://api.live.bilibili.com/xlive/web-ucenter/v1/sign/WebGetSignInfo', {
        credentials: 'include'
    }).then(function (res) {
        return res.headers.get('Content-Type').search('application/json') != -1 ? res.json() : -1
    }).then(function (data) {
        //console.log(data)
        if (data == -1 || !data || !data.data) {
            console.log('checkSign() fetch 返回数据异常。')
            return
        }

        //如果未签到，进行签到
        //其实请求签到本身也可以用来检查是否签到，但为了降低多次请求导致被B站检测的风险，本例仍然使用B站官方的API请求方式。
        if (!data.data.status) {
            console.log('正在签到')
            fetch('https://api.live.bilibili.com/xlive/web-ucenter/v1/sign/DoSign', {
                credentials: 'include',
            }).then(function (res) {
                return res.headers.get('Content-Type').search('application/json') != -1 ? res.json() : -1
            }).then(function (data) {
                //console.log(data)
                if (data == -1) {
                    console.log('doSign() fetch 返回数据异常。')
                    return
                }

                console.log(data.data ? data.data.text + '\n' + data.data.specialText : data.message)
            })
        } else {
            console.log('今日已经签到！')
        }
    })
}