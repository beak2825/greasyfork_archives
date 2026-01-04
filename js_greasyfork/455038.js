// ==UserScript==
// @name         吾爱破解论坛助手
// @namespace
// @icon         https://avatar.52pojie.cn/images/noavatar_small.gif
// @version      1.04
// @description  移除广告、精简页面、后台自动签到、验证问答自动填充
// @author       test
// @match        https://www.52pojie.cn/*
// @license      MIT
// @grant        GM_addStyle
// @namespace https://greasyfork.org/users/984773
// @downloadURL https://update.greasyfork.org/scripts/455038/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/455038/%E5%90%BE%E7%88%B1%E7%A0%B4%E8%A7%A3%E8%AE%BA%E5%9D%9B%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

;(function () {
    'use strict'
    runjs1()
    runjs2()
    runjs3()
})()

function runjs1() {
    const css = `
    /* 页面背景 */
    body{ background: none !important }

    /* 顶部工具条 */
    #toptb{ display: none !important; }

    /* 版规 */
    .bml{ display: none; }

    /* 帖内广告：水平 + 竖直 */
    .dnch_eo_pt, .dnch_eo_pr{ display: none !important; }

    /* 用户签名 + 签名下的提示 */
    .sign, .dnch_eo_pb{ display: none !important; }

    /* 底部免责声明 */
    .res-footer-note{ display: none !important; }

    /* 底部广告 */
    .dnch_eo_f{ display: none !important; }

    /* 菜单广告 */
    .dnch_eo_mu{display: none !important;}

    /* 回帖框背景图 */
    #f_pst #fastpostmessage{ background: none !important }

  `
    try {
        GM_addStyle(css)
    } catch (e) {
        console.log('脚本失效，刷新后重试。', e)
    }
}
function runjs2() {
    function saveDate() {
        localStorage.setItem('autoSign', new Date().toDateString())
    }
    function isTody() {
        var lastSignDate = localStorage.getItem('autoSign')
        if (lastSignDate) {
            return new Date(lastSignDate).toDateString() === new Date().toDateString()
        } else {
            return false
        }
    }

    function bSign() {
        return new Promise(function (resolve, reject) {
            var f = document.createElement('iframe')
            // f.style="width:1000px;height:500px;display: none;outline: none;"
            f.src = '/home.php?mod=task&do=apply&id=2&referer=%2Fforum.php'
            f.style = 'width:1000px;height:500px;'
            f.onload = function (e) {
                var u = e.path[0].contentWindow.location.search
                var c = f.contentWindow.document.body.textContent
                if (u.indexOf(s.p) >= 0) {
                    if (c.indexOf(s.n) > 0) {
                    } else {
                        f.remove()
                        resolve(c)
                    }
                }
            }
            document.body.append(f)
        })
    }

    let s = {
        a: '正在自动签到...',
        b: '本期您已申请过此任务',
        c: '您已经签到了!',
        d: '任务已完成',
        f: '签到成功!',
        g: '签到失败!',
        h: '<img src="https://static.52pojie.cn/static/image/common/wbs.png" class="qq_bind" align="absmiddle" alt="">',
        i: '自动签到中..',
        j: '#hd .wp #um p > a > img[src*="qds.png"]',
        k: 'home.php?mod=task&do=apply&id=2',
        l: 'home.php?mod=task&do=draw&id=2',
        m: '403 Forbidden',
        n: '请开启JavaScript并刷新该页',
        o: 0,
        p: '?mod=task&do=draw',
        q: '?mod=task&do=apply',
    }
    function autoSign(num) {
        if (!isTody()) {
            let a = document.querySelector(s.j)
            if (s.o || a) {
                s.o = 1
                a = a.parentNode
                a.text = s.i
                try {
                    var x = new Ajax()
                } catch (e) {
                    if (!num || num < 2) {
                        setTimeout(function () {
                            autoSign(num + 1)
                        }, 2000)
                    }
                    return
                }
                console.log(s.a)
                bSign().then(function (res) {
                    if (res.indexOf(s.b) > 0) {
                        console.log(s.c)
                        saveDate()
                        a.outerHTML = s.h
                    } else if (res.indexOf(s.d) > 0) {
                        console.log(s.f)
                        saveDate()
                        a.outerHTML = s.h
                    } else if (res.indexOf(s.m) > 0 || res.indexOf(s.n) > 0) {
                        autoSign(0)
                    } else {
                        console.log(s.g)
                    }
                })
            }
        }
    }
    autoSign(0)
}
function runjs3() {
    //验证问答自动填充
    let times = 0
    const intervalFn = setInterval(() => {
        const tipObj = document.getElementById('seccodeqS0_menu')
        const inputObj = document.getElementById('secqaaverify_qS0')
        if (tipObj && inputObj) {
            inputObj.value = tipObj.innerHTML.split('答案：')[1]
            clearInterval(intervalFn)
        }
        times++
        if (times >= 5) clearInterval(intervalFn)
    }, 1000)
}
